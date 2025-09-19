import React, { useState, useRef, useEffect } from "react";
import Sidebar from "../Sidebar/Sidebar";
import Navbar from "../Navbar/Navbar";
import { useResume } from "../../context/ResumeContext";
import { Download, Upload, Share, Settings, Edit, Plus, Save, Trash2, Bot, ArrowUp, ArrowDown, Mail } from "lucide-react";

const Template10 = () => {
  const resumeRef = useRef(null);
  const { resumeData, setResumeData } = useResume();
  const [editMode, setEditMode] = useState(false);
  const [localData, setLocalData] = useState(resumeData);
  const [sections, setSections] = useState(["header", "summary", "experience", "achievements", "projects", "education", "skills"]);
  const [isRearrangeMode, setIsRearrangeMode] = useState(false);
  const [editingSections, setEditingSections] = useState({});
  const [editingHeader, setEditingHeader] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

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
    setEditingSections({});
    setEditingHeader(false);
    setShowSuccessMessage(true);
    setTimeout(() => setShowSuccessMessage(false), 3000);
  };

  const handleCancel = () => {
    setLocalData(resumeData);
    setEditMode(false);
    setEditingSections({});
    setEditingHeader(false);
  };

  const handleEnhance = (section) => {
  };

  const moveSection = (index, direction) => {
    const newSections = [...sections];
    if (direction === "up" && index > 0) {
      [newSections[index], newSections[index - 1]] = [newSections[index - 1], newSections[index]];
    } else if (direction === "down" && index < sections.length - 1) {
      [newSections[index], newSections[index + 1]] = [newSections[index + 1], newSections[index]];
    }
    setSections(newSections);
  };

  const handleEdit = (section) => {
    setEditMode(true);
    setEditingSections({ ...editingSections, [section]: true });
  };

  const handleEditHeader = () => {
    setEditMode(true);
    setEditingHeader(true);
  };

  const handleSaveSection = (section) => {
    setEditingSections({ ...editingSections, [section]: false });
  };

  const handleDelete = (section, id = null) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      if (id !== null) {
        const updatedContent = localData[section].filter(item => item.id !== id);
        setLocalData({ ...localData, [section]: updatedContent });
      }
    }
  };

  const handleAddExperience = () => {
    const newExperience = {
      id: Date.now(),
      title: "New Position",
      companyName: "Company Name",
      date: "Start - End",
      companyLocation: "Location",
      accomplishment: ["New achievement"]
    };
    setLocalData({
      ...localData,
      experience: [...localData.experience, newExperience]
    });
    handleEdit('experience');
  };

  const handleAddEducation = () => {
    const newEducation = {
      id: Date.now(),
      degree: "New Degree",
      institution: "Institution Name",
      duration: "Year - Year",
      location: "Location"
    };
    setLocalData({
      ...localData,
      education: [...localData.education, newEducation]
    });
    handleEdit('education');
  };

  const handleAddProject = () => {
    const newProject = {
      id: Date.now(),
      name: "New Project",
      description: "Project description here",
      technologies: ["React", "Node.js"],
      link: "",
      github: ""
    };
    setLocalData({
      ...localData,
      projects: [...localData.projects, newProject]
    });
    handleEdit('projects');
  };

  const handleAddCertification = () => {
    const newCertification = {
      id: Date.now(),
      title: "New Certification",
      issuer: "Issuer",
      date: "Date"
    };
    setLocalData({
      ...localData,
      certifications: [...localData.certifications, newCertification]
    });
    handleEdit('certifications');
  };

  const handleAddAchievement = () => {
    const currentAchievements = localData.achievements || [];
    setLocalData({
      ...localData,
      achievements: [...currentAchievements, "New achievement"]
    });
    handleEdit('achievements');
  };

  const handleContentChange = (section, value, field = null, id = null) => {
    if (section === 'header') {
      if (field === 'name' || field === 'role') {
        setLocalData({
          ...localData,
          [field]: value
        });
      } else {
        setLocalData({
          ...localData,
          [field]: value
        });
      }
    } else if (section === 'summary') {
      setLocalData({
        ...localData,
        summary: value
      });
    } else if (id !== null) {
      const updatedContent = localData[section].map(item => {
        if (item.id === id) {
          return { ...item, [field]: value };
        }
        return item;
      });
      setLocalData({ ...localData, [section]: updatedContent });
    }
  };

  const SuccessMessage = () => (
    <div style={{
      position: "fixed",
      bottom: "1rem",
      right: "1rem",
      backgroundColor: "#10b981",
      color: "white",
      padding: "0.5rem 1rem",
      borderRadius: "0.5rem",
      boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
      zIndex: 1000
    }}>
      Changes saved successfully!
    </div>
  );

  const SectionButtons = ({ section }) => (
    <div style={{
      display: editMode ? "flex" : "none",
      gap: "0.5rem",
      position: "absolute",
      right: "0",
      top: "0",
      backgroundColor: "rgba(255,255,255,0.9)",
      padding: "0.5rem",
      borderRadius: "0.5rem",
      boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
      zIndex: 10
    }}>
      {(section === 'experience' || section === 'education' || section === 'projects' || section === 'certifications' || section === 'achievements') && (
        <button
          onClick={() => {
            if (section === 'experience') handleAddExperience();
            else if (section === 'education') handleAddEducation();
            else if (section === 'projects') handleAddProject();
            else if (section === 'certifications') handleAddCertification();
            else if (section === 'achievements') handleAddAchievement();
          }}
          style={{
            color: "#10b981",
            border: "none",
            background: "none",
            cursor: "pointer",
            padding: "0.25rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}
          title="Add new item"
        >
          <Plus size={18} />
        </button>
      )}
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f3f4f6" }}>
      <Navbar />
      <div style={{ display: "flex" }}>
        <Sidebar onEnhance={handleEnhance} resumeRef={resumeRef} />

        <div style={{ 
          flexGrow: 1, 
          padding: "2.5rem", 
          display: "flex", 
          flexDirection: "column", 
          alignItems: "center",
          overflowY: "auto"
        }}>
          <div
            ref={resumeRef}
            style={{
              backgroundColor: "#fff",
              color: "#111827",
              maxWidth: "64rem",
              width: "100%",
              boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
              borderRadius: "0.5rem",
              position: "relative"
            }}
          >
            {showSuccessMessage && <SuccessMessage />}
            
            {sections.map((sectionName) => {
              switch (sectionName) {
                case 'header':
                  return (
                    <header key={sectionName} style={{ 
                      marginBottom: "2rem", 
                      position: "relative",
                      padding: "2rem"
                    }}>
                      <div style={{ 
                        display: "flex", 
                        flexDirection: "column", 
                        justifyContent: "space-between", 
                        width: "100%", 
                        gap: "1rem"
                      }}>
                        <div style={{ flex: 1 }}>
                          {editMode ? (
                            <>
                              <input
                                style={{
                                  fontSize: "3rem",
                                  fontWeight: "bold",
                                  width: "100%",
                                  marginBottom: "0.5rem",
                                  padding: "0.25rem",
                                  border: "1px solid #d1d5db",
                                  borderRadius: "0.25rem",
                                  backgroundColor: "#fff"
                                }}
                                value={localData.name}
                                onChange={(e) => handleContentChange('header', e.target.value, 'name')}
                              />
                              <input
                                style={{
                                  fontSize: "1.125rem",
                                  color: "#6b7280",
                                  width: "100%",
                                  padding: "0.25rem",
                                  border: "1px solid #d1d5db",
                                  borderRadius: "0.25rem",
                                  backgroundColor: "#fff"
                                }}
                                value={localData.role}
                                onChange={(e) => handleContentChange('header', e.target.value, 'role')}
                              />
                            </>
                          ) : (
                            <>
                              <h1 style={{ fontSize: "3rem", fontWeight: "bold", margin: "0" }}>{localData.name}</h1>
                              <p style={{ fontSize: "1.125rem", color: "#6b7280", margin: "0" }}>{localData.role}</p>
                            </>
                          )}
                        </div>
                        <div style={{ color: "#6b7280", fontSize: "0.875rem" }}>
                          {editMode ? (
                            <>
                              <input
                                style={{
                                  display: "block",
                                  width: "100%",
                                  marginBottom: "0.25rem",
                                  padding: "0.25rem",
                                  border: "1px solid #d1d5db",
                                  borderRadius: "0.25rem",
                                  backgroundColor: "#fff"
                                }}
                                value={localData.phone}
                                onChange={(e) => handleContentChange('header', e.target.value, 'phone')}
                              />
                              <input
                                style={{
                                  display: "block",
                                  width: "100%",
                                  marginBottom: "0.25rem",
                                  padding: "0.25rem",
                                  border: "1px solid #d1d5db",
                                  borderRadius: "0.25rem",
                                  backgroundColor: "#fff"
                                }}
                                value={localData.email}
                                onChange={(e) => handleContentChange('header', e.target.value, 'email')}
                              />
                              <input
                                style={{
                                  display: "block",
                                  width: "100%",
                                  padding: "0.25rem",
                                  border: "1px solid #d1d5db",
                                  borderRadius: "0.25rem",
                                  backgroundColor: "#fff"
                                }}
                                value={localData.location}
                                onChange={(e) => handleContentChange('header', e.target.value, 'location')}
                              />
                            </>
                          ) : (
                            <>
                              <div style={{ marginBottom: "0.25rem" }}>{localData.phone}</div>
                              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.25rem" }}>
                                <Mail size={16} /> {localData.email}
                              </div>
                              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                                  <circle cx="12" cy="10" r="3"></circle>
                                </svg>
                                {localData.location}
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    </header>
                  );

                case 'summary':
                  return localData.summary && (
                    <section key={sectionName} style={{ 
                      marginBottom: "2rem", 
                      position: "relative",
                      padding: "0 2rem"
                    }}>
                      <h2 style={{ fontSize: "2rem", fontWeight: "bold", marginBottom: "1rem" }}>Summary</h2>
                      <div style={{ borderBottom: "1px solid #d1d5db", marginBottom: "2rem" }}></div>
                      <SectionButtons section="summary" />
                      {editMode ? (
                        <textarea
                          style={{
                            width: "100%",
                            padding: "0.5rem",
                            border: "1px solid #d1d5db",
                            borderRadius: "0.25rem",
                            backgroundColor: "#fff",
                            minHeight: "4rem",
                            resize: "vertical"
                          }}
                          value={localData.summary}
                          onChange={(e) => handleContentChange('summary', e.target.value)}
                          rows={4}
                        />
                      ) : (
                        <p style={{ color: "#374151" }}>{localData.summary}</p>
                      )}
                    </section>
                  );

                case 'experience':
                  return (
                    <section key={sectionName} style={{ 
                      marginBottom: "2rem", 
                      position: "relative",
                      padding: "0 2rem"
                    }}>
                      <h2 style={{ fontSize: "2rem", fontWeight: "bold", marginBottom: "1.5rem" }}>Experience</h2>
                      <div style={{ borderBottom: "1px solid #d1d5db", marginBottom: "2rem" }}></div>
                      <SectionButtons section="experience" />
                      {localData.experience.map((exp, idx) => (
                        <div key={exp.id || idx} style={{ 
                          marginBottom: "1.5rem", 
                          position: "relative", 
                          border: "1px solid #e5e7eb", 
                          padding: "1rem", 
                          borderRadius: "0.5rem" 
                        }}>
                          <div style={{ 
                            display: "flex", 
                            flexDirection: "column", 
                            justifyContent: "space-between", 
                            alignItems: "flex-start", 
                            marginBottom: "0.5rem" 
                          }}>
                            {editMode ? (
                              <>
                                <input
                                  style={{
                                    fontSize: "1.25rem",
                                    fontWeight: "600",
                                    border: "1px solid #d1d5db",
                                    borderRadius: "0.25rem",
                                    padding: "0.5rem",
                                    marginBottom: "0.5rem",
                                    width: "100%",
                                    backgroundColor: "#fff"
                                  }}
                                  value={exp.title}
                                  onChange={(e) => handleArrayFieldChange('experience', idx, 'title', e.target.value)}
                                />
                                <input
                                  style={{
                                    color: "#6b7280",
                                    border: "1px solid #d1d5db",
                                    borderRadius: "0.25rem",
                                    padding: "0.5rem",
                                    width: "100%",
                                    marginBottom: "0.5rem",
                                    backgroundColor: "#fff"
                                  }}
                                  value={exp.companyName}
                                  onChange={(e) => handleArrayFieldChange('experience', idx, 'companyName', e.target.value)}
                                />
                                <input
                                  style={{
                                    color: "#6b7280",
                                    border: "1px solid #d1d5db",
                                    borderRadius: "0.25rem",
                                    padding: "0.5rem",
                                    width: "100%",
                                    marginBottom: "0.5rem",
                                    backgroundColor: "#fff"
                                  }}
                                  value={exp.date}
                                  onChange={(e) => handleArrayFieldChange('experience', idx, 'date', e.target.value)}
                                />
                                <input
                                  style={{
                                    color: "#6b7280",
                                    border: "1px solid #d1d5db",
                                    borderRadius: "0.25rem",
                                    padding: "0.5rem",
                                    width: "100%",
                                    backgroundColor: "#fff"
                                  }}
                                  value={exp.companyLocation}
                                  onChange={(e) => handleArrayFieldChange('experience', idx, 'companyLocation', e.target.value)}
                                />
                              </>
                            ) : (
                              <>
                                <h3 style={{ fontSize: "1.25rem", fontWeight: "600", margin: "0" }}>{exp.title}</h3>
                                <span style={{ color: "#6b7280" }}>{exp.companyName} ({exp.date}) - {exp.companyLocation}</span>
                              </>
                            )}
                          </div>
                          {editMode ? (
                            <textarea
                              style={{
                                width: "100%",
                                padding: "0.5rem",
                                border: "1px solid #d1d5db",
                                borderRadius: "0.25rem",
                                marginTop: "0.5rem",
                                backgroundColor: "#fff",
                                minHeight: "3rem",
                                resize: "vertical"
                              }}
                              value={exp.accomplishment?.join('\n') || ''}
                              onChange={(e) => handleArrayFieldChange('experience', idx, 'accomplishment', e.target.value.split('\n'))}
                              rows={3}
                            />
                          ) : (
                            <ul style={{ marginTop: "0.5rem", paddingLeft: "1.25rem" }}>
                              {exp.accomplishment?.map((a, i) => (
                                <li key={i} style={{ color: "#374151" }}>{a}</li>
                              ))}
                            </ul>
                          )}
                          <button
                            onClick={() => handleDelete('experience', exp.id || idx)}
                            style={{
                              position: "absolute",
                              top: "0.5rem",
                              right: "0.5rem",
                              color: "#ef4444",
                              border: "none",
                              background: "none",
                              cursor: "pointer",
                              display: editMode ? "block" : "none",
                              padding: "0.25rem"
                            }}
                            title="Delete this experience"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      ))}
                    </section>
                  );

                case 'achievements':
                  return localData.achievements && localData.achievements.length > 0 && (
                    <section key={sectionName} style={{ 
                      marginBottom: "2rem", 
                      position: "relative",
                      padding: "0 2rem"
                    }}>
                      <h2 style={{ fontSize: "2rem", fontWeight: "bold", marginBottom: "1rem" }}>Achievements</h2>
                      <div style={{ borderBottom: "1px solid #d1d5db", marginBottom: "2rem" }}></div>
                      <SectionButtons section="achievements" />
                      {editMode ? (
                        <div>
                          {localData.achievements.map((achievement, idx) => (
                            <div key={idx} style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
                              <textarea
                                style={{
                                  flex: 1,
                                  padding: "0.5rem",
                                  border: "1px solid #d1d5db",
                                  borderRadius: "0.25rem",
                                  backgroundColor: "#fff",
                                  minHeight: "2rem",
                                  resize: "vertical"
                                }}
                                value={achievement}
                                onChange={(e) => {
                                  const updatedAchievements = [...localData.achievements];
                                  updatedAchievements[idx] = e.target.value;
                                  handleFieldChange('achievements', updatedAchievements);
                                }}
                                rows={1}
                              />
                              <button
                                onClick={() => {
                                  const updatedAchievements = localData.achievements.filter((_, index) => index !== idx);
                                  handleFieldChange('achievements', updatedAchievements);
                                }}
                                style={{
                                  color: "#ef4444",
                                  border: "none",
                                  background: "none",
                                  cursor: "pointer",
                                  padding: "0.25rem"
                                }}
                                title="Delete this achievement"
                              >
                                <Trash2 size={18} />
                              </button>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <ul style={{ paddingLeft: "1.25rem" }}>
                          {localData.achievements.map((item, i) => (
                            <li key={i} style={{ color: "#374151" }}>{item}</li>
                          ))}
                        </ul>
                      )}
                    </section>
                  );

                case 'projects':
                  return (
                    <section key={sectionName} style={{ 
                      marginBottom: "2rem", 
                      position: "relative",
                      padding: "0 2rem"
                    }}>
                      <h2 style={{ fontSize: "2rem", fontWeight: "bold", marginBottom: "1rem" }}>Projects</h2>
                      <div style={{ borderBottom: "1px solid #d1d5db", marginBottom: "2rem" }}></div>
                      <SectionButtons section="projects" />
                      {localData.projects.map((proj, idx) => (
                        <div key={proj.id || idx} style={{ 
                          marginBottom: "1.5rem", 
                          position: "relative", 
                          border: "1px solid #e5e7eb", 
                          padding: "1rem", 
                          borderRadius: "0.5rem" 
                        }}>
                          <div style={{ 
                            display: "flex", 
                            flexDirection: "column", 
                            justifyContent: "space-between", 
                            alignItems: "flex-start", 
                            marginBottom: "0.5rem" 
                          }}>
                            {editMode ? (
                              <>
                                <input
                                  style={{
                                    fontSize: "1.25rem",
                                    fontWeight: "600",
                                    border: "1px solid #d1d5db",
                                    borderRadius: "0.25rem",
                                    padding: "0.5rem",
                                    marginBottom: "0.5rem",
                                    width: "100%",
                                    backgroundColor: "#fff"
                                  }}
                                  value={proj.name}
                                  onChange={(e) => handleArrayFieldChange('projects', idx, 'name', e.target.value)}
                                />
                                <textarea
                                  style={{
                                    width: "100%",
                                    padding: "0.5rem",
                                    border: "1px solid #d1d5db",
                                    borderRadius: "0.25rem",
                                    marginTop: "0.5rem",
                                    marginBottom: "0.5rem",
                                    backgroundColor: "#fff",
                                    minHeight: "3rem",
                                    resize: "vertical"
                                  }}
                                  value={proj.description}
                                  onChange={(e) => handleArrayFieldChange('projects', idx, 'description', e.target.value)}
                                  rows={3}
                                />
                                <input
                                  style={{
                                    width: "100%",
                                    padding: "0.5rem",
                                    border: "1px solid #d1d5db",
                                    borderRadius: "0.25rem",
                                    backgroundColor: "#fff",
                                    marginBottom: "0.5rem"
                                  }}
                                  value={proj.technologies?.join(', ') || ''}
                                  onChange={(e) => handleArrayFieldChange('projects', idx, 'technologies', e.target.value.split(',').map(t => t.trim()))}
                                  placeholder="Technologies used"
                                />
                                <input
                                  style={{
                                    width: "100%",
                                    padding: "0.5rem",
                                    border: "1px solid #d1d5db",
                                    borderRadius: "0.25rem",
                                    backgroundColor: "#fff",
                                    marginBottom: "0.5rem"
                                  }}
                                  value={proj.link || ''}
                                  onChange={(e) => handleArrayFieldChange('projects', idx, 'link', e.target.value)}
                                  placeholder="Live Link"
                                />
                                <input
                                  style={{
                                    width: "100%",
                                    padding: "0.5rem",
                                    border: "1px solid #d1d5db",
                                    borderRadius: "0.25rem",
                                    backgroundColor: "#fff"
                                  }}
                                  value={proj.github || ''}
                                  onChange={(e) => handleArrayFieldChange('projects', idx, 'github', e.target.value)}
                                  placeholder="GitHub Link"
                                />
                              </>
                            ) : (
                              <>
                                <h3 style={{ fontSize: "1.25rem", fontWeight: "600", margin: "0" }}>{proj.name}</h3>
                                <p style={{ color: "#374151", marginTop: "0.5rem" }}>{proj.description}</p>
                                <p style={{ color: "#6b7280", marginTop: "0.5rem" }}>
                                  <span style={{ fontWeight: "500" }}>Technologies:</span> {proj.technologies?.join(', ')}
                                </p>
                                {(proj.link || proj.github) && (
                                  <p style={{ marginTop: "0.5rem" }}>
                                    {proj.link && <a href={proj.link} style={{ color: "#3b82f6", marginRight: "1rem" }}>Live</a>}
                                    {proj.github && <a href={proj.github} style={{ color: "#3b82f6" }}>GitHub</a>}
                                  </p>
                                )}
                              </>
                            )}
                          </div>
                          <button
                            onClick={() => handleDelete('projects', proj.id || idx)}
                            style={{
                              position: "absolute",
                              top: "0.5rem",
                              right: "0.5rem",
                              color: "#ef4444",
                              border: "none",
                              background: "none",
                              cursor: "pointer",
                              display: editMode ? "block" : "none",
                              padding: "0.25rem"
                            }}
                            title="Delete this project"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      ))}
                    </section>
                  );

                case 'education':
                  return (
                    <section key={sectionName} style={{ 
                      marginBottom: "2rem", 
                      position: "relative",
                      padding: "0 2rem"
                    }}>
                      <h2 style={{ fontSize: "2rem", fontWeight: "bold", marginBottom: "1rem" }}>Education</h2>
                      <div style={{ borderBottom: "1px solid #d1d5db", marginBottom: "2rem" }}></div>
                      <SectionButtons section="education" />
                      {localData.education.map((edu, idx) => (
                        <div key={edu.id || idx} style={{ 
                          marginBottom: "1rem", 
                          position: "relative", 
                          border: "1px solid #e5e7eb", 
                          padding: "1rem", 
                          borderRadius: "0.5rem" 
                        }}>
                          <div style={{ 
                            display: "flex", 
                            flexDirection: "column", 
                            justifyContent: "space-between", 
                            alignItems: "flex-start" 
                          }}>
                            <div style={{ flex: 1 }}>
                              {editMode ? (
                                <>
                                  <input
                                    style={{
                                      fontSize: "1.25rem",
                                      fontWeight: "600",
                                      border: "1px solid #d1d5db",
                                      borderRadius: "0.25rem",
                                      padding: "0.5rem",
                                      marginBottom: "0.5rem",
                                      width: "100%",
                                      backgroundColor: "#fff"
                                    }}
                                    value={edu.institution}
                                    onChange={(e) => handleArrayFieldChange('education', idx, 'institution', e.target.value)}
                                  />
                                  <input
                                    style={{
                                      color: "#374151",
                                      border: "1px solid #d1d5db",
                                      borderRadius: "0.25rem",
                                      padding: "0.5rem",
                                      width: "100%",
                                      backgroundColor: "#fff"
                                    }}
                                    value={edu.degree}
                                    onChange={(e) => handleArrayFieldChange('education', idx, 'degree', e.target.value)}
                                  />
                                </>
                              ) : (
                                <>
                                  <h3 style={{ fontSize: "1.25rem", fontWeight: "600", margin: "0" }}>{edu.institution}</h3>
                                  <p style={{ color: "#374151", margin: "0" }}>{edu.degree}</p>
                                </>
                              )}
                            </div>
                            <div style={{ marginTop: "0.5rem" }}>
                              {editMode ? (
                                <>
                                  <input
                                    style={{
                                      color: "#6b7280",
                                      border: "1px solid #d1d5db",
                                      borderRadius: "0.25rem",
                                      padding: "0.5rem",
                                      width: "100%",
                                      marginBottom: "0.5rem",
                                      backgroundColor: "#fff"
                                    }}
                                    value={edu.duration}
                                    onChange={(e) => handleArrayFieldChange('education', idx, 'duration', e.target.value)}
                                  />
                                  <input
                                    style={{
                                      color: "#6b7280",
                                      border: "1px solid #d1d5db",
                                      borderRadius: "0.25rem",
                                      padding: "0.5rem",
                                      width: "100%",
                                      backgroundColor: "#fff"
                                    }}
                                    value={edu.location}
                                    onChange={(e) => handleArrayFieldChange('education', idx, 'location', e.target.value)}
                                  />
                                </>
                              ) : (
                                <span style={{ color: "#6b7280" }}>{edu.duration} - {edu.location}</span>
                              )}
                            </div>
                          </div>
                          <button
                            onClick={() => handleDelete('education', edu.id || idx)}
                            style={{
                              position: "absolute",
                              top: "0.5rem",
                              right: "0.5rem",
                              color: "#ef4444",
                              border: "none",
                              background: "none",
                              cursor: "pointer",
                              display: editMode ? "block" : "none",
                              padding: "0.25rem"
                            }}
                            title="Delete this education"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      ))}
                    </section>
                  );

                case 'skills':
                  return (
                    <section key={sectionName} style={{ 
                      marginBottom: "2rem", 
                      position: "relative",
                      padding: "0 2rem 2rem 2rem"
                    }}>
                      <h2 style={{ fontSize: "2rem", fontWeight: "bold", marginBottom: "1rem" }}>Skills</h2>
                      <div style={{ borderBottom: "1px solid #d1d5db", marginBottom: "2rem" }}></div>
                      <SectionButtons section="skills" />
                      
                      {/* Technical Skills */}
                      <div style={{ marginBottom: "1rem" }}>
                        <h3 style={{ fontSize: "1.125rem", fontWeight: "600", marginBottom: "0.5rem" }}>Technical Skills:</h3>
                        {editMode ? (
                          <input
                            style={{
                              width: "100%",
                              padding: "0.5rem",
                              border: "1px solid #d1d5db",
                              borderRadius: "0.25rem",
                              backgroundColor: "#fff"
                            }}
                            value={localData.skills?.join(', ') || ''}
                            onChange={(e) => handleFieldChange('skills', e.target.value.split(',').map(s => s.trim()))}
                          />
                        ) : (
                          <p style={{ color: "#374151" }}>{localData.skills?.join(' • ') || 'No skills listed'}</p>
                        )}
                      </div>

                      {/* Languages */}
                      {localData.languages && localData.languages.length > 0 && (
                        <div style={{ marginBottom: "1rem" }}>
                          <h3 style={{ fontSize: "1.125rem", fontWeight: "600", marginBottom: "0.5rem" }}>Languages:</h3>
                          {editMode ? (
                            <input
                              style={{
                                width: "100%",
                                padding: "0.5rem",
                                border: "1px solid #d1d5db",
                                borderRadius: "0.25rem",
                                backgroundColor: "#fff"
                              }}
                              value={localData.languages?.join(', ') || ''}
                              onChange={(e) => handleFieldChange('languages', e.target.value.split(',').map(s => s.trim()))}
                            />
                          ) : (
                            <p style={{ color: "#374151" }}>{localData.languages?.join(' • ')}</p>
                          )}
                        </div>
                      )}

                      {/* Interests */}
                      {localData.interests && localData.interests.length > 0 && (
                        <div>
                          <h3 style={{ fontSize: "1.125rem", fontWeight: "600", marginBottom: "0.5rem" }}>Interests:</h3>
                          {editMode ? (
                            <input
                              style={{
                                width: "100%",
                                padding: "0.5rem",
                                border: "1px solid #d1d5db",
                                borderRadius: "0.25rem",
                                backgroundColor: "#fff"
                              }}
                              value={localData.interests?.join(', ') || ''}
                              onChange={(e) => handleFieldChange('interests', e.target.value.split(',').map(s => s.trim()))}
                            />
                          ) : (
                            <p style={{ color: "#374151" }}>{localData.interests?.join(' • ')}</p>
                          )}
                        </div>
                      )}
                    </section>
                  );

                default:
                  return null;
              }
            })}
          </div>

          {/* Global Edit Controls */}
          <div style={{ 
            marginTop: "1rem", 
            textAlign: "center",
            display: "flex",
            gap: "0.5rem",
            justifyContent: "center",
            flexWrap: "wrap"
          }}>
            {editMode ? (
              <>
                <button
                  onClick={handleSave}
                  style={{
                    backgroundColor: "#10b981",
                    color: "white",
                    padding: "0.5rem 1rem",
                    borderRadius: "0.375rem",
                    border: "none",
                    cursor: "pointer",
                    fontWeight: "500"
                  }}
                >
                  Save All Changes
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
                    fontWeight: "500"
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
                  fontWeight: "500"
                }}
              >
                Edit Resume
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Responsive Styles */}
      <style jsx>{`
        @media (max-width: 768px) {
          .flex {
            flex-direction: column;
          }
          .max-w-4xl {
            max-width: 100%;
            padding: 1rem;
          }
          header .flex {
            flex-direction: column;
            align-items: flex-start;
          }
          .text-right {
            text-align: left !important;
          }
          .control-buttons {
            right: 1rem;
            top: 0.5rem;
          }
          div[style*="padding: \"2.5rem\""] {
            padding: 1rem !important;
          }
          div[style*="padding: \"2rem\""] {
            padding: 1rem !important;
          }
          div[style*="padding: \"0 2rem\""] {
            padding: 0 1rem !important;
          }
          div[style*="padding: \"0 2rem 2rem 2rem\""] {
            padding: 0 1rem 1rem 1rem !important;
          }
          h1[style*="fontSize: \"3rem\""] {
            font-size: 2rem !important;
          }
          h2[style*="fontSize: \"2rem\""] {
            font-size: 1.5rem !important;
          }
          h3[style*="fontSize: \"1.25rem\""] {
            font-size: 1.125rem !important;
          }
          input[style*="fontSize: \"3rem\""] {
            font-size: 2rem !important;
          }
          input[style*="fontSize: \"1.25rem\""] {
            font-size: 1.125rem !important;
          }
        }
        @media print {
          div[style*="position: \"absolute\""] {
            display: none !important;
          }
          button {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
};

export default Template10;