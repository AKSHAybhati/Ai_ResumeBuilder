const bcrypt = require('bcryptjs');
const { pool } = require('../config/database');

/**
 * Seed script to create test users for demonstrations
 * Run this script to add demo users to the database
 */

const createTestUsers = async () => {
  try {
    console.log('🌱 Starting test user creation...');

    // Test user data
    const testUsers = [
      {
        name: 'Demo User',
        email: 'demo@airesume.com',
        password: 'demo123456'
      },
      {
        name: 'John Doe',
        email: 'john.doe@example.com',
        password: 'password123'
      },
      {
        name: 'Sarah Wilson',
        email: 'sarah.wilson@example.com',
        password: 'password123'
      }
    ];

    for (const userData of testUsers) {
      try {
        // Check if user already exists
        const existingUser = await pool.query(
          'SELECT id FROM users WHERE email = $1',
          [userData.email.toLowerCase()]
        );

        if (existingUser.rows.length > 0) {
          console.log(`⚠️  User ${userData.email} already exists, skipping...`);
          continue;
        }

        // Hash password
        const saltRounds = 12;
        const hashedPassword = await bcrypt.hash(userData.password, saltRounds);

        // Create user
        const newUser = await pool.query(
          'INSERT INTO users (name, email, password_hash) VALUES ($1, $2, $3) RETURNING id, name, email, created_at',
          [userData.name.trim(), userData.email.toLowerCase(), hashedPassword]
        );

        const user = newUser.rows[0];
        console.log(`✅ Created user: ${user.name} (${user.email})`);

        // Create a sample resume for the demo user
        if (userData.email === 'demo@airesume.com') {
          await createSampleResume(user.id);
        }

      } catch (userError) {
        console.error(`❌ Failed to create user ${userData.email}:`, userError.message);
      }
    }

    console.log('🎉 Test user creation completed!');
    
    // Display login credentials
    console.log('\n📋 Demo Credentials:');
    console.log('==================');
    console.log('Email: demo@airesume.com');
    console.log('Password: demo123456');
    console.log('==================');
    console.log('Email: john.doe@example.com');
    console.log('Password: password123');
    console.log('==================');
    console.log('Email: sarah.wilson@example.com');
    console.log('Password: password123');
    console.log('==================\n');

  } catch (error) {
    console.error('💥 Error creating test users:', error);
  }
};

const createSampleResume = async (userId) => {
  try {
    const sampleResumeData = {
      title: 'Full Stack Developer Resume',
      template_id: '1',
      personal_info: {
        name: 'Demo User',
        role: 'Full Stack Developer',
        email: 'demo@airesume.com',
        phone: '+1 (555) 123-4567',
        location: 'San Francisco, CA',
        linkedin: 'https://linkedin.com/in/demouser',
        github: 'https://github.com/demouser',
        portfolio: 'https://demouser.dev'
      },
      summary: 'Passionate Full Stack Developer with 5+ years of experience building scalable web applications. Proficient in React, Node.js, Python, and cloud technologies. Strong problem-solving skills and experience leading development teams.',
      skills: [
        'JavaScript', 'TypeScript', 'React.js', 'Node.js', 'Python', 'Django',
        'PostgreSQL', 'MongoDB', 'AWS', 'Docker', 'Git', 'Agile/Scrum'
      ],
      experience: [
        {
          company: 'TechCorp Solutions',
          position: 'Senior Full Stack Developer',
          location: 'San Francisco, CA',
          startDate: '2022-01',
          endDate: 'Present',
          description: [
            'Led development of microservices architecture serving 100K+ users',
            'Reduced page load times by 40% through React optimization techniques',
            'Mentored junior developers and conducted code reviews',
            'Implemented CI/CD pipelines reducing deployment time by 60%'
          ]
        },
        {
          company: 'StartupXYZ',
          position: 'Full Stack Developer',
          location: 'Remote',
          startDate: '2020-03',
          endDate: '2021-12',
          description: [
            'Built responsive web applications using React and Node.js',
            'Designed and implemented RESTful APIs handling 10K+ requests/day',
            'Collaborated with UI/UX team to improve user experience',
            'Integrated third-party services and payment gateways'
          ]
        }
      ],
      education: [
        {
          institution: 'University of California, Berkeley',
          degree: 'Bachelor of Science in Computer Science',
          location: 'Berkeley, CA',
          startDate: '2016-09',
          endDate: '2020-05',
          gpa: '3.8'
        }
      ],
      projects: [
        {
          name: 'AI Resume Builder',
          description: 'Full-stack application for creating AI-enhanced resumes',
          technologies: ['React', 'Node.js', 'PostgreSQL', 'Gemini AI'],
          link: 'https://github.com/demouser/ai-resume-builder',
          highlights: [
            'Integrated Google Gemini AI for content enhancement',
            'Built responsive UI with 20+ professional templates',
            'Implemented real-time collaboration features'
          ]
        },
        {
          name: 'E-Commerce Platform',
          description: 'Scalable e-commerce solution with admin dashboard',
          technologies: ['React', 'Django', 'PostgreSQL', 'Stripe'],
          link: 'https://github.com/demouser/ecommerce-platform',
          highlights: [
            'Processed $50K+ in transactions during beta testing',
            'Built inventory management system',
            'Integrated payment processing and order tracking'
          ]
        }
      ],
      certifications: [
        {
          name: 'AWS Certified Solutions Architect',
          issuer: 'Amazon Web Services',
          date: '2023-06',
          credentialId: 'AWS-SAA-123456'
        },
        {
          name: 'React Developer Certification',
          issuer: 'Meta',
          date: '2022-11',
          credentialId: 'META-REACT-789012'
        }
      ]
    };

    const newResume = await pool.query(
      `INSERT INTO resumes (
        user_id, title, template_id, personal_info, summary, skills, 
        experience, education, projects, certifications
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) 
      RETURNING id, title`,
      [
        userId,
        sampleResumeData.title,
        sampleResumeData.template_id,
        JSON.stringify(sampleResumeData.personal_info),
        sampleResumeData.summary,
        JSON.stringify(sampleResumeData.skills),
        JSON.stringify(sampleResumeData.experience),
        JSON.stringify(sampleResumeData.education),
        JSON.stringify(sampleResumeData.projects),
        JSON.stringify(sampleResumeData.certifications)
      ]
    );

    console.log(`✅ Created sample resume: ${newResume.rows[0].title}`);
  } catch (error) {
    console.error('❌ Failed to create sample resume:', error.message);
  }
};

// Run the seeding function
if (require.main === module) {
  const { connectToPostgreSQL } = require('../config/database');
  
  connectToPostgreSQL()
    .then(() => createTestUsers())
    .then(() => {
      console.log('✅ Seeding completed successfully!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Seeding failed:', error);
      process.exit(1);
    });
}

module.exports = { createTestUsers, createSampleResume };