import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { novelId, rating, comment } = await request.json();

    if (!novelId || !rating || rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: "Invalid input: novelId and rating (1-5) are required" },
        { status: 400 }
      );
    }

    const novel = await prisma.novel.findUnique({
      where: { id: novelId },
    });

    if (!novel) {
      return NextResponse.json({ error: "Novel not found" }, { status: 404 });
    }

    // Check if user already has a review for this novel
    const existingReview = await prisma.review.findUnique({
      where: {
        userId_novelId: {
          userId: session.user.id,
          novelId,
        },
      },
    });

    let review;
    if (existingReview) {
      // Update existing review
      review = await prisma.review.update({
        where: { id: existingReview.id },
        data: {
          rating,
          comment: comment || null,
          updatedAt: new Date(),
        },
        include: {
          user: { select: { username: true, id: true } },
        },
      });
    } else {
      // Create new review
      review = await prisma.review.create({
        data: {
          rating,
          comment: comment || null,
          userId: session.user.id,
          novelId,
        },
        include: {
          user: { select: { username: true, id: true } },
        },
      });
    }

    // Update novel rating (average of all reviews)
    const reviews = await prisma.review.findMany({
      where: { novelId },
      select: { rating: true },
    });
    const averageRating =
      reviews.length > 0
        ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
        : 0;

    await prisma.novel.update({
      where: { id: novelId },
      data: { rating: averageRating },
    });

    return NextResponse.json({ review });
  } catch (error) {
    console.error("Error creating/updating review:", error);
    return NextResponse.json(
      { error: "Failed to submit review" },
      { status: 500 }
    );
  }
}
