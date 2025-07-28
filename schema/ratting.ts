import mongoose, { Schema, Document } from "mongoose";

export interface IReview extends Document {
    roomId: Schema.Types.ObjectId;
    userId: Schema.Types.ObjectId;
    rating: number;
    comment: string;
    createdAt: Date;

}

const reviewSchema = new Schema<IReview>({
    roomId: {
        type: Schema.Types.ObjectId,
        ref: 'Room',
        required: true,
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    rating: {
        type: Number,
        required: true,
    },
    comment: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

export default mongoose.models.Review || mongoose.model<IReview>('Review', reviewSchema);