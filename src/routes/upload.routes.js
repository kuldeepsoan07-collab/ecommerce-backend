import { Router } from "express";

import { uploadImage } from "../controller/upload.controller.js";

import {
  authMiddleware,
  adminMiddleware,
} from "../middleware/auth.middleware.js";

import upload from "../middleware/upload.middleware.js";

const uploadRouter = Router();

uploadRouter.post(
  "/image",
  authMiddleware,
  adminMiddleware,
  upload.single("image"),
  uploadImage
);

export default uploadRouter;