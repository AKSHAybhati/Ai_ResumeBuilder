/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react/prop-types */
// ResumeContext.js
import { createContext, useContext, useState } from "react";

const ResumeContext = createContext();

export const ResumeProvider = ({ children }) => {
  const [resumeData, setResumeData] = useState({
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
  });

  const updateResumeData = (newData) => {
    setResumeData(newData);
  };

  return (
    <ResumeContext.Provider value={{ resumeData, setResumeData, updateResumeData }}>
      {children}
    </ResumeContext.Provider>
  );
};

export const useResume = () => useContext(ResumeContext);
export { ResumeContext };
