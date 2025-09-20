import { useState, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ResumeContext } from '../../context/ResumeContext';
import { useAuth } from '../../context/AuthContext';
import resumeService from '../../services/resumeService';
import { toast } from 'react-toastify';

const Skills = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { templateId, buildType } = location.state || {};
  const { resumeData, updateResumeData } = useContext(ResumeContext);
  const { isAuthenticated } = useAuth();

  const [skills, setSkills] = useState(
  (resumeData?.skillsDetailed || []).map((s, index) => ({
    id: s.id ?? index + 1,   // always give an id
    ...s
  })) || [
    { id: 1, skill: '' }
  ]
);


  const handleSkillChange = (id, value) => {
    setSkills(prev => 
      prev.map(skill => 
        skill.id === id ? { ...skill, skill: value } : skill
      )
    );
  };

  const addSkill = () => {
    const newId = skills.length > 0 ? Math.max(...skills.map(skill => skill.id)) + 1 : 1;
    setSkills(prev => [...prev, { id: newId, skill: '' }]);
  };

  const removeSkill = (id) => {
    if (skills.length > 1) {
      setSkills(prev => prev.filter(skill => skill.id !== id));
    }
  };

  const handleNext = () => {
    const updatedData = {
      ...resumeData,
      // Map skills to the format expected by templates (array of strings)
      skills: skills.map(skill => skill.skill).filter(skill => skill.trim()),
      // Also keep the structured format for other use
      skillsDetailed: skills
    };
    
    updateResumeData(updatedData);
    navigate('/details/projects', { 
      state: { templateId, buildType } 
    });
  };

  const handleFinish = async () => {
    const finalData = {
      ...resumeData,
      // Map skills to the format expected by templates (array of strings)
      skills: skills.map(skill => skill.skill).filter(skill => skill.trim()),
      // Also keep the structured format for other use
      skillsDetailed: skills
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
      // Failed to save skills - no toast notification
    }
  };

  const handleBackClick = () => {
    navigate('/details/work-experience', { 
      state: { templateId, buildType } 
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
            <span className="text-teal-400 font-semibold">Skills</span>
            <span className="text-gray-400 text-sm">Step 4 of 6</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div className="bg-gradient-to-r from-teal-500 to-orange-500 h-2 rounded-full" style={{ width: '67%' }}></div>
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
            Skills
          </h1>
          <p className="text-gray-300">
            List your technical and professional skills
          </p>
        </motion.div>

        {/* Skills Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-lg border border-gray-600 rounded-3xl p-8 mb-8"
        >
          <h2 className="text-2xl font-bold text-white mb-6">Your Skills</h2>
          <div className="space-y-4">
            {skills.map((skill) => (
              <div key={skill.id} className="flex gap-4">
                <input
                  type="text"
                  value={skill.skill}
                  onChange={(e) => handleSkillChange(skill.id, e.target.value)}
                  className="flex-1 px-4 py-3 rounded-xl bg-gray-700 border border-gray-600 text-white focus:border-teal-400 focus:outline-none transition-all duration-300"
                  placeholder="e.g. JavaScript, React, Node.js, Project Management"
                />
                {skills.length > 1 && (
                  <button
                    onClick={() => removeSkill(skill.id)}
                    className="text-red-400 hover:text-red-300 transition-colors duration-300 p-3"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
            ))}
          </div>
          <button
            onClick={addSkill}
            className="mt-4 px-6 py-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105"
          >
            + Add Skill
          </button>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
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

export default Skills;
