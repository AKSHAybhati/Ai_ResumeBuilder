import React, { useState, useRef, useEffect } from "react";
import Sidebar from "../Sidebar/Sidebar";
import Navbar from "../Navbar/Navbar";
import { useResume } from "../../context/ResumeContext";
import {
  Mail,
  Phone,
  MapPin,
  Linkedin,
  Github,
  Briefcase,
  GraduationCap,
  User,
  Star,
  Award,
  Globe,
  ChevronRight,
  Calendar,
  Building,
} from "lucide-react";

const Template13 = () => {
  const resumeRef = useRef(null);
  const { resumeData, setResumeData } = useResume();
  const [editMode, setEditMode] = useState(false);
  const [localData, setLocalData] = useState(resumeData);
  const [templateSettings, setTemplateSettings] = useState({
    fontFamily: "'Inter', sans-serif",
    primaryColor: "#1e40af",
    secondaryColor: "#64748b",
    accentColor: "#f59e0b",
    backgroundColor: "#ffffff",
    sidebarColor: "#f8fafc",
    photo:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=150&q=80",
    references: [
      {
        name: "Sarah Johnson",
        title: "Senior Manager",
        company: "Tech Solutions Inc.",
      },
      { name: "Mike Chen", title: "Project Lead", company: "Innovation Labs" },
    ],
  });
  const [uploadedPhoto, setUploadedPhoto] = useState(null);

  useEffect(() => {
    setLocalData(resumeData);
  }, [resumeData]);

  const handleFieldChange = (field, value) => {
    const updatedData = { ...localData, [field]: value };
    setLocalData(updatedData);
    localStorage.setItem('resumeData', JSON.stringify(updatedData));
  };

  const handleNestedChange = (arrayKey, index, field, value) => {
    const updatedData = {
      ...localData,
      [arrayKey]: localData[arrayKey].map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      ),
    };
    setLocalData(updatedData);
    localStorage.setItem('resumeData', JSON.stringify(updatedData));
  };

  const handleTemplateSettingsChange = (field, value) => {
    setTemplateSettings((prev) => ({ ...prev, [field]: value }));
  };

  const handleReferencesChange = (index, field, value) => {
    setTemplateSettings((prev) => ({
      ...prev,
      references: prev.references.map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      ),
    }));
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

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedPhoto(reader.result);
        setTemplateSettings((prev) => ({ ...prev, photo: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const SectionHeading = ({ title, icon: Icon }) => (
    <div className="flex items-center gap-3 mb-6">
      <div className="w-1 h-8 bg-gradient-to-b from-blue-600 to-blue-800 rounded-full"></div>
      <div className="flex items-center gap-2">
        {Icon && <Icon className="w-5 h-5 text-blue-600" />}
        <h2 className="text-xl font-bold text-gray-800 uppercase tracking-wide">
          {title}
        </h2>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Navbar />
      <div className="flex">
        <Sidebar onEnhance={handleEnhance} resumeRef={resumeRef} />

        <div className="flex-grow p-8 flex flex-col items-center">
          <div
            ref={resumeRef}
            style={{
              fontFamily: templateSettings.fontFamily,
              backgroundColor: "#ffffff",
              borderRadius: "1rem",
              boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)",
              maxWidth: "72rem",
              width: "100%",
              overflow: "hidden",
            }}
          >
            {/* Header Section */}
            <div
              style={{
                background: "linear-gradient(to right, #2563eb, #1e40af)",
                color: "#ffffff",
                padding: "2rem",
              }}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  {editMode ? (
                    <>
                      <input
                        type="text"
                        value={localData.name}
                        onChange={(e) =>
                          handleFieldChange("name", e.target.value)
                        }
                        style={{
                          fontSize: "2.25rem",
                          fontWeight: "bold",
                          backgroundColor: "transparent",
                          color: "#ffffff",
                          borderBottom: "2px solid rgba(255, 255, 255, 0.3)",
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
                          fontSize: "1.25rem",
                          color: "#bfdbfe",
                          backgroundColor: "transparent",
                          borderBottom: "2px solid rgba(255, 255, 255, 0.3)",
                          width: "100%",
                        }}
                      />
                    </>
                  ) : (
                    <>
                      <h1
                        style={{
                          fontSize: "2.25rem",
                          fontWeight: "bold",
                          marginBottom: "0.5rem",
                        }}
                      >
                        {resumeData.name}
                      </h1>
                      <p style={{ fontSize: "1.25rem", color: "#bfdbfe" }}>
                        {resumeData.role}
                      </p>
                    </>
                  )}
                </div>

                <div className="ml-8 flex flex-col items-center">
                  <div className="relative group">
                    <img
                      src={uploadedPhoto || templateSettings.photo}
                      alt="Profile"
                      style={{
                        width: "8rem",
                        height: "8rem",
                        borderRadius: "9999px",
                        objectFit: "cover",
                        border: "4px solid #ffffff",
                        boxShadow: "0 4px 15px rgba(0,0,0,0.2)",
                        transition: "transform 0.3s ease-in-out",
                      }}
                    />
                    {/* Edit button stays the same */}
                    {editMode && (
                      <label
                        htmlFor="photo-upload"
                        style={{
                          position: "absolute",
                          bottom: "0.5rem",
                          right: "0.5rem",
                          backgroundColor: "#2563eb",
                          color: "#ffffff",
                          borderRadius: "9999px",
                          padding: "0.5rem",
                          cursor: "pointer",
                          boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
                        }}
                        title="Change photo"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 10l4.553-2.276A2 2 0 0020 6.382V5a2 2 0 00-2-2H6a2 2 0 00-2 2v1.382a2 2 0 00.447 1.342L9 10m6 0v6a2 2 0 01-2 2H7a2 2 0 01-2-2v-6m6 0l-4.553-2.276A2 2 0 014 6.382V5a2 2 0 012-2h12a2 2 0 012 2v1.382a2 2 0 01-.447 1.342L15 10z"
                          />
                        </svg>
                        <input
                          id="photo-upload"
                          type="file"
                          accept="image/*"
                          onChange={handlePhotoChange}
                          className="hidden"
                        />
                      </label>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Bar */}
            <div className="bg-gray-800 text-white px-8 py-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                {editMode ? (
                  <>
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-yellow-400" />
                      <input
                        type="text"
                        value={localData.email}
                        onChange={(e) =>
                          handleFieldChange("email", e.target.value)
                        }
                        className="bg-transparent text-white border-none outline-none flex-1"
                        placeholder="Email"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-yellow-400" />
                      <input
                        type="text"
                        value={localData.phone}
                        onChange={(e) =>
                          handleFieldChange("phone", e.target.value)
                        }
                        className="bg-transparent text-white border-none outline-none flex-1"
                        placeholder="Phone"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-yellow-400" />
                      <input
                        type="text"
                        value={localData.location}
                        onChange={(e) =>
                          handleFieldChange("location", e.target.value)
                        }
                        className="bg-transparent text-white border-none outline-none flex-1"
                        placeholder="Location"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <Linkedin className="w-4 h-4 text-yellow-400" />
                      <input
                        type="text"
                        value={localData.linkedin}
                        onChange={(e) =>
                          handleFieldChange("linkedin", e.target.value)
                        }
                        className="bg-transparent text-white border-none outline-none flex-1"
                        placeholder="LinkedIn"
                      />
                    </div>
                  </>
                ) : (
                  <>
                    {resumeData.email && (
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-yellow-400" />
                        <a
                          href={`mailto:${resumeData.email}`}
                          className="hover:text-yellow-400 transition-colors"
                        >
                          {resumeData.email}
                        </a>
                      </div>
                    )}
                    {resumeData.phone && (
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-yellow-400" />
                        <span>{resumeData.phone}</span>
                      </div>
                    )}
                    {resumeData.location && (
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-yellow-400" />
                        <span>{resumeData.location}</span>
                      </div>
                    )}
                    {resumeData.linkedin && (
                      <div className="flex items-center gap-2">
                        <Linkedin className="w-4 h-4 text-yellow-400" />
                        <a
                          href={`https://${resumeData.linkedin}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:text-yellow-400 transition-colors"
                        >
                          {resumeData.linkedin}
                        </a>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>

            {/* Main Content */}
            <div className="flex">
              {/* Left Column - Main Content */}
              <div className="flex-1 p-8">
                {/* Profile Section */}
                <SectionHeading title="Professional Summary" icon={User} />
                {editMode ? (
                  <textarea
                    value={localData.summary}
                    onChange={(e) =>
                      handleFieldChange("summary", e.target.value)
                    }
                    className="w-full text-gray-700 leading-relaxed p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    rows={4}
                  />
                ) : (
                  <p className="text-gray-700 leading-relaxed text-lg">
                    {resumeData.summary}
                  </p>
                )}

                {/* Experience Section */}
                <SectionHeading
                  title="Professional Experience"
                  icon={Briefcase}
                />
                <div className="space-y-6">
                  {(resumeData.experience || []).map((exp, i) => (
                    <div
                      key={i}
                      className="bg-gray-50 rounded-xl p-6 border-l-4 border-blue-600"
                    >
                      {editMode ? (
                        <div className="space-y-3">
                          <input
                            type="text"
                            value={localData.experience[i].title}
                            onChange={(e) =>
                              handleNestedChange(
                                "experience",
                                i,
                                "title",
                                e.target.value
                              )
                            }
                            className="text-xl font-bold text-gray-800 w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                          <div className="flex gap-4">
                            <input
                              type="text"
                              value={localData.experience[i].companyName}
                              onChange={(e) =>
                                handleNestedChange(
                                  "experience",
                                  i,
                                  "companyName",
                                  e.target.value
                                )
                              }
                              className="text-lg font-semibold text-blue-600 flex-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                              placeholder="Company"
                            />
                            <input
                              type="text"
                              value={localData.experience[i].date}
                              onChange={(e) =>
                                handleNestedChange(
                                  "experience",
                                  i,
                                  "date",
                                  e.target.value
                                )
                              }
                              className="text-sm text-gray-600 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                              placeholder="Date"
                            />
                          </div>
                          <textarea
                            value={
                              localData.experience[i].accomplishment[0] || ""
                            }
                            onChange={(e) =>
                              handleNestedChange(
                                "experience",
                                i,
                                "accomplishment",
                                [e.target.value]
                              )
                            }
                            className="w-full text-gray-700 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                            rows={3}
                            placeholder="Describe your accomplishments..."
                          />
                        </div>
                      ) : (
                        <>
                          <h3 className="text-xl font-bold text-gray-800 mb-2">
                            {exp.title}
                          </h3>
                          <div className="flex items-center gap-4 mb-3">
                            <span className="text-lg font-semibold text-blue-600">
                              {exp.companyName}
                            </span>
                            <span className="text-sm text-gray-500 flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              {exp.date}
                            </span>
                          </div>
                          <p className="text-gray-700 leading-relaxed">
                            {exp.accomplishment[0]}
                          </p>
                        </>
                      )}
                    </div>
                  ))}
                </div>

                {/* References Section */}
                <SectionHeading title="Professional References" icon={Star} />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {(templateSettings.references || []).map((ref, i) => (
                    <div
                      key={i}
                      className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
                    >
                      {editMode ? (
                        <div className="space-y-3">
                          <input
                            type="text"
                            value={templateSettings.references[i].name}
                            onChange={(e) =>
                              handleReferencesChange(i, "name", e.target.value)
                            }
                            className="text-lg font-bold text-gray-800 w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                          <input
                            type="text"
                            value={templateSettings.references[i].title}
                            onChange={(e) =>
                              handleReferencesChange(i, "title", e.target.value)
                            }
                            className="text-blue-600 font-semibold w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                          <input
                            type="text"
                            value={templateSettings.references[i].company}
                            onChange={(e) =>
                              handleReferencesChange(
                                i,
                                "company",
                                e.target.value
                              )
                            }
                            className="text-gray-600 w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                      ) : (
                        <>
                          <h3 className="text-lg font-bold text-gray-800 mb-1">
                            {ref.name}
                          </h3>
                          <p className="text-blue-600 font-semibold mb-1">
                            {ref.title}
                          </p>
                          <p className="text-gray-600">{ref.company}</p>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Column - Sidebar */}
              <div className="w-80 bg-gray-50 p-8">
                {/* Education Section */}
                <SectionHeading title="Education" icon={GraduationCap} />
                <div className="space-y-4">
                  {(resumeData.education || []).map((edu, i) => (
                    <div key={i} className="bg-white rounded-xl p-4 shadow-sm">
                      {editMode ? (
                        <div className="space-y-2">
                          <input
                            type="text"
                            value={localData.education[i].degree}
                            onChange={(e) =>
                              handleNestedChange(
                                "education",
                                i,
                                "degree",
                                e.target.value
                              )
                            }
                            className="text-lg font-bold text-gray-800 w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                          <input
                            type="text"
                            value={localData.education[i].institution}
                            onChange={(e) =>
                              handleNestedChange(
                                "education",
                                i,
                                "institution",
                                e.target.value
                              )
                            }
                            className="text-blue-600 font-semibold w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                          <input
                            type="text"
                            value={localData.education[i].duration}
                            onChange={(e) =>
                              handleNestedChange(
                                "education",
                                i,
                                "duration",
                                e.target.value
                              )
                            }
                            className="text-sm text-gray-600 w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                      ) : (
                        <>
                          <h3 className="text-lg font-bold text-gray-800 mb-1">
                            {edu.degree}
                          </h3>
                          <p className="text-blue-600 font-semibold mb-1">
                            {edu.institution}
                          </p>
                          <p className="text-sm text-gray-600">
                            {edu.duration}
                          </p>
                        </>
                      )}
                    </div>
                  ))}
                </div>

                {/* Skills Section */}
                <SectionHeading title="Technical Skills" icon={Award} />
                <div className="bg-white rounded-xl p-4 shadow-sm">
                  {editMode ? (
                    <textarea
                      value={
                        localData.skills ? localData.skills.join(", ") : ""
                      }
                      onChange={(e) =>
                        handleFieldChange(
                          "skills",
                          e.target.value
                            .split(",")
                            .map((s) => s.trim())
                            .filter((s) => s)
                        )
                      }
                      className="w-full text-gray-700 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                      rows={4}
                      placeholder="Enter skills separated by commas"
                    />
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {resumeData.skills &&
                        resumeData.skills.map((skill, i) => (
                          <span
                            key={i}
                            className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium"
                          >
                            {skill}
                          </span>
                        ))}
                    </div>
                  )}
                </div>

                {/* Languages Section */}
                <SectionHeading title="Languages" icon={Globe} />
                <div className="bg-white rounded-xl p-4 shadow-sm">
                  {editMode ? (
                    <textarea
                      value={
                        localData.languages
                          ? localData.languages.join(", ")
                          : ""
                      }
                      onChange={(e) =>
                        handleFieldChange(
                          "languages",
                          e.target.value
                            .split(",")
                            .map((s) => s.trim())
                            .filter((s) => s)
                        )
                      }
                      className="w-full text-gray-700 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                      rows={3}
                      placeholder="Enter languages separated by commas"
                    />
                  ) : (
                    <div className="space-y-2">
                      {resumeData.languages &&
                        resumeData.languages.map((lang, i) => (
                          <div key={i} className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                            <span className="text-gray-700">{lang}</span>
                          </div>
                        ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Edit/Save Buttons */}
          <div className="mt-8 text-center">
            {editMode ? (
              <div className="flex gap-4 justify-center">
                <button
                  onClick={handleSave}
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors shadow-lg"
                >
                  Save Changes
                </button>
                <button
                  onClick={handleCancel}
                  className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors shadow-lg"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                onClick={() => setEditMode(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors shadow-lg"
              >
                Edit Resume
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Template13;
