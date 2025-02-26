import express from "express";
import { sendMessage, getMessages } from "../controllers/chatController.js";

const router = express.Router();

// Route to send a message
router.post("/send", sendMessage);

// Route to fetch messages between two users
router.get("/fetch/:userId1/:userId2", getMessages);

export default router;
