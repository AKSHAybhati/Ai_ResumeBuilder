import { useState, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ResumeContext } from '../../context/ResumeContext';
import { useAuth } from '../../context/AuthContext';
import resumeService from '../../services/resumeService';
import { toast } from 'react-toastify';

const WorkExperience = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { templateId, buildType } = location.state || {};
  const { resumeData, updateResumeData } = useContext(ResumeContext);
  const { isAuthenticated } = useAuth();

  const [experiences, setExperiences] = useState(
    resumeData?.workExperience || [
      {
        id: 1,
        jobTitle: '',
        company: '',
        location: '',
        startDate: '',
        endDate: '',
        isCurrentJob: false,
        description: ''
      }
    ]
  );

  const handleInputChange = (id, field, value) => {
    setExperiences(prev => 
      prev.map(exp => 
        exp.id === id ? { ...exp, [field]: value } : exp
      )
    );
  };

  const addExperience = () => {
    const newId = experiences.length > 0 ? Math.max(...experiences.map(exp => exp.id)) + 1 : 1;
    setExperiences(prev => [
      ...prev,
      {
        id: newId,
        jobTitle: '',
        company: '',
        location: '',
        startDate: '',
        endDate: '',
        isCurrentJob: false,
        description: ''
      }
    ]);
  };

  const removeExperience = (id) => {
    if (experiences.length > 1) {
      setExperiences(prev => prev.filter(exp => exp.id !== id));
    }
  };

  const handleNext = () => {
    const updatedData = {
      ...resumeData,
      // Map work experience to the format expected by templates
      experience: experiences.map(exp => ({
        title: exp.jobTitle,
        companyName: exp.company,
        date: exp.isCurrentJob ? `${exp.startDate} - Present` : `${exp.startDate} - ${exp.endDate}`,
        companyLocation: exp.location,
        accomplishment: exp.description ? exp.description.split('\n').filter(line => line.trim()) : []
      })),
      // Also keep the structured format for other use
      workExperience: experiences
    };
    
    updateResumeData(updatedData);
    navigate('/details/skills', { 
      state: { templateId, buildType } 
    });
  };

  const handleFinish = async () => {
    const finalData = {
      ...resumeData,
      // Map work experience to the format expected by templates
      experience: experiences.map(exp => ({
        title: exp.jobTitle,
        companyName: exp.company,
        date: exp.isCurrentJob ? `${exp.startDate} - Present` : `${exp.startDate} - ${exp.endDate}`,
        companyLocation: exp.location,
        accomplishment: exp.description ? exp.description.split('\n').filter(line => line.trim()) : []
      })),
      // Also keep the structured format for other use
      workExperience: experiences
    };
    
    try {
      // Update context
      updateResumeData(finalData);
      
      // Auto-save to database if user is authenticated
      if (isAuthenticated) {
        const saveResult = await resumeService.saveResumeData(finalData);
        if (saveResult.success) {
          toast.success('Data saved successfully');
        } else {
          console.error('Database save error:', saveResult.error);
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
        state: { resumeData: finalData } 
      });
    } catch (error) {
      console.error('Error during finish:', error);
      // Failed to save work experience - no toast notification
    }
  };

  const handleBackClick = () => {
    navigate('/details/education', { state: { templateId, buildType } });
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
            <span className="text-teal-400 font-semibold">Work Experience</span>
            <span className="text-gray-400 text-sm">Step 3 of 6</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div className="bg-gradient-to-r from-teal-500 to-orange-500 h-2 rounded-full" style={{ width: '50%' }}></div>
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
            Work Experience
          </h1>
          <p className="text-gray-300">
            Add your professional work experience
          </p>
        </motion.div>

        {/* Experiences */}
        <div className="space-y-6 mb-8">
          {experiences.map((experience, index) => (
            <motion.div
              key={experience.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.1, duration: 0.6 }}
              className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-lg border border-gray-600 rounded-3xl p-8"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold text-white">
                  Experience {index + 1}
                </h3>
                {experiences.length > 1 && (
                  <button
                    onClick={() => removeExperience(experience.id)}
                    className="text-red-400 hover:text-red-300 transition-colors duration-300"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                )}
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Job Title */}
                <div>
                  <label className="block text-white font-semibold mb-2">Job Title *</label>
                  <input
                    type="text"
                    value={experience.jobTitle}
                    onChange={(e) => handleInputChange(experience.id, 'jobTitle', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-gray-700 border border-gray-600 text-white focus:border-teal-400 focus:outline-none transition-all duration-300"
                    placeholder="e.g. Software Engineer"
                  />
                </div>

                {/* Company */}
                <div>
                  <label className="block text-white font-semibold mb-2">Company *</label>
                  <input
                    type="text"
                    value={experience.company}
                    onChange={(e) => handleInputChange(experience.id, 'company', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-gray-700 border border-gray-600 text-white focus:border-teal-400 focus:outline-none transition-all duration-300"
                    placeholder="e.g. Google Inc."
                  />
                </div>

                {/* Location */}
                <div>
                  <label className="block text-white font-semibold mb-2">Location</label>
                  <input
                    type="text"
                    value={experience.location}
                    onChange={(e) => handleInputChange(experience.id, 'location', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-gray-700 border border-gray-600 text-white focus:border-teal-400 focus:outline-none transition-all duration-300"
                    placeholder="e.g. New York, NY"
                  />
                </div>

                {/* Start Date */}
                <div>
                  <label className="block text-white font-semibold mb-2">Start Date</label>
                  <input
                    type="month"
                    value={experience.startDate}
                    onChange={(e) => handleInputChange(experience.id, 'startDate', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-gray-700 border border-gray-600 text-white focus:border-teal-400 focus:outline-none transition-all duration-300"
                  />
                </div>

                {/* End Date */}
                <div>
                  <label className="block text-white font-semibold mb-2">End Date</label>
                  <input
                    type="month"
                    value={experience.endDate}
                    onChange={(e) => handleInputChange(experience.id, 'endDate', e.target.value)}
                    disabled={experience.isCurrentJob}
                    className="w-full px-4 py-3 rounded-xl bg-gray-700 border border-gray-600 text-white focus:border-teal-400 focus:outline-none transition-all duration-300 disabled:opacity-50"
                  />
                </div>

                {/* Current Job Checkbox */}
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={experience.isCurrentJob}
                    onChange={(e) => handleInputChange(experience.id, 'isCurrentJob', e.target.checked)}
                    className="w-5 h-5 text-teal-500 bg-gray-700 border-gray-600 rounded focus:ring-teal-400"
                  />
                  <label className="ml-3 text-white font-semibold">
                    I currently work here
                  </label>
                </div>
              </div>

              {/* Description */}
              <div className="mt-6">
                <label className="block text-white font-semibold mb-2">Job Description</label>
                <textarea
                  value={experience.description}
                  onChange={(e) => handleInputChange(experience.id, 'description', e.target.value)}
                  rows="4"
                  className="w-full px-4 py-3 rounded-xl bg-gray-700 border border-gray-600 text-white focus:border-teal-400 focus:outline-none transition-all duration-300 resize-none"
                  placeholder="Describe your responsibilities and achievements..."
                />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Add Experience Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="text-center mb-8"
        >
          <button
            onClick={addExperience}
            className="px-8 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            + Add Another Experience
          </button>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="flex flex-wrap gap-4 justify-center"
        >
          <button
            onClick={handleNext}
            className="px-8 py-3 bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            Next
          </button>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default WorkExperience;
