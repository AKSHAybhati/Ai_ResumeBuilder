import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { extractTextFromPDF } from "../utils/pdftotext.js";
import { Upload, FileText, Edit3, Download, Eye, AlertCircle } from 'lucide-react';
import Navbar from "../components/Navbar/Navbar.jsx";

const ResumeUploadPage = () => {  
   const navigate = useNavigate();
  const [uploadedFile, setUploadedFile] = useState(null);
  const [resumeContent, setResumeContent] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  const readFileContent = async (file) => {
    const fileType = file.type;
    const fileName = file.name.toLowerCase();

    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (e) => {
        try {
          if (fileType === 'text/plain' || fileName.endsWith('.txt')) {
            // Handle plain text files
            resolve(e.target.result);
            
          } else if (fileType === 'application/pdf' || fileName.endsWith('.pdf')) {
            // For PDF files, show a message with file info
            resolve(`PDF DOCUMENT UPLOADED: ${file.name}

Thank you for uploading your PDF resume. The content has been successfully received.

File Details:
📄 Name: ${file.name}
📊 Size: ${(file.size / 1024 / 1024).toFixed(2)} MB
📅 Last Modified: ${new Date(file.lastModified).toLocaleDateString()}
🔖 Type: PDF Document

Your resume is ready for AI enhancement! Click the "AI Enhance" button below to:
✨ Improve formatting and structure
🎯 Optimize content for ATS systems
💼 Enhance professional language
📈 Highlight key achievements
🔧 Fix grammar and consistency

Note: PDF content cannot be displayed as editable text, but our AI can still 
process and enhance your resume based on the uploaded file.`);

          } else if (fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || fileName.endsWith('.docx')) {
            // For DOCX files, show processing message
            resolve(`WORD DOCUMENT UPLOADED: ${file.name}

Your Word document has been successfully uploaded and is ready for processing.

File Details:
📄 Name: ${file.name}
📊 Size: ${(file.size / 1024 / 1024).toFixed(2)} MB
📅 Last Modified: ${new Date(file.lastModified).toLocaleDateString()}
🔖 Type: Microsoft Word Document (.docx)

What's Next:
✅ File uploaded successfully
🔄 Ready for AI enhancement
📝 Content will be processed and optimized
🚀 Get an improved, professional resume

Click "AI Enhance" to:
• Improve overall structure and formatting
• Optimize keywords for job applications
• Enhance professional language and tone
• Ensure ATS (Applicant Tracking System) compatibility
• Add impactful action verbs and metrics

Your resume will be transformed into a powerful job-winning document!`);

          } else if (fileType === 'application/msword' || fileName.endsWith('.doc')) {
            // For older DOC files
            resolve(`LEGACY WORD DOCUMENT: ${file.name}

Your legacy Word document (.doc) has been uploaded successfully.

File Details:
📄 Name: ${file.name}
📊 Size: ${(file.size / 1024 / 1024).toFixed(2)} MB
📅 Last Modified: ${new Date(file.lastModified).toLocaleDateString()}
🔖 Type: Microsoft Word Document (Legacy Format)

📋 Recommendation: For better compatibility and enhanced features, 
consider converting your resume to .docx format or PDF.

✨ AI Enhancement Available:
Even with legacy format, our AI can help improve your resume:
• Professional formatting optimization
• Content structure enhancement
• Keyword optimization for ATS systems
• Grammar and language improvements
• Achievement highlighting

Click "AI Enhance" to upgrade your resume!`);

          } else {
            reject(new Error('Unsupported file format. Please upload PDF, DOC, DOCX, or TXT files.'));
          }
        } catch (error) {
          reject(new Error(`Failed to process file: ${error.message}`));
        }
      };

      reader.onerror = () => {
        reject(new Error('Failed to read the file. Please try again.'));
      };

      // Read as text for plain text files, as array buffer for others
      if (fileType === 'text/plain' || fileName.endsWith('.txt')) {
        reader.readAsText(file);
      } else {
        reader.readAsArrayBuffer(file);
      }
    });
  };

  const handleFileSelect = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file size (50MB limit)
    if (file.size > 50 * 1024 * 1024) {
      setError('File size exceeds 50MB limit. Please choose a smaller file.');
      return;
    }

    // Validate file type
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain'
    ];
    
    const allowedExtensions = ['.pdf', '.doc', '.docx', '.txt'];
    const fileName = file.name.toLowerCase();
    const hasValidExtension = allowedExtensions.some(ext => fileName.endsWith(ext));
    
    if (!allowedTypes.includes(file.type) && !hasValidExtension) {
      setError('Invalid file type. Please upload PDF, DOC, DOCX, or TXT files only.');
      return;
    }

    setError('');
    setUploadedFile(file);
    setIsProcessing(true);
    
    try {
      const content = await readFileContent(file);
      setResumeContent(content);
      setShowPreview(true);
      navigate('/edit-resume', { state: { file: file, content: content } });


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

  const enhanceWithAI = async () => {
if (!uploadedFile) return;
 setIsProcessing(true);
 setError(''); // Clear previous errors

 try {
 // FormData object banaya file bhej ne ke liye
const formData = new FormData();
 // 'resumeFile' key ka naam backend (multer) se match hona chahiye
 formData.append('resumeFile', uploadedFile);

// Backend pe bhejo
 const res = await fetch("http://localhost:5000/api/enhance", {
 method: "POST",
// 'Content-Type' header yahan manually mat likho, browser khud set kar dega
// 'body' mein FormData object daalo
 body: formData,
 });

 if (!res.ok) {
 throw new Error('Server returned an error: ' + res.status);
}

 const result = await res.json();
setResumeContent(result.enhanced || "No enhancement received.");
 } catch (err) {
 setError("AI Enhance failed. " + (err.message || ""));
 }
 setIsProcessing(false);
 };

/*  const enhanceWithAI = async () => {
    if (!uploadedFile) return;
    setIsProcessing(true);
    try {
      // 1. PDF se text nikaalo
      let pdfText = "";
      if (uploadedFile.type === "application/pdf") {
        pdfText = await extractTextFromPDF(uploadedFile);
      } else {
        pdfText = resumeContent; // For txt/doc/docx, use existing content
      }

      // 2. Backend pe bhejo
      //const res = await fetch("/api/enhance", {
      const res = await fetch("http://localhost:5000/api/enhance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          section: "full_resume",
          data: pdfText,
        }),
      });
      const result = await res.json();
      setResumeContent(result.enhanced || "No enhancement received.");
    } catch (err) {
      setError("AI Enhance failed. " + (err.message || ""));
    }
    setIsProcessing(false);
  };*/

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #f97316 0%, #10b981 100%)' }}>
      {/* Import Navbar with UptoSkills theme */}
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Upload Section */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                <Upload className="mr-3 text-emerald-500" size={28} />
                Upload Your Resume
              </h2>
              
              {/* Upload Area */}
              <div 
                className="border-2 border-dashed border-emerald-300 rounded-lg p-8 text-center hover:border-emerald-500 transition-colors cursor-pointer bg-emerald-50/30"
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
                
                <div className="space-y-4">
                  <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto">
                    <FileText className="text-white" size={32} />
                  </div>
                  
                  <div>
                    <p className="text-lg font-semibold text-gray-700 mb-2">
                      Drop files anywhere to upload
                    </p>
                    <p className="text-gray-500 mb-4">or</p>
                    
                    <button className="bg-gradient-to-r from-orange-500 to-emerald-500 text-white px-8 py-3 rounded-lg font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-200">
                      Select Files
                    </button>
                  </div>
                  
                  <p className="text-sm text-gray-400">
                    Upload limit: 50 MB
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

              {uploadedFile && !error && (
                <div className="mt-6 p-4 bg-emerald-50 border border-emerald-200 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <FileText className="text-emerald-600" size={20} />
                      <span className="font-medium text-emerald-800">{uploadedFile.name}</span>
                    </div>
                    <span className="text-sm text-emerald-600">
                      {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                    </span>
                  </div>
                </div>
              )}

              {/* Processing Indicator */}
              {isProcessing && (
                <div className="mt-6 text-center">
                  <div className="inline-flex items-center space-x-2 text-emerald-600">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-emerald-600"></div>
                    <span>Reading and processing your resume...</span>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              {showPreview && !isProcessing && (
                <div className="mt-6 flex space-x-4">
                  <button 
                    onClick={enhanceWithAI}
                    className="flex-1 bg-gradient-to-r from-orange-500 to-emerald-500 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center justify-center"
                  >
                    <Edit3 className="mr-2" size={20} />
                    AI Enhance
                  </button>
                  <button className="px-6 py-3 border-2 border-emerald-500 text-emerald-600 rounded-lg font-semibold hover:bg-emerald-50 transition-colors flex items-center">
                    <Download className="mr-2" size={20} />
                    Download
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Preview Section */}
          <div className="space-y-6">
            {showPreview && (
              <div className="bg-white rounded-xl shadow-lg border border-gray-200">
                <div className="p-6 border-b border-gray-200">
                  <h3 className="text-xl font-bold text-gray-800 flex items-center">
                    <Eye className="mr-3 text-emerald-500" size={24} />
                    Resume Preview
                  </h3>
                </div>
                
                {/* Resume Content */}
                <div className="p-6">
                  <div className="border-2 border-gray-300 rounded-lg bg-white shadow-inner" style={{ aspectRatio: '8.5/11' }}>
                    <div className="p-6 h-full overflow-y-auto">
                      {/* PDF Preview */}
                      {uploadedFile && uploadedFile.type === "application/pdf" && (
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
                        {resumeContent}
                      </pre>
                    </div>
                  </div>
                  
                  <div className="mt-4 text-center text-sm text-gray-500">
                    Page 1 of 1 • Standard Letter Size (8.5" × 11")
                  </div>
                </div>
              </div>
            )}
            
            {!showPreview && (
              <div className="bg-white rounded-xl shadow-lg p-8 text-center border border-gray-200">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileText className="text-gray-400" size={48} />
                </div>
                <h3 className="text-xl font-semibold text-gray-600 mb-2">No Resume Uploaded</h3>
                <p className="text-gray-500">Upload your resume to see the preview here</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumeUploadPage;