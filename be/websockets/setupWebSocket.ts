import { WebSocket, WebSocketServer } from "ws";
import { Server } from "http";
import { TellerService } from "../teller/teller.service";
import { TellerRepository } from "../teller/teller.repository";


export function setupWebSocket(server: Server) {
  const wss = new WebSocketServer({ server });
  const tellerService = new TellerService()
  let clientCounter = 0;

  wss.on("connection", (ws: WebSocket) => {
    clientCounter++;
    console.log(`Client ${clientCounter} connected`)

    // incoming messages
    ws.on('message', async (message) => {
        console.log(`received: `, message.toString()); 

        const data = JSON.parse(message.toString()); 

         // show database - testing part: 
         if(data.type === "show-database"){
          const showDB =  await TellerRepository.getCounterData(); 
          console.log(showDB)
        }
      
        // }
        // else if(data.type === "set-status"){
        //  const { counter, status} = data
        //  tellerService.setCounterStatus(counter, status)
         
        //  const updatedCounterStatus = tellerService.getStatus()
        //  ws.send(JSON.stringify({type: "set-status-data", displayStatus: updatedCounterStatus }))
        // }
    })

    ws.on('close', () => console.log(`Client ${clientCounter} disconnected`))
  });

  console.log("websocket is running....");
}
