
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AuthState, Language } from '../types';
import { useLanguage } from '../App';

interface NavbarProps {
  auth: AuthState;
  onLogout: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ auth, onLogout }) => {
  const location = useLocation();
  const { language, setLanguage } = useLanguage();
  const [showLangMenu, setShowLangMenu] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  const languages: { code: Language; label: string; icon: string }[] = [
    { code: 'Kinyarwanda', label: 'Kinyarwanda', icon: '🇷🇼' },
    { code: 'English', label: 'English', icon: '🇬🇧' },
    { code: 'French', label: 'Français', icon: '🇫🇷' }
  ];

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-blue-700 rounded-lg flex items-center justify-center text-white font-bold text-xl">B</div>
              <span className="text-blue-900 font-bold text-lg hidden md:block">BSR</span>
            </Link>
            <div className="hidden md:ml-10 md:flex md:space-x-8">
              <Link to="/" className={`${isActive('/') ? 'text-blue-700 border-b-2 border-blue-700' : 'text-gray-500 hover:text-gray-700'} px-1 pt-1 text-sm font-medium transition-colors`}>Home</Link>
              <Link to="/read" className={`${isActive('/read') ? 'text-blue-700 border-b-2 border-blue-700' : 'text-gray-500 hover:text-gray-700'} px-1 pt-1 text-sm font-medium transition-colors`}>Read Bible</Link>
              <Link to="/posts" className={`${isActive('/posts') ? 'text-blue-700 border-b-2 border-blue-700' : 'text-gray-500 hover:text-gray-700'} px-1 pt-1 text-sm font-medium transition-colors`}>Reflections</Link>
              <Link to="/contact" className={`${isActive('/contact') ? 'text-blue-700 border-b-2 border-blue-700' : 'text-gray-500 hover:text-gray-700'} px-1 pt-1 text-sm font-medium transition-colors`}>Contact</Link>
              <Link to="/ai-assistant" className={`${isActive('/ai-assistant') ? 'text-blue-700 border-b-2 border-blue-700' : 'text-gray-500 hover:text-gray-700'} px-1 pt-1 text-sm font-medium transition-colors flex items-center gap-1`}>
                <span className="text-blue-500">✨</span> AI Assistant
              </Link>
              {auth.isAuthenticated && auth.user?.role === 'admin' && (
                <Link to="/admin" className={`${isActive('/admin') ? 'text-blue-700 border-b-2 border-blue-700' : 'text-blue-600 font-bold hover:text-blue-800'} px-1 pt-1 text-sm font-medium transition-colors flex items-center gap-1`}>
                  Dashboard
                </Link>
              )}
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <button 
                onClick={() => setShowLangMenu(!showLangMenu)}
                className="flex items-center space-x-2 px-3 py-2 border rounded-full text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
              >
                <span>{languages.find(l => l.code === language)?.icon}</span>
                <span className="hidden sm:inline">{language}</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
              </button>
              
              {showLangMenu && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setShowLangMenu(false)}></div>
                  <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-100 rounded-xl shadow-xl z-20 overflow-hidden">
                    {languages.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => {
                          setLanguage(lang.code);
                          setShowLangMenu(false);
                        }}
                        className={`w-full text-left px-4 py-3 text-sm flex items-center space-x-3 hover:bg-gray-50 transition ${language === lang.code ? 'bg-blue-50 text-blue-700 font-bold' : 'text-gray-700'}`}
                      >
                        <span>{lang.icon}</span>
                        <span>{lang.label}</span>
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            {auth.isAuthenticated ? (
              <div className="flex items-center space-x-4 border-l pl-4">
                <button 
                  onClick={onLogout}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-md text-sm font-medium transition"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex space-x-2 border-l pl-4">
                <Link to="/login" className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium">Log in</Link>
                <Link to="/signup" className="bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded-md text-sm font-medium transition">Join Us</Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
