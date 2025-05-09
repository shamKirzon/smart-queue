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
    const formattedCounter = counter.split('_')[0] + counter.split('_')[1].toUpperCase();

    console.log("this is my formatted counterL ", formattedCounter)
    const queueNum = await QueueRepository.getOpenAccountQueueNum(counter);
    return queueNum;
  }
}
