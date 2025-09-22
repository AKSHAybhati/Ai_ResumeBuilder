/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { useResume } from "../../context/ResumeContext";
import { useAuth } from "../../context/AuthContext";
import resumeService from "../../services/resumeService";
import { enhanceTextWithGemini } from "../../services/geminiService";
import html2pdf from "html2pdf.js";
import { toast } from "react-toastify";

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
  const { isAuthenticated } = useAuth();
  const [collapsed, setCollapsed] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [enhancingSection, setEnhancingSection] = useState(null);
  const [downloadRequested, setDownloadRequested] = useState(false);
  const [saving, setSaving] = useState(false);

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
          .then(() => {
            toast.success("Resume downloaded successfully!");
          })
          .catch((err) => {
            console.error("❌ PDF Download Error:", err);
            toast.error("Something went wrong while generating the PDF. Please try again.");
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

  const handleSaveToAccount = async () => {
    if (!isAuthenticated) {
      toast.info("Please login to save this resume to your account.");
      return;
    }
    try {
      setSaving(true);
      const structured = normalizeForSave(resumeData || {});
      const title = (resumeData?.title || resumeData?.name || 'Resume') + '';
      const result = await resumeService.saveResumeData(structured, `${title}`);
      if (result.success) {
        toast.success('✅ Saved to My Resumes');
      } else {
        toast.error(result.error || 'Failed to save');
      }
    } catch (e) {
      toast.error('Failed to save');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className={`min-h-screen bg-gradient-to-b from-white to-gray-50 shadow-xl border-r border-gray-200 p-6 flex flex-col justify-start gap-6 transition-all duration-300 ${collapsed ? "w-20" : "w-72"
        }`}
      style={{ position: "relative" }}
    >
      {/* Toggle Button */}
      <button
        className="absolute -right-4 top-6 bg-white border-2 border-indigo-200 rounded-full p-2 shadow-lg hover:bg-indigo-50 hover:border-indigo-300 transition-all duration-200 z-10"
        onClick={() => setCollapsed((prev) => !prev)}
        aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        {collapsed ? (
          <FaChevronRight className="text-indigo-600 text-sm" />
        ) : (
          <FaChevronLeft className="text-indigo-600 text-sm" />
        )}
      </button>

      {/* Header */}
      <div className={`flex items-center gap-3 mb-4 ${collapsed ? "justify-center" : ""}`}>
        <div className="relative">
          <FaUserCircle
            size={collapsed ? 36 : 48}
            className="text-indigo-600 drop-shadow-sm"
          />
          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
        </div>
        {!collapsed && (
          <div className="flex flex-col">
            <span className="font-bold text-xl text-indigo-800 tracking-tight">My Resume</span>
            <span className="text-xs text-gray-500 font-medium">Professional Builder</span>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col gap-4">
        {/* Save to Account Button */}
        <button
          disabled={saving}
          className={`w-full flex items-center gap-3 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white py-3 px-4 rounded-xl shadow-lg hover:shadow-xl hover:from-emerald-700 hover:to-emerald-800 transition-all duration-200 transform hover:scale-105 disabled:opacity-60 ${collapsed ? "justify-center px-3" : ""
            }`}
          onClick={handleSaveToAccount}
          title="Save to My Resumes"
        >
          <FaFileDownload className={saving ? "animate-bounce" : ""} />
          {!collapsed && (
            <span className="font-semibold">{saving ? 'Saving…' : 'Save to My Resumes'}</span>
          )}
        </button>

        {/* AI Enhancement Button */}
        <div className="relative">
          <button
            className={`w-full flex items-center gap-3 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white py-3 px-4 rounded-xl shadow-lg hover:shadow-xl hover:from-indigo-700 hover:to-indigo-800 transition-all duration-200 transform hover:scale-105 ${collapsed ? "justify-center px-3" : ""
              }`}
            onClick={() => setShowOptions((prev) => !prev)}
            title="Enhance with AI"
          >
            <FaMagic className={`${showOptions ? "animate-pulse" : ""}`} />
            {!collapsed && (
              <span className="font-semibold">Enhance with AI</span>
            )}
            {!collapsed && (
              <FaChevronRight
                className={`ml-auto transition-transform duration-200 ${showOptions ? "rotate-90" : ""
                  }`}
              />
            )}
          </button>

          {/* Enhancement Options */}
          {showOptions && !collapsed && (
            <div className="mt-3 bg-white border border-gray-200 rounded-xl shadow-lg p-4 space-y-2">
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
                Select Section to Enhance
              </div>
              <div className="grid grid-cols-1 gap-2 max-h-64 overflow-y-auto">
                {enhancementOptions.map((option) => (
                  <button
                    key={option}
                    onClick={() => handleEnhanceSection(option)}
                    disabled={enhancingSection === option}
                    className="flex items-center gap-3 text-left p-3 text-indigo-700 hover:bg-indigo-50 rounded-lg transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed border border-transparent hover:border-indigo-200"
                  >
                    <FaMagic className="text-indigo-500 text-sm" />
                    <span className="font-medium">
                      {enhancingSection === option
                        ? `Enhancing ${option}...`
                        : `${option.charAt(0).toUpperCase() + option.slice(1)}`}
                    </span>
                    {enhancingSection === option && (
                      <div className="ml-auto">
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-indigo-500 border-t-transparent"></div>
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
          className={`w-full flex items-center gap-3 bg-gradient-to-r from-green-600 to-green-700 text-white py-3 px-4 rounded-xl shadow-lg hover:shadow-xl hover:from-green-700 hover:to-green-800 transition-all duration-200 transform hover:scale-105 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none ${collapsed ? "justify-center px-3" : ""
            }`}
          onClick={handleDownloadPDF}
          title="Download PDF"
        >
          <FaFileDownload className={downloadRequested ? "animate-bounce" : ""} />
          {!collapsed && (
            <span className="font-semibold">
              {downloadRequested ? "Generating..." : "Download PDF"}
            </span>
          )}
          {downloadRequested && !collapsed && (
            <div className="ml-auto">
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
            </div>
          )}
        </button>

        {/* Share Button */}
        <button
          className={`w-full flex items-center gap-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 px-4 rounded-xl shadow-lg hover:shadow-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 transform hover:scale-105 ${collapsed ? "justify-center px-3" : ""
            }`}
          onClick={() => {
            if (navigator.share) {
              navigator.share({
                title: "My Resume",
                url: window.location.href,
              });
            } else {
              toast.info("Sharing not supported on this device. You can copy the URL manually.");
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
        <div className="mt-auto pt-6 border-t border-gray-200">
          <div className="text-center">
            <div className="text-xs text-gray-500 font-medium">
              Last updated: {new Date().toLocaleDateString()}
            </div>
            <div className="flex items-center justify-center gap-2 mt-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-xs text-gray-600">Auto-saved</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
