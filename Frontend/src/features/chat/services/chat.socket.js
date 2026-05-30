import { io } from "socket.io-client";

export async function initSocketClient(){
    const socket = io('http://localhost:8000', {
        withCredentials: true
    })

    socket.on("connect", () => {
        console.log("Socket.io client is connected.");
    })
}