import { type NextRequest, NextResponse } from "next/server"
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { status, adminNotes } = await req.json()
    const { id } = params

    const updateData: any = { status }

    if (adminNotes !== undefined) {
      updateData.adminNotes = adminNotes
    }

    if (status === "RESOLVED") {
      updateData.resolvedAt = new Date()
    }

    const updatedReport = await prisma.issueReport.update({
      where: { id },
      data: updateData,
      include: {
        reporter: {
          select: {
            id: true,
            username: true,
            email: true,
          },
        },
        chapter: {
          select: {
            id: true,
            title: true,
            slug: true,
          },
        },
        novel: {
          select: {
            id: true,
            title: true,
            slug: true,
          },
        },
      },
    })

    return NextResponse.json({
      success: true,
      report: updatedReport,
    })
  } catch (error) {
    console.error("[v0] Error updating issue report:", error)
    return NextResponse.json({ error: "Failed to update issue report" }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await prisma.issueReport.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Error deleting issue report:", error)
    return NextResponse.json({ error: "Failed to delete issue report" }, { status: 500 })
  }
}
