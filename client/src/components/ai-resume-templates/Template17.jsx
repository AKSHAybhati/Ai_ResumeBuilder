import { useState, useRef, useEffect } from "react";
import Sidebar from "../Sidebar/Sidebar";
import Navbar from "../Navbar/Navbar";
import { useResume } from "../../context/ResumeContext";
import { MapPin, Phone, Mail, Linkedin, Github, Globe } from "lucide-react";

const Template17 = () => {
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

  const handleArrayFieldChange = (section, index, key, value) => {
    const updated = [...localData[section]];
    updated[index][key] = value;
    const updatedData = { ...localData, [section]: updated };
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

  const sectionTitleStyle = {
    fontWeight: "700",
    fontSize: "1.1rem",
    color: "#4f46e5",
    textTransform: "uppercase",
    marginBottom: "0.5rem",
  };

  const sectionDivider = {
    border: "none",
    borderTop: "1px solid #e5e7eb",
    marginBottom: "1rem",
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f3f4f6" }}>
      <Navbar />
      <div style={{ display: "flex" }}>
        <Sidebar onEnhance={() => {}} resumeRef={resumeRef} />
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
            ref={resumeRef}
            style={{
              backgroundColor: "#fdfcfb", // light cream color
              color: "#111827",
              maxWidth: "900px",
              width: "100%",
              padding: "2rem",
              border: "1px solid #e5e7eb",
              borderRadius: "0.75rem",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
              fontFamily: "Arial, sans-serif",
            }}
          >
            {/* Header */}
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                marginBottom: "1.5rem",
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
                        fontSize: "3.5rem",
                        fontWeight: "700",  
                        color: "#4B5563",
                        display: "block",
                        marginBottom: "0.25rem",
                      }}
                    />
                    <input
                      type="text"
                      value={localData.role}
                      onChange={(e) =>
                        handleFieldChange("role", e.target.value)
                      }
                      style={{
                        fontSize: "1.3rem",
                        color: "#3B82F6",
                        display: "block",
                        marginBottom: "0.75rem",
                      }}
                    />
                  </>
                ) : (
                  <>
                    <h1
                      style={{
                        fontSize: "3.5rem",
                        fontWeight: "700",
                        margin: 0,
                        color: "#4B5563",
                      }}
                    >
                      {resumeData.name}
                    </h1>
                    <h2
                      style={{
                        fontSize: "1.3rem",
                        fontWeight: "700",
                        color: "#3B82F6",
                        marginTop: "0.25rem",
                      }}
                    >
                      {resumeData.role}
                    </h2>
                  </>
                )}

                {/* 📍 Location & Phone */}
                <div
                  style={{ display: "flex", gap: "1rem", marginTop: "0.75rem" }}
                >
                  {editMode ? (
                    <>
                      <input
                        type="text"
                        value={localData.location}
                        onChange={(e) =>
                          handleFieldChange("location", e.target.value)
                        }
                        placeholder="Location"
                        style={{ fontSize: "0.95rem" }}
                      />
                      <input
                        type="text"
                        value={localData.phone}
                        onChange={(e) =>
                          handleFieldChange("phone", e.target.value)
                        }
                        placeholder="Phone"
                        style={{ fontSize: "0.95rem" }}
                      />
                    </>
                  ) : (
                    <>
                      <p
                        style={{
                          display: "flex",
                          alignItems: "center",
                          margin: 0,
                          fontSize: "0.95rem",
                          color: "#374151",
                        }}
                      >
                        <MapPin size={16} style={{ marginRight: "4px" }} />{" "}
                        {resumeData.location}
                      </p>
                      <p
                        style={{
                          display: "flex",
                          alignItems: "center",
                          margin: 0,
                          fontSize: "0.95rem",
                          color: "#374151",
                        }}
                      >
                        <Phone size={16} style={{ marginRight: "4px" }} />{" "}
                        {resumeData.phone}
                      </p>
                    </>
                  )}
                </div>

                {/* ✉️ Email + Socials */}
                <div
                  style={{
                    display: "flex",
                    gap: "1rem",
                    marginTop: "0.5rem",
                    flexWrap: "wrap",
                  }}
                >
                  {editMode ? (
                    ["email", "linkedin", "github", "portfolio"].map(
                      (field) => (
                        <input
                          key={field}
                          type="text"
                          value={localData[field]}
                          onChange={(e) =>
                            handleFieldChange(field, e.target.value)
                          }
                          placeholder={field}
                          style={{ fontSize: "0.9rem" }}
                        />
                      )
                    )
                  ) : (
                    <>
                      <a
                        href={`mailto:${resumeData.email}`}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          fontSize: "0.9rem",
                          color: "#374151",
                          textDecoration: "none",
                        }}
                      >
                        <Mail size={16} style={{ marginRight: "4px" }} />{" "}
                        {resumeData.email}
                      </a>
                      <a
                        href={resumeData.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          display: "flex",
                          alignItems: "center",
                          fontSize: "0.9rem",
                          color: "#374151",
                          textDecoration: "none",
                        }}
                      >
                        <Linkedin size={16} style={{ marginRight: "4px" }} />{" "}
                        LinkedIn
                      </a>
                      <a
                        href={resumeData.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          display: "flex",
                          alignItems: "center",
                          fontSize: "0.9rem",
                          color: "#374151",
                          textDecoration: "none",
                        }}
                      >
                        <Github size={16} style={{ marginRight: "4px" }} />{" "}
                        GitHub
                      </a>
                      <a
                        href={resumeData.portfolio}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          display: "flex",
                          alignItems: "center",
                          fontSize: "0.9rem",
                          color: "#374151",
                          textDecoration: "none",
                        }}
                      >
                        <Globe size={16} style={{ marginRight: "4px" }} />{" "}
                        Portfolio
                      </a>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Summary */}
            <div style={{ marginBottom: "1.5rem" }}>
              <h3
                style={{
                  ...sectionTitleStyle,
                  fontSize: "1.7rem",
                  fontWeight: "700",
                }}
              >
                Summary
              </h3>
              <hr style={sectionDivider} />
              {editMode ? (
                <textarea
                  value={localData.summary}
                  onChange={(e) => handleFieldChange("summary", e.target.value)}
                  style={{ width: "100%", minHeight: "4rem" }}
                />
              ) : (
                <p>{resumeData.summary}</p>
              )}
            </div>

            {/* Experience */}
            <div style={{ marginBottom: "1.5rem" }}>
              <h3
                style={{
                  ...sectionTitleStyle,
                  fontSize: "1.7rem",
                  fontWeight: "700",
                }}
              >
                Experience
              </h3>
              <hr style={sectionDivider} />
              {localData.experience.map((exp, idx) => (
                <div key={idx} style={{ marginBottom: "1rem" }}>
                  {editMode ? (
                    <>
                      <input
                        type="text"
                        value={exp.title}
                        onChange={(e) =>
                          handleArrayFieldChange(
                            "experience",
                            idx,
                            "title",
                            e.target.value
                          )
                        }
                        placeholder="Title"
                      />
                      <input
                        type="text"
                        value={exp.companyName}
                        onChange={(e) =>
                          handleArrayFieldChange(
                            "experience",
                            idx,
                            "companyName",
                            e.target.value
                          )
                        }
                        placeholder="Company"
                      />
                      <input
                        type="text"
                        value={exp.date}
                        onChange={(e) =>
                          handleArrayFieldChange(
                            "experience",
                            idx,
                            "date",
                            e.target.value
                          )
                        }
                        placeholder="Date"
                      />
                      <input
                        type="text"
                        value={exp.companyLocation}
                        onChange={(e) =>
                          handleArrayFieldChange(
                            "experience",
                            idx,
                            "companyLocation",
                            e.target.value
                          )
                        }
                        placeholder="Location"
                      />
                      <textarea
                        value={exp.accomplishment.join("\n")}
                        onChange={(e) =>
                          handleArrayFieldChange(
                            "experience",
                            idx,
                            "accomplishment",
                            e.target.value.split("\n")
                          )
                        }
                      />
                    </>
                  ) : (
                    <>
                      <p>
                        <strong>{exp.title}</strong> — {exp.companyName} (
                        {exp.date})<br />
                        <em>{exp.companyLocation}</em>
                      </p>
                      <ul style={{ paddingLeft: "1.25rem", lineHeight: "1.6" }}>
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
            <div style={{ marginBottom: "1.5rem" }}>
              <h3
                style={{
                  ...sectionTitleStyle,
                  fontSize: "1.7rem",
                  fontWeight: "700",
                }}
              >
                Education
              </h3>
              <hr style={sectionDivider} />
              {localData.education.map((edu, idx) => (
                <div key={idx}>
                  {editMode ? (
                    <>
                      <input
                        type="text"
                        value={edu.degree}
                        onChange={(e) =>
                          handleArrayFieldChange(
                            "education",
                            idx,
                            "degree",
                            e.target.value
                          )
                        }
                      />
                      <input
                        type="text"
                        value={edu.institution}
                        onChange={(e) =>
                          handleArrayFieldChange(
                            "education",
                            idx,
                            "institution",
                            e.target.value
                          )
                        }
                      />
                      <input
                        type="text"
                        value={edu.duration}
                        onChange={(e) =>
                          handleArrayFieldChange(
                            "education",
                            idx,
                            "duration",
                            e.target.value
                          )
                        }
                      />
                      <input
                        type="text"
                        value={edu.location}
                        onChange={(e) =>
                          handleArrayFieldChange(
                            "education",
                            idx,
                            "location",
                            e.target.value
                          )
                        }
                      />
                    </>
                  ) : (
                    <p>
                      <strong>{edu.degree}</strong>, {edu.institution} (
                      {edu.duration}) — {edu.location}
                    </p>
                  )}
                </div>
              ))}
            </div>

            {/* Skills, Languages, Interests */}
            {["skills", "languages", "interests"].map((section) => (
              <div key={section} style={{ marginBottom: "1.5rem" }}>
                <h3
                  style={{
                    ...sectionTitleStyle,
                    fontSize: "1.7rem",
                    fontWeight: "700",
                  }}
                >
                  {section.charAt(0).toUpperCase() + section.slice(1)}
                </h3>
                <hr style={sectionDivider} />
                {editMode ? (
                  <textarea
                    value={localData[section].join(", ")}
                    onChange={(e) =>
                      handleFieldChange(
                        section,
                        e.target.value.split(",").map((item) => item.trim())
                      )
                    }
                    style={{ width: "100%" }}
                  />
                ) : (
                  <ul style={{ paddingLeft: "1.25rem", lineHeight: "1.6" }}>
                    {resumeData[section].map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
            </div>

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

export default Template17;
