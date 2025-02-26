import express from "express";
import {getTaskReport, getWorkSessionReport, getTimeTrackingReport} from '../controllers/reportsController.js'

const router = express.Router();

router.get("/task-time", getTaskReport);
router.get("/work-session", getWorkSessionReport);
router.get("/time-tracking", getTimeTrackingReport);

export default router;
