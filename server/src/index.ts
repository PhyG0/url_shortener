import express,{ Request, Response } from "express";
import dotenv from "dotenv";
import URL from "./models/url";
import cors from "cors";
dotenv.config();

import connectDB from "./config/db";

import authRoutes from "./routes/auth";
import urlRoutes from "./routes/shortner";

const main = async () => {
    const app = express();

    app.use(express.json());
    app.use(cors({
        origin: "http://localhost:5173", 
        credentials: true}));

    await connectDB();

    app.use("/api/auth", authRoutes);
    app.use("/api/shorten", urlRoutes);

    app.use("/:code", async (req: Request, res: Response) => {

        const shortId = req.params.code;

        const url = await URL.findOne({ shortUrl: shortId });

        if(!url) return res.status(404).json({ message: "URL expired or Unavailable." });

        if(url.clicks > Number(process.env.LIMIT_CLICKS)) {
            return res.status(404).json({ message: "URL limit reached" });
        }

        if(url.createdAt < new Date(Date.now() - Number(process.env.LIMIT_DAYS) * 24 * 60 * 60 * 1000)) {
            return res.status(404).json({ message: "URL expired or Unavailable." });
        }

        url.clicks += 1;

        await url.save();

        res.redirect(url.originalUrl);

    });

    app.listen(process.env.PORT, () => {
        console.log(`Server is running on port ${process.env.PORT}`);
    })

}

main();




