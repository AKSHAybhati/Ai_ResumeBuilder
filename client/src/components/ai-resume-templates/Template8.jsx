import React, { useState, useRef, useEffect } from "react";
import Sidebar from "../Sidebar/Sidebar";
import Navbar from "../Navbar/Navbar";
import { useResume } from "../../context/ResumeContext";

const Template8 = () => {
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
    // Auto-save to localStorage for universal save system
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

  const handleArrayFieldChange = (arrayField, index, subField, value) => {
    const updated = [...localData[arrayField]];
    updated[index][subField] = value;
    handleFieldChange(arrayField, updated);
  };

  const handleArrayListChange = (arrayField, index, listField, value) => {
    const updated = [...localData[arrayField]];
    updated[index][listField] = value.split('\n').filter(item => item.trim());
    handleFieldChange(arrayField, updated);
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f9fafb" }}>
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
          {/* Page container with border and A4 dimensions */}
          <div
            ref={resumeRef}
            style={{
              fontFamily: "Arial, sans-serif",
              width: "210mm", // A4 width
              minHeight: "297mm", // A4 height
              maxWidth: "800px",
              margin: "0 auto",
              padding: "30px",
              backgroundColor: "#fff",
              color: "#333",
              boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
              border: "1px solid #ddd", // Page border
              boxSizing: "border-box",
              pageBreakAfter: "always"
            }}
          >
            {/* Header Section */}
            <div
              style={{
                textAlign: "center",
                marginBottom: "20px",
                borderBottom: "2px solid #ff7b25",
                paddingBottom: "20px",
                position: "relative"
              }}
            >
              {editMode ? (
                <>
                  <input
                    type="text"
                    value={localData.name}
                    onChange={(e) => handleFieldChange("name", e.target.value)}
                    style={{
                      fontSize: "28px",
                      fontWeight: "bold",
                      color: "#333",
                      marginBottom: "5px",
                      textTransform: "uppercase",
                      textAlign: "center",
                      border: "1px solid #ddd",
                      padding: "5px",
                      width: "100%"
                    }}
                  />
                  <input
                    type="text"
                    value={localData.role}
                    onChange={(e) => handleFieldChange("role", e.target.value)}
                    style={{
                      fontSize: "18px",
                      color: "#ff7b25",
                      marginBottom: "15px",
                      textTransform: "uppercase",
                      textAlign: "center",
                      border: "1px solid #ddd",
                      padding: "5px",
                      width: "100%"
                    }}
                  />
                </>
              ) : (
                <>
                  <h1
                    style={{
                      fontSize: "28px",
                      fontWeight: "bold",
                      color: "#333",
                      marginBottom: "5px",
                      textTransform: "uppercase",
                      margin: "0"
                    }}
                  >
                    {resumeData.name}
                  </h1>
                  <h2
                    style={{
                      fontSize: "18px",
                      color: "#ff7b25",
                      marginBottom: "15px",
                      textTransform: "uppercase",
                      margin: "5px 0 15px 0"
                    }}
                  >
                    {resumeData.role}
                  </h2>
                </>
              )}

              {/* Contact Info */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  flexWrap: "wrap",
                  gap: "20px"
                }}
              >
                {["phone", "email", "location", "linkedin"].map((field) => (
                  <div key={field} style={{ display: "flex", alignItems: "center", fontSize: "14px" }}>
                    <span style={{ color: "#ff7b25", marginRight: "5px", fontWeight: "bold" }}>
                      {field === "phone" && "📞"}
                      {field === "email" && "✉️"}
                      {field === "location" && "📍"}
                      {field === "linkedin" && "🔗"}
                    </span>
                    {editMode ? (
                      <input
                        type="text"
                        value={localData[field]}
                        onChange={(e) => handleFieldChange(field, e.target.value)}
                        style={{
                          border: "1px solid #ddd",
                          padding: "2px 5px",
                          fontSize: "14px"
                        }}
                      />
                    ) : (
                      <span>{resumeData[field]}</span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Summary Section */}
            <div style={{ marginBottom: "25px", position: "relative" }}>
              <h3
                style={{
                  fontSize: "18px",
                  fontWeight: "bold",
                  color: "#ff7b25",
                  textTransform: "uppercase",
                  borderBottom: "1px solid #ddd",
                  paddingBottom: "5px",
                  marginBottom: "15px"
                }}
              >
                PROFESSIONAL SUMMARY
              </h3>
              {editMode ? (
                <textarea
                  value={localData.summary}
                  onChange={(e) => handleFieldChange("summary", e.target.value)}
                  style={{
                    fontSize: "14px",
                    lineHeight: "1.5",
                    width: "100%",
                    minHeight: "80px",
                    border: "1px solid #ddd",
                    padding: "10px",
                    resize: "vertical"
                  }}
                />
              ) : (
                <p style={{ fontSize: "14px", lineHeight: "1.5", margin: "0" }}>
                  {resumeData.summary}
                </p>
              )}
            </div>

            {/* Skills Section */}
            <div style={{ marginBottom: "25px", position: "relative" }}>
              <h3
                style={{
                  fontSize: "18px",
                  fontWeight: "bold",
                  color: "#ff7b25",
                  textTransform: "uppercase",
                  borderBottom: "1px solid #ddd",
                  paddingBottom: "5px",
                  marginBottom: "15px"
                }}
              >
                SKILLS
              </h3>
              {editMode ? (
                <textarea
                  value={localData.skills?.join(", ") || ""}
                  onChange={(e) =>
                    handleFieldChange(
                      "skills",
                      e.target.value.split(",").map((s) => s.trim()).filter(s => s)
                    )
                  }
                  style={{
                    width: "100%",
                    minHeight: "60px",
                    border: "1px solid #ddd",
                    padding: "10px",
                    resize: "vertical"
                  }}
                />
              ) : (
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "10px",
                    marginTop: "10px"
                  }}
                >
                  {resumeData.skills?.map((skill, index) => (
                    <span
                      key={index}
                      style={{
                        backgroundColor: "#ff7b25",
                        color: "white",
                        padding: "5px 10px",
                        borderRadius: "3px",
                        fontSize: "13px",
                        display: "flex",
                        alignItems: "center",
                        gap: "5px"
                      }}
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Experience Section */}
            <div style={{ marginBottom: "25px", position: "relative" }}>
              <h3
                style={{
                  fontSize: "18px",
                  fontWeight: "bold",
                  color: "#ff7b25",
                  textTransform: "uppercase",
                  borderBottom: "1px solid #ddd",
                  paddingBottom: "5px",
                  marginBottom: "15px"
                }}
              >
                PROFESSIONAL EXPERIENCE
              </h3>
              {resumeData.experience?.map((exp, index) => (
                <div key={index} style={{ marginBottom: "20px" }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      fontWeight: "bold",
                      marginBottom: "5px",
                      flexWrap: "wrap"
                    }}
                  >
                    {editMode ? (
                      <>
                        <input
                          type="text"
                          value={localData.experience[index]?.title || ""}
                          onChange={(e) =>
                            handleArrayFieldChange("experience", index, "title", e.target.value)
                          }
                          style={{
                            border: "1px solid #ddd",
                            padding: "2px 5px",
                            marginBottom: "5px",
                            flex: "1",
                            marginRight: "10px"
                          }}
                        />
                        <input
                          type="text"
                          value={localData.experience[index]?.date || ""}
                          onChange={(e) =>
                            handleArrayFieldChange("experience", index, "date", e.target.value)
                          }
                          style={{
                            border: "1px solid #ddd",
                            padding: "2px 5px",
                            marginBottom: "5px"
                          }}
                        />
                      </>
                    ) : (
                      <>
                        <span>{exp.title}</span>
                        <span>{exp.date}</span>
                      </>
                    )}
                  </div>

                  <div style={{ fontStyle: "italic", marginBottom: "5px" }}>
                    {editMode ? (
                      <>
                        <input
                          type="text"
                          value={localData.experience[index]?.companyName || ""}
                          onChange={(e) =>
                            handleArrayFieldChange("experience", index, "companyName", e.target.value)
                          }
                          style={{
                            border: "1px solid #ddd",
                            padding: "2px 5px",
                            marginBottom: "5px",
                            marginRight: "10px"
                          }}
                        />
                        <input
                          type="text"
                          value={localData.experience[index]?.companyLocation || ""}
                          onChange={(e) =>
                            handleArrayFieldChange("experience", index, "companyLocation", e.target.value)
                          }
                          style={{
                            border: "1px solid #ddd",
                            padding: "2px 5px",
                            marginBottom: "5px"
                          }}
                        />
                      </>
                    ) : (
                      <span>{exp.companyName}, {exp.companyLocation}</span>
                    )}
                  </div>

                  <div style={{ paddingLeft: "20px", marginTop: "10px" }}>
                    {editMode ? (
                      <textarea
                        value={localData.experience[index]?.accomplishment?.join('\n') || ""}
                        onChange={(e) =>
                          handleArrayListChange("experience", index, "accomplishment", e.target.value)
                        }
                        style={{
                          width: "100%",
                          minHeight: "80px",
                          border: "1px solid #ddd",
                          padding: "5px",
                          fontSize: "14px",
                          resize: "vertical"
                        }}
                        placeholder="Enter accomplishments, one per line"
                      />
                    ) : (
                      <ul style={{ margin: "0", paddingLeft: "20px" }}>
                        {exp.accomplishment?.map((item, i) => (
                          <li
                            key={i}
                            style={{
                              marginBottom: "5px",
                              fontSize: "14px",
                              display: "flex",
                              alignItems: "flex-start",
                              gap: "10px"
                            }}
                          >
                            {item}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Education Section */}
            <div style={{ marginBottom: "25px", position: "relative" }}>
              <h3
                style={{
                  fontSize: "18px",
                  fontWeight: "bold",
                  color: "#ff7b25",
                  textTransform: "uppercase",
                  borderBottom: "1px solid #ddd",
                  paddingBottom: "5px",
                  marginBottom: "15px"
                }}
              >
                EDUCATION
              </h3>
              {resumeData.education?.map((edu, index) => (
                <div key={index} style={{ marginBottom: "20px" }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      fontWeight: "bold",
                      marginBottom: "5px",
                      flexWrap: "wrap"
                    }}
                  >
                    {editMode ? (
                      <>
                        <input
                          type="text"
                          value={localData.education[index]?.degree || ""}
                          onChange={(e) =>
                            handleArrayFieldChange("education", index, "degree", e.target.value)
                          }
                          style={{
                            border: "1px solid #ddd",
                            padding: "2px 5px",
                            marginBottom: "5px",
                            flex: "1",
                            marginRight: "10px"
                          }}
                        />
                        <input
                          type="text"
                          value={localData.education[index]?.duration || ""}
                          onChange={(e) =>
                            handleArrayFieldChange("education", index, "duration", e.target.value)
                          }
                          style={{
                            border: "1px solid #ddd",
                            padding: "2px 5px",
                            marginBottom: "5px"
                          }}
                        />
                      </>
                    ) : (
                      <>
                        <span>{edu.degree}</span>
                        <span>{edu.duration}</span>
                      </>
                    )}
                  </div>

                  <div style={{ fontStyle: "italic", marginBottom: "5px" }}>
                    {editMode ? (
                      <>
                        <input
                          type="text"
                          value={localData.education[index]?.institution || ""}
                          onChange={(e) =>
                            handleArrayFieldChange("education", index, "institution", e.target.value)
                          }
                          style={{
                            border: "1px solid #ddd",
                            padding: "2px 5px",
                            marginBottom: "5px",
                            marginRight: "10px"
                          }}
                        />
                        <input
                          type="text"
                          value={localData.education[index]?.location || ""}
                          onChange={(e) =>
                            handleArrayFieldChange("education", index, "location", e.target.value)
                          }
                          style={{
                            border: "1px solid #ddd",
                            padding: "2px 5px",
                            marginBottom: "5px"
                          }}
                        />
                      </>
                    ) : (
                      <span>{edu.institution}, {edu.location}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Edit/Save/Cancel Buttons */}
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
                    border: "none",
                    cursor: "pointer"
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
                  backgroundColor: "#2563eb",
                  color: "#ffffff",
                  padding: "0.5rem 1rem",
                  borderRadius: "0.375rem",
                  margin: "0 0.5rem",
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
    </div>
  );
};

export default Template8;