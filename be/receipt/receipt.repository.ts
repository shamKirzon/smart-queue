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
    // check if the status of the counter is 'inuse' if yes do this:
    const query1 = `UPDATE counters 
                    SET priority_receipt_id = $1
                    WHERE counter_name = $2 `;

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

    // queue-based waiting counters. (FIFO ito )
    const waitingRegularCounterQueue: string[] = [];

    try {
    async function updateWaitingRegularCounterQueue() {

       const waitingRegularCounters =
        await pool.query(`SELECT counter_name, status FROM counters
                   WHERE regular_receipt_id IS NULL AND status  = 'inuse'
        `);

      waitingRegularCounters.rows.forEach((row) => {
        const counter = row.counter_name; 

        if(!waitingRegularCounterQueue.includes(counter)){
          waitingRegularCounterQueue.push(counter); 
        }
      })

    }

    const query1 = `
      INSERT INTO regular_receipt (regular_receipt_id, transaction, queue_number, date, time, status)
      VALUES (gen_random_uuid(), $1, $2, $3, $4, 'waiting')
    `;
    const values = [transaction, queueNumber, date, time];

    
      await pool.query(query1, values);
      console.log("Regular receipt inserted successfully.");

      const firstData = await pool.query(`SELECT * FROM regular_receipt
                    ORDER BY queue_number ASC`);
          
      await updateWaitingRegularCounterQueue()

      if (
        (firstData.rows[0].queue_number === queueNumber && waitingRegularCounterQueue.length > 0) ||
        waitingRegularCounterQueue.length > 0
      ) {
        console.log("PUMAPASOK SA GINAWA MONG FIFO !")
        const firstWaitingCounter = waitingRegularCounterQueue.shift();
        if (firstWaitingCounter) {
          await ReceiptService.assignRegularReceipt(firstWaitingCounter);
          return firstWaitingCounter
        }
        return
      }
      else return 
      

      // waiting regular counters
     
      // const inuseRegular = waitingRegularCounters.rows.map((rows) => ({
      //   counterName: rows.counter_name,
      //   status: rows.status,
      // }));

      // const firstCounterAvailable = inuseRegular.find(
      //   (counter) => counter.counterName
      // );
      
      // console.log("QUERY WAITING REGULAR  - ", waitingRegularCounters);
      // console.log("WAITING REGULAR COUNTERS MAP - ", inuseRegular);
      // console.log("FIRST COUNTER AVAILABLE- ", firstCounterAvailable);

      // if (
      //   (firstData.rows[0].queue_number === queueNumber &&
      //     firstCounterAvailable?.counterName) ||
      //   firstCounterAvailable?.counterName
      // ) {
      //   console.log(
      //     "FIRST COUNTER WAITING: ",
      //     firstCounterAvailable?.counterName
      //   );
      //   await ReceiptService.assignRegularReceipt(
      //     firstCounterAvailable?.counterName
      //   );
      //   return firstCounterAvailable?.counterName;
        
      // } else {
      //   // console.log('FIRST COUNTER WAITING: ', firstCounterAvailable?.counterName)
      //   //  await ReceiptService.assignRegularReceipt(firstCounterAvailable?.counterName)
      //   //  return firstCounterAvailable?.counterName;
      //   return;
      // }
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
  ) {
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

   
      const queryPriorityStatus = await pool.query(
        `SELECT status FROM counters WHERE counter_name = 'counter_P1'`
      );

      if (firstData.rows[0].queue_number === queueNumber && queryPriorityStatus.rows[0].status === 'inuse') {
         await ReceiptService.assignPriorityReceipt(
          'Counter P1'
        );
        
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

         const queryOpenAccountStatus = await pool.query(
        `SELECT status FROM counters WHERE counter_name = 'counter_A1'`
      );

      if (firstData.rows[0].queue_number === queueNumber && queryOpenAccountStatus.rows[0].status === 'inuse') {
         await ReceiptService.assignOpenAccountReceipt(
          'Counter A1'
        );
      } else {
        return;
      }
    } catch (error) {
      console.error("Error inserting Open Account receipt:", error);
      throw error;
    }
  }

  
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
