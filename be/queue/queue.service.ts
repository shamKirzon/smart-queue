
import { TellerRepository } from "../teller/teller.repository";
import { TellerService } from "../teller/teller.service";
import { QueueRepository } from "./queue.repository";

export class QueueService{
    static async assignRegularReceipt() {
        const inuseRegularCounters = await TellerRepository.fetchInuseRegularCounter(); 
    
        // check if the fetched counters are contain our regular Counters: 
        if(inuseRegularCounters?.some(counter => TellerService.regularCounters.includes(counter))){
    
        for(let counter of inuseRegularCounters){
            const customer = await QueueService.assignRegularReceipt(); 

            if(!counter){
                console.log(`no waiting customer to assign for ${counter}`)
                continue; 
            }

            // await QueueRepository.assignCustomerToCounter(counter, customer)
        }
      
          try{
    
            
          }catch(error) {
              console.error("tellerService_assignRegularReceipt cant perform logic side", error)
          }
    
    
    
    
    
        }else{
          return 
        }
    
      }
}