import express from "express";
import { getProjects, getProject } from "../controllers/projectsController.js";

const router = express.Router();

router.get("/", getProjects);
router.get("/:projectId", getProject);

export default router;
