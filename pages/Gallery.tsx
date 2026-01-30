
import React, { useEffect, useState } from 'react';
import { db } from '../services/dbService';
import { GalleryImage } from '../types';

const GalleryPage: React.FC = () => {
  const [gallery, setGallery] = useState<GalleryImage[]>([]);

  useEffect(() => {
    setGallery(db.getGallery());
  }, []);

  return (
    <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8 animate-fade-in">
      <header className="text-center mb-20">
        <span className="text-blue-600 font-black uppercase tracking-[0.4em] text-[10px] mb-4 block">Our Visual Journey</span>
        <h1 className="text-6xl font-bold text-gray-900 mb-6 serif">Moments of Faith</h1>
        <p className="text-gray-500 max-w-2xl mx-auto text-lg font-light leading-relaxed">
          Explore the visual history of the Bible Society of Rwanda. From rural distribution missions to community gatherings in Kigali.
        </p>
      </header>

      {gallery.length === 0 ? (
        <div className="text-center py-32 bg-white rounded-[3rem] border-2 border-dashed border-gray-100">
           <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6 text-3xl">📸</div>
           <p className="text-gray-400 font-medium serif text-xl italic">Our gallery is currently being curated.</p>
           <p className="text-gray-300 text-sm mt-2 uppercase tracking-widest font-bold">Check back soon for inspiring moments</p>
        </div>
      ) : (
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-8 space-y-8">
          {gallery.map((img) => (
            <div key={img.id} className="break-inside-avoid group relative rounded-3xl overflow-hidden shadow-xl bg-white border border-gray-100 hover:shadow-2xl transition-all duration-500">
              <img 
                src={img.url} 
                alt={img.caption} 
                className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="p-6 bg-white">
                <p className="text-gray-800 font-serif italic text-lg leading-snug mb-2">"{img.caption}"</p>
                <div className="flex justify-between items-center pt-2 border-t border-gray-50">
                   <span className="text-[10px] font-black text-blue-700 uppercase tracking-widest">BSR Ministry</span>
                   <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                     {new Date(img.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short' })}
                   </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-24 pt-12 border-t border-gray-100 text-center">
         <p className="text-gray-400 text-sm italic serif">"Every picture tells a story of God's grace in Rwanda."</p>
      </div>
    </div>
  );
};

export default GalleryPage;
