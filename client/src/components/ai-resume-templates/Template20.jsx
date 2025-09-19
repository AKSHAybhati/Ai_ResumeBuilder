import React, { useState, useRef, useEffect } from "react";
import Navbar from "../Navbar/Navbar";
import Sidebar from "../Sidebar/Sidebar";
import { useResume } from "../../context/ResumeContext";
import { FaPhoneAlt, FaEnvelope, FaLinkedin, FaMapMarkerAlt } from "react-icons/fa";

const Template20 = () => {
  const resumeRef = useRef(null);
  const { resumeData, setResumeData } = useResume();
  const [editMode, setEditMode] = useState(false);
  const [localData, setLocalData] = useState(resumeData);

  useEffect(() => {
    setLocalData(resumeData);
  }, [resumeData]);

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

  const handleEnhance = (section) => {
  };

  const sectionTitleStyle = {
    fontWeight: "bold",
    fontSize: "1.2rem",
    borderBottom: "2px solid #22c55e",
    color: "#2563eb",
    marginTop: "1.5rem",
    paddingBottom: "0.3rem",
    textTransform: "uppercase",
    letterSpacing: "1px",
  };

  const sectionCardStyle = {
    backgroundColor: "#f9fafb",
    padding: "1rem",
    borderRadius: "0.5rem",
    marginTop: "0.75rem",
    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05)",
  };

  return (
    <div style={{ minHeight: "100vh"}}>
      <Navbar />
      <div style={{ display: "flex" }}>
        <Sidebar onEnhance={handleEnhance} resumeRef={resumeRef} />
        <div
          style={{
            flexGrow: 1,
            padding: "2rem",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
          }}
        >
          <div
            ref={resumeRef}
            style={{
              color: "#1f2937",
              maxWidth: "60rem",
              width: "100%",
              boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
              padding: "2.5rem",
              border: "3px solid #22c55e",
              borderRadius: "1rem",
            }}
          >
            {/* HEADER */}
            <div
              style={{
                textAlign: "center",
                borderBottom: "3px solid #22c55e",
                paddingBottom: "1rem",
                marginBottom: "1.5rem",
              }}
            >
              {editMode ? (
                <>
                  <input
                    type="text"
                    value={localData.name}
                    onChange={(e) => handleFieldChange("name", e.target.value)}
                    style={{
                      fontSize: "2rem",
                      fontWeight: "bold",
                      textTransform: "uppercase",
                      textAlign: "center",
                      width: "100%",
                    }}
                  />
                  <input
                    type="text"
                    value={localData.role}
                    onChange={(e) => handleFieldChange("role", e.target.value)}
                    style={{
                      fontSize: "1.2rem",
                      color: "#059669",
                      textAlign: "center",
                      width: "100%",
                    }}
                  />
                </>
              ) : (
                <>
                  <h1
                    style={{
                      fontSize: "2rem",
                      fontWeight: "bold",
                      textTransform: "uppercase",
                      color: "#2563eb",
                    }}
                  >
                    {resumeData.name}
                  </h1>
                  <h2 style={{ fontSize: "1.2rem", color: "#059669" }}>
                    {resumeData.role}
                  </h2>
                </>
              )}

              {/* Contact Info */}
              <div
                style={{
                  marginTop: "0.8rem",
                  fontSize: "0.95rem",
                  color: "#374151",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  flexWrap: "wrap",
                  width: "100%",
                  maxWidth: "40rem",
                  marginInline: "auto",
                }}
              >
                <span style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                  <FaPhoneAlt color="#059669" /> {resumeData.phone}
                </span>
                <span style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                  <FaEnvelope color="#2563eb" /> {resumeData.email}
                </span>
                <span style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                  <FaLinkedin color="#2563eb" /> {resumeData.linkedin}
                </span>
                <span style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                  <FaMapMarkerAlt color="#059669" /> {resumeData.location}
                </span>
              </div>
            </div>

            {/* SUMMARY */}
            <h3 style={sectionTitleStyle}>Summary</h3>
            <div style={sectionCardStyle}>
              {editMode ? (
                <textarea
                  value={localData.summary}
                  onChange={(e) => handleFieldChange("summary", e.target.value)}
                  style={{
                    width: "100%",
                    padding: "0.5rem",
                    border: "1px solid #d1d5db",
                    borderRadius: "0.25rem",
                  }}
                  rows={4}
                />
              ) : (
                <p>{resumeData.summary}</p>
              )}
            </div>

            {/* SKILLS */}
            <h3 style={sectionTitleStyle}>Skills</h3>
            <div style={sectionCardStyle}>
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
                    padding: "0.5rem",
                    border: "1px solid #d1d5db",
                    borderRadius: "0.25rem",
                  }}
                />
              ) : (
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                  {resumeData.skills?.map((skill, idx) => (
                    <span
                      key={idx}
                      style={{
                        backgroundColor: "#dbeafe",
                        color: "#1e3a8a",
                        padding: "0.3rem 0.7rem",
                        borderRadius: "20px",
                        fontSize: "0.95rem",
                        fontWeight: "500",
                        border: "1px solid #93c5fd",
                      }}
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* EDUCATION */}
            <h3 style={sectionTitleStyle}>Education</h3>
            <div style={sectionCardStyle}>
              {resumeData.education?.map((edu, idx) => (
                <div
                  key={idx}
                  style={{
                    marginBottom: "1rem",
                    borderBottom: "1px dashed #22c55e",
                    paddingBottom: "0.5rem",
                  }}
                >
                  {editMode ? (
                    <>
                      <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <input
                          type="text"
                          value={localData.education[idx].degree}
                          onChange={(e) => {
                            const updated = [...localData.education];
                            updated[idx].degree = e.target.value;
                            handleFieldChange("education", updated);
                          }}
                          style={{ fontWeight: "600", width: "70%" }}
                        />
                        <input
                          type="text"
                          value={localData.education[idx].duration}
                          onChange={(e) => {
                            const updated = [...localData.education];
                            updated[idx].duration = e.target.value;
                            handleFieldChange("education", updated);
                          }}
                          style={{ width: "25%", textAlign: "right" }}
                        />
                      </div>
                      <input
                        type="text"
                        value={localData.education[idx].institution}
                        onChange={(e) => {
                          const updated = [...localData.education];
                          updated[idx].institution = e.target.value;
                          handleFieldChange("education", updated);
                        }}
                        style={{ width: "100%", marginTop: "0.3rem" }}
                      />
                      <input
                        type="text"
                        value={localData.education[idx].location}
                        onChange={(e) => {
                          const updated = [...localData.education];
                          updated[idx].location = e.target.value;
                          handleFieldChange("education", updated);
                        }}
                        style={{ width: "100%", fontSize: "0.85rem" }}
                      />
                    </>
                  ) : (
                    <>
                      <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <p style={{ fontWeight: "600", color: "#2563eb" }}>{edu.degree}</p>
                        <p style={{ fontSize: "0.875rem", color: "#059669" }}>{edu.duration}</p>
                      </div>
                      <p style={{ color: "#059669" }}>{edu.institution}</p>
                      <p style={{ fontSize: "0.875rem", color: "#4b5563" }}>{edu.location}</p>
                    </>
                  )}
                </div>
              ))}
            </div>

            {/* EXPERIENCE */}
            <h3 style={sectionTitleStyle}>Experience</h3>
            <div style={sectionCardStyle}>
              {resumeData.experience?.map((exp, idx) => (
                <div
                  key={idx}
                  style={{
                    marginBottom: "1rem",
                    borderBottom: "1px dashed #2563eb",
                    paddingBottom: "0.5rem",
                  }}
                >
                  {editMode ? (
                    <>
                      <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <input
                          type="text"
                          value={localData.experience[idx].title}
                          onChange={(e) => {
                            const updated = [...localData.experience];
                            updated[idx].title = e.target.value;
                            handleFieldChange("experience", updated);
                          }}
                          style={{ fontWeight: "600", width: "70%" }}
                        />
                        <input
                          type="text"
                          value={localData.experience[idx].date}
                          onChange={(e) => {
                            const updated = [...localData.experience];
                            updated[idx].date = e.target.value;
                            handleFieldChange("experience", updated);
                          }}
                          style={{ width: "25%", textAlign: "right" }}
                        />
                      </div>
                      <input
                        type="text"
                        value={localData.experience[idx].companyName}
                        onChange={(e) => {
                          const updated = [...localData.experience];
                          updated[idx].companyName = e.target.value;
                          handleFieldChange("experience", updated);
                        }}
                        style={{ width: "100%", marginTop: "0.3rem" }}
                      />
                      <input
                        type="text"
                        value={localData.experience[idx].companyLocation}
                        onChange={(e) => {
                          const updated = [...localData.experience];
                          updated[idx].companyLocation = e.target.value;
                          handleFieldChange("experience", updated);
                        }}
                        style={{ width: "100%", marginTop: "0.3rem" }}
                      />
                      <textarea
                        value={localData.experience[idx].accomplishment.join("\n")}
                        onChange={(e) => {
                          const updated = [...localData.experience];
                          updated[idx].accomplishment = e.target.value.split("\n").filter(Boolean);
                          handleFieldChange("experience", updated);
                        }}
                        style={{
                          width: "100%",
                          border: "1px solid #d1d5db",
                          borderRadius: "0.25rem",
                          padding: "0.5rem",
                          marginTop: "0.3rem",
                        }}
                      />
                    </>
                  ) : (
                    <>
                      <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <p style={{ fontWeight: "600", color: "#2563eb" }}>
                          {exp.title} <span style={{ color: "#374151" }}>at {exp.companyName}</span>
                        </p>
                        <p style={{ fontSize: "0.875rem", color: "#059669" }}>{exp.date}</p>
                      </div>
                      <p style={{ fontSize: "0.8rem", color: "#6b7280" }}>{exp.companyLocation}</p>
                      <ul style={{ paddingLeft: "1.5rem", listStyleType: "disc" }}>
                        {exp.accomplishment.map((item, i) => (
                          <li key={i}>{item}</li>
                        ))}
                      </ul>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* BUTTONS */}
          <div style={{ marginTop: "1.5rem", textAlign: "center" }}>
            {editMode ? (
              <>
                <button
                  onClick={handleSave}
                  style={{
                    backgroundColor: "#16a34a",
                    color: "#fff",
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
                    color: "#fff",
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
                  color: "#fff",
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
      </div>
    </div>
  );
};

export default Template20;
