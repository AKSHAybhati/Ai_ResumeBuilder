import authService from './authService';
import apiService from './apiService';

class DataService {
  constructor() {
    this.GUEST_RESUMES_KEY = 'guest_resumes';
    this.USER_RESUMES_KEY = 'userResumes'; // Keep existing key for compatibility
  }

  // Get the appropriate storage key based on user status
  getStorageKey(isGuest = false) {
    return isGuest ? this.GUEST_RESUMES_KEY : this.USER_RESUMES_KEY;
  }

  // Check if user is authenticated
  isUserAuthenticated() {
    return authService.isAuthenticated();
  }

  // Get current user ID
  getCurrentUserId() {
    const user = authService.getCurrentUser();
    return user?.id || user?.userId;
  }

  // Save resume data (handles both guest and authenticated users)
  async saveResume(resumeData, isGuest = null) {
    try {
      // Determine if user is guest
      const userIsGuest = isGuest !== null ? isGuest : !this.isUserAuthenticated();
      
      if (userIsGuest) {
        return await this.saveGuestResume(resumeData);
      } else {
        return await this.saveAuthenticatedResume(resumeData);
      }
    } catch (error) {
      console.error('Save resume error:', error);
      return { success: false, error: 'Failed to save resume' };
    }
  }

  // Save resume for guest users (localStorage)
  async saveGuestResume(resumeData) {
    try {
      const existingResumes = this.getGuestResumes();
      
      const newResume = {
        id: Date.now().toString(),
        ...resumeData,
        isGuest: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      // Check if updating existing resume
      const existingIndex = existingResumes.findIndex(r => r.id === resumeData.id);
      if (existingIndex >= 0) {
        existingResumes[existingIndex] = {
          ...existingResumes[existingIndex],
          ...newResume,
          id: resumeData.id, // Keep original ID
          createdAt: existingResumes[existingIndex].createdAt // Keep original creation date
        };
      } else {
        existingResumes.push(newResume);
      }

      localStorage.setItem(this.GUEST_RESUMES_KEY, JSON.stringify(existingResumes));
      
      const savedResume = existingIndex >= 0 ? existingResumes[existingIndex] : newResume;
      
      return { 
        success: true, 
        data: savedResume 
      };
    } catch (error) {
      console.error('Guest save error:', error);
      return { success: false, error: 'Failed to save resume locally' };
    }
  }

  // Save resume for authenticated users (localStorage for now, until backend is implemented)
  async saveAuthenticatedResume(resumeData) {
    try {
      const existingResumes = this.getAuthenticatedResumes();
      
      const newResume = {
        id: Date.now().toString(),
        ...resumeData,
        isGuest: false,
        userId: this.getCurrentUserId(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      // Check if updating existing resume
      const existingIndex = existingResumes.findIndex(r => r.id === resumeData.id);
      if (existingIndex >= 0) {
        existingResumes[existingIndex] = {
          ...existingResumes[existingIndex],
          ...newResume,
          id: resumeData.id, // Keep original ID
          createdAt: existingResumes[existingIndex].createdAt // Keep original creation date
        };
      } else {
        existingResumes.push(newResume);
      }

      localStorage.setItem(this.USER_RESUMES_KEY, JSON.stringify(existingResumes));
      
      const savedResume = existingIndex >= 0 ? existingResumes[existingIndex] : newResume;
      
      return { 
        success: true, 
        data: savedResume 
      };
    } catch (error) {
      console.error('Authenticated save error:', error);
      return { success: false, error: 'Failed to save resume locally' };
    }
  }

  // Get all resumes for current user
  async getResumes(isGuest = null) {
    try {
      const userIsGuest = isGuest !== null ? isGuest : !this.isUserAuthenticated();
      
      if (userIsGuest) {
        return this.getGuestResumes();
      } else {
        return this.getAuthenticatedResumes();
      }
    } catch (error) {
      console.error('Get resumes error:', error);
      return [];
    }
  }

  // Get guest resumes from localStorage
  getGuestResumes() {
    try {
      const resumes = localStorage.getItem(this.GUEST_RESUMES_KEY);
      return resumes ? JSON.parse(resumes) : [];
    } catch (error) {
      console.error('Get guest resumes error:', error);
      return [];
    }
  }

  // Get authenticated user resumes from localStorage (until backend is implemented)
  getAuthenticatedResumes() {
    try {
      const resumes = localStorage.getItem(this.USER_RESUMES_KEY);
      return resumes ? JSON.parse(resumes) : [];
    } catch (error) {
      console.error('Get authenticated resumes error:', error);
      return [];
    }
  }

  // Get specific resume by ID
  async getResume(resumeId, isGuest = null) {
    try {
      const userIsGuest = isGuest !== null ? isGuest : !this.isUserAuthenticated();
      
      if (userIsGuest) {
        const resumes = this.getGuestResumes();
        return resumes.find(r => r.id === resumeId) || null;
      } else {
        const resumes = this.getAuthenticatedResumes();
        return resumes.find(r => r.id === resumeId) || null;
      }
    } catch (error) {
      console.error('Get resume error:', error);
      return null;
    }
  }

  // Delete resume
  async deleteResume(resumeId, isGuest = null) {
    try {
      const userIsGuest = isGuest !== null ? isGuest : !this.isUserAuthenticated();
      
      if (userIsGuest) {
        return this.deleteGuestResume(resumeId);
      } else {
        return this.deleteAuthenticatedResume(resumeId);
      }
    } catch (error) {
      console.error('Delete resume error:', error);
      return { success: false, error: 'Failed to delete resume' };
    }
  }

  // Delete guest resume from localStorage
  deleteGuestResume(resumeId) {
    try {
      const resumes = this.getGuestResumes();
      const filteredResumes = resumes.filter(r => r.id !== resumeId);
      
      localStorage.setItem(this.GUEST_RESUMES_KEY, JSON.stringify(filteredResumes));
      
      return { success: true };
    } catch (error) {
      console.error('Delete guest resume error:', error);
      return { success: false, error: 'Failed to delete resume locally' };
    }
  }

  // Delete authenticated user resume from localStorage
  deleteAuthenticatedResume(resumeId) {
    try {
      const resumes = this.getAuthenticatedResumes();
      const filteredResumes = resumes.filter(r => r.id !== resumeId);
      
      localStorage.setItem(this.USER_RESUMES_KEY, JSON.stringify(filteredResumes));
      
      return { success: true };
    } catch (error) {
      console.error('Delete authenticated resume error:', error);
      return { success: false, error: 'Failed to delete resume locally' };
    }
  }

  // Migrate guest data to authenticated user account
  async migrateGuestData() {
    try {
      if (!this.isUserAuthenticated()) {
        return { success: false, error: 'User must be authenticated to migrate data' };
      }

      const guestResumes = this.getGuestResumes();
      
      if (guestResumes.length === 0) {
        return { success: true, message: 'No guest data to migrate', count: 0 };
      }

      const migratedResumes = [];
      const errors = [];

      // Migrate each resume
      for (const resume of guestResumes) {
        try {
          // Remove guest-specific properties
          const { id, isGuest, ...resumeData } = resume;
          
          const result = await this.saveAuthenticatedResume({
            ...resumeData,
            title: `${resumeData.title} (Migrated)`
          });

          if (result.success) {
            migratedResumes.push(result.data);
          } else {
            errors.push(`Failed to migrate "${resumeData.title}": ${result.error}`);
          }
        } catch (error) {
          errors.push(`Failed to migrate resume: ${error.message}`);
        }
      }

      // Clear guest data after successful migration
      if (migratedResumes.length > 0) {
        localStorage.removeItem(this.GUEST_RESUMES_KEY);
      }

      return {
        success: true,
        message: `Successfully migrated ${migratedResumes.length} resume(s)`,
        count: migratedResumes.length,
        errors: errors.length > 0 ? errors : undefined
      };
    } catch (error) {
      console.error('Migration error:', error);
      return { success: false, error: 'Failed to migrate guest data' };
    }
  }

  // Get data storage info for current user
  getStorageInfo() {
    const isAuthenticated = this.isUserAuthenticated();
    const guestResumes = this.getGuestResumes();
    
    return {
      isAuthenticated,
      storageType: isAuthenticated ? 'database' : 'localStorage',
      guestResumeCount: guestResumes.length,
      canMigrate: !isAuthenticated && guestResumes.length > 0
    };
  }

  // Clear all local data (for logout or data reset)
  clearLocalData() {
    try {
      localStorage.removeItem(this.GUEST_RESUMES_KEY);
      localStorage.removeItem(this.USER_RESUMES_KEY);
      return { success: true };
    } catch (error) {
      console.error('Clear local data error:', error);
      return { success: false, error: 'Failed to clear local data' };
    }
  }

  // Validate resume data structure
  validateResumeData(resumeData) {
    const errors = [];

    if (!resumeData.title || typeof resumeData.title !== 'string') {
      errors.push('Resume title is required');
    }

    if (!resumeData.personalInfo || typeof resumeData.personalInfo !== 'object') {
      errors.push('Personal information is required');
    }

    // Add more validation as needed

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}

// Create and export singleton instance
const dataService = new DataService();
export default dataService;