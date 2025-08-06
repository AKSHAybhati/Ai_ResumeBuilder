
import React, { useState, useRef } from 'react';
import { Upload, FileText, Edit3, Download, Eye, AlertCircle } from 'lucide-react';
import Navbar from "../components/Navbar/Navbar.jsx";

const ResumeUploadPage = () => {
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

  const enhanceWithAI = () => {
    setIsProcessing(true);
    // Simulate AI enhancement
    setTimeout(() => {
      setResumeContent(`🚀 AI-ENHANCED PROFESSIONAL RESUME

ALEX JOHNSON
Senior Full-Stack Developer & Technical Lead
📧 alex.johnson@email.com | 📱 (555) 987-6543 | 💼 linkedin.com/in/alexjohnson | 🌐 github.com/alexjohnson

═══════════════════════════════════════════════════════════════════════════════════

EXECUTIVE SUMMARY
Results-driven Senior Full-Stack Developer with 6+ years of comprehensive experience in designing, 
developing, and deploying scalable web applications. Proven expertise in leading cross-functional 
teams, implementing cutting-edge technologies, and delivering solutions that drive business growth. 
Specialized in React.js, Node.js, cloud architecture, and agile methodologies with a track record 
of improving system performance by 45% and reducing development costs by $300K annually.

═══════════════════════════════════════════════════════════════════════════════════

CORE COMPETENCIES & TECHNICAL EXPERTISE

💻 Programming Languages: JavaScript (ES6+), TypeScript, Python, Java, SQL, HTML5, CSS3
🎨 Frontend Technologies: React.js, Angular, Vue.js, Next.js, Tailwind CSS, Material-UI, Bootstrap
⚙️ Backend Development: Node.js, Express.js, Django, Spring Boot, RESTful APIs, GraphQL, Microservices
🗄️ Database Management: MongoDB, PostgreSQL, MySQL, Redis, DynamoDB, Database Optimization
☁️ Cloud & DevOps: AWS (EC2, S3, Lambda, RDS), Docker, Kubernetes, CI/CD Pipelines, Jenkins
🔧 Development Tools: Git, GitHub Actions, Webpack, Jest, Cypress, Postman, Jira, Agile/Scrum

═══════════════════════════════════════════════════════════════════════════════════

PROFESSIONAL EXPERIENCE

🏢 SENIOR FULL-STACK DEVELOPER & TECH LEAD | TechCorp Solutions | Jan 2022 - Present
• Spearheaded development of enterprise-grade microservices platform serving 150,000+ active users
• Architected and implemented scalable cloud infrastructure reducing server costs by 35% ($200K savings)
• Led cross-functional team of 8 developers, implementing agile methodologies and best practices
• Designed and developed responsive web applications with 99.9% uptime and 2s average load time
• Established automated CI/CD pipelines reducing deployment time from 4 hours to 15 minutes
• Mentored 6 junior developers, improving team productivity by 40% and code quality scores by 30%

💼 FULL-STACK DEVELOPER | InnovateTech Startup | Mar 2020 - Dec 2021
• Developed 12+ responsive web applications using React.js, Node.js, and MongoDB tech stack
• Optimized database queries and implemented caching strategies, improving performance by 60%
• Integrated 15+ third-party APIs including payment gateways, authentication systems, and analytics
• Collaborated with UI/UX teams to deliver pixel-perfect, mobile-first responsive designs
• Implemented comprehensive testing suites achieving 85% code coverage and reducing bugs by 50%
• Participated in daily standups, sprint planning, and retrospectives in fast-paced startup environment

🚀 SOFTWARE DEVELOPER | DevSolutions Inc. | Jun 2018 - Feb 2020
• Built and maintained 8+ client-facing web applications using modern JavaScript frameworks
• Developed RESTful APIs serving 10,000+ daily requests with sub-200ms response times
• Implemented security best practices including JWT authentication, data encryption, and OWASP guidelines
• Collaborated with product managers to translate business requirements into technical solutions
• Contributed to open-source projects and maintained 95% client satisfaction rating

═══════════════════════════════════════════════════════════════════════════════════

EDUCATION & CERTIFICATIONS

🎓 Bachelor of Science in Computer Science | University of Technology | 2018
   Magna Cum Laude | GPA: 3.8/4.0 | Relevant Coursework: Data Structures, Algorithms, Software Engineering

📜 PROFESSIONAL CERTIFICATIONS:
• AWS Certified Solutions Architect - Professional (2024)
• Google Cloud Professional Developer (2023)
• Microsoft Azure Developer Associate (2023)
• Certified Scrum Master (CSM) (2022)
• MongoDB Certified Developer (2021)

═══════════════════════════════════════════════════════════════════════════════════

KEY ACHIEVEMENTS & PROJECTS

🏆 Led digital transformation initiative resulting in 45% performance improvement and $300K cost reduction
🏆 Architected microservices platform that scaled from 10K to 150K users without performance degradation
🏆 Published 5+ technical articles on Medium with 25,000+ total reads and 500+ followers
🏆 Speaker at 3 regional tech conferences on "Modern Web Architecture" and "Cloud-Native Development"
🏆 Open-source contributor with 2,000+ GitHub stars across multiple repositories
🏆 Reduced application bundle size by 40% through code splitting and optimization techniques

═══════════════════════════════════════════════════════════════════════════════════

ADDITIONAL INFORMATION

🌟 Languages: English (Native), Spanish (Conversational)
🌟 Interests: Contributing to open-source projects, tech blogging, mentoring developers
🌟 Volunteer: Code mentor for underrepresented communities in tech
🌟 Available for: Full-time positions, contract work, technical consulting

═══════════════════════════════════════════════════════════════════════════════════

✨ This resume has been optimized for ATS systems and enhanced with AI for maximum impact! ✨`);
      setIsProcessing(false);
    }, 3000);
  };

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