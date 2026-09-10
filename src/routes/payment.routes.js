import { Router } from "express";

import {
  createPaymentOrder,
  verifyPayment,
} from "../controller/payment.controller.js";

const paymentRouter = Router();

paymentRouter.post("/create-order", createPaymentOrder);

paymentRouter.post("/verify", verifyPayment);

export default paymentRouter;