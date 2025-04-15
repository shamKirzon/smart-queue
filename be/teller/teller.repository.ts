import pool from "../database/connection";

export  class  TellerRepository{

    static  async getCounterData(){
        const query = 
        "SELECT * FROM counters "; 
        const result = await pool.query(query)
        return result.rows; 
    }
}