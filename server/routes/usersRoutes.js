import express from "express";
import { getUsers, getLoggedUser } from "../controllers/usersController.js";

const router = express.Router();

router.get("/", getUsers);
router.get("/:userId", getLoggedUser);

export default router;
