import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from "../components/Navbar/Navbar.jsx";
import { useAuth } from "../context/AuthContext.jsx";

const MyResumesPageSimple = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    setLoading(false);
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white">Redirecting to login...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-white">My Resumes</h1>
            <p className="text-gray-300 mt-2">
              Manage your saved resumes (Simple Version)
            </p>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="text-white">Loading...</div>
          </div>
        ) : (
          <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-600">
            <h3 className="text-white text-lg font-semibold mb-4">Welcome, {user?.name || user?.email}!</h3>
            <p className="text-gray-300 mb-4">
              This is a simplified version of the My Resumes page. If you can see this, 
              the basic components are working.
            </p>
            
            <div className="space-y-2 text-gray-300">
              <p>✅ Navigation: Working</p>
              <p>✅ Authentication: Working</p>
              <p>✅ User Data: {user ? 'Available' : 'Not available'}</p>
              <p>✅ Styling: Working</p>
            </div>
            
            <div className="mt-6 flex space-x-4">
              <button
                onClick={() => navigate('/')}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
              >
                Go Home
              </button>
              <button
                onClick={() => navigate('/ai-edit')}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
              >
                Create Resume
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyResumesPageSimple;