import express, { Request, Response } from "express";
import bookRoutes from "./books";

const router = express.Router(); // eslint-disable-line new-cap

/** GET /health-check - Check service health */
router.get("/health-check", (_req: Request, res: Response) => res.send("OK"));

// mount books routes
router.use("/books", bookRoutes);

export default router;
