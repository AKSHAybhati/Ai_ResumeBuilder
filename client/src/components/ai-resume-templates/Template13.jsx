import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import { motion } from "framer-motion";

// Add global styles for extra small text
const globalStyles = `
  .text-xxs {
    font-size: 0.625rem;
    line-height: 0.75rem;
  }
`;

const Sidebar = React.memo(
  ({
    setActiveSection,
    handleAIEnhancement,
    handleDownload,
    handleShare,
    branding,
    handleBrandingToggle,
    handleUploadResume,
    handleColorPicker,
    handleSaveResume,
  }) => {
    return (
      <div className="lg:w-72 bg-white text-gray-800 p-4 lg:p-6 shadow-2xl border-b lg:border-r lg:border-b-0 border-gray-200 flex flex-row lg:flex-col items-center lg:items-start overflow-x-auto lg:overflow-x-visible lg:rounded-r-3xl">
        <div className="flex flex-row lg:flex-col items-center lg:items-start space-x-3 lg:space-x-0 lg:space-y-6 z-10 w-full">
          <h3 className="text-xl lg:text-2xl font-bold mb-0 lg:mb-6 text-gray-800 hidden lg:block whitespace-nowrap">
            Resume Tools
          </h3>

          <button
            className="w-12 h-12 lg:w-full lg:h-auto bg-blue-500 text-white rounded-full p-2 lg:p-3 shadow-lg flex items-center justify-center lg:flex-row lg:justify-start lg:space-x-2 flex-shrink-0"
            onClick={() => setActiveSection("rearrange")}
          >
            <span className="text-lg">↕️</span>
            <span className="hidden lg:inline">Rearrange</span>
          </button>

          <button
            className="w-12 h-12 lg:w-full lg:h-auto bg-red-500 text-white rounded-full p-2 lg:p-3 shadow-lg flex items-center justify-center lg:flex-row lg:justify-start lg:space-x-2 flex-shrink-0"
            onClick={handleAIEnhancement}
          >
            <span className="text-lg">🤖</span>
            <span className="hidden lg:inline">AI Assistant</span>
          </button>

          <button
            className="w-12 h-12 lg:w-full lg:h-auto bg-purple-500 text-white rounded-full p-2 lg:p-3 shadow-lg flex items-center justify-center lg:flex-row lg:justify-start lg:space-x-2 flex-shrink-0"
            onClick={handleColorPicker}
          >
            <span className="text-lg">🎨</span>
            <span className="hidden lg:inline">Color</span>
          </button>

          <button
            className="w-12 h-12 lg:w-full lg:h-auto bg-purple-500 text-white rounded-full p-2 lg:p-3 shadow-lg flex items-center justify-center lg:flex-row lg:justify-start lg:space-x-2 flex-shrink-0"
            onClick={handleSaveResume}
          >
            <span className="text-lg">💾</span>
            <span className="hidden lg:inline">Save Resume</span>
          </button>

          <hr className="border-gray-300 my-2 w-full hidden lg:block" />

          <button
            className="w-12 h-12 lg:w-full lg:h-auto bg-yellow-500 text-white rounded-full p-2 lg:p-3 shadow-lg flex items-center justify-center lg:flex-row lg:justify-start lg:space-x-2 flex-shrink-0"
            onClick={handleDownload}
          >
            <span className="text-lg">⬇️</span>
            <span className="hidden lg:inline">Download</span>
          </button>

          <button
            className="w-12 h-12 lg:w-full lg:h-auto bg-green-500 text-white rounded-full p-2 lg:p-3 shadow-lg flex items-center justify-center lg:flex-row lg:justify-start lg:space-x-2 flex-shrink-0"
            onClick={handleShare}
          >
            <span className="text-lg">🔗</span>
            <span className="hidden lg:inline">Share</span>
          </button>

          <div className="flex flex-col lg:flex-row items-center lg:justify-between mt-2 lg:w-full flex-shrink-0">
            <span className="text-gray-800 font-medium hidden lg:block whitespace-nowrap">
              Branding
            </span>
            <label className="relative inline-flex items-center cursor-pointer mt-1 lg:mt-0">
              <input
                type="checkbox"
                checked={branding}
                onChange={handleBrandingToggle}
                className="sr-only"
              />
              <div className="w-12 h-6 bg-gray-300 rounded-full relative transition-all duration-300">
                <div
                  className="absolute w-5 h-5 bg-gray-600 rounded-full left-0.5 top-0.5 transition-transform duration-300"
                  style={{
                    transform: branding ? "translateX(24px)" : "translateX(0)",
                  }}
                />
              </div>
            </label>
          </div>

          <button
            className="w-12 h-12 lg:w-full lg:h-auto bg-purple-500 text-white rounded-full p-2 lg:p-3 shadow-lg flex items-center justify-center lg:flex-row lg:justify-start lg:space-x-2 flex-shrink-0"
            onClick={handleUploadResume}
          >
            <span className="text-lg">⬆️</span>
            <span className="hidden lg:inline">Upload Resume</span>
          </button>
        </div>
      </div>
    );
  },
);

const ResumeEditor = () => {
  const [resumeData, setResumeData] = useState({
    name: "ADITYA TIWARY",
    role: "Medical Doctor",
    phone: "+1-918-768-6057",
    email: "dradityatiwary@gmail.com",
    linkedin: "https://www.linkedin.com/in/dr-aditya-tiwary/",
    location: "Chicago, IL",
    summary:
      "Board-certified Medical Doctor with 8 years of clinical practice specializing in Internal Medicine. Managed a diverse patient population, conducting over 5,000 patient consultations annually. Skilled in diagnosis, treatment planning, and patient education. Committed to providing evidence-based care with a compassionate approach. Seeking to leverage my clinical expertise at Chicago Memorial Hospital.",
    experience: [
      {
        title: "Attending Physician",
        companyName: "Northwestern Memorial Hospital",
        date: "2018 - 2022",
        companyLocation: "Chicago, IL",
        accomplishment:
          "• Led a team of 5 residents and 3 medical students in a busy internal medicine department\n" +
          "• Diagnosed and treated 30+ patients daily with various acute and chronic conditions\n" +
          "• Performed 200+ medical procedures including lumbar punctures and central line placements\n" +
          "• Reduced hospital readmission rates by 15% through comprehensive discharge planning\n" +
          "• Published 3 research papers in peer-reviewed medical journals on chronic disease management",
      },
      {
        title: "Resident Physician",
        companyName: "University of Chicago Medical Center",
        date: "2016 - 2018",
        companyLocation: "Chicago, IL",
        accomplishment:
          "• Completed comprehensive training in internal medicine treating 1000+ patients annually\n" +
          "• Conducted daily rounds for 15-20 patients, formulating treatment plans and follow-up care\n" +
          "• Participated in 150+ emergency room consultations and admissions\n" +
          "• Achieved 95% patient satisfaction scores based on hospital surveys\n" +
          "• Presented 5 case studies at departmental conferences on complex medical conditions",
      },
      {
        title: "Medical Intern",
        companyName: "Rush University Medical Center",
        date: "2014 - 2016",
        companyLocation: "Chicago, IL",
        accomplishment:
          "• Rotated through various specialties including cardiology, pulmonology, and gastroenterology\n" +
          "• Assisted attending physicians in diagnosing and treating 500+ patients\n" +
          "• Participated in 75+ medical procedures under direct supervision\n" +
          "• Completed electronic medical record documentation for 20+ patients daily\n" +
          "• Received Excellence in Patient Care award for exceptional bedside manner",
      },
    ],
    education: [
      {
        degree: "Doctor of Medicine (MD)",
        institution: "University of Illinois College of Medicine",
        duration: "08/2010 - 05/2014",
        location: "Chicago, IL",
      },
      {
        degree: "Bachelor of Science in Biology",
        institution: "Northwestern University",
        duration: "09/2006 - 05/2010",
        location: "Evanston, IL",
      },
    ],
    philosophy: {
      quote:
        "The good physician treats the disease; the great physician treats the patient who has the disease.",
      author: "— William Osler",
    },
    expertise: [
      { skill: "Clinical Diagnosis", value: 0.9 },
      { skill: "Patient Communication", value: 0.8 },
      { skill: "Medical Procedures", value: 0.8 },
      { skill: "Evidence-based Medicine", value: 0.9 },
    ],
    strengths: [
      {
        title: "Clinical Reasoning",
        description:
          "Able to analyze complex symptoms and medical histories to arrive at accurate diagnoses.",
      },
      {
        title: "Crisis Management",
        description:
          "Maintain composure and sound decision-making under high-pressure emergency situations.",
      },
      {
        title: "Empathetic Communication",
        description:
          "Skilled at explaining complex medical concepts to patients in an understandable and compassionate way.",
      },
    ],
    achievements: [
      {
        title: "Research Publication",
        description:
          "Lead author on a study published in the New England Journal of Medicine on innovative approaches to chronic disease management, 2020.",
      },
    ],
    languages: [
      { name: "English", level: "Native", dots: 5 },
      { name: "Spanish", level: "Advanced", dots: 4 },
    ],
    skills: [
      { category: "Clinical Diagnosis", items: ["Clinical Diagnosis"] },
      { category: "Medical Procedures", items: ["Medical Procedures"] },
      { category: "Patient Education", items: ["Patient Education"] },
      {
        category: "Electronic Medical Records",
        items: ["Electronic Medical Records"],
      },
      { category: "Critical Care", items: ["Critical Care"] },
      { category: "ACLS", items: ["ACLS"] },
      { category: "Research", items: ["Research"] },
      {
        category: "Chronic Disease Management",
        items: ["Chronic Disease Management"],
      },
      { category: "Emergency Medicine", items: ["Emergency Medicine"] },
    ],
    references: [
      {
        name: "Dr. Sarah Williams",
        title: "Chief of Medicine, Northwestern Memorial Hospital",
        contact: "+1-312-468-7235",
      },
    ],
  });

  const [showButtons, setShowButtons] = useState(true);
  const [photo, setPhoto] = useState(null);
  const [branding, setBranding] = useState(true);
  const [sectionSettings, setSectionSettings] = useState({
    header: {
      showTitle: true,
      showPhone: true,
      showLink: true,
      showEmail: true,
      showLocation: true,
      uppercaseName: true,
      showPhoto: false,
    },
    summary: { showSummary: true },
    experience: { showExperience: true },
    education: { showEducation: true },
    achievements: { showAchievements: true },
    languages: { showLanguages: true },
    skills: { showSkills: true },
    philosophy: { showPhilosophy: true },
    expertise: { showExpertise: true },
    strengths: { showStrengths: true },
    references: { showReferences: true },
  });

  const [activeSection, setActiveSection] = useState(null);
  const [sectionsOrder, setSectionsOrder] = useState([
    "summary",
    "experience",
    "education",
    "philosophy",
    "expertise",
  ]);
  const [showShareNotification, setShowShareNotification] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [showAIErrorPopup, setShowAIErrorPopup] = useState(false);
  const [showUploadErrorPopup, setShowUploadErrorPopup] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [activeColor, setActiveColor] = useState("#000000");
  const resumeRef = useRef(null);

  const colors = [
    { name: "Black", value: "#000000" },
    { name: "Gray", value: "#666666" },
    { name: "Blue", value: "#2563EB" },
    { name: "Red", value: "#DC2626" },
    { name: "Green", value: "#16A34A" },
    { name: "Purple", value: "#9333EA" },
    { name: "Orange", value: "#F97316" },
  ];

  const [aiMenuPosition, setAiMenuPosition] = useState(null);
  const [showAIMenu, setShowAIMenu] = useState(false);
  const [showSaveNotification, setShowSaveNotification] = useState(false);

  const handleAIEnhancement = useCallback((e) => {
    const button = e.currentTarget;
    const rect = button.getBoundingClientRect();
    setAiMenuPosition({
      top: rect.bottom,
      left: rect.left,
    });
    setShowAIMenu(true);
  }, []);

  const handleAIMenuClose = useCallback(() => {
    setShowAIMenu(false);
  }, []);

  const handleEnhanceSection = useCallback((section) => {
    setShowAIMenu(false);
    setShowAIErrorPopup(true);
    setTimeout(() => setShowAIErrorPopup(false), 3000);
  }, []);

  const handleColorPicker = useCallback(() => {
    setShowColorPicker(true);
  }, []);

  const handleSaveResume = useCallback(() => {
    try {
      const dataToSave = {
        resumeData,
        sectionSettings,
        branding,
        sectionsOrder,
      };

      const dataStr = JSON.stringify(dataToSave);
      const dataUri =
        "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);

      const exportFileDefaultName = "resume-data.json";

      const linkElement = document.createElement("a");
      linkElement.setAttribute("href", dataUri);
      linkElement.setAttribute("download", exportFileDefaultName);
      linkElement.click();

      setShowSaveNotification(true);
      setTimeout(() => setShowSaveNotification(false), 3000);
    } catch (error) {
      console.error("Error saving resume:", error);
      alert("Failed to save resume. Please try again.");
    }
  }, [resumeData, sectionSettings, branding, sectionsOrder]);

  useEffect(() => {
    const savedResume = localStorage.getItem("resumeData");
    if (savedResume) setResumeData(JSON.parse(savedResume));

    const savedSettings = localStorage.getItem("sectionSettings");
    if (savedSettings) setSectionSettings(JSON.parse(savedSettings));

    const savedBranding = localStorage.getItem("branding");
    if (savedBranding) setBranding(JSON.parse(savedBranding));
  }, []);

  useEffect(() => {
    localStorage.setItem("resumeData", JSON.stringify(resumeData));
    localStorage.setItem("sectionSettings", JSON.stringify(sectionSettings));
    localStorage.setItem("branding", JSON.stringify(branding));
  }, [resumeData, sectionSettings, branding]);

  const handleInputChange = useCallback(
    (section, field, value, index = null) => {
      if (index !== null) {
        const updatedSection = [...(resumeData[section] || [])];
        updatedSection[index][field] = value;
        setResumeData((prev) => ({ ...prev, [section]: updatedSection }));
      } else {
        setResumeData((prev) => ({ ...prev, [field]: value }));
      }
    },
    [resumeData],
  );

  const handleAddSection = useCallback((section) => {
    const newItem =
      {
        experience: {
          title: "New Position",
          companyName: "Company Name",
          date: "2023 - Present",
          companyLocation: "City, State, Country",
          accomplishment:
            "• Add your accomplishments here\n• Second achievement",
        },
        education: {
          degree: "Degree Name",
          institution: "Institution Name",
          duration: "Year - Year",
          location: "City, State, Country",
        },
        achievements: {
          title: "New Achievement",
          description: "Describe your achievement here",
        },
        languages: {
          name: "New Language",
          level: "Beginner",
          dots: 1,
        },
        skills: {
          category: "New Category",
          items: ["Skill 1", "Skill 2"],
        },
        strengths: {
          title: "New Strength",
          description: "Describe your strength here",
        },
        expertise: {
          skill: "New Expertise",
          value: 0.5,
        },
        references: {
          name: "Reference Name",
          title: "Company or Position",
          contact: "Contact Info",
        },
      }[section] || {};

    setResumeData((prev) => ({
      ...prev,
      [section]: [...(prev[section] || []), newItem],
    }));
  }, []);

  const handleRemoveSection = useCallback(
    (section, index) => {
      const updatedSection = [...(resumeData[section] || [])];
      updatedSection.splice(index, 1);
      setResumeData((prev) => ({ ...prev, [section]: updatedSection }));
    },
    [resumeData],
  );

  const handleSkillItemChange = useCallback(
    (skillIndex, itemIndex, value) => {
      const updatedSkills = [...resumeData.skills];
      updatedSkills[skillIndex].items[itemIndex] = value;
      setResumeData((prev) => ({ ...prev, skills: updatedSkills }));
    },
    [resumeData],
  );

  const handleAddSkillItem = useCallback(
    (skillIndex) => {
      const updatedSkills = [...resumeData.skills];
      updatedSkills[skillIndex].items.push("New Skill");
      setResumeData((prev) => ({ ...prev, skills: updatedSkills }));
    },
    [resumeData],
  );

  const handleLanguageLevelChange = useCallback(
    (index, level) => {
      const dotsMap = { Native: 5, Advanced: 4, Beginner: 1 };
      const updatedLanguages = [...resumeData.languages];
      updatedLanguages[index].level = level;
      updatedLanguages[index].dots = dotsMap[level];
      setResumeData((prev) => ({ ...prev, languages: updatedLanguages }));
    },
    [resumeData],
  );

  const handleDownload = useCallback(async () => {
    setShowButtons(false);
    setActiveSection(null);
    setIsDownloading(true);

    try {
      const resumeElement = resumeRef.current;
      if (!resumeElement) {
        console.error("Resume element not found");
        setShowButtons(true);
        setIsDownloading(false);
        return;
      }

      // Ensure all content is rendered
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Capture the full resume content
      const canvas = await html2canvas(resumeElement, {
        scale: 2,
        useCORS: true,
        logging: true,
        scrollX: 0,
        scrollY: 0,
        windowWidth: resumeElement.scrollWidth,
        windowHeight: resumeElement.scrollHeight,
        height: resumeElement.scrollHeight,
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const pageWidth = pdf.internal.pageSize.getWidth();
      const imgWidth = pageWidth;
      const imgHeight = Math.min(
        (canvas.height * pageWidth) / canvas.width,
        pdf.internal.pageSize.getHeight(),
      );

      // Only add a single page with the content scaled to fit
      pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);

      pdf.save("resume.pdf");
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Failed to generate PDF. Please try again.");
    } finally {
      setShowButtons(true);
      setIsDownloading(false);
    }
  }, []);

  const handleShare = useCallback(() => {
    const resumeLink = window.location.href;
    navigator.clipboard
      .writeText(resumeLink)
      .then(() => {
        setShowShareNotification(true);
        setTimeout(() => setShowShareNotification(false), 3000);
      })
      .catch(() => alert("Failed to copy link to clipboard."));
  }, []);

  const handleUploadResume = useCallback(() => {
    setShowUploadErrorPopup(true);
    setTimeout(() => setShowUploadErrorPopup(false), 3000);
  }, []);

  const handleSettingChange = useCallback((section, setting) => {
    setSectionSettings((prev) => ({
      ...prev,
      [section]: { ...prev[section], [setting]: !prev[section][setting] },
    }));
  }, []);

  const handleBrandingToggle = useCallback(
    () => setBranding((prev) => !prev),
    [],
  );

  const handleSettingsClick = useCallback((section) => {
    setActiveSection((prev) => (prev === section ? null : section));
  }, []);

  const handleMoveSectionUp = useCallback(
    (index) => {
      if (index > 0) {
        const newOrder = [...sectionsOrder];
        [newOrder[index - 1], newOrder[index]] = [
          newOrder[index],
          newOrder[index - 1],
        ];
        setSectionsOrder(newOrder);
      }
    },
    [sectionsOrder],
  );

  const handleMoveSectionDown = useCallback(
    (index) => {
      if (index < sectionsOrder.length - 1) {
        const newOrder = [...sectionsOrder];
        [newOrder[index + 1], newOrder[index]] = [
          newOrder[index],
          newOrder[index + 1],
        ];
        setSectionsOrder(newOrder);
      }
    },
    [sectionsOrder],
  );

  const applyColorToSelection = useCallback((color) => {
    const selection = window.getSelection();
    if (selection.rangeCount) {
      const range = selection.getRangeAt(0);
      const span = document.createElement("span");
      span.style.color = color;
      range.surroundContents(span);
    }
    setShowColorPicker(false);
    setActiveColor(color);
  }, []);

  const LoadingScreen = useMemo(
    () => (
      <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500 mb-4"></div>
          <p className="text-white text-xl font-semibold">
            Enhancing your resume...
          </p>
        </div>
      </div>
    ),
    [],
  );

  const DownloadPreloader = () => (
    <motion.div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex flex-col items-center bg-white p-6 rounded-lg shadow-lg">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500 mb-4"></div>
        <p className="text-gray-800 text-lg font-semibold">Generating PDF...</p>
      </div>
    </motion.div>
  );

  const ShareNotification = () => (
    <motion.div
      className="fixed top-4 right-4 bg-green-500 text-white p-4 rounded-lg shadow-lg z-50"
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 100 }}
      transition={{ duration: 0.3 }}
    >
      Link copied to clipboard!
    </motion.div>
  );

  const AIErrorPopup = () => (
    <motion.div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.3 }}
    >
      <div className="bg-white p-6 rounded-lg shadow-lg w-80 max-w-full mx-4 text-center">
        <p className="text-lg font-semibold text-red-600 mb-4">
          AI Assistant unavailable <br />
          Try again later
        </p>
        <button
          onClick={() => setShowAIErrorPopup(false)}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors"
        >
          Close
        </button>
      </div>
    </motion.div>
  );

  const UploadErrorPopup = () => (
    <motion.div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.3 }}
    >
      <div className="bg-white p-6 rounded-lg shadow-lg w-80 max-w-full mx-4 text-center">
        <p className="text-lg font-semibold text-red-600 mb-4">
          Upload feature unavailable <br />
          Try again later
        </p>
        <button
          onClick={() => setShowUploadErrorPopup(false)}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors"
        >
          Close
        </button>
      </div>
    </motion.div>
  );

  const ColorPickerPopup = () => (
    <motion.div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.3 }}
    >
      <div className="bg-white p-6 rounded-lg shadow-lg w-80 max-w-full mx-4">
        <h3 className="text-lg font-bold mb-4 text-gray-800">Select Color</h3>
        <div className="grid grid-cols-4 gap-2">
          {colors.map((color) => (
            <button
              key={color.name}
              className="w-10 h-10 rounded-full border border-gray-300 hover:border-gray-500 transition-colors"
              style={{ backgroundColor: color.value }}
              onClick={() => applyColorToSelection(color.value)}
              title={color.name}
            />
          ))}
        </div>
        <div className="mt-4 flex justify-end">
          <button
            onClick={() => setShowColorPicker(false)}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </motion.div>
  );

  const SaveNotification = () => (
    <motion.div
      className="fixed top-4 right-4 bg-blue-500 text-white p-4 rounded-lg shadow-lg z-50"
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 100 }}
      transition={{ duration: 0.3 }}
    >
      Resume data saved!
    </motion.div>
  );

  // Add style tag to document head for text-xxs class
  useEffect(() => {
    const styleTag = document.createElement("style");
    styleTag.innerHTML = globalStyles;
    document.head.appendChild(styleTag);
    return () => {
      document.head.removeChild(styleTag);
    };
  }, []);

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-gray-100">
      <Sidebar
        setActiveSection={setActiveSection}
        handleAIEnhancement={handleAIEnhancement}
        handleDownload={handleDownload}
        handleShare={handleShare}
        branding={branding}
        handleBrandingToggle={handleBrandingToggle}
        handleUploadResume={handleUploadResume}
        handleColorPicker={handleColorPicker}
        handleSaveResume={handleSaveResume}
      />

      <div className="flex-1 p-2 sm:p-4 lg:p-6 overflow-auto flex justify-center">
        <div
          className="bg-white shadow-md w-full lg:w-auto"
          style={{
            width: "100%",
            maxWidth: "210mm",
            minHeight: "297mm",
            boxSizing: "border-box",
          }}
        >
          <div
            ref={resumeRef}
            className="flex flex-col resume-content"
            style={{
              width: "100%",
              minHeight: "297mm",
              boxSizing: "border-box",
              overflow: "hidden",
            }}
          >
            {/* MAIN LAYOUT - Split between left content and right sidebar */}
            <div className="flex flex-col lg:flex-row h-full">
              {/* LEFT CONTENT AREA */}
              <div className="w-full lg:w-[70%] p-3 sm:p-4 lg:p-5">
                {/* HEADER SECTION */}
                <div className="mb-4">
                  <h1
                    contentEditable
                    suppressContentEditableWarning
                    onBlur={(e) =>
                      handleInputChange(null, "name", e.target.innerText)
                    }
                    className="text-xl sm:text-2xl lg:text-2xl font-bold text-gray-900 tracking-wide"
                  >
                    {resumeData.name}
                  </h1>
                  {sectionSettings.header.showTitle && (
                    <h2
                      contentEditable
                      suppressContentEditableWarning
                      onBlur={(e) =>
                        handleInputChange(null, "role", e.target.textContent)
                      }
                      className="text-sm sm:text-base lg:text-base text-cyan-500 font-medium mt-0.5"
                    >
                      {resumeData.role}
                    </h2>
                  )}
                  <div className="flex flex-wrap gap-1 sm:gap-2 mt-1 text-xs text-gray-600">
                    {sectionSettings.header.showPhone && (
                      <div className="flex items-center">
                        <span className="mr-1">☎</span>
                        <span
                          contentEditable
                          suppressContentEditableWarning
                          onBlur={(e) =>
                            handleInputChange(
                              null,
                              "phone",
                              e.target.textContent,
                            )
                          }
                        >
                          {resumeData.phone}
                        </span>
                      </div>
                    )}
                    {sectionSettings.header.showEmail && (
                      <div className="flex items-center">
                        <span className="mr-1">✉</span>
                        <span
                          contentEditable
                          suppressContentEditableWarning
                          onBlur={(e) =>
                            handleInputChange(
                              null,
                              "email",
                              e.target.textContent,
                            )
                          }
                        >
                          {resumeData.email}
                        </span>
                      </div>
                    )}
                    {sectionSettings.header.showLink && (
                      <div className="flex items-center">
                        <span className="mr-1">🔗</span>
                        <span
                          contentEditable
                          suppressContentEditableWarning
                          onBlur={(e) =>
                            handleInputChange(
                              null,
                              "linkedin",
                              e.target.textContent,
                            )
                          }
                        >
                          {resumeData.linkedin}
                        </span>
                      </div>
                    )}
                    {sectionSettings.header.showLocation && (
                      <div className="flex items-center">
                        <span className="mr-1">📍</span>
                        <span
                          contentEditable
                          suppressContentEditableWarning
                          onBlur={(e) =>
                            handleInputChange(
                              null,
                              "location",
                              e.target.textContent,
                            )
                          }
                        >
                          {resumeData.location}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* SUMMARY SECTION */}
                {sectionSettings.summary.showSummary && (
                  <div className="mb-4 sm:mb-6">
                    <h2 className="text-sm sm:text-base font-bold text-gray-800 mb-1 flex items-center justify-between">
                      <span>SUMMARY</span>
                      {showButtons && activeSection === "summary" && (
                        <button
                          className="text-gray-500 hover:text-gray-700"
                          onClick={() => handleSettingsClick("summary")}
                          aria-label="Open summary settings"
                        >
                          ⚙
                        </button>
                      )}
                    </h2>
                    <p
                      contentEditable
                      suppressContentEditableWarning
                      onBlur={(e) =>
                        handleInputChange(null, "summary", e.target.textContent)
                      }
                      className="text-xs sm:text-sm text-gray-700 leading-relaxed"
                    >
                      {resumeData.summary}
                    </p>
                  </div>
                )}

                {/* EXPERIENCE SECTION */}
                {sectionSettings.experience.showExperience && (
                  <div className="mb-4 sm:mb-6">
                    <h2 className="text-sm sm:text-base font-bold text-gray-800 mb-1 flex items-center justify-between">
                      <span>EXPERIENCE</span>
                      {showButtons && activeSection === "experience" && (
                        <button
                          className="text-gray-500 hover:text-gray-700"
                          onClick={() => handleSettingsClick("experience")}
                          aria-label="Open experience settings"
                        >
                          ⚙
                        </button>
                      )}
                    </h2>
                    {resumeData.experience.map((exp, idx) => (
                      <div key={idx} className="mb-3 sm:mb-2">
                        <div className="mb-0.5">
                          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
                            <h3
                              contentEditable
                              suppressContentEditableWarning
                              onBlur={(e) =>
                                handleInputChange(
                                  "experience",
                                  "title",
                                  e.target.textContent,
                                  idx,
                                )
                              }
                              className="text-xs sm:text-sm font-bold text-gray-900"
                            >
                              {exp.title}
                            </h3>
                            <div className="text-xs sm:text-xxs text-gray-600 mt-1 sm:mt-0">
                              <span
                                contentEditable
                                suppressContentEditableWarning
                                onBlur={(e) =>
                                  handleInputChange(
                                    "experience",
                                    "date",
                                    e.target.textContent,
                                    idx,
                                  )
                                }
                              >
                                {exp.date}
                              </span>
                            </div>
                          </div>
                          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start">
                            <div>
                              <p
                                contentEditable
                                suppressContentEditableWarning
                                onBlur={(e) =>
                                  handleInputChange(
                                    "experience",
                                    "companyName",
                                    e.target.textContent,
                                    idx,
                                  )
                                }
                                className="text-xs sm:text-sm text-cyan-500"
                              >
                                {exp.companyName}
                              </p>
                            </div>
                            <div className="text-xs sm:text-xxs text-gray-600 mt-1 sm:mt-0">
                              <span
                                contentEditable
                                suppressContentEditableWarning
                                onBlur={(e) =>
                                  handleInputChange(
                                    "experience",
                                    "companyLocation",
                                    e.target.textContent,
                                    idx,
                                  )
                                }
                              >
                                {exp.companyLocation}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div
                          contentEditable
                          suppressContentEditableWarning
                          onBlur={(e) =>
                            handleInputChange(
                              "experience",
                              "accomplishment",
                              e.target.textContent,
                              idx,
                            )
                          }
                          className="text-xs sm:text-xxs text-gray-700 whitespace-pre-line leading-relaxed"
                        >
                          {exp.accomplishment}
                        </div>
                        {showButtons && (
                          <button
                            onClick={() =>
                              handleRemoveSection("experience", idx)
                            }
                            className="text-xs text-red-500 hover:text-red-700 mt-2 sm:mt-1 block"
                          >
                            Remove Experience
                          </button>
                        )}
                      </div>
                    ))}
                    {showButtons && (
                      <button
                        onClick={() => handleAddSection("experience")}
                        className="text-xs text-blue-500 hover:text-blue-700 mt-1"
                      >
                        Add Experience
                      </button>
                    )}
                  </div>
                )}

                {/* EDUCATION SECTION */}
                {sectionSettings.education.showEducation && (
                  <div className="mb-4 sm:mb-6">
                    <h2 className="text-sm sm:text-base font-bold text-gray-800 mb-1 flex items-center justify-between">
                      <span>EDUCATION</span>
                      {showButtons && activeSection === "education" && (
                        <button
                          className="text-gray-500 hover:text-gray-700"
                          onClick={() => handleSettingsClick("education")}
                          aria-label="Open education settings"
                        >
                          ⚙
                        </button>
                      )}
                    </h2>
                    {resumeData.education.map((edu, idx) => (
                      <div key={idx} className="mb-3 sm:mb-2">
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
                          <h3
                            contentEditable
                            suppressContentEditableWarning
                            onBlur={(e) =>
                              handleInputChange(
                                "education",
                                "degree",
                                e.target.textContent,
                                idx,
                              )
                            }
                            className="text-xs sm:text-sm font-bold text-gray-900"
                          >
                            {edu.degree}
                          </h3>
                        </div>
                        <div className="flex flex-col sm:flex-row sm:justify-between">
                          <p
                            contentEditable
                            suppressContentEditableWarning
                            onBlur={(e) =>
                              handleInputChange(
                                "education",
                                "institution",
                                e.target.textContent,
                                idx,
                              )
                            }
                            className="text-xs sm:text-sm text-gray-700"
                          >
                            {edu.institution}
                          </p>
                          <div className="text-xs sm:text-xxs text-gray-600 flex flex-col sm:items-end mt-1 sm:mt-0">
                            <span
                              contentEditable
                              suppressContentEditableWarning
                              onBlur={(e) =>
                                handleInputChange(
                                  "education",
                                  "duration",
                                  e.target.textContent,
                                  idx,
                                )
                              }
                            >
                              {edu.duration}
                            </span>
                          </div>
                        </div>
                        <div className="text-xs sm:text-sm text-gray-600">
                          <span
                            contentEditable
                            suppressContentEditableWarning
                            onBlur={(e) =>
                              handleInputChange(
                                "education",
                                "location",
                                e.target.textContent,
                                idx,
                              )
                            }
                          >
                            {edu.location}
                          </span>
                        </div>
                        {showButtons && (
                          <button
                            onClick={() =>
                              handleRemoveSection("education", idx)
                            }
                            className="text-xs text-red-500 hover:text-red-700 mt-2 sm:mt-1 block"
                          >
                            Remove Education
                          </button>
                        )}
                      </div>
                    ))}
                    {showButtons && (
                      <button
                        onClick={() => handleAddSection("education")}
                        className="text-xs text-blue-500 hover:text-blue-700 mt-1"
                      >
                        Add Education
                      </button>
                    )}
                  </div>
                )}

                {/* PHILOSOPHY SECTION */}
                {sectionSettings.philosophy?.showPhilosophy && (
                  <div className="mb-4 sm:mb-6">
                    <h2 className="text-sm sm:text-base font-bold text-gray-800 mb-1 flex items-center justify-between">
                      <span>MY LIFE PHILOSOPHY</span>
                      {showButtons && activeSection === "philosophy" && (
                        <button
                          className="text-gray-500 hover:text-gray-700"
                          onClick={() => handleSettingsClick("philosophy")}
                          aria-label="Open philosophy settings"
                        >
                          ⚙
                        </button>
                      )}
                    </h2>
                    <p
                      contentEditable
                      suppressContentEditableWarning
                      onBlur={(e) =>
                        handleInputChange(
                          null,
                          "philosophy",
                          e.target.textContent,
                        )
                      }
                      className="text-xs sm:text-sm text-gray-700 italic leading-relaxed"
                    >
                      {resumeData.philosophy.quote}
                    </p>
                    <p
                      contentEditable
                      suppressContentEditableWarning
                      className="text-xs sm:text-sm text-gray-500 mt-0.5"
                    >
                      {resumeData.philosophy.author}
                    </p>
                  </div>
                )}

                {/* INDUSTRY EXPERTISE SECTION */}
                {sectionSettings.expertise.showExpertise && (
                  <div className="mb-6">
                    <h2 className="text-base font-bold text-gray-800 mb-1 flex items-center justify-between">
                      <span>INDUSTRY EXPERTISE</span>
                      {showButtons && activeSection === "expertise" && (
                        <button
                          className="text-gray-500 hover:text-gray-700"
                          onClick={() => handleSettingsClick("expertise")}
                          aria-label="Open expertise settings"
                        >
                          ⚙
                        </button>
                      )}
                    </h2>
                    <div className="grid grid-cols-2 gap-2">
                      {resumeData.expertise.map((exp, idx) => (
                        <div key={idx} className="mb-1">
                          <div className="flex justify-between mb-0.5">
                            <span
                              contentEditable
                              suppressContentEditableWarning
                              onBlur={(e) =>
                                handleInputChange(
                                  "expertise",
                                  "skill",
                                  e.target.textContent,
                                  idx,
                                )
                              }
                              className="text-xs font-medium text-gray-700"
                            >
                              {exp.skill}
                            </span>
                          </div>
                          {showButtons ? (
                            <div className="relative w-full">
                              <div className="w-full bg-gray-200 rounded-full h-2 absolute top-0 left-0">
                                <div
                                  className="bg-blue-500 h-2 rounded-full"
                                  style={{ width: `${exp.value * 100}%` }}
                                ></div>
                              </div>
                              <input
                                type="range"
                                min="0"
                                max="100"
                                value={exp.value * 100}
                                onChange={(e) => {
                                  const updatedExpertise = [
                                    ...resumeData.expertise,
                                  ];
                                  updatedExpertise[idx].value =
                                    parseInt(e.target.value) / 100;
                                  setResumeData((prev) => ({
                                    ...prev,
                                    expertise: updatedExpertise,
                                  }));
                                }}
                                className="w-full h-2 bg-transparent relative z-10 appearance-none cursor-pointer"
                                style={{ opacity: 0 }}
                              />
                            </div>
                          ) : (
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-blue-500 h-2 rounded-full"
                                style={{ width: `${exp.value * 100}%` }}
                              ></div>
                            </div>
                          )}
                          {showButtons && (
                            <button
                              onClick={() =>
                                handleRemoveSection("expertise", idx)
                              }
                              className="text-xs text-red-500 hover:text-red-700 mt-1"
                            >
                              Remove
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                    {showButtons && (
                      <button
                        onClick={() => handleAddSection("expertise")}
                        className="text-xs text-blue-500 hover:text-blue-700 mt-1"
                      >
                        Add Expertise
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* RIGHT SIDEBAR - 30% with background color */}
              <div
                className="w-full lg:w-[30%] bg-[#1e3a5f] text-white p-3 lg:p-3"
                style={{ backgroundColor: "#1e3a5f" }}
              >
                {/* SKILLS SECTION */}
                {sectionSettings.skills.showSkills && (
                  <div className="mb-4 sm:mb-6">
                    <h2 className="text-sm sm:text-base font-bold border-b border-gray-600 pb-0.5 mb-2 flex items-center justify-between">
                      <span>SKILLS</span>
                      {showButtons && activeSection === "skills" && (
                        <button
                          className="text-gray-300 hover:text-gray-100"
                          onClick={() => handleSettingsClick("skills")}
                          aria-label="Open skills settings"
                        >
                          ⚙
                        </button>
                      )}
                    </h2>
                    <div className="text-xs sm:text-xs">
                      {resumeData.skills.map((skill, idx) => (
                        <div key={idx} className="flex items-center mb-1">
                          <span className="mr-1 text-blue-300">•</span>
                          <span
                            contentEditable
                            suppressContentEditableWarning
                            onBlur={(e) =>
                              handleInputChange(
                                "skills",
                                "category",
                                e.target.textContent,
                                idx,
                              )
                            }
                          >
                            {skill.category}
                          </span>
                        </div>
                      ))}
                    </div>
                    {showButtons && (
                      <button
                        onClick={() => handleAddSection("skills")}
                        className="text-xs text-blue-300 hover:text-blue-100 mt-2"
                      >
                        Add Skill Category
                      </button>
                    )}
                  </div>
                )}

                {/* EDUCATION DUPLICATE FOR SIDEBAR STYLING - HIDDEN IN MAIN LAYOUT */}
                {false && sectionSettings.education.showEducation && (
                  <div className="mb-6">
                    <h2 className="text-xl font-bold border-b border-gray-600 pb-1 mb-3">
                      EDUCATION
                    </h2>
                    {resumeData.education.map((edu, idx) => (
                      <div key={idx} className="mb-3">
                        <h3 className="text-sm font-bold">{edu.degree}</h3>
                        <p className="text-sm">{edu.institution}</p>
                        <div className="text-xs text-gray-300 flex justify-between">
                          <span>{edu.duration}</span>
                          <span>{edu.location}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* STRENGTHS SECTION */}
                {sectionSettings.strengths.showStrengths && (
                  <div className="mb-6">
                    <h2 className="text-base font-bold border-b border-gray-600 pb-0.5 mb-2 flex items-center justify-between">
                      <span>STRENGTHS</span>
                      {showButtons && activeSection === "strengths" && (
                        <button
                          className="text-gray-300 hover:text-gray-100"
                          onClick={() => handleSettingsClick("strengths")}
                          aria-label="Open strengths settings"
                        >
                          ⚙
                        </button>
                      )}
                    </h2>
                    {resumeData.strengths.map((strength, idx) => (
                      <div key={idx} className="mb-2">
                        <div className="flex items-center mb-0.5">
                          <span className="mr-1 text-cyan-300">
                            {idx === 0 && "❤️"}
                            {idx === 1 && "🧠"}
                            {idx === 2 && "😊"}
                            {idx > 2 && "✨"}
                          </span>
                          <h3
                            contentEditable
                            suppressContentEditableWarning
                            onBlur={(e) =>
                              handleInputChange(
                                "strengths",
                                "title",
                                e.target.textContent,
                                idx,
                              )
                            }
                            className="text-xs font-bold"
                          >
                            {strength.title}
                          </h3>
                        </div>
                        <p
                          contentEditable
                          suppressContentEditableWarning
                          onBlur={(e) =>
                            handleInputChange(
                              "strengths",
                              "description",
                              e.target.textContent,
                              idx,
                            )
                          }
                          className="text-xxs text-gray-300 pl-4"
                        >
                          {strength.description}
                        </p>
                        {showButtons && (
                          <button
                            onClick={() =>
                              handleRemoveSection("strengths", idx)
                            }
                            className="text-xs text-red-300 hover:text-red-100 mt-1 pl-6"
                          >
                            Remove
                          </button>
                        )}
                      </div>
                    ))}
                    {showButtons && (
                      <button
                        onClick={() => handleAddSection("strengths")}
                        className="text-xs text-blue-300 hover:text-blue-100 mt-1"
                      >
                        Add Strength
                      </button>
                    )}
                  </div>
                )}

                {/* ACHIEVEMENTS SECTION */}
                {sectionSettings.achievements.showAchievements && (
                  <div className="mb-6">
                    <h2 className="text-base font-bold border-b border-gray-600 pb-0.5 mb-2 flex items-center justify-between">
                      <span>ACHIEVEMENTS</span>
                      {showButtons && activeSection === "achievements" && (
                        <button
                          className="text-gray-300 hover:text-gray-100"
                          onClick={() => handleSettingsClick("achievements")}
                          aria-label="Open achievements settings"
                        >
                          ⚙
                        </button>
                      )}
                    </h2>
                    {resumeData.achievements.map((achievement, idx) => (
                      <div key={idx} className="mb-2">
                        <div className="flex items-center mb-0.5">
                          <span className="mr-1 text-yellow-300">🏆</span>
                          <h3
                            contentEditable
                            suppressContentEditableWarning
                            onBlur={(e) =>
                              handleInputChange(
                                "achievements",
                                "title",
                                e.target.textContent,
                                idx,
                              )
                            }
                            className="text-xs font-bold"
                          >
                            {achievement.title}
                          </h3>
                        </div>
                        <p
                          contentEditable
                          suppressContentEditableWarning
                          onBlur={(e) =>
                            handleInputChange(
                              "achievements",
                              "description",
                              e.target.textContent,
                              idx,
                            )
                          }
                          className="text-xxs text-gray-300 pl-4"
                        >
                          {achievement.description}
                        </p>
                        {showButtons && (
                          <button
                            onClick={() =>
                              handleRemoveSection("achievements", idx)
                            }
                            className="text-xs text-red-300 hover:text-red-100 mt-1 pl-6"
                          >
                            Remove
                          </button>
                        )}
                      </div>
                    ))}
                    {showButtons && (
                      <button
                        onClick={() => handleAddSection("achievements")}
                        className="text-xs text-blue-300 hover:text-blue-100 mt-1"
                      >
                        Add Achievement
                      </button>
                    )}
                  </div>
                )}

                {/* LANGUAGES SECTION */}
                {sectionSettings.languages.showLanguages && (
                  <div className="mb-6">
                    <h2 className="text-xl font-bold border-b border-gray-600 pb-1 mb-3 flex items-center justify-between">
                      <span>LANGUAGES</span>
                      {showButtons && activeSection === "languages" && (
                        <button
                          className="text-gray-300 hover:text-gray-100"
                          onClick={() => handleSettingsClick("languages")}
                          aria-label="Open languages settings"
                        >
                          ⚙
                        </button>
                      )}
                    </h2>
                    {resumeData.languages.map((lang, idx) => (
                      <div key={idx} className="mb-3">
                        <div className="flex justify-between items-center mb-1">
                          <p
                            contentEditable
                            suppressContentEditableWarning
                            onBlur={(e) =>
                              handleInputChange(
                                "languages",
                                "name",
                                e.target.textContent,
                                idx,
                              )
                            }
                            className="text-sm font-medium"
                          >
                            {lang.name}
                          </p>
                          {showButtons ? (
                            <select
                              value={lang.level}
                              onChange={(e) =>
                                handleLanguageLevelChange(idx, e.target.value)
                              }
                              className="text-xs text-white bg-blue-600 border border-blue-500 rounded p-1"
                            >
                              <option value="Beginner" className="bg-blue-600">
                                Beginner
                              </option>
                              <option value="Advanced" className="bg-blue-600">
                                Advanced
                              </option>
                              <option value="Native" className="bg-blue-600">
                                Native
                              </option>
                            </select>
                          ) : (
                            <p className="text-xs">{lang.level}</p>
                          )}
                        </div>
                        <div className="flex gap-1">
                          {[...Array(5)].map((_, i) => (
                            <span
                              key={i}
                              className={`w-2 h-2 rounded-full ${
                                i < lang.dots ? "bg-white" : "bg-gray-600"
                              }`}
                            ></span>
                          ))}
                        </div>
                        {showButtons && (
                          <button
                            onClick={() =>
                              handleRemoveSection("languages", idx)
                            }
                            className="text-xs text-red-300 hover:text-red-100 mt-1"
                          >
                            Remove Language
                          </button>
                        )}
                      </div>
                    ))}
                    {showButtons && (
                      <button
                        onClick={() => handleAddSection("languages")}
                        className="text-xs text-blue-300 hover:text-blue-100 mt-1"
                      >
                        Add Language
                      </button>
                    )}
                  </div>
                )}

                {/* REFERENCES SECTION */}
                {sectionSettings.references.showReferences && (
                  <div className="mb-6">
                    <h2 className="text-xl font-bold border-b border-gray-600 pb-1 mb-3 flex items-center justify-between">
                      <span>REFERENCES</span>
                      {showButtons && activeSection === "references" && (
                        <button
                          className="text-gray-300 hover:text-gray-100"
                          onClick={() => handleSettingsClick("references")}
                          aria-label="Open references settings"
                        >
                          ⚙
                        </button>
                      )}
                    </h2>
                    {resumeData.references.map((ref, idx) => (
                      <div key={idx} className="mb-3">
                        <h3
                          contentEditable
                          suppressContentEditableWarning
                          onBlur={(e) =>
                            handleInputChange(
                              "references",
                              "name",
                              e.target.textContent,
                              idx,
                            )
                          }
                          className="text-sm font-bold"
                        >
                          {ref.name}
                        </h3>
                        <p
                          contentEditable
                          suppressContentEditableWarning
                          onBlur={(e) =>
                            handleInputChange(
                              "references",
                              "title",
                              e.target.textContent,
                              idx,
                            )
                          }
                          className="text-sm"
                        >
                          {ref.title}
                        </p>
                        <p
                          contentEditable
                          suppressContentEditableWarning
                          onBlur={(e) =>
                            handleInputChange(
                              "references",
                              "contact",
                              e.target.textContent,
                              idx,
                            )
                          }
                          className="text-xs text-gray-300"
                        >
                          {ref.contact}
                        </p>
                        {showButtons && (
                          <button
                            onClick={() =>
                              handleRemoveSection("references", idx)
                            }
                            className="text-xs text-red-300 hover:text-red-100 mt-1"
                          >
                            Remove Reference
                          </button>
                        )}
                      </div>
                    ))}
                    {showButtons && (
                      <button
                        onClick={() => handleAddSection("references")}
                        className="text-xs text-blue-300 hover:text-blue-100 mt-1"
                      >
                        Add Reference
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>

            {branding && (
              <div className="text-[8px] text-gray-400 text-right mt-auto p-4">
                <span>Made by</span>{" "}
                <span className="font-semibold">Aditya Tiwary</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {activeSection === "rearrange" && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40">
          <motion.div
            className="bg-white p-4 rounded-lg shadow-lg w-80 max-w-full mx-4"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <h3 className="text-lg font-bold mb-4 text-gray-800">
              Rearrange Sections
            </h3>
            {sectionsOrder.map((section, idx) => (
              <div
                key={section}
                className="flex items-center justify-between mb-2 p-2 bg-gray-50 rounded"
              >
                <span className="text-sm font-medium text-gray-800">
                  {section.charAt(0).toUpperCase() + section.slice(1)}
                </span>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleMoveSectionUp(idx)}
                    className="bg-gray-200 text-gray-700 p-1 rounded hover:bg-gray-300 disabled:opacity-50"
                    disabled={idx === 0}
                  >
                    ⬆️
                  </button>
                  <button
                    onClick={() => handleMoveSectionDown(idx)}
                    className="bg-gray-200 text-gray-700 p-1 rounded hover:bg-gray-300 disabled:opacity-50"
                    disabled={idx === sectionsOrder.length - 1}
                  >
                    ⬇️
                  </button>
                </div>
              </div>
            ))}
            <div className="mt-4 flex justify-end">
              <button
                onClick={() => setActiveSection(null)}
                className="bg-blue-500 text-white px-3 py-2 rounded hover:bg-blue-600 transition-colors text-sm"
              >
                Done
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {activeSection && activeSection !== "rearrange" && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40">
          <motion.div
            className="bg-white p-4 rounded-lg shadow-lg w-80 max-w-full mx-4"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <h3 className="text-lg font-bold mb-4 text-gray-800">
              {activeSection.charAt(0).toUpperCase() + activeSection.slice(1)}{" "}
              Settings
            </h3>
            <div className="space-y-3">
              {Object.keys(sectionSettings[activeSection]).map((key) => (
                <label
                  key={key}
                  className="flex items-center justify-between p-2 bg-gray-50 rounded"
                >
                  <span className="text-sm font-medium text-gray-800">
                    {key
                      .replace("show", "")
                      .replace(/([A-Z])/g, " $1")
                      .trim()}
                  </span>
                  <div className="relative inline-block w-10 h-6 transition duration-200 ease-in-out rounded-full cursor-pointer">
                    <input
                      type="checkbox"
                      id={`toggle-${key}`}
                      className="sr-only"
                      checked={sectionSettings[activeSection][key]}
                      onChange={() => handleSettingChange(activeSection, key)}
                    />
                    <label
                      htmlFor={`toggle-${key}`}
                      className={`block h-6 overflow-hidden rounded-full cursor-pointer ${
                        sectionSettings[activeSection][key]
                          ? "bg-blue-500"
                          : "bg-gray-300"
                      }`}
                    >
                      <span
                        className={`block h-6 w-6 rounded-full transform transition-transform duration-200 ease-in-out bg-white ${
                          sectionSettings[activeSection][key]
                            ? "translate-x-4"
                            : "translate-x-0"
                        }`}
                      />
                    </label>
                  </div>
                </label>
              ))}
            </div>
            <div className="mt-4 flex justify-end">
              <button
                onClick={() => setActiveSection(null)}
                className="bg-blue-500 text-white px-3 py-2 rounded hover:bg-blue-600 transition-colors text-sm"
              >
                Done
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {showShareNotification && <ShareNotification />}
      {isLoading && <LoadingScreen />}
      {isDownloading && <DownloadPreloader />}
      {showAIErrorPopup && <AIErrorPopup />}
      {showUploadErrorPopup && <UploadErrorPopup />}
      {showColorPicker && <ColorPickerPopup />}
      {showSaveNotification && <SaveNotification />}
      {showAIMenu && (
        <motion.div
          className="absolute bg-white shadow-lg rounded-md p-4 z-50"
          style={{
            top: aiMenuPosition?.top || 0,
            left: aiMenuPosition?.left || 0,
          }}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          onClick={handleAIMenuClose}
        >
          <button
            onClick={() => handleEnhanceSection("summary")}
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
          >
            Enhance Summary
          </button>
          <button
            onClick={() => handleEnhanceSection("experience")}
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
          >
            Enhance Experience
          </button>
          <button
            onClick={() => handleEnhanceSection("education")}
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
          >
            Enhance Education
          </button>
          <button
            onClick={() => handleEnhanceSection("achievements")}
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
          >
            Enhance Achievements
          </button>
          <button
            onClick={() => handleEnhanceSection("strengths")}
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
          >
            Enhance Strengths
          </button>
          <button
            onClick={() => handleEnhanceSection("philosophy")}
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
          >
            Enhance My life philosphy
          </button>
        </motion.div>
      )}
    </div>
  );
};

export default ResumeEditor;
