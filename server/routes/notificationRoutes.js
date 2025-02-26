import express from "express";
import { checkDeadlines } from "../controllers/notificationsController.js";

const router = express.Router();

router.post("/check-deadlines", checkDeadlines);

export default router;
