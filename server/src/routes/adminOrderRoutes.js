import express from "express";

import requireAuth from "../middleware/authMiddleware.js";
import requireAdmin from "../middleware/adminMiddleware.js";

import {
    getAllOrders,updateOrderStatus
} from "../controllers/adminOrderController.js";

const router = express.Router();

router.get(
    "/",
    requireAuth,
    requireAdmin,
    getAllOrders
);
router.patch(
    "/:orderId/status",
    requireAuth,
    requireAdmin,
    updateOrderStatus
);

export default router;