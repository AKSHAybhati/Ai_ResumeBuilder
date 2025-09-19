/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react/prop-types */
// ResumeContext.js
import { createContext, useContext, useState, useEffect } from "react";

const ResumeContext = createContext();

// Default empty state - moved outside component to avoid re-renders
const defaultResumeData = {
  // 🔹 Basic Info
  name: "",
  role: "",
  email: "",
  phone: "",
  location: "",
  linkedin: "",
  github: "",
  portfolio: "",
  profileImage: "", // for future image support

  // 🔹 Summary / About
  summary: "",

  // 🔹 Skills & Tools
  skills: [],
  languages: [],
  interests: [],

  // 🔹 Experience
  experience: [],

  // 🔹 Education
  education: [],

  // 🔹 Projects
  projects: [],

  // 🔹 Certifications
  certifications: [],

  // 🔹 Achievements
  achievements: [],
};

export const ResumeProvider = ({ children }) => {
  const [resumeData, setResumeData] = useState(defaultResumeData);

  // Load data from localStorage on component mount
  useEffect(() => {
    const savedData = localStorage.getItem('resumeData');
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        setResumeData(prev => ({ ...prev, ...parsedData }));
      } catch (error) {
        console.error('❌ Error parsing saved resume data:', error);
      }
    } else {
      // If no saved data, ensure we're using default data
      setResumeData(defaultResumeData);
    }
  }, []);

  // Listen for localStorage changes (e.g., when cleared)
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'resumeData') {
        if (e.newValue === null) {
          // localStorage was cleared
          setResumeData(defaultResumeData);
        } else {
          // localStorage was updated
          try {
            const parsedData = JSON.parse(e.newValue);
            setResumeData(prev => ({ ...prev, ...parsedData }));
          } catch (error) {
            console.error('❌ Error parsing updated resume data:', error);
          }
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const updateResumeData = (newData) => {
    setResumeData(newData);
    // Save to localStorage automatically
    localStorage.setItem('resumeData', JSON.stringify(newData));
  };

  const resetResumeData = () => {
    setResumeData(defaultResumeData);
    localStorage.removeItem('resumeData');
  };

  return (
    <ResumeContext.Provider value={{ resumeData, setResumeData, updateResumeData, resetResumeData }}>
      {children}
    </ResumeContext.Provider>
  );
};

export const useResume = () => useContext(ResumeContext);
export { ResumeContext };
