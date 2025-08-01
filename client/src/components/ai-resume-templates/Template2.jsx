import React, { useState, useRef, useEffect } from "react";
import Sidebar from "../Sidebar/Sidebar";
import Navbar from "../Navbar/Navbar";
import { useResume } from "../../context/ResumeContext";

const Template2 = () => {
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

  const handleArrayFieldChange = (section, index, key, value) => {
    const updated = [...localData[section]];
    updated[index][key] = value;
    setLocalData({ ...localData, [section]: updated });
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
    <div style={{ minHeight: "100vh", backgroundColor: "#f3f4f6" }}>
      <Navbar />
      <div style={{ display: "flex" }}>
        <Sidebar onEnhance={handleEnhance} resumeRef={resumeRef} />

        <div style={{ flexGrow: 1, padding: "2.5rem", display: "flex", flexDirection: "column", alignItems: "center" }}>
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
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1.5rem" }}>
              <div>
                {editMode ? (
                  <>
                    <input
                      type="text"
                      value={localData.name}
                      onChange={(e) => handleFieldChange("name", e.target.value)}
                      style={{ fontSize: "1.5rem", fontWeight: "bold", display: "block" }}
                    />
                    <input
                      type="text"
                      value={localData.role}
                      onChange={(e) => handleFieldChange("role", e.target.value)}
                      style={{ fontSize: "1rem", color: "#6b7280" }}
                    />
                  </>
                ) : (
                  <>
                    <h1 style={{ fontSize: "1.5rem", fontWeight: "bold" }}>{resumeData.name}</h1>
                    <h2 style={{ fontSize: "1rem", color: "#6b7280" }}>{resumeData.role}</h2>
                  </>
                )}
              </div>
              <div style={{ textAlign: "right" }}>
                {["email", "phone", "location", "linkedin", "github", "portfolio"].map((field) =>
                  editMode ? (
                    <input
                      key={field}
                      type="text"
                      value={localData[field]}
                      onChange={(e) => handleFieldChange(field, e.target.value)}
                      style={{ display: "block", marginBottom: "0.25rem" }}
                    />
                  ) : (
                    <p key={field}>{resumeData[field]}</p>
                  )
                )}
              </div>
            </div>

            {/* Summary */}
            <div style={{ marginBottom: "1.5rem" }}>
              <h3 style={{ fontWeight: "bold", fontSize: "1.25rem" }}>Summary</h3>
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

            {/* Skills, Languages, Interests */}
            {["skills", "languages", "interests"].map((section) => (
              <div key={section} style={{ marginBottom: "1.5rem" }}>
                <h3 style={{ fontWeight: "bold", fontSize: "1.25rem" }}>{section.charAt(0).toUpperCase() + section.slice(1)}</h3>
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
                  <ul>
                    {resumeData[section].map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}

            {/* Experience */}
            <div style={{ marginBottom: "1.5rem" }}>
              <h3 style={{ fontWeight: "bold", fontSize: "1.25rem" }}>Experience</h3>
              {localData.experience.map((exp, idx) => (
                <div key={idx} style={{ marginBottom: "1rem" }}>
                  {editMode ? (
                    <>
                      <input
                        type="text"
                        value={exp.title}
                        onChange={(e) => handleArrayFieldChange("experience", idx, "title", e.target.value)}
                        placeholder="Title"
                      />
                      <input
                        type="text"
                        value={exp.companyName}
                        onChange={(e) => handleArrayFieldChange("experience", idx, "companyName", e.target.value)}
                        placeholder="Company"
                      />
                      <input
                        type="text"
                        value={exp.date}
                        onChange={(e) => handleArrayFieldChange("experience", idx, "date", e.target.value)}
                        placeholder="Date"
                      />
                      <input
                        type="text"
                        value={exp.companyLocation}
                        onChange={(e) => handleArrayFieldChange("experience", idx, "companyLocation", e.target.value)}
                        placeholder="Location"
                      />
                      <textarea
                        value={exp.accomplishment.join("\n")}
                        onChange={(e) => handleArrayFieldChange(
                          "experience",
                          idx,
                          "accomplishment",
                          e.target.value.split("\n")
                        )}
                      />
                    </>
                  ) : (
                    <>
                      <p>
                        <strong>{exp.title}</strong> at {exp.companyName} ({exp.date}) - {exp.companyLocation}
                      </p>
                      <ul>
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
              <h3 style={{ fontWeight: "bold", fontSize: "1.25rem" }}>Education</h3>
              {localData.education.map((edu, idx) => (
                <div key={idx} style={{ marginBottom: "1rem" }}>
                  {editMode ? (
                    <>
                      <input
                        type="text"
                        value={edu.degree}
                        onChange={(e) => handleArrayFieldChange("education", idx, "degree", e.target.value)}
                        placeholder="Degree"
                      />
                      <input
                        type="text"
                        value={edu.institution}
                        onChange={(e) => handleArrayFieldChange("education", idx, "institution", e.target.value)}
                        placeholder="Institution"
                      />
                      <input
                        type="text"
                        value={edu.duration}
                        onChange={(e) => handleArrayFieldChange("education", idx, "duration", e.target.value)}
                        placeholder="Duration"
                      />
                      <input
                        type="text"
                        value={edu.location}
                        onChange={(e) => handleArrayFieldChange("education", idx, "location", e.target.value)}
                        placeholder="Location"
                      />
                    </>
                  ) : (
                    <p>
                      <strong>{edu.degree}</strong>, {edu.institution} ({edu.duration}) - {edu.location}
                    </p>
                  )}
                </div>
              ))}
            </div>

            {/* Projects */}
            <div style={{ marginBottom: "1.5rem" }}>
              <h3 style={{ fontWeight: "bold", fontSize: "1.25rem" }}>Projects</h3>
              {localData.projects.map((proj, idx) => (
                <div key={idx} style={{ marginBottom: "1rem" }}>
                  {editMode ? (
                    <>
                      <input
                        type="text"
                        value={proj.name}
                        onChange={(e) => handleArrayFieldChange("projects", idx, "name", e.target.value)}
                        placeholder="Project Name"
                      />
                      <textarea
                        value={proj.description}
                        onChange={(e) => handleArrayFieldChange("projects", idx, "description", e.target.value)}
                        placeholder="Description"
                      />
                      <input
                        type="text"
                        value={proj.technologies.join(", ")}
                        onChange={(e) => handleArrayFieldChange("projects", idx, "technologies", e.target.value.split(",").map((t) => t.trim()))}
                        placeholder="Technologies"
                      />
                      <input
                        type="text"
                        value={proj.link}
                        onChange={(e) => handleArrayFieldChange("projects", idx, "link", e.target.value)}
                        placeholder="Live Link"
                      />
                      <input
                        type="text"
                        value={proj.github}
                        onChange={(e) => handleArrayFieldChange("projects", idx, "github", e.target.value)}
                        placeholder="GitHub"
                      />
                    </>
                  ) : (
                    <p>
                      <strong>{proj.name}</strong>: {proj.description} (<a href={proj.link}>Live</a> | <a href={proj.github}>GitHub</a>)
                    </p>
                  )}
                </div>
              ))}
            </div>

            {/* Certifications and Achievements */}
            {["certifications", "achievements"].map((section) => (
              <div key={section} style={{ marginBottom: "1.5rem" }}>
                <h3 style={{ fontWeight: "bold", fontSize: "1.25rem" }}>{section.charAt(0).toUpperCase() + section.slice(1)}</h3>
                {editMode ? (
                  localData[section].map((item, idx) => (
                    <div key={idx}>
                      {typeof item === "string" ? (
                        <input
                          type="text"
                          value={item}
                          onChange={(e) => {
                            const updated = [...localData[section]];
                            updated[idx] = e.target.value;
                            handleFieldChange(section, updated);
                          }}
                        />
                      ) : (
                        Object.keys(item).map((key) => (
                          <input
                            key={key}
                            type="text"
                            value={item[key]}
                            onChange={(e) => {
                              const updated = [...localData[section]];
                              updated[idx][key] = e.target.value;
                              handleFieldChange(section, updated);
                            }}
                            placeholder={key}
                          />
                        ))
                      )}
                    </div>
                  ))
                ) : (
                  <ul>
                    {resumeData[section].map((item, idx) => (
                      <li key={idx}>
                        {typeof item === "string"
                          ? item
                          : Object.values(item).join(" | ")}
                      </li>
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
                  style={{ backgroundColor: "#10b981", color: "white", padding: "0.5rem 1rem", borderRadius: "0.375rem", marginRight: "0.5rem" }}
                >
                  Save
                </button>
                <button
                  onClick={handleCancel}
                  style={{ backgroundColor: "#6b7280", color: "white", padding: "0.5rem 1rem", borderRadius: "0.375rem" }}
                >
                  Cancel
                </button>
              </>
            ) : (
              <button
                onClick={() => setEditMode(true)}
                style={{ backgroundColor: "#3b82f6", color: "white", padding: "0.5rem 1rem", borderRadius: "0.375rem" }}
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

export default Template2;