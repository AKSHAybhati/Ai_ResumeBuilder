import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import dataService from '../services/dataService';
import GuestLimitationPrompt from '../components/auth/GuestLimitationPrompt';

const BuildOption = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, isGuest } = useAuth();
  const { templateId } = location.state || {};

  const [selectedOption, setSelectedOption] = useState('');
  const [userResumes, setUserResumes] = useState([]);
  const [selectedResume, setSelectedResume] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showResumeSelector, setShowResumeSelector] = useState(false);
  const [showGuestPrompt, setShowGuestPrompt] = useState(false);

  // Load saved resumes when component mounts
  useEffect(() => {
    const fetchSavedResumes = async () => {
      try {
        setLoading(true);
        const resumes = await dataService.getResumes();
        setUserResumes(Array.isArray(resumes) ? resumes : []);
      } catch (e) {
        console.error('Error reading saved resumes:', e);
        setUserResumes([]);
      } finally {
        setLoading(false);
      }
    };
    fetchSavedResumes();
  }, [isAuthenticated]);

  // Normalize saved resume -> template-friendly shape
  const normalizeResumeForTemplate = (resume) => {
    const pi = resume.personalInfo || resume.personal_info || {};
    const safeArray = (val) => Array.isArray(val) ? val : (val ? [val] : []);

    const mapExperience = safeArray(resume.experience).map((exp) => {
      const descriptionText = Array.isArray(exp?.description) ? exp.description.join('\n') : (exp?.description || '');
      const accomplishment = descriptionText
        ? descriptionText.split('\n').map(s => s.trim()).filter(Boolean)
        : [];
      return {
        // Generic keys (for templates expecting these)
        title: exp?.title || '',
        company: exp?.company || exp?.companyName || '',
        duration: exp?.duration || exp?.date || '',
        description: descriptionText,
        // Template11-friendly keys
        companyName: exp?.companyName || exp?.company || '',
        date: exp?.date || exp?.duration || '',
        companyLocation: exp?.companyLocation || '',
        accomplishment
      };
    });

    const mapEducation = safeArray(resume.education).map((edu) => ({
      degree: edu?.degree || '',
      institution: edu?.institution || '',
      year: edu?.year || '',
      // Template11-friendly extras
      duration: edu?.duration || edu?.year || '',
      location: edu?.location || ''
    }));

    const mapProjects = safeArray(resume.projects).map((p) => ({
      name: p?.name || '',
      // Provide both string and array forms
      technologies: Array.isArray(p?.technologies) ? p.technologies : ((p?.technologies || '').split(',').map(s => s.trim()).filter(Boolean)),
      description: Array.isArray(p?.description) ? p.description.join('\n') : (p?.description || ''),
      link: p?.link || '',
      github: p?.github || ''
    }));

    const mapCerts = safeArray(resume.certifications).map((c) => {
      if (typeof c === 'string') {
        return { title: c, issuer: '', date: '' };
      }
      return {
        title: c?.title || c?.name || '',
        issuer: c?.issuer || c?.organization || '',
        date: c?.date || c?.year || ''
      };
    });

    const mapLanguages = safeArray(resume.languages).map((l) => (
      typeof l === 'string' ? { language: l, proficiency: 'Intermediate' } : {
        language: l?.language || '',
        proficiency: l?.proficiency || 'Intermediate'
      }
    ));

    const skills = Array.isArray(resume.skills)
      ? resume.skills.map((s) => typeof s === 'string' ? s : (s?.name || '')).filter(Boolean)
      : [];

    return {
      name: pi.name || '',
      role: pi.role || '',
      email: pi.email || '',
      phone: pi.phone || '',
      location: pi.location || '',
      linkedin: pi.linkedin || '',
      github: pi.github || '',
      portfolio: pi.portfolio || '',
      summary: resume.summary || '',
      skills,
      experience: mapExperience,
      education: mapEducation,
      projects: mapProjects,
      certifications: mapCerts,
      achievements: safeArray(resume.achievements),
      interests: safeArray(resume.interests),
      languages: mapLanguages
    };
  };

  const handleOptionSelect = (option) => {
    setSelectedOption(option);
    
    if (option === 'previous') {
      // Check if user is authenticated for previous data feature
      if (!isAuthenticated) {
        setShowGuestPrompt(true);
        return;
      }
      setShowResumeSelector(true);
    } else {
      setShowResumeSelector(false);
      setSelectedResume(null);
    }
  };

  const handleProceed = () => {
    if (selectedOption === 'upload') {
      navigate('/ai-edit', { state: { templateId } });
    } else if (selectedOption === 'scratch') {
      // Clear localStorage for fresh start
      localStorage.removeItem('resumeData');
      navigate('/details/personal-details', {
        state: {
          templateId,
          buildType: 'scratch'
        }
      });
    } else if (selectedOption === 'previous' && selectedResume) {
      // Navigate directly to template with pre-filled data
      // First, normalize and save the resume data to localStorage so the template can access it
      const normalized = normalizeResumeForTemplate(selectedResume);
      localStorage.setItem('resumeData', JSON.stringify(normalized));

      // Navigate directly to the template
      navigate(`/template${templateId}`, {
        state: {
          buildType: 'previous',
          resumeData: normalized,
          fromPreviousData: true
        }
      });
    }
  };

  const handleBackClick = () => {
    navigate('/templatepage');
  };

  return (
    <div className="min-h-screen bg-white p-4 py-8 sm:py-12 md:p-12 relative">

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-4xl mx-auto relative z-10"
      >
        {/* Back Button */}
        <motion.button
          onClick={handleBackClick}
          className="mb-6 sm:mb-8 flex items-center text-gray-900 hover:bg-gray-100 transition-colors focus:outline-none px-3 sm:px-4 py-2 rounded-lg border border-gray-200 bg-white text-sm sm:text-base"
        >
          <svg className="w-5 sm:w-6 h-5 sm:h-6 mr-2 sm:mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span className="font-medium">Back to Templates</span>
        </motion.button>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="text-center mb-8 sm:mb-10 px-4"
        >
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 text-gray-900 leading-tight">
            How would you like to build your resume?
          </h1>
          <p className="text-gray-600 text-base sm:text-lg">
            Choose your preferred method to create your professional resume
          </p>
        </motion.div>

        {/* Options */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-12">
          {/* Upload Resume Option */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className={`relative p-4 sm:p-6 lg:p-8 rounded-2xl border transition-colors cursor-pointer ${selectedOption === 'upload'
              ? 'border-gray-900 bg-white'
              : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
            onClick={() => handleOptionSelect('upload')}
          >
            <div className="text-center">
              <div className="w-12 sm:w-14 h-12 sm:h-14 mx-auto mb-4 sm:mb-5 bg-gray-100 rounded-full flex items-center justify-center">
                <svg className="w-6 sm:w-7 h-6 sm:h-7 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              </div>
              <h3 className="text-lg sm:text-xl lg:text-2xl font-semibold text-gray-900 mb-2 sm:mb-3">AI enhance</h3>
              <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">
                Upload your existing resume and we&apos;ll help you enhance it with AI-powered improvements
              </p>
            </div>
            {selectedOption === 'upload' && (
              <div className="absolute top-4 right-4">
                <div className="w-6 h-6 bg-gray-900 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            )}
          </motion.div>

          {/* Build from Scratch Option */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className={`relative p-4 sm:p-6 lg:p-8 rounded-2xl border transition-colors cursor-pointer ${selectedOption === 'scratch'
              ? 'border-gray-900 bg-white'
              : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
            onClick={() => handleOptionSelect('scratch')}
          >
            <div className="text-center">
              <div className="w-12 sm:w-14 h-12 sm:h-14 mx-auto mb-4 sm:mb-5 bg-gray-100 rounded-full flex items-center justify-center">
                <svg className="w-6 sm:w-7 h-6 sm:h-7 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </div>
              <h3 className="text-lg sm:text-xl lg:text-2xl font-semibold text-gray-900 mb-2 sm:mb-3">Build from scratch</h3>
              <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">
                Start fresh and build your resume step by step with our guided process and AI assistance
              </p>
            </div>
            {selectedOption === 'scratch' && (
              <div className="absolute top-4 right-4">
                <div className="w-6 h-6 bg-gray-900 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            )}
          </motion.div>

          {/* Use Previous Data Option */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className={`relative p-4 sm:p-6 lg:p-8 rounded-2xl border transition-colors cursor-pointer ${selectedOption === 'previous'
              ? 'border-gray-900 bg-white'
              : 'border-gray-200 bg-white hover:border-gray-300'
              } ${!isAuthenticated ? 'sm:col-span-2 md:col-span-1' : ''}`}
            onClick={() => handleOptionSelect('previous')}
          >
            <div className="text-center">
              <div className="w-12 sm:w-14 h-12 sm:h-14 mx-auto mb-4 sm:mb-5 bg-gray-100 rounded-full flex items-center justify-center">
                <svg className="w-6 sm:w-7 h-6 sm:h-7 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-lg sm:text-xl lg:text-2xl font-semibold text-gray-900 mb-2 sm:mb-3">Use previous data</h3>
              <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">
                {isAuthenticated 
                  ? 'Select from your previously saved resumes and continue editing'
                  : 'Access your saved resumes (requires account)'}
              </p>
              {!isAuthenticated && (
                <div className="mt-2 sm:mt-3 text-xs text-gray-500 bg-gray-50 p-2 rounded">
                  Sign up to save and reuse your resume data across devices
                </div>
              )}
            </div>
            {selectedOption === 'previous' && (
              <div className="absolute top-4 right-4">
                <div className="w-6 h-6 bg-gray-900 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            )}
          </motion.div>
        </div>

        {/* Resume Selector */}
        {showResumeSelector && selectedOption === 'previous' && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            transition={{ duration: 0.3 }}
            className="mb-8"
          >
            <div className="bg-white rounded-2xl p-6 border border-gray-200">
              <h4 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <svg className="w-5 h-5 mr-2 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Select a Resume to Continue
              </h4>

              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-500 mx-auto"></div>
                  <p className="text-gray-600 mt-2">Loading your resumes...</p>
                </div>
              ) : userResumes.length === 0 ? (
                <div className="text-center py-8">
                  <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <p className="text-gray-600">No saved resumes found</p>
                  <p className="text-gray-500 text-sm mt-1">Create your first resume to use this feature</p>
                </div>
              ) : (
                <div className="grid gap-3 max-h-64 overflow-y-auto">
                  {userResumes.map((resume) => (
                    <motion.div
                      key={resume.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className={`p-4 rounded-lg border cursor-pointer transition-colors ${selectedResume?.id === resume.id
                        ? 'border-gray-900 bg-white'
                        : 'border-gray-200 hover:border-gray-300 bg-white'
                        }`}
                      onClick={() => setSelectedResume(resume)}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <h5 className="font-semibold text-gray-900 truncate" title={resume.title || 'Untitled Resume'}>
                            {resume.title || 'Untitled Resume'}
                          </h5>
                          <p className="text-sm text-gray-600 truncate">
                            {(resume.personalInfo?.name || resume.personal_info?.name || 'No name')} • {(resume.personalInfo?.role || resume.personal_info?.role || 'No role')}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            Last updated: {new Date(resume.updatedAt || resume.updated_at || resume.createdAt || resume.created_at).toLocaleDateString()}
                          </p>
                          <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                            {(resume.summary || resume.rawText || resume.raw_text || '').slice(0, 180)}{(resume.summary || resume.rawText || resume.raw_text || '').length > 180 ? '…' : ''}
                          </p>
                        </div>
                        {selectedResume?.id === resume.id && (
                          <div className="flex-shrink-0 w-6 h-6 bg-gray-900 rounded-full flex items-center justify-center ml-1">
                            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* Proceed Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="text-center px-4"
        >
          <button
            onClick={handleProceed}
            disabled={!selectedOption || (selectedOption === 'previous' && !selectedResume)}
            className={`w-full sm:w-auto px-6 sm:px-8 py-3 rounded-lg font-medium text-sm sm:text-base ${selectedOption && (selectedOption !== 'previous' || selectedResume)
              ? 'bg-gray-900 text-white hover:bg-gray-800'
              : 'bg-gray-200 text-gray-500 cursor-not-allowed'
              }`}
          >
            Continue
          </button>
        </motion.div>

        {/* Guest Limitation Prompt */}
        <GuestLimitationPrompt
          isOpen={showGuestPrompt}
          onClose={() => setShowGuestPrompt(false)}
          feature="previous-data"
          onContinueAsGuest={() => {
            // Allow guest to continue but with limited functionality
            setSelectedOption('scratch');
            setShowResumeSelector(false);
          }}
        />
      </motion.div>
    </div>
  );
};

export default BuildOption;
