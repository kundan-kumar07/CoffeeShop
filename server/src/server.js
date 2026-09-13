import express from "express";
import cors from "cors";
import sql from "./db.js";
import { clerkMiddleware, getAuth, clerkClient } from "@clerk/express";
import productRoutes from "./routes/productRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import { handleStripeWebhook } from "./controllers/paymentController.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use(clerkMiddleware());
app.post(
    "/api/payments/webhook",
    express.raw({ type: "application/json" }),
    handleStripeWebhook
);

app.get("/", (req, res) => {
  res.json({
    message: "Coffee Shop API is running ☕",
  });
});

app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/payments", paymentRoutes);


const PORT = process.env.PORT || 5000;



if (process.env.NODE_ENV !== "production") {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}

export default app;
