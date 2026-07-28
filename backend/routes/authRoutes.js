import express from "express";
import { signup, login, refresh, logout, dashboard } from "../controllers/authController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/refresh", refresh);
router.post("/logout", logout);
router.get("/dashboard", protect, dashboard);

export default router;
