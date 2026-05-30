import { Router } from "express";
import { generateContent, internetSearchController } from "../controllers/chat.controller.js";
import { verifyUser } from "../middleware/auth.middleware.js";

const aiRouter = Router()

aiRouter.post("/message", verifyUser, generateContent)
aiRouter.post("/search", verifyUser, internetSearchController)

export default aiRouter