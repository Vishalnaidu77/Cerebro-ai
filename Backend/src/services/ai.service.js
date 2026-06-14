import { HumanMessage, SystemMessage, AIMessage, tool, createAgent } from 'langchain'
import { ChatGoogleGenerativeAI } from '@langchain/google-genai'
import { ChatMistralAI } from '@langchain/mistralai'
import * as z from 'zod'
import { internetSearch } from './tavily.service.js'
 
const geminiModel = new ChatGoogleGenerativeAI({
    model: "gemini-2.5-flash-lite",
    apiKey: process.env.GEMINI_API_KEY
})

const mistralModel = new ChatMistralAI({
    model: "mistral-small-latest",
    apiKey: process.env.MISTRAL_API_KEY
})

const searchInternetTool = tool(
    internetSearch,
    {
        name: "internetSearch",
        description: "Use this tool to get the latest information from the internet.",
        schema: z.object({
            message: z.string().describe("The search query to look up on the internet.")
        })
    }
)

const agent = createAgent({
    model: mistralModel,
    tools: [ searchInternetTool ]
})

export async function generateResponse(messages){
    const res = await agent.invoke({
        messages: [
            new SystemMessage(`
                You are a helpful and precise assistant for answering question.
                If you don't know the answer, say you don't know.
                If the questionn requires up-to-date information, use the "internetSearch" tool to get the latest information from the internet and then answer based on the search results. 
            `),
            ...(messages.map(msg => {
            if(msg.role === "user"){
                return new HumanMessage(msg.content)
            } else if (msg.role === 'ai') {
                return new AIMessage(msg.content)
            }
        }))]
    })

    return res.messages[ res.messages.length - 1].text
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