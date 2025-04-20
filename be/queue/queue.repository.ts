import pool from "../database/connection";
import { QueueService } from "./queue.service";
import { QueryResult } from "pg";

export class QueueRepository {
  static async getRegQueueNum(counter: string){
    try {
      const query1 = `SELECT regular_receipt_id FROM counters
                            WHERE counter_name = $1  `;

      const rawData1 = await pool.query(query1, [counter]);
      const receiptId = rawData1?.rows[0].regular_receipt_id;



      const query2 = `SELECT queue_number FROM regular_receipt
        WHERE regular_receipt_id = $1`;

      const rawData2 = await pool.query(query2, [receiptId]);
      const currentRegularQueueNumber = rawData2?.rows[0].queue_number;

      return currentRegularQueueNumber; 

    } catch (error) {
      console.error(
        "queueRepository.getRegQueueNum - cant get queue number ",
        error
      );

      
    }
  }
}
