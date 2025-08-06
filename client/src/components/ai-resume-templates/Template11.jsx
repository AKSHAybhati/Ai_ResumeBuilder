import React, { useState, useEffect, useRef } from 'react';
import {
  Eye,
  Edit3,
  Download,
  PlusCircle,
  Trash2,
  Briefcase,
  GraduationCap,
  Lightbulb,
  User,
  Phone,
  Mail,
  Linkedin,
  Github,
  MapPin,
  Sparkles,
  X,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
const initialNewResumeData = {
  name: 'Olivia Wilson',
  title: 'Marketing Manager',
  phone: '+123-456-7890',
  email: 'hello@oliviawilson.com',
  address: '123 Anywhere St, Any City',
  summary:
    'Experienced and results-driven Marketing Manager with a proven track record of developing and executing successful marketing strategies. Adept at market research, brand management, and digital marketing. Strong leadership skills with the ability to inspire and motivate teams to achieve objectives.',
  skills: [
    'Project Management',
    'Marketing Analytics',
    'SEO/SEM',
    'Content Creation',
    'Social Media Marketing',
    'Email Marketing',
  ],
  experience: [
    {
      id: 'exp1', 
      company: 'Borcelle Studio',
      title: 'Marketing Manager',
      duration: '2020 - Present',
      points: [
        'Led multi-channel marketing campaigns that increased brand awareness by 30%.',
        'Managed a budget of $500K, optimizing spend for a 15% ROI increase.',
        'Developed and executed content strategy, resulting in a 40% growth in organic traffic.',
      ],
    },
    {
      id: 'exp2',
      company: 'Innovatech Corp',
      title: 'Marketing Specialist',
      duration: '2018 - 2020',
      points: [
        'Assisted in the development of marketing materials and presentations.',
        'Conducted market research and competitor analysis to identify opportunities.',
        'Managed social media accounts, growing follower base by 25%.',
      ],
    },
  ],
  education: [
    {
      id: 'edu1', // Added ID
      year: '2016 – 2018', // Adjusted year format for consistency
      degree: 'MBA in Marketing',
      institution: 'BORCELLE UNIVERSITY',
    },
    {
      id: 'edu2',
      year: '2012 – 2016',
      degree: 'B.S. in Business Administration',
      institution: 'STATE COLLEGE',
    },
  ],
  languages: [
    { id: 'lang1', name: 'English', level: 'Native' }, // Added ID
    { id: 'lang2', name: 'Spanish', level: 'Proficient' },
  ],
};

// --- Reusable Section Component for the New Preview Template ---
const NewResumeSection = ({ title, children }) => (
  <div className="mb-4">
    <h2 className="font-semibold text-base border-b border-gray-300 mb-1 uppercase tracking-wider text-gray-700">
      {title}
    </h2>
    {children}
  </div>
);

// --- New Resume Preview Component (adapted from user's new template) ---
const NewResumePreview = React.forwardRef(({ data }, ref) => {
  const {
    name,
    title,
    phone,
    email,
    address,
    summary,
    skills,
    experience,
    education,
    languages,
  } = data;
  return (
    // Added ref here for potential direct manipulation, though not used by window.print() directly
    <div
      ref={ref}
      id="resume-preview-new"
      className="w-full max-w-[700px] mx-auto bg-white text-gray-900 shadow-xl border rounded-lg p-6 md:p-8 font-sans text-sm printable-area"
    >
      <div className="text-center border-b-2 border-gray-200 pb-4 mb-6">
        <h1 className="text-3xl font-bold uppercase text-indigo-700 tracking-tight">
          {name}
        </h1>
        <p className="text-lg text-gray-600 mt-1">{title}</p>
        <div className="mt-3 text-xs text-gray-500 space-y-0.5">
          <p>{phone}</p>
          <p>{email}</p>
          <p>{address}</p>
        </div>
      </div>

      {summary && (
        <NewResumeSection title="Profile Summary">
          <p className="text-sm leading-relaxed text-gray-700">{summary}</p>
        </NewResumeSection>
      )}

      {experience && experience.length > 0 && (
        <NewResumeSection title="Experience">
          {experience.map((exp) => (
            <div key={exp.id} className="mb-4 last:mb-2">
              <h3 className="font-bold text-gray-800">{exp.company}</h3>
              <p className="italic text-xs text-indigo-600">
                {exp.title} | {exp.duration}
              </p>
              <ul className="list-disc list-inside text-xs text-gray-700 ml-2 mt-1 space-y-0.5">
                {exp.points &&
                  exp.points.map((point, j) => <li key={j}>{point}</li>)}
              </ul>
            </div>
          ))}
        </NewResumeSection>
      )}

      {education && education.length > 0 && (
        <NewResumeSection title="Education">
          {education.map((edu) => (
            <div key={edu.id} className="mb-3 last:mb-1">
              <p className="font-medium text-gray-800">{edu.year}</p>
              <p className="text-xs text-gray-700">{edu.degree}</p>
              <p className="italic text-xs text-indigo-600">
                {edu.institution}
              </p>
            </div>
          ))}
        </NewResumeSection>
      )}

      {skills && skills.length > 0 && (
        <NewResumeSection title="Skills">
          <ul className="list-disc list-inside text-xs text-gray-700 pl-2 grid grid-cols-2 gap-x-4">
            {skills.map((skill, i) => (
              <li key={i}>{skill}</li>
            ))}
          </ul>
        </NewResumeSection>
      )}

      {languages && languages.length > 0 && (
        <NewResumeSection title="Languages">
          <ul className="list-disc list-inside text-xs text-gray-700 pl-2">
            {languages.map((lang) => (
              <li key={lang.id}>
                <strong>{lang.name}</strong>: {lang.level}
              </li>
            ))}
          </ul>
        </NewResumeSection>
      )}
    </div>
  );
});

// --- New Resume Edit Form Component (adapted from user's new template) ---
const NewResumeEditForm = ({ formData, setFormData }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleNestedChange = (section, index, field, value) => {
    const updatedSection = [...formData[section]];
    updatedSection[index] = { ...updatedSection[index], [field]: value };
    setFormData((prev) => ({ ...prev, [section]: updatedSection }));
  };

  const handleExperiencePointChange = (expIndex, pointIndex, value) => {
    const updatedExperience = [...formData.experience];
    // Ensure points array exists
    if (!updatedExperience[expIndex].points) {
      updatedExperience[expIndex].points = [];
    }
    updatedExperience[expIndex].points[pointIndex] = value;
    setFormData((prev) => ({ ...prev, experience: updatedExperience }));
  };

  const addExperience = () => {
    setFormData((prev) => ({
      ...prev,
      experience: [
        ...prev.experience,
        {
          id: `exp${Date.now()}`,
          company: '',
          title: '',
          duration: '',
          points: [''],
        },
      ],
    }));
  };

  const removeExperience = (index) => {
    setFormData((prev) => ({
      ...prev,
      experience: prev.experience.filter((_, i) => i !== index),
    }));
  };

  const addExperiencePoint = (expIndex) => {
    const updatedExperience = [...formData.experience];
    // Ensure points array exists
    if (!updatedExperience[expIndex].points) {
      updatedExperience[expIndex].points = [];
    }
    updatedExperience[expIndex].points.push('');
    setFormData((prev) => ({ ...prev, experience: updatedExperience }));
  };

  const removeExperiencePoint = (expIndex, pointIndex) => {
    const updatedExperience = [...formData.experience];
    updatedExperience[expIndex].points = updatedExperience[
      expIndex
    ].points.filter((_, i) => i !== pointIndex);
    setFormData((prev) => ({ ...prev, experience: updatedExperience }));
  };

  const addEducation = () => {
    setFormData((prev) => ({
      ...prev,
      education: [
        ...prev.education,
        { id: `edu${Date.now()}`, year: '', degree: '', institution: '' },
      ],
    }));
  };
  const removeEducation = (index) => {
    setFormData((prev) => ({
      ...prev,
      education: prev.education.filter((_, i) => i !== index),
    }));
  };

  const handleSkillsChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      skills: e.target.value
        .split(',')
        .map((s) => s.trim())
        .filter((s) => s),
    }));
  };

  const addLanguage = () => {
    setFormData((prev) => ({
      ...prev,
      languages: [
        ...prev.languages,
        { id: `lang${Date.now()}`, name: '', level: '' },
      ],
    }));
  };
  const removeLanguage = (index) => {
    setFormData((prev) => ({
      ...prev,
      languages: prev.languages.filter((_, i) => i !== index),
    }));
  };

  const FormSection = ({ title, children }) => (
    <div className="mb-6 p-4 border rounded-md bg-slate-50">
      <h3 className="text-lg font-semibold text-indigo-600 mb-3">{title}</h3>
      {children}
    </div>
  );

  return (
    <div className="bg-white rounded-xl p-6 shadow-lg space-y-6">
      <h2 className="text-2xl font-bold text-gray-700 mb-6 text-center">
        Resume Editor
      </h2>

      <FormSection title="Personal Information">
        {['name', 'title', 'phone', 'email', 'address'].map((field) => (
          <div key={field} className="mb-3">
            <label className="block text-sm font-medium text-gray-700 capitalize mb-1">
              {field}:
            </label>
            <input
              name={field}
              value={formData[field]}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
        ))}
      </FormSection>

      <FormSection title="Profile Summary">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Summary:
        </label>
        <textarea
          name="summary"
          value={formData.summary}
          onChange={handleChange}
          rows="4"
          className="w-full border border-gray-300 p-2 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
        />
      </FormSection>

      <FormSection title="Experience">
        {formData.experience.map((exp, i) => (
          <div
            key={exp.id}
            className="border border-gray-300 rounded-lg p-4 space-y-3 mb-4 bg-white relative"
          >
            <button
              onClick={() => removeExperience(i)}
              className="absolute top-2 right-2 text-red-500 hover:text-red-700 p-1"
            >
              <Trash2 size={18} />
            </button>
            {['company', 'title', 'duration'].map((field) => (
              <div key={field}>
                <label className="block text-sm font-medium text-gray-700 capitalize mb-1">
                  {field}:
                </label>
                <input
                  value={exp[field]}
                  onChange={(e) =>
                    handleNestedChange('experience', i, field, e.target.value)
                  }
                  className="w-full border border-gray-300 p-2 rounded-md shadow-sm"
                />
              </div>
            ))}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Points:
              </label>
              {exp.points &&
                exp.points.map((pt, j) => (
                  <div key={j} className="flex items-center mb-2">
                    <input
                      value={pt}
                      onChange={(e) =>
                        handleExperiencePointChange(i, j, e.target.value)
                      }
                      className="w-full border border-gray-300 p-2 rounded-md shadow-sm"
                    />
                    <button
                      onClick={() => removeExperiencePoint(i, j)}
                      className="ml-2 text-red-500 hover:text-red-700 p-1"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              <button
                onClick={() => addExperiencePoint(i)}
                className="text-indigo-600 text-sm mt-1 hover:underline flex items-center"
              >
                <PlusCircle size={16} className="mr-1" /> Add Point
              </button>
            </div>
          </div>
        ))}
        <button
          onClick={addExperience}
          className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 flex items-center"
        >
          <PlusCircle size={18} className="mr-2" /> Add Experience
        </button>
      </FormSection>

      <FormSection title="Education">
        {formData.education.map((edu, i) => (
          <div
            key={edu.id}
            className="border border-gray-300 rounded-lg p-4 space-y-3 mb-4 bg-white relative"
          >
            <button
              onClick={() => removeEducation(i)}
              className="absolute top-2 right-2 text-red-500 hover:text-red-700 p-1"
            >
              <Trash2 size={18} />
            </button>
            {['year', 'degree', 'institution'].map((field) => (
              <div key={field}>
                <label className="block text-sm font-medium text-gray-700 capitalize mb-1">
                  {field}:
                </label>
                <input
                  value={edu[field]}
                  onChange={(e) =>
                    handleNestedChange('education', i, field, e.target.value)
                  }
                  className="w-full border border-gray-300 p-2 rounded-md shadow-sm"
                />
              </div>
            ))}
          </div>
        ))}
        <button
          onClick={addEducation}
          className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 flex items-center"
        >
          <PlusCircle size={18} className="mr-2" /> Add Education
        </button>
      </FormSection>

      <FormSection title="Skills">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Skills (comma-separated):
        </label>
        <textarea
          value={formData.skills.join(', ')}
          onChange={handleSkillsChange}
          className="w-full border border-gray-300 p-2 rounded-md shadow-sm"
          rows="3"
        />
      </FormSection>

      <FormSection title="Languages">
        {formData.languages.map((lang, i) => (
          <div
            key={lang.id}
            className="border border-gray-300 rounded-lg p-4 space-y-3 mb-4 bg-white relative"
          >
            <button
              onClick={() => removeLanguage(i)}
              className="absolute top-2 right-2 text-red-500 hover:text-red-700 p-1"
            >
              <Trash2 size={18} />
            </button>
            {['name', 'level'].map((field) => (
              <div key={field}>
                <label className="block text-sm font-medium text-gray-700 capitalize mb-1">
                  {field}:
                </label>
                <input
                  value={lang[field]}
                  onChange={(e) =>
                    handleNestedChange('languages', i, field, e.target.value)
                  }
                  className="w-full border border-gray-300 p-2 rounded-md shadow-sm"
                />
              </div>
            ))}
          </div>
        ))}
        <button
          onClick={addLanguage}
          className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 flex items-center"
        >
          <PlusCircle size={18} className="mr-2" /> Add Language
        </button>
      </FormSection>
    </div>
  );
};

// --- AI Assistant Modal (from Canvas) ---
const AiAssistantModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;
  const tips = [
    "Use strong action verbs (e.g., 'Led', 'Developed', 'Managed').",
    "Quantify achievements with numbers (e.g., 'Increased user engagement by 20%').",
    'Tailor your resume to the job description.',
    'Keep summary concise (2-3 sentences) and impactful.',
    'Proofread meticulously for errors.',
    'Ensure contact info is current and professional.',
  ];
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 no-print">
      <div className="bg-white p-6 md:p-8 rounded-lg shadow-xl max-w-lg w-full max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-indigo-700 flex items-center">
            <Sparkles className="mr-2 h-6 w-6 text-indigo-500" />
            AI Resume Tips
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={24} />
          </button>
        </div>
        <ul className="space-y-3 text-sm text-gray-700">
          {tips.map((tip, index) => (
            <li key={index} className="flex items-start">
              <Lightbulb
                size={18}
                className="mr-3 mt-0.5 text-indigo-500 flex-shrink-0"
              />
              <span>{tip}</span>
            </li>
          ))}
        </ul>
        <button
          onClick={onClose}
          className="mt-6 w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          Got it!
        </button>
      </div>
    </div>
  );
};

// --- Main App Component (combining Canvas features with new template) ---
function App() {
  const [resumeData, setResumeData] = useState(initialNewResumeData); // Using new data structure
  const [viewMode, setViewMode] = useState('preview');
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [isAiDropdownOpen, setIsAiDropdownOpen] = useState(false);
  const aiDropdownRef = useRef(null);
  const resumePreviewNewRef = useRef(null); // Ref for the new resume preview component

  // Updated download handler to use window.print()
  const handleDownload = () => {
    const currentView = viewMode;
    if (viewMode === 'edit') {
      setViewMode('preview'); // Switch to preview for printing
      setTimeout(() => {
        window.print();
        setViewMode(currentView); // Switch back after print dialog
      }, 100); // Delay to allow DOM update
    } else {
      window.print();
    }
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        aiDropdownRef.current &&
        !aiDropdownRef.current.contains(event.target)
      ) {
        setIsAiDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [aiDropdownRef]);

  // Print styles for window.print()
  useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = `
      @media print {
        body * { visibility: hidden !important; }
        .printable-area, .printable-area * { visibility: visible !important; }
        .printable-area { 
          position: absolute !important; 
          left: 0 !important; 
          top: 0 !important; 
          width: 100% !important; 
          margin: 0 !important; 
          padding: 20mm !important; /* Consistent padding for print */
          box-shadow: none !important; 
          border: none !important; 
          font-size: 10pt !important; /* Adjust font size for print if needed */
        }
        .no-print { display: none !important; }
        @page { 
          margin: 20mm; /* Standard page margins */
          size: letter; /* Or A4, auto */
        } 
        /* Ensure text colors are print-friendly */
        .printable-area, .printable-area h1, .printable-area h2, .printable-area h3, .printable-area p, .printable-area li, .printable-area span, .printable-area strong, .printable-area div {
            color: black !important;
            background-color: white !important; /* Ensure white background */
            -webkit-print-color-adjust: exact !important; /* Force color printing for browsers that support it */
            print-color-adjust: exact !important;
        }
        .printable-area .text-indigo-700, .printable-area .text-indigo-600 { /* Example: make brand colors darker or black for print */
            color: #283593 !important; /* A darker indigo, or just black */
        }

      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  const SidebarButton = ({
    onClick,
    icon,
    label,
    isActive,
    isAccent = false,
    showChevron = false,
    isDropdownOpen = false,
  }) => (
    <button
      onClick={onClick}
      className={`w-full flex items-center justify-between p-3 rounded-lg text-sm font-medium transition-colors duration-150
                  ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-md'
                      : isAccent
                      ? 'bg-amber-400 text-slate-800 hover:bg-amber-500 shadow-sm'
                      : 'text-gray-700 hover:bg-indigo-100 hover:text-indigo-700'
                  }`}
    >
      <div className="flex items-center space-x-3">
        {React.createElement(icon, { className: 'h-5 w-5' })}
        <span>{label}</span>
      </div>
      {showChevron &&
        (isDropdownOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />)}
    </button>
  );

  return (
    <>
      <div className="flex flex-col md:flex-row min-h-screen bg-gray-100 font-sans">
        <aside className="w-full md:w-72 bg-white p-4 md:p-6 shadow-lg no-print md:sticky md:top-0 md:h-screen flex flex-col">
          <div className="mb-8 text-center">
            <h1 className="text-2xl font-bold text-indigo-700">
              ResumeCraft Pro
            </h1>
            <p className="text-xs text-gray-500">Modern Resume Builder</p>
          </div>
          <nav className="space-y-3 flex-grow">
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
            <div className="relative" ref={aiDropdownRef}>
              <SidebarButton
                onClick={() => setIsAiDropdownOpen(!isAiDropdownOpen)}
                icon={Sparkles}
                label="AI Assistant"
                isActive={isAiModalOpen || isAiDropdownOpen}
                isAccent={true}
                showChevron={true}
                isDropdownOpen={isAiDropdownOpen}
              />
              {isAiDropdownOpen && (
                <div className="absolute left-0 right-0 mt-1 z-20">
                  <div className="mx-2 p-2 bg-white rounded-md shadow-xl border border-gray-200">
                    {resumeData.summary && (
                      <button
                        onClick={() => {
                          setIsAiModalOpen(true);
                          setIsAiDropdownOpen(false);
                        }}
                        className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-indigo-100 rounded-md flex items-center"
                      >
                        <Lightbulb size={16} className="mr-2 text-indigo-500" />{' '}
                        Summary Assistance
                      </button>
                    )}
                    {resumeData.experience &&
                      resumeData.experience.length > 0 && (
                        <button
                          onClick={() => {
                            setIsAiModalOpen(true);
                            setIsAiDropdownOpen(false);
                          }}
                          className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-indigo-100 rounded-md flex items-center mt-1"
                        >
                          <Briefcase
                            size={16}
                            className="mr-2 text-indigo-500"
                          />{' '}
                          Experience Enhancing
                        </button>
                      )}
                    {!resumeData.summary &&
                      (!resumeData.experience ||
                        resumeData.experience.length === 0) && (
                        <p className="px-3 py-2 text-sm text-gray-500 text-center">
                          No specific AI tips.
                        </p>
                      )}
                    <button
                      onClick={() => {
                        setIsAiModalOpen(true);
                        setIsAiDropdownOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-indigo-100 rounded-md flex items-center mt-1 border-t border-gray-100 pt-2"
                    >
                      <Sparkles size={16} className="mr-2 text-indigo-500" />{' '}
                      General Writing Tips
                    </button>
                  </div>
                </div>
              )}
            </div>
            {/* Updated to call new handleDownload function */}
            <SidebarButton
              onClick={handleDownload}
              icon={Download}
              label="Download PDF"
              isActive={false}
            />
          </nav>
          <div className="mt-auto pt-6 border-t border-gray-200 text-center text-xs text-gray-500 hidden md:block">
            <p>&copy; {new Date().getFullYear()} ResumeCraft Pro.</p>
          </div>
        </aside>

        <main className="flex-1 p-4 md:p-8 lg:p-12 overflow-y-auto">
          {viewMode === 'preview' ? (
            // Pass the ref to NewResumePreview
            <NewResumePreview data={resumeData} ref={resumePreviewNewRef} />
          ) : (
            <NewResumeEditForm
              formData={resumeData}
              setFormData={setResumeData}
            />
          )}
        </main>
      </div>
      <AiAssistantModal
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
      />
    </>
  );
}

export default App;
