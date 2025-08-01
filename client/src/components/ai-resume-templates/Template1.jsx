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
          backgroundColor: "#f9fafb", // replaces bg-gray-50
        }}
      >
        <Navbar />
        <div style={{ display: "flex" }}>
          <Sidebar onEnhance={handleEnhance} resumeRef={resumeRef} />

          <div
            style={{
              flexGrow: 1,
              padding: "2.5rem", // Tailwind p-10
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <div
              ref={resumeRef}
              style={{
                backgroundColor: "#ffffff",
                color: "#1f2937",
                maxWidth: "72rem", // Tailwind max-w-6xl
                width: "100%",
                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                padding: "2.5rem", // Tailwind p-10
              }}
            >
              {/* Header */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  borderBottom: "1px solid #e5e7eb",
                  paddingBottom: "1rem",
                }}
              >
                <div>
                  {editMode ? (
                    <>
                      <input
                        type="text"
                        value={localData.name}
                        onChange={(e) =>
                          handleFieldChange("name", e.target.value)
                        }
                        style={{
                          fontSize: "1.875rem",
                          fontWeight: "bold",
                          marginBottom: "0.25rem",
                        }}
                      />
                      <input
                        type="text"
                        value={localData.role}
                        onChange={(e) =>
                          handleFieldChange("role", e.target.value)
                        }
                        style={{ fontSize: "1rem", color: "#4b5563" }}
                      />
                    </>
                  ) : (
                    <>
                      <h1 style={{ fontSize: "1.875rem", fontWeight: "bold" }}>
                        {resumeData.name}
                      </h1>
                      <h2 style={{ fontSize: "1rem", color: "#4b5563" }}>
                        {resumeData.role}
                      </h2>
                    </>
                  )}
                </div>

                <div
                  style={{
                    fontSize: "0.875rem",
                    textAlign: "right",
                    lineHeight: "1.5",
                  }}
                >
                  {["location", "phone", "email", "linkedin"].map((field) =>
                    editMode ? (
                      <input
                        key={field}
                        type="text"
                        value={localData[field]}
                        onChange={(e) =>
                          handleFieldChange(field, e.target.value)
                        }
                        style={{
                          display: "block",
                          width: "100%",
                          textAlign: "right",
                          marginBottom: "0.25rem",
                        }}
                      />
                    ) : (
                      <p key={field}>
                        {field === "location" && "📍 "}
                        {field === "phone" && "📞 "}
                        {field === "email" && "✉️ "}
                        {field === "linkedin" && "🔗 "}
                        {resumeData[field]}
                      </p>
                    )
                  )}
                </div>
              </div>

              {/* Body */}
              <div style={{ marginTop: "1.5rem", display: "flex", gap: "1.5rem" }}>
                {/* Left column */}
                <div style={{ width: "33.33%" }}>
                  <h3
                    style={{
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

                {/* Right column */}
                <div style={{ width: "66.66%" }}>
                  <h3
                    style={{
                      fontWeight: "bold",
                      fontSize: "1.125rem",
                      borderBottom: "1px solid #e5e7eb",
                    }}
                  >
                    Summary
                  </h3>
                  {editMode ? (
                    <textarea
                      value={localData.summary}
                      onChange={(e) =>
                        handleFieldChange("summary", e.target.value)
                      }
                      style={{
                        width: "100%",
                        marginTop: "0.5rem",
                        padding: "0.5rem",
                        border: "1px solid #d1d5db",
                        borderRadius: "0.25rem",
                      }}
                      rows={4}
                    />
                  ) : (
                    <p style={{ marginTop: "0.5rem" }}>{resumeData.summary}</p>
                  )}

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
              </div>
            </div>

            {/* Buttons */}
            <div style={{ marginTop: "1.5rem", textAlign: "center" }}>
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
        </div>
      </div>
    );
  };

  export default Template1;
