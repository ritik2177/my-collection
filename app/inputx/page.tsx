 //'use client'

// import { useState } from "react";


// export default function GetLocation() {
//   const [location, setLocation] = useState({ latitude: 0, longitude: 0 });

//   const getLocation = () => {
//     if ("geolocation" in navigator) {
//       navigator.geolocation.getCurrentPosition((position) => {
//         setLocation({
//           latitude: position.coords.latitude,
//           longitude: position.coords.longitude,
//         });
//       }, (error) => {
//         console.error("Location error:", error);
//       });
//     } else {
//       alert("Geolocation not supported");
//     }
//   };
//   return (
//     <div>
//       <button type="button" onClick={getLocation}>Use My Location</button>
//       <button type="submit">Submit</button>
//       <p>Latitude: {location.latitude}</p>
//       <p>Longitude: {location.longitude}</p>
//     </div>
//   );
// };

"use client";
import React, { useState } from "react";

export default function ImageUploadBox() {
  const [preview, setPreview] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    const file = files && files[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <label
        htmlFor="imageUpload"
        className="w-64 aspect-square border-2 border-dashed border-gray-400 rounded-xl flex items-center justify-center cursor-pointer overflow-hidden"
      >
        {preview ? (
          <img
            src={preview}
            alt="Preview"
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="text-gray-500">Click to upload</span>
        )}
      </label>

      <input
        type="file"
        id="imageUpload"
        accept="image/*"
        onChange={handleImageChange}
        className="hidden"
      />
    </div>
  );
}

