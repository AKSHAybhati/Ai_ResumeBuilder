import React, { useState, useRef, useEffect } from "react";
import Sidebar from "../Sidebar/Sidebar";
import Navbar from "../Navbar/Navbar";
import { useResume } from "../../context/ResumeContext";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPhone, faEnvelope, faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';
import { faLinkedin } from "@fortawesome/free-brands-svg-icons";
import defaultProfile from "../../assets/images/profile.jpg";

const Template1 = () => {
  const resumeRef = useRef(null);
  const { resumeData, setResumeData } = useResume();
  const [editMode, setEditMode] = useState(false);
  const [localData, setLocalData] = useState(resumeData);
  const [loading, setLoading] = useState(false);
  const [headingColor, setHeadingColor] = useState("#2563eb");
  const colorInputRef = useRef(null);
  const photoInputRef = useRef(null);

  useEffect(() => {
    setLocalData(resumeData);
  }, [resumeData]);

  // Watch for changes in resumeData to sync with AI enhancements
  useEffect(() => {
    if (!editMode) {
      setLocalData(resumeData);
    }
  }, [resumeData, editMode]);

  const [visibleSections, setVisibleSections] = useState({
    summary: true,
    experience: true,
    education: true,
    achievements: true,
    skills: true,
    courses: true,
    projects: true,
  });

  const handleFieldChange = (field, value) => {
    const updatedData = { ...localData, [field]: value };
    setLocalData(updatedData);
    // Auto-save to localStorage for universal save system
    localStorage.setItem('resumeData', JSON.stringify(updatedData));
  };

  const handleArrayFieldChange = (section, index, key, value) => {
    const updated = [...localData[section]];
    updated[index] = { ...updated[index], [key]: value };
    const updatedData = { ...localData, [section]: updated };
    setLocalData(updatedData);
    // Auto-save to localStorage for universal save system
    localStorage.setItem('resumeData', JSON.stringify(updatedData));
  };

  const handleSkillsChange = (value) => {
    const skillsArray = value.split(",").map(skill => skill.trim()).filter(skill => skill);
    setLocalData({ ...localData, skills: skillsArray });
  };

  const addNewEntry = (section) => {
    const newEntry = section === "experience" ? {
      title: 'Your Title',
      companyName: 'Company Name',
      date: 'Date',
      companyLocation: 'Company Location',
      description: 'Company Description',
      accomplishment: 'Your accomplishment'
    } : section === "education" ? {
      degree: 'Degree and Field of Study',
      institution: 'School or University',
      duration: 'Date Period',
      grade: "GPA:8.5"
    } : section === "courses" ? {
      title: 'Course Name',
      description: 'Course Description'
    } : section === "projects" ? {
      name: 'Project Name',
      duration: 'Date period',
      description: 'Project Summary',
      technologies: [],
      link: '',
      github: ''
    } : section === "achievements" ? {
      keyAchievements: 'Achievement Title',
      describe: 'Describe the achievement'
    } : null;

    if (newEntry) {
      setLocalData(prev => ({
        ...prev,
        [section]: [...(prev[section] || []), newEntry]
      }));
    }
  };

  const removeEntry = (section, index) => {
    setLocalData(prev => ({
      ...prev,
      [section]: prev[section].filter((_, i) => i !== index)
    }));
  };

  const removeBlock = (block) => {
    setVisibleSections({ ...visibleSections, [block]: false });
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
    // This will be handled by the Sidebar component
    // The Sidebar already has the enhancement logic built-in
  };

  const handleOpenColorPicker = () => {
    if (colorInputRef && colorInputRef.current) {
      colorInputRef.current.click();
    }
  };

  const handleAddPoint = (section) => {
    setLocalData((prev) => {
      const existingPoints = prev?.additionalPoints?.[section] || [];
      const updatedAdditionalPoints = {
        ...(prev.additionalPoints || {}),
        [section]: [...existingPoints, ""]
      };
      return { ...prev, additionalPoints: updatedAdditionalPoints };
    });
  };

  const handleUpdatePoint = (section, index, value) => {
    setLocalData((prev) => {
      const currentPoints = prev?.additionalPoints?.[section] || [];
      const updatedPoints = [...currentPoints];
      updatedPoints[index] = value;
      const updatedAdditionalPoints = {
        ...(prev.additionalPoints || {}),
        [section]: updatedPoints
      };
      return { ...prev, additionalPoints: updatedAdditionalPoints };
    });
  };

  const handleOpenPhotoPicker = () => {
    if (photoInputRef && photoInputRef.current) {
      photoInputRef.current.click();
    }
  };

  const handlePhotoChange = (event) => {
    const file = event.target.files && event.target.files[0];
    if (!file) return;
    const objectUrl = URL.createObjectURL(file);
    setLocalData((prev) => ({ ...prev, photo: objectUrl }));
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f3f4f6" }}>
      <Navbar />
      
      {/* Loading Overlay */}
      {loading && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 50
        }}>
          <div style={{
            backgroundColor: "white",
            padding: "2rem",
            borderRadius: "0.5rem",
            boxShadow: "0 10px 25px rgba(0,0,0,0.1)"
          }}>
            <div style={{
              width: "4rem",
              height: "4rem",
              border: "2px solid #f3f3f3",
              borderTop: "2px solid #3b82f6",
              borderRadius: "50%",
              animation: "spin 1s linear infinite",
              margin: "0 auto 1rem"
            }}></div>
            <p style={{
              fontSize: "1.125rem",
              fontWeight: "600",
              color: "#374151"
            }}>
              AI is enhancing your resume...
            </p>
          </div>
        </div>
      )}

      <div style={{ display: "flex" }}>
        <Sidebar onEnhance={handleEnhance} resumeRef={resumeRef} />

        <div style={{ 
          flexGrow: 1, 
          padding: "2.5rem", 
          display: "flex", 
          flexDirection: "column", 
          alignItems: "center",
          marginLeft: "1.5rem"
        }}>
          <div
            ref={resumeRef}
            style={{
              backgroundColor: "#fff",
              color: "#111827",
              maxWidth: "64rem",
              width: "100%",
              padding: "1.25rem",
              boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
              borderRadius: "0.5rem",
              fontSize: "0.75rem",
              position: "relative"
            }}
          >
            {/* Profile Photo (top-right of header) */}
            <div style={{ position: "absolute", top: "1rem", right: "1.25rem", display: "flex", flexDirection: "column", alignItems: "center", gap: "0.375rem" }}>
              <img
                src={localData?.photo || resumeData?.photo || defaultProfile}
                alt="Profile"
                style={{ width: "6rem", height: "6rem", borderRadius: "9999px", objectFit: "cover", border: `2px solid ${headingColor}` }}
              />
              <button
                onClick={handleOpenPhotoPicker}
                style={{
                  backgroundColor: "#2563eb",
                  color: "white",
                  cursor: "pointer",
                  fontWeight: "600",
                  padding: "0.25rem 0.5rem",
                  borderRadius: "0.375rem",
                  boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                  transition: "all 0.2s ease-in-out",
                  border: "none",
                  fontSize: "0.7rem"
                }}
                onMouseOver={(e) => e.target.style.backgroundColor = "#1d4ed8"}
                onMouseOut={(e) => e.target.style.backgroundColor = "#2563eb"}
              >
                Browse Photo
              </button>
              <input
                ref={photoInputRef}
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
                style={{ display: "none" }}
                aria-label="Upload profile photo"
              />
            </div>
            {/* First Block - Header */}
            <div style={{ fontSize: "1rem", textAlign: "left", padding: "0.125rem" }}>
              {/* Name */}
              <div style={{ fontSize: "2.125rem", fontWeight: "bolder" }}>
                {editMode ? (
                  <input
                    type="text"
                    value={localData.name}
                    onChange={(e) => handleFieldChange("name", e.target.value)}
                    style={{ 
                      fontSize: "2.125rem", 
                      fontWeight: "bolder",
                      width: "100%",
                      border: "none",
                      outline: "none",
                      backgroundColor: "#e7f1ff"
                    }}
                  />
                ) : (
                  <h2 style={{ fontSize: "1.75rem", fontWeight: "bolder" }}>{resumeData.name}</h2>
                )}
              </div>

              {/* Role */}
              <div style={{ color: "rgb(122, 122, 243)", fontSize: "1.25rem" }}>
                {editMode ? (
                  <input
                    type="text"
                    value={localData.role}
                    onChange={(e) => handleFieldChange("role", e.target.value)}
                    style={{ 
                      color: "rgb(122, 122, 243)",
                      fontSize: "1.25rem",
                      width: "100%",
                      border: "none",
                      outline: "none",
                      backgroundColor: "#e7f1ff"
                    }}
                  />
                ) : (
                  resumeData.role
                )}
              </div>

              {/* Contact Details */}
              <div style={{ 
                display: "flex", 
                justifyContent: "left", 
                fontSize: "1rem", 
                margin: "0.625rem", 
                gap: "0.75rem",
                flexWrap: "wrap"
              }}>
                {/* Phone */}
                {(resumeData?.phone || editMode) && (
                  <div style={{ display: "flex", alignItems: "center", gap: "0.3125rem" }}>
                    <FontAwesomeIcon icon={faPhone} />
                    {editMode ? (
                      <input
                        type="text"
                        value={localData.phone}
                        onChange={(e) => handleFieldChange("phone", e.target.value)}
                        style={{ 
                          border: "none",
                          outline: "none",
                          backgroundColor: "#e7f1ff"
                        }}
                      />
                    ) : (
                      <span>{resumeData.phone}</span>
                    )}
                    {" | "}
                  </div>
                )}

                {/* Email */}
                {(resumeData?.email || editMode) && (
                  <div style={{ display: "flex", alignItems: "center", gap: "0.3125rem" }}>
                    <FontAwesomeIcon icon={faEnvelope} />
                    {editMode ? (
                      <input
                        type="email"
                        value={localData.email}
                        onChange={(e) => handleFieldChange("email", e.target.value)}
                        style={{ 
                          border: "none",
                          outline: "none",
                          backgroundColor: "#e7f1ff"
                        }}
                      />
                    ) : (
                      <span>{resumeData.email}</span>
                    )}
                    {" | "}
                  </div>
                )}

                {/* LinkedIn */}
                {(resumeData?.linkedin || editMode) && (
                  <div style={{ display: "flex", alignItems: "center", gap: "0.3125rem" }}>
                    <FontAwesomeIcon icon={faLinkedin} />
                    {editMode ? (
                      <input
                        type="text"
                        value={localData.linkedin}
                        onChange={(e) => handleFieldChange("linkedin", e.target.value)}
                        style={{ 
                          border: "none",
                          outline: "none",
                          backgroundColor: "#e7f1ff"
                        }}
                      />
                    ) : (
                      <span>{resumeData.linkedin}</span>
                    )}
                    {" | "}
                  </div>
                )}

                {/* Location */}
                {(resumeData?.location || editMode) && (
                  <div style={{ display: "flex", alignItems: "center", gap: "0.3125rem" }}>
                    <FontAwesomeIcon icon={faMapMarkerAlt} />
                    {editMode ? (
                      <input
                        type="text"
                        value={localData.location}
                        onChange={(e) => handleFieldChange("location", e.target.value)}
                        style={{ 
                          border: "none",
                          outline: "none",
                          backgroundColor: "#e7f1ff"
                        }}
                      />
                    ) : (
                      <span>{resumeData.location}</span>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Summary Section */}
            {visibleSections.summary && (
              <div>
                <div style={{ marginBottom: "1.5rem" }}>
                  <h3 style={{ 
                    fontSize: "1.25rem", 
                    textAlign: "left", 
                    margin: "0.625rem 0.0625rem", 
                    fontWeight: "700", 
                    color: headingColor,
                    borderBottom: `2px solid ${headingColor}` 
                  }}>
                    Summary
                  </h3>
                  {editMode ? (
                    <textarea
                      value={localData.summary}
                      onChange={(e) => handleFieldChange("summary", e.target.value)}
                      style={{ 
                        width: "100%", 
                        minHeight: "4rem",
                        border: "none",
                        outline: "none",
                        backgroundColor: "#e7f1ff",
                        resize: "vertical"
                      }}
                    />
                  ) : (
                    <div>{resumeData.summary}</div>
                  )}
                  {(localData?.additionalPoints?.summary?.length > 0 || editMode) && (
                    <div style={{ marginTop: "0.5rem" }}>
                      {editMode ? (
                        <>
                          <ul style={{ listStyleType: "disc", marginLeft: "1.25rem" }}>
                            {(localData?.additionalPoints?.summary || []).map((pt, i) => (
                              <li key={i}>
                                <input
                                  type="text"
                                  value={pt}
                                  onChange={(e) => handleUpdatePoint("summary", i, e.target.value)}
                                  style={{ width: "100%", border: "none", outline: "none", backgroundColor: "#e7f1ff" }}
                                />
                              </li>
                            ))}
                          </ul>
                          {/* Add Point button removed */}
                        </>
                      ) : (
                        (localData?.additionalPoints?.summary?.length > 0) && (
                          <ul style={{ listStyleType: "disc", marginLeft: "1.25rem" }}>
                            {localData.additionalPoints.summary.map((pt, i) => (
                              <li key={i}>{pt}</li>
                            ))}
                          </ul>
                        )
                      )}
                    </div>
                  )}
                </div>
                {editMode && (
                  <button
                    style={{
                      backgroundColor: "#2563eb",
                      color: "white",
                      cursor: "pointer",
                      fontWeight: "600",
                      padding: "0.5rem 1rem",
                      borderRadius: "0.5rem",
                      boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                      transition: "all 0.3s ease-in-out",
                      border: "none",
                      margin: "0.625rem"
                    }}
                    onMouseOver={(e) => e.target.style.backgroundColor = "#1d4ed8"}
                    onMouseOut={(e) => e.target.style.backgroundColor = "#2563eb"}
                    onClick={() => removeBlock("summary")}
                  >
                    Remove Summary
                  </button>
                )}
              </div>
            )}

            {/* Experience Section */}
            {visibleSections.experience && (
              <div>
                <div style={{ marginBottom: "1.5rem" }}>
                  <h3 style={{ 
                    fontSize: "1.25rem", 
                    textAlign: "left", 
                    margin: "0.625rem 0.0625rem", 
                    fontWeight: "700", 
                    color: headingColor,
                    borderBottom: `2px solid ${headingColor}` 
                  }}>
                    Experience
                  </h3>
                  {localData?.experience?.map((exp, idx) => (
                    <div key={idx} style={{ marginBottom: "1rem" }}>
                      <div style={{ 
                        display: "grid", 
                        width: "100%", 
                        gridTemplateColumns: "80% 20%" 
                      }}>
                        <div>
                          {editMode ? (
                            <input
                              type="text"
                              value={exp.companyName}
                              onChange={(e) => handleArrayFieldChange("experience", idx, "companyName", e.target.value)}
                              style={{ 
                                fontSize: "1.125rem",
                                width: "100%",
                                border: "none",
                                outline: "none",
                                backgroundColor: "#e7f1ff"
                              }}
                            />
                          ) : (
                            <p style={{ fontSize: "1.125rem" }}>{exp.companyName}</p>
                          )}
                        </div>
                        <div>
                          {editMode ? (
                            <input
                              type="text"
                              value={exp.companyLocation}
                              onChange={(e) => handleArrayFieldChange("experience", idx, "companyLocation", e.target.value)}
                              style={{ 
                                fontSize: "1rem",
                                width: "100%",
                                border: "none",
                                outline: "none",
                                backgroundColor: "#e7f1ff"
                              }}
                            />
                          ) : (
                            <p style={{ fontSize: "1rem" }}>{exp.companyLocation}</p>
                          )}
                        </div>
                      </div>
                      
                      <div style={{ 
                        display: "grid", 
                        width: "100%", 
                        gridTemplateColumns: "80% 20%" 
                      }}>
                        <div>
                          {editMode ? (
                            <input
                              type="text"
                              value={exp.title}
                              onChange={(e) => handleArrayFieldChange("experience", idx, "title", e.target.value)}
                              style={{ 
                                fontSize: "1rem",
                                width: "100%",
                                border: "none",
                                outline: "none",
                                backgroundColor: "#e7f1ff"
                              }}
                            />
                          ) : (
                            <p style={{ fontSize: "1rem" }}>{exp.title}</p>
                          )}
                        </div>
                        <div>
                          {editMode ? (
                            <input
                              type="text"
                              value={exp.date}
                              onChange={(e) => handleArrayFieldChange("experience", idx, "date", e.target.value)}
                              style={{ 
                                fontSize: "0.9375rem",
                                width: "100%",
                                border: "none",
                                outline: "none",
                                backgroundColor: "#e7f1ff"
                              }}
                            />
                          ) : (
                            <p style={{ fontSize: "0.9375rem" }}>{exp.date}</p>
                          )}
                        </div>
                      </div>

                      {editMode ? (
                        <textarea
                          value={exp.description}
                          onChange={(e) => handleArrayFieldChange("experience", idx, "description", e.target.value)}
                          style={{ 
                            width: "100%", 
                            minHeight: "3rem",
                            border: "none",
                            outline: "none",
                            backgroundColor: "#e7f1ff",
                            resize: "vertical"
                          }}
                        />
                      ) : (
                        <div>{exp.description}</div>
                      )}

                      {editMode ? (
                        <textarea
                          value={exp.accomplishment}
                          onChange={(e) => handleArrayFieldChange("experience", idx, "accomplishment", e.target.value)}
                          style={{ 
                            width: "100%", 
                            minHeight: "3rem",
                            border: "none",
                            outline: "none",
                            backgroundColor: "#e7f1ff",
                            resize: "vertical",
                            marginTop: "0.5rem"
                          }}
                        />
                      ) : (
                        <div>{exp.accomplishment}</div>
                      )}

                      {editMode && localData?.experience?.length > 1 && (
                        <button
                          onClick={() => removeEntry("experience", idx)}
                          style={{
                            backgroundColor: "#2563eb",
                            color: "white",
                            cursor: "pointer",
                            fontWeight: "600",
                            padding: "0.5rem 1rem",
                            borderRadius: "0.5rem",
                            boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                            transition: "all 0.3s ease-in-out",
                            border: "none",
                            margin: "0.3125rem"
                          }}
                          onMouseOver={(e) => e.target.style.backgroundColor = "#1d4ed8"}
                          onMouseOut={(e) => e.target.style.backgroundColor = "#2563eb"}
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  ))}
                  {editMode && (
                    <button
                      onClick={() => addNewEntry("experience")}
                      style={{
                        backgroundColor: "#2563eb",
                        color: "white",
                        cursor: "pointer",
                        fontWeight: "600",
                        padding: "0.5rem 1rem",
                        borderRadius: "0.5rem",
                        boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                        transition: "all 0.3s ease-in-out",
                        border: "none"
                      }}
                      onMouseOver={(e) => e.target.style.backgroundColor = "#1d4ed8"}
                      onMouseOut={(e) => e.target.style.backgroundColor = "#2563eb"}
                    >
                      + New Entry
                    </button>
                  )}
                  {(localData?.additionalPoints?.experience?.length > 0 || editMode) && (
                    <div style={{ marginTop: "0.5rem" }}>
                      {editMode ? (
                        <>
                          <ul style={{ listStyleType: "disc", marginLeft: "1.25rem" }}>
                            {(localData?.additionalPoints?.experience || []).map((pt, i) => (
                              <li key={i}>
                                <input
                                  type="text"
                                  value={pt}
                                  onChange={(e) => handleUpdatePoint("experience", i, e.target.value)}
                                  style={{ width: "100%", border: "none", outline: "none", backgroundColor: "#e7f1ff" }}
                                />
                              </li>
                            ))}
                          </ul>
                          {/* Add Point button removed */}
                        </>
                      ) : (
                        (localData?.additionalPoints?.experience?.length > 0) && (
                          <ul style={{ listStyleType: "disc", marginLeft: "1.25rem" }}>
                            {localData.additionalPoints.experience.map((pt, i) => (
                              <li key={i}>{pt}</li>
                            ))}
                          </ul>
                        )
                      )}
                    </div>
                  )}
                </div>
                {editMode && (
                  <button
                    style={{
                      backgroundColor: "#2563eb",
                      color: "white",
                      cursor: "pointer",
                      fontWeight: "600",
                      padding: "0.5rem 1rem",
                      borderRadius: "0.5rem",
                      boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                      transition: "all 0.3s ease-in-out",
                      border: "none",
                      margin: "0.625rem 0px"
                    }}
                    onMouseOver={(e) => e.target.style.backgroundColor = "#1d4ed8"}
                    onMouseOut={(e) => e.target.style.backgroundColor = "#2563eb"}
                    onClick={() => removeBlock("experience")}
                  >
                    Remove Experience
                  </button>
                )}
              </div>
            )}

            {/* Education Section */}
            {visibleSections.education && (
              <div>
                <div style={{ marginBottom: "1.5rem" }}>
                  <h3 style={{ 
                    fontSize: "1.25rem", 
                    textAlign: "left", 
                    margin: "0.625rem 0.0625rem", 
                    fontWeight: "700", 
                    color: headingColor,
                    borderBottom: `2px solid ${headingColor}` 
                  }}>
                    Education
                  </h3>
                  {localData?.education?.map((edu, idx) => (
                    <div key={idx} style={{ marginBottom: "1rem" }}>
                      <div style={{ 
                        display: "grid", 
                        width: "100%", 
                        gridTemplateColumns: "80% 20%" 
                      }}>
                        <div>
                          {editMode ? (
                            <input
                              type="text"
                              value={edu.institution}
                              onChange={(e) => handleArrayFieldChange("education", idx, "institution", e.target.value)}
                              style={{ 
                                fontSize: "1.125rem",
                                width: "100%",
                                border: "none",
                                outline: "none",
                                backgroundColor: "#e7f1ff"
                              }}
                            />
                          ) : (
                            <p style={{ fontSize: "1.125rem" }}>{edu.institution}</p>
                          )}
                        </div>
                        <div>
                          {editMode ? (
                            <input
                              type="text"
                              value={edu.grade}
                              onChange={(e) => handleArrayFieldChange("education", idx, "grade", e.target.value)}
                              style={{ 
                                fontSize: "0.9375rem",
                                width: "100%",
                                border: "none",
                                outline: "none",
                                backgroundColor: "#e7f1ff"
                              }}
                            />
                          ) : (
                            <p style={{ fontSize: "0.9375rem" }}>{edu.grade}</p>
                          )}
                        </div>
                      </div>
                      
                      <div style={{ 
                        display: "grid", 
                        width: "100%", 
                        gridTemplateColumns: "80% 20%" 
                      }}>
                        <div>
                          {editMode ? (
                            <input
                              type="text"
                              value={edu.degree}
                              onChange={(e) => handleArrayFieldChange("education", idx, "degree", e.target.value)}
                              style={{ 
                                fontSize: "1rem",
                                width: "100%",
                                border: "none",
                                outline: "none",
                                backgroundColor: "#e7f1ff"
                              }}
                            />
                          ) : (
                            <p style={{ fontSize: "1rem" }}>{edu.degree}</p>
                          )}
                        </div>
                        <div>
                          {editMode ? (
                            <input
                              type="text"
                              value={edu.duration}
                              onChange={(e) => handleArrayFieldChange("education", idx, "duration", e.target.value)}
                              style={{ 
                                fontSize: "0.9375rem",
                                width: "100%",
                                border: "none",
                                outline: "none",
                                backgroundColor: "#e7f1ff"
                              }}
                            />
                          ) : (
                            <p style={{ fontSize: "0.9375rem" }}>{edu.duration}</p>
                          )}
                        </div>
                      </div>

                      {editMode && localData?.education?.length > 1 && (
                        <button
                          onClick={() => removeEntry("education", idx)}
                          style={{
                            backgroundColor: "#2563eb",
                            color: "white",
                            cursor: "pointer",
                            fontWeight: "600",
                            padding: "0.5rem 1rem",
                            borderRadius: "0.5rem",
                            boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                            transition: "all 0.3s ease-in-out",
                            border: "none",
                            margin: "0.3125rem"
                          }}
                          onMouseOver={(e) => e.target.style.backgroundColor = "#1d4ed8"}
                          onMouseOut={(e) => e.target.style.backgroundColor = "#2563eb"}
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  ))}
                  {editMode && (
                    <button
                      onClick={() => addNewEntry("education")}
                      style={{
                        backgroundColor: "#2563eb",
                        color: "white",
                        cursor: "pointer",
                        fontWeight: "600",
                        padding: "0.5rem 1rem",
                        borderRadius: "0.5rem",
                        boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                        transition: "all 0.3s ease-in-out",
                        border: "none"
                      }}
                      onMouseOver={(e) => e.target.style.backgroundColor = "#1d4ed8"}
                      onMouseOut={(e) => e.target.style.backgroundColor = "#2563eb"}
                    >
                      + New Entry
                    </button>
                  )}
                  {(localData?.additionalPoints?.education?.length > 0 || editMode) && (
                    <div style={{ marginTop: "0.5rem" }}>
                      {editMode ? (
                        <>
                          <ul style={{ listStyleType: "disc", marginLeft: "1.25rem" }}>
                            {(localData?.additionalPoints?.education || []).map((pt, i) => (
                              <li key={i}>
                                <input
                                  type="text"
                                  value={pt}
                                  onChange={(e) => handleUpdatePoint("education", i, e.target.value)}
                                  style={{ width: "100%", border: "none", outline: "none", backgroundColor: "#e7f1ff" }}
                                />
                              </li>
                            ))}
                          </ul>
                          <button
                            onClick={() => handleAddPoint("education")}
                            style={{
                              backgroundColor: "#2563eb",
                              color: "white",
                              cursor: "pointer",
                              fontWeight: "600",
                              padding: "0.35rem 0.75rem",
                              borderRadius: "0.375rem",
                              boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                              transition: "all 0.2s ease-in-out",
                              border: "none",
                              marginTop: "0.25rem"
                            }}
                            onMouseOver={(e) => e.target.style.backgroundColor = "#1d4ed8"}
                            onMouseOut={(e) => e.target.style.backgroundColor = "#2563eb"}
                          >
                            Add Point
                          </button>
                        </>
                      ) : (
                        (localData?.additionalPoints?.education?.length > 0) && (
                          <ul style={{ listStyleType: "disc", marginLeft: "1.25rem" }}>
                            {localData.additionalPoints.education.map((pt, i) => (
                              <li key={i}>{pt}</li>
                            ))}
                          </ul>
                        )
                      )}
                    </div>
                  )}
                </div>
                {editMode && (
                  <button
                    style={{
                      backgroundColor: "#2563eb",
                      color: "white",
                      cursor: "pointer",
                      fontWeight: "600",
                      padding: "0.5rem 1rem",
                      borderRadius: "0.5rem",
                      boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                      transition: "all 0.3s ease-in-out",
                      border: "none",
                      margin: "0.625rem 0px"
                    }}
                    onMouseOver={(e) => e.target.style.backgroundColor = "#1d4ed8"}
                    onMouseOut={(e) => e.target.style.backgroundColor = "#2563eb"}
                    onClick={() => removeBlock("education")}
                  >
                    Remove Education
                  </button>
                )}
              </div>
            )}

            {/* Achievements Section */}
            {visibleSections.achievements && (
              <div>
                <div style={{ marginBottom: "1.5rem" }}>
                  <h3 style={{ 
                    fontSize: "1.25rem", 
                    textAlign: "left", 
                    margin: "0.625rem 0.0625rem", 
                    fontWeight: "700", 
                    color: headingColor,
                    borderBottom: `2px solid ${headingColor}` 
                  }}>
                    Key Achievements
                  </h3>
                  {localData?.achievements?.map((ach, idx) => (
                    <div key={idx} style={{ marginBottom: "1rem" }}>
                      {editMode ? (
                        <input
                          type="text"
                          value={ach.keyAchievements}
                          onChange={(e) => handleArrayFieldChange("achievements", idx, "keyAchievements", e.target.value)}
                          style={{ 
                            fontSize: "1rem",
                            width: "100%",
                            border: "none",
                            outline: "none",
                            backgroundColor: "#e7f1ff"
                          }}
                        />
                      ) : (
                        <p style={{ fontSize: "1rem" }}>{ach.keyAchievements}</p>
                      )}
                      
                      {editMode ? (
                        <textarea
                          value={ach.describe}
                          onChange={(e) => handleArrayFieldChange("achievements", idx, "describe", e.target.value)}
                          style={{ 
                            fontSize: "0.9375rem",
                            width: "100%",
                            minHeight: "3rem",
                            border: "none",
                            outline: "none",
                            backgroundColor: "#e7f1ff",
                            resize: "vertical"
                          }}
                        />
                      ) : (
                        <p style={{ fontSize: "0.9375rem" }}>{ach.describe}</p>
                      )}

                      {editMode && localData?.achievements?.length > 1 && (
                        <button
                          onClick={() => removeEntry("achievements", idx)}
                          style={{
                            backgroundColor: "#2563eb",
                            color: "white",
                            cursor: "pointer",
                            fontWeight: "600",
                            padding: "0.5rem 1rem",
                            borderRadius: "0.5rem",
                            boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                            transition: "all 0.3s ease-in-out",
                            border: "none",
                            margin: "0.3125rem"
                          }}
                          onMouseOver={(e) => e.target.style.backgroundColor = "#1d4ed8"}
                          onMouseOut={(e) => e.target.style.backgroundColor = "#2563eb"}
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  ))}
                  {editMode && (
                    <button
                      onClick={() => addNewEntry("achievements")}
                      style={{
                        backgroundColor: "#2563eb",
                        color: "white",
                        cursor: "pointer",
                        fontWeight: "600",
                        padding: "0.5rem 1rem",
                        borderRadius: "0.5rem",
                        boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                        transition: "all 0.3s ease-in-out",
                        border: "none"
                      }}
                      onMouseOver={(e) => e.target.style.backgroundColor = "#1d4ed8"}
                      onMouseOut={(e) => e.target.style.backgroundColor = "#2563eb"}
                    >
                      + New Entry
                    </button>
                  )}
                  {(localData?.additionalPoints?.achievements?.length > 0 || editMode) && (
                    <div style={{ marginTop: "0.5rem" }}>
                      {editMode ? (
                        <>
                          <ul style={{ listStyleType: "disc", marginLeft: "1.25rem" }}>
                            {(localData?.additionalPoints?.achievements || []).map((pt, i) => (
                              <li key={i}>
                                <input
                                  type="text"
                                  value={pt}
                                  onChange={(e) => handleUpdatePoint("achievements", i, e.target.value)}
                                  style={{ width: "100%", border: "none", outline: "none", backgroundColor: "#e7f1ff" }}
                                />
                              </li>
                            ))}
                          </ul>
                          {/* Add Point button removed */}
                        </>
                      ) : (
                        (localData?.additionalPoints?.achievements?.length > 0) && (
                          <ul style={{ listStyleType: "disc", marginLeft: "1.25rem" }}>
                            {localData.additionalPoints.achievements.map((pt, i) => (
                              <li key={i}>{pt}</li>
                            ))}
                          </ul>
                        )
                      )}
                    </div>
                  )}
                </div>
                {editMode && (
                  <button
                    style={{
                      backgroundColor: "#2563eb",
                      color: "white",
                      cursor: "pointer",
                      fontWeight: "600",
                      padding: "0.5rem 1rem",
                      borderRadius: "0.5rem",
                      boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                      transition: "all 0.3s ease-in-out",
                      border: "none",
                      margin: "0.625rem 0px"
                    }}
                    onMouseOver={(e) => e.target.style.backgroundColor = "#1d4ed8"}
                    onMouseOut={(e) => e.target.style.backgroundColor = "#2563eb"}
                    onClick={() => removeBlock("achievements")}
                  >
                    Remove Achievements
                  </button>
                )}
              </div>
            )}

            {/* Skills Section */}
            {visibleSections.skills && (
              <div style={{ marginBottom: "1.5rem" }}>
                <h3 style={{ 
                  fontSize: "1.25rem", 
                  textAlign: "left", 
                  margin: "0.625rem 0.0625rem", 
                  fontWeight: "700", 
                  color: headingColor,
                  borderBottom: `2px solid ${headingColor}` 
                }}>
                  Skills
                </h3>
                {editMode ? (
                  <textarea
                    value={localData?.skills?.join(", ")}
                    onChange={(e) => handleSkillsChange(e.target.value)}
                    style={{ 
                      width: "100%", 
                      minHeight: "3rem",
                      border: "none",
                      outline: "none",
                      backgroundColor: "#e7f1ff",
                      resize: "vertical"
                    }}
                  />
                ) : (
                  <div style={{ fontSize: "0.8125rem" }}>{resumeData?.skills?.join(", ")}</div>
                )}
                {(localData?.additionalPoints?.skills?.length > 0 || editMode) && (
                  <div style={{ marginTop: "0.5rem" }}>
                    {editMode ? (
                      <>
                        <ul style={{ listStyleType: "disc", marginLeft: "1.25rem" }}>
                          {(localData?.additionalPoints?.skills || []).map((pt, i) => (
                            <li key={i}>
                              <input
                                type="text"
                                value={pt}
                                onChange={(e) => handleUpdatePoint("skills", i, e.target.value)}
                                style={{ width: "100%", border: "none", outline: "none", backgroundColor: "#e7f1ff" }}
                              />
                            </li>
                          ))}
                        </ul>
                        <button
                          onClick={() => handleAddPoint("skills")}
                          style={{
                            backgroundColor: "#2563eb",
                            color: "white",
                            cursor: "pointer",
                            fontWeight: "600",
                            padding: "0.35rem 0.75rem",
                            borderRadius: "0.375rem",
                            boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                            transition: "all 0.2s ease-in-out",
                            border: "none",
                            marginTop: "0.25rem"
                          }}
                          onMouseOver={(e) => e.target.style.backgroundColor = "#1d4ed8"}
                          onMouseOut={(e) => e.target.style.backgroundColor = "#2563eb"}
                        >
                          Add Point
                        </button>
                      </>
                    ) : (
                      (localData?.additionalPoints?.skills?.length > 0) && (
                        <ul style={{ listStyleType: "disc", marginLeft: "1.25rem" }}>
                          {localData.additionalPoints.skills.map((pt, i) => (
                            <li key={i}>{pt}</li>
                          ))}
                        </ul>
                      )
                    )}
                  </div>
                )}
                {editMode && (
                  <button
                    style={{
                      backgroundColor: "#2563eb",
                      color: "white",
                      cursor: "pointer",
                      fontWeight: "600",
                      padding: "0.5rem 1rem",
                      borderRadius: "0.5rem",
                      boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                      transition: "all 0.3s ease-in-out",
                      border: "none"
                    }}
                    onMouseOver={(e) => e.target.style.backgroundColor = "#1d4ed8"}
                    onMouseOut={(e) => e.target.style.backgroundColor = "#2563eb"}
                    onClick={() => removeBlock("skills")}
                  >
                    Remove Skills
                  </button>
                )}
              </div>
            )}

            {/* Courses Section */}
            {visibleSections.courses && (
              <div>
                <div style={{ marginBottom: "1.5rem" }}>
                  <h3 style={{ 
                    fontSize: "1.25rem", 
                    textAlign: "left", 
                    margin: "0.625rem 0.0625rem", 
                    fontWeight: "700", 
                    color: headingColor,
                    borderBottom: `2px solid ${headingColor}` 
                  }}>
                    Courses
                  </h3>
                  {localData?.courses?.map((course, idx) => (
                    <div key={idx} style={{ marginBottom: "1rem" }}>
                      {editMode ? (
                        <input
                          type="text"
                          value={course.title}
                          onChange={(e) => handleArrayFieldChange("courses", idx, "title", e.target.value)}
                          style={{ 
                            fontSize: "1rem",
                            width: "100%",
                            border: "none",
                            outline: "none",
                            backgroundColor: "#e7f1ff"
                          }}
                        />
                      ) : (
                        <p style={{ fontSize: "1rem" }}>{course.title}</p>
                      )}
                      
                      {editMode ? (
                        <textarea
                          value={course.description}
                          onChange={(e) => handleArrayFieldChange("courses", idx, "description", e.target.value)}
                          style={{ 
                            fontSize: "0.9375rem",
                            width: "100%",
                            minHeight: "3rem",
                            border: "none",
                            outline: "none",
                            backgroundColor: "#e7f1ff",
                            resize: "vertical"
                          }}
                        />
                      ) : (
                        <p style={{ fontSize: "0.9375rem" }}>{course.description}</p>
                      )}

                      {editMode && localData?.courses?.length > 1 && (
                        <button
                          onClick={() => removeEntry("courses", idx)}
                          style={{
                            backgroundColor: "#2563eb",
                            color: "white",
                            cursor: "pointer",
                            fontWeight: "600",
                            padding: "0.5rem 1rem",
                            borderRadius: "0.5rem",
                            boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                            transition: "all 0.3s ease-in-out",
                            border: "none",
                            margin: "0.3125rem"
                          }}
                          onMouseOver={(e) => e.target.style.backgroundColor = "#1d4ed8"}
                          onMouseOut={(e) => e.target.style.backgroundColor = "#2563eb"}
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  ))}
                  {editMode && (
                    <button
                      onClick={() => addNewEntry("courses")}
                      style={{
                        backgroundColor: "#2563eb",
                        color: "white",
                        cursor: "pointer",
                        fontWeight: "600",
                        padding: "0.5rem 1rem",
                        borderRadius: "0.5rem",
                        boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                        transition: "all 0.3s ease-in-out",
                        border: "none"
                      }}
                      onMouseOver={(e) => e.target.style.backgroundColor = "#1d4ed8"}
                      onMouseOut={(e) => e.target.style.backgroundColor = "#2563eb"}
                    >
                      + New Entry
                    </button>
                  )}
                  {(localData?.additionalPoints?.courses?.length > 0 || editMode) && (
                    <div style={{ marginTop: "0.5rem" }}>
                      {editMode ? (
                        <>
                          <ul style={{ listStyleType: "disc", marginLeft: "1.25rem" }}>
                            {(localData?.additionalPoints?.courses || []).map((pt, i) => (
                              <li key={i}>
                                <input
                                  type="text"
                                  value={pt}
                                  onChange={(e) => handleUpdatePoint("courses", i, e.target.value)}
                                  style={{ width: "100%", border: "none", outline: "none", backgroundColor: "#e7f1ff" }}
                                />
                              </li>
                            ))}
                          </ul>
                          {/* Add Point button removed */}
                        </>
                      ) : (
                        (localData?.additionalPoints?.courses?.length > 0) && (
                          <ul style={{ listStyleType: "disc", marginLeft: "1.25rem" }}>
                            {localData.additionalPoints.courses.map((pt, i) => (
                              <li key={i}>{pt}</li>
                            ))}
                          </ul>
                        )
                      )}
                    </div>
                  )}
                </div>
                {editMode && (
                  <button
                    style={{
                      backgroundColor: "#2563eb",
                      color: "white",
                      cursor: "pointer",
                      fontWeight: "600",
                      padding: "0.5rem 1rem",
                      borderRadius: "0.5rem",
                      boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                      transition: "all 0.3s ease-in-out",
                      border: "none",
                      margin: "0.625rem 0px"
                    }}
                    onMouseOver={(e) => e.target.style.backgroundColor = "#1d4ed8"}
                    onMouseOut={(e) => e.target.style.backgroundColor = "#2563eb"}
                    onClick={() => removeBlock("courses")}
                  >
                    Remove Courses
                  </button>
                )}
              </div>
            )}

            {/* Projects Section */}
            {visibleSections.projects && (
              <div>
                <div style={{ marginBottom: "1.5rem" }}>
                  <h3 style={{ 
                    fontSize: "1.25rem", 
                    textAlign: "left", 
                    margin: "0.625rem 0.0625rem", 
                    fontWeight: "700", 
                    color: headingColor,
                    borderBottom: `2px solid ${headingColor}` 
                  }}>
                    Projects
                  </h3>
                  {localData?.projects?.map((prj, idx) => (
                    <div key={idx} style={{ marginBottom: "1rem" }}>
                      <div style={{ 
                        display: "grid", 
                        width: "100%", 
                        gridTemplateColumns: "80% 20%" 
                      }}>
                        <div>
                          {editMode ? (
                            <input
                              type="text"
                              value={prj.name || prj.title}
                              onChange={(e) => handleArrayFieldChange("projects", idx, "name", e.target.value)}
                              style={{ 
                                fontSize: "1.125rem",
                                width: "100%",
                                border: "none",
                                outline: "none",
                                backgroundColor: "#e7f1ff"
                              }}
                            />
                          ) : (
                            <p style={{ fontSize: "1.125rem" }}>{prj.name || prj.title}</p>
                          )}
                        </div>
                        <div>
                          {editMode ? (
                            <input
                              type="text"
                              value={prj.duration}
                              onChange={(e) => handleArrayFieldChange("projects", idx, "duration", e.target.value)}
                              style={{ 
                                fontSize: "1rem",
                                width: "100%",
                                border: "none",
                                outline: "none",
                                backgroundColor: "#e7f1ff"
                              }}
                            />
                          ) : (
                            <p style={{ fontSize: "1rem" }}>{prj.duration}</p>
                          )}
                        </div>
                      </div>

                      {editMode ? (
                        <textarea
                          value={prj.description}
                          onChange={(e) => handleArrayFieldChange("projects", idx, "description", e.target.value)}
                          style={{ 
                            fontSize: "1rem",
                            width: "100%",
                            minHeight: "3rem",
                            border: "none",
                            outline: "none",
                            backgroundColor: "#e7f1ff",
                            resize: "vertical"
                          }}
                        />
                      ) : (
                        <p style={{ fontSize: "1rem" }}>{prj.description}</p>
                      )}

                      {editMode && localData?.projects?.length > 1 && (
                        <button
                          onClick={() => removeEntry("projects", idx)}
                          style={{
                            backgroundColor: "#2563eb",
                            color: "white",
                            cursor: "pointer",
                            fontWeight: "600",
                            padding: "0.5rem 1rem",
                            borderRadius: "0.5rem",
                            boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                            transition: "all 0.3s ease-in-out",
                            border: "none",
                            margin: "0.3125rem"
                          }}
                          onMouseOver={(e) => e.target.style.backgroundColor = "#1d4ed8"}
                          onMouseOut={(e) => e.target.style.backgroundColor = "#2563eb"}
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  ))}
                  {editMode && (
                    <button
                      onClick={() => addNewEntry("projects")}
                      style={{
                        backgroundColor: "#2563eb",
                        color: "white",
                        cursor: "pointer",
                        fontWeight: "600",
                        padding: "0.5rem 1rem",
                        borderRadius: "0.5rem",
                        boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                        transition: "all 0.3s ease-in-out",
                        border: "none"
                      }}
                      onMouseOver={(e) => e.target.style.backgroundColor = "#1d4ed8"}
                      onMouseOut={(e) => e.target.style.backgroundColor = "#2563eb"}
                    >
                      + New Entry
                    </button>
                  )}
                  {(localData?.additionalPoints?.projects?.length > 0 || editMode) && (
                    <div style={{ marginTop: "0.5rem" }}>
                      {editMode ? (
                        <>
                          <ul style={{ listStyleType: "disc", marginLeft: "1.25rem" }}>
                            {(localData?.additionalPoints?.projects || []).map((pt, i) => (
                              <li key={i}>
                                <input
                                  type="text"
                                  value={pt}
                                  onChange={(e) => handleUpdatePoint("projects", i, e.target.value)}
                                  style={{ width: "100%", border: "none", outline: "none", backgroundColor: "#e7f1ff" }}
                                />
                              </li>
                            ))}
                          </ul>
                          <button
                            onClick={() => handleAddPoint("projects")}
                            style={{
                              backgroundColor: "#2563eb",
                              color: "white",
                              cursor: "pointer",
                              fontWeight: "600",
                              padding: "0.35rem 0.75rem",
                              borderRadius: "0.375rem",
                              boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                              transition: "all 0.2s ease-in-out",
                              border: "none",
                              marginTop: "0.25rem"
                            }}
                            onMouseOver={(e) => e.target.style.backgroundColor = "#1d4ed8"}
                            onMouseOut={(e) => e.target.style.backgroundColor = "#2563eb"}
                          >
                            Add Point
                          </button>
                        </>
                      ) : (
                        (localData?.additionalPoints?.projects?.length > 0) && (
                          <ul style={{ listStyleType: "disc", marginLeft: "1.25rem" }}>
                            {localData.additionalPoints.projects.map((pt, i) => (
                              <li key={i}>{pt}</li>
                            ))}
                          </ul>
                        )
                      )}
                    </div>
                  )}
                </div>
                {editMode && (
                  <button
                    style={{
                      backgroundColor: "#2563eb",
                      color: "white",
                      cursor: "pointer",
                      fontWeight: "600",
                      padding: "0.5rem 1rem",
                      borderRadius: "0.5rem",
                      boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                      transition: "all 0.3s ease-in-out",
                      border: "none",
                      margin: "0.625rem 0px"
                    }}
                    onMouseOver={(e) => e.target.style.backgroundColor = "#1d4ed8"}
                    onMouseOut={(e) => e.target.style.backgroundColor = "#2563eb"}
                    onClick={() => removeBlock("projects")}
                  >
                    Remove Projects
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Edit/Save/Cancel Controls */}
          <div style={{ marginTop: "1rem", textAlign: "center" }}>
            {editMode ? (
              <>
                <button
                  onClick={handleOpenColorPicker}
                  style={{ 
                    backgroundColor: "#2563eb", 
                    color: "white", 
                    padding: "0.5rem 1rem", 
                    borderRadius: "0.375rem", 
                    marginRight: "0.5rem",
                    border: "none",
                    cursor: "pointer"
                  }}
                  onMouseOver={(e) => e.target.style.backgroundColor = "#1d4ed8"}
                  onMouseOut={(e) => e.target.style.backgroundColor = "#2563eb"}
                >
                  Change Color
                </button>
                <button
                  onClick={handleSave}
                  style={{ 
                    backgroundColor: "#10b981", 
                    color: "white", 
                    padding: "0.5rem 1rem", 
                    borderRadius: "0.375rem", 
                    marginRight: "0.5rem",
                    border: "none",
                    cursor: "pointer"
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
                  backgroundColor: "#3b82f6", 
                  color: "white", 
                  padding: "0.5rem 1rem", 
                  borderRadius: "0.375rem",
                  border: "none",
                  cursor: "pointer"
                }}
              >
                Edit
              </button>
            )}
            {!editMode && (
              <button
                onClick={handleOpenColorPicker}
                style={{ 
                  backgroundColor: "#2563eb", 
                  color: "white", 
                  padding: "0.5rem 1rem", 
                  borderRadius: "0.375rem", 
                  marginLeft: "0.5rem",
                  border: "none",
                  cursor: "pointer"
                }}
                onMouseOver={(e) => e.target.style.backgroundColor = "#1d4ed8"}
                onMouseOut={(e) => e.target.style.backgroundColor = "#2563eb"}
              >
                Change Color
              </button>
            )}
            <input
              ref={colorInputRef}
              type="color"
              value={headingColor}
              onChange={(e) => setHeadingColor(e.target.value)}
              style={{ display: "none" }}
              aria-label="Pick heading color"
            />
          </div>
        </div>
      </div>

      {/* Mobile Responsive Styles */}
      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        @media only screen and (max-width: 776px) {
          .editResume {
            margin: 30px 0px;
          }
          
          #resumeBody {
            box-sizing: border-box;
            margin: 30px 10px;
            box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.2);
            padding: 5px;
            border-radius: 5px;
            min-width: 380px;
          }
          
          .user-name {
            font-size: 20px;
          }

          .user-role {
            font-size: 15px;
          }

          .user-contacts {
            font-size: 10px;
          }

          .headings {
            font-size: 18px;
          }

          .user-summary {
            font-size: 13px;
          }

          .remove-section-btn {
            font-size: 10px;
          }

          .remove-btn {
            font-size: 10px;
          }

          .add-btn {
            font-size: 10px;
          }

          .exp1 {
            font-size: 10px;
          }

          .user-experience {
            font-size: 13px;
          }

          .para1 {
            font-size: 13px;
          }

          .para2 {
            font-size: 12px;
          }

          .para3 {
            font-size: 11px;
          }

          .para5 {
            font-size: 12px;
          }

          .para4 {
            font-size: 13px;
          }

          .skillsblock {
            font-size: 13px;
          }
        }
      `}</style>
    </div>
  );
};

export default Template1;