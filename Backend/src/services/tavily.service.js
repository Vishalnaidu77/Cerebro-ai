import { tavily } from '@tavily/core'

const tvly = tavily({
    apiKey: process.env.TAVILY_API_KEY
})

export async function internetSearch(message){
    const res = await tvly.search(message)

    return res.results[0].content
}