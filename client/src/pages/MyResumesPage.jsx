import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Edit3, Trash2, Eye, Download, Plus, Loader, Calendar, User } from 'lucide-react';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import Navbar from "../components/Navbar/Navbar.jsx";
import resumeService from "../services/resumeService.js";
import { useAuth } from "../context/AuthContext.jsx";

const MyResumesPage = () => {
  const navigate = useNavigate();
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedResume, setSelectedResume] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  
  // Use auth hook properly
  const { isAuthenticated, user } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    fetchResumes();
  }, [isAuthenticated, navigate]); // fetchResumes is defined below, will be called manually

  const fetchResumes = async () => {
    setLoading(true);
    
    try {
      const result = await resumeService.getUserResumes();
      
      if (result.success) {
        // Ensure result.data is always an array
        const resumesData = Array.isArray(result.data) ? result.data : [];
        setResumes(resumesData);
      } else {
        setResumes([]);
        toast.error(result.error || 'Failed to fetch resumes');
      }
    } catch (err) {
      setResumes([]);
      toast.error('Failed to load resumes');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteResume = async (resumeId) => {
    // Show confirmation toast with action buttons
    toast(
      ({ closeToast }) => (
        <div className="p-2">
          <div className="font-semibold text-gray-800 mb-3">
            Are you sure you want to delete this resume?
          </div>
          <div className="flex space-x-2">
            <button
              onClick={async () => {
                closeToast();
                toast.info('Deleting resume...', { autoClose: 1000 });
                
                try {
                  const result = await resumeService.deleteResume(resumeId);
                  if (result.success) {
                    toast.success('Resume deleted successfully');
                    setResumes(resumes.filter(resume => resume.id !== resumeId));
                  } else {
                    toast.error(result.error || 'Failed to delete resume');
                  }
                } catch (err) {
                  toast.error('Failed to delete resume');
                }
              }}
              className="px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600 transition"
            >
              Delete
            </button>
            <button
              onClick={closeToast}
              className="px-3 py-1 bg-gray-300 text-gray-700 rounded text-sm hover:bg-gray-400 transition"
            >
              Cancel
            </button>
          </div>
        </div>
      ),
      {
        position: "top-center",
        autoClose: false,
        hideProgressBar: true,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        closeButton: false,
      }
    );
  };

  const handleEditResume = (resume) => {
    // Show loading toast
    toast.info('Loading resume for editing...', { autoClose: 1500 });
    
    // Navigate to edit page with existing resume data
    navigate('/edit-resume', {
      state: {
        file: { name: resume.title, type: 'text/plain' },
        content: resume.rawText || resumeService.structuredDataToText(resume),
        parsedData: {
          fileName: resume.title,
          fileType: 'text',
          fileSize: resume.rawText?.length || 0
        },
        isExistingResume: true,
        resumeId: resume.id
      }
    });
  };

  const handleUseInTemplate = (resume) => {
    // Show success toast for template usage
    toast.success(`Using "${resume.title}" data for template creation!`, { 
      autoClose: 2000 
    });
    
    // Navigate to template selection with pre-filled data
    navigate('/templatepage', {
      state: {
        prefilledData: resume,
        resumeText: resume.rawText || resumeService.structuredDataToText(resume)
      }
    });
  };

  const handlePreviewResume = (resume) => {
    toast.info(`Opening preview for "${resume.title}"`, { autoClose: 1500 });
    setSelectedResume(resume);
    setShowPreview(true);
  };

  const downloadResumePDF = async (resume) => {
    // Show loading toast
    const loadingToast = toast.loading(`Preparing "${resume.title}" for download...`);
    
    try {
      const resumeText = resume.rawText || resumeService.structuredDataToText(resume);
      
      // Create a temporary element to trigger download
      const element = document.createElement('div');
      element.innerHTML = resumeText.split('\n').map(line => `<p>${line}</p>`).join('');
      
      const html2pdf = (await import('html2pdf.js')).default;
      await html2pdf().from(element).save(`${resume.title}.pdf`);
      
      // Update loading toast to success
      toast.update(loadingToast, {
        render: `"${resume.title}" downloaded successfully!`,
        type: "success",
        isLoading: false,
        autoClose: 3000
      });
    } catch (err) {
      console.error('Download error:', err);
      // Update loading toast to error
      toast.update(loadingToast, {
        render: `Failed to download "${resume.title}"`,
        type: "error",
        isLoading: false,
        autoClose: 3000
      });
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-20">{/* Added pt-20 for navbar spacing */}
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-white flex items-center">
              <FileText className="mr-3 text-teal-400" size={32} />
              My Resumes
            </h1>
            <p className="text-gray-300 mt-2">
              Manage your saved resumes and use them to create new templates
            </p>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={() => {
                toast.success('Starting AI-powered resume creation! ✨', { autoClose: 2000 });
                navigate('/ai-edit');
              }}
              className="px-6 py-3 bg-teal-600 text-white rounded-lg font-medium hover:bg-teal-700 transition flex items-center gap-2"
            >
              <Plus size={20} />
              Create New Resume
            </button>
            <button
              onClick={() => {
                toast.info('Browse our professional templates! 📋', { autoClose: 2000 });
                navigate('/templatepage');
              }}
              className="px-6 py-3 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600 transition flex items-center gap-2"
            >
              <FileText size={20} />
              Browse Templates
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-600">
            <div className="flex items-center">
              <FileText className="text-teal-400 mr-3" size={24} />
              <div>
                <p className="text-gray-300 text-sm">Total Resumes</p>
                <p className="text-white text-2xl font-bold">{resumes.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-600">
            <div className="flex items-center">
              <User className="text-green-400 mr-3" size={24} />
              <div>
                <p className="text-gray-300 text-sm">Account</p>
                <p className="text-white text-lg font-bold">{user?.name || user?.email}</p>
              </div>
            </div>
          </div>
          <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-600">
            <div className="flex items-center">
              <Calendar className="text-orange-400 mr-3" size={24} />
              <div>
                <p className="text-gray-300 text-sm">Latest Resume</p>
                <p className="text-white text-lg font-bold">
                  {resumes.length > 0 
                    ? new Date(resumes[0].updated_at || resumes[0].created_at).toLocaleDateString()
                    : 'No resumes yet'
                  }
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Resumes Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <Loader className="animate-spin text-teal-400" size={48} />
            <span className="ml-3 text-gray-300 text-lg">Loading your resumes...</span>
          </div>
        ) : resumes.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="mx-auto text-gray-500" size={64} />
            <h3 className="text-xl font-semibold text-gray-300 mt-4">No resumes yet</h3>
            <p className="text-gray-400 mt-2">Create your first resume to get started!</p>
            <button
              onClick={() => navigate('/ai-edit')}
              className="mt-6 px-6 py-3 bg-teal-600 text-white rounded-lg font-medium hover:bg-teal-700 transition"
            >
              Create Your First Resume
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.isArray(resumes) && resumes.map((resume, index) => (
              <motion.div
                key={resume.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-gray-800/50 rounded-lg border border-gray-600 overflow-hidden hover:border-gray-500 transition-all duration-200 hover:shadow-lg"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-white truncate" title={resume.title}>
                        {resume.title}
                      </h3>
                      <p className="text-gray-400 text-sm mt-1">
                        Created: {new Date(resume.created_at).toLocaleDateString()}
                      </p>
                      {resume.updated_at !== resume.created_at && (
                        <p className="text-gray-400 text-sm">
                          Updated: {new Date(resume.updated_at).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Preview of resume content */}
                  <div className="bg-gray-900/50 rounded p-3 mb-4 max-h-20 overflow-hidden">
                    <p className="text-gray-300 text-sm line-clamp-3">
                      {resume.summary || 
                       (resume.personalInfo?.name ? `${resume.personalInfo.name} - ${resume.personalInfo.email}` : 'No preview available')}
                    </p>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => handleEditResume(resume)}
                      className="flex-1 min-w-0 px-3 py-2 bg-blue-600 text-white rounded text-sm font-medium hover:bg-blue-700 transition flex items-center justify-center gap-1"
                    >
                      <Edit3 size={14} />
                      Edit
                    </button>
                    <button
                      onClick={() => handleUseInTemplate(resume)}
                      className="flex-1 min-w-0 px-3 py-2 bg-teal-600 text-white rounded text-sm font-medium hover:bg-teal-700 transition flex items-center justify-center gap-1"
                    >
                      <FileText size={14} />
                      Use Template
                    </button>
                    <button
                      onClick={() => handlePreviewResume(resume)}
                      className="px-3 py-2 bg-gray-600 text-white rounded text-sm font-medium hover:bg-gray-700 transition flex items-center justify-center gap-1"
                    >
                      <Eye size={14} />
                    </button>
                    <button
                      onClick={() => downloadResumePDF(resume)}
                      className="px-3 py-2 bg-orange-600 text-white rounded text-sm font-medium hover:bg-orange-700 transition flex items-center justify-center gap-1"
                    >
                      <Download size={14} />
                    </button>
                    <button
                      onClick={() => handleDeleteResume(resume.id)}
                      className="px-3 py-2 bg-red-600 text-white rounded text-sm font-medium hover:bg-red-700 transition flex items-center justify-center gap-1"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Preview Modal */}
        {showPreview && selectedResume && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-gray-800 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
              <div className="flex justify-between items-center p-6 border-b border-gray-600">
                <h3 className="text-xl font-semibold text-white">{selectedResume.title}</h3>
                <button
                  onClick={() => setShowPreview(false)}
                  className="text-gray-400 hover:text-white transition"
                >
                  ✕
                </button>
              </div>
              <div className="p-6 overflow-y-auto max-h-[70vh]">
                <div className="bg-white rounded p-6 text-black">
                  <div style={{ whiteSpace: 'pre-wrap', fontFamily: 'Arial, sans-serif', lineHeight: 1.6 }}>
                    {selectedResume.rawText || resumeService.structuredDataToText(selectedResume)}
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-3 p-6 border-t border-gray-600">
                <button
                  onClick={() => {
                    handleEditResume(selectedResume);
                    setShowPreview(false);
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                >
                  Edit Resume
                </button>
                <button
                  onClick={() => {
                    handleUseInTemplate(selectedResume);
                    setShowPreview(false);
                  }}
                  className="px-4 py-2 bg-teal-600 text-white rounded hover:bg-teal-700 transition"
                >
                  Use in Template
                </button>
                <button
                  onClick={() => setShowPreview(false)}
                  className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyResumesPage;