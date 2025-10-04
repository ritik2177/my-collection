import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Booking from '@/schema/booking';
import nodemailer from 'nodemailer';

interface IParams {
  id: string;
}

export async function PUT(req: Request, context: { params: Promise<IParams> }) {
  await dbConnect();

  try {
    const { id } = await context.params; 
    const { paymentId } = await req.json();

    if (!paymentId) {
      return NextResponse.json({ message: 'Payment ID is required' }, { status: 400 });
    }

    const updatedBooking = await Booking.findByIdAndUpdate(
      id,
      { paymentId, status: 'booked' },
      { new: true }
    );

    if (!updatedBooking) {
      return NextResponse.json({ message: 'Booking not found' }, { status: 404 });
    }

    // --- Email Notification Logic ---
    // We need to fetch the full booking details to get user and owner emails
    const populatedBooking = await Booking.findById(updatedBooking._id)
      .populate<{ userId: { username: string; email: string } }>('userId', 'username email') // The user who booked
      .populate({
        path: 'roomId',
        select: 'nearByCentre roomOwner', // Room details
        populate: {
          path: 'userId', // The owner of the room
          model: 'User',
          select: 'username email'
        }
      });

    const now = new Date();
    const dateTime = now.toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });

    if (populatedBooking) {
      const user = populatedBooking.userId;
      const room = populatedBooking.roomId as {
        nearByCentre: string;
        userId: {
          username: string;
          email: string;
        }
      };
      const owner = room.userId;

      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

      // 1. Send email to the user who booked
      if (user?.email) {
        await transporter.sendMail({
          from: process.env.EMAIL_USER,
          to: user.email,
          subject: `Booking Confirmed for ${room.nearByCentre}! ✅`,
          html: `<h1>Hi ${user.username},</h1><p>Your booking for the room "<b>${room.nearByCentre}</b>" is confirmed.</p><p><b>Booking ID:</b> ${populatedBooking._id}</p><p>Thank you!</p>\n ${dateTime}`,
        }).catch(e => console.error("Failed to send confirmation email to user:", e));
      }

      // 2. Send email to the room owner
      if (owner?.email) {
        await transporter.sendMail({
          from: process.env.EMAIL_USER,
          to: owner.email,
          subject: `New Booking for Your Room: ${room.nearByCentre} 🏡`,
          html: `<h1>Hi ${owner.username},</h1><p>You have a new booking for your room "<b>${room.nearByCentre}</b>" from a user named <b>${populatedBooking.fullName}</b>.</p>\n ${dateTime}`,
        }).catch(e => console.error("Failed to send notification email to owner:", e));
      }
    }
    // --- End of Email Logic ---

    return NextResponse.json(
      { message: 'Booking updated successfully', booking: updatedBooking },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error updating booking:', error);
    return NextResponse.json({ message: 'Error updating booking' }, { status: 500 });
  }
}
