import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import resumeService from '../services/resumeService';
import { toast } from 'react-toastify';

const BuildOption = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { templateId } = location.state || {};
  const { isAuthenticated } = useAuth();

  const [selectedOption, setSelectedOption] = useState('');
  const [userResumes, setUserResumes] = useState([]);
  const [selectedResume, setSelectedResume] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showResumeSelector, setShowResumeSelector] = useState(false);

  // Fetch user's resumes when component mounts
  useEffect(() => {
    if (isAuthenticated) {
      fetchUserResumes();
    }
  }, [isAuthenticated]);

  const fetchUserResumes = async () => {
    try {
      setLoading(true);
      const result = await resumeService.getUserResumes();
      if (result.success) {
        setUserResumes(result.data || []);
      } else {
        toast.error('Failed to fetch your resumes');
      }
    } catch (error) {
      console.error('Error fetching resumes:', error);
      toast.error('Error loading your resumes');
    } finally {
      setLoading(false);
    }
  };

  const handleOptionSelect = (option) => {
    setSelectedOption(option);
    if (option === 'previous') {
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
      // First, save the resume data to localStorage so the template can access it
      localStorage.setItem('resumeData', JSON.stringify({
        name: selectedResume.personal_info?.name || '',
        role: selectedResume.personal_info?.role || '',
        email: selectedResume.personal_info?.email || '',
        phone: selectedResume.personal_info?.phone || '',
        location: selectedResume.personal_info?.location || '',
        linkedin: selectedResume.personal_info?.linkedin || '',
        github: selectedResume.personal_info?.github || '',
        portfolio: selectedResume.personal_info?.portfolio || '',
        summary: selectedResume.summary || '',
        skills: Array.isArray(selectedResume.skills) ? selectedResume.skills : [],
        experience: Array.isArray(selectedResume.experience) ? selectedResume.experience : [],
        education: Array.isArray(selectedResume.education) ? selectedResume.education : [],
        projects: Array.isArray(selectedResume.projects) ? selectedResume.projects : [],
        certifications: Array.isArray(selectedResume.certifications) ? selectedResume.certifications : [],
        achievements: Array.isArray(selectedResume.achievements) ? selectedResume.achievements : [],
        interests: Array.isArray(selectedResume.interests) ? selectedResume.interests : [],
        languages: Array.isArray(selectedResume.languages) ? selectedResume.languages : []
      }));
      
      // Navigate directly to the template
      navigate(`/template${templateId}`, {
        state: {
          buildType: 'previous',
          resumeData: selectedResume,
          fromPreviousData: true
        }
      });
    }
  };

  const handleBackClick = () => {
    navigate('/templatepage');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-4 py-12 md:p-12 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-72 h-72 bg-teal-500 rounded-full opacity-10 blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-orange-500 rounded-full opacity-10 blur-3xl"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-4xl mx-auto relative z-10"
      >
        {/* Back Button */}
        <motion.button
          onClick={handleBackClick}
          className="mb-8 flex items-center text-white hover:text-teal-100 transition-all duration-300 ease-in-out focus:outline-none p-4 rounded-2xl shadow-xl bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 backdrop-blur-lg border border-teal-400/30"
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.95 }}
        >
          <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Templates
        </motion.button>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-teal-400 to-orange-400 bg-clip-text text-transparent">
            How would you like to build your resume?
          </h1>
          <p className="text-gray-300 text-lg">
            Choose your preferred method to create your professional resume
          </p>
        </motion.div>

        {/* Options */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {/* Upload Resume Option */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className={`relative p-8 rounded-3xl border-2 transition-all duration-300 cursor-pointer ${
              selectedOption === 'upload'
                ? 'border-teal-400 bg-gradient-to-br from-teal-500/20 to-teal-600/20 shadow-xl shadow-teal-500/20'
                : 'border-gray-600 bg-gradient-to-br from-gray-800/50 to-gray-900/50 hover:border-gray-500'
            }`}
            onClick={() => handleOptionSelect('upload')}
            whileHover={{ scale: 1.02, y: -4 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-r from-teal-500 to-teal-600 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">AI Enhance</h3>
              <p className="text-gray-300 text-sm leading-relaxed">
                Upload your existing resume and we&apos;ll help you enhance it with AI-powered improvements
              </p>
            </div>
            {selectedOption === 'upload' && (
              <div className="absolute top-4 right-4">
                <div className="w-6 h-6 bg-teal-500 rounded-full flex items-center justify-center">
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
            className={`relative p-8 rounded-3xl border-2 transition-all duration-300 cursor-pointer ${
              selectedOption === 'scratch'
                ? 'border-orange-400 bg-gradient-to-br from-orange-500/20 to-orange-600/20 shadow-xl shadow-orange-500/20'
                : 'border-gray-600 bg-gradient-to-br from-gray-800/50 to-gray-900/50 hover:border-gray-500'
            }`}
            onClick={() => handleOptionSelect('scratch')}
            whileHover={{ scale: 1.02, y: -4 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Build from Scratch</h3>
              <p className="text-gray-300 text-sm leading-relaxed">
                Start fresh and build your resume step by step with our guided process and AI assistance
              </p>
            </div>
            {selectedOption === 'scratch' && (
              <div className="absolute top-4 right-4">
                <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center">
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
            className={`relative p-8 rounded-3xl border-2 transition-all duration-300 cursor-pointer ${
              selectedOption === 'previous'
                ? 'border-purple-400 bg-gradient-to-br from-purple-500/20 to-purple-600/20 shadow-xl shadow-purple-500/20'
                : 'border-gray-600 bg-gradient-to-br from-gray-800/50 to-gray-900/50 hover:border-gray-500'
            }`}
            onClick={() => isAuthenticated ? handleOptionSelect('previous') : toast.info('Please sign in to use your previous data')}
            whileHover={{ scale: 1.02, y: -4 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Use Previous Data</h3>
              <p className="text-gray-300 text-sm leading-relaxed">
                {isAuthenticated 
                  ? 'Select from your previously saved resumes and continue editing' 
                  : 'Sign in to access your saved resumes'
                }
              </p>
              {!isAuthenticated && (
                <div className="mt-4">
                  <span className="inline-block px-3 py-1 bg-gray-700 text-xs text-gray-300 rounded-full">
                    Login Required
                  </span>
                </div>
              )}
            </div>
            {selectedOption === 'previous' && (
              <div className="absolute top-4 right-4">
                <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            )}
          </motion.div>
        </div>

        {/* Resume Selector */}
        {showResumeSelector && selectedOption === 'previous' && isAuthenticated && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            transition={{ duration: 0.3 }}
            className="mb-8"
          >
            <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-2xl p-6 border border-gray-600">
              <h4 className="text-xl font-semibold text-white mb-4 flex items-center">
                <svg className="w-5 h-5 mr-2 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Select a Resume to Continue
              </h4>
              
              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500 mx-auto"></div>
                  <p className="text-gray-400 mt-2">Loading your resumes...</p>
                </div>
              ) : userResumes.length === 0 ? (
                <div className="text-center py-8">
                  <svg className="w-16 h-16 text-gray-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <p className="text-gray-400">No saved resumes found</p>
                  <p className="text-gray-500 text-sm mt-1">Create your first resume to use this feature</p>
                </div>
              ) : (
                <div className="grid gap-3 max-h-64 overflow-y-auto">
                  {userResumes.map((resume) => (
                    <motion.div
                      key={resume.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                        selectedResume?.id === resume.id
                          ? 'border-purple-400 bg-purple-500/10'
                          : 'border-gray-600 hover:border-gray-500 bg-gray-800/30'
                      }`}
                      onClick={() => setSelectedResume(resume)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h5 className="font-semibold text-white">{resume.title || 'Untitled Resume'}</h5>
                          <p className="text-sm text-gray-400">
                            {resume.personal_info?.name || 'No name'} • {resume.personal_info?.role || 'No role'}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            Last updated: {new Date(resume.updated_at).toLocaleDateString()}
                          </p>
                        </div>
                        {selectedResume?.id === resume.id && (
                          <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center ml-4">
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
          className="text-center"
        >
          <button
            onClick={handleProceed}
            disabled={!selectedOption || (selectedOption === 'previous' && !selectedResume)}
            className={`px-12 py-4 rounded-2xl font-semibold text-lg transition-all duration-300 ${
              selectedOption && (selectedOption !== 'previous' || selectedResume)
                ? 'bg-gradient-to-r from-teal-500 to-orange-500 hover:from-teal-600 hover:to-orange-600 text-white shadow-xl hover:shadow-2xl transform hover:scale-105'
                : 'bg-gray-600 text-gray-400 cursor-not-allowed'
            }`}
          >
            Continue
          </button>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default BuildOption;
