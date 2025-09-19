const { pool } = require("./database");
const fs = require("fs");
const path = require("path");

const initializeDatabase = async () => {
  try {
    console.log("🚀 Initializing PostgreSQL database...");
    
    // Read the schema SQL file
    const schemaPath = path.join(__dirname, "schema.sql");
    const schemaSql = fs.readFileSync(schemaPath, "utf8");
    
    // Execute the schema
    await pool.query(schemaSql);
    
    console.log("✅ Database schema created successfully!");
    
    // Test the database with a simple query
    const result = await pool.query("SELECT COUNT(*) as table_count FROM information_schema.tables WHERE table_schema = 'public'");
    console.log(`📊 Created ${result.rows[0].table_count} tables`);
    
    return true;
  } catch (error) {
    console.error("❌ Database initialization failed:", error.message);
    return false;
  }
};

// Run this script directly to initialize the database
if (require.main === module) {
  initializeDatabase()
    .then((success) => {
      if (success) {
        console.log("🎉 Database initialization completed!");
      } else {
        console.log("💥 Database initialization failed!");
      }
      process.exit(success ? 0 : 1);
    })
    .catch((error) => {
      console.error("💥 Unexpected error:", error);
      process.exit(1);
    });
}

module.exports = { initializeDatabase };