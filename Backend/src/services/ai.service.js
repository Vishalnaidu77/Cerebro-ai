import { HumanMessage, SystemMessage } from 'langchain'
import { ChatGoogleGenerativeAI } from '@langchain/google-genai'
import { ChatMistralAI } from '@langchain/mistralai'
 
const geminiModel = new ChatGoogleGenerativeAI({
    model: "gemini-2.5-flash-lite",
    apiKey: process.env.GEMINI_API_KEY
})

const mistralModel = new ChatMistralAI({
    model: "mistral-small-latest",
    apiKey: process.env.MISTRAL_API_KEY
})

export async function generateResponse(message){
    const res = await geminiModel.invoke([
        new HumanMessage(message)
    ])

    return res.content
}

export async function generateTitle(message) {
    const res = await mistralModel.invoke([
        new SystemMessage(`
                You are a helpful assistant that generates concise and descriptive titles for chat conversations.

                User will provide you with the first message of a chat conversation, and you will generate a title that
                capture the essence of the conversation in 2 - 5 words. The title should be clear, relavant, and engaging,
                giving user a quick understanding of the chat's topic.
            `),

        new HumanMessage(`
                 Generate a title for a chat conversation based on the following first message:
                "${message}"
            `)
    ])

    return res.content
}