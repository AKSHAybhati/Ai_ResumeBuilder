// src/routes/AppRoutes.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';

  // Home 
import Home from "../pages/Home.jsx"

  // Login 
import Login from "../pages/auth/Login.jsx"
import SignUp from "../pages/auth/Signup.jsx"

  // Main TemplatePage
import TemplatePage from '../pages/TemplatePage.jsx';

  // ResumeTemplates
import Template1 from "../components/ai-resume-templates/Template1.jsx";
import Template2 from '../components/ai-resume-templates/Template2.jsx';
import Template3 from '../components/ai-resume-templates/Template3.jsx';
import Template4 from '../components/ai-resume-templates/Template4.jsx';
import Template5 from '../components/ai-resume-templates/Template5.jsx';

// Not Found
import NotFound from "../pages/NotFound.jsx";

const AppRoutes = () => {
  return (
    <Routes>
  {/* Public Routes */}
  <Route path='/' element={<Home />} />
  <Route path='/templatepage' element={<TemplatePage />} />

          <Route  path='/' element={<Home />} />
          <Route  path='/template1' element={<Template1 />} />
          <Route  path='/template2' element={<Template2/>} />
          <Route  path='/template3' element={<Template3 />} />
          <Route  path='/template4' element={<Template4 />} />
          <Route  path='/template5' element={<Template5 />} />

          {/* Login and Signup */}
          <Route exact path='/Login' element={<Login/>} />
          <Route exact path='/SignUp' element={<SignUp/>} />
         

          {/*  404 Not Found Route  */}
  <Route path='*' element={<NotFound />} />
</Routes>
  );
};
export default AppRoutes;      