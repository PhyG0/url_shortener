import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { AuthRequest } from "../types";

export const authMiddleware = async (req: AuthRequest, res: Response, next: NextFunction) => {

    try {
        const token = req.headers.authorization?.split(" ")[1];

        if (!token) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { name: string, email: string, iat: number, exp: number, id: string };

        req.user = {
            name: decoded.name,
            email: decoded.email,
            id: decoded.id
        }

        next();

    } catch (err) {
        console.log(err);
        res.status(401).json({ message: "Unauthorized" });
    }

}