import app from "./src/app.js";
import { createServer } from 'http'
import 'dotenv/config'
import { initSocket } from "./src/socket/server.socket.js";
import connectToDb from "./src/config/database.js";

const httpServer = createServer(app)
initSocket(httpServer)

const PORT = process.env.PORT || 8000

connectToDb()
    .then(() => {
        httpServer.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        })
    })
    .catch(err => {
        console.error(err);
        process.exit(1)
    })