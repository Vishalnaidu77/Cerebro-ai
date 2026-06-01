import axios from 'axios'

const api = axios.create({
    baseURL: "http://localhost:8000",
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