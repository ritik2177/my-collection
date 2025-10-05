"use client";

import { signOut, useSession } from "next-auth/react";
import React, { useState, useEffect } from 'react';
import { toast } from "sonner";
import PayButton from '@/components/RazorpayButton';
import Link from 'next/link';
import { Calendar, Clock, CheckCircle, IndianRupeeIcon, Lock, ChevronRight } from 'lucide-react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, CircularProgress } from '@mui/material';
import { IBooking } from "@/schema/booking";

interface IRoomPopulatedBooking extends Omit<IBooking, 'roomId'> {
  roomId: {
    _id: string;
    nearByCentre: string;
  };
}


export default function DashboardPage() {
  const { data: session, status } = useSession();
  const [bookings, setBookings] = useState<IRoomPopulatedBooking[]>([]);
  const [loading, setLoading] = useState(true);

  // State for password change modal
  const [open, setOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loadingPassword, setLoadingPassword] = useState(false);

  useEffect(() => {
    const fetchBookings = async () => {
      if (status === 'authenticated' && session?.user?.id) {
        try {
          setLoading(true);
          const res = await fetch(`/api/bookings/user/${session.user.id}`);
          const data = await res.json();
          if (data.success) {
            setBookings(data.bookings as IRoomPopulatedBooking[]);
          }
        } catch (error) {
          console.error("Failed to fetch bookings:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchBookings();
  }, [session, status]);

  if (status === 'loading' || loading) {
    return <div className="flex justify-center items-center h-screen"><p>Loading...</p></div>;
  }

  if (!session) {
    return <div className="flex justify-center items-center h-screen"><p>Redirecting to login...</p></div>;
  }

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingPassword(true);
    const res = await fetch("/api/auth/update-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ currentPassword, newPassword }),
    });
    const data = await res.json();
    if (res.ok) {
      toast.success(data.message || "Password updated successfully!");
      setOpen(false);
    } else {
      toast.error(data.message || "Failed to update password.");
    }
    setMessage(data.message);
    setLoadingPassword(false);
  };

  return (
    <div className="container w-full mx-auto p-4 pt-20 sm:p-6 lg:p-8 lg:pt-30 flex flex-col md:flex-row gap-6">
      <div className="w-full md:w-5/12">
      <div>
        <h1 className="text-4xl font-extrabold text-purple-600">Dashboard</h1>
        <h2 className="text-2xl font-bold text-purple-800 mt-6">Welcome, {session.user?.name}!</h2>
        <p className="text-gray-600 mt-2">Your email is: {session.user?.email}</p>
        {session.user?.mobile && (
          <p className="text-gray-600 mt-2">Your mobilenumber is: {session.user.mobile}</p>
        )}

      </div>
      <div>
        <p className="text-gray-600 mt-6 font-semibold"> Welcome to Your Dashboard! 👋</p>
        <p className="text-gray-600 mt-2 text-sm"> Manage everything in one place with ease.
        Here, you can check your booking and payment status, and update your password anytime.
        If you’re a room owner, you can list new rooms, manage existing ones, and update their availability status effortlessly.</p>
        <p className="text-gray-600 mt-2 text-sm italic"> Stay organized, stay in control — your dashboard, your way! 🌟</p>
      </div>
      <div className="mt-8 flex flex-wrap w-full">
      <button 
      className="px-20 py-3 mt-6 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
      onClick={() => signOut({ callbackUrl: "/" })}
      type="button">
        Logout
      
      </button>
      <button 
        className="px-12 py-3 mt-6 bg-purple-50 text-purple-600 border-purple-600 border-2 rounded-lg transition ml-2 flex items-center gap-2"
        onClick={() => setOpen(true)}
      >
        <Lock size={18} />
        Change Password
      </button>
      </div>

        {/* Owner Card */}
      <div className="mt-8 bg-white border border-purple-200 rounded-2xl shadow-lg p-6 flex flex-col md:flex-row items-start md:items-center justify-between hover:shadow-xl transition-shadow duration-300">
        <div>
          <h3 className="text-xl font-bold text-purple-800">Manage Your Rooms</h3>
          <p className="text-gray-600 mt-1">List a new room or manage your existing properties from the owner dashboard.</p>
        </div>
        <Link href="/owner" className="flex-shrink-0 ml-2 md:ml-4 mt-4 md:mt-1 px-5 py-2.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2 shadow-md">
          <span>Owner Page</span>
          <ChevronRight size={20} />
        </Link>
        </div>
      </div>
      <div className="w-full md:w-7/12">
        <div className="container mx-auto p-4 pt-18">
          <h1 className="text-3xl font-bold text-purple-800 mb-6">My Bookings</h1>
          {bookings.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-gray-500">You havent made any bookings yet.</p>
              <Link href="/rooms" className="mt-4 inline-block px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition">
                Explore Rooms
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {bookings.map((booking) => (
                <Link href={`/rooms/${booking.roomId._id}`} key={String(booking._id)} className="block">
                  <div className="bg-white rounded-lg shadow-md p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border border-gray-200 hover:shadow-lg transition-shadow duration-300 cursor-pointer">
                    <div className="flex-1 min-w-0">
                      <p className="text-lg font-bold text-purple-800 truncate hover:underline" title={booking.roomId.nearByCentre}>
                        {booking.roomId.nearByCentre}
                      </p>
                      <p className="text-xs text-gray-500 font-mono mt-1">ID: {String(booking._id)}</p>
                    </div>
        
                    <div className="flex-shrink-0 flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 text-sm">
                      <div className="flex items-center" title={`Booked from ${new Date(booking.startTime).toLocaleString()} to ${new Date(booking.endTime).toLocaleString()}`}>
                        <Calendar className="w-4 h-4 mr-2 text-gray-500" />
                        <span>{new Date(booking.startTime).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center" title={`Total Hours: ${booking.totalHours.toFixed(1)}`}>
                        <Clock className="w-4 h-4 mr-2 text-gray-500" />
                        <span>{booking.totalHours.toFixed(1)} hrs</span>
                      </div>
                      <div className="flex items-center font-semibold text-purple-800">
                        <IndianRupeeIcon className="w-4 h-4 mr-1" />
                        <span>{booking.totalCost.toFixed(2)}</span>
                      </div>
                    </div>
        
                    <div className="flex-shrink-0" onClick={(e) => { e.stopPropagation(); e.preventDefault(); }}>
                      {booking.paymentId ? (
                        <span className="inline-flex items-center text-xs font-semibold bg-green-100 text-green-700 px-2.5 py-1 rounded-full">
                          <CheckCircle className="w-4 h-4 mr-1.5" /> Confirmed
                        </span>
                      ) : (
                        <PayButton amount={booking.totalCost} bookingId={String(booking._id)} />
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Password Change Modal */}
      <Dialog 
        open={open} 
        onClose={() => setOpen(false)} 
        fullWidth 
        maxWidth="xs"
        PaperProps={{ style: { borderRadius: 16 } }}
      >
        <DialogTitle className="text-purple-700 font-semibold">Change Your Password</DialogTitle>
        <DialogContent>
          <p className="text-sm text-gray-600 mb-4">
            After changing your password, you&apos;ll receive a confirmation email.
            Make sure you choose a password that you haven’t used before.
          </p>
          <form onSubmit={handlePasswordSubmit} className="flex flex-col gap-4 mt-2">
            <TextField
              type="password"
              label="Current Password"
              variant="outlined"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              fullWidth
            />
            <TextField
              type="password"
              label="New Password"
              variant="outlined"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              fullWidth
            />
            {message && <p className="text-sm text-purple-700">{message}</p>}
            <DialogActions>
              <Button onClick={() => setOpen(false)} color="inherit">Cancel</Button>
              <Button 
                type="submit" 
                variant="contained" 
                color="secondary" 
                disabled={loadingPassword}
                className="bg-purple-600 hover:bg-purple-700"
              >
                {loadingPassword ? (
                  <>
                    <CircularProgress size={20} color="inherit" />
                    <span className='ml-2'> Changing...</span>
                  </>
                ) : (
                  "Change Password"
                )}
              </Button>
            </DialogActions>
          </form>
        </DialogContent>
      </Dialog>
      </div>
  );
}