import { NextRequest, NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";
import { UploadApiResponse } from "cloudinary";
import dbConnect from "@/lib/dbConnect";
import ImageUpload from "@/schema/image"
import { Buffer } from "buffer";

export async function POST(req: NextRequest) {
  try {
    await dbConnect(); // ✅ Connect to MongoDB

    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

   const buffer = Buffer.from(await file.arrayBuffer());

    const result: UploadApiResponse = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: "next-single-upload" },
        (error, uploadResult) => {
          if (error) {
            console.error("Cloudinary upload stream error:", error);
            return reject(error);
          }
          if (!uploadResult) {
            const noResultError = new Error("Cloudinary upload failed: No result returned.");
            console.error(noResultError.message);
            return reject(noResultError);
          }
          resolve(uploadResult);
        }
      );
      uploadStream.end(buffer);
    });

    const imageDoc = await ImageUpload.create({
      imageUrl: result.secure_url,
    });

    return NextResponse.json({ message: "Uploaded and saved", image: imageDoc }, { status: 201 });

  } catch (error) {
    if (error instanceof Error) {
        console.error("Error message:", error.message);
    }
    return NextResponse.json({ error: "Something went wrong"}, { status: 500 });
  }
}
