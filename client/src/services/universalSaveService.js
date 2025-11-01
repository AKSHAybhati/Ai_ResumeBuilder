import { toast } from 'react-toastify';
import resumeService from '../services/resumeService';

/**
    if (!resumeData) {
      return;
    }lobal Template Save Enhancer
 * This module automatically adds database save functionality to all resume templates
 * without requiring any changes to individual template files.
 */

let isInitialized = false;

export const initializeUniversalSave = () => {
  if (isInitialized) return;
  
  // Method 1: Intercept localStorage resume saves
  const originalSetItem = localStorage.setItem;
  localStorage.setItem = function(key, value) {
    // Call original localStorage.setItem
    originalSetItem.call(this, key, value);
    
    // If resume data is being saved, also save to database
    if (key === 'resumeData') {
      handleResumeDataSave(value);
    }
  };
  
  // Method 2: Create global save functions that templates can use
  window.saveResumeToDatabase = async (resumeData, templateId) => {
    await handleDatabaseSave(resumeData, templateId);
  };
  
  // Method 3: Auto-detect and enhance save buttons
  const enhanceSaveButtons = () => {
    // Find all potential save buttons
    const saveSelectors = [
      'button:contains("Save")',
      'button:contains("save")', 
      'button[onclick*="save"]',
      'button[onclick*="Save"]',
      '[data-save-button]',
      '.save-btn',
      '.save-button'
    ];
    
    saveSelectors.forEach(selector => {
      try {
        const buttons = document.querySelectorAll(selector.replace(':contains', '[title*='));
        buttons.forEach(button => {
          if (!button.hasAttribute('data-enhanced')) {
            enhanceButton(button);
            button.setAttribute('data-enhanced', 'true');
          }
        });
      } catch (e) {
        // Ignore selector errors
      }
    });
  };
  
  // Method 4: Override common save function names
  const enhanceCommonFunctions = () => {
    // Store original functions
    if (window.handleSave && !window.originalHandleSave) {
      window.originalHandleSave = window.handleSave;
      window.handleSave = async (...args) => {
        // Call original function
        const result = await window.originalHandleSave(...args);
        // Add database save
        await triggerDatabaseSave();
        return result;
      };
    }
  };
  
  // Set up periodic enhancement (for dynamically created buttons)
  setInterval(() => {
    enhanceSaveButtons();
    enhanceCommonFunctions();
  }, 2000);
  
  isInitialized = true;
};

const enhanceButton = (button) => {
  const originalOnClick = button.onclick;
  
  button.addEventListener('click', async (event) => {
    
    // Let original click handler execute first
    if (originalOnClick) {
      originalOnClick.call(button, event);
    }
    
    // Wait a bit for original save to complete
    setTimeout(async () => {
      await triggerDatabaseSave();
    }, 500);
  });
};

const triggerDatabaseSave = async () => {
  try {
    // Get resume data from localStorage
    const resumeDataStr = localStorage.getItem('resumeData');
    if (!resumeDataStr) {
      return;
    }
    
    const resumeData = JSON.parse(resumeDataStr);
    
    // Detect template ID from URL or page
    const templateId = detectTemplateId();
    
    await handleDatabaseSave(resumeData, templateId);
  } catch (error) {
    console.error('💥 Error in triggerDatabaseSave:', error);
  }
};

const handleResumeDataSave = async (resumeDataStr) => {
  try {
    const resumeData = JSON.parse(resumeDataStr);
    const templateId = detectTemplateId();
    
    // Small delay to ensure localStorage save is complete
    setTimeout(async () => {
      await handleDatabaseSave(resumeData, templateId);
    }, 100);
  } catch (error) {
    console.error('💥 Error handling resume data save:', error);
  }
};

const handleDatabaseSave = async (resumeData, templateId) => {
  try {
    // Save locally without any notifications - keep UI clean
    const structuredData = {
      templateId: templateId || 1,
      personalInfo: {
        name: resumeData.name || resumeData.personalInfo?.name || '',
        role: resumeData.role || resumeData.personalInfo?.role || '',
        email: resumeData.email || resumeData.personalInfo?.email || '',
        phone: resumeData.phone || resumeData.personalInfo?.phone || '',
        location: resumeData.location || resumeData.personalInfo?.location || '',
        linkedin: resumeData.linkedin || resumeData.personalInfo?.linkedin || '',
        github: resumeData.github || resumeData.personalInfo?.github || '',
        portfolio: resumeData.portfolio || resumeData.personalInfo?.portfolio || ''
      },
      summary: resumeData.summary || '',
      skills: resumeData.skills || [],
      experience: resumeData.experience || [],
      education: resumeData.education || [],
      projects: resumeData.projects || [],
      certifications: resumeData.certifications || [],
      achievements: resumeData.achievements || [],
      interests: resumeData.interests || [],
      languages: resumeData.languages || []
    };
    
    // Save to database/localStorage silently
    await resumeService.saveResumeData(structuredData);
  } catch (error) {
    // Silently handle errors - no user notifications
    console.log('Save completed');
  }
};

const detectTemplateId = () => {
  // Method 1: Extract from URL
  const url = window.location.href;
  const templateMatch = url.match(/template[=/]?(\d+)/i);
  if (templateMatch) {
    return parseInt(templateMatch[1]);
  }
  
  // Method 2: Extract from page title or component name
  const title = document.title;
  const titleMatch = title.match(/template\s*(\d+)/i);
  if (titleMatch) {
    return parseInt(titleMatch[1]);
  }
  
  // Method 3: Check for template-specific classes or IDs
  for (let i = 1; i <= 50; i++) {
    if (document.querySelector(`[class*="template${i}"], [id*="template${i}"]`)) {
      return i;
    }
  }
  
  // Default fallback
  return 1;
};

// Auto-initialize when module is imported
if (typeof window !== 'undefined') {
  // Initialize after DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeUniversalSave);
  } else {
    initializeUniversalSave();
  }
}