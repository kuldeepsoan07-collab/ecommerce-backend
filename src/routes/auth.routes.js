import { Router } from "express";
import * as authController from "../controller/auth.controller.js";

console.log({
    register: typeof authController.register,
    login: typeof authController.login,
    getMe: typeof authController.getMe,
    refreshToken: typeof authController.refreshToken,
    logout: typeof authController.logout,
    logoutAll: typeof authController.logoutAll,
});

const authRouter = Router();

authRouter.post("/register", authController.register);
authRouter.post("/login", authController.login);

authRouter.get("/get-me", authController.getMe);
authRouter.get("/refresh-token", authController.refreshToken);
authRouter.get("/logout", authController.logout);
authRouter.get("/logout-all", authController.logoutAll); 



export default authRouter;  

