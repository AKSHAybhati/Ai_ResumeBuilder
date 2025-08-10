import React, { useState, useRef, useEffect } from "react";
import Sidebar from "../Sidebar/Sidebar";
import Navbar from "../Navbar/Navbar";
import { useResume } from "../../context/ResumeContext";

const Template4 = () => {
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

  const handleArrayFieldChange = (arrayField, index, subField, value) => {
    const updated = [...localData[arrayField]];
    updated[index][subField] = value;
    handleFieldChange(arrayField, updated);
  };

  const handleArrayListChange = (arrayField, index, listField, value) => {
    const updated = [...localData[arrayField]];
    updated[index][listField] = value.split("\n").filter((item) => item.trim());
    handleFieldChange(arrayField, updated);
  };

  const primaryColor = "#1e293b"; // dark blue-grey
  const accentColor = "#0ea5e9"; // sky blue

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "linear-gradient(to bottom right, #fdfbfb, #ebedee)",
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
                width: "210mm",
                minHeight: "210mm",
                maxWidth: "800px",
                margin: "0 auto",
                padding: "30px",
                background:
                  "linear-gradient(to bottom right, #ffffff, #f3f4f6)",
                color: "#333",
                boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
                borderRadius: "10px",
                border: "1px solid #e5e7eb",
                boxSizing: "border-box",
                pageBreakAfter: "always",
              }}
            >
              {/* Header Section */}
              <div
                style={{
                  textAlign: "center",
                  marginBottom: "20px",
                  borderBottom: "2px solid #14b8a6",
                  paddingBottom: "20px",
                  position: "relative",
                  background: "linear-gradient(to right, #e0f7fa, #ffffff)",
                  borderRadius: "10px",
                  paddingTop: "20px",
                }}
              >
                {editMode ? (
                  <>
                    <input
                      type="text"
                      value={localData.name}
                      onChange={(e) =>
                        handleFieldChange("name", e.target.value)
                      }
                      style={{
                        fontSize: "30px",
                        fontWeight: "bold",
                        color: "#1e3a8a",
                        marginBottom: "10px",
                        textTransform: "uppercase",
                        textAlign: "center",
                        border: "1px solid #ccc",
                        borderRadius: "6px",
                        padding: "10px",
                        width: "100%",
                        backgroundColor: "#f0faff",
                      }}
                    />
                    <input
                      type="text"
                      value={localData.role}
                      onChange={(e) =>
                        handleFieldChange("role", e.target.value)
                      }
                      style={{
                        fontSize: "20px",
                        color: "#14b8a6",
                        marginBottom: "10px",
                        textTransform: "uppercase",
                        textAlign: "center",
                        border: "1px solid #ccc",
                        borderRadius: "6px",
                        padding: "8px",
                        width: "100%",
                        backgroundColor: "#f0fdfa",
                      }}
                    />
                  </>
                ) : (
                  <>
                    <h1
                      style={{
                        fontSize: "30px",
                        fontWeight: "bold",
                        color: "#1e3a8a",
                        marginBottom: "5px",
                        textTransform: "uppercase",
                      }}
                    >
                      {resumeData.name}
                    </h1>
                    <h2
                      style={{
                        fontSize: "20px",
                        color: "#14b8a6",
                        marginBottom: "15px",
                        textTransform: "uppercase",
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
                    gap: "20px",
                  }}
                >
                  {["phone", "email", "location", "linkedin"].map((field) => (
                    <div
                      key={field}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        fontSize: "14px",
                      }}
                    >
                      <span
                        style={{
                          color: "#ff7b25",
                          marginRight: "5px",
                          fontWeight: "bold",
                        }}
                      >
                        {field === "phone" && "📞"}
                        {field === "email" && "✉️"}
                        {field === "location" && "📍"}
                        {field === "linkedin" && "🔗"}
                      </span>
                      {editMode ? (
                        <input
                          type="text"
                          value={localData[field]}
                          onChange={(e) =>
                            handleFieldChange(field, e.target.value)
                          }
                          style={{
                            border: "1px solid #ddd",
                            padding: "2px 5px",
                            fontSize: "14px",
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
              <div
                style={{
                  marginBottom: "25px",
                  position: "relative",
                  padding: "20px",
                  borderRadius: "10px",
                  background: "linear-gradient(to right, #e0f7fa, #ffffff)",
                }}
              >
                <h3
                  style={{
                    fontSize: "18px",
                    fontWeight: "bold",
                    color: "#ff7b25",
                    textTransform: "uppercase",
                    borderBottom: "1px solid #ccc",
                    paddingBottom: "5px",
                    marginBottom: "15px",
                  }}
                >
                  PROFESSIONAL SUMMARY
                </h3>
                {editMode ? (
                  <textarea
                    value={localData.summary}
                    onChange={(e) =>
                      handleFieldChange("summary", e.target.value)
                    }
                    style={{
                      fontSize: "14px",
                      lineHeight: "1.5",
                      width: "100%",
                      minHeight: "80px",
                      border: "1px solid #ccc",
                      padding: "10px",
                      borderRadius: "6px",
                      resize: "vertical",
                    }}
                  />
                ) : (
                  <p
                    style={{ fontSize: "14px", lineHeight: "1.5", margin: "0" }}
                  >
                    {resumeData.summary}
                  </p>
                )}
              </div>

              {/* Skills Section */}
              <div style={{ marginBottom: "25px" }}>
                <h3
                  style={{
                    fontSize: "18px",
                    fontWeight: "600",
                    color: "#00796b", // Soft teal for headings
                    textTransform: "uppercase",
                    borderBottom: "2px solid #b2dfdb", // Softer border
                    paddingBottom: "6px",
                    marginBottom: "15px",
                    letterSpacing: "1px",
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
                        e.target.value
                          .split(",")
                          .map((s) => s.trim())
                          .filter((s) => s)
                      )
                    }
                    style={{
                      width: "100%",
                      minHeight: "60px",
                      border: "1px solid #ccc",
                      padding: "10px",
                      resize: "vertical",
                      borderRadius: "8px",
                      fontSize: "14px",
                      fontFamily: "inherit",
                      background: "#ffffffcc",
                    }}
                  />
                ) : (
                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: "10px",
                      marginTop: "10px",
                    }}
                  >
                    {resumeData.skills?.map((skill, index) => (
                      <span
                        key={index}
                        style={{
                          backgroundColor: "#00796b", // Teal soft badge
                          color: "#ffffff",
                          padding: "6px 12px",
                          borderRadius: "20px",
                          fontSize: "13px",
                          fontWeight: "500",
                        }}
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Experience Section */}
              <div style={{ marginBottom: "25px" }}>
                <h3
                  style={{
                    fontSize: "18px",
                    fontWeight: "600",
                    color: "#00796b",
                    textTransform: "uppercase",
                    borderBottom: "2px solid #b2dfdb",
                    paddingBottom: "6px",
                    marginBottom: "15px",
                    letterSpacing: "1px",
                  }}
                >
                  Professional Experience
                </h3>

                {resumeData.experience?.map((exp, index) => (
                  <div key={index} style={{ marginBottom: "20px" }}>
                    {/* Title and Date */}
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        flexWrap: "wrap",
                        fontWeight: "600",
                        marginBottom: "5px",
                      }}
                    >
                      {editMode ? (
                        <>
                          <input
                            type="text"
                            value={localData.experience[index]?.title || ""}
                            onChange={(e) =>
                              handleArrayFieldChange(
                                "experience",
                                index,
                                "title",
                                e.target.value
                              )
                            }
                            style={{
                              border: "1px solid #ccc",
                              padding: "4px 8px",
                              marginBottom: "5px",
                              flex: "1",
                              marginRight: "10px",
                              borderRadius: "6px",
                              fontSize: "14px",
                            }}
                            placeholder="Job Title"
                          />
                          <input
                            type="text"
                            value={localData.experience[index]?.date || ""}
                            onChange={(e) =>
                              handleArrayFieldChange(
                                "experience",
                                index,
                                "date",
                                e.target.value
                              )
                            }
                            style={{
                              border: "1px solid #ccc",
                              padding: "4px 8px",
                              marginBottom: "5px",
                              borderRadius: "6px",
                              fontSize: "14px",
                            }}
                            placeholder="Date"
                          />
                        </>
                      ) : (
                        <>
                          <span>{exp.title}</span>
                          <span>{exp.date}</span>
                        </>
                      )}
                    </div>

                    {/* Company Name and Location */}
                    <div
                      style={{
                        fontStyle: "italic",
                        marginBottom: "8px",
                        fontSize: "14px",
                        color: "#555",
                      }}
                    >
                      {editMode ? (
                        <>
                          <input
                            type="text"
                            value={
                              localData.experience[index]?.companyName || ""
                            }
                            onChange={(e) =>
                              handleArrayFieldChange(
                                "experience",
                                index,
                                "companyName",
                                e.target.value
                              )
                            }
                            style={{
                              border: "1px solid #ccc",
                              padding: "4px 8px",
                              marginBottom: "5px",
                              marginRight: "10px",
                              borderRadius: "6px",
                              fontSize: "14px",
                            }}
                            placeholder="Company Name"
                          />
                          <input
                            type="text"
                            value={
                              localData.experience[index]?.companyLocation || ""
                            }
                            onChange={(e) =>
                              handleArrayFieldChange(
                                "experience",
                                index,
                                "companyLocation",
                                e.target.value
                              )
                            }
                            style={{
                              border: "1px solid #ccc",
                              padding: "4px 8px",
                              marginBottom: "5px",
                              borderRadius: "6px",
                              fontSize: "14px",
                            }}
                            placeholder="Location"
                          />
                        </>
                      ) : (
                        <span>
                          {exp.companyName}, {exp.companyLocation}
                        </span>
                      )}
                    </div>

                    {/* Accomplishments */}
                    <div style={{ paddingLeft: "20px", marginTop: "10px" }}>
                      {editMode ? (
                        <textarea
                          value={
                            localData.experience[index]?.accomplishment?.join(
                              "\n"
                            ) || ""
                          }
                          onChange={(e) =>
                            handleArrayListChange(
                              "experience",
                              index,
                              "accomplishment",
                              e.target.value
                            )
                          }
                          style={{
                            width: "100%",
                            minHeight: "80px",
                            border: "1px solid #ccc",
                            borderRadius: "8px",
                            padding: "10px",
                            fontSize: "14px",
                            resize: "vertical",
                            background: "#ffffffcc",
                            fontFamily: "inherit",
                          }}
                          placeholder="Enter accomplishments, one per line"
                        />
                      ) : (
                        <ul style={{ margin: 0, paddingLeft: "20px" }}>
                          {exp.accomplishment?.map((item, i) => (
                            <li
                              key={i}
                              style={{
                                marginBottom: "6px",
                                fontSize: "14px",
                                lineHeight: "1.6",
                                color: "#333",
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
              <div style={{ marginBottom: "25px" }}>
                <h3
                  style={{
                    fontSize: "18px",
                    fontWeight: "600",
                    color: "#00796b",
                    textTransform: "uppercase",
                    borderBottom: "2px solid #b2dfdb",
                    paddingBottom: "6px",
                    marginBottom: "15px",
                    letterSpacing: "1px",
                  }}
                >
                  Education
                </h3>

                {resumeData.education?.map((edu, index) => (
                  <div key={index} style={{ marginBottom: "20px" }}>
                    {/* Degree and Duration */}
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        flexWrap: "wrap",
                        fontWeight: "600",
                        marginBottom: "5px",
                      }}
                    >
                      {editMode ? (
                        <>
                          <input
                            type="text"
                            value={localData.education[index]?.degree || ""}
                            onChange={(e) =>
                              handleArrayFieldChange(
                                "education",
                                index,
                                "degree",
                                e.target.value
                              )
                            }
                            placeholder="Degree"
                            style={{
                              border: "1px solid #ccc",
                              padding: "4px 8px",
                              marginBottom: "5px",
                              flex: "1",
                              marginRight: "10px",
                              borderRadius: "6px",
                              fontSize: "14px",
                            }}
                          />
                          <input
                            type="text"
                            value={localData.education[index]?.duration || ""}
                            onChange={(e) =>
                              handleArrayFieldChange(
                                "education",
                                index,
                                "duration",
                                e.target.value
                              )
                            }
                            placeholder="Duration"
                            style={{
                              border: "1px solid #ccc",
                              padding: "4px 8px",
                              marginBottom: "5px",
                              borderRadius: "6px",
                              fontSize: "14px",
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

                    {/* Institution and Location */}
                    <div
                      style={{
                        fontStyle: "italic",
                        marginBottom: "8px",
                        fontSize: "14px",
                        color: "#555",
                      }}
                    >
                      {editMode ? (
                        <>
                          <input
                            type="text"
                            value={
                              localData.education[index]?.institution || ""
                            }
                            onChange={(e) =>
                              handleArrayFieldChange(
                                "education",
                                index,
                                "institution",
                                e.target.value
                              )
                            }
                            placeholder="Institution"
                            style={{
                              border: "1px solid #ccc",
                              padding: "4px 8px",
                              marginBottom: "5px",
                              marginRight: "10px",
                              borderRadius: "6px",
                              fontSize: "14px",
                            }}
                          />
                          <input
                            type="text"
                            value={localData.education[index]?.location || ""}
                            onChange={(e) =>
                              handleArrayFieldChange(
                                "education",
                                index,
                                "location",
                                e.target.value
                              )
                            }
                            placeholder="Location"
                            style={{
                              border: "1px solid #ccc",
                              padding: "4px 8px",
                              marginBottom: "5px",
                              borderRadius: "6px",
                              fontSize: "14px",
                            }}
                          />
                        </>
                      ) : (
                        <span>
                          {edu.institution}, {edu.location}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
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
                    cursor: "pointer",
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
                    cursor: "pointer",
                  }}
                >
                  Cancel
                </button>
              </>
            ) : (
              <button
                onClick={() => setEditMode(true)}
                style={{
                  backgroundColor: accentColor,
                  color: "#ffffff",
                  padding: "0.5rem 1rem",
                  borderRadius: "0.375rem",
                  margin: "0 0.5rem",
                  border: "none",
                  cursor: "pointer",
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

export default Template4;
