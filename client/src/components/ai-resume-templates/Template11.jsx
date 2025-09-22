import React, { useState, useRef, useEffect } from "react";
import Sidebar from "../Sidebar/Sidebar";
import Navbar from "../Navbar/Navbar";
import { useResume } from "../../context/ResumeContext";

const Template7 = () => {
  const resumeRef = useRef(null);
  const { resumeData, setResumeData } = useResume();
  const [editMode, setEditMode] = useState(false);
  const [localData, setLocalData] = useState(resumeData);

  // Form states for adding/editing entries
  const [showExperienceForm, setShowExperienceForm] = useState(false);
  const [showEducationForm, setShowEducationForm] = useState(false);
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [showCertificationForm, setShowCertificationForm] = useState(false);
  const [showSkillForm, setShowSkillForm] = useState(false);

  // Editing states
  const [editingExperience, setEditingExperience] = useState(null);
  const [editingEducation, setEditingEducation] = useState(null);
  const [editingProject, setEditingProject] = useState(null);
  const [editingCertification, setEditingCertification] = useState(null);

  // New entry states
  const [newExperience, setNewExperience] = useState({
    title: "",
    companyName: "",
    date: "",
    companyLocation: "",
    accomplishment: "",
  });
  const [newEducation, setNewEducation] = useState({
    degree: "",
    institution: "",
    duration: "",
    location: "",
  });
  const [newProject, setNewProject] = useState({
    name: "",
    description: "",
    technologies: "",
    link: "",
    github: "",
  });
  const [newCertification, setNewCertification] = useState({
    title: "",
    issuer: "",
    date: "",
  });
  const [newSkill, setNewSkill] = useState("");

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

  const handleEnhance = (section) => {
  };

  // Experience handlers
  const addOrUpdateExperience = (e) => {
    e.preventDefault();
    if (!newExperience.title || !newExperience.companyName || !newExperience.date) return;

    const experienceData = {
      ...newExperience,
      accomplishment: newExperience.accomplishment.split("\n").filter(item => item.trim())
    };

    if (editingExperience !== null) {
      const updated = [...localData.experience];
      updated[editingExperience] = experienceData;
      setLocalData({ ...localData, experience: updated });
      setEditingExperience(null);
    } else {
      setLocalData({
        ...localData,
        experience: [...localData.experience, experienceData]
      });
    }

    setShowExperienceForm(false);
    setNewExperience({ title: "", companyName: "", date: "", companyLocation: "", accomplishment: "" });
  };

  const removeExperience = (index) => {
    const updated = localData.experience.filter((_, i) => i !== index);
    setLocalData({ ...localData, experience: updated });
  };

  const editExperience = (index) => {
    const exp = localData.experience[index];
    setEditingExperience(index);
    setNewExperience({
      ...exp,
      accomplishment: exp.accomplishment.join("\n")
    });
    setShowExperienceForm(true);
  };

  // Education handlers
  const addOrUpdateEducation = (e) => {
    e.preventDefault();
    if (!newEducation.degree || !newEducation.institution || !newEducation.duration) return;

    if (editingEducation !== null) {
      const updated = [...localData.education];
      updated[editingEducation] = newEducation;
      setLocalData({ ...localData, education: updated });
      setEditingEducation(null);
    } else {
      setLocalData({
        ...localData,
        education: [...localData.education, newEducation]
      });
    }

    setShowEducationForm(false);
    setNewEducation({ degree: "", institution: "", duration: "", location: "" });
  };

  const removeEducation = (index) => {
    const updated = localData.education.filter((_, i) => i !== index);
    setLocalData({ ...localData, education: updated });
  };

  const editEducation = (index) => {
    const edu = localData.education[index];
    setEditingEducation(index);
    setNewEducation(edu);
    setShowEducationForm(true);
  };

  // Project handlers
  const addOrUpdateProject = (e) => {
    e.preventDefault();
    if (!newProject.name || !newProject.description) return;

    const projectData = {
      ...newProject,
      technologies: newProject.technologies.split(",").map(tech => tech.trim()).filter(tech => tech)
    };

    if (editingProject !== null) {
      const updated = [...localData.projects];
      updated[editingProject] = projectData;
      setLocalData({ ...localData, projects: updated });
      setEditingProject(null);
    } else {
      setLocalData({
        ...localData,
        projects: [...localData.projects, projectData]
      });
    }

    setShowProjectForm(false);
    setNewProject({ name: "", description: "", technologies: "", link: "", github: "" });
  };

  const removeProject = (index) => {
    const updated = localData.projects.filter((_, i) => i !== index);
    setLocalData({ ...localData, projects: updated });
  };

  const editProject = (index) => {
    const proj = localData.projects[index];
    setEditingProject(index);
    setNewProject({
      ...proj,
      technologies: proj.technologies.join(", ")
    });
    setShowProjectForm(true);
  };

  // Certification handlers
  const addOrUpdateCertification = (e) => {
    e.preventDefault();
    if (!newCertification.title || !newCertification.issuer || !newCertification.date) return;

    if (editingCertification !== null) {
      const updated = [...localData.certifications];
      updated[editingCertification] = newCertification;
      setLocalData({ ...localData, certifications: updated });
      setEditingCertification(null);
    } else {
      setLocalData({
        ...localData,
        certifications: [...localData.certifications, newCertification]
      });
    }

    setShowCertificationForm(false);
    setNewCertification({ title: "", issuer: "", date: "" });
  };

  const removeCertification = (index) => {
    const updated = localData.certifications.filter((_, i) => i !== index);
    setLocalData({ ...localData, certifications: updated });
  };

  const editCertification = (index) => {
    const cert = localData.certifications[index];
    setEditingCertification(index);
    setNewCertification(cert);
    setShowCertificationForm(true);
  };

  // Skill handlers
  const addSkill = (e) => {
    e.preventDefault();
    if (!newSkill.trim()) return;
    setLocalData({
      ...localData,
      skills: [...localData.skills, newSkill.trim()]
    });
    setNewSkill("");
    setShowSkillForm(false);
  };

  const removeSkill = (index) => {
    const updated = localData.skills.filter((_, i) => i !== index);
    setLocalData({ ...localData, skills: updated });
  };

  const removeArrayItem = (section, index) => {
    const updated = localData[section].filter((_, i) => i !== index);
    setLocalData({ ...localData, [section]: updated });
  };

  const addArrayItem = (section, item) => {
    setLocalData({
      ...localData,
      [section]: [...localData[section], item]
    });
  };

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
          marginLeft: "0"
        }}>
          <div
            ref={resumeRef}
            style={{
              backgroundColor: "#fff",
              color: "#111827",
              maxWidth: "64rem",
              width: "100%",
              padding: "2rem",
              boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
              borderRadius: "0.5rem",
            }}
          >
            {/* Header */}
            <div style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "1.5rem",
              flexDirection: "column",
              gap: "1rem"
            }}>
              <div style={{ textAlign: "center" }}>
                {editMode ? (
                  <>
                    <input
                      type="text"
                      value={localData.name}
                      onChange={(e) => handleFieldChange("name", e.target.value)}
                      style={{
                        fontSize: "2rem",
                        fontWeight: "bold",
                        display: "block",
                        width: "100%",
                        textAlign: "center",
                        border: "1px solid #ccc",
                        borderRadius: "4px",
                        padding: "8px",
                        marginBottom: "8px"
                      }}
                    />
                    <input
                      type="text"
                      value={localData.role}
                      onChange={(e) => handleFieldChange("role", e.target.value)}
                      style={{
                        fontSize: "1.2rem",
                        color: "#6b7280",
                        width: "100%",
                        textAlign: "center",
                        border: "1px solid #ccc",
                        borderRadius: "4px",
                        padding: "8px"
                      }}
                    />
                  </>
                ) : (
                  <>
                    <h1 style={{ fontSize: "2rem", fontWeight: "bold", margin: "0" }}>
                      {localData.name}
                    </h1>
                    <h2 style={{ fontSize: "1.2rem", color: "#6b7280", margin: "0.5rem 0" }}>
                      {localData.role}
                    </h2>
                  </>
                )}
              </div>

              <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                gap: "0.5rem",
                fontSize: "0.9rem"
              }}>
                {["email", "phone", "location", "linkedin", "github", "portfolio"].map((field) =>
                  editMode ? (
                    <input
                      key={field}
                      type="text"
                      value={localData[field] || ""}
                      onChange={(e) => handleFieldChange(field, e.target.value)}
                      placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                      style={{
                        border: "1px solid #ccc",
                        borderRadius: "4px",
                        padding: "4px 8px"
                      }}
                    />
                  ) : (
                    localData[field] && (
                      <p key={field} style={{ margin: "0", padding: "4px" }}>
                        <strong>{field.charAt(0).toUpperCase() + field.slice(1)}:</strong> {localData[field]}
                      </p>
                    )
                  )
                )}
              </div>
            </div>

            {/* Summary */}
            <div style={{ marginBottom: "2rem" }}>
              <h3 style={{ fontWeight: "bold", fontSize: "1.25rem", marginBottom: "0.5rem", borderBottom: "2px solid #3b82f6", paddingBottom: "0.25rem" }}>
                Summary
              </h3>
              {editMode ? (
                <textarea
                  value={localData.summary}
                  onChange={(e) => handleFieldChange("summary", e.target.value)}
                  style={{
                    width: "100%",
                    minHeight: "4rem",
                    border: "1px solid #ccc",
                    borderRadius: "4px",
                    padding: "8px",
                    resize: "vertical"
                  }}
                />
              ) : (
                <p style={{ lineHeight: "1.6", marginBottom: "0" }}>{localData.summary}</p>
              )}
            </div>

            {/* Skills */}
            <div style={{ marginBottom: "2rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
                <h3 style={{ fontWeight: "bold", fontSize: "1.25rem", marginBottom: "0", borderBottom: "2px solid #3b82f6", paddingBottom: "0.25rem" }}>
                  Skills
                </h3>
                {editMode && (
                  <button
                    onClick={() => setShowSkillForm(true)}
                    style={{
                      backgroundColor: "#10b981",
                      color: "white",
                      border: "none",
                      padding: "0.25rem 0.75rem",
                      borderRadius: "0.375rem",
                      fontSize: "0.875rem",
                      cursor: "pointer"
                    }}
                  >
                    Add Skill
                  </button>
                )}
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginTop: "0.5rem" }}>
                {localData.skills.map((skill, i) => (
                  <div key={i} style={{
                    backgroundColor: "#dbeafe",
                    color: "#1e40af",
                    padding: "0.25rem 0.75rem",
                    borderRadius: "1rem",
                    fontSize: "0.875rem",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem"
                  }}>
                    <span>{skill}</span>
                    {editMode && (
                      <button
                        onClick={() => removeSkill(i)}
                        style={{
                          backgroundColor: "transparent",
                          border: "none",
                          color: "#dc2626",
                          cursor: "pointer",
                          fontSize: "0.75rem",
                          padding: "0",
                          width: "16px",
                          height: "16px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center"
                        }}
                      >
                        ×
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Languages */}
            <div style={{ marginBottom: "2rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
                <h3 style={{ fontWeight: "bold", fontSize: "1.25rem", marginBottom: "0", borderBottom: "2px solid #3b82f6", paddingBottom: "0.25rem" }}>
                  Languages
                </h3>
                {editMode && (
                  <button
                    onClick={() => {
                      const newLang = prompt("Add new language:");
                      if (newLang && newLang.trim()) {
                        handleFieldChange("languages", [...localData.languages, newLang.trim()]);
                      }
                    }}
                    style={{
                      backgroundColor: "#10b981",
                      color: "white",
                      border: "none",
                      padding: "0.25rem 0.75rem",
                      borderRadius: "0.375rem",
                      fontSize: "0.875rem",
                      cursor: "pointer"
                    }}
                  >
                    Add Language
                  </button>
                )}
              </div>
              {editMode ? (
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                  {localData.languages.map((lang, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                      <input
                        type="text"
                        value={lang}
                        onChange={(e) => {
                          const updated = [...localData.languages];
                          updated[i] = e.target.value;
                          handleFieldChange("languages", updated);
                        }}
                        style={{ border: "1px solid #ccc", borderRadius: "4px", padding: "4px" }}
                      />
                      <button
                        onClick={() => removeArrayItem("languages", i)}
                        style={{
                          backgroundColor: "#dc2626",
                          color: "white",
                          border: "none",
                          borderRadius: "50%",
                          width: "20px",
                          height: "20px",
                          cursor: "pointer",
                          fontSize: "12px"
                        }}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p>{localData.languages.join(", ")}</p>
              )}
            </div>

            {/* Interests */}
            <div style={{ marginBottom: "2rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
                <h3 style={{ fontWeight: "bold", fontSize: "1.25rem", marginBottom: "0", borderBottom: "2px solid #3b82f6", paddingBottom: "0.25rem" }}>
                  Interests
                </h3>
                {editMode && (
                  <button
                    onClick={() => {
                      const newInterest = prompt("Add new interest:");
                      if (newInterest && newInterest.trim()) {
                        handleFieldChange("interests", [...localData.interests, newInterest.trim()]);
                      }
                    }}
                    style={{
                      backgroundColor: "#10b981",
                      color: "white",
                      border: "none",
                      padding: "0.25rem 0.75rem",
                      borderRadius: "0.375rem",
                      fontSize: "0.875rem",
                      cursor: "pointer"
                    }}
                  >
                    Add Interest
                  </button>
                )}
              </div>
              {editMode ? (
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                  {localData.interests.map((interest, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                      <input
                        type="text"
                        value={interest}
                        onChange={(e) => {
                          const updated = [...localData.interests];
                          updated[i] = e.target.value;
                          handleFieldChange("interests", updated);
                        }}
                        style={{ border: "1px solid #ccc", borderRadius: "4px", padding: "4px" }}
                      />
                      <button
                        onClick={() => removeArrayItem("interests", i)}
                        style={{
                          backgroundColor: "#dc2626",
                          color: "white",
                          border: "none",
                          borderRadius: "50%",
                          width: "20px",
                          height: "20px",
                          cursor: "pointer",
                          fontSize: "12px"
                        }}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p>{localData.interests.join(", ")}</p>
              )}
            </div>

            {/* Experience */}
            <div style={{ marginBottom: "2rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                <h3 style={{ fontWeight: "bold", fontSize: "1.25rem", marginBottom: "0", borderBottom: "2px solid #3b82f6", paddingBottom: "0.25rem" }}>
                  Experience
                </h3>
                {editMode && (
                  <button
                    onClick={() => setShowExperienceForm(true)}
                    style={{
                      backgroundColor: "#10b981",
                      color: "white",
                      border: "none",
                      padding: "0.5rem 1rem",
                      borderRadius: "0.375rem",
                      cursor: "pointer"
                    }}
                  >
                    Add Experience
                  </button>
                )}
              </div>
              {localData.experience.map((exp, idx) => (
                <div key={idx} style={{ marginBottom: "1.5rem", border: editMode ? "1px solid #e5e7eb" : "none", padding: editMode ? "1rem" : "0", borderRadius: "0.5rem" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.5rem" }}>
                    <div style={{ flexGrow: 1 }}>
                      {editMode ? (
                        <>
                          <input
                            type="text"
                            value={exp.title}
                            onChange={(e) => handleArrayFieldChange("experience", idx, "title", e.target.value)}
                            placeholder="Job Title"
                            style={{
                              fontWeight: "bold",
                              fontSize: "1.1rem",
                              width: "100%",
                              marginBottom: "0.5rem",
                              border: "1px solid #ccc",
                              borderRadius: "4px",
                              padding: "4px"
                            }}
                          />
                          <input
                            type="text"
                            value={exp.companyName}
                            onChange={(e) => handleArrayFieldChange("experience", idx, "companyName", e.target.value)}
                            placeholder="Company Name"
                            style={{
                              width: "100%",
                              marginBottom: "0.5rem",
                              border: "1px solid #ccc",
                              borderRadius: "4px",
                              padding: "4px"
                            }}
                          />
                          <div style={{ display: "flex", gap: "0.5rem", marginBottom: "0.5rem" }}>
                            <input
                              type="text"
                              value={exp.date}
                              onChange={(e) => handleArrayFieldChange("experience", idx, "date", e.target.value)}
                              placeholder="Date Range"
                              style={{
                                flex: 1,
                                border: "1px solid #ccc",
                                borderRadius: "4px",
                                padding: "4px"
                              }}
                            />
                            <input
                              type="text"
                              value={exp.companyLocation}
                              onChange={(e) => handleArrayFieldChange("experience", idx, "companyLocation", e.target.value)}
                              placeholder="Location"
                              style={{
                                flex: 1,
                                border: "1px solid #ccc",
                                borderRadius: "4px",
                                padding: "4px"
                              }}
                            />
                          </div>
                          <textarea
                            value={exp.accomplishment.join("\n")}
                            onChange={(e) => handleArrayFieldChange(
                              "experience",
                              idx,
                              "accomplishment",
                              e.target.value.split("\n").filter(item => item.trim())
                            )}
                            placeholder="Accomplishments (one per line)"
                            style={{
                              width: "100%",
                              minHeight: "4rem",
                              border: "1px solid #ccc",
                              borderRadius: "4px",
                              padding: "8px",
                              resize: "vertical"
                            }}
                          />
                        </>
                      ) : (
                        <>
                          <h4 style={{ fontWeight: "bold", fontSize: "1.1rem", margin: "0", color: "#1f2937" }}>
                            {exp.title}
                          </h4>
                          <p style={{ margin: "0.25rem 0", color: "#6b7280", fontWeight: "500" }}>
                            {exp.companyName} | {exp.date} | {exp.companyLocation}
                          </p>
                          <ul style={{ listStyle: "disc", marginLeft: "1.5rem", marginTop: "0.5rem" }}>
                            {exp.accomplishment.map((a, i) => (
                              <li key={i} style={{ marginBottom: "0.25rem" }}>{a}</li>
                            ))}
                          </ul>
                        </>
                      )}
                    </div>
                    {editMode && (
                      <div style={{ display: "flex", gap: "0.5rem", marginLeft: "1rem" }}>
                        <button
                          onClick={() => editExperience(idx)}
                          style={{
                            backgroundColor: "#f59e0b",
                            color: "white",
                            border: "none",
                            padding: "0.25rem 0.5rem",
                            borderRadius: "0.25rem",
                            cursor: "pointer",
                            fontSize: "0.75rem"
                          }}
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => removeExperience(idx)}
                          style={{
                            backgroundColor: "#dc2626",
                            color: "white",
                            border: "none",
                            padding: "0.25rem 0.5rem",
                            borderRadius: "0.25rem",
                            cursor: "pointer",
                            fontSize: "0.75rem"
                          }}
                        >
                          Remove
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Education */}
            <div style={{ marginBottom: "2rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                <h3 style={{ fontWeight: "bold", fontSize: "1.25rem", marginBottom: "0", borderBottom: "2px solid #3b82f6", paddingBottom: "0.25rem" }}>
                  Education
                </h3>
                {editMode && (
                  <button
                    onClick={() => setShowEducationForm(true)}
                    style={{
                      backgroundColor: "#10b981",
                      color: "white",
                      border: "none",
                      padding: "0.5rem 1rem",
                      borderRadius: "0.375rem",
                      cursor: "pointer"
                    }}
                  >
                    Add Education
                  </button>
                )}
              </div>
              {localData.education.map((edu, idx) => (
                <div key={idx} style={{ marginBottom: "1rem", border: editMode ? "1px solid #e5e7eb" : "none", padding: editMode ? "1rem" : "0", borderRadius: "0.5rem" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div style={{ flexGrow: 1 }}>
                      {editMode ? (
                        <>
                          <input
                            type="text"
                            value={edu.degree}
                            onChange={(e) => handleArrayFieldChange("education", idx, "degree", e.target.value)}
                            placeholder="Degree"
                            style={{
                              fontWeight: "bold",
                              width: "100%",
                              marginBottom: "0.5rem",
                              border: "1px solid #ccc",
                              borderRadius: "4px",
                              padding: "4px"
                            }}
                          />
                          <input
                            type="text"
                            value={edu.institution}
                            onChange={(e) => handleArrayFieldChange("education", idx, "institution", e.target.value)}
                            placeholder="Institution"
                            style={{
                              width: "100%",
                              marginBottom: "0.5rem",
                              border: "1px solid #ccc",
                              borderRadius: "4px",
                              padding: "4px"
                            }}
                          />
                          <div style={{ display: "flex", gap: "0.5rem" }}>
                            <input
                              type="text"
                              value={edu.duration}
                              onChange={(e) => handleArrayFieldChange("education", idx, "duration", e.target.value)}
                              placeholder="Duration"
                              style={{
                                flex: 1,
                                border: "1px solid #ccc",
                                borderRadius: "4px",
                                padding: "4px"
                              }}
                            />
                            <input
                              type="text"
                              value={edu.location}
                              onChange={(e) => handleArrayFieldChange("education", idx, "location", e.target.value)}
                              placeholder="Location"
                              style={{
                                flex: 1,
                                border: "1px solid #ccc",
                                borderRadius: "4px",
                                padding: "4px"
                              }}
                            />
                          </div>
                        </>
                      ) : (
                        <>
                          <p style={{ fontWeight: "bold", margin: "0", color: "#1f2937" }}>
                            {edu.degree}
                          </p>
                          <p style={{ margin: "0.25rem 0", color: "#6b7280" }}>
                            {edu.institution} | {edu.duration} | {edu.location}
                          </p>
                        </>
                      )}
                    </div>
                    {editMode && (
                      <div style={{ display: "flex", gap: "0.5rem", marginLeft: "1rem" }}>
                        <button
                          onClick={() => editEducation(idx)}
                          style={{
                            backgroundColor: "#f59e0b",
                            color: "white",
                            border: "none",
                            padding: "0.25rem 0.5rem",
                            borderRadius: "0.25rem",
                            cursor: "pointer",
                            fontSize: "0.75rem"
                          }}
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => removeEducation(idx)}
                          style={{
                            backgroundColor: "#dc2626",
                            color: "white",
                            border: "none",
                            padding: "0.25rem 0.5rem",
                            borderRadius: "0.25rem",
                            cursor: "pointer",
                            fontSize: "0.75rem"
                          }}
                        >
                          Remove
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Projects */}
            <div style={{ marginBottom: "2rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                <h3 style={{ fontWeight: "bold", fontSize: "1.25rem", marginBottom: "0", borderBottom: "2px solid #3b82f6", paddingBottom: "0.25rem" }}>
                  Projects
                </h3>
                {editMode && (
                  <button
                    onClick={() => setShowProjectForm(true)}
                    style={{
                      backgroundColor: "#10b981",
                      color: "white",
                      border: "none",
                      padding: "0.5rem 1rem",
                      borderRadius: "0.375rem",
                      cursor: "pointer"
                    }}
                  >
                    Add Project
                  </button>
                )}
              </div>
              {localData.projects.map((proj, idx) => (
                <div key={idx} style={{ marginBottom: "1.5rem", border: editMode ? "1px solid #e5e7eb" : "none", padding: editMode ? "1rem" : "0", borderRadius: "0.5rem" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div style={{ flexGrow: 1 }}>
                      {editMode ? (
                        <>
                          <input
                            type="text"
                            value={proj.name}
                            onChange={(e) => handleArrayFieldChange("projects", idx, "name", e.target.value)}
                            placeholder="Project Name"
                            style={{
                              fontWeight: "bold",
                              width: "100%",
                              marginBottom: "0.5rem",
                              border: "1px solid #ccc",
                              borderRadius: "4px",
                              padding: "4px"
                            }}
                          />
                          <textarea
                            value={proj.description}
                            onChange={(e) => handleArrayFieldChange("projects", idx, "description", e.target.value)}
                            placeholder="Description"
                            style={{
                              width: "100%",
                              minHeight: "3rem",
                              marginBottom: "0.5rem",
                              border: "1px solid #ccc",
                              borderRadius: "4px",
                              padding: "8px",
                              resize: "vertical"
                            }}
                          />
                          <input
                            type="text"
                            value={proj.technologies.join(", ")}
                            onChange={(e) => handleArrayFieldChange(
                              "projects",
                              idx,
                              "technologies",
                              e.target.value.split(",").map((t) => t.trim()).filter(t => t)
                            )}
                            placeholder="Technologies (comma-separated)"
                            style={{
                              width: "100%",
                              marginBottom: "0.5rem",
                              border: "1px solid #ccc",
                              borderRadius: "4px",
                              padding: "4px"
                            }}
                          />
                          <div style={{ display: "flex", gap: "0.5rem" }}>
                            <input
                              type="url"
                              value={proj.link}
                              onChange={(e) => handleArrayFieldChange("projects", idx, "link", e.target.value)}
                              placeholder="Live Link"
                              style={{
                                flex: 1,
                                border: "1px solid #ccc",
                                borderRadius: "4px",
                                padding: "4px"
                              }}
                            />
                            <input
                              type="url"
                              value={proj.github}
                              onChange={(e) => handleArrayFieldChange("projects", idx, "github", e.target.value)}
                              placeholder="GitHub Link"
                              style={{
                                flex: 1,
                                border: "1px solid #ccc",
                                borderRadius: "4px",
                                padding: "4px"
                              }}
                            />
                          </div>
                        </>
                      ) : (
                        <>
                          <h4 style={{ fontWeight: "bold", margin: "0", color: "#1f2937" }}>
                            {proj.name}
                          </h4>
                          <p style={{ margin: "0.5rem 0", lineHeight: "1.5" }}>
                            {proj.description}
                          </p>
                          <p style={{ margin: "0.25rem 0", color: "#6b7280", fontSize: "0.875rem" }}>
                            <strong>Technologies:</strong> {proj.technologies.join(", ")}
                          </p>
                          <div style={{ display: "flex", gap: "1rem", marginTop: "0.5rem" }}>
                            {proj.link && (
                              <a href={proj.link} target="_blank" rel="noopener noreferrer"
                                style={{ color: "#3b82f6", textDecoration: "none", fontSize: "0.875rem" }}>
                                🔗 Live Demo
                              </a>
                            )}
                            {proj.github && (
                              <a href={proj.github} target="_blank" rel="noopener noreferrer"
                                style={{ color: "#3b82f6", textDecoration: "none", fontSize: "0.875rem" }}>
                                📁 GitHub
                              </a>
                            )}
                          </div>
                        </>
                      )}
                    </div>
                    {editMode && (
                      <div style={{ display: "flex", gap: "0.5rem", marginLeft: "1rem" }}>
                        <button
                          onClick={() => editProject(idx)}
                          style={{
                            backgroundColor: "#f59e0b",
                            color: "white",
                            border: "none",
                            padding: "0.25rem 0.5rem",
                            borderRadius: "0.25rem",
                            cursor: "pointer",
                            fontSize: "0.75rem"
                          }}
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => removeProject(idx)}
                          style={{
                            backgroundColor: "#dc2626",
                            color: "white",
                            border: "none",
                            padding: "0.25rem 0.5rem",
                            borderRadius: "0.25rem",
                            cursor: "pointer",
                            fontSize: "0.75rem"
                          }}
                        >
                          Remove
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Certifications */}
            <div style={{ marginBottom: "2rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                <h3 style={{ fontWeight: "bold", fontSize: "1.25rem", marginBottom: "0", borderBottom: "2px solid #3b82f6", paddingBottom: "0.25rem" }}>
                  Certifications
                </h3>
                {editMode && (
                  <button
                    onClick={() => setShowCertificationForm(true)}
                    style={{
                      backgroundColor: "#10b981",
                      color: "white",
                      border: "none",
                      padding: "0.5rem 1rem",
                      borderRadius: "0.375rem",
                      cursor: "pointer"
                    }}
                  >
                    Add Certification
                  </button>
                )}
              </div>
              {localData.certifications.map((cert, idx) => (
                <div key={idx} style={{ marginBottom: "1rem", border: editMode ? "1px solid #e5e7eb" : "none", padding: editMode ? "1rem" : "0", borderRadius: "0.5rem" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div style={{ flexGrow: 1 }}>
                      {editMode ? (
                        <>
                          <input
                            type="text"
                            value={cert.title}
                            onChange={(e) => handleArrayFieldChange("certifications", idx, "title", e.target.value)}
                            placeholder="Certification Title"
                            style={{
                              fontWeight: "bold",
                              width: "100%",
                              marginBottom: "0.5rem",
                              border: "1px solid #ccc",
                              borderRadius: "4px",
                              padding: "4px"
                            }}
                          />
                          <div style={{ display: "flex", gap: "0.5rem" }}>
                            <input
                              type="text"
                              value={cert.issuer}
                              onChange={(e) => handleArrayFieldChange("certifications", idx, "issuer", e.target.value)}
                              placeholder="Issuer"
                              style={{
                                flex: 1,
                                border: "1px solid #ccc",
                                borderRadius: "4px",
                                padding: "4px"
                              }}
                            />
                            <input
                              type="text"
                              value={cert.date}
                              onChange={(e) => handleArrayFieldChange("certifications", idx, "date", e.target.value)}
                              placeholder="Date"
                              style={{
                                flex: 1,
                                border: "1px solid #ccc",
                                borderRadius: "4px",
                                padding: "4px"
                              }}
                            />
                          </div>
                        </>
                      ) : (
                        <>
                          <p style={{ fontWeight: "bold", margin: "0", color: "#1f2937" }}>
                            {cert.title}
                          </p>
                          <p style={{ margin: "0.25rem 0", color: "#6b7280" }}>
                            {cert.issuer} | {cert.date}
                          </p>
                        </>
                      )}
                    </div>
                    {editMode && (
                      <div style={{ display: "flex", gap: "0.5rem", marginLeft: "1rem" }}>
                        <button
                          onClick={() => editCertification(idx)}
                          style={{
                            backgroundColor: "#f59e0b",
                            color: "white",
                            border: "none",
                            padding: "0.25rem 0.5rem",
                            borderRadius: "0.25rem",
                            cursor: "pointer",
                            fontSize: "0.75rem"
                          }}
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => removeCertification(idx)}
                          style={{
                            backgroundColor: "#dc2626",
                            color: "white",
                            border: "none",
                            padding: "0.25rem 0.5rem",
                            borderRadius: "0.25rem",
                            cursor: "pointer",
                            fontSize: "0.75rem"
                          }}
                        >
                          Remove
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Achievements */}
            <div style={{ marginBottom: "2rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                <h3 style={{ fontWeight: "bold", fontSize: "1.25rem", marginBottom: "0", borderBottom: "2px solid #3b82f6", paddingBottom: "0.25rem" }}>
                  Achievements
                </h3>
                {editMode && (
                  <button
                    onClick={() => {
                      const newAchievement = prompt("Add new achievement:");
                      if (newAchievement && newAchievement.trim()) {
                        handleFieldChange("achievements", [...localData.achievements, newAchievement.trim()]);
                      }
                    }}
                    style={{
                      backgroundColor: "#10b981",
                      color: "white",
                      border: "none",
                      padding: "0.5rem 1rem",
                      borderRadius: "0.375rem",
                      cursor: "pointer"
                    }}
                  >
                    Add Achievement
                  </button>
                )}
              </div>
              {editMode ? (
                <div>
                  {localData.achievements.map((achievement, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
                      <input
                        type="text"
                        value={achievement}
                        onChange={(e) => {
                          const updated = [...localData.achievements];
                          updated[i] = e.target.value;
                          handleFieldChange("achievements", updated);
                        }}
                        style={{
                          flex: 1,
                          border: "1px solid #ccc",
                          borderRadius: "4px",
                          padding: "8px"
                        }}
                      />
                      <button
                        onClick={() => removeArrayItem("achievements", i)}
                        style={{
                          backgroundColor: "#dc2626",
                          color: "white",
                          border: "none",
                          borderRadius: "50%",
                          width: "24px",
                          height: "24px",
                          cursor: "pointer",
                          fontSize: "14px"
                        }}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <ul style={{ listStyle: "disc", marginLeft: "1.5rem" }}>
                  {localData.achievements.map((achievement, i) => (
                    <li key={i} style={{ marginBottom: "0.25rem" }}>{achievement}</li>
                  ))}
                </ul>
              )}
            </div>
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
                    padding: "0.75rem 1.5rem",
                    borderRadius: "0.375rem",
                    marginRight: "0.5rem",
                    border: "none",
                    cursor: "pointer",
                    fontSize: "1rem",
                    fontWeight: "500"
                  }}
                >
                  Save Changes
                </button>
                <button
                  onClick={handleCancel}
                  style={{
                    backgroundColor: "#6b7280",
                    color: "white",
                    padding: "0.75rem 1.5rem",
                    borderRadius: "0.375rem",
                    border: "none",
                    cursor: "pointer",
                    fontSize: "1rem",
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
                  padding: "0.75rem 1.5rem",
                  borderRadius: "0.375rem",
                  border: "none",
                  cursor: "pointer",
                  fontSize: "1rem",
                  fontWeight: "500"
                }}
              >
                Edit Resume
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Modal Forms */}
      {/* Skill Form Modal */}
      {showSkillForm && (
        <div style={{
          position: "fixed",
          top: "0",
          left: "0",
          right: "0",
          bottom: "0",
          backgroundColor: "rgba(0,0,0,0.5)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: "1000"
        }}>
          <div style={{
            backgroundColor: "white",
            padding: "2rem",
            borderRadius: "0.5rem",
            width: "90%",
            maxWidth: "400px"
          }}>
            <h3 style={{ marginBottom: "1rem", fontSize: "1.25rem", fontWeight: "bold" }}>Add New Skill</h3>
            <form onSubmit={addSkill}>
              <input
                type="text"
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                placeholder="Skill name"
                style={{
                  width: "100%",
                  padding: "0.5rem",
                  border: "1px solid #ccc",
                  borderRadius: "0.25rem",
                  marginBottom: "1rem"
                }}
                autoFocus
              />
              <div style={{ display: "flex", gap: "0.5rem", justifyContent: "flex-end" }}>
                <button
                  type="button"
                  onClick={() => {
                    setShowSkillForm(false);
                    setNewSkill("");
                  }}
                  style={{
                    backgroundColor: "#6b7280",
                    color: "white",
                    border: "none",
                    padding: "0.5rem 1rem",
                    borderRadius: "0.25rem",
                    cursor: "pointer"
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    backgroundColor: "#10b981",
                    color: "white",
                    border: "none",
                    padding: "0.5rem 1rem",
                    borderRadius: "0.25rem",
                    cursor: "pointer"
                  }}
                >
                  Add
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Experience Form Modal */}
      {showExperienceForm && (
        <div style={{
          position: "fixed",
          top: "0",
          left: "0",
          right: "0",
          bottom: "0",
          backgroundColor: "rgba(0,0,0,0.5)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: "1000"
        }}>
          <div style={{
            backgroundColor: "white",
            padding: "2rem",
            borderRadius: "0.5rem",
            width: "90%",
            maxWidth: "500px",
            maxHeight: "90vh",
            overflowY: "auto"
          }}>
            <h3 style={{ marginBottom: "1rem", fontSize: "1.25rem", fontWeight: "bold" }}>
              {editingExperience !== null ? "Edit Experience" : "Add New Experience"}
            </h3>
            <form onSubmit={addOrUpdateExperience}>
              <input
                type="text"
                value={newExperience.title}
                onChange={(e) => setNewExperience({ ...newExperience, title: e.target.value })}
                placeholder="Job Title"
                style={{
                  width: "100%",
                  padding: "0.5rem",
                  border: "1px solid #ccc",
                  borderRadius: "0.25rem",
                  marginBottom: "0.5rem"
                }}
              />
              <input
                type="text"
                value={newExperience.companyName}
                onChange={(e) => setNewExperience({ ...newExperience, companyName: e.target.value })}
                placeholder="Company Name"
                style={{
                  width: "100%",
                  padding: "0.5rem",
                  border: "1px solid #ccc",
                  borderRadius: "0.25rem",
                  marginBottom: "0.5rem"
                }}
              />
              <input
                type="text"
                value={newExperience.date}
                onChange={(e) => setNewExperience({ ...newExperience, date: e.target.value })}
                placeholder="Date Range (e.g., 2020 - Present)"
                style={{
                  width: "100%",
                  padding: "0.5rem",
                  border: "1px solid #ccc",
                  borderRadius: "0.25rem",
                  marginBottom: "0.5rem"
                }}
              />
              <input
                type="text"
                value={newExperience.companyLocation}
                onChange={(e) => setNewExperience({ ...newExperience, companyLocation: e.target.value })}
                placeholder="Location"
                style={{
                  width: "100%",
                  padding: "0.5rem",
                  border: "1px solid #ccc",
                  borderRadius: "0.25rem",
                  marginBottom: "0.5rem"
                }}
              />
              <textarea
                value={newExperience.accomplishment}
                onChange={(e) => setNewExperience({ ...newExperience, accomplishment: e.target.value })}
                placeholder="Accomplishments (one per line)"
                style={{
                  width: "100%",
                  padding: "0.5rem",
                  border: "1px solid #ccc",
                  borderRadius: "0.25rem",
                  marginBottom: "1rem",
                  minHeight: "100px",
                  resize: "vertical"
                }}
              />
              <div style={{ display: "flex", gap: "0.5rem", justifyContent: "flex-end" }}>
                <button
                  type="button"
                  onClick={() => {
                    setShowExperienceForm(false);
                    setNewExperience({ title: "", companyName: "", date: "", companyLocation: "", accomplishment: "" });
                    setEditingExperience(null);
                  }}
                  style={{
                    backgroundColor: "#6b7280",
                    color: "white",
                    border: "none",
                    padding: "0.5rem 1rem",
                    borderRadius: "0.25rem",
                    cursor: "pointer"
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    backgroundColor: "#10b981",
                    color: "white",
                    border: "none",
                    padding: "0.5rem 1rem",
                    borderRadius: "0.25rem",
                    cursor: "pointer"
                  }}
                >
                  {editingExperience !== null ? "Update" : "Add"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Education Form Modal */}
      {showEducationForm && (
        <div style={{
          position: "fixed",
          top: "0",
          left: "0",
          right: "0",
          bottom: "0",
          backgroundColor: "rgba(0,0,0,0.5)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: "1000"
        }}>
          <div style={{
            backgroundColor: "white",
            padding: "2rem",
            borderRadius: "0.5rem",
            width: "90%",
            maxWidth: "500px"
          }}>
            <h3 style={{ marginBottom: "1rem", fontSize: "1.25rem", fontWeight: "bold" }}>
              {editingEducation !== null ? "Edit Education" : "Add New Education"}
            </h3>
            <form onSubmit={addOrUpdateEducation}>
              <input
                type="text"
                value={newEducation.degree}
                onChange={(e) => setNewEducation({ ...newEducation, degree: e.target.value })}
                placeholder="Degree"
                style={{
                  width: "100%",
                  padding: "0.5rem",
                  border: "1px solid #ccc",
                  borderRadius: "0.25rem",
                  marginBottom: "0.5rem"
                }}
              />
              <input
                type="text"
                value={newEducation.institution}
                onChange={(e) => setNewEducation({ ...newEducation, institution: e.target.value })}
                placeholder="Institution"
                style={{
                  width: "100%",
                  padding: "0.5rem",
                  border: "1px solid #ccc",
                  borderRadius: "0.25rem",
                  marginBottom: "0.5rem"
                }}
              />
              <input
                type="text"
                value={newEducation.duration}
                onChange={(e) => setNewEducation({ ...newEducation, duration: e.target.value })}
                placeholder="Duration (e.g., 2016 - 2020)"
                style={{
                  width: "100%",
                  padding: "0.5rem",
                  border: "1px solid #ccc",
                  borderRadius: "0.25rem",
                  marginBottom: "0.5rem"
                }}
              />
              <input
                type="text"
                value={newEducation.location}
                onChange={(e) => setNewEducation({ ...newEducation, location: e.target.value })}
                placeholder="Location"
                style={{
                  width: "100%",
                  padding: "0.5rem",
                  border: "1px solid #ccc",
                  borderRadius: "0.25rem",
                  marginBottom: "1rem"
                }}
              />
              <div style={{ display: "flex", gap: "0.5rem", justifyContent: "flex-end" }}>
                <button
                  type="button"
                  onClick={() => {
                    setShowEducationForm(false);
                    setNewEducation({ degree: "", institution: "", duration: "", location: "" });
                    setEditingEducation(null);
                  }}
                  style={{
                    backgroundColor: "#6b7280",
                    color: "white",
                    border: "none",
                    padding: "0.5rem 1rem",
                    borderRadius: "0.25rem",
                    cursor: "pointer"
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    backgroundColor: "#10b981",
                    color: "white",
                    border: "none",
                    padding: "0.5rem 1rem",
                    borderRadius: "0.25rem",
                    cursor: "pointer"
                  }}
                >
                  {editingEducation !== null ? "Update" : "Add"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Project Form Modal */}
      {showProjectForm && (
        <div style={{
          position: "fixed",
          top: "0",
          left: "0",
          right: "0",
          bottom: "0",
          backgroundColor: "rgba(0,0,0,0.5)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: "1000"
        }}>
          <div style={{
            backgroundColor: "white",
            padding: "2rem",
            borderRadius: "0.5rem",
            width: "90%",
            maxWidth: "500px",
            maxHeight: "90vh",
            overflowY: "auto"
          }}>
            <h3 style={{ marginBottom: "1rem", fontSize: "1.25rem", fontWeight: "bold" }}>
              {editingProject !== null ? "Edit Project" : "Add New Project"}
            </h3>
            <form onSubmit={addOrUpdateProject}>
              <input
                type="text"
                value={newProject.name}
                onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                placeholder="Project Name"
                style={{
                  width: "100%",
                  padding: "0.5rem",
                  border: "1px solid #ccc",
                  borderRadius: "0.25rem",
                  marginBottom: "0.5rem"
                }}
              />
              <textarea
                value={newProject.description}
                onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                placeholder="Project Description"
                style={{
                  width: "100%",
                  padding: "0.5rem",
                  border: "1px solid #ccc",
                  borderRadius: "0.25rem",
                  marginBottom: "0.5rem",
                  minHeight: "80px",
                  resize: "vertical"
                }}
              />
              <input
                type="text"
                value={newProject.technologies}
                onChange={(e) => setNewProject({ ...newProject, technologies: e.target.value })}
                placeholder="Technologies (comma-separated)"
                style={{
                  width: "100%",
                  padding: "0.5rem",
                  border: "1px solid #ccc",
                  borderRadius: "0.25rem",
                  marginBottom: "0.5rem"
                }}
              />
              <input
                type="url"
                value={newProject.link}
                onChange={(e) => setNewProject({ ...newProject, link: e.target.value })}
                placeholder="Live Demo URL (optional)"
                style={{
                  width: "100%",
                  padding: "0.5rem",
                  border: "1px solid #ccc",
                  borderRadius: "0.25rem",
                  marginBottom: "0.5rem"
                }}
              />
              <input
                type="url"
                value={newProject.github}
                onChange={(e) => setNewProject({ ...newProject, github: e.target.value })}
                placeholder="GitHub URL (optional)"
                style={{
                  width: "100%",
                  padding: "0.5rem",
                  border: "1px solid #ccc",
                  borderRadius: "0.25rem",
                  marginBottom: "1rem"
                }}
              />
              <div style={{ display: "flex", gap: "0.5rem", justifyContent: "flex-end" }}>
                <button
                  type="button"
                  onClick={() => {
                    setShowProjectForm(false);
                    setNewProject({ name: "", description: "", technologies: "", link: "", github: "" });
                    setEditingProject(null);
                  }}
                  style={{
                    backgroundColor: "#6b7280",
                    color: "white",
                    border: "none",
                    padding: "0.5rem 1rem",
                    borderRadius: "0.25rem",
                    cursor: "pointer"
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    backgroundColor: "#10b981",
                    color: "white",
                    border: "none",
                    padding: "0.5rem 1rem",
                    borderRadius: "0.25rem",
                    cursor: "pointer"
                  }}
                >
                  {editingProject !== null ? "Update" : "Add"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Certification Form Modal */}
      {showCertificationForm && (
        <div style={{
          position: "fixed",
          top: "0",
          left: "0",
          right: "0",
          bottom: "0",
          backgroundColor: "rgba(0,0,0,0.5)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: "1000"
        }}>
          <div style={{
            backgroundColor: "white",
            padding: "2rem",
            borderRadius: "0.5rem",
            width: "90%",
            maxWidth: "500px"
          }}>
            <h3 style={{ marginBottom: "1rem", fontSize: "1.25rem", fontWeight: "bold" }}>
              {editingCertification !== null ? "Edit Certification" : "Add New Certification"}
            </h3>
            <form onSubmit={addOrUpdateCertification}>
              <input
                type="text"
                value={newCertification.title}
                onChange={(e) => setNewCertification({ ...newCertification, title: e.target.value })}
                placeholder="Certification Title"
                style={{
                  width: "100%",
                  padding: "0.5rem",
                  border: "1px solid #ccc",
                  borderRadius: "0.25rem",
                  marginBottom: "0.5rem"
                }}
              />
              <input
                type="text"
                value={newCertification.issuer}
                onChange={(e) => setNewCertification({ ...newCertification, issuer: e.target.value })}
                placeholder="Issuing Organization"
                style={{
                  width: "100%",
                  padding: "0.5rem",
                  border: "1px solid #ccc",
                  borderRadius: "0.25rem",
                  marginBottom: "0.5rem"
                }}
              />
              <input
                type="text"
                value={newCertification.date}
                onChange={(e) => setNewCertification({ ...newCertification, date: e.target.value })}
                placeholder="Date (e.g., Jan 2023)"
                style={{
                  width: "100%",
                  padding: "0.5rem",
                  border: "1px solid #ccc",
                  borderRadius: "0.25rem",
                  marginBottom: "1rem"
                }}
              />
              <div style={{ display: "flex", gap: "0.5rem", justifyContent: "flex-end" }}>
                <button
                  type="button"
                  onClick={() => {
                    setShowCertificationForm(false);
                    setNewCertification({ title: "", issuer: "", date: "" });
                    setEditingCertification(null);
                  }}
                  style={{
                    backgroundColor: "#6b7280",
                    color: "white",
                    border: "none",
                    padding: "0.5rem 1rem",
                    borderRadius: "0.25rem",
                    cursor: "pointer"
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    backgroundColor: "#10b981",
                    color: "white",
                    border: "none",
                    padding: "0.5rem 1rem",
                    borderRadius: "0.25rem",
                    cursor: "pointer"
                  }}
                >
                  {editingCertification !== null ? "Update" : "Add"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Responsive Styles */}
      <style>{`
        @media (max-width: 768px) {
          .main-content {
            padding: 1rem !important;
            margin-left: 0 !important;
          }
          
          .resume-container {
            padding: 1rem !important;
            margin: 0 !important;
            max-width: 100% !important;
          }
          
          .header-flex {
            flex-direction: column !important;
            text-align: center !important;
          }
          
          .contact-grid {
            grid-template-columns: 1fr !important;
            text-align: left !important;
          }
          
          .section-header {
            flex-direction: column !important;
            align-items: flex-start !important;
            gap: 0.5rem !important;
          }
          
          .edit-buttons {
            flex-direction: column !important;
            width: 100% !important;
            gap: 0.25rem !important;
          }
          
          .skill-tags {
            gap: 0.25rem !important;
          }
          
          .modal {
            width: 95% !important;
            margin: 1rem !important;
            max-height: 90vh !important;
            overflow-y: auto !important;
          }
        }
        
        @media (max-width: 1024px) {
          .sidebar {
            transform: translateX(-100%) !important;
          }
          
          .main-content {
            margin-left: 0 !important;
          }
        }
        
        .no-print {
          display: block;
        }
        
        @media print {
          .no-print {
            display: none !important;
          }
          
          .main-content {
            margin-left: 0 !important;
            padding: 0 !important;
          }
          
          .resume-container {
            box-shadow: none !important;
            max-width: 100% !important;
            padding: 1rem !important;
          }
        }
      `}</style>
    </div>
  );
};

export default Template7;