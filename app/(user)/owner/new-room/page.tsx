"use client";
import React, { useState } from "react";
import Image from "next/image";
import { useSession } from "next-auth/react";
import AddBoxOutlinedIcon from "@mui/icons-material/AddBoxOutlined";
import RoomRoundedIcon from '@mui/icons-material/RoomRounded';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import CircularProgress from "@mui/material/CircularProgress";
import { toast } from "sonner";

interface IFormData {
  roomOwner: string;
  nearByCentre: string;
  street: string;
  city: string;
  state: string;
  pincode: string;
  noOfPeople: string;
  pricePerHour: string;
  description: string;
  dist_btw_room_and_centre: string;
  amenities: string[];
}

export default function NewRoom() {
  const { data: session } = useSession();
  const [previews, setPreviews] = useState<(string | null)[]>([null, null, null, null]);
  const [images, setImages] = useState<(File | null)[]>([null, null, null, null]);

  // Loading states
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [loadingRoom, setLoadingRoom] = useState(false);

  const [formData, setFormData] = useState<IFormData>({
    roomOwner: "",
    nearByCentre: "",
    street: "",
    city: "",
    state: "",
    pincode: "",
    noOfPeople: "",
    pricePerHour: "",
    description: "",
    dist_btw_room_and_centre: "",
    amenities: [] as string[],
  });

  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);

  // handle image upload preview
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

  // checkbox for amenities
  const handleCheckbox = (amenity: string) => {
    setFormData((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter((a) => a !== amenity)
        : [...prev.amenities, amenity],
    }));
  };

  // handle location button
  const handleLocation = () => {
    setLoadingLocation(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
        toast.success("Location added ");
        setLoadingLocation(false);
      },
      (error) => {
        toast.error("Failed to get location ");
        setLoadingLocation(false);
        console.error(error);
      }
    );
  };

  // handle form submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session?.user?.id) {
      toast.warning("Please log in to add a room.");
      return;
    }

    setLoadingRoom(true);

    try {
      const data = new FormData();
      images.forEach((img) => {
        if (img) data.append("images", img);
      });
      Object.keys(formData).forEach((key) => {
        if (key === "amenities") {
          data.append("amenities", JSON.stringify(formData.amenities));
        } else {
          data.append(key, formData[key as keyof Omit<IFormData, 'amenities'>]);
        }
      });
      data.append("userId", session.user.id);

      if (location) {
        data.append("currentlatitude", location.latitude.toString());
        data.append("currentlongitude", location.longitude.toString());
      }

      const res = await fetch("/api/rooms", {
        method: "POST",
        body: data,
      });

      if (res.ok) {
        toast.success("Room added successfully ");

        // reset form
        setFormData({
          roomOwner: "",
          nearByCentre: "",
          street: "",
          city: "",
          state: "",
          pincode: "",
          noOfPeople: "",
          pricePerHour: "",
          description: "",
          dist_btw_room_and_centre: "",
          amenities: [],
        });
        setPreviews([null, null, null, null]);
        setImages([null, null, null, null]);
        setLocation(null);
      } else {
        toast.error("Failed to add room ");
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong ");
    } finally {
      setLoadingRoom(false);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="px-6 md:px-10  text-foreground pt-20">
        <h1 className="font-semibold flex text-3xl md:text-5xl text-purple-600 pt-33 md:pt-24">
          <AddBoxOutlinedIcon
            style={{ fontSize: "3rem", fontWeight: "5rem", marginRight: "8px" }}
          />
          <span>ADD NEW ROOM</span>
        </h1>
        <p className="text-sm md:text-lg font-semibold mt-2 md:mt-5 w-full md:w-8/12">
          If your room is near an examination center, you can list your room
          here and it help those students who have really need to rent affordable
          room.
        </p>

        {/* Upload Images */}
        <div className="flex flex-wrap gap-4 mt-6">
          <div className="w-full md:w-6/12">
            <h3 className="text-primary text-xl md:text-2xl font-semibold mt-6 pl-4">
              Click and upload your room pictures
            </h3>
            <div className="justify-center flex flex-wrap gap-4 p-4">
              {[0, 1, 2, 3].map((i) => (
                <div key={i} className="relative">
                  <label
                    htmlFor={`imageUpload-${i}`}
                    className="w-28 aspect-square border-2 border-dashed border-border rounded-xl flex items-center justify-center cursor-pointer overflow-hidden bg-card hover:bg-card/80"
                  >
                    {previews[i] ? (
                      <Image
                        src={previews[i] ?? ""}
                        alt={`Preview ${i + 1}`}
                        width={112}
                        height={112}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-muted-foreground text-sm text-center">
                        Click <br /> to upload
                      </span>
                    )}
                  </label>
                  <input
                    type="file"
                    id={`imageUpload-${i}`}
                    accept="image/*"
                    onChange={(e) =>
                      handleImageChange(i, e.target.files?.[0] ?? null)
                    }
                    className="hidden"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Room roomOwner */}
          <div className="w-full md:w-5/12 md:mt-8 flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="w-full sm:w-1/2">
                <h4 className="text-foreground text-1xl font-semibold">
                  Room owner full Name
                </h4>
                <input
                  className="border-2 bg-transparent border-border rounded-md p-2 mt-2 w-full"
                  type="text"
                  placeholder="e.g., Ram lal yadav"
                  value={formData.roomOwner}
                  required
                  onChange={(e) => setFormData({ ...formData, roomOwner: e.target.value })}
                />
              </div>
              <div className="w-full sm:w-1/2">
                <h4 className="text-foreground text-1xl font-semibold">
                  Distance (in meters)
                </h4>
                <input
                  className="border-2 bg-transparent border-border rounded-md p-2 mt-2 w-full"
                  type="text"
                  value={formData.dist_btw_room_and_centre}
                  onChange={(e) =>
                    setFormData({ ...formData, dist_btw_room_and_centre: e.target.value })
                  }
                />
              </div>
            </div>
            <h4 className="text-foreground text-1xl font-semibold mt-4 ">
              Nearby Centre
            </h4>
            <input
              className="border-2 bg-transparent border-border rounded-md p-2 w-full"
              type="text"
              placeholder="e.g., ION Digital Zone"
              value={formData.nearByCentre}
              required
              onChange={(e) =>
                setFormData({ ...formData, nearByCentre: e.target.value })
              }
            />
          </div>
        </div>

        {/* Address */}
        <h3 className="text-primary text-xl md:text-2xl font-semibold mt-6">
          Address
        </h3>
        <div className="flex flex-wrap gap-4 mt-3">
          <div className="w-full md:w-4/12">
            <p className="text-lg font-semibold">Street Name</p>
            <input
              type="text"
              placeholder="Street Name"
              className="border-2 bg-transparent border-border rounded-md w-full p-2 mt-2"
              value={formData.street}
              onChange={(e) =>
                setFormData({ ...formData, street: e.target.value })
              }
            />
          </div>
          <div className="w-full md:w-3/12">
            <p className="text-lg font-semibold">City Name</p>
            <input
              type="text"
              placeholder="City Name"
              className="border-2 bg-transparent border-border rounded-md w-full p-2 mt-2"
              value={formData.city}
              onChange={(e) => setFormData({ ...formData, city: e.target.value })}
            />
          </div>
          <div className="w-full md:w-3/12">
            <p className="text-lg font-semibold">State Name</p>
            <input
              type="text"
              placeholder="State Name"
              className="border-2 bg-transparent border-border rounded-md w-full p-2 mt-2"
              value={formData.state}
              onChange={(e) => setFormData({ ...formData, state: e.target.value })}
            />
          </div>
          <div className="w-full md:w-1/12">
            <p className="text-lg font-semibold">PIN Code</p>
            <input
              type="text"
              placeholder="PIN Code"
              className="border-2 bg-transparent border-border rounded-md w-full p-2 mt-2"
              value={formData.pincode}
              onChange={(e) =>
                setFormData({ ...formData, pincode: e.target.value })
              }
            />
          </div>
        </div>

        {/* Amenities + People + Cost + Description */}
        <div className="flex flex-wrap gap-4 mt-10">
          <div className="w-full md:w-3/12 pl-4">
            <h3 className="text-primary text-xl md:text-2xl font-semibold">
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
                <span className="ml-2 text-foreground">{a}</span>
              </div>
            ))}
          </div>

          <div className="w-full md:w-4/12">
            <div>
              <h3 className="text-primary text-xl md:text-2xl font-semibold">
                No of people
              </h3>
              <input
                className="border-2 bg-transparent border-border rounded-md p-2 mt-2 w-full md:w-[265px]"
                type="text"
                placeholder="No of people"
                value={formData.noOfPeople}
                onChange={(e) =>
                  setFormData({ ...formData, noOfPeople: e.target.value })
                }
              />
            </div>
            <div>
              <h3 className="text-primary text-xl md:text-2xl font-semibold mt-6">
                Cost according per hour
              </h3>
              <input
                className="border-2 bg-transparent border-border rounded-md p-2 mt-2 w-full md:w-[265px]"
                type="text"
                placeholder="Cost according per hour"
                value={formData.pricePerHour}
                onChange={(e) =>
                  setFormData({ ...formData, pricePerHour: e.target.value })
                }
              />
            </div>
          </div>

          <div className="w-full md:w-3/12">
            <h3 className="text-primary text-xl md:text-2xl font-semibold">
              Description
            </h3>
            <textarea
              rows={6}
              className="border-2 bg-transparent border-border rounded-md p-2 mt-2 w-full"
              placeholder="Description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-wrap items-center justify-center py-10 gap-6">
          <button
            type="button"
            className="bg-purple-600 text-white px-10 py-2 rounded-md hover:bg-purple-700 flex items-center gap-2 disabled:opacity-70"
            onClick={handleLocation}
            disabled={loadingLocation}
          >
            {loadingLocation ? (
              <>
                <CircularProgress size={20} color="inherit" />
                <span>Fetching Location...</span>
              </>
            ) : (
              <>
                <RoomRoundedIcon />
                <span>ADD LOCATION</span>
              </>
            )}
          </button>

          <button
            type="submit"
            className="bg-green-700 text-white px-10 py-2 rounded-md hover:bg-green-800 flex items-center gap-2 disabled:opacity-70"
            disabled={loadingRoom}
          >
            {loadingRoom ? (
              <>
                <CircularProgress size={20} color="inherit" />
                <span>Adding Room...</span>
              </>
            ) : (
              <>
                <HomeRoundedIcon />
                <span>ADD YOUR ROOM</span>
              </>
            )}
          </button>
        </div>
      </form>
      {/* <Footer /> */}
    </>
  );
}
