import React, { useState, useRef, useEffect } from "react";
import Sidebar from "../Sidebar/Sidebar";
import Navbar from "../Navbar/Navbar";
import { useResume } from "../../context/ResumeContext";

const Template16 = () => {
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

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#f9fafb",
      }}
    >
      <Navbar />
      <div style={{ display: "flex" }}>
        <Sidebar onEnhance={handleEnhance} resumeRef={resumeRef} />

        <div
          style={{
            flexGrow: 1,
            padding: "2.5rem",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <PageContainer>
            <div
              ref={resumeRef}
              style={{
                backgroundColor: "#ffffff",
                color: "#1f2937",
                width: "100%",
                maxWidth: "8.5in",
                minHeight: "11in",
                padding: "1in",
                margin: "0 auto",
                position: "relative",
              }}
            >
              {/* Header */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  borderBottom: "2px solid #3b82f6",
                  paddingBottom: "1rem",
                  marginBottom: "1.5rem",
                }}
              >
                <div style={{ flex: 1 }}>
                  {editMode ? (
                    <>
                      <input
                        type="text"
                        value={localData.name || ""}
                        onChange={(e) => handleFieldChange("name", e.target.value)}
                        style={{
                          fontSize: "2.5rem",
                          fontWeight: "bold",
                          marginBottom: "0.5rem",
                          width: "100%",
                          border: "1px solid #d1d5db",
                          borderRadius: "4px",
                          padding: "0.5rem",
                        }}
                      />
                      <input
                        type="text"
                        value={localData.role || ""}
                        onChange={(e) => handleFieldChange("role", e.target.value)}
                        style={{
                          fontSize: "1.25rem",
                          color: "#6b7280",
                          width: "100%",
                          border: "1px solid #d1d5db",
                          borderRadius: "4px",
                          padding: "0.5rem",
                        }}
                      />
                    </>
                  ) : (
                    <>
                      <h1 style={{ fontSize: "2.5rem", fontWeight: "bold", marginBottom: "0.5rem" }}>
                        {localData.name || "Your Name"}
                      </h1>
                      <p style={{ fontSize: "1.25rem", color: "#6b7280" }}>
                        {localData.role || "Your Role"}
                      </p>
                    </>
                  )}
                </div>
                
                <div style={{ textAlign: "right", flex: 1 }}>
                  {editMode ? (
                    <>
                      <input
                        type="text"
                        value={localData.phone || ""}
                        onChange={(e) => handleFieldChange("phone", e.target.value)}
                        style={{
                          display: "block",
                          width: "100%",
                          border: "1px solid #d1d5db",
                          borderRadius: "4px",
                          padding: "0.25rem",
                          marginBottom: "0.25rem",
                        }}
                      />
                      <input
                        type="text"
                        value={localData.email || ""}
                        onChange={(e) => handleFieldChange("email", e.target.value)}
                        style={{
                          display: "block",
                          width: "100%",
                          border: "1px solid #d1d5db",
                          borderRadius: "4px",
                          padding: "0.25rem",
                          marginBottom: "0.25rem",
                        }}
                      />
                      <input
                        type="text"
                        value={localData.location || ""}
                        onChange={(e) => handleFieldChange("location", e.target.value)}
                        style={{
                          display: "block",
                          width: "100%",
                          border: "1px solid #d1d5db",
                          borderRadius: "4px",
                          padding: "0.25rem",
                        }}
                      />
                    </>
                  ) : (
                    <>
                      <p style={{ marginBottom: "0.25rem" }}>{localData.phone || "Phone"}</p>
                      <p style={{ marginBottom: "0.25rem" }}>{localData.email || "Email"}</p>
                      <p>{localData.location || "Location"}</p>
                    </>
                  )}
                </div>
              </div>

              {/* Summary */}
              <div style={{ marginBottom: "1.5rem" }}>
                <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", marginBottom: "0.75rem", color: "#3b82f6" }}>
                  Professional Summary
                </h2>
                {editMode ? (
                  <textarea
                    value={localData.summary || ""}
                    onChange={(e) => handleFieldChange("summary", e.target.value)}
                    style={{
                      width: "100%",
                      minHeight: "80px",
                      border: "1px solid #d1d5db",
                      borderRadius: "4px",
                      padding: "0.5rem",
                      resize: "vertical",
                    }}
                  />
                ) : (
                  <p style={{ lineHeight: "1.6", color: "#374151" }}>
                    {localData.summary || "Your professional summary here..."}
                  </p>
                )}
              </div>

              {/* Skills */}
              <div style={{ marginBottom: "1.5rem" }}>
                <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", marginBottom: "0.75rem", color: "#3b82f6" }}>
                  Skills
                </h2>
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
                      minHeight: "60px",
                      border: "1px solid #d1d5db",
                      borderRadius: "4px",
                      padding: "0.5rem",
                      resize: "vertical",
                    }}
                  />
                ) : (
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                    {(localData.skills || []).map((skill, index) => (
                      <span
                        key={index}
                        style={{
                          backgroundColor: "#3b82f6",
                          color: "white",
                          padding: "0.25rem 0.75rem",
                          borderRadius: "20px",
                          fontSize: "0.875rem",
                          fontWeight: "500",
                        }}
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Experience */}
              <div style={{ marginBottom: "1.5rem" }}>
                <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", marginBottom: "0.75rem", color: "#3b82f6" }}>
                  Work Experience
                </h2>
                {(localData.experience || []).map((exp, idx) => (
                  <div key={idx} style={{ marginBottom: "1rem" }}>
                    {editMode ? (
                      <div>
                        <input
                          type="text"
                          value={exp.title || ""}
                          onChange={(e) => {
                            const updated = [...localData.experience];
                            updated[idx].title = e.target.value;
                            handleFieldChange("experience", updated);
                          }}
                          style={{
                            fontSize: "1.125rem",
                            fontWeight: "bold",
                            width: "100%",
                            border: "1px solid #d1d5db",
                            borderRadius: "4px",
                            padding: "0.25rem",
                            marginBottom: "0.25rem",
                          }}
                        />
                        <input
                          type="text"
                          value={exp.companyName || ""}
                          onChange={(e) => {
                            const updated = [...localData.experience];
                            updated[idx].companyName = e.target.value;
                            handleFieldChange("experience", updated);
                          }}
                          style={{
                            width: "100%",
                            border: "1px solid #d1d5db",
                            borderRadius: "4px",
                            padding: "0.25rem",
                            marginBottom: "0.25rem",
                          }}
                        />
                        <input
                          type="text"
                          value={exp.date || ""}
                          onChange={(e) => {
                            const updated = [...localData.experience];
                            updated[idx].date = e.target.value;
                            handleFieldChange("experience", updated);
                          }}
                          style={{
                            width: "100%",
                            border: "1px solid #d1d5db",
                            borderRadius: "4px",
                            padding: "0.25rem",
                            marginBottom: "0.25rem",
                          }}
                        />
                        <textarea
                          value={(exp.accomplishment || []).join("\n")}
                          onChange={(e) => {
                            const updated = [...localData.experience];
                            updated[idx].accomplishment = e.target.value
                              .split("\n")
                              .filter(Boolean);
                            handleFieldChange("experience", updated);
                          }}
                          style={{
                            width: "100%",
                            minHeight: "60px",
                            border: "1px solid #d1d5db",
                            borderRadius: "4px",
                            padding: "0.25rem",
                            resize: "vertical",
                          }}
                        />
                      </div>
                    ) : (
                      <div>
                        <h3 style={{ fontSize: "1.125rem", fontWeight: "bold", marginBottom: "0.25rem" }}>
                          {exp.title || "Job Title"}
                        </h3>
                        <p style={{ color: "#6b7280", marginBottom: "0.25rem" }}>
                          {exp.companyName || "Company Name"} | {exp.date || "Date"}
                        </p>
                        <ul style={{ paddingLeft: "1.5rem", lineHeight: "1.5" }}>
                          {(exp.accomplishment || []).map((item, i) => (
                            <li key={i} style={{ marginBottom: "0.25rem" }}>{item}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Education */}
              <div>
                <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", marginBottom: "0.75rem", color: "#3b82f6" }}>
                  Education
                </h2>
                {(localData.education || []).map((edu, idx) => (
                  <div key={idx} style={{ marginBottom: "1rem" }}>
                    {editMode ? (
                      <div>
                        <input
                          type="text"
                          value={edu.degree || ""}
                          onChange={(e) => {
                            const updated = [...localData.education];
                            updated[idx].degree = e.target.value;
                            handleFieldChange("education", updated);
                          }}
                          style={{
                            fontSize: "1.125rem",
                            fontWeight: "bold",
                            width: "100%",
                            border: "1px solid #d1d5db",
                            borderRadius: "4px",
                            padding: "0.25rem",
                            marginBottom: "0.25rem",
                          }}
                        />
                        <input
                          type="text"
                          value={edu.institution || ""}
                          onChange={(e) => {
                            const updated = [...localData.education];
                            updated[idx].institution = e.target.value;
                            handleFieldChange("education", updated);
                          }}
                          style={{
                            width: "100%",
                            border: "1px solid #d1d5db",
                            borderRadius: "4px",
                            padding: "0.25rem",
                            marginBottom: "0.25rem",
                          }}
                        />
                        <input
                          type="text"
                          value={edu.duration || ""}
                          onChange={(e) => {
                            const updated = [...localData.education];
                            updated[idx].duration = e.target.value;
                            handleFieldChange("education", updated);
                          }}
                          style={{
                            width: "100%",
                            border: "1px solid #d1d5db",
                            borderRadius: "4px",
                            padding: "0.25rem",
                          }}
                        />
                      </div>
                    ) : (
                      <div>
                        <h3 style={{ fontSize: "1.125rem", fontWeight: "bold", marginBottom: "0.25rem" }}>
                          {edu.degree || "Degree"}
                        </h3>
                        <p style={{ color: "#6b7280", marginBottom: "0.25rem" }}>
                          {edu.institution || "Institution"}
                        </p>
                        <p style={{ color: "#6b7280" }}>{edu.duration || "Duration"}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </PageContainer>

          {/* Buttons */}
          <div style={{ marginTop: "1.5rem", textAlign: "center" }}>
            {editMode ? (
              <>
                <button
                  onClick={handleSave}
                  style={{
                    backgroundColor: "#16a34a",
                    color: "#ffffff",
                    padding: "0.75rem 1.5rem",
                    borderRadius: "0.375rem",
                    margin: "0 0.5rem",
                    border: "none",
                    cursor: "pointer",
                    fontSize: "1rem",
                  }}
                >
                  Save
                </button>
                <button
                  onClick={handleCancel}
                  style={{
                    backgroundColor: "#9ca3af",
                    color: "#ffffff",
                    padding: "0.75rem 1.5rem",
                    borderRadius: "0.375rem",
                    margin: "0 0.5rem",
                    border: "none",
                    cursor: "pointer",
                    fontSize: "1rem",
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
                  color: "#ffffff",
                  padding: "0.75rem 1.5rem",
                  borderRadius: "0.375rem",
                  margin: "0 0.5rem",
                  border: "none",
                  cursor: "pointer",
                  fontSize: "1rem",
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

export default Template16;
  