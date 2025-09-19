import React, { useState } from "react";
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();
  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <nav className="top-0 left-0 right-0 z-[9999] bg-gray-900/95 text-white shadow-xl border-b border-gray-700 backdrop-blur-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo/Name - Left Side */}
          <div className="flex-shrink-0">
            <div className="flex items-center space-x-2 text-xl font-bold">
              <img
                src="/UptoSkills_logo.png"
                alt="UptoSkills Logo"
                className="h-8 w-auto"
              />
              <span className="bg-gradient-to-r from-teal-400 to-orange-400 bg-clip-text text-transparent">
                AI Resume Builder
              </span>
            </div>
          </div>

          {/* Desktop Menu - Right Side */}
          <div className="hidden md:block">
            <div className="flex items-baseline space-x-4">
              {isAuthenticated ? (
                <>
                  <Link
                    to="/my-resumes"
                    className="hover:bg-teal-600 hover:text-white px-4 py-2 rounded-md text-sm font-medium transition-all duration-300"
                  >
                    My Resumes
                  </Link>
                  <span className="text-teal-400 text-sm">
                    Welcome, {user?.name || user?.email}!
                  </span>
                  <button
                    onClick={logout}
                    className="hover:bg-red-600 hover:text-white px-4 py-2 rounded-md text-sm font-medium transition-all duration-300"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/signup"
                    className="hover:bg-orange-600 hover:text-white px-4 py-2 rounded-md text-sm font-medium transition-all duration-300"
                  >
                    SignUp
                  </Link>
                  <Link
                    to="/login"
                    className="bg-gradient-to-r from-teal-500 to-orange-500 hover:from-teal-600 hover:to-orange-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-all duration-300 shadow-lg"
                  >
                    SignIn
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              type="button"
              className="bg-teal-600 inline-flex items-center justify-center p-2 rounded-md hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-teal-400 transition-all duration-300"
              aria-controls="mobile-menu"
              aria-expanded={isOpen}
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? (
                <svg
                  className="h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg
                  className="h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-gray-800 border-t border-gray-700" id="mobile-menu">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {isAuthenticated ? (
              <>
                <Link
                  to="/my-resumes"
                  className="block hover:bg-teal-600 hover:text-white px-3 py-2 rounded-md text-base font-medium transition-all duration-300"
                  onClick={() => setIsOpen(false)}
                >
                  My Resumes
                </Link>
                <div className="block px-3 py-2 text-teal-400 text-sm">
                  Welcome, {user?.name || user?.email}!
                </div>
                <button
                  onClick={() => {
                    logout();
                    setIsOpen(false);
                  }}
                  className="block w-full text-left hover:bg-red-600 hover:text-white px-3 py-2 rounded-md text-base font-medium transition-all duration-300"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/signup"
                  className="block hover:bg-orange-600 hover:text-white px-3 py-2 rounded-md text-base font-medium transition-all duration-300"
                  onClick={() => setIsOpen(false)}
                >
                  SignUp
                </Link>
                <Link
                  to="/login"
                  className="block bg-gradient-to-r from-teal-500 to-orange-500 hover:from-teal-600 hover:to-orange-600 text-white px-3 py-2 rounded-md text-base font-medium transition-all duration-300 shadow-lg"
                  onClick={() => setIsOpen(false)}
                >
                  SignIn
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;