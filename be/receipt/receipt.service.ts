import { TellerRepository } from "../teller/teller.repository";
import { TellerService } from "../teller/teller.service";

import { QueueService } from "../queue/queue.service";
import { ReceiptRepository } from "./receipt.repository";

export class ReceiptService {

  // ASSIGN: 
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
          await ReceiptRepository.assignCustomerToCounterRegular(
            customerId,
            counter,
            client
          );
        } catch (error) {
          await client.query("ROLLBACK");
          console.error("Failed to assign customer:", error);
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

  static async assignOpenAccountReceipt(counter: string) {
    counter = TellerService.formattedCounter(counter);
    
      const { client, customer } =
        await ReceiptRepository.getNextOpenAccountCustomerWithLock();
      const customerId = customer.rows[0]?.open_account_receipt_id

      // testing part:
      console.log(
        `receiptService - assignOpenAccountReceipt - counter: ${counter} fetched uuid: ${customerId}`
      );

      if (customerId) {
        try {
          await ReceiptRepository.assignCustomerToCounterOpenAccount(
            customerId,
            counter,
            client
          );
        } catch (error) {
          await client.query("ROLLBACK");
          console.error("Failed to assign customer:", error);
          client.release(); 
        } 
      } else {
        console.log(`No waiting customer to assign for ${counter}`);
      }
  }


  // CREATE:
  static async createRegularReceipt(
    transaction: string[],
    customerType: string,
    queueNumber: string,
    date: string,
    time: string
  ): Promise<void> {
    if (customerType !== "Regular") {
      console.warn("Customer type is not 'Regular'. Skipping insertion.");
      return;
    }

    try {
      await ReceiptRepository.insertRegularReceipt(
        transaction,
        customerType,
        queueNumber,
        date,
        time
      );
    } catch (error) {
      console.error("Error creating regular receipt:", error);
      throw error;
    }
  }

  static async createPriorityReceipt(
    transaction: string[],
    customerType: string,
    queueNumber: string,
    date: string,
    time: string
  ): Promise<void> {
    if (customerType !== "Priority") {
      console.warn("Customer type is not 'Priority'. Skipping insertion.");
      return;
    }

    try {
      await ReceiptRepository.insertPriorityReceipt(
        transaction,
        customerType,
        queueNumber,
        date,
        time
      );
    } catch (error) {
      console.error("Error creating Priority receipt:", error);
      throw error;
    }
  }

  static async  createOpenAccountReceipt(
    transaction: string[],
    customerType: string,
    queueNumber: string,
    date: string,
    time: string
  ): Promise<void> {
    if (customerType !== "Open Account") {
      console.warn("Customer type is not 'Open Account'. Skipping insertion.");
      return;
    }

    try {
      await ReceiptRepository.insertOpenAccounteceipt(
        transaction,
        customerType,
        queueNumber,
        date,
        time
      );
    } catch (error) {
      console.error("Error creating Open Account receipt:", error);
      throw error;
    }
  }




}
