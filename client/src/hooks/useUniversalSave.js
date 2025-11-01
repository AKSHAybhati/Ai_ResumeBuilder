import { useState, useCallback, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import resumeService from '../services/resumeService';
import { toast } from 'react-toastify';

/**
 * Custom hook for universal save functionality
 * Provides database saving capabilities to any component
 */
export const useUniversalSave = (templateId = null) => {
  const { isAuthenticated } = useAuth();

  // Function to detect template ID from URL or use provided one
  const detectTemplateId = useCallback(() => {
    if (templateId) return templateId;
    
    const url = window.location.href;
    const templateMatch = url.match(/template[=/]?(\d+)/i);
    return templateMatch ? parseInt(templateMatch[1]) : 1;
  }, [templateId]);

  // Function to save resume data to database
  const saveToDatabase = useCallback(async (resumeData) => {
    try {
      // Save silently without notifications
      const structuredData = {
        templateId: detectTemplateId(),
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
      
      await resumeService.saveResumeData(structuredData);
      return { success: true, data: structuredData };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }, [detectTemplateId]);

  // Function to handle localStorage save interception
  const setupLocalStorageInterception = useCallback(() => {
    // Store original localStorage.setItem
    const originalSetItem = localStorage.setItem;
    
    // Override localStorage.setItem
    localStorage.setItem = function(key, value) {
      // Call original function first
      originalSetItem.call(this, key, value);
      
      // If resume data is being saved, always try to save (no authentication check)
      if (key === 'resumeData') {
        try {
          const resumeData = JSON.parse(value);
          // Small delay to ensure localStorage operation completes
          setTimeout(() => saveToDatabase(resumeData), 100);
        } catch {
          // Ignore parsing errors
        }
      }
    };

    // Return cleanup function
    return () => {
      localStorage.setItem = originalSetItem;
    };
  }, [saveToDatabase]);

  // Initialize interception on mount
  useEffect(() => {
    const cleanup = setupLocalStorageInterception();
    return cleanup;
  }, [setupLocalStorageInterception]);

  // Return helper functions
  return {
    saveToDatabase,
    canSaveToDatabase: isAuthenticated,
    templateId: detectTemplateId()
  };
};