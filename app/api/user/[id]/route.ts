// app/api/users/[id]/route.js
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"; // Adjust path to your Prisma client

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { email, username, firstName, lastName, avatar, coinBalance, role } = body;

    // Validate input (basic check)
    if (!id) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    // Update user (only allow editing certain fields)
    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        username,
        firstName,
        lastName,
        avatar,
        coinBalance: parseInt(coinBalance, 10) || 0,
        role,
      },
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json(
      { error: "Failed to update user" },
      { status: 500 }
    );
  }
}

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = await params;
    if (!id) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        subscriptions: true,
        accounts: true,
        novels: true,
        chapters: true,
        bookmarks: true,
        readingProgress: true,
        payments: true,
        reviews: true,
        CoinTransaction: true,
        ChapterPurchase: true,
        ExternalPayment: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json(
      { error: "Failed to fetch user" },
      { status: 500 }
    );
  }
}
