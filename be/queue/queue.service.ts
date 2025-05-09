import { TellerRepository } from "../teller/teller.repository";
import { TellerService } from "../teller/teller.service";
import { QueueRepository } from "./queue.repository";

export class QueueService {
  static async getCurrentRegularQueueNum(counter: string): Promise<string> {
    counter = TellerService.formattedCounter(counter);
    const queueNum = await QueueRepository.getRegQueueNum(counter);
    return queueNum;
  }

  static async getCurrentOpenAccountQueueNum(counter: string): Promise<string> {
    counter = TellerService.formattedCounter(counter);
    const queueNum = await QueueRepository.getOpenAccountQueueNum(counter);
    return queueNum;
  }

   static async getCurrentPriorityQueueNum(counter: string): Promise<string> {
    counter = TellerService.formattedCounter(counter);
    const queueNum = await QueueRepository.getPriorityQueueNum(counter);
    return queueNum;
  }
}
