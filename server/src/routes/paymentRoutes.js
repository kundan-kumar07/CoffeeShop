import express from "express";
import requireAuth from "../middleware/authMiddleware.js";
import {
    createCheckoutSession,
} from "../controllers/paymentController.js";

const router = express.Router();

router.post(
    "/create-checkout-session",
    requireAuth,
    createCheckoutSession
);

export default router;