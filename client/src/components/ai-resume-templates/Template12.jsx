import React, { useState, useRef, useEffect } from "react";
import Sidebar from "../Sidebar/Sidebar";
import Navbar from "../Navbar/Navbar";
import { useResume } from "../../context/ResumeContext";
import html2pdf from "html2pdf.js";

const Template12 = () => {
  const resumeRef = useRef(null);
  const { resumeData, setResumeData } = useResume();
  const [editMode, setEditMode] = useState(false);
  const [localData, setLocalData] = useState(resumeData);
  const [isDownloading, setIsDownloading] = useState(false);

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
    <div style={{ minHeight: "100vh", backgroundColor: "#F0FDF4" }}>
      <Navbar />
      <div style={{ display: "flex" }}>
        <Sidebar />
        <div style={{ flexGrow: 1, padding: "2.5rem", display: "flex", flexDirection: "column", alignItems: "center" }}>
          <div ref={resumeRef} style={{ backgroundColor: "#FFFFFF", color: "#2D2D2D", maxWidth: "900px", width: "100%", boxShadow: "0 4px 6px rgba(0,0,0,0.1)", padding: "2.5rem", border: "2px dashed #10b981", borderRadius: "2rem" }}>
            {/* Header, Body, Editable Sections, etc. */}
            {/* Use localData and editMode for editing */}
            {/* Add your custom layout here, using resumeData fields */}
            {!editMode && !isDownloading && <button onClick={handleDownloadPDF}>Download PDF</button>}
            {/* Example: Achievements Section */}
            <div style={{ marginTop: '2rem' }}>
              <h3 style={{ fontWeight: 'bold', fontSize: '1.125rem', borderBottom: '1px solid #10b981' }}>Achievements</h3>
              <ul style={{ marginTop: '0.5rem', paddingLeft: '1rem' }}>
                {(resumeData.achievements || []).map((ach, idx) => (
                  <li key={idx}>{ach.keyAchievements || ach}</li>
                ))}
              </ul>
            </div>
            {/* Example: Projects Section */}
            <div style={{ marginTop: '2rem' }}>
              <h3 style={{ fontWeight: 'bold', fontSize: '1.125rem', borderBottom: '1px solid #10b981' }}>Projects</h3>
              <ul style={{ marginTop: '0.5rem', paddingLeft: '1rem' }}>
                {(resumeData.projects || []).map((proj, idx) => (
                  <li key={idx}>{proj.title || proj.name}: {proj.description}</li>
                ))}
              </ul>
            </div>
            {/* Add new sections inspired by Template1 */}
            <div style={{ marginTop: '2rem' }}>
              <h3 style={{ fontWeight: 'bold', fontSize: '1.125rem', borderBottom: '1px solid #10b981' }}>Certifications</h3>
              <ul style={{ marginTop: '0.5rem', paddingLeft: '1rem' }}>
                {(resumeData.certifications || []).map((cert, idx) => (
                  <li key={idx}>{cert.title || cert}</li>
                ))}
              </ul>
            </div>
            <div style={{ marginTop: '2rem' }}>
              <h3 style={{ fontWeight: 'bold', fontSize: '1.125rem', borderBottom: '1px solid #10b981' }}>Languages</h3>
              <ul style={{ marginTop: '0.5rem', paddingLeft: '1rem' }}>
                {(resumeData.languages || []).map((lang, idx) => (
                  <li key={idx}>{lang.language || lang}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Template12;
