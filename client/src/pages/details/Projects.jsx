import { useState, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { ResumeContext } from "../../context/ResumeContext";
import { useAuth } from "../../context/AuthContext";
import resumeService from "../../services/resumeService";
import { toast } from "react-toastify";

const Projects = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { templateId, buildType } = location.state || {};
  const { resumeData, updateResumeData } = useContext(ResumeContext);
  const { isAuthenticated } = useAuth();

  const [projects, setProjects] = useState(
  (resumeData?.projectsDetailed || []).map((p, index) => ({
    id: p.id ?? index + 1,  // ensure every project has an id
    ...p,
    technologies: p.technologies ?? ""
  })) || [
    {
      id: 1,
      title: '',
      description: '',
      technologies: '',
      link: '',
      githubLink: '',
      startDate: '',
      endDate: '',
      isOngoing: false
    }
  ]
);


  const handleProjectChange = (id, field, value) => {
    setProjects((prev) =>
      prev.map((project) =>
        project.id === id ? { ...project, [field]: value } : project
      )
    );
  };

  const addProject = () => {
    const newId =
      projects.length > 0
        ? Math.max(...projects.map((project) => project.id)) + 1
        : 1;
    setProjects((prev) => [
      ...prev,
      {
        id: newId,
        title: "",
        description: "",
        technologies: "",
        link: "",
        githubLink: "",
        startDate: "",
        endDate: "",
        isOngoing: false,
      },
    ]);
  };

  const removeProject = (id) => {
    if (projects.length > 1) {
      setProjects((prev) => prev.filter((project) => project.id !== id));
    }
  };

  const handleNext = () => {
    const updatedData = {
      ...resumeData,
      // Map projects to the format expected by templates
      projects: projects
        .map((project) => ({
          title: project.title,
          description: project.description,
          technologies: Array.isArray(project.technologies)
            ? project.technologies
            : (project.technologies || "")
                .split(",")
                .map((tech) => tech.trim())
                .filter((tech) => tech),

          link: project.link,
          githubLink: project.githubLink,
          duration: project.isOngoing
            ? `${project.startDate} - Present`
            : `${project.startDate} - ${project.endDate}`,
        }))
        .filter((project) => project.title.trim()),
      // Also keep the structured format for other use
      projectsDetailed: projects,
    };

    updateResumeData(updatedData);
    navigate("/details/languages", {
      state: { templateId, buildType },
    });
  };

  const handleFinish = async () => {
    const finalData = {
      ...resumeData,
      // Map projects to the format expected by templates
      projects: projects
        .map((project) => ({
          title: project.title,
          description: project.description,
          technologies: project.technologies
            .split(",")
            .map((tech) => tech.trim())
            .filter((tech) => tech),
          link: project.link,
          githubLink: project.githubLink,
          duration: project.isOngoing
            ? `${project.startDate} - Present`
            : `${project.startDate} - ${project.endDate}`,
        }))
        .filter((project) => project.title.trim()),
      // Also keep the structured format for other use
      projectsDetailed: projects,
    };

    try {
      // Update context
      updateResumeData(finalData);

      // Auto-save to database if user is authenticated
      if (isAuthenticated) {
        const saveResult = await resumeService.saveResumeData(finalData);
        if (saveResult.success) {
          toast.success("Data saved successfully");
        } else {
          console.error("Database save error:", saveResult.error);
          toast.error("Failed to save");
        }
      } else {
        toast.success("Data saved successfully");
      }

      // Navigate to the correct template based on templateId
      let templateRoute = `/template${templateId}`;

      // Handle special cases where template routes don't follow the pattern
      if (
        templateId === 6 ||
        templateId === 7 ||
        templateId === 9 ||
        templateId === 10 ||
        templateId === 12
      ) {
        // These templates might not exist or have different routes
        templateRoute = "/template1"; // fallback to template1
      }

      navigate(templateRoute, {
        state: { resumeData: finalData },
      });
    } catch (error) {
      console.error("Error during finish:", error);
      // Failed to save projects - no toast notification
    }
  };

  const handleBackClick = () => {
    navigate("/details/skills", {
      state: { templateId, buildType },
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-4 py-12 md:p-12 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-72 h-72 bg-teal-500 rounded-full opacity-10 blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-orange-500 rounded-full opacity-10 blur-3xl"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-4xl mx-auto relative z-10"
      >
        {/* Back Button */}
        <motion.button
          onClick={handleBackClick}
          className="mb-8 flex items-center text-white hover:text-teal-100 transition-all duration-300 ease-in-out focus:outline-none p-4 rounded-2xl shadow-xl bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 backdrop-blur-lg border border-teal-400/30"
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.95 }}
        >
          <svg
            className="w-6 h-6 mr-3"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back
        </motion.button>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-teal-400 font-semibold">Projects</span>
            <span className="text-gray-400 text-sm">Step 5 of 6</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-teal-500 to-orange-500 h-2 rounded-full"
              style={{ width: "83%" }}
            ></div>
          </div>
        </div>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-teal-400 to-orange-400 bg-clip-text text-transparent">
            Projects
          </h1>
          <p className="text-gray-300">
            Showcase your personal projects and contributions
          </p>
        </motion.div>

        {/* Projects Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-lg border border-gray-600 rounded-3xl p-8 mb-8"
        >
          <h2 className="text-2xl font-bold text-white mb-6">Your Projects</h2>
          <div className="space-y-6">
            {projects.map((project, index) => (
              <div
                key={project.id}
                className="border border-gray-600 rounded-xl p-6"
              >
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-white">
                    Project {index + 1}
                  </h3>
                  {projects.length > 1 && (
                    <button
                      onClick={() => removeProject(project.id)}
                      className="text-red-400 hover:text-red-300 transition-colors duration-300"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  )}
                </div>

                {/* Project Title */}
                <div className="grid gap-4 mb-4">
                  <input
                    type="text"
                    value={project.title}
                    onChange={(e) =>
                      handleProjectChange(project.id, "title", e.target.value)
                    }
                    className="px-4 py-3 rounded-xl bg-gray-700 border border-gray-600 text-white focus:border-teal-400 focus:outline-none transition-all duration-300"
                    placeholder="Project Title"
                  />
                </div>

                {/* Project Description */}
                <div className="grid gap-4 mb-4">
                  <textarea
                    value={project.description}
                    onChange={(e) =>
                      handleProjectChange(
                        project.id,
                        "description",
                        e.target.value
                      )
                    }
                    className="px-4 py-3 rounded-xl bg-gray-700 border border-gray-600 text-white focus:border-teal-400 focus:outline-none transition-all duration-300 resize-none"
                    placeholder="Brief description of the project"
                    rows="3"
                  />
                </div>

                {/* Technologies and Links */}
                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <input
                    type="text"
                    value={project.technologies}
                    onChange={(e) =>
                      handleProjectChange(
                        project.id,
                        "technologies",
                        e.target.value
                      )
                    }
                    className="px-4 py-3 rounded-xl bg-gray-700 border border-gray-600 text-white focus:border-teal-400 focus:outline-none transition-all duration-300"
                    placeholder="Technologies (comma separated)"
                  />
                  <input
                    type="url"
                    value={project.link}
                    onChange={(e) =>
                      handleProjectChange(project.id, "link", e.target.value)
                    }
                    className="px-4 py-3 rounded-xl bg-gray-700 border border-gray-600 text-white focus:border-teal-400 focus:outline-none transition-all duration-300"
                    placeholder="Live Demo URL (optional)"
                  />
                </div>

                {/* GitHub Link and Dates */}
                <div className="grid md:grid-cols-3 gap-4 mb-4">
                  <input
                    type="url"
                    value={project.githubLink}
                    onChange={(e) =>
                      handleProjectChange(
                        project.id,
                        "githubLink",
                        e.target.value
                      )
                    }
                    className="px-4 py-3 rounded-xl bg-gray-700 border border-gray-600 text-white focus:border-teal-400 focus:outline-none transition-all duration-300"
                    placeholder="GitHub URL (optional)"
                  />
                  <input
                    type="text"
                    value={project.startDate}
                    onChange={(e) =>
                      handleProjectChange(
                        project.id,
                        "startDate",
                        e.target.value
                      )
                    }
                    className="px-4 py-3 rounded-xl bg-gray-700 border border-gray-600 text-white focus:border-teal-400 focus:outline-none transition-all duration-300"
                    placeholder="Start Date (e.g. Jan 2023)"
                  />
                  {!project.isOngoing && (
                    <input
                      type="text"
                      value={project.endDate}
                      onChange={(e) =>
                        handleProjectChange(
                          project.id,
                          "endDate",
                          e.target.value
                        )
                      }
                      className="px-4 py-3 rounded-xl bg-gray-700 border border-gray-600 text-white focus:border-teal-400 focus:outline-none transition-all duration-300"
                      placeholder="End Date (e.g. Dec 2023)"
                    />
                  )}
                </div>

                {/* Ongoing Project Checkbox */}
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id={`ongoing-${project.id}`}
                    checked={project.isOngoing}
                    onChange={(e) =>
                      handleProjectChange(
                        project.id,
                        "isOngoing",
                        e.target.checked
                      )
                    }
                    className="w-4 h-4 text-teal-600 bg-gray-700 border-gray-600 rounded focus:ring-teal-500 focus:ring-2"
                  />
                  <label
                    htmlFor={`ongoing-${project.id}`}
                    className="ml-2 text-sm text-gray-300"
                  >
                    This is an ongoing project
                  </label>
                </div>
              </div>
            ))}
          </div>
          <button
            onClick={addProject}
            className="mt-4 px-6 py-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105"
          >
            + Add Project
          </button>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="flex flex-wrap gap-4 justify-center"
        >
          <button
            onClick={handleNext}
            className="px-8 py-3 bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            Next
          </button>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Projects;
