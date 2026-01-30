
import React, { useState, useEffect } from 'react';
import { db } from '../services/dbService';
import { BiblePost } from '../types';
import { useLanguage } from '../App';

const BiblePosts: React.FC = () => {
  const [posts, setPosts] = useState<BiblePost[]>([]);
  const { language } = useLanguage();

  useEffect(() => {
    setPosts(db.getPosts());
  }, []);

  const filteredPosts = posts.filter(p => p.language === language);
  const displayPosts = filteredPosts.length > 0 ? filteredPosts : posts;

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8 animate-fade-in">
      <header className="text-center mb-16">
        <h1 className="text-5xl font-bold text-blue-900 mb-4 serif">Scripture Reflections</h1>
        <p className="text-gray-500 max-w-xl mx-auto text-lg">
          Daily words of encouragement and wisdom from the Holy Bible, shared by the Bible Society of Rwanda.
        </p>
        <div className="mt-6 inline-flex items-center px-4 py-2 bg-blue-50 rounded-full text-[10px] font-black text-blue-700 uppercase tracking-widest border border-blue-100 shadow-sm">
           Current Language: {language}
        </div>
      </header>

      <div className="space-y-16">
        {displayPosts.length === 0 ? (
          <div className="text-center py-32 bg-white rounded-[3rem] border-2 border-dashed border-gray-100">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6 text-3xl">🕊️</div>
            <p className="text-gray-500 italic serif text-xl">No reflections found in the archives.</p>
            <p className="text-gray-400 text-sm mt-2 uppercase tracking-widest font-black">Admin must post new content</p>
          </div>
        ) : (
          displayPosts.map((post) => (
            <article key={post.id} className="bg-white rounded-[3rem] shadow-xl border border-gray-50 overflow-hidden hover:shadow-2xl transition-all duration-500">
              {post.imageUrl && (
                <div className="relative h-80 overflow-hidden">
                  <img 
                    src={post.imageUrl} 
                    alt={post.title} 
                    className="w-full h-full object-cover transition-transform duration-1000 hover:scale-105"
                  />
                  <div className="absolute top-8 right-8 bg-white/95 backdrop-blur-md px-4 py-1.5 rounded-full text-[9px] font-black text-blue-900 uppercase tracking-[0.2em] shadow-lg">
                    {post.language}
                  </div>
                </div>
              )}
              <div className="p-12">
                <div className="flex items-center gap-3 mb-6">
                  {post.tags.map(tag => (
                    <span key={tag} className="px-3 py-1 bg-blue-50 text-blue-700 text-[9px] font-black rounded-lg uppercase tracking-wider border border-blue-100">
                      {tag}
                    </span>
                  ))}
                  <span className="text-gray-300 text-[10px] ml-auto font-black uppercase tracking-widest">
                    {new Date(post.createdAt).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}
                  </span>
                </div>
                
                <h2 className="text-4xl font-bold text-gray-900 mb-6 serif leading-tight">{post.title}</h2>
                
                <div className="bg-amber-50/50 border-l-4 border-amber-300 p-8 mb-10 italic text-amber-900 font-serif text-2xl rounded-r-3xl relative">
                  <span className="absolute -top-4 -left-2 text-6xl text-amber-200/50 serif opacity-50">"</span>
                  {post.verse}
                </div>
                
                <div className="text-gray-700 leading-relaxed whitespace-pre-line prose max-w-none text-xl font-medium">
                  {post.reflection}
                </div>
                
                <div className="mt-12 pt-8 border-t border-gray-50 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-blue-700 flex items-center justify-center text-white font-black text-lg shadow-lg">
                      B
                    </div>
                    <div>
                      <span className="text-sm font-bold text-gray-900 block">Bible Society of Rwanda</span>
                      <span className="text-[9px] text-gray-400 uppercase tracking-[0.2em] font-black">Digital Ministry Team</span>
                    </div>
                  </div>
                  <button className="bg-gray-50 hover:bg-blue-50 text-blue-700 px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest transition flex items-center gap-2 border border-gray-100 hover:border-blue-100">
                    SHARE REFLECTION
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"></path></svg>
                  </button>
                </div>
              </div>
            </article>
          ))
        )}
      </div>
      
      {filteredPosts.length === 0 && posts.length > 0 && (
         <div className="mt-20 p-8 bg-blue-50 rounded-[2.5rem] border border-blue-100 text-center animate-fade-in">
            <p className="text-blue-800 text-sm font-bold uppercase tracking-widest mb-2">Note on Language</p>
            <p className="text-blue-600/80 text-sm">Showing reflections in other languages as none are yet available in <strong>{language}</strong>.</p>
         </div>
      )}
    </div>
  );
};

export default BiblePosts;
