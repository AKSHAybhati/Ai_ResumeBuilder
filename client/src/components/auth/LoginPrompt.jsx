import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const LoginPrompt = ({ onClose }) => {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate('/login'); // Assuming you have a login route
  };

  const handleSignup = () => {
    navigate('/signup'); // Assuming you have a signup route
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl"
      >
        <div className="text-center">
          <div className="mb-6">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Authentication Required
            </h2>
            <p className="text-gray-600 mb-6">
              Please log in or create an account to access resume templates and save your progress.
            </p>
          </div>

          <div className="space-y-3">
            <button
              onClick={handleLogin}
              className="w-full px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              Log In
            </button>
            
            <button
              onClick={handleSignup}
              className="w-full px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              Create Account
            </button>

            <button
              onClick={onClose}
              className="w-full px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold rounded-xl transition-all duration-300"
            >
              Continue as Guest (Limited Features)
            </button>
          </div>

          <div className="mt-6 text-sm text-gray-500">
            <p>With an account, you can:</p>
            <ul className="mt-2 space-y-1 text-left">
              <li>• Save your resume data permanently</li>
              <li>• Access all premium templates</li>
              <li>• Edit and update anytime</li>
              <li>• Download in multiple formats</li>
            </ul>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPrompt;