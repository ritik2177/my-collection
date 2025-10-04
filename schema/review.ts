import mongoose, { Schema, Document } from "mongoose";

export interface IReview extends Document {
    userId: Schema.Types.ObjectId;
    roomId: Schema.Types.ObjectId;
    rating: number;
    comment: string;
}

const reviewSchema = new Schema<IReview>({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    roomId: {
        type: Schema.Types.ObjectId,
        ref: 'Room',
        required: true,
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5,
    },
    comment: {
        type: String,
        required: true,
    },
}, { timestamps: true });

export default mongoose.models.Review || mongoose.model<IReview>('Review', reviewSchema);
