import React, { useState, useEffect, useRef } from 'react';
import {
  Eye, Edit3, Download, PlusCircle, Trash2, Briefcase, GraduationCap, Lightbulb,
  User, Phone, Mail, Linkedin, Github, MapPin,
  Sparkles, X, ChevronDown, ChevronUp // Added for AI Assistant
} from 'lucide-react';

// Helper to generate unique IDs
const generateId = () => Date.now().toString();

const initialResumeData = {
  personalInfo: {
    name: 'Alex Johnson',
    title: 'Full Stack Developer',
    email: 'alex.johnson@email.com',
    phone: '+1 555-123-4567',
    linkedin: 'linkedin.com/in/alexjohnson',
    github: 'github.com/alexjohnson',
    address: '123 Innovation Drive, Tech City, TX 75001',
  },
  summary: 'Highly motivated and results-oriented Full Stack Developer with 5+ years of experience in designing, developing, and deploying web applications. Proficient in JavaScript, React, Node.js, and Python. Seeking to leverage technical expertise and problem-solving skills to contribute to a dynamic organization.',
  experience: [
    {
      id: generateId(),
      jobTitle: 'Senior Software Engineer',
      company: 'Innovatech Solutions Ltd.',
      location: 'San Francisco, CA',
      startDate: 'Jan 2021',
      endDate: 'Present',
      responsibilities: [
        'Led a team of 5 developers in the design and implementation of a new SaaS platform, resulting in a 20% increase in user engagement.',
        'Developed and maintained scalable microservices using Node.js and Docker.',
        'Collaborated with product managers to define project requirements and deliverables.',
      ],
    },
    {
      id: generateId(),
      jobTitle: 'Software Developer',
      company: 'Web Creations Co.',
      location: 'Austin, TX',
      startDate: 'Jun 2018',
      endDate: 'Dec 2020',
      responsibilities: [
        'Contributed to the development of e-commerce websites using React and Redux.',
        'Implemented RESTful APIs and integrated third-party services.',
        'Participated in agile development cycles and code reviews.',
      ],
    },
  ],
  education: [
    {
      id: generateId(),
      degree: 'Master of Science in Computer Science',
      institution: 'Stanford University',
      location: 'Stanford, CA',
      graduationDate: 'May 2018',
      details: 'Thesis on Machine Learning applications in web development. GPA: 3.9/4.0',
    },
    {
      id: generateId(),
      degree: 'Bachelor of Science in Software Engineering',
      institution: 'University of Texas at Austin',
      location: 'Austin, TX',
      graduationDate: 'May 2016',
      details: 'Relevant coursework: Data Structures, Algorithms, Database Management. GPA: 3.8/4.0',
    }
  ],
  skills: ['JavaScript (ES6+)', 'React', 'Redux', 'Node.js', 'Express.js', 'Python', 'Django', 'SQL', 'NoSQL (MongoDB)', 'Docker', 'AWS', 'Git', 'Agile Methodologies'],
  projects: [
    {
      id: generateId(),
      name: 'Project Phoenix - E-commerce Platform',
      description: 'Developed a full-stack e-commerce platform with features like product catalog, user authentication, shopping cart, and payment integration.',
      technologies: ['React, Node.js, MongoDB, Stripe API'],
      link: 'github.com/alexjohnson/project-phoenix',
    },
    {
      id: generateId(),
      name: 'TaskMaster - Productivity App',
      description: 'A mobile-first task management application with real-time collaboration features.',
      technologies: ['React Native, Firebase, Redux Saga'],
      link: 'github.com/alexjohnson/taskmaster',
    }
  ],
};

// --- Reusable Input Component ---
const InputField = ({ label, id, value, onChange, placeholder, type = "text", icon }) => (
  <div className="mb-4">
    <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
      {icon && React.createElement(icon, { className: "mr-2 h-4 w-4 text-gray-500" })}
      {label}
    </label>
    {type === "textarea" ? (
      <textarea
        id={id}
        value={value}
        onChange={onChange}
        placeholder={placeholder || `Enter ${label.toLowerCase()}`}
        rows="3"
        className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
      />
    ) : (
      <input
        type={type}
        id={id}
        value={value}
        onChange={onChange}
        placeholder={placeholder || `Enter ${label.toLowerCase()}`}
        className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
      />
    )}
  </div>
);

// --- Resume Preview Component (User's Version) ---
const ResumePreview = React.forwardRef(({ data }, ref) => {
  const { personalInfo, summary, experience, education, skills, projects } = data;

  const Section = ({ title, icon, children }) => (
    <section className="mb-6">
      <h2 className="text-xl font-semibold text-indigo-700 border-b-2 border-indigo-200 pb-2 mb-3 flex items-center">
        {React.createElement(icon, { className: "mr-2 h-5 w-5" })}
        {title}
      </h2>
      {children}
    </section>
  );

  const Pill = ({ text }) => (
    <span className="bg-indigo-100 text-indigo-700 text-xs font-semibold mr-2 mb-2 px-2.5 py-0.5 rounded-full">{text}</span>
  );

  return (
    <div ref={ref} className="p-6 md:p-10 bg-white shadow-lg rounded-lg printable-area font-sans">
      {/* Header */}
      <header className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800">{personalInfo.name}</h1>
        <p className="text-xl text-indigo-600">{personalInfo.title}</p>
        <div className="mt-2 text-sm text-gray-600 flex flex-wrap justify-center gap-x-4 gap-y-1">
          {personalInfo.email && <a href={`mailto:${personalInfo.email}`} className="hover:text-indigo-500 flex items-center"><Mail size={14} className="mr-1"/>{personalInfo.email}</a>}
          {personalInfo.phone && <span className="flex items-center"><Phone size={14} className="mr-1"/>{personalInfo.phone}</span>}
          {personalInfo.address && <span className="flex items-center"><MapPin size={14} className="mr-1"/>{personalInfo.address}</span>}
        </div>
        <div className="mt-1 text-sm text-gray-600 flex flex-wrap justify-center gap-x-4 gap-y-1">
          {personalInfo.linkedin && <a href={`https://${personalInfo.linkedin}`} target="_blank" rel="noopener noreferrer" className="hover:text-indigo-500 flex items-center"><Linkedin size={14} className="mr-1"/>{personalInfo.linkedin}</a>}
          {personalInfo.github && <a href={`https://${personalInfo.github}`} target="_blank" rel="noopener noreferrer" className="hover:text-indigo-500 flex items-center"><Github size={14} className="mr-1"/>{personalInfo.github}</a>}
        </div>
      </header>

      {summary && (
        <Section title="Professional Summary" icon={User}>
          <p className="text-gray-700 text-sm leading-relaxed">{summary}</p>
        </Section>
      )}

      {experience && experience.length > 0 && (
        <Section title="Work Experience" icon={Briefcase}>
          {experience.map((exp) => (
            <div key={exp.id} className="mb-4">
              <h3 className="text-lg font-semibold text-gray-800">{exp.jobTitle}</h3>
              <p className="text-md text-indigo-600">{exp.company} - {exp.location}</p>
              <p className="text-xs text-gray-500 mb-1">{exp.startDate} – {exp.endDate}</p>
              <ul className="list-disc list-inside text-gray-700 text-sm space-y-1">
                {exp.responsibilities.map((resp, index) => (
                  <li key={index}>{resp}</li>
                ))}
              </ul>
            </div>
          ))}
        </Section>
      )}

      {education && education.length > 0 && (
        <Section title="Education" icon={GraduationCap}>
          {education.map((edu) => (
            <div key={edu.id} className="mb-4">
              <h3 className="text-lg font-semibold text-gray-800">{edu.degree}</h3>
              <p className="text-md text-indigo-600">{edu.institution} - {edu.location}</p>
              <p className="text-xs text-gray-500 mb-1">{edu.graduationDate}</p>
              {edu.details && <p className="text-gray-700 text-sm">{edu.details}</p>}
            </div>
          ))}
        </Section>
      )}
      
      {projects && projects.length > 0 && (
        <Section title="Projects" icon={Lightbulb}>
          {projects.map((proj) => (
            <div key={proj.id} className="mb-4">
              <h3 className="text-lg font-semibold text-gray-800">{proj.name}</h3>
              {proj.link && <a href={`https://${proj.link}`} target="_blank" rel="noopener noreferrer" className="text-sm text-indigo-500 hover:underline">{proj.link}</a>}
              <p className="text-gray-700 text-sm my-1">{proj.description}</p>
              {proj.technologies && <p className="text-sm text-gray-600"><em>Technologies: {proj.technologies.join(', ')}</em></p>}
            </div>
          ))}
        </Section>
      )}

      {skills && skills.length > 0 && (
        <Section title="Skills" icon={Lightbulb}>
          <div className="flex flex-wrap">
            {skills.map((skill, index) => (
              <Pill key={index} text={skill} />
            ))}
          </div>
        </Section>
      )}
    </div>
  );
});

// --- Resume Edit Form Component (User's Version) ---
const ResumeEditForm = ({ data, onUpdate }) => {
  const handlePersonalInfoChange = (field, value) => {
    onUpdate({ ...data, personalInfo: { ...data.personalInfo, [field]: value } });
  };
  const handleSummaryChange = (value) => { onUpdate({ ...data, summary: value }); };
  const handleArrayChange = (section, index, field, value) => {
    const updatedSection = data[section].map((item, i) =>
      i === index ? { ...item, [field]: value } : item
    );
    onUpdate({ ...data, [section]: updatedSection });
  };
  const handleResponsibilityChange = (expIndex, respIndex, value) => {
    const updatedExperience = data.experience.map((exp, i) => {
      if (i === expIndex) {
        const updatedResponsibilities = exp.responsibilities.map((resp, j) => (j === respIndex ? value : resp));
        return { ...exp, responsibilities: updatedResponsibilities };
      } return exp;
    });
    onUpdate({ ...data, experience: updatedExperience });
  };
  const addArrayItem = (section, newItemTemplate) => {
    onUpdate({ ...data, [section]: [...data[section], { ...newItemTemplate, id: generateId() }] });
  };
  const removeArrayItem = (section, index) => {
    onUpdate({ ...data, [section]: data[section].filter((_, i) => i !== index) });
  };
  const addResponsibility = (expIndex) => {
    const updatedExperience = data.experience.map((exp, i) => {
      if (i === expIndex) {
        return { ...exp, responsibilities: [...exp.responsibilities, ''] };
      } return exp;
    });
    onUpdate({ ...data, experience: updatedExperience });
  };
  const removeResponsibility = (expIndex, respIndex) => {
    const updatedExperience = data.experience.map((exp, i) => {
      if (i === expIndex) {
        const filteredResponsibilities = exp.responsibilities.filter((_, j) => j !== respIndex);
        return { ...exp, responsibilities: filteredResponsibilities };
      } return exp;
    });
    onUpdate({ ...data, experience: updatedExperience });
  };
  const handleSkillsChange = (value) => {
    onUpdate({ ...data, skills: value.split(',').map(s => s.trim()).filter(s => s) });
  };
  const SectionWrapper = ({ title, children }) => (
    <div className="mb-8 p-6 bg-white shadow-md rounded-lg border border-gray-200">
      <h3 className="text-xl font-semibold text-indigo-700 mb-4 pb-2 border-b border-gray-200">{title}</h3>
      {children}
    </div>
  );

  return (
    <div className="p-4 md:p-6 space-y-6 bg-gray-50 rounded-lg">
      <SectionWrapper title="Personal Information">
        <InputField label="Full Name" id="name" value={data.personalInfo.name} onChange={(e) => handlePersonalInfoChange('name', e.target.value)} icon={User}/>
        <InputField label="Title (e.g., Software Engineer)" id="title" value={data.personalInfo.title} onChange={(e) => handlePersonalInfoChange('title', e.target.value)} icon={Briefcase}/>
        <InputField label="Email" id="email" type="email" value={data.personalInfo.email} onChange={(e) => handlePersonalInfoChange('email', e.target.value)} icon={Mail}/>
        <InputField label="Phone" id="phone" type="tel" value={data.personalInfo.phone} onChange={(e) => handlePersonalInfoChange('phone', e.target.value)} icon={Phone}/>
        <InputField label="Address" id="address" value={data.personalInfo.address} onChange={(e) => handlePersonalInfoChange('address', e.target.value)} icon={MapPin}/>
        <InputField label="LinkedIn Profile URL (e.g., linkedin.com/in/yourname)" id="linkedin" value={data.personalInfo.linkedin} onChange={(e) => handlePersonalInfoChange('linkedin', e.target.value)} icon={Linkedin}/>
        <InputField label="GitHub Profile URL (e.g., github.com/yourusername)" id="github" value={data.personalInfo.github} onChange={(e) => handlePersonalInfoChange('github', e.target.value)} icon={Github}/>
      </SectionWrapper>
      <SectionWrapper title="Professional Summary">
        <InputField label="Summary" id="summary" type="textarea" value={data.summary} onChange={(e) => handleSummaryChange(e.target.value)} />
      </SectionWrapper>
      <SectionWrapper title="Work Experience">
        {data.experience.map((exp, index) => (
          <div key={exp.id} className="mb-6 p-4 border border-gray-300 rounded-md relative">
            <InputField label="Job Title" id={`exp-title-${index}`} value={exp.jobTitle} onChange={(e) => handleArrayChange('experience', index, 'jobTitle', e.target.value)} />
            <InputField label="Company" id={`exp-company-${index}`} value={exp.company} onChange={(e) => handleArrayChange('experience', index, 'company', e.target.value)} />
            <InputField label="Location" id={`exp-location-${index}`} value={exp.location} onChange={(e) => handleArrayChange('experience', index, 'location', e.target.value)} />
            <div className="grid grid-cols-2 gap-4">
                <InputField label="Start Date" id={`exp-start-${index}`} value={exp.startDate} onChange={(e) => handleArrayChange('experience', index, 'startDate', e.target.value)} placeholder="e.g., Jan 2020"/>
                <InputField label="End Date" id={`exp-end-${index}`} value={exp.endDate} onChange={(e) => handleArrayChange('experience', index, 'endDate', e.target.value)} placeholder="e.g., Present or Dec 2022"/>
            </div>
            <div className="mb-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Responsibilities</label>
                {exp.responsibilities.map((resp, rIndex) => (
                    <div key={rIndex} className="flex items-center mb-2">
                        <input type="text" value={resp} onChange={(e) => handleResponsibilityChange(index, rIndex, e.target.value)} placeholder={`Responsibility ${rIndex + 1}`} className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"/>
                        <button type="button" onClick={() => removeResponsibility(index, rIndex)} className="ml-2 p-1 text-red-500 hover:text-red-700"><Trash2 size={18} /></button>
                    </div>
                ))}
                <button type="button" onClick={() => addResponsibility(index)} className="mt-1 text-sm text-indigo-600 hover:text-indigo-800 flex items-center"><PlusCircle size={16} className="mr-1"/> Add Responsibility</button>
            </div>
            <button type="button" onClick={() => removeArrayItem('experience', index)} className="absolute top-2 right-2 p-1 text-red-600 hover:text-red-800"><Trash2 size={20} /></button>
          </div>
        ))}
        <button type="button" onClick={() => addArrayItem('experience', { jobTitle: '', company: '', location: '', startDate: '', endDate: '', responsibilities: [''] })} className="mt-2 text-indigo-600 hover:text-indigo-800 font-medium py-2 px-4 rounded-md border border-indigo-600 hover:bg-indigo-50 flex items-center"><PlusCircle size={18} className="mr-2"/> Add Experience</button>
      </SectionWrapper>
      <SectionWrapper title="Education">
        {data.education.map((edu, index) => (
          <div key={edu.id} className="mb-6 p-4 border border-gray-300 rounded-md relative">
            <InputField label="Degree" id={`edu-degree-${index}`} value={edu.degree} onChange={(e) => handleArrayChange('education', index, 'degree', e.target.value)} />
            <InputField label="Institution" id={`edu-institution-${index}`} value={edu.institution} onChange={(e) => handleArrayChange('education', index, 'institution', e.target.value)} />
            <InputField label="Location" id={`edu-location-${index}`} value={edu.location} onChange={(e) => handleArrayChange('education', index, 'location', e.target.value)} />
            <InputField label="Graduation Date" id={`edu-gradDate-${index}`} value={edu.graduationDate} onChange={(e) => handleArrayChange('education', index, 'graduationDate', e.target.value)} placeholder="e.g., May 2020"/>
            <InputField label="Details/GPA (Optional)" id={`edu-details-${index}`} type="textarea" value={edu.details} onChange={(e) => handleArrayChange('education', index, 'details', e.target.value)} />
            <button type="button" onClick={() => removeArrayItem('education', index)} className="absolute top-2 right-2 p-1 text-red-600 hover:text-red-800"><Trash2 size={20} /></button>
          </div>
        ))}
        <button type="button" onClick={() => addArrayItem('education', { degree: '', institution: '', location: '', graduationDate: '', details: '' })} className="mt-2 text-indigo-600 hover:text-indigo-800 font-medium py-2 px-4 rounded-md border border-indigo-600 hover:bg-indigo-50 flex items-center"><PlusCircle size={18} className="mr-2"/> Add Education</button>
      </SectionWrapper>
      <SectionWrapper title="Projects">
        {data.projects.map((proj, index) => (
          <div key={proj.id} className="mb-6 p-4 border border-gray-300 rounded-md relative">
            <InputField label="Project Name" id={`proj-name-${index}`} value={proj.name} onChange={(e) => handleArrayChange('projects', index, 'name', e.target.value)} />
            <InputField label="Description" id={`proj-desc-${index}`} type="textarea" value={proj.description} onChange={(e) => handleArrayChange('projects', index, 'description', e.target.value)} />
            <InputField label="Technologies Used (comma-separated)" id={`proj-tech-${index}`} value={proj.technologies.join(', ')} onChange={(e) => handleArrayChange('projects', index, 'technologies', e.target.value.split(',').map(s=>s.trim()))} />
            <InputField label="Project Link (e.g., github.com/user/project)" id={`proj-link-${index}`} value={proj.link} onChange={(e) => handleArrayChange('projects', index, 'link', e.target.value)} />
            <button type="button" onClick={() => removeArrayItem('projects', index)} className="absolute top-2 right-2 p-1 text-red-600 hover:text-red-800"><Trash2 size={20} /></button>
          </div>
        ))}
        <button type="button" onClick={() => addArrayItem('projects', { name: '', description: '', technologies: [], link: '' })} className="mt-2 text-indigo-600 hover:text-indigo-800 font-medium py-2 px-4 rounded-md border border-indigo-600 hover:bg-indigo-50 flex items-center"><PlusCircle size={18} className="mr-2"/> Add Project</button>
      </SectionWrapper>
      <SectionWrapper title="Skills">
        <InputField 
            label="Skills (comma-separated)" 
            id="skills" 
            type="textarea" 
            value={data.skills.join(', ')} 
            onChange={(e) => handleSkillsChange(e.target.value)} 
            placeholder="e.g., React, Node.js, Python"
        />
        <p className="text-xs text-gray-500 mt-1">Enter skills separated by commas. They will be displayed as individual tags.</p>
      </SectionWrapper>
    </div>
  );
};

// --- AI Assistant Modal ---
const AiAssistantModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const tips = [
    "Use strong action verbs to start bullet points (e.g., 'Led', 'Developed', 'Managed').",
    "Quantify your achievements with numbers and data whenever possible (e.g., 'Increased user engagement by 20%').",
    "Tailor your resume to the specific job description, highlighting relevant skills and experiences.",
    "Keep your summary concise (2-3 sentences) and impactful.",
    "Proofread meticulously for any typos or grammatical errors.",
    "Ensure your contact information is current and professional.",
    "Use a clean, modern, and easy-to-read font. Consistency in formatting is key."
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 no-print">
      <div className="bg-white p-6 md:p-8 rounded-lg shadow-xl max-w-lg w-full max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-indigo-700 flex items-center">
            <Sparkles className="mr-2 h-6 w-6 text-indigo-500" />
            AI Resume Writing Tips
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={24} />
          </button>
        </div>
        <ul className="space-y-3 text-sm text-gray-700">
          {tips.map((tip, index) => (
            <li key={index} className="flex items-start">
              <Lightbulb size={18} className="mr-3 mt-0.5 text-indigo-500 flex-shrink-0" />
              <span>{tip}</span>
            </li>
          ))}
        </ul>
        <button
          onClick={onClose}
          className="mt-6 w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors"
        >
          Got it!
        </button>
      </div>
    </div>
  );
};


// --- Main App Component ---
function App() {
  const [resumeData, setResumeData] = useState(initialResumeData);
  const [viewMode, setViewMode] = useState('preview'); // 'preview' or 'edit'
  const resumePreviewRef = useRef();

  // New states for AI Assistant
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [isAiDropdownOpen, setIsAiDropdownOpen] = useState(false);
  const aiDropdownRef = useRef(null);


  const handleUpdateResume = (updatedData) => {
    setResumeData(updatedData);
  };

  const handleDownload = () => {
    const currentView = viewMode;
    if (viewMode === 'edit') {
      setViewMode('preview');
      setTimeout(() => {
        window.print();
        setViewMode(currentView); 
      }, 100); 
    } else {
      window.print();
    }
  };
  
  // Close AI dropdown if clicked outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (aiDropdownRef.current && !aiDropdownRef.current.contains(event.target)) {
        setIsAiDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [aiDropdownRef]);

  // Print styles effect (from user's code)
  useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = `
      @media print {
        body * { visibility: hidden; }
        .printable-area, .printable-area * { visibility: visible; }
        .printable-area { 
          position: absolute; left: 0; top: 0; width: 100% !important; 
          margin: 0 !important; padding: 0 !important; /* User's original padding */
          box-shadow: none !important; border: none !important; 
        }
        .no-print { display: none !important; }
        @page { margin: 20mm; }
        .printable-area { background-color: white !important; color: black !important; }
        .printable-area h1, .printable-area h2, .printable-area h3, .printable-area p, .printable-area li, .printable-area span, .printable-area a {
            color: black !important; background-color: transparent !important;
        }
        .printable-area .text-indigo-700, .printable-area .text-indigo-600 {
            color: #3730a3 !important; 
        }
         .printable-area .bg-indigo-100 {
            background-color: #e0e7ff !important; 
            border: 1px solid #c7d2fe !important;
        }
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  // Modified SidebarButton to handle dropdown chevrons
  const SidebarButton = ({ onClick, icon, label, isActive, isAccent = false, showChevron = false, isDropdownOpen = false }) => (
    <button
      onClick={onClick}
      className={`w-full flex items-center justify-between p-3 rounded-lg text-sm font-medium transition-colors duration-150
                  ${isActive 
                    ? 'bg-indigo-600 text-white shadow-md' 
                    : isAccent 
                      ? 'bg-amber-400 text-slate-800 hover:bg-amber-500 shadow-sm' // Accent for AI button
                      : 'text-gray-700 hover:bg-indigo-100 hover:text-indigo-700'
                  }`}
    >
      <div className="flex items-center space-x-3">
        {React.createElement(icon, { className: "h-5 w-5" })}
        <span>{label}</span>
      </div>
      {showChevron && (isDropdownOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />)}
    </button>
  );

  return (
    <>
      <div className="flex flex-col md:flex-row min-h-screen bg-gray-100 font-sans">
        {/* Sidebar */}
        <aside className="w-full md:w-64 bg-white p-4 md:p-6 shadow-lg no-print md:sticky md:top-0 md:h-screen flex flex-col">
          <div className="mb-8 text-center">
              <h1 className="text-2xl font-bold text-indigo-700">ResumeCraft</h1>
              <p className="text-xs text-gray-500">Your Personal Resume Builder</p>
          </div>
          <nav className="space-y-3 flex-grow"> {/* Added flex-grow to push footer down */}
            <SidebarButton 
              onClick={() => setViewMode('preview')} 
              icon={Eye} 
              label="Preview Resume"
              isActive={viewMode === 'preview'}
            />
            <SidebarButton 
              onClick={() => setViewMode('edit')} 
              icon={Edit3} 
              label="Edit Resume"
              isActive={viewMode === 'edit'}
            />
            <SidebarButton onClick={() => setViewMode('save')} icon={Eye} label="save" isActive={viewMode === 'save'}/>
            <SidebarButton onClick={() => setViewMode('share')} icon={Eye} label="share" isActive={viewMode === 'share'}/>
            
            {/* AI Assistant Dropdown */}
            <div className="relative" ref={aiDropdownRef}>
              <SidebarButton
                onClick={() => setIsAiDropdownOpen(!isAiDropdownOpen)}
                icon={Sparkles}
                label="AI Assistant"
                isActive={isAiModalOpen || isAiDropdownOpen} // Button active if modal or dropdown is open
                isAccent={true} // Make it stand out
                showChevron={true}
                isDropdownOpen={isAiDropdownOpen}
              />
              {isAiDropdownOpen && (
                <div className="absolute left-0 right-0 mt-1 z-20"> {/* Dropdown menu */}
                  <div className="mx-2 p-2 bg-white rounded-md shadow-xl border border-gray-200">
                    {/* Conditional Summary Assistance Button */}
                    {resumeData.summary && (
                      <button
                        onClick={() => { setIsAiModalOpen(true); setIsAiDropdownOpen(false); }}
                        className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-indigo-100 rounded-md flex items-center"
                      >
                        <Lightbulb size={16} className="mr-2 text-indigo-500" /> Summary Assistance
                      </button>
                    )}
                    {/* Conditional Experience Enhancing Button */}
                    {resumeData.experience && resumeData.experience.length > 0 && (
                      <button
                        onClick={() => { setIsAiModalOpen(true); setIsAiDropdownOpen(false); }}
                        className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-indigo-100 rounded-md flex items-center mt-1"
                      >
                        <Briefcase size={16} className="mr-2 text-indigo-500" /> Experience Enhancing
                      </button>
                    )}
                    {/* Message if no specific assistance is available */}
                    {(!resumeData.summary && (!resumeData.experience || resumeData.experience.length === 0)) && (
                        <p className="px-3 py-2 text-sm text-gray-500 text-center">No specific AI tips available for current sections.</p>
                    )}
                     {/* General Tips Button - always available in dropdown */}
                    <button
                        onClick={() => { setIsAiModalOpen(true); setIsAiDropdownOpen(false); }}
                        className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-indigo-100 rounded-md flex items-center mt-1 border-t border-gray-100 pt-2"
                      >
                        <Sparkles size={16} className="mr-2 text-indigo-500" /> General Writing Tips
                      </button>
                  </div>
                </div>
              )}
            </div>
            
            <SidebarButton 
              onClick={handleDownload} 
              icon={Download} 
              label="Download (PDF)"
              isActive={false} 
            />
          </nav>
          <div className="mt-auto pt-6 border-t border-gray-200 text-center text-xs text-gray-500 hidden md:block">
              <p>&copy; {new Date().getFullYear()} ResumeCraft. All rights reserved.</p>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 p-4 md:p-8 lg:p-12 overflow-y-auto">
          {viewMode === 'preview' ? (
            <ResumePreview data={resumeData} ref={resumePreviewRef} />
          ) : (
            <ResumeEditForm data={resumeData} onUpdate={handleUpdateResume} />
          )}
        </main>
      </div>
      <AiAssistantModal isOpen={isAiModalOpen} onClose={() => setIsAiModalOpen(false)} />
    </>
  );
}

export default App;
