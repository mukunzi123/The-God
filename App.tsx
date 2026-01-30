
import React, { useState, useEffect, createContext, useContext } from 'react';
import { HashRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import BiblePosts from './pages/BiblePosts';
import ReadBible from './pages/ReadBible';
import AdminDashboard from './pages/AdminDashboard';
import FaithAssistant from './pages/FaithAssistant';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Signup from './pages/Signup';
import GalleryPage from './pages/Gallery';
import { AuthState, User, Language } from './types';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error("useLanguage must be used within LanguageProvider");
  return context;
};

const App: React.FC = () => {
  const [auth, setAuth] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
  });

  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('bsr_lang');
    return (saved as Language) || 'English';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('bsr_lang', lang);
  };

  useEffect(() => {
    const savedUser = localStorage.getItem('bsr_current_user');
    if (savedUser) {
      setAuth({
        user: JSON.parse(savedUser),
        isAuthenticated: true,
      });
    }
  }, []);

  const handleLogin = (user: User) => {
    setAuth({ user, isAuthenticated: true });
    localStorage.setItem('bsr_current_user', JSON.stringify(user));
  };

  const handleLogout = () => {
    setAuth({ user: null, isAuthenticated: false });
    localStorage.removeItem('bsr_current_user');
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      <Router>
        <div className="min-h-screen flex flex-col bg-gray-50">
          <Navbar auth={auth} onLogout={handleLogout} />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/posts" element={<BiblePosts />} />
              <Route path="/read" element={<ReadBible />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/gallery" element={<GalleryPage />} />
              <Route path="/ai-assistant" element={<FaithAssistant />} />
              <Route 
                path="/login" 
                element={!auth.isAuthenticated ? <Login onLogin={handleLogin} /> : <Navigate to="/" />} 
              />
              <Route 
                path="/signup" 
                element={!auth.isAuthenticated ? <Signup onLogin={handleLogin} /> : <Navigate to="/" />} 
              />
              <Route 
                path="/admin" 
                element={
                  auth.isAuthenticated && auth.user?.role === 'admin' 
                  ? <AdminDashboard user={auth.user} /> 
                  : <Navigate to="/login" />
                } 
              />
            </Routes>
          </main>
          
          <footer className="bg-blue-950 text-white pt-24 pb-12 px-4 border-t border-blue-900">
            <div className="max-w-7xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-16 mb-20">
                <div className="col-span-1 md:col-span-1 lg:col-span-1">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="w-12 h-12 bg-yellow-500 rounded-xl flex items-center justify-center text-blue-950 font-black text-2xl shadow-lg">B</div>
                    <span className="text-2xl font-bold tracking-tight">Bible Society<br/><span className="text-yellow-500">of Rwanda</span></span>
                  </div>
                  <p className="text-blue-300 leading-relaxed mb-6 font-light text-sm">
                    Promoting the Word of God through quality translation, affordable publication, and wide distribution since 1977.
                  </p>
                </div>

                <div>
                  <h4 className="text-lg font-bold mb-8 border-b border-blue-900 pb-2">Ministry Tools</h4>
                  <ul className="space-y-4">
                    <li><Link to="/read" className="text-blue-300 hover:text-yellow-500 transition-colors">Bible Reader</Link></li>
                    <li><Link to="/gallery" className="text-blue-300 hover:text-yellow-500 transition-colors">Ministry Gallery</Link></li>
                    <li><Link to="/posts" className="text-blue-300 hover:text-yellow-500 transition-colors">Scripture Reflections</Link></li>
                    <li><Link to="/ai-assistant" className="text-blue-300 hover:text-yellow-500 transition-colors flex items-center gap-2">Faith AI Assistant</Link></li>
                  </ul>
                </div>

                <div>
                  <h4 className="text-lg font-bold mb-8 border-b border-blue-900 pb-2">Global Network</h4>
                  <ul className="space-y-4">
                    <li><a href="https://www.unitedbiblesocieties.org" target="_blank" rel="noopener noreferrer" className="text-blue-300 hover:text-yellow-500 transition-colors flex items-center gap-2">United Bible Societies ↗</a></li>
                    <li><a href="https://www.biblesociety.org.uk" target="_blank" rel="noopener noreferrer" className="text-blue-300 hover:text-yellow-500 transition-colors flex items-center gap-2">Bible Society UK ↗</a></li>
                    <li><a href="https://americanbible.org" target="_blank" rel="noopener noreferrer" className="text-blue-300 hover:text-yellow-500 transition-colors flex items-center gap-2">American Bible Soc. ↗</a></li>
                    <li><a href="https://www.biblesociety.org.au" target="_blank" rel="noopener noreferrer" className="text-blue-300 hover:text-yellow-500 transition-colors flex items-center gap-2">Bible Soc. Australia ↗</a></li>
                  </ul>
                </div>

                <div>
                  <h4 className="text-lg font-bold mb-8 border-b border-blue-900 pb-2">Quick Links</h4>
                  <ul className="space-y-4">
                    <li><a href="#" className="text-blue-300 hover:text-yellow-500 transition-colors">Our History</a></li>
                    <li><a href="#" className="text-blue-300 hover:text-yellow-500 transition-colors">Translations Project</a></li>
                    <li><a href="#" className="text-blue-300 hover:text-yellow-500 transition-colors">Annual Reports</a></li>
                    <li><a href="#" className="text-blue-300 hover:text-yellow-500 transition-colors">Donation Portal</a></li>
                  </ul>
                </div>

                <div>
                  <h4 className="text-lg font-bold mb-8 border-b border-blue-900 pb-2">Contact BSR</h4>
                  <ul className="space-y-4 text-blue-300 font-light text-sm">
                    <li className="flex items-start gap-3 text-xs">
                      <span className="text-white font-bold">Rep:</span> Kubwimana Jado
                    </li>
                    <li className="flex items-start gap-3 text-xs">
                      <span className="text-white font-bold">Digital:</span> Mukunzi Fabien
                    </li>
                    <li className="flex items-start gap-3 pt-2">
                      <span>📍</span> Kigali, Rwanda. BP 435
                    </li>
                    <li className="flex items-start gap-3">
                      <span>📞</span> +250 794 497 850
                    </li>
                    <li className="flex items-start gap-3">
                      <span>✉️</span> mukunzifabien5@gmail.com
                    </li>
                  </ul>
                </div>
              </div>

              <div className="pt-12 border-t border-blue-900 flex flex-col md:flex-row justify-between items-center gap-6">
                <p className="text-blue-700 text-xs font-bold tracking-widest uppercase">
                  © {new Date().getFullYear()} Bible Society of Rwanda. A Member of United Bible Societies.
                </p>
                <div className="flex items-center gap-6">
                  <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-blue-300 hover:text-white transition-colors flex items-center gap-2 text-sm">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>
                    <span>Source Code</span>
                  </a>
                </div>
              </div>
            </div>
          </footer>
        </div>
      </Router>
    </LanguageContext.Provider>
  );
};

export default App;
