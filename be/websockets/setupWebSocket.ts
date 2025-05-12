import { WebSocket, WebSocketServer } from "ws";
import { Server } from "http";
import { TellerService } from "../teller/teller.service";
import { TellerRepository } from "../teller/teller.repository";
import { ReceiptService } from "../receipt/receipt.service";
import { QueueRepository } from "../queue/queue.repository";
import { QueueService } from "../queue/queue.service";
import { ReceiptRepository } from "../receipt/receipt.repository";

export function setupWebSocket(server: Server) {
  const wss = new WebSocketServer({ server });

  // Centralized queue numbers
  const queueNumbers: {
    Regular: number;
    Priority: number;
    OpenAccount: number;
  } = {
    Regular: 1,
    Priority: 1,
    OpenAccount: 1,
  };

  let clientCounter = 0;

  wss.on("connection", (ws: WebSocket) => {
    clientCounter++;
    console.log(`Client ${clientCounter} connected`);

    // incoming messages from frontend
    ws.on("message", async (message) => {
      console.log(`received: `, message.toString());

      const data = JSON.parse(message.toString());

      // Handle request for the next queue number
      if (data.type === "get-next-queue-number") {
        const customerType = data.customerType as keyof typeof queueNumbers; // Explicitly type customerType

        if (queueNumbers[customerType] !== undefined) {
          const nextQueueNumber = queueNumbers[customerType]
            .toString()
            .padStart(3, "0");
          queueNumbers[customerType] += 1;

          ws.send(
            JSON.stringify({
              type: "next-queue-number",
              customerType,
              queueNumber: nextQueueNumber,
            })
          );
        } else {
          ws.send(
            JSON.stringify({
              type: "error",
              message: `Invalid customer type: ${customerType}`,
            })
          );
        }
      } else if (data.type === "get-counter-status") {
        const counterStatus = await TellerRepository.getCounterStatus();

        ws.send(
          JSON.stringify({ type: "set-counter-status", data: counterStatus })
        );
      } else if (data.type === "set-counter-available") {
        await TellerRepository.setCounterAvailable(data.counter);
        const counterStatus = await TellerRepository.getCounterStatus();

        wss.clients.forEach((client) => {
          if (client.readyState === WebSocket.OPEN) {
            client.send(
              JSON.stringify({
                type: "set-counter-status",
                data: counterStatus,
              })
            );
          }
        });
      } else if (data.type === "set-counter-inuse") {
        await TellerRepository.setCounterInuse(data.counter);
        const counterStatus = await TellerRepository.getCounterStatus();

        wss.clients.forEach((client) => {
          if (client.readyState === WebSocket.OPEN) {
            client.send(
              JSON.stringify({
                type: "set-counter-status",
                data: counterStatus,
              })
            );
          }
        });
      } else if (data.type === "teller-next-fe") {
        const regularCounters = [
          "Counter 1",
          "Counter 2",
          "Counter 3",
          "Counter 4",
        ];
        const queueNum = await TellerRepository.tellerNext(data.counter);
        console.log("teller-next-fe - queue_number: ", queueNum);
        console.log("counter format as my basis: ", data.counter);

        if (regularCounters.includes(data.counter)) {
          ws?.send(
            JSON.stringify({
              type: "teller-next-regular-be",
              currentQueueNumber: queueNum,
            })
          );
        } else if (data.counter === "Counter A1") {
          ws?.send(
            JSON.stringify({
              type: "teller-next-open-account-be",
              currentQueueNumber: queueNum,
            })
          );
        } else if (data.counter === "Counter P1") {
          ws?.send(
            JSON.stringify({
              type: "teller-next-priority-be",
              currentQueueNumber: queueNum,
            })
          );
        }
      } // LOGOUT
      else if (data.type === "logout") {
        await ReceiptRepository.logout(data.counter);
      }

      // ASSIGN REGULAR RECEIPT
      else if (data.type === "assign-regular-receipt-fe") {
        await ReceiptService.assignRegularReceipt(data.counter);
        const currentRegularQueueNum =
          await QueueService.getCurrentRegularQueueNum(data.counter);
        console.log("backend regular receipt : ", currentRegularQueueNum);

        ws?.send(
          JSON.stringify({
            type: "assign-regular-receipt-be",
            currentRegularQueueNum: currentRegularQueueNum,
          })
        );
      }

      // ASSIGN OPEN ACCOUNT RECEIPT (modified backend)
      else if (data.type === "assign-open-account-receipt-fe") {
        await ReceiptService.assignOpenAccountReceipt(data.counter);
        const currentOpenAccountQueueNum =
          await QueueService.getCurrentOpenAccountQueueNum(data.counter);
        console.log(
          "backend open account queue number: ",
          currentOpenAccountQueueNum
        );

        ws?.send(
          JSON.stringify({
            type: "assign-open-account-receipt-be",
            currentOpenAccountQueueNum: currentOpenAccountQueueNum,
          })
        );
      }

       // ASSIGN PRIORITY RECEIPT
      else if (data.type === "assign-priority-receipt-fe") {
        await ReceiptService.assignPriorityReceipt(data.counter);
        const currentPriorityQueueNum =
          await QueueService.getCurrentPriorityQueueNum(data.counter);
        console.log(
          "backend priority queue number: ",
          currentPriorityQueueNum
        );

        ws?.send(
          JSON.stringify({
            type: "assign-priority-receipt-be",
            currentPriorityQueueNum: currentPriorityQueueNum,
          })
        );
      }

      //REGULAR STARTS HERE
      else if (data.type === "insert-data-regular") {
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
      else if (data.type === "insert-data-priority") {
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
      else if (data.type === "insert-data-openaccount") {
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
