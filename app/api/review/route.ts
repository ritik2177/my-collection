import dbConnect from "@/lib/dbConnect";
import { NextRequest, NextResponse } from "next/server";
import Review from "@/schema/review";
import Room from "@/schema/room";

export async function POST(request: NextRequest) {
  await dbConnect();
  try {
    const { rating, comment, userId, roomId } = await request.json();

    if (!rating || !comment || !userId || !roomId) {
      return NextResponse.json(
        { message: "All fields are required" },
        { status: 400 }
      );
    }

    const newReview = new Review({
      rating,
      comment,
      userId,
      roomId,
    });

    const savedReview = await newReview.save();

    // Add the review to the room's reviews array
    await Room.findByIdAndUpdate(roomId, {
      $push: { reviews: savedReview._id },
    });

    return NextResponse.json(
      { message: "Review added successfully", review: savedReview },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating review:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}