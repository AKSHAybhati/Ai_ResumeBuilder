import React, { useState, useRef, useEffect } from "react";
import Sidebar from "../Sidebar/Sidebar";
import Navbar from "../Navbar/Navbar";
import { useResume } from "../../context/ResumeContext";

// Icons
import {
  FaLinkedin,
  FaGithub,
  FaGlobe,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
} from "react-icons/fa";

const Template7 = () => {
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

  const styles = {
    container: {
      minHeight: "100vh",
      backgroundColor: "#f9fafb",
      display: "flex",
      flexDirection: "column",
    },
    wrapper: {
      display: "flex",
      flexGrow: 1,
    },
    main: {
      flexGrow: 1,
      padding: "3rem",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
    },
    card: {
      backgroundColor: "#ffffff",
      color: "#1f2937",
      width: "100%",
      maxWidth: "64rem",
      padding: "2rem",
      borderRadius: "1rem",
      boxShadow: "0 10px 15px rgba(0, 0, 0, 0.05)",
    },
    header: {
      display: "flex",
      justifyContent: "space-between",
      marginBottom: "1.5rem",
    },
    name: {
      fontSize: "2rem",
      fontWeight: "700",
      marginBottom: "0.25rem",
    },
    role: {
      fontSize: "1.125rem",
      color: "#6b7280",
    },
    contact: {
      textAlign: "right",
    },
    contactField: {
      marginBottom: "0.25rem",
      fontSize: "0.9rem",
    },
    iconWithText: {
      display: "flex",
      alignItems: "center",
      gap: "0.5rem",
      marginBottom: "0.25rem",
      justifyContent: "flex-end",
    },
    section: {
      marginBottom: "2rem",
    },
    sectionTitle: {
      fontSize: "1.25rem",
      fontWeight: "600",
      marginBottom: "0.75rem",
      borderBottom: "1px solid #e5e7eb",
      paddingBottom: "0.3rem",
    },
    input: {
      width: "100%",
      marginBottom: "0.5rem",
      padding: "0.5rem",
      border: "1px solid #d1d5db",
      borderRadius: "0.375rem",
    },
    textarea: {
      width: "100%",
      minHeight: "4rem",
      marginBottom: "0.5rem",
      padding: "0.5rem",
      border: "1px solid #d1d5db",
      borderRadius: "0.375rem",
      resize: "vertical",
    },
    list: {
      paddingLeft: "1.25rem",
    },
    actions: {
      textAlign: "center",
      marginTop: "1.5rem",
    },
    button: {
      padding: "0.6rem 1.2rem",
      border: "none",
      borderRadius: "0.5rem",
      fontWeight: "500",
      cursor: "pointer",
      marginRight: "0.5rem",
    },
    editBtn: {
      backgroundColor: "#3b82f6",
      color: "#fff",
    },
    saveBtn: {
      backgroundColor: "#10b981",
      color: "#fff",
    },
    cancelBtn: {
      backgroundColor: "#6b7280",
      color: "#fff",
    },
  };

  return (
    <div style={styles.container}>
      <Navbar />
      <div style={styles.wrapper}>
        <Sidebar onEnhance={handleEnhance} resumeRef={resumeRef} />
        <div style={styles.main}>
          <div ref={resumeRef} style={styles.card}>
            {/* Header */}
            <div style={styles.header}>
              <div>
                {editMode ? (
                  <>
                    <input
                      value={localData.name}
                      onChange={(e) => handleFieldChange("name", e.target.value)}
                      style={styles.input}
                    />
                    <input
                      value={localData.role}
                      onChange={(e) => handleFieldChange("role", e.target.value)}
                      style={styles.input}
                    />
                  </>
                ) : (
                  <>
                    <h1 style={styles.name}>{resumeData.name}</h1>
                    <h2 style={styles.role}>{resumeData.role}</h2>
                  </>
                )}
              </div>
              <div style={styles.contact}>
                {editMode ? (
                  ["email", "phone", "location", "linkedin", "github", "portfolio"].map((field) => (
                    <input
                      key={field}
                      value={localData[field]}
                      onChange={(e) => handleFieldChange(field, e.target.value)}
                      style={styles.input}
                    />
                  ))
                ) : (
                  <div>
                    {resumeData.email && (
                      <div style={styles.iconWithText}>
                        <FaEnvelope />
                        <a href={`mailto:${resumeData.email}`} target="_blank" rel="noopener noreferrer">
                          {resumeData.email}
                        </a>
                      </div>
                    )}
                    {resumeData.phone && (
                      <div style={styles.iconWithText}>
                        <FaPhone /> {resumeData.phone}
                      </div>
                    )}
                    {resumeData.location && (
                      <div style={styles.iconWithText}>
                        <FaMapMarkerAlt /> {resumeData.location}
                      </div>
                    )}
                    {resumeData.linkedin && (
                      <div style={styles.iconWithText}>
                        <FaLinkedin />
                        <a href={resumeData.linkedin} target="_blank" rel="noopener noreferrer">
                          LinkedIn
                        </a>
                      </div>
                    )}
                    {resumeData.github && (
                      <div style={styles.iconWithText}>
                        <FaGithub />
                        <a href={resumeData.github} target="_blank" rel="noopener noreferrer">
                          GitHub
                        </a>
                      </div>
                    )}
                    {resumeData.portfolio && (
                      <div style={styles.iconWithText}>
                        <FaGlobe />
                        <a href={resumeData.portfolio} target="_blank" rel="noopener noreferrer">
                          Portfolio
                        </a>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Summary */}
            <div style={styles.section}>
              <h3 style={styles.sectionTitle}>Summary</h3>
              {editMode ? (
                <textarea
                  value={localData.summary}
                  onChange={(e) => handleFieldChange("summary", e.target.value)}
                  style={styles.textarea}
                />
              ) : (
                <p>{resumeData.summary}</p>
              )}
            </div>

            {/* Skills, Languages, Interests */}
            {["skills", "languages", "interests"].map((section) => (
              <div key={section} style={styles.section}>
                <h3 style={styles.sectionTitle}>
                  {section.charAt(0).toUpperCase() + section.slice(1)}
                </h3>
                {editMode ? (
                  <textarea
                    value={localData[section].join(", ")}
                    onChange={(e) =>
                      handleFieldChange(
                        section,
                        e.target.value.split(",").map((item) => item.trim())
                      )
                    }
                    style={styles.textarea}
                  />
                ) : (
                  <div>{resumeData[section].join(", ")}</div>
                )}
              </div>
            ))}

            {/* Experience */}
            <div style={styles.section}>
              <h3 style={styles.sectionTitle}>Experience</h3>
              {localData.experience.map((exp, idx) => (
                <div key={idx}>
                  {editMode ? (
                    <>
                      <input
                        value={exp.title}
                        onChange={(e) => handleArrayFieldChange("experience", idx, "title", e.target.value)}
                        style={styles.input}
                      />
                      <input
                        value={exp.companyName}
                        onChange={(e) => handleArrayFieldChange("experience", idx, "companyName", e.target.value)}
                        style={styles.input}
                      />
                      <input
                        value={exp.date}
                        onChange={(e) => handleArrayFieldChange("experience", idx, "date", e.target.value)}
                        style={styles.input}
                      />
                      <input
                        value={exp.companyLocation}
                        onChange={(e) => handleArrayFieldChange("experience", idx, "companyLocation", e.target.value)}
                        style={styles.input}
                      />
                      <textarea
                        value={exp.accomplishment.join("\n")}
                        onChange={(e) =>
                          handleArrayFieldChange("experience", idx, "accomplishment", e.target.value.split("\n"))
                        }
                        style={styles.textarea}
                      />
                    </>
                  ) : (
                    <>
                      <p>
                        <strong>{exp.title}</strong> at {exp.companyName} ({exp.date}) - {exp.companyLocation}
                      </p>
                      <ul style={styles.list}>
                        {exp.accomplishment.map((a, i) => (
                          <li key={i}>{a}</li>
                        ))}
                      </ul>
                    </>
                  )}
                </div>
              ))}
            </div>

            {/* Education */}
            <div style={styles.section}>
              <h3 style={styles.sectionTitle}>Education</h3>
              {localData.education.map((edu, idx) => (
                <div key={idx}>
                  {editMode ? (
                    <>
                      <input
                        value={edu.degree}
                        onChange={(e) => handleArrayFieldChange("education", idx, "degree", e.target.value)}
                        style={styles.input}
                      />
                      <input
                        value={edu.institution}
                        onChange={(e) => handleArrayFieldChange("education", idx, "institution", e.target.value)}
                        style={styles.input}
                      />
                      <input
                        value={edu.duration}
                        onChange={(e) => handleArrayFieldChange("education", idx, "duration", e.target.value)}
                        style={styles.input}
                      />
                      <input
                        value={edu.location}
                        onChange={(e) => handleArrayFieldChange("education", idx, "location", e.target.value)}
                        style={styles.input}
                      />
                    </>
                  ) : (
                    <p>
                      <strong>{edu.degree}</strong>, {edu.institution} ({edu.duration}) - {edu.location}
                    </p>
                  )}
                </div>
              ))}
            </div>

            {/* Projects */}
            <div style={styles.section}>
              <h3 style={styles.sectionTitle}>Projects</h3>
              {localData.projects.map((proj, idx) => (
                <div key={idx}>
                  {editMode ? (
                    <>
                      <input
                        value={proj.name}
                        onChange={(e) => handleArrayFieldChange("projects", idx, "name", e.target.value)}
                        style={styles.input}
                      />
                      <textarea
                        value={proj.description}
                        onChange={(e) => handleArrayFieldChange("projects", idx, "description", e.target.value)}
                        style={styles.textarea}
                      />
                      <input
                        value={proj.technologies.join(", ")}
                        onChange={(e) =>
                          handleArrayFieldChange("projects", idx, "technologies", e.target.value.split(",").map((t) => t.trim()))
                        }
                        style={styles.input}
                      />
                      <input
                        value={proj.link}
                        onChange={(e) => handleArrayFieldChange("projects", idx, "link", e.target.value)}
                        style={styles.input}
                      />
                      <input
                        value={proj.github}
                        onChange={(e) => handleArrayFieldChange("projects", idx, "github", e.target.value)}
                        style={styles.input}
                      />
                    </>
                  ) : (
                    <p>
                      <strong>{proj.name}</strong>: {proj.description} (
                      <a href={proj.link} target="_blank" rel="noopener noreferrer">Live</a> |{" "}
                      <a href={proj.github} target="_blank" rel="noopener noreferrer">GitHub</a>)
                    </p>
                  )}
                </div>
              ))}
            </div>

            {/* Certifications & Achievements */}
            {["certifications", "achievements"].map((section) => (
              <div key={section} style={styles.section}>
                <h3 style={styles.sectionTitle}>
                  {section.charAt(0).toUpperCase() + section.slice(1)}
                </h3>
                {editMode ? (
                  localData[section].map((item, idx) => (
                    <div key={idx}>
                      {typeof item === "string" ? (
                        <input
                          value={item}
                          onChange={(e) => {
                            const updated = [...localData[section]];
                            updated[idx] = e.target.value;
                            handleFieldChange(section, updated);
                          }}
                          style={styles.input}
                        />
                      ) : (
                        Object.keys(item).map((key) => (
                          <input
                            key={key}
                            value={item[key]}
                            onChange={(e) => {
                              const updated = [...localData[section]];
                              updated[idx][key] = e.target.value;
                              handleFieldChange(section, updated);
                            }}
                            placeholder={key}
                            style={styles.input}
                          />
                        ))
                      )}
                    </div>
                  ))
                ) : (
                  <ul style={styles.list}>
                    {resumeData[section].map((item, idx) => (
                      <li key={idx}>
                        {typeof item === "string" ? item : Object.values(item).join(" | ")}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>

          <div style={styles.actions}>
            {editMode ? (
              <>
                <button onClick={handleSave} style={{ ...styles.button, ...styles.saveBtn }}>
                  Save
                </button>
                <button onClick={handleCancel} style={{ ...styles.button, ...styles.cancelBtn }}>
                  Cancel
                </button>
              </>
            ) : (
              <button onClick={() => setEditMode(true)} style={{ ...styles.button, ...styles.editBtn }}>
                Edit
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Template7;
