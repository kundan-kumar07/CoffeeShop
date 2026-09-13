import express from "express";
import requireAuth from "../middleware/authMiddleware.js";
import { createOrder ,getMyOrders,getOrderById} from "../controllers/orderController.js";

const router = express.Router();
router.get("/", requireAuth, getMyOrders);
router.get("/:orderId", requireAuth, getOrderById);
router.post("/", requireAuth, createOrder);


export default router;