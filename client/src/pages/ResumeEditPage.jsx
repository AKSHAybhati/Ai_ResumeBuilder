import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FileText, Edit3, Loader, AlertCircle, Download, Share2, Save, Sparkles, ArrowLeft, RefreshCw, CheckCircle, Eye, FileDown, Database, List } from 'lucide-react';
import { toast } from 'react-toastify';
import Navbar from "../components/Navbar/Navbar.jsx";
import resumeService from "../services/resumeService.js";
import { useAuth } from "../context/AuthContext.jsx";

const ResumeEditPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { file, content, parsedData, originalFile } = location.state || {};

  const [editedContent, setEditedContent] = useState(content || '');
  const [originalContent, setOriginalContent] = useState(content || '');
  const [resumeTitle, setResumeTitle] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [hasBeenEnhanced, setHasBeenEnhanced] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [tempEditContent, setTempEditContent] = useState('');

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleManualEdit = (e) => {
    setEditedContent(e.target.value);
  };

  // Enhanced AI enhancement function
  const enhanceWithAI = async () => {
    if (!editedContent.trim()) {
      setError('No content to enhance. Please type or paste resume text.');
      return;
    }

    setIsProcessing(true);
    setError('');
    setSuccessMessage('');

    try {
      
      const res = await fetch('http://localhost:5000/api/enhance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          section: "full_resume",
          data: editedContent,
        }),
      });

      if (!res.ok) {
        const errorText = await res.text();
        console.error('❌ Server error response:', errorText);
        throw new Error(`Server error: ${res.status} - ${errorText}`);
      }

      const result = await res.json();
      
      if (!result.enhanced) {
        throw new Error('No enhanced content received from AI');
      }

      const enhancedText = result.enhanced
        .replace(/\*/g, '')
        .trim();

      if (!enhancedText) {
        throw new Error('AI returned empty enhanced content');
      }

      setEditedContent(enhancedText);
      setHasBeenEnhanced(true);
      setSuccessMessage('✨ Resume successfully enhanced with AI! Your content has been optimized for ATS compatibility and professional presentation.');

      // Clear success message after 5 seconds
      setTimeout(() => setSuccessMessage(''), 5000);
    } catch (err) {
      console.error('❌ AI Enhancement error:', err);
      setError('AI Enhancement failed: ' + (err.message || 'Please try again later.'));
    } finally {
      setIsProcessing(false);
    }
  };

  // Reset to original content
  const resetToOriginal = () => {
    setEditedContent(originalContent);
    setHasBeenEnhanced(false);
    setSuccessMessage('');
    setError('');
  };

  // Manual editing functions
  const handleEditModeToggle = () => {
    if (!isEditMode) {
      setTempEditContent(editedContent);
    }
    setIsEditMode(!isEditMode);
    setError('');
    setSuccessMessage('');
  };

  const handleManualEditChange = (e) => {
    setTempEditContent(e.target.value);
  };

  const handleSaveEdit = () => {
    setEditedContent(tempEditContent);
    setIsEditMode(false);
    setSuccessMessage('✅ Manual edits saved successfully!');
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const handleCancelEdit = () => {
    setTempEditContent(editedContent);
    setIsEditMode(false);
    setError('');
    setSuccessMessage('');
  };

  // ---- BUTTON HANDLERS ----
  const handleSave = async () => {
    if (!isAuthenticated) {
      toast.error("Please login to save your resume");
      navigate('/login');
      return;
    }

    setIsSaving(true);
    try {
      const title = resumeTitle.trim() || `Resume - ${new Date().toLocaleDateString()}`;
      const result = await resumeService.saveResume(editedContent, title);
      
      if (result.success) {
        toast.success("✅ Resume saved to your account!");
        setSuccessMessage(`✅ Resume "${title}" saved successfully!`);
        setTimeout(() => setSuccessMessage(''), 3000);
      } else {
        toast.error(result.error || "Failed to save resume");
      }
    } catch (error) {
      toast.error("Failed to save resume. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveLocal = () => {
    localStorage.setItem("resumeContent", editedContent);
    toast.success("✅ Resume saved locally!");
  };

  const handleDownload = async () => {
    try {
      // Simple PDF generation using html2pdf
      const html2pdf = (await import('html2pdf.js')).default;

      // Create a comprehensive HTML resume with proper structure
      const resumeHTML = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>Resume - ${extractName(editedContent)}</title>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body {
              font-family: 'Arial', 'Helvetica', sans-serif;
              background-color: #ffffff;
              color: #333333;
              line-height: 1.6;
              font-size: 14px;
            }
            .resume-container {
              max-width: 800px;
              margin: 0 auto;
              padding: 40px;
              background-color: #ffffff;
            }
            .header {
              text-align: center;
              margin-bottom: 30px;
              border-bottom: 3px solid #00bda6;
              padding-bottom: 20px;
            }
            .name {
              color: #00bda6;
              margin: 0 0 10px 0;
              font-size: 28px;
              font-weight: bold;
              text-transform: uppercase;
              letter-spacing: 1px;
            }
            .contact-info {
              margin-top: 10px;
              color: #666666;
              font-size: 14px;
            }
            .contact-item {
              margin: 3px 0;
              display: block;
            }
            .content {
              font-size: 14px;
              line-height: 1.8;
              color: #333333;
            }
            .section {
              margin-bottom: 20px;
            }
            .section-title {
              font-size: 16px;
              font-weight: bold;
              color: #00bda6;
              margin-bottom: 10px;
              text-transform: uppercase;
              letter-spacing: 1px;
              border-bottom: 1px solid #e0e0e0;
              padding-bottom: 3px;
            }
            .experience-item, .education-item {
              margin-bottom: 15px;
            }
            .job-title, .degree {
              font-weight: bold;
              color: #333333;
              font-size: 15px;
            }
            .company, .school {
              color: #00bda6;
              font-weight: 600;
              font-size: 13px;
            }
            .date {
              color: #666666;
              font-style: italic;
              font-size: 12px;
            }
            .description {
              margin-top: 5px;
              color: #555555;
              font-size: 13px;
            }
            .skills {
              display: flex;
              flex-wrap: wrap;
              gap: 5px;
              margin-top: 8px;
            }
            .skill-tag {
              background-color: #f0f9ff;
              color: #00bda6;
              padding: 3px 8px;
              border-radius: 12px;
              font-size: 11px;
              font-weight: 500;
              border: 1px solid #00bda6;
            }
            ul {
              margin: 8px 0;
              padding-left: 20px;
            }
            li {
              margin-bottom: 3px;
              color: #555555;
              font-size: 13px;
            }
            .summary {
              font-style: italic;
              color: #666666;
              margin-bottom: 15px;
              padding: 12px;
              background-color: #f8f9fa;
              border-left: 3px solid #00bda6;
              font-size: 13px;
            }
            p {
              margin: 5px 0;
              font-size: 13px;
            }
          </style>
        </head>
        <body>
          <div class="resume-container">
            <div class="header">
              <h1 class="name">${extractName(editedContent)}</h1>
              <div class="contact-info">
                ${extractContactInfo(editedContent)}
              </div>
            </div>
            <div class="content">
              ${formatResumeContent(editedContent)}
            </div>
          </div>
        </body>
        </html>
      `;

      const opt = {
        margin: [0.5, 0.5, 0.5, 0.5],
        filename: `resume-${extractName(editedContent).toLowerCase().replace(/\s+/g, '-')}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: {
          scale: 2,
          useCORS: true,
          letterRendering: true,
          allowTaint: true
        },
        jsPDF: {
          unit: 'in',
          format: 'letter',
          orientation: 'portrait',
          compress: true
        }
      };

      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = resumeHTML;
      tempDiv.style.position = 'absolute';
      tempDiv.style.left = '-9999px';
      tempDiv.style.top = '0';
      tempDiv.style.width = '800px';
      tempDiv.style.backgroundColor = '#ffffff';
      document.body.appendChild(tempDiv);

      await html2pdf().set(opt).from(tempDiv).save();
      document.body.removeChild(tempDiv);
    } catch (error) {
      console.error('PDF generation failed:', error);
      // Fallback to text download
      const blob = new Blob([editedContent], { type: "text/plain" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = "resume.txt";
      link.click();
    }
  };

  // Helper functions for PDF generation
  const extractName = (text) => {
    const lines = text.split('\n');
    return lines[0] || 'Your Name';
  };

  const extractContactInfo = (text) => {
    const lines = text.split('\n');
    let contactInfo = '';

    for (let i = 1; i < Math.min(5, lines.length); i++) {
      const line = lines[i].trim();
      if (line && (line.includes('@') || line.includes('+') || line.includes('linkedin') || line.includes('github'))) {
        contactInfo += `<div class="contact-item">${line}</div>`;
      }
    }

    return contactInfo;
  };

  const formatResumeContent = (text) => {
    const lines = text.split('\n');
    let formattedContent = '';
    let currentSection = '';

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();

      if (!line) continue;

      // Check if this is a section header
      const sectionHeaders = [
        'SUMMARY', 'PROFILE', 'OBJECTIVE', 'ABOUT',
        'EXPERIENCE', 'WORK EXPERIENCE', 'EMPLOYMENT',
        'EDUCATION', 'ACADEMIC BACKGROUND',
        'SKILLS', 'TECHNICAL SKILLS', 'CORE COMPETENCIES',
        'PROJECTS', 'PROJECT EXPERIENCE',
        'CERTIFICATIONS', 'CERTIFICATES',
        'ACHIEVEMENTS', 'AWARDS', 'HONORS',
        'LANGUAGES', 'LANGUAGE PROFICIENCY',
        'INTERESTS', 'HOBBIES', 'ACTIVITIES'
      ];

      const isSectionHeader = sectionHeaders.some(header =>
        line.toUpperCase().includes(header) && line.length < 50
      );

      if (isSectionHeader) {
        currentSection = line.toUpperCase();
        formattedContent += `<div class="section">
          <h2 class="section-title">${line}</h2>
        </div>`;
      } else if (currentSection.includes('SUMMARY') || currentSection.includes('PROFILE') || currentSection.includes('OBJECTIVE')) {
        formattedContent += `<div class="summary">${line}</div>`;
      } else if (currentSection.includes('EXPERIENCE') || currentSection.includes('EMPLOYMENT')) {
        // Check if this looks like a job title or company
        if (line.length < 100 && !line.includes('•') && !line.includes('-') && !line.includes('*')) {
          if (i + 1 < lines.length && lines[i + 1].trim()) {
            const nextLine = lines[i + 1].trim();
            if (nextLine.length < 100 && !nextLine.includes('•') && !nextLine.includes('-')) {
              // This is likely a job title and company
              formattedContent += `<div class="experience-item">
                <div class="job-title">${line}</div>
                <div class="company">${nextLine}</div>
              </div>`;
              i++; // Skip the next line as we've processed it
            } else {
              formattedContent += `<div class="job-title">${line}</div>`;
            }
          } else {
            formattedContent += `<div class="job-title">${line}</div>`;
          }
        } else {
          formattedContent += `<div class="description">${line}</div>`;
        }
      } else if (currentSection.includes('EDUCATION')) {
        if (line.length < 100 && !line.includes('•') && !line.includes('-')) {
          formattedContent += `<div class="education-item">
            <div class="degree">${line}</div>
          </div>`;
        } else {
          formattedContent += `<div class="description">${line}</div>`;
        }
      } else if (currentSection.includes('SKILLS')) {
        // Format skills as tags
        const skills = line.split(',').map(skill => skill.trim()).filter(skill => skill);
        if (skills.length > 1) {
          formattedContent += `<div class="skills">
            ${skills.map(skill => `<span class="skill-tag">${skill}</span>`).join('')}
          </div>`;
        } else {
          formattedContent += `<div class="description">${line}</div>`;
        }
      } else {
        // Regular content
        if (line.includes('•') || line.includes('-') || line.includes('*')) {
          formattedContent += `<ul><li>${line.replace(/^[•\-*]\s*/, '')}</li></ul>`;
        } else {
          formattedContent += `<div class="description">${line}</div>`;
        }
      }
    }

    return formattedContent;
  };

  // Display functions for clean formatting in the preview
  const extractContactInfoForDisplay = (text) => {
    const lines = text.split('\n');
    let contactInfo = [];

    for (let i = 1; i < Math.min(5, lines.length); i++) {
      const line = lines[i].trim();
      if (line && (line.includes('@') || line.includes('+') || line.includes('linkedin') || line.includes('github'))) {
        contactInfo.push(line);
      }
    }

    return contactInfo.map((info, index) => (
      <div key={index} style={{ margin: '2px 0' }}>{info}</div>
    ));
  };

  const formatResumeContentForDisplay = (text) => {
    const lines = text.split('\n');
    let currentSection = '';
    let formattedElements = [];

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();

      if (!line) continue;

      // Check if this is a section header
      const sectionHeaders = [
        'SUMMARY', 'PROFILE', 'OBJECTIVE', 'ABOUT',
        'EXPERIENCE', 'WORK EXPERIENCE', 'EMPLOYMENT',
        'EDUCATION', 'ACADEMIC BACKGROUND',
        'SKILLS', 'TECHNICAL SKILLS', 'CORE COMPETENCIES',
        'PROJECTS', 'PROJECT EXPERIENCE',
        'CERTIFICATIONS', 'CERTIFICATES',
        'ACHIEVEMENTS', 'AWARDS', 'HONORS',
        'LANGUAGES', 'LANGUAGE PROFICIENCY',
        'INTERESTS', 'HOBBIES', 'ACTIVITIES'
      ];

      const isSectionHeader = sectionHeaders.some(header =>
        line.toUpperCase().includes(header) && line.length < 50
      );

      if (isSectionHeader) {
        currentSection = line.toUpperCase();
        formattedElements.push(
          <div key={i} style={{ marginBottom: '15px' }}>
            <h2 style={{
              fontSize: '16px',
              fontWeight: 'bold',
              color: '#00bda6',
              marginBottom: '8px',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              borderBottom: '1px solid #e0e0e0',
              paddingBottom: '3px'
            }}>
              {line}
            </h2>
          </div>
        );
      } else if (currentSection.includes('SUMMARY') || currentSection.includes('PROFILE') || currentSection.includes('OBJECTIVE')) {
        formattedElements.push(
          <div key={i} style={{
            fontStyle: 'italic',
            color: '#666',
            marginBottom: '15px',
            padding: '12px',
            backgroundColor: '#f8f9fa',
            borderLeft: '3px solid #00bda6',
            fontSize: '13px'
          }}>
            {line}
          </div>
        );
      } else if (currentSection.includes('EXPERIENCE') || currentSection.includes('EMPLOYMENT')) {
        if (line.length < 100 && !line.includes('•') && !line.includes('-') && !line.includes('*')) {
          if (i + 1 < lines.length && lines[i + 1].trim()) {
            const nextLine = lines[i + 1].trim();
            if (nextLine.length < 100 && !nextLine.includes('•') && !nextLine.includes('-')) {
              formattedElements.push(
                <div key={i} style={{ marginBottom: '10px' }}>
                  <div style={{ fontWeight: 'bold', color: '#333', fontSize: '15px' }}>{line}</div>
                  <div style={{ color: '#00bda6', fontWeight: '600', fontSize: '13px' }}>{nextLine}</div>
                </div>
              );
              i++; // Skip the next line as we've processed it
            } else {
              formattedElements.push(
                <div key={i} style={{ fontWeight: 'bold', color: '#333', fontSize: '15px', marginBottom: '5px' }}>
                  {line}
                </div>
              );
            }
          } else {
            formattedElements.push(
              <div key={i} style={{ fontWeight: 'bold', color: '#333', fontSize: '15px', marginBottom: '5px' }}>
                {line}
              </div>
            );
          }
        } else {
          formattedElements.push(
            <div key={i} style={{ color: '#555', fontSize: '13px', marginBottom: '5px' }}>
              {line}
            </div>
          );
        }
      } else if (currentSection.includes('EDUCATION')) {
        if (line.length < 100 && !line.includes('•') && !line.includes('-')) {
          formattedElements.push(
            <div key={i} style={{ marginBottom: '10px' }}>
              <div style={{ fontWeight: 'bold', color: '#333', fontSize: '15px' }}>{line}</div>
            </div>
          );
        } else {
          formattedElements.push(
            <div key={i} style={{ color: '#555', fontSize: '13px', marginBottom: '5px' }}>
              {line}
            </div>
          );
        }
      } else if (currentSection.includes('SKILLS')) {
        const skills = line.split(',').map(skill => skill.trim()).filter(skill => skill);
        if (skills.length > 1) {
          formattedElements.push(
            <div key={i} style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', marginTop: '8px' }}>
              {skills.map((skill, skillIndex) => (
                <span key={skillIndex} style={{
                  backgroundColor: '#f0f9ff',
                  color: '#00bda6',
                  padding: '3px 8px',
                  borderRadius: '12px',
                  fontSize: '11px',
                  fontWeight: '500',
                  border: '1px solid #00bda6'
                }}>
                  {skill}
                </span>
              ))}
            </div>
          );
        } else {
          formattedElements.push(
            <div key={i} style={{ color: '#555', fontSize: '13px', marginBottom: '5px' }}>
              {line}
            </div>
          );
        }
      } else {
        if (line.includes('•') || line.includes('-') || line.includes('*')) {
          formattedElements.push(
            <ul key={i} style={{ margin: '8px 0', paddingLeft: '20px' }}>
              <li style={{ marginBottom: '3px', color: '#555', fontSize: '13px' }}>
                {line.replace(/^[•\-*]\s*/, '')}
              </li>
            </ul>
          );
        } else {
          formattedElements.push(
            <div key={i} style={{ color: '#555', fontSize: '13px', marginBottom: '5px' }}>
              {line}
            </div>
          );
        }
      }
    }

    return formattedElements;
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "My Resume",
          text: editedContent.substring(0, 100) + "...",
        });
      } catch (err) {
        toast.info("Sharing cancelled.");
      }
    } else {
      navigator.clipboard.writeText(editedContent);
      toast.success("📋 Resume copied to clipboard!");
    }
  };

  if (!file) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <Navbar />
        <div className="flex items-center justify-center min-h-screen">
          <div className="bg-white/80 backdrop-blur-md rounded-2xl p-10 shadow-2xl text-center max-w-md mx-auto border border-gray-200">
            <AlertCircle className="text-red-500 mx-auto mb-4" size={56} />
            <h2 className="text-3xl font-bold mb-3 text-gray-800">Resume Not Found</h2>
            <p className="text-gray-600 text-lg mb-6">Please go back to the upload page and upload a resume.</p>
            <button
              onClick={() => navigate('/ai-edit')}
              className="bg-gradient-to-r from-teal-500 to-orange-500 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-200"
            >
              Go to Upload Page
            </button>
          </div>
        </div>
      </div>
    );
  }

  const isPDF = file && file.type === 'application/pdf';

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Header / Toolbar */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/ai-edit')}
              className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors"
            >
              <ArrowLeft size={20} />
              <span>Back to Upload</span>
            </button>
            <h1 className="text-3xl font-extrabold text-white flex items-center">
              <FileText className="mr-3 text-teal-400" size={32} />
              Resume Editor
            </h1>
          </div>
          <div className="flex space-x-3">
            {isAuthenticated ? (
              <>
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="px-5 py-2 bg-teal-600 text-white rounded-lg font-medium hover:bg-teal-700 transition flex items-center gap-2 disabled:opacity-50"
                >
                  {isSaving ? <Loader className="animate-spin" size={18} /> : <Database size={18} />}
                  {isSaving ? 'Saving...' : 'Save to Account'}
                </button>
                <button
                  onClick={handleSaveLocal}
                  className="px-5 py-2 bg-gray-600 text-white rounded-lg font-medium hover:bg-gray-700 transition flex items-center gap-2"
                >
                  <Save size={18} /> Save Local
                </button>
              </>
            ) : (
              <button
                onClick={handleSaveLocal}
                className="px-5 py-2 bg-teal-600 text-white rounded-lg font-medium hover:bg-teal-700 transition flex items-center gap-2"
              >
                <Save size={18} /> Save Local
              </button>
            )}
            <button
              onClick={handleDownload}
              className="px-5 py-2 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600 transition flex items-center gap-2"
            >
              <FileDown size={18} /> Download PDF
            </button>
            <button
              onClick={handleShare}
              className="px-5 py-2 bg-gray-600 text-white rounded-lg font-medium hover:bg-gray-700 transition flex items-center gap-2"
            >
              <Share2 size={18} /> Share
            </button>
            {isAuthenticated && (
              <button
                onClick={() => navigate('/my-resumes')}
                className="px-5 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition flex items-center gap-2"
              >
                <List size={18} /> My Resumes
              </button>
            )}
          </div>
        </div>

        {/* Resume Title Input (for authenticated users) */}
        {isAuthenticated && (
          <div className="mb-6">
            <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-600">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Resume Title (for saving to your account)
              </label>
              <input
                type="text"
                value={resumeTitle}
                onChange={(e) => setResumeTitle(e.target.value)}
                placeholder={`Resume - ${new Date().toLocaleDateString()}`}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
          </div>
        )}

        {/* Main Card */}
        <div className="bg-gray-800/80 backdrop-blur-md rounded-2xl shadow-2xl p-8 border border-gray-700">

          {/* File Info */}
          {parsedData && (
            <div className="mb-6 p-4 bg-gray-700/50 rounded-lg border border-gray-600">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <FileText className="text-teal-400" size={24} />
                  <div>
                    <h3 className="text-lg font-semibold text-white">{parsedData.fileName}</h3>
                    <p className="text-sm text-gray-300">
                      {parsedData.fileType.toUpperCase()} • {(parsedData.fileSize / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
                {hasBeenEnhanced && (
                  <div className="flex items-center space-x-2 text-green-400">
                    <Sparkles size={20} />
                    <span className="text-sm font-medium">AI Enhanced</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* AI Enhance + Reset + Edit Buttons */}
          <div className="flex justify-center gap-4 mb-8">
            <button
              onClick={enhanceWithAI}
              disabled={isProcessing || isEditMode}
              className="flex-1 bg-gradient-to-r from-teal-500 to-orange-500 text-white py-3 rounded-xl font-semibold shadow-md hover:shadow-xl hover:scale-105 transition-all flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isProcessing ? (
                <Loader className="animate-spin mr-2" size={22} />
              ) : (
                <Sparkles className="mr-2" size={22} />
              )}
              {isProcessing ? 'Enhancing...' : '✨ AI Enhance Resume'}
            </button>

            {hasBeenEnhanced && !isEditMode && (
              <button
                onClick={resetToOriginal}
                className="px-6 py-3 bg-gray-600 text-white rounded-xl font-semibold shadow-md hover:shadow-lg hover:scale-105 transition-all flex items-center justify-center"
              >
                <RefreshCw className="mr-2" size={20} />
                Reset to Original
              </button>
            )}

            {!isEditMode && (
              <button
                onClick={handleEditModeToggle}
                className="px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold shadow-md hover:shadow-lg hover:scale-105 transition-all flex items-center justify-center"
              >
                <Edit3 className="mr-2" size={20} />
                Manual Edit
              </button>
            )}
          </div>

          {/* Manual Edit Mode Controls */}
          {isEditMode && (
            <div className="flex justify-center gap-4 mb-8">
              <button
                onClick={handleSaveEdit}
                className="px-8 py-3 bg-green-600 text-white rounded-xl font-semibold shadow-md hover:shadow-lg hover:scale-105 transition-all flex items-center justify-center"
              >
                <Save className="mr-2" size={20} />
                Save Changes
              </button>
              <button
                onClick={handleCancelEdit}
                className="px-8 py-3 bg-red-600 text-white rounded-xl font-semibold shadow-md hover:shadow-lg hover:scale-105 transition-all flex items-center justify-center"
              >
                <ArrowLeft className="mr-2" size={20} />
                Cancel
              </button>
            </div>
          )}

          {/* Success Message */}
          {successMessage && (
            <div className="mb-6 p-4 bg-green-500/20 border border-green-500/30 rounded-lg">
              <div className="flex items-center space-x-3">
                <CheckCircle className="text-green-400" size={20} />
                <p className="text-green-300 text-sm">{successMessage}</p>
              </div>
            </div>
          )}

          {/* Error Box */}
          {error && (
            <div className="mb-6 p-5 bg-red-500/20 border border-red-500/30 rounded-xl flex items-start space-x-3 shadow-sm">
              <AlertCircle className="text-red-400 mt-0.5" size={22} />
              <div>
                <h4 className="font-semibold text-red-300 text-lg">Enhancement Error</h4>
                <p className="text-sm text-red-200 mt-1">{error}</p>
              </div>
            </div>
          )}

          {/* Two Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">

            {/* AI Generated Resume */}
            <div className="flex flex-col">
              <h3 className="text-xl font-bold text-white mb-3 flex items-center">
                {isEditMode ? (
                  <>
                    <Edit3 className="mr-2 text-blue-400" size={24} />
                    Manual Edit Mode
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 text-teal-400" size={24} />
                    AI Generated Resume
                  </>
                )}
              </h3>

              {isEditMode ? (
                /* Manual Edit Textarea */
                <div className="bg-gray-900/50 border border-gray-600 rounded-xl shadow-lg overflow-hidden h-[700px]">
                  <div className="h-full flex flex-col">
                    <div className="p-4 bg-gray-800/50 border-b border-gray-600">
                      <p className="text-sm text-gray-300">
                        ✏️ Edit your resume content directly. Changes will be reflected in the preview on the right.
                      </p>
                    </div>
                    <textarea
                      value={tempEditContent}
                      onChange={handleManualEditChange}
                      className="flex-1 p-6 bg-transparent text-gray-200 font-mono text-sm leading-relaxed resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter your resume content here..."
                      style={{ fontFamily: 'Arial, sans-serif', lineHeight: '1.6' }}
                    />
                  </div>
                </div>
              ) : (
                /* Resume Preview */
                <div className="bg-white border border-gray-600 rounded-xl shadow-lg overflow-hidden h-[700px]">
                  <div className="h-full overflow-y-auto p-6">
                    <div style={{ fontFamily: 'Arial, sans-serif', lineHeight: '1.6', fontSize: '14px' }}>
                      <div style={{ textAlign: 'center', marginBottom: '30px', borderBottom: '2px solid #00bda6', paddingBottom: '20px' }}>
                        <h1 style={{ color: '#00bda6', margin: '0 0 10px 0', fontSize: '28px', fontWeight: 'bold' }}>
                          {extractName(editedContent)}
                        </h1>
                        <div style={{ color: '#666', fontSize: '14px' }}>
                          {extractContactInfoForDisplay(editedContent)}
                        </div>
                      </div>
                      <div style={{ fontSize: '14px', lineHeight: '1.6' }}>
                        {formatResumeContentForDisplay(editedContent)}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <p className="text-xs text-gray-400 mt-2">
                {isEditMode
                  ? "✏️ Make your changes directly in the text area above"
                  : "✨ This shows your AI-enhanced resume with professional formatting and ATS optimization"
                }
              </p>
            </div>

            {/* Preview Panel */}
            <div className="flex flex-col">
              <h3 className="text-xl font-bold text-white mb-3 flex items-center">
                <Eye className="mr-2 text-orange-400" size={24} />
                {isEditMode ? 'Live Preview' : 'Original Uploaded PDF'}
              </h3>
              {isEditMode ? (
                /* Live Preview of Edits */
                <div className="bg-white border border-gray-600 rounded-xl shadow-lg overflow-hidden h-[700px]">
                  <div className="h-full overflow-y-auto p-6">
                    <div style={{ fontFamily: 'Arial, sans-serif', lineHeight: '1.6', fontSize: '14px' }}>
                      <div style={{ textAlign: 'center', marginBottom: '30px', borderBottom: '2px solid #00bda6', paddingBottom: '20px' }}>
                        <h1 style={{ color: '#00bda6', margin: '0 0 10px 0', fontSize: '28px', fontWeight: 'bold' }}>
                          {extractName(tempEditContent)}
                        </h1>
                        <div style={{ color: '#666', fontSize: '14px' }}>
                          {extractContactInfoForDisplay(tempEditContent)}
                        </div>
                      </div>
                      <div style={{ fontSize: '14px', lineHeight: '1.6' }}>
                        {formatResumeContentForDisplay(tempEditContent)}
                      </div>
                    </div>
                  </div>
                </div>
              ) : isPDF ? (
                /* Original PDF Preview */
                <div className="bg-gray-900/50 border border-gray-600 rounded-xl shadow-lg overflow-hidden h-[700px]">
                  <iframe
                    src={URL.createObjectURL(file)}
                    title="Resume Preview"
                    className="w-full h-full border-none"
                  />
                </div>
              ) : (
                /* Original Text Preview */
                <div className="bg-gray-900/50 border border-gray-600 rounded-xl shadow-lg overflow-hidden h-[700px]">
                  <div className="p-6 h-full overflow-y-auto">
                    <pre className="whitespace-pre-wrap text-sm text-gray-200 font-mono leading-relaxed">
                      {originalContent}
                    </pre>
                  </div>
                </div>
              )}
              <p className="text-xs text-gray-400 mt-2">
                {isEditMode
                  ? "👁️ Live preview of your manual edits - see changes in real-time"
                  : "📄 This shows your original uploaded PDF for reference and comparison"
                }
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumeEditPage;