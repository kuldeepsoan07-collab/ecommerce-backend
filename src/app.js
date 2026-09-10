import express from "express";
import morgan from "morgan";
import authRouter from "./routes/auth.routes.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import productRouter from "./routes/product.routes.js";
import paymentRouter from "./routes/payment.routes.js";
import orderRouter from "./routes/order.routes.js";
import uploadRouter from "./routes/upload.routes.js";
const app = express();

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://ecommerce-frontend-edchh5ein-kul8.vercel.app",
    ],
    credentials: true,
  })
);

app.use(express.json());
app.use(morgan("dev"));
app.use(cookieParser());

app.use("/api/auth", authRouter);
app.use("/api/products", productRouter);
app.use("/api/payment", paymentRouter);
app.use("/api/orders", orderRouter);
app.use("/api/upload", uploadRouter);

export default app;