import { WebSocket, WebSocketServer } from "ws";
import { Server } from "http";
import { TellerService } from "../teller/teller.service";
import { TellerRepository } from "../teller/teller.repository";
import { ReceiptService } from "../receipt/receipt.service";
import { QueueRepository } from "../queue/queue.repository";
import { QueueService } from "../queue/queue.service";

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
      } else if(data.type === "teller-next-fe"){
        // await TellerRepository.tellerNext(data.counter)
        // await ReceiptService.assignRegularReceipt()


      }else if(data.type === "assign-regular-receipt-fe"){
        await ReceiptService.assignRegularReceipt(data.counter)
        const currentRegularQueueNum = await QueueService.getCurrentRegularQueueNum(data.counter)

        ws?.send(JSON.stringify({type: 'assign-regular-receipt-be', currentRegularQueueNum: currentRegularQueueNum}))
      }

      //REGULAR STARTS HERE
      else if(data.type === 'insert-data-regular'){
        
        console.log("Received data from frontend:", data.dataReceipt);

        const { transaction, customerType, queueNumber, date, time } =
          data.dataReceipt;

        if (customerType === "Regular") {
          try {
            await ReceiptService.createRegularReceipt(
              transaction,
              customerType,
              queueNumber,
              date,
              time
            );
            console.log("Regular receipt processed successfully.");
          } catch (error) {
            console.error("Error processing regular receipt:", error);
          }
        }
      }
      //PRIORITY STARTS HERE
      else if(data.type === 'insert-data-priority'){
        
        console.log("Received data from frontend:", data.dataReceipt);

        const { transaction, customerType, queueNumber, date, time } =
          data.dataReceipt;

        if (customerType === "Priority") {
          try {
            await ReceiptService.createPriorityReceipt(
              transaction,
              customerType,
              queueNumber,
              date,
              time
            );
            console.log("priority receipt processed successfully.");
          } catch (error) {
            console.error("Error processing priority receipt:", error);
          }
        } 
      }

      //OPENACCOUNT STARTS HERE
      else if(data.type === 'insert-data-openaccount'){
        console.log("Received data from frontend:", data.dataReceipt);

        const { transaction, customerType, queueNumber, date, time } =
          data.dataReceipt;

        if (customerType === "Open Account") {
          try {
            await ReceiptService.createOpenAccountReceipt(
              transaction,
              customerType,
              queueNumber,
              date,
              time
            );
            console.log("Open Account receipt processed successfully.");
          } catch (error) {
            console.error("Error processing Open Account receipt:", error);
          }
        }
      }


    });

    ws.on("close", () => console.log(`Client ${clientCounter} disconnected`));
  });

  console.log("websocket is running....");
}
