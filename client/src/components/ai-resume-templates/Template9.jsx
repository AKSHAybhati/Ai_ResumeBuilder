import React, { useState, useRef, useEffect } from "react";
import Sidebar from "../Sidebar/Sidebar";
import Navbar from "../Navbar/Navbar";
import { useResume } from "../../context/ResumeContext";
import { FaCog, FaPlus, FaTrash } from "react-icons/fa";

const Template9 = () => {
  const resumeRef = useRef(null);
  const { resumeData, setResumeData } = useResume();
  const [editMode, setEditMode] = useState(false);
  const [localData, setLocalData] = useState(resumeData);
  const [activeSection, setActiveSection] = useState(null);
  const [showSettings, setShowSettings] = useState(false);
  const [visibleFields, setVisibleFields] = useState({
    name: true,
    designation: true,
    contact: true,
    summary: true,
    skills: true,
    experience: true,
    achievements: true,
    education: true,
    courses: true,
    languages: true,
    projects: true,
  });
  const settingsRef = useRef(null);

  useEffect(() => {
    setLocalData(resumeData);
  }, [resumeData]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (settingsRef.current && !settingsRef.current.contains(event.target)) {
        setShowSettings(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleFieldChange = (field, value) => {
    setLocalData((prev) => ({ ...prev, [field]: value }));
  };

  const handleArrayFieldChange = (section, index, key, value) => {
    const updated = [...localData[section]];
    updated[index][key] = value;
    setLocalData({ ...localData, [section]: updated });
  };

  const handleSave = () => {
    setResumeData(localData);
    setEditMode(false);
    setActiveSection(null);
  };

  const handleCancel = () => {
    setLocalData(resumeData);
    setEditMode(false);
    setActiveSection(null);
  };

  const handleEnhance = (section) => {
    console.log("Enhance requested for:", section);
  };

  // Helper function to extract email from contact
  const extractEmailFromContact = (contact) => {
    const emailMatch = contact.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
    return emailMatch ? emailMatch[0] : "example@gmail.com";
  };

  const handleToggleField = (field) => {
    setVisibleFields((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const addSkill = () => {
    setLocalData({ ...localData, skills: [...localData.skills, "New Skill"] });
  };

  const removeSkill = (index) => {
    const updatedSkills = localData.skills.filter((_, i) => i !== index);
    setLocalData({ ...localData, skills: updatedSkills });
  };

  const addExperience = () => {
    setLocalData({
      ...localData,
      experience: [
        ...localData.experience,
        { 
          title: "New Position", 
          companyName: "New Company", 
          date: "MM/YYYY - MM/YYYY", 
          companyLocation: "Location",
          accomplishment: ["New accomplishment"] 
        },
      ],
    });
  };

  const removeExperience = (index) => {
    setLocalData({
      ...localData,
      experience: localData.experience.filter((_, i) => i !== index),
    });
  };

  const addAchievement = () => {
    setLocalData({
      ...localData,
      achievements: [...localData.achievements, "New Achievement"],
    });
  };

  const removeAchievement = (index) => {
    setLocalData({
      ...localData,
      achievements: localData.achievements.filter((_, i) => i !== index),
    });
  };

  const addEducation = () => {
    setLocalData({
      ...localData,
      education: [
        ...localData.education,
        { degree: "New Degree", duration: "MM/YYYY - MM/YYYY", institution: "New School", location: "Location" },
      ],
    });
  };

  const removeEducation = (index) => {
    setLocalData({
      ...localData,
      education: localData.education.filter((_, i) => i !== index),
    });
  };

  const addCourse = () => {
    setLocalData({
      ...localData,
      certifications: [
        ...localData.certifications,
        { title: "New Course", issuer: "Issuer", date: "MM/YYYY" },
      ],
    });
  };

  const removeCourse = (index) => {
    setLocalData({
      ...localData,
      certifications: localData.certifications.filter((_, i) => i !== index),
    });
  };

  const addLanguage = () => {
    setLocalData({ ...localData, languages: [...localData.languages, "New Language"] });
  };

  const removeLanguage = (index) => {
    const updatedLanguages = localData.languages.filter((_, i) => i !== index);
    setLocalData({ ...localData, languages: updatedLanguages });
  };

  const addProject = () => {
    setLocalData({
      ...localData,
      projects: [
        ...localData.projects,
        { 
          name: "New Project", 
          description: "Description here",
          technologies: ["Tech1", "Tech2"],
          link: "https://example.com",
          github: "https://github.com/example"
        },
      ],
    });
  };

  const removeProject = (index) => {
    setLocalData({
      ...localData,
      projects: localData.projects.filter((_, i) => i !== index),
    });
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f3f4f6" }}>
      <Navbar />
      <div style={{ display: "flex" }}>
        <Sidebar onEnhance={handleEnhance} resumeRef={resumeRef} />

        <div style={{ 
          flexGrow: 1, 
          padding: "1rem",
          display: "flex", 
          flexDirection: "column", 
          alignItems: "center",
          width: "100%",
          transition: "margin-left 0.3s ease-in-out"
        }}>
          <div
            ref={resumeRef}
            style={{
              backgroundColor: "#fff",
              color: "#111827",
              maxWidth: "1000px",
              width: "100%",
              padding: "2rem",
              boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
              borderRadius: "0.5rem",
              position: "relative"
            }}
            onClick={() => {
              setActiveSection(null);
              setShowSettings(false);
            }}
          >
            {/* Settings Toggle */}
            {activeSection === "name" && (
              <FaCog
                style={{
                  position: "absolute",
                  top: "2.5rem",
                  right: "2.5rem",
                  cursor: "pointer",
                  color: "#6b7280",
                  fontSize: "1.25rem"
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  setShowSettings(!showSettings);
                }}
              />
            )}

            {/* Settings Popup */}
            {showSettings && (
              <div
                ref={settingsRef}
                style={{
                  position: "absolute",
                  top: "3rem",
                  right: "1rem",
                  padding: "1rem",
                  backgroundColor: "#f3f4f6",
                  borderRadius: "0.5rem",
                  boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                  zIndex: 10
                }}
                onClick={(e) => e.stopPropagation()}
              >
                {["name", "designation", "contact", "summary", "skills", "experience", "achievements", "education", "courses", "languages", "projects"].map((field) => (
                  <div key={field} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
                    <span style={{ fontSize: "0.875rem", fontWeight: "500" }}>
                      Show {field.charAt(0).toUpperCase() + field.slice(1)}
                    </span>
                    <label style={{ position: "relative", display: "inline-block", width: "2.5rem", height: "1.25rem" }}>
                      <input
                        type="checkbox"
                        checked={visibleFields[field]}
                        onChange={() => handleToggleField(field)}
                        style={{ opacity: 0, width: 0, height: 0 }}
                      />
                      <span
                        style={{
                          position: "absolute",
                          cursor: "pointer",
                          top: 0,
                          left: 0,
                          right: 0,
                          bottom: 0,
                          borderRadius: "9999px",
                          transition: "0.4s",
                          backgroundColor: visibleFields[field] ? "#3b82f6" : "#d1d5db"
                        }}
                      >
                        <span
                          style={{
                            position: "absolute",
                            left: "0.125rem",
                            top: "0.125rem",
                            backgroundColor: "#fff",
                            width: "0.875rem",
                            height: "0.875rem",
                            borderRadius: "50%",
                            transition: "0.4s",
                            transform: visibleFields[field] ? "translateX(1.25rem)" : "translateX(0)"
                          }}
                        />
                      </span>
                    </label>
                  </div>
                ))}
              </div>
            )}

            {/* Header */}
            <div 
              style={{ display: "flex", justifyContent: "space-between", marginBottom: "1.5rem", textAlign: "left", paddingBottom: "1.5rem" }}
              onClick={(e) => {
                e.stopPropagation();
                setActiveSection("name");
              }}
            >
              <div>
                {visibleFields.name && (
                  editMode ? (
                    <input
                      type="text"
                      value={localData.name || ""}
                      onChange={(e) => handleFieldChange("name", e.target.value)}
                      style={{ 
                        fontSize: "1.875rem", 
                        fontWeight: "bold", 
                        display: "block",
                        border: "1px solid #d1d5db",
                        padding: "0.25rem",
                        borderRadius: "0.25rem",
                        width: "100%"
                      }}
                    />
                  ) : (
                    <h1 style={{ fontSize: "1.875rem", fontWeight: "bold", margin: 0 }}>{resumeData.name}</h1>
                  )
                )}
                {visibleFields.designation && (
                  editMode ? (
                    <input
                      type="text"
                      value={localData.role || ""}
                      onChange={(e) => handleFieldChange("role", e.target.value)}
                      style={{ 
                        fontSize: "1.125rem", 
                        color: "#6b7280",
                        border: "1px solid #d1d5db",
                        padding: "0.25rem",
                        borderRadius: "0.25rem",
                        marginTop: "0.5rem",
                        width: "100%"
                      }}
                    />
                  ) : (
                    <h2 style={{ fontSize: "1.125rem", color: "#6b7280", margin: "0.5rem 0 0 0" }}>{resumeData.role}</h2>
                  )
                )}
              </div>
              <div style={{ textAlign: "right" }}>
                {visibleFields.contact && (
                  editMode ? (
                    <div>
                      <input
                        type="text"
                        value={localData.phone || ""}
                        onChange={(e) => handleFieldChange("phone", e.target.value)}
                        placeholder="Phone"
                        style={{ 
                          display: "block", 
                          marginBottom: "0.25rem",
                          border: "1px solid #d1d5db",
                          padding: "0.25rem",
                          borderRadius: "0.25rem"
                        }}
                      />
                      <input
                        type="text"
                        value={localData.email || ""}
                        onChange={(e) => handleFieldChange("email", e.target.value)}
                        placeholder="Email"
                        style={{ 
                          display: "block", 
                          marginBottom: "0.25rem",
                          border: "1px solid #d1d5db",
                          padding: "0.25rem",
                          borderRadius: "0.25rem"
                        }}
                      />
                      <input
                        type="text"
                        value={localData.location || ""}
                        onChange={(e) => handleFieldChange("location", e.target.value)}
                        placeholder="Location"
                        style={{ 
                          display: "block", 
                          marginBottom: "0.25rem",
                          border: "1px solid #d1d5db",
                          padding: "0.25rem",
                          borderRadius: "0.25rem"
                        }}
                      />
                      <input
                        type="text"
                        value={localData.linkedin || ""}
                        onChange={(e) => handleFieldChange("linkedin", e.target.value)}
                        placeholder="LinkedIn"
                        style={{ 
                          display: "block", 
                          marginBottom: "0.25rem",
                          border: "1px solid #d1d5db",
                          padding: "0.25rem",
                          borderRadius: "0.25rem"
                        }}
                      />
                    </div>
                  ) : (
                    <div>
                      <p style={{ margin: "0.125rem 0" }}>{resumeData.phone}</p>
                      <p style={{ margin: "0.125rem 0" }}>{resumeData.email}</p>
                      <p style={{ margin: "0.125rem 0" }}>{resumeData.location}</p>
                      <p style={{ margin: "0.125rem 0" }}>{resumeData.linkedin}</p>
                    </div>
                  )
                )}
              </div>
            </div>

            {/* Summary */}
            {visibleFields.summary && (
              <div 
                style={{ marginBottom: "1.5rem" }}
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveSection("profile");
                }}
              >
                <h3 style={{ fontWeight: "bold", fontSize: "1.125rem", textTransform: "uppercase", borderBottom: "1px solid #e5e7eb", paddingBottom: "0.5rem", margin: "0 0 0.5rem 0" }}>
                  Profile
                </h3>
                {editMode ? (
                  <textarea
                    value={localData.summary || ""}
                    onChange={(e) => handleFieldChange("summary", e.target.value)}
                    style={{ 
                      width: "100%", 
                      minHeight: "4rem",
                      border: "1px solid #d1d5db",
                      padding: "0.5rem",
                      borderRadius: "0.25rem",
                      color: "#374151"
                    }}
                  />
                ) : (
                  <div style={{ color: "#374151", marginTop: "0.5rem" }}>
                    {resumeData.summary}
                  </div>
                )}
              </div>
            )}

            {/* Skills */}
            {visibleFields.skills && (
              <div 
                style={{ marginBottom: "1.5rem" }}
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveSection("skills");
                }}
              >
                <h3 style={{ fontWeight: "bold", fontSize: "1.125rem", textTransform: "uppercase", borderBottom: "1px solid #e5e7eb", paddingBottom: "0.5rem", margin: "0 0 0.5rem 0" }}>
                  Key Skills
                </h3>
                <ul style={{ color: "#374151", marginTop: "0.5rem", paddingLeft: "1.25rem" }}>
                  {localData.skills.map((skill, index) => (
                    <li key={index} style={{ marginBottom: "0.25rem" }}>
                      {editMode ? (
                        <input
                          type="text"
                          value={skill}
                          onChange={(e) => {
                            const updatedSkills = [...localData.skills];
                            updatedSkills[index] = e.target.value;
                            setLocalData({ ...localData, skills: updatedSkills });
                          }}
                          style={{
                            border: "1px solid #d1d5db",
                            padding: "0.25rem",
                            borderRadius: "0.25rem",
                            width: "100%"
                          }}
                        />
                      ) : (
                        skill
                      )}
                    </li>
                  ))}
                </ul>
                {editMode && activeSection === "skills" && (
                  <div style={{ display: "flex", gap: "0.75rem", marginTop: "0.75rem" }}>
                    <button
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                        padding: "0.5rem 0.75rem",
                        backgroundColor: "#16a34a",
                        color: "white",
                        borderRadius: "0.375rem",
                        border: "none",
                        cursor: "pointer",
                        boxShadow: "0 1px 2px rgba(0,0,0,0.1)"
                      }}
                      onClick={addSkill}
                    >
                      <FaPlus /> New Skill
                    </button>
                    <button
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                        padding: "0.5rem 0.75rem",
                        backgroundColor: "#dc2626",
                        color: "white",
                        borderRadius: "0.375rem",
                        border: "none",
                        cursor: "pointer",
                        boxShadow: "0 1px 2px rgba(0,0,0,0.1)"
                      }}
                      onClick={() => removeSkill(localData.skills.length - 1)}
                    >
                      <FaTrash /> Remove
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Experience */}
            {visibleFields.experience && (
              <div 
                style={{ marginBottom: "1.5rem" }}
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveSection("experience");
                }}
              >
                <h3 style={{ fontWeight: "bold", fontSize: "1.125rem", textTransform: "uppercase", borderBottom: "1px solid #e5e7eb", paddingBottom: "0.5rem", margin: "0 0 0.5rem 0" }}>
                  Work Experience
                </h3>
                {localData.experience.map((exp, index) => (
                  <div key={index} style={{ padding: "1rem", marginBottom: "1rem", backgroundColor: "#fff", boxShadow: "0 2px 4px rgba(0,0,0,0.1)", borderRadius: "0.5rem" }}>
                    {editMode ? (
                      <>
                        <input
                          type="text"
                          value={exp.title}
                          onChange={(e) => handleArrayFieldChange("experience", index, "title", e.target.value)}
                          placeholder="Job Title"
                          style={{
                            fontSize: "1.125rem",
                            fontWeight: "600",
                            border: "1px solid #d1d5db",
                            padding: "0.25rem",
                            borderRadius: "0.25rem",
                            width: "100%",
                            marginBottom: "0.5rem"
                          }}
                        />
                        <input
                          type="text"
                          value={exp.companyName}
                          onChange={(e) => handleArrayFieldChange("experience", index, "companyName", e.target.value)}
                          placeholder="Company Name"
                          style={{
                            color: "#374151",
                            border: "1px solid #d1d5db",
                            padding: "0.25rem",
                            borderRadius: "0.25rem",
                            width: "100%",
                            marginBottom: "0.5rem"
                          }}
                        />
                        <input
                          type="text"
                          value={exp.date}
                          onChange={(e) => handleArrayFieldChange("experience", index, "date", e.target.value)}
                          placeholder="Duration"
                          style={{
                            color: "#374151",
                            fontSize: "0.875rem",
                            border: "1px solid #d1d5db",
                            padding: "0.25rem",
                            borderRadius: "0.25rem",
                            width: "100%",
                            marginBottom: "0.5rem"
                          }}
                        />
                        <input
                          type="text"
                          value={exp.companyLocation}
                          onChange={(e) => handleArrayFieldChange("experience", index, "companyLocation", e.target.value)}
                          placeholder="Location"
                          style={{
                            color: "#374151",
                            fontSize: "0.875rem",
                            border: "1px solid #d1d5db",
                            padding: "0.25rem",
                            borderRadius: "0.25rem",
                            width: "100%",
                            marginBottom: "0.5rem"
                          }}
                        />
                        <textarea
                          value={exp.accomplishment ? exp.accomplishment.join("\n") : ""}
                          onChange={(e) => handleArrayFieldChange("experience", index, "accomplishment", e.target.value.split("\n"))}
                          placeholder="Accomplishments (one per line)"
                          style={{
                            color: "#374151",
                            border: "1px solid #d1d5db",
                            padding: "0.5rem",
                            borderRadius: "0.25rem",
                            width: "100%",
                            minHeight: "3rem"
                          }}
                        />
                      </>
                    ) : (
                      <>
                        <div style={{ fontSize: "1.125rem", fontWeight: "600" }}>{exp.title}</div>
                        <div style={{ color: "#374151", marginTop: "0.5rem" }}>{exp.companyName}</div>
                        <div style={{ color: "#374151", marginTop: "0.5rem", fontSize: "0.875rem" }}>
                          {exp.date} - {exp.companyLocation}
                        </div>
                        <ul style={{ color: "#374151", marginTop: "0.5rem", paddingLeft: "1.25rem" }}>
                          {exp.accomplishment && exp.accomplishment.map((acc, accIndex) => (
                            <li key={accIndex} style={{ marginBottom: "0.25rem" }}>{acc}</li>
                          ))}
                        </ul>
                      </>
                    )}
                    {editMode && activeSection === "experience" && (
                      <div style={{ marginTop: "0.5rem", display: "flex", gap: "0.5rem" }}>
                        <button
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "0.5rem",
                            padding: "0.5rem 1rem",
                            borderRadius: "9999px",
                            backgroundColor: "#10b981",
                            color: "white",
                            border: "none",
                            cursor: "pointer",
                            boxShadow: "0 4px 6px rgba(0,0,0,0.1)"
                          }}
                          onClick={addExperience}
                        >
                          <FaPlus /> New Experience
                        </button>
                        <button
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "0.5rem",
                            padding: "0.25rem 0.75rem",
                            backgroundColor: "#dc2626",
                            color: "white",
                            borderRadius: "0.375rem",
                            border: "none",
                            cursor: "pointer",
                            boxShadow: "0 1px 2px rgba(0,0,0,0.1)"
                          }}
                          onClick={() => removeExperience(index)}
                        >
                          <FaTrash /> Remove
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Achievements */}
            {visibleFields.achievements && (
              <div 
                style={{ marginBottom: "1.5rem" }}
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveSection("achievements");
                }}
              >
                <h3 style={{ fontWeight: "bold", fontSize: "1.125rem", textTransform: "uppercase", borderBottom: "1px solid #e5e7eb", paddingBottom: "0.5rem", margin: "0 0 0.5rem 0" }}>
                  Achievements
                </h3>
                <ul style={{ color: "#374151", marginTop: "0.5rem", paddingLeft: "1.25rem" }}>
                  {localData.achievements.map((achievement, index) => (
                    <li key={index} style={{ marginBottom: "0.25rem" }}>
                      {editMode ? (
                        <input
                          type="text"
                          value={achievement}
                          onChange={(e) => {
                            const updated = [...localData.achievements];
                            updated[index] = e.target.value;
                            setLocalData({ ...localData, achievements: updated });
                          }}
                          style={{
                            border: "1px solid #d1d5db",
                            padding: "0.25rem",
                            borderRadius: "0.25rem",
                            width: "100%"
                          }}
                        />
                      ) : (
                        achievement
                      )}
                    </li>
                  ))}
                </ul>
                {editMode && activeSection === "achievements" && (
                  <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.75rem" }}>
                    <button
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                        padding: "0.5rem 1rem",
                        borderRadius: "9999px",
                        backgroundColor: "#10b981",
                        color: "white",
                        border: "none",
                        cursor: "pointer",
                        boxShadow: "0 4px 6px rgba(0,0,0,0.1)"
                      }}
                      onClick={addAchievement}
                    >
                      <FaPlus /> New Achievement
                    </button>
                    <button
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                        padding: "0.25rem 0.75rem",
                        backgroundColor: "#dc2626",
                        color: "white",
                        borderRadius: "0.375rem",
                        border: "none",
                        cursor: "pointer",
                        boxShadow: "0 1px 2px rgba(0,0,0,0.1)"
                      }}
                      onClick={() => removeAchievement(localData.achievements.length - 1)}
                    >
                      <FaTrash /> Remove
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Education */}
            {visibleFields.education && (
              <div 
                style={{ marginBottom: "1.5rem" }}
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveSection("education");
                }}
              >
                <h3 style={{ fontWeight: "bold", fontSize: "1.125rem", textTransform: "uppercase", borderBottom: "1px solid #e5e7eb", paddingBottom: "0.5rem", margin: "0 0 0.5rem 0" }}>
                  Education
                </h3>
                {localData.education.map((edu, index) => (
                  <div key={index} style={{ padding: "1rem", marginBottom: "1rem", backgroundColor: "#fff", boxShadow: "0 2px 4px rgba(0,0,0,0.1)", borderRadius: "0.5rem" }}>
                    {editMode ? (
                      <>
                        <input
                          type="text"
                          value={edu.degree}
                          onChange={(e) => handleArrayFieldChange("education", index, "degree", e.target.value)}
                          placeholder="Degree"
                          style={{
                            fontSize: "1.125rem",
                            fontWeight: "600",
                            border: "1px solid #d1d5db",
                            padding: "0.25rem",
                            borderRadius: "0.25rem",
                            width: "100%",
                            marginBottom: "0.5rem"
                          }}
                        />
                        <input
                          type="text"
                          value={edu.institution}
                          onChange={(e) => handleArrayFieldChange("education", index, "institution", e.target.value)}
                          placeholder="Institution"
                          style={{
                            color: "#374151",
                            border: "1px solid #d1d5db",
                            padding: "0.25rem",
                            borderRadius: "0.25rem",
                            width: "100%",
                            marginBottom: "0.5rem"
                          }}
                        />
                        <input
                          type="text"
                          value={edu.duration}
                          onChange={(e) => handleArrayFieldChange("education", index, "duration", e.target.value)}
                          placeholder="Duration"
                          style={{
                            color: "#374151",
                            fontSize: "0.875rem",
                            border: "1px solid #d1d5db",
                            padding: "0.25rem",
                            borderRadius: "0.25rem",
                            width: "100%",
                            marginBottom: "0.5rem"
                          }}
                        />
                        <input
                          type="text"
                          value={edu.location}
                          onChange={(e) => handleArrayFieldChange("education", index, "location", e.target.value)}
                          placeholder="Location"
                          style={{
                            color: "#374151",
                            fontSize: "0.875rem",
                            border: "1px solid #d1d5db",
                            padding: "0.25rem",
                            borderRadius: "0.25rem",
                            width: "100%"
                          }}
                        />
                      </>
                    ) : (
                      <>
                        <div style={{ fontSize: "1.125rem", fontWeight: "600" }}>{edu.degree}</div>
                        <div style={{ color: "#374151", marginTop: "0.5rem" }}>{edu.institution}</div>
                        <div style={{ color: "#374151", marginTop: "0.5rem", fontSize: "0.875rem" }}>
                          {edu.duration} - {edu.location}
                        </div>
                      </>
                    )}
                    {editMode && activeSection === "education" && (
                      <div style={{ marginTop: "0.5rem", display: "flex", gap: "0.5rem" }}>
                        <button
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "0.5rem",
                            padding: "0.5rem 1rem",
                            borderRadius: "9999px",
                            backgroundColor: "#10b981",
                            color: "white",
                            border: "none",
                            cursor: "pointer",
                            boxShadow: "0 4px 6px rgba(0,0,0,0.1)"
                          }}
                          onClick={addEducation}
                        >
                          <FaPlus /> New Education
                        </button>
                        <button
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "0.5rem",
                            padding: "0.25rem 0.75rem",
                            backgroundColor: "#dc2626",
                            color: "white",
                            borderRadius: "0.375rem",
                            border: "none",
                            cursor: "pointer",
                            boxShadow: "0 1px 2px rgba(0,0,0,0.1)"
                          }}
                          onClick={() => removeEducation(index)}
                        >
                          <FaTrash /> Remove
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Certifications/Courses */}
            {visibleFields.courses && (
              <div 
                style={{ marginBottom: "1.5rem" }}
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveSection("courses");
                }}
              >
                <h3 style={{ fontWeight: "bold", fontSize: "1.125rem", textTransform: "uppercase", borderBottom: "1px solid #e5e7eb", paddingBottom: "0.5rem", margin: "0 0 0.5rem 0" }}>
                  Courses
                </h3>
                {localData.certifications.map((course, index) => (
                  <div key={index} style={{ padding: "1rem", marginBottom: "1rem", backgroundColor: "#fff", boxShadow: "0 2px 4px rgba(0,0,0,0.1)", borderRadius: "0.5rem" }}>
                    {editMode ? (
                      <>
                        <input
                          type="text"
                          value={course.title}
                          onChange={(e) => handleArrayFieldChange("certifications", index, "title", e.target.value)}
                          placeholder="Course Title"
                          style={{
                            fontSize: "1.125rem",
                            fontWeight: "600",
                            border: "1px solid #d1d5db",
                            padding: "0.25rem",
                            borderRadius: "0.25rem",
                            width: "100%",
                            marginBottom: "0.5rem"
                          }}
                        />
                        <input
                          type="text"
                          value={course.issuer}
                          onChange={(e) => handleArrayFieldChange("certifications", index, "issuer", e.target.value)}
                          placeholder="Issued By"
                          style={{
                            color: "#374151",
                            border: "1px solid #d1d5db",
                            padding: "0.25rem",
                            borderRadius: "0.25rem",
                            width: "100%",
                            marginBottom: "0.5rem"
                          }}
                        />
                        <input
                          type="text"
                          value={course.date}
                          onChange={(e) => handleArrayFieldChange("certifications", index, "date", e.target.value)}
                          placeholder="Date"
                          style={{
                            color: "#374151",
                            fontSize: "0.875rem",
                            border: "1px solid #d1d5db",
                            padding: "0.25rem",
                            borderRadius: "0.25rem",
                            width: "100%"
                          }}
                        />
                      </>
                    ) : (
                      <>
                        <div style={{ fontSize: "1.125rem", fontWeight: "600" }}>{course.title}</div>
                        <div style={{ color: "#374151", marginTop: "0.5rem" }}>{course.issuer}</div>
                        <div style={{ color: "#374151", marginTop: "0.5rem", fontSize: "0.875rem" }}>
                          {course.date}
                        </div>
                      </>
                    )}
                    {editMode && activeSection === "courses" && (
                      <div style={{ marginTop: "0.5rem", display: "flex", gap: "0.5rem" }}>
                        <button
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "0.5rem",
                            padding: "0.5rem 1rem",
                            borderRadius: "9999px",
                            backgroundColor: "#10b981",
                            color: "white",
                            border: "none",
                            cursor: "pointer",
                            boxShadow: "0 4px 6px rgba(0,0,0,0.1)"
                          }}
                          onClick={addCourse}
                        >
                          <FaPlus /> New Course
                        </button>
                        <button
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "0.5rem",
                            padding: "0.25rem 0.75rem",
                            backgroundColor: "#dc2626",
                            color: "white",
                            borderRadius: "0.375rem",
                            border: "none",
                            cursor: "pointer",
                            boxShadow: "0 1px 2px rgba(0,0,0,0.1)"
                          }}
                          onClick={() => removeCourse(index)}
                        >
                          <FaTrash /> Remove
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Languages */}
            {visibleFields.languages && (
              <div 
                style={{ marginBottom: "1.5rem" }}
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveSection("languages");
                }}
              >
                <h3 style={{ fontWeight: "bold", fontSize: "1.125rem", textTransform: "uppercase", borderBottom: "1px solid #e5e7eb", paddingBottom: "0.5rem", margin: "0 0 0.5rem 0" }}>
                  Languages
                </h3>
                <ul style={{ color: "#374151", marginTop: "0.5rem", paddingLeft: "1.25rem" }}>
                  {localData.languages.map((language, index) => (
                    <li key={index} style={{ marginBottom: "0.25rem" }}>
                      {editMode ? (
                        <input
                          type="text"
                          value={language}
                          onChange={(e) => {
                            const updatedLanguages = [...localData.languages];
                            updatedLanguages[index] = e.target.value;
                            setLocalData({ ...localData, languages: updatedLanguages });
                          }}
                          style={{
                            border: "1px solid #d1d5db",
                            padding: "0.25rem",
                            borderRadius: "0.25rem",
                            width: "100%"
                          }}
                        />
                      ) : (
                        language
                      )}
                    </li>
                  ))}
                </ul>
                {editMode && activeSection === "languages" && (
                  <div style={{ display: "flex", gap: "0.75rem", marginTop: "0.75rem" }}>
                    <button
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                        padding: "0.25rem 0.75rem",
                        backgroundColor: "#16a34a",
                        color: "white",
                        borderRadius: "0.375rem",
                        border: "none",
                        cursor: "pointer",
                        boxShadow: "0 1px 2px rgba(0,0,0,0.1)"
                      }}
                      onClick={addLanguage}
                    >
                      <FaPlus /> New Language
                    </button>
                    <button
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                        padding: "0.25rem 0.75rem",
                        backgroundColor: "#dc2626",
                        color: "white",
                        borderRadius: "0.375rem",
                        border: "none",
                        cursor: "pointer",
                        boxShadow: "0 1px 2px rgba(0,0,0,0.1)"
                      }}
                      onClick={() => removeLanguage(localData.languages.length - 1)}
                    >
                      <FaTrash /> Remove
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Projects */}
            {visibleFields.projects && (
              <div 
                style={{ marginBottom: "1.5rem" }}
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveSection("projects");
                }}
              >
                <h3 style={{ fontWeight: "bold", fontSize: "1.125rem", textTransform: "uppercase", borderBottom: "1px solid #e5e7eb", paddingBottom: "0.5rem", margin: "0 0 0.5rem 0" }}>
                  Projects
                </h3>
                {localData.projects.map((project, index) => (
                  <div key={index} style={{ padding: "1rem", marginBottom: "1rem", backgroundColor: "#fff", boxShadow: "0 2px 4px rgba(0,0,0,0.1)", borderRadius: "0.5rem" }}>
                    {editMode ? (
                      <>
                        <input
                          type="text"
                          value={project.name}
                          onChange={(e) => handleArrayFieldChange("projects", index, "name", e.target.value)}
                          placeholder="Project Name"
                          style={{
                            fontSize: "1.125rem",
                            fontWeight: "600",
                            border: "1px solid #d1d5db",
                            padding: "0.25rem",
                            borderRadius: "0.25rem",
                            width: "100%",
                            marginBottom: "0.5rem"
                          }}
                        />
                        <textarea
                          value={project.description}
                          onChange={(e) => handleArrayFieldChange("projects", index, "description", e.target.value)}
                          placeholder="Project Description"
                          style={{
                            color: "#374151",
                            border: "1px solid #d1d5db",
                            padding: "0.5rem",
                            borderRadius: "0.25rem",
                            width: "100%",
                            minHeight: "3rem",
                            marginBottom: "0.5rem"
                          }}
                        />
                        <input
                          type="text"
                          value={project.technologies ? project.technologies.join(", ") : ""}
                          onChange={(e) => handleArrayFieldChange("projects", index, "technologies", e.target.value.split(",").map(t => t.trim()))}
                          placeholder="Technologies (comma separated)"
                          style={{
                            color: "#374151",
                            border: "1px solid #d1d5db",
                            padding: "0.25rem",
                            borderRadius: "0.25rem",
                            width: "100%",
                            marginBottom: "0.5rem"
                          }}
                        />
                        <input
                          type="text"
                          value={project.link}
                          onChange={(e) => handleArrayFieldChange("projects", index, "link", e.target.value)}
                          placeholder="Live Link"
                          style={{
                            color: "#374151",
                            border: "1px solid #d1d5db",
                            padding: "0.25rem",
                            borderRadius: "0.25rem",
                            width: "100%",
                            marginBottom: "0.5rem"
                          }}
                        />
                        <input
                          type="text"
                          value={project.github}
                          onChange={(e) => handleArrayFieldChange("projects", index, "github", e.target.value)}
                          placeholder="GitHub Link"
                          style={{
                            color: "#374151",
                            border: "1px solid #d1d5db",
                            padding: "0.25rem",
                            borderRadius: "0.25rem",
                            width: "100%"
                          }}
                        />
                      </>
                    ) : (
                      <>
                        <div style={{ fontSize: "1.125rem", fontWeight: "600" }}>{project.name}</div>
                        <div style={{ color: "#374151", marginTop: "0.5rem" }}>{project.description}</div>
                        <div style={{ color: "#374151", marginTop: "0.5rem", fontSize: "0.875rem" }}>
                          Technologies: {project.technologies ? project.technologies.join(", ") : ""}
                        </div>
                        <div style={{ color: "#374151", marginTop: "0.5rem", fontSize: "0.875rem" }}>
                          <a href={project.link} target="_blank" rel="noopener noreferrer" style={{ color: "#3b82f6", textDecoration: "underline" }}>
                            Live Demo
                          </a>
                          {" | "}
                          <a href={project.github} target="_blank" rel="noopener noreferrer" style={{ color: "#3b82f6", textDecoration: "underline" }}>
                            GitHub
                          </a>
                        </div>
                      </>
                    )}
                    {editMode && activeSection === "projects" && (
                      <div style={{ marginTop: "0.5rem", display: "flex", gap: "0.5rem" }}>
                        <button
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "0.5rem",
                            padding: "0.5rem 1rem",
                            borderRadius: "9999px",
                            backgroundColor: "#10b981",
                            color: "white",
                            border: "none",
                            cursor: "pointer",
                            boxShadow: "0 4px 6px rgba(0,0,0,0.1)"
                          }}
                          onClick={addProject}
                        >
                          <FaPlus /> New Project
                        </button>
                        <button
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "0.5rem",
                            padding: "0.25rem 0.75rem",
                            backgroundColor: "#dc2626",
                            color: "white",
                            borderRadius: "0.375rem",
                            border: "none",
                            cursor: "pointer",
                            boxShadow: "0 1px 2px rgba(0,0,0,0.1)"
                          }}
                          onClick={() => removeProject(index)}
                        >
                          <FaTrash /> Remove
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Edit/Save/Cancel Buttons */}
          <div style={{ marginTop: "1rem", textAlign: "center" }}>
            {editMode ? (
              <>
                <button
                  onClick={handleSave}
                  style={{ 
                    backgroundColor: "#10b981", 
                    color: "white", 
                    padding: "0.5rem 1rem", 
                    borderRadius: "0.375rem", 
                    marginRight: "0.5rem",
                    border: "none",
                    cursor: "pointer"
                  }}
                >
                  Save
                </button>
                <button
                  onClick={handleCancel}
                  style={{ 
                    backgroundColor: "#6b7280", 
                    color: "white", 
                    padding: "0.5rem 1rem", 
                    borderRadius: "0.375rem",
                    border: "none",
                    cursor: "pointer"
                  }}
                >
                  Cancel
                </button>
              </>
            ) : (
              <button
                onClick={() => setEditMode(true)}
                style={{ 
                  backgroundColor: "#3b82f6", 
                  color: "white", 
                  padding: "0.5rem 1rem", 
                  borderRadius: "0.375rem",
                  border: "none",
                  cursor: "pointer"
                }}
              >
                Edit
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Media Queries for Responsive Design */}
      <style jsx>{`
        @media (max-width: 768px) {
          .main-content {
            padding: 1rem !important;
          }
        }
        
        @media (min-width: 1024px) {
          .main-content {
            margin-left: 20rem !important;
            padding-left: 1rem !important;
            padding-right: 1rem !important;
            padding-top: 2.5rem !important;
            padding-bottom: 2.5rem !important;
          }
        }
        
        /* Ensure text wraps properly */
        input, textarea {
          overflow-wrap: break-word;
          word-break: break-word;
          white-space: normal;
        }
      `}</style>
    </div>
  );
};

export default Template9;