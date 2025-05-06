import { PoolClient, QueryResult } from "pg";
import pool from "../database/connection";

export class ReceiptRepository {


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

  //receipt creation
  static async insertRegularReceipt(
    transaction: string[],
    customerType: string,
    queueNumber: string,
    date: string,
    time: string
  ): Promise<void> {
    const query = `
      INSERT INTO regular_receipt (regular_receipt_id, transaction, queue_number, date, time, status)
      VALUES (gen_random_uuid(), $1, $2, $3, $4, 'waiting')
    `;

    const values = [transaction, queueNumber, date, time];

    try {
      await pool.query(query, values);
      console.log("Regular receipt inserted successfully.");
    } catch (error) {
      console.error("Error inserting regular receipt:", error);
      throw error;
    }
  }
  //Priority creation
  static async insertPriorityReceipt(
    transaction: string[],
    customerType: string,
    queueNumber: string,
    date: string,
    time: string
  ): Promise<void> {
    const query = `
      INSERT INTO priority_receipt (priority_receipt_id, transaction, queue_number, date, time, status)
      VALUES (gen_random_uuid(), $1, $2, $3, $4, 'waiting')
    `;

    const values = [transaction, queueNumber, date, time];

    try {
      await pool.query(query, values);
      console.log("priority receipt inserted successfully.");
    } catch (error) {
      console.error("Error inserting priority receipt:", error);
      throw error;
    }
  }
  //Open Account creation
  static async insertOpenAccounteceipt(
    transaction: string[],
    customerType: string,
    queueNumber: string,
    date: string,
    time: string
  ): Promise<void> {
    const query = `
      INSERT INTO open_account_receipt (open_account_receipt_id, transaction, queue_number, date, time, status)
      VALUES (gen_random_uuid(), $1, $2, $3, $4, 'waiting')
    `;

    const values = [transaction, queueNumber, date, time];

    try {
      await pool.query(query, values);
      console.log("Open Account receipt inserted successfully.");
    } catch (error) {
      console.error("Error inserting Open Account receipt:", error);
      throw error;
    }
  }

  // logout
  static async logout(counter: string) {
    counter = counter.toLowerCase().replace(" ", "_"); 
    console.log(counter)


    const client = await pool.connect();
  
    try {
      await client.query("BEGIN");
  
      const result = await client.query(
       `SELECT regular_receipt_id FROM counters WHERE counter_name = $1`,
        [counter] 
      );
  
      const currentRegularId = result.rows[0]?.regular_receipt_id;
  
      if (!currentRegularId) {
        throw new Error(`No regular_receipt_id found for counter: ${counter}`);
      }
  
      await client.query(
        `UPDATE regular_receipt SET status = 'waiting' WHERE regular_receipt_id = $1`,
        [currentRegularId]
      );
  
      await client.query(
        `UPDATE counters SET status = 'available', regular_receipt_id = null WHERE counter_name = $1`,
        [counter]
      );
  
      await client.query("COMMIT");
    } catch (error) {
      console.log("receiptRepository - logout() ", error);
      await client.query("ROLLBACK");
    } finally {
      client.release();
    }
  }
  
}
