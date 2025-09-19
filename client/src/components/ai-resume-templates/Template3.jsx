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
 import Sidebar from "../Sidebar/Sidebar";
import Navbar from "../Navbar/Navbar";
import { useResume } from "../../context/ResumeContext";
 
 // Add global styles for extra small text
 const globalStyles = `
   .text-xxs {
     font-size: 0.625rem;
     line-height: 0.75rem;
   }
   .text-3xs {
     font-size: 0.5rem;
     line-height: 0.625rem;
   }
 `;
 
//  const Sidebar = React.memo(
//    ({
//      setActiveSection,
//      handleAIEnhancement,
//      handleDownload,
//      handleShare,
//      branding,
//      handleBrandingToggle,
//      handleUploadResume,
//      handleColorPicker,
//      handleSaveResume,
//    }) => {
//      return (
//        <>
       
//          {/* Mobile/Tablet Horizontal Toolbar */}
//          <div className="w-full bg-white text-gray-800 p-3 sm:p-4 shadow-lg border-b border-gray-200 block lg:hidden">
//            <div className="flex items-center justify-center gap-2 sm:gap-3 flex-wrap">
//              <button
//                className="w-12 h-12 sm:w-14 sm:h-14 bg-blue-500 text-white rounded-full p-2 shadow-lg flex items-center justify-center"
//                onClick={() => setActiveSection("rearrange")}
//                title="Rearrange"
//              >
//                <span className="text-xl sm:text-2xl">↕️</span>
//              </button>
 
//              <button
//                className="w-12 h-12 sm:w-14 sm:h-14 bg-red-500 text-white rounded-full p-2 shadow-lg flex items-center justify-center"
//                onClick={handleAIEnhancement}
//                data-ai-button="true"
//                title="AI Assistant"
//              >
//                <span className="text-xl sm:text-2xl">🤖</span>
//              </button>
 
//              <button
//                className="w-12 h-12 sm:w-14 sm:h-14 bg-purple-500 text-white rounded-full p-2 shadow-lg flex items-center justify-center"
//                onClick={handleColorPicker}
//                title="Color"
//              >
//                <span className="text-xl sm:text-2xl">🎨</span>
//              </button>
 
//              <button
//                className="w-12 h-12 sm:w-14 sm:h-14 bg-indigo-500 text-white rounded-full p-2 shadow-lg flex items-center justify-center"
//                onClick={handleSaveResume}
//                title="Save Resume"
//              >
//                <span className="text-xl sm:text-2xl">💾</span>
//              </button>
 
//              <button
//                className="w-12 h-12 sm:w-14 sm:h-14 bg-yellow-500 text-white rounded-full p-2 shadow-lg flex items-center justify-center"
//                onClick={handleDownload}
//                title="Download"
//              >
//                <span className="text-xl sm:text-2xl">⬇️</span>
//              </button>
 
//              <button
//                className="w-12 h-12 sm:w-14 sm:h-14 bg-green-500 text-white rounded-full p-2 shadow-lg flex items-center justify-center"
//                onClick={handleShare}
//                title="Share"
//              >
//                <span className="text-xl sm:text-2xl">🔗</span>
//              </button>
 
//              <div className="flex items-center ml-2 sm:ml-4">
//                <label className="relative inline-flex items-center cursor-pointer">
//                  <input
//                    type="checkbox"
//                    checked={branding}
//                    onChange={handleBrandingToggle}
//                    className="sr-only"
//                  />
//                  <div className="w-10 h-5 sm:w-12 sm:h-6 bg-gray-300 rounded-full relative transition-all duration-300">
//                    <div
//                      className="absolute w-4 h-4 sm:w-5 sm:h-5 bg-gray-600 rounded-full left-0.5 top-0.5 transition-transform duration-300"
//                      style={{
//                        transform: branding ? "translateX(20px)" : "translateX(0)",
//                      }}
//                    />
//                  </div>
//                </label>
//              </div>
 
//              <button
//                className="w-12 h-12 sm:w-14 sm:h-14 bg-purple-500 text-white rounded-full p-2 shadow-lg flex items-center justify-center"
//                onClick={handleUploadResume}
//                title="Upload Resume"
//              >
//                <span className="text-xl sm:text-2xl">⬆️</span>
//              </button>
//            </div>
//          </div>
 
//          {/* Desktop Vertical Sidebar */}
//          <div className="w-72 bg-white text-gray-800 p-6 rounded-r-3xl shadow-2xl border-r border-gray-200 hidden lg:flex lg:flex-col">
//            <div className="w-full flex flex-col space-y-6 z-10">
//              <h3 className="text-2xl font-bold mb-6 text-gray-800">
//                Resume Tools
//              </h3>
 
//              <button
//                className="w-full bg-blue-500 text-white rounded-full p-3 shadow-lg flex items-center justify-start space-x-2"
//                onClick={() => setActiveSection("rearrange")}
//              >
//                <span className="text-lg">↕️</span>
//                <span>Rearrange</span>
//              </button>
 
//              <button
//                className="w-full bg-red-500 text-white rounded-full p-3 shadow-lg flex items-center justify-start space-x-2"
//                onClick={handleAIEnhancement}
//                data-ai-button="true"
//              >
//                <span className="text-lg">🤖</span>
//                <span>AI Assistant</span>
//              </button>
 
//              <button
//                className="w-full bg-purple-500 text-white rounded-full p-3 shadow-lg flex items-center justify-start space-x-2"
//                onClick={handleColorPicker}
//              >
//                <span className="text-lg">🎨</span>
//                <span>Color</span>
//              </button>
 
//              <button
//                className="w-full bg-indigo-500 text-white rounded-full p-3 shadow-lg flex items-center justify-start space-x-2"
//                onClick={handleSaveResume}
//              >
//                <span className="text-lg">💾</span>
//                <span>Save Resume</span>
//              </button>
 
//              <hr className="border-gray-300 my-2 w-full" />
 
//              <button
//                className="w-full bg-yellow-500 text-white rounded-full p-3 shadow-lg flex items-center justify-start space-x-2"
//                onClick={handleDownload}
//              >
//                <span className="text-lg">⬇️</span>
//                <span>Download</span>
//              </button>
 
//              <button
//                className="w-full bg-green-500 text-white rounded-full p-3 shadow-lg flex items-center justify-start space-x-2"
//                onClick={handleShare}
//              >
//                <span className="text-lg">🔗</span>
//                <span>Share</span>
//              </button>
 
//              <div className="flex items-center justify-between mt-2 w-full">
//                <span className="text-gray-800 font-medium">
//                  Branding
//                </span>
//                <label className="relative inline-flex items-center cursor-pointer">
//                  <input
//                    type="checkbox"
//                    checked={branding}
//                    onChange={handleBrandingToggle}
//                    className="sr-only"
//                  />
//                  <div className="w-12 h-6 bg-gray-300 rounded-full relative transition-all duration-300">
//                    <div
//                      className="absolute w-5 h-5 bg-gray-600 rounded-full left-0.5 top-0.5 transition-transform duration-300"
//                      style={{
//                        transform: branding ? "translateX(24px)" : "translateX(0)",
//                      }}
//                    />
//                  </div>
//                </label>
//              </div>
 
//              <button
//                className="w-full bg-purple-500 text-white rounded-full p-3 shadow-lg flex items-center justify-start space-x-2"
//                onClick={handleUploadResume}
//              >
//                <span className="text-lg">⬆️</span>
//                <span>Upload Resume</span>
//              </button>
//            </div>
//          </div>
//        </>
//      );
//    },
//  );
 
 const ResumeEditor = () => {
  const [editMode, setEditMode] = useState(false);
  const { resumeData, updateResumeData } = useResume();
  const [localData, setLocalData] = useState(resumeData);
 
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
     languages: { showLanguages: false },
     skills: { showSkills: true },
     Projects: { showCourses: true },
    //  passions: { showPassions: true },
   });
 
   const [activeSection, setActiveSection] = useState(null);
   const [sectionsOrder, setSectionsOrder] = useState([
     "summary",
     "experience",
     "education",
     "achievements",
     "skills",
     "courses",
     "passions",
   ]);
   const [showShareNotification, setShowShareNotification] = useState(false);
   const [isLoading, setIsLoading] = useState(false);
   const [isDownloading, setIsDownloading] = useState(false);
   const [showAIErrorPopup, setShowAIErrorPopup] = useState(false);
   const [showUploadErrorPopup, setShowUploadErrorPopup] = useState(false);
   const [showColorPicker, setShowColorPicker] = useState(false);
   const [activeColor, setActiveColor] = useState("#000000");
   const [aiMenuPosition, setAiMenuPosition] = useState(null);
   const [showAIMenu, setShowAIMenu] = useState(false);
   const [showSaveNotification, setShowSaveNotification] = useState(false);
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
 
   // Close AI menu when clicking outside
   useEffect(() => {
     const handleClickOutside = (event) => {
       if (
         showAIMenu &&
         !event.target.closest(".ai-menu") &&
         !event.target.closest('[data-ai-button="true"]')
       ) {
         setShowAIMenu(false);
       }
     };
 
     document.addEventListener("mousedown", handleClickOutside);
     return () => {
       document.removeEventListener("mousedown", handleClickOutside);
     };
   }, [showAIMenu]);
 
   // Add global style for text-xxs class
   useEffect(() => {
     const styleTag = document.createElement("style");
     styleTag.innerHTML = globalStyles;
     document.head.appendChild(styleTag);
     return () => {
       document.head.removeChild(styleTag);
     };
   }, []);
 
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
         Projects: {
           title: "New Course",
           description: "Describe your course here",
         },
         passions: {
           title: "New Passion",
           description: "Describe your passion here",
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
 
   const handleAIEnhancement = useCallback(
     (e) => {
       const button = e.currentTarget;
       const rect = button.getBoundingClientRect();
 
       if (showAIMenu) {
         setShowAIMenu(false);
       } else {
         setAiMenuPosition({
           top: rect.bottom,
           left: rect.left,
         });
         setShowAIMenu(true);
       }
     },
     [showAIMenu],
   );
 
   const handleAIMenuClose = useCallback(() => {
     setShowAIMenu(false);
   }, []);
 
   const handleEnhanceSection = useCallback((section) => {
     setShowAIMenu(false);
     setShowAIErrorPopup(true);
     setTimeout(() => setShowAIErrorPopup(false), 3000);
   }, []);
 
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
       const pageHeight = pdf.internal.pageSize.getHeight();
       const imgWidth = pageWidth;
       const imgHeight = (canvas.height * pageWidth) / canvas.width;
 
       let heightLeft = imgHeight;
       let position = 0;
 
       // Add first page
       pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
       heightLeft -= pageHeight;
 
       // Add additional pages if content overflows
       while (heightLeft > 0) {
         position -= pageHeight;
         pdf.addPage();
         pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
         heightLeft -= pageHeight;
       }
 
       pdf.save("resume.pdf");
       // PDF downloaded successfully - no toast notification
     } catch (error) {
       console.error("Error generating PDF:", error);
       // Failed to generate PDF - no toast notification
     } finally {
       setShowButtons(true);
       setIsDownloading(false);
     }
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
       // Resume saved successfully - no toast notification
     } catch (error) {
       console.error("Error saving resume:", error);
       // Failed to save - no toast notification
     }
   }, [resumeData, sectionSettings, branding, sectionsOrder]);
 
   const handleShare = useCallback(() => {
     const resumeLink = window.location.href;
     navigator.clipboard
       .writeText(resumeLink)
       .then(() => {
         setShowShareNotification(true);
         setTimeout(() => setShowShareNotification(false), 3000);
         // Link copied successfully - no toast notification
       })
       .catch(() => {
         // Failed to copy link - no toast notification
       });
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
 
   const handleColorPicker = useCallback(() => {
     setShowColorPicker(true);
   }, []);
 
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
 const handleToggle = () => {
    setEditMode(prev => !prev);
  };

  const handleSave = () => {
    // Save the current resume data
    localStorage.setItem("resumeData", JSON.stringify(resumeData));
    localStorage.setItem("sectionSettings", JSON.stringify(sectionSettings));
    localStorage.setItem("branding", JSON.stringify(branding));
    setEditMode(false);
    setShowSaveNotification(true);
    setTimeout(() => setShowSaveNotification(false), 3000);
  };

  const handleCancel = () => {
    // Reset to saved data or original data
    const savedResume = localStorage.getItem("resumeData");
    const savedSettings = localStorage.getItem("sectionSettings");
    const savedBranding = localStorage.getItem("branding");
    
    if (savedResume) setResumeData(JSON.parse(savedResume));
    if (savedSettings) setSectionSettings(JSON.parse(savedSettings));
    if (savedBranding) setBranding(JSON.parse(savedBranding));
    
    setEditMode(false);
  };
  

   return (
      <>
      <Navbar/>

     <div className="flex flex-col lg:flex-row min-h-screen bg-gray-100">
        <Sidebar resumeRef={resumeRef} currentResumeData={resumeData}/>
        <div className="flex-1 p-2 sm:p-4 lg:p-6 overflow-auto flex justify-center relative">
          {/* Edit Mode Controls */}
          <div className="absolute top-10 right-4 z-10">
            {!editMode ? (
              <button
                onClick={handleToggle}
                className="bg-cyan-700 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-cyan-800 transition-colors flex items-center gap-2"
              >
                <span></span>
                Edit Resume
              </button>
            ) : (
              <div className="flex gap-2">
                <button 
                  className="bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                  onClick={handleSave}
                >
                  <span></span>
                  Save
                </button>
                <button 
                  className="bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-red-600 transition-colors flex items-center gap-2"
                  onClick={handleCancel}
                >
                  <span></span>
                  Cancel
                </button>
              </div>
            )}
          </div>
         <div
           className="bg-white shadow-md w-full lg:w-auto"
           style={{
             width: "70%",
             maxWidth: "210mm",
             minHeight: "180mm",
             boxSizing: "border-box",
           }}
         >
           <div
             ref={resumeRef}
             className="flex flex-col w-full"
             style={{
               minHeight: "180mm",
               boxSizing: "border-box",
             }}
           >
             {/* MAIN CONTENT */}
             <div className="p-4 sm:p-6 lg:p-8">
               {/* HEADER SECTION */}
               <div className="mb-4 sm:mb-6">
                 <h1
                   contentEditable={editMode}
                   suppressContentEditableWarning
                   onBlur={(e) =>
                     handleInputChange(null, "name", e.target.innerText)
                   }
                   className={`text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 ${editMode ? 'border-b-2 border-dashed border-gray-300 focus:outline-none focus:border-blue-500' : ''}`}
                 >
                   {resumeData.name}
                 </h1>
                 {sectionSettings.header?.showTitle && (
                   <h2
                     contentEditable={editMode}
                     suppressContentEditableWarning
                     onBlur={(e) =>
                       handleInputChange(null, "role", e.target.textContent)
                     }
                     className={`text-xs sm:text-sm text-blue-500 font-medium mt-0.5 ${editMode ? 'border-b-2 border-dashed border-gray-300 focus:outline-none focus:border-blue-500' : ''}`}
                   >
                     {resumeData.role}
                   </h2>
                 )}
                 <div className="flex flex-wrap gap-2 sm:gap-4 mt-2 text-xs sm:text-sm text-gray-600">
                   {sectionSettings.header?.showPhone && (
                     <div className="flex items-center">
                       <span className="mr-1">📱</span>
                       <span
                         contentEditable={editMode}
                         suppressContentEditableWarning
                         onBlur={(e) =>
                           handleInputChange(null, "phone", e.target.textContent)
                         }
                         className={editMode ? 'border-b border-dashed border-gray-300 focus:outline-none focus:border-blue-500 px-1' : ''}
                       >
                         {resumeData.phone}
                       </span>
                     </div>
                   )}
                   {sectionSettings.header?.showEmail && (
                     <div className="flex items-center">
                       <span className="mr-1">✉</span>
                       <span
                         contentEditable={editMode}
                         suppressContentEditableWarning
                         onBlur={(e) =>
                           handleInputChange(null, "email", e.target.textContent)
                         }
                         className={editMode ? 'border-b border-dashed border-gray-300 focus:outline-none focus:border-blue-500 px-1' : ''}
                       >
                         {resumeData.email}
                       </span>
                     </div>
                   )}
                   {sectionSettings.header?.showLink && (
                     <div className="flex items-center">
                       <span className="mr-1">🔗</span>
                       <span
                         contentEditable={editMode}
                         suppressContentEditableWarning
                         onBlur={(e) =>
                           handleInputChange(
                             null,
                             "linkedin",
                             e.target.textContent,
                           )
                         }
                         className={editMode ? 'border-b border-dashed border-gray-300 focus:outline-none focus:border-blue-500 px-1' : ''}
                       >
                         {resumeData.linkedin}
                       </span>
                     </div>
                   )}
                   {sectionSettings.header?.showLocation && (
                     <div className="flex items-center">
                       <span className="mr-1">📍</span>
                       <span
                         contentEditable={editMode}
                         suppressContentEditableWarning
                         onBlur={(e) =>
                           handleInputChange(
                             null,
                             "location",
                             e.target.textContent,
                           )
                         }
                         className={editMode ? 'border-b border-dashed border-gray-300 focus:outline-none focus:border-blue-500 px-1' : ''}
                       >
                         {resumeData.location}
                       </span>
                     </div>
                   )}
                 </div>
               </div>
 
               {/* TWO COLUMN LAYOUT */}
               <div className="flex flex-col lg:flex-row gap-4 lg:gap-6">
                 {/* LEFT COLUMN - 65% */}
                 <div className="w-full lg:w-[65%]">
                   {/* SUMMARY SECTION */}
                   {sectionSettings.summary?.showSummary && (
                     <div className="mb-3 sm:mb-4">
                       <h2 className="text-xs sm:text-sm font-bold text-gray-800 mb-1 pb-1 border-b border-gray-300 flex items-center justify-between">
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
                         contentEditable={editMode}
                         suppressContentEditableWarning
                         onBlur={(e) =>
                           handleInputChange(
                             null,
                             "summary",
                             e.target.textContent,
                           )
                         }
                         className={`text-xs sm:text-sm text-gray-700 leading-relaxed ${editMode ? 'border border-dashed border-gray-300 focus:outline-none focus:border-blue-500 p-2 rounded' : ''}`}
                       >
                         {resumeData.summary}
                       </p>
                     </div>
                   )}
 
                   {/* EXPERIENCE SECTION */}
                   {sectionSettings.experience?.showExperience && (
                     <div className="mb-3 sm:mb-4">
                       <h2 className="text-xs sm:text-sm font-bold text-gray-800 mb-1 pb-1 border-b border-gray-300 flex items-center justify-between">
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
                         <div key={idx} className="mb-3 sm:mb-4">
                           <div className="mb-2">
                             <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start">
                               <h3
                                 contentEditable={editMode}
                                 suppressContentEditableWarning
                                 onBlur={(e) =>
                                   handleInputChange(
                                     "experience",
                                     "title",
                                     e.target.textContent,
                                     idx,
                                   )
                                 }
                                 className={`text-xs sm:text-sm font-bold text-gray-900 ${editMode ? 'border-b border-dashed border-gray-300 focus:outline-none focus:border-blue-500' : ''}`}
                               >
                                 {exp.title}
                               </h3>
                             </div>
                             <div className="flex justify-between items-start">
                               <p
                                 contentEditable={editMode}
                                 suppressContentEditableWarning
                                 onBlur={(e) =>
                                   handleInputChange(
                                     "experience",
                                     "companyName",
                                     e.target.textContent,
                                     idx,
                                   )
                                 }
                                 className={`text-xs sm:text-sm text-blue-500 ${editMode ? 'border-b border-dashed border-gray-300 focus:outline-none focus:border-blue-500' : ''}`}
                               >
                                 {exp.companyName}
                               </p>
                             </div>
                             <div className="flex flex-col sm:flex-row sm:items-center text-xs sm:text-sm text-gray-600 mb-1 gap-1 sm:gap-3">
                               <span className="flex items-center">
                                 <span className="mr-1">📅</span>
                                 <span
                                   contentEditable={editMode}
                                   suppressContentEditableWarning
                                   onBlur={(e) =>
                                     handleInputChange(
                                       "experience",
                                       "date",
                                       e.target.textContent,
                                       idx,
                                     )
                                   }
                                   className={editMode ? 'border-b border-dashed border-gray-300 focus:outline-none focus:border-blue-500 px-1' : ''}
                                 >
                                   {exp.date}
                                 </span>
                               </span>
                               <span className="flex items-center">
                                 <span className="mr-1">📍</span>
                                 <span
                                   contentEditable={editMode}
                                   suppressContentEditableWarning
                                   onBlur={(e) =>
                                     handleInputChange(
                                       "experience",
                                       "companyLocation",
                                       e.target.textContent,
                                       idx,
                                     )
                                   }
                                   className={editMode ? 'border-b border-dashed border-gray-300 focus:outline-none focus:border-blue-500 px-1' : ''}
                                 >
                                   {exp.companyLocation}
                                 </span>
                               </span>
                             </div>
                           </div>
                           <div
                             contentEditable={editMode}
                             suppressContentEditableWarning
                             onBlur={(e) =>
                               handleInputChange(
                                 "experience",
                                 "accomplishment",
                                 e.target.textContent,
                                 idx,
                               )
                             }
                             className={`text-xs sm:text-sm text-gray-700 whitespace-pre-line ${editMode ? 'border border-dashed border-gray-300 focus:outline-none focus:border-blue-500 p-2 rounded' : ''}`}
                           >
                             {exp.accomplishment}
                           </div>
                           {editMode && (
                             <button
                               onClick={() =>
                                 handleRemoveSection("experience", idx)
                               }
                               className="text-xs sm:text-sm text-red-500 hover:text-red-700 mt-1"
                             >
                               Remove Experience
                             </button>
                           )}
                         </div>
                       ))}
                       {editMode && (
                         <button
                           onClick={() => handleAddSection("experience")}
                           className="text-xs sm:text-sm text-blue-500 hover:text-blue-700 mt-1"
                         >
                           Add Experience
                         </button>
                       )}
                     </div>
                   )}
 
                   {/* EDUCATION SECTION */}
                   {sectionSettings.education?.showEducation && (
                     <div className="mb-3 sm:mb-4">
                       <h2 className="text-xs sm:text-sm font-bold text-gray-800 mb-1 pb-1 border-b border-gray-300 flex items-center justify-between">
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
                         <div key={idx} className="mb-3 sm:mb-4">
                           <div>
                             <h3
                               contentEditable={editMode}
                               suppressContentEditableWarning
                               onBlur={(e) =>
                                 handleInputChange(
                                   "education",
                                   "degree",
                                   e.target.textContent,
                                   idx,
                                 )
                               }
                               className={`text-xs sm:text-sm font-bold text-gray-900 ${editMode ? 'border-b border-dashed border-gray-300 focus:outline-none focus:border-blue-500' : ''}`}
                             >
                               {edu.degree}
                             </h3>
                           </div>
                           <div>
                             <p
                               contentEditable={editMode}
                               suppressContentEditableWarning
                               onBlur={(e) =>
                                 handleInputChange(
                                   "education",
                                   "institution",
                                   e.target.textContent,
                                   idx,
                                 )
                               }
                               className={`text-xs sm:text-sm text-gray-700 ${editMode ? 'border-b border-dashed border-gray-300 focus:outline-none focus:border-blue-500' : ''}`}
                             >
                               {edu.institution}
                             </p>
                           </div>
                           <div className="text-xs sm:text-sm text-gray-600 flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                             <span className="flex items-center">
                               <span className="mr-1">📅</span>
                               <span
                                 contentEditable={editMode}
                                 suppressContentEditableWarning
                                 onBlur={(e) =>
                                   handleInputChange(
                                     "education",
                                     "duration",
                                     e.target.textContent,
                                     idx,
                                   )
                                 }
                                 className={editMode ? 'border-b border-dashed border-gray-300 focus:outline-none focus:border-blue-500 px-1' : ''}
                               >
                                 {edu.duration}
                               </span>
                             </span>
                             <span className="flex items-center">
                               <span className="mr-1">📍</span>
                               <span
                                 contentEditable={editMode}
                                 suppressContentEditableWarning
                                 onBlur={(e) =>
                                   handleInputChange(
                                     "education",
                                     "location",
                                     e.target.textContent,
                                     idx,
                                   )
                                 }
                                 className={editMode ? 'border-b border-dashed border-gray-300 focus:outline-none focus:border-blue-500 px-1' : ''}
                               >
                                 {edu.location}
                               </span>
                             </span>
                           </div>
                           {editMode && (
                             <button
                               onClick={() =>
                                 handleRemoveSection("education", idx)
                               }
                               className="text-xs text-red-500 hover:text-red-700 mt-1"
                             >
                               Remove Education
                             </button>
                           )}
                         </div>
                       ))}
                       {editMode && (
                         <button
                           onClick={() => handleAddSection("education")}
                           className="text-xs text-blue-500 hover:text-blue-700 mt-1"
                         >
                           Add Education
                         </button>
                       )}
                     </div>
                   )}
                 </div>
 
                 {/* RIGHT COLUMN - 35% */}
                 <div className="w-full lg:w-[35%]">
                   {/* ACHIEVEMENTS SECTION */}
                   {sectionSettings.achievements?.showAchievements && (
                     <div className="mb-3 sm:mb-4">
                       <h2 className="text-xs sm:text-sm font-bold text-gray-800 mb-1 pb-1 border-b border-gray-300 flex items-center justify-between">
                         <span>ACHIEVEMENTS</span>
                         {showButtons && activeSection === "achievements" && (
                           <button
                             className="text-gray-500 hover:text-gray-700"
                             onClick={() => handleSettingsClick("achievements")}
                             aria-label="Open achievements settings"
                           >
                             ⚙
                           </button>
                         )}
                       </h2>
                       {resumeData.achievements.map((achievement, idx) => (
                         <div key={idx} className="mb-3 sm:mb-4">
                           <div className="flex items-start mb-1">
                             <span className="mr-2 text-yellow-500 mt-0.5">
                               {idx === 0 && "⚡"}
                               {idx === 1 && "⭐"}
                               {idx === 2 && "🎯"}
                               {idx === 3 && "🏆"}
                             </span>
                             <h3
                               contentEditable={editMode}
                               suppressContentEditableWarning
                               onBlur={(e) =>
                                 handleInputChange(
                                   "achievements",
                                   "title",
                                   e.target.textContent,
                                   idx,
                                 )
                               }
                               className={`text-xs sm:text-sm font-bold text-gray-900 flex-1 ${editMode ? 'border-b border-dashed border-gray-300 focus:outline-none focus:border-blue-500' : ''}`}
                             >
                               {achievement.title}
                             </h3>
                           </div>
                           <p
                             contentEditable={editMode}
                             suppressContentEditableWarning
                             onBlur={(e) =>
                               handleInputChange(
                                 "achievements",
                                 "description",
                                 e.target.textContent,
                                 idx,
                               )
                             }
                             className={`text-xs sm:text-sm text-gray-700 ml-6 ${editMode ? 'border border-dashed border-gray-300 focus:outline-none focus:border-blue-500 p-2 rounded' : ''}`}
                           >
                             {achievement.description}
                           </p>
                           {editMode && (
                             <button
                               onClick={() =>
                                 handleRemoveSection("achievements", idx)
                               }
                               className="text-xs sm:text-sm text-red-500 hover:text-red-700 mt-1 ml-6"
                             >
                               Remove
                             </button>
                           )}
                         </div>
                       ))}
                       {editMode && (
                         <button
                           onClick={() => handleAddSection("achievements")}
                           className="text-xs sm:text-sm text-blue-500 hover:text-blue-700 mt-1"
                         >
                           Add Achievement
                         </button>
                       )}
                     </div>
                   )}
 
                   {/* SKILLS SECTION */}
                   {sectionSettings.skills?.showSkills && (
                     <div className="mb-3 sm:mb-4">
                       <h2 className="text-xs sm:text-sm font-bold text-gray-800 mb-1 pb-1 border-b border-gray-300 flex items-center justify-between">
                         <span>SKILLS</span>
                         {showButtons && activeSection === "skills" && (
                           <button
                             className="text-gray-500 hover:text-gray-700"
                             onClick={() => handleSettingsClick("skills")}
                             aria-label="Open skills settings"
                           >
                             ⚙
                           </button>
                         )}
                       </h2>
                       <div className="flex flex-wrap gap-2 text-xs sm:text-sm">
                         {resumeData.skills.map((skill, idx) => (
                           <div
                             key={idx}
                             className="bg-gray-100 rounded px-2 sm:px-3 py-1 mb-1"
                           >
                             <span
                               contentEditable={editMode}
                               suppressContentEditableWarning
                               onBlur={(e) =>
                                 handleInputChange(
                                   "skills",
                                   "category",
                                   e.target.textContent,
                                   idx,
                                 )
                               }
                               className={`font-medium text-gray-800 ${editMode ? 'border-b border-dashed border-gray-300 focus:outline-none focus:border-blue-500' : ''}`}
                             >
                               {skill.category}
                             </span>
                             {editMode && (
                               <button
                                 onClick={() =>
                                   handleRemoveSection("skills", idx)
                                 }
                                 className="text-xs text-red-500 hover:text-red-700 ml-1"
                               >
                                 ✕
                               </button>
                             )}
                           </div>
                         ))}
                       </div>
                       {editMode && (
                         <button
                           onClick={() => handleAddSection("skills")}
                           className="text-xs sm:text-sm text-blue-500 hover:text-blue-700 mt-2"
                         >
                           Add Skill Category
                         </button>
                       )}
                     </div>
                   )}
 
                   {/* COURSES SECTION */}
                   {sectionSettings.courses?.showCourses && (
                     <div className="mb-3 sm:mb-4">
                       <h2 className="text-xs sm:text-sm font-bold text-gray-800 mb-1 pb-1 border-b border-gray-300 flex items-center justify-between">
                         <span>COURSES</span>
                         {showButtons && activeSection === "courses" && (
                           <button
                             className="text-gray-500 hover:text-gray-700"
                             onClick={() => handleSettingsClick("courses")}
                             aria-label="Open courses settings"
                           >
                             ⚙
                           </button>
                         )}
                       </h2>
                       {resumeData.courses.map((course, idx) => (
                         <div key={idx} className="mb-3 sm:mb-4">
                           <h3
                             contentEditable={editMode}
                             suppressContentEditableWarning
                             onBlur={(e) =>
                               handleInputChange(
                                 "courses",
                                 "title",
                                 e.target.textContent,
                                 idx,
                               )
                             }
                             className={`text-xs sm:text-sm font-bold text-gray-900 ${editMode ? 'border-b border-dashed border-gray-300 focus:outline-none focus:border-blue-500' : ''}`}
                           >
                             {course.title}
                           </h3>
                           <p
                             contentEditable={editMode}
                             suppressContentEditableWarning
                             onBlur={(e) =>
                               handleInputChange(
                                 "courses",
                                 "description",
                                 e.target.textContent,
                                 idx,
                               )
                             }
                             className={`text-xs sm:text-sm text-gray-700 ${editMode ? 'border border-dashed border-gray-300 focus:outline-none focus:border-blue-500 p-2 rounded' : ''}`}
                           >
                             {course.description}
                           </p>
                           {editMode && (
                             <button
                               onClick={() =>
                                 handleRemoveSection("courses", idx)
                               }
                               className="text-xs sm:text-sm text-red-500 hover:text-red-700 mt-1"
                             >
                               Remove
                             </button>
                           )}
                         </div>
                       ))}
                       {editMode && (
                         <button
                           onClick={() => handleAddSection("courses")}
                           className="text-xs sm:text-sm text-blue-500 hover:text-blue-700 mt-1"
                         >
                           Add Course
                         </button>
                       )}
                     </div>
                   )}
 
                   {/* PASSIONS SECTION */}
                   {sectionSettings.passions?.showPassions && (
                     <div className="mb-3 sm:mb-4">
                       <h2 className="text-xs sm:text-sm font-bold text-gray-800 mb-1 pb-1 border-b border-gray-300 flex items-center justify-between">
                         <span>PASSIONS</span>
                         {showButtons && activeSection === "passions" && (
                           <button
                             className="text-gray-500 hover:text-gray-700"
                             onClick={() => handleSettingsClick("passions")}
                             aria-label="Open passions settings"
                           >
                             ⚙
                           </button>
                         )}
                       </h2>
                       {resumeData.passions.map((passion, idx) => (
                         <div key={idx} className="mb-3 sm:mb-4">
                           <div className="flex items-start mb-1">
                             <span className="mr-2 text-blue-500 mt-0.5">
                               {idx === 0 && "⭐"}
                               {idx === 1 && "⭐"}
                             </span>
                             <h3
                               contentEditable={editMode}
                               suppressContentEditableWarning
                               onBlur={(e) =>
                                 handleInputChange(
                                   "passions",
                                   "title",
                                   e.target.textContent,
                                   idx,
                                 )
                               }
                               className={`text-xs sm:text-sm font-bold text-gray-900 flex-1 ${editMode ? 'border-b border-dashed border-gray-300 focus:outline-none focus:border-blue-500' : ''}`}
                             >
                               {passion.title}
                             </h3>
                           </div>
                           <p
                             contentEditable={editMode}
                             suppressContentEditableWarning
                             onBlur={(e) =>
                               handleInputChange(
                                 "passions",
                                 "description",
                                 e.target.textContent,
                                 idx,
                               )
                             }
                             className={`text-xs sm:text-sm text-gray-700 ml-6 ${editMode ? 'border border-dashed border-gray-300 focus:outline-none focus:border-blue-500 p-2 rounded' : ''}`}
                           >
                             {passion.description}
                           </p>
                           {editMode && (
                             <button
                               onClick={() =>
                                 handleRemoveSection("passions", idx)
                               }
                               className="text-xs sm:text-sm text-red-500 hover:text-red-700 mt-1 ml-6"
                             >
                               Remove
                             </button>
                           )}
                         </div>
                       ))}
                       
                       {editMode && (
                         <button
                           onClick={() => handleAddSection("passions")}
                           className="text-xs sm:text-sm text-blue-500 hover:text-blue-700 mt-1"
                         >
                           Add Passion
                         </button>
                       )}
                     </div>
                   )}
                 </div>
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
         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40 p-4">
           <motion.div
             className="bg-white p-4 sm:p-6 rounded-lg shadow-lg w-full max-w-sm sm:max-w-md"
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
         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40 p-4">
           <motion.div
             className="bg-white p-4 sm:p-6 rounded-lg shadow-lg w-full max-w-sm sm:max-w-md"
             initial={{ opacity: 0, scale: 0.9 }}
             animate={{ opacity: 1, scale: 1 }}
             transition={{ duration: 0.3 }}
           >
             <h3 className="text-lg font-bold mb-4 text-gray-800">
               {activeSection.charAt(0).toUpperCase() + activeSection.slice(1)}{" "}
               Settings
             </h3>
             <div className="space-y-3">
               {sectionSettings[activeSection] &&
                 Object.keys(sectionSettings[activeSection]).map((key) => (
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
                         id={"toggle-" + key}
                         className="sr-only"
                         checked={sectionSettings[activeSection][key]}
                         onChange={() => handleSettingChange(activeSection, key)}
                       />
                       <label
                         htmlFor={"toggle-" + key}
                         className={
                           "block h-6 overflow-hidden rounded-full cursor-pointer " +
                           (sectionSettings[activeSection][key]
                             ? "bg-blue-500"
                             : "bg-gray-300")
                         }
                       >
                         <span
                           className={
                             "block h-6 w-6 rounded-full transform transition-transform duration-200 ease-in-out bg-white " +
                             (sectionSettings[activeSection][key]
                               ? "translate-x-4"
                               : "translate-x-0")
                           }
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
       {showSaveNotification && <SaveNotification />}
       {showUploadErrorPopup && <UploadErrorPopup />}
       {showColorPicker && <ColorPickerPopup />}
 
       {/* AI Assistant dropdown menu */}
       {showAIMenu && (
         <motion.div
           className="absolute bg-white shadow-lg rounded-md p-4 z-50 ai-menu"
           style={{
             top: aiMenuPosition?.top || 0,
             left: aiMenuPosition?.left || 0,
           }}
           initial={{ opacity: 0, y: -10 }}
           animate={{ opacity: 1, y: 0 }}
           exit={{ opacity: 0, y: -10 }}
           transition={{ duration: 0.2 }}
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
             onClick={() => handleEnhanceSection("courses")}
             className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
           >
             Enhance Courses
           </button>
           <button
             onClick={() => handleEnhanceSection("passions")}
             className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
           >
             Enhance Passions
           </button>
         </motion.div>
       )}
     </div>
      </>
   );
 };
 
 export default ResumeEditor;
 