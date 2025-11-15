import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { canAccessAdminPanel } from "@/lib/permissions";

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);

  if (
    !session?.user ||
    !canAccessAdminPanel(
      session.user.role as "USER" | "EDITOR" | "MODERATOR" | "ADMIN"
    )
  )
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    await prisma.chapterComment.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json(
      { error: "Failed to delete comment" },
      { status: 500 }
    );
  }
}
