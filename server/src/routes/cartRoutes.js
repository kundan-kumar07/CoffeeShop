import express from "express";
import requireAuth from "../middleware/authMiddleware.js";
import { getCart,addToCart ,updateCartItem,deleteCartItem} from "../controllers/cartController.js";

const router = express.Router();

router.get("/", requireAuth, getCart);
router.post("/items", requireAuth, addToCart);
router.patch(
    "/items/:productId",
    requireAuth,
    updateCartItem
);
router.delete(
    "/items/:productId",
    requireAuth,
    deleteCartItem
);

export default router;