import { tavily } from '@tavily/core'

const tvly = tavily({
    apiKey: process.env.TAVILY_API_KEY
})

export async function internetSearch({ message }){
    const res = await tvly.search(message, {
        maxResults: 5,
        searchDepth: "advanced"
    })

    return JSON.stringify(res)
}