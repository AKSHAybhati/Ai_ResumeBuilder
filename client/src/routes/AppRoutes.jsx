// src/routes/AppRoutes.jsx
import { Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";

// Loading component (no animation for better UX)
const Loading = () => (
  <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
    <div className="text-center">
      <div className="w-16 h-16 border-4 border-teal-500 border-t-transparent rounded-full mx-auto mb-4"></div>
      <p className="text-white text-lg">Loading...</p>
    </div>
  </div>
);
const ResumeUploadPage = lazy(() => import("../pages/ResumeUploadPage.jsx"));
const ResumeEditPage = lazy(() => import("../pages/ResumeEditPage.jsx"));


// Lazy load components
// Home
const Home = lazy(() => import("../pages/Home.jsx"));

// Main TemplatePage
const TemplatePage = lazy(() => import("../pages/TemplatePage.jsx"));
const MyResumesPage = lazy(() => import("../pages/MyResumesPage.jsx"));

// Build Options and Details Pages
const BuildOption = lazy(() => import("../pages/BuildOption.jsx"));
const PersonalDetails = lazy(() =>
  import("../pages/details/PersonalDetails.jsx")
);
const WorkExperience = lazy(() =>
  import("../pages/details/WorkExperience.jsx")
);
const Languages = lazy(() => import("../pages/details/Languages.jsx"));
const Skills = lazy(() => import("../pages/details/Skills.jsx"));
const Education = lazy(() => import("../pages/details/Education.jsx"));
const Projects = lazy(() => import("../pages/details/Projects.jsx"));
const OtherDetails = lazy(() => import("../pages/details/OtherDetails.jsx"));

// ResumeTemplates
import Template1 from "../components/ai-resume-templates/Template1.jsx";
import Template2 from "../components/ai-resume-templates/Template2.jsx";
import Template3 from "../components/ai-resume-templates/Template3.jsx";
import Template4 from "../components/ai-resume-templates/Template4.jsx";
import Template5 from "../components/ai-resume-templates/Template5.jsx";
import Template6 from "../components/ai-resume-templates/Template6.jsx";
import Template7 from "../components/ai-resume-templates/Template7.jsx";
import Template8 from "../components/ai-resume-templates/Template8.jsx";
import Template9 from "../components/ai-resume-templates/Template9.jsx";
import Template10 from "../components/ai-resume-templates/Template10.jsx";
import Template11 from "../components/ai-resume-templates/Template11.jsx";
import Template12 from "../components/ai-resume-templates/Template12.jsx";
import Template13 from "../components/ai-resume-templates/Template13.jsx";
import Template14 from "../components/ai-resume-templates/Template14.jsx";
import Template15 from "../components/ai-resume-templates/Template15.jsx";
import Template16 from "../components/ai-resume-templates/Template16.jsx";
import Template17 from "../components/ai-resume-templates/Template17.jsx";
import Template18 from "../components/ai-resume-templates/Template18.jsx";
import Template19 from "../components/ai-resume-templates/Template19.jsx";
import Template20 from "../components/ai-resume-templates/Template20.jsx";
import Template21 from "../components/ai-resume-templates/Template21.jsx";
import Template22 from "../components/ai-resume-templates/Template22.jsx";
import Template23 from "../components/ai-resume-templates/Template23.jsx";
import Template27 from "../components/ai-resume-templates/Template27.jsx";
import Template28 from "../components/ai-resume-templates/Template28.jsx";
import Template29 from "../components/ai-resume-templates/Template29.jsx";

// Not Found
const NotFound = lazy(() => import("../pages/NotFound.jsx"));

const AppRoutes = () => {
  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/templatepage" element={<TemplatePage />} />
        <Route path="/ai-edit" element={<ResumeUploadPage />} />
        <Route path="/edit-resume" element={<ResumeEditPage />} />
        <Route path="/my-resumes" element={<MyResumesPage />} />


        {/* Build Options */}
        <Route path="/build-option" element={<BuildOption />} />

        {/* Details Collection Routes */}
        <Route
          path="/details/personal-details"
          element={<PersonalDetails />}
        />
        <Route path="/details/work-experience" element={<WorkExperience />} />
        <Route path="/details/languages" element={<Languages />} />
        <Route path="/details/skills" element={<Skills />} />
        <Route path="/details/education" element={<Education />} />
        <Route path="/details/projects" element={<Projects />} />
        <Route path="/details/other" element={<OtherDetails />} />

        {/* Template Routes */}
        <Route path="/template1" element={<Template1 />} />
        <Route path="/template2" element={<Template2 />} />
        <Route path="/template3" element={<Template3 />} />
        <Route path="/template4" element={<Template4 />} />
        <Route path="/template5" element={<Template5 />} />
        <Route path="/template6" element={<Template6 />} />
        <Route path="/template7" element={<Template7 />} />
        <Route path="/template8" element={<Template8 />} />
        <Route path="/template9" element={<Template9 />} />
        <Route path="/template10" element={<Template10 />} />
        <Route path="/template11" element={<Template11 />} />
        <Route path="/template12" element={<Template12 />} />
        <Route path="/template13" element={<Template13 />} />
        <Route path="/template14" element={<Template14 />} />
        <Route path="/template15" element={<Template15 />} />
        <Route path="/template16" element={<Template16 />} />
        <Route path="/template17" element={<Template17 />} />
        <Route path="/template18" element={<Template18 />} />
        <Route path="/template19" element={<Template19 />} />
        <Route path="/template20" element={<Template20 />} />
        <Route path="/template21" element={<Template21 />} />
        <Route path="/template22" element={<Template22 />} />
        <Route path="/template23" element={<Template23 />} />
        <Route path="/template27" element={<Template27 />} />
        <Route path="/template28" element={<Template28 />} />
        <Route path="/template29" element={<Template29 />} />

        {/* Auth routes removed to allow full guest access */}

        {/*  404 Not Found Route  */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
};
export default AppRoutes;
