import pool from "../database/connection";
import { TellerRepository } from "./teller.repository";

export class TellerService {
  public static regularCounters = ["counter_1", "counter_2", "counter_3", "counter_4"];
  

  static formattedCounter(counter: string ):string {
    return counter.replace(/^Counter/i, "counter").replace(/\s+/g, "_");
  }

  static isRegularCounter(counter: string): boolean{
    const formattedCounterString = this.formattedCounter(counter)
    return this.regularCounters.includes(formattedCounterString)
  }
  



  

  




}








