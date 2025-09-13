"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { FaWifi, FaTv, FaParking, FaUsers, FaMapMarkerAlt } from "react-icons/fa";

export default function RoomDetailPage() {
  const { id } = useParams();
  const [room, setRoom] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRoom() {
      try {
        const res = await fetch(`/api/rooms/${id}`);
        const data = await res.json();
        if (data.success) {
          setRoom(data.room);
        }
      } catch (err) {
        console.error("Failed to fetch room", err);
      } finally {
        setLoading(false);
      }
    }
    if (id) fetchRoom();
  }, [id]);

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  if (!room) {
    return <div className="flex items-center justify-center h-screen">Room not found</div>;
  }

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white shadow-lg rounded-3xl mt-10">
      {/* Room Images */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        {room.images.map((img: string, index: number) => (
          <img
            key={index}
            src={img}
            alt={room.roomOwner}
            className="w-full h-64 object-cover rounded-lg"
          />
        ))}
      </div>

      {/* Room Info */}
      <h1 className="text-3xl font-bold mb-2">{room.nearByCentre}</h1>
      <p className="text-gray-600 mb-4">
        Owned by <span className="font-semibold">{room.roomOwner}</span>
      </p>

      <p className="text-gray-600 mb-2">
        {room.address.street}, {room.address.city}, {room.address.state},{" "}
        {room.address.pincode}
      </p>

      <div className="flex items-center gap-4 text-gray-600 mb-4">
        <FaUsers className="text-lg" /> <span>{room.noOfPeople} People</span>
        {room.currentlocation?.latitude && room.currentlocation?.longitude && (
          <a
            href={`https://www.google.com/maps?q=${room.currentlocation.latitude},${room.currentlocation.longitude}`}
            target="_blank"
            className="flex items-center text-blue-600 hover:underline"
          >
            <FaMapMarkerAlt className="mr-1" /> View on Map
          </a>
        )}
      </div>

      {/* Amenities */}
      <h2 className="text-xl font-semibold mt-4 mb-2">Amenities</h2>
      <div className="flex flex-wrap gap-4">
        {room.amenities.includes("wifi") && (
          <div className="flex items-center text-gray-700">
            <FaWifi className="mr-1 text-blue-500" /> Free WiFi
          </div>
        )}
        {room.amenities.includes("TV") && (
          <div className="flex items-center text-gray-700">
            <FaTv className="mr-1 text-gray-500" /> Smart TV
          </div>
        )}
        {room.amenities.includes("parking") && (
          <div className="flex items-center text-gray-700">
            <FaParking className="mr-1 text-green-500" /> Free Parking
          </div>
        )}
      </div>

      {/* Price */}
      <div className="flex justify-between items-center mt-6">
        <p className="text-xl font-bold text-green-600">₹{room.pricePerHour} / hour</p>
        <button className="bg-blue-600 text-white px-5 py-2 rounded-full hover:bg-blue-700">
          Book Now
        </button>
      </div>
    </div>
  );
}
