import cors from "cors"
import express from "express"
import dotenv from "dotenv"
<<<<<<< HEAD
import { setupWebSocket } from "./websockets/setUpWebSocket"
=======
import { setupWebSocket } from "./websockets/setupWebSocket"
>>>>>>> dev
import http from 'http'

dotenv.config(); 
const app = express(); 
const PORT = process.env.PORT; 
const server = http.createServer(app)

setupWebSocket(server)
app.use(express.json()); 
app.use(cors())

<<<<<<< HEAD
console.log("solid ako, pogi na cute pa")
=======
>>>>>>> dev
