import { email, z } from "zod";

export const registrationSchema = z.object({
    username: z
      .string()
      .min(6, { message: "Username must be at least 6 characters long" })
      .max(10, { message: "Username must be at most 10 characters long" }),
      
    email: z.string().email({message: 'Invalid email address'}),
    password: z
      .string()
    .min(8, {message: "Password must be at least 8 characters"})
    .regex(/[0-9]/, {message: "Password must contain at least one number"})
    .regex(/[!@#$%^&*]/, {message: "Password must contain at least one special character"}),
    mobilenumber: z
    .string()
    .regex(/^[0-9]{10}$/, {message: "Mobile number must be exactly 10 digits"}),
});

export type RegisterSchemaType = z.infer<typeof registrationSchema>;