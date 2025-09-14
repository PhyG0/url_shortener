import URL, { IURL } from "../models/url";
import { Request, Response } from "express";    
import { AuthRequest } from "../types";
import { z } from "zod";
import { UrlSchema } from "../types";

export const shortenUrl = async (req: AuthRequest, res: Response) => {
    const userInfo = req.user;
    
    if(!userInfo) return res.status(401).json({ message: "Unauthorized" });

    const { originalUrl } = req.body;

    const parsed = UrlSchema.safeParse({ originalUrl });

    if(parsed.success) {
        const url = await URL.findOne({ originalUrl });

        if(url) {
            return res.status(200).json({ message: "URL already exists", shortUrl: url.shortUrl });
        }

        const shortUrl = Math.floor(Math.random() * 1000000).toString();

        const newUrl = await URL.create({ originalUrl, shortUrl, clicks: 0, owner: userInfo.id });

        await newUrl.save();

        const newUrlString = process.env.BASE_URL + shortUrl;

        return res.status(201).json({ message: "URL created successfully", shortUrl: newUrlString });

    }else{
        return res.status(400).json({ message: "Invalid URL" });
    }

}

export const getUserUrls = async (req: AuthRequest, res: Response) => {
  try {
    const userInfo = req.user;
    if (!userInfo) return res.status(401).json({ message: "Unauthorized" });

    const urls = await URL.find({ owner: userInfo.id });
    const totalClicks = urls.reduce((acc, u) => acc + u.clicks, 0);

    const urlsWithAnalytics = urls.map((u) => {
      const limitReached = u.clicks >= Number(process.env.LIMIT_CLICKS);

      const expiryTime = new Date(u.createdAt.getTime() + Number(process.env.LIMIT_DAYS) * 24 * 60 * 60 * 1000);
      const now = new Date();
      const timeLeftMs = expiryTime.getTime() - now.getTime();
      const timeLeft =
        timeLeftMs > 0
          ? Math.ceil(timeLeftMs / (1000 * 60)) + " minutes"
          : "Expired";

      return {
        _id: u._id,
        originalUrl: u.originalUrl,
        shortUrl: u.shortUrl,
        clicks: u.clicks,
        createdAt: u.createdAt,
        contribution:
          totalClicks > 0
            ? ((u.clicks / totalClicks) * 100).toFixed(2) + "%"
            : "0%",
        limitReached,
        timeLeft,
      };
    });

    return res.status(200).json({ urls: urlsWithAnalytics, totalClicks });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

export const updateShortenUrl = async (req: AuthRequest, res: Response) => {
    const userInfo = req.user;
    
    if(!userInfo) return res.status(401).json({ message: "Unauthorized" });

    const { originalUrl, urlID } = req.body;

    const parsed = UrlSchema.safeParse({ originalUrl });

    const url = await URL.findOne({ _id: urlID });

    if(!url) return res.status(404).json({ message: "URL not found" });

    if(url.owner.toString() != userInfo.id) return res.status(401).json({ message: "Unauthorized" });

    if(parsed.success) {
        url.originalUrl = originalUrl;
        await url.save();
        return res.status(200).json({ message: "URL updated successfully", shortUrl: process.env.BASE_URL + url.shortUrl });
    }

    return res.status(400).json({ message: "Invalid URL" });
} 



export const deleteShortenUrl = async (req: AuthRequest, res: Response) => {

    const userInfo = req.user;

    if(!userInfo) return res.status(401).json({ message: "Unauthorized" });

    const { urlID } = req.body;

    if(!urlID) return res.status(401).json({ message: "URL ID (urlID) is required in body." });

    const url = await URL.findOne({ _id: urlID });

    if(!url) return res.status(404).json({ message: "URL not found" });

    if(url.owner.toString() != userInfo.id) return res.status(401).json({ message: "Unauthorized" });

    await URL.deleteOne({ _id: urlID });

    return res.status(200).json({ message: "URL deleted successfully" });

}