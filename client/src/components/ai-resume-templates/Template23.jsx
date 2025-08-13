import { useState, useRef, useEffect } from "react";
import Sidebar from "../Sidebar/Sidebar";
import Navbar from "../Navbar/Navbar";
import { useResume } from "../../context/ResumeContext";
import { MapPin, Phone, Mail, Linkedin, Github, Globe } from "lucide-react";

const Template23 = () => {
  const resumeRef = useRef(null);
  const fileInputRef = useRef(null);
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
    updated[index] = key ? { ...updated[index], [key]: value } : value;
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

  const sectionHeaderStyle = {
    fontSize: "1.1rem",
    fontWeight: "700",
    color: "#1f4e79",
    borderBottom: "2px solid #1f4e79",
    marginBottom: "8px",
    paddingBottom: "2px",
    textTransform: "uppercase",
  };

  const profileImageStyle = {
    width: "120px",
    height: "120px",
    borderRadius: "50%",
    objectFit: "cover",
    cursor: "pointer",
    margin: "0 auto",
  };

  const renderText = (value, onChange, multiline = false) =>
    editMode ? (
      multiline ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          style={{ width: "100%", padding: "4px" }}
        />
      ) : (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          style={{ width: "100%", padding: "4px" }}
        />
      )
    ) : (
      value
    );

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f9fafb" }}>
      <Navbar />
      <div style={{ display: "flex" }}>
        <Sidebar onEnhance={() => {}} resumeRef={resumeRef} />
        <div
          style={{
            flexGrow: 1,
            padding: "2rem",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <div style={{ width: "100%", maxWidth: "1000px" }}>
            <div
              ref={resumeRef}
              style={{
                backgroundColor: "#ffffff",
                display: "flex",
                width: "100%",
                border: "1px solid #d1d5db",
                borderRadius: "0.5rem",
                overflow: "hidden",
                fontFamily: "Arial, sans-serif",
                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
                flexDirection: "column",
                minHeight: "auto",
              }}
            >

               {/* Header */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  backgroundColor: "#062E48",
                  padding: "15px 40px",
                  borderBottom: "1px solid #ccc",
                  gap: "40px",
                }}
              >
                {/* Name and Role - Left Side */}
                <div style={{ flex: "1", textAlign: "left" }}>
                  <h1 style={{ fontSize: "3rem", fontWeight: "bold", margin: "0 0 4px 0", color: "white" }}>
                    {renderText(localData.name, (val) =>
                      handleFieldChange("name", val)
                    )}
                  </h1>
                  <p style={{ fontSize: "1rem", color: "#E5E7EB", margin: "0" }}>
                    {renderText(localData.role, (val) =>
                      handleFieldChange("role", val)
                    )}
                  </p>
                </div>

                {/* Profile Image - Right Side */}
                <div>
                  <input
                    type="file"
                    accept="image/*"
                    style={{ display: "none" }}
                    ref={fileInputRef}
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          setLocalData((prev) => ({
                            ...prev,
                            profileImage: reader.result,
                          }));
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                  />
                  <div
                    style={{
                      cursor: editMode ? "pointer" : "default",
                      border: editMode ? "2px dashed #3b82f6" : "none",
                      borderRadius: "50%",
                      padding: editMode ? "2px" : "0",
                    }}
                    onClick={editMode ? () => fileInputRef.current.click() : undefined}
                    title={editMode ? "Click to change profile picture" : "Profile picture"}
                  >
                    <img
                      src={localData.profileImage || "/images/profile.jpg"}
                      alt="Profile"
                      style={profileImageStyle}
                    />
                  </div>
                </div>
              </div>
              

              {/* Main Content */}
              <div style={{ display: "flex", padding: "20px", width: "100%" }}>
                {/* Left Sidebar */}
                <div
                  style={{
                    width: "35%",
                    paddingRight: "20px",
                    borderRight: "1px solid #ccc",
                    minHeight: "100%",
                  }}
                >
                  {/* Contact */}
                  <div style={{ marginBottom: "20px" }}>
                    <h3 style={sectionHeaderStyle}>Contact</h3>
                    <div style={{ marginBottom: "10px", paddingLeft: "12px" }}>
                    <p style={{display: "flex", alignItems: "center", gap: "12px"}}>
                      <Phone size={14} />{" "}
                      {renderText(localData.phone, (val) =>
                        handleFieldChange("phone", val)
                      )}
                    </p>
                    <p style={{display: "flex", alignItems: "center", gap: "12px"}}>
                      <Mail size={14} />{" "}
                      {renderText(localData.email, (val) =>
                        handleFieldChange("email", val)
                      )}
                    </p>
                    <p style={{display: "flex", alignItems: "center", gap: "12px"}}>
                      <MapPin size={14} />{" "}
                      {renderText(localData.location, (val) =>
                        handleFieldChange("location", val)
                      )}
                    </p>
                    <p style={{display: "flex", alignItems: "center", gap: "12px"}}>
                      <Linkedin size={14} />{" "}
                      {renderText(localData.linkedin, (val) =>
                        handleFieldChange("linkedin", val)
                      )}
                    </p>
                    <p style={{display: "flex", alignItems: "center", gap: "12px"}}>
                      <Github size={14} />{" "}
                      {renderText(localData.github, (val) =>
                        handleFieldChange("github", val)
                      )}
                    </p>
                    <p style={{display: "flex", alignItems: "center", gap: "12px"}}>
                      <Globe size={14} />{" "}
                      {renderText(localData.portfolio, (val) =>
                        handleFieldChange("portfolio", val)
                      )}
                    </p>
                    </div>
                  </div>

                  {/* Education */}
                  <div style={{ marginBottom: "20px" }}>
                    <h3 style={sectionHeaderStyle}>Education</h3>
                    {localData.education.map((edu, i) => (
                      <div key={i} style={{ marginBottom: "10px", paddingLeft: "12px" }}>
                        <p style={{ fontWeight: "bold" }}>
                          {renderText(edu.degree, (val) =>
                            handleArrayFieldChange(
                              "education",
                              i,
                              "degree",
                              val
                            )
                          )}
                        </p>
                        <p>
                          {renderText(edu.institution, (val) =>
                            handleArrayFieldChange(
                              "education",
                              i,
                              "institution",
                              val
                            )
                          )}
                        </p>
                        <p>
                          {renderText(edu.duration, (val) =>
                            handleArrayFieldChange(
                              "education",
                              i,
                              "duration",
                              val
                            )
                          )}
                        </p>
                        <p>
                          {renderText(edu.location, (val) =>
                            handleArrayFieldChange(
                              "education",
                              i,
                              "location",
                              val
                            )
                          )}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Skills */}
                  <div style={{ marginBottom: "20px" }}>
                    <h3 style={sectionHeaderStyle}>Skills</h3>
                    <ul style={{ paddingLeft: "12px" }}>
                      {localData.skills.map((skill, i) => (
                        <li key={i}>
                          {renderText(skill, (val) =>
                            handleArrayFieldChange("skills", i, null, val)
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Languages */}
                  <div style={{ marginBottom: "20px" }}>
                    <h3 style={sectionHeaderStyle}>Languages</h3>
                    <ul style={{ paddingLeft: "12px" }}>
                      {localData.languages.map((lang, i) => (
                        <li key={i}>
                          {renderText(lang, (val) =>
                            handleArrayFieldChange("languages", i, null, val)
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Interests */}
                  <div style={{ marginBottom: "10px" }}>
                    <h3 style={sectionHeaderStyle}>Interests</h3>
                    <ul style={{ paddingLeft: "12px" }}>
                      {localData.interests.map((int, i) => (
                        <li key={i}>
                          {renderText(int, (val) =>
                            handleArrayFieldChange("interests", i, null, val)
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Right Content */}
                <div style={{ 
                  width: "65%", 
                  paddingLeft: "20px",
                  flex: "1",
                  minHeight: "100%",
                }}>
                  {/* Profile/Summary */}
                  <div style={{ marginBottom: "20px" }}>
                    <h3 style={sectionHeaderStyle}>Profile</h3>
                    {renderText(
                      localData.summary,
                      (val) => handleFieldChange("summary", val),
                      true
                    )}
                  </div>

                  {/* Work Experience */}
                  <div style={{ marginBottom: "20px" }}>
                    <h3 style={sectionHeaderStyle}>Working Experience</h3>
                    {localData.experience.map((exp, i) => (
                      <div key={i} style={{ marginBottom: "10px" }}>
                        <p style={{ fontWeight: "bold" }}>
                          {renderText(exp.title, (val) =>
                            handleArrayFieldChange(
                              "experience",
                              i,
                              "title",
                              val
                            )
                          )}
                        </p>
                        <p>
                          {renderText(exp.companyName, (val) =>
                            handleArrayFieldChange(
                              "experience",
                              i,
                              "companyName",
                              val
                            )
                          )}{" "}
                          |{" "}
                          {renderText(exp.date, (val) =>
                            handleArrayFieldChange("experience", i, "date", val)
                          )}
                        </p>
                        <p>
                          {renderText(exp.companyLocation, (val) =>
                            handleArrayFieldChange(
                              "experience",
                              i,
                              "companyLocation",
                              val
                            )
                          )}
                        </p>
                        <ul style={{ paddingLeft: "18px" }}>
                          {exp.accomplishment.map((acc, idx) => (
                            <li key={idx}>
                              {renderText(acc, (val) => {
                                const updatedAcc = [...exp.accomplishment];
                                updatedAcc[idx] = val;
                                handleArrayFieldChange(
                                  "experience",
                                  i,
                                  "accomplishment",
                                  updatedAcc
                                );
                              })}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>

                  {/* Certifications */}
                  <div style={{ marginBottom: "20px" }}>
                    <h3 style={sectionHeaderStyle}>Certifications</h3>
                    {localData.certifications.map((cert, i) => (
                      <div key={i} style={{ marginBottom: "10px" }}>
                        <p style={{ fontWeight: "bold" }}>
                          {renderText(cert.title, (val) =>
                            handleArrayFieldChange(
                              "certifications",
                              i,
                              "title",
                              val
                            )
                          )}
                        </p>
                        <p>
                          {renderText(cert.issuer, (val) =>
                            handleArrayFieldChange(
                              "certifications",
                              i,
                              "issuer",
                              val
                            )
                          )}
                        </p>
                        <p>
                          {renderText(cert.date, (val) =>
                            handleArrayFieldChange(
                              "certifications",
                              i,
                              "date",
                              val
                            )
                          )}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Achievements */}
                  <div>
                    <h3 style={sectionHeaderStyle}>Achievements</h3>
                    <ul >
                      {localData.achievements.map((ach, i) => (
                        <li key={i}>
                          {renderText(ach, (val) =>
                            handleArrayFieldChange("achievements", i, null, val)
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Edit Button at Bottom */}
            <div style={{ marginTop: "1.5rem", textAlign: "center" }}>
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
    </div>
  );
};

export default Template23;

