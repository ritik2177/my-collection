'use client'

import { useState } from "react";


export default function GetLocation() {
  const [location, setLocation] = useState({ latitude: 0, longitude: 0 });

  const getLocation = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      }, (error) => {
        console.error("Location error:", error);
      });
    } else {
      alert("Geolocation not supported");
    }
  };
  return (
    <div>
      <button type="button" onClick={getLocation}>Use My Location</button>
      <button type="submit">Submit</button>
      <p>Latitude: {location.latitude}</p>
      <p>Longitude: {location.longitude}</p>
    </div>
  );
};


