import pool from "../database/connection";
import { TellerRepository } from "../teller/teller.repository";
import { TellerService } from "../teller/teller.service";
import { QueueRepository } from "./queue.repository";

export class QueueService {
  static async getCurrentRegularQueueNum(counter: string): Promise<string | undefined |any> {
    counter = TellerService.formattedCounter(counter);
    const client = await pool.connect();

    try {
      client.query("BEGIN");
      const { rawQueueNumber } = await QueueRepository.getRegQueueNum(
        counter,
        client
      );
      const queueNumber = rawQueueNumber?.rows[0]?.queue_number;
      await client.query("COMMIT");

      console.log("getCurrentRegularQueueNum() trigger: ", queueNumber)
      return queueNumber ? queueNumber : undefined;

    } catch (error) {
      client.query("ROLLBACK");
    } finally {
      client.release();
    }
  }

  static async getCurrentOpenAccountQueueNum(counter: string): Promise<any> {
    counter = TellerService.formattedCounter(counter);
    const client = await pool.connect();

    try {
      await client.query("BEGIN");

      const { rawQueueNumber } = await QueueRepository.getOpenAccountQueueNum(
        counter,
        client
      );
      const queueNumber = rawQueueNumber?.rows[0]?.queue_number;

      await client.query("COMMIT");

      return queueNumber ;
    } catch (error) {
      console.log(
        "queueService - getCurrentOpenAccountQueueNum(), - can't get the queueNumber of open account",
        error
      );
    } finally {
      client.release();
    }
  }

  static async getCurrentPriorityQueueNum(counter: string): Promise<any> {
    counter = TellerService.formattedCounter(counter);
    const client = await pool.connect();

    try {
      await client.query("BEGIN");

      const { rawQueueNumber } = await QueueRepository.getPriorityQueueNum(
        counter,
        client
      );
      const queueNumber = rawQueueNumber?.rows[0]?.queue_number;

      await client.query("COMMIT");

      return queueNumber ;
    } catch (error) {
      console.log(
        "queueService - getCurrentOpenAccountQueueNum(), - can't get the queueNumber of open account",
        error
      );
    } finally {
      client.release();
    }
  }
}
