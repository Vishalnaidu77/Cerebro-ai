import { Router } from "express";
import { loginController, registerController, resendVerificationEmail, verifyEmail } from "../controllers/auth.controller.js";
import { registerValidation } from "../validation/auth.validation.js";

const authRouter = Router()

authRouter.post("/register", registerValidation, registerController)
authRouter.post("/login", loginController)

authRouter.get("/verify-email", verifyEmail)
authRouter.post("/resend-verify-email", resendVerificationEmail)

export default authRouter