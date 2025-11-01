import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Edit3, Trash2, Plus } from 'lucide-react';
import { motion } from 'framer-motion';
import Navbar from "../components/Navbar/Navbar.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import dataService from "../services/dataService.js";
import ProtectedRoute from "../routes/PrivateRoute.jsx";
import RegistrationIncentive from "../components/auth/RegistrationIncentive.jsx";

const MyResumesPageContent = () => {
  const navigate = useNavigate();
  const { isAuthenticated, isGuest } = useAuth();
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchResumes();
  }, [isAuthenticated]);

  const fetchResumes = async () => {
    setLoading(true);
    try {
      const resumeList = await dataService.getResumes();
      setResumes(Array.isArray(resumeList) ? resumeList : []);
    } catch (err) {
      console.error('Failed to fetch resumes:', err);
      setResumes([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteResume = async (resumeId) => {
    if (window.confirm('Are you sure you want to delete this resume?')) {
      try {
        const result = await dataService.deleteResume(resumeId);
        if (result.success) {
          await fetchResumes();
        } else {
          console.error('Failed to delete resume:', result.error);
        }
      } catch (err) {
        console.error('Failed to delete resume:', err);
      }
    }
  };

  const handleEditResume = (resume) => {
    // Extract templateId from resume
    const templateId = resume.templateId || resume.template_id || resume.templateKey;
    const idNum = typeof templateId === 'number'
      ? templateId
      : parseInt(String(templateId).replace(/[^0-9]/g, ''), 10);

    const availableTemplateIds = new Set([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 27, 28, 29]);
    
    if (idNum && availableTemplateIds.has(idNum)) {
      const route = `/template${idNum}`;
      
      // Transform nested personalInfo structure to flat structure expected by templates
      const personalInfo = resume.personalInfo || resume.personal_info || {};
      const resumeData = {
        // Flatten personalInfo to root level for template compatibility
        name: personalInfo.name || '',
        role: personalInfo.role || '',
        email: personalInfo.email || '',
        phone: personalInfo.phone || '',
        location: personalInfo.location || '',
        linkedin: personalInfo.linkedin || '',
        github: personalInfo.github || '',
        portfolio: personalInfo.portfolio || '',
        profileImage: personalInfo.profileImage || '',
        
        // Keep other fields as-is
        summary: resume.summary || '',
        skills: resume.skills || [],
        languages: resume.languages || [],
        interests: resume.interests || [],
        experience: resume.experience || [],
        education: resume.education || [],
        projects: resume.projects || [],
        certifications: resume.certifications || [],
        achievements: resume.achievements || [],
        
        // Keep metadata
        rawText: resume.rawText || resume.raw_text || '',
        templateId: idNum,
        title: resume.title
      };
      
      try {
        localStorage.setItem('resumeData', JSON.stringify(resumeData));
      } catch (e) { 
        console.error('Failed to save resume data to localStorage:', e);
      }
      
      navigate(route, {
        state: {
          buildType: 'template',
          resumeData,
          fromMyResumes: true,
          resumeName: resume.title,
          editMode: true
        }
      });
      return;
    }

    // Fallback: open generic template page
    navigate('/templatepage', {
      state: {
        prefilledData: resume,
        resumeText: resume.rawText || resume.raw_text || '',
        editMode: true,
        resumeId: resume.id,
        resumeName: resume.title,
        templateId: templateId || null
      }
    });
  };

  const handleUseInTemplate = (resume) => {
    // Navigate to template selection with pre-filled data
    navigate('/templatepage', {
      state: {
        prefilledData: resume,
        resumeText: resume.rawText || resume.raw_text || ''
      }
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 sm:mb-8 gap-4">
          <div className="flex-1">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center flex-wrap">
              <FileText className="mr-2 sm:mr-3 text-gray-600" size={28} />
              <span>My Resumes</span>
              {!isAuthenticated && (
                <span className="ml-2 sm:ml-3 bg-gray-100 text-gray-600 text-xs sm:text-sm px-2 sm:px-3 py-1 rounded-full">
                  Guest Mode
                </span>
              )}
            </h1>
            <p className="text-sm sm:text-base text-gray-600 mt-2">
              {isAuthenticated 
                ? 'Manage and edit your saved resumes' 
                : 'Your locally saved resumes (visible only on this device)'}
            </p>
          </div>
          <button
            onClick={() => navigate('/templatepage')}
            className="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition flex items-center justify-center gap-2 text-sm sm:text-base"
          >
            <Plus size={18} />
            <span className="sm:inline">Create New Resume</span>
          </button>
        </div>

        {/* Registration Incentive for Guest Users */}
        {!isAuthenticated && resumes.length > 0 && (
          <div className="mb-8">
            <RegistrationIncentive 
              context="my-resumes"
              className="max-w-md mx-auto"
            />
          </div>
        )}

        {/* Resumes Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-8 sm:py-12">
            <div className="animate-spin rounded-full h-6 sm:h-8 w-6 sm:w-8 border-b-2 border-gray-900"></div>
            <span className="ml-3 text-sm sm:text-base text-gray-600">Loading resumes...</span>
          </div>
        ) : resumes.length === 0 ? (
          <div className="text-center py-8 sm:py-12 px-4">
            <FileText className="mx-auto text-gray-400" size={48} />
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mt-4">No resumes yet</h3>
            <p className="text-sm sm:text-base text-gray-600 mt-2">Create your first resume to get started</p>
            <button
              onClick={() => navigate('/templatepage')}
              className="mt-4 sm:mt-6 px-4 sm:px-6 py-2 sm:py-3 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition text-sm sm:text-base"
            >
              Create Your First Resume
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {resumes.map((resume, index) => (
              <motion.div
                key={resume.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-all duration-200"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 truncate" title={resume.title}>
                        {resume.title}
                      </h3>
                      <p className="text-gray-500 text-sm mt-1">
                        {new Date(resume.createdAt || resume.created_at || Date.now()).toLocaleDateString()}
                      </p>
                      {!isAuthenticated && (
                        <span className="inline-block bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded mt-1">
                          Local
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Preview */}
                  <div className="bg-gray-50 rounded p-3 mb-4 h-16 overflow-hidden">
                    <p className="text-gray-600 text-sm line-clamp-3">
                      {resume.summary ||
                        (resume.personalInfo?.name || resume.personal_info?.name ? 
                          `${resume.personalInfo?.name || resume.personal_info?.name}` : 'Resume')}
                    </p>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEditResume(resume)}
                      className="flex-1 px-3 py-2 bg-gray-900 text-white rounded text-sm font-medium hover:bg-gray-800 transition flex items-center justify-center gap-1"
                    >
                      <Edit3 size={14} />
                      Edit
                    </button>
                    <button
                      onClick={() => handleUseInTemplate(resume)}
                      className="flex-1 px-3 py-2 bg-gray-100 text-gray-700 rounded text-sm font-medium hover:bg-gray-200 transition flex items-center justify-center gap-1"
                    >
                      <FileText size={14} />
                      Use Template
                    </button>
                    <button
                      onClick={() => handleDeleteResume(resume.id)}
                      className="px-3 py-2 bg-red-50 text-red-600 rounded text-sm font-medium hover:bg-red-100 transition flex items-center justify-center gap-1"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const MyResumesPage = () => {
  return (
    <ProtectedRoute 
      requireAuth={false}
      feature="my-resumes"
      title="My Resumes"
      description="Access your saved resumes from anywhere"
    >
      <MyResumesPageContent />
    </ProtectedRoute>
  );
};

export default MyResumesPage;