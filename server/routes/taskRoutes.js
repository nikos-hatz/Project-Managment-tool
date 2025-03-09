import express from "express";
import { logManualTime, addCommentToTask, getCommentsForTask, editTaskInfo, addTask } from "../controllers/tasksController.js";

const router = express.Router();
router.put("/edit", editTaskInfo)
router.post("/add", addTask)
router.post("/log-time", logManualTime);
router.post("/:taskId/comments", addCommentToTask);
router.get("/:taskId/comments", getCommentsForTask)


export default router;
