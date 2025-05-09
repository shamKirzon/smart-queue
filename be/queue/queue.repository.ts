import pool from "../database/connection";
import { QueueService } from "./queue.service";
import { QueryResult } from "pg";
import { TellerService } from "../teller/teller.service";

export class QueueRepository {
  static async getRegQueueNum(counter: string): Promise<any> {
    const client = await pool.connect();

    await client.query("BEGIN");

    const queryRegularId = `SELECT regular_receipt_id FROM counters
                              WHERE counter_name = $1`;
    const rawRegularId = await client.query(queryRegularId, [counter]);
    const regularId = rawRegularId?.rows[0]?.regular_receipt_id;

    const queryQueueNumber = `SELECT * FROM regular_receipt
                                WHERE regular_receipt_id = $1`;
    const rawQueueNumber = await client.query(queryQueueNumber, [regularId]);
    const queueNumber = rawQueueNumber?.rows[0]?.queue_number;

    console.log("queueRepository. getRegQueueNUm: queueNumber: ", queueNumber);

    await client.query("COMMIT");

    return queueNumber;
  }

  static async getOpenAccountQueueNum(counter: string): Promise<any> {
    
     counter = TellerService.formattedCounter(counter);
     console.log(counter)
    const client = await pool.connect();

    await client.query("BEGIN");

    const queryOpenId = `SELECT open_account_receipt_id FROM counters
                              WHERE counter_name = $1`;
    const rawOpenId = await client.query(queryOpenId, [counter]);
    const openAccountId = rawOpenId?.rows[0]?.open_account_receipt_id;

    const queryQueueNumber = `SELECT * FROM open_account_receipt
                                WHERE open_account_receipt_id = $1`;
    const rawQueueNumber = await client.query(queryQueueNumber, [
      openAccountId,
    ]);
    const queueNumber = rawQueueNumber?.rows[0]?.queue_number;

    await client.query("COMMIT");

    console.log(
      "queueRepository. getOpenAccountQueueNUm: queueNumber: ",
      queueNumber
    );

    return queueNumber;
  }

   static async getPriorityQueueNum(counter: string): Promise<any> {
    
     counter = TellerService.formattedCounter(counter);
     console.log(counter)
    const client = await pool.connect();

    await client.query("BEGIN");

    const queryPriorityId = `SELECT priority_receipt_id FROM counters
                              WHERE counter_name = $1`;
    const rawPriorityId = await client.query(queryPriorityId, [counter]);
    const openAccountId = rawPriorityId?.rows[0]?.priority_receipt_id;

    const queryQueueNumber = `SELECT * FROM priority_receipt
                                WHERE priority_receipt_id = $1`;
    const rawQueueNumber = await client.query(queryQueueNumber, [
      openAccountId,
    ]);
    const queueNumber = rawQueueNumber?.rows[0]?.queue_number;

    await client.query("COMMIT");

    console.log(
      "queueRepository. getPriorityQueueNUm: queueNumber: ",
      queueNumber
    );

    return queueNumber;
  }
}
