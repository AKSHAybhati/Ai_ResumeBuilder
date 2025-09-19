const bcrypt = require('bcryptjs');
const { pool, connectToPostgreSQL } = require('./config/database');

/**
 * Simple script to create one demo user
 */

const createDemoUser = async () => {
  try {
    console.log('� Connecting to database...');
    await connectToPostgreSQL();
    
    console.log('�🔐 Creating demo user...');

    const demoUser = {
      name: 'Demo User',
      email: 'demo@test.com',
      password: 'demo123'
    };

    // Check if user already exists
    const existingUser = await pool.query(
      'SELECT id FROM users WHERE email = $1',
      [demoUser.email.toLowerCase()]
    );

    if (existingUser.rows.length > 0) {
      console.log('⚠️  Demo user already exists!');
      console.log('📋 Login Credentials:');
      console.log('Email: demo@test.com');
      console.log('Password: demo123');
      return;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(demoUser.password, 12);

    // Create user
    const newUser = await pool.query(
      'INSERT INTO users (name, email, password_hash) VALUES ($1, $2, $3) RETURNING id, name, email',
      [demoUser.name, demoUser.email.toLowerCase(), hashedPassword]
    );

    console.log('✅ Demo user created successfully!');
    console.log('📋 Login Credentials:');
    console.log('Email: demo@test.com');
    console.log('Password: demo123');

  } catch (error) {
    console.error('❌ Error creating demo user:', error.message);
  } finally {
    process.exit(0);
  }
};

// Run if called directly
if (require.main === module) {
  createDemoUser();
}

module.exports = { createDemoUser };