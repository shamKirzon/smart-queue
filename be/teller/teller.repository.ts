import pool from "../database/connection";
import { ReceiptService } from "../receipt/receipt.service";
import { TellerService } from "./teller.service";

export class TellerRepository {
  static async getCounterStatus() {
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

  static async tellerNext(counter: string) {
    counter = TellerService.formattedCounter(counter);

    const isRegular = TellerService.isRegularCounter(counter);

    if (isRegular) {
      this.deleteRegular(counter);
    }
  }

  static async fetchInuseRegularCounter() {
    try {
      const query = `SELECT counter_name 
      FROM counters
      WHERE status = 'inuse'`;

      const rawData = await pool.query(query);
      const inuseRegularCounters = rawData.rows

      if(inuseRegularCounters.length >0){
        const inuseCountersName = inuseRegularCounters.map(counter => counter.counter_name)
        return inuseCountersName;

      }else{
        return[] 
      }

    } catch (error) {
      console.error('fetchInusRegular - cant fetch counter inuse', error)
    }
  }

  // deleting functions
  static async deleteRegular(counter: string) {
    try {
      const queryCurrentRegularCustomer = `SELECT regular_receipt_id 
                                    FROM counters 
                                    WHERE counter_name = $1`;
      const currentRegularIdResult = await pool.query(
        queryCurrentRegularCustomer,
        [counter]
      );

      const currentRegularId =
        currentRegularIdResult.rows[0]?.regular_receipt_id;

      if (currentRegularId) {
        const query = `DELETE FROM regular_receipt WHERE regular_receipt_id = $1`;
        await pool.query(query, [currentRegularId]);
        ReceiptService.assignRegularReceipt()

      } else {
        console.warn(`No regular_receipt_id found for counter: ${counter}`);
      }
    } catch (error) {
      console.error("Query Error - deleteRegular: ", error);
    }
  }

  static async deletePriority(counter: string) {}

  static async deleteOpenAccount(counter: string) {}
}
