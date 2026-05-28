import { Router } from "express";
import { registerController, verifyEmail } from "../controllers/auth.controller.js";
import { registerValidation } from "../validation/auth.validation.js";

const authRouter = Router()

authRouter.post("/register", registerValidation, registerController)

authRouter.get("/verify-email", verifyEmail)

export default authRouter