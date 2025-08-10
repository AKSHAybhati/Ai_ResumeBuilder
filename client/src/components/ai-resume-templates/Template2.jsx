import React, { useState, useRef, useEffect } from "react";
import Sidebar from "../Sidebar/Sidebar";
import Navbar from "../Navbar/Navbar";
import { useResume } from "../../context/ResumeContext";

const Template1 = () => {
  const resumeRef = useRef(null);
  const { resumeData, setResumeData } = useResume();
  const [editMode, setEditMode] = useState(false);
  const [localData, setLocalData] = useState(resumeData);

  useEffect(() => {
    setLocalData(resumeData);
  }, [resumeData]);

  const handleFieldChange = (field, value) => {
    setLocalData((prev) => ({ ...prev, [field]: value }));
  };

  const handleArrayFieldChange = (section, index, key, value) => {
    const updated = [...localData[section]];
    updated[index][key] = value;
    setLocalData({ ...localData, [section]: updated });
  };

  const handleSkillChange = (index, value) => {
    const updatedSkills = [...localData.skills];
    updatedSkills[index] = value;
    setLocalData({ ...localData, skills: updatedSkills });
  };

  const handleArrayStringChange = (section, index, value) => {
    const updated = [...localData[section]];
    updated[index] = value;
    setLocalData({ ...localData, [section]: updated });
  };

  const handleSave = () => {
    setResumeData(localData);
    setEditMode(false);
  };

  const handleCancel = () => {
    setLocalData(resumeData);
    setEditMode(false);
  };

  const handleEnhance = (section) => {
    console.log("Enhance requested for:", section);
  };

  const handleAddSection = (section) => {
    const templates = {
      experience: {
        title: "New Title",
        companyName: "New Company",
        date: "MM/YYYY - MM/YYYY",
        companyLocation: "City, Country",
        accomplishment: ["Describe your responsibilities and achievements."],
      },
      education: {
        degree: "Degree Name",
        institution: "Institution Name",
        duration: "YYYY - YYYY",
        location: "Location",
      },
      projects: {
        name: "Project Title",
        description: "Project description.",
        technologies: ["Technology1", "Technology2"],
        link: "https://example.com",
        github: "https://github.com/example",
      },
      certifications: {
        title: "Certification Title",
        issuer: "Issuing Organization",
        date: "MM/YYYY",
      },
      skills: "New Skill",
      achievements: "New Achievement",
      languages: "New Language",
      interests: "New Interest",
    };

    const newItem = templates[section];
    if (Array.isArray(localData[section])) {
      setLocalData({ ...localData, [section]: [...localData[section], newItem] });
    }
  };

  const handleRemoveSection = (section, index) => {
    if (index !== undefined) {
      const updated = [...localData[section]];
      updated.splice(index, 1);
      setLocalData({ ...localData, [section]: updated });
    }
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f3f4f6" }}>
      <Navbar />
      <div style={{ display: "flex" }}>
        <Sidebar onEnhance={handleEnhance} resumeRef={resumeRef} />

        <div style={{ flexGrow: 1, padding: "1rem", marginTop: "4rem", display: "flex", flexDirection: "column", alignItems: "center" }}>
          <div
            ref={resumeRef}
            style={{
              backgroundColor: "#f9fafb",
              color: "#111827",
              maxWidth: "64rem",
              width: "100%",
              margin: "1.25rem auto",
              padding: "1.5rem",
              border: "1px solid #d1d5db",
              borderRadius: "0.5rem",
              boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
            }}
          >
            {/* Header */}
            <div style={{ textAlign: "center", marginBottom: "1.5rem", padding: "1rem" }}>
              {editMode ? (
                <>
                  <input
                    type="text"
                    value={localData.name}
                    onChange={(e) => handleFieldChange("name", e.target.value)}
                    style={{ 
                      fontSize: "2rem", 
                      fontWeight: "bold", 
                      display: "block", 
                      width: "100%", 
                      textAlign: "center",
                      border: "1px solid #d1d5db",
                      borderRadius: "0.25rem",
                      padding: "0.5rem",
                      marginBottom: "0.5rem"
                    }}
                  />
                  <input
                    type="text"
                    value={localData.role}
                    onChange={(e) => handleFieldChange("role", e.target.value)}
                    style={{ 
                      fontSize: "1.25rem", 
                      color: "#6b7280",
                      display: "block", 
                      width: "100%", 
                      textAlign: "center",
                      border: "1px solid #d1d5db",
                      borderRadius: "0.25rem",
                      padding: "0.5rem",
                      marginBottom: "0.5rem"
                    }}
                  />
                </>
              ) : (
                <>
                  <h1 style={{ fontSize: "2rem", fontWeight: "bold", wordBreak: "break-words" }}>
                    {resumeData.name}
                  </h1>
                  <h2 style={{ fontSize: "1.25rem", color: "#6b7280", marginTop: "0.5rem" }}>
                    {resumeData.role}
                  </h2>
                </>
              )}
              
              <div style={{ 
                display: "flex", 
                flexWrap: "wrap", 
                justifyContent: "center", 
                gap: "1rem", 
                marginTop: "0.5rem", 
                fontSize: "0.875rem", 
                color: "#374151" 
              }}>
                {["phone", "email", "linkedin", "location", "github", "portfolio"].map((field) =>
                  editMode ? (
                    <input
                      key={field}
                      type="text"
                      value={localData[field] || ""}
                      onChange={(e) => handleFieldChange(field, e.target.value)}
                      placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                      style={{ 
                        border: "1px solid #d1d5db",
                        borderRadius: "0.25rem",
                        padding: "0.25rem 0.5rem",
                        minWidth: "120px"
                      }}
                    />
                  ) : (
                    resumeData[field] && <span key={field}>{resumeData[field]}</span>
                  )
                )}
              </div>
            </div>

            {/* Summary */}
            <div style={{ marginBottom: "1.5rem" }}>
              <h3 style={{ 
                fontWeight: "bold", 
                fontSize: "1.25rem", 
                borderBottom: "2px solid #d1d5db", 
                paddingBottom: "0.25rem", 
                marginBottom: "0.5rem" 
              }}>
                Summary
              </h3>
              {editMode ? (
                <textarea
                  value={localData.summary}
                  onChange={(e) => handleFieldChange("summary", e.target.value)}
                  style={{ 
                    width: "100%", 
                    minHeight: "6rem",
                    border: "1px solid #d1d5db",
                    borderRadius: "0.25rem",
                    padding: "0.5rem",
                    fontSize: "0.875rem"
                  }}
                />
              ) : (
                <p style={{ fontSize: "0.875rem", color: "#374151" }}>{resumeData.summary}</p>
              )}
            </div>

            {/* Skills */}
            <div style={{ marginBottom: "1.5rem" }}>
              <h3 style={{ 
                fontWeight: "bold", 
                fontSize: "1.25rem", 
                borderBottom: "2px solid #d1d5db", 
                paddingBottom: "0.25rem", 
                marginBottom: "0.5rem" 
              }}>
                Skills
              </h3>
              <ul style={{ 
                listStyle: "disc", 
                paddingLeft: "1.25rem", 
                display: "grid", 
                gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", 
                gap: "0.5rem" 
              }}>
                {localData.skills.map((skill, idx) => (
                  <li key={idx} style={{ display: "flex", alignItems: "center" }}>
                    {editMode ? (
                      <input
                        type="text"
                        value={skill}
                        onChange={(e) => handleSkillChange(idx, e.target.value)}
                        style={{ 
                          flex: 1,
                          border: "1px solid #d1d5db",
                          borderRadius: "0.25rem",
                          padding: "0.25rem",
                          fontSize: "0.875rem"
                        }}
                      />
                    ) : (
                      <span style={{ fontSize: "0.875rem", color: "#374151", flex: 1 }}>{skill}</span>
                    )}
                    {editMode && (
                      <button
                        onClick={() => handleRemoveSection("skills", idx)}
                        style={{ 
                          fontSize: "0.75rem", 
                          color: "#ef4444", 
                          marginLeft: "0.5rem",
                          background: "none",
                          border: "none",
                          cursor: "pointer"
                        }}
                      >
                        ✕
                      </button>
                    )}
                  </li>
                ))}
              </ul>
              {editMode && (
                <button
                  onClick={() => handleAddSection("skills")}
                  style={{ 
                    fontSize: "0.875rem", 
                    color: "#3b82f6", 
                    marginTop: "0.5rem",
                    background: "none",
                    border: "none",
                    cursor: "pointer"
                  }}
                >
                  Add Skill
                </button>
              )}
            </div>

            {/* Experience */}
            <div style={{ marginBottom: "1.5rem" }}>
              <h3 style={{ 
                fontWeight: "bold", 
                fontSize: "1.25rem", 
                borderBottom: "2px solid #d1d5db", 
                paddingBottom: "0.25rem", 
                marginBottom: "0.5rem" 
              }}>
                Experience
              </h3>
              {localData.experience.map((exp, idx) => (
                <div key={idx} style={{ marginBottom: "1rem" }}>
                  {editMode ? (
                    <>
                      <input
                        type="text"
                        value={exp.companyName}
                        onChange={(e) => handleArrayFieldChange("experience", idx, "companyName", e.target.value)}
                        placeholder="Company Name"
                        style={{ 
                          fontSize: "1.125rem", 
                          fontWeight: "600",
                          width: "100%",
                          border: "1px solid #d1d5db",
                          borderRadius: "0.25rem",
                          padding: "0.5rem",
                          marginBottom: "0.5rem"
                        }}
                      />
                      <input
                        type="text"
                        value={exp.title}
                        onChange={(e) => handleArrayFieldChange("experience", idx, "title", e.target.value)}
                        placeholder="Job Title"
                        style={{ 
                          fontSize: "0.875rem",
                          width: "100%",
                          border: "1px solid #d1d5db",
                          borderRadius: "0.25rem",
                          padding: "0.5rem",
                          marginBottom: "0.5rem"
                        }}
                      />
                      <input
                        type="text"
                        value={exp.date}
                        onChange={(e) => handleArrayFieldChange("experience", idx, "date", e.target.value)}
                        placeholder="Date"
                        style={{ 
                          fontSize: "0.875rem",
                          width: "100%",
                          border: "1px solid #d1d5db",
                          borderRadius: "0.25rem",
                          padding: "0.5rem",
                          marginBottom: "0.5rem"
                        }}
                      />
                      <input
                        type="text"
                        value={exp.companyLocation}
                        onChange={(e) => handleArrayFieldChange("experience", idx, "companyLocation", e.target.value)}
                        placeholder="Location"
                        style={{ 
                          fontSize: "0.875rem",
                          width: "100%",
                          border: "1px solid #d1d5db",
                          borderRadius: "0.25rem",
                          padding: "0.5rem",
                          marginBottom: "0.5rem"
                        }}
                      />
                      <textarea
                        value={exp.accomplishment?.join("\n") || ""}
                        onChange={(e) => handleArrayFieldChange("experience", idx, "accomplishment", e.target.value.split("\n"))}
                        placeholder="Accomplishments (one per line)"
                        style={{ 
                          width: "100%",
                          minHeight: "4rem",
                          border: "1px solid #d1d5db",
                          borderRadius: "0.25rem",
                          padding: "0.5rem",
                          marginBottom: "0.5rem"
                        }}
                      />
                      <button
                        onClick={() => handleRemoveSection("experience", idx)}
                        style={{ 
                          fontSize: "0.875rem", 
                          color: "#ef4444",
                          background: "none",
                          border: "none",
                          cursor: "pointer"
                        }}
                      >
                        Remove Experience
                      </button>
                    </>
                  ) : (
                    <>
                      <h3 style={{ fontSize: "1.125rem", fontWeight: "600" }}>{exp.companyName}</h3>
                      <p style={{ fontSize: "0.875rem", color: "#6b7280" }}>{exp.title}</p>
                      <p style={{ fontSize: "0.875rem", color: "#6b7280" }}>{exp.date}</p>
                      <p style={{ fontSize: "0.875rem", color: "#6b7280" }}>{exp.companyLocation}</p>
                      {exp.accomplishment && (
                        <ul style={{ fontSize: "0.875rem", color: "#374151", paddingLeft: "1.25rem", listStyle: "disc" }}>
                          {exp.accomplishment.map((item, i) => (
                            <li key={i}>{item}</li>
                          ))}
                        </ul>
                      )}
                    </>
                  )}
                </div>
              ))}
              {editMode && (
                <button
                  onClick={() => handleAddSection("experience")}
                  style={{ 
                    fontSize: "0.875rem", 
                    color: "#3b82f6",
                    background: "none",
                    border: "none",
                    cursor: "pointer"
                  }}
                >
                  Add Experience
                </button>
              )}
            </div>

            {/* Education */}
            <div style={{ marginBottom: "1.5rem" }}>
              <h3 style={{ 
                fontWeight: "bold", 
                fontSize: "1.25rem", 
                borderBottom: "2px solid #d1d5db", 
                paddingBottom: "0.25rem", 
                marginBottom: "0.5rem" 
              }}>
                Education
              </h3>
              {localData.education.map((edu, idx) => (
                <div key={idx} style={{ marginBottom: "1rem" }}>
                  {editMode ? (
                    <>
                      <input
                        type="text"
                        value={edu.institution}
                        onChange={(e) => handleArrayFieldChange("education", idx, "institution", e.target.value)}
                        placeholder="Institution"
                        style={{ 
                          fontSize: "1.125rem", 
                          fontWeight: "600",
                          width: "100%",
                          border: "1px solid #d1d5db",
                          borderRadius: "0.25rem",
                          padding: "0.5rem",
                          marginBottom: "0.5rem"
                        }}
                      />
                      <input
                        type="text"
                        value={edu.degree}
                        onChange={(e) => handleArrayFieldChange("education", idx, "degree", e.target.value)}
                        placeholder="Degree"
                        style={{ 
                          fontSize: "0.875rem",
                          width: "100%",
                          border: "1px solid #d1d5db",
                          borderRadius: "0.25rem",
                          padding: "0.5rem",
                          marginBottom: "0.5rem"
                        }}
                      />
                      <input
                        type="text"
                        value={edu.duration}
                        onChange={(e) => handleArrayFieldChange("education", idx, "duration", e.target.value)}
                        placeholder="Duration"
                        style={{ 
                          fontSize: "0.875rem",
                          width: "100%",
                          border: "1px solid #d1d5db",
                          borderRadius: "0.25rem",
                          padding: "0.5rem",
                          marginBottom: "0.5rem"
                        }}
                      />
                      <input
                        type="text"
                        value={edu.location}
                        onChange={(e) => handleArrayFieldChange("education", idx, "location", e.target.value)}
                        placeholder="Location"
                        style={{ 
                          fontSize: "0.875rem",
                          width: "100%",
                          border: "1px solid #d1d5db",
                          borderRadius: "0.25rem",
                          padding: "0.5rem",
                          marginBottom: "0.5rem"
                        }}
                      />
                      <button
                        onClick={() => handleRemoveSection("education", idx)}
                        style={{ 
                          fontSize: "0.875rem", 
                          color: "#ef4444",
                          background: "none",
                          border: "none",
                          cursor: "pointer"
                        }}
                      >
                        Remove Education
                      </button>
                    </>
                  ) : (
                    <>
                      <h3 style={{ fontSize: "1.125rem", fontWeight: "600" }}>{edu.institution}</h3>
                      <p style={{ fontSize: "0.875rem", color: "#6b7280" }}>{edu.degree}</p>
                      <p style={{ fontSize: "0.875rem", color: "#6b7280" }}>{edu.duration}</p>
                      <p style={{ fontSize: "0.875rem", color: "#6b7280" }}>{edu.location}</p>
                    </>
                  )}
                </div>
              ))}
              {editMode && (
                <button
                  onClick={() => handleAddSection("education")}
                  style={{ 
                    fontSize: "0.875rem", 
                    color: "#3b82f6",
                    background: "none",
                    border: "none",
                    cursor: "pointer"
                  }}
                >
                  Add Education
                </button>
              )}
            </div>

            {/* Projects */}
            <div style={{ marginBottom: "1.5rem" }}>
              <h3 style={{ 
                fontWeight: "bold", 
                fontSize: "1.25rem", 
                borderBottom: "2px solid #d1d5db", 
                paddingBottom: "0.25rem", 
                marginBottom: "0.5rem" 
              }}>
                Projects
              </h3>
              {localData.projects.map((project, idx) => (
                <div key={idx} style={{ marginBottom: "1rem" }}>
                  {editMode ? (
                    <>
                      <input
                        type="text"
                        value={project.name}
                        onChange={(e) => handleArrayFieldChange("projects", idx, "name", e.target.value)}
                        placeholder="Project Name"
                        style={{ 
                          fontSize: "1.125rem", 
                          fontWeight: "600",
                          width: "100%",
                          border: "1px solid #d1d5db",
                          borderRadius: "0.25rem",
                          padding: "0.5rem",
                          marginBottom: "0.5rem"
                        }}
                      />
                      <textarea
                        value={project.description}
                        onChange={(e) => handleArrayFieldChange("projects", idx, "description", e.target.value)}
                        placeholder="Project Description"
                        style={{ 
                          width: "100%",
                          minHeight: "3rem",
                          border: "1px solid #d1d5db",
                          borderRadius: "0.25rem",
                          padding: "0.5rem",
                          marginBottom: "0.5rem"
                        }}
                      />
                      <input
                        type="text"
                        value={project.technologies?.join(", ") || ""}
                        onChange={(e) => handleArrayFieldChange("projects", idx, "technologies", e.target.value.split(",").map(t => t.trim()))}
                        placeholder="Technologies (comma separated)"
                        style={{ 
                          width: "100%",
                          border: "1px solid #d1d5db",
                          borderRadius: "0.25rem",
                          padding: "0.5rem",
                          marginBottom: "0.5rem"
                        }}
                      />
                      <input
                        type="text"
                        value={project.link || ""}
                        onChange={(e) => handleArrayFieldChange("projects", idx, "link", e.target.value)}
                        placeholder="Live Link"
                        style={{ 
                          width: "100%",
                          border: "1px solid #d1d5db",
                          borderRadius: "0.25rem",
                          padding: "0.5rem",
                          marginBottom: "0.5rem"
                        }}
                      />
                      <input
                        type="text"
                        value={project.github || ""}
                        onChange={(e) => handleArrayFieldChange("projects", idx, "github", e.target.value)}
                        placeholder="GitHub Link"
                        style={{ 
                          width: "100%",
                          border: "1px solid #d1d5db",
                          borderRadius: "0.25rem",
                          padding: "0.5rem",
                          marginBottom: "0.5rem"
                        }}
                      />
                      <button
                        onClick={() => handleRemoveSection("projects", idx)}
                        style={{ 
                          fontSize: "0.875rem", 
                          color: "#ef4444",
                          background: "none",
                          border: "none",
                          cursor: "pointer"
                        }}
                      >
                        Remove Project
                      </button>
                    </>
                  ) : (
                    <>
                      <h3 style={{ fontSize: "1.125rem", fontWeight: "600" }}>{project.name}</h3>
                      <p style={{ fontSize: "0.875rem", color: "#374151" }}>{project.description}</p>
                      {project.technologies && (
                        <p style={{ fontSize: "0.875rem", color: "#6b7280" }}>
                          <strong>Technologies:</strong> {project.technologies.join(", ")}
                        </p>
                      )}
                      <div style={{ display: "flex", gap: "1rem", marginTop: "0.25rem" }}>
                        {project.link && (
                          <a href={project.link} style={{ color: "#3b82f6", fontSize: "0.875rem" }}>Live Demo</a>
                        )}
                        {project.github && (
                          <a href={project.github} style={{ color: "#3b82f6", fontSize: "0.875rem" }}>GitHub</a>
                        )}
                      </div>
                    </>
                  )}
                </div>
              ))}
              {editMode && (
                <button
                  onClick={() => handleAddSection("projects")}
                  style={{ 
                    fontSize: "0.875rem", 
                    color: "#3b82f6",
                    background: "none",
                    border: "none",
                    cursor: "pointer"
                  }}
                >
                  Add Project
                </button>
              )}
            </div>

            {/* Certifications */}
            <div style={{ marginBottom: "1.5rem" }}>
              <h3 style={{ 
                fontWeight: "bold", 
                fontSize: "1.25rem", 
                borderBottom: "2px solid #d1d5db", 
                paddingBottom: "0.25rem", 
                marginBottom: "0.5rem" 
              }}>
                Certifications
              </h3>
              {localData.certifications.map((cert, idx) => (
                <div key={idx} style={{ marginBottom: "1rem" }}>
                  {editMode ? (
                    <>
                      <input
                        type="text"
                        value={cert.title}
                        onChange={(e) => handleArrayFieldChange("certifications", idx, "title", e.target.value)}
                        placeholder="Certification Title"
                        style={{ 
                          fontSize: "1.125rem", 
                          fontWeight: "600",
                          width: "100%",
                          border: "1px solid #d1d5db",
                          borderRadius: "0.25rem",
                          padding: "0.5rem",
                          marginBottom: "0.5rem"
                        }}
                      />
                      <input
                        type="text"
                        value={cert.issuer}
                        onChange={(e) => handleArrayFieldChange("certifications", idx, "issuer", e.target.value)}
                        placeholder="Issuer"
                        style={{ 
                          width: "100%",
                          border: "1px solid #d1d5db",
                          borderRadius: "0.25rem",
                          padding: "0.5rem",
                          marginBottom: "0.5rem"
                        }}
                      />
                      <input
                        type="text"
                        value={cert.date}
                        onChange={(e) => handleArrayFieldChange("certifications", idx, "date", e.target.value)}
                        placeholder="Date"
                        style={{ 
                          width: "100%",
                          border: "1px solid #d1d5db",
                          borderRadius: "0.25rem",
                          padding: "0.5rem",
                          marginBottom: "0.5rem"
                        }}
                      />
                      <button
                        onClick={() => handleRemoveSection("certifications", idx)}
                        style={{ 
                          fontSize: "0.875rem", 
                          color: "#ef4444",
                          background: "none",
                          border: "none",
                          cursor: "pointer"
                        }}
                      >
                        Remove Certification
                      </button>
                    </>
                  ) : (
                    <p style={{ fontSize: "0.875rem", color: "#374151" }}>
                      <strong>{cert.title}</strong> - {cert.issuer} ({cert.date})
                    </p>
                  )}
                </div>
              ))}
              {editMode && (
                <button
                  onClick={() => handleAddSection("certifications")}
                  style={{ 
                    fontSize: "0.875rem", 
                    color: "#3b82f6",
                    background: "none",
                    border: "none",
                    cursor: "pointer"
                  }}
                >
                  Add Certification
                </button>
              )}
            </div>

            {/* Achievements */}
            <div style={{ marginBottom: "1.5rem" }}>
              <h3 style={{ 
                fontWeight: "bold", 
                fontSize: "1.25rem", 
                borderBottom: "2px solid #d1d5db", 
                paddingBottom: "0.25rem", 
                marginBottom: "0.5rem" 
              }}>
                Achievements
              </h3>
              <ul style={{ listStyle: "disc", paddingLeft: "1.25rem" }}>
                {localData.achievements.map((achievement, idx) => (
                  <li key={idx} style={{ display: "flex", alignItems: "center", marginBottom: "0.5rem" }}>
                    {editMode ? (
                      <>
                        <input
                          type="text"
                          value={achievement}
                          onChange={(e) => handleArrayStringChange("achievements", idx, e.target.value)}
                          style={{ 
                            flex: 1,
                            border: "1px solid #d1d5db",
                            borderRadius: "0.25rem",
                            padding: "0.25rem",
                            fontSize: "0.875rem"
                          }}
                        />
                        <button
                          onClick={() => handleRemoveSection("achievements", idx)}
                          style={{ 
                            fontSize: "0.75rem", 
                            color: "#ef4444", 
                            marginLeft: "0.5rem",
                            background: "none",
                            border: "none",
                            cursor: "pointer"
                          }}
                        >
                          ✕
                        </button>
                      </>
                    ) : (
                      <span style={{ fontSize: "0.875rem", color: "#374151" }}>{achievement}</span>
                    )}
                  </li>
                ))}
              </ul>
              {editMode && (
                <button
                  onClick={() => handleAddSection("achievements")}
                  style={{ 
                    fontSize: "0.875rem", 
                    color: "#3b82f6", 
                    marginTop: "0.5rem",
                    background: "none",
                    border: "none",
                    cursor: "pointer"
                  }}
                >
                  Add Achievement
                </button>
              )}
            </div>

            {/* Languages & Interests */}
            {["languages", "interests"].map((section) => (
              <div key={section} style={{ marginBottom: "1.5rem" }}>
                <h3 style={{ 
                  fontWeight: "bold", 
                  fontSize: "1.25rem", 
                  borderBottom: "2px solid #d1d5db", 
                  paddingBottom: "0.25rem", 
                  marginBottom: "0.5rem" 
                }}>
                  {section.charAt(0).toUpperCase() + section.slice(1)}
                </h3>
                <ul style={{ listStyle: "disc", paddingLeft: "1.25rem" }}>
                  {localData[section].map((item, idx) => (
                    <li key={idx} style={{ display: "flex", alignItems: "center", marginBottom: "0.5rem" }}>
                      {editMode ? (
                        <>
                          <input
                            type="text"
                            value={item}
                            onChange={(e) => handleArrayStringChange(section, idx, e.target.value)}
                            style={{ 
                              flex: 1,
                              border: "1px solid #d1d5db",
                              borderRadius: "0.25rem",
                              padding: "0.25rem",
                              fontSize: "0.875rem"
                            }}
                          />
                          <button
                            onClick={() => handleRemoveSection(section, idx)}
                            style={{ 
                              fontSize: "0.75rem", 
                              color: "#ef4444", 
                              marginLeft: "0.5rem",
                              background: "none",
                              border: "none",
                              cursor: "pointer"
                            }}
                          >
                            ✕
                          </button>
                        </>
                      ) : (
                        <span style={{ fontSize: "0.875rem", color: "#374151" }}>{item}</span>
                      )}
                    </li>
                  ))}
                </ul>
                {editMode && (
                  <button
                    onClick={() => handleAddSection(section)}
                    style={{ 
                      fontSize: "0.875rem", 
                      color: "#3b82f6", 
                      marginTop: "0.5rem",
                      background: "none",
                      border: "none",
                      cursor: "pointer"
                    }}
                  >
                    Add {section.charAt(0).toUpperCase() + section.slice(1).slice(0, -1)}
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Edit Controls */}
          <div style={{ marginTop: "1rem", textAlign: "center" }}>
            {editMode ? (
              <>
                <button
                  onClick={handleSave}
                  style={{ 
                    backgroundColor: "#10b981", 
                    color: "white", 
                    padding: "0.75rem 1.5rem", 
                    borderRadius: "0.375rem", 
                    marginRight: "0.5rem",
                    border: "none",
                    fontSize: "1rem",
                    fontWeight: "600",
                    cursor: "pointer",
                    transition: "all 0.3s"
                  }}
                  onMouseOver={(e) => e.target.style.backgroundColor = "#059669"}
                  onMouseOut={(e) => e.target.style.backgroundColor = "#10b981"}
                >
                  Save Changes
                </button>
                <button
                  onClick={handleCancel}
                  style={{ 
                    backgroundColor: "#6b7280", 
                    color: "white", 
                    padding: "0.75rem 1.5rem", 
                    borderRadius: "0.375rem",
                    border: "none",
                    fontSize: "1rem",
                    fontWeight: "600",
                    cursor: "pointer",
                    transition: "all 0.3s"
                  }}
                  onMouseOver={(e) => e.target.style.backgroundColor = "#4b5563"}
                  onMouseOut={(e) => e.target.style.backgroundColor = "#6b7280"}
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
                  padding: "0.75rem 1.5rem", 
                  borderRadius: "0.375rem",
                  border: "none",
                  fontSize: "1rem",
                  fontWeight: "600",
                  cursor: "pointer",
                  transition: "all 0.3s"
                }}
                onMouseOver={(e) => e.target.style.backgroundColor = "#2563eb"}
                onMouseOut={(e) => e.target.style.backgroundColor = "#3b82f6"}
              >
                Edit Resume
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Template1;