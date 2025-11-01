import { useState } from 'react';
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
const WithoutAiTemp = () => {
  const [selectedTemplate, setSelectedTemplate] = useState(null);

  const templates = [
    {
      id: 1,
      name: 'Radiant Edge-1',
      preview: temp1, // Use imported image
      description: 'Perfect for modern professionals in tech, analytics, and innovation-driven roles.',
      url: '/template1'
    },
    {
      id: 2,
      name: 'CodeCraft Classic-2',
      preview: temp2,
      description: 'Ideal for developers and tech professionals seeking a structured and professional format.',
      url: '/template2'
    },
    {
      id: 3,
      name: 'TechSlate Pro-3',
      preview: Temp3,
      description: 'Tailored for engineers and developers to highlight projects, certifications, and skills with clarity and precision.',
      url: '/template3'
    },
    {
      id: 4,
      name: 'Creative Spark-4',
      preview: temp4,
      description: 'Best suited for designers, marketers, and creative professionals who want to showcase flair and structure together.',
      url: '/template4'
    },
    {
      id: 5,
      name: 'Structured Precision-5',
      preview: temp5,
      description: 'Ideal for developers, engineers, and technical experts who value clarity, order, and professional presentation.',
      url: '/template5'
    },
    {
      id: 6,
      name: 'Modern Momentum-6',
      preview: temp6,
      description: 'Perfect for tech professionals seeking a sleek, impactful, and well-structured presentation of their experience and skills.',
      url: '/resume-template6'
    },
    {
      id: 7,
      name: 'Creative Spectrum-7',
      preview: temp7,
      description: 'perfect for a graphic designers resume template.',
      url: '/resume-template7'
    },
    {
      id: 8,
      name: 'Executive Edge-8',
      preview: temp8,
      description: 'Professional two-column layout perfect for management and leadership roles.',
      url: '/template8'
    },
    {
      id: 9,
      name: 'Tech Forward-9',
      preview: temp9,
      description: 'Modern single-column design with skill tags for tech professionals.',
      url: '/resume-template9'
    },
    {
      id: 10,
      name: 'Classic Professional-10',
      preview: temp8,
      description: 'Clean traditional layout ideal for corporate and technical roles.',
      url: '/resume-template10'
    },
    {
      id: 11,
      name: 'Professional Executive-11',
      preview: temp8,
      description: 'Clean, professional layout showcasing marketing expertise and career achievements effectively.',
      url: '/template11'
    },
    {
      id: 12,
      name: 'Strategic Technology Leader-12',
      preview: temp8,
      description: 'Clean, impactful layout ideal for IT and cybersecurity roles',
      url: '/resume-template12'
    },
    {
      id: 13,
      name: 'Clinical Practice Professional-13',
      preview: temp8,
      description: 'Detailed, structured layout designed for doctors and medical field experts.',
      url: '/template13'
    },
    {
      id: 14,
      name: 'Laboratory Specialist Resume-14',
      preview: temp8,
      description: 'Precise, results-driven layout crafted for lab and clinical professionals.',
      url: '/template14'
    },
    {
      id: 15,
      name: 'Finance Analyst Resume-15',
      preview: temp8,
      description: 'Crisp, professional format tailored for finance, budgeting, and analysis roles',
      url: '/template15'
    },
    {
      id: 16,
      name: 'Fiscal Visionary & Strategic Performance Architect-16',
      preview: temp8,
      description: 'Crafting financial clarity, accelerating growth, and engineering operational excellence',
      url: '/resume-template16'
    },
    {
      id: 17,
      name: 'Modern Web Developer Resume Template-17',
      preview: temp8,
      description: 'Interactive resume template with vibrant design and essential developer details.',
      url: '/resume-template17'
    },
    {
      id: 18,
      name: 'Resume Preview-18',
      preview: temp8,
      description: 'Clean and modern layout tailored for retail sales job seekers.',
      url: '/resume-template18'
    },
    {
      id: 19,
      name: 'Experience Highlight-19',
      preview: temp8,
      description: 'Showcases impactful achievements in retail sales with measurable success.',
      url: '/template19'
    },
    {
      id: 20,
      name: 'Retail Expert-20',
      preview: temp8,
      description: 'Dynamic sales professional excelling in service, merchandising, and customer engagement.',
      url: '/template20'
    },
    {
      id: 21,
      name: 'Sales Specialist-21',
      preview: temp8,
      description: 'Driven retail expert excelling in sales, service, and visual merchandising.',
      url: '/template21'
    },
    {
      id: 22,
      name: 'Legal Intern-22',
      preview: temp8,
      description: 'Motivated legal intern with strong research, writing, and analytical skills.',
      url: '/template22'
    },
    {
      id: 23,
      name: 'Creative Visionary-23',
      preview: temp8,
      description: 'Delivers compelling freelance design solutions with innovation, strategy, and style.',
      url: '/template23'
    },
    {
      id: 24,
      name: 'Tech Enthusiast-24',
      preview: temp8,
      description: 'Innovative computer science graduate passionate about coding and future technologies.',
      url: '/template24'
    },
    {
      id: 25,
      name: 'Code Innovator-25',
      preview: temp8,
      description: 'Creative software developer specializing in scalable, user-friendly web solutions',
      url: '/template25'
    },
    {
      id: 26,
      name: 'Code Crafter-26',
      preview: temp8,
      description: 'Dedicated developer skilled in React, CSS, and problem solving.',
      url: '/template26'
    },
    {
      id: 27,
      name: 'Design Visionary-27',
      preview: temp8,
      description: 'Creative graphic designer with a passion for clean visual storytelling.',
      url: '/template27'
    },
    {
      id: 28,
      name: 'Code Architect-28',
      preview: temp8,
      description: 'Versatile fullstack developer crafting efficient, scalable, and modern applications.',
      url: '/resume-template28'
    },
    {
      id: 29,
      name: 'UI Crafter-29',
      preview: temp8,
      description: 'Designs seamless user experiences with clean, responsive, modern web interfaces.',
      url: '/resume-template29'
    },
    {
      id: 30,
      name: ' Career Snapshot-30',
      preview: temp8,
      description: ' Showcasing skills, projects, and achievements in full stack development.',
      url: '/resume-template30'
    },
  ];

  const navigate = useNavigate();
  const handleSelectTemplate = (template, event) => {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    setSelectedTemplate(template.id);
    navigate('/build-option', {
      state: { templateId: template.id }
    });
  };

  return (
    <div className="mt-16">
      <motion.h3
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-3xl font-bold mb-4 text-center text-gray-900"
      >
        Choose Your Template
      </motion.h3>
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="text-lg text-center text-gray-600 mb-12 max-w-2xl mx-auto"
      >
        Select from our collection of professional templates
      </motion.p>

      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
      >
        {templates.map((template, index) => (
          <motion.div
            key={template.id}
            className="relative group cursor-pointer overflow-hidden rounded-lg border border-gray-200 shadow-sm hover:shadow-md h-80 bg-white"
            onClick={(event) => handleSelectTemplate(template, event)}
            whileHover={{
              scale: 1.02,
              transition: { duration: 0.2, ease: "easeOut" }
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.05 }}
          >
            {/* Template Preview */}
            <div className="relative overflow-hidden rounded-t-2xl h-3/4">
              {template.preview && template.id <= 9 ? (
                <img
                  src={template.preview}
                  alt={template.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-white border-2 border-gray-100 flex items-center justify-center">
                  <div className="text-center p-6 w-full">
                    {/* Resume Preview Mockup */}
                    <div className="bg-white border border-gray-200 rounded-sm p-4 text-left max-w-48 mx-auto shadow-sm">
                      {/* Header */}
                      <div className="border-b border-gray-200 pb-2 mb-3">
                        <div className="h-3 bg-gray-800 rounded mb-1"></div>
                        <div className="h-2 bg-gray-400 rounded w-2/3"></div>
                      </div>
                      
                      {/* Contact Info */}
                      <div className="space-y-1 mb-3">
                        <div className="h-1.5 bg-gray-300 rounded w-3/4"></div>
                        <div className="h-1.5 bg-gray-300 rounded w-1/2"></div>
                      </div>
                      
                      {/* Sections */}
                      <div className="space-y-2">
                        <div className="h-2 bg-gray-600 rounded w-1/3"></div>
                        <div className="space-y-1">
                          <div className="h-1.5 bg-gray-300 rounded"></div>
                          <div className="h-1.5 bg-gray-300 rounded w-5/6"></div>
                        </div>
                        
                        <div className="h-2 bg-gray-600 rounded w-1/2 mt-3"></div>
                        <div className="space-y-1">
                          <div className="h-1.5 bg-gray-300 rounded w-4/5"></div>
                          <div className="h-1.5 bg-gray-300 rounded w-3/5"></div>
                        </div>
                      </div>
                      
                      {/* Template Number */}
                      <div className="absolute top-2 right-2 bg-gray-900 text-white text-xs px-2 py-1 rounded">
                        {template.id}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Selection Indicator */}
            {selectedTemplate === template.id && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute top-3 right-3 bg-gray-900 text-white w-8 h-8 rounded-full flex items-center justify-center shadow-lg z-10"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </motion.div>
            )}

            {/* Template Info */}
            <div className="p-4 h-1/4 flex flex-col justify-between">
              <div>
                <h4 className="text-sm font-semibold text-gray-900 truncate mb-1">{template.name}</h4>
                <p className="text-xs text-gray-600 line-clamp-2">{template.description}</p>
              </div>
              <button
                onClick={(event) => handleSelectTemplate(template, event)}
                className="mt-2 w-full px-3 py-2 rounded-md text-xs font-medium bg-gray-900 text-white hover:bg-gray-800 transition-colors"
              >
                Use Template
              </button>
            </div>

          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default WithoutAiTemp;
