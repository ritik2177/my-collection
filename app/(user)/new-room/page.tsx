"use client";
import React, { useState } from "react";
import { useSession } from "next-auth/react";
import AddBoxOutlinedIcon from "@mui/icons-material/AddBoxOutlined";
import AddLocationAltOutlinedIcon from "@mui/icons-material/AddLocationAltOutlined";
import AddHomeOutlinedIcon from "@mui/icons-material/AddHomeOutlined";
import { toast } from "sonner";

export default function NewRoom() {
  const { data: session } = useSession();
  const [previews, setPreviews] = useState<(string | null)[]>([null, null, null, null]);
  const [images, setImages] = useState<(File | null)[]>([null, null, null, null]);
  const [formData, setFormData] = useState({
    title: "",
    nearByCentre: "",
    street: "",
    city: "",
    state: "",
    pincode: "",
    noOfPeople: "",
    pricePerHour: "",
    description: "",
    amenities: [] as string[],
  });

  const handleImageChange = (index: number, file: File | null) => {
    if (file) {
      const newPreviews = [...previews];
      const newFiles = [...images];
      newPreviews[index] = URL.createObjectURL(file);
      newFiles[index] = file;
      setPreviews(newPreviews);
      setImages(newFiles);
    }
  };

  const handleCheckbox = (amenity: string) => {
    setFormData((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter((a) => a !== amenity)
        : [...prev.amenities, amenity],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session?.user?.id) {
      toast.warning("Please log in to add a room.");
      return;
    }

    try {
      const data = new FormData();
      images.forEach((img) => {
        if (img) data.append("images", img);
      });
      Object.keys(formData).forEach((key) => {
        if (key === "amenities") {
          data.append("amenities", JSON.stringify(formData.amenities)); 
        } else {
          data.append(key, (formData as any)[key]);
        }
      });
      data.append("userId", session.user.id);

      const res = await fetch("/api/rooms", {
        method: "POST",
        body: data,
      });

      if (res.ok) {
        toast.success("Room added successfully ✅");
      } else {
        toast.error("Failed to add room ❌");
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong ❌");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mx-6 md:mx-10">
      <h1 className="font-semibold flex text-5xl text-purple-600 mt-24">
        <AddBoxOutlinedIcon
          style={{ fontSize: "3rem", fontWeight: "5rem", marginRight: "8px" }}
        />
        <span>ADD NEW ROOM</span>
      </h1>
      <p className="text-lg font-semibold mt-5 md:w-8/12">
        If your room is near to any examination center, you can list your room here and it help those students who have really need to rent affordable room. 
      </p>

      {/* Upload Images */}
      <div className="flex flex-wrap gap-4 mt-6">
        <div className="w-full md:w-6/12">
          <h3 className="text-purple-600 text-2xl font-semibold mt-6 pl-4">
            Click and upload your room pictures
          </h3>
          <div className="flex flex-wrap gap-4 p-4">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="relative">
                <label
                  htmlFor={`imageUpload-${i}`}
                  className="w-28 aspect-square border-2 border-dashed border-gray-400 rounded-xl flex items-center justify-center cursor-pointer overflow-hidden"
                >
                  {previews[i] ? (
                    <img
                      src={previews[i] ?? ""}
                      alt={`Preview ${i + 1}`}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-gray-500 text-sm text-center">
                      Click <br /> to upload
                    </span>
                  )}
                </label>
                <input
                  type="file"
                  id={`imageUpload-${i}`}
                  accept="image/*"
                  onChange={(e) => handleImageChange(i, e.target.files?.[0] ?? null)}
                  className="hidden"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Room Title */}
        <div className="w-full md:w-4/12 md:mt-8">
          <h4 className="text-black text-1xl font-semibold mt-6 pl-4">
            Room Name
          </h4>
          <input
            className="border-2 border-gray-400 rounded-md p-2 mt-2 w-full md:w-[265px]"
            type="text"
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          />
          <h4 className="text-black text-1xl font-semibold mt-4 pl-4">
            Nearby Centre
          </h4>
          <input
            className="border-2 border-gray-400 rounded-md p-2 mt-2 w-full md:w-[265px]"
            type="text"
            placeholder="e.g., ION Digital Zone"
            onChange={(e) =>
              setFormData({ ...formData, nearByCentre: e.target.value })
            }
          />
        </div>
      </div>

      {/* Address */}
      <h3 className="text-purple-600 text-2xl font-semibold mt-6">
        Address
      </h3>
      <div className="flex flex-wrap gap-4 mt-3">
        <div className="w-full md:w-4/12">
          <p className="text-lg font-semibold">Street Name</p>
          <input
            type="text"
            placeholder="Street Name"
            className="border-2 border-gray-400 rounded-md w-full p-2 mt-2"
            onChange={(e) => setFormData({ ...formData, street: e.target.value })}
          />
        </div>
        <div className="w-full md:w-3/12">
          <p className="text-lg font-semibold">City Name</p>
          <input
            type="text"
            placeholder="City Name"
            className="border-2 border-gray-400 rounded-md w-full p-2 mt-2"
            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
          />
        </div>
        <div className="w-full md:w-3/12">
          <p className="text-lg font-semibold">State Name</p>
          <input
            type="text"
            placeholder="State Name"
            className="border-2 border-gray-400 rounded-md w-full p-2 mt-2"
            onChange={(e) => setFormData({ ...formData, state: e.target.value })}
          />
        </div>
        <div className="w-full md:w-1/12">
          <p className="text-lg font-semibold">PIN Code</p>
          <input
            type="text"
            placeholder="PIN Code"
            className="border-2 border-gray-400 rounded-md w-full p-2 mt-2"
            onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
          />
        </div>
      </div>

      {/* Amenities + People + Cost + Description */}
      <div className="flex flex-wrap gap-4 mt-10">
        <div className="w-full md:w-3/12 pl-4">
          <h3 className="text-purple-600 text-2xl font-semibold">
            Amenities
          </h3>
          {["Wifi", "Fan", "AC", "Parking"].map((a) => (
            <div key={a} className="items-center pt-3">
              <input
                type="checkbox"
                className="form-checkbox h-5 w-5"
                checked={formData.amenities.includes(a)}
                onChange={() => handleCheckbox(a)}
              />
              <span className="ml-2 text-gray-700">{a}</span>
            </div>
          ))}
        </div>

        <div className="w-full md:w-4/12">
          <div>
            <h3 className="text-purple-600 text-2xl font-semibold">
              No of people
            </h3>
            <input
              className="border-2 border-gray-400 rounded-md p-2 mt-2 w-full md:w-[265px]"
              type="text"
              placeholder="No of people"
              onChange={(e) =>
                setFormData({ ...formData, noOfPeople: e.target.value })
              }
            />
          </div>
          <div>
            <h3 className="text-purple-600 text-2xl font-semibold mt-6">
              Cost according per hour
            </h3>
            <input
              className="border-2 border-gray-400 rounded-md p-2 mt-2 w-full md:w-[265px]"
              type="text"
              placeholder="Cost according per hour"
              onChange={(e) =>
                setFormData({ ...formData, pricePerHour: e.target.value })
              }
            />
          </div>
        </div>

        <div className="w-full md:w-3/12">
          <h3 className="text-purple-600 text-2xl font-semibold">
            Description
          </h3>
          <textarea
            rows={6}
            className="border-2 border-gray-400 rounded-md p-2 mt-2 w-full"
            placeholder="Description"
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
          />
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-wrap items-center justify-center py-10 gap-6">
        <button type="button" className="bg-purple-600 text-white px-10 py-2 rounded-md hover:bg-purple-700 flex items-center gap-2">
          <AddLocationAltOutlinedIcon />
          <span>ADD LOCATION</span>
        </button>
        <button
          type="submit"
          className="bg-green-700 text-white px-10 py-2 rounded-md hover:bg-green-800 flex items-center gap-2"
        >
          <AddHomeOutlinedIcon />
          <span>ADD YOUR ROOM</span>
        </button>
      </div>
    </form>
  );
}
