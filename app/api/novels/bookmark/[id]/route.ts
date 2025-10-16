import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import redis, { CACHE_KEYS } from "@/lib/redis";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const novel = await prisma.novel.findUnique({
      where: { id: params.id },
    });

    if (!novel) {
      return NextResponse.json({ error: "Novel not found" }, { status: 404 });
    }

    // Check if bookmark exists
    const existingBookmark = await prisma.bookmark.findUnique({
      where: {
        userId_novelId: {
          userId: session.user.id,
          novelId: novel.id,
        },
      },
    });

    let bookmarked: boolean;

    if (existingBookmark) {
      // Remove bookmark
      await prisma.bookmark.delete({
        where: { id: existingBookmark.id },
      });
      bookmarked = false;
    } else {
      // Add bookmark
      await prisma.bookmark.create({
        data: {
          userId: session.user.id,
          novelId: novel.id,
        },
      });
      bookmarked = true;
    }

    // Clear cache
    await redis.del(CACHE_KEYS.novel(novel.slug));

    return NextResponse.json({ success: true, bookmarked });
  } catch (error) {
    console.error("[BOOKMARK_TOGGLE_ERROR]", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
