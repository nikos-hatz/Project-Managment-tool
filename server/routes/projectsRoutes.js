import express from "express";
import { getProjects } from "../controllers/projectsController.js";

const router = express.Router();

router.get("/", getProjects);

export default router;
