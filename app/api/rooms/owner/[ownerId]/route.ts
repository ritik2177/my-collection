import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Room from "@/schema/room";
import { getToken } from "next-auth/jwt";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ ownerId: string }> }
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
    const { ownerId } = await context.params;
    const rooms = await Room.find({ userId: ownerId }).sort({ createdAt: -1 });

    return NextResponse.json({ success: true, rooms });
  } catch (error: unknown) {
    return NextResponse.json(
      { 
        success: false, 
        message: typeof error === "object" && error !== null && "message" in error 
          ? (error as { message: string }).message 
          : "An unknown error occurred" 
      },
      { status: 500 }
    );
  }
}
