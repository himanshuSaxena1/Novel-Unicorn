// app/api/chapters/[chapterId]/comments/[commentId]/route.ts
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function DELETE(
  request: Request,
  { params }: { params: { id: string; commentId: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return new NextResponse("Unauthorized", { status: 401 });

  const comment = await prisma.chapterComment.findUnique({
    where: { id: params.commentId },
  });

  if (!comment) return new NextResponse("Not found", { status: 404 });
  if (comment.authorId !== session.user.id) return new NextResponse("Forbidden", { status: 403 });

  await prisma.chapterComment.delete({ where: { id: params.commentId } });
  return new NextResponse(null, { status: 204 });
}