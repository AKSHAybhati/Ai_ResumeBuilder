// ResumeContext.js
import { createContext, useContext, useState } from "react";

const ResumeContext = createContext();

export const ResumeProvider = ({ children }) => {
  const [resumeData, setResumeData] = useState({
    // 🔹 Basic Info
    name: "John Doe",
    role: "Full Stack Developer",
    email: "john@example.com",
    phone: "123-456-7890",
    location: "Pune",
    linkedin: "https://linkedin.com/in/john",
    github: "https://github.com/johndoe",
    portfolio: "https://johndoe.dev",
    profileImage: "", // for future image support

    // 🔹 Summary / About
    summary: "Passionate full-stack developer with 3+ years of experience...",

    // 🔹 Skills & Tools
    skills: ["React", "Node.js", "MongoDB", "Express", "Tailwind CSS"],
    languages: ["English", "Hindi"],
    interests: ["Open Source", "Chess", "UI Design"],

    // 🔹 Experience
    experience: [
      {
        title: "Software Developer",
        companyName: "ABC Pvt Ltd",
        date: "2020 - Present",
        companyLocation: "Mumbai",
        accomplishment: [
          "Built scalable MERN applications used by 10k+ users",
          "Improved API performance by 40%",
        ],
      },
    ],

    // 🔹 Education
    education: [
      {
        degree: "B.Tech in Computer Science",
        institution: "XYZ University",
        duration: "2016 - 2020",
        location: "Pune",
      },
    ],

    // 🔹 Projects
    projects: [
      {
        name: "StudySync",
        description:
          "An online platform where students can upload, download, and interact with study notes.",
        technologies: ["React", "Express", "MongoDB"],
        link: "https://studysync.dev",
        github: "https://github.com/johndoe/studysync",
      },
    ],

    // 🔹 Certifications
    certifications: [
      {
        title: "AWS Certified Developer",
        issuer: "Amazon",
        date: "Jan 2023",
      },
    ],

    // 🔹 Achievements
    achievements: [
      "Winner - Hackathon 2022",
      "Top 5% in Google Code Jam 2023",
    ],
  });

  return (
    <ResumeContext.Provider value={{ resumeData, setResumeData }}>
      {children}
    </ResumeContext.Provider>
  );
};

export const useResume = () => useContext(ResumeContext);
