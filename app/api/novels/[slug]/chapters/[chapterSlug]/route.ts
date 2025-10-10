import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getNovelBySlug } from "@/lib/queries";

export async function GET(
  req: Request,
  { params }: { params: { slug: string; chapterSlug: string } }
) {
  const { slug, chapterSlug } = await params;

  try {
    // Get session (to identify user & check access)
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;

    // Fetch novel and its chapters
    const novel = await getNovelBySlug(slug, userId);
    if (!novel) {
      return NextResponse.json({ error: "Novel not found" }, { status: 404 });
    }

    // Find chapter by slug
    const chapterData = novel.chapters.find((c: any) => c.slug === chapterSlug);
    if (!chapterData) {
      return NextResponse.json({ error: "Chapter not found" }, { status: 404 });
    }

    // Fetch full chapter content
    const fullChapter = await prisma.chapter.findUnique({
      where: { id: chapterData.id },
      include: {
        novel: { select: { id: true, title: true, slug: true } },
        author: { select: { id: true, username: true } },
      },
    });

    if (!fullChapter) {
      return NextResponse.json({ error: "Chapter not found" }, { status: 404 });
    }

    // Fetch previous and next chapters based on order
    const [prevChapter, nextChapter] = await Promise.all([
      prisma.chapter.findFirst({
        where: {
          novelId: novel.id,
          order: { lt: fullChapter.order }, // Previous chapter has lower order
        },
        orderBy: { order: "desc" }, // Get the closest previous chapter
        select: { slug: true, title: true },
      }),
      prisma.chapter.findFirst({
        where: {
          novelId: novel.id,
          order: { gt: fullChapter.order }, // Next chapter has higher order
        },
        orderBy: { order: "asc" }, // Get the closest next chapter
        select: { slug: true, title: true },
      }),
    ]);

    // Optional: Access control based on subscription tier
    if (fullChapter.accessTier !== "FREE") {
      if (!userId) {
        return NextResponse.json(
          { error: "You must be signed in to access this chapter" },
          { status: 401 }
        );
      }

      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          subscriptions: {
            where: { status: "ACTIVE" },
            include: { plan: true },
          },
        },
      });

      const activeSub = user?.subscriptions[0];
      const tier = activeSub?.plan?.tier || "FREE";

      // Simple access check
      const allowedTiers = ["PREMIUM"];
      if (fullChapter.accessTier === "MEDIUM")
        allowedTiers.push("MEDIUM", "PREMIUM");
      if (fullChapter.accessTier === "SMALL")
        allowedTiers.push("SMALL", "MEDIUM", "PREMIUM");

      if (!allowedTiers.includes(tier)) {
        return NextResponse.json(
          { error: "Your subscription does not allow access to this chapter" },
          { status: 403 }
        );
      }
    }

    // Return formatted response
    return NextResponse.json({
      novel: {
        id: novel.id,
        title: novel.title,
        slug: novel.slug,
      },
      chapter: {
        id: fullChapter.id,
        title: fullChapter.title,
        slug: fullChapter.slug,
        order: fullChapter.order,
        content: fullChapter.content,
        accessTier: fullChapter.accessTier,
        createdAt: fullChapter.createdAt,
        author: fullChapter.author,
      },
      prev: prevChapter
        ? { slug: prevChapter.slug, title: prevChapter.title }
        : null,
      next: nextChapter
        ? { slug: nextChapter.slug, title: nextChapter.title }
        : null,
    });
  } catch (error) {
    console.error("[GET_CHAPTER_ERROR]", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
