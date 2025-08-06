import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '../components/Navbar/Navbar.jsx';
import { useNavigate } from 'react-router-dom';

function Trytemp() {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/template'); // this must match the path you defined
  };

  return (
    <button onClick={handleClick}>Go to Template Page</button>
  );
}

const animatedGradientStyle = `
  @keyframes gradient {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }

  @keyframes shine {
    0% { left: -100%; }
    100% { left: 100%; }
  }

  .btn-shine {
    position: relative;
    overflow: hidden;
  }

  .btn-shine::after {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 50%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
    animation: shine 3s infinite;
  }

  @keyframes blob {
    0% {
      transform: translate(0px, 0px) scale(1);
    }
    33% {
      transform: translate(30px, -50px) scale(1.1);
    }
    66% {
      transform: translate(-20px, 20px) scale(0.9);
    }
    100% {
      transform: translate(0px, 0px) scale(1);
    }
  }

  .animate-blob {
    animation: blob 7s infinite;
  }

  .animation-delay-2000 {
    animation-delay: 2s;
  }

  .animation-delay-4000 {
    animation-delay: 4s;
  }

  .text-shadow {
    text-shadow: none;
  }

  .glass-effect {
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.2);
  }

  .gradient-text {
    background: linear-gradient(45deg, #FF7000, #00A090);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .text-gradient-animate {
    background: linear-gradient(-45deg, #00bda6, #ff6d34, #00c07a, #ff8c00);
    background-size: 400% 400%;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    animation: gradient 4s ease infinite;
  }
`;


const App = () => {
  const navigate = useNavigate(); // Add this hook at the top level

  useEffect(() => {
    const styleEl = document.createElement('style');
    styleEl.innerHTML = animatedGradientStyle;
    document.head.appendChild(styleEl);
    return () => {
      document.head.removeChild(styleEl);
    };
  }, []);

  const [activeTab, setActiveTab] = useState('home');
  const [isLoaded, setIsLoaded] = useState(false);

  const navItems = useMemo(
    () => [
      { id: 'home', label: 'Home' },
      { id: 'features', label: 'Features' },
      { id: 'how-it-works', label: 'How It Works' },
    ],
    []
  );

  const features = useMemo(
    () => [
      {
        title: 'AI-Powered Content',
        description:
          'Our tool uses advanced AI to generate professional resumes with tailored skills and achievements for your industry.',
        icon: (
          <svg
            className="w-16 h-16 text-white mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            strokeWidth={2.5}
            style={{ filter: 'drop-shadow(0px 2px 2px rgba(0,0,0,0.2))' }}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
            />
          </svg>
        ),
      },
      {
        title: 'ATS-Optimized Templates',
        description:
          'Our templates are designed to pass through Applicant Tracking Systems with ease, increasing your interview chances.',
        icon: (
          <svg
            className="w-16 h-16 text-white mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            strokeWidth={2.5}
            style={{ filter: 'drop-shadow(0px 2px 2px rgba(0,0,0,0.2))' }}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
        ),
      },
      {
        title: 'Real-Time Feedback',
        description:
          'Get instant suggestions and improvements as you build your resume to maximize its impact on recruiters.',
        icon: (
          <svg
            className="w-16 h-16 text-white mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            strokeWidth={2.5}
            style={{ filter: 'drop-shadow(0px 2px 2px rgba(0,0,0,0.2))' }}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
            />
          </svg>
        ),
      },
    ],
    []
  );

  const steps = useMemo(
    () => [
      {
        step: '1',
        title: 'Enter Your Information',
        description: 'Choose your favorite template and start editing',
      },
      {
        step: '2',
        title: 'AI Enhancement',
        description:
          'Our AI enhances your content with powerful, professional phrasing.',
      },
      {
        step: '3',
        title: 'Download & Apply',
        description: 'Export your polished resume and apply with confidence.',
      },
    ],
    []
  );

  const testimonials = useMemo(
    () => [
      {
        quote:
          "UptoSkills' AI Resume Builder helped me land interviews at top tech companies. The ATS optimization really works!",
        author: 'Rakesh Dubey',
        role: 'Software Engineer at Amazon',
      },
      {
        quote:
          "As a recent graduate, this tool helped me showcase skills I didn't even realize I had. Got 3 job offers in a month!",
        author: 'Priya Sharma',
        role: 'Digital Marketing Specialist',
      },
      {
        quote:
          'The AI suggestions transformed my boring resume into something that truly represents my professional journey.',
        author: 'Aditya Tiwary',
        role: 'Project Manager',
      },
    ],
    []
  );

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 1.2, staggerChildren: 0.4 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 60 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 1, ease: [0.2, 0.65, 0.3, 0.9] },
    },
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 100 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 1.1, ease: [0.2, 0.65, 0.3, 0.9] },
    },
  };

  // Updated navigation function
  const handleGetStarted = useCallback(() => {
    navigate('/templatepage'); // Navigate to template page
  }, [navigate]);

  const handleNavClick = useCallback((id) => {
    setActiveTab(id);
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  useEffect(() => {
    setIsLoaded(true);
  }, []);


  return (
    <div
      className="min-h-screen font-sans overflow-x-hidden"
      style={{
        background: 'linear-gradient(135deg, #1a1a1a, #2d2d2d, #1a1a1a)',
        backgroundSize: '100% 100%',
      }}
    >
      <Navbar />
      <main className="container mx-auto px-4 py-8">


        <AnimatePresence>
          {isLoaded && (
            <motion.section
              id="home"
              className="py-12 md:py-16 px-4 relative min-h-screen flex items-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1 }}
            >
              {/* Simple background elements */}
              <div className="absolute top-0 right-0 w-96 h-96 bg-teal-500 rounded-full opacity-20 blur-3xl"></div>
              <div className="absolute bottom-20 left-10 w-72 h-72 bg-orange-500 rounded-full opacity-20 blur-3xl"></div>

              <div className="flex flex-col md:flex-row items-center relative z-10 w-full">
                <motion.div
                  className="w-full md:w-1/2 mb-10 md:mb-0 md:pr-12 px-4"
                  initial={{ opacity: 0, x: -80 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 1.1, delay: 0.2 }}
                >
                  <motion.div
                    className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-2 px-6 py-4 sm:px-8 sm:py-5 bg-gradient-to-r from-teal-500 to-orange-500 text-white rounded-full text-xl font-bold mb-8 shadow-2xl mt-4 w-auto max-w-full overflow-hidden glass-effect"
                    initial={{ opacity: 0, y: 40, scale: 0.8 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.8, delay: 0.5, type: "spring", stiffness: 100 }}
                    whileHover={{ scale: 1.02, y: -2 }}
                  >
                    <img
                      src="http://uptoskills.com/wp-content/uploads/2023/04/hd-logo-iguru.png"
                      alt="UptoSkills Logo"
                      className="h-10 sm:h-12 md:h-14 flex-shrink-0"
                    />
                    <span className="text-xl sm:text-2xl md:text-3xl tracking-wider font-extrabold text-white mt-2 sm:mt-0 sm:ml-2 text-center sm:text-left">
                      AI RESUME BUILDER
                    </span>
                  </motion.div>
                  <motion.h1
                    className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight"
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 0.6 }}
                  >
                    <span className="text-gradient-animate">
                      Transform Your Career With{' '}
                    </span>
                    <span className="text-gradient-animate">
                      AI-Powered Resumes
                    </span>
                  </motion.h1>
                  <motion.p
                    className="text-base sm:text-lg md:text-xl text-gray-300 mb-8 leading-relaxed"
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.9, delay: 0.7 }}
                  >
                    Build ATS-optimized resumes with our AI-powered tools and
                    get noticed by top recruiters instantly.
                  </motion.p>
                  <motion.div
  className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4"
  initial={{ opacity: 0, y: 40 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.9, delay: 0.8 }}
>
  <button
    onClick={handleGetStarted}
    className="w-full sm:w-auto px-6 py-4 text-white font-bold rounded-xl hover:shadow-2xl transition-all duration-500 text-center text-base sm:text-lg transform hover:-translate-y-1 hover:scale-105 shadow-md btn-shine relative overflow-hidden"
    style={{
      background: 'linear-gradient(to right, #ff6a00, #ff8c00)',
      backgroundSize: '200% 200%',
      animation: 'gradient 5s ease infinite',
      border: '1px solid #ff7000',
      boxShadow: '0 10px 25px -5px rgba(255, 112, 0, 0.6)',
    }}
  >
    Build Your Resume
  </button>
  
  <button
    onClick={() => navigate('/ai-edit')}
    className="w-full sm:w-auto px-6 py-4 bg-gradient-to-r from-green-400 via-green-500 to-green-700 text-white font-bold rounded-xl border border-green-600 hover:shadow-2xl transition-all duration-500 text-center text-base sm:text-lg transform hover:-translate-y-1 hover:scale-105 shadow-md btn-shine relative overflow-hidden"
    aria-label="AI Edit Resume"
    style={{
      backgroundSize: '200% 200%',
      animation: 'gradient 5s ease infinite',
      border: '1px solid rgba(255,255,255,0.2)',
      boxShadow: '0 10px 25px -5px rgba(16, 185, 129, 0.5)',
    }}
  >
    AI Edit
  </button>
</motion.div>
                  <motion.div
                    className="mt-8 flex items-center space-x-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.9, delay: 1 }}
                  >
                    <div className="flex -space-x-4">
                      {[
                        'https://randomuser.me/api/portraits/women/44.jpg',
                        'https://randomuser.me/api/portraits/men/86.jpg',
                        'https://randomuser.me/api/portraits/women/63.jpg',
                        'https://randomuser.me/api/portraits/men/22.jpg',
                      ].map((avatar, i) => (
                        <motion.div
                          key={i}
                          className="w-12 h-12 rounded-full border-2 border-white shadow-lg overflow-hidden relative"
                          initial={{ x: -20, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          transition={{ delay: 1 + i * 0.1, duration: 0.6 }}
                          whileHover={{ y: -3, scale: 1.05 }}
                        >
                          <div className="absolute inset-0 bg-gradient-to-br from-teal-500 to-orange-500 opacity-60 mix-blend-overlay" />
                          <img
                            src={avatar}
                            alt={`Professional ${i + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </motion.div>
                      ))}
                    </div>
                    <span className="text-gray-400 font-medium">
                      Trusted by 10,000+ professionals
                    </span>
                  </motion.div>
                </motion.div>
                <motion.div
                  className="md:w-1/2"
                  initial={{ opacity: 0, x: 80 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 1.1, delay: 0.5 }}
                >
                  <div className="relative">
                    <div className="absolute -top-8 -left-8 w-40 h-40 bg-teal-100 rounded-full z-0 blur-xl" />
                    <div className="absolute -bottom-8 -right-8 w-48 h-48 bg-orange-100 rounded-full z-0 blur-xl" />
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-full bg-gradient-to-r from-teal-400 to-orange-400 rounded-2xl opacity-20 blur-xl"></div>
                    <motion.div
                      className="relative z-10"
                      whileHover={{ scale: 1.02 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="relative">
                        <div className="absolute -inset-4 bg-gradient-to-r from-teal-400 to-orange-400 rounded-3xl opacity-30 blur-xl"></div>
                        <video
                          className="rounded-2xl shadow-2xl relative z-10 border-4 border-white transform rotate-1 w-full"
                          autoPlay
                          loop
                          muted
                          playsInline
                        >
                          <source
                            src="https://www.visualcv.com/static/2f2be8a76716380983b890822917b386/AI_resume_builder_hero.mp4"
                            type="video/mp4"
                          />
                          Your browser does not support the video tag.
                        </video>
                      </div>
                    </motion.div>
                    <div
                      className="absolute -bottom-6 -right-6 bg-white p-5 rounded-xl shadow-xl z-20 transform rotate-3 glass-effect"
                    >
                      <div className="flex items-center space-x-3">
                        <svg
                          className="w-6 h-6 text-green-500"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <span className="text-base font-medium">
                          ATS-Optimized
                        </span>
                      </div>
                    </div>
                    <div
                      className="absolute -top-6 -left-6 bg-white p-5 rounded-xl shadow-xl z-20 transform -rotate-3 glass-effect"
                    >
                      <div className="flex items-center space-x-3">
                        <svg
                          className="w-6 h-6 text-orange-500"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                        </svg>
                        <span className="text-base font-medium">
                          AI Powered
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.section>
          )}
        </AnimatePresence>

        <motion.section
          id="features"
          className="py-28 my-20 relative overflow-hidden"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          <div
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(135deg, #00bda6 0%, #008B82 100%)',
              opacity: 0.98,
            }}
          />
          <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full opacity-30 blur-3xl" style={{ backgroundColor: '#00C07A' }}></div>
          <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full opacity-30 blur-3xl" style={{ backgroundColor: '#00B88A' }}></div>
          <div className="text-center mb-20 relative z-10">
            <motion.div
              variants={itemVariants}
              className="inline-block px-6 py-2 bg-white text-teal-600 rounded-full text-sm font-bold mb-6 shadow-xl transform hover:scale-105 transition-transform"
              style={{ boxShadow: '0 4px 15px rgba(0,0,0,0.15)' }}
            >
              SKILLS FOR LIFETIME!
            </motion.div>
            <motion.h2
              variants={itemVariants}
              className="text-5xl sm:text-6xl md:text-7xl font-bold mb-8 flex items-center justify-center flex-wrap text-white"
            >
              <span className="text-white mr-2">India's No. 1 </span>
              <img
                src="http://uptoskills.com/wp-content/uploads/2023/04/hd-logo-iguru.png"
                alt="UptoSkills Logo"
                className="h-14 sm:h-16 inline-block mx-2"
              />
              <span className="text-white ml-2">Skill Tech Organization!</span>
            </motion.h2>
            <motion.p
              variants={itemVariants}
              className="text-xl sm:text-2xl text-white max-w-3xl mx-auto font-medium"
              style={{ textShadow: '0px 1px 2px rgba(0,0,0,0.3)' }}
            >
              Empowering Your Career with uptoskills: Free Training for a Brighter Future.
            </motion.p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 md:gap-10 px-4 relative z-10">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="bg-gradient-to-br from-teal-600 to-teal-500 p-6 md:p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-4 border border-teal-400/50 backdrop-blur-lg overflow-hidden relative"
                style={{ boxShadow: '0 10px 30px -5px rgba(0,0,0,0.2)' }}
                whileHover={{ scale: 1.05 }}
              >

                <div className="flex flex-col items-center text-center relative z-10">
                  <div className="relative mb-8">
                    <div className="bg-teal-600 p-5 rounded-xl shadow-lg relative overflow-hidden border border-teal-400/50">
                      <div className="w-14 h-14 flex items-center justify-center relative z-10">
                        {React.cloneElement(feature.icon, {
                          className: 'w-12 h-12 text-white drop-shadow-lg',
                        })}
                      </div>
                    </div>
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-bold text-white mb-5 drop-shadow-md">
                    {feature.title}
                  </h3>
                  <p className="text-orange-50 text-base sm:text-lg leading-relaxed">
                    {feature.description}
                  </p>
                  <div className="w-24 h-1.5 bg-teal-300 rounded-full mt-8 shadow-lg"></div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        <motion.section
          id="how-it-works"
          className="py-16 sm:py-20 md:py-28 px-4 relative overflow-hidden"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          <div
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(135deg, #2ecc71 0%, #27ae60 100%)',
              opacity: 0.98,
            }}
          />
          <motion.div
            className="absolute -top-40 -right-40 w-96 h-96 rounded-full opacity-70 blur-3xl"
            style={{ backgroundColor: '#00C07A' }}
            animate={{
              scale: [1, 1.4, 1.2, 1],
              x: [0, 30, 10, 0],
              y: [0, -30, -10, 0],
              rotate: [0, 5, -5, 0],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              repeatType: 'reverse',
              ease: 'easeInOut',
            }}
          />
          <motion.div
            className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full opacity-70 blur-3xl"
            style={{ backgroundColor: '#00B88A' }}
            animate={{
              scale: [1, 1.5, 1.2, 1],
              x: [0, -40, -15, 0],
              y: [0, 40, 15, 0],
              rotate: [0, -5, 5, 0],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              repeatType: 'reverse',
              ease: 'easeInOut',
            }}
          />
          <motion.div
            className="absolute top-1/3 right-1/4 w-72 h-72 rounded-full opacity-60 blur-3xl"
            style={{ backgroundColor: '#00D69A' }}
            animate={{
              scale: [1, 1.3, 0.9, 1],
              x: [0, 20, -20, 0],
              y: [0, -20, 20, 0],
              rotate: [0, 10, -10, 0],
            }}
            transition={{
              duration: 12,
              repeat: Infinity,
              repeatType: 'reverse',
              ease: 'easeInOut',
            }}
          />
          <div className="relative z-10">
            <div className="text-center mb-24">
              <motion.div
                variants={itemVariants}
                className="inline-block px-6 py-2 bg-white text-teal-600 rounded-full text-sm font-bold mb-6 shadow-xl transform hover:scale-105 transition-transform"
                style={{ boxShadow: '0 4px 15px rgba(0,0,0,0.15)' }}
              >
                EFFORTLESS PROCESS
              </motion.div>
              <motion.h2
                variants={itemVariants}
                className="text-4xl sm:text-5xl md:text-6xl font-bold mb-8 text-white"
              >
                Three Simple Steps to{' '}
                <span className="text-white">Success</span>
              </motion.h2>
              <motion.p
                variants={itemVariants}
                className="text-lg sm:text-xl text-white max-w-3xl mx-auto font-medium"
                style={{ textShadow: '0px 1px 2px rgba(0,0,0,0.3)' }}
              >
                Create a professional resume in minutes with our intuitive
                process.
              </motion.p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-5xl mx-auto relative z-10">
              {steps.map((step, index) => (
                <motion.div
                  key={index}
                  className="relative"
                  variants={fadeInUp}
                  custom={index}
                  whileHover={{
                    y: -15,
                    transition: { duration: 0.3 },
                  }}
                >
                  <div className="p-1 rounded-2xl bg-gradient-to-r from-orange-400 to-orange-500">
                    <div className="bg-gradient-to-br from-teal-800 to-teal-900 p-10 rounded-xl shadow-xl relative z-10 h-full backdrop-blur-lg border border-orange-400/20">

                      <div className="flex justify-center mb-10">
                        <div className="bg-gradient-to-r from-orange-500 to-orange-400 text-white w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold shadow-lg transform transition-transform hover:scale-110">
                          {step.step}
                        </div>
                      </div>
                      <h3 className="text-xl sm:text-2xl font-bold text-white mb-6 text-center">
                        {step.title}
                      </h3>
                      <p className="text-white text-base sm:text-lg leading-relaxed text-center">
                        {step.description}
                      </p>
                      <div className="w-24 h-1.5 bg-orange-300 rounded-full mt-8 mx-auto shadow-lg"></div>
                    </div>
                  </div>

                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        <motion.section
          className="py-28 my-20 relative overflow-hidden"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          <div
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(135deg, #FFB347 0%, #FFCC33 100%)',
              backgroundSize: '100% 100%',
              opacity: 0.98,
            }}
          />
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-orange-600 rounded-full opacity-20 blur-3xl"></div>
          <div className="absolute top-1/4 left-1/3 w-80 h-80 bg-cyan-600 rounded-full opacity-15 blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-emerald-600 rounded-full opacity-15 blur-3xl"></div>
          <div className="text-center mb-24 relative z-10">
            <motion.div
              variants={itemVariants}
              className="inline-block px-6 py-2 bg-gradient-to-r from-orange-600 to-orange-400 text-white rounded-full text-sm font-bold mb-5 shadow-lg"
              style={{
                boxShadow: '0 0 20px rgba(255, 106, 0, 0.5)',
              }}
            >
              SUCCESS STORIES
            </motion.div>
            <motion.h2
              variants={itemVariants}
              className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-8"
            >
              Transforming <span className="text-white">Careers</span>
            </motion.h2>
            <motion.p
              variants={itemVariants}
              className="text-lg sm:text-xl text-gray-300 max-w-3xl mx-auto"
            >
              Real stories from professionals who launched their dream careers
              with UptoSkills.
            </motion.p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-4 relative z-10">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="relative bg-gradient-to-br from-teal-800 to-teal-900 p-1 rounded-2xl shadow-xl overflow-hidden"
                whileHover={{ scale: 1.05, y: -10 }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-orange-500 via-cyan-500 to-green-500 opacity-70 blur-sm" />
                <div className="relative bg-gradient-to-br from-teal-900/90 to-cyan-900/90 backdrop-filter backdrop-blur-xl p-6 md:p-8 lg:p-12 rounded-2xl h-full border border-teal-700/30">
                  <div className="flex flex-col h-full">
                    <div className="mb-8">
                      <svg
                        className="w-14 h-14"
                        viewBox="0 0 24 24"
                        style={{
                          fill: 'url(#quoteGradient' + index + ')',
                        }}
                      >
                        <defs>
                          <linearGradient
                            id={'quoteGradient' + index}
                            x1="0%"
                            y1="0%"
                            x2="100%"
                            y2="100%"
                          >
                            <stop offset="0%" stopColor="#FF7E00" />
                            <stop offset="100%" stopColor="#00D5C8" />
                          </linearGradient>
                        </defs>
                        <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                      </svg>
                    </div>
                    <p className="text-white mb-10 flex-grow text-lg sm:text-xl italic font-light leading-relaxed">
                      "{testimonial.quote}"
                    </p>
                    <div className="flex items-center mt-auto">
                      <div className="w-16 h-16 bg-gradient-to-r from-orange-500 via-orange-400 to-cyan-500 rounded-full mr-5 flex items-center justify-center text-white font-bold text-xl shadow-xl ring-2 ring-cyan-400 ring-opacity-30">
                        {testimonial.author.charAt(0)}
                      </div>
                      <div>
                        <p className="font-semibold text-white text-lg sm:text-xl">
                          {testimonial.author}
                        </p>
                        <p className="text-white text-base sm:text-lg font-medium">
                          {testimonial.role}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="absolute -inset-0.5 bg-gradient-to-r from-orange-500 to-cyan-500 rounded-2xl blur opacity-30" />
              </motion.div>
            ))}
          </div>
          <div className="absolute bottom-0 left-0 w-full h-1/2 pointer-events-none">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 1440 320"
              className="opacity-10"
            >
              <path
                fill="#ff7e00"
                fillOpacity="0.3"
                d="M0,288L60,266.7C120,245,240,203,360,197.3C480,192,600,224,720,229.3C840,235,960,213,1080,213.3C1200,213,1320,235,1380,245.3L1440,256L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z"
              ></path>
            </svg>
          </div>
        </motion.section>

        <motion.section
          className="py-16 sm:py-20 md:py-36 my-12 md:my-16 relative overflow-hidden rounded-3xl mx-4 shadow-2xl"
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
        >
          <div
            className="absolute inset-0 transform -skew-y-4"
            style={{
              background:
                'linear-gradient(to right, #ff7000, #ff4500, #ff8c00, #ff5e00)',
              backgroundSize: '300% 100%',
              animation: 'gradient 8s ease infinite',
            }}
          />
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-0 left-0 w-96 h-96 bg-orange-700 rounded-full mix-blend-multiply filter blur-3xl opacity-30"></div>
            <div className="absolute top-0 right-0 w-96 h-96 bg-orange-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30"></div>
            <div className="absolute bottom-0 left-1/3 w-96 h-96 bg-orange-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30"></div>
          </div>
          <div className="relative z-10 text-center max-w-4xl mx-auto px-4">
            <motion.h2
              className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-8 leading-tight"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              Ready to Land Your{' '}
              <span className="italic text-white">Dream Job</span>?
            </motion.h2>
            <motion.p
              className="text-lg sm:text-xl md:text-2xl text-orange-100 mb-12 leading-relaxed"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.1 }}
            >
              Join thousands who transformed their careers with UptoSkills'
              AI-powered resume builder.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <button
                onClick={() => navigate('/templatepage')} // Changed from navigateTo to navigate
                className="px-12 py-6 text-white font-bold rounded-xl hover:shadow-2xl transition-all duration-500 text-center text-lg sm:text-xl transform hover:-translate-y-1 hover:scale-105 shadow-xl btn-shine relative overflow-hidden"
                aria-label="Build Resume Now"
                style={{
                  background: '#ff6d34',
                  backgroundSize: '200% 200%',
                  border: '1px solid rgba(255,255,255,0.2)',
                  boxShadow: '0 10px 25px -5px rgba(255, 109, 52, 0.6)',
                }}
              >
                Build Your Resume Now
              </button>
            </motion.div>

            <motion.p
              className="mt-8 text-white text-base sm:text-lg"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              Free templates available
            </motion.p>
          </div>
        </motion.section>
      </main>
    </div>
  );
};

export default App;