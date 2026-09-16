import express from "express";

import requireAuth from "../middleware/authMiddleware.js";
import requireAdmin from "../middleware/adminMiddleware.js";

import {
    getDashboardStats,
} from "../controllers/adminDashboardController.js";

const router = express.Router();

router.get(
    "/",
    requireAuth,
    requireAdmin,
    getDashboardStats
);

export default router;