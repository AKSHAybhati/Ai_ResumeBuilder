const { pool } = require('../config/database');
const fs = require('fs');
const path = require('path');

async function addRawTextColumn() {
  try {
    console.log('🔄 Starting migration: Add raw_text column to resumes table...');
    
    // Read the migration SQL file
    const migrationSQL = fs.readFileSync(
      path.join(__dirname, 'add_raw_text_column.sql'), 
      'utf8'
    );
    
    // Execute the migration
    await pool.query(migrationSQL);
    
    console.log('✅ Migration completed successfully!');
    console.log('📝 Added raw_text column to resumes table');
    
    // Verify the column was added
    const result = await pool.query(`
      SELECT column_name, data_type, is_nullable 
      FROM information_schema.columns 
      WHERE table_name = 'resumes' AND column_name = 'raw_text'
    `);
    
    if (result.rows.length > 0) {
      console.log('✅ Verification successful: raw_text column exists');
      console.log('📊 Column details:', result.rows[0]);
    } else {
      console.log('❌ Verification failed: raw_text column not found');
    }
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  } finally {
    // Close the database connection
    await pool.end();
  }
}

// Run the migration if this script is executed directly
if (require.main === module) {
  addRawTextColumn()
    .then(() => {
      console.log('🎉 Migration script completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Migration script failed:', error);
      process.exit(1);
    });
}

module.exports = addRawTextColumn;

