import pool from "../database/connection"
import { QueueService } from "./queue.service"
import { QueryResult } from "pg";

export class QueueRepository{

static async getNextRegularCustomerWithLock():Promise<QueryResult<any>> {
    const query1 = ` SELECT * FROM regular_receipt
                              WHERE status = 'waiting'
                              ORDER BY queue_number ASC
                              LIMIT 1 
                              FOR UPDATE SKIP LOCKED`

    const customer = await pool.query(query1)
    return customer; 

}
static async assignCustomerToCounter(counter: string, customer:Promise<QueryResult<any>>) {

}
    
}