/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { useResume } from "../../context/ResumeContext";
import { useAuth } from "../../context/AuthContext";
import dataService from "../../services/dataService";
import { enhanceTextWithGemini } from "../../services/geminiService";
import html2pdf from "html2pdf.js";
import RegistrationIncentive from "../auth/RegistrationIncentive";

import {
  FaChevronLeft,
  FaChevronRight,
  FaMagic,
  FaFileDownload,
  FaShareAlt,
  FaUserCircle,
} from "react-icons/fa";

const enhancementOptions = [
  "summary",
  "experience",
  "education",
  "skills",
  "achievements",
  "projects",
  "certifications",
  "languages",
  "interests",
];

const Sidebar = ({ onEnhance, resumeRef }) => {
  const { resumeData, setResumeData } = useResume();
  const { isAuthenticated, isGuest } = useAuth();
  const [collapsed, setCollapsed] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [enhancingSection, setEnhancingSection] = useState(null);
  const [downloadRequested, setDownloadRequested] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showNamePrompt, setShowNamePrompt] = useState(false);
  const [resumeName, setResumeName] = useState("");
  const [showRegistrationIncentive, setShowRegistrationIncentive] = useState(false);

  const handleDownloadPDF = () => {
    setDownloadRequested(true);
  };

  useEffect(() => {
    if (downloadRequested && resumeRef?.current) {
      const element = resumeRef.current;

      setTimeout(() => {
        html2pdf()
          .set({
            margin: 0.5,
            filename: "My_Resume.pdf",
            image: { type: "jpeg", quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
          })
          .from(element)
          .save()
          .catch((err) => {
            console.error("❌ PDF Download Error:", err);
          });

        setDownloadRequested(false);
      }, 300);
    }
  }, [downloadRequested, resumeRef]);

  const handleEnhanceSection = async (section) => {
    setEnhancingSection(section);
    let contentToSend = "";

    switch (section) {
      case "summary":
        contentToSend = resumeData.summary;
        break;
      case "skills":
        contentToSend = resumeData.skills?.join(", ");
        break;
      case "education":
        contentToSend = JSON.stringify(resumeData.education);
        break;
      case "experience":
        contentToSend = resumeData.experience
          ?.map((exp) => exp.accomplishment?.join("\n"))
          .join("\n");
        break;
      case "achievements":
        contentToSend = resumeData.achievements?.join("\n") || "";
        break;
      case "projects":
        contentToSend = resumeData.projects
          ?.map(
            (proj) =>
              `${proj.name}:\n${proj.description}\nTechnologies: ${proj.technologies?.join(", ")}`
          )
          .join("\n\n");
        break;
      case "certifications":
        contentToSend = resumeData.certifications
          ?.map((cert) => `${cert.title} from ${cert.issuer} (${cert.date})`)
          .join("\n");
        break;
      case "languages":
      case "interests":
        contentToSend = resumeData[section]?.join(", ");
        break;
      default:
        contentToSend = JSON.stringify(resumeData[section]);
    }

    // ✅ safeguard
    if (!contentToSend || contentToSend.trim() === "") {
      console.warn(`⚠️ Skipping enhance: No content found for section "${section}"`);
      setEnhancingSection(null);
      return;
    }

    const aiResponse = await enhanceTextWithGemini(section, contentToSend);
    if (!aiResponse) {
      setEnhancingSection(null);
      return;
    }

    const updated = { ...resumeData };

    // ✅ Handle each section correctly
    if (["summary", "achievements", "languages", "interests"].includes(section)) {
      updated[section] = aiResponse
        .split("\n")
        .map((s) => s.replace(/^[-*•]\s*/, "").trim())
        .filter(Boolean);
    } else if (section === "skills") {
      updated.skills = aiResponse
        .split(/,|\n/)
        .map((s) => s.trim())
        .filter(Boolean);
    } else if (section === "experience") {
      updated.experience[0].accomplishment = aiResponse
        .split("\n")
        .filter(Boolean);
    } else if (section === "education") {
      updated.educationText = aiResponse;
    } else if (section === "projects") {
      updated.projects[0].description = aiResponse;
    } else if (section === "certifications") {
      updated.certificationsText = aiResponse;
    } else {
      updated[section] = aiResponse;
    }

    setResumeData(updated);
    setEnhancingSection(null);

    if (onEnhance) onEnhance(section);
  };

  const normalizeForSave = (data) => {
    const toArray = (v) => Array.isArray(v) ? v : (v ? [v] : []);
    const experience = toArray(data.experience).map((e) => ({
      title: e?.title || "",
      company: e?.company || e?.companyName || "",
      duration: e?.duration || e?.date || "",
      description: Array.isArray(e?.accomplishment) ? e.accomplishment.join("\n") : (e?.description || "")
    }));
    const education = toArray(data.education).map((ed) => ({
      degree: ed?.degree || "",
      institution: ed?.institution || "",
      year: ed?.year || ed?.duration || "",
    }));
    const projects = toArray(data.projects).map((p) => ({
      name: p?.name || "",
      description: Array.isArray(p?.description) ? p.description.join("\n") : (p?.description || ""),
      technologies: Array.isArray(p?.technologies) ? p.technologies : ((p?.technologies || "").split(',').map(s => s.trim()).filter(Boolean))
    }));
    const certifications = toArray(data.certifications).map((c) => ({
      name: c?.name || c?.title || "",
      organization: c?.organization || c?.issuer || "",
      year: c?.year || c?.date || ""
    }));
    return {
      templateId: data?.templateId || null,
      personalInfo: {
        name: data?.name || "",
        role: data?.role || "",
        email: data?.email || "",
        phone: data?.phone || "",
        location: data?.location || "",
        linkedin: data?.linkedin || "",
        github: data?.github || "",
        portfolio: data?.portfolio || "",
      },
      summary: data?.summary || "",
      skills: Array.isArray(data?.skills) ? data.skills : [],
      experience,
      education,
      projects,
      certifications,
      achievements: toArray(data?.achievements),
      interests: toArray(data?.interests),
      languages: toArray(data?.languages).map((l) => (typeof l === 'string' ? l : (l?.language || ""))).filter(Boolean)
    };
  };

  const handleSaveToAccount = () => {
    if (!isAuthenticated) {
      // Show registration incentive for guest users
      setShowRegistrationIncentive(true);
      return;
    }
    
    // Show name prompt modal for authenticated users
    setShowNamePrompt(true);
    // Set default name based on current data
    const defaultName = resumeData?.name || resumeData?.personalInfo?.name || 'My Resume';
    setResumeName(defaultName);
  };

  const handleConfirmSave = async () => {
    if (!resumeName.trim()) return;
    
    try {
      setSaving(true);
      const structured = normalizeForSave(resumeData || {});
      
      const resumeToSave = {
        title: resumeName.trim(),
        ...structured
      };
      
      const result = await dataService.saveResume(resumeToSave);
      
      if (result.success) {
        setShowNamePrompt(false);
        setResumeName("");
      } else {
        console.error('Save error:', result.error);
      }
    } catch (e) {
      console.error('Save error:', e);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className={`min-h-screen bg-white shadow-sm border-r border-gray-200 p-5 flex flex-col justify-start gap-5 transition-all duration-200 ${collapsed ? "w-20" : "w-64"
        }`}
      style={{ position: "relative" }}
    >
      {/* Toggle Button */}
      <button
        className="absolute -right-4 top-6 bg-white border border-gray-200 rounded-full p-2 shadow hover:bg-gray-50 transition-colors z-10"
        onClick={() => setCollapsed((prev) => !prev)}
        aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        {collapsed ? (
          <FaChevronRight className="text-gray-600 text-sm" />
        ) : (
          <FaChevronLeft className="text-gray-600 text-sm" />
        )}
      </button>

      {/* Header */}
      <div className={`flex items-center gap-3 mb-3 ${collapsed ? "justify-center" : ""}`}>
        <div className="relative">
          <FaUserCircle
            size={collapsed ? 36 : 48}
            className="text-gray-600"
          />
          <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full"></div>
        </div>
        {!collapsed && (
          <div className="flex flex-col">
            <span className="font-semibold text-base text-gray-900 tracking-tight">My Resume</span>
            <span className="text-xs text-gray-500">Professional Builder</span>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col gap-4">
        {/* Save to My Resumes Button */}
        <button
          disabled={saving}
          className={`w-full flex items-center gap-3 bg-gray-900 text-white py-2.5 px-3 rounded-lg hover:bg-gray-800 disabled:opacity-60 transition-colors ${collapsed ? "justify-center px-2.5" : ""
            }`}
          onClick={handleSaveToAccount}
          title={isAuthenticated ? "Save to My Resumes" : "Sign up to save resumes"}
        >
          <FaFileDownload />
          {!collapsed && (
            <span className="font-medium">
              {saving ? 'Saving…' : (isAuthenticated ? 'Save to My Resumes' : 'Save to Account')}
            </span>
          )}
        </button>

        {/* AI Enhancement Button */}
        <div className="relative">
          <button
            className={`w-full flex items-center gap-3 bg-white text-gray-900 border border-gray-200 py-2.5 px-3 rounded-lg hover:bg-gray-50 ${collapsed ? "justify-center px-2.5" : ""
              }`}
            onClick={() => setShowOptions((prev) => !prev)}
            title="Enhance with AI"
          >
            <FaMagic />
            {!collapsed && (
              <span className="font-semibold">Enhance with AI</span>
            )}
            {!collapsed && (
              <FaChevronRight
                className={`ml-auto transition-transform ${showOptions ? "rotate-90" : ""
                  }`}
              />
            )}
          </button>

          {/* Enhancement Options */}
          {showOptions && !collapsed && (
            <div className="mt-3 bg-white border border-gray-200 rounded-lg shadow-sm p-3 space-y-2">
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
                Select Section to Enhance
              </div>
              <div className="grid grid-cols-1 gap-2 max-h-64 overflow-y-auto">
                {enhancementOptions.map((option) => (
                  <button
                    key={option}
                    onClick={() => handleEnhanceSection(option)}
                    disabled={enhancingSection === option}
                    className="flex items-center gap-3 text-left p-2.5 text-gray-800 hover:bg-gray-50 rounded-md disabled:opacity-50 disabled:cursor-not-allowed border border-transparent"
                  >
                    <FaMagic className="text-gray-600 text-sm" />
                    <span className="font-medium">
                      {enhancingSection === option
                        ? `Enhancing ${option}...`
                        : `${option.charAt(0).toUpperCase() + option.slice(1)}`}
                    </span>
                    {enhancingSection === option && (
                      <div className="ml-auto">
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-gray-400 border-t-transparent"></div>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Download PDF Button */}
        <button
          disabled={downloadRequested}
          className={`w-full flex items-center gap-3 bg-white text-gray-900 border border-gray-200 py-2.5 px-3 rounded-lg hover:bg-gray-50 disabled:opacity-60 disabled:cursor-not-allowed ${collapsed ? "justify-center px-2.5" : ""
            }`}
          onClick={handleDownloadPDF}
          title="Download PDF"
        >
          <FaFileDownload />
          {!collapsed && (
            <span className="font-semibold">
              {downloadRequested ? "Generating..." : "Download PDF"}
            </span>
          )}
          {downloadRequested && !collapsed && (
            <div className="ml-auto">
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-gray-400 border-t-transparent"></div>
            </div>
          )}
        </button>

        {/* Share Button */}
        <button
          className={`w-full flex items-center gap-3 bg-white text-gray-900 border border-gray-200 py-2.5 px-3 rounded-lg hover:bg-gray-50 ${collapsed ? "justify-center px-2.5" : ""
            }`}
          onClick={() => {
            if (navigator.share) {
              navigator.share({
                title: "My Resume",
                url: window.location.href,
              });
            } else {
              // Silently copy URL to clipboard if available
              if (navigator.clipboard) {
                navigator.clipboard.writeText(window.location.href);
              }
            }
          }}
          title="Share Resume"
        >
          <FaShareAlt />
          {!collapsed && <span className="font-semibold">Share Resume</span>}
        </button>
      </div>

      {/* Footer Info */}
      {!collapsed && (
        <div className="mt-auto pt-5 border-t border-gray-200">
          <div className="text-center">
            <div className="text-xs text-gray-500">
              Last updated: {new Date().toLocaleDateString()}
            </div>
            <div className="flex items-center justify-center gap-2 mt-2">
              <div className={`w-2 h-2 rounded-full ${isAuthenticated ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
              <span className="text-xs text-gray-600">
                {isAuthenticated ? 'Cloud saved' : 'Local saved'}
              </span>
            </div>
            {!isAuthenticated && (
              <div className="text-xs text-gray-400 mt-1">
                Sign up to save to cloud
              </div>
            )}
          </div>
        </div>
      )}

      {/* Name Prompt Modal */}
      {showNamePrompt && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96 max-w-md mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Save Resume
            </h3>
            <p className="text-gray-600 mb-4">
              Give your resume a name to save it to My Resumes
            </p>
            <input
              type="text"
              value={resumeName}
              onChange={(e) => setResumeName(e.target.value)}
              placeholder="Enter resume name..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 mb-4"
              autoFocus
            />
            <div className="flex gap-3">
              <button
                onClick={() => setShowNamePrompt(false)}
                className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmSave}
                disabled={!resumeName.trim() || saving}
                className="flex-1 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {saving ? 'Saving...' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Registration Incentive Modal */}
      {showRegistrationIncentive && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="max-w-sm mx-4">
            <RegistrationIncentive
              context="sidebar"
              onDismiss={() => setShowRegistrationIncentive(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
