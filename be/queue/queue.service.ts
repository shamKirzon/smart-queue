import pool from "../database/connection";
import { TellerRepository } from "../teller/teller.repository";
import { TellerService } from "../teller/teller.service";
import { QueueRepository } from "./queue.repository";

export class QueueService {
  static async getCurrentRegularQueueNum(
    counter: string
  ): Promise<string | undefined | any> {
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

      console.log("getCurrentRegularQueueNum() trigger: ", queueNumber);
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

      return queueNumber;
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

      return queueNumber;
    } catch (error) {
      console.log(
        "queueService - getCurrentOpenAccountQueueNum(), - can't get the queueNumber of open account",
        error
      );
    } finally {
      client.release();
    }
  }

  //RINZ
  static async monitorGetData(): Promise<Record<string, string>> {
    const client = await pool.connect();
    try {
      await client.query("BEGIN");
      const counterRows = await QueueRepository.getAllCountersWithQueueNumbers(
        client
      );
      await client.query("COMMIT");

      const monitorQueueNumbers: Record<string, string> = {};

      counterRows.forEach((row) => {
        let displayName: string;
        let queueNumber: string | null | undefined;

        if (TellerService.isRegularCounter(row.counter_name)) {
          displayName = row.counter_name.replace(/counter_/, "Counter ");
          queueNumber = row.regular_queue_number;
        } else if (row.counter_name.toLowerCase() === "counter_a1") {
          displayName = "Counter A1";
          queueNumber = row.open_account_queue_number;
        } else if (row.counter_name.toLowerCase() === "counter_p1") {
          displayName = "Counter P1";
          queueNumber = row.priority_queue_number;
        } else {
          return;
        }

        monitorQueueNumbers[displayName] = queueNumber
          ? queueNumber.toString().padStart(3, "0")
          : "000";
      });

      return monitorQueueNumbers;
    } catch (error) {
      await client.query("ROLLBACK");
      return {
        "Counter 1": "000",
        "Counter 2": "000",
        "Counter 3": "000",
        "Counter 4": "000",
        "Counter A1": "000",
        "Counter P1": "000",
      };
    } finally {
      client.release();
    }
  }

  static async getQueueNumberWithCounterFromCounter(): Promise<Record<string, string> | undefined> {
    const client = await pool.connect();

    try {
      console.log("GET QUEUE NUMBER WITH COUNTER FROM COUNTER --- ")
      client.query("BEGIN");
      const result = await QueueRepository.fetchGetQueueNumberWithCounterFromCounter(client); 
      client.query("COMMIT");
      console.log(`hash latest queue number with counters: ${result}`)
      return result; 


    } catch (err) {

      await client.query("ROLLBACK")
    }finally{
       client.release(); 
    }

    return { hello: "hello" };
  
  }
}
