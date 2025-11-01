import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import GuestLimitationPrompt from '../components/auth/GuestLimitationPrompt';

const ProtectedRoute = ({ 
  children, 
  requireAuth = true, 
  fallback = null, 
  showLoginPrompt = true,
  feature = 'premium',
  title,
  description
}) => {
  const { isAuthenticated, isGuest, loading } = useAuth();
  const [showPrompt, setShowPrompt] = useState(false);

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // If authentication is required and user is not authenticated
  if (requireAuth && !isAuthenticated) {
    if (showLoginPrompt) {
      // Show the guest limitation prompt
      return (
        <>
          {fallback || (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Authentication Required</h2>
                <p className="text-gray-600 mb-6">Please sign in to access this feature.</p>
                <button
                  onClick={() => setShowPrompt(true)}
                  className="bg-gray-900 text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition-colors"
                >
                  Sign In
                </button>
              </div>
            </div>
          )}
          
          <GuestLimitationPrompt
            isOpen={showPrompt}
            onClose={() => setShowPrompt(false)}
            feature={feature}
            title={title}
            description={description}
          />
        </>
      );
    } else {
      // Return fallback or null
      return fallback;
    }
  }

  // User is authenticated or authentication is not required
  return children;
};

export default ProtectedRoute;