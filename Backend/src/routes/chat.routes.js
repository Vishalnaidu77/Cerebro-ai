import { Router } from "express";
import { deleteChat, generateContent, getChat, getMessages, internetSearchController } from "../controllers/chat.controller.js";
import { verifyUser } from "../middleware/auth.middleware.js";

const aiRouter = Router()

aiRouter.post("/message", verifyUser, generateContent)
aiRouter.post("/search", verifyUser, internetSearchController)

aiRouter.get("/getchats", verifyUser, getChat)
aiRouter.get("/chat/:chatId", verifyUser, getMessages)

aiRouter.delete("/chat/:chatId", verifyUser, deleteChat)

export default aiRouter