import pool from "../database/connection";
import { QueueService } from "./queue.service";
import { QueryResult } from "pg";

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
}
