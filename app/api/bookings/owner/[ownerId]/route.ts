import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Booking from '@/schema/booking';
import Room from '@/schema/room';
import { getToken } from 'next-auth/jwt';

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ ownerId: string }> } 
) {
  const token = await getToken({ req });
  if (!token) {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
  }

  try {
    await dbConnect();
    const { ownerId } = await context.params; 

    // Authorization: Ensure the logged-in user can only access their own data
    if (token.sub !== ownerId) {
      return NextResponse.json({ success: false, message: 'Forbidden' }, { status: 403 });
    }

    // 1. Find all rooms owned by the user
    const ownerRooms = await Room.find({ userId: ownerId }).select('_id');
    if (ownerRooms.length === 0) {
      return NextResponse.json({ success: true, bookings: [] });
    }

    const roomIds = ownerRooms.map(room => room._id);

    // 2. Find all bookings for those rooms
    const bookings = await Booking.find({ roomId: { $in: roomIds } })
      .populate('roomId', 'nearByCentre')
      .sort({ createdAt: -1 });

    return NextResponse.json({ success: true, bookings });

  } catch (error) {
    console.error('Error fetching owner bookings:', error);
    return NextResponse.json(
      { success: false, message: 'Error fetching bookings' },
      { status: 500 }
    );
  }
}
