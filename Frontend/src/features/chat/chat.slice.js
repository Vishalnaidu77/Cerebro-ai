import { createSlice } from '@reduxjs/toolkit'

const chatSlice = createSlice({
    name: "chat",
    initialState: {
        chats: {},
        currentChatId: null,
        loading: false,
        error: null
    },

    reducers: {
        appendChatChunk: (state, action) => {
            const { chatId, chunk } = action.payload
            if(state.chats[chatId]){
                const messages = state.chats[chatId].messages;
                if (messages.length > 0) {
                    const lastMsg = messages[messages.length - 1];
                    if (lastMsg.role === 'ai') {
                        lastMsg.content += chunk
                    }
                }
            }
        },
        createNewChat: (state, action) => {
            const { chatId, title } = action.payload
            state.chats[ chatId ] = {
                id: chatId,
                title,
                messages: [],
                lastUpdated: new Date().toISOString()
            }
        },
        addNewMessage: (state, action) => {
            const { chatId, content, role } = action.payload
            if (state.chats[chatId]) {
                state.chats[chatId].messages.push({ content, role })
                state.chats[chatId].lastUpdated = new Date().toISOString()
            }
        },
        removeChat: (state, action) => {
            delete state.chats[action.payload]
        },
        addMessages: (state, action) => {
            const { chatId, messages } = action.payload
            state.chats[chatId].messages.push(...messages)
        },
        setChats: (state, action) => {
            state.chats = action.payload
        },
        setCurrentChatId: (state, action) => {
            state.currentChatId = action.payload
        },
        setLoading: (state, action) => {
            state.loading = action.payload
        },
        setError: (state, action) => {
            state.error = action.payload
        }
    }
})

export const { setChats, setCurrentChatId, setLoading, setError, createNewChat, addNewMessage, removeChat, addMessages, appendChatChunk } = chatSlice.actions
export default chatSlice.reducer