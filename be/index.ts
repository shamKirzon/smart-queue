import cors from "cors"
import express from "express"
import dotenv from "dotenv"
import { setupWebSocket } from "./websockets/setupWebSocket"
import http from 'http'

dotenv.config(); 
const app = express(); 
const PORT = process.env.PORT
const server = http.createServer(app)

setupWebSocket(server)
app.use(express.json()); 
app.use(cors())

server.listen(PORT, () => {
    console.log(`Server is running on localhost: ${PORT}`)
})

