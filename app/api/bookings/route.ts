import { NextResponse } from "next/server";
import booking from "@/schema/booking";
import dbConnect from "@/lib/dbConnect";

export async function POST(req: Request) {
    await dbConnect();
    try {
        const reqBody = await req.json()
        const { userId, roomId, fullName, noOfPeople, enrollmentNumber, address ,startTime, endTime, totalHours, totalCost} = reqBody;

        if(!userId || !roomId || !startTime || !endTime  || !totalHours || !totalCost || !fullName || !noOfPeople || !enrollmentNumber || !address){
             return NextResponse.json(
                { message: "All fields are required" },
                { status: 400 }
            )
        }
        
        //Create the booking
        const newBooking = new booking({
            userId,
            roomId,
            startTime,
            endTime,
            totalHours,
            totalCost,
            fullName,
            noOfPeople,
            enrollmentNumber,
            address,
            
        })
        
        const savedBooking = await newBooking.save();
        
        return NextResponse.json(
            { message: "Booking created successfully", booking: savedBooking },
            { status: 201 }
        )


    } catch (error) {
        console.error("Error creating booking", error);
        return NextResponse.json(
            { message: "Error creating booking" },
            { status: 500 }
        )
    
    }

}