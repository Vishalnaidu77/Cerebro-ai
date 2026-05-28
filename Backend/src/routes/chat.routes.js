import { Router } from "express";
import { generateContent } from "../controllers/chat.controller.js";
import { verifyUser } from "../middleware/auth.middleware.js";

const aiRouter = Router()

aiRouter.post("/message", verifyUser, generateContent)

export default aiRouter