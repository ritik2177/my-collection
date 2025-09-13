"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  FaWifi,
  FaTv,
  FaParking,
  FaUsers,
  FaMapMarkerAlt,
  FaStar,
  FaWind, 
} from "react-icons/fa";
import { FaFan } from "react-icons/fa6"; 
import { TbAirConditioning } from "react-icons/tb"; 

const getAmenityDetails = (amenity: string) => {
  const lower = amenity.toLowerCase();

  switch (lower) {
    case "wifi":
      return { Icon: FaWifi, label: "Free WiFi" };
    case "ac":
    case "air conditioner":
      return { Icon: TbAirConditioning, label: "AC" };
    case "tv":
    case "smart tv":
      return { Icon: FaTv, label: "Smart TV" };
    case "parking":
      return { Icon: FaParking, label: "Free Parking" };
    case "fan":
      return { Icon: FaFan, label: "Fan" };
    default:
      return { Icon: null, label: amenity };
  }
};

export default function Page() {
  const [rooms, setRooms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRooms() {
      try {
        const res = await fetch("/api/rooms");
        const data = await res.json();
        if (data.success) {
          setRooms(data.rooms);
        }
      } catch (err) {
        console.error("Failed to fetch rooms", err);
      } finally {
        setLoading(false);
      }
    }
    fetchRooms();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        Loading...
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 w-full min-h-screen items-center pt-30 justify-start bg-gray-100 p-4">
      {rooms.map((room) => (
        <Link
          key={room._id}
          href={`/rooms/${room._id}`}
          className="flex flex-col sm:flex-row w-full sm:w-[800px] bg-white shadow-lg rounded-3xl overflow-hidden border hover:shadow-xl transition cursor-pointer"
        >
          {/* Image Section */}
          <div className="flex-shrink-0 w-full sm:w-1/3 h-64 overflow-hidden">
            <img
              className="object-cover w-full h-full rounded-l-3xl"
              src={room.images[0]}
              alt={room.roomOwner}
            />
          </div>

          {/* Details */}
          <div className="p-6 flex flex-col justify-between w-full sm:w-2/3">
            <div>
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-800">
                  {room.nearByCentre}
                </h2>
                <div className="flex items-center text-yellow-500">
                  <FaStar className="mr-1" />
                  <span className="font-semibold">4.5</span>
                </div>
              </div>

              <p className="text-sm text-gray-400 mt-1">
                Room Owner: {room.roomOwner}
              </p>
              <p className="text-gray-600 mt-1">
                {room.address.city}, {room.address.state}
              </p>

              <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                <div className="flex items-center">
                  <FaUsers className="mr-1 text-lg text-gray-700" />
                  <span>{room.noOfPeople} People</span>
                </div>
                {room.currentlocation?.latitude &&
                  room.currentlocation?.longitude && (
                    <button
                      className="flex items-center text-blue-600 hover:text-blue-800"
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent Link navigation
                        window.open(
                          `https://www.google.com/maps?q=${room.currentlocation.latitude},${room.currentlocation.longitude}`,
                          "_blank"
                        );
                      }}
                    >
                      <FaMapMarkerAlt className="mr-1" />
                      View on Map
                    </button>
                  )}
              </div>

              {/* Amenities */}
              <div className="flex flex-wrap gap-4 mt-4">
                {room.amenities.map((amenity: string, index: number) => {
                  const { Icon, label } = getAmenityDetails(amenity);
                  return (
                    <div key={index} className="flex items-center text-sm text-gray-600">
                      {Icon && <Icon className="mr-1 text-lg" />}
                      <span>{label}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Price + Button */}
            <div className="flex justify-between items-center mt-4">
              <p className="text-lg font-semibold text-green-600">
                ₹{room.pricePerHour} / hour
              </p>
              <button className="bg-blue-600 text-white px-5 py-2 rounded-full hover:bg-blue-700">
                Book Now
              </button>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}