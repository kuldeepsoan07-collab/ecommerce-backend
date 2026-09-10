import { Router } from "express";

import {
  createOrder,
  getMyOrders,
  getAllOrders,
  updateOrderStatus,
} from "../controller/order.controller.js";

import {
  authMiddleware,
  adminMiddleware,
} from "../middleware/auth.middleware.js";

const orderRouter = Router();

// Admin - Get all orders
orderRouter.get(
  "/admin/orders",
  authMiddleware,
  adminMiddleware,
  getAllOrders
);

// Admin - Update order status
orderRouter.patch(
  "/:id/status",
  authMiddleware,
  adminMiddleware,
  updateOrderStatus
);

// User - Get my orders
orderRouter.get(
  "/my-orders",
  authMiddleware,
  getMyOrders
);

// User - Create order
orderRouter.post(
  "/",
  authMiddleware,
  createOrder
);

export default orderRouter;