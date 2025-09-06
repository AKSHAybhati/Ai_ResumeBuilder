/**
 * Resume formatting utilities to convert plain text into properly formatted resume content
 */

/**
 * Format plain text into structured resume sections
 * @param {string} text - Raw resume text
 * @returns {Object} - Structured resume data
 */
export function parseResumeText(text) {
  const lines = text.split('\n').filter(line => line.trim());
  const sections = {
    header: {},
    summary: '',
    experience: [],
    education: [],
    skills: [],
    projects: [],
    other: []
  };

  let currentSection = 'other';
  let currentItem = {};

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    // Skip empty lines
    if (!line) continue;

    // Parse header information (name, contact details) - check first 10 lines
    if (i < 10 && isContactInfo(line)) {
      parseContactInfo(line, sections.header);
      continue;
    }

    // Detect section headers
    if (isSectionHeader(line)) {
      currentSection = getSectionType(line);
      continue;
    }

    // Parse different sections
    switch (currentSection) {
      case 'summary':
        sections.summary += line + ' ';
        break;
      case 'experience':
        if (isJobTitle(line)) {
          if (currentItem.title) sections.experience.push(currentItem);
          currentItem = { title: line, company: '', duration: '', description: [] };
        } else if (isCompanyLine(line)) {
          currentItem.company = line;
        } else if (isDurationLine(line)) {
          currentItem.duration = line;
        } else if (line.startsWith('•') || line.startsWith('-') || line.startsWith('*')) {
          currentItem.description.push(line);
        } else if (currentItem.title && line.length > 10) {
          // Add as description if it's substantial text
          currentItem.description.push('• ' + line);
        }
        break;
      case 'education':
        sections.education.push(line);
        break;
      case 'skills':
        sections.skills.push(line);
        break;
      case 'projects':
        sections.projects.push(line);
        break;
      default:
        // If no section detected yet, try to infer from content
        if (isJobTitle(line) && !currentItem.title) {
          currentSection = 'experience';
          currentItem = { title: line, company: '', duration: '', description: [] };
        } else if (line.toLowerCase().includes('summary') || line.toLowerCase().includes('about')) {
          currentSection = 'summary';
          sections.summary += line + ' ';
        } else {
          sections.other.push(line);
        }
    }
  }

  // Add the last experience item
  if (currentItem.title) {
    sections.experience.push(currentItem);
  }

  return sections;
}

/**
 * Format structured resume data into HTML
 * @param {Object} resumeData - Structured resume data
 * @returns {string} - HTML formatted resume
 */
export function formatResumeToHTML(resumeData) {
  let html = `
    <div style="font-family: 'Arial', sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; background: white; color: #333;">
      <!-- Header -->
      <div style="text-align: center; margin-bottom: 30px; border-bottom: 2px solid #00bda6; padding-bottom: 20px;">
        <h1 style="color: #00bda6; margin: 0; font-size: 28px; font-weight: bold;">${resumeData.header.name || 'Your Name'}</h1>
        <div style="margin-top: 10px; color: #666;">
          ${resumeData.header.title ? `<p style="margin: 5px 0; font-size: 16px;">${resumeData.header.title}</p>` : ''}
          ${resumeData.header.location ? `<p style="margin: 5px 0;">📍 ${resumeData.header.location}</p>` : ''}
          ${resumeData.header.phone ? `<p style="margin: 5px 0;">📞 ${resumeData.header.phone}</p>` : ''}
          ${resumeData.header.email ? `<p style="margin: 5px 0;">✉️ ${resumeData.header.email}</p>` : ''}
          ${resumeData.header.linkedin ? `<p style="margin: 5px 0;">🔗 <a href="${resumeData.header.linkedin}" style="color: #00bda6;">LinkedIn</a></p>` : ''}
          ${resumeData.header.github ? `<p style="margin: 5px 0;">💻 <a href="${resumeData.header.github}" style="color: #00bda6;">GitHub</a></p>` : ''}
        </div>
      </div>

      <!-- Summary -->
      ${resumeData.summary ? `
        <div style="margin-bottom: 25px;">
          <h2 style="color: #00bda6; border-bottom: 1px solid #00bda6; padding-bottom: 5px; margin-bottom: 15px;">PROFESSIONAL SUMMARY</h2>
          <p style="line-height: 1.6; margin: 0;">${resumeData.summary.trim()}</p>
        </div>
      ` : ''}

      <!-- Experience -->
      ${resumeData.experience.length > 0 ? `
        <div style="margin-bottom: 25px;">
          <h2 style="color: #00bda6; border-bottom: 1px solid #00bda6; padding-bottom: 5px; margin-bottom: 15px;">WORK EXPERIENCE</h2>
          ${resumeData.experience.map(job => `
            <div style="margin-bottom: 20px;">
              <h3 style="color: #333; margin: 0 0 5px 0; font-size: 18px;">${job.title}</h3>
              ${job.company ? `<p style="color: #666; margin: 0 0 5px 0; font-weight: bold;">${job.company}</p>` : ''}
              ${job.duration ? `<p style="color: #666; margin: 0 0 10px 0; font-style: italic;">${job.duration}</p>` : ''}
              ${job.description.length > 0 ? `
                <ul style="margin: 0; padding-left: 20px;">
                  ${job.description.map(desc => `<li style="margin-bottom: 5px; line-height: 1.5;">${desc.replace(/^[•\-*]\s*/, '')}</li>`).join('')}
                </ul>
              ` : ''}
            </div>
          `).join('')}
        </div>
      ` : ''}

      <!-- Education -->
      ${resumeData.education.length > 0 ? `
        <div style="margin-bottom: 25px;">
          <h2 style="color: #00bda6; border-bottom: 1px solid #00bda6; padding-bottom: 5px; margin-bottom: 15px;">EDUCATION</h2>
          <ul style="margin: 0; padding-left: 20px;">
            ${resumeData.education.map(edu => `<li style="margin-bottom: 5px; line-height: 1.5;">${edu}</li>`).join('')}
          </ul>
        </div>
      ` : ''}

      <!-- Skills -->
      ${resumeData.skills.length > 0 ? `
        <div style="margin-bottom: 25px;">
          <h2 style="color: #00bda6; border-bottom: 1px solid #00bda6; padding-bottom: 5px; margin-bottom: 15px;">TECHNICAL SKILLS</h2>
          <div style="display: flex; flex-wrap: wrap; gap: 8px;">
            ${resumeData.skills.map(skill => `
              <span style="background: #00bda6; color: white; padding: 4px 12px; border-radius: 15px; font-size: 14px;">${skill}</span>
            `).join('')}
          </div>
        </div>
      ` : ''}

      <!-- Projects -->
      ${resumeData.projects.length > 0 ? `
        <div style="margin-bottom: 25px;">
          <h2 style="color: #00bda6; border-bottom: 1px solid #00bda6; padding-bottom: 5px; margin-bottom: 15px;">PROJECTS</h2>
          <ul style="margin: 0; padding-left: 20px;">
            ${resumeData.projects.map(project => `<li style="margin-bottom: 5px; line-height: 1.5;">${project}</li>`).join('')}
          </ul>
        </div>
      ` : ''}

      <!-- Other sections -->
      ${resumeData.other.length > 0 ? `
        <div style="margin-bottom: 25px;">
          <h2 style="color: #00bda6; border-bottom: 1px solid #00bda6; padding-bottom: 5px; margin-bottom: 15px;">ADDITIONAL INFORMATION</h2>
          <ul style="margin: 0; padding-left: 20px;">
            ${resumeData.other.map(item => `<li style="margin-bottom: 5px; line-height: 1.5;">${item}</li>`).join('')}
          </ul>
        </div>
      ` : ''}
    </div>
  `;

  return html;
}

/**
 * Helper functions
 */
function isSectionHeader(line) {
  const headers = [
    'summary', 'experience', 'education', 'skills', 'projects', 
    'work experience', 'professional summary', 'career summary',
    'technical skills', 'relevant projects', 'personal projects'
  ];
  return headers.some(header => 
    line.toLowerCase().includes(header.toLowerCase())
  );
}

function getSectionType(line) {
  const lowerLine = line.toLowerCase();
  if (lowerLine.includes('summary')) return 'summary';
  if (lowerLine.includes('experience')) return 'experience';
  if (lowerLine.includes('education')) return 'education';
  if (lowerLine.includes('skill')) return 'skills';
  if (lowerLine.includes('project')) return 'projects';
  return 'other';
}

function isContactInfo(line) {
  return line.includes('@') || 
         line.includes('+') || 
         line.includes('linkedin') || 
         line.includes('github') ||
         line.includes('www.') ||
         /^\d{3}-\d{3}-\d{4}$/.test(line) ||
         /^\+\d{1,3}\s?\d{3,4}\s?\d{3,4}\s?\d{3,4}$/.test(line);
}

function parseContactInfo(line, header) {
  if (line.includes('@')) {
    header.email = line;
  } else if (line.includes('linkedin')) {
    header.linkedin = line;
  } else if (line.includes('github')) {
    header.github = line;
  } else if (line.includes('+') || /^\d/.test(line)) {
    header.phone = line;
  } else if (line.includes('|') && !header.title) {
    // Handle lines like "Full-Stack Developer | Bhilwara, Rajasthan | +91-8290932734"
    const parts = line.split('|').map(p => p.trim());
    if (parts.length >= 2) {
      header.title = parts[0];
      if (parts[1] && !header.location) {
        header.location = parts[1];
      }
      if (parts[2] && !header.phone) {
        header.phone = parts[2];
      }
    }
  } else if (!header.name && !line.includes('|') && !line.includes('@') && !line.includes('+') && !line.includes('linkedin') && !line.includes('github')) {
    header.name = line;
  }
}

function isJobTitle(line) {
  return line.includes('Developer') || 
         line.includes('Engineer') || 
         line.includes('Manager') || 
         line.includes('Analyst') ||
         line.includes('Intern') ||
         line.includes('Lead') ||
         line.includes('Senior') ||
         line.includes('Junior');
}

function isCompanyLine(line) {
  return line.includes('|') || 
         line.includes('at ') || 
         line.includes('Company') ||
         line.includes('Inc') ||
         line.includes('LLC') ||
         line.includes('Corp');
}

function isDurationLine(line) {
  return line.includes('202') || 
         line.includes('Jan') || 
         line.includes('Feb') || 
         line.includes('Mar') ||
         line.includes('Apr') ||
         line.includes('May') ||
         line.includes('Jun') ||
         line.includes('Jul') ||
         line.includes('Aug') ||
         line.includes('Sep') ||
         line.includes('Oct') ||
         line.includes('Nov') ||
         line.includes('Dec') ||
         line.includes('Present') ||
         line.includes('Current');
}

/**
 * Generate PDF from HTML content using html2pdf.js
 * @param {string} htmlContent - HTML formatted resume
 * @param {string} filename - Name for the downloaded file
 */
export async function downloadResumeAsPDF(htmlContent, filename = 'resume.pdf') {
  try {
    // Import html2pdf dynamically
    const html2pdf = (await import('html2pdf.js')).default;
    
    // Create a temporary div with the HTML content
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = htmlContent;
    tempDiv.style.position = 'absolute';
    tempDiv.style.left = '-9999px';
    tempDiv.style.top = '0';
    document.body.appendChild(tempDiv);

    // Configure html2pdf options
    const opt = {
      margin: 0.5,
      filename: filename,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    };

    // Generate and download PDF
    await html2pdf().set(opt).from(tempDiv).save();

    // Clean up
    document.body.removeChild(tempDiv);
  } catch (error) {
    console.error('Error generating PDF:', error);
    // Fallback: download as HTML file
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename.replace('.pdf', '.html');
    link.click();
  }
}
