import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FileText, Edit3, Loader, AlertCircle, Save, Sparkles, ArrowLeft, RefreshCw, CheckCircle } from 'lucide-react';
import Navbar from "../components/Navbar/Navbar.jsx";
import resumeService from "../services/resumeService.js";
import dataService from "../services/dataService.js";
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
  const [currentResumeId, setCurrentResumeId] = useState(null);

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
      setSuccessMessage('✨ Resume successfully enhanced with AI!');

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

  // Save to account function
  const handleSaveToAccount = async () => {
    setIsSaving(true);
    
    try {
      const title = resumeTitle.trim() || `Enhanced Resume - ${new Date().toLocaleDateString()}`;

      // Parse the content and create resume data
      const parsedResumeData = resumeService.parseResumeText(editedContent);
      
      const resumeData = {
        title: title,
        ...parsedResumeData,
        rawText: editedContent,
        templateId: 1 // Default template for uploaded resumes
      };

      // Use dataService to save (handles both guest and authenticated users)
      const result = await dataService.saveResume(resumeData);
      
      if (result.success) {
        setCurrentResumeId(result.data.id);
        setSuccessMessage(`✅ Resume "${title}" saved to My Resumes!`);
        setTimeout(() => setSuccessMessage(''), 3000);
      } else {
        throw new Error(result.error || 'Failed to save resume');
      }
    } catch (err) {
      console.error('Save error:', err);
      setError('Failed to save resume: ' + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="mb-6 flex items-center text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          <span className="font-medium">Back</span>
        </button>

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Edit Your Resume
          </h1>
          <p className="text-lg text-gray-600">
            Enhance your resume with AI or edit it manually
          </p>
        </div>

        {/* Single Column Layout */}
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Editor Section */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <Edit3 className="mr-3 text-gray-600" size={24} />
              Resume Content
            </h2>

            <textarea
              value={editedContent}
              onChange={handleManualEdit}
              placeholder="Your resume content will appear here..."
              className="w-full h-64 p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 resize-none font-mono text-sm"
            />

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3 mt-4">
              <button
                onClick={enhanceWithAI}
                disabled={isProcessing || !editedContent.trim()}
                className="flex items-center px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isProcessing ? (
                  <Loader className="animate-spin mr-2" size={16} />
                ) : (
                  <Sparkles className="mr-2" size={16} />
                )}
                {isProcessing ? 'Enhancing...' : 'Enhance with AI'}
              </button>

              <button
                onClick={resetToOriginal}
                disabled={!hasBeenEnhanced}
                className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <RefreshCw className="mr-2" size={16} />
                Reset to Original
              </button>
            </div>
          </div>

          {/* Save Section */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Save to My Resumes
            </h3>
            
            <div className="flex gap-4">
              <input
                type="text"
                value={resumeTitle}
                onChange={(e) => setResumeTitle(e.target.value)}
                placeholder="Enter resume title..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
              />

              <button
                onClick={handleSaveToAccount}
                disabled={isSaving || !editedContent.trim()}
                className="flex items-center px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isSaving ? (
                  <Loader className="animate-spin mr-2" size={16} />
                ) : (
                  <Save className="mr-2" size={16} />
                )}
                {isSaving ? 'Saving...' : 'Save to Account'}
              </button>
            </div>
          </div>

          {/* Status Messages */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start space-x-3">
              <AlertCircle className="text-red-500 mt-0.5" size={20} />
              <div>
                <h4 className="font-medium text-red-800">Error</h4>
                <p className="text-sm text-red-600 mt-1">{error}</p>
              </div>
            </div>
          )}

          {successMessage && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-start space-x-3">
              <CheckCircle className="text-green-500 mt-0.5" size={20} />
              <div>
                <h4 className="font-medium text-green-800">Success</h4>
                <p className="text-sm text-green-600 mt-1">{successMessage}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResumeEditPage;