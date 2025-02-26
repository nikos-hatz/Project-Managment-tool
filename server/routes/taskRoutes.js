import express from "express";
import { logManualTime, addCommentToTask, getCommentsForTask } from "../controllers/tasksController.js";

const router = express.Router();

router.post("/log-time", logManualTime);
router.post("/:taskId/comments", addCommentToTask);
router.get("/:taskId/comments", getCommentsForTask)

export default router;
