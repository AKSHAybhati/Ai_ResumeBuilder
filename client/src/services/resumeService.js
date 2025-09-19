// Resume data management service
import authService from './authService';

const API_BASE = 'http://localhost:5000/api';

class ResumeService {
  // Parse resume text into structured data
  parseResumeText(text) {
    const lines = text.split('\n').map(line => line.trim()).filter(line => line);
    
    const resumeData = {
      personalInfo: {
        name: '',
        email: '',
        phone: '',
        address: '',
        linkedin: '',
        github: '',
        website: ''
      },
      summary: '',
      experience: [],
      education: [],
      skills: [],
      projects: [],
      certifications: [],
      languages: [],
      achievements: []
    };

    let currentSection = '';
    let currentItem = {};

    // Extract name (usually first line)
    if (lines.length > 0) {
      resumeData.personalInfo.name = lines[0];
    }

    // Extract contact information
    for (let i = 1; i < Math.min(6, lines.length); i++) {
      const line = lines[i];
      if (line.includes('@') && !resumeData.personalInfo.email) {
        resumeData.personalInfo.email = line.match(/\S+@\S+\.\S+/)?.[0] || '';
      }
      if (line.match(/[\+\(]?[\d\s\-\(\)]{7,}/)) {
        resumeData.personalInfo.phone = line;
      }
      if (line.toLowerCase().includes('linkedin')) {
        resumeData.personalInfo.linkedin = line;
      }
      if (line.toLowerCase().includes('github')) {
        resumeData.personalInfo.github = line;
      }
    }

    // Parse sections
    const sectionKeywords = {
      'SUMMARY': ['summary', 'profile', 'objective', 'about'],
      'EXPERIENCE': ['experience', 'work experience', 'employment', 'work history'],
      'EDUCATION': ['education', 'academic background', 'qualifications'],
      'SKILLS': ['skills', 'technical skills', 'core competencies', 'technologies'],
      'PROJECTS': ['projects', 'project experience', 'portfolio'],
      'CERTIFICATIONS': ['certifications', 'certificates', 'licenses'],
      'LANGUAGES': ['languages', 'language proficiency'],
      'ACHIEVEMENTS': ['achievements', 'awards', 'honors', 'accomplishments']
    };

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const upperLine = line.toUpperCase();

      // Check if this is a section header
      let foundSection = '';
      Object.entries(sectionKeywords).forEach(([section, keywords]) => {
        if (keywords.some(keyword => upperLine.includes(keyword.toUpperCase()) && line.length < 50)) {
          foundSection = section;
        }
      });

      if (foundSection) {
        currentSection = foundSection;
        currentItem = {};
        continue;
      }

      // Process content based on current section
      switch (currentSection) {
        case 'SUMMARY':
          resumeData.summary += (resumeData.summary ? ' ' : '') + line;
          break;

        case 'EXPERIENCE':
          if (line.length < 100 && !line.includes('•') && !line.includes('-')) {
            // This looks like a job title or company
            if (currentItem.title && !currentItem.company) {
              currentItem.company = line;
            } else {
              if (currentItem.title) {
                resumeData.experience.push(currentItem);
              }
              currentItem = { title: line, company: '', duration: '', description: [] };
            }
          } else if (line.match(/\d{4}/) && line.length < 50) {
            // This looks like a date
            currentItem.duration = line;
          } else {
            // This looks like description
            if (!currentItem.description) currentItem.description = [];
            currentItem.description.push(line.replace(/^[•\-*]\s*/, ''));
          }
          break;

        case 'EDUCATION':
          if (line.length < 100 && !line.includes('•')) {
            if (currentItem.degree && !currentItem.institution) {
              currentItem.institution = line;
            } else {
              if (currentItem.degree) {
                resumeData.education.push(currentItem);
              }
              currentItem = { degree: line, institution: '', year: '', gpa: '' };
            }
          } else if (line.match(/\d{4}/)) {
            currentItem.year = line;
          }
          break;

        case 'SKILLS':
          const skills = line.split(',').map(skill => skill.trim()).filter(skill => skill);
          resumeData.skills.push(...skills);
          break;

        case 'PROJECTS':
          if (line.length < 100 && !line.includes('•') && !line.includes('-')) {
            if (currentItem.name) {
              resumeData.projects.push(currentItem);
            }
            currentItem = { name: line, description: [], technologies: [], link: '' };
          } else {
            if (!currentItem.description) currentItem.description = [];
            currentItem.description.push(line.replace(/^[•\-*]\s*/, ''));
          }
          break;

        case 'CERTIFICATIONS':
          resumeData.certifications.push(line);
          break;

        case 'LANGUAGES':
          resumeData.languages.push(line);
          break;

        case 'ACHIEVEMENTS':
          resumeData.achievements.push(line);
          break;
      }
    }

    // Add any remaining items
    if (currentItem.title && currentSection === 'EXPERIENCE') {
      resumeData.experience.push(currentItem);
    }
    if (currentItem.degree && currentSection === 'EDUCATION') {
      resumeData.education.push(currentItem);
    }
    if (currentItem.name && currentSection === 'PROJECTS') {
      resumeData.projects.push(currentItem);
    }

    return resumeData;
  }

  // Save resume to backend
  async saveResume(resumeText, title = null) {
    try {
      const structuredData = this.parseResumeText(resumeText);
      
      const resumeData = {
        title: title || `Resume - ${structuredData.personalInfo.name || 'Untitled'}`,
        summary: structuredData.summary,
        personalInfo: structuredData.personalInfo,
        experience: structuredData.experience,
        education: structuredData.education,
        skills: structuredData.skills,
        projects: structuredData.projects,
        certifications: structuredData.certifications,
        languages: structuredData.languages,
        achievements: structuredData.achievements,
        rawText: resumeText
      };

      const response = await authService.authenticatedRequest(`${API_BASE}/resumes`, {
        method: 'POST',
        body: JSON.stringify(resumeData),
      });

      const result = await response.json();
      
      if (response.ok) {
        return { success: true, data: result.data };
      } else {
        return { success: false, error: result.message || 'Failed to save resume' };
      }
    } catch (error) {
      return { success: false, error: 'Network error. Please try again.' };
    }
  }

  // Update existing resume
  async updateResume(resumeId, resumeText, title = null) {
    try {
      const structuredData = this.parseResumeText(resumeText);
      
      const resumeData = {
        title: title || `Resume - ${structuredData.personalInfo.name || 'Updated'}`,
        summary: structuredData.summary,
        personalInfo: structuredData.personalInfo,
        experience: structuredData.experience,
        education: structuredData.education,
        skills: structuredData.skills,
        projects: structuredData.projects,
        certifications: structuredData.certifications,
        languages: structuredData.languages,
        achievements: structuredData.achievements,
        rawText: resumeText
      };

      const response = await authService.authenticatedRequest(`${API_BASE}/resumes/${resumeId}`, {
        method: 'PUT',
        body: JSON.stringify(resumeData),
      });

      const result = await response.json();
      
      if (response.ok) {
        return { success: true, data: result.data };
      } else {
        return { success: false, error: result.message || 'Failed to update resume' };
      }
    } catch (error) {
      return { success: false, error: 'Network error. Please try again.' };
    }
  }

  // Get all user's resumes
  async getUserResumes() {
    try {
      const response = await authService.authenticatedRequest(`${API_BASE}/resumes/my-resumes`);
      const result = await response.json();
      
      if (response.ok) {
        return { success: true, data: result.data };
      } else {
        return { success: false, error: result.message || 'Failed to fetch resumes' };
      }
    } catch (error) {
      return { success: false, error: 'Network error. Please try again.' };
    }
  }

  // Get specific resume by ID
  async getResume(resumeId) {
    try {
      const response = await authService.authenticatedRequest(`${API_BASE}/resumes/${resumeId}`);
      const result = await response.json();
      
      if (response.ok) {
        return { success: true, data: result.data };
      } else {
        return { success: false, error: result.message || 'Failed to fetch resume' };
      }
    } catch (error) {
      return { success: false, error: 'Network error. Please try again.' };
    }
  }

  // Delete resume
  async deleteResume(resumeId) {
    try {
      const response = await authService.authenticatedRequest(`${API_BASE}/resumes/${resumeId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        return { success: true };
      } else {
        const result = await response.json();
        return { success: false, error: result.message || 'Failed to delete resume' };
      }
    } catch (error) {
      return { success: false, error: 'Network error. Please try again.' };
    }
  }

  // Get AI suggestions based on user's resume history
  async getResumesSuggestions() {
    try {
      const response = await authService.authenticatedRequest(`${API_BASE}/resumes/suggestions`);
      const result = await response.json();
      
      if (response.ok) {
        return { success: true, data: result.data };
      } else {
        return { success: false, error: result.message || 'Failed to fetch suggestions' };
      }
    } catch (error) {
      return { success: false, error: 'Network error. Please try again.' };
    }
  }

  // Convert structured data back to formatted text
  structuredDataToText(data) {
    let resumeText = '';
    
    // Personal Info - handle both flat and nested structures
    const personalInfo = data.personalInfo || {
      name: data.name,
      email: data.email,
      phone: data.phone,
      address: data.location,
      linkedin: data.linkedin,
      github: data.github
    };
    
    if (personalInfo.name) {
      resumeText += `${personalInfo.name}\n`;
    }
    if (personalInfo.email) resumeText += `${personalInfo.email}\n`;
    if (personalInfo.phone) resumeText += `${personalInfo.phone}\n`;
    if (personalInfo.address) resumeText += `${personalInfo.address}\n`;
    if (personalInfo.linkedin) resumeText += `${personalInfo.linkedin}\n`;
    if (personalInfo.github) resumeText += `${personalInfo.github}\n`;
    
    resumeText += '\n';

    // Summary
    if (data.summary) {
      resumeText += 'SUMMARY\n';
      resumeText += `${data.summary}\n\n`;
    }

    // Experience
    if (data.experience && data.experience.length > 0) {
      resumeText += 'WORK EXPERIENCE\n';
      data.experience.forEach(exp => {
        resumeText += `${exp.title}\n`;
        if (exp.company) resumeText += `${exp.company}\n`;
        if (exp.duration) resumeText += `${exp.duration}\n`;
        if (exp.description && exp.description.length > 0) {
          exp.description.forEach(desc => {
            resumeText += `• ${desc}\n`;
          });
        }
        resumeText += '\n';
      });
    }

    // Education
    if (data.education && data.education.length > 0) {
      resumeText += 'EDUCATION\n';
      data.education.forEach(edu => {
        resumeText += `${edu.degree}\n`;
        if (edu.institution) resumeText += `${edu.institution}\n`;
        if (edu.year) resumeText += `${edu.year}\n`;
        resumeText += '\n';
      });
    }

    // Skills
    if (data.skills && data.skills.length > 0) {
      resumeText += 'TECHNICAL SKILLS\n';
      resumeText += `${data.skills.join(', ')}\n\n`;
    }

    // Projects
    if (data.projects && data.projects.length > 0) {
      resumeText += 'PROJECTS\n';
      data.projects.forEach(project => {
        resumeText += `${project.name}\n`;
        if (project.description && project.description.length > 0) {
          project.description.forEach(desc => {
            resumeText += `• ${desc}\n`;
          });
        }
        resumeText += '\n';
      });
    }

    // Certifications
    if (data.certifications && data.certifications.length > 0) {
      resumeText += 'CERTIFICATIONS\n';
      data.certifications.forEach(cert => {
        resumeText += `• ${cert}\n`;
      });
      resumeText += '\n';
    }

    return resumeText.trim();
  }

  // Save structured resume data (for form-based creation)
  async saveResumeData(structuredData, title = null) {
    try {
      const resumeData = {
        title: title || `Resume - ${structuredData.personalInfo?.name || 'Untitled'}`,
        templateId: structuredData.templateId || 1,
        personalInfo: structuredData.personalInfo,
        summary: structuredData.summary,
        skills: structuredData.skills,
        experience: structuredData.experience,
        education: structuredData.education,
        projects: structuredData.projects,
        certifications: structuredData.certifications,
        achievements: structuredData.achievements,
        interests: structuredData.interests,
        languages: structuredData.languages,
        rawText: this.structuredDataToText(structuredData)
      };

      const response = await authService.authenticatedRequest(`${API_BASE}/resumes`, {
        method: 'POST',
        body: JSON.stringify(resumeData),
      });

      const result = await response.json();
      
      if (response.ok) {
        return { success: true, data: result.data };
      } else {
        return { success: false, error: result.message || 'Failed to save resume' };
      }
    } catch (error) {
      return { success: false, error: 'Network error. Please try again.' };
    }
  }
}

// Create and export a singleton instance
const resumeService = new ResumeService();
export default resumeService;