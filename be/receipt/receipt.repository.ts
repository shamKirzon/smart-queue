import { Pool, PoolClient, QueryResult } from "pg";
import pool from "../database/connection";
import { TellerService } from "../teller/teller.service";
import { ReceiptService } from "./receipt.service";
import { TellerRepository } from "../teller/teller.repository";

export class ReceiptRepository {
  // GET WITH LOCK
  static async getNextRegularCustomerWithLock(client: PoolClient): Promise<{
    customer: any;
  }> {
    const result = await client.query(`
        SELECT * FROM regular_receipt
        WHERE status = 'waiting'
        ORDER BY queue_number ASC
        LIMIT 1
        FOR UPDATE SKIP LOCKED
      `);

    return { customer: result };
  }

  static async getNextOpenAccountCustomer(client: PoolClient): Promise<{
    customer: any;
  }> {
    const result = await client.query(`
        SELECT * FROM open_account_receipt
        WHERE status = 'waiting'
        ORDER BY queue_number ASC
        LIMIT 1; 
      `);

    return { customer: result };
  }

  static async getNextPriorityCustomer(client: PoolClient): Promise<{
    customer: any;
  }> {
    const result = await client.query(`
        SELECT * FROM priority_receipt
        WHERE status = 'waiting'
        ORDER BY queue_number ASC
        LIMIT 1 
      `);

    return { customer: result };
  }

  // ASSIGN
  static async assignCustomerToCounterRegular(
    customerId: QueryResult<any>,
    counter: string,
    client: PoolClient
  ) {
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
        "receiptRepository.assignCustomerToCounterRegular - cant perform query: ",
        error
      );
    }
  }
  static async assignCustomerToCounterOpenAccount(
    customerId: QueryResult<any>,
    counter: string,
    client: PoolClient
  ) {
    const query1 = `UPDATE counters 
                    SET open_account_receipt_id = $1
                    WHERE counter_name = $2`;

    const value1 = [customerId, counter];

    const query2 = `UPDATE open_account_receipt
                    SET status = 'in_progress'
                    WHERE open_account_receipt_id = $1`;
    const value2 = [customerId];

    try {
      await client.query(query1, value1);
      await client.query(query2, value2);
    } catch (error) {
      console.error(
        "receiptRepository.assignCustomerToCounterOpenAccount - cant perform query: ",
        error
      );
      throw error;
    }
  }

  static async assignCustomerToCounterPriority(
    customerId: QueryResult<any>,
    counter: string,
    client: PoolClient
  ) {
    const query1 = `UPDATE counters 
                    SET priority_receipt_id = $1
                    WHERE counter_name = $2`;

    const value1 = [customerId, counter];

    const query2 = `UPDATE priority_receipt
                    SET status = 'in_progress'
                    WHERE priority_receipt_id = $1`;
    const value2 = [customerId];

    try {
      await client.query(query1, value1);
      await client.query(query2, value2);
    } catch (error) {
      console.error(
        "receiptRepository.assignCustomerToCounterPriority - cant perform query: ",
        error
      );
      throw error;
    }
  }

  // INSERT
  static async insertRegularReceipt(
    transaction: string[],
    customerType: string,
    queueNumber: string,
    date: string,
    time: string
  ): Promise<string | undefined> {
    const query1 = `
      INSERT INTO regular_receipt (regular_receipt_id, transaction, queue_number, date, time, status)
      VALUES (gen_random_uuid(), $1, $2, $3, $4, 'waiting')
    `;
    const values = [transaction, queueNumber, date, time];

    try {
      await pool.query(query1, values);
      console.log("Regular receipt inserted successfully.");

      const firstData = await pool.query(`SELECT * FROM regular_receipt
                    ORDER BY queue_number ASC`);

      const waitingRegularCounters =
        await pool.query(`SELECT counter_name, status FROM counters
                   WHERE regular_receipt_id IS NULL AND status  = 'inuse'
                  ORDER BY counter_name ASC

        `);

        const waitingRows = waitingRegularCounters.rows.length; 

      console.log("INSERTING RECEIPT - ", waitingRegularCounters);

      // row.length <= counterStatus => {assignCounter}

     
      // first row new queue number
      if (firstData.rows[0].queue_number === queueNumber) {
        return "first row triggers";
      } 
      // distribute new incoming queue number on waiting tellers. 
      else if(firstData.rows.length <= waitingRows ){
        // const var =  waitingRegularCounters.map(counter => counter.counter_name)
        // himayin natin ang mga inuse counters na waiting
        // assignRegularReceipt(counter)
        
        // var = ['counter_1', 'counter_2']
      }
     
    } catch (error) {
      console.error("Error inserting regular receipt:", error);
      throw error;
    }
  }

  static async insertPriorityReceipt(
    transaction: string[],
    customerType: string,
    queueNumber: string,
    date: string,
    time: string
  ): Promise<string | undefined> {
    const query = `
      INSERT INTO priority_receipt (priority_receipt_id, transaction, queue_number, date, time, status)
      VALUES (gen_random_uuid(), $1, $2, $3, $4, 'waiting')
    `;

    const values = [transaction, queueNumber, date, time];

    try {
      await pool.query(query, values);
      console.log("priority receipt inserted successfully.");

      const firstData = await pool.query(`SELECT * FROM priority_receipt
                    ORDER BY queue_number ASC`);

      if (firstData.rows[0].queue_number === queueNumber) {
        return "first row triggers";
      } else {
        return;
      }
    } catch (error) {
      console.error("Error inserting priority receipt:", error);
      throw error;
    }
  }

  static async insertOpenAccountReceipt(
    transaction: string[],
    customerType: string,
    queueNumber: string,
    date: string,
    time: string
  ): Promise<string | undefined> {
    const query = `
      INSERT INTO open_account_receipt (open_account_receipt_id, transaction, queue_number, date, time, status)
      VALUES (gen_random_uuid(), $1, $2, $3, $4, 'waiting')
    `;

    const values = [transaction, queueNumber, date, time];

    try {
      await pool.query(query, values);
      console.log("Open Account receipt inserted successfully.");

      const firstData = await pool.query(`SELECT * FROM open_account_receipt
                    ORDER BY queue_number ASC`);

      if (firstData.rows[0].queue_number === queueNumber) {
        return "first row triggers";
      } else {
        return;
      }
    } catch (error) {
      console.error("Error inserting Open Account receipt:", error);
      throw error;
    }
  }

  /**
  // Get last queue number for regular_receipt
  static async getLastRegularQueueNumber(): Promise<string | null> {
    const result = await pool.query(
      `SELECT queue_number FROM regular_receipt ORDER BY queue_number::int DESC LIMIT 1`
    );
    return result.rows[0]?.queue_number ?? null;
  }

  // Get last queue number for priority_receipt
  static async getLastPriorityQueueNumber(): Promise<string | null> {
    const result = await pool.query(
      `SELECT queue_number FROM priority_receipt ORDER BY queue_number::int DESC LIMIT 1`
    );
    return result.rows[0]?.queue_number ?? null;
  }

  // Get last queue number for open_account_receipt
  static async getLastOpenAccountQueueNumber(): Promise<string | null> {
    const result = await pool.query(
      `SELECT queue_number FROM open_account_receipt ORDER BY queue_number::int DESC LIMIT 1`
    );
    return result.rows[0]?.queue_number ?? null;
  }

   */

  // LOGOUT /RESET
  static async resetReceipt(
    client: PoolClient,
    tableName: string,
    receiptColumn: string,
    counter: string
  ) {
    const result = await client.query(
      `SELECT ${receiptColumn} FROM counters WHERE counter_name = $1`,
      [counter]
    );
    const receiptId = result.rows[0]?.[receiptColumn];

    if (!receiptId) return;

    await client.query(
      `UPDATE ${tableName} SET status = 'waiting' WHERE ${receiptColumn} = $1`,
      [receiptId]
    );

    await client.query(
      `UPDATE counters SET status = 'available', ${receiptColumn} = null WHERE counter_name = $1`,
      [counter]
    );
  }
}
