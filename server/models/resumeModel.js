const { pool } = require("../config/database");

// Save enhancement to database (optional - for tracking)
const saveEnhancementHistory = async (sectionType, originalContent, enhancedContent, processingTime) => {
  try {
    const query = `
      INSERT INTO enhancement_history 
      (section_type, original_content, enhanced_content, processing_time_ms, ai_model)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id
    `;
    
    const values = [sectionType, originalContent, enhancedContent, processingTime, 'gemini'];
    const result = await pool.query(query, values);
    
    console.log(`📊 Enhancement history saved with ID: ${result.rows[0].id}`);
    return result.rows[0].id;
  } catch (error) {
    console.error("❌ Error saving enhancement history:", error.message);
    // Don't throw error - this is optional functionality
    return null;
  }
};

// Get enhancement statistics (optional - for analytics)
const getEnhancementStats = async () => {
  try {
    const query = `
      SELECT 
        section_type,
        COUNT(*) as total_enhancements,
        AVG(processing_time_ms) as avg_processing_time,
        AVG(user_rating) as avg_rating
      FROM enhancement_history 
      WHERE enhancement_timestamp >= NOW() - INTERVAL '30 days'
      GROUP BY section_type
      ORDER BY total_enhancements DESC
    `;
    
    const result = await pool.query(query);
    return result.rows;
  } catch (error) {
    console.error("❌ Error getting enhancement stats:", error.message);
    return [];
  }
};

// Save resume data (for future use)
const saveResume = async (resumeData) => {
  try {
    const {
      title = 'Untitled Resume',
      personalInfo,
      summary,
      skills,
      experience,
      education,
      projects,
      certifications,
      achievements,
      interests,
      languages,
      templateId
    } = resumeData;

    const query = `
      INSERT INTO resumes 
      (title, personal_info, summary, skills, experience, education, projects, 
       certifications, achievements, interests, languages, template_id)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
      RETURNING id, created_at
    `;
    
    const values = [
      title,
      JSON.stringify(personalInfo),
      summary,
      JSON.stringify(skills),
      JSON.stringify(experience),
      JSON.stringify(education),
      JSON.stringify(projects),
      JSON.stringify(certifications),
      JSON.stringify(achievements),
      JSON.stringify(interests),
      JSON.stringify(languages),
      templateId
    ];
    
    const result = await pool.query(query, values);
    console.log(`💾 Resume saved with ID: ${result.rows[0].id}`);
    
    return {
      id: result.rows[0].id,
      createdAt: result.rows[0].created_at
    };
  } catch (error) {
    console.error("❌ Error saving resume:", error.message);
    throw error;
  }
};

// Get resume by ID
const getResumeById = async (resumeId) => {
  try {
    const query = `
      SELECT * FROM resumes 
      WHERE id = $1 AND is_active = true
    `;
    
    const result = await pool.query(query, [resumeId]);
    
    if (result.rows.length === 0) {
      return null;
    }
    
    const resume = result.rows[0];
    
    // Parse JSON fields
    return {
      ...resume,
      personalInfo: resume.personal_info,
      skills: resume.skills,
      experience: resume.experience,
      education: resume.education,
      projects: resume.projects,
      certifications: resume.certifications,
      achievements: resume.achievements,
      interests: resume.interests,
      languages: resume.languages
    };
  } catch (error) {
    console.error("❌ Error getting resume:", error.message);
    throw error;
  }
};

// Get all resumes (with pagination)
const getAllResumes = async (page = 1, limit = 10) => {
  try {
    const offset = (page - 1) * limit;
    
    const query = `
      SELECT id, title, template_id, created_at, updated_at
      FROM resumes 
      WHERE is_active = true
      ORDER BY updated_at DESC
      LIMIT $1 OFFSET $2
    `;
    
    const countQuery = `
      SELECT COUNT(*) as total FROM resumes WHERE is_active = true
    `;
    
    const [resumesResult, countResult] = await Promise.all([
      pool.query(query, [limit, offset]),
      pool.query(countQuery)
    ]);
    
    return {
      resumes: resumesResult.rows,
      total: parseInt(countResult.rows[0].total),
      page,
      limit,
      totalPages: Math.ceil(countResult.rows[0].total / limit)
    };
  } catch (error) {
    console.error("❌ Error getting resumes:", error.message);
    throw error;
  }
};

module.exports = {
  saveEnhancementHistory,
  getEnhancementStats,
  saveResume,
  getResumeById,
  getAllResumes
};