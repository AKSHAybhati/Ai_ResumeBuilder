// Resume data management service
import authService from "./authService";
import apiService from "./apiService";

class ResumeService {
  // Parse resume text into structured data
  parseResumeText(text) {
    const lines = text
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line);

    const resumeData = {
      personalInfo: {
        name: "",
        email: "",
        phone: "",
        address: "",
        linkedin: "",
        github: "",
        website: "",
      },
      summary: "",
      experience: [],
      education: [],
      skills: [],
      projects: [],
      certifications: [],
      languages: [],
      achievements: [],
    };

    let currentSection = "";
    let currentItem = {};

    // Extract name (usually first line)
    if (lines.length > 0) {
      resumeData.personalInfo.name = lines[0];
    }

    // Extract contact information
    for (let i = 1; i < Math.min(6, lines.length); i++) {
      const line = lines[i];
      if (line.includes("@") && !resumeData.personalInfo.email) {
        resumeData.personalInfo.email = line.match(/\S+@\S+\.\S+/)?.[0] || "";
      }
      if (line.match(/[\+\(]?[\d\s\-\(\)]{7,}/)) {
        resumeData.personalInfo.phone = line;
      }
      if (line.toLowerCase().includes("linkedin")) {
        resumeData.personalInfo.linkedin = line;
      }
      if (line.toLowerCase().includes("github")) {
        resumeData.personalInfo.github = line;
      }
    }

    // Parse sections
    const sectionKeywords = {
      SUMMARY: ["summary", "profile", "objective", "about"],
      EXPERIENCE: [
        "experience",
        "work experience",
        "employment",
        "work history",
      ],
      EDUCATION: ["education", "academic background", "qualifications"],
      SKILLS: [
        "skills",
        "technical skills",
        "core competencies",
        "technologies",
      ],
      PROJECTS: ["projects", "project experience", "portfolio"],
      CERTIFICATIONS: ["certifications", "certificates", "licenses"],
      LANGUAGES: ["languages", "language proficiency"],
      ACHIEVEMENTS: ["achievements", "awards", "honors", "accomplishments"],
    };

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const upperLine = line.toUpperCase();

      // Check if this is a section header
      let foundSection = "";
      Object.entries(sectionKeywords).forEach(([section, keywords]) => {
        if (
          keywords.some(
            (keyword) =>
              upperLine.includes(keyword.toUpperCase()) && line.length < 50
          )
        ) {
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
        case "SUMMARY":
          resumeData.summary += (resumeData.summary ? " " : "") + line;
          break;

        case "EXPERIENCE":
          if (line.length < 100 && !line.includes("•") && !line.includes("-")) {
            // This looks like a job title or company
            if (currentItem.title && !currentItem.company) {
              currentItem.company = line;
            } else {
              if (currentItem.title) {
                resumeData.experience.push(currentItem);
              }
              currentItem = {
                title: line,
                company: "",
                duration: "",
                description: [],
              };
            }
          } else if (line.match(/\d{4}/) && line.length < 50) {
            // This looks like a date
            currentItem.duration = line;
          } else {
            // This looks like description
            if (!currentItem.description) currentItem.description = [];
            currentItem.description.push(line.replace(/^[•\-*]\s*/, ""));
          }
          break;

        case "EDUCATION":
          if (line.length < 100 && !line.includes("•")) {
            if (currentItem.degree && !currentItem.institution) {
              currentItem.institution = line;
            } else {
              if (currentItem.degree) {
                resumeData.education.push(currentItem);
              }
              currentItem = {
                degree: line,
                institution: "",
                year: "",
                gpa: "",
              };
            }
          } else if (line.match(/\d{4}/)) {
            currentItem.year = line;
          }
          break;

        case "SKILLS":
          const skills = line
            .split(",")
            .map((skill) => skill.trim())
            .filter((skill) => skill);
          resumeData.skills.push(...skills);
          break;

        case "PROJECTS":
          if (line.length < 100 && !line.includes("•") && !line.includes("-")) {
            if (currentItem.name) {
              resumeData.projects.push(currentItem);
            }
            currentItem = {
              name: line,
              description: [],
              technologies: [],
              link: "",
            };
          } else {
            if (!currentItem.description) currentItem.description = [];
            currentItem.description.push(line.replace(/^[•\-*]\s*/, ""));
          }
          break;

        case "CERTIFICATIONS":
          resumeData.certifications.push(line);
          break;

        case "LANGUAGES":
          resumeData.languages.push(line);
          break;

        case "ACHIEVEMENTS":
          resumeData.achievements.push(line);
          break;
      }
    }

    // Add any remaining items
    if (currentItem.title && currentSection === "EXPERIENCE") {
      resumeData.experience.push(currentItem);
    }
    if (currentItem.degree && currentSection === "EDUCATION") {
      resumeData.education.push(currentItem);
    }
    if (currentItem.name && currentSection === "PROJECTS") {
      resumeData.projects.push(currentItem);
    }

    return resumeData;
  }

  // Save resume to backend
  async saveResume(resumeText, title = null) {
    try {
      const structuredData = this.parseResumeText(resumeText);

      const resumeData = {
        title:
          title || `Resume - ${structuredData.personalInfo.name || "Untitled"}`,
        summary: structuredData.summary,
        personalInfo: structuredData.personalInfo,
        experience: structuredData.experience,
        education: structuredData.education,
        skills: structuredData.skills,
        projects: structuredData.projects,
        certifications: structuredData.certifications,
        languages: structuredData.languages,
        achievements: structuredData.achievements,
        rawText: resumeText,
      };

      const response = await authService.authenticatedRequest(
        `${API_BASE}/resumes`,
        {
          method: "POST",
          body: JSON.stringify(resumeData),
        }
      );

      const result = await response.json();

      if (response.ok) {
        return { success: true, data: result.data };
      } else {
        return {
          success: false,
          error: result.message || "Failed to save resume",
        };
      }
    } catch (error) {
      return { success: false, error: "Network error. Please try again." };
    }
  }

  // Update existing resume
  async updateResume(resumeId, resumeText, title = null) {
    try {
      const structuredData = this.parseResumeText(resumeText);

      const resumeData = {
        title:
          title || `Resume - ${structuredData.personalInfo.name || "Updated"}`,
        summary: structuredData.summary,
        personalInfo: structuredData.personalInfo,
        experience: structuredData.experience,
        education: structuredData.education,
        skills: structuredData.skills,
        projects: structuredData.projects,
        certifications: structuredData.certifications,
        languages: structuredData.languages,
        achievements: structuredData.achievements,
        rawText: resumeText,
      };

      const response = await authService.authenticatedRequest(
        `${API_BASE}/resumes/${resumeId}`,
        {
          method: "PUT",
          body: JSON.stringify(resumeData),
        }
      );

      const result = await response.json();

      if (response.ok) {
        return { success: true, data: result.data };
      } else {
        return {
          success: false,
          error: result.message || "Failed to update resume",
        };
      }
    } catch (error) {
      return { success: false, error: "Network error. Please try again." };
    }
  }

  // Get all user's resumes
  async getUserResumes() {
    try {
      // Use dataService for consistent storage handling
      const dataService = (await import('./dataService.js')).default;
      const resumes = await dataService.getResumes();
      return { success: true, data: Array.isArray(resumes) ? resumes : [] };
    } catch (error) {
      return { success: true, data: [] }; // Return empty array instead of error
    }
  }

  // Get specific resume by ID
  async getResume(resumeId) {
    try {
      const response = await authService.authenticatedRequest(
        `${API_BASE}/resumes/${resumeId}`
      );
      const result = await response.json();

      if (response.ok) {
        return { success: true, data: result.data };
      } else {
        return {
          success: false,
          error: result.message || "Failed to fetch resume",
        };
      }
    } catch (error) {
      return { success: false, error: "Network error. Please try again." };
    }
  }

  // Delete resume
  async deleteResume(resumeId) {
    try {
      const response = await authService.authenticatedRequest(
        `${API_BASE}/resumes/${resumeId}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        return { success: true };
      } else {
        const result = await response.json();
        return {
          success: false,
          error: result.message || "Failed to delete resume",
        };
      }
    } catch (error) {
      return { success: false, error: "Network error. Please try again." };
    }
  }

  // Get AI suggestions based on user's resume history
  async getResumesSuggestions() {
    try {
      const response = await authService.authenticatedRequest(
        `${API_BASE}/resumes/suggestions`
      );
      const result = await response.json();

      if (response.ok) {
        return { success: true, data: result.data };
      } else {
        return {
          success: false,
          error: result.message || "Failed to fetch suggestions",
        };
      }
    } catch (error) {
      return { success: false, error: "Network error. Please try again." };
    }
  }

  // Convert structured data back to formatted text
  structuredDataToText(data) {
    let resumeText = "";

    // Personal Info - handle both flat and nested structures
    const personalInfo = data.personalInfo || {
      name: data.name,
      email: data.email,
      phone: data.phone,
      address: data.location,
      linkedin: data.linkedin,
      github: data.github,
    };

    if (personalInfo.name) {
      resumeText += `${personalInfo.name}\n`;
    }
    if (personalInfo.email) resumeText += `${personalInfo.email}\n`;
    if (personalInfo.phone) resumeText += `${personalInfo.phone}\n`;
    if (personalInfo.address) resumeText += `${personalInfo.address}\n`;
    if (personalInfo.linkedin) resumeText += `${personalInfo.linkedin}\n`;
    if (personalInfo.github) resumeText += `${personalInfo.github}\n`;

    resumeText += "\n";

    // Summary
    if (data.summary) {
      resumeText += "SUMMARY\n";
      resumeText += `${data.summary}\n\n`;
    }

    // Experience
    if (data.experience && data.experience.length > 0) {
      resumeText += "WORK EXPERIENCE\n";
      data.experience.forEach((exp) => {
        resumeText += `${exp.title}\n`;
        if (exp.company) resumeText += `${exp.company}\n`;
        if (exp.duration) resumeText += `${exp.duration}\n`;
        if (exp.description && exp.description.length > 0) {
          exp.description.forEach((desc) => {
            resumeText += `• ${desc}\n`;
          });
        }
        resumeText += "\n";
      });
    }

    // Education
    if (data.education && data.education.length > 0) {
      resumeText += "EDUCATION\n";
      data.education.forEach((edu) => {
        resumeText += `${edu.degree}\n`;
        if (edu.institution) resumeText += `${edu.institution}\n`;
        if (edu.year) resumeText += `${edu.year}\n`;
        resumeText += "\n";
      });
    }

    // Skills
    if (data.skills && data.skills.length > 0) {
      resumeText += "TECHNICAL SKILLS\n";
      resumeText += `${data.skills.join(", ")}\n\n`;
    }

    // Projects
    if (data.projects && data.projects.length > 0) {
      resumeText += "PROJECTS\n";
      data.projects.forEach((project) => {
        resumeText += `${project.name}\n`;
        if (project.description && project.description.length > 0) {
          project.description.forEach((desc) => {
            resumeText += `• ${desc}\n`;
          });
        }
        resumeText += "\n";
      });
    }

    // Certifications
    if (data.certifications && data.certifications.length > 0) {
      resumeText += "CERTIFICATIONS\n";
      data.certifications.forEach((cert) => {
        resumeText += `• ${cert}\n`;
      });
      resumeText += "\n";
    }

    return resumeText.trim();
  }

  // Save structured resume data (for form-based creation)
  async saveResumeData(data, title = null) {
    try {
      const resumeData = { 
        ...data, 
        title: title || 'Resume',
      };

      // Use dataService for consistent storage handling
      const dataService = (await import('./dataService.js')).default;
      const result = await dataService.saveResume(resumeData);
      
      return result;
    } catch (error) {
      return { 
        success: false, 
        error: 'Failed to save resume data' 
      };
    }
  }

  // Auto-save uploaded resume data (for file uploads)
  async autoSaveUploadedResume(parsedData, originalFile, title = null) {
    try {
      // Extract name from parsed content for better title
      const piForTitle = this.extractPersonalInfoFromContent(
        parsedData.content
      );
      const extractedName = piForTitle.name;

      const resumeData = {
        title:
          title ||
          `Resume - ${extractedName || "Uploaded Resume"}`,
        templateId: 1, // Default template for uploaded resumes
        personalInfo: piForTitle,
        summary: this.extractSummaryFromContent(parsedData.content),
        skills: this.extractSkillsFromContent(parsedData.content),
        experience: this.extractExperienceFromContent(parsedData.content),
        education: this.extractEducationFromContent(parsedData.content),
        projects: this.extractProjectsFromContent(parsedData.content),
        certifications: this.extractCertificationsFromContent(
          parsedData.content
        ),
        achievements: this.extractAchievementsFromContent(parsedData.content),
        interests: this.extractInterestsFromContent(parsedData.content),
        languages: this.extractLanguagesFromContent(parsedData.content),
        rawText: parsedData.content,
      };

      // Use dataService for consistent storage handling
      const dataService = (await import('./dataService.js')).default;
      const result = await dataService.saveResume(resumeData);
      
      return result;
    } catch (error) {
      return { success: false, error: "Failed to save uploaded resume" };
    }
  }

  // Helper methods for extracting structured data from content
  extractNameFromContent(content) {
    const lines = content.split("\n");
    return lines[0]?.trim() || "";
  }

  extractPersonalInfoFromContent(content) {
    const lines = content.split("\n");
    const personalInfo = {
      name: lines[0]?.trim() || "",
      email: "",
      phone: "",
      location: "",
      linkedin: "",
      github: "",
      portfolio: "",
    };

    // Extract contact information from first few lines
    for (let i = 1; i < Math.min(6, lines.length); i++) {
      const line = lines[i].trim();
      if (line.includes("@") && !personalInfo.email) {
        personalInfo.email = line.match(/\S+@\S+\.\S+/)?.[0] || "";
      }
      if (line.match(/[\+\(]?[\d\s\-\(\)]{7,}/) && !personalInfo.phone) {
        personalInfo.phone = line;
      }
      if (line.toLowerCase().includes("linkedin") && !personalInfo.linkedin) {
        personalInfo.linkedin = line;
      }
      if (line.toLowerCase().includes("github") && !personalInfo.github) {
        personalInfo.github = line;
      }
      if (
        line.toLowerCase().includes("portfolio") ||
        (line.toLowerCase().includes("website") && !personalInfo.portfolio)
      ) {
        personalInfo.portfolio = line;
      }
    }

    return personalInfo;
  }

  extractSummaryFromContent(content) {
    const lines = content.split("\n");
    let summary = "";
    let inSummarySection = false;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      const upperLine = line.toUpperCase();

      if (
        ["SUMMARY", "PROFILE", "OBJECTIVE", "ABOUT"].some(
          (header) => upperLine.includes(header) && line.length < 50
        )
      ) {
        inSummarySection = true;
        continue;
      }

      if (inSummarySection) {
        if (
          ["EXPERIENCE", "EDUCATION", "SKILLS", "PROJECTS"].some(
            (header) => upperLine.includes(header) && line.length < 50
          )
        ) {
          break;
        }
        if (line) {
          summary += (summary ? " " : "") + line;
        }
      }
    }

    return summary;
  }

  extractSkillsFromContent(content) {
    const lines = content.split("\n");
    const skills = [];
    let inSkillsSection = false;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      const upperLine = line.toUpperCase();

      if (
        [
          "SKILLS",
          "TECHNICAL SKILLS",
          "CORE COMPETENCIES",
          "TECHNOLOGIES",
        ].some((header) => upperLine.includes(header) && line.length < 50)
      ) {
        inSkillsSection = true;
        continue;
      }

      if (inSkillsSection) {
        if (
          ["EXPERIENCE", "EDUCATION", "PROJECTS", "CERTIFICATIONS"].some(
            (header) => upperLine.includes(header) && line.length < 50
          )
        ) {
          break;
        }
        if (line) {
          const lineSkills = line
            .split(",")
            .map((skill) => skill.trim())
            .filter((skill) => skill);
          skills.push(...lineSkills);
        }
      }
    }

    return skills;
  }

  extractExperienceFromContent(content) {
    const lines = content.split("\n");
    const experience = [];
    let inExperienceSection = false;
    let currentJob = {};

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      const upperLine = line.toUpperCase();

      if (
        ["EXPERIENCE", "WORK EXPERIENCE", "EMPLOYMENT", "WORK HISTORY"].some(
          (header) => upperLine.includes(header) && line.length < 50
        )
      ) {
        inExperienceSection = true;
        continue;
      }

      if (inExperienceSection) {
        if (
          ["EDUCATION", "SKILLS", "PROJECTS", "CERTIFICATIONS"].some(
            (header) => upperLine.includes(header) && line.length < 50
          )
        ) {
          if (currentJob.title) {
            experience.push(currentJob);
          }
          break;
        }

        if (
          line.length < 100 &&
          !line.includes("•") &&
          !line.includes("-") &&
          !line.includes("*")
        ) {
          if (currentJob.title && !currentJob.company) {
            currentJob.company = line;
          } else {
            if (currentJob.title) {
              experience.push(currentJob);
            }
            currentJob = {
              title: line,
              company: "",
              duration: "",
              description: [],
            };
          }
        } else if (line.match(/\d{4}/) && line.length < 50) {
          currentJob.duration = line;
        } else if (line) {
          if (!currentJob.description) currentJob.description = [];
          currentJob.description.push(line.replace(/^[•\-*]\s*/, ""));
        }
      }
    }

    if (currentJob.title) {
      experience.push(currentJob);
    }

    return experience;
  }

  extractEducationFromContent(content) {
    const lines = content.split("\n");
    const education = [];
    let inEducationSection = false;
    let currentEdu = {};

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      const upperLine = line.toUpperCase();

      if (
        ["EDUCATION", "ACADEMIC BACKGROUND", "QUALIFICATIONS"].some(
          (header) => upperLine.includes(header) && line.length < 50
        )
      ) {
        inEducationSection = true;
        continue;
      }

      if (inEducationSection) {
        if (
          ["EXPERIENCE", "SKILLS", "PROJECTS", "CERTIFICATIONS"].some(
            (header) => upperLine.includes(header) && line.length < 50
          )
        ) {
          if (currentEdu.degree) {
            education.push(currentEdu);
          }
          break;
        }

        if (line.length < 100 && !line.includes("•") && !line.includes("-")) {
          if (currentEdu.degree && !currentEdu.institution) {
            currentEdu.institution = line;
          } else {
            if (currentEdu.degree) {
              education.push(currentEdu);
            }
            currentEdu = { degree: line, institution: "", year: "", gpa: "" };
          }
        } else if (line.match(/\d{4}/)) {
          currentEdu.year = line;
        }
      }
    }

    if (currentEdu.degree) {
      education.push(currentEdu);
    }

    return education;
  }

  extractProjectsFromContent(content) {
    const lines = content.split("\n");
    const projects = [];
    let inProjectsSection = false;
    let currentProject = {};

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      const upperLine = line.toUpperCase();

      if (
        ["PROJECTS", "PROJECT EXPERIENCE", "PORTFOLIO"].some(
          (header) => upperLine.includes(header) && line.length < 50
        )
      ) {
        inProjectsSection = true;
        continue;
      }

      if (inProjectsSection) {
        if (
          ["EXPERIENCE", "EDUCATION", "SKILLS", "CERTIFICATIONS"].some(
            (header) => upperLine.includes(header) && line.length < 50
          )
        ) {
          if (currentProject.name) {
            projects.push(currentProject);
          }
          break;
        }

        if (
          line.length < 100 &&
          !line.includes("•") &&
          !line.includes("-") &&
          !line.includes("*")
        ) {
          if (currentProject.name) {
            projects.push(currentProject);
          }
          currentProject = {
            name: line,
            description: [],
            technologies: [],
            link: "",
          };
        } else if (line) {
          if (!currentProject.description) currentProject.description = [];
          currentProject.description.push(line.replace(/^[•\-*]\s*/, ""));
        }
      }
    }

    if (currentProject.name) {
      projects.push(currentProject);
    }

    return projects;
  }

  extractCertificationsFromContent(content) {
    const lines = content.split("\n");
    const certifications = [];
    let inCertSection = false;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      const upperLine = line.toUpperCase();

      if (
        ["CERTIFICATIONS", "CERTIFICATES", "LICENSES"].some(
          (header) => upperLine.includes(header) && line.length < 50
        )
      ) {
        inCertSection = true;
        continue;
      }

      if (inCertSection) {
        if (
          ["EXPERIENCE", "EDUCATION", "SKILLS", "PROJECTS"].some(
            (header) => upperLine.includes(header) && line.length < 50
          )
        ) {
          break;
        }
        if (line) {
          certifications.push(line);
        }
      }
    }

    return certifications;
  }

  extractAchievementsFromContent(content) {
    const lines = content.split("\n");
    const achievements = [];
    let inAchievementsSection = false;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      const upperLine = line.toUpperCase();

      if (
        ["ACHIEVEMENTS", "AWARDS", "HONORS", "ACCOMPLISHMENTS"].some(
          (header) => upperLine.includes(header) && line.length < 50
        )
      ) {
        inAchievementsSection = true;
        continue;
      }

      if (inAchievementsSection) {
        if (
          ["EXPERIENCE", "EDUCATION", "SKILLS", "PROJECTS"].some(
            (header) => upperLine.includes(header) && line.length < 50
          )
        ) {
          break;
        }
        if (line) {
          achievements.push(line);
        }
      }
    }

    return achievements;
  }

  extractInterestsFromContent(content) {
    const lines = content.split("\n");
    const interests = [];
    let inInterestsSection = false;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      const upperLine = line.toUpperCase();

      if (
        ["INTERESTS", "HOBBIES", "ACTIVITIES"].some(
          (header) => upperLine.includes(header) && line.length < 50
        )
      ) {
        inInterestsSection = true;
        continue;
      }

      if (inInterestsSection) {
        if (
          ["EXPERIENCE", "EDUCATION", "SKILLS", "PROJECTS"].some(
            (header) => upperLine.includes(header) && line.length < 50
          )
        ) {
          break;
        }
        if (line) {
          interests.push(line);
        }
      }
    }

    return interests;
  }

  extractLanguagesFromContent(content) {
    const lines = content.split("\n");
    const languages = [];
    let inLanguagesSection = false;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      const upperLine = line.toUpperCase();

      if (
        ["LANGUAGES", "LANGUAGE PROFICIENCY"].some(
          (header) => upperLine.includes(header) && line.length < 50
        )
      ) {
        inLanguagesSection = true;
        continue;
      }

      if (inLanguagesSection) {
        if (
          ["EXPERIENCE", "EDUCATION", "SKILLS", "PROJECTS"].some(
            (header) => upperLine.includes(header) && line.length < 50
          )
        ) {
          break;
        }
        if (line) {
          languages.push(line);
        }
      }
    }

    return languages;
  }

  // Build data shaped for ResumeContext from raw text
  buildResumeContextFromContent(content) {
    const personalInfo = this.extractPersonalInfoFromContent(content);
    const summary = this.extractSummaryFromContent(content);
    const skills = this.extractSkillsFromContent(content);
    const experienceRaw = this.extractExperienceFromContent(content);
    const educationRaw = this.extractEducationFromContent(content);
    const projectsRaw = this.extractProjectsFromContent(content);
    const certificationsRaw = this.extractCertificationsFromContent(content);
    const achievements = this.extractAchievementsFromContent(content);
    const interests = this.extractInterestsFromContent(content);
    const languagesRaw = this.extractLanguagesFromContent(content);

    const experience = (experienceRaw || []).map((e) => ({
      title: e?.title || "",
      companyName: e?.company || "",
      date: e?.duration || "",
      companyLocation: "",
      accomplishment: Array.isArray(e?.description)
        ? e.description
        : e?.description
        ? [e.description]
        : [],
    }));

    const education = (educationRaw || []).map((ed) => ({
      degree: ed?.degree || "",
      institution: ed?.institution || "",
      duration: ed?.year || "",
      location: "",
    }));

    const projects = (projectsRaw || []).map((p) => ({
      name: p?.name || "",
      description: Array.isArray(p?.description)
        ? p.description.join("\n")
        : p?.description || "",
      technologies: Array.isArray(p?.technologies)
        ? p.technologies
        : (p?.technologies || "")
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean),
      link: p?.link || "",
      github: p?.github || "",
    }));

    const certifications = (certificationsRaw || []).map((c) =>
      typeof c === "string"
        ? { title: c, issuer: "", date: "" }
        : {
            title: c?.title || c?.name || "",
            issuer: c?.issuer || c?.organization || "",
            date: c?.date || c?.year || "",
          }
    );

    const languages = Array.isArray(languagesRaw)
      ? languagesRaw
          .map((l) => (typeof l === "string" ? l : l?.language || ""))
          .filter(Boolean)
      : [];

    return {
      name: personalInfo.name || "",
      role: "",
      email: personalInfo.email || "",
      phone: personalInfo.phone || "",
      location: personalInfo.location || "",
      linkedin: personalInfo.linkedin || "",
      github: personalInfo.github || "",
      portfolio: personalInfo.portfolio || "",
      profileImage: "",
      summary: summary || "",
      skills: skills || [],
      languages,
      interests: interests || [],
      experience,
      education,
      projects,
      certifications,
      achievements: achievements || [],
    };
  }
}

// Create and export a singleton instance
const resumeService = new ResumeService();
export default resumeService;
