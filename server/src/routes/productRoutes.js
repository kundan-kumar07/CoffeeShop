import express from "express";
import requireAuth from "../middleware/authMiddleware.js";
import requireAdmin from "../middleware/adminMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";

import { getProducts,createProduct ,getCategories,updateProduct,updateProductAvailability} from "../controllers/productController.js";

const router = express.Router();

router.get("/", getProducts);
router.get("/categories", getCategories);

router.post(
    "/",
    requireAuth,
    requireAdmin,
    upload.single("image"),createProduct
);
router.put(
    "/:productId",
    requireAuth,
    requireAdmin,
    upload.single("image"),
    updateProduct
);

router.patch(
    "/:productId/availability",
    requireAuth,
    requireAdmin,
    updateProductAvailability
);

export default router;