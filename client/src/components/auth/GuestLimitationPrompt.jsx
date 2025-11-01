import { useState } from 'react';
import { Lock, User, FileText, Database, X } from 'lucide-react';
import AuthModal from './AuthModal';

const GuestLimitationPrompt = ({ 
  isOpen, 
  onClose, 
  feature, 
  onContinueAsGuest,
  title,
  description 
}) => {
  const [showAuthModal, setShowAuthModal] = useState(false);

  if (!isOpen) return null;

  const features = {
    'my-resumes': {
      title: 'My Resumes',
      description: 'Access your saved resumes from anywhere',
      icon: <FileText className="w-8 h-8 text-gray-600" />,
      benefits: [
        'Save unlimited resumes',
        'Access from any device',
        'Never lose your work',
        'Organize by categories'
      ]
    },
    'previous-data': {
      title: 'Use Previous Data',
      description: 'Build new resumes using your saved information',
      icon: <Database className="w-8 h-8 text-gray-600" />,
      benefits: [
        'Reuse your information',
        'Save time on new resumes',
        'Maintain consistency',
        'Quick template switching'
      ]
    },
    'cloud-sync': {
      title: 'Cloud Sync',
      description: 'Sync your data across all devices',
      icon: <User className="w-8 h-8 text-gray-600" />,
      benefits: [
        'Cross-device access',
        'Automatic backups',
        'Secure cloud storage',
        'Real-time synchronization'
      ]
    }
  };

  const currentFeature = features[feature] || {
    title: title || 'Premium Feature',
    description: description || 'This feature requires an account',
    icon: <Lock className="w-8 h-8 text-gray-600" />,
    benefits: [
      'Enhanced functionality',
      'Secure data storage',
      'Cross-device access',
      'Priority support'
    ]
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleAuthSuccess = (data) => {
    setShowAuthModal(false);
    onClose();
    // The parent component should handle the success
  };

  return (
    <>
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        onClick={handleBackdropClick}
      >
        <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6 relative">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={20} />
          </button>

          {/* Feature Icon */}
          <div className="text-center mb-4">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
              {currentFeature.icon}
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {currentFeature.title}
            </h3>
            <p className="text-gray-600">
              {currentFeature.description}
            </p>
          </div>

          {/* Benefits List */}
          <div className="mb-6">
            <h4 className="text-sm font-medium text-gray-900 mb-3">
              With an account, you get:
            </h4>
            <ul className="space-y-2">
              {currentFeature.benefits.map((benefit, index) => (
                <li key={index} className="flex items-center text-sm text-gray-600">
                  <div className="w-2 h-2 bg-gray-900 rounded-full mr-3"></div>
                  {benefit}
                </li>
              ))}
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              onClick={() => setShowAuthModal(true)}
              className="w-full bg-gray-900 text-white py-2 px-4 rounded-lg hover:bg-gray-800 transition-colors font-medium"
            >
              Create Free Account
            </button>
            
            <button
              onClick={() => setShowAuthModal(true)}
              className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors font-medium"
            >
              Sign In
            </button>

            {onContinueAsGuest && (
              <button
                onClick={() => {
                  onContinueAsGuest();
                  onClose();
                }}
                className="w-full text-gray-600 py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors text-sm"
              >
                Continue as Guest
              </button>
            )}
          </div>

          {/* Guest Mode Info */}
          <div className="mt-4 p-3 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-600 text-center">
              <strong>Guest Mode:</strong> Your data is saved locally in your browser. 
              Create an account to access it from anywhere.
            </p>
          </div>
        </div>
      </div>

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccess={handleAuthSuccess}
        initialMode="register"
      />
    </>
  );
};

export default GuestLimitationPrompt;