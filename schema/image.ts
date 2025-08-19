import mongoose from "mongoose";

const imageUploadSchema = new mongoose.Schema(
  {
    imageUrl: {
      type: String,
      required: true,
    },
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Optional if you're tracking users
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.ImageUpload || mongoose.model("ImageUpload", imageUploadSchema);
