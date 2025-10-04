import mongoose, { Schema, Document, Types } from "mongoose";

interface Location {
    latitude: number;
    longitude: number;
}

export interface IRoom extends Document {
    rating: number;
    roomOwner: string;
    nearByCentre: string;
    address: {
        street: string;
        city: string;
        state: string;
        pincode: number;
    };
    pricePerHour: number;
    currentlocation: Location;
    amenities: ('wifi' |'AC' | 'parking' | 'FAN')[];
    noOfPeople: number
    images: string[]
    userId: Types.ObjectId;
    description?: string;
    dist_btw_room_and_centre: number;
    isAvailable: boolean;
    reviews: Types.ObjectId[];
}

const roomSchema = new Schema<IRoom>({
    roomOwner: {
        type: String,
        required: true,
    },
    nearByCentre: {
        type: String,
        required: true,
    },
    address: {
        street: {
            type: String,
            required: true,
        },
        city: {
            type: String,
            required: true,
        },
        state: {
            type: String,
            required: true,
        },
        pincode: {
            type: Number,
            required: true,
        },
    },
    pricePerHour: {
        type: Number,
        required: true,
    },
    currentlocation: {
        latitude: {
            type: Number,
            required: true,
        },
        longitude: {
            type: Number,
            required: true,
        },
    },
    amenities: {
        type: [String],
        required: true,
    },
    noOfPeople: {
        type: Number,
        required: true,
    },
    images: {
        type: [String],
        required: true,
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    isAvailable: {
        type: Boolean,
        default: true,
    },
    reviews: [{
        type: Schema.Types.ObjectId,
        ref: 'Review'
    }],
    description: {
        type: String,
        required: false,
    },
    dist_btw_room_and_centre: {
        type: Number,
        required: true,
    }
}, { timestamps: true });

export default mongoose.models.Room || mongoose.model<IRoom>('Room', roomSchema);