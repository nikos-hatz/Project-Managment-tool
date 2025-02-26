import express from "express"
import { clockIn, clockOut } from "./timeTrackingController.js";
const router = express.Router();

router.post("/clockin", clockIn);
router.post("/clockout", clockOut);

export default router
