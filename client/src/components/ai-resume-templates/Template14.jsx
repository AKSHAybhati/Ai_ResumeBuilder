// Template14.jsx — updated with full edit functionality and all resume fields
import React, { useState, useRef } from "react";
import { useResume } from "../../context/ResumeContext";
import Sidebar from "../Sidebar/Sidebar";
import Navbar from "../Navbar/Navbar";

const Template14 = () => {
  const resumeRef = useRef(null);
  const { resumeData, setResumeData } = useResume();
  const [editMode, setEditMode] = useState(false);
  const [localData, setLocalData] = useState(resumeData);

  const handleChange = (section, index, field, value) => {
    if (Array.isArray(localData[section])) {
      const updatedArray = [...localData[section]];
      if (field) {
        updatedArray[index][field] = value;
      } else {
        updatedArray[index] = value;
      }
      setLocalData({ ...localData, [section]: updatedArray });
    } else {
      setLocalData({ ...localData, [section]: value });
    }
  };

  const handleFieldChange = (field, value) => {
    const updatedData = { ...localData, [field]: value };
    setLocalData(updatedData);
    localStorage.setItem('resumeData', JSON.stringify(updatedData));
  };

  const handleSave = () => {
    setResumeData(localData);
    setEditMode(false);
  };

  const handleCancel = () => {
    setLocalData(resumeData);
    setEditMode(false);
  };

  const sectionTitle = {
    fontSize: "20px",
    fontWeight: "600",
    borderBottom: "2px solid #eee",
    paddingBottom: "8px",
    marginBottom: "18px",
    marginTop: "40px",
    color: "#222",
  };

  const inputStyle = {
    width: "100%",
    padding: "10px",
    marginBottom: "10px",
    borderRadius: "6px",
    border: "1px solid #ccc",
    fontSize: "14px",
  };

  const textareaStyle = {
    ...inputStyle,
    minHeight: "80px",
    resize: "vertical",
  };

  const renderListSection = (key, label) => (
    <div>
      <h2 style={sectionTitle}>{label}</h2>
      <ul style={{ paddingLeft: "20px", lineHeight: "1.6" }}>
        {localData[key]?.map((item, index) => (
          <li key={index}>
            {editMode ? (
              <input
                value={item}
                onChange={(e) => handleChange(key, index, null, e.target.value)}
                style={inputStyle}
              />
            ) : (
              <span>{item}</span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );

  const handleEnhance = (section) => {
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#f9fafb", // replaces bg-gray-50
      }}
    >
      <Navbar />
      <div style={{ display: "flex" }}>
        <Sidebar onEnhance={handleEnhance} resumeRef={resumeRef} />
        <div
          ref={resumeRef}
          style={{
            width: "100%",
            maxWidth: "950px",
            padding: "40px",
            fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
            margin: "40px auto",
            backgroundColor: "#fff",
            boxShadow: "0 8px 30px rgba(0,0,0,0.05)",
            borderRadius: "16px",
            boxSizing: "border-box",
            color: "#333",
          }}
        >
          {/* Name and Role */}
          <div style={{ textAlign: "center", marginBottom: "20px" }}>
            {editMode ? (
              <>
                <input
                  value={localData.name}
                  onChange={(e) =>
                    handleChange("name", null, null, e.target.value)
                  }
                  placeholder="Full Name"
                  style={{
                    ...inputStyle,
                    fontSize: "24px",
                    fontWeight: "bold",
                    textAlign: "center",
                  }}
                />
                <input
                  value={localData.role}
                  onChange={(e) =>
                    handleChange("role", null, null, e.target.value)
                  }
                  placeholder="Role / Title"
                  style={{ ...inputStyle, textAlign: "center" }}
                />
              </>
            ) : (
              <>
                <h1 style={{ fontSize: "28px", fontWeight: "700" }}>
                  {resumeData.name}
                </h1>
                <p style={{ fontSize: "16px", color: "#666" }}>
                  {resumeData.role}
                </p>
              </>
            )}
          </div>

          {/* Contact */}
          <div
            style={{
              marginBottom: "30px",
              textAlign: "center",
              fontSize: "14px",
              color: "#777",
            }}
          >
            <p>
              {resumeData.email} | {resumeData.phone} | {resumeData.location}
            </p>
            <p>
              <a href={resumeData.linkedin} style={{ color: "#0073b1" }}>
                LinkedIn
              </a>{" "}
              |{" "}
              <a href={resumeData.github} style={{ color: "#333" }}>
                GitHub
              </a>{" "}
              |{" "}
              <a href={resumeData.portfolio} style={{ color: "#007acc" }}>
                Portfolio
              </a>
            </p>
          </div>

          {/* Summary */}
          <div>
            <h2 style={sectionTitle}>Summary</h2>
            {editMode ? (
              <textarea
                value={localData.summary}
                onChange={(e) =>
                  handleChange("summary", null, null, e.target.value)
                }
                style={textareaStyle}
              />
            ) : (
              <p>{resumeData.summary}</p>
            )}
          </div>

          {/* Skills, Languages, Interests */}
          <div>
            <h3
              style={{
                marginTop: "1.5rem",
                fontWeight: "bold",
                fontSize: "1.125rem",
                borderBottom: "1px solid #e5e7eb",
              }}
            >
              Skills
            </h3>
            {editMode ? (
              <textarea
                value={localData.skills?.join(", ") || ""}
                onChange={(e) =>
                  handleFieldChange(
                    "skills",
                    e.target.value.split(",").map((s) => s.trim())
                  )
                }
                style={{
                  width: "100%",
                  marginTop: "0.5rem",
                  padding: "0.5rem",
                  border: "1px solid #d1d5db",
                  borderRadius: "0.25rem",
                }}
              />
            ) : (
              <ul style={{ marginTop: "0.5rem", paddingLeft: "1rem" }}>
                {resumeData.skills?.map((skill, idx) => (
                  <li key={idx}>{skill}</li>
                ))}
              </ul>
            )}
          </div>
          {renderListSection("languages", "Languages")}
          {renderListSection("interests", "Interests")}

          {/* Experience */}
          <div>
            <h3
              style={{
                fontWeight: "bold",
                fontSize: "1.125rem",
                borderBottom: "1px solid #e5e7eb",
                marginTop: "1.5rem",
              }}
            >
              Experience
            </h3>
            {resumeData.experience.map((exp, idx) => (
              <div key={idx} style={{ marginTop: "0.5rem" }}>
                {editMode ? (
                  <>
                    <input
                      type="text"
                      value={localData.experience[idx].title}
                      onChange={(e) => {
                        const updated = [...localData.experience];
                        updated[idx].title = e.target.value;
                        handleFieldChange("experience", updated);
                      }}
                      style={{
                        fontWeight: "600",
                        display: "block",
                        width: "100%",
                      }}
                    />
                    <input
                      type="text"
                      value={localData.experience[idx].companyName}
                      onChange={(e) => {
                        const updated = [...localData.experience];
                        updated[idx].companyName = e.target.value;
                        handleFieldChange("experience", updated);
                      }}
                      style={{ display: "block", width: "100%" }}
                    />
                    <input
                      type="text"
                      value={localData.experience[idx].date}
                      onChange={(e) => {
                        const updated = [...localData.experience];
                        updated[idx].date = e.target.value;
                        handleFieldChange("experience", updated);
                      }}
                      style={{ display: "block", width: "100%" }}
                    />
                    <input
                      type="text"
                      value={localData.experience[idx].companyLocation}
                      onChange={(e) => {
                        const updated = [...localData.experience];
                        updated[idx].companyLocation = e.target.value;
                        handleFieldChange("experience", updated);
                      }}
                      style={{ display: "block", width: "100%" }}
                    />
                    <textarea
                      value={localData.experience[idx].accomplishment.join(
                        "\n"
                      )}
                      onChange={(e) => {
                        const updated = [...localData.experience];
                        updated[idx].accomplishment = e.target.value
                          .split("\n")
                          .filter(Boolean);
                        handleFieldChange("experience", updated);
                      }}
                      style={{
                        display: "block",
                        width: "100%",
                        border: "1px solid #d1d5db",
                        borderRadius: "0.25rem",
                        padding: "0.5rem",
                        marginTop: "0.25rem",
                      }}
                    />
                  </>
                ) : (
                  <>
                    <p style={{ fontWeight: "600" }}>
                      {exp.title} at {exp.companyName}
                    </p>
                    <p style={{ fontSize: "0.875rem", color: "#4b5563" }}>
                      {exp.date} | {exp.companyLocation}
                    </p>
                    <ul style={{ paddingLeft: "1rem" }}>
                      {exp.accomplishment.map((item, i) => (
                        <li key={i}>{item}</li>
                      ))}
                    </ul>
                  </>
                )}
              </div>
            ))}
          </div>

          {/* Education */}
          <div>
            <h3
              style={{
                fontWeight: "bold",
                fontSize: "1.125rem",
                borderBottom: "1px solid #e5e7eb",
                marginTop: "1.5rem",
              }}
            >
              Education
            </h3>
            {resumeData.education.map((edu, idx) => (
              <div key={idx} style={{ marginTop: "0.5rem" }}>
                {editMode ? (
                  <>
                    <input
                      type="text"
                      value={localData.education[idx].degree}
                      onChange={(e) => {
                        const updated = [...localData.education];
                        updated[idx].degree = e.target.value;
                        handleFieldChange("education", updated);
                      }}
                      style={{
                        fontWeight: "600",
                        display: "block",
                        width: "100%",
                      }}
                    />
                    <input
                      type="text"
                      value={localData.education[idx].institution}
                      onChange={(e) => {
                        const updated = [...localData.education];
                        updated[idx].institution = e.target.value;
                        handleFieldChange("education", updated);
                      }}
                      style={{ display: "block", width: "100%" }}
                    />
                    <input
                      type="text"
                      value={localData.education[idx].duration}
                      onChange={(e) => {
                        const updated = [...localData.education];
                        updated[idx].duration = e.target.value;
                        handleFieldChange("education", updated);
                      }}
                      style={{ display: "block", width: "100%" }}
                    />
                    <input
                      type="text"
                      value={localData.education[idx].location}
                      onChange={(e) => {
                        const updated = [...localData.education];
                        updated[idx].location = e.target.value;
                        handleFieldChange("education", updated);
                      }}
                      style={{
                        fontSize: "0.875rem",
                        display: "block",
                        width: "100%",
                      }}
                    />
                  </>
                ) : (
                  <>
                    <p style={{ fontWeight: "600" }}>{edu.degree}</p>
                    <p>
                      {edu.institution} ({edu.duration})
                    </p>
                    <p style={{ fontSize: "0.875rem", color: "#4b5563" }}>
                      {edu.location}
                    </p>
                  </>
                )}
              </div>
            ))}
          </div>

          {/* Projects */}
          <div>
            <h2 style={sectionTitle}>Projects</h2>
            {localData.projects.map((proj, index) => (
              <div key={index} style={{ marginBottom: "16px" }}>
                <strong>{proj.name}</strong>: {proj.description}
                <br />
                <small>Tech: {proj.technologies.join(", ")}</small>
              </div>
            ))}
          </div>

          {/* Certifications */}
          <div>
            <h2 style={sectionTitle}>Certifications</h2>
            <ul>
              {localData.certifications.map((cert, index) => (
                <li key={index}>
                  {cert.title} - {cert.issuer} ({cert.date})
                </li>
              ))}
            </ul>
          </div>

          {/* Achievements */}
          <div>
            <h2 style={sectionTitle}>Achievements</h2>
            <ul>
              {localData.achievements.map((ach, index) => (
                <li key={index}>{ach}</li>
              ))}
            </ul>
          </div>
        </div>
        {/* END OF resume card */}
      </div>

      {/* BUTTONS BELOW CARD */}
        <div style={{ marginTop: "2px", textAlign: "center",paddingLeft:"20px" }}>
          {editMode ? (
            <>
              <button
                onClick={handleSave}
                style={{
                  backgroundColor: "#16a34a",
                  color: "#ffffff",
                  padding: "0.5rem 1rem",
                  borderRadius: "0.375rem",
                  margin: "0 0.5rem",
                }}
              >
                Save
              </button>
              <button
                onClick={handleCancel}
                style={{
                  backgroundColor: "#9ca3af",
                  color: "#ffffff",
                  padding: "0.5rem 1rem",
                  borderRadius: "0.375rem",
                  margin: "0 0.5rem",
                }}
              >
                Cancel
              </button>
            </>
          ) : (
            <button
              onClick={() => setEditMode(true)}
              style={{
                backgroundColor: "#2563eb",
                color: "#ffffff",
                padding: "0.5rem 1rem",
                borderRadius: "0.375rem",
                margin: "0 0.5rem",
              }}
            >
              Edit
            </button>
          )}
        </div>
    </div>
  );
};

export default Template14;
