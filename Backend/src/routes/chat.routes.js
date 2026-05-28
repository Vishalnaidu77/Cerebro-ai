import { Router } from "express";
import { generateContent } from "../controllers/chat.controller.js";

const aiRouter = Router()

aiRouter.post("/message", generateContent)

export default aiRouter