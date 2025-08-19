import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Room from "@/schema/room";
import cloudinary from "@/lib/cloudinary";
import { Readable } from "stream";

// Disable body parsing for form-data
export const config = {
  api: {
    bodyParser: false,
  },
};

function uploadToCloudinary(buffer: Buffer): Promise<string> {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { resource_type: "image" },
      (error, result) => {
        if (error) return reject(error);
        resolve(result?.secure_url || "");
      }
    );
    Readable.from(buffer).pipe(stream);
  });
}

export async function POST(req: Request) {
  await dbConnect();
  const formData = await req.formData();

  try {
    const images: string[] = [];
    
    const imageFiles = formData.getAll("images") as File[];

    for (const file of imageFiles) {
      const buffer = Buffer.from(await file.arrayBuffer());
      const uploadedImageUrl = await uploadToCloudinary(buffer);
      images.push(uploadedImageUrl);
    }

    const room = await Room.create({
      title: formData.get("title") as string,
      nearByCentre: formData.get("nearByCentre") as string,
      address: {
        street: formData.get("street") as string,
        city: formData.get("city") as string,
        state: formData.get("state") as string,
        pincode: Number(formData.get("pincode")),
      },
      pricePerHour: Number(formData.get("pricePerHour")),
      currentlocation: {
        latitude: Number(formData.get("currentlatitude")),
        longitude: Number(formData.get("currentlongitude")),
      },

      amenities: JSON.parse(formData.get("amenities") as string),

      noOfPeople: Number(formData.get("noOfPeople")),
      images,
      userId: formData.get("userId") as string,
    });

    return NextResponse.json(
      { message: "Room created successfully", room },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error uploading room:", error);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}

export async function GET() {
  await dbConnect();
  const rooms = await Room.find().populate("userId", "username email");
  return NextResponse.json({ rooms }, { status: 200 });
}
