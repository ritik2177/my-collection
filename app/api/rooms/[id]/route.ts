import dbConnect from "@/lib/dbConnect";
import Room from "@/schema/room"; // Assuming this is the correct path
import Review from "@/schema/review"; 
import User from "@/schema/user";
import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  await dbConnect();
  Review.findOne(); // Ensures Review model is registered
  User.findOne(); // Ensures User model is registered

  try {
    const { id } = await context.params;

    const room = await Room.findById(id)
      .populate({
        path: "reviews",
        populate: {
          path: "userId",
          model: "User",
          select: "username email", // only required fields
        },
      })
      .populate("userId", "username email mobilenumber"); // Room owner details

    if (!room) {
      return NextResponse.json(
        { success: false, message: "Room not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, room });
  } catch (error) {
    console.error("Failed to fetch room:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch room" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const token = await getToken({ req });
  if (!token) {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    await dbConnect();
    const { id } = await context.params;
    const { isAvailable } = await req.json();

    // Use findByIdAndUpdate for atomic and efficient updates
    const updatedRoom = await Room.findByIdAndUpdate(
      id,
      { $set: { isAvailable: isAvailable } },
      { new: true, runValidators: true } // `new: true` returns the updated doc
    );

    if (!updatedRoom) {
      return NextResponse.json(
        { success: false, message: "Room not found" },
        { status: 404 }
      );
    }

    if (updatedRoom.userId.toString() !== token.sub) {
      return NextResponse.json(
        { success: false, message: "Forbidden" },
        { status: 403 }
      );
    }

    return NextResponse.json({ success: true, room: updatedRoom });
  } catch (error: unknown) {
    console.error("PATCH Error:", error); // Add detailed error logging
    let errorMessage = "An unknown error occurred";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    return NextResponse.json({ success: false, message: errorMessage }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const token = await getToken({ req });
  if (!token) {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    await dbConnect();
    const { id } = await context.params;

    const room = await Room.findById(id);
    if (!room) {
      return NextResponse.json({ success: false, message: "Room not found" }, { status: 404 });
    }

    if (room.userId.toString() !== token.sub) {
      return NextResponse.json({ success: false, message: "Forbidden" }, { status: 403 });
    }

    await Room.findByIdAndDelete(id);
    return NextResponse.json({ success: true, message: "Room deleted successfully" });
  } catch (error: unknown) {
    console.error("DELETE Error:", error); 
    let errorMessage = "An unknown error occurred";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    return NextResponse.json({ success: false, message: errorMessage }, { status: 500 });
  }
}
