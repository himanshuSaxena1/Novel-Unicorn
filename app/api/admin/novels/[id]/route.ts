import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { error: "Novel ID is required" },
        { status: 400 }
      );
    }

    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const novel = await prisma.novel.findUnique({
      where: { id },
      select: {
        slug: true,
        title: true,
        id: true,
      },
    });

    if (!novel) {
      return NextResponse.json({ error: "Novel not found" }, { status: 404 });
    }

    const chapters = await prisma.chapter.findMany({
      where: { novelId: novel.id },
      select: {
        novel: {
          select: {
            title: true,
            slug: true,
          },
        },
        order: true,
        id: true,
        title: true,
        chapterPrice: true,
        isPublished: true,
        wordCount: true,
        createdAt: true,
        views: true,
        isLocked: true,
        priceCoins: true,
        slug: true,
      },
    });

    return NextResponse.json({ chapters, novel });
  } catch (error) {
    console.error("Error fetching novel:", error);
    return NextResponse.json(
      { error: "Failed to fetch novel" },
      { status: 500 }
    );
  }
}
