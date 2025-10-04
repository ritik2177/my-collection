"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

interface Location {
  lat: number;
  lng: number;
  name: string;
  price: number;
  nearByCentre: string;
  id: string;
}

interface MapProps {
  locations: Location[];
}

export default function StudentStayMap({ locations }: MapProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Fix marker icon issue in Next.js by initializing it on the client
  const customIcon = new L.Icon({
    iconUrl: "https://unpkg.com/leaflet/dist/images/marker-icon.png",
    iconRetinaUrl: "https://unpkg.com/leaflet/dist/images/marker-icon-2x.png",
    shadowUrl: "https://unpkg.com/leaflet/dist/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
  });

  // Center map on first location or fallback
  const center: [number, number] =
    locations.length > 0 ? [locations[0].lat, locations[0].lng] : [0, 0];

  if (!isClient) {
    return null; // Render nothing on the server
  }

  return (
    <div className="w-full h-[500px]">
      <MapContainer center={center} zoom={13} style={{ height: "100%", width: "100%" }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        {/* Render markers with popup info */}
        {locations.map((loc, idx) => (
          <Marker
            key={loc.id || idx}
            position={[loc.lat, loc.lng]}
            icon={customIcon}
            eventHandlers={{
              mouseover: (e) => e.target.openPopup(),
              // mouseout: (e) => e.target.closePopup(),
            }}
          >
            <Popup>
              <div>
                <p className=" font-semibold ">Near by centre: {loc.nearByCentre}</p>
                <h3 className="text-gray-600 ">Owner: {loc.name}</h3>
                <p className="text-green-600">₹{loc.price} / hour</p>
                {/* <p>Lat: {loc.lat.toFixed(4)}, Lng: {loc.lng.toFixed(4)}</p> */}
                <button
                  className="flex items-center text-blue-600 hover:text-blue-800"
                  onClick={(e) => {
                    e.stopPropagation();
                    window.open(
                      `https://www.google.com/maps?q=${loc.lat},${loc.lng}`,
                      "_blank"
                    );
                  }}
                >
                  Click here for direction.
                </button>
              </div>
            </Popup>
          </Marker>
        ))}

      </MapContainer>
    </div>
  );
}
