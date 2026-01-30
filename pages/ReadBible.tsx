
import React, { useState, useEffect } from 'react';
import { fetchBiblePassage } from '../services/geminiService';
import { useLanguage } from '../App';

const ReadBible: React.FC = () => {
  const { language } = useLanguage();
  const [reference, setReference] = useState('John 3:16');
  const [passage, setPassage] = useState<{ verse: string; context: string } | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!reference) return;
    setLoading(true);
    const result = await fetchBiblePassage(reference, language);
    setPassage(result);
    setLoading(false);
  };

  useEffect(() => {
    handleSearch();
  }, [language]);

  const popularVerses = [
    "Psalm 23", "Romans 8:28", "Jeremiah 29:11", "Philippians 4:13", "Matthew 5:1-12"
  ];

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8 animate-fade-in">
      <header className="text-center mb-12">
        <h1 className="text-4xl font-bold text-blue-900 mb-2">Holy Scripture Reader</h1>
        <p className="text-gray-500 italic">"Your word is a lamp to my feet and a light to my path." — Psalm 119:105</p>
        <div className="mt-2 inline-flex items-center px-3 py-1 bg-blue-50 rounded-full text-xs font-bold text-blue-700 uppercase tracking-widest">
          Reading in {language}
        </div>
      </header>

      <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100 mb-10">
        <div className="p-6 bg-blue-900 text-white">
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-2">
            <input 
              type="text" 
              value={reference}
              onChange={(e) => setReference(e.target.value)}
              placeholder="Enter reference (e.g., Genesis 1:1)"
              className="flex-grow bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-yellow-500"
            />
            <button 
              type="submit"
              disabled={loading}
              className="bg-yellow-500 hover:bg-yellow-600 text-blue-900 font-bold px-6 py-3 rounded-xl transition disabled:opacity-50"
            >
              {loading ? 'Searching...' : 'Search'}
            </button>
          </form>
          <div className="mt-4 flex flex-wrap gap-2 items-center">
            <span className="text-xs text-white/60 font-semibold uppercase tracking-wider">Quick Access:</span>
            {popularVerses.map(v => (
              <button 
                key={v}
                onClick={() => { setReference(v); }}
                className="text-xs bg-white/5 hover:bg-white/20 border border-white/10 px-3 py-1 rounded-full transition"
              >
                {v}
              </button>
            ))}
          </div>
        </div>

        <div className="p-10 min-h-[400px] flex flex-col items-center justify-center relative">
          {loading ? (
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 border-4 border-blue-100 border-t-blue-700 rounded-full animate-spin mb-4"></div>
              <p className="text-gray-400 font-serif italic">Opening the scrolls in {language}...</p>
            </div>
          ) : passage ? (
            <div className="w-full">
              <div className="text-center mb-10">
                <h2 className="text-3xl font-bold text-gray-900 serif border-b inline-block pb-2 border-yellow-200">{reference}</h2>
              </div>
              
              <div className="relative">
                <span className="absolute -top-10 -left-6 text-9xl text-gray-50 font-serif leading-none select-none">"</span>
                <p className="text-2xl text-gray-800 leading-relaxed font-serif relative z-10 text-center px-4 italic">
                  {passage.verse}
                </p>
              </div>

              {passage.context && (
                <div className="mt-16 pt-8 border-t border-gray-50 max-w-2xl mx-auto">
                  <div className="flex justify-center mb-3">
                     <h4 className="text-xs font-bold text-blue-700 uppercase tracking-widest border-b border-blue-100 pb-1">Context & Wisdom ({language})</h4>
                  </div>
                  <p className="text-gray-500 text-center leading-relaxed italic">
                    {passage.context}
                  </p>
                </div>
              )}
            </div>
          ) : (
            <p className="text-gray-400">Search for a passage to begin reading.</p>
          )}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
        <div className="bg-amber-50 p-8 rounded-3xl border border-amber-100">
          <h3 className="font-bold text-amber-900 mb-4">Reading Tip</h3>
          <p className="text-amber-800 text-sm leading-relaxed">
            Switch between languages in the top menu to compare translations. Comparing Kinyarwanda and English translations can offer deeper spiritual insights.
          </p>
        </div>
        <div className="bg-blue-50 p-8 rounded-3xl border border-blue-100">
          <h3 className="font-bold text-blue-900 mb-4">Digital Ministry</h3>
          <p className="text-blue-800 text-sm leading-relaxed">
            Currently displaying content in <strong>{language}</strong>. Our mission is to reach all corners of Rwanda with the light of the Word in every heart's tongue.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ReadBible;
