import "dotenv/config";
import express from "express";
import cors from "cors";
import { clerkMiddleware } from "@clerk/express";
import adminDashboardRoutes from "./routes/adminDashboardRoutes.js";

import productRoutes from "./routes/productRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import adminOrderRoutes from './routes/adminOrderRoutes.js'


import { handleStripeWebhook } from "./controllers/paymentController.js";

const app = express();

app.use(cors());

app.post(
    "/api/payments/webhook",
    express.raw({ type: "application/json" }),
    handleStripeWebhook
);

app.use(express.json());

app.use(clerkMiddleware());

app.get("/", (req, res) => {
    res.json({
        message: "Coffee Shop API is running ☕",
    });
});

app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/admin/orders", adminOrderRoutes);
app.use("/api/admin/dashboard", adminDashboardRoutes);


const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV !== "production") {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}

export default app;