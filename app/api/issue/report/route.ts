import { type NextRequest, NextResponse } from "next/server"
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized. Please log in to report issues." }, { status: 401 })
    }

    const { type, description, chapterId, novelId } = await req.json()

    if (!type || !description) {
      return NextResponse.json({ error: "Issue type and description are required" }, { status: 400 })
    }

    if (!chapterId && !novelId) {
      return NextResponse.json({ error: "Either chapterId or novelId must be provided" }, { status: 400 })
    }

    const issueReport = await prisma.issueReport.create({
      data: {
        type,
        description,
        reporterId: session.user.id,
        chapterId: chapterId || null,
        novelId: novelId || null,
      },
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
      report: issueReport,
    })
  } catch (error) {
    console.error("[v0] Error creating issue report:", error)
    return NextResponse.json({ error: "Failed to create issue report" }, { status: 500 })
  }
}
