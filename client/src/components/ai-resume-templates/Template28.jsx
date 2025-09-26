import React, { useState, useRef, useEffect } from "react";
import Sidebar from "../Sidebar/Sidebar";
import Navbar from "../Navbar/Navbar";
import { useResume } from "../../context/ResumeContext";
import html2pdf from "html2pdf.js";

const Template28 = () => {
  const resumeRef = useRef(null);
  const { resumeData, setResumeData } = useResume();
  const [editMode, setEditMode] = useState(false);
  const [localData, setLocalData] = useState(resumeData);
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    setLocalData(resumeData);
  }, [resumeData]);

  const handleFieldChange = (field, value) => {
    const updatedData = { ...localData, [field]: value };
    setLocalData(updatedData);
    localStorage.setItem("resumeData", JSON.stringify(updatedData));
  };

  const handleSave = () => {
    setResumeData(localData);
    setEditMode(false);
  };

  const handleCancel = () => {
    setLocalData(resumeData);
    setEditMode(false);
  };

  const handleDownloadPDF = () => {
    setIsDownloading(true);
    setTimeout(() => {
      if (resumeRef.current) {
        html2pdf().from(resumeRef.current).save();
      }
      setIsDownloading(false);
    }, 100);
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#edf2f7" }}>
      <Navbar />
      <div style={{ display: "flex" }}>
        <Sidebar />
        <div
          style={{
            flexGrow: 1,
            padding: "3rem",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <div
            ref={resumeRef}
            style={{
              backgroundColor: "#ffffff",
              color: "#1a202c",
              maxWidth: "900px",
              width: "100%",
              boxShadow: "0 15px 35px rgba(0,0,0,0.08)",
              padding: "3rem 2.5rem",
              borderRadius: "1.75rem",
              fontFamily: "'Inter', sans-serif",
              borderTop: "8px solid #10b981",
              transition: "all 0.3s ease-in-out",
            }}
          >
            {!editMode && !isDownloading && (
              <button
                onClick={handleDownloadPDF}
                style={{
                  backgroundColor: "#10b981",
                  color: "#ffffff",
                  padding: "0.6rem 1.5rem",
                  border: "none",
                  borderRadius: "0.5rem",
                  cursor: "pointer",
                  fontWeight: "600",
                  marginBottom: "2rem",
                  boxShadow: "0 4px 8px rgba(16,185,129,0.3)",
                  transition: "all 0.3s",
                }}
                onMouseOver={(e) =>
                  (e.currentTarget.style.backgroundColor = "#0f9d75")
                }
                onMouseOut={(e) =>
                  (e.currentTarget.style.backgroundColor = "#10b981")
                }
              >
                Download PDF
              </button>
            )}

            {/* Achievements */}
            <div style={{ marginTop: "2rem" }}>
              <h3
                style={{
                  fontWeight: "700",
                  fontSize: "1.3rem",
                  color: "#10b981",
                  borderBottom: "2px solid #10b981",
                  paddingBottom: "0.3rem",
                  marginBottom: "1rem",
                  letterSpacing: "0.5px",
                }}
              >
                Achievements
              </h3>
              <ul style={{ paddingLeft: "1.25rem", lineHeight: "1.7" }}>
                {(resumeData.achievements || []).map((ach, idx) => (
                  <li
                    key={idx}
                    style={{
                      marginBottom: "0.7rem",
                      position: "relative",
                      paddingLeft: "1.2rem",
                    }}
                  >
                    <span
                      style={{
                        position: "absolute",
                        left: 0,
                        top: "0.25rem",
                        width: "0.5rem",
                        height: "0.5rem",
                        backgroundColor: "#10b981",
                        borderRadius: "50%",
                      }}
                    ></span>
                    {ach.keyAchievements || ach}
                  </li>
                ))}
              </ul>
            </div>

            {/* Projects */}
            <div style={{ marginTop: "2.5rem" }}>
              <h3
                style={{
                  fontWeight: "700",
                  fontSize: "1.3rem",
                  color: "#10b981",
                  borderBottom: "2px solid #10b981",
                  paddingBottom: "0.3rem",
                  marginBottom: "1rem",
                  letterSpacing: "0.5px",
                }}
              >
                Projects
              </h3>
              <ul style={{ paddingLeft: "1.25rem", lineHeight: "1.7" }}>
                {(resumeData.projects || []).map((proj, idx) => (
                  <li
                    key={idx}
                    style={{
                      marginBottom: "0.7rem",
                      position: "relative",
                      paddingLeft: "1.2rem",
                    }}
                  >
                    <span
                      style={{
                        position: "absolute",
                        left: 0,
                        top: "0.25rem",
                        width: "0.5rem",
                        height: "0.5rem",
                        backgroundColor: "#10b981",
                        borderRadius: "50%",
                      }}
                    ></span>
                    <strong>{proj.title || proj.name}</strong>: {proj.description}
                  </li>
                ))}
              </ul>
            </div>

            {/* Certifications */}
            <div style={{ marginTop: "2.5rem" }}>
              <h3
                style={{
                  fontWeight: "700",
                  fontSize: "1.3rem",
                  color: "#10b981",
                  borderBottom: "2px solid #10b981",
                  paddingBottom: "0.3rem",
                  marginBottom: "1rem",
                  letterSpacing: "0.5px",
                }}
              >
                Certifications
              </h3>
              <ul style={{ paddingLeft: "1.25rem", lineHeight: "1.7" }}>
                {(resumeData.certifications || []).map((cert, idx) => (
                  <li
                    key={idx}
                    style={{
                      marginBottom: "0.7rem",
                      position: "relative",
                      paddingLeft: "1.2rem",
                    }}
                  >
                    <span
                      style={{
                        position: "absolute",
                        left: 0,
                        top: "0.25rem",
                        width: "0.5rem",
                        height: "0.5rem",
                        backgroundColor: "#10b981",
                        borderRadius: "50%",
                      }}
                    ></span>
                    {cert.title || cert}
                  </li>
                ))}
              </ul>
            </div>

            {/* Languages */}
            <div style={{ marginTop: "2.5rem" }}>
              <h3
                style={{
                  fontWeight: "700",
                  fontSize: "1.3rem",
                  color: "#10b981",
                  borderBottom: "2px solid #10b981",
                  paddingBottom: "0.3rem",
                  marginBottom: "1rem",
                  letterSpacing: "0.5px",
                }}
              >
                Languages
              </h3>
              <ul style={{ paddingLeft: "1.25rem", lineHeight: "1.7" }}>
                {(resumeData.languages || []).map((lang, idx) => (
                  <li
                    key={idx}
                    style={{
                      marginBottom: "0.7rem",
                      position: "relative",
                      paddingLeft: "1.2rem",
                    }}
                  >
                    <span
                      style={{
                        position: "absolute",
                        left: 0,
                        top: "0.25rem",
                        width: "0.5rem",
                        height: "0.5rem",
                        backgroundColor: "#10b981",
                        borderRadius: "50%",
                      }}
                    ></span>
                    {lang.language || lang}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Template28;
