import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { parseResumeFile, validateResumeFile } from "../utils/fileParser";
import { Upload, FileText, Edit3, Download, Eye, AlertCircle, CheckCircle, Loader2 } from 'lucide-react';
import Navbar from "../components/Navbar/Navbar.jsx";

import { useAuth } from "../context/AuthContext.jsx";
import { toast } from 'react-toastify';

const ResumeUploadPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [uploadedFile, setUploadedFile] = useState(null);
  const [resumeContent, setResumeContent] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [error, setError] = useState('');
  const [warnings, setWarnings] = useState([]);
  const [parsedData, setParsedData] = useState(null);
  const fileInputRef = useRef(null);

  // Enhanced file handling with immediate parsing, auto-save, and redirect
  const handleFileSelect = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Clear previous state
    setError('');
    setWarnings([]);
    setParsedData(null);

    // Validate file
    const validation = validateResumeFile(file);
    if (!validation.isValid) {
      setError(validation.errors.join(' '));
      return;
    }

    // Set warnings if any
    if (validation.warnings.length > 0) {
      setWarnings(validation.warnings);
    }

    setUploadedFile(file);
    setIsProcessing(true);

    try {
      // Parse file content immediately
      const parsed = await parseResumeFile(file);
      setParsedData(parsed);
      setResumeContent(parsed.content);
      setShowPreview(true);

      // No auto-save - user will save manually in edit page

      // Automatically redirect to edit page with parsed data
      setTimeout(() => {
        navigate('/edit-resume', {
          state: {
            file: file,
            content: parsed.content,
            parsedData: parsed,
            originalFile: file
          }
        });
      }, 1000); // Quick redirect for better UX

    } catch (error) {
      setError(error.message);
      setShowPreview(false);
    } finally {
      setIsProcessing(false);
    }
  };


  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      // Create a synthetic event object for handleFileSelect
      const syntheticEvent = {
        target: { files: [file] }
      };
      handleFileSelect(syntheticEvent);
    }
  };


  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8 px-4">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
            Upload Your Resume
          </h1>
          <p className="text-base sm:text-lg text-gray-600">
            Upload your existing resume and we'll help you enhance it with AI
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
          {/* Upload Section */}
          <div className="space-y-4 sm:space-y-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 sm:mb-6 flex items-center">
                <Upload className="mr-2 sm:mr-3 text-gray-600" size={20} />
                <span className="text-base sm:text-xl">Upload File</span>
              </h2>

              {/* Upload Area */}
              <div
                className="border-2 border-dashed border-gray-300 rounded-lg p-4 sm:p-6 lg:p-8 text-center hover:border-gray-400 transition-colors cursor-pointer bg-gray-50"
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onClick={handleBrowseClick}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileSelect}
                  className="hidden"
                />

                <div className="space-y-3 sm:space-y-4">
                  <div className="w-12 sm:w-16 h-12 sm:h-16 bg-gray-900 rounded-full flex items-center justify-center mx-auto">
                    <FileText className="text-white" size={24} />
                  </div>

                  <div>
                    <p className="text-base sm:text-lg font-semibold text-gray-700 mb-2">
                      Drop files anywhere to upload
                    </p>
                    <p className="text-sm sm:text-base text-gray-500 mb-3 sm:mb-4">or</p>

                    <button className="bg-gray-900 text-white px-4 sm:px-6 lg:px-8 py-2 sm:py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors text-sm sm:text-base">
                      Select Files
                    </button>
                  </div>

                  <p className="text-xs sm:text-sm text-gray-500">
                    Upload limit: 50 MB • Supports PDF, DOC, DOCX
                  </p>
                </div>
              </div>

              {/* Error Display */}
              {error && (
                <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start space-x-3">
                  <AlertCircle className="text-red-500 mt-0.5" size={20} />
                  <div>
                    <h4 className="font-medium text-red-800">Upload Error</h4>
                    <p className="text-sm text-red-600 mt-1">{error}</p>
                  </div>
                </div>
              )}

              {/* Warnings Display */}
              {warnings.length > 0 && (
                <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-start space-x-3">
                    <AlertCircle className="text-yellow-600 mt-0.5" size={20} />
                    <div>
                      <h4 className="font-medium text-yellow-800">Notice</h4>
                      {warnings.map((warning, index) => (
                        <p key={index} className="text-sm text-yellow-700 mt-1">{warning}</p>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Success Display */}
              {uploadedFile && !error && parsedData && (
                <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="text-green-600" size={20} />
                      <div>
                        <span className="font-medium text-green-800">{uploadedFile.name}</span>
                        <p className="text-sm text-emerald-600">
                          Successfully parsed • Redirecting to edit page...
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-emerald-600">
                        {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Processing Indicator */}
              {isProcessing && (
                <div className="mt-6 text-center">
                  <div className="inline-flex items-center space-x-2 text-emerald-600">
                    <Loader2 className="animate-spin" size={20} />
                    <span>Parsing your resume and preparing for editing...</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Preview Section */}
          <div className="space-y-6">
            {showPreview && parsedData && (
              <div className="bg-white rounded-xl shadow-lg border border-gray-200">
                <div className="p-6 border-b border-gray-200">
                  <h3 className="text-xl font-bold text-gray-800 flex items-center">
                    <Eye className="mr-3 text-emerald-500" size={24} />
                    Resume Preview
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    File Type: {parsedData.fileType.toUpperCase()} • Ready for editing
                  </p>
                </div>

                {/* Resume Content */}
                <div className="p-6">
                  <div className="border-2 border-gray-300 rounded-lg bg-white shadow-inner" style={{ aspectRatio: '8.5/11' }}>
                    <div className="p-6 h-full overflow-y-auto">
                      {/* PDF Preview */}
                      {parsedData.fileType === 'pdf' && (
                        <iframe
                          src={URL.createObjectURL(uploadedFile)}
                          width="100%"
                          height="600px"
                          title="PDF Preview"
                          style={{ border: "1px solid #ccc", borderRadius: "8px", marginBottom: "16px" }}
                        />
                      )}
                      {/* Text Preview */}
                      <pre className="whitespace-pre-wrap text-sm text-gray-800 font-mono leading-relaxed">
                        {parsedData.content}
                      </pre>
                    </div>
                  </div>

                  <div className="mt-4 text-center text-sm text-gray-500">
                    Parsed content ready for AI enhancement and manual editing
                  </div>
                </div>
              </div>
            )}

            {!showPreview && (
              <div className="bg-white rounded-xl shadow-lg p-8 text-center border border-gray-200">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileText className="text-gray-400" size={48} />
                </div>
                <h3 className="text-xl font-semibold text-gray-600 mb-2">Upload Your Resume</h3>
                <p className="text-gray-500">Upload your resume to see the preview and start editing</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumeUploadPage;