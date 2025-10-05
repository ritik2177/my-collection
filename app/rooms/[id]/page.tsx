"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import dynamic from "next/dynamic";
import TvIcon from '@mui/icons-material/Tv';
import LocalParkingIcon from '@mui/icons-material/LocalParking';
import { User, Phone, Mail, Users, Star, X } from "lucide-react";
import { FanIcon, AirVentIcon, WifiIcon } from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";


import PayButton from "@/components/RazorpayButton";
import { IRoom } from "@/schema/room";
import { IReview } from "@/schema/review";

// Define interfaces for populated data to ensure type safety
interface IPopulatedUser {
  _id: string;
  username: string;
  email: string;
  mobilenumber?: string;
}

interface IPopulatedReview extends Omit<IReview, 'userId'> {
  userId: IPopulatedUser;
}

interface IRoomDetails extends Omit<IRoom, 'reviews' | 'userId'> {
  reviews: IPopulatedReview[];
  userId: IPopulatedUser;
}

interface IBookingFormData {
  startTime: string;
  endTime: string;
  totalCost: number;
  fullName: string;
  noOfPeople: string;
  enrollmentNumber: string;
  address: string;
}

const StudentStayMap = dynamic(() => import("@/components/StudentStayMap"), {
  ssr: false,
  loading: () => <p>Loading map...</p>,
});

const getAmenityDetails = (amenity: string) => {
  const lower = amenity.toLowerCase();

  switch (lower) {
    case "wifi":
      return { Icon: WifiIcon, label: "Free WiFi" };
    case "ac":
    case "air conditioner":
      return { Icon: AirVentIcon, label: "AC" };
    case "tv":
    case "smart tv":
      return { Icon: TvIcon, label: "Smart TV" };
    case "parking":
      return { Icon: LocalParkingIcon, label: "Free Parking" };
    case "fan":
      return { Icon: FanIcon, label: "Fan" };
    default:
      return { Icon: null, label: amenity };
  }
};

export default function RoomDetailPage() {
  const { id } = useParams();
  const { data: session, status } = useSession();
  const [room, setRoom] = useState<IRoomDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isBooking, setIsBooking] = useState(false);

  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false); 
  const [bookingData, setBookingData] = useState<IBookingFormData>({
    startTime: '',
    endTime: '',
    totalCost: 0, // Initialize totalCost here
    fullName: '',
    noOfPeople: '',
    enrollmentNumber: '',
    address: '',
  });

  useEffect(() => {
    const fetchRoom = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const res = await fetch(`/api/rooms/${id}`);
        const data = await res.json();
        if (data.success) {
          setRoom(data.room);
          if (data.room.images && data.room.images.length > 0) {
            setSelectedImage(data.room.images[0]);
          }
        } else {
          toast.error(data.message || "Failed to fetch room details.");
        }
      } catch (err) {
        console.error("Failed to fetch room", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRoom();
  }, [id]);

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session?.user) {
      toast.error("You must be logged in to write a review.");
      return;
    }
    if (rating === 0 || comment.trim() === "") {
      toast.error("Please provide a rating and a comment.");
      return;
    }

      setIsSubmitting(true);
    try {
      const res = await fetch('/api/review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rating,
          comment,
          userId: session.user.id,
          roomId: id,
        }),
      });
      if (res.ok) {
        toast.success("Review submitted successfully!");
        setIsReviewModalOpen(false);
        setRating(0);
        setComment("");
        // Optionally, you can refresh the room data to show the new review instantly
        // fetchRoom(); 
      } else {
        const errorData = await res.json();
        toast.error(errorData.message || "Failed to submit review.");
      }
    } catch {
      toast.error("An unexpected error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const [bookingId, setBookingId] = useState<string | null>(null);

  const handleBookingSubmit = async () => {
    setIsBooking(true); // This can be used to disable the "Confirm & Proceed" button
    // Validate booking data
    if (!bookingData.startTime || !bookingData.endTime || !bookingData.fullName || !bookingData.noOfPeople || !bookingData.enrollmentNumber || !bookingData.address) {
      toast.error("Please fill all the required fields.");
      setIsBooking(false);
      return;
    }

    // Calculate total hours and total cost, assuming room.pricePerHour is available
    const start = new Date(bookingData.startTime);
    const end = new Date(bookingData.endTime);
    const hours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
    const cost = room ? hours * room.pricePerHour : 0;

    if (!session || !session.user) {
      toast.error("You must be logged in to book a room.");
      return;
    }
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: session.user.id as string, // The user making the booking
          roomId: room ? room._id : null,
          startTime: bookingData.startTime,
          endTime: bookingData.endTime,
          totalHours: hours,
          totalCost: cost,
          fullName: bookingData.fullName,
          noOfPeople: Number(bookingData.noOfPeople),
          enrollmentNumber: bookingData.enrollmentNumber,
          address: bookingData.address,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success("Booking details confirmed! Please proceed to payment.");
        setBookingId(data.booking._id); // Store booking ID
        // Set totalCost in state here, only after successful booking creation
        setBookingData((prevState) => ({
          ...prevState,
          totalCost: cost,
        }));
      } else {
        toast.error(data.message || "Failed to create booking.");
      }
    } catch {
      toast.error("An unexpected error occurred while creating the booking.");
    } finally {
      setIsBooking(false);
    }
  };

  if (loading) {
    return (<div className="flex items-center justify-center h-screen">
      Loading...
    </div>
    )
  }

  if (!room) {

    return ( // This will be shown if loading is false and room is still null
      <div className="flex items-center justify-center h-screen">
        Room not found
      </div>
    );
  }

  const roomLocation = room?.currentlocation?.latitude && room?.currentlocation?.longitude ? {
    lat: room.currentlocation.latitude,
    lng: room.currentlocation.longitude,
    name: room.roomOwner,
    price: room.pricePerHour,
    nearByCentre: room.nearByCentre,
    id: room._id as string,
  } : null;

  return (
    <div className="container mx-auto p-6 pt-20 ">
      <div className="flex flex-col md:flex-row gap-2">
        <div className="w-full md:w-8/12">
          {/* Big Image */}
          {selectedImage && (
            <div className="relative w-full max-w-full h-[420px] mb-4 overflow-hidden bg-gray-800 rounded-2xl p-4 border border-border">
              <Image
                src={selectedImage}
                alt="Selected"
                layout="fill"
                className="object-cover"
              />
            </div>
          )}

          {/* Thumbnails */}
          <div className="flex gap-4 md:gap-6 flex-wrap">
            {room.images?.slice(0, 4).map((img: string, index: number) => (
              <Image
                key={index}
                src={img}
                alt={`Thumbnail ${index + 1}`}
                onClick={() => setSelectedImage(img)}
                className={`w-18 md:w-28 h-18 object-cover p-2 cursor-pointer border bg-gray-800 rounded-xl 
              ${selectedImage === img
                    ? "border-primary"
                    : "border-transparent"
                  }`}
                width={112}
                height={72}
              />
            ))}
          </div>
        </div>
        {/* Room woner and map */}
        <div className="flex flex-col md:w-4/12 pt-1 rounded-lg justify-center ">
          {/* map */}
          <div className="w-full h-[320px] bg-gray-800 p-4 rounded-xl mb-4 border border-border overflow-hidden z-10">
            <h2 className="text-xl font-bold mb-2 text-foreground">Room Location</h2>
            <div className="w-full h-[250px] overflow-hidden">
              {roomLocation ? (
                <StudentStayMap locations={[roomLocation]} />
              ) : (
                <p>Location not available.</p>
              )}
            </div>
          </div>
          {/* owner Details */}
          <div className="bg-gray-800 p-5 rounded-xl shadow-sm border border-border">
            <h3 className="text-xl font-bold text-foreground mb-4">Owner Details</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <User className="w-5 h-5 text-primary" />
                <span className="text-foreground font-medium">{room.roomOwner}</span>
              </div>
              {room.userId?.mobilenumber && (
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-primary" />
                  <span className="text-muted-foreground">{room.userId.mobilenumber}</span>
                </div>
              )}
              {room.userId?.email && (
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-primary" />
                  <a href={`mailto:${room.userId.email}`} className="text-muted-foreground hover:text-primary hover:underline">{room.userId.email}</a>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      {/* address */}
      <div className="flex justify-between flex-wrap">
        <div>
          <p className="text-sm text-primary font-semibold tracking-wider uppercase mt-8 mb-2">Room Details</p>
          <h3 className="text-4xl font-bold text-foreground font-sans">{room.nearByCentre}</h3>
          <h5 className="text-lg mt-2 text-muted-foreground font-sans">Address: {room.address.street}, {room.address.city}, {room.address.state}, {room.address.pincode}</h5>
        </div>
        <div className="mt-6 flex flex-col justify-center gap-2">
          <button
            onClick={() => {
              if (status !== 'authenticated') {
                toast.error("Please log in to book a room.");
                return;
              }
              setIsBookingModalOpen(true);
            }}
            className="px-38 py-4 rounded-2xl text-primary-foreground font-semibold bg-primary shadow-lg hover:bg-primary/90 transition">
            Book now
          </button >
          <button
            onClick={() => {
              if (status !== 'authenticated') {
                toast.error("Please log in to write a review.");
                return;
              }
              setIsReviewModalOpen(true)
            }} className="px-38 py-4 rounded-2xl text-secondary-foreground font-semibold bg-secondary shadow-lg hover:bg-secondary/80 transition">
            Write a Review
          </button>
        </div>
      </div>
      
      {/* Amenities */}
      <div className="mt-8">
        <h4 className="text-2xl font-bold text-foreground mb-4">What this place offers</h4>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {room.amenities.map((amenity: string, index: number) => {
            const { Icon, label } = getAmenityDetails(amenity);
            return (
              <div key={index} className="flex flex-col items-center justify-center gap-2 p-4 border border-border rounded-xl bg-gray-800 hover:bg-gray-700 hover:shadow-md transition-all">
                {Icon && <Icon className="w-8 h-8 text-primary" />}
                <span className="text-sm font-medium text-muted-foreground text-center">{label}</span>
              </div>
            );
          })}
          {/* Number of People Card */}
          <div className="flex flex-col items-center justify-center gap-2 p-4 border border-border rounded-xl bg-gray-800 hover:bg-gray-700 hover:shadow-md transition-all">
            <Users className="w-8 h-8 text-primary" />
            <span className="text-sm font-medium text-muted-foreground text-center">{room.noOfPeople} People</span>
          </div>
          {/* Distance Card */}
          <div className="flex flex-col items-center justify-center gap-2 p-4 border border-border rounded-xl bg-gray-800 hover:bg-gray-700 hover:shadow-md transition-all">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"></path><line x1="4" x2="4" y1="22" y2="15"></line></svg>
            <span className="text-sm font-medium text-muted-foreground text-center">{room.dist_btw_room_and_centre}m away</span>
          </div>
        </div>
        {/* About this room/Description */}
      {room.description && (
        <div className="mt-8 border-t border-gray-200 pt-6">
          <h4 className="text-2xl font-bold text-foreground mb-3">About this room</h4>
          <p className="text-muted-foreground leading-relaxed">{room.description}</p>
        </div>
      )}

        <h3 className="text-2xl font-bold text-foreground mt-6 mb-4 text-center">Reviews</h3>
        <div className="flex flex-wrap ">
          {room.reviews && room.reviews.length > 0 ? (
            room.reviews.map((review: IPopulatedReview) => (



              <div key={String(review._id)} className="w-[290px] mr-4 mt-4 bg-gray-800 rounded-2xl shadow-lg border border-border p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-full bg-primary/10">
                    <User className="w-8 h-8 text-primary" />
                  </div> 
                  <div>
                    <p className="font-semibold text-lg text-foreground">{review.userId?.username || 'Anonymous'}</p>
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                      <Mail className="w-4 h-4 text-muted-foreground" /> {review.userId?.email || 'No email'}
                    </p>
                  </div>
                </div>

                {/* Rating */}
                <div className="flex items-center gap-1 mt-3">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-5 h-5 ${star <= review.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                        }`}
                    />
                  ))}
                  <span className="ml-2 text-sm font-medium text-gray-600">{review.rating.toFixed(1)}/5</span>
                </div>

                {/* Review Text */}
                <p className="text-muted-foreground text-sm leading-relaxed mt-3">
                  “{review.comment}”
                </p>
              </div>
            ))
          ) : (
            <p className="w-full text-center text-muted-foreground mt-4">No reviews yet. Be the first to write one!</p>
          )}
        </div>
      </div>

      {/* Review Modal */}
      {isReviewModalOpen && (
        <div className="fixed inset-0 bg-transparent flex items-center justify-center z-50">
          <div className="bg-card p-8 rounded-2xl shadow-2xl w-full max-w-md relative">
            <button onClick={() => setIsReviewModalOpen(false)} className="absolute top-4 right-4 text-muted-foreground hover:text-foreground">
              <X className="w-6 h-6" />
            </button>
            <h2 className="text-2xl font-bold text-foreground mb-4">Write a Review</h2>
            <form onSubmit={handleReviewSubmit}>
              <div className="mb-4">
                <label className="block text-foreground font-semibold mb-2">Your Rating</label>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-8 h-8 cursor-pointer transition-colors ${rating >= star ? 'text-yellow-400 fill-yellow-400' : 'text-muted-foreground hover:text-yellow-300'}`}
                      onClick={() => setRating(star)}
                    />
                  ))}
                </div>
              </div>
              <div className="mb-6">
                <label htmlFor="comment" className="block text-foreground font-semibold mb-2">Your Review</label>
                <textarea
                  id="comment"
                  rows={4}
                  className="w-full p-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Tell us about your experience..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                ></textarea>
              </div>
              <button type="submit" disabled={isSubmitting} className="w-full py-3 rounded-lg text-primary-foreground font-semibold bg-primary hover:bg-primary/90 transition disabled:opacity-70">
                {isSubmitting ? 'Submitting...' : 'Submit Review'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Booking Modal */}
      {isBookingModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 p-4 sm:p-8 rounded-2xl shadow-2xl w-full max-w-4xl relative max-h-[90vh] overflow-y-auto">
            <button onClick={() => { setIsBookingModalOpen(false); setBookingId(null); }} className="absolute top-4 right-4 text-muted-foreground hover:text-foreground">
              <X className="w-6 h-6" />
            </button>
            <form onSubmit={(e) => {
              e.preventDefault();
              if (!bookingId) handleBookingSubmit();
            }}>
              <div className="flex flex-col md:flex-row gap-6">
                {/* Left side: Image and Details */}
                <div className="w-full md:w-64">
                  <div className="relative h-40 w-full object-cover rounded-2xl overflow-hidden">
                    <Image src={room.images[0]} alt="room image" layout="fill" className="object-cover" />
                  </div>
                  <p className="text-muted-foreground italic text-sm mt-2">ROOM DETAILS</p>
                  <p className="font-bold text-xl text-foreground">{room.nearByCentre}</p>
                  <p className="text-md font-semibold text-green-600">₹{room.pricePerHour} / hour</p>
                  <p className="text-sm text-muted-foreground">{room.address.street}, {room.address.city}, {room.address.state}, {room.address.pincode}</p>

                  {/* Booking Summary - shown after booking is created */}
                  {bookingId && bookingData.totalCost > 0 && (
                    <div className="mt-4 border-t pt-2">
                      <h3 className="text-md font-bold text-foreground mb-1">Booking Summary</h3>
                      <div className="text-left text-xs space-y-1">
                        <p><strong>From:</strong> {new Date(bookingData.startTime).toLocaleString()}</p>
                        <p><strong>To:</strong> {new Date(bookingData.endTime).toLocaleString()}</p>
                        <p><strong>Total Stay:</strong> {((new Date(bookingData.endTime).getTime() - new Date(bookingData.startTime).getTime()) / (1000 * 60 * 60)).toFixed(1)} hours</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Divider */}
                <div className="border-t md:border-t-0 md:border-l border-gray-200 my-4 md:my-0 md:mx-4"></div>

                {/* Right side: Form inputs */}
                <div className="flex-1">
                <h2 className="text-2xl font-bold text-foreground mb-4">{bookingId ? 'Complete Your Payment' : 'Book Your Stay'}</h2>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-foreground font-semibold mb-1 text-sm">Full Name</label>
                      <input type="text" placeholder="Your full name" className="w-full p-2 bg-background border border-border rounded-lg text-sm"
                        onChange={(e) => setBookingData({ ...bookingData, fullName: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-foreground font-semibold mb-1 text-sm">No. of People</label>
                      <input type="number" placeholder="e.g., 2" className="w-full p-2 bg-background border border-border rounded-lg text-sm"
                        onChange={(e) => setBookingData({ ...bookingData, noOfPeople: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-foreground font-semibold mb-1 text-sm">Enrollment/Roll No.</label>
                      <input type="text" placeholder="Exam roll number" className="w-full p-2 bg-background border border-border rounded-lg text-sm"
                        onChange={(e) => setBookingData({ ...bookingData, enrollmentNumber: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-foreground font-semibold mb-1 text-sm">Permanent Address</label>
                      <input type="text" placeholder="Your home address" className="w-full p-2 bg-background border border-border rounded-lg text-sm"
                        onChange={(e) => setBookingData({ ...bookingData, address: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="w-full">
                      <label className="block text-foreground font-semibold mb-2">Start Time</label>
                      <input
                        type="datetime-local"
                        className="w-full p-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                        onChange={(e) => {
                          const newStartTime = e.target.value;
                          setBookingData({ ...bookingData, startTime: newStartTime });
                        }}
                      />
                    </div>
                    <div className="w-full">
                      <label className="block text-foreground font-semibold mb-2">End Time</label>
                      <input
                        type="datetime-local"
                        className="w-full p-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                        onChange={(e) => {
                          const newEndTime = e.target.value;
                          setBookingData({ ...bookingData, endTime: newEndTime });
                        }}
                      />
                    </div>
                  </div>

                  <div className="mt-6">
                    {bookingId ? (
                      <>
                        {bookingData.totalCost > 0 ? (
                          <div className="text-center mt-4">
                            {/* <p className="mb-2 text-xl font-semibold">Total Cost: ₹{bookingData.totalCost.toFixed(2)}</p> */}
                            <PayButton amount={bookingData.totalCost} bookingId={bookingId} />
                          </div>
                        ) : <p className="text-center">Calculating cost...</p>}
                      </>
                    ) : (
                      <button
                        type="submit"
                        disabled={isBooking}
                        className="w-full py-3 rounded-lg text-primary-foreground font-semibold bg-primary hover:bg-primary/90 transition disabled:opacity-70 disabled:cursor-not-allowed"
                      >
                        {isBooking ? 'Confirming...' : 'Confirm & Proceed'}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
