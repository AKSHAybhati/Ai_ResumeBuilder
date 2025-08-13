import React, {useState, useRef, useEffect } from 'react';
import { useResume } from '../../context/ResumeContext';
import Navbar from '../Navbar/Navbar';
import Sidebar from '../Sidebar/Sidebar';

const Template3 = () => {
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

  // Map resumeData to match template expectations
  const mappedData = {
    name: localData.name || "John Doe",
    title: localData.role || "FULL STACK DEVELOPER",
    contact: {
      phone: localData.phone || "123-456-7890",
      email: localData.email || "john@example.com",
      location: localData.location || "Pune",
      linkedin: localData.linkedin || "https://linkedin.com/in/john"
    },
    profile: localData.summary || "Passionate full-stack developer with 3+ years of experience...",
    experience: localData.experience?.map(exp => ({
      title: exp.title || "Software Developer",
      company: exp.companyName || "ABC Pvt Ltd",
      period: exp.date || "2020 - Present",
      location: exp.companyLocation || "Mumbai",
      details: exp.accomplishment || ["Built scalable MERN applications used by 10k+ users"]
    })) || [],
    education: {
      degree: localData.education?.[0]?.degree || "B.Tech in Computer Science",
      institution: localData.education?.[0]?.institution || "XYZ University",
      period: localData.education?.[0]?.duration || "2016 - 2020",
      location: localData.education?.[0]?.location || "Pune"
    },
    projects: localData.projects || [{
      name: "StudySync",
      technologies: ["React", "Express", "MongoDB"],
      link: "https://studysync.dev",
      github: "https://github.com/johndoe/studysync",
      description: "An online platform where students can upload, download, and interact with study notes."
    }],
    certifications: localData.certifications || [{
      title: "AWS Certified Developer",
      issuer: "Amazon",
      date: "Jan 2023"
    }]
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#FFFFFF" }}>
      <Navbar />
      <div style={{ display: "flex" }}>
        <Sidebar onEnhance={handleEnhance} resumeRef={resumeRef} />

        <div style={{ flexGrow: 1, padding: "2.5rem", display: "flex", flexDirection: "column", alignItems: "center" }}>
          <div
            ref={resumeRef}
            style={{
              backgroundColor: "#FFFFFF",
              color: "#111827",
              maxWidth: "64rem",
              width: "100%",
              padding: "2rem",
              boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
              borderRadius: "0.5rem",
            }}
          >
            <div style={{ fontFamily: 'Arial, sans-serif', maxWidth: '800px', margin: 'auto', padding: '20px', lineHeight: '1.6', color: '#000' }}>
              {/* Header */}
              <input type="text" value={mappedData.name} onChange={(e) => handleFieldChange("name", e.target.value)} style={{ fontSize: '28px', fontWeight: 'bold', width: '100%', border: 'none' }} />
              <input type="text" value={mappedData.title} onChange={(e) => handleFieldChange("role", e.target.value)} style={{ fontSize: '16px', marginBottom: '10px', width: '100%', border: 'none' }} />

              {/* Contact */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '20px' }}>
                <input type="text" value={mappedData.contact.phone} onChange={(e) => handleFieldChange("phone", e.target.value)} style={{ border: 'none' }} />
                <input type="text" value={mappedData.contact.email} onChange={(e) => handleFieldChange("email", e.target.value)} style={{ border: 'none' }} />
                <input type="text" value={mappedData.contact.location} onChange={(e) => handleFieldChange("location", e.target.value)} style={{ border: 'none' }} />
                <input type="text" value={mappedData.contact.linkedin} onChange={(e) => handleFieldChange("linkedin", e.target.value)} style={{ border: 'none' }} />
              </div>

              {/* Profile */}
              <h3 style={{ borderBottom: '2px solid black', fontWeight: 'bold' }}>PROFILE</h3>
              <textarea
                rows="2"
                value={mappedData.profile}
                onChange={(e) => handleFieldChange("summary", e.target.value)}
                style={{ width: '100%', border: 'none', resize: 'none' }}
              />

              {/* Experience */}
              <h3 style={{ borderBottom: '2px solid black', fontWeight: 'bold', marginTop: '30px' }}>EXPERIENCE</h3>
              {mappedData.experience.map((exp, expIndex) => (
                <div key={expIndex} style={{ marginBottom: '20px' }}>
                  <input
                    type="text"
                    value={exp.title}
                    onChange={(e) => {
                      const updated = [...localData.experience];
                      updated[expIndex] = { ...updated[expIndex], title: e.target.value };
                      handleFieldChange("experience", updated);
                    }}
                    style={{ border: 'none', width: '100%', fontWeight: 'bold' }}
                  />
                  <input
                    type="text"
                    value={`${exp.company} | ${exp.period}`}
                    onChange={(e) => {
                      const [company, period] = e.target.value.split("|").map(s => s.trim());
                      const updated = [...localData.experience];
                      updated[expIndex] = { ...updated[expIndex], companyName: company, date: period };
                      handleFieldChange("experience", updated);
                    }}
                    style={{ border: 'none', width: '100%', fontStyle: 'italic' }}
                  />
                  <input
                    type="text"
                    value={exp.location}
                    onChange={(e) => {
                      const updated = [...localData.experience];
                      updated[expIndex] = { ...updated[expIndex], companyLocation: e.target.value };
                      handleFieldChange("experience", updated);
                    }}
                    style={{ border: 'none', width: '100%', fontStyle: 'italic' }}
                  />
                  <ul style={{ marginTop: '5px' }}>
                    {exp.details.map((detail, detailIndex) => (
                      <li key={detailIndex}>
                        <input
                          type="text"
                          value={detail}
                          onChange={(e) => {
                            const updated = [...localData.experience];
                            const updatedDetails = [...(updated[expIndex].accomplishment || [])];
                            updatedDetails[detailIndex] = e.target.value;
                            updated[expIndex] = { ...updated[expIndex], accomplishment: updatedDetails };
                            handleFieldChange("experience", updated);
                          }}
                          style={{ border: 'none', width: '100%' }}
                        />
                      </li>
                    ))}
                  </ul>
                </div>
              ))}

              {/* Education */}
              <h3 style={{ borderBottom: '2px solid black', fontWeight: 'bold', marginTop: '30px' }}>EDUCATION</h3>
              <input type="text" value={mappedData.education.degree} onChange={(e) => {
                const updated = [...(localData.education || [])];
                updated[0] = { ...(updated[0] || {}), degree: e.target.value };
                handleFieldChange("education", updated);
              }} style={{ border: 'none', width: '100%' }} />
              <input type="text" value={mappedData.education.institution} onChange={(e) => {
                const updated = [...(localData.education || [])];
                updated[0] = { ...(updated[0] || {}), institution: e.target.value };
                handleFieldChange("education", updated);
              }} style={{ border: 'none', width: '100%' }} />
              <input type="text" value={mappedData.education.period} onChange={(e) => {
                const updated = [...(localData.education || [])];
                updated[0] = { ...(updated[0] || {}), duration: e.target.value };
                handleFieldChange("education", updated);
              }} style={{ border: 'none', width: '100%' }} />
              <input type="text" value={mappedData.education.location} onChange={(e) => {
                const updated = [...(localData.education || [])];
                updated[0] = { ...(updated[0] || {}), location: e.target.value };
                handleFieldChange("education", updated);
              }} style={{ border: 'none', width: '100%' }} />

              {/* Projects */}
              <h3 style={{ borderBottom: '2px solid black', fontWeight: 'bold', marginTop: '30px' }}>PROJECTS</h3>
              <input type="text" value={mappedData.projects[0]?.name} onChange={(e) => {
                const updated = [...(localData.projects || [])];
                updated[0] = { ...(updated[0] || {}), name: e.target.value };
                handleFieldChange("projects", updated);
              }} style={{ border: 'none', width: '100%' }} />
              <input type="text" value={mappedData.projects[0]?.technologies.join(", ")} onChange={(e) => {
                const updated = [...(localData.projects || [])];
                updated[0] = { ...(updated[0] || {}), technologies: e.target.value.split(", ").map(s => s.trim()) };
                handleFieldChange("projects", updated);
              }} style={{ border: 'none', width: '100%', marginTop: '5px' }} />
              <input type="text" value={mappedData.projects[0]?.link} onChange={(e) => {
                const updated = [...(localData.projects || [])];
                updated[0] = { ...(updated[0] || {}), link: e.target.value };
                handleFieldChange("projects", updated);
              }} style={{ border: 'none', width: '100%' }} />
              <input type="text" value={mappedData.projects[0]?.github} onChange={(e) => {
                const updated = [...(localData.projects || [])];
                updated[0] = { ...(updated[0] || {}), github: e.target.value };
                handleFieldChange("projects", updated);
              }} style={{ border: 'none', width: '100%' }} />
              <textarea
                value={mappedData.projects[0]?.description}
                onChange={(e) => {
                  const updated = [...(localData.projects || [])];
                  updated[0] = { ...(updated[0] || {}), description: e.target.value };
                  handleFieldChange("projects", updated);
                }}
                style={{ width: '100%', border: 'none', resize: 'none' }}
                rows={1}
              />

              {/* Certifications */}
              <h3 style={{ borderBottom: '2px solid black', fontWeight: 'bold', marginTop: '30px' }}>CERTIFICATIONS</h3>
              <input type="text" value={mappedData.certifications[0]?.title} onChange={(e) => {
                const updated = [...(localData.certifications || [])];
                updated[0] = { ...(updated[0] || {}), title: e.target.value };
                handleFieldChange("certifications", updated);
              }} style={{ border: 'none', width: '100%' }} />
              <input type="text" value={mappedData.certifications[0]?.issuer} onChange={(e) => {
                const updated = [...(localData.certifications || [])];
                updated[0] = { ...(updated[0] || {}), issuer: e.target.value };
                handleFieldChange("certifications", updated);
              }} style={{ border: 'none', width: '100%' }} />
              <input type="text" value={mappedData.certifications[0]?.date} onChange={(e) => {
                const updated = [...(localData.certifications || [])];
                updated[0] = { ...(updated[0] || {}), date: e.target.value };
                handleFieldChange("certifications", updated);
              }} style={{ border: 'none', width: '100%' }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Template3;
