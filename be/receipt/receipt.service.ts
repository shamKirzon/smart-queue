import { TellerRepository } from "../teller/teller.repository";
import { TellerService } from "../teller/teller.service";

import { QueueService } from "../queue/queue.service";
import { ReceiptRepository } from "./receipt.repository";
import pool from "../database/connection";
import { PoolClient } from "pg";

export class ReceiptService {
  // ASSIGN:
  static async assignRegularReceipt(counter: string): Promise<any> {
    const client = await pool.connect();
    counter = TellerService.formattedCounter(counter);

   try{
     if (TellerService.regularCounters.includes(counter)) {
      await client.query("BEGIN");
      const { customer } =
        await ReceiptRepository.getNextRegularCustomerWithLock(client);

      const customerId = customer.rows[0]?.regular_receipt_id;

      // testing part:
      console.log(
        `receiptService - assignRegularReceipt - counter: ${counter} fetched uuid: ${customerId}`
      );

      if (customerId) {
        await ReceiptRepository.assignCustomerToCounterRegular(
          customerId,
          counter,
          client
        );
        await client.query("COMMIT");
      } else {
        console.log(`No waiting customer to assign for ${counter}`);
        await client.query("ROLLBACK");
        return; 
      }
    }
   }catch(error){
      client.query("ROLLBACK"); 
      console.log("Failed to assign customer", error)
   }finally{
    client.release(); 
   }
  
  }

  static async assignOpenAccountReceipt(counter: string) {
    const client = await pool.connect();
    counter = TellerService.formattedCounter(counter);

    try {
      await client.query("BEGIN");

      const { customer } = await ReceiptRepository.getNextOpenAccountCustomer(
        client
      );
      const customerId = customer.rows[0]?.open_account_receipt_id;

      // testing part:
      console.log(
        `receiptService - assignOpenAccountReceipt - counter: ${counter} fetched uuid: ${customerId}`
      );

      if (customerId) {
        await ReceiptRepository.assignCustomerToCounterOpenAccount(
          customerId,
          counter,
          client
        );
        await client.query("COMMIT");
      } else {
        console.log(`No waiting customer to assign for ${counter}`);
        await client.query("ROLLBACK");
        return;
      }
    } catch (error) {
      await client.query("ROLLBACK");
      console.error("Failed to assign customer:", error);
    } finally {
      client.release();
    }
  }

  static async assignPriorityReceipt(counter: string) {
    const client = await pool.connect();
    counter = TellerService.formattedCounter(counter);

    try {
      await client.query("BEGIN");
      const { customer } = await ReceiptRepository.getNextPriorityCustomer(
        client
      );
      const customerId = customer.rows[0]?.priority_receipt_id;

      // testing part:
      console.log(
        `receiptService - assignPriorityReceipt - counter: ${counter} fetched uuid: ${customerId}`
      );

      if (customerId) {
        await ReceiptRepository.assignCustomerToCounterPriority(
          customerId,
          counter,
          client
        );
        await client.query("COMMIT");
      } else {
        console.log(`No waiting customer to assign for ${counter}`);
        await client.query("ROLLBACK");
        return;
      }
    } catch (error) {
      client.query("ROLLBACK");
      console.error("Failed to assign customer:", error);
    } finally {
      client.release();
    }
  }

  // CREATE:
  static async createRegularReceipt(
    transaction: string[],
    customerType: string,
    queueNumber: string,
    date: string,
    time: string
  ): Promise<string | undefined> {
    if (customerType !== "Regular") {
      console.warn("Customer type is not 'Regular'. Skipping insertion.");
      return;
    }

    try {
      const trigger = await ReceiptRepository.insertRegularReceipt(
        transaction,
        customerType,
        queueNumber,
        date,
        time
      );

      return trigger;  
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
  ): Promise<string | undefined> {
    if (customerType !== "Priority") {
      console.warn("Customer type is not 'Priority'. Skipping insertion.");
      return;
    }

    try {
      const trigger = await ReceiptRepository.insertPriorityReceipt(
        transaction,
        customerType,
        queueNumber,
        date,
        time
      );

      return trigger; 
    } catch (error) {
      console.error("Error creating Priority receipt:", error);
      throw error;
    }
  }

  static async createOpenAccountReceipt(
    transaction: string[],
    customerType: string,
    queueNumber: string,
    date: string,
    time: string
  ): Promise<string|undefined> {
    if (customerType !== "OpenAccount") {
      console.warn("Customer type is not 'Open Account'. Skipping insertion.");
      return;
    }

    try {
      const trigger = await ReceiptRepository.insertOpenAccountReceipt(
        transaction,
        customerType,
        queueNumber,
        date,
        time
      );

      return trigger; 
    } catch (error) {
      console.error("Error creating Open Account receipt:", error);
      throw error;
    }
  }

   
// LOGOUT
   static async logout(counter: string) {
    const regularCounters = [
      "counter_1",
      "counter_2",
      "counter_3",
      "counter_4",
    ];
    counter = TellerService.formattedCounter(counter);
    console.log("THIS IS FROM LOGOUT!! COUNTER: ", counter);

    // const client = await pool.connect();

    // if (regularCounters.includes(counter)) {
    //   try {
    //     await client.query("BEGIN");

    //     const result = await client.query(
    //       `SELECT regular_receipt_id FROM counters WHERE counter_name = $1`,
    //       [counter]
    //     );

    //     const currentRegularId = result.rows[0]?.regular_receipt_id;

    //     if (!currentRegularId) {
    //       // throw new Error(
    //       //   `No regular_receipt_id found for counter: ${counter}`
    //       // );
    //       return;
    //     }

    //     await client.query(
    //       `UPDATE regular_receipt SET status = 'waiting' WHERE regular_receipt_id = $1`,
    //       [currentRegularId]
    //     );

    //     await client.query(
    //       `UPDATE counters SET status = 'available', regular_receipt_id = null WHERE counter_name = $1`,
    //       [counter]
    //     );

    //     await client.query("COMMIT");
    //   } catch (error) {
    //     console.log("receiptRepository - logout() ", error);
    //     await client.query("ROLLBACK");
    //   } finally {
    //     client.release();
    //   }
    // } else if (counter === "counter_A1") {
    //   try {
    //     await client.query("BEGIN");

    //     const result = await client.query(
    //       `SELECT open_account_receipt_id FROM counters WHERE counter_name = $1`,
    //       [counter]
    //     );

    //     const currentOpenAccountId = result.rows[0]?.open_account_receipt_id;

    //     if (!currentOpenAccountId) {
    //       // throw new Error(
    //       //   `No regular_receipt_id found for counter: ${counter}`
    //       // );
    //       return;
    //     }

    //     await client.query(
    //       `UPDATE open_account_receipt SET status = 'waiting' WHERE open_account_receipt_id = $1`,
    //       [currentOpenAccountId]
    //     );

    //     await client.query(
    //       `UPDATE counters SET status = 'available', open_account_receipt_id = null WHERE counter_name = $1`,
    //       [counter]
    //     );

    //     await client.query("COMMIT");
    //   } catch (error) {
    //     console.log("receiptRepository - logout() ", error);
    //     await client.query("ROLLBACK");
    //   } finally {
    //     client.release();
    //   }
    // } else if (counter === "counter_P1") {
    //   try {
    //     await client.query("BEGIN");

    //     const result = await client.query(
    //       `SELECT priority_receipt_id FROM counters WHERE counter_name = $1`,
    //       [counter]
    //     );

    //     const currentPriorityId = result.rows[0]?.priority_receipt_id;

    //     if (!currentPriorityId) {
    //       // throw new Error(
    //       //   `No regular_receipt_id found for counter: ${counter}`
    //       // );
    //       return;
    //     }

    //     await client.query(
    //       `UPDATE priority_receipt SET status = 'waiting' WHERE priority_receipt_id = $1`,
    //       [currentPriorityId]
    //     );

    //     await client.query(
    //       `UPDATE counters SET status = 'available', priority_receipt_id = null WHERE counter_name = $1`,
    //       [counter]
    //     );

    //     await client.query("COMMIT");
    //   } catch (error) {
    //     console.log("receiptRepository - logout() ", error);
    //     await client.query("ROLLBACK");
    //   } finally {
    //     client.release();
    //   }
    // }

    const client = await pool.connect();

try {
  await client.query("BEGIN");

  if (regularCounters.includes(counter)) {
    await ReceiptRepository.resetReceipt(client, "regular_receipt", "regular_receipt_id", counter);
  } else if (counter === "counter_A1") {
    await ReceiptRepository.resetReceipt(client, "open_account_receipt", "open_account_receipt_id", counter);
  } else if (counter === "counter_P1") {
    await ReceiptRepository.resetReceipt(client, "priority_receipt", "priority_receipt_id", counter);
  }

  await client.query("COMMIT");
} catch (error) {
  console.error("logout error:", error);
  await client.query("ROLLBACK");
} finally {
  client.release();
}

  }
  
}
