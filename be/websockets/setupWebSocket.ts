import { WebSocket, WebSocketServer } from "ws";
import { Server } from "http";
import { TellerService } from "../teller/teller.service";
import { json } from "stream/consumers";


export function setupWebSocket(server: Server) {
  const wss = new WebSocketServer({ server });
  const tellerService = new TellerService()
  let clientCounter = 0;

  wss.on("connection", (ws: WebSocket) => {
    clientCounter++;
    console.log(`Client ${clientCounter} connected`)

    // incoming messages
    ws.on('message', (message) => {
        console.log(`received: `, message.toString()); 

        const data = JSON.parse(message.toString()); 

        if(data.type === "get-status"){
          const status = tellerService.getStatus(); 
          ws.send(JSON.stringify({type: "status-response", status}))
        }
        else if(data.type === "set-status"){
         const { counter, status} = data
         tellerService.setCounterStatus(counter, status)
         
         const updatedCounterStatus = tellerService.getStatus()
         ws.send(JSON.stringify({type: "set-status-data", displayStatus: updatedCounterStatus }))
        }


    })

    ws.on('close', () => console.log(`Client ${clientCounter} disconnected`))
  });

  console.log("websocket is running....");
}
