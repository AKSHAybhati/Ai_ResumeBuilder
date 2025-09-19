import { useState, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ResumeContext } from '../../context/ResumeContext';
import { useAuth } from '../../context/AuthContext';
import resumeService from '../../services/resumeService';
import { toast } from 'react-toastify';

const OtherDetails = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { templateId, buildType } = location.state || {};
  const { resumeData, updateResumeData } = useContext(ResumeContext);
  const { isAuthenticated } = useAuth();

  const [certifications, setCertifications] = useState(
    resumeData?.certifications || [
      {
        id: 1,
        name: '',
        issuer: '',
        year: ''
      }
    ]
  );

  const [achievements, setAchievements] = useState(
    resumeData?.achievements || [
      {
        id: 1,
        title: '',
        description: '',
        year: ''
      }
    ]
  );

  const handleCertificationChange = (id, field, value) => {
    setCertifications(prev => 
      prev.map(cert => 
        cert.id === id ? { ...cert, [field]: value } : cert
      )
    );
  };

  const addCertification = () => {
    const newId = certifications.length > 0 ? Math.max(...certifications.map(cert => cert.id)) + 1 : 1;
    setCertifications(prev => [
      ...prev,
      {
        id: newId,
        name: '',
        issuer: '',
        year: ''
      }
    ]);
  };

  const removeCertification = (id) => {
    if (certifications.length > 1) {
      setCertifications(prev => prev.filter(cert => cert.id !== id));
    }
  };

  const handleAchievementChange = (id, field, value) => {
    setAchievements(prev => 
      prev.map(achievement => 
        achievement.id === id ? { ...achievement, [field]: value } : achievement
      )
    );
  };

  const addAchievement = () => {
    const newId = achievements.length > 0 ? Math.max(...achievements.map(achievement => achievement.id)) + 1 : 1;
    setAchievements(prev => [
      ...prev,
      {
        id: newId,
        title: '',
        description: '',
        year: ''
      }
    ]);
  };

  const removeAchievement = (id) => {
    if (achievements.length > 1) {
      setAchievements(prev => prev.filter(achievement => achievement.id !== id));
    }
  };

  const handleBackClick = () => {
    navigate('/details/languages', { 
      state: { templateId, buildType } 
    });
  };

  const handleFinish = async () => {
    const finalData = {
      ...resumeData,
      // Map certifications to the format expected by templates
      certifications: certifications.map(cert => ({
        title: cert.name,
        issuer: cert.issuer,
        date: cert.year
      })).filter(cert => cert.title.trim()),
      // Map achievements to the format expected by templates
      achievements: achievements.map(achievement => ({
        title: achievement.title,
        description: achievement.description,
        year: achievement.year
      })).filter(achievement => achievement.title.trim()),
      // Also keep the structured formats for other use
      certificationsDetailed: certifications,
      achievementsDetailed: achievements
    };
    
    updateResumeData(finalData);
    
    // Auto-save resume data if user is authenticated
    if (isAuthenticated) {
      try {
        const resumeText = resumeService.structuredDataToText(finalData);
        const title = `Resume - ${finalData.personalInfo?.name || 'Generated'} - ${new Date().toLocaleDateString()}`;
        
        const saveResult = await resumeService.saveResume(resumeText, title);
        if (saveResult.success) {
          toast.success('Data saved successfully');
        } else {
          console.warn('Auto-save failed:', saveResult.error);
          toast.error('Failed to save');
        }
      } catch (error) {
        console.warn('Auto-save error:', error);
        toast.error('Failed to save');
      }
    } else {
      toast.success('Data saved successfully');
    }
    
    // Navigate to the correct template based on templateId
    let templateRoute = `/template${templateId}`;
    
    // Handle special cases where template routes don't follow the pattern
    if (templateId === 6 || templateId === 7 || templateId === 9 || templateId === 10 || templateId === 12) {
      // These templates might not exist or have different routes
      templateRoute = '/template1'; // fallback to template1
    }
    
    navigate(templateRoute, { 
      state: { resumeData: finalData, autoSaved: isAuthenticated } 
    });
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
          Back
        </motion.button>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-teal-400 font-semibold">Additional Details</span>
            <span className="text-gray-400 text-sm">Step 6 of 6</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div className="bg-gradient-to-r from-teal-500 to-orange-500 h-2 rounded-full" style={{ width: '100%' }}></div>
          </div>
        </div>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-teal-400 to-orange-400 bg-clip-text text-transparent">
            Additional Details
          </h1>
          <p className="text-gray-300">
            Add your certifications and achievements
          </p>
        </motion.div>

        {/* Certifications Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-lg border border-gray-600 rounded-3xl p-8 mb-8"
        >
          <h2 className="text-2xl font-bold text-white mb-6">Certifications</h2>
          <div className="space-y-6">
            {certifications.map((cert, index) => (
              <div key={cert.id} className="border border-gray-600 rounded-xl p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-white">Certification {index + 1}</h3>
                  {certifications.length > 1 && (
                    <button
                      onClick={() => removeCertification(cert.id)}
                      className="text-red-400 hover:text-red-300 transition-colors duration-300"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  )}
                </div>
                <div className="grid md:grid-cols-3 gap-4">
                  <input
                    type="text"
                    value={cert.name}
                    onChange={(e) => handleCertificationChange(cert.id, 'name', e.target.value)}
                    className="px-4 py-3 rounded-xl bg-gray-700 border border-gray-600 text-white focus:border-teal-400 focus:outline-none transition-all duration-300"
                    placeholder="Certification Name"
                  />
                  <input
                    type="text"
                    value={cert.issuer}
                    onChange={(e) => handleCertificationChange(cert.id, 'issuer', e.target.value)}
                    className="px-4 py-3 rounded-xl bg-gray-700 border border-gray-600 text-white focus:border-teal-400 focus:outline-none transition-all duration-300"
                    placeholder="Issuing Organization"
                  />
                  <input
                    type="text"
                    value={cert.year}
                    onChange={(e) => handleCertificationChange(cert.id, 'year', e.target.value)}
                    className="px-4 py-3 rounded-xl bg-gray-700 border border-gray-600 text-white focus:border-teal-400 focus:outline-none transition-all duration-300"
                    placeholder="Year"
                  />
                </div>
              </div>
            ))}
          </div>
          <button
            onClick={addCertification}
            className="mt-4 px-6 py-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105"
          >
            + Add Certification
          </button>
        </motion.div>

        {/* Achievements Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-lg border border-gray-600 rounded-3xl p-8 mb-8"
        >
          <h2 className="text-2xl font-bold text-white mb-6">Achievements</h2>
          <div className="space-y-6">
            {achievements.map((achievement, index) => (
              <div key={achievement.id} className="border border-gray-600 rounded-xl p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-white">Achievement {index + 1}</h3>
                  {achievements.length > 1 && (
                    <button
                      onClick={() => removeAchievement(achievement.id)}
                      className="text-red-400 hover:text-red-300 transition-colors duration-300"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  )}
                </div>
                <div className="grid gap-4">
                  <input
                    type="text"
                    value={achievement.title}
                    onChange={(e) => handleAchievementChange(achievement.id, 'title', e.target.value)}
                    className="px-4 py-3 rounded-xl bg-gray-700 border border-gray-600 text-white focus:border-teal-400 focus:outline-none transition-all duration-300"
                    placeholder="Achievement Title"
                  />
                  <div className="grid md:grid-cols-2 gap-4">
                    <textarea
                      value={achievement.description}
                      onChange={(e) => handleAchievementChange(achievement.id, 'description', e.target.value)}
                      className="px-4 py-3 rounded-xl bg-gray-700 border border-gray-600 text-white focus:border-teal-400 focus:outline-none transition-all duration-300 resize-none"
                      placeholder="Description of achievement"
                      rows="3"
                    />
                    <input
                      type="text"
                      value={achievement.year}
                      onChange={(e) => handleAchievementChange(achievement.id, 'year', e.target.value)}
                      className="px-4 py-3 rounded-xl bg-gray-700 border border-gray-600 text-white focus:border-teal-400 focus:outline-none transition-all duration-300"
                      placeholder="Year"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
          <button
            onClick={addAchievement}
            className="mt-4 px-6 py-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105"
          >
            + Add Achievement
          </button>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="flex flex-wrap gap-4 justify-center"
        >
          <button
            onClick={handleFinish}
            className="px-12 py-3 bg-gradient-to-r from-teal-500 to-orange-500 hover:from-teal-600 hover:to-orange-600 text-white font-bold rounded-xl transition-all duration-300 transform hover:scale-105 shadow-xl text-lg"
          >
            Finish & Generate Resume
          </button>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default OtherDetails;
