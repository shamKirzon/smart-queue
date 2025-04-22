import { PoolClient, QueryResult } from "pg";
import pool from "../database/connection";

export class ReceiptRepository {
  // customerType !== 'regular' &&& 'priority' ? setOpenAccountReceipt() : return.
  // same as the other...

  // static async getNextRegularCustomerWithLock(): Promise<QueryResult<any>> {
  //   const query1 = ` SELECT * FROM regular_receipt
  //                                 WHERE status = 'waiting'
  //                                 ORDER BY queue_number ASC
  //                                 LIMIT 1
  //                                 FOR UPDATE SKIP LOCKED`;

  //   const customer = await pool.query(query1);
  //   return customer;
  // }

  static async getNextRegularCustomerWithLock(): Promise<{
    client: PoolClient;
    customer: any;
  }> {
    const client = await pool.connect();

    try {
      await client.query("BEGIN");

      const result = await client.query(`
        SELECT * FROM regular_receipt
        WHERE status = 'waiting'
        ORDER BY queue_number ASC
        LIMIT 1
        FOR UPDATE SKIP LOCKED
      `);

      return { client, customer: result };
    } catch (err) {
      await client.query("ROLLBACK");
      client.release();
      throw err;
    }
  }

  static async assignCustomerToCounter(
    customerId: QueryResult<any>,
    counter: string,
    client: PoolClient
  ) {
    // bug: narread ng query natin yung dalawang counter it must be 1 counter lang
    const query1 = `UPDATE counters 
                    SET regular_receipt_id = $1
                    WHERE counter_name = $2`;

    const value1 = [customerId, counter];

    const query2 = `UPDATE regular_receipt
                    SET status = 'in_progress'
                    WHERE regular_receipt_id = $1`;
    const value2 = [customerId];

    try {
      await client.query("BEGIN");
      await client.query(query1, value1);
      await client.query(query2, value2);
      await client.query("COMMIT");
    } catch (error) {
      await client.query("ROLLBACK");
      console.error(
        "receiptRepository.assignCustomerToCounter - cant perform query: ",
        error
      );
    }
  }
}
