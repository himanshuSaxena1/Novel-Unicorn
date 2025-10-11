import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import redis, { CACHE_KEYS } from "@/lib/redis";

export async function POST(
  req: Request,
  { params }: { params: { chapterId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    const { chapterId } = await params;

    const chapter = await prisma.chapter.findUnique({
      where: { id: chapterId },
      select: {
        isLocked: true,
        priceCoins: true,
        slug: true,
        novelId: true,
        novel: { select: { slug: true } },
      },
    });

    if (!chapter)
      return NextResponse.json({ error: "Chapter not found" }, { status: 404 });
    if (!chapter.isLocked)
      return NextResponse.json(
        { error: "Chapter is already free" },
        { status: 400 }
      );

    // Check if already purchased
    const existing = await prisma.chapterPurchase.findFirst({
      where: { chapterId, userId },
    });
    if (existing)
      return NextResponse.json({ error: "Already purchased" }, { status: 400 });

    // Check user balance
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user)
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    const cost = chapter.priceCoins || 50;
    if (user.coinBalance < cost) {
      return NextResponse.json(
        { error: "Insufficient coins" },
        { status: 402 }
      );
    }

    // Transaction: deduct coins + create purchase + add to user's chapters
    await prisma.$transaction([
      prisma.user.update({
        where: { id: userId },
        data: { coinBalance: { decrement: cost } },
      }),
      prisma.chapterPurchase.create({
        data: { userId, chapterId, novelId: chapter.novelId, coinsSpent: cost },
      }),
      prisma.coinTransaction.create({
        data: {
          userId,
          amount: -cost,
          reference: chapterId,
          type: "SPEND",
        },
      }),
      prisma.user.update({
        where: { id: userId },
        data: {
          chapters: {
            connect: { id: chapterId },
          },
        },
      }),
    ]);

    // Clear both novel and chapter caches
    await Promise.all([
      redis.del(CACHE_KEYS.novel(chapter.novel.slug)),
      redis.del(CACHE_KEYS.chapter(chapter.novel.slug, chapter.slug)),
    ]);

    return NextResponse.json({ success: true, chapterId });
  } catch (err) {
    console.error("[PURCHASE_CHAPTER_ERROR]", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
