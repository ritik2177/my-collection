"use client";

import { useSession } from "next-auth/react";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Calendar, Clock, CheckCircle, IndianRupeeIcon, User, Hash, Home, BookUser } from 'lucide-react';
import { IBooking } from "@/schema/booking";

interface IRoomPopulatedBooking extends Omit<IBooking, 'roomId'> {
  roomId: {
    _id: string;
    nearByCentre: string;
  };
}

export default function OwnerBookingsPage() {
  const { data: session, status } = useSession();
  const [bookings, setBookings] = useState<IRoomPopulatedBooking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      if (status === 'authenticated' && session?.user?.id) {
        try {
          setLoading(true);
          const res = await fetch(`/api/bookings/owner/${session.user.id}`);
          const data = await res.json();
          if (data.success) {
            setBookings(data.bookings);
          } else {
            console.error("Failed to fetch bookings:", data.message);
          }
        } catch (error) {
          console.error("Error fetching owner bookings:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchBookings();
  }, [session, status]);

  if (status === 'loading' || loading) {
    return <div className="flex justify-center items-center h-screen"><p>Loading bookings...</p></div>;
  }

  if (!session) {
    return <div className="flex justify-center items-center h-screen"><p>Please log in to view this page.</p></div>;
  }

  return (
    <div className="container mx-auto p-4 pt-24 sm:p-6 lg:p-8 lg:pt-24">
      <h1 className="text-3xl md:text-4xl font-bold text-purple-800 mb-2">Your Room Bookings</h1>
      <p className="text-gray-600 mb-6">You have a total of <span className="font-bold text-purple-600">{bookings.length}</span> booking(s) for your rooms.</p>

      {bookings.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-500">You don&apos;t have any bookings for your rooms yet.</p>
          <Link href="/owner" className="mt-4 inline-block px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition">
            Go to Owner Dashboard
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {bookings.map((booking) => (
            <div key={String(booking._id)} className="bg-white rounded-2xl shadow-md p-5 border border-gray-200 hover:shadow-lg transition-shadow duration-300">
              <div className="flex flex-col md:flex-row justify-between md:items-center mb-4">
                <h2 className="text-xl font-bold text-purple-800 truncate" title={booking.roomId.nearByCentre}>
                  {booking.roomId.nearByCentre}
                </h2>
                {booking.status === 'completed' ? (
                  <span className="inline-flex mt-2 md:mt-0 items-center text-xs font-semibold bg-blue-100 text-blue-700 px-2.5 py-1 rounded-full">
                    <CheckCircle className="w-4 h-4 mr-1.5" /> Completed
                  </span>
                ) : (
                  <span className="inline-flex mt-2 md:mt-0 items-center text-xs font-semibold bg-green-100 text-green-700 px-2.5 py-1 rounded-full">
                    <CheckCircle className="w-4 h-4 mr-1.5" /> Booked
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                <div className="flex items-center text-gray-700"><User className="w-4 h-4 mr-2 text-purple-500" /> <strong>Booked by:</strong><span className="ml-2">{booking.fullName}</span></div>
                <div className="flex items-center text-gray-700"><Hash className="w-4 h-4 mr-2 text-purple-500" /> <strong>Roll No:</strong><span className="ml-2">{booking.enrollmentNumber}</span></div>
                <div className="flex items-center text-gray-700 col-span-1 sm:col-span-2 lg:col-span-1"><Home className="w-4 h-4 mr-2 text-purple-500" /> <strong>Address:</strong><span className="ml-2">{booking.address}</span></div>
              </div>

              <div className="border-t my-4"></div>

              <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-gray-600">
                <div className="flex items-center" title={`From: ${new Date(booking.startTime).toLocaleString()}`}><Calendar className="w-4 h-4 mr-2" /> {new Date(booking.startTime).toLocaleString()}</div>
                <div className="flex items-center" title={`To: ${new Date(booking.endTime).toLocaleString()}`}><Calendar className="w-4 h-4 mr-2" /> {new Date(booking.endTime).toLocaleString()}</div>
                <div className="flex items-center"><Clock className="w-4 h-4 mr-2" /> {booking.totalHours.toFixed(1)} hrs</div>
                <div className="flex items-center font-semibold text-purple-800"><IndianRupeeIcon className="w-4 h-4 mr-1" /> {booking.totalCost.toFixed(2)}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
