import { useState } from 'react';
import { CheckCircle, Star, Shield, Cloud, Zap } from 'lucide-react';
import AuthModal from './AuthModal';

const RegistrationIncentive = ({ 
  isVisible = true, 
  onDismiss, 
  context = 'general',
  className = ''
}) => {
  const [showAuthModal, setShowAuthModal] = useState(false);

  if (!isVisible) return null;

  const incentives = {
    general: {
      title: "Unlock Premium Features",
      subtitle: "Create a free account to access all features",
      benefits: [
        { icon: <Cloud size={16} />, text: "Save unlimited resumes" },
        { icon: <Shield size={16} />, text: "Secure cloud storage" },
        { icon: <Zap size={16} />, text: "Access from any device" },
        { icon: <Star size={16} />, text: "Priority support" }
      ],
      cta: "Create Free Account"
    },
    'my-resumes': {
      title: "Save Your Work Forever",
      subtitle: "Never lose your resumes again",
      benefits: [
        { icon: <CheckCircle size={16} />, text: "Unlimited resume storage" },
        { icon: <Cloud size={16} />, text: "Automatic cloud backup" },
        { icon: <Shield size={16} />, text: "Secure & private" },
        { icon: <Zap size={16} />, text: "Instant access anywhere" }
      ],
      cta: "Save My Resumes"
    },
    'previous-data': {
      title: "Reuse Your Information",
      subtitle: "Build new resumes faster with saved data",
      benefits: [
        { icon: <Zap size={16} />, text: "Quick template switching" },
        { icon: <CheckCircle size={16} />, text: "Consistent information" },
        { icon: <Cloud size={16} />, text: "Sync across devices" },
        { icon: <Star size={16} />, text: "Time-saving workflow" }
      ],
      cta: "Access My Data"
    },
    sidebar: {
      title: "Save to Cloud",
      subtitle: "Keep your work safe and accessible",
      benefits: [
        { icon: <Cloud size={16} />, text: "Cloud storage" },
        { icon: <Shield size={16} />, text: "Never lose work" }
      ],
      cta: "Sign Up Free",
      compact: true
    }
  };

  const currentIncentive = incentives[context] || incentives.general;

  const handleAuthSuccess = () => {
    setShowAuthModal(false);
    onDismiss && onDismiss();
  };

  if (currentIncentive.compact) {
    return (
      <>
        <div className={`bg-gradient-to-r from-gray-900 to-gray-700 text-white p-3 rounded-lg ${className}`}>
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h4 className="font-medium text-sm">{currentIncentive.title}</h4>
              <p className="text-xs text-gray-300 mt-1">{currentIncentive.subtitle}</p>
            </div>
            <button
              onClick={() => setShowAuthModal(true)}
              className="bg-white text-gray-900 px-3 py-1 rounded text-xs font-medium hover:bg-gray-100 transition-colors ml-3"
            >
              {currentIncentive.cta}
            </button>
          </div>
        </div>

        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          onSuccess={handleAuthSuccess}
          initialMode="register"
        />
      </>
    );
  }

  return (
    <>
      <div className={`bg-white border border-gray-200 rounded-lg p-6 shadow-sm ${className}`}>
        <div className="text-center mb-4">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-gray-900 rounded-full mb-3">
            <Star className="text-white" size={20} />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">
            {currentIncentive.title}
          </h3>
          <p className="text-gray-600 text-sm">
            {currentIncentive.subtitle}
          </p>
        </div>

        <div className="space-y-3 mb-6">
          {currentIncentive.benefits.map((benefit, index) => (
            <div key={index} className="flex items-center text-sm text-gray-700">
              <div className="text-gray-900 mr-3">
                {benefit.icon}
              </div>
              {benefit.text}
            </div>
          ))}
        </div>

        <div className="space-y-2">
          <button
            onClick={() => setShowAuthModal(true)}
            className="w-full bg-gray-900 text-white py-2 px-4 rounded-lg hover:bg-gray-800 transition-colors font-medium"
          >
            {currentIncentive.cta}
          </button>
          
          <button
            onClick={() => setShowAuthModal(true)}
            className="w-full text-gray-600 py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors text-sm"
          >
            Already have an account? Sign in
          </button>
        </div>

        {onDismiss && (
          <button
            onClick={onDismiss}
            className="w-full text-gray-400 py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors text-xs mt-2"
          >
            Maybe later
          </button>
        )}
      </div>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccess={handleAuthSuccess}
        initialMode="register"
      />
    </>
  );
};

export default RegistrationIncentive;