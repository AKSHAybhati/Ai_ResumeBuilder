import React, { useState, useRef, useEffect } from "react";
import Sidebar from "../Sidebar/Sidebar";
import Navbar from "../Navbar/Navbar";
import { useResume } from "../../context/ResumeContext";
import {
  Mail, Phone, MapPin, Linkedin, Github, Briefcase, GraduationCap, 
  User, Star, Award, Globe, ChevronRight, Calendar, Building, 
  Zap, Target, Users, Code2, BookOpen, Trophy
} from "lucide-react";

const Template6 = () => {
  const resumeRef = useRef(null);
  const { resumeData, setResumeData } = useResume();
  const [editMode, setEditMode] = useState(false);
  const [localData, setLocalData] = useState(resumeData);
  const [templateSettings, setTemplateSettings] = useState({
    github: "github.com/rachelj",
    photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=150&q=60",
    certifications: [
      { title: "Certified Professional Human Resources (CPHR)", issuedBy: "HRCI", year: "2021" }
    ],
    courses: [
      { title: "Data Handling Training (COURSE)", description: "" },
      { title: "Contoso Industry Safety & Health Training (COURSE)", description: "" }
    ],
    projects: [],
  });
  const [uploadedPhoto, setUploadedPhoto] = useState(null);

  useEffect(() => {
    setLocalData(resumeData);
  }, [resumeData]);

  const handleFieldChange = (field, value) => {
    setLocalData((prev) => ({ ...prev, [field]: value }));
  };


  const handleNestedChange = (arrayKey, index, field, value) => {
    setLocalData(prev => ({
      ...prev,
      [arrayKey]: prev[arrayKey].map((item, i) => i === index ? { ...item, [field]: value } : item)
    }));
  };

  const handleTemplateSettingsChange = (field, value) => {
    setTemplateSettings(prev => ({ ...prev, [field]: value }));
  };

  const handleCertificationsChange = (index, field, value) => {
    setTemplateSettings(prev => ({
      ...prev,
      certifications: prev.certifications.map((item, i) => i === index ? { ...item, [field]: value } : item)
    }));
  };

  const handleCoursesChange = (index, field, value) => {
    setTemplateSettings(prev => ({
      ...prev,
      courses: prev.courses.map((item, i) => i === index ? { ...item, [field]: value } : item)
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
    console.log("Enhance requested for:", section);
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedPhoto(reader.result);
        setTemplateSettings(prev => ({ ...prev, photo: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const SectionHeader = ({ title, icon: Icon, accentColor = "bg-purple-500" }) => (
    <div className="flex items-center gap-3 mb-6">
      <div className={`w-2 h-8 ${accentColor} rounded-full shadow-lg`}></div>
      <div className="flex items-center gap-3">
        {Icon && <Icon className="w-6 h-6 text-purple-600" />}
        <h2 className="text-2xl font-bold text-gray-800 uppercase tracking-wide">{title}</h2>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Navbar />
      <div className="flex">
        <Sidebar onEnhance={handleEnhance} resumeRef={resumeRef} />

        <div className="flex-grow p-8 flex flex-col items-center">
          <div
            ref={resumeRef}
            className="bg-white shadow-3xl rounded-3xl max-w-7xl w-full overflow-hidden border border-gray-200"
          >
            {/* Hero Section */}
            <div className="relative bg-gradient-to-r from-purple-600 via-pink-600 to-purple-800 text-white p-12">
              <div className="absolute inset-0 bg-black/20"></div>
              <div className="relative z-10 flex items-center justify-between">
                <div className="flex-1">
                  {editMode ? (
                    <>
                      <input
                        type="text"
                        value={localData.name}
                        onChange={(e) => handleFieldChange("name", e.target.value)}
                        className="text-5xl font-black bg-transparent text-white border-b-2 border-white/30 focus:outline-none focus:border-white w-full mb-3"
                        placeholder="Your Name"
                      />
                      <input
                        type="text"
                        value={localData.role}
                        onChange={(e) => handleFieldChange("role", e.target.value)}
                        className="text-2xl text-purple-100 bg-transparent border-b-2 border-white/30 focus:outline-none focus:border-white w-full"
                        placeholder="Your Role"
                      />
                    </>
                  ) : (
                    <>
                      <h1 className="text-5xl font-black mb-3 tracking-tight">{resumeData.name}</h1>
                      <p className="text-2xl text-purple-100 font-medium">{resumeData.role}</p>
                    </>
                  )}
                </div>
                
                <div className="ml-12 flex flex-col items-center">
                  <div className="relative group">
                    <div className="w-40 h-40 rounded-full overflow-hidden border-4 border-white shadow-2xl">
                      <img 
                        src={uploadedPhoto || templateSettings.photo} 
                        alt="Profile" 
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      {editMode && (
                        <label
                          htmlFor="photo-upload"
                          className="absolute bottom-2 right-2 bg-purple-600 hover:bg-purple-700 text-white rounded-full p-3 shadow-lg cursor-pointer transition-colors duration-200 flex items-center justify-center"
                          title="Change photo"
                        >
                          {/* Camera Icon SVG */}
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A2 2 0 0020 6.382V5a2 2 0 00-2-2H6a2 2 0 00-2 2v1.382a2 2 0 00.447 1.342L9 10m6 0v6a2 2 0 01-2 2H7a2 2 0 01-2-2v-6m6 0l-4.553-2.276A2 2 0 014 6.382V5a2 2 0 012-2h12a2 2 0 012 2v1.382a2 2 0 01-.447 1.342L15 10z" />
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
            </div>

            {/* Contact Information */}
            <div className="bg-gray-900 text-white px-12 py-6">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                {editMode ? (
                  <>
                    <div className="flex items-center gap-3 group">
                      <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center">
                        <Mail className="w-5 h-5 text-white" />
                      </div>
                      <input
                        type="text"
                        value={localData.email}
                        onChange={(e) => handleFieldChange("email", e.target.value)}
                        className="bg-transparent text-white border-none outline-none flex-1 text-sm"
                        placeholder="Email"
                      />
                    </div>
                    <div className="flex items-center gap-3 group">
                      <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center">
                        <Phone className="w-5 h-5 text-white" />
                      </div>
                      <input
                        type="text"
                        value={localData.phone}
                        onChange={(e) => handleFieldChange("phone", e.target.value)}
                        className="bg-transparent text-white border-none outline-none flex-1 text-sm"
                        placeholder="Phone"
                      />
                    </div>
                    <div className="flex items-center gap-3 group">
                      <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center">
                        <MapPin className="w-5 h-5 text-white" />
                      </div>
                      <input
                        type="text"
                        value={localData.location}
                        onChange={(e) => handleFieldChange("location", e.target.value)}
                        className="bg-transparent text-white border-none outline-none flex-1 text-sm"
                        placeholder="Location"
                      />
                    </div>
                    <div className="flex items-center gap-3 group">
                      <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center">
                        <Linkedin className="w-5 h-5 text-white" />
                      </div>
                      <input
                        type="text"
                        value={localData.linkedin}
                        onChange={(e) => handleFieldChange("linkedin", e.target.value)}
                        className="bg-transparent text-white border-none outline-none flex-1 text-sm"
                        placeholder="LinkedIn"
                      />
                    </div>
                  </>
                ) : (
                  <>
                    {resumeData.email && (
                      <div className="flex items-center gap-3 group hover:scale-105 transition-transform">
                        <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center">
                          <Mail className="w-5 h-5 text-white" />
                        </div>
                        <a href={`mailto:${resumeData.email}`} className="text-sm hover:text-purple-300 transition-colors">
                          {resumeData.email}
                        </a>
                      </div>
                    )}
                    {resumeData.phone && (
                      <div className="flex items-center gap-3 group hover:scale-105 transition-transform">
                        <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center">
                          <Phone className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-sm">{resumeData.phone}</span>
                      </div>
                    )}
                    {resumeData.location && (
                      <div className="flex items-center gap-3 group hover:scale-105 transition-transform">
                        <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center">
                          <MapPin className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-sm">{resumeData.location}</span>
                      </div>
                    )}
                    {resumeData.linkedin && (
                      <div className="flex items-center gap-3 group hover:scale-105 transition-transform">
                        <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center">
                          <Linkedin className="w-5 h-5 text-white" />
                        </div>
                        <a href={`https://${resumeData.linkedin}`} target="_blank" rel="noopener noreferrer" className="text-sm hover:text-purple-300 transition-colors">
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
              <div className="flex-1 p-12">
                {/* Profile Summary */}
                <SectionHeader title="Professional Summary" icon={User} accentColor="bg-purple-500" />
                {editMode ? (
                  <textarea
                    value={localData.summary}
                    onChange={(e) => handleFieldChange("summary", e.target.value)}
                    className="w-full text-gray-700 leading-relaxed p-6 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-purple-200 focus:border-purple-500 resize-none text-lg"
                    rows={4}
                    placeholder="Write your professional summary..."
                  />
                ) : (
                  <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-8 rounded-2xl border-l-4 border-purple-500">
                    <p className="text-gray-700 leading-relaxed text-lg">{resumeData.summary}</p>
                  </div>
                )}

                {/* Experience Section */}
                <SectionHeader title="Work Experience" icon={Briefcase} accentColor="bg-pink-500" />
                <div className="space-y-8">
                  {(resumeData.experience || []).map((exp, i) => (
                    <div key={i} className="bg-white border-2 border-gray-100 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
                      {editMode ? (
                        <div className="space-y-4">
                          <input
                            type="text"
                            value={localData.experience[i].title}
                            onChange={(e) => handleNestedChange("experience", i, "title", e.target.value)}
                            className="text-2xl font-bold text-gray-800 w-full p-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-purple-200 focus:border-purple-500"
                          />
                          <div className="flex gap-4">
                            <input
                              type="text"
                              value={localData.experience[i].companyName}
                              onChange={(e) => handleNestedChange("experience", i, "companyName", e.target.value)}
                              className="text-lg font-semibold text-purple-600 flex-1 p-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-purple-200 focus:border-purple-500"
                              placeholder="Company"
                            />
                            <input
                              type="text"
                              value={localData.experience[i].date}
                              onChange={(e) => handleNestedChange("experience", i, "date", e.target.value)}
                              className="text-sm text-gray-600 p-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-purple-200 focus:border-purple-500"
                              placeholder="Date"
                            />
                          </div>
                          <textarea
                            value={localData.experience[i].accomplishment[0] || ""}
                            onChange={(e) => handleNestedChange("experience", i, "accomplishment", [e.target.value])}
                            className="w-full text-gray-700 p-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-purple-200 focus:border-purple-500 resize-none"
                            rows={4}
                            placeholder="Describe your accomplishments..."
                          />
                        </div>
                      ) : (
                        <>
                          <div className="flex items-start justify-between mb-4">
                            <div>
                              <h3 className="text-2xl font-bold text-gray-800 mb-2">{exp.title}</h3>
                              <div className="flex items-center gap-4">
                                <span className="text-lg font-semibold text-purple-600">{exp.companyName}</span>
                                <span className="text-sm text-gray-500 flex items-center gap-1">
                                  <Calendar className="w-4 h-4" />
                                  {exp.date}
                                </span>
                              </div>
                            </div>
                            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                              <Building className="w-6 h-6 text-white" />
                            </div>
                          </div>
                          <p className="text-gray-700 leading-relaxed text-lg">{exp.accomplishment[0]}</p>
                        </>
                      )}
                    </div>
                  ))}
                </div>

                {/* Education Section */}
                <SectionHeader title="Education" icon={GraduationCap} accentColor="bg-blue-500" />
                <div className="space-y-6">
                  {(resumeData.education || []).map((edu, i) => (
                    <div key={i} className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 border border-blue-200">
                      {editMode ? (
                        <div className="space-y-3">
                          <input
                            type="text"
                            value={localData.education[i].degree}
                            onChange={(e) => handleNestedChange("education", i, "degree", e.target.value)}
                            className="text-xl font-bold text-gray-800 w-full p-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-200 focus:border-blue-500"
                          />
                          <input
                            type="text"
                            value={localData.education[i].institution}
                            onChange={(e) => handleNestedChange("education", i, "institution", e.target.value)}
                            className="text-lg font-semibold text-blue-600 w-full p-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-200 focus:border-blue-500"
                          />
                          <input
                            type="text"
                            value={localData.education[i].duration}
                            onChange={(e) => handleNestedChange("education", i, "duration", e.target.value)}
                            className="text-sm text-gray-600 w-full p-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-200 focus:border-blue-500"
                          />
                        </div>
                      ) : (
                        <>
                          <h3 className="text-xl font-bold text-gray-800 mb-2">{edu.degree}</h3>
                          <p className="text-lg font-semibold text-blue-600 mb-1">{edu.institution}</p>
                          <p className="text-sm text-gray-600">{edu.duration}</p>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Column - Sidebar */}
              <div className="w-96 bg-gradient-to-b from-gray-50 to-gray-100 p-8">
                {/* Skills Section */}
                <SectionHeader title="Technical Skills" icon={Code2} accentColor="bg-green-500" />
                <div className="bg-white rounded-2xl p-6 shadow-lg">
                  {editMode ? (
                    <textarea
                      value={localData.skills ? localData.skills.join(', ') : ''}
                      onChange={(e) => handleFieldChange("skills", e.target.value.split(',').map(s => s.trim()).filter(s => s))}
                      className="w-full text-gray-700 p-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-green-200 focus:border-green-500 resize-none"
                      rows={4}
                      placeholder="Enter skills separated by commas"
                    />
                  ) : (
                    <div className="flex flex-wrap gap-3">
                      {resumeData.skills && resumeData.skills.map((skill, i) => (
                        <span key={i} className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-md">
                          {skill}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Languages Section */}
                <SectionHeader title="Languages" icon={Globe} accentColor="bg-orange-500" />
                <div className="bg-white rounded-2xl p-6 shadow-lg">
                  {editMode ? (
                    <textarea
                      value={localData.languages ? localData.languages.join(', ') : ''}
                      onChange={(e) => handleFieldChange("languages", e.target.value.split(',').map(s => s.trim()).filter(s => s))}
                      className="w-full text-gray-700 p-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-orange-200 focus:border-orange-500 resize-none"
                      rows={3}
                      placeholder="Enter languages separated by commas"
                    />
                  ) : (
                    <div className="space-y-3">
                      {resumeData.languages && resumeData.languages.map((lang, i) => (
                        <div key={i} className="flex items-center gap-3">
                          <div className="w-3 h-3 bg-gradient-to-r from-orange-500 to-red-500 rounded-full"></div>
                          <span className="text-gray-700 font-medium">{lang}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Certifications Section */}
                <SectionHeader title="Certifications" icon={Trophy} accentColor="bg-yellow-500" />
                <div className="space-y-4">
                  {(templateSettings.certifications || []).map((cert, i) => (
                    <div key={i} className="bg-white rounded-2xl p-4 shadow-lg border-l-4 border-yellow-500">
                      {editMode ? (
                        <div className="space-y-2">
                          <input
                            type="text"
                            value={templateSettings.certifications[i].title}
                            onChange={(e) => handleCertificationsChange(i, "title", e.target.value)}
                            className="text-sm font-bold text-gray-800 w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-200 focus:border-yellow-500"
                          />
                          <input
                            type="text"
                            value={templateSettings.certifications[i].issuedBy}
                            onChange={(e) => handleCertificationsChange(i, "issuedBy", e.target.value)}
                            className="text-sm text-gray-600 w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-200 focus:border-yellow-500"
                          />
                          <input
                            type="text"
                            value={templateSettings.certifications[i].year}
                            onChange={(e) => handleCertificationsChange(i, "year", e.target.value)}
                            className="text-sm text-gray-500 w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-200 focus:border-yellow-500"
                          />
                        </div>
                      ) : (
                        <>
                          <h3 className="text-sm font-bold text-gray-800 mb-1">{cert.title}</h3>
                          <p className="text-sm text-gray-600 mb-1">{cert.issuedBy}</p>
                          <p className="text-xs text-gray-500">{cert.year}</p>
                        </>
                      )}
                    </div>
                  ))}
                </div>

                {/* Courses Section */}
                <SectionHeader title="Courses" icon={BookOpen} accentColor="bg-indigo-500" />
                <div className="space-y-3">
                  {(templateSettings.courses || []).map((course, i) => (
                    <div key={i} className="bg-white rounded-xl p-4 shadow-md">
                      {editMode ? (
                        <input
                          type="text"
                          value={templateSettings.courses[i].title}
                          onChange={(e) => handleCoursesChange(i, "title", e.target.value)}
                          className="text-sm text-gray-700 w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500"
                        />
                      ) : (
                        <p className="text-sm text-gray-700">{course.title}</p>
                      )}
                    </div>
                  ))}
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
                  className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-8 py-4 rounded-2xl font-bold transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105"
                >
                  Save Changes
                </button>
                <button
                  onClick={handleCancel}
                  className="bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white px-8 py-4 rounded-2xl font-bold transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                onClick={() => setEditMode(true)}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-10 py-4 rounded-2xl font-bold transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105"
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

export default Template6;