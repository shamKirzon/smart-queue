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

      const queueNumbers = new Map()
      // to not limit the counter sequentially, runs at the same time.
      // await Promise.all(
      //   inuseRegularCounters.map(async (counter) => {

      //     if (!queueNumbers.has(counter)) {
      //       const customer =
      //         await ReceiptRepository.getNextRegularCustomerWithLock();
      //       const customerId = customer.rows[0]?.regular_receipt_id;

      //       if (customerId) {
      //         queueNumbers.set(counter, customerId);
      //         await ReceiptRepository.assignCustomerToCounter(customerId, counter);
      //       } else {
      //         console.log(`No waiting customer to assign for ${counter}`);
      //       }
      //     }
          
      //   })
      // );

      await Promise.all(
        inuseRegularCounters.map(async (counter) => {
          if (!queueNumbers.has(counter)) {
            const { client, customer } = await ReceiptRepository.getNextRegularCustomerWithLock();
            const customerId = customer.rows[0]?.regular_receipt_id;
      
            if (customerId) {
              try {
                queueNumbers.set(counter, customerId);
                await ReceiptRepository.assignCustomerToCounter(customerId, counter, client);
                await client.query('COMMIT');
              } catch (error) {
                await client.query('ROLLBACK');
                console.error('Failed to assign customer:', error);
              } finally {
                client.release();
              }
            } else {
              console.log(`No waiting customer to assign for ${counter}`);
              await client.query('ROLLBACK');
              client.release();
            }
          }
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
