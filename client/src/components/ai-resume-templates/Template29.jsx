import React, { useRef, useState } from "react";
import {
  FaEnvelope,
  FaPhone,
  FaLinkedin,
  FaGithub,
  FaMapMarkerAlt,
} from "react-icons/fa";
import Sidebar from "../Sidebar/Sidebar";
import Navbar from "../Navbar/Navbar";
import { useResume } from "../../context/ResumeContext";

const ResumeTemplate29 = () => {
  const resumeRef = useRef(null);

  // Pull everything from ResumeContext (same as Template 4)
  const { resumeData, setResumeData } = useResume();
  const [editMode, setEditMode] = useState(false);
  const [localData, setLocalData] = useState(resumeData);
  
  // Add default theme and font for styling
  const theme = "blue";
  const font = "sans";

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

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar resumeRef={resumeRef} />
        <main className="flex-1 bg-gray-100 p-4">
          <div ref={resumeRef} id="resume-content">
            <div
              className={`bg-white text-gray-800 p-8 max-w-4xl mx-auto shadow-lg rounded-lg font-${font} text-sm`}
            >
              {/* HEADER */}
              <header className="text-center mb-8">
                <input
                  type="text"
                  value={resumeData?.name || ""}
                  onChange={(e) => handleFieldChange("name", e.target.value)}
                  className="text-3xl font-bold text-gray-900 mb-1 text-center w-full"
                />
                <input
                  type="text"
                  value={resumeData?.role || ""}
                  onChange={(e) => handleFieldChange("role", e.target.value)}
                  className={`text-xl font-medium mb-3 text-center w-full text-${theme}-600`}
                />

                <div className="flex flex-wrap justify-center gap-4 text-sm">
                  {resumeData?.contact?.email && (
                    <div className="flex items-center">
                      <FaEnvelope className={`text-${theme}-600 mr-1`} />
                      <input
                        type="text"
                        value={resumeData.contact.email}
                        onChange={(e) =>
                          handleFieldChange("contact.email", e.target.value)
                        }
                        className="border-b border-gray-300 focus:outline-none"
                      />
                    </div>
                  )}
                  {resumeData?.contact?.phone && (
                    <div className="flex items-center">
                      <FaPhone className={`text-${theme}-600 mr-1`} />
                      <input
                        type="text"
                        value={resumeData.contact.phone}
                        onChange={(e) =>
                          handleFieldChange("contact.phone", e.target.value)
                        }
                        className="border-b border-gray-300 focus:outline-none"
                      />
                    </div>
                  )}
                  {resumeData?.contact?.linkedin && (
                    <div className="flex items-center">
                      <FaLinkedin className={`text-${theme}-600 mr-1`} />
                      <input
                        type="text"
                        value={resumeData.contact.linkedin}
                        onChange={(e) =>
                          handleFieldChange("contact.linkedin", e.target.value)
                        }
                        className="border-b border-gray-300 focus:outline-none"
                      />
                    </div>
                  )}
                  {resumeData?.contact?.github && (
                    <div className="flex items-center">
                      <FaGithub className={`text-${theme}-600 mr-1`} />
                      <input
                        type="text"
                        value={resumeData.contact.github}
                        onChange={(e) =>
                          handleFieldChange("contact.github", e.target.value)
                        }
                        className="border-b border-gray-300 focus:outline-none"
                      />
                    </div>
                  )}
                  {resumeData?.contact?.address && (
                    <div className="flex items-center">
                      <FaMapMarkerAlt className={`text-${theme}-600 mr-1`} />
                      <input
                        type="text"
                        value={resumeData.contact.address}
                        onChange={(e) =>
                          handleFieldChange("contact.address", e.target.value)
                        }
                        className="border-b border-gray-300 focus:outline-none"
                      />
                    </div>
                  )}
                </div>
              </header>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* LEFT COLUMN */}
                <div className="md:col-span-2">
                  {resumeData?.summary && (
                    <section className="mb-6">
                      <h3
                        className={`text-lg font-bold border-b-2 border-${theme}-500 pb-1 mb-3`}
                      >
                        Professional Summary
                      </h3>
                      <textarea
                        value={resumeData.summary}
                        onChange={(e) =>
                          handleFieldChange("summary", e.target.value)
                        }
                        className="w-full border border-gray-300 rounded p-2"
                      />
                    </section>
                  )}

                  {resumeData?.experience?.length > 0 && (
                    <section className="mb-6">
                      <h3
                        className={`text-lg font-bold border-b-2 border-${theme}-500 pb-1 mb-3`}
                      >
                        Experience
                      </h3>
                      {resumeData.experience.map((exp, idx) => (
                        <div key={idx} className="mb-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <input
                                type="text"
                                value={exp.title}
                                onChange={(e) =>
                                  handleArrayFieldChange(
                                    "experience",
                                    idx,
                                    "title",
                                    e.target.value
                                  )
                                }
                                className="font-bold w-full"
                              />
                              <input
                                type="text"
                                value={exp.companyName}
                                onChange={(e) =>
                                  handleArrayFieldChange(
                                    "experience",
                                    idx,
                                    "companyName",
                                    e.target.value
                                  )
                                }
                                className={`text-${theme}-600 w-full`}
                              />
                            </div>
                            <input
                              type="text"
                              value={exp.date}
                              onChange={(e) =>
                                handleArrayFieldChange(
                                  "experience",
                                  idx,
                                  "date",
                                  e.target.value
                                )
                              }
                              className="text-gray-600 text-sm"
                            />
                          </div>
                          <ul className="list-disc list-inside mt-2">
                            {exp.accomplishment.map((item, i) => (
                              <li key={i}>
                                <input
                                  type="text"
                                  value={item}
                                  onChange={(e) =>
                                    handleArrayFieldChange(
                                      `experience[${idx}].accomplishment`,
                                      i,
                                      null,
                                      e.target.value
                                    )
                                  }
                                  className="w-full"
                                />
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </section>
                  )}

                  {resumeData?.projects?.length > 0 && (
                    <section className="mb-6">
                      <h3
                        className={`text-lg font-bold border-b-2 border-${theme}-500 pb-1 mb-3`}
                      >
                        Projects
                      </h3>
                      {resumeData.projects.map((proj, idx) => (
                        <div key={idx} className="mb-4">
                          <input
                            type="text"
                            value={proj.name}
                            onChange={(e) =>
                              handleArrayFieldChange(
                                "projects",
                                idx,
                                "name",
                                e.target.value
                              )
                            }
                            className="font-bold w-full"
                          />
                          <textarea
                            value={proj.description}
                            onChange={(e) =>
                              handleArrayFieldChange(
                                "projects",
                                idx,
                                "description",
                                e.target.value
                              )
                            }
                            className="w-full border border-gray-300 rounded p-2"
                          />
                          <div className="flex flex-wrap gap-1 mt-1">
                            {proj.technologies.map((tech, i) => (
                              <input
                                key={i}
                                type="text"
                                value={tech}
                                onChange={(e) =>
                                  handleArrayFieldChange(
                                    `projects[${idx}].technologies`,
                                    i,
                                    null,
                                    e.target.value
                                  )
                                }
                                className={`bg-${theme}-100 text-${theme}-700 px-2 py-0.5 rounded text-xs`}
                              />
                            ))}
                          </div>
                        </div>
                      ))}
                    </section>
                  )}
                </div>

                {/* RIGHT COLUMN */}
                <div>
                  {resumeData?.skills?.length > 0 && (
                    <section className="mb-6">
                      <h3
                        className={`text-lg font-bold border-b-2 border-${theme}-500 pb-1 mb-3`}
                      >
                        Skills
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {resumeData.skills.map((skill, i) => (
                          <input
                            key={i}
                            type="text"
                            value={skill}
                            onChange={(e) =>
                              handleArrayFieldChange(
                                "skills",
                                i,
                                null,
                                e.target.value
                              )
                            }
                            className={`bg-${theme}-50 text-${theme}-700 px-3 py-1 rounded text-sm`}
                          />
                        ))}
                      </div>
                    </section>
                  )}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ResumeTemplate29;
