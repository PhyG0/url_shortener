import { Router } from "express";
import { shortenUrl, getUserUrls, updateShortenUrl, deleteShortenUrl } from "../handlers/shorten";
import { authMiddleware } from "../middleware/authMiddleWare";

const router = Router();

router.post("/", authMiddleware, shortenUrl);
router.get("/", authMiddleware, getUserUrls)
router.put("/", authMiddleware, updateShortenUrl);
router.delete("/", authMiddleware, deleteShortenUrl);

export default router;
