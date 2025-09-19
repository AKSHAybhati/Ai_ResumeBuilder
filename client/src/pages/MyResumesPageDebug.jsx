import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from "../components/Navbar/Navbar.jsx";

const MyResumesPageDebug = () => {
  const navigate = useNavigate();
  const [debugInfo, setDebugInfo] = useState([]);
  const [error, setError] = useState(null);

  const addDebugInfo = (message) => {
    console.log('Debug:', message);
    setDebugInfo(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  useEffect(() => {
    addDebugInfo('Component mounted');
    
    try {
      addDebugInfo('Testing basic imports...');
      
      // Test navigation
      addDebugInfo('Navigation available: ' + (navigate ? 'Yes' : 'No'));
      
      // Test auth context
      addDebugInfo('Testing auth context...');
      import('../context/AuthContext.jsx').then(authModule => {
        addDebugInfo('Auth module imported successfully');
        const { useAuth } = authModule;
        addDebugInfo('useAuth hook available: ' + (useAuth ? 'Yes' : 'No'));
      }).catch(err => {
        addDebugInfo('Auth import error: ' + err.message);
        setError(err.message);
      });
      
      // Test resume service
      addDebugInfo('Testing resume service...');
      import('../services/resumeService.js').then(serviceModule => {
        addDebugInfo('Resume service imported successfully');
        const resumeService = serviceModule.default;
        addDebugInfo('Resume service available: ' + (resumeService ? 'Yes' : 'No'));
      }).catch(err => {
        addDebugInfo('Resume service import error: ' + err.message);
        setError(err.message);
      });
      
    } catch (err) {
      addDebugInfo('Initialization error: ' + err.message);
      setError(err.message);
    }
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-white mb-6">My Resumes - Debug Mode</h1>
        
        {error && (
          <div className="bg-red-900/20 border border-red-500 rounded-lg p-4 mb-6">
            <h3 className="text-red-400 font-bold mb-2">Error Detected:</h3>
            <p className="text-red-300">{error}</p>
          </div>
        )}
        
        <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-600">
          <h3 className="text-white font-bold mb-4">Debug Information:</h3>
          <div className="space-y-2">
            {debugInfo.map((info, index) => (
              <p key={index} className="text-gray-300 text-sm font-mono">
                {info}
              </p>
            ))}
          </div>
          
          {debugInfo.length === 0 && (
            <p className="text-gray-400">Loading debug information...</p>
          )}
        </div>
        
        <div className="mt-6 flex space-x-4">
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            Reload Page
          </button>
          <button
            onClick={() => navigate('/')}
            className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition"
          >
            Go Home
          </button>
          <button
            onClick={() => {
              setDebugInfo([]);
              setError(null);
              window.location.reload();
            }}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
          >
            Clear & Retry
          </button>
        </div>
      </div>
    </div>
  );
};

export default MyResumesPageDebug;