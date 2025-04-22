import { TellerRepository } from "../teller/teller.repository";
import { TellerService } from "../teller/teller.service";

import { QueueService } from "../queue/queue.service";
import { ReceiptRepository } from "./receipt.repository";

export class ReceiptService {
  static async assignRegularReceipt(counter: string) {
    counter = TellerService.formattedCounter(counter);
    if (TellerService.regularCounters.includes(counter)) {
      const { client, customer } =
        await ReceiptRepository.getNextRegularCustomerWithLock();
      const customerId = customer.rows[0]?.regular_receipt_id;

      // testing part:
      console.log(
        `receiptService - assignRegularReceipt - counter: ${counter} fetched uuid: ${customerId}`
      );

      if (customerId) {
        try {
          await ReceiptRepository.assignCustomerToCounter(
            customerId,
            counter,
            client
          );
        } catch (error) {
          await client.query("ROLLBACK");
          console.error("Failed to assign customer:", error);
        } finally {
          client.release();
        }
      } else {
        console.log(`No waiting customer to assign for ${counter}`);
        await client.query("ROLLBACK");
        client.release();
      }
    }

    try {
    } catch (error) {
      console.error(
        "tellerService_assignRegularReceipt cant perform logic side",
        error
      );
    }
  }
}
