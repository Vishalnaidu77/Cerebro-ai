import { Router } from "express";
import { getMeController, loginController, registerController, resendVerificationEmail, verifyEmail } from "../controllers/auth.controller.js";
import { registerValidation } from "../validation/auth.validation.js";
import { verifyUser } from "../middleware/auth.middleware.js";

const authRouter = Router()

authRouter.post("/register", registerValidation, registerController)
authRouter.post("/login", loginController)
authRouter.get("/getme", verifyUser , getMeController)

authRouter.get("/verify-email", verifyEmail)
authRouter.post("/resend-verify-email", resendVerificationEmail)

export default authRouter