import { PoolClient } from "pg";
import pool from "../database/connection";
import { QueueService } from "../queue/queue.service";
import { ReceiptService } from "../receipt/receipt.service";
import { TellerService } from "./teller.service";

export class TellerRepository {
  static async getCounterStatus():Promise<any[]> {
    const query = "SELECT counter_name, status FROM counters ";
    const result = await pool.query(query);
    const rawData = result.rows;

    // sorted data:
    const sortedData = rawData.sort((a, b) =>
      a.counter_name.localeCompare(b.counter_name)
    );

    return sortedData;
  }

  static async setCounterInuse(counter: string) {
    counter = TellerService.formattedCounter(counter);

    const query = `UPDATE counters
                    SET status = 'inuse'
                    WHERE counter_name = $1`;

    try {
      await pool.query(query, [counter]);
    } catch (error) {
      console.error("Error updating counter status", error);
    }
  }

  static async setCounterAvailable(counter: string) {
    if (!counter) {
      return;
    }
    counter = TellerService.formattedCounter(counter);

    const query = `UPDATE counters
                    SET status = 'available'
                    WHERE counter_name = $1`;

    try {
      await pool.query(query, [counter]);
    } catch (error) {
      console.error("Error updating counter status", error);
    }
  }

  static async tellerNext(counter: string): Promise<string | undefined> {
    const client = await pool.connect();
    try {
      counter = TellerService.formattedCounter(counter);
      const isRegular = TellerService.isRegularCounter(counter);

      if (isRegular) {
        return this.deleteRegular(counter, client);
      } else if (counter === "counter_A1") {
        return this.deleteOpenAccount(counter, client);
      } else if (counter === "counter_P1") {
        return this.deletePriority(counter, client);
      } else {
        return;
      }
    } finally {
      client.release();
    }
  }

  static async fetchInuseRegularCounter() {
    try {
      const query = `SELECT counter_name 
      FROM counters
      WHERE status = 'inuse'`;

      const rawData = await pool.query(query);
      const inuseRegularCounters = rawData.rows;

      if (inuseRegularCounters.length > 0) {
        const inuseCountersName = inuseRegularCounters.map(
          (counter) => counter.counter_name
        );
        return inuseCountersName;
      } else {
        return [];
      }
    } catch (error) {
      console.error("fetchInusRegular - cant fetch counter inuse", error);
    }
  }

  // deleting functions
  static async deleteRegular(
    counter: string,
    client: PoolClient
  ): Promise<string | undefined> {
    try {
      const queryCurrentRegularCustomer = `SELECT regular_receipt_id 
                                    FROM counters 
                                    WHERE counter_name = $1`;

      const currentRegularIdResult = await client.query(
        queryCurrentRegularCustomer,
        [counter]
      );

      const currentRegularId =
        currentRegularIdResult.rows[0]?.regular_receipt_id;

      if (!currentRegularId) {
        console.warn(
          `No regular_receipt_id found for counter: ${counter}`
        );
        return;
      }

      await client.query("BEGIN");
      const query = `DELETE FROM regular_receipt WHERE regular_receipt_id = $1`;
      await client.query(query, [currentRegularId]);
      await client.query("COMMIT");
      console.log(`deleted successfully, queue number: ${currentRegularId}`);

      await ReceiptService.assignRegularReceipt(counter);
      return await QueueService.getCurrentRegularQueueNum(counter);
    } catch (error) {
      await client.query("ROLLBACK");
      console.error("Query Error - deleteRegular: ", error);
    } 
  }

  

  static async deleteOpenAccount(
    counter: string,
    client: PoolClient
  ): Promise<string | undefined> {
    try {
      const queryCurrentOpenCustomer = `
      SELECT open_account_receipt_id 
      FROM counters 
      WHERE counter_name = $1
    `;
      const currentOpenAccountIdResult = await client.query(
        queryCurrentOpenCustomer,
        [counter]
      );

      const currentOpenAccountId =
        currentOpenAccountIdResult.rows[0]?.open_account_receipt_id;

      if (!currentOpenAccountId) {
        console.warn(
          `No open_account_receipt_id found for counter: ${counter}`
        );
        return;
      }

      await client.query("BEGIN");
      const deleteQuery = `
      DELETE FROM open_account_receipt 
      WHERE open_account_receipt_id = $1
    `;
      await client.query(deleteQuery, [currentOpenAccountId]);
      await client.query("COMMIT");

      console.log(
        `Deleted successfully, queue number: ${currentOpenAccountId}`
      );

      await ReceiptService.assignOpenAccountReceipt(counter);
      return await QueueService.getCurrentOpenAccountQueueNum(counter);
    } catch (error) {
      await client.query("ROLLBACK");
      console.error("Query Error - deleteOpenAccount:", error);
      return;
    }
  }

  static async deletePriority(
    counter: string,
    client: PoolClient
  ): Promise<string | undefined> {
    try {
      const queryCurrentPriorityCustomer = `SELECT priority_receipt_id 
                                    FROM counters 
                                    WHERE counter_name = $1`;

      const currentPriorityIdResult = await client.query(
        queryCurrentPriorityCustomer,
        [counter]
      );
      const currentPriorityId =
        currentPriorityIdResult.rows[0]?.priority_receipt_id;

      if (!currentPriorityId) {
        console.warn(
          `No open_account_receipt_id found for counter: ${counter}`
        );
        return;
      }

      await client.query("BEGIN");
      const query = `DELETE FROM priority_receipt WHERE priority_receipt_id= $1`;
      await client.query(query, [currentPriorityId]);
      await client.query("COMMIT");
      console.log(`deleted successfully, queue number: ${currentPriorityId}`);

      await ReceiptService.assignPriorityReceipt(counter);
      return await QueueService.getCurrentPriorityQueueNum(counter);
    } catch (error) {
      await client.query("ROLLBACK");
      console.error("Query Error - deleteRegular: ", error);
      return;
    }
  }
}
