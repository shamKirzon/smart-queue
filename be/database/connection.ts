import pkg from "pg"
const { Pool } = pkg;

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "smart_queue",
  password: "ymmahs13",  
  //password: "rhenz",
  port: 5432,
});

export default pool;