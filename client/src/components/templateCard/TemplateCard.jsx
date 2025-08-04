import React, { useState } from 'react';
import { motion } from 'framer-motion';
import temp1 from '../../assets/images/temp1.png';
import temp2 from '../../assets/images/temp2.png';
import Temp3 from '../../assets/images/Temp3.jpg';
import temp4 from '../../assets/images/temp4.png';
import temp5 from '../../assets/images/temp5.jpg';
import temp6 from '../../assets/images/temp6.png';
import temp7 from '../../assets/images/temp7.png';
import temp8 from '../../assets/images/temp8.jpg';
import temp9 from '../../assets/images/temp9.jpg';


import { useNavigate } from 'react-router-dom';
const WithoutAiTemp = ({ setActiveStep }) => {
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [hoveredTemplate, setHoveredTemplate] = useState(null);

  const templates = [
    {
      id: 1,
      name: 'Radiant Edge',
      preview: temp1, // Use imported image
      description: 'Perfect for modern professionals in tech, analytics, and innovation-driven roles.',
      url: '/template1'
    },
    {
      id: 2,
      name: 'CodeCraft Classic',
      preview: temp2,
      description: 'Ideal for developers and tech professionals seeking a structured and professional format.',
      url: '/template2'
    },
    {
      id: 3,
      name: 'TechSlate Pro',
      preview: Temp3,
      description: 'Tailored for engineers and developers to highlight projects, certifications, and skills with clarity and precision.',
      url: '/template3'
    },
    {
      id: 4,
      name: 'Creative Spark',
      preview: temp4,
      description: 'Best suited for designers, marketers, and creative professionals who want to showcase flair and structure together.',
      url: '/template4'
    },
    {
      id: 5,
      name: 'Structured Precision',
      preview: temp5,
      description: 'Ideal for developers, engineers, and technical experts who value clarity, order, and professional presentation.',
      url: '/template5'
    },
    {
      id: 6,
      name: 'Modern Momentum',
      preview: temp6,
      description: 'Perfect for tech professionals seeking a sleek, impactful, and well-structured presentation of their experience and skills.',
      url: '/resume-template6'
    },
    {
      id: 7,
      name: 'Creative Spectrum',
      preview: temp7,
      description: 'perfect for a graphic designers resume template.',
      url: '/resume-template7'
    },
    {
      id: 8,
      name: 'Executive Edge',
      preview: temp8,
      description: 'Professional two-column layout perfect for management and leadership roles.',
      url: '/resume-template8'
    },
    {
      id: 9,
      name: 'Tech Forward',
      preview: temp9,
      description: 'Modern single-column design with skill tags for tech professionals.',
      url: '/resume-template9'
    },
    {
      id: 10,
      name: 'Classic Professional',
      preview: temp8,
      description: 'Clean traditional layout ideal for corporate and technical roles.',
      url: '/resume-template10'
    },
    {
      id: 11,
      name: 'Professional Executive',
      preview: temp8,
      description: 'Clean, professional layout showcasing marketing expertise and career achievements effectively.',
      url: '/resume-template11'
    },
    {
      id: 12,
      name: 'Strategic Technology Leader',
      preview: temp8,
      description: 'Clean, impactful layout ideal for IT and cybersecurity roles',
      url: '/resume-template12'
    },
    {
      id: 13,
      name: 'Clinical Practice Professional',
      preview: temp8,
      description: 'Detailed, structured layout designed for doctors and medical field experts.',
      url: '/resume-template13'
    },
    {
      id: 14,
      name: 'Laboratory Specialist Resume',
      preview: temp8,
      description: 'Precise, results-driven layout crafted for lab and clinical professionals.',
      url: '/resume-template14'
    },
    {
      id: 15,
      name: 'Finance Analyst Resume',
      preview: temp8,
      description: 'Crisp, professional format tailored for finance, budgeting, and analysis roles',
      url: '/resume-template15'
    },
    {
      id: 16,
      name: 'Fiscal Visionary & Strategic Performance Architect',
      preview: temp8,
      description: 'Crafting financial clarity, accelerating growth, and engineering operational excellence',
      url: '/resume-template16'
    },
    {
      id: 17,
      name: 'Modern Web Developer Resume Template',
      preview: temp8,
      description: 'Interactive resume template with vibrant design and essential developer details.',
      url: '/resume-template17'
    },
    {
      id: 18,
      name: 'Resume Preview',
      preview: temp8,
      description: 'Clean and modern layout tailored for retail sales job seekers.',
      url: '/resume-template18'
    },
    {
      id: 19,
      name: 'Experience Highlight',
      preview: temp8,
      description: 'Showcases impactful achievements in retail sales with measurable success.',
      url: '/resume-template19'
    },
    {
      id: 20,
      name: 'Retail Expert',
      preview: temp8,
      description: 'Dynamic sales professional excelling in service, merchandising, and customer engagement.',
      url: '/resume-template20'
    },
    {
      id: 21,
      name: 'Sales Specialist',
      preview: temp8,
      description: 'Driven retail expert excelling in sales, service, and visual merchandising.',
      url: '/resume-template21'
    },
    {
      id: 22,
      name: 'Legal Intern',
      preview: temp8,
      description: 'Motivated legal intern with strong research, writing, and analytical skills.',
      url: '/resume-template22'
    },
    {
      id: 23,
      name: 'Creative Visionary',
      preview: temp8,
      description: 'Delivers compelling freelance design solutions with innovation, strategy, and style.',
      url: '/resume-template23'
    },
    {
      id: 24,
      name: 'Tech Enthusiast',
      preview: temp8,
      description: 'Innovative computer science graduate passionate about coding and future technologies.',
      url: '/resume-template24'
    },
    {
      id: 25,
      name: 'Code Innovator',
      preview: temp8,
      description: 'Creative software developer specializing in scalable, user-friendly web solutions',
      url: '/resume-template25'
    },
    {
      id: 26,
      name: 'Code Crafter',
      preview: temp8,
      description: 'Dedicated developer skilled in React, CSS, and problem solving.',
      url: '/resume-template26'
    },
    {
      id: 27,
      name: 'Design Visionary',
      preview: temp8,
      description: 'Creative graphic designer with a passion for clean visual storytelling.',
      url: '/resume-template27'
    },
    {
      id: 28,
      name: 'Code Architect',
      preview: temp8,
      description: 'Versatile fullstack developer crafting efficient, scalable, and modern applications.',
      url: '/resume-template28'
    },
    {
      id: 29,
      name: 'UI Crafter',
      preview: temp8,
      description: 'Designs seamless user experiences with clean, responsive, modern web interfaces.',
      url: '/resume-template29'
    },
    {
      id: 30,
      name: ' Career Snapshot',
      preview: temp8,
      description: ' Showcasing skills, projects, and achievements in full stack development.',
      url: '/resume-template30'
    },
    {
      id: 31,
      name: 'Experience Highlights',
      preview: temp8,
      description: ' Demonstrated success in leading teams and optimizing software performance.',
      url: '/resume-template31'
    },
    {
      id: 32,
      name: 'Professional Overview',
      preview: temp8,
      description: 'Showcases expertise in software engineering and impactful development roles',
      url: '/resume-template32'
    },
    {
      id: 33,
      name: '',
      preview: temp8,
      description: '',
      url: '/resume-template33'
    },
    {
      id: 34,
      name: '',
      preview: temp8,
      description: '',
      url: '/resume-template34'
    },
    {
      id: 35,
      name: '',
      preview: temp8,
      description: '',
      url: '/resume-template35'
    },
    {
      id: 36,
      name: '',
      preview: temp8,
      description: '',
      url: '/resume-template36'
    },
    {
      id: 37,
      name: '',
      preview: temp8,
      description: '',
      url: '/resume-template37'
    },
    {
      id: 38,
      name: '',
      preview: temp8,
      description: '',
      url: '/resume-template38'
    },
    {
      id: 39,
      name: '',
      preview: temp8,
      description: '',
      url: '/resume-template39'
    },
    {
      id: 40,
      name: 'Design Innovator',
      preview: temp8,
      description: 'Vibrant layout for graphic designers showcasing creative excellence',
      url: '/try'
    },
    {
      id: 41,
      name: 'Design Innovator',
      preview: temp8,
      description: 'Vibrant layout for graphic designers showcasing creative excellence',
      url: '/try'
    },
  ];

  const navigate = useNavigate();
  const handleSelectTemplate = (template) => {
    setSelectedTemplate(template.id);
    navigate(template.url);
  };

  return (
    <div className="mt-16">
      <motion.h3
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-4xl md:text-5xl font-extrabold mb-6 text-center tracking-wide bg-gradient-to-r from-teal-400 via-teal-300 to-orange-400 bg-clip-text text-transparent"
      >
        Choose Your Perfect Template
      </motion.h3>
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="text-lg md:text-xl text-center text-gray-300 mb-16 max-w-3xl mx-auto leading-relaxed"
      >
        Select from our curated collection of professional templates designed to help you stand out and showcase your unique talents
      </motion.p>

      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 md:gap-10"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
      >
        {templates.map((template, index) => (
          <motion.div
            key={template.id}
            className="relative group cursor-pointer overflow-hidden rounded-2xl border border-gray-700/50 shadow-xl hover:shadow-2xl h-96 bg-gray-800/50 backdrop-blur-sm"
            onMouseEnter={() => setHoveredTemplate(template.id)}
            onMouseLeave={() => setHoveredTemplate(null)}
            whileHover={{
              scale: 1.02,
              y: -8,
              transition: { duration: 0.3, ease: "easeOut" }
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
          >
            {/* Template Image */}
            <div className="relative overflow-hidden rounded-t-2xl h-3/4">
              <motion.img
                src={template.preview}
                alt={template.name}
                className="w-full h-full object-cover transition-transform duration-700"
                animate={hoveredTemplate === template.id ? { scale: 1.05 } : { scale: 1 }}
              />
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>

            {/* Template Info */}
            <div className="absolute inset-0 flex flex-col justify-end p-6 bg-gradient-to-t from-gray-900/95 via-gray-900/80 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300">
              <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                <h4 className="text-xl font-bold text-white mb-2">{template.name}</h4>
                <p className="text-gray-300 text-sm mb-4 leading-relaxed">{template.description}</p>
                <motion.button
                  onClick={() => handleSelectTemplate(template)}
                  className="px-6 py-3 rounded-xl text-sm font-semibold bg-gradient-to-r from-teal-500 to-orange-500 hover:from-teal-600 hover:to-orange-600 text-white transition-all duration-300 shadow-lg hover:shadow-xl"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {selectedTemplate === template.id ? 'Selected' : 'Use Template'}
                </motion.button>
              </div>
            </div>

            {/* Selection Indicator */}
            {selectedTemplate === template.id && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute top-4 right-4 bg-gradient-to-r from-teal-500 to-orange-500 text-white w-10 h-10 rounded-full flex items-center justify-center shadow-lg z-10"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </motion.div>
            )}

            {/* Template Name (Always Visible) */}
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-gray-900/90 to-transparent">
              <h4 className="text-lg font-semibold text-white truncate">{template.name}</h4>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default WithoutAiTemp;
