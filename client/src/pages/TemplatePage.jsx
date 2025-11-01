import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import WithoutAiTemp from "../components/templateCard/TemplateCard.jsx";
import { v4 as uuidv4 } from "uuid";
import resumeService from "../services/resumeService";
import Navbar from "../components/Navbar/Navbar.jsx";

const TemplatePage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [prefilledData, setPrefilledData] = useState(null);
  const [resumeData, setResumeData] = useState({});

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);

    // Check if we have prefilled data from a saved resume
    if (location.state?.prefilledData) {
      setPrefilledData(location.state.prefilledData);
      setResumeData(location.state.prefilledData);
    }
  }, [location.state]);

  // This function should be called by your template component when data changes
  const handleResumeDataChange = (data) => {
    setResumeData(data);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        {/* Header */}
        <motion.div
          className="text-center mb-8 sm:mb-10 lg:mb-12 px-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
            Choose Your Template
          </h1>
          <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
            Select from our collection of professional resume templates
          </p>
        </motion.div>

        {/* Template Selection Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <WithoutAiTemp
            prefilledData={prefilledData}
            resumeText={location.state?.resumeText}
            onResumeDataChange={handleResumeDataChange}
          />
        </motion.div>
      </div>
    </div>
  );
};

export default TemplatePage;