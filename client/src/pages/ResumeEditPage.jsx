import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FileText, Edit3, Loader, AlertCircle, Download, Share2, Save, Sparkles, ArrowLeft, RefreshCw, CheckCircle, Eye, FileDown } from 'lucide-react';
import Navbar from "../components/Navbar/Navbar.jsx";

const ResumeEditPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { file, content, parsedData, originalFile } = location.state || {};

  const [editedContent, setEditedContent] = useState(content || '');
  const [originalContent, setOriginalContent] = useState(content || '');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [hasBeenEnhanced, setHasBeenEnhanced] = useState(false);

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
      const res = await fetch('http://localhost:8000/api/enhance', {
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
        throw new Error(`Server error: ${res.status}`);
      }

      const result = await res.json();
      const enhancedText = (result.enhanced || '')
        .replace(/\*/g, '')
        .trim();

      setEditedContent(enhancedText);
      setHasBeenEnhanced(true);
      setSuccessMessage('✨ Resume successfully enhanced with AI! Your content has been optimized for ATS compatibility and professional presentation.');

      // Clear success message after 5 seconds
      setTimeout(() => setSuccessMessage(''), 5000);
    } catch (err) {
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

  // ---- BUTTON HANDLERS ----
  const handleSave = () => {
    localStorage.setItem("resumeContent", editedContent);
    alert("✅ Resume saved locally!");
  };

  const handleDownload = async () => {
    try {
      // Simple PDF generation using html2pdf
      const html2pdf = (await import('html2pdf.js')).default;

      // Create a simple HTML resume
      const resumeHTML = `
        <div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; line-height: 1.6;">
          <div style="text-align: center; margin-bottom: 30px; border-bottom: 2px solid #00bda6; padding-bottom: 20px;">
            <h1 style="color: #00bda6; margin: 0; font-size: 28px;">${extractName(editedContent)}</h1>
            <div style="margin-top: 10px; color: #666;">
              ${extractContactInfo(editedContent)}
            </div>
          </div>
          <div style="white-space: pre-line; font-size: 14px;">${editedContent}</div>
        </div>
      `;

      const opt = {
        margin: 0.5,
        filename: 'enhanced-resume.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
      };

      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = resumeHTML;
      tempDiv.style.position = 'absolute';
      tempDiv.style.left = '-9999px';
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
        contactInfo += `<p style="margin: 2px 0;">${line}</p>`;
      }
    }

    return contactInfo;
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "My Resume",
          text: editedContent.substring(0, 100) + "...",
        });
      } catch (err) {
        alert("Sharing cancelled.");
      }
    } else {
      navigator.clipboard.writeText(editedContent);
      alert("📋 Resume copied to clipboard!");
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
            <button
              onClick={handleSave}
              className="px-5 py-2 bg-teal-600 text-white rounded-lg font-medium hover:bg-teal-700 transition flex items-center gap-2"
            >
              <Save size={18} /> Save
            </button>
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
          </div>
        </div>

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

          {/* AI Enhance + Reset Buttons */}
          <div className="flex justify-center gap-4 mb-8">
            <button
              onClick={enhanceWithAI}
              disabled={isProcessing}
              className="flex-1 bg-gradient-to-r from-teal-500 to-orange-500 text-white py-3 rounded-xl font-semibold shadow-md hover:shadow-xl hover:scale-105 transition-all flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isProcessing ? (
                <Loader className="animate-spin mr-2" size={22} />
              ) : (
                <Sparkles className="mr-2" size={22} />
              )}
              {isProcessing ? 'Enhancing...' : '✨ AI Enhance Resume'}
            </button>

            {hasBeenEnhanced && (
              <button
                onClick={resetToOriginal}
                className="px-6 py-3 bg-gray-600 text-white rounded-xl font-semibold shadow-md hover:shadow-lg hover:scale-105 transition-all flex items-center justify-center"
              >
                <RefreshCw className="mr-2" size={20} />
                Reset to Original
              </button>
            )}
          </div>

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
                <Sparkles className="mr-2 text-teal-400" size={24} />
                AI Generated Resume
              </h3>

              {/* Resume Preview */}
              <div className="bg-white border border-gray-600 rounded-xl shadow-lg overflow-hidden h-[700px]">
                <div className="h-full overflow-y-auto p-6">
                  <div style={{ fontFamily: 'Arial, sans-serif', lineHeight: '1.6', fontSize: '14px' }}>
                    <div style={{ textAlign: 'center', marginBottom: '30px', borderBottom: '2px solid #00bda6', paddingBottom: '20px' }}>
                      <h1 style={{ color: '#00bda6', margin: '0 0 10px 0', fontSize: '28px', fontWeight: 'bold' }}>
                        {extractName(editedContent)}
                      </h1>
                      <div style={{ color: '#666', fontSize: '14px' }}>
                        {extractContactInfo(editedContent)}
                      </div>
                    </div>
                    <div style={{ whiteSpace: 'pre-line', fontSize: '14px', lineHeight: '1.6' }}>
                      {editedContent}
                    </div>
                  </div>
                </div>
              </div>

              <p className="text-xs text-gray-400 mt-2">
                ✨ This shows your AI-enhanced resume with professional formatting and ATS optimization
              </p>
            </div>

            {/* Preview Panel */}
            <div className="flex flex-col">
              <h3 className="text-xl font-bold text-white mb-3 flex items-center">
                <Eye className="mr-2 text-orange-400" size={24} />
                Original Uploaded PDF
              </h3>
              {isPDF ? (
                <div className="bg-gray-900/50 border border-gray-600 rounded-xl shadow-lg overflow-hidden h-[700px]">
                  <iframe
                    src={URL.createObjectURL(file)}
                    title="Resume Preview"
                    className="w-full h-full border-none"
                  />
                </div>
              ) : (
                <div className="bg-gray-900/50 border border-gray-600 rounded-xl shadow-lg overflow-hidden h-[700px]">
                  <div className="p-6 h-full overflow-y-auto">
                    <pre className="whitespace-pre-wrap text-sm text-gray-200 font-mono leading-relaxed">
                      {originalContent}
                    </pre>
                  </div>
                </div>
              )}
              <p className="text-xs text-gray-400 mt-2">
                📄 This shows your original uploaded PDF for reference and comparison
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumeEditPage;