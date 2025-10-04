'use client'
import { useEffect, useState, Suspense } from "react"
import TvIcon from '@mui/icons-material/Tv';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import StarIcon from '@mui/icons-material/Star';
import LocalParkingIcon from '@mui/icons-material/LocalParking';
import { Chip } from "@mui/material";
import { toast } from "sonner";
import { useSearchParams } from "next/navigation";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import React from 'react'
import { FanIcon, AirVentIcon, WifiIcon } from "lucide-react";
import { IRoom } from "@/schema/room";


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

function RoomsPageContent() {
    const searchParams = useSearchParams();
    const centerQuery = searchParams.get("center")?.toLowerCase() || "";
    const cityQuery = searchParams.get("city")?.toLowerCase() || "";
    const guestsQuery = Number(searchParams.get("guests") || 0);

    const [rooms, setRooms] = useState<IRoom[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchRoom() {
            try {
                const response = await fetch('/api/rooms');
                const data = await response.json();
                if (data.success) {
                    // filter rooms according to query params
                    const filtered = data.rooms.filter((room: IRoom) => {
                        const matchesCenter = centerQuery ? room.nearByCentre.toLowerCase().includes(centerQuery) : true;
                        const matchesCity = cityQuery ? room.address.city.toLowerCase().includes(cityQuery) : true;
                        const matchesGuests = guestsQuery ? room.noOfPeople >= guestsQuery : true;
                        return matchesCenter && matchesCity && matchesGuests;
                    });
                    setRooms(filtered);
                }
            } catch (error) {
                console.error("Error fetching rooms:", error);
            } finally {
                setLoading(false);
            }
        }
        fetchRoom();
    }, [centerQuery, cityQuery, guestsQuery]);


    // Prepare locations for map (This part is not used in the current component, but if it were, 'rooms' should be used instead of 'filteredRooms')
    const roomLocations = rooms
        .filter((room) => room.currentlocation?.latitude && room.currentlocation?.longitude)
        .map((room) => ({
            lat: room.currentlocation.latitude,
            lng: room.currentlocation.longitude,
            name: room.roomOwner,
            nearByCentre: room.nearByCentre,
            price: room.pricePerHour,
            id : String(room._id)
        }));

    if (loading) {
        return <div className=" items-center justify-center flex h-screen">Loading...</div>
    }
    return (
  <div className="w-full min-h-screen bg-gray-100 p-4 flex flex-col items-center pt-20">
    {/* Rooms + Filters Container */}
    <div className="w-full max-w-6xl bg-white rounded-xl shadow-lg overflow-hidden flex flex-col md:flex-row">
      {/* Filter Section */}
      <div className="w-full md:w-64 border-b md:border-b-0 md:border-r p-4">
        {/* Add your filters here */}
      </div>

      {/* Room Card Section */}
      <div className="flex-1 p-6 flex flex-col gap-6 items-center">
        {rooms.length > 0 ? (
          rooms.map((room) => (
            <Link
              href={`/rooms/${room._id}`}
              onClick={(e) => {
                if (!room.isAvailable) { // Prevent navigation if room is unavailable
                  e.preventDefault();
                  toast.error("This room is currently not available.");
                }
              }}
              key={String(room._id)}
              className="flex flex-col sm:flex-row w-full bg-white shadow-md rounded-2xl overflow-hidden border hover:shadow-xl transition-shadow duration-300"
            >
              {/* Image */}
              <div className="flex-shrink-0 w-full sm:w-1/3 h-64 overflow-hidden">
                <Image
                  src={room.images[0] || '/image/login.png'}
                  alt={room.roomOwner}
                  width={400}
                  height={256}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Details */}
              <div className="p-6 flex flex-col justify-between w-full sm:w-2/3">
                {/* Room Info */}
                <div>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h2 className="text-2xl font-bold text-gray-800">
                        {room.nearByCentre}
                      </h2>
                      <p className="text-sm text-gray-400 mt-1">
                        Room Owner: {room.roomOwner}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <Chip label={room.isAvailable ? "Available" : "Unavailable"} color={room.isAvailable ? "success" : "error"} size="small" />
                      <div className="flex items-center text-yellow-500"><StarIcon className="mr-1" /><span>4.5</span></div>
                    </div>
                  </div>

                  <p className="text-gray-600 mt-1">
                    {room.address.street}, {room.address.city}, {room.address.state} - {room.address.pincode}
                  </p>

                  <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                    <div className="flex items-center">
                      <GroupAddIcon className="mr-1" />
                      <span>{room.noOfPeople} People</span>
                    </div>
                    {room.currentlocation.latitude && room.currentlocation.longitude && (
                      <button
                        className="flex items-center text-purple-600 hover:text-purple-700 cursor-pointer"
                        onClick={() => {
                          window.open(
                            `https://www.google.com/maps?q=${room.currentlocation.latitude},${room.currentlocation.longitude}`,
                            '_blank'
                          );
                        }}
                      >
                        <LocationOnIcon className="mr-1" />
                        <span>View on Map</span>
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

                {/* Price & Book */}
                <div className="mt-4 flex items-center justify-between">
                  <p className="text-lg font-semibold text-purple-700">
                    ₹{room.pricePerHour} / hour
                  </p>
                  <button className="bg-purple-600 text-white px-5 py-2 rounded-lg hover:bg-purple-700 transition-colors duration-300">
                    Book Now
                  </button>
                </div>
              </div>
            </Link>
          ))
        ) : (
          <div className="text-gray-600 mt-6">No rooms available.</div>
        )}
      </div>
    </div>

    {/* Map Section */}
    <div className="w-full h-[600px] max-w-6xl mt-10 bg-white rounded-xl shadow-lg p-4">
      <h2 className="text-xl font-semibold mb-4">Rooms on Map</h2>
      <div className="w-full h-[500px] overflow-hidden">
      {roomLocations.length > 0 ? (
        <StudentStayMap locations={roomLocations} />
      ) : (
        <p className="text-gray-500">No locations to show on map.</p>
      )}
      </div>
    </div>
  </div>
);

}

export default function RoomsPage() {
  return (
    <Suspense fallback={<div className=" items-center justify-center flex h-screen">Loading rooms...</div>}>
      <RoomsPageContent />
    </Suspense>
  );
}
