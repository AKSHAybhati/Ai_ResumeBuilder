import React, { useState, useEffect, useRef, useImperativeHandle, forwardRef } from "react";
import html2pdf from "html2pdf.js";
import {
  Mail, Linkedin, MapPin, Github, Briefcase, BookOpen, List as ListIconLucide, Award, Globe, Phone, Code,
  User, ChevronDown, UploadCloud, Edit3, Save as SaveIcon, Share2, ZoomIn, ZoomOut, RotateCcw,
  Palette, Type as TypeIcon, HelpCircle, Download as DownloadIcon, Trash2, PlusCircle, Star, Target, Zap, // Added Target, Zap
  Award as AwardIcon, // For Honors & Awards
  CalendarDays, // For Conferences & Courses
  Brain, // For Expertise
  Languages as LanguagesIcon, // For Languages
  MessageCircle, // For Summary
} from "lucide-react";

// Frontend Developer Task Instructions
// ... (Your instructions here) ...

const initialFormData = {
  name: "Thomas Shelby",
  title: "Business Development Executive",
  email: "thomas@novoresume.com",
  phone: "(555) 1919-1929",
  location: "London, UK",
  linkedin: "linkedin.com/in/thomas.shelby",
  github: "", // Not shown in this design's contact bar
  photo: "https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8cHJvZmVzc2lvbmFsJTIwbWFufGVufDB8fDB8fHww&auto=format&fit=crop&w=150&q=60", // Placeholder for Thomas Shelby
  summary: "Results-driven Business Development Executive with a sharp strategic mind and a reputation for disrupting industries and dominating markets. Adept at high-stakes negotiations, corporate expansion, and financial risk assessment. Skilled in developing innovative solutions for scaling businesses, optimizing revenue streams, and fostering high-impact partnerships. Excels in dynamic, high-pressure environments where adaptability and foresight are paramount.",
  experiences: [
    "CEO & Managing Director | Shelby Company Ltd. | 06/2016 - Present\n- Scaled operations globally, expanding into new markets across Europe, the U.S., and Asia.\n- Spearheaded multi-million-dollar acquisitions, integrating strategic partners into a growing corporate empire.\n- Negotiated high-profile contracts with Fortune 500 clients and private equity investors, securing record-breaking funding rounds.\n- Established a risk and security compliance division, ensuring corporate governance and legal protection in high-stakes industries.\n- Led a diversification strategy, successfully expanding into fintech, logistics, and cybersecurity sectors.",
    "Business Development Director | Small Heath Enterprises | 02/2010 - 05/2016\n- Increased annual revenue by 250% through data-driven market penetration strategies.\n- Introduced CRM automation, improving customer engagement and retention by 45%.\n- Developed a risk management framework to mitigate financial volatility and secure long-term profitability.\n- Led a cross-functional team in executing high-impact growth initiatives, optimizing supply chain logistics, and expanding distribution channels."
  ],
  education: [
    { inst: "London Business School", deg: "MBA in Business Strategy & Finance", from: "", to: "", aggregate: "Specialization in Competitive Strategy, Mergers & Acquisitions, and Global Markets" },
    // Add more education if needed by the design
  ],
  skills: [ // For "Expertise" section
    "Market Intelligence & Competitive Analysis", "Strategic Growth & Expansion",
    "Advanced Negotiation & Stakeholder Management", "Financial Forecasting & Investment Strategy",
    "Risk Mitigation & Crisis Management", "AI & Machine Learning for Business Insights",
    "Cybersecurity & Compliance Frameworks", "CRM & Automation (Salesforce, HubSpot)"
  ],
  achievements: [ // For "Honors & Awards"
    "European Business Titan Award (2021) - Recognized for innovative leadership in global expansion",
    "Top 50 CEOs in Emerging Markets (2020) - For spearheading transformative business growth",
    "Strategic Disruptor of the Year (2019) - Awarded for aggressive market dominance strategies"
  ],
  conferencesCourses: [
    "Davos World Economic Forum Speaker (2023) - On global market shifts & industry dominance",
    "MIT Sloan Executive Summit on AI in Business (2022) - Leveraging AI for predictive business strategy",
    "The Art of War in Business (2021) - Keynote on corporate warfare strategies"
  ],
  languages: [
    { name: "English", proficiencyText: "Native or Bilingual Proficiency", level: 5 }, // level is still there for form input
    { name: "French", proficiencyText: "Full Professional Proficiency", level: 4 },
    { name: "Mandarin", proficiencyText: "Full Professional Proficiency", level: 3 }
  ],
  certifications: [], // Not explicitly shown in this design, but form field can remain
  fontFamily: "'Merriweather Sans', sans-serif", // A clean, professional sans-serif
  accentColor: "#3B82F6", // Blue accent as seen in the image's title
  // No sidebar specific colors as this design doesn't use a colored sidebar in preview
};

const fontOptions = [
    { value: "'Merriweather Sans', sans-serif", label: "Merriweather Sans" },
    { value: "'Lato', sans-serif", label: "Lato" },
    { value: "'Open Sans', sans-serif", label: "Open Sans" },
    { value: "'Roboto', sans-serif", label: "Roboto" },
    { value: "'Montserrat', sans-serif", label: "Montserrat" },
    { value: "'Source Sans Pro', sans-serif", label: "Source Sans Pro" },
    { value: "'Nunito Sans', sans-serif", label: "Nunito Sans" },
    { value: "'Inter', sans-serif", label: "Inter" },
];

// PrintStyles and Helper Components (FormSection, ListInputForm, DropdownButton) remain mostly the same
// ... (Copy these from the previous good version - I'll include them for completeness)
const PrintStyles = () => (
  <style>{`
    @media print { 
      .no-print { display: none !important; } 
      html, body { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
      #resume-content-wrapper { margin: 0 !important; box-shadow: none !important; } /* PDF specific print styles */
    }
    .custom-scrollbar::-webkit-scrollbar { width: 8px; height: 8px; }
    .custom-scrollbar::-webkit-scrollbar-track { background: #f1f1f1; border-radius: 10px; }
    .custom-scrollbar::-webkit-scrollbar-thumb { background: #c1c1c1; border-radius: 10px; }
    .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #a1a1a1; }
    .input { @apply block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 sm:text-sm; }
    .btn { @apply font-medium transition-colors duration-150; }
  `}</style>
);


function FormSection({ title, children, accentColor, onAskAI, sectionKey, icon: Icon }) {
  return (
    <div className="mb-6 bg-white p-4 rounded-lg shadow-sm">
      <div className="flex justify-between items-center border-b pb-2 mb-3"
           style={{ borderColor: accentColor ? `${accentColor}40` : 'var(--gray-300)' }}>
        <h3 className="text-md font-semibold flex items-center" style={{ color: accentColor || 'var(--default-cyan-700)' }}>
          {Icon && <Icon size={18} className="mr-2" />}
          {title}
        </h3>
        {onAskAI && sectionKey && (
          <button
            type="button"
            onClick={() => onAskAI(sectionKey)}
            className="text-xs px-2 py-1 rounded flex items-center space-x-1 hover:opacity-80 transition-opacity"
            style={{ backgroundColor: accentColor ? `${accentColor}20` : '#e0f2fe', color: accentColor || 'var(--default-cyan-700)' }}
          >
            <HelpCircle size={14} />
            <span>Ask AI</span>
          </button>
        )}
      </div>
      {children}
    </div>
  );
}

function ListInputForm({ value, onChange, onAdd, placeholder, accentColor, buttonText="Add" }) {
  return (
    <div className="flex items-center gap-2 mb-3">
      <input
        type="text"
        placeholder={placeholder}
        className="input flex-1 focus:ring-2"
        style={{borderColor: accentColor ? `${accentColor}80` : '#D1D5DB', focusRingColor: accentColor }}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && onAdd()}
      />
      <button
        type="button"
        className="btn text-white px-4 py-2 rounded-md hover:opacity-90 transition text-sm flex items-center space-x-1"
        style={{ backgroundColor: accentColor || '#0891B2' }}
        onClick={onAdd}
      >
        <PlusCircle size={16}/> <span>{buttonText}</span>
      </button>
    </div>
  );
}

function DropdownButton({ label, icon: Icon, options, accentColor }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) setIsOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button onClick={() => setIsOpen(!isOpen)} className="btn bg-gray-200 hover:bg-gray-300 text-gray-800 px-3 py-2 rounded-md flex items-center space-x-2 text-sm">
        <Icon size={18}/> <span>{label}</span> <ChevronDown size={16} />
      </button>
      {isOpen && (
        <div className="absolute z-30 mt-1 w-56 bg-white rounded-md shadow-lg border border-gray-200">
          {options.map((option, index) => (
            <button key={index} onClick={() => { option.action(); setIsOpen(false); }}
              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2">
              {option.icon} <span>{option.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}


const ResumeFormFields = forwardRef(({ formData, setFormData, onAskAI }, ref) => {
  const [inputs, setInputs] = useState({
    skill: "", achievement: "", languageName: "", languageLevel: 3, languageProficiencyText: "Native", certification: "",
    experience: "", project: "", conferencesCourse: "",
    eduInstitution: "", eduDegree: "", eduFrom: "", eduTo: "", eduAggregate: "" // eduFrom and eduTo might be less used for this design
  });

  const localFileInputRef = useRef(null);
  useImperativeHandle(ref, () => ({
    triggerResumeUpload: () => localFileInputRef.current?.click(),
  }));

  const handleMainInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleLocalInputChange = (e) => {
    const { name, value } = e.target;
    setInputs(prev => ({ ...prev, [name]: value }));
  };
  
  const handlePhotoUpload = (e) => {
    if (e.target.files[0]) {
      setFormData(prev => ({ ...prev, photo: URL.createObjectURL(e.target.files[0]) }));
    }
  };

  const handleResumeFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      alert(`Resume "${file.name}" uploaded. AI processing would simulate here.`);
      if (e.target) e.target.value = null;
    }
  };

  const addListItem = (arrayKey, inputKey, resetValue = "") => {
    const value = inputs[inputKey]?.trim();
    if (!value) return;
    setFormData(prev => ({ ...prev, [arrayKey]: [...(prev[arrayKey] || []), value] }));
    setInputs(prev => ({ ...prev, [inputKey]: resetValue }));
  };

  const addLanguageItem = () => {
    if (!inputs.languageName.trim()) return;
    const newLang = { 
        name: inputs.languageName.trim(), 
        level: parseInt(inputs.languageLevel, 10), // Keep level for internal/other templates
        proficiencyText: inputs.languageProficiencyText.trim() || "Proficient"
    };
    setFormData(prev => ({ ...prev, languages: [...(prev.languages || []), newLang] }));
    setInputs(prev => ({ ...prev, languageName: "", languageLevel: 3, languageProficiencyText: "Native" }));
  };

  const addEducationItem = () => {
    const { eduInstitution, eduDegree, eduFrom, eduTo, eduAggregate } = inputs; // eduFrom and eduTo might be optional for this design
    if (!eduInstitution.trim() || !eduDegree.trim()) return;
    const newEdu = { inst: eduInstitution.trim(), deg: eduDegree.trim(), from: eduFrom.trim(), to: eduTo.trim(), aggregate: eduAggregate.trim() };
    setFormData(prev => ({ ...prev, education: [...(prev.education || []), newEdu] }));
    setInputs(prev => ({ ...prev, eduInstitution: "", eduDegree: "", eduFrom: "", eduTo: "", eduAggregate: ""}));
  };
  
  const removeListItem = (arrayKey, index) => {
    setFormData(prev => ({ ...prev, [arrayKey]: prev[arrayKey].filter((_, i) => i !== index) }));
  };

  return (
    <div className="space-y-5">
        <input type="file" ref={localFileInputRef} onChange={handleResumeFileUpload} style={{ display: 'none' }} accept=".pdf,.doc,.docx,.txt" />
        <FormSection title="Header Information" icon={User} accentColor={formData.accentColor} onAskAI={onAskAI} sectionKey="header_info">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input name="name" placeholder="Full Name" value={formData.name} onChange={handleMainInputChange} className="input focus:ring-cyan-500" />
                <input name="title" placeholder="Professional Title" value={formData.title} onChange={handleMainInputChange} className="input focus:ring-cyan-500" />
            </div>
             <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Profile Photo</label>
              <input type="file" onChange={handlePhotoUpload} className="input w-full file:mr-4 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-cyan-50 file:text-cyan-700 hover:file:bg-cyan-100" accept="image/*" />
            </div>
             <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Summary (Below Title)</label>
                <textarea name="summary" rows={4} placeholder="Main professional summary..." value={formData.summary} onChange={handleMainInputChange} className="input w-full focus:ring-cyan-500"/>
            </div>
        </FormSection>

        <FormSection title="Contact Bar Information" icon={Phone} accentColor={formData.accentColor} onAskAI={onAskAI} sectionKey="contact_info">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input name="email" type="email" placeholder="Email Address" value={formData.email} onChange={handleMainInputChange} className="input focus:ring-cyan-500" />
                <input name="phone" placeholder="Phone Number" value={formData.phone} onChange={handleMainInputChange} className="input focus:ring-cyan-500" />
                <input name="location" placeholder="Location (City, Country)" value={formData.location} onChange={handleMainInputChange} className="input focus:ring-cyan-500" />
                <input name="linkedin" placeholder="LinkedIn URL (e.g., linkedin.com/in/username)" value={formData.linkedin} onChange={handleMainInputChange} className="input focus:ring-cyan-500" />
            </div>
        </FormSection>
        
        {[
            { title: "Work Experience", key: "experiences", inputKey: "experience", icon: Briefcase, placeholder: "Role | Company | Dates\\n- Responsibility/Achievement" },
            { title: "Expertise (Skills)", key: "skills", inputKey: "skill", icon: Brain, placeholder: "Add an expertise area or skill" },
            { title: "Honors & Awards", key: "achievements", inputKey: "achievement", icon: AwardIcon, placeholder: "Award Name (Year) - Description" },
            { title: "Conferences & Courses", key: "conferencesCourses", inputKey: "conferencesCourse", icon: CalendarDays, placeholder: "Event/Course Name (Year) - Description" },
        ].map(section => (
            <FormSection key={section.key} title={section.title} icon={section.icon} accentColor={formData.accentColor} onAskAI={onAskAI} sectionKey={section.key}>
                <ListInputForm placeholder={section.placeholder} value={inputs[section.inputKey]} onChange={(val) => setInputs(prev => ({...prev, [section.inputKey]: val}))} onAdd={() => addListItem(section.key, section.inputKey)} accentColor={formData.accentColor} />
                <ul className="space-y-1 text-sm">
                    {formData[section.key]?.map((item, i) => (
                        <li key={i} className="flex justify-between items-start p-1.5 bg-gray-50 rounded">
                            <span className="whitespace-pre-line flex-grow mr-2">{item}</span> 
                            <button onClick={() => removeListItem(section.key, i)} className="text-red-500 hover:text-red-700 p-0.5"><Trash2 size={14}/></button>
                        </li>
                    ))}
                </ul>
            </FormSection>
        ))}
        
        <FormSection title="Languages" icon={LanguagesIcon} accentColor={formData.accentColor} onAskAI={onAskAI} sectionKey="languages">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                <input name="languageName" placeholder="Language (e.g., English)" value={inputs.languageName} onChange={handleLocalInputChange} className="input focus:ring-cyan-500" />
                <input name="languageProficiencyText" placeholder="Proficiency (e.g., Native)" value={inputs.languageProficiencyText} onChange={handleLocalInputChange} className="input focus:ring-cyan-500" />
            </div>
            <button type="button" className="btn text-white px-4 py-2 rounded-md hover:opacity-90 transition text-sm flex items-center space-x-1" style={{backgroundColor: formData.accentColor}} onClick={addLanguageItem}> <PlusCircle size={16}/> <span>Add Language</span> </button>
            <ul className="space-y-1 text-sm mt-2">
                {formData.languages?.map((lang, i) => (
                    <li key={i} className="flex justify-between items-center p-1.5 bg-gray-50 rounded">
                        <span>{lang.name} ({lang.proficiencyText})</span>
                        <button onClick={() => removeListItem("languages", i)} className="text-red-500 hover:text-red-700 p-0.5"><Trash2 size={14}/></button>
                    </li>
                ))}
            </ul>
        </FormSection>

        <FormSection title="Education" icon={BookOpen} accentColor={formData.accentColor} onAskAI={onAskAI} sectionKey="education">
            <div className="space-y-3 mb-3">
                <input name="eduInstitution" placeholder="Institution Name" value={inputs.eduInstitution} onChange={handleLocalInputChange} className="input w-full focus:ring-cyan-500" />
                <input name="eduDegree" placeholder="Degree (e.g., MBA in Business Strategy)" value={inputs.eduDegree} onChange={handleLocalInputChange} className="input w-full focus:ring-cyan-500" />
                <input name="eduAggregate" placeholder="Details (e.g., Specialization...)" value={inputs.eduAggregate} onChange={handleLocalInputChange} className="input w-full focus:ring-cyan-500" />
            </div>
            <button type="button" className="btn text-white px-4 py-2 rounded-md hover:opacity-90 transition text-sm flex items-center space-x-1" style={{backgroundColor: formData.accentColor}} onClick={addEducationItem}> <PlusCircle size={16}/> <span>Add Education</span> </button>
            <ul className="space-y-1 text-sm mt-2">
                {formData.education?.map((edu, i) => (
                    <li key={i} className="p-1.5 bg-gray-50 rounded">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="font-semibold">{edu.deg}</p>
                                <p className="text-xs text-gray-600">{edu.inst} {edu.aggregate && `| ${edu.aggregate}`}</p>
                            </div>
                            <button onClick={() => removeListItem("education", i)} className="text-red-500 hover:text-red-700 p-0.5"><Trash2 size={14}/></button>
                        </div>
                    </li>
                ))}
            </ul>
        </FormSection>
    </div>
  );
});


// Resume Preview Component (Thomas Shelby Design)
function ResumePreview({ formData }) {
  const CONTACT_BAR_BG = "#323B4C"; // Dark slate/charcoal
  const CONTACT_BAR_TEXT = "#E2E8F0"; // Light gray (slate-200)

  // Helper for main content sections
  const MainContentSectionPreview = ({ title, icon: Icon, children, className = "" }) => (
    <div className={`mb-6 ${className}`}>
      <div className="flex items-center mb-2">
        {Icon && <Icon size={18} className="mr-2" style={{ color: formData.accentColor }} />}
        <h3 className="text-xs font-bold uppercase tracking-wider text-gray-600">{title}</h3>
      </div>
      {children}
    </div>
  );

  return (
    <div id="resume-content-wrapper" className="bg-white text-gray-800 shadow-lg" style={{ fontFamily: formData.fontFamily, width: '210mm', minHeight: '297mm', margin: '0 auto' }}>
      {/* Top Header Section */}
      <div className="p-8 flex flex-row items-start gap-6">
        {formData.photo && (
          <img src={formData.photo} alt="Profile" className="w-28 h-28 md:w-32 md:h-32 rounded-full object-cover flex-shrink-0 mt-1 shadow-md" />
        )}
        <div className="flex-grow">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-1">{formData.name || "YOUR NAME"}</h1>
          <p className="text-xl md:text-2xl font-light mb-3" style={{ color: formData.accentColor }}>{formData.title || "Your Professional Title"}</p>
          <p className="text-sm text-gray-600 leading-relaxed">{formData.summary || "Your detailed professional summary goes here, highlighting key skills, experiences, and career objectives."}</p>
        </div>
      </div>

      {/* Contact Information Bar */}
      <div className="py-3 px-8 flex flex-wrap justify-around items-center text-xs" style={{ backgroundColor: CONTACT_BAR_BG, color: CONTACT_BAR_TEXT }}>
        {formData.email && <div className="flex items-center gap-1.5 p-1"><Mail size={14} /> {formData.email}</div>}
        {formData.phone && <div className="flex items-center gap-1.5 p-1"><Phone size={14} /> {formData.phone}</div>}
        {formData.location && <div className="flex items-center gap-1.5 p-1"><MapPin size={14} /> {formData.location}</div>}
        {formData.linkedin && <div className="flex items-center gap-1.5 p-1"><Linkedin size={14} /> <a href={`https://`+formData.linkedin} target="_blank" rel="noopener noreferrer" className="hover:underline">{formData.linkedin}</a></div>}
      </div>

      {/* Main Content Area (Two Columns) */}
      <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-6">
        {/* Left Column (Wider) */}
        <div className="md:col-span-2 space-y-6">
          {formData.experiences?.length > 0 && (
            <MainContentSectionPreview title="Work Experience" icon={Briefcase}>
              <ul className="space-y-4">
                {formData.experiences.map((exp, i) => {
                  const lines = exp.split('\n');
                  const titleLine = lines[0];
                  const points = lines.slice(1);
                  const [role, company, dates] = titleLine.split('|').map(s => s.trim());
                  return (
                    <li key={i} className="text-sm">
                      <h4 className="font-semibold text-md text-gray-800">{role}</h4>
                      <p className="text-gray-700 text-sm mb-0.5">{company}</p>
                      {dates && <p className="text-xs mb-1" style={{color: formData.accentColor}}>{dates}</p>}
                      <ul className="list-disc list-outside pl-5 space-y-0.5 text-gray-600 leading-relaxed text-xs">
                        {points.map((point, pi) => point.trim() && <li key={pi}>{point.replace(/^- /, '')}</li>)}
                      </ul>
                    </li>
                  );
                })}
              </ul>
            </MainContentSectionPreview>
          )}
           {formData.education?.length > 0 && (
            <MainContentSectionPreview title="Education" icon={BookOpen}>
              <ul className="space-y-3">
                {formData.education.map((edu, i) => (
                  <li key={i} className="text-sm">
                    <h4 className="font-semibold text-md text-gray-800">{edu.deg}</h4>
                    <p className="text-gray-700">{edu.inst}</p>
                    {edu.aggregate && <p className="text-xs text-gray-500 mt-0.5 list-disc list-outside pl-5">{edu.aggregate.replace(/^- /, '')}</p>}
                  </li>
                ))}
              </ul>
            </MainContentSectionPreview>
          )}
        </div>

        {/* Right Column (Narrower) */}
        <div className="md:col-span-1 space-y-6">
          {formData.skills?.length > 0 && (
            <MainContentSectionPreview title="Expertise" icon={Brain}>
              <ul className="space-y-1 text-sm">
                {formData.skills.map((skill, i) => (
                  <li key={i} className="text-gray-700 leading-relaxed">{skill}</li>
                ))}
              </ul>
            </MainContentSectionPreview>
          )}
          {formData.achievements?.length > 0 && (
             <MainContentSectionPreview title="Honors & Awards" icon={AwardIcon}>
                <ul className="space-y-2 text-sm">
                    {formData.achievements.map((item, i) => {
                        const [title, ...descParts] = item.split(' - ');
                        const description = descParts.join(' - ');
                        return (
                            <li key={i} className="text-gray-700 leading-relaxed">
                                <span className="font-semibold block">{title}</span>
                                {description && <span className="text-xs text-gray-500 block">{description}</span>}
                            </li>
                        );
                    })}
                </ul>
            </MainContentSectionPreview>
          )}
          {formData.conferencesCourses?.length > 0 && (
             <MainContentSectionPreview title="Conferences & Courses" icon={CalendarDays}>
                <ul className="space-y-2 text-sm">
                    {formData.conferencesCourses.map((item, i) => {
                        const [title, ...descParts] = item.split(' - ');
                        const description = descParts.join(' - ');
                        return (
                             <li key={i} className="text-gray-700 leading-relaxed">
                                <span className="font-semibold block">{title}</span>
                                {description && <span className="text-xs text-gray-500 block">{description}</span>}
                            </li>
                        );
                    })}
                </ul>
            </MainContentSectionPreview>
          )}
          {formData.languages?.length > 0 && (
            <MainContentSectionPreview title="Languages" icon={LanguagesIcon}>
              <ul className="space-y-1 text-sm">
                {formData.languages.map((lang, i) => (
                  <li key={i} className="flex justify-between items-center text-gray-700">
                    <span>{lang.name}</span>
                    <span className="text-xs" style={{color: formData.accentColor}}>{lang.proficiencyText}</span>
                  </li>
                ))}
              </ul>
            </MainContentSectionPreview>
          )}
        </div>
      </div>
    </div>
  );
}


// App Component (Main structure, logic remains similar)
export default function App() {
  const [formData, setFormData] = useState(initialFormData);
  const [zoomLevel, setZoomLevel] = useState(1);
  const resumeFormRef = useRef(null);

  useEffect(() => {
    document.title = formData.name ? `${formData.name} | Resume` : "Resume Builder";
    localStorage.setItem("shelbyStyleResumeData", JSON.stringify(formData));
  }, [formData]);

  useEffect(() => {
    const savedData = localStorage.getItem("shelbyStyleResumeData");
    if (savedData) {
      try {
        setFormData(prev => ({...initialFormData, ...JSON.parse(savedData)}));
      } catch (e) { console.error("Error parsing saved data", e); }
    }
  }, []);

  const exportToPDF = () => {
    const elementToCapture = document.getElementById('resume-content-wrapper'); // Capture the A4 div
    if (!elementToCapture) {
        console.error("Resume content wrapper not found for PDF export.");
        return;
    }
    const opt = {
      margin: 0, 
      filename: `${formData.name ? formData.name.replace(/\s+/g, "_") : "resume"}.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { 
          scale: 2.5,
          useCORS: true,
          logging: false,
          width: elementToCapture.offsetWidth, // Use actual width of the element
          windowWidth: elementToCapture.offsetWidth,
          onclone: (document) => {
            const contactBar = document.querySelector('.py-3.px-8'); // Selector for contact bar
            if (contactBar) contactBar.style.backgroundColor = "#323B4C"; // Fixed dark color for contact bar in clone
          }
      },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
    };
    html2pdf().from(elementToCapture).set(opt).save();
  };
  

  const handleAISuggestion = (sectionKey) => alert(`AI assistance for "${sectionKey.replace(/_/g, ' ')}" will be simulated here.`);
  const handleTriggerUploadForAI = () => resumeFormRef.current?.triggerResumeUpload();
  const handleSave = () => alert("Resume Saved (Simulated - data is auto-saved to Local Storage)");
  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href)
      .then(() => alert('Share link (current URL) copied! (Placeholder for unique link)'))
      .catch(() => alert('Could not copy link.'));
  };

  const uploadOptions = [ { label: "Manual Edit", icon: <Edit3 size={16}/>, action: () => {} }, { label: "AI Edit - Upload Resume", icon: <UploadCloud size={16}/>, action: handleTriggerUploadForAI }, ];
  const aiAssistantOptions = [ { label: "Improve Summary", icon: <TypeIcon size={16}/>, action: () => handleAISuggestion("summary") }, { label: "Enhance Experience", icon: <TypeIcon size={16}/>, action: () => handleAISuggestion("experiences") }, { label: "Refine Expertise", icon: <TypeIcon size={16}/>, action: () => handleAISuggestion("skills") }, ]; // "skills" maps to Expertise

  return (
    <>
      <PrintStyles />
      <div className="min-h-screen bg-gray-100 p-2 sm:p-4 md:p-6 font-sans text-gray-800">
        <header className="bg-white p-3 mb-4 rounded-lg shadow-md top-2 z-20">
            <div className="flex flex-wrap gap-2 items-center justify-start">
                <DropdownButton label="Upload" icon={UploadCloud} options={uploadOptions} accentColor={formData.accentColor} />
                <DropdownButton label="AI Assistant" icon={Palette} options={aiAssistantOptions} accentColor={formData.accentColor} />
                <button onClick={handleSave} className="btn bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-md flex items-center space-x-2 text-sm"><SaveIcon size={18}/> <span>Save</span></button>
                <button onClick={handleShare} className="btn bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded-md flex items-center space-x-2 text-sm"><Share2 size={18}/> <span>Share</span></button>
                <button onClick={exportToPDF} className="btn bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-md flex items-center space-x-2 text-sm"><DownloadIcon size={18}/> <span>Download PDF</span></button>
            </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          <aside className="md:col-span-5 lg:col-span-4 bg-gray-50 p-3 rounded-lg shadow custom-scrollbar overflow-y-auto max-h-[calc(100vh-100px)] no-print">
            <div className="bg-white p-4 rounded-lg shadow-sm mb-4">
              <h2 className="text-lg font-semibold mb-3 text-center" style={{color: formData.accentColor}}>Customize Appearance</h2>
              <div className="space-y-3">
                <div>
                  <label htmlFor="fontFamily" className="block text-sm font-medium text-gray-700 mb-0.5">Font Style</label>
                  <select id="fontFamily" name="fontFamily" value={formData.fontFamily} onChange={(e) => setFormData(prev => ({...prev, fontFamily: e.target.value}))} className="input w-full text-sm focus:ring-cyan-500"> {fontOptions.map(font => <option key={font.value} value={font.value}>{font.label}</option>)} </select>
                </div>
                <div>
                  <label htmlFor="accentColor" className="block text-sm font-medium text-gray-700 mb-0.5">Accent Color <small>(for title, icons etc.)</small></label>
                  <input type="color" id="accentColor" name="accentColor" value={formData.accentColor} onChange={(e) => setFormData(prev => ({...prev, accentColor: e.target.value}))} className="input w-full h-9 p-0.5"/>
                </div>
              </div>
            </div>
            <ResumeFormFields ref={resumeFormRef} formData={formData} setFormData={setFormData} onAskAI={handleAISuggestion} />
          </aside>

          <main className="md:col-span-7 lg:col-span-8">
            <div className="top-[84px] z-10 flex items-center justify-center md:justify-end gap-2 mb-2 bg-gray-100 py-1 rounded">
                <span className="text-sm font-medium text-gray-700 hidden md:inline">Zoom:</span>
                <button onClick={() => setZoomLevel(prev => Math.max(0.25, prev - 0.1))} className="btn p-1.5 bg-white hover:bg-gray-200 rounded-md shadow"><ZoomOut size={16}/></button>
                <button onClick={() => setZoomLevel(1)} className="btn p-1.5 bg-white hover:bg-gray-200 rounded-md shadow"><RotateCcw size={16}/></button>
                <button onClick={() => setZoomLevel(prev => Math.min(1.5, prev + 0.1))} className="btn p-1.5 bg-white hover:bg-gray-200 rounded-md shadow"><ZoomIn size={16}/></button>
                <span className="text-xs text-gray-600 bg-white px-1.5 py-0.5 rounded-md shadow">{(zoomLevel * 100).toFixed(0)}%</span>
            </div>
            <div id="resume-preview-area" className="bg-gray-200 p-2 md:p-4 rounded-lg custom-scrollbar overflow-auto max-h-[calc(100vh-130px)] flex justify-center items-start" style={{ transform: `scale(${zoomLevel})`, transformOrigin: 'top center', transition: 'transform 0.2s ease-out' }}>
                <ResumePreview formData={formData} />
            </div>
          </main>
        </div>
      </div>
    </>
  );
}