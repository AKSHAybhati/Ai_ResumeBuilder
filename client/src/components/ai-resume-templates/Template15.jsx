import React, { useState, useEffect, useRef, forwardRef } from "react";
import Sidebar from "../Sidebar/Sidebar";
import Navbar from "../Navbar/Navbar";
import { useResume } from "../../context/ResumeContext";

import PropTypes from "prop-types";
import {
  Eye,
  Edit3,
  Download,
  PlusCircle,
  Trash2,
  Briefcase,
  GraduationCap,
  Lightbulb,
  User,
  Phone,
  Mail,
  Linkedin,
  Github,
  MapPin,
  Save,
  Share2,
  Palette,
  ZoomIn,
  ZoomOut,
  Image as ImageIcon,
  Languages,
} from "lucide-react";

// --- Default Resume Data ---
const initialUserData = {
  name: "Rhea Kapoor",
  jobTitle: "Digital Marketing Specialist",
  address: "New York, NY",
  phone: "+1 555-123-4567",
  email: "rhea.kapoor@email.com",
  linkedin: "linkedin.com/in/rheakapoor",
  github: "",
  summary:
    "A results-driven Digital Marketing Specialist with 4+ years of experience in developing and executing comprehensive digital strategies. Proven track record in SEO, SEM, social media management, content creation, and analytics to drive brand growth and achieve marketing objectives.",
  skills: [
    "SEO",
    "SEM",
    "Content Marketing",
    "Social Media Strategy",
    "Google Analytics",
    "HubSpot",
    "Email Marketing",
    "PPC Campaigns",
    "Data Analysis",
    "CRM Management",
    "Copywriting",
    "A/B Testing",
  ],
  experience: [
    {
      id: "initial-exp-1",
      title: "Digital Marketing Manager",
      company: "Global Innovations",
      duration: "Jan 2023 - Present",
      location: "New York, NY",
      points: [
        "Spearheaded multi-channel digital marketing campaigns, resulting in a 30% increase in qualified leads.",
        "Managed a team of 2 junior marketers, providing guidance and fostering professional growth.",
        "Optimized SEO strategies, elevating organic search rankings for key product lines.",
        "Analyzed campaign performance using Google Analytics and prepared detailed reports for stakeholders.",
      ],
    },
    {
      id: "initial-exp-2",
      title: "Marketing Coordinator",
      company: "Creative Solutions",
      duration: "Aug 2020 - Dec 2022",
      location: "New York, NY",
      points: [
        "Executed daily social media content calendars across various platforms, growing audience engagement by 20%.",
        "Assisted in the creation and distribution of email marketing newsletters to a subscriber base of 10,000+.",
        "Monitored and optimized PPC campaigns on Google Ads, achieving a 10% reduction in cost-per-conversion.",
      ],
    },
  ],
  education: [
    {
      id: "initial-edu-1",
      year: "2020",
      degree: "B.A. in Marketing",
      institution: "New York University",
    },
  ],
  languages: [
    { id: "initial-lang-1", name: "English", level: "Native" },
    { id: "initial-lang-2", name: "Spanish", level: "Conversational" },
  ],
  hobbies: ["Photography", "Yoga", "Blogging"],
};

// --- Resume Preview Component ---
const UserResumePreview = forwardRef(
  ({ data, font, themeColor, zoomLevel }, ref) => {
    const themeColorClass = `text-${themeColor}-700`;
    const themeAccentClass = `text-${themeColor}-600`;
    const themeBorderClass = `border-${themeColor}-300`;
    const themeBgLight = `bg-${themeColor}-50`;
    const themeBulletClass = `text-${themeColor}-500`;

    const Section = ({ title, children, icon, className = "" }) => (
      <section className={`mb-8 pb-4 ${className}`}>
        {title && (
          <h2
            className={`text-2xl md:text-3xl font-bold ${themeColorClass} mb-4 flex items-center`}
          >
            {icon &&
              React.createElement(icon, {
                className: `mr-3 h-6 w-6 ${themeAccentClass}`,
              })}
            {title}
          </h2>
        )}
        {children}
      </section>
    );

    Section.propTypes = {
      title: PropTypes.string,
      children: PropTypes.node,
      icon: PropTypes.elementType,
      className: PropTypes.string,
    };

    return (
      <div
        ref={ref}
        id="resume-preview-id"
        className={`text-base text-gray-800 max-w-4xl mx-auto bg-white rounded-xl shadow-2xl printable-area overflow-hidden`}
        style={{
          fontFamily: font,
          transform: `scale(${zoomLevel})`,
          transformOrigin: "top left",
        }}
      >
        {/* Header Section */}
        <header
          className={`py-10 px-12 text-center ${themeBgLight} border-b ${themeBorderClass}`}
        >
          <h1
            className={`text-5xl md:text-6xl font-extrabold text-gray-900 leading-tight mb-2`}
          >
            {data.name}
          </h1>
          {data.jobTitle && (
            <p
              className={`text-2xl md:text-3xl ${themeAccentClass} font-semibold mb-6`}
            >
              {data.jobTitle}
            </p>
          )}
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-lg text-gray-700">
            {data.address && (
              <p className="flex items-center">
                <MapPin size={18} className="mr-2.5 shrink-0 text-gray-600" />
                {data.address}
              </p>
            )}
            {data.phone && (
              <p className="flex items-center">
                <Phone size={18} className="mr-2.5 shrink-0 text-gray-600" />
                {data.phone}
              </p>
            )}
            {data.email && (
              <p className="flex items-center">
                <Mail size={18} className="mr-2.5 shrink-0 text-gray-600" />
                <a href={`mailto:${data.email}`} className="hover:underline">
                  {data.email}
                </a>
              </p>
            )}
            {data.linkedin && data.linkedin.trim() !== "" && (
              <p className="flex items-center">
                <Linkedin size={18} className="mr-2.5 shrink-0 text-gray-600" />
                <a
                  href={`https://${
                    data.linkedin.startsWith("http") ? "" : "https://"
                  }${data.linkedin}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline"
                >
                  {data.linkedin.replace(
                    /(https?:\/\/)?(www\.)?(linkedin\.com\/in\/)?/i,
                    ""
                  )}
                </a>
              </p>
            )}
            {data.github && data.github.trim() !== "" && (
              <p className="flex items-center">
                <Github size={18} className="mr-2.5 shrink-0 text-gray-600" />
                <a
                  href={`https://github.com/${data.github}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline"
                >
                  {data.github}
                </a>
              </p>
            )}
          </div>
        </header>

        {/* Main Content Sections */}
        <div className="p-10 md:p-12">
          {data.summary && (
            <Section title="Summary" icon={User}>
              <p className="text-lg leading-relaxed text-gray-700">
                {data.summary}
              </p>
            </Section>
          )}

          {data.experience && data.experience.length > 0 && (
            <Section title="Experience" icon={Briefcase}>
              {data.experience.map((exp) => (
                <div key={exp.id} className="mb-6 last:mb-0">
                  <div className="flex justify-between items-baseline mb-1">
                    <h3 className="font-semibold text-gray-800 text-xl">
                      {exp.title} at{" "}
                      <span className={`${themeAccentClass}`}>
                        {exp.company}
                      </span>
                    </h3>
                    <span className="text-md text-gray-500 font-semibold flex-shrink-0 ml-4">
                      {exp.duration}
                    </span>
                  </div>
                  <p className="text-md italic text-gray-500 mb-2">
                    {exp.location}
                  </p>
                  <ul className="list-inside text-md text-gray-700 space-y-1.5 pl-4">
                    {exp.points &&
                      exp.points.map(
                        (point, j) =>
                          point.trim() !== "" && (
                            <li key={j} className="flex items-start">
                              <span
                                className={`mr-2.5 mt-1 ${themeBulletClass}`}
                              >
                                &bull;
                              </span>{" "}
                              {point}
                            </li>
                          )
                      )}
                  </ul>
                </div>
              ))}
            </Section>
          )}

          {data.education && data.education.length > 0 && (
            <Section title="Education" icon={GraduationCap}>
              {data.education.map((edu) => (
                <div key={edu.id} className="mb-5 last:mb-0">
                  <div className="flex justify-between items-baseline mb-1">
                    <h3 className="text-xl font-medium text-gray-800">
                      {edu.degree}
                    </h3>
                    <span className="text-md text-gray-500 font-semibold flex-shrink-0 ml-4">
                      {edu.year}
                    </span>
                  </div>
                  <p className={`text-md ${themeAccentClass}`}>
                    {edu.institution}
                  </p>
                </div>
              ))}
            </Section>
          )}

          {data.skills && data.skills.length > 0 && (
            <Section title="Skills" icon={Lightbulb}>
              <ul className="columns-1 md:columns-2 list-inside text-lg text-gray-700 space-y-2">
                {data.skills.map((skill, i) => (
                  <li
                    key={i}
                    className="break-inside-avoid-column flex items-center"
                  >
                    <span className={`mr-2.5 ${themeBulletClass}`}>&bull;</span>{" "}
                    {skill}
                  </li>
                ))}
              </ul>
            </Section>
          )}

          {data.languages && data.languages.length > 0 && (
            <Section title="Languages" icon={Languages}>
              <ul className="text-lg space-y-2 pt-1">
                {data.languages.map((lang) => (
                  <li key={lang.id} className="flex items-center">
                    <span className={`mr-2.5 ${themeAccentClass}`}>&bull;</span>
                    <strong>{lang.name}:</strong>&nbsp;{lang.level}
                  </li>
                ))}
              </ul>
            </Section>
          )}

          {data.hobbies && data.hobbies.length > 0 && (
            <Section title="Hobbies" icon={Palette}>
              <ul className="text-lg list-disc list-inside ml-5 space-y-1.5 pt-1">
                {data.hobbies.map((hobby, i) => (
                  <li key={i}>{hobby}</li>
                ))}
              </ul>
            </Section>
          )}
        </div>
      </div>
    );
  }
);

UserResumePreview.propTypes = {
  data: PropTypes.object.isRequired,
  font: PropTypes.string.isRequired,
  themeColor: PropTypes.string.isRequired,
  zoomLevel: PropTypes.number.isRequired,
};

UserResumePreview.displayName = "UserResumePreview";

// --- Resume Edit Form ---
const UserResumeEditForm = ({ formData, setFormData }) => {
  const updateField = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updateField("imageUrl", reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleArrayFieldChange = (section, index, field, value) => {
    setFormData((prev) => {
      const newArray = [...prev[section]];
      newArray[index] = { ...newArray[index], [field]: value };
      return { ...prev, [section]: newArray };
    });
  };

  const handleExperiencePointChange = (expIndex, pointIndex, value) => {
    setFormData((prev) => {
      const newExperience = [...prev.experience];
      const currentPoints = newExperience[expIndex].points
        ? [...newExperience[expIndex].points]
        : [];
      currentPoints[pointIndex] = value;
      newExperience[expIndex] = {
        ...newExperience[expIndex],
        points: currentPoints,
      };
      return { ...prev, experience: newExperience };
    });
  };

  const addArrayItem = (section, template) => {
    setFormData((prev) => ({
      ...prev,
      [section]: [
        ...prev[section],
        { ...template, id: `${section.slice(0, 3)}-${Date.now()}` },
      ],
    }));
  };

  const removeArrayItem = (section, index) => {
    setFormData((prev) => ({
      ...prev,
      [section]: prev[section].filter((_, i) => i !== index),
    }));
  };

  const addExperiencePoint = (expIndex) => {
    setFormData((prev) => {
      const newExperience = [...prev.experience];
      const currentPoints = newExperience[expIndex].points
        ? [...newExperience[expIndex].points]
        : [];
      currentPoints.push("");
      newExperience[expIndex] = {
        ...newExperience[expIndex],
        points: currentPoints,
      };
      return { ...prev, experience: newExperience };
    });
  };

  const removeExperiencePoint = (expIndex, pointIndex) => {
    setFormData((prev) => {
      const newExperience = [...prev.experience];
      if (newExperience[expIndex] && newExperience[expIndex].points) {
        newExperience[expIndex] = {
          ...newExperience[expIndex],
          points: newExperience[expIndex].points.filter(
            (_, i) => i !== pointIndex
          ),
        };
      }
      return { ...prev, experience: newExperience };
    });
  };

  const handleListChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value
        .split(",")
        .map((s) => s.trim())
        .filter((s) => s),
    }));
  };

  const FormSectionWrapper = ({ title, children }) => (
    <div className="mb-8 p-5 border rounded-lg bg-slate-50 shadow-sm">
      <h3 className="text-xl font-semibold text-indigo-700 mb-5">{title}</h3>
      <div className="space-y-4">{children}</div>
    </div>
  );
  FormSectionWrapper.propTypes = {
    title: PropTypes.string.isRequired,
    children: PropTypes.node.isRequired,
  };

  const Input = ({ label, value, onChange, placeholder, type = "text" }) => (
    <div>
      <label className="block text-base font-medium text-gray-700 mb-1.5">
        {label}
      </label>
      <input
        type={type}
        value={value || ""}
        onChange={onChange}
        placeholder={placeholder || label}
        className="border border-gray-300 p-2.5 w-full rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-base"
      />
    </div>
  );
  Input.propTypes = {
    label: PropTypes.string.isRequired,
    value: PropTypes.string,
    onChange: PropTypes.func.isRequired,
    placeholder: PropTypes.string,
    type: PropTypes.string,
  };

  const Textarea = ({ label, value, onChange, placeholder, rows = 3 }) => (
    <div>
      <label className="block text-base font-medium text-gray-700 mb-1.5">
        {label}
      </label>
      <textarea
        value={value || ""}
        onChange={onChange}
        placeholder={placeholder || label}
        rows={rows}
        className="border border-gray-300 p-2.5 w-full rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-base"
      />
    </div>
  );
  Textarea.propTypes = {
    label: PropTypes.string.isRequired,
    value: PropTypes.string,
    onChange: PropTypes.func.isRequired,
    placeholder: PropTypes.string,
    rows: PropTypes.number,
  };

  return (
    <div className="bg-white p-8 rounded-xl shadow-2xl space-y-8 max-w-2xl mx-auto">
      <h2 className="text-3xl font-bold text-center text-indigo-700 mb-8">
        Edit Your Resume
      </h2>

      <FormSectionWrapper title="Personal Details">
        <Input
          label="Full Name"
          value={formData.name}
          onChange={(e) => updateField("name", e.target.value)}
        />
        <Input
          label="Job Title (e.g., Software Engineer)"
          value={formData.jobTitle}
          onChange={(e) => updateField("jobTitle", e.target.value)}
        />
        <Input
          label="Address"
          value={formData.address}
          onChange={(e) => updateField("address", e.target.value)}
        />
        <Input
          label="Phone"
          value={formData.phone}
          onChange={(e) => updateField("phone", e.target.value)}
          type="tel"
        />
        <Input
          label="Email"
          value={formData.email}
          onChange={(e) => updateField("email", e.target.value)}
          type="email"
        />
        <Input
          label="LinkedIn Profile (e.g., linkedin.com/in/yourname)"
          value={formData.linkedin}
          onChange={(e) => updateField("linkedin", e.target.value)}
          placeholder="Optional"
        />
        <Input
          label="GitHub Username (e.g., yourusername)"
          value={formData.github}
          onChange={(e) => updateField("github", e.target.value)}
          placeholder="Optional"
        />
        <div>
          <label className="text-base font-medium text-gray-700 mb-1.5 flex items-center">
            <ImageIcon size={18} className="mr-2.5 text-gray-600" />
            Profile Image
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="block w-full text-base text-gray-700
                       file:mr-4 file:py-2 file:px-4
                       file:rounded-md file:border-0
                       file:text-sm file:font-semibold
                       file:bg-indigo-50 file:text-indigo-700
                       hover:file:bg-indigo-100 cursor-pointer"
          />
          {formData.imageUrl && (
            <div className="mt-4 flex items-center space-x-3">
              <img
                src={formData.imageUrl}
                alt="Preview"
                className="w-20 h-20 rounded-full object-cover border border-gray-300"
              />
              <p className="text-sm text-gray-500">Image loaded.</p>
              <button
                onClick={() => updateField("imageUrl", "")}
                className="text-red-500 hover:text-red-700 text-sm flex items-center"
              >
                <Trash2 size={16} className="mr-1" /> Remove
              </button>
            </div>
          )}
          <p className="text-sm text-gray-500 mt-1">
            Or paste an Image URL (Optional):
          </p>
          <Input
            label="Image URL"
            value={formData.imageUrl}
            onChange={(e) => updateField("imageUrl", e.target.value)}
            placeholder="e.g., https://example.com/your-photo.jpg"
          />
        </div>
      </FormSectionWrapper>

      <FormSectionWrapper title="Profile Summary">
        <Textarea
          label="Summary"
          value={formData.summary}
          onChange={(e) => updateField("summary", e.target.value)}
          rows={5}
        />
      </FormSectionWrapper>

      <FormSectionWrapper title="Work Experience">
        {formData.experience.map((exp, i) => (
          <div
            key={exp.id}
            className="p-4 border rounded-md bg-white space-y-3 relative"
          >
            <button
              onClick={() => removeArrayItem("experience", i)}
              className="absolute top-3 right-3 text-red-500 hover:text-red-700 p-1"
            >
              <Trash2 size={20} />
            </button>
            <Input
              label="Job Title"
              value={exp.title}
              onChange={(e) =>
                handleArrayFieldChange("experience", i, "title", e.target.value)
              }
            />
            <Input
              label="Company"
              value={exp.company}
              onChange={(e) =>
                handleArrayFieldChange(
                  "experience",
                  i,
                  "company",
                  e.target.value
                )
              }
            />
            <Input
              label="Duration (e.g., Feb 2017 - Present)"
              value={exp.duration}
              onChange={(e) =>
                handleArrayFieldChange(
                  "experience",
                  i,
                  "duration",
                  e.target.value
                )
              }
            />
            <Input
              label="Location"
              value={exp.location}
              onChange={(e) =>
                handleArrayFieldChange(
                  "experience",
                  i,
                  "location",
                  e.target.value
                )
              }
            />
            <div>
              <label className="block text-base font-medium text-gray-700 mb-1.5">
                Key Responsibilities/Achievements:
              </label>
              {exp.points &&
                exp.points.map((point, j) => (
                  <div key={j} className="flex items-center mb-2">
                    <Textarea
                      value={point}
                      onChange={(e) =>
                        handleExperiencePointChange(i, j, e.target.value)
                      }
                      rows={1}
                      placeholder={`Point ${j + 1}`}
                    />
                    <button
                      onClick={() => removeExperiencePoint(i, j)}
                      className="ml-3 text-red-400 hover:text-red-600 p-1"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))}
              <button
                onClick={() => addExperiencePoint(i)}
                className="text-md text-indigo-600 hover:text-indigo-800 flex items-center mt-2"
              >
                <PlusCircle size={18} className="mr-2" /> Add Point
              </button>
            </div>
          </div>
        ))}
        <button
          onClick={() =>
            addArrayItem("experience", {
              title: "",
              company: "",
              duration: "",
              location: "",
              points: [""],
            })
          }
          className="bg-indigo-500 text-white px-5 py-2.5 rounded-md hover:bg-indigo-600 flex items-center text-md"
        >
          <PlusCircle size={20} className="mr-2" /> Add Experience
        </button>
      </FormSectionWrapper>

      <FormSectionWrapper title="Education">
        {formData.education.map((edu, i) => (
          <div
            key={edu.id}
            className="p-4 border rounded-md bg-white space-y-3 relative"
          >
            <button
              onClick={() => removeArrayItem("education", i)}
              className="absolute top-3 right-3 text-red-500 hover:text-red-700 p-1"
            >
              <Trash2 size={20} />
            </button>
            <Input
              label="Year(s) (e.g., 2016 or 2014 - 2016)"
              value={edu.year}
              onChange={(e) =>
                handleArrayFieldChange("education", i, "year", e.target.value)
              }
            />
            <Input
              label="Degree/Certificate"
              value={edu.degree}
              onChange={(e) =>
                handleArrayFieldChange("education", i, "degree", e.target.value)
              }
            />
            <Input
              label="Institution Name"
              value={edu.institution}
              onChange={(e) =>
                handleArrayFieldChange(
                  "education",
                  i,
                  "institution",
                  e.target.value
                )
              }
            />
          </div>
        ))}
        <button
          onClick={() =>
            addArrayItem("education", { year: "", degree: "", institution: "" })
          }
          className="bg-indigo-500 text-white px-5 py-2.5 rounded-md hover:bg-indigo-600 flex items-center text-md"
        >
          <PlusCircle size={20} className="mr-2" /> Add Education
        </button>
      </FormSectionWrapper>

      <FormSectionWrapper title="Skills">
        <Textarea
          label="Skills (comma-separated)"
          value={formData.skills.join(", ")}
          onChange={(e) => handleListChange("skills", e.target.value)}
        />
      </FormSectionWrapper>

      <FormSectionWrapper title="Languages">
        {formData.languages.map((lang, i) => (
          <div
            key={lang.id}
            className="p-4 border rounded-md bg-white space-y-3 relative"
          >
            <button
              onClick={() => removeArrayItem("languages", i)}
              className="absolute top-3 right-3 text-red-500 hover:text-red-700 p-1"
            >
              <Trash2 size={20} />
            </button>
            <Input
              label="Language"
              value={lang.name}
              onChange={(e) =>
                handleArrayFieldChange("languages", i, "name", e.target.value)
              }
            />
            <Input
              label="Proficiency Level"
              value={lang.level}
              onChange={(e) =>
                handleArrayFieldChange("languages", i, "level", e.target.value)
              }
              placeholder="e.g., Native, Fluent, Proficient, Conversational"
            />
          </div>
        ))}
        <button
          onClick={() => addArrayItem("languages", { name: "", level: "" })}
          className="bg-indigo-500 text-white px-5 py-2.5 rounded-md hover:bg-indigo-600 flex items-center text-md"
        >
          <PlusCircle size={20} className="mr-2" /> Add Language
        </button>
      </FormSectionWrapper>

      <FormSectionWrapper title="Hobbies">
        <Textarea
          label="Hobbies (comma-separated)"
          value={formData.hobbies.join(", ")}
          onChange={(e) => handleListChange("hobbies", e.target.value)}
        />
      </FormSectionWrapper>
    </div>
  );
};

UserResumeEditForm.propTypes = {
  formData: PropTypes.object.isRequired,
  setFormData: PropTypes.func.isRequired,
};

// --- Main Template Component ---
const Template15 = () => {
  const { userData, setUserData } = useResume();
  const [formData, setFormData] = useState(userData || initialUserData);
  const [isEditing, setIsEditing] = useState(false);
  const [font, setFont] = useState("Inter");
  const [themeColor, setThemeColor] = useState("indigo");
  const [zoomLevel, setZoomLevel] = useState(1);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");
  const [notificationType, setNotificationType] = useState("success");
  const resumeRef = useRef(null);

  useEffect(() => {
    if (userData) {
      setFormData(userData);
    }
  }, [userData]);

  const handleSave = () => {
    setUserData(formData);
    setNotificationMessage("Resume saved successfully!");
    setNotificationType("success");
    setShowNotifications(true);
    setTimeout(() => setShowNotifications(false), 3000);
  };

  const handleDownload = async () => {
    if (!resumeRef.current) return;

    try {
      const html2canvas = (await import("html2canvas")).default;
      const canvas = await html2canvas(resumeRef.current, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: "#ffffff",
      });

      const imgData = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.download = `${formData.name.replace(/\s+/g, "_")}_Resume.png`;
      link.href = imgData;
      link.click();
    } catch (error) {
      console.error("Error downloading resume:", error);
      setNotificationMessage("Error downloading resume. Please try again.");
      setNotificationType("error");
      setShowNotifications(true);
      setTimeout(() => setShowNotifications(false), 3000);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const toggleEditing = () => {
    setIsEditing(!isEditing);
  };

  const handleZoomIn = () => {
    setZoomLevel((prev) => Math.min(prev + 0.1, 2));
  };

  const handleZoomOut = () => {
    setZoomLevel((prev) => Math.max(prev - 0.1, 0.5));
  };

  const handleResetZoom = () => {
    setZoomLevel(1);
  };

  const availableFonts = [
    "Inter",
    "Roboto",
    "Open Sans",
    "Lato",
    "Poppins",
    "Montserrat",
    "Source Sans Pro",
    "Raleway",
    "Ubuntu",
    "Nunito",
  ];

  const availableColors = [
    "indigo",
    "blue",
    "green",
    "purple",
    "red",
    "orange",
    "teal",
    "pink",
    "yellow",
    "gray",
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <div className="flex-1 p-6">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Template 15 - Modern Professional
              </h1>
              <p className="text-gray-600">
                A clean, modern template with excellent readability and
                professional styling.
              </p>
            </div>

            {/* Controls */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center space-x-4">
                  <button
                    onClick={toggleEditing}
                    className={`flex items-center px-4 py-2 rounded-md transition-colors ${
                      isEditing
                        ? "bg-indigo-600 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {isEditing ? (
                      <>
                        <Eye size={20} className="mr-2" />
                        Preview
                      </>
                    ) : (
                      <>
                        <Edit3 size={20} className="mr-2" />
                        Edit
                      </>
                    )}
                  </button>

                  {!isEditing && (
                    <>
                      <button
                        onClick={handleSave}
                        className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                      >
                        <Save size={20} className="mr-2" />
                        Save
                      </button>

                      <button
                        onClick={handleDownload}
                        className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                      >
                        <Download size={20} className="mr-2" />
                        Download
                      </button>

                      <button
                        onClick={handlePrint}
                        className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
                      >
                        <Share2 size={20} className="mr-2" />
                        Print
                      </button>
                    </>
                  )}
                </div>

                {!isEditing && (
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <label className="text-sm font-medium text-gray-700">
                        Font:
                      </label>
                      <select
                        value={font}
                        onChange={(e) => setFont(e.target.value)}
                        className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:ring-indigo-500 focus:border-indigo-500"
                      >
                        {availableFonts.map((f) => (
                          <option key={f} value={f}>
                            {f}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="flex items-center space-x-2">
                      <label className="text-sm font-medium text-gray-700">
                        Theme:
                      </label>
                      <select
                        value={themeColor}
                        onChange={(e) => setThemeColor(e.target.value)}
                        className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:ring-indigo-500 focus:border-indigo-500"
                      >
                        {availableColors.map((color) => (
                          <option key={color} value={color}>
                            {color.charAt(0).toUpperCase() + color.slice(1)}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="flex items-center space-x-2">
                      <button
                        onClick={handleZoomOut}
                        className="p-1 text-gray-600 hover:text-gray-800"
                        title="Zoom Out"
                      >
                        <ZoomOut size={18} />
                      </button>
                      <span className="text-sm text-gray-700 min-w-[60px] text-center">
                        {Math.round(zoomLevel * 100)}%
                      </span>
                      <button
                        onClick={handleZoomIn}
                        className="p-1 text-gray-600 hover:text-gray-800"
                        title="Zoom In"
                      >
                        <ZoomIn size={18} />
                      </button>
                      <button
                        onClick={handleResetZoom}
                        className="text-xs text-indigo-600 hover:text-indigo-800"
                        title="Reset Zoom"
                      >
                        Reset
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Content */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {isEditing ? (
                <UserResumeEditForm
                  formData={formData}
                  setFormData={setFormData}
                />
              ) : (
                <div className="lg:col-span-2">
                  <UserResumePreview
                    ref={resumeRef}
                    data={formData}
                    font={font}
                    themeColor={themeColor}
                    zoomLevel={zoomLevel}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Notifications */}
      {showNotifications && (
        <div className="fixed bottom-4 right-4 z-50">
          <div
            className={`px-6 py-4 rounded-lg shadow-lg text-white ${
              notificationType === "success" ? "bg-green-500" : "bg-red-500"
            }`}
          >
            {notificationMessage}
          </div>
        </div>
      )}
    </div>
  );
};

export default Template15;
