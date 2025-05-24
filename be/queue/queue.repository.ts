import pool from "../database/connection";
import { QueueService } from "./queue.service";
import { PoolClient, QueryResult } from "pg";
import { TellerService } from "../teller/teller.service";

export class QueueRepository {
  static async getRegQueueNum(
    counter: string,
    client: PoolClient
  ): Promise<string | undefined | any> {
    counter = TellerService.formattedCounter(counter);
    console.log("getRegQueueNum() ", counter);

    const rawRegularId = await client.query(
      `SELECT regular_receipt_id FROM counters
                              WHERE counter_name = $1`,
      [counter]
    );
    const regularId = rawRegularId?.rows[0]?.regular_receipt_id;

    const rawQueueNumber = await client.query(
      `SELECT * FROM regular_receipt
                                WHERE regular_receipt_id = $1`,
      [regularId]
    );

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

  static async getAllCountersWithQueueNumbers(
    client: PoolClient
  ): Promise<any[]> {
    const countersQuery = `
      SELECT 
        c.counter_name,
        r.queue_number AS regular_queue_number,
        oa.queue_number AS open_account_queue_number,
        p.queue_number AS priority_queue_number
      FROM counters c
      LEFT JOIN regular_receipt r ON c.regular_receipt_id = r.regular_receipt_id
      LEFT JOIN open_account_receipt oa ON c.open_account_receipt_id = oa.open_account_receipt_id
      LEFT JOIN priority_receipt p ON c.priority_receipt_id = p.priority_receipt_id
    `;
    const res = await client.query(countersQuery);
    return res.rows;
  }

  static async fetchGetQueueNumberWithCounterFromCounter(client: PoolClient): Promise<Record<string, string> | undefined> {
    const hashCounterQueueNum: Record<string, string > | undefined = {};
   

    try {
      const uuidWithCounter = await client.query(`
  SELECT * FROM counters 
  WHERE status = 'inuse' AND (
    regular_receipt_id IS NOT NULL OR 
    priority_receipt_id IS NOT NULL OR 
    open_account_receipt_id IS NOT NULL
  )
    ORDER BY counters ASC
`);

      // fetching inuse counter and their uuid 
      for (const row of uuidWithCounter.rows) {
        let uuid;
       let queueNum; 

        if (row.priority_receipt_id) {
          uuid = row.priority_receipt_id;
          const queryQueueNum = await client.query(`SELECT queue_number  FROM priority_receipt
                                WHERE priority_receipt_id = $1`, [uuid])
            queueNum = queryQueueNum.rows[0].queue_number
        } else if (row.regular_receipt_id) {
          uuid = row.regular_receipt_id;
           const queryQueueNum = await client.query(`SELECT queue_number  FROM regular_receipt
                                WHERE regular_receipt_id = $1`, [uuid])
            queueNum = queryQueueNum.rows[0].queue_number
        } else if (row.open_account_receipt_id) {
          uuid = row.open_account_receipt_id;
          const queryQueueNum = await client.query(`SELECT queue_number  FROM open_account_receipt
                                WHERE open_account_receipt_id = $1`, [uuid])
            queueNum = queryQueueNum.rows[0].queue_number
        } else uuid = undefined

        if(queueNum){
          hashCounterQueueNum[row.counter_name] = queueNum
        }
      }

      return hashCounterQueueNum

    
      
      // counter_name = queue number 
    } catch (err) {}

   
  }
}
