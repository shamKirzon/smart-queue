import pool from "../database/connection";

export class TellerRepository {

  static async getCounterStatus() {
    const query = "SELECT counter_name, status FROM counters ";
    const result = await pool.query(query);
    const rawData = result.rows;

    // sorted data: 
    const sortedData = rawData.sort((a, b) =>
      a.counter_name.localeCompare(b.counter_name)
    );

    return sortedData;
  }

  static async setCounterInuse(counter: string) {

    counter = counter.replace(/^Counter/i, "counter").replace(/\s+/g, "_");
    const query = `UPDATE counters
                    SET status = 'inuse'
                    WHERE counter_name = $1`
    

                    
    try {
        await pool.query(query, [counter])
    } catch (error) {
        console.error("Error updating counter status", error)
    }
  }

  static async setCounterAvailable(counter: string) {

    if(!counter){
        return; 
    }

    counter = counter.replace(/^Counter/i, "counter").replace(/\s+/g, "_");
    const query = `UPDATE counters
                    SET status = 'available'
                    WHERE counter_name = $1`
    


    try {
        await pool.query(query, [counter])
    } catch (error) {
        console.error("Error updating counter status", error)
    }
  }
}
