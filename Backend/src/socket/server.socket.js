import { Server } from 'socket.io'
import jwt from 'jsonwebtoken'
import { chatModel } from '../models/chat.model.js';
import { userModel } from '../models/user.model.js';
import { messageModel } from '../models/message.model.js';
import { generateResponseStream } from '../services/ai.service.js';

let io;

// Simple helper to parse cookie header manually
function parseCookies(cookieHeader) {
    const list = {};
    if (!cookieHeader) return list;
    cookieHeader.split(';').forEach(cookie => {
        let parts = cookie.split('=');
        list[parts.shift().trim()] = decodeURIComponent(parts.join('='));
    })

    return list;
}

export function initSocket(httpServer) {
    io = new Server(httpServer, {
        cors: {
            origin: process.env.CLIENT_URL || "http://localhost:5173",
            credentials: true
        }
    })

    console.log("Socket server is running.");

    // Socket Middleware to verify cookie/JWT
    io.use((socket, next) => {
        try {
            const cookies = parseCookies(socket.handshake.headers.cookie)
            const token = cookies.token

            if (!token) {
                return next(new Error("Authentication error: Token missing"));
            }

            const decoded = jwt.verify(token, process.env.JWT_SECRET)
            socket.email = decoded.email
            next();
        } catch (err) {
            next(new Error("Authentication error: Invalid token"))
        }
    })

    io.on("connection", (socket) => {
        console.log(`User connected: ${socket.id} (${socket.email})`);

        socket.on("generate_ai_response", async ({ chatId, aiMessageId }) => {
            try {
                // 1. Verify user owns the chat
                const user = await userModel.findOne({ email: socket.email })
                const chat = await chatModel.findOne({ _id: chatId, user: user._id })

                if (!chat) {
                    return socket.emit("chat_error", { chatId, error: "Chat unauthorized or not found." })
                }

                // 2. Load all historical message for this chat expect the blank placeholder
                const rawMessages = await messageModel.find({
                    chat: chatId,
                    _id: { $ne: aiMessageId }
                }).sort({ createdAt: 1 })

                // 3. Stream from Langchain
                const stream = generateResponseStream(rawMessages)
                let fullContent = ""

                for await (const chunk of stream) {
                    fullContent += chunk

                    // Emit chunk immediately to user's socket
                    socket.emit("chat_chunk", { chatId, chunk });
                }

                // 4. Save final complete message to database
                await messageModel.updateOne(
                    { _id: aiMessageId },
                    { content: fullContent }
                )

                // 5. Notify client stream is complete
                socket.emit("chat_complete", {
                    chatId, aiMessageId, fullContent
                })
            } catch (err) {
                console.error("Socket AI stream error:", err)
                socket.emit("chat_error", {
                    chatId, error: err.message
                })
            }
        })

        socket.on("disconnect", () => {
            console.log(`User disconnected: ${socket.id}`);
        })
    })
}

export function getIo() {
    if (!io) {
        throw new Error("Socket.io is not initialize");
    }

    return io
}