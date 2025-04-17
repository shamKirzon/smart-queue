import pkg from "pg"
const { Pool } = pkg;

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "smart_queue",
  //password: "rhenz",  
  password: "ymmahs13",
  port: 5432,
});

export default pool;