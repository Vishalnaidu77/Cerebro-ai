import { useDispatch } from 'react-redux'
import { initSocketClient, getSocket } from '../services/chat.socket'
import { addMessages, addNewMessage, createNewChat, removeChat, setChats, setCurrentChatId, setError, setLoading } from '../chat.slice'
import { getChat, getMessages, sendMessage } from '../services/chat.api'

const useChat = () => {

  const dispatch = useDispatch()

  const handleSendMessage = async (message, chatId) => {
    try {
      dispatch(setLoading(true))

      // Optimistic UI: show user message immediately
      const tempChatId = chatId || `temp_${Date.now()}`
      if (!chatId) {
        dispatch(createNewChat({
          chatId: tempChatId,
          title: message.slice(0, 30) + (message.length > 30 ? '...' : '')
        }))
        dispatch(setCurrentChatId(tempChatId))
      }
      dispatch(addNewMessage({
        chatId: chatId || tempChatId,
        content: message,
        role: "user"
      }))

      // Now wait for the AI response
      const res = await sendMessage(message, chatId)
      const { chat, userMessage, aiMessage } = res

      // Determine the real chat ID (chat is null for existing chats)
      const realChatId = chat?._id || chatId

      // If this was a new chat, replace the temp entry with the real one
      if (!chatId) {
        dispatch(removeChat(tempChatId))
        dispatch(createNewChat({
          chatId: realChatId,
          title: chat.title
        }))
        dispatch(addNewMessage({
          chatId: realChatId,
          content: message,
          role: "user"
        }))
      }

      dispatch(addNewMessage({
        chatId: realChatId,
        content: "",
        role: "ai"
      }))

      dispatch(setCurrentChatId(realChatId))

      const socket = getSocket()
      if(socket){
        socket.emit("generate_ai_response", {
          chatId: realChatId,
          aiMessageId: aiMessage._id
        })
      }
    } catch (err) {
      dispatch(setError(err.message))
      throw new Error(err.message);
    } finally {
      dispatch(setLoading(false))
    }
  }

  const handleGetChats = async () => {
    dispatch(setLoading(true))
    const res = await getChat()
    const { chats } = res
    dispatch(setChats( chats.reduce((acc, chat) => {
      acc[ chat._id ] = {
        id: chat._id,
        title: chat.title,
        messages: [],
        lastUpdated: chat.updatedAt
      }
      return acc
    }, {})))
    dispatch(setLoading(false))
  }

  const handleGetMessages = async (chatId, chats) => {

    if (chats[chatId]?.messages.length === 0) {
      dispatch(setLoading(true))
      const res = await getMessages(chatId)
      const { messages } = res
  
      const formattedMsg = messages.map((msg) => ({
        content: msg.content,
        role: msg.role
      }))
  
      dispatch(addMessages({
        chatId,  
        messages: formattedMsg
      }))
    }

    dispatch(setCurrentChatId(chatId))
    dispatch(setLoading(false))
  }

  return {
    initSocketClient,
    handleSendMessage,
    handleGetChats,
    handleGetMessages
  }
}

export default useChat