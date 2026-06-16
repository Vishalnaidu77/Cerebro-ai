import { chatModel } from "../models/chat.model.js"
import { messageModel } from "../models/message.model.js"
import { userModel } from '../models/user.model.js'
import { generateResponse, generateTitle } from "../services/ai.service.js"
import { internetSearch } from "../services/tavily.service.js"

export async function generateContent(req, res) {
    const { message, chat: chatId } = req.body

    const user = await userModel.findOne({ email: req.email })

    if(!message){
        return res.status(404).json({
            message: "Message not found for generate response.",
            success: false,
            err: "Message not found"
        })
    }

    let chat = null, title = null;

    if(!chatId){
        title = await generateTitle(message)
        chat = await chatModel.create({
            user: user._id,
            title
        })
    }

    const realChatId = chatId || chat._id

    // Created user message
    const userMessage = await messageModel.create({
        chat: realChatId,
        content: message,
        role: "user"
    })

    // Create Placeholder AI Message
    const aiMessage = await messageModel.create({
        chat: chatId || chat._id,
        content: "",
        role: "ai"
    })

    // Update the chat's updatedAt field to bubble it to the top as the newest active chat
    await chatModel.updateOne({ _id: chatId || chat._id }, { updatedAt: new Date() })

    res.status(200).json({
        title,
        chat,
        userMessage,
        aiMessage
    })
}

export async function internetSearchController(req, res) {
    const { message } = req.body

    if(!message){
        return res.json(404).json({
            message: "Empty message",
            success: false,
            err: "Empty message"
        })
    }

    const content = await internetSearch(message)

    res.status(200).json({
        message: content
    })
}

export async function getChat(req, res) {
    const email = req.email
    const user = await userModel.findOne({ email})

    const chats = await chatModel.find({ user: user._id }).sort({ updatedAt: -1 })

    if(!chats){
        return res.status(404).json({
            message: "Chat not found",
            success: false,
            err: "Chat not found"
        })
    }

    res.status(200).json({
        message: "Chats retrieved successfully.",
        success: true,
        chats
    })
}

export async function getMessages(req, res) {
    const { chatId } = req.params
    const email = req.email

    const user = await userModel.findOne({ email })

    const chat = await chatModel.findOne({
        _id: chatId,
        user: user._id
    })

    if(!chat){
        return res.status(404).json({
            message: "Chat not found",
            success: false,
            err: "Chat not found"
        })
    }

    const messages = await messageModel.find({
        chat: chatId
    })

    res.status(200).json({
        message: "Messages retrieved successfully",
        success: true,
        messages
    })
}

export async function deleteChat(req, res) {
    const { chatId } = req.params
    const email = req.email

    const user = await userModel.findOne({ email })

    const chat = await chatModel.findOneAndDelete({
        _id: chatId,
        user: user._id
    })

    if(!chat){
        return res.status(404).json({
            message: "Chat not found",
            success: false,
            err: "Chat not found"
        })
    }

    await messageModel.deleteMany({
        chat: chatId
    })

    res.status(200).json({
        message: "Chat deleted successfully",
        success: true
    })
}