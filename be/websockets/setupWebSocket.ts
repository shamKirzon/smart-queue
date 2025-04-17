import { WebSocket, WebSocketServer } from "ws";
import { Server } from "http";
import { TellerService } from "../teller/teller.service";
import { TellerRepository } from "../teller/teller.repository";

export function setupWebSocket(server: Server) {
  const wss = new WebSocketServer({ server });
  const tellerService = new TellerService();
  let clientCounter = 0;

  wss.on("connection", (ws: WebSocket) => {
    clientCounter++;
    console.log(`Client ${clientCounter} connected`);

    // incoming messages
    ws.on("message", async (message) => {
      console.log(`received: `, message.toString());

      const data = JSON.parse(message.toString());

      if (data.type === "get-counter-status") {
        const counterStatus = await TellerRepository.getCounterStatus();

        ws.send(
          JSON.stringify({ type: "set-counter-status", data: counterStatus })
        );
      } else if (data.type === "set-counter-available") {
        await TellerRepository.setCounterAvailable(data.counter);
        const counterStatus = await TellerRepository.getCounterStatus();
        
        wss.clients.forEach((client) => {
          if(client.readyState === WebSocket.OPEN){
            client.send(
              JSON.stringify({
                type: "set-counter-status", 
                data: counterStatus
              })
            )
          }
        })

      } else if (data.type === "set-counter-inuse") {
        await TellerRepository.setCounterInuse(data.counter);
        const counterStatus = await TellerRepository.getCounterStatus();

        wss.clients.forEach((client) => {
          if(client.readyState === WebSocket.OPEN){
            client.send(
              JSON.stringify({
                type: "set-counter-status", 
                data: counterStatus
              })
            )
          }
        })
      }
    });

    ws.on("close", () => console.log(`Client ${clientCounter} disconnected`));
  });

  console.log("websocket is running....");
}
