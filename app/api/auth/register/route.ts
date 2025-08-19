import dbConnect from "@/lib/dbConnect";
import User from "@/schema/user";
import { registrationSchema } from "@/schema1/registrationSchema";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { username, email, password, mobilenumber } = body;

        try {
            registrationSchema.parse(body);
        } catch (error) {
            if (error instanceof z.ZodError) {
                return NextResponse.json(
                    { message: "Enter valid data", errors: error.issues },
                    { status: 400 }
                );
            }
        }

        // Check empty fields
        if (!username || !email || !password) {
            return NextResponse.json(
                { message: "All fields are required" },
                { status: 400 }
            );
        }

        console.log("Registering user:", { username, email, mobilenumber });

        await dbConnect();

        // Check existing user
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return NextResponse.json(
                { message: "User already exists" },
                { status: 400 }
            );
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const newUser = new User({
            username,
            email,
            password: hashedPassword,
            mobilenumber,
        });

        await newUser.save();
        console.log(newUser);

        return NextResponse.json(
            { message: "User created successfully" },
            { status: 201 }
        );
    } catch (error) {
        console.error("REGISTRATION_ERROR", error);
        return NextResponse.json(
            { message: "An internal server error occurred." },
            { status: 500 }
        );
    }
}
