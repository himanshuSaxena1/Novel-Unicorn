// app/api/chapters/[chapterId]/comments/[commentId]/replies/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: { id: string; commentId: string } }
) {
  const replies = await prisma.chapterComment.findMany({
    where: { parentId: params.commentId },
    include: {
      author: { select: { id: true, username: true, avatar: true } },
    },
    orderBy: { createdAt: "asc" },
  });

  return NextResponse.json(replies);
}

export async function POST(
  request: Request,
  { params }: { params: { id: string; commentId: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id)
    return new NextResponse("Unauthorized", { status: 401 });

  const { content } = await request.json();
  if (!content?.trim())
    return new NextResponse("Content required", { status: 400 });

  const { id } = await params;

  const reply = await prisma.chapterComment.create({
    data: {
      content: content.trim(),
      chapterId: id,
      authorId: session.user.id,
      parentId: params.commentId,
    },
    include: {
      author: { select: { id: true, username: true, avatar: true } },
    },
  });

  return NextResponse.json(reply, { status: 201 });
}
