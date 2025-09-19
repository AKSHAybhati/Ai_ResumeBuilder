import { useState, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ResumeContext } from '../../context/ResumeContext';

const Languages = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { templateId, buildType } = location.state || {};
  const { resumeData, updateResumeData } = useContext(ResumeContext);

  const [languages, setLanguages] = useState(
    resumeData?.languages || [
      {
        id: 1,
        language: '',
        proficiency: 'Beginner'
      }
    ]
  );

  const proficiencyLevels = ['Beginner', 'Intermediate', 'Advanced', 'Native'];

  const handleInputChange = (id, field, value) => {
    setLanguages(prev => 
      prev.map(lang => 
        lang.id === id ? { ...lang, [field]: value } : lang
      )
    );
  };

  const addLanguage = () => {
    const newId = languages.length > 0 ? Math.max(...languages.map(lang => lang.id)) + 1 : 1;
    setLanguages(prev => [
      ...prev,
      {
        id: newId,
        language: '',
        proficiency: 'Beginner'
      }
    ]);
  };

  const removeLanguage = (id) => {
    if (languages.length > 1) {
      setLanguages(prev => prev.filter(lang => lang.id !== id));
    }
  };

  const handleNext = () => {
    const updatedData = {
      ...resumeData,
      // Map languages to the format expected by templates (array of strings)
      languages: languages.filter(lang => lang.language.trim()).map(lang => lang.language),
      // Also keep the structured format for other use
      languagesDetailed: languages
    };
    
    updateResumeData(updatedData);
    navigate('/details/other', { 
      state: { templateId, buildType } 
    });
  };

  const handleBackClick = () => {
    navigate('/details/projects', { state: { templateId, buildType } });
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
            <span className="text-teal-400 font-semibold">Languages</span>
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
            Languages
          </h1>
          <p className="text-gray-300">
            Add the languages you speak
          </p>
        </motion.div>

        {/* Languages */}
        <div className="space-y-6 mb-8">
          {languages.map((language, index) => (
            <motion.div
              key={language.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.1, duration: 0.6 }}
              className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-lg border border-gray-600 rounded-3xl p-8"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold text-white">
                  Language {index + 1}
                </h3>
                {languages.length > 1 && (
                  <button
                    onClick={() => removeLanguage(language.id)}
                    className="text-red-400 hover:text-red-300 transition-colors duration-300"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                )}
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Language */}
                <div>
                  <label className="block text-white font-semibold mb-2">Language *</label>
                  <input
                    type="text"
                    value={language.language}
                    onChange={(e) => handleInputChange(language.id, 'language', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-gray-700 border border-gray-600 text-white focus:border-teal-400 focus:outline-none transition-all duration-300"
                    placeholder="e.g. English, Hindi, Spanish"
                  />
                </div>

                {/* Proficiency */}
                <div>
                  <label className="block text-white font-semibold mb-2">Proficiency Level</label>
                  <select
                    value={language.proficiency}
                    onChange={(e) => handleInputChange(language.id, 'proficiency', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-gray-700 border border-gray-600 text-white focus:border-teal-400 focus:outline-none transition-all duration-300"
                  >
                    {proficiencyLevels.map(level => (
                      <option key={level} value={level}>
                        {level}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Add Language Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="text-center mb-8"
        >
          <button
            onClick={addLanguage}
            className="px-8 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            + Add Another Language
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

export default Languages;
