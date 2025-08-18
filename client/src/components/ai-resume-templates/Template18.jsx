import React, { useState, useRef, useEffect } from "react";
import Sidebar from "../Sidebar/Sidebar";
import Navbar from "../Navbar/Navbar";
import { useResume } from "../../context/ResumeContext";

const Template22 = () => {
  const resumeRef = useRef(null);
  const { resumeData, setResumeData } = useResume();
  const [editMode, setEditMode] = useState(false);
  const [localData, setLocalData] = useState(resumeData);
  const [profileImage, setProfileImage] = useState(null);

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

  const addEducation = () => {
    handleFieldChange("education", [
      ...localData.education,
      { degree: "New Degree", institution: "New Institution", duration: "Year - Year" },
    ]);
  };

  const removeEducation = (index) => {
    const updated = [...localData.education];
    updated.splice(index, 1);
    handleFieldChange("education", updated);
  };

  const addExperience = () => {
    handleFieldChange("experience", [
      ...localData.experience,
      {
        title: "New Title",
        companyName: "New Company",
        date: "Year - Year",
        accomplishment: ["Achievement 1"],
      },
    ]);
  };

  const removeExperience = (index) => {
    const updated = [...localData.experience];
    updated.splice(index, 1);
    handleFieldChange("experience", updated);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setProfileImage(reader.result);
      reader.readAsDataURL(file);
    }
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f3f4f6" }}>
      <Navbar />
      <div style={{ display: "flex" }}>
        <Sidebar resumeRef={resumeRef} />
        <div style={{ flex: 1, padding: "2rem", display: "flex", justifyContent: "center" }}>
          <div
            ref={resumeRef}
            style={{
              backgroundColor: "#fff",
              padding: "2rem",
              width: "100%",
              maxWidth: "850px",
              borderRadius: "0.5rem",
              fontFamily: "Arial, sans-serif",
              border: "1px solid #d1d5db",
            }}
          >
            {/* Header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                {editMode ? (
                  <>
                    <input
                      value={localData.name}
                      onChange={(e) => handleFieldChange("name", e.target.value)}
                      style={{ fontSize: "1.5rem", fontWeight: "bold" }}
                    />
                    <input
                      value={localData.role}
                      onChange={(e) => handleFieldChange("role", e.target.value)}
                      style={{ fontSize: "1rem", color: "#555" }}
                    />
                  </>
                ) : (
                  <>
                    <h1 style={{ fontSize: "1.5rem", fontWeight: "bold" }}>{resumeData.name}</h1>
                    <h2 style={{ fontSize: "1rem", color: "#555" }}>{resumeData.role}</h2>
                  </>
                )}
              </div>
              <div>
                {editMode ? (
                  <label style={{ cursor: "pointer" }}>
                    <img
                      src={profileImage || "https://via.placeholder.com/80"}
                      alt="Profile"
                      style={{
                        width: "120px",
                        height: "120px",
                        borderRadius: "10px",
                        objectFit: "cover",
                      }}
                    />
                    <input type="file" accept="image/*" onChange={handleImageUpload} style={{ display: "none" }} />
                    <p style={{ fontSize: "0.75rem", color: "#2563eb" }}>Click to change</p>
                  </label>
                ) : (
                  <img
                    src={
                      profileImage ||
                      "https://i.pinimg.com/originals/03/d8/db/03d8db5fa74516252ade0c0bc77aeb9e.jpg"
                    }
                    alt="Profile"
                    style={{ width: "120px", height: "120px", borderRadius: "10px", objectFit: "cover" }}
                  />
                )}
              </div>
            </div>

            <hr style={{ margin: "1rem 0", borderColor: "#ccc" }} />

            {/* Summary */}
            <section>
              <h1 style={{color:"red", fontWeight:"700", fontSize:"20px"}}>Summary</h1>
              {editMode ? (
                <textarea
                  value={localData.summary}
                  onChange={(e) => handleFieldChange("summary", e.target.value)}
                  rows={4}
                  style={{ width: "100%", marginTop: "0.5rem", padding: "0.5rem" }}
                />
              ) : (
                <p>{resumeData.summary}</p>
              )}
            </section>

            <hr style={{ margin: "1rem 0", borderColor: "#ccc" }} />

            {/* Contact */}
            <section>
              <h3 style={{ fontWeight:"700", fontSize:"20px"}}>Contact</h3>
              {["location", "phone", "email", "linkedin"].map((field) =>
                editMode ? (
                  <input
                    key={field}
                    value={localData[field]}
                    onChange={(e) => handleFieldChange(field, e.target.value)}
                    placeholder={field}
                    style={{ width: "100%", marginTop: "0.25rem", borderBottom: "1px solid #ccc" }}
                  />
                ) : (
                  <p key={field}>{resumeData[field]}</p>
                )
              )}
            </section>

            <hr style={{ margin: "1rem 0", borderColor: "#ccc" }} />

            {/* Skills */}
            <section>
              <h3 style={{color:"red", fontWeight:"700", fontSize:"20px"}}>Skills</h3>
              {editMode ? (
                <textarea
                  value={localData.skills?.join(", ") || ""}
                  onChange={(e) =>
                    handleFieldChange(
                      "skills",
                      e.target.value.split(",").map((s) => s.trim())
                    )
                  }
                  style={{ width: "100%", marginTop: "0.5rem", padding: "0.5rem" }}
                />
              ) : (
                <ul>
                  {resumeData.skills?.map((skill, i) => (
                    <li key={i}>{skill}</li>
                  ))}
                </ul>
              )}
            </section>

            <hr style={{ margin: "1rem 0", borderColor: "#ccc" }} />

            {/* Education */}
            <section>
              <h3 style={{fontWeight:"700", fontSize:"20px"}}>Education</h3>
              {localData.education.map((edu, i) => (
                <div key={i}>
                  {editMode ? (
                    <>
                      <input
                        value={edu.degree}
                        onChange={(e) => {
                          const updated = [...localData.education];
                          updated[i].degree = e.target.value;
                          handleFieldChange("education", updated);
                        }}
                        style={{ width: "100%" }}
                      />
                      <input
                        value={edu.institution}
                        onChange={(e) => {
                          const updated = [...localData.education];
                          updated[i].institution = e.target.value;
                          handleFieldChange("education", updated);
                        }}
                        style={{ width: "100%" }}
                      />
                      <input
                        value={edu.duration}
                        onChange={(e) => {
                          const updated = [...localData.education];
                          updated[i].duration = e.target.value;
                          handleFieldChange("education", updated);
                        }}
                        style={{ width: "100%" }}
                      />
                      <button onClick={() => removeEducation(i)} style={{ color: "red" }}>
                        Remove
                      </button>
                    </>
                  ) : (
                    <>
                      <p>{edu.degree}</p>
                      <p>{edu.institution} ({edu.duration})</p>
                    </>
                  )}
                </div>
              ))}
              {editMode && (
                <button onClick={addEducation} style={{ marginTop: "0.5rem", color: "#2563eb" }}>
                  + Add Education
                </button>
              )}
            </section>

            <hr style={{ margin: "1rem 0", borderColor: "#ccc" }} />

            {/* Experience */}
            <section>
              <h3 style={{color:"red", fontWeight:"700", fontSize:"20px"}}>Experience</h3>
              {localData.experience.map((exp, i) => (
                <div key={i}>
                  {editMode ? (
                    <>
                      <input
                        value={exp.title}
                        onChange={(e) => {
                          const updated = [...localData.experience];
                          updated[i].title = e.target.value;
                          handleFieldChange("experience", updated);
                        }}
                        style={{ width: "100%" }}
                      />
                      <input
                        value={exp.companyName}
                        onChange={(e) => {
                          const updated = [...localData.experience];
                          updated[i].companyName = e.target.value;
                          handleFieldChange("experience", updated);
                        }}
                        style={{ width: "100%" }}
                      />
                      <input
                        value={exp.date}
                        onChange={(e) => {
                          const updated = [...localData.experience];
                          updated[i].date = e.target.value;
                          handleFieldChange("experience", updated);
                        }}
                        style={{ width: "100%" }}
                      />
                      <textarea
                        value={exp.accomplishment.join("\n")}
                        onChange={(e) => {
                          const updated = [...localData.experience];
                          updated[i].accomplishment = e.target.value
                            .split("\n")
                            .filter(Boolean);
                          handleFieldChange("experience", updated);
                        }}
                        rows={3}
                        style={{ width: "100%" }}
                      />
                      <button onClick={() => removeExperience(i)} style={{ color: "red" }}>
                        Remove
                      </button>
                    </>
                  ) : (
                    <>
                      <p>{exp.title} at {exp.companyName}</p>
                      <p>{exp.date}</p>
                      <ul>
                        {exp.accomplishment.map((item, j) => (
                          <li key={j}>{item}</li>
                        ))}
                      </ul>
                    </>
                  )}
                </div>
              ))}
              {editMode && (
                <button onClick={addExperience} style={{ marginTop: "0.5rem", color: "#2563eb" }}>
                  + Add Experience
                </button>
              )}
            </section>

            {/* Buttons */}
            <div  className="no-print" style={{ textAlign: "center", marginTop: "2rem" }} >
              {editMode ? (
                <>
                  <button
                    onClick={handleSave}
                    style={{ backgroundColor: "#10b981", color: "#fff", padding: "0.5rem 1rem", marginRight: "0.5rem" }}
                  >
                    Save
                  </button>
                  <button
                    onClick={handleCancel}
                    style={{ backgroundColor: "#6b7280", color: "#fff", padding: "0.5rem 1rem" }}
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <button className="no-print"
                  onClick={() => setEditMode(true)}
                  style={{ backgroundColor: "#3b82f6", color: "#fff", padding: "0.5rem 1rem" }}
                >
                  Edit
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Template22;
