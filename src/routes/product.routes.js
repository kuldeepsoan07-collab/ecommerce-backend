import { Router } from "express";

import {
    createProduct,
    getProducts,
    getProductById,
    updateProduct,
    deleteProduct,
} from "../controller/product.controller.js";

import {
    authMiddleware,
    adminMiddleware,
} from "../middleware/auth.middleware.js";


const productRouter = Router();


// =========================
// PUBLIC ROUTES
// =========================

// Get all products
productRouter.get("/", getProducts);

// Get single product
productRouter.get("/:id", getProductById);


// =========================
// ADMIN ROUTES
// =========================

// Create product
productRouter.post(
    "/",
    authMiddleware,
    adminMiddleware,
    createProduct
);

// Update product
productRouter.put(
    "/:id",
    authMiddleware,
    adminMiddleware,
    updateProduct
);

// Delete product
productRouter.delete(
    "/:id",
    authMiddleware,
    adminMiddleware,
    deleteProduct
);


export default productRouter;