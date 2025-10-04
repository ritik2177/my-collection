import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Room from "@/schema/room";
import cloudinary from "@/lib/cloudinary";
import { Readable } from "stream";
import nodemailer from "nodemailer";
import User from "@/schema/user";


// Disable body parsing for form-data
export const config = {
  api: { bodyParser: false },
};

// Upload image buffer → Cloudinary
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
    // Upload images
    const images: string[] = [];
    const imageFiles = formData.getAll("images") as File[];
    for (const file of imageFiles) {
      const buffer = Buffer.from(await file.arrayBuffer());
      const uploadedImageUrl = await uploadToCloudinary(buffer);
      images.push(uploadedImageUrl);
    }

    // Extract location safely
    const latitude = formData.get("currentlatitude");
    const longitude = formData.get("currentlongitude");

    const room = await Room.create({
      roomOwner: formData.get("roomOwner") as string,
      nearByCentre: formData.get("nearByCentre") as string,
      address: {
        street: formData.get("street") as string,
        city: formData.get("city") as string,
        state: formData.get("state") as string,
        pincode: Number(formData.get("pincode")),
      },
      pricePerHour: Number(formData.get("pricePerHour")),
      currentlocation: {
        latitude: latitude ? Number(latitude) : null,
        longitude: longitude ? Number(longitude) : null,
      },
      amenities: formData.get("amenities")
        ? JSON.parse(formData.get("amenities") as string)
        : [],
      noOfPeople: Number(formData.get("noOfPeople")),
      images,
      userId: formData.get("userId") as string,
      description: formData.get("description") ? String(formData.get("description")) : "",
      dist_btw_room_and_centre: Number(
        formData.get("dist_btw_room_and_centre")
      ),
    });

    // console.log("desc" + room.description);
    // console.log("dis" + room.dist_btw_room_and_centre);


    const now = new Date();
    const dateTime = now.toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });
    // Email notification
    const user = await User.findById(room.userId);
    if (user) {
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

      try {
        await transporter.sendMail({
          from: process.env.EMAIL_USER,
          to: user.email,
          subject: "Room Created Successfully! 🎉",
          html: `<h1>Hi ${user.username},</h1>
                 <p>Your room "<b>${room.roomOwner}</b>" has been successfully listed.</p> \n ${dateTime}`,
        });
      } catch (emailError) {
        console.error("Email send failed:", emailError);
      }
    }

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
  try {
    await dbConnect();
    const rooms = await Room.find()
      .sort({ createdAt: -1 })
      .populate("userId", "username email");
    return NextResponse.json({ success: true, rooms }, { status: 200 });
  } catch (error) {
    console.error("Error fetching rooms:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch rooms" },
      { status: 500 }
    );
  }
}
