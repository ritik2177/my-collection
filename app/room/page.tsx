"use client";

import { useSession } from "next-auth/react";
import { useState } from "react";

export default function RoomForm() {
  const { data: session } = useSession();

  const [form, setForm] = useState({
    title: "",
    nearByCentre: "",
    street: "",
    city: "",
    state: "",
    pincode: "",
    pricePerHour: "",
    noOfPeople: "",
  });

  const [amenities, setAmenities] = useState<string[]>([]);
  const [images, setImages] = useState<(File | null)[]>([null, null, null, null]);
  const [location, setLocation] = useState({ latitude: 0, longitude: 0 });

  const handleAmenityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    if (checked) {
      setAmenities((prev) => [...prev, value]);
    } else {
      setAmenities((prev) => prev.filter((item) => item !== value));
    }
  };

  const handleImageChange = (index: number, file: File | null) => {
    const updated = [...images];
    updated[index] = file;
    setImages(updated);
  };

  const handleLocation = () => {
    navigator.geolocation.getCurrentPosition((position) => {
      setLocation({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      });
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session?.user?.id) return alert("Login required");

    for (const key in form) {
      if (form[key as keyof typeof form] === "") {
        alert(`Please fill out the ${key} field.`);
        return;
      }
    }

    if (images.every((img) => img === null)) {
      alert("Please upload at least one image.");
      return;
    }

    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      formData.append(key, value);
    });

    formData.append("currentlatitude", location.latitude.toString());
    formData.append("currentlongitude", location.longitude.toString());
    formData.append("amenities", JSON.stringify(amenities));
    formData.append("userId", session.user.id);

    images.forEach((img) => {
      if (img) formData.append("images", img); // ✅ Use "images" as key for all
    });

    const res = await fetch("/api/rooms", {
      method: "POST",
      body: formData,
    });

    if (res.ok) alert("Room created!");
    else alert("Failed to create room");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 p-6 max-w-xl mx-auto bg-white rounded-xl shadow-lg mt-40"
    >
      <input onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Title" className="input" />
      <input onChange={(e) => setForm({ ...form, nearByCentre: e.target.value })} placeholder="Nearby Centre" className="input" />
      <input onChange={(e) => setForm({ ...form, street: e.target.value })} placeholder="Street" className="input" />
      <input onChange={(e) => setForm({ ...form, city: e.target.value })} placeholder="City" className="input" />
      <input onChange={(e) => setForm({ ...form, state: e.target.value })} placeholder="State" className="input" />
      <input onChange={(e) => setForm({ ...form, pincode: e.target.value })} placeholder="Pincode" className="input" />
      <input onChange={(e) => setForm({ ...form, pricePerHour: e.target.value })} placeholder="Price Per Hour" className="input" />
      <input onChange={(e) => setForm({ ...form, noOfPeople: e.target.value })} placeholder="No Of People" className="input" />

      <div className="flex gap-4 flex-wrap">
        {["AC", "Wifi", "Parking", "Water", "Fan"].map((item) => (
          <label key={item} className="flex items-center gap-1">
            <input type="checkbox" value={item} onChange={handleAmenityChange} />
            {item}
          </label>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-4">
        {[0, 1, 2, 3].map((i) => (
          <input
            key={i}
            type="file"
            accept="image/*"
            onChange={(e) => handleImageChange(i, e.target.files?.[0] ?? null)}
            className="file-input"
          />
        ))}
      </div>

      <button type="button" onClick={handleLocation} className="bg-blue-500 text-white px-4 py-2 rounded">
        Use My Location
      </button>

      <button type="submit" className="bg-green-600 text-white px-6 py-2 rounded">
        Submit Room
      </button>
    </form>
  );
}
