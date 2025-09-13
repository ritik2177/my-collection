import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Room from "@/schema/room";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    await dbConnect();
    const room = await Room.findById(params.id).populate("userId", "username email");

    if (!room) {
      return NextResponse.json({ success: false, message: "Room not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, room }, { status: 200 });
  } catch (error) {
    console.error("Error fetching room:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch room" },
      { status: 500 }
    );
  }
}
