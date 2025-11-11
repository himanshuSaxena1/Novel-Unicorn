// app/api/chapters/[id]/comments/route.ts
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = await params;

  const comments = await prisma.chapterComment.findMany({
    where: { chapterId: id, parentId: null }, 
    include: {
      author: { select: { id: true, username: true, avatar: true } },
      _count: { select: { replies: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(comments);
}

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return new NextResponse("Unauthorized", { status: 401 });

  const { content } = await request.json();
  if (!content?.trim()) return new NextResponse("Content required", { status: 400 });

  const { id } = await params;

  const comment = await prisma.chapterComment.create({
    data: {
      content: content.trim(),
      chapterId: id,
      authorId: session.user.id,
    },
    include: {
      author: { select: { id: true, username: true, avatar: true } },
    },
  });

  return NextResponse.json(comment, { status: 201 });
}