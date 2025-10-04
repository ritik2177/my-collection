import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Booking from '@/schema/booking';
import { getToken } from 'next-auth/jwt';

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ userId: string }> }
) {
  const token = await getToken({ req });
  if (!token) {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
  }

  try {
    await dbConnect();
    const { userId } = await context.params;

    // Authorization: Ensure the logged-in user can only access their own bookings
    if (token.sub !== userId) {
      return NextResponse.json({ success: false, message: 'Forbidden' }, { status: 403 });
    }

    const bookings = await Booking.find({ userId }).sort({ createdAt: -1 }).populate('roomId', 'nearByCentre totalHours totalCost');

    return NextResponse.json({ success: true, bookings }, { status: 200 });
  } catch (error) {
    console.error('Error fetching user bookings:', error);
    return NextResponse.json(
      { success: false, message: 'Error fetching bookings' },
      { status: 500 }
    );
  }
}
