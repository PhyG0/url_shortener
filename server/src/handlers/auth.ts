import jwt from "jsonwebtoken";
import User from "../models/user";
import { Request, Response } from "express";
import { z } from "zod";
import bcrypt from "bcrypt";


interface AuthRequest extends Request {
    user?: {
        name: string, 
        email: string
    }
}

const userSchema = z.object({
    name: z.string().min(3).max(50),
    email: z.string().email(),
    password: z.string().min(8).max(50).refine((value) => value.length > 8, { message: "Password must be at least 8 characters long" })
});

export const register = async (req: AuthRequest, res: Response) => {

    const { name, email, password } = req.body;

    const parsed = userSchema.safeParse({ name, email, password });

    if(parsed.success) {
        const user = await User.findOne({ email });
        if(user) {
            return res.status(400).json({ message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await User.create({
            name,
            email,
            password: hashedPassword
        });
        await newUser.save();

        const token = jwt.sign({ name, email, id: newUser._id }, process.env.JWT_SECRET as string, { expiresIn: "1d" });

        return res.status(201).json({ message: "User created successfully", token });        

    } else{
        return res.status(400).json({ message: parsed.error.message });
    }
}


export const login = async (req: AuthRequest, res: Response) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if(!user) {
        return res.status(400).json({ message: "User not found" });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if(!isPasswordCorrect) {
        return res.status(400).json({ message: "Invalid password" });
    }

    const token = jwt.sign({ name: user.name, email: user.email, id: user._id }, process.env.JWT_SECRET as string, { expiresIn: "1d" });

    return res.status(200).json({ message: "Login successful", token });

}