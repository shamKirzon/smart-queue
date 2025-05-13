import pool from "../database/connection";
import { QueueService } from "./queue.service";
import { PoolClient, QueryResult } from "pg";
import { TellerService } from "../teller/teller.service";

export class QueueRepository {
  static async getRegQueueNum(
    counter: string,
    client: PoolClient
  ): Promise<any> {
    counter = TellerService.formattedCounter(counter);
    console.log("getRegQueueNum() ", counter);

    const rawRegularId = await client.query(`SELECT regular_receipt_id FROM counters
                              WHERE counter_name = $1`, [counter]);
    const regularId = rawRegularId?.rows[0]?.regular_receipt_id;
    
    const rawQueueNumber = await client.query(`SELECT * FROM regular_receipt
                                WHERE regular_receipt_id = $1`, [regularId]);

    return { rawQueueNumber };
  }

  static async getOpenAccountQueueNum(
    counter: string,
    client: PoolClient
  ): Promise<any> {
    counter = TellerService.formattedCounter(counter);
    console.log("getOpenAccountQueueNum() ", counter);

    const queryOpenId = `SELECT open_account_receipt_id FROM counters
                              WHERE counter_name = $1`;
    const rawOpenId = await client.query(queryOpenId, [counter]);
    const openAccountId = rawOpenId?.rows[0]?.open_account_receipt_id;

    const queryQueueNumber = `SELECT * FROM open_account_receipt
                                WHERE open_account_receipt_id = $1`;
    const rawQueueNumber = await client.query(queryQueueNumber, [
      openAccountId,
    ]);

    return { rawQueueNumber };
  }

  static async getPriorityQueueNum(
    counter: string,
    client: PoolClient
  ): Promise<any> {
    counter = TellerService.formattedCounter(counter);
    console.log(counter);

    const queryPriorityId = `SELECT priority_receipt_id FROM counters
                              WHERE counter_name = $1`;
    const rawPriorityId = await client.query(queryPriorityId, [counter]);
    const openAccountId = rawPriorityId?.rows[0]?.priority_receipt_id;

    const queryQueueNumber = `SELECT * FROM priority_receipt
                                WHERE priority_receipt_id = $1`;
    const rawQueueNumber = await client.query(queryQueueNumber, [
      openAccountId,
    ]);

    return { rawQueueNumber };
  }
}
