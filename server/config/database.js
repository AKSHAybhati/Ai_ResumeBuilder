require("dotenv").config();
const { Pool } = require("pg");

// PostgreSQL connection configuration
const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'resume_builder',
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT || 5432,
  // Connection pool settings
  max: 20, // maximum number of clients in the pool
  idleTimeoutMillis: 30000, // how long a client is allowed to remain idle
  connectionTimeoutMillis: 2000, // how long to try connecting before timing out
});

// Test database connection
const connectToPostgreSQL = async () => {
  try {
    const client = await pool.connect();
    console.log("✅ PostgreSQL connected successfully");
    
    // Test query
    const result = await client.query('SELECT NOW()');
    console.log("✅ Database connection test successful:", result.rows[0].now);
    
    client.release();
    return true;
  } catch (error) {
    console.error("❌ PostgreSQL connection failed:", error.message);
    return false;
  }
};

// Graceful shutdown
const closePool = async () => {
  try {
    if (!pool.ended) {
      await pool.end();
      console.log("✅ PostgreSQL pool closed");
    }
  } catch (error) {
    console.error("❌ Error closing PostgreSQL pool:", error.message);
  }
};

// Handle process termination (only once)
let shutdownHandled = false;
const handleShutdown = async () => {
  if (!shutdownHandled) {
    shutdownHandled = true;
    await closePool();
    process.exit(0);
  }
};

process.on('SIGINT', handleShutdown);
process.on('SIGTERM', handleShutdown);

module.exports = {
  pool,
  connectToPostgreSQL,
  closePool
};