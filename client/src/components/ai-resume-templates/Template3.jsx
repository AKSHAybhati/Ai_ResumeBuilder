import { useState, useRef, useEffect } from "react";
import Navbar from "../Navbar/Navbar";
import Sidebar from "../Sidebar/Sidebar";
import { useResume } from "../../context/ResumeContext";

const Template3 = () => {
  const { resumeData, setResumeData } = useResume();
  const [editMode, setEditMode] = useState(false);
  const [localData, setLocalData] = useState(resumeData);
  const resumeRef = useRef(null);

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

  const handleEnhance = (section) => {
    console.log("✨ Enhancing section:", section);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="flex">
        <Sidebar onEnhance={handleEnhance} resumeRef={resumeRef} />

        <main className="flex-grow p-6" ref={resumeRef}>
          <div className="bg-white shadow-lg rounded-lg p-6 max-w-4xl mx-auto">
            {/* Header */}
            <div className="flex justify-between border-b pb-4 mb-6">
              <div>
                {editMode ? (
                  <>
                    <input
                      value={localData.name}
                      onChange={(e) =>
                        handleFieldChange("name", e.target.value)
                      }
                      className="text-2xl font-bold block mb-1"
                    />
                    <input
                      value={localData.role}
                      onChange={(e) =>
                        handleFieldChange("role", e.target.value)
                      }
                      className="text-md text-gray-600 block"
                    />
                  </>
                ) : (
                  <>
                    <h1 className="text-2xl font-bold">{resumeData.name}</h1>
                    <p className="text-md text-gray-600">{resumeData.role}</p>
                  </>
                )}
              </div>
              <div className="text-sm text-right">
                {editMode
                  ? ["location", "phone", "email", "linkedin"].map((field) => (
                      <input
                        key={field}
                        value={localData[field]}
                        onChange={(e) =>
                          handleFieldChange(field, e.target.value)
                        }
                        className="block text-right mb-1"
                      />
                    ))
                  : ["location", "phone", "email", "linkedin"].map((field) => (
                      <p key={field} className="text-gray-700">
                        {resumeData[field]}
                      </p>
                    ))}
              </div>
            </div>

            {/* Summary */}
            <section className="mb-6">
              <h2 className="text-xl font-semibold mb-2 border-b">Summary</h2>
              {editMode ? (
                <textarea
                  value={localData.summary}
                  onChange={(e) => handleFieldChange("summary", e.target.value)}
                  className="w-full p-2 border rounded"
                  rows={3}
                />
              ) : (
                <p>{resumeData.summary}</p>
              )}
            </section>

            {/* Skills */}
            <section className="mb-6">
              <h2 className="text-xl font-semibold mb-2 border-b">Skills</h2>
              {editMode ? (
                <textarea
                  value={localData.skills?.join(", ")}
                  onChange={(e) =>
                    handleFieldChange(
                      "skills",
                      e.target.value.split(",").map((s) => s.trim())
                    )
                  }
                  className="w-full p-2 border rounded"
                  rows={2}
                />
              ) : (
                <ul className="list-disc list-inside">
                  {resumeData.skills?.map((skill, idx) => (
                    <li key={idx}>{skill}</li>
                  ))}
                </ul>
              )}
            </section>

            {/* Education */}
            <section className="mb-6">
              <h2 className="text-xl font-semibold mb-2 border-b">Education</h2>
              {resumeData.education.map((edu, idx) => (
                <div key={idx} className="mb-4">
                  {editMode ? (
                    ["degree", "institution", "duration", "location"].map(
                      (field) => (
                        <input
                          key={field}
                          value={localData.education[idx][field]}
                          onChange={(e) => {
                            const updated = [...localData.education];
                            updated[idx][field] = e.target.value;
                            handleFieldChange("education", updated);
                          }}
                          className="block w-full mb-1"
                        />
                      )
                    )
                  ) : (
                    <>
                      <p className="font-semibold">{edu.degree}</p>
                      <p>
                        {edu.institution} ({edu.duration}) - {edu.location}
                      </p>
                    </>
                  )}
                </div>
              ))}
            </section>

            {/* Experience */}
            <section>
              <h2 className="text-xl font-semibold mb-2 border-b">
                Experience
              </h2>
              {resumeData.experience.map((exp, idx) => (
                <div key={idx} className="mb-4">
                  {editMode ? (
                    <>
                      {["title", "companyName", "date", "companyLocation"].map(
                        (field) => (
                          <input
                            key={field}
                            value={localData.experience[idx][field]}
                            onChange={(e) => {
                              const updated = [...localData.experience];
                              updated[idx][field] = e.target.value;
                              handleFieldChange("experience", updated);
                            }}
                            className="block w-full mb-1"
                          />
                        )
                      )}
                      <textarea
                        value={localData.experience[idx].accomplishment.join(
                          "\n"
                        )}
                        onChange={(e) => {
                          const updated = [...localData.experience];
                          updated[idx].accomplishment = e.target.value
                            .split("\n")
                            .filter(Boolean);
                          handleFieldChange("experience", updated);
                        }}
                        className="w-full p-2 border rounded"
                        rows={3}
                      />
                    </>
                  ) : (
                    <>
                      <p className="font-semibold">
                        {exp.title} @ {exp.companyName}
                      </p>
                      <p className="text-sm text-gray-600">
                        {exp.date} | {exp.companyLocation}
                      </p>
                      <ul className="list-disc list-inside">
                        {exp.accomplishment.map((acc, i) => (
                          <li key={i}>{acc}</li>
                        ))}
                      </ul>
                    </>
                  )}
                </div>
              ))}
            </section>

            {/* Buttons */}
            <div className="mt-6 flex justify-center gap-4">
              {editMode ? (
                <>
                  <button
                    onClick={handleSave}
                    className="bg-green-600 text-white px-4 py-2 rounded"
                  >
                    Save
                  </button>
                  <button
                    onClick={handleCancel}
                    className="bg-gray-400 text-white px-4 py-2 rounded"
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setEditMode(true)}
                  className="bg-blue-600 text-white px-4 py-2 rounded"
                >
                  Edit
                </button>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Template3;
