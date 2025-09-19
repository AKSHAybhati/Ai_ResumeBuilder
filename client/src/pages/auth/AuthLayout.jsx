import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { animatedGradientStyle } from "./AuthStyles";

const AuthLayout = ({ children }) => {
  // Add style element for animations
  useEffect(() => {
    const styleEl = document.createElement("style");
    styleEl.innerHTML = animatedGradientStyle;
    document.head.appendChild(styleEl);
    return () => {
      document.head.removeChild(styleEl);
    };
  }, []);

  return (
    <div className="min-h-screen bg-white flex overflow-hidden relative">
      {/* Cosmic background */}
      <div className="cosmic-bg"></div>

      {/* Enhanced sparkles */}
      <div className="sparkle sparkle-1"></div>
      <div className="sparkle sparkle-2"></div>
      <div className="sparkle sparkle-3"></div>
      <div className="sparkle sparkle-4"></div>
      <div className="sparkle sparkle-5"></div>
      <div className="sparkle sparkle-6"></div>
      <div className="sparkle sparkle-7"></div>
      <div className="sparkle sparkle-8"></div>
      <div className="sparkle sparkle-9"></div>
      <div className="sparkle sparkle-10"></div>
      <div className="sparkle sparkle-11"></div>
      <div className="sparkle sparkle-12"></div>

      {/* Left side - Logo and branding */}
      <div className="w-1/2 bg-white p-8 flex items-center justify-center relative hidden md:flex">
        <div className="cosmic-bg"></div>

        <motion.div
          className="z-10 text-center"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Logo with enhanced animations */}
          <motion.div className="flex justify-center">
            <motion.div
              className="relative w-52 h-52 flex items-center justify-center mb-6 floating-logo"
              whileHover={{
                scale: 1.1,
                rotate: [0, 5, -5, 0],
                transition: { duration: 0.7 },
              }}
            >
              {/* The logo image with enhanced animation */}
              <motion.img
                src="/UptoSkills_logo.png"
                alt="UpToSkills Logo"
                className="w-52 h-52 object-contain relative z-10"
                animate={{
                  scale: [1, 1.08, 1],
                  rotate: [0, 7, 0, -7, 0],
                  y: [0, -8, 0, 8, 0],
                }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                whileHover={{
                  scale: 1.25,
                  rotate: [0, 15, 0, -15, 0],
                  transition: { duration: 1.2 },
                }}
              />
            </motion.div>
          </motion.div>

          <motion.h2
            className="mt-2 text-center text-4xl font-extrabold text-white"
            style={{
              textShadow: "0 2px 4px rgba(0, 0, 0, 0.3)",
            }}
          >
            Welcome to UpToSkills
          </motion.h2>
          <motion.p
            className="mt-6 text-center text-lg text-white"
            style={{
              textShadow: "0 1px 3px rgba(0, 0, 0, 0.2)",
            }}
          >
            Your journey to excellence starts here
          </motion.p>
        </motion.div>
      </div>

      {/* Right side - Form content */}
      <div className="w-full md:w-1/2 flex flex-col justify-center py-12 sm:px-6 lg:px-8 overflow-hidden relative">
        {children}
      </div>
    </div>
  );
};

export default AuthLayout;