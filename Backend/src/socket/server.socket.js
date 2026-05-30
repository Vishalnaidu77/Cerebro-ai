import { Server } from 'socket.io'

let io;

export function initSocket(httpServer){
    io = new Server(httpServer, {
        cors: {
            origin: "http://localhost:5173",
            credentials: true
        }
    })

    console.log("Socket server is running.");

    io.on("connection", (socket) => {
        console.log(`User connected: ${socket.id}`);
        
    })
}

export function getIo(){
    if(!io){
        throw new Error("Socket.io is not initialize");
    }

    return io
}