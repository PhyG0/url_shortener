import { Request, Response } from "express";
import { z } from "zod";

export type AuthRequest = Request & { user?: { name?: string, email: string, id: string }};

export const UrlSchema = z.object({
    originalUrl: z.string().url()
})