import { generateResponse, generateTitle } from "../services/ai.service.js"
import { internetSearch } from "../services/tavily.service.js"

export async function generateContent(req, res) {
    const { message } = req.body

    if(!message){
        return res.status(404).json({
            message: "Message not found for generate response.",
            success: false,
            err: "Message not found"
        })
    }

    const content = await generateResponse(message)
    const title = await generateTitle(message)

    res.status(200).json({
        message: content,
        title,
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