const { pool } = require('../config/database');

// Get all user resumes
const getUserResumes = async (req, res) => {
  console.log('🔍 GET USER RESUMES - Starting request');
  console.log('👤 User ID:', req.user?.id);
  
  try {
    const userId = req.user.id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    console.log('📄 Query parameters:');
    console.log('   Page:', page);
    console.log('   Limit:', limit);
    console.log('   Offset:', offset);

    // Get resumes with pagination
    const resumesResult = await pool.query(`
      SELECT 
        id, 
        title, 
        template_id, 
        personal_info,
        summary,
        skills,
        experience,
        education,
        projects,
        certifications,
        achievements,
        interests,
        languages,
        raw_text,
        created_at, 
        updated_at,
        CASE 
          WHEN personal_info IS NOT NULL THEN true 
          ELSE false 
        END as has_personal_info,
        CASE 
          WHEN summary IS NOT NULL AND summary != '' THEN true 
          ELSE false 
        END as has_summary
      FROM resumes 
      WHERE user_id = $1 AND is_active = true
      ORDER BY updated_at DESC
      LIMIT $2 OFFSET $3
    `, [userId, limit, offset]);

    console.log('📊 Query result:');
    console.log('   Found resumes:', resumesResult.rows.length);
    console.log('   Resume data:', resumesResult.rows);

    // Get total count
    const countResult = await pool.query(
      'SELECT COUNT(*) as total FROM resumes WHERE user_id = $1 AND is_active = true',
      [userId]
    );

    const total = parseInt(countResult.rows[0].total);

    // Format resumes data to match frontend expectations
    const formattedResumes = resumesResult.rows.map(resume => ({
      ...resume,
      personalInfo: resume.personal_info,
      rawText: resume.raw_text
    }));

    res.json({
      success: true,
      data: formattedResumes,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get user resumes error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get resumes'
    });
  }
};

// Create new resume
const createResume = async (req, res) => {
  console.log('🔄 CREATE RESUME - Starting request');
  console.log('👤 User ID:', req.user?.id);
  console.log('📋 Request body keys:', Object.keys(req.body));
  console.log('📋 Request body:', JSON.stringify(req.body, null, 2));
  
  try {
    const userId = req.user.id;
    const {
      title = 'New Resume',
      templateId,
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
      rawText
    } = req.body;

    // Enforce DB varchar limits
    const safeTitle = (title || 'New Resume').toString().slice(0, 255);
    const safeTemplateId = typeof templateId === 'string' ? templateId.slice(0, 50) : templateId || null;

    console.log('📝 Parsed data:');
    console.log('   Title:', title);
    console.log('   Template ID:', templateId);
    console.log('   Personal Info:', personalInfo);
    console.log('   Summary:', summary);
    console.log('   Skills:', skills);

    const newResume = await pool.query(`
      INSERT INTO resumes 
      (user_id, title, template_id, personal_info, summary, skills, experience, 
       education, projects, certifications, achievements, interests, languages, raw_text)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
      RETURNING id, title, template_id, created_at, updated_at
    `, [
      userId,
      safeTitle,
      safeTemplateId,
      personalInfo ? JSON.stringify(personalInfo) : null,
      summary,
      skills ? JSON.stringify(skills) : null,
      experience ? JSON.stringify(experience) : null,
      education ? JSON.stringify(education) : null,
      projects ? JSON.stringify(projects) : null,
      certifications ? JSON.stringify(certifications) : null,
      achievements ? JSON.stringify(achievements) : null,
      interests ? JSON.stringify(interests) : null,
      languages ? JSON.stringify(languages) : null,
      rawText
    ]);

    console.log('✅ Resume created successfully!');
    console.log('📄 Created resume ID:', newResume.rows[0].id);
    console.log('📄 Created resume data:', newResume.rows[0]);

    res.status(201).json({
      success: true,
      message: 'Resume created successfully',
      data: newResume.rows[0]
    });
  } catch (error) {
    console.error('❌ CREATE RESUME ERROR:', error);
    console.error('❌ Error details:', error.message);
    console.error('❌ Error stack:', error.stack);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to create resume'
    });
  }
};

// Get specific resume
const getResume = async (req, res) => {
  try {
    const userId = req.user.id;
    const resumeId = req.params.id;

    const resumeResult = await pool.query(`
      SELECT * FROM resumes 
      WHERE id = $1 AND user_id = $2 AND is_active = true
    `, [resumeId, userId]);

    if (resumeResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Resume not found'
      });
    }

    const resume = resumeResult.rows[0];

    // Parse JSON fields
    const responseData = {
      ...resume,
      personalInfo: resume.personal_info,
      rawText: resume.raw_text,
      skills: resume.skills,
      experience: resume.experience,
      education: resume.education,
      projects: resume.projects,
      certifications: resume.certifications,
      achievements: resume.achievements,
      interests: resume.interests,
      languages: resume.languages
    };

    // Remove snake_case versions
    delete responseData.personal_info;
    delete responseData.raw_text;
    delete responseData.user_id;
    delete responseData.template_id;
    delete responseData.is_active;
    delete responseData.created_at;
    delete responseData.updated_at;

    responseData.templateId = resume.template_id;
    responseData.createdAt = resume.created_at;
    responseData.updatedAt = resume.updated_at;

    res.json({
      success: true,
      data: responseData
    });
  } catch (error) {
    console.error('Get resume error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get resume'
    });
  }
};

// Update resume
const updateResume = async (req, res) => {
  try {
    const userId = req.user.id;
    const resumeId = req.params.id;
    const updateData = { ...req.body };

    // Enforce varchar limits for updates as well
    if (typeof updateData.title === 'string') {
      updateData.title = updateData.title.slice(0, 255);
    }
    if (typeof updateData.templateId === 'string') {
      updateData.templateId = updateData.templateId.slice(0, 50);
    }

    // Check if resume belongs to user
    const existingResume = await pool.query(
      'SELECT id FROM resumes WHERE id = $1 AND user_id = $2 AND is_active = true',
      [resumeId, userId]
    );

    if (existingResume.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Resume not found'
      });
    }

    // Build update query dynamically
    const updateFields = [];
    const values = [];
    let paramCount = 1;

    Object.keys(updateData).forEach(key => {
      if (key === 'personalInfo') {
        updateFields.push(`personal_info = $${paramCount}`);
        values.push(JSON.stringify(updateData[key]));
        paramCount++;
      } else if (['skills', 'experience', 'education', 'projects', 'certifications', 'achievements', 'interests', 'languages'].includes(key)) {
        updateFields.push(`${key} = $${paramCount}`);
        values.push(JSON.stringify(updateData[key]));
        paramCount++;
      } else if (['title', 'summary', 'templateId', 'rawText'].includes(key)) {
        const dbField = key === 'templateId' ? 'template_id' : key === 'rawText' ? 'raw_text' : key;
        updateFields.push(`${dbField} = $${paramCount}`);
        values.push(updateData[key]);
        paramCount++;
      }
    });

    if (updateFields.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'No valid fields to update'
      });
    }

    updateFields.push(`updated_at = CURRENT_TIMESTAMP`);
    values.push(resumeId, userId);

    const query = `
      UPDATE resumes 
      SET ${updateFields.join(', ')}
      WHERE id = $${paramCount} AND user_id = $${paramCount + 1}
      RETURNING id, title, template_id, updated_at
    `;

    const result = await pool.query(query, values);

    res.json({
      success: true,
      message: 'Resume updated successfully',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Update resume error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update resume'
    });
  }
};

// Delete resume (soft delete)
const deleteResume = async (req, res) => {
  try {
    const userId = req.user.id;
    const resumeId = req.params.id;

    const result = await pool.query(`
      UPDATE resumes 
      SET is_active = false, updated_at = CURRENT_TIMESTAMP
      WHERE id = $1 AND user_id = $2 AND is_active = true
      RETURNING id
    `, [resumeId, userId]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Resume not found'
      });
    }

    res.json({
      success: true,
      message: 'Resume deleted successfully'
    });
  } catch (error) {
    console.error('Delete resume error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete resume'
    });
  }
};

// Get user's previous data for suggestions
const getUserSuggestions = async (req, res) => {
  try {
    const userId = req.user.id;

    // Get the most recent resume data for suggestions
    const suggestionsResult = await pool.query(`
      SELECT 
        personal_info,
        skills,
        education,
        certifications,
        languages,
        interests
      FROM resumes 
      WHERE user_id = $1 AND is_active = true
      ORDER BY updated_at DESC 
      LIMIT 1
    `, [userId]);

    if (suggestionsResult.rows.length === 0) {
      return res.json({
        success: true,
        data: {
          personalInfo: null,
          skills: null,
          education: null,
          certifications: null,
          languages: null,
          interests: null
        }
      });
    }

    const suggestions = suggestionsResult.rows[0];

    res.json({
      success: true,
      data: {
        personalInfo: suggestions.personal_info,
        skills: suggestions.skills,
        education: suggestions.education,
        certifications: suggestions.certifications,
        languages: suggestions.languages,
        interests: suggestions.interests
      }
    });
  } catch (error) {
    console.error('Get suggestions error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get suggestions'
    });
  }
};

module.exports = {
  getUserResumes,
  createResume,
  getResume,
  updateResume,
  deleteResume,
  getUserSuggestions
};