export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { canAccessAdminPanel } from "@/lib/permissions";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (
      !session?.user ||
      !canAccessAdminPanel(
        session.user.role as
          | "USER"
          | "AUTHOR"
          | "TRANSLATOR"
          | "EDITOR"
          | "MODERATOR"
          | "ADMIN"
      )
    ) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const comments = await prisma.chapterComment.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        author: true,
        chapter: {
          include: {
            novel: true,
          },
        },
        parent: true,
        replies: true,
      },
    });

    return NextResponse.json(comments);
  } catch (error) {
    console.error("Error fetching comments:", error);
    return NextResponse.json(
      { error: "Failed to fetch comments" },
      { status: 500 }
    );
  }
}
