import React, { useState, useRef, useEffect } from "react";
import Navbar from "../Navbar/Navbar";
import Sidebar from "../Sidebar/Sidebar";
import { useResume } from "../../context/ResumeContext";

const Template5 = () => {
  const resumeRef = useRef();
  const { resumeData, setResumeData } = useResume();
  const [editMode, setEditMode] = useState(false);
  const [localData, setLocalData] = useState(resumeData);

  // UI State (keeping original functionality)
  const [showPreview, setShowPreview] = useState(false);
  const [showEnhancementOptions, setShowEnhancementOptions] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showButtons, setShowButtons] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sectionSettings, setSectionSettings] = useState({
    header: {
      showTitle: true,
      showPhone: true,
      showEmail: true,
      showLink: true,
      showLocation: true,
      uppercaseName: false,
    },
    summary: { showSummary: true },
    experience: { showExperience: true },
    education: { showEducation: true },
    achievements: { showAchievements: true },
    skills: { showSkills: true },
    courses: { showCourses: true },
    projects: { showProjects: true },
  });
  const [activeSection, setActiveSection] = useState(null);
  const [hoveredSection, setHoveredSection] = useState(null);
  const [sectionsOrder, setSectionsOrder] = useState([
    "summary",
    "experience",
    "education",
    "achievements",
    "skills",
    "courses",
    "projects",
  ]);

  useEffect(() => {
    setLocalData(resumeData);
  }, [resumeData]);

  const handleEnhance = (section) => {
    // This will be handled by the Sidebar component
  };

  const handleSave = () => {
    setResumeData(localData);
    setEditMode(false);
  };

  const handleCancel = () => {
    setLocalData(resumeData);
    setEditMode(false);
  };

  const handleRemoveSection = (section, index) => {
    if (index !== undefined) {
      setLocalData((prevData) => {
        const updatedSection = [...prevData[section]];
        updatedSection.splice(index, 1);
        return { ...prevData, [section]: updatedSection };
      });
    } else {
      setSectionSettings((prevSettings) => ({
        ...prevSettings,
        [section]: {
          ...prevSettings[section],
          [`show${section.charAt(0).toUpperCase() + section.slice(1)}`]: false,
        },
      }));
    }
  };

  const handleInputChange = (section, field, value, index) => {
    let updatedData;
    if (section && index !== undefined) {
      const updatedSection = [...localData[section]];
      updatedSection[index][field] = value;
      updatedData = { ...localData, [section]: updatedSection };
    } else if (section) {
      updatedData = { ...localData, [section]: value };
    } else {
      updatedData = { ...localData, [field]: value };
    }
    setLocalData(updatedData);
    // Auto-save to localStorage for universal save system
    localStorage.setItem('resumeData', JSON.stringify(updatedData));
  };

  const handleAddSection = (section, itemToDuplicate) => {
    let newItem = itemToDuplicate
      ? JSON.parse(JSON.stringify(itemToDuplicate))
      : {
          experience: {
            title: "New Title",
            companyName: "New Company",
            date: "MM/YYYY - MM/YYYY",
            companyLocation: "City, Country",
            description: "Describe your responsibilities and achievements.",
            accomplishment: ["Highlight a key accomplishment."],
          },
          education: {
            degree: "Degree Name",
            institution: "Institution Name",
            duration: "YYYY - YYYY",
            location: "City, Country",
          },
          achievements: "New Achievement",
          courses: {
            title: "Course Title",
            description: "Course description.",
          },
          skills: "New Skill",
          projects: {
            name: "Project Title",
            description: "Project description.",
            technologies: ["Tech1", "Tech2"],
            link: "https://project.com",
            github: "https://github.com/user/project",
          },
        }[section] || {};

    setLocalData((prev) => ({
      ...prev,
      [section]: [...(prev[section] || []), newItem],
    }));
  };

  const handleSectionHover = (section) => setHoveredSection(section);
  const handleSectionLeave = () => setHoveredSection(null);
  const handleSectionClick = (section) =>
    setActiveSection(section === activeSection ? null : section);
  const handleSettingChange = (section, key) => {
    setSectionSettings((prev) => ({
      ...prev,
      [section]: { ...prev[section], [key]: !prev[section][key] },
    }));
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#fef3c7" }}>
      <Navbar />

      {loading && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 50,
          }}
        >
          <div
            style={{
              backgroundColor: "white",
              padding: "2rem",
              borderRadius: "0.5rem",
              boxShadow: "0 10px 15px rgba(0,0,0,0.1)",
            }}
          >
            <div
              style={{
                width: "4rem",
                height: "4rem",
                border: "2px solid #e5e7eb",
                borderTop: "2px solid #8b5cf6",
                borderRadius: "50%",
                animation: "spin 1s linear infinite",
                marginBottom: "1rem",
              }}
            ></div>
            <p
              style={{
                fontSize: "1.125rem",
                fontWeight: "600",
                color: "#374151",
              }}
            >
              Loading...
            </p>
          </div>
        </div>
      )}

      <div style={{ display: "flex" }}>
        <Sidebar onEnhance={handleEnhance} resumeRef={resumeRef} />

        {/* Mobile Menu Button */}
        <button
          style={{
            position: "fixed",
            top: "1rem",
            left: "1rem",
            zIndex: 50,
            color: "white",
            background: "linear-gradient(to right, #fbbf24, #ec4899)",
            padding: "0.5rem",
            borderRadius: "50%",
            boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
            display: sidebarOpen ? "none" : "block",
          }}
          className="md:hidden"
          onClick={() => setSidebarOpen(true)}
          aria-label="Open sidebar"
        >
          ☰
        </button>

        {/* Resume Content */}
        <div
          style={{
            flexGrow: 1,
            padding: "1rem",
            marginLeft: "10rem",
            marginRight: "8rem",
            marginTop: "4rem",
          }}
          className="md:ml-72 mt-16 md:mt-0"
        >
          <div
            ref={resumeRef}
            style={{
              maxWidth: "100%",
              width: "95%",
              margin: "1.25rem auto",
              padding: "1.5rem",
              backgroundColor: "#f9fafb",
              border: "1px solid #e5e7eb",
              borderRadius: "0.5rem",
              boxShadow: "0 25px 50px rgba(0,0,0,0.25)",
            }}
            className="max-w-full mx-auto my-5 p-6 bg-gray-50 border border-gray-200 rounded-lg shadow-xl"
          >
            {/* Header */}
            <div
              style={{
                textAlign: "center",
                marginBottom: "1.5rem",
                padding: "1rem",
              }}
            >
              <h1
                contentEditable={editMode}
                suppressContentEditableWarning
                onBlur={(e) =>
                  handleInputChange(null, "name", e.target.innerText)
                }
                style={{
                  fontWeight: "bold",
                  wordBreak: "break-words",
                  textTransform: sectionSettings.header.uppercaseName
                    ? "uppercase"
                    : "none",
                  fontSize: "2rem",
                }}
                className={`font-bold break-words ${
                  sectionSettings.header.uppercaseName ? "uppercase" : ""
                } text-2xl sm:text-3xl md:text-4xl`}
                onClick={() => handleSectionClick("header")}
                onMouseEnter={() => handleSectionHover("header")}
                onMouseLeave={handleSectionLeave}
              >
                {editMode ? localData.name : resumeData.name}
              </h1>
              {sectionSettings.header.showTitle && (
                <p
                  contentEditable={editMode}
                  onBlur={(e) =>
                    handleInputChange(null, "role", e.target.textContent)
                  }
                  style={{
                    fontSize: "1.125rem",
                    color: "#6b7280",
                    marginTop: "0.5rem",
                  }}
                  className="text-sm sm:text-base md:text-lg text-gray-600 mt-2"
                >
                  {editMode ? localData.role : resumeData.role}
                </p>
              )}
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  justifyContent: "center",
                  gap: "1rem",
                  marginTop: "0.5rem",
                  fontSize: "1rem",
                  color: "#374151",
                }}
                className="flex flex-wrap justify-center gap-2 sm:gap-4 mt-2 text-xs sm:text-sm md:text-base text-gray-700"
              >
                {sectionSettings.header.showPhone && (
                  <span
                    contentEditable={editMode}
                    onBlur={(e) =>
                      handleInputChange(null, "phone", e.target.textContent)
                    }
                  >
                    {editMode ? localData.phone : resumeData.phone}
                  </span>
                )}
                {sectionSettings.header.showEmail && (
                  <span
                    contentEditable={editMode}
                    onBlur={(e) =>
                      handleInputChange(null, "email", e.target.textContent)
                    }
                  >
                    {editMode ? localData.email : resumeData.email}
                  </span>
                )}
                {sectionSettings.header.showLink && (
                  <span
                    contentEditable={editMode}
                    onBlur={(e) =>
                      handleInputChange(null, "linkedin", e.target.textContent)
                    }
                  >
                    {editMode ? localData.linkedin : resumeData.linkedin}
                  </span>
                )}
                {sectionSettings.header.showLocation && (
                  <span
                    contentEditable={editMode}
                    onBlur={(e) =>
                      handleInputChange(null, "location", e.target.textContent)
                    }
                  >
                    {editMode ? localData.location : resumeData.location}
                  </span>
                )}
              </div>
            </div>

            {/* Sections */}
            {sectionsOrder.map((section) => (
              <div
                key={section}
                style={{ position: "relative", marginBottom: "1.5rem" }}
              >
                {section === "summary" &&
                  sectionSettings.summary.showSummary && (
                    <div>
                      <h2
                        onClick={() => handleSectionClick("summary")}
                        onMouseEnter={() => handleSectionHover("summary")}
                        onMouseLeave={handleSectionLeave}
                        style={{
                          fontSize: "1.25rem",
                          fontWeight: "bold",
                          borderBottom: "2px solid #d1d5db",
                          paddingBottom: "0.25rem",
                          marginBottom: "0.5rem",
                        }}
                        className="text-lg sm:text-xl font-bold border-b-2 border-gray-300 pb-1 mb-2"
                      >
                        Summary
                      </h2>
                      <p
                        contentEditable={editMode}
                        onBlur={(e) =>
                          handleInputChange(
                            null,
                            "summary",
                            e.target.textContent
                          )
                        }
                        style={{
                          fontSize: "1rem",
                          color: "#374151",
                        }}
                        className="text-xs sm:text-sm md:text-base text-gray-700"
                      >
                        {editMode ? localData.summary : resumeData.summary}
                      </p>
                      {showButtons && (
                        <button
                          onClick={() => handleRemoveSection("summary")}
                          style={{
                            position: "absolute",
                            top: 0,
                            right: 0,
                            fontSize: "0.75rem",
                            color: "#ef4444",
                            border: "none",
                            background: "none",
                            cursor: "pointer",
                          }}
                          className="absolute top-0 right-0 text-xs text-red-500 hover:text-red-700 transition-colors duration-300"
                        >
                          X
                        </button>
                      )}
                    </div>
                  )}

                {section === "experience" &&
                  sectionSettings.experience.showExperience && (
                    <div>
                      <h2
                        onClick={() => handleSectionClick("experience")}
                        onMouseEnter={() => handleSectionHover("experience")}
                        onMouseLeave={handleSectionLeave}
                        style={{
                          fontSize: "1.25rem",
                          fontWeight: "bold",
                          borderBottom: "2px solid #d1d5db",
                          paddingBottom: "0.25rem",
                          marginBottom: "0.5rem",
                        }}
                        className="text-lg sm:text-xl font-bold border-b-2 border-gray-300 pb-1 mb-2"
                      >
                        Experience
                      </h2>
                      {(
                        (editMode ? localData : resumeData).experience || []
                      ).map((exp, idx) => (
                        <div key={idx} style={{ marginBottom: "1rem" }}>
                          <h3
                            contentEditable={editMode}
                            onBlur={(e) =>
                              handleInputChange(
                                "experience",
                                "companyName",
                                e.target.textContent,
                                idx
                              )
                            }
                            style={{
                              fontSize: "1.125rem",
                              fontWeight: "600",
                            }}
                            className="text-base sm:text-lg font-semibold"
                          >
                            {exp.companyName}
                          </h3>
                          <p
                            contentEditable={editMode}
                            onBlur={(e) =>
                              handleInputChange(
                                "experience",
                                "title",
                                e.target.textContent,
                                idx
                              )
                            }
                            style={{
                              fontSize: "0.875rem",
                              color: "#6b7280",
                            }}
                            className="text-xs sm:text-sm text-gray-600"
                          >
                            {exp.title}
                          </p>
                          <p
                            contentEditable={editMode}
                            onBlur={(e) =>
                              handleInputChange(
                                "experience",
                                "date",
                                e.target.textContent,
                                idx
                              )
                            }
                            style={{
                              fontSize: "0.875rem",
                              color: "#6b7280",
                            }}
                            className="text-xs sm:text-sm text-gray-600"
                          >
                            {exp.date}
                          </p>
                          <p
                            contentEditable={editMode}
                            onBlur={(e) =>
                              handleInputChange(
                                "experience",
                                "companyLocation",
                                e.target.textContent,
                                idx
                              )
                            }
                            style={{
                              fontSize: "0.875rem",
                              color: "#6b7280",
                            }}
                            className="text-xs sm:text-sm text-gray-600"
                          >
                            {exp.companyLocation}
                          </p>
                          <p
                            contentEditable={editMode}
                            onBlur={(e) =>
                              handleInputChange(
                                "experience",
                                "description",
                                e.target.textContent,
                                idx
                              )
                            }
                            style={{
                              fontSize: "0.875rem",
                              color: "#374151",
                            }}
                            className="text-xs sm:text-sm text-gray-700"
                          >
                            {exp.description}
                          </p>
                          {Array.isArray(exp.accomplishment) ? (
                            <ul>
                              {exp.accomplishment.map((acc, accIdx) => (
                                <li
                                  key={accIdx}
                                  contentEditable={editMode}
                                  onBlur={(e) => {
                                    const updatedExp = [
                                      ...(editMode ? localData : resumeData)
                                        .experience,
                                    ];
                                    updatedExp[idx].accomplishment[accIdx] =
                                      e.target.textContent;
                                    handleInputChange(
                                      "experience",
                                      "accomplishment",
                                      updatedExp[idx].accomplishment,
                                      idx
                                    );
                                  }}
                                  style={{
                                    fontSize: "0.875rem",
                                    color: "#374151",
                                  }}
                                  className="text-xs sm:text-sm text-gray-700"
                                >
                                  {acc}
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <p
                              contentEditable={editMode}
                              onBlur={(e) =>
                                handleInputChange(
                                  "experience",
                                  "accomplishment",
                                  e.target.textContent,
                                  idx
                                )
                              }
                              style={{
                                fontSize: "0.875rem",
                                color: "#374151",
                              }}
                              className="text-xs sm:text-sm text-gray-700"
                            >
                              {exp.accomplishment}
                            </p>
                          )}
                          {showButtons && (
                            <button
                              onClick={() =>
                                handleRemoveSection("experience", idx)
                              }
                              style={{
                                fontSize: "0.875rem",
                                color: "#ef4444",
                                border: "none",
                                background: "none",
                                cursor: "pointer",
                              }}
                              className="text-xs sm:text-sm text-red-500 hover:text-red-700 transition-colors duration-300"
                            >
                              Remove Experience
                            </button>
                          )}
                        </div>
                      ))}
                      {showButtons && (
                        <button
                          onClick={() => handleAddSection("experience")}
                          style={{
                            fontSize: "0.875rem",
                            color: "#3b82f6",
                            border: "none",
                            background: "none",
                            cursor: "pointer",
                          }}
                          className="text-xs sm:text-sm text-blue-500 hover:text-blue-700 transition-colors duration-300"
                        >
                          Add Experience
                        </button>
                      )}
                      {showButtons && (
                        <button
                          onClick={() => handleRemoveSection("experience")}
                          style={{
                            position: "absolute",
                            top: 0,
                            right: 0,
                            fontSize: "0.75rem",
                            color: "#ef4444",
                            border: "none",
                            background: "none",
                            cursor: "pointer",
                          }}
                          className="absolute top-0 right-0 text-xs text-red-500 hover:text-red-700 transition-colors duration-300"
                        >
                          X
                        </button>
                      )}
                    </div>
                  )}

                {section === "education" &&
                  sectionSettings.education.showEducation && (
                    <div>
                      <h2
                        onClick={() => handleSectionClick("education")}
                        onMouseEnter={() => handleSectionHover("education")}
                        onMouseLeave={handleSectionLeave}
                        style={{
                          fontSize: "1.25rem",
                          fontWeight: "bold",
                          borderBottom: "2px solid #d1d5db",
                          paddingBottom: "0.25rem",
                          marginBottom: "0.5rem",
                        }}
                        className="text-lg sm:text-xl font-bold border-b-2 border-gray-300 pb-1 mb-2"
                      >
                        Education
                      </h2>
                      {(
                        (editMode ? localData : resumeData).education || []
                      ).map((edu, idx) => (
                        <div key={idx} style={{ marginBottom: "1rem" }}>
                          <h3
                            contentEditable={editMode}
                            onBlur={(e) =>
                              handleInputChange(
                                "education",
                                "institution",
                                e.target.textContent,
                                idx
                              )
                            }
                            style={{
                              fontSize: "1.125rem",
                              fontWeight: "600",
                            }}
                            className="text-base sm:text-lg font-semibold"
                          >
                            {edu.institution}
                          </h3>
                          <p
                            contentEditable={editMode}
                            onBlur={(e) =>
                              handleInputChange(
                                "education",
                                "degree",
                                e.target.textContent,
                                idx
                              )
                            }
                            style={{
                              fontSize: "0.875rem",
                              color: "#6b7280",
                            }}
                            className="text-xs sm:text-sm text-gray-600"
                          >
                            {edu.degree}
                          </p>
                          <p
                            contentEditable={editMode}
                            onBlur={(e) =>
                              handleInputChange(
                                "education",
                                "duration",
                                e.target.textContent,
                                idx
                              )
                            }
                            style={{
                              fontSize: "0.875rem",
                              color: "#6b7280",
                            }}
                            className="text-xs sm:text-sm text-gray-600"
                          >
                            {edu.duration}
                          </p>
                          <p
                            contentEditable={editMode}
                            onBlur={(e) =>
                              handleInputChange(
                                "education",
                                "grade",
                                e.target.textContent,
                                idx
                              )
                            }
                            style={{
                              fontSize: "0.875rem",
                              color: "#6b7280",
                            }}
                            className="text-xs sm:text-sm text-gray-600"
                          >
                            {edu.grade}
                          </p>
                          {showButtons && (
                            <button
                              onClick={() =>
                                handleRemoveSection("education", idx)
                              }
                              style={{
                                fontSize: "0.875rem",
                                color: "#ef4444",
                                border: "none",
                                background: "none",
                                cursor: "pointer",
                              }}
                              className="text-xs sm:text-sm text-red-500 hover:text-red-700 transition-colors duration-300"
                            >
                              Remove Education
                            </button>
                          )}
                        </div>
                      ))}
                      {showButtons && (
                        <button
                          onClick={() => handleAddSection("education")}
                          style={{
                            fontSize: "0.875rem",
                            color: "#3b82f6",
                            border: "none",
                            background: "none",
                            cursor: "pointer",
                          }}
                          className="text-xs sm:text-sm text-blue-500 hover:text-blue-700 transition-colors duration-300"
                        >
                          Add Education
                        </button>
                      )}
                      {showButtons && (
                        <button
                          onClick={() => handleRemoveSection("education")}
                          style={{
                            position: "absolute",
                            top: 0,
                            right: 0,
                            fontSize: "0.75rem",
                            color: "#ef4444",
                            border: "none",
                            background: "none",
                            cursor: "pointer",
                          }}
                          className="absolute top-0 right-0 text-xs text-red-500 hover:text-red-700 transition-colors duration-300"
                        >
                          X
                        </button>
                      )}
                    </div>
                  )}

                {section === "achievements" &&
                  sectionSettings.achievements.showAchievements && (
                    <div>
                      <h2
                        onClick={() => handleSectionClick("achievements")}
                        onMouseEnter={() => handleSectionHover("achievements")}
                        onMouseLeave={handleSectionLeave}
                        style={{
                          fontSize: "1.25rem",
                          fontWeight: "bold",
                          borderBottom: "2px solid #d1d5db",
                          paddingBottom: "0.25rem",
                          marginBottom: "0.5rem",
                        }}
                        className="text-lg sm:text-xl font-bold border-b-2 border-gray-300 pb-1 mb-2"
                      >
                        Key Achievements
                      </h2>
                      {(
                        (editMode ? localData : resumeData).achievements || []
                      ).map((achievement, idx) => (
                        <div key={idx} style={{ marginBottom: "1rem" }}>
                          {typeof achievement === "object" ? (
                            <>
                              <h3
                                contentEditable={editMode}
                                onBlur={(e) =>
                                  handleInputChange(
                                    "achievements",
                                    "keyAchievements",
                                    e.target.textContent,
                                    idx
                                  )
                                }
                                style={{
                                  fontSize: "1.125rem",
                                  fontWeight: "600",
                                }}
                                className="text-base sm:text-lg font-semibold"
                              >
                                {achievement.keyAchievements}
                              </h3>
                              <p
                                contentEditable={editMode}
                                onBlur={(e) =>
                                  handleInputChange(
                                    "achievements",
                                    "describe",
                                    e.target.textContent,
                                    idx
                                  )
                                }
                                style={{
                                  fontSize: "0.875rem",
                                  color: "#374151",
                                }}
                                className="text-xs sm:text-sm text-gray-700"
                              >
                                {achievement.describe}
                              </p>
                            </>
                          ) : (
                            <p
                              contentEditable={editMode}
                              onBlur={(e) => {
                                const updatedAchievements = [
                                  ...(editMode ? localData : resumeData)
                                    .achievements,
                                ];
                                updatedAchievements[idx] = e.target.textContent;
                                handleInputChange(
                                  null,
                                  "achievements",
                                  updatedAchievements
                                );
                              }}
                              style={{
                                fontSize: "0.875rem",
                                color: "#374151",
                              }}
                              className="text-xs sm:text-sm text-gray-700"
                            >
                              {achievement}
                            </p>
                          )}
                          {showButtons && (
                            <button
                              onClick={() =>
                                handleRemoveSection("achievements", idx)
                              }
                              style={{
                                fontSize: "0.875rem",
                                color: "#ef4444",
                                border: "none",
                                background: "none",
                                cursor: "pointer",
                              }}
                              className="text-xs sm:text-sm text-red-500 hover:text-red-700 transition-colors duration-300"
                            >
                              Remove Achievement
                            </button>
                          )}
                        </div>
                      ))}
                      {showButtons && (
                        <button
                          onClick={() => handleAddSection("achievements")}
                          style={{
                            fontSize: "0.875rem",
                            color: "#3b82f6",
                            border: "none",
                            background: "none",
                            cursor: "pointer",
                          }}
                          className="text-xs sm:text-sm text-blue-500 hover:text-blue-700 transition-colors duration-300"
                        >
                          Add Achievement
                        </button>
                      )}
                      {showButtons && (
                        <button
                          onClick={() => handleRemoveSection("achievements")}
                          style={{
                            position: "absolute",
                            top: 0,
                            right: 0,
                            fontSize: "0.75rem",
                            color: "#ef4444",
                            border: "none",
                            background: "none",
                            cursor: "pointer",
                          }}
                          className="absolute top-0 right-0 text-xs text-red-500 hover:text-red-700 transition-colors duration-300"
                        >
                          X
                        </button>
                      )}
                    </div>
                  )}

                {section === "skills" && sectionSettings.skills.showSkills && (
                  <div>
                    <h2
                      onClick={() => handleSectionClick("skills")}
                      onMouseEnter={() => handleSectionHover("skills")}
                      onMouseLeave={handleSectionLeave}
                      style={{
                        fontSize: "1.25rem",
                        fontWeight: "bold",
                        borderBottom: "2px solid #d1d5db",
                        paddingBottom: "0.25rem",
                        marginBottom: "0.5rem",
                      }}
                      className="text-lg sm:text-xl font-bold border-b-2 border-gray-300 pb-1 mb-2"
                    >
                      Skills
                    </h2>
                    <ul
                      style={{
                        listStyle: "disc",
                        paddingLeft: "1.25rem",
                        display: "grid",
                        gridTemplateColumns:
                          "repeat(auto-fit, minmax(200px, 1fr))",
                        gap: "0.5rem",
                      }}
                      className="list-disc pl-5 grid grid-cols-1 sm:grid-cols-2 gap-2"
                    >
                      {((editMode ? localData : resumeData).skills || []).map(
                        (skill, idx) => (
                          <li
                            key={`${skill}-${idx}`}
                            style={{ display: "flex", alignItems: "center" }}
                            className="flex items-center"
                          >
                            <span
                              contentEditable={editMode}
                              suppressContentEditableWarning
                              onBlur={(e) => {
                                const updatedSkills = [
                                  ...(editMode ? localData : resumeData).skills,
                                ];
                                updatedSkills[idx] = e.target.textContent;
                                if (editMode) {
                                  setLocalData({
                                    ...localData,
                                    skills: updatedSkills,
                                  });
                                } else {
                                  setResumeData({
                                    ...resumeData,
                                    skills: updatedSkills,
                                  });
                                }
                              }}
                              style={{
                                fontSize: "0.875rem",
                                color: "#374151",
                                flexGrow: 1,
                              }}
                              className="text-xs sm:text-sm text-gray-700 flex-1"
                            >
                              {skill}
                            </span>
                            {showButtons && (
                              <button
                                onClick={() =>
                                  handleRemoveSection("skills", idx)
                                }
                                style={{
                                  fontSize: "0.75rem",
                                  color: "#ef4444",
                                  border: "none",
                                  background: "none",
                                  cursor: "pointer",
                                  marginLeft: "0.5rem",
                                }}
                                className="text-xs text-red-500 hover:text-red-700 transition-colors duration-300 ml-2"
                              >
                                X
                              </button>
                            )}
                          </li>
                        )
                      )}
                    </ul>
                    {showButtons && (
                      <button
                        onClick={() => handleAddSection("skills")}
                        style={{
                          fontSize: "0.875rem",
                          color: "#3b82f6",
                          border: "none",
                          background: "none",
                          cursor: "pointer",
                          marginTop: "0.5rem",
                        }}
                        className="text-xs sm:text-sm text-blue-500 hover:text-blue-700 transition-colors duration-300 mt-2"
                      >
                        Add Skill
                      </button>
                    )}
                    {showButtons && (
                      <button
                        onClick={() => handleRemoveSection("skills")}
                        style={{
                          position: "absolute",
                          top: 0,
                          right: 0,
                          fontSize: "0.75rem",
                          color: "#ef4444",
                          border: "none",
                          background: "none",
                          cursor: "pointer",
                        }}
                        className="absolute top-0 right-0 text-xs text-red-500 hover:text-red-700 transition-colors duration-300"
                      >
                        X
                      </button>
                    )}
                  </div>
                )}

                {section === "courses" &&
                  sectionSettings.courses.showCourses && (
                    <div>
                      <h2
                        onClick={() => handleSectionClick("courses")}
                        onMouseEnter={() => handleSectionHover("courses")}
                        onMouseLeave={handleSectionLeave}
                        style={{
                          fontSize: "1.25rem",
                          fontWeight: "bold",
                          borderBottom: "2px solid #d1d5db",
                          paddingBottom: "0.25rem",
                          marginBottom: "0.5rem",
                        }}
                        className="text-lg sm:text-xl font-bold border-b-2 border-gray-300 pb-1 mb-2"
                      >
                        Courses
                      </h2>
                      {((editMode ? localData : resumeData).courses || []).map(
                        (course, idx) => (
                          <div key={idx} style={{ marginBottom: "1rem" }}>
                            <h3
                              contentEditable={editMode}
                              onBlur={(e) =>
                                handleInputChange(
                                  "courses",
                                  "title",
                                  e.target.textContent,
                                  idx
                                )
                              }
                              style={{
                                fontSize: "1.125rem",
                                fontWeight: "600",
                              }}
                              className="text-base sm:text-lg font-semibold"
                            >
                              {course.title}
                            </h3>
                            <p
                              contentEditable={editMode}
                              onBlur={(e) =>
                                handleInputChange(
                                  "courses",
                                  "description",
                                  e.target.textContent,
                                  idx
                                )
                              }
                              style={{
                                fontSize: "0.875rem",
                                color: "#374151",
                              }}
                              className="text-xs sm:text-sm text-gray-700"
                            >
                              {course.description}
                            </p>
                            {showButtons && (
                              <button
                                onClick={() =>
                                  handleRemoveSection("courses", idx)
                                }
                                style={{
                                  fontSize: "0.875rem",
                                  color: "#ef4444",
                                  border: "none",
                                  background: "none",
                                  cursor: "pointer",
                                }}
                                className="text-xs sm:text-sm text-red-500 hover:text-red-700 transition-colors duration-300"
                              >
                                Remove Course
                              </button>
                            )}
                          </div>
                        )
                      )}
                      {showButtons && (
                        <button
                          onClick={() => handleAddSection("courses")}
                          style={{
                            fontSize: "0.875rem",
                            color: "#3b82f6",
                            border: "none",
                            background: "none",
                            cursor: "pointer",
                          }}
                          className="text-xs sm:text-sm text-blue-500 hover:text-blue-700 transition-colors duration-300"
                        >
                          Add Course
                        </button>
                      )}
                      {showButtons && (
                        <button
                          onClick={() => handleRemoveSection("courses")}
                          style={{
                            position: "absolute",
                            top: 0,
                            right: 0,
                            fontSize: "0.75rem",
                            color: "#ef4444",
                            border: "none",
                            background: "none",
                            cursor: "pointer",
                          }}
                          className="absolute top-0 right-0 text-xs text-red-500 hover:text-red-700 transition-colors duration-300"
                        >
                          X
                        </button>
                      )}
                    </div>
                  )}

                {section === "projects" &&
                  sectionSettings.projects.showProjects && (
                    <div>
                      <h2
                        onClick={() => handleSectionClick("projects")}
                        onMouseEnter={() => handleSectionHover("projects")}
                        onMouseLeave={handleSectionLeave}
                        style={{
                          fontSize: "1.25rem",
                          fontWeight: "bold",
                          borderBottom: "2px solid #d1d5db",
                          paddingBottom: "0.25rem",
                          marginBottom: "0.5rem",
                        }}
                        className="text-lg sm:text-xl font-bold border-b-2 border-gray-300 pb-1 mb-2"
                      >
                        Projects
                      </h2>
                      {((editMode ? localData : resumeData).projects || []).map(
                        (project, idx) => (
                          <div key={idx} style={{ marginBottom: "1rem" }}>
                            <h3
                              contentEditable={editMode}
                              onBlur={(e) =>
                                handleInputChange(
                                  "projects",
                                  "name",
                                  e.target.textContent,
                                  idx
                                )
                              }
                              style={{
                                fontSize: "1.125rem",
                                fontWeight: "600",
                              }}
                              className="text-base sm:text-lg font-semibold"
                            >
                              {project.name || project.title}
                            </h3>
                            <p
                              contentEditable={editMode}
                              onBlur={(e) =>
                                handleInputChange(
                                  "projects",
                                  "description",
                                  e.target.textContent,
                                  idx
                                )
                              }
                              style={{
                                fontSize: "0.875rem",
                                color: "#374151",
                              }}
                              className="text-xs sm:text-sm text-gray-700"
                            >
                              {project.description}
                            </p>
                            {project.technologies && (
                              <p
                                style={{
                                  fontSize: "0.875rem",
                                  color: "#6b7280",
                                }}
                              >
                                <strong>Technologies:</strong>{" "}
                                {Array.isArray(project.technologies)
                                  ? project.technologies.join(", ")
                                  : project.technologies}
                              </p>
                            )}
                            {project.duration && (
                              <p
                                contentEditable={editMode}
                                onBlur={(e) =>
                                  handleInputChange(
                                    "projects",
                                    "duration",
                                    e.target.textContent,
                                    idx
                                  )
                                }
                                style={{
                                  fontSize: "0.875rem",
                                  color: "#6b7280",
                                }}
                                className="text-xs sm:text-sm text-gray-600"
                              >
                                {project.duration}
                              </p>
                            )}
                            {(project.link || project.github) && (
                              <div style={{ marginTop: "0.5rem" }}>
                                {project.link && (
                                  <a
                                    href={project.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={{
                                      color: "#3b82f6",
                                      marginRight: "1rem",
                                    }}
                                  >
                                    Live Demo
                                  </a>
                                )}
                                {project.github && (
                                  <a
                                    href={project.github}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={{ color: "#3b82f6" }}
                                  >
                                    GitHub
                                  </a>
                                )}
                              </div>
                            )}
                            {showButtons && (
                              <button
                                onClick={() =>
                                  handleRemoveSection("projects", idx)
                                }
                                style={{
                                  fontSize: "0.875rem",
                                  color: "#ef4444",
                                  border: "none",
                                  background: "none",
                                  cursor: "pointer",
                                }}
                                className="text-xs sm:text-sm text-red-500 hover:text-red-700 transition-colors duration-300"
                              >
                                Remove Project
                              </button>
                            )}
                          </div>
                        )
                      )}
                      {showButtons && (
                        <button
                          onClick={() => handleAddSection("projects")}
                          style={{
                            fontSize: "0.875rem",
                            color: "#3b82f6",
                            border: "none",
                            background: "none",
                            cursor: "pointer",
                          }}
                          className="text-xs sm:text-sm text-blue-500 hover:text-blue-700 transition-colors duration-300"
                        >
                          Add Project
                        </button>
                      )}
                      {showButtons && (
                        <button
                          onClick={() => handleRemoveSection("projects")}
                          style={{
                            position: "absolute",
                            top: 0,
                            right: 0,
                            fontSize: "0.75rem",
                            color: "#ef4444",
                            border: "none",
                            background: "none",
                            cursor: "pointer",
                          }}
                          className="absolute top-0 right-0 text-xs text-red-500 hover:text-red-700 transition-colors duration-300"
                        >
                          X
                        </button>
                      )}
                    </div>
                  )}
              </div>
            ))}
          </div>

          {/* Edit/Save Controls */}
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
                    border: "none",
                    cursor: "pointer",
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
                  backgroundColor: "#3b82f6",
                  color: "white",
                  padding: "0.5rem 1rem",
                  borderRadius: "0.375rem",
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

export default Template5;
