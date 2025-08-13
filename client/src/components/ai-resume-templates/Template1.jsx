import React, { useState, useRef, useEffect } from "react";
import Sidebar from "../Sidebar/Sidebar";
import Navbar from "../Navbar/Navbar";
import { useResume } from "../../context/ResumeContext";

const Template26 = () => {
  const resumeContext = useResume();
  
  // Handle case where context might not be properly initialized
  const resumeData = resumeContext?.resumeData || {};
  const updateResumeData = resumeContext?.updateResumeData;
  
  const [localData, setLocalData] = useState(resumeData);
  const [editMode, setEditMode] = useState(false);
  const [saveStatus, setSaveStatus] = useState('');
  const resumeRef = useRef();

  // Debug logging
  useEffect(() => {
    console.log("Full context object:", resumeContext);
    console.log("Context resumeData:", resumeData);
    console.log("updateResumeData function:", updateResumeData);
    console.log("updateResumeData type:", typeof updateResumeData);
  }, [resumeContext, resumeData, updateResumeData]);

  useEffect(() => {
    if (resumeData) {
      setLocalData(JSON.parse(JSON.stringify(resumeData))); // Deep copy
    }
  }, [resumeData]);

  const handleInputChange = (field, value) => {
    console.log(`Updating ${field} with:`, value);
    setLocalData(prev => ({ ...prev, [field]: value }));
  };

  const handleObjectChange = (section, index, field, value) => {
    console.log(`Updating ${section}[${index}].${field} with:`, value);
    setLocalData(prev => {
      const updatedSection = [...(prev[section] || [])];
      if (updatedSection[index]) {
        updatedSection[index] = { ...updatedSection[index], [field]: value };
      }
      return { ...prev, [section]: updatedSection };
    });
  };

  const addItem = (section, newItem) => {
    console.log(`Adding item to ${section}:`, newItem);
    setLocalData(prev => ({
      ...prev,
      [section]: [...(prev[section] || []), newItem]
    }));
  };

  const removeItem = (section, index) => {
    console.log(`Removing item from ${section} at index ${index}`);
    setLocalData(prev => {
      const updatedSection = (prev[section] || []).filter((_, i) => i !== index);
      return { ...prev, [section]: updatedSection };
    });
  };

  const handleSave = async () => {
    try {
      setSaveStatus('Saving...');
      console.log("Attempting to save data:", localData);
      
      // Check if context is available
      if (!resumeContext) {
        throw new Error('Resume context is not available. Make sure ResumeProvider is wrapping your component.');
      }
      
      // Check if updateResumeData function exists
      if (typeof updateResumeData !== 'function') {
        console.error('Available context methods:', Object.keys(resumeContext));
        throw new Error(`updateResumeData is not a function. Available methods: ${Object.keys(resumeContext).join(', ')}`);
      }
      
      // Call the context update function
      await updateResumeData(localData);
      
      // Exit edit mode
      setEditMode(false);
      setSaveStatus('Saved successfully!');
      
      console.log("Resume data saved successfully");
      
      // Clear success message after 3 seconds
      setTimeout(() => setSaveStatus(''), 3000);
      
    } catch (error) {
      console.error("Error saving resume data:", error);
      setSaveStatus(`Error: ${error.message}`);
      
      // Clear error message after 5 seconds
      setTimeout(() => setSaveStatus(''), 5000);
    }
  };

  const handleCancel = () => {
    console.log("Cancelling changes, reverting to:", resumeData);
    setLocalData(resumeData ? JSON.parse(JSON.stringify(resumeData)) : {});
    setEditMode(false);
    setSaveStatus('');
  };

  // Temporary save function for testing (fallback)
  const handleSaveLocal = () => {
    console.log("Using local save (context not available)");
    console.log("Data to save:", localData);
    
    // You can temporarily save to localStorage for testing
    try {
      localStorage.setItem('resumeData', JSON.stringify(localData));
      setEditMode(false);
      setSaveStatus('Saved locally!');
      setTimeout(() => setSaveStatus(''), 3000);
    } catch (error) {
      setSaveStatus('Error saving locally');
      setTimeout(() => setSaveStatus(''), 3000);
    }
  };

  const handleEnhance = (section) => {
    console.log(`Enhancing ${section}`);
  };

  const handleFontChange = (font) => {
    setLocalData({ ...localData, font });
  };

  const handleColorChange = (color) => {
    setLocalData({ ...localData, textColor: color });
  };

  const handleDownload = () => {
    console.log("Downloading resume");
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f9fafb" }}>
      <Navbar />
      <div style={{ display: "flex" }}>
        <Sidebar 
          onEnhance={handleEnhance} 
          resumeRef={resumeRef}
          onFontChange={handleFontChange}
          onColorChange={handleColorChange}
          onDownload={handleDownload}
        />
        
        <div style={{ flexGrow: 1, padding: "2rem", display: "flex", flexDirection: "column", alignItems: "center" }}>
          <div
            ref={resumeRef}
            style={{
              backgroundColor: "#ffffff",
              color: "#1f2937",
              maxWidth: "72rem",
              width: "100%",
              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
              padding: "2.5rem",
              fontFamily: localData.font || "serif"
            }}
          >
            {/* Header Section */}
            <div style={{ 
              borderBottom: `4px solid ${localData.textColor || "#0a91b2"}`,
              paddingBottom: "1.5rem",
              marginBottom: "1.5rem"
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div style={{ flex: 1 }}>
                  {editMode ? (
                    <>
                      <input
                        type="text"
                        value={localData.name || ""}
                        onChange={(e) => handleInputChange("name", e.target.value)}
                        style={{
                          fontSize: "2.25rem",
                          fontWeight: "bold",
                          marginBottom: "0.5rem",
                          color: localData.textColor || "#0a91b2",
                          border: "1px solid #d1d5db",
                          borderRadius: "0.25rem",
                          padding: "0.5rem",
                          width: "100%",
                          outline: "none"
                        }}
                        placeholder="Your Name"
                      />
                      <input
                        type="text"
                        value={localData.domain || ""}
                        onChange={(e) => handleInputChange("domain", e.target.value)}
                        style={{
                          fontSize: "1.25rem",
                          color: "#6b7280",
                          border: "1px solid #d1d5db",
                          borderRadius: "0.25rem",
                          padding: "0.5rem",
                          width: "100%",
                          outline: "none"
                        }}
                        placeholder="Your Professional Domain"
                      />
                    </>
                  ) : (
                    <>
                      <h1 style={{
                        fontSize: "2.25rem",
                        fontWeight: "bold",
                        marginBottom: "0.5rem",
                        color: localData.textColor || "#0a91b2"
                      }}>
                        {localData.name || "Your Name"}
                      </h1>
                      <p style={{
                        fontSize: "1.25rem",
                        color: "#6b7280"
                      }}>
                        {localData.domain || "Your Professional Domain"}
                      </p>
                    </>
                  )}
                </div>
                
                <div style={{ flex: 1, maxWidth: "20rem" }}>
                  {editMode ? (
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                      <input
                        type="email"
                        value={localData.email || ""}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        style={{
                          fontSize: "0.875rem",
                          border: "1px solid #d1d5db",
                          borderRadius: "0.25rem",
                          padding: "0.5rem",
                          outline: "none"
                        }}
                        placeholder="email@example.com"
                      />
                      <input
                        type="tel"
                        value={localData.phone || ""}
                        onChange={(e) => handleInputChange("phone", e.target.value)}
                        style={{
                          fontSize: "0.875rem",
                          border: "1px solid #d1d5db",
                          borderRadius: "0.25rem",
                          padding: "0.5rem",
                          outline: "none"
                        }}
                        placeholder="Phone Number"
                      />
                      <input
                        type="text"
                        value={localData.location || ""}
                        onChange={(e) => handleInputChange("location", e.target.value)}
                        style={{
                          fontSize: "0.875rem",
                          border: "1px solid #d1d5db",
                          borderRadius: "0.25rem",
                          padding: "0.5rem",
                          outline: "none"
                        }}
                        placeholder="Location"
                      />
                      <input
                        type="url"
                        value={localData.linkedin || ""}
                        onChange={(e) => handleInputChange("linkedin", e.target.value)}
                        style={{
                          fontSize: "0.875rem",
                          border: "1px solid #d1d5db",
                          borderRadius: "0.25rem",
                          padding: "0.5rem",
                          outline: "none"
                        }}
                        placeholder="LinkedIn URL"
                      />
                    </div>
                  ) : (
                    <div style={{ fontSize: "0.875rem", lineHeight: "1.5", textAlign: "right" }}>
                      {localData.email && <div>{localData.email}</div>}
                      {localData.phone && <div>{localData.phone}</div>}
                      {localData.location && <div>{localData.location}</div>}
                      {localData.linkedin && <div>{localData.linkedin}</div>}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Summary Section */}
            <div style={{ marginBottom: "2rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <h3 style={{
                  fontSize: "1.25rem",
                  fontWeight: "bold",
                  borderBottom: `2px solid ${localData.textColor || "#0a91b2"}`,
                  paddingBottom: "0.5rem",
                  marginBottom: "1rem",
                  color: localData.textColor || "#0a91b2"
                }}>
                  Professional Summary
                </h3>
                {editMode && (
                  <button 
                    onClick={() => handleEnhance("summary")}
                    style={{
                      backgroundColor: "#f59e0b",
                      color: "white",
                      padding: "0.25rem 0.5rem",
                      borderRadius: "0.25rem",
                      fontSize: "0.75rem",
                      cursor: "pointer",
                      border: "none"
                    }}
                  >
                    Enhance
                  </button>
                )}
              </div>
              {editMode ? (
                <textarea
                  value={localData.summary || ""}
                  onChange={(e) => handleInputChange("summary", e.target.value)}
                  style={{
                    width: "100%",
                    minHeight: "4rem",
                    fontSize: "0.875rem",
                    lineHeight: "1.5",
                    border: "1px solid #d1d5db",
                    borderRadius: "0.25rem",
                    padding: "0.5rem",
                    resize: "vertical",
                    outline: "none"
                  }}
                  placeholder="Write your professional summary here..."
                />
              ) : (
                <p style={{
                  fontSize: "0.875rem",
                  lineHeight: "1.5",
                  textAlign: "justify"
                }}>
                  {localData.summary || "Your professional summary will appear here."}
                </p>
              )}
            </div>

            {/* Main Content */}
            <div style={{ display: "flex", gap: "2rem" }}>
              {/* Left Column */}
              <div style={{ width: "35%" }}>
                {/* Skills Section */}
                <div style={{ marginBottom: "2rem" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <h3 style={{
                      fontSize: "1.25rem",
                      fontWeight: "bold",
                      borderBottom: `2px solid ${localData.textColor || "#0a91b2"}`,
                      paddingBottom: "0.5rem",
                      marginBottom: "1rem",
                      color: localData.textColor || "#0a91b2"
                    }}>
                      Skills
                    </h3>
                    {editMode && (
                      <button 
                        onClick={() => handleEnhance("skills")}
                        style={{
                          backgroundColor: "#f59e0b",
                          color: "white",
                          padding: "0.25rem 0.5rem",
                          borderRadius: "0.25rem",
                          fontSize: "0.75rem",
                          cursor: "pointer",
                          border: "none"
                        }}
                      >
                        Enhance
                      </button>
                    )}
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                    {localData.skills?.map((skill, idx) => (
                      <div key={idx} style={{
                        backgroundColor: `${localData.textColor || "#0a91b2"}20`,
                        color: localData.textColor || "#0a91b2",
                        padding: "0.25rem 0.75rem",
                        borderRadius: "9999px",
                        fontSize: "0.75rem",
                        fontWeight: "500",
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem"
                      }}>
                        {editMode ? (
                          <>
                            <input
                              type="text"
                              value={skill}
                              onChange={(e) => {
                                const updatedSkills = [...localData.skills];
                                updatedSkills[idx] = e.target.value;
                                setLocalData({ ...localData, skills: updatedSkills });
                              }}
                              style={{
                                border: "none",
                                background: "transparent",
                                outline: "none",
                                fontSize: "0.75rem",
                                fontWeight: "500",
                                width: "auto",
                                minWidth: "50px"
                              }}
                            />
                            <button
                              onClick={() => removeItem("skills", idx)}
                              style={{
                                color: "#ef4444",
                                fontWeight: "bold",
                                cursor: "pointer",
                                border: "none",
                                background: "none",
                                fontSize: "0.75rem"
                              }}
                            >
                              ×
                            </button>
                          </>
                        ) : (
                          skill
                        )}
                      </div>
                    ))}
                    {editMode && (
                      <button
                        onClick={() => addItem("skills", "New Skill")}
                        style={{
                          color: "#2563eb",
                          fontWeight: "bold",
                          fontSize: "0.75rem",
                          cursor: "pointer",
                          border: "none",
                          background: "none"
                        }}
                      >
                        + Add Skill
                      </button>
                    )}
                  </div>
                </div>

                {/* Education Section */}
                <div style={{ marginBottom: "2rem" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <h3 style={{
                      fontSize: "1.25rem",
                      fontWeight: "bold",
                      borderBottom: `2px solid ${localData.textColor || "#0a91b2"}`,
                      paddingBottom: "0.5rem",
                      marginBottom: "1rem",
                      color: localData.textColor || "#0a91b2"
                    }}>
                      Education
                    </h3>
                    {editMode && (
                      <button 
                        onClick={() => handleEnhance("education")}
                        style={{
                          backgroundColor: "#f59e0b",
                          color: "white",
                          padding: "0.25rem 0.5rem",
                          borderRadius: "0.25rem",
                          fontSize: "0.75rem",
                          cursor: "pointer",
                          border: "none"
                        }}
                      >
                        Enhance
                      </button>
                    )}
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                    {localData.education?.map((edu, idx) => (
                      <div key={idx}>
                        {editMode ? (
                          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                            <input
                              type="text"
                              value={edu.degree}
                              onChange={(e) => handleObjectChange("education", idx, "degree", e.target.value)}
                              style={{
                                fontSize: "0.875rem",
                                fontWeight: "600",
                                border: "1px solid #d1d5db",
                                borderRadius: "0.25rem",
                                padding: "0.25rem 0.5rem",
                                outline: "none"
                              }}
                              placeholder="Degree"
                            />
                            <input
                              type="text"
                              value={edu.institution}
                              onChange={(e) => handleObjectChange("education", idx, "institution", e.target.value)}
                              style={{
                                fontSize: "0.75rem",
                                color: "#6b7280",
                                border: "1px solid #d1d5db",
                                borderRadius: "0.25rem",
                                padding: "0.25rem 0.5rem",
                                outline: "none"
                              }}
                              placeholder="Institution"
                            />
                            <input
                              type="text"
                              value={edu.year}
                              onChange={(e) => handleObjectChange("education", idx, "year", e.target.value)}
                              style={{
                                fontSize: "0.75rem",
                                color: "#6b7280",
                                border: "1px solid #d1d5db",
                                borderRadius: "0.25rem",
                                padding: "0.25rem 0.5rem",
                                outline: "none"
                              }}
                              placeholder="Year"
                            />
                            <button
                              onClick={() => removeItem("education", idx)}
                              style={{
                                color: "#ef4444",
                                fontWeight: "bold",
                                fontSize: "0.875rem",
                                cursor: "pointer",
                                border: "none",
                                background: "none",
                                alignSelf: "flex-start"
                              }}
                            >
                              Remove
                            </button>
                          </div>
                        ) : (
                          <>
                            <h4 style={{
                              fontSize: "0.875rem",
                              fontWeight: "600",
                              marginBottom: "0.25rem"
                            }}>
                              {edu.degree}
                            </h4>
                            <p style={{
                              fontSize: "0.75rem",
                              color: "#6b7280",
                              marginBottom: "0.25rem"
                            }}>
                              {edu.institution}
                            </p>
                            <p style={{
                              fontSize: "0.75rem",
                              color: "#6b7280"
                            }}>
                              {edu.year}
                            </p>
                          </>
                        )}
                      </div>
                    ))}
                    {editMode && (
                      <button
                        onClick={() => addItem("education", {
                          degree: "New Degree",
                          institution: "Institution",
                          year: "Year"
                        })}
                        style={{
                          color: "#2563eb",
                          fontWeight: "bold",
                          fontSize: "0.875rem",
                          cursor: "pointer",
                          border: "none",
                          background: "none",
                          alignSelf: "flex-start"
                        }}
                      >
                        + Add Education
                      </button>
                    )}
                  </div>
                </div>

                {/* Achievements Section */}
                <div style={{ marginBottom: "2rem" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <h3 style={{
                      fontSize: "1.25rem",
                      fontWeight: "bold",
                      borderBottom: `2px solid ${localData.textColor || "#0a91b2"}`,
                      paddingBottom: "0.5rem",
                      marginBottom: "1rem",
                      color: localData.textColor || "#0a91b2"
                    }}>
                      Achievements
                    </h3>
                    {editMode && (
                      <button 
                        onClick={() => handleEnhance("achievements")}
                        style={{
                          backgroundColor: "#f59e0b",
                          color: "white",
                          padding: "0.25rem 0.5rem",
                          borderRadius: "0.25rem",
                          fontSize: "0.75rem",
                          cursor: "pointer",
                          border: "none"
                        }}
                      >
                        Enhance
                      </button>
                    )}
                  </div>
                  <ul style={{ paddingLeft: "1rem", fontSize: "0.875rem", lineHeight: "1.5" }}>
                    {localData.achievements?.map((achievement, idx) => (
                      <li key={idx} style={{ marginBottom: "0.5rem" }}>
                        {editMode ? (
                          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                            <input
                              type="text"
                              value={achievement}
                              onChange={(e) => {
                                const updatedAchievements = [...localData.achievements];
                                updatedAchievements[idx] = e.target.value;
                                setLocalData({ ...localData, achievements: updatedAchievements });
                              }}
                              style={{
                                flex: 1,
                                fontSize: "0.875rem",
                                border: "1px solid #d1d5db",
                                borderRadius: "0.25rem",
                                padding: "0.25rem 0.5rem",
                                outline: "none"
                              }}
                              placeholder="Achievement"
                            />
                            <button
                              onClick={() => removeItem("achievements", idx)}
                              style={{
                                color: "#ef4444",
                                fontWeight: "bold",
                                cursor: "pointer",
                                border: "none",
                                background: "none"
                              }}
                            >
                              ×
                            </button>
                          </div>
                        ) : (
                          achievement
                        )}
                      </li>
                    ))}
                    {editMode && (
                      <li>
                        <button
                          onClick={() => addItem("achievements", "New Achievement")}
                          style={{
                            color: "#2563eb",
                            fontWeight: "bold",
                            fontSize: "0.875rem",
                            cursor: "pointer",
                            border: "none",
                            background: "none"
                          }}
                        >
                          + Add Achievement
                        </button>
                      </li>
                    )}
                  </ul>
                </div>

                {/* Certifications Section */}
                <div style={{ marginBottom: "2rem" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <h3 style={{
                      fontSize: "1.25rem",
                      fontWeight: "bold",
                      borderBottom: `2px solid ${localData.textColor || "#0a91b2"}`,
                      paddingBottom: "0.5rem",
                      marginBottom: "1rem",
                      color: localData.textColor || "#0a91b2"
                    }}>
                      Certifications
                    </h3>
                    {editMode && (
                      <button 
                        onClick={() => handleEnhance("certifications")}
                        style={{
                          backgroundColor: "#f59e0b",
                          color: "white",
                          padding: "0.25rem 0.5rem",
                          borderRadius: "0.25rem",
                          fontSize: "0.75rem",
                          cursor: "pointer",
                          border: "none"
                        }}
                      >
                        Enhance
                      </button>
                    )}
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                    {localData.certifications?.map((cert, idx) => (
                      <div key={idx} style={{
                        padding: "0.75rem",
                        backgroundColor: "#f8f9fa",
                        borderRadius: "0.5rem",
                        border: `1px solid ${localData.textColor || "#0a91b2"}20`
                      }}>
                        {editMode ? (
                          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                            <input
                              type="text"
                              value={cert.name}
                              onChange={(e) => handleObjectChange("certifications", idx, "name", e.target.value)}
                              style={{
                                fontSize: "0.875rem",
                                fontWeight: "600",
                                border: "1px solid #d1d5db",
                                borderRadius: "0.25rem",
                                padding: "0.25rem 0.5rem",
                                outline: "none"
                              }}
                              placeholder="Certification Name"
                            />
                            <input
                              type="text"
                              value={cert.organization}
                              onChange={(e) => handleObjectChange("certifications", idx, "organization", e.target.value)}
                              style={{
                                fontSize: "0.75rem",
                                color: "#6b7280",
                                border: "1px solid #d1d5db",
                                borderRadius: "0.25rem",
                                padding: "0.25rem 0.5rem",
                                outline: "none"
                              }}
                              placeholder="Issuing Organization"
                            />
                            <input
                              type="text"
                              value={cert.year}
                              onChange={(e) => handleObjectChange("certifications", idx, "year", e.target.value)}
                              style={{
                                fontSize: "0.75rem",
                                color: "#6b7280",
                                border: "1px solid #d1d5db",
                                borderRadius: "0.25rem",
                                padding: "0.25rem 0.5rem",
                                outline: "none"
                              }}
                              placeholder="Year Obtained"
                            />
                            <input
                              type="text"
                              value={cert.credentialId || ""}
                              onChange={(e) => handleObjectChange("certifications", idx, "credentialId", e.target.value)}
                              style={{
                                fontSize: "0.75rem",
                                color: "#6b7280",
                                border: "1px solid #d1d5db",
                                borderRadius: "0.25rem",
                                padding: "0.25rem 0.5rem",
                                outline: "none"
                              }}
                              placeholder="Credential ID (optional)"
                            />
                            <button
                              onClick={() => removeItem("certifications", idx)}
                              style={{
                                color: "#ef4444",
                                fontWeight: "bold",
                                fontSize: "0.875rem",
                                cursor: "pointer",
                                border: "none",
                                background: "none",
                                alignSelf: "flex-start"
                              }}
                            >
                              Remove
                            </button>
                          </div>
                        ) : (
                          <>
                            <h4 style={{
                              fontSize: "0.875rem",
                              fontWeight: "600",
                              marginBottom: "0.25rem",
                              color: "#374151"
                            }}>
                              {cert.name}
                            </h4>
                            <p style={{
                              fontSize: "0.75rem",
                              color: localData.textColor || "#0a91b2",
                              fontWeight: "500",
                              marginBottom: "0.25rem"
                            }}>
                              {cert.organization}
                            </p>
                            <p style={{
                              fontSize: "0.75rem",
                              color: "#6b7280",
                              marginBottom: cert.credentialId ? "0.25rem" : "0"
                            }}>
                              {cert.year}
                            </p>
                            {cert.credentialId && (
                              <p style={{
                                fontSize: "0.75rem",
                                color: "#6b7280",
                                fontStyle: "italic"
                              }}>
                                Credential ID: {cert.credentialId}
                              </p>
                            )}
                          </>
                        )}
                      </div>
                    ))}
                    {editMode && (
                      <button
                        onClick={() => addItem("certifications", {
                          name: "Certification Name",
                          organization: "Issuing Organization",
                          year: "Year",
                          credentialId: ""
                        })}
                        style={{
                          color: "#2563eb",
                          fontWeight: "bold",
                          fontSize: "0.875rem",
                          cursor: "pointer",
                          border: "none",
                          background: "none",
                          alignSelf: "flex-start"
                        }}
                      >
                        + Add Certification
                      </button>
                    )}
                  </div>
                </div>

                {/* Interests Section */}
                <div style={{ marginBottom: "2rem" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <h3 style={{
                      fontSize: "1.25rem",
                      fontWeight: "bold",
                      borderBottom: `2px solid ${localData.textColor || "#0a91b2"}`,
                      paddingBottom: "0.5rem",
                      marginBottom: "1rem",
                      color: localData.textColor || "#0a91b2"
                    }}>
                      Interests
                    </h3>
                    {editMode && (
                      <button 
                        onClick={() => handleEnhance("interests")}
                        style={{
                          backgroundColor: "#f59e0b",
                          color: "white",
                          padding: "0.25rem 0.5rem",
                          borderRadius: "0.25rem",
                          fontSize: "0.75rem",
                          cursor: "pointer",
                          border: "none"
                        }}
                      >
                        Enhance
                      </button>
                    )}
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                    {localData.interests?.map((interest, idx) => (
                      <div key={idx} style={{
                        backgroundColor: "#f3f4f6",
                        color: "#374151",
                        padding: "0.5rem 0.75rem",
                        borderRadius: "0.5rem",
                        fontSize: "0.875rem",
                        fontWeight: "500",
                        border: `1px solid ${localData.textColor || "#0a91b2"}30`,
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem"
                      }}>
                        {editMode ? (
                          <>
                            <input
                              type="text"
                              value={interest}
                              onChange={(e) => {
                                const updatedInterests = [...(localData.interests || [])];
                                updatedInterests[idx] = e.target.value;
                                setLocalData({ ...localData, interests: updatedInterests });
                              }}
                              style={{
                                border: "none",
                                background: "transparent",
                                outline: "none",
                                fontSize: "0.875rem",
                                fontWeight: "500",
                                width: "auto",
                                minWidth: "60px",
                                color: "#374151"
                              }}
                            />
                            <button
                              onClick={() => removeItem("interests", idx)}
                              style={{
                                color: "#ef4444",
                                fontWeight: "bold",
                                cursor: "pointer",
                                border: "none",
                                background: "none",
                                fontSize: "0.875rem"
                              }}
                            >
                              ×
                            </button>
                          </>
                        ) : (
                          <>
                            <span style={{ fontSize: "1rem" }}>
                              {(() => {
                                // Simple interest-to-emoji mapping
                                const interestEmojis = {
                                  'reading': '📚', 'books': '📚', 'literature': '📚',
                                  'music': '🎵', 'singing': '🎤', 'guitar': '🎸', 'piano': '🎹',
                                  'sports': '⚽', 'football': '⚽', 'basketball': '🏀', 'tennis': '🎾',
                                  'swimming': '🏊', 'running': '🏃', 'cycling': '🚴', 'hiking': '🥾',
                                  'travel': '✈️', 'traveling': '✈️', 'photography': '📷',
                                  'cooking': '👨‍🍳', 'baking': '🧁', 'gardening': '🌱',
                                  'art': '🎨', 'painting': '🎨', 'drawing': '✏️',
                                  'technology': '💻', 'coding': '💻', 'gaming': '🎮',
                                  'movies': '🎬', 'cinema': '🎬', 'dancing': '💃',
                                  'yoga': '🧘', 'meditation': '🧘‍♀️', 'fitness': '💪',
                                  'chess': '♟️', 'writing': '✍️', 'blogging': '📝'
                                };
                                const lowerInterest = interest.toLowerCase();
                                for (const [key, emoji] of Object.entries(interestEmojis)) {
                                  if (lowerInterest.includes(key)) {
                                    return emoji;
                                  }
                                }
                                return '🌟'; // Default emoji
                              })()}
                            </span>
                            {interest}
                          </>
                        )}
                      </div>
                    ))}
                    {editMode && (
                      <button
                        onClick={() => addItem("interests", "New Interest")}
                        style={{
                          color: "#2563eb",
                          fontWeight: "bold",
                          fontSize: "0.875rem",
                          cursor: "pointer",
                          border: "1px dashed #2563eb",
                          background: "none",
                          padding: "0.5rem 0.75rem",
                          borderRadius: "0.5rem"
                        }}
                      >
                        + Add Interest
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div style={{ width: "65%" }}>
                {/* Experience Section */}
                <div style={{ marginBottom: "2rem" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <h3 style={{
                      fontSize: "1.25rem",
                      fontWeight: "bold",
                      borderBottom: `2px solid ${localData.textColor || "#0a91b2"}`,
                      paddingBottom: "0.5rem",
                      marginBottom: "1rem",
                      color: localData.textColor || "#0a91b2"
                    }}>
                      Experience
                    </h3>
                    {editMode && (
                      <button 
                        onClick={() => handleEnhance("experience")}
                        style={{
                          backgroundColor: "#f59e0b",
                          color: "white",
                          padding: "0.25rem 0.5rem",
                          borderRadius: "0.25rem",
                          fontSize: "0.75rem",
                          cursor: "pointer",
                          border: "none"
                        }}
                      >
                        Enhance
                      </button>
                    )}
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                    {localData.experience?.map((exp, idx) => (
                      <div key={idx}>
                        {editMode ? (
                          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                            <input
                              type="text"
                              value={exp.title}
                              onChange={(e) => handleObjectChange("experience", idx, "title", e.target.value)}
                              style={{
                                fontSize: "1rem",
                                fontWeight: "600",
                                border: "1px solid #d1d5db",
                                borderRadius: "0.25rem",
                                padding: "0.5rem",
                                outline: "none"
                              }}
                              placeholder="Job Title"
                            />
                            <input
                              type="text"
                              value={exp.company}
                              onChange={(e) => handleObjectChange("experience", idx, "company", e.target.value)}
                              style={{
                                fontSize: "0.875rem",
                                color: localData.textColor || "#0a91b2",
                                fontWeight: "500",
                                border: "1px solid #d1d5db",
                                borderRadius: "0.25rem",
                                padding: "0.5rem",
                                outline: "none"
                              }}
                              placeholder="Company"
                            />
                            <input
                              type="text"
                              value={exp.duration}
                              onChange={(e) => handleObjectChange("experience", idx, "duration", e.target.value)}
                              style={{
                                fontSize: "0.75rem",
                                color: "#6b7280",
                                border: "1px solid #d1d5db",
                                borderRadius: "0.25rem",
                                padding: "0.5rem",
                                outline: "none"
                              }}
                              placeholder="Duration"
                            />
                            <textarea
                              value={exp.description}
                              onChange={(e) => handleObjectChange("experience", idx, "description", e.target.value)}
                              style={{
                                fontSize: "0.875rem",
                                lineHeight: "1.5",
                                minHeight: "4rem",
                                border: "1px solid #d1d5db",
                                borderRadius: "0.25rem",
                                padding: "0.5rem",
                                resize: "vertical",
                                outline: "none"
                              }}
                              placeholder="Job description and responsibilities"
                            />
                            <button
                              onClick={() => removeItem("experience", idx)}
                              style={{
                                color: "#ef4444",
                                fontWeight: "bold",
                                fontSize: "0.875rem",
                                cursor: "pointer",
                                border: "none",
                                background: "none",
                                alignSelf: "flex-start"
                              }}
                            >
                              Remove Experience
                            </button>
                          </div>
                        ) : (
                          <>
                            <h4 style={{
                              fontSize: "1rem",
                              fontWeight: "600",
                              marginBottom: "0.25rem"
                            }}>
                              {exp.title}
                            </h4>
                            <p style={{
                              fontSize: "0.875rem",
                              color: localData.textColor || "#0a91b2",
                              fontWeight: "500",
                              marginBottom: "0.25rem"
                            }}>
                              {exp.company}
                            </p>
                            <p style={{
                              fontSize: "0.75rem",
                              color: "#6b7280",
                              marginBottom: "0.5rem"
                            }}>
                              {exp.duration}
                            </p>
                            <p style={{
                              fontSize: "0.875rem",
                              lineHeight: "1.5",
                              textAlign: "justify"
                            }}>
                              {exp.description}
                            </p>
                          </>
                        )}
                      </div>
                    ))}
                    {editMode && (
                      <button
                        onClick={() => addItem("experience", {
                          title: "Job Title",
                          company: "Company Name",
                          duration: "Duration",
                          description: "Job description"
                        })}
                        style={{
                          color: "#2563eb",
                          fontWeight: "bold",
                          fontSize: "0.875rem",
                          cursor: "pointer",
                          border: "none",
                          background: "none",
                          alignSelf: "flex-start"
                        }}
                      >
                        + Add Experience
                      </button>
                    )}
                  </div>
                </div>

                {/* Languages Section - Moved here after Experience */}
                <div style={{ marginBottom: "2rem" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <h3 
                      style={{
                        fontSize: "1.25rem",
                        fontWeight: "bold",
                        borderBottom: `2px solid ${localData.textColor || "#0a91b2"}`,
                        paddingBottom: "0.5rem",
                        marginBottom: "1rem",
                        color: localData.textColor || "#0a91b2"
                      }}
                    >
                      Languages
                    </h3>
                    {editMode && (
                      <button 
                        onClick={() => handleEnhance("languages")}
                        style={{
                          backgroundColor: "#f59e0b",
                          color: "white",
                          padding: "0.25rem 0.5rem",
                          borderRadius: "0.25rem",
                          fontSize: "0.75rem",
                          cursor: "pointer",
                          border: "none"
                        }}
                      >
                        Enhance
                      </button>
                    )}
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                    {localData.languages?.map((lang, idx) => (
                      <div key={idx} style={{ 
                        display: "flex", 
                        justifyContent: "space-between", 
                        alignItems: "center",
                        padding: "0.75rem",
                        backgroundColor: "#f8f9fa",
                        borderRadius: "0.5rem",
                        border: `1px solid ${localData.textColor || "#0a91b2"}20`
                      }}>
                        {editMode ? (
                          <>
                            <div style={{ display: "flex", gap: "0.5rem", flex: 1 }}>
                              <input
                                type="text"
                                value={lang.language}
                                onChange={(e) => handleObjectChange("languages", idx, "language", e.target.value)}
                                style={{
                                  fontSize: "0.875rem",
                                  fontWeight: "600",
                                  flex: 1,
                                  border: "1px solid #d1d5db",
                                  borderRadius: "0.25rem",
                                  padding: "0.25rem 0.5rem",
                                  outline: "none"
                                }}
                                placeholder="Language"
                              />
                              <select
                                value={lang.proficiency}
                                onChange={(e) => handleObjectChange("languages", idx, "proficiency", e.target.value)}
                                style={{
                                  fontSize: "0.875rem",
                                  border: "1px solid #d1d5db",
                                  borderRadius: "0.25rem",
                                  padding: "0.25rem 0.5rem",
                                  outline: "none",
                                  backgroundColor: "white"
                                }}
                              >
                                <option value="Native">Native</option>
                                <option value="Fluent">Fluent</option>
                                <option value="Advanced">Advanced</option>
                                <option value="Intermediate">Intermediate</option>
                                <option value="Basic">Basic</option>
                              </select>
                            </div>
                            <button
                              onClick={() => removeItem("languages", idx)}
                              style={{
                                color: "#ef4444",
                                fontWeight: "bold",
                                fontSize: "1rem",
                                cursor: "pointer",
                                border: "none",
                                background: "none",
                                marginLeft: "0.5rem"
                              }}
                            >
                              ×
                            </button>
                          </>
                        ) : (
                          <>
                            <span style={{ 
                              fontSize: "0.875rem", 
                              fontWeight: "600",
                              color: "#374151"
                            }}>
                              {lang.language}
                            </span>
                            <span style={{
                              fontSize: "0.75rem",
                              backgroundColor: (() => {
                                switch(lang.proficiency) {
                                  case 'Native': return '#10b981';
                                  case 'Fluent': return '#3b82f6';
                                  case 'Advanced': return '#8b5cf6';
                                  case 'Intermediate': return '#f59e0b';
                                  case 'Basic': return '#ef4444';
                                  default: return '#6b7280';
                                }
                              })(),
                              color: "white",
                              padding: "0.25rem 0.75rem",
                              borderRadius: "9999px",
                              fontWeight: "500"
                            }}>
                              {lang.proficiency}
                            </span>
                          </>
                        )}
                      </div>
                    ))}
                    {editMode && (
                      <button
                        onClick={() => addItem("languages", {
                          language: "New Language",
                          proficiency: "Intermediate"
                        })}
                        style={{
                          color: "#2563eb",
                          fontWeight: "bold",
                          fontSize: "0.875rem",
                          marginTop: "0.5rem",
                          cursor: "pointer",
                          border: "none",
                          background: "none"
                        }}
                      >
                        + Add Language
                      </button>
                    )}
                  </div>
                </div>

                {/* Projects Section */}
                <div style={{ marginBottom: "2rem" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <h3 style={{
                      fontSize: "1.25rem",
                      fontWeight: "bold",
                      borderBottom: `2px solid ${localData.textColor || "#0a91b2"}`,
                      paddingBottom: "0.5rem",
                      marginBottom: "1rem",
                      color: localData.textColor || "#0a91b2"
                    }}>
                      Projects
                    </h3>
                    {editMode && (
                      <button 
                        onClick={() => handleEnhance("projects")}
                        style={{
                          backgroundColor: "#f59e0b",
                          color: "white",
                          padding: "0.25rem 0.5rem",
                          borderRadius: "0.25rem",
                          fontSize: "0.75rem",
                          cursor: "pointer",
                          border: "none"
                        }}
                      >
                        Enhance
                      </button>
                    )}
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                    {localData.projects?.map((project, idx) => (
                      <div key={idx}>
                        {editMode ? (
                          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                            <input
                              type="text"
                              value={project.name}
                              onChange={(e) => handleObjectChange("projects", idx, "name", e.target.value)}
                              style={{
                                fontSize: "1rem",
                                fontWeight: "600",
                                border: "1px solid #d1d5db",
                                borderRadius: "0.25rem",
                                padding: "0.5rem",
                                outline: "none"
                              }}
                              placeholder="Project Name"
                            />
                            <input
                              type="text"
                              value={project.technologies}
                              onChange={(e) => handleObjectChange("projects", idx, "technologies", e.target.value)}
                              style={{
                                fontSize: "0.875rem",
                                color: localData.textColor || "#0a91b2",
                                fontWeight: "500",
                                border: "1px solid #d1d5db",
                                borderRadius: "0.25rem",
                                padding: "0.5rem",
                                outline: "none"
                              }}
                              placeholder="Technologies Used"
                            />
                            <textarea
                              value={project.description}
                              onChange={(e) => handleObjectChange("projects", idx, "description", e.target.value)}
                              style={{
                                fontSize: "0.875rem",
                                lineHeight: "1.5",
                                minHeight: "4rem",
                                border: "1px solid #d1d5db",
                                borderRadius: "0.25rem",
                                padding: "0.5rem",
                                resize: "vertical",
                                outline: "none"
                              }}
                              placeholder="Project description"
                            />
                            <button
                              onClick={() => removeItem("projects", idx)}
                              style={{
                                color: "#ef4444",
                                fontWeight: "bold",
                                fontSize: "0.875rem",
                                cursor: "pointer",
                                border: "none",
                                background: "none",
                                alignSelf: "flex-start"
                              }}
                            >
                              Remove Project
                            </button>
                          </div>
                        ) : (
                          <>
                            <h4 style={{
                              fontSize: "1rem",
                              fontWeight: "600",
                              marginBottom: "0.25rem"
                            }}>
                              {project.name}
                            </h4>
                            <p style={{
                              fontSize: "0.875rem",
                              color: localData.textColor || "#0a91b2",
                              fontWeight: "500",
                              marginBottom: "0.5rem"
                            }}>
                              {project.technologies}
                            </p>
                            <p style={{
                              fontSize: "0.875rem",
                              lineHeight: "1.5",
                              textAlign: "justify"
                            }}>
                              {project.description}
                            </p>
                          </>
                        )}
                      </div>
                    ))}
                    {editMode && (
                      <button
                        onClick={() => addItem("projects", {
                          name: "Project Name",
                          technologies: "Technologies",
                          description: "Project description"
                        })}
                        style={{
                          color: "#2563eb",
                          fontWeight: "bold",
                          fontSize: "0.875rem",
                          cursor: "pointer",
                          border: "none",
                          background: "none",
                          alignSelf: "flex-start"
                        }}
                      >
                        + Add Project
                      </button>
                    )}
                  </div>
                </div>

                {/* References Section */}
                <div style={{ marginBottom: "2rem" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <h3 style={{
                      fontSize: "1.25rem",
                      fontWeight: "bold",
                      borderBottom: `2px solid ${localData.textColor || "#0a91b2"}`,
                      paddingBottom: "0.5rem",
                      marginBottom: "1rem",
                      color: localData.textColor || "#0a91b2"
                    }}>
                      References
                    </h3>
                    {editMode && (
                      <button 
                        onClick={() => handleEnhance("references")}
                        style={{
                          backgroundColor: "#f59e0b",
                          color: "white",
                          padding: "0.25rem 0.5rem",
                          borderRadius: "0.25rem",
                          fontSize: "0.75rem",
                          cursor: "pointer",
                          border: "none"
                        }}
                      >
                        Enhance
                      </button>
                    )}
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                    {localData.references?.map((ref, idx) => (
                      <div key={idx} style={{
                        padding: "1rem",
                        backgroundColor: "#f8f9fa",
                        borderRadius: "0.5rem",
                        border: `1px solid ${localData.textColor || "#0a91b2"}20`
                      }}>
                        {editMode ? (
                          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                            <input
                              type="text"
                              value={ref.name}
                              onChange={(e) => handleObjectChange("references", idx, "name", e.target.value)}
                              style={{
                                fontSize: "0.875rem",
                                fontWeight: "600",
                                border: "1px solid #d1d5db",
                                borderRadius: "0.25rem",
                                padding: "0.25rem 0.5rem",
                                outline: "none"
                              }}
                              placeholder="Reference Name"
                            />
                            <input
                              type="text"
                              value={ref.title}
                              onChange={(e) => handleObjectChange("references", idx, "title", e.target.value)}
                              style={{
                                fontSize: "0.75rem",
                                color: "#6b7280",
                                border: "1px solid #d1d5db",
                                borderRadius: "0.25rem",
                                padding: "0.25rem 0.5rem",
                                outline: "none"
                              }}
                              placeholder="Title/Position"
                            />
                            <input
                              type="email"
                              value={ref.contact}
                              onChange={(e) => handleObjectChange("references", idx, "contact", e.target.value)}
                              style={{
                                fontSize: "0.75rem",
                                color: "#6b7280",
                                border: "1px solid #d1d5db",
                                borderRadius: "0.25rem",
                                padding: "0.25rem 0.5rem",
                                outline: "none"
                              }}
                              placeholder="Contact Information"
                            />
                            <button
                              onClick={() => removeItem("references", idx)}
                              style={{
                                color: "#ef4444",
                                fontWeight: "bold",
                                fontSize: "0.875rem",
                                cursor: "pointer",
                                border: "none",
                                background: "none",
                                alignSelf: "flex-start"
                              }}
                            >
                              Remove Reference
                            </button>
                          </div>
                        ) : (
                          <>
                            <h4 style={{
                              fontSize: "0.875rem",
                              fontWeight: "600",
                              marginBottom: "0.25rem"
                            }}>
                              {ref.name}
                            </h4>
                            <p style={{
                              fontSize: "0.75rem",
                              color: "#6b7280",
                              marginBottom: "0.25rem"
                            }}>
                              {ref.title}
                            </p>
                            <p style={{
                              fontSize: "0.75rem",
                              color: "#6b7280"
                            }}>
                              {ref.contact}
                            </p>
                          </>
                        )}
                      </div>
                    ))}
                    {editMode && (
                      <button
                        onClick={() => addItem("references", {
                          name: "Reference Name",
                          title: "Title/Position",
                          contact: "Contact Information"
                        })}
                        style={{
                          color: "#2563eb",
                          fontWeight: "bold",
                          fontSize: "0.875rem",
                          cursor: "pointer",
                          border: "none",
                          background: "none"
                        }}
                      >
                        + Add Reference
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Edit/Save Buttons */}
          <div style={{
            display: "flex",
            gap: "1rem",
            marginTop: "2rem",
            alignItems: "center"
          }}>
            {editMode ? (
              <>
                <button
                  onClick={typeof updateResumeData === 'function' ? handleSave : handleSaveLocal}
                  disabled={saveStatus === 'Saving...'}
                  style={{
                    backgroundColor: saveStatus === 'Saving...' ? "#9ca3af" : "#10b981",
                    color: "white",
                    padding: "0.75rem 1.5rem",
                    borderRadius: "0.5rem",
                    border: "none",
                    fontSize: "1rem",
                    fontWeight: "600",
                    cursor: saveStatus === 'Saving...' ? "not-allowed" : "pointer"
                  }}
                >
                  {saveStatus === 'Saving...' ? 'Saving...' : 'Save Changes'}
                </button>
                <button
                  onClick={handleCancel}
                  disabled={saveStatus === 'Saving...'}
                  style={{
                    backgroundColor: "#6b7280",
                    color: "white",
                    padding: "0.75rem 1.5rem",
                    borderRadius: "0.5rem",
                    border: "none",
                    fontSize: "1rem",
                    fontWeight: "600",
                    cursor: saveStatus === 'Saving...' ? "not-allowed" : "pointer"
                  }}
                >
                  Cancel
                </button>
                {saveStatus && (
                  <span style={{
                    fontSize: "0.875rem",
                    color: saveStatus.includes('Error') ? "#ef4444" : "#10b981",
                    fontWeight: "500"
                  }}>
                    {saveStatus}
                  </span>
                )}
                {typeof updateResumeData !== 'function' && (
                  <small style={{
                    fontSize: "0.75rem",
                    color: "#f59e0b",
                    fontStyle: "italic"
                  }}>
                    Note: Using local storage (context not available)
                  </small>
                )}
              </>
            ) : (
              <button
                onClick={() => setEditMode(true)}
                style={{
                  backgroundColor: "#2563eb",
                  color: "white",
                  padding: "0.75rem 1.5rem",
                  borderRadius: "0.5rem",
                  border: "none",
                  fontSize: "1rem",
                  fontWeight: "600",
                  cursor: "pointer"
                }}
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

export default Template26;