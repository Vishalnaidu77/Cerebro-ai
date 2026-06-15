import { io } from "socket.io-client";

export async function initSocketClient(){
    const socket = io('https://cerebro-ai-h2cn.onrender.com', {
        withCredentials: true
    })

    socket.on("connect", () => {
        console.log("Socket.io client is connected.");
    })
}