import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import WithoutAiTemp from "../components/templateCard/TemplateCard.jsx";

const WithoutAi = () => {
  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleBackClick = () => {
    window.history.back();
  };

  // Profile image URL
  const profileImage =
    'https://miro.medium.com/v2/resize:fit:4800/format:webp/1*mAIfR-lj6YkUEI7AaP6CGg.jpeg';

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
        transition={{ duration: 0.6, ease: 'easeInOut' }}
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
              Captivate employers with stunning, professional resumes that showcase your unique talents.
              Stand out from the crowd with our AI-powered templates and expert guidance.
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
                <div className="text-sm text-gray-400">Professional Templates</div>
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

            <motion.button
              className="text-white px-10 py-4 rounded-2xl text-lg font-semibold shadow-2xl relative overflow-hidden group bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 transition-all duration-300"
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
            >
              <span className="relative flex items-center justify-center">
                🚀 Start Building Now
                <svg
                  className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  ></path>
                </svg>
              </span>
            </motion.button>
          </div>
        </motion.div>

        {/* Template Selection Section */}
        <motion.div
          className="mt-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
        >

          <WithoutAiTemp />
        </motion.div>
      </motion.div>
    </div>
  );
};

export default WithoutAi;