import { TellerRepository } from "../teller/teller.repository";
import { TellerService } from "../teller/teller.service";

import { QueueService } from "../queue/queue.service";
import { ReceiptRepository } from "./receipt.repository";

export class ReceiptService {
  static async assignRegularReceipt() {
    const inuseRegularCounters =
      await TellerRepository.fetchInuseRegularCounter();

    //checking:
    if (
      inuseRegularCounters?.some((counter) =>
        TellerService.regularCounters.includes(counter)
      )
    ) {

      // to not limit the counter sequentially, runs at the same time.
      await Promise.all(
        inuseRegularCounters.map(async (counter) => {
          let customer =
            await ReceiptRepository.getNextRegularCustomerWithLock();
        
            customer = customer.rows[0].regular_receipt_id; 

          if (!counter) {
            console.log(`no waiting customer to assign for ${counter}`);
            return;
          }

          await ReceiptRepository.assignCustomerToCounter(customer, counter)
        })

       
      );

      

      try {
      } catch (error) {
        console.error(
          "tellerService_assignRegularReceipt cant perform logic side",
          error
        );
      }
    } else {
      return;
    }
  }
 
}
