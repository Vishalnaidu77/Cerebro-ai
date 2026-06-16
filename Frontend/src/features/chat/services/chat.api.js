import axios from 'axios'
import { BASE_URL } from '../../../config/api.config'

const api = axios.create({
    baseURL: BASE_URL,
    withCredentials: true
})

export async function sendMessage(message, chatId) {
    const res = await api.post("/api/ai/message", {
        message, chat: chatId
    })

    return res.data
}

export async function getChat() {
    const res = await api.get("/api/ai/getchats")
    return res.data
}

export async function getMessages(chatId) {
    const res = await api.get(`/api/ai/chat/${chatId}`)
    return res.data
}

export async function deleteChat(chatId) {
    const res = await api.delete(`/api/ai/chat/${chatId}`)
    return res.data
}