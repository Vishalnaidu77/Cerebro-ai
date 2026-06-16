import { io } from "socket.io-client";
import { BASE_URL } from "../../../config/api.config";

let socket = null;

export function initSocketClient(){
    if(!socket){
        socket = io(BASE_URL, {
            withCredentials: true
        })
    }

    socket.on("connect", () => {
        console.log("Socket.io client is connected.");
    })

    return socket
}

export function getSocket() {
    return socket
}