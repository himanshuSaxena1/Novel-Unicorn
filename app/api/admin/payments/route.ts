import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const skip = (page - 1) * limit;
    const search = searchParams.get("search") || "";

    // Fetch External Payments
    const externalPayments = await prisma.externalPayment.findMany({
      take: limit,
      skip,
      orderBy: { createdAt: "desc" },
      where: search
        ? {
            user: {
              email: {
                contains: search,
                mode: "insensitive",
              },
            },
          }
        : {},
      include: {
        user: {
          select: {
            email: true,
            username: true,
          },
        },
      },
    });

    // Fetch Coin Transactions
    const coinTransactionsRaw = await prisma.coinTransaction.findMany({
      take: limit,
      skip,
      orderBy: { createdAt: "desc" },
      where: search
        ? {
            user: {
              email: {
                contains: search,
                mode: "insensitive",
              },
            },
          }
        : {},
      include: {
        user: {
          select: {
            email: true,
            username: true,
          },
        },
      },
    });

    // Fetch chapter details for coin transactions with a reference
    const coinTransactions = await Promise.all(
      coinTransactionsRaw.map(async (tx) => {
        if (tx.reference) {
          const chapter = await prisma.chapter.findUnique({
            where: { id: tx.reference },
            select: {
              order: true,
              novel: {
                select: {
                  title: true,
                },
              },
            },
          });
          return { ...tx, chapter };
        }
        return { ...tx, chapter: null };
      })
    );

    // Count for pagination (using the larger count for simplicity)
    const totalPayments = await prisma.externalPayment.count({
      where: search
        ? {
            user: {
              email: {
                contains: search,
                mode: "insensitive",
              },
            },
          }
        : {},
    });
    const totalCoinTransactions = await prisma.coinTransaction.count({
      where: search
        ? {
            user: {
              email: {
                contains: search,
                mode: "insensitive",
              },
            },
          }
        : {},
    });
    const total = Math.max(totalPayments, totalCoinTransactions);
    const pages = Math.ceil(total / limit);

    return NextResponse.json({
      externalPayments,
      coinTransactions,
      total,
      pages,
    });
  } catch (error) {
    console.error("Error fetching transactions:", error);
    return NextResponse.json(
      { error: "Failed to fetch transactions" },
      { status: 500 }
    );
  }
}
