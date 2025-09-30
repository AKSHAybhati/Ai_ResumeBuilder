import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import WithoutAiTemp from "../components/templateCard/TemplateCard.jsx";
import { v4 as uuidv4 } from "uuid";
import resumeService from "../services/resumeService"; // <-- ADD THIS IMPORT

const WithoutAi = () => {
  const location = useLocation();
  const [prefilledData, setPrefilledData] = useState(null);
  const [showNamePrompt, setShowNamePrompt] = useState(false);
  const [resumeName, setResumeName] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  // Add this state to collect the latest resume data from the template component
  const [resumeData, setResumeData] = useState({});

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);

    // Check if we have prefilled data from a saved resume
    if (location.state?.prefilledData) {
      setPrefilledData(location.state.prefilledData);
      setResumeData(location.state.prefilledData); // <-- Set initial resume data
      toast.success(`Using data from "${location.state.prefilledData.title}"`);
    }
  }, [location.state]);

  // This function should be called by your template component (WithoutAiTemp) when data changes
  const handleResumeDataChange = (data) => {
    setResumeData(data);
  };

  const handleBackClick = () => {
    window.history.back();
  };

  const handleSaveToMyResumes = () => {
    setShowNamePrompt(true);
  };

  const handleConfirmSave = async () => {
    if (!resumeName.trim()) return;
    setIsSaving(true);
    try {
      const resumeId = uuidv4();
      // Try to get templateId from location or fallback to 11
      const templateId =
        location.state?.templateId || resumeData?.templateId || 11;

      // Prepare resume data for saving
      const dataToSave = {
        ...resumeData,
        id: resumeId,
        title: resumeName,
        templateId,
      };

      // Save to backend (this should save to the Resume table)
      const result = await resumeService.saveResumeData(dataToSave, resumeName);

      if (result && result.success) {
        toast.success("Resume saved to My Resumes!");
        setShowNamePrompt(false);
      } else {
        toast.error(result?.error || "Failed to save resume");
      }
    } catch (err) {
      toast.error("Failed to save resume");
    } finally {
      setIsSaving(false);
    }
  };

  // Profile image URL
  const profileImage =
    "https://i.pinimg.com/1200x/60/94/eb/6094eb49674113107a923e96441065c0.jpg";

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-4 py-12 md:p-12 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-72 h-72 bg-teal-500 rounded-full opacity-10 blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-orange-500 rounded-full opacity-10 blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-teal-400 rounded-full opacity-5 blur-3xl"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
        className="max-w-6xl mx-auto relative z-10"
      >
        {/* Back Button */}
        <motion.button
          onClick={handleBackClick}
          className="mb-8 flex items-center text-white hover:text-teal-100 transition-all duration-300 ease-in-out focus:outline-none p-4 rounded-2xl shadow-xl bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 backdrop-blur-lg border border-teal-400/30"
          aria-label="Go back"
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.95 }}
        >
          <svg
            className="w-6 h-6 mr-3"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M15 19l-7-7 7-7"
            />
          </svg>
          <span className="font-semibold">Back to Home</span>
        </motion.button>

        {/* Hero Section */}
        <motion.div
          className="bg-gray-800/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 md:p-16 flex flex-col md:flex-row items-center md:items-start gap-12 relative overflow-hidden border border-gray-700/50"
          whileHover={{ scale: 1.01 }}
          transition={{ duration: 0.3 }}
        >
          {/* Decorative elements */}
          <div className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br from-teal-400 to-orange-500 opacity-20 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-gradient-to-br from-orange-500 to-teal-400 opacity-20 rounded-full blur-3xl"></div>

          {/* Profile Image Section */}
          <motion.div
            className="flex-shrink-0 mb-8 md:mb-0 relative"
            whileHover={{ scale: 1.03 }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-teal-400 to-orange-500 rounded-full blur-xl opacity-30 scale-125"></div>
            <div className="relative">
              <img
                src={profileImage}
                alt="User Avatar"
                className="w-48 h-48 md:w-64 md:h-64 rounded-full object-cover shadow-2xl relative z-10 border-4 border-gray-700"
              />
              <div className="absolute inset-0 rounded-full border-4 border-gradient-to-r from-teal-400 to-orange-500 opacity-30"></div>
            </div>
          </motion.div>

          {/* Content Section */}
          <div className="text-center md:text-left z-10 flex-1">
            <motion.div
              className="inline-block px-6 py-2 bg-gradient-to-r from-teal-500 to-orange-500 text-white rounded-full text-sm font-bold mb-6 shadow-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.6 }}
            >
              ✨ AI-Powered Resume Builder
            </motion.div>

            <motion.h1
              className="text-4xl md:text-6xl font-extrabold mb-6 tracking-tight leading-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              <span className="bg-gradient-to-r from-teal-400 via-teal-300 to-orange-400 bg-clip-text text-transparent">
                Design Your Dream
              </span>
              <br />
              <span className="bg-gradient-to-r from-orange-400 via-orange-300 to-teal-400 bg-clip-text text-transparent">
                Resume Today
              </span>
            </motion.h1>

            <motion.p
              className="text-lg md:text-xl text-gray-300 mb-8 max-w-2xl mx-auto md:mx-0 leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              Captivate employers with stunning, professional resumes that
              showcase your unique talents. Stand out from the crowd with our
              AI-powered templates and expert guidance.
            </motion.p>

            {/* Stats Section */}
            <motion.div
              className="flex flex-wrap justify-center md:justify-start gap-6 mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              <div className="text-center">
                <div className="text-2xl font-bold text-teal-400">50+</div>
                <div className="text-sm text-gray-400">
                  Professional Templates
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-400">10K+</div>
                <div className="text-sm text-gray-400">Happy Users</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-teal-400">95%</div>
                <div className="text-sm text-gray-400">Success Rate</div>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Template Selection Section */}
        <motion.div
          className="mt-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
        >
          {/* Pass the handler to your template component */}
          <WithoutAiTemp
            prefilledData={prefilledData}
            resumeText={location.state?.resumeText}
            onResumeDataChange={handleResumeDataChange}
          />
        </motion.div>
      </motion.div>

      {/* Save Resume Name Prompt */}
      {showNamePrompt && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white p-6 rounded shadow-lg">
            <h2 className="mb-2 font-semibold">Enter Resume Name</h2>
            <input
              type="text"
              className="border px-2 py-1 w-full mb-3"
              placeholder="Resume name"
              value={resumeName}
              onChange={(e) => setResumeName(e.target.value)}
            />
            <div className="flex justify-end space-x-2">
              <button
                className="bg-teal-600 text-white px-4 py-1 rounded"
                onClick={handleConfirmSave}
                disabled={isSaving || !resumeName.trim()}
              >
                {isSaving ? "Saving..." : "Save"}
              </button>
              <button
                className="bg-gray-300 px-4 py-1 rounded"
                onClick={() => setShowNamePrompt(false)}
                disabled={isSaving}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Save Button */}
      <button
        className="fixed left-8 top-32 bg-green-600 text-white px-6 py-2 rounded-lg shadow-lg z-50"
        onClick={handleSaveToMyResumes}
      >
        Save to My Resumes
      </button>
    </div>
  );
};

export default WithoutAi;
