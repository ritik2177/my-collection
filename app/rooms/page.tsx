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
import { BorderBeam } from "@/components/ui/border-beam"



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

    const [allRooms, setAllRooms] = useState<IRoom[]>([]);
    const [filteredRooms, setFilteredRooms] = useState<IRoom[]>([]);
    const [loading, setLoading] = useState(true);

    // Filter states
    const [selectedPeople, setSelectedPeople] = useState<number | null>(null);
    const [selectedPrice, setSelectedPrice] = useState<number | null>(null);
    const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
    const [isFilterVisible, setIsFilterVisible] = useState(false);

    useEffect(() => {
        async function fetchRoom() {
            try {
                const response = await fetch('/api/rooms');
                const data = await response.json();
                if (data.success) {
                    setAllRooms(data.rooms);
                }
            } catch (error) {
                console.error("Error fetching rooms:", error);
                toast.error("Failed to fetch rooms.");
            } finally {
                setLoading(false);
            }
        }
        fetchRoom();
    }, []);

    useEffect(() => {
        const filtered = allRooms.filter((room: IRoom) => {
            const matchesCenter = centerQuery ? room.nearByCentre.toLowerCase().includes(centerQuery) : true;
            const matchesCity = cityQuery ? room.address.city.toLowerCase().includes(cityQuery) : true;
            const initialGuestsQuery = guestsQuery > 0 ? room.noOfPeople >= guestsQuery : true;

            const matchesPeople = selectedPeople !== null ? (selectedPeople === 5 ? room.noOfPeople > 4 : room.noOfPeople === selectedPeople) : true;
            const matchesPrice = selectedPrice !== null ? room.pricePerHour <= selectedPrice : true;
            const normalizeAmenity = (a: string) => a.trim().toLowerCase();
            const matchesAmenities = selectedAmenities.length > 0
                ? selectedAmenities.every(a =>
                    room.amenities.map(normalizeAmenity).includes(normalizeAmenity(a))
                  )
                : true;

            return matchesCenter && matchesCity && initialGuestsQuery && matchesPeople && matchesPrice && matchesAmenities;
        });
        setFilteredRooms(filtered);
    }, [centerQuery, cityQuery, guestsQuery, allRooms, selectedPeople, selectedPrice, selectedAmenities]);

    const handleAmenityChange = (amenity: string) => {
        setSelectedAmenities(prev =>
            prev.includes(amenity) ? prev.filter(a => a !== amenity) : [...prev, amenity]
        );
    };

    // Prepare locations for map (This part is not used in the current component, but if it were, 'rooms' should be used instead of 'filteredRooms')
    const roomLocations = filteredRooms
        .filter((room) => room.currentlocation?.latitude && room.currentlocation?.longitude)
        .map((room) => ({
            lat: room.currentlocation.latitude,
            lng: room.currentlocation.longitude,
            name: room.roomOwner,
            nearByCentre: room.nearByCentre,
            price: room.pricePerHour,
            id : String(room._id)
        }));

    const peopleOptions = [
        { label: "1 Person", value: 1 },
        { label: "2 People", value: 2 },
        { label: "3 People", value: 3 },
        { label: "4 People", value: 4 },
        { label: "More than 4", value: 5 },
    ];

    const priceOptions = [
        { label: "Under ₹50", value: 50 },
        { label: "Under ₹80", value: 80 },
        { label: "Under ₹100", value: 100 },
        { label: "Under ₹200", value: 200 },
    ];

    const amenityOptions = ["Wifi", "Fan", "AC", "Parking"];

    if (loading) {
        return <div className=" items-center justify-center flex h-screen">Loading...</div>
    }
    return (
  <div className="w-full min-h-screen text-foreground p-4 flex flex-col items-center sm:pt-30 lg:pt-30">
    {/* Filter Toggle Button for Mobile */}
    <div className="w-full max-w-6xl md:hidden mb-4">
        <button
            onClick={() => setIsFilterVisible(!isFilterVisible)}
            className="w-full py-2.5 bg-gray-700 text-white rounded-lg shadow-xl hover:bg-gray-600 transition-colors"
        >
            {isFilterVisible ? 'Hide Filters' : 'Show Filters'}
        </button>
    </div>

    {/* Rooms + Filters Container */}
    <div className="relative w-full max-w-6xl rounded-xl shadow-lg shadow-purple-500/20 border-1 border-purple-600 overflow-hidden flex flex-col md:flex-row">
       <BorderBeam
                  duration={12}
                  delay={300}
                  size={1000}
                  borderWidth={2}
                  className="rounded-2xl"
                />
       {/* Filter Section */}
       <div className={`${isFilterVisible ? 'block' : 'hidden'} md:block w-full md:w-80 border-b md:border-b-0 md:border-r border-border p-6 bg-gray-800`}>
        <h3 className="text-xl font-bold mb-4">Filters</h3>

        {/* People Filter */}
        <div className="mb-6">
          <h4 className="font-semibold mb-2">Number of People</h4>
          <div className="flex flex-col gap-2">
            {peopleOptions.map(opt => (
              <label key={opt.value} className="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="people" value={opt.value} checked={selectedPeople === opt.value} onChange={() => setSelectedPeople(opt.value)} className="form-radio" />
                {opt.label}
              </label>
            ))}
          </div>
        </div>

        {/* Price Filter */}
        <div className="mb-6">
          <h4 className="font-semibold mb-2">Price per Hour</h4>
          <div className="flex flex-col gap-2">
            {priceOptions.map(opt => (
              <label key={opt.value} className="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="price" value={opt.value} checked={selectedPrice === opt.value} onChange={() => setSelectedPrice(opt.value)} className="form-radio" />
                {opt.label}
              </label>
            ))}
          </div>
        </div>

        {/* Amenities Filter */}
        <div className="mb-6">
          <h4 className="font-semibold mb-2">Amenities</h4>
          <div className="grid grid-cols-2 gap-2">
            {amenityOptions.map(amenity => (
              <label key={amenity} className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" value={amenity} checked={selectedAmenities.includes(amenity)} onChange={() => handleAmenityChange(amenity)} className="form-checkbox" />
                {amenity}
              </label>
            ))}
          </div>
        </div>

        <button 
          onClick={() => { setSelectedPeople(null); setSelectedPrice(null); setSelectedAmenities([]); }}
          className="w-full py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 transition-colors"
        >
          Clear All Filters
        </button>
      </div>

      {/* Room Card Section */}
      <div className="flex-1 p-6 flex flex-col gap-6 items-center">
        {filteredRooms.length > 0 ? (
          filteredRooms.map((room) => (
            <Link
              href={`/rooms/${room._id}`}
              onClick={(e) => {
                if (!room.isAvailable) { // Prevent navigation if room is unavailable
                  e.preventDefault();
                  toast.error("This room is currently not available.");
                }
              }}
              key={String(room._id)}
              className="relative flex flex-col sm:flex-row w-full bg-gray-800 shadow-md rounded-2xl overflow-hidden hover:shadow-xl transition-shadow duration-300 border"
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
                      <h2 className="text-2xl font-bold text-foreground">
                        {room.nearByCentre}
                      </h2>
                      <p className="text-sm text-muted-foreground mt-1">
                        Room Owner: {room.roomOwner}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <Chip label={room.isAvailable ? "Available" : "Unavailable"} color={room.isAvailable ? "success" : "error"} size="small" />
                      <div className="flex items-center text-yellow-500"><StarIcon className="mr-1" /><span>4.5</span></div>
                    </div>
                  </div>

                  <p className="text-muted-foreground mt-1">
                    {room.address.street}, {room.address.city}, {room.address.state} - {room.address.pincode}
                  </p>

                  <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                    <div className="flex items-center">
                      <GroupAddIcon className="mr-1" />
                      <span>{room.noOfPeople} People</span>
                    </div>
                    {room.currentlocation.latitude && room.currentlocation.longitude && (
                      <button
                        className="flex items-center text-purple-600 hover:text-purple-700 cursor-pointer"
                        onClick={(e) => { e.stopPropagation(); e.preventDefault();
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
                        <div key={index} className="flex items-center text-sm text-muted-foreground">
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
                  <button className="relative text-white px-5 py-2 rounded-lg transition-colors duration-300">
                    Book Now
                    <BorderBeam
                  duration={12}
                  delay={300}
                  size={150}
                  borderWidth={2}
                  className="from-transparent via-purple-500 to-transparent rounded-2xl"
                />
                  </button>
                </div>
                
              </div>
              <BorderBeam
                  duration={12}
                  delay={300}
                  size={450}
                  borderWidth={2}
                  className="from-transparent via-purple-500 to-transparent rounded-2xl"
                />
            </Link>
          ))
        ) : (
          <div className="text-muted-foreground mt-6">No rooms available.</div>
        )}
      </div>
    </div>

    {/* Map Section */}
    <div className="w-full h-[600px] max-w-6xl mt-10 rounded-xl border-2 border-purple-500 shadow-lg shadow-purple-500/30 p-4">
      <h2 className="text-xl font-semibold mb-4">Rooms on Map</h2>
      <div className="w-full h-[500px] overflow-hidden">
      {roomLocations.length > 0 ? (
        <StudentStayMap locations={roomLocations} />
      ) : (
        <p className="text-muted-foreground">No locations to show on map.</p>
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
