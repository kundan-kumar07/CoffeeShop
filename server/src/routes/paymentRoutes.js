import express from "express";

import requireAuth from "../middleware/authMiddleware.js";

import {
    createCheckoutSession,
    getOrderIdFromSession,
} from "../controllers/paymentController.js";

const router = express.Router();

router.post(
    "/create-checkout-session",
    requireAuth,
    createCheckoutSession
);

router.get(
    "/session/:sessionId",
    requireAuth,
    getOrderIdFromSession
);

export default router;