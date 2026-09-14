import express from "express";
import requireAuth from "../middleware/authMiddleware.js";
import requireAdmin from "../middleware/adminMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";

import { getProducts,createProduct ,getCategories} from "../controllers/productController.js";

const router = express.Router();

router.get("/", getProducts);
router.get("/categories", getCategories);

router.post(
    "/",
    requireAuth,
    requireAdmin,
    upload.single("image"),createProduct
);

export default router;