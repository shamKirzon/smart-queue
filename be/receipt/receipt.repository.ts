import { Pool, PoolClient, QueryResult } from "pg";
import pool from "../database/connection";
import { TellerService } from "../teller/teller.service";
import { ReceiptService } from "./receipt.service";

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

       // shami additional logic: 
       const firstData =  await pool.query(`SELECT * FROM regular_receipt
                    ORDER BY queue_number ASC`); 

        
      if(firstData.rows[0].queue_number === queueNumber)  {
        return "first row triggers"
      } else{
        return
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

  static async insertOpenAccountReceipt(
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

    const client = await pool.connect();

    if (regularCounters.includes(counter)) {
      try {
        await client.query("BEGIN");

        const result = await client.query(
          `SELECT regular_receipt_id FROM counters WHERE counter_name = $1`,
          [counter]
        );

        const currentRegularId = result.rows[0]?.regular_receipt_id;

        if (!currentRegularId) {
          throw new Error(
            `No regular_receipt_id found for counter: ${counter}`
          );
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
    } else if (counter === "counter_A1") {
      try {
        await client.query("BEGIN");

        const result = await client.query(
          `SELECT open_account_receipt_id FROM counters WHERE counter_name = $1`,
          [counter]
        );

        const currentOpenAccountId = result.rows[0]?.open_account_receipt_id;

        if (!currentOpenAccountId) {
          throw new Error(
            `No regular_receipt_id found for counter: ${counter}`
          );
        }

        await client.query(
          `UPDATE open_account_receipt SET status = 'waiting' WHERE open_account_receipt_id = $1`,
          [currentOpenAccountId]
        );

        await client.query(
          `UPDATE counters SET status = 'available', open_account_receipt_id = null WHERE counter_name = $1`,
          [counter]
        );

        await client.query("COMMIT");
      } catch (error) {
        console.log("receiptRepository - logout() ", error);
        await client.query("ROLLBACK");
      } finally {
        client.release();
      }
    } else if (counter === "counter_P1") {
      try {
        await client.query("BEGIN");

        const result = await client.query(
          `SELECT priority_receipt_id FROM counters WHERE counter_name = $1`,
          [counter]
        );

        const currentPriorityId = result.rows[0]?.priority_receipt_id;

        if (!currentPriorityId) {
          throw new Error(
            `No regular_receipt_id found for counter: ${counter}`
          );
        }

        await client.query(
          `UPDATE priority_receipt SET status = 'waiting' WHERE priority_receipt_id = $1`,
          [currentPriorityId]
        );

        await client.query(
          `UPDATE counters SET status = 'available', priority_receipt_id = null WHERE counter_name = $1`,
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
}
