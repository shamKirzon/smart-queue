import { WebSocket, WebSocketServer } from "ws";
import { Server } from "http";

export function setupWebSocket(server: Server) {
  const wss = new WebSocketServer({ server });
  let clientCounter = 0;

  wss.on("connection", (ws: WebSocket) => {
    clientCounter++;
    console.log(`Client ${clientCounter} connected`)

    ws.on('message', (message) => {
        console.log(`received: `, message.toString()); 

        wss.clients.forEach((client)=> {
            if(client.readyState === WebSocket.OPEN){
                client.send(`Echo: ${message}`)
            }
        })
    })

    ws.on('close', () => console.log(`Client ${clientCounter} disconnected`))
  });

  console.log("websocket is running....");
}
