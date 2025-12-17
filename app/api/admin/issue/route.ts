import { type NextRequest, NextResponse } from "next/server"
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const searchParams = req.nextUrl.searchParams
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "10")
    const status = searchParams.get("status") || "ALL"
    const type = searchParams.get("type") || "ALL"

    const skip = (page - 1) * limit

    const where: any = {}
    if (status !== "ALL") {
      where.status = status
    }
    if (type !== "ALL") {
      where.type = type
    }

    const [reports, total] = await Promise.all([
      prisma.issueReport.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          reporter: {
            select: {
              id: true,
              username: true,
              email: true,
              avatar: true,
            },
          },
          chapter: {
            select: {
              id: true,
              title: true,
              slug: true,
              novel: {
                select: {
                  title: true,
                  slug: true,
                },
              },
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
      }),
      prisma.issueReport.count({ where }),
    ])

    return NextResponse.json({
      reports,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    })
  } catch (error) {
    console.error("[v0] Error fetching issue reports:", error)
    return NextResponse.json({ error: "Failed to fetch issue reports" }, { status: 500 })
  }
}
