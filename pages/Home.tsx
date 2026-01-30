
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { db } from '../services/dbService';
import { GalleryImage } from '../types';

const Home: React.FC = () => {
  const [gallery, setGallery] = useState<GalleryImage[]>([]);

  useEffect(() => {
    setGallery(db.getGallery().slice(0, 3));
  }, []);

  const resourceLinks = [
    {
      title: "Faith AI Assistant",
      description: "Get spiritual guidance and biblical answers in real-time.",
      path: "/ai-assistant",
      image: "https://images.unsplash.com/photo-1515023115689-589c39d5583f?auto=format&fit=crop&q=80&w=800",
      color: "bg-blue-600"
    },
    {
      title: "Scripture Reader",
      description: "Read the Holy Word in Kinyarwanda, English, or French.",
      path: "/read",
      image: "https://images.unsplash.com/photo-1504052434569-70ad5836ab65?auto=format&fit=crop&q=80&w=800",
      color: "bg-amber-600"
    },
    {
      title: "Daily Reflections",
      description: "Explore deep insights from our pastoral team.",
      path: "/posts",
      image: "https://images.unsplash.com/photo-1490730141103-6ac277a5bf17?auto=format&fit=crop&q=80&w=800",
      color: "bg-emerald-600"
    }
  ];

  const externalPartners = [
    { name: "United Bible Societies", url: "https://www.unitedbiblesocieties.org", desc: "Our global fellowship of 150+ societies." },
    { name: "Bible Society UK", url: "https://www.biblesociety.org.uk", desc: "The oldest Bible society in the world." },
    { name: "American Bible Society", url: "https://americanbible.org", desc: "Spreading the Word across the Americas." }
  ];

  const externalStudyLinks = [
    { 
      name: "YouVersion Bible", 
      url: "https://www.bible.com", 
      icon: "📱",
      image: "https://images.unsplash.com/photo-1543191878-f7560868f126?auto=format&fit=crop&q=80&w=800"
    },
    { 
      name: "Bible Gateway", 
      url: "https://www.biblegateway.com", 
      icon: "📖",
      image: "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&q=80&w=800"
    },
    { 
      name: "Blue Letter Bible", 
      url: "https://www.blueletterbible.org", 
      icon: "🔍",
      image: "https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&q=80&w=800"
    }
  ];

  return (
    <div className="animate-fade-in overflow-x-hidden">
      {/* Hero Section - New Cinematic Bible Background */}
      <section className="relative h-[900px] flex items-center justify-center bg-gray-950 overflow-hidden">
        <div className="absolute inset-0">
           <img 
            src="https://images.unsplash.com/photo-1473186533640-37b451cf30f2?q=80&w=2070&auto=format&fit=crop" 
            alt="Sacred Scriptures in Light" 
            className="w-full h-full object-cover animate-pulse-slow scale-110 opacity-70"
          />
        </div>
        
        {/* Deep, layered overlays for legibility and premium feel */}
        <div className="absolute inset-0 bg-gradient-to-b from-blue-950/80 via-transparent to-blue-950/90"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-blue-950/60 via-transparent to-black/40"></div>
        <div className="absolute inset-0 bg-black/20"></div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-white text-center">
          <div className="inline-block px-8 py-3 bg-white/5 backdrop-blur-2xl border border-white/20 rounded-full text-yellow-400 text-[11px] font-black uppercase tracking-[0.5em] mb-12 animate-bounce-subtle shadow-2xl">
            Bible Society of Rwanda • Est. 1977
          </div>
          <h1 className="text-7xl md:text-9xl font-bold leading-[0.85] mb-12 drop-shadow-[0_20px_20px_rgba(0,0,0,0.5)] serif tracking-tight">
            God's Word in <br/><span className="text-yellow-400 italic">Rwanda.</span>
          </h1>
          <p className="text-xl md:text-3xl opacity-90 mb-16 max-w-3xl mx-auto leading-relaxed font-light text-blue-50 drop-shadow-lg">
            Connecting every Rwandan heart to the life-changing message of the Holy Scriptures in our own mother tongues.
          </p>
          <div className="flex flex-col sm:flex-row gap-8 justify-center items-center">
            <Link to="/ai-assistant" className="group bg-yellow-500 text-blue-950 hover:bg-white px-14 py-7 rounded-[2.5rem] font-black text-lg transition-all transform hover:-translate-y-2 shadow-[0_20px_50px_-15px_rgba(234,179,8,0.4)] flex items-center gap-4">
              <span>TALK TO FAITH AI</span>
              <svg className="w-6 h-6 transition-transform group-hover:translate-x-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M13 7l5 5m0 0l-5 5m5-5H6"></path></svg>
            </Link>
            <Link to="/read" className="bg-white/10 backdrop-blur-xl hover:bg-white/20 text-white border border-white/20 px-14 py-7 rounded-[2.5rem] font-black text-lg transition-all transform hover:-translate-y-2 shadow-xl">
              START READING
            </Link>
          </div>
        </div>
        
        {/* Scroll Indicator */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4">
           <span className="text-[9px] font-black uppercase tracking-[0.4em] text-white/40">Explore our ministry</span>
           <div className="w-px h-20 bg-gradient-to-b from-yellow-500 to-transparent animate-pulse"></div>
        </div>
      </section>

      {/* Primary Visual Navigation */}
      <section className="py-24 bg-white relative -mt-32 z-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {resourceLinks.map((link, idx) => (
              <Link 
                key={idx} 
                to={link.path}
                className="group relative h-[500px] rounded-[4rem] overflow-hidden shadow-2xl transition-all duration-700 hover:scale-[1.02] hover:shadow-blue-100"
              >
                <img src={link.image} alt={link.title} className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-110" />
                <div className={`absolute inset-0 ${link.color} opacity-30 group-hover:opacity-10 transition-opacity`}></div>
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent"></div>
                <div className="absolute bottom-0 left-0 p-12 text-white">
                  <h3 className="text-4xl font-bold mb-4 serif">{link.title}</h3>
                  <p className="text-white/80 text-base leading-relaxed mb-8 line-clamp-2 font-light">{link.description}</p>
                  <span className="inline-flex items-center gap-3 text-yellow-400 font-black text-xs uppercase tracking-[0.3em]">
                    Discover More <svg className="w-5 h-5 transition-transform group-hover:translate-x-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Recommended Study Tools with Background Images */}
      <section className="py-24 bg-gray-50 px-4">
        <div className="max-w-7xl mx-auto">
           <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div className="relative h-[600px] rounded-[4rem] overflow-hidden shadow-3xl group">
                 <img 
                  src="https://images.unsplash.com/photo-1544427928-c49cdfebf194?auto=format&fit=crop&q=80&w=1200" 
                  alt="Ancient Manuscript" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
                 />
                 <div className="absolute inset-0 bg-blue-900/20"></div>
                 <div className="absolute bottom-12 left-12 right-12 p-8 bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl text-white">
                    <p className="italic font-serif text-xl">"The grass withers and the flowers fall, but the word of our God endures forever."</p>
                    <p className="text-yellow-400 font-black text-[10px] uppercase tracking-widest mt-4">Isaiah 40:8</p>
                 </div>
              </div>
              <div>
                <span className="text-blue-700 font-black uppercase tracking-[0.4em] text-[10px] mb-4 block">Recommended Study Tools</span>
                <h2 className="text-6xl font-bold text-gray-900 mb-8 serif">Access God's Word Anywhere</h2>
                <p className="text-gray-500 text-xl font-light leading-relaxed mb-10">
                  Beyond our local translations, we encourage you to use these world-class external digital platforms to deepen your study of the Holy Scriptures.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                   {externalStudyLinks.map((study, idx) => (
                     <a 
                      key={idx} 
                      href={study.url} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="group relative h-56 rounded-[3rem] overflow-hidden shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-2 border border-gray-100"
                     >
                        <img 
                          src={study.image} 
                          alt={study.name} 
                          className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" 
                        />
                        <div className="absolute inset-0 bg-gradient-to-br from-black/60 to-transparent group-hover:bg-black/40 transition-colors"></div>
                        
                        <div className="absolute inset-0 p-8 flex flex-col justify-end">
                           <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-[2rem] p-6 text-white transform group-hover:translate-y-[-5px] transition-transform">
                             <div className="flex items-center gap-4 mb-2">
                               <div className="text-3xl filter drop-shadow-lg">{study.icon}</div>
                               <h4 className="font-bold text-xl leading-tight serif">{study.name}</h4>
                             </div>
                             <span className="text-yellow-400 text-[9px] font-black uppercase tracking-[0.2em]">Launch Platform ↗</span>
                           </div>
                        </div>
                     </a>
                   ))}
                </div>
              </div>
           </div>
        </div>
      </section>

      {/* Global Fellowship Section */}
      <section className="py-32 bg-white px-4">
        <div className="max-w-7xl mx-auto">
          <div className="relative rounded-[4rem] overflow-hidden min-h-[600px] flex flex-col md:flex-row items-center shadow-3xl bg-blue-950">
            <div className="w-full md:w-1/2 h-[400px] md:h-auto relative overflow-hidden">
               <img 
                src="https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&q=80&w=1200" 
                alt="Global Community" 
                className="absolute inset-0 w-full h-full object-cover grayscale opacity-60 hover:grayscale-0 transition-all duration-1000"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-blue-950/80 to-transparent"></div>
            </div>
            <div className="w-full md:w-1/2 p-12 md:p-24 text-white">
              <span className="text-yellow-400 font-black uppercase tracking-[0.5em] text-[10px] mb-6 block">Our Global Connection</span>
              <h2 className="text-5xl font-bold mb-8 serif leading-tight">A Member of the United Bible Societies</h2>
              <p className="text-blue-100 text-lg mb-12 font-light leading-relaxed">
                We are proud to be part of a worldwide fellowship of Bible Societies working together to translate and distribute the Word in over 200 countries.
              </p>
              <div className="space-y-4">
                {externalPartners.map((partner, idx) => (
                  <a 
                    key={idx} 
                    href={partner.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-6 bg-white/5 border border-white/10 rounded-3xl hover:bg-white/10 transition-all group"
                  >
                    <div>
                      <h4 className="font-bold text-white text-sm uppercase tracking-widest">{partner.name}</h4>
                      <p className="text-blue-300 text-xs mt-1 font-light">{partner.desc}</p>
                    </div>
                    <svg className="w-5 h-5 text-yellow-500 group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Moments of Faith Gallery Preview */}
      <section className="py-24 bg-white px-4 border-t border-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center mb-20 gap-8 text-center md:text-left">
            <div>
              <span className="text-emerald-600 font-black uppercase tracking-[0.4em] text-[10px] mb-4 block">Our Visual Journey</span>
              <h2 className="text-6xl font-bold text-gray-900 serif">Moments of Faith</h2>
              <p className="text-gray-400 mt-6 max-w-2xl font-light text-xl">Captured moments of our ministry reaching the hearts of Rwanda.</p>
            </div>
            <Link to="/gallery" className="group bg-gray-950 text-white px-10 py-5 rounded-[2rem] font-black text-xs uppercase tracking-widest transition-all flex items-center gap-3 hover:bg-emerald-600 shadow-xl transform hover:-translate-y-1">
              VIEW FULL GALLERY
              <svg className="w-4 h-4 transition-transform group-hover:translate-x-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {gallery.length > 0 ? (
              gallery.map((img) => (
                <div key={img.id} className="group relative h-[600px] rounded-[4rem] overflow-hidden shadow-2xl bg-gray-100 transform transition-transform duration-700 hover:-translate-y-2">
                  <img src={img.url} alt={img.caption} className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 flex items-end p-12">
                    <p className="text-white font-bold italic text-2xl serif leading-tight">"{img.caption}"</p>
                  </div>
                </div>
              ))
            ) : (
              [1, 2, 3].map(i => (
                <div key={i} className="h-[600px] bg-gray-50 rounded-[4rem] border-4 border-dashed border-gray-100 flex items-center justify-center p-16 text-center">
                  <div className="space-y-4">
                     <span className="text-4xl block opacity-20">📸</span>
                     <p className="text-gray-300 font-black uppercase tracking-[0.3em] text-[10px]">Ministry moments waiting to be captured</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
