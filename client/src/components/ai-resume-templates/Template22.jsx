import { useState, useRef, useEffect } from "react";
import Sidebar from "../Sidebar/Sidebar";
import Navbar from "../Navbar/Navbar";
import { useResume } from "../../context/ResumeContext";
import { MapPin, Phone, Mail, Linkedin, Github, Globe } from "lucide-react";

const Template22 = () => {
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

  const sectionTitleStyle = {
    fontSize: "1.6rem",
    fontWeight: "700",
    marginBottom: "0.75rem",
    color: "#1f2937",
    borderBottom: "2px solid #4f46e5",
    paddingBottom: "0.25rem",
  };

  const listStyle = {
    paddingLeft: "1.25rem",
    lineHeight: "1.6",
    marginBottom: "1rem",
  };

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
          <div style={{ width: "100%", maxWidth: "900px" }}>
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
                flexDirection: "row",
              }}
            >
              {/* Left Column */}
              <div style={{ flex: 2, padding: "2rem" }}>
                {/* Header */}
                <div style={{ marginBottom: "1rem" }}>
                  {editMode ? (
                    <>
                      <input
                        type="text"
                        value={localData.name}
                        onChange={(e) =>
                          handleFieldChange("name", e.target.value)
                        }
                        style={{
                          fontSize: "2.5rem",
                          fontWeight: "700",
                          width: "100%",
                          marginBottom: "0.5rem",
                        }}
                      />
                      <input
                        type="text"
                        value={localData.role}
                        onChange={(e) =>
                          handleFieldChange("role", e.target.value)
                        }
                        style={{
                          fontSize: "1.2rem",
                          width: "100%",
                          marginBottom: "1rem",
                        }}
                      />
                    </>
                  ) : (
                    <>
                      <h1
                        style={{
                          fontSize: "2.5rem",
                          fontWeight: "700",
                          margin: 0,
                        }}
                      >
                        {resumeData.name}
                      </h1>
                      <h2
                        style={{
                          fontSize: "1.2rem",
                          color: "#4f46e5",
                          marginTop: "0.25rem",
                        }}
                      >
                        {resumeData.role}
                      </h2>
                    </>
                  )}
                </div>

                {/* Summary */}
                <div style={{ marginBottom: "1.5rem" }}>
                  <h3 style={sectionTitleStyle}>Summary</h3>
                  {editMode ? (
                    <textarea
                      value={localData.summary}
                      onChange={(e) =>
                        handleFieldChange("summary", e.target.value)
                      }
                      style={{ width: "100%" }}
                    />
                  ) : (
                    <p>{resumeData.summary}</p>
                  )}
                </div>

                {/* Experience */}
                <div style={{ marginBottom: "1.5rem" }}>
                  <h3 style={sectionTitleStyle}>Experience</h3>
                  {localData.experience.map((exp, idx) => (
                    <div key={idx} style={{ marginBottom: "1rem" }}>
                      {editMode ? (
                        <>
                          <input
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
                            style={{ width: "100%", marginBottom: "0.25rem" }}
                          />
                          <input
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
                            style={{ width: "100%", marginBottom: "0.5rem" }}
                          />
                          <ul style={listStyle}>
                            {exp.accomplishment.map((a, i) => (
                              <li key={i}>
                                <input
                                  value={a}
                                  onChange={(e) => {
                                    const updated = [...exp.accomplishment];
                                    updated[i] = e.target.value;
                                    handleArrayFieldChange(
                                      "experience",
                                      idx,
                                      "accomplishment",
                                      updated
                                    );
                                  }}
                                  style={{ width: "100%" }}
                                />
                              </li>
                            ))}
                          </ul>
                        </>
                      ) : (
                        <>
                          <p>
                            <strong>{exp.title}</strong> — {exp.companyName}
                          </p>
                          <ul style={listStyle}>
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
                  <h3 style={sectionTitleStyle}>Education</h3>
                  {localData.education.map((edu, idx) => (
                    <div key={idx}>
                      {editMode ? (
                        <input
                          value={`${edu.degree}, ${edu.institution} (${edu.duration})`}
                          onChange={(e) => {
                            const [degree, institutionPart] =
                              e.target.value.split(",");
                            const [institution, durationPart] =
                              institutionPart?.split("(") || ["", ""];
                            const duration = durationPart?.replace(")", "");
                            handleArrayFieldChange(
                              "education",
                              idx,
                              "degree",
                              degree?.trim()
                            );
                            handleArrayFieldChange(
                              "education",
                              idx,
                              "institution",
                              institution?.trim()
                            );
                            handleArrayFieldChange(
                              "education",
                              idx,
                              "duration",
                              duration?.trim()
                            );
                          }}
                          style={{ width: "100%", marginBottom: "0.5rem" }}
                        />
                      ) : (
                        <p>
                          <strong>{edu.degree}</strong>, {edu.institution} (
                          {edu.duration})
                        </p>
                      )}
                    </div>
                  ))}
                </div>

                {/* Certifications */}
                <div style={{ marginBottom: "1.5rem" }}>
                  <h3 style={sectionTitleStyle}>Certifications</h3>
                  {editMode
                    ? localData.certifications?.map((item, idx) => (
                        <input
                          key={idx}
                          type="text"
                          value={`${item.title} — ${item.issuer}, ${item.date}`}
                          onChange={(e) => {
                            const [title, rest] = e.target.value.split("—");
                            const [issuer, date] = rest?.split(",") || ["", ""];
                            const updated = [...localData.certifications];
                            updated[idx] = {
                              title: title?.trim(),
                              issuer: issuer?.trim(),
                              date: date?.trim(),
                            };
                            setLocalData({
                              ...localData,
                              certifications: updated,
                            });
                          }}
                          style={{ width: "100%", marginBottom: "0.5rem" }}
                        />
                      ))
                    : localData.certifications?.map((cert, idx) => (
                        <p key={idx}>
                          <strong>{cert.title}</strong> — {cert.issuer},{" "}
                          {cert.date}
                        </p>
                      ))}
                </div>

                {/* Achievements */}
                <div style={{ marginBottom: "1.5rem" }}>
                  <h3 style={sectionTitleStyle}>Achievements</h3>
                  {editMode ? (
                    <ul style={listStyle}>
                      {localData.achievements?.map((item, idx) => (
                        <li key={idx}>
                          <input
                            value={item}
                            onChange={(e) => {
                              const updated = [...localData.achievements];
                              updated[idx] = e.target.value;
                              setLocalData({
                                ...localData,
                                achievements: updated,
                              });
                            }}
                            style={{ width: "100%" }}
                          />
                        </li>
                      ))}
                    </ul>
                  ) : (
                    localData.achievements?.map((item, idx) => (
                      <p key={idx}>{item}</p>
                    ))
                  )}
                </div>
              </div>

              {/* Right Column */}
              <div
                style={{
                  flex: 1,
                  backgroundColor: "#f3f4f6",
                  padding: "2rem",
                  borderLeft: "1px solid #e5e7eb",
                }}
              >
                {/* Profile Image */}
                <div style={{ textAlign: "center", marginBottom: "1rem" }}>
                  {editMode ? (
                    <>
                      <label
                        htmlFor="profileImageUpload"
                        style={{ cursor: "pointer" }}
                      >
                        <img
                          src={localData.profileImage || "/images/profile.jpg"}
                          alt="Profile"
                          style={{
                            width: "120px",
                            height: "120px",
                            borderRadius: "50%",
                            objectFit: "cover",
                            border: "2px solid #6b7280",
                          }}
                        />
                      </label>
                      <input
                        type="file"
                        accept="image/png, image/jpeg, image/jpg"
                        id="profileImageUpload"
                        onChange={(e) => {
                          const file = e.target.files[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onloadend = () => {
                              setLocalData({
                                ...localData,
                                profileImage: reader.result,
                              });
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                        style={{ display: "none" }}
                      />
                      <p style={{ fontSize: "0.8rem", textAlign: "left" }}>
                        Click image to upload a new one
                      </p>
                    </>
                  ) : (
                    <img
                      src={resumeData.profileImage || "/images/profile.jpg"}
                      alt="Profile"
                      style={{
                        width: "120px",
                        height: "120px",
                        borderRadius: "50%",
                        objectFit: "cover",
                      }}
                    />
                  )}
                </div>

                {/* Contact */}
                <div style={{ marginBottom: "1.5rem" }}>
                  <h3 style={sectionTitleStyle}>Contact</h3>
                  {[
                    { icon: MapPin, field: "location" },
                    { icon: Phone, field: "phone" },
                    { icon: Mail, field: "email" },
                    { icon: Linkedin, field: "linkedin" },
                    { icon: Github, field: "github" },
                    { icon: Globe, field: "portfolio" },
                  ].map(({ icon: Icon, field }, idx) => (
                    <p
                      key={idx}
                      style={{ display: "flex", alignItems: "center" }}
                    >
                      <Icon size={16} style={{ marginRight: 6 }} />
                      {editMode ? (
                        <input
                          value={localData[field] || ""}
                          onChange={(e) =>
                            handleFieldChange(field, e.target.value)
                          }
                          style={{ width: "100%" }}
                        />
                      ) : (
                        resumeData[field]
                      )}
                    </p>
                  ))}
                </div>

                {/* Skills */}
                <div style={{ marginBottom: "1.5rem" }}>
                  <h3 style={sectionTitleStyle}>Skills</h3>
                  <ul style={listStyle}>
                    {localData.skills.map((skill, idx) => (
                      <li key={idx}>
                        {editMode ? (
                          <input
                            value={skill}
                            onChange={(e) =>
                              handleArrayFieldChange(
                                "skills",
                                idx,
                                null,
                                e.target.value
                              )
                            }
                            style={{ width: "100%" }}
                          />
                        ) : (
                          skill
                        )}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Languages */}
                <div style={{ marginBottom: "1.5rem" }}>
                  <h3 style={sectionTitleStyle}>Languages</h3>
                  <ul style={listStyle}>
                    {localData.languages.map((lang, idx) => (
                      <li key={idx}>
                        {editMode ? (
                          <input
                            value={lang}
                            onChange={(e) =>
                              handleArrayFieldChange(
                                "languages",
                                idx,
                                null,
                                e.target.value
                              )
                            }
                            style={{ width: "100%" }}
                          />
                        ) : (
                          lang
                        )}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Interests */}
                <div>
                  <h3 style={sectionTitleStyle}>Interests</h3>
                  <ul style={listStyle}>
                    {localData.interests.map((int, idx) => (
                      <li key={idx}>
                        {editMode ? (
                          <input
                            value={int}
                            onChange={(e) =>
                              handleArrayFieldChange(
                                "interests",
                                idx,
                                null,
                                e.target.value
                              )
                            }
                            style={{ width: "100%" }}
                          />
                        ) : (
                          int
                        )}
                      </li>
                    ))}
                  </ul>
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
    </div>
  );
};

export default Template22;
