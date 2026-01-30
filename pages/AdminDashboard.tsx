
import React, { useState, useEffect, useRef } from 'react';
import { User, BiblePost, Language, ContactMessage, GalleryImage } from '../types';
import { db } from '../services/dbService';
import { generateBibleReflection, generateMinistryImage } from '../services/geminiService';
import { useLanguage } from '../App';

interface AdminDashboardProps {
  user: User;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ user }) => {
  const { language: globalLanguage } = useLanguage();
  const [activeTab, setActiveTab] = useState<'posts' | 'messages' | 'community' | 'gallery'>('posts');
  const [posts, setPosts] = useState<BiblePost[]>([]);
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [gallery, setGallery] = useState<GalleryImage[]>([]);
  
  const [isCreating, setIsCreating] = useState(false);
  const [isAddingGallery, setIsAddingGallery] = useState(false);
  const [isAddingUser, setIsAddingUser] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isGeneratingImg, setIsGeneratingImg] = useState(false);
  
  const postFileRef = useRef<HTMLInputElement>(null);
  const galleryFileRef = useRef<HTMLInputElement>(null);

  const [newPost, setNewPost] = useState<{
    title: string;
    verse: string;
    reflection: string;
    tags: string;
    imageUrl: string;
    language: Language;
    imgMode: 'url' | 'upload' | 'ai';
    aiPrompt: string;
  }>({
    title: '',
    verse: '',
    reflection: '',
    tags: 'Reflection',
    imageUrl: '',
    language: globalLanguage,
    imgMode: 'url',
    aiPrompt: ''
  });

  const [newGalleryItem, setNewGalleryItem] = useState<{
    caption: string;
    url: string;
    imgMode: 'url' | 'upload' | 'ai';
    aiPrompt: string;
  }>({
    caption: '',
    url: '',
    imgMode: 'url',
    aiPrompt: ''
  });

  const [newUserEntry, setNewUserEntry] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'user' as 'user' | 'admin'
  });

  useEffect(() => {
    refreshData();
  }, []);

  const refreshData = () => {
    setPosts(db.getPosts());
    setMessages(db.getMessages());
    setUsers(db.getUsers());
    setGallery(db.getGallery());
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPost.title || !newPost.verse || !newPost.reflection) {
      alert("Please fill in all required fields.");
      return;
    }

    const post: BiblePost = {
      id: Date.now().toString(),
      title: newPost.title,
      verse: newPost.verse,
      reflection: newPost.reflection,
      tags: newPost.tags.split(',').map(t => t.trim()),
      authorId: user.id,
      createdAt: new Date().toISOString(),
      language: newPost.language,
      imageUrl: newPost.imageUrl || `https://images.unsplash.com/photo-1504052434569-70ad5836ab65?auto=format&fit=crop&q=80&w=800`
    };

    db.savePost(post);
    refreshData();
    setIsCreating(false);
    setNewPost({ title: '', verse: '', reflection: '', tags: 'Reflection', imageUrl: '', language: globalLanguage, imgMode: 'url', aiPrompt: '' });
  };

  const handleAddGalleryImage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGalleryItem.url || !newGalleryItem.caption) {
      alert("Please provide both an image and a caption.");
      return;
    }

    const newItem: GalleryImage = {
      id: Date.now().toString(),
      url: newGalleryItem.url,
      caption: newGalleryItem.caption,
      createdAt: new Date().toISOString()
    };

    db.saveGalleryImage(newItem);
    refreshData();
    setIsAddingGallery(false);
    setNewGalleryItem({ caption: '', url: '', imgMode: 'url', aiPrompt: '' });
  };

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    const existingUsers = db.getUsers();
    if (existingUsers.find(u => u.email.toLowerCase() === newUserEntry.email.toLowerCase())) {
      alert("This email is already registered.");
      return;
    }

    const newUser: User = {
      id: Date.now().toString(),
      ...newUserEntry
    };
    
    db.saveUser(newUser);
    refreshData();
    setIsAddingUser(false);
    setNewUserEntry({ name: '', email: '', phone: '', role: 'user' });
  };

  const handleGenerateReflection = async () => {
    if (!newPost.verse) {
      alert("Please enter a verse first.");
      return;
    }
    setIsGenerating(true);
    try {
      const result = await generateBibleReflection(newPost.verse, newPost.language);
      setNewPost(prev => ({ ...prev, reflection: result }));
    } catch (err) {
      alert("AI generation failed. Please write manually.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGenerateImgForPost = async (type: 'post' | 'gallery') => {
    const prompt = type === 'post' ? newPost.aiPrompt : newGalleryItem.aiPrompt;
    if (!prompt) {
      alert("Enter a prompt for the AI to imagine.");
      return;
    }
    setIsGeneratingImg(true);
    try {
      const result = await generateMinistryImage(prompt);
      if (result) {
        if (type === 'post') {
          setNewPost(prev => ({ ...prev, imageUrl: result }));
        } else {
          setNewGalleryItem(prev => ({ ...prev, url: result }));
        }
      }
    } catch (err) {
      alert("Image generation failed.");
    } finally {
      setIsGeneratingImg(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'post' | 'gallery') => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (type === 'post') {
          setNewPost(prev => ({ ...prev, imageUrl: reader.result as string }));
        } else {
          setNewGalleryItem(prev => ({ ...prev, url: reader.result as string }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDeletePost = (id: string) => {
    if (window.confirm("Are you sure you want to delete this reflection?")) {
      db.deletePost(id);
      refreshData();
    }
  };

  const handleDeleteGalleryImage = (id: string) => {
    if (window.confirm("Are you sure you want to delete this gallery image?")) {
      db.deleteGalleryImage(id);
      refreshData();
    }
  };

  const handleDeleteMessage = (id: string) => {
    if (window.confirm("Archive this message?")) {
      db.deleteMessage(id);
      refreshData();
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8 animate-fade-in">
      {/* Hidden file inputs */}
      <input type="file" ref={postFileRef} className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, 'post')} />
      <input type="file" ref={galleryFileRef} className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, 'gallery')} />

      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-4xl font-bold text-gray-900 serif">Admin Dashboard</h1>
            <div className="flex items-center gap-1.5 bg-blue-100 px-3 py-1 rounded-full border border-blue-200">
               <span className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-pulse"></span>
               <span className="text-[10px] font-black text-blue-700 uppercase tracking-widest">Master Admin Identity Verified</span>
            </div>
          </div>
          <p className="text-gray-500 font-medium">Shalom, <span className="text-blue-700 font-bold">{user.name}</span>. Managing the digital presence of BSR.</p>
        </div>
        <div className="flex flex-wrap gap-4">
          <button onClick={() => setIsAddingUser(true)} className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition shadow-lg transform hover:-translate-y-1">+ Register Member</button>
          <button onClick={() => setIsAddingGallery(true)} className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition shadow-lg transform hover:-translate-y-1">+ New Gallery Image</button>
          <button onClick={() => setIsCreating(true)} className="bg-blue-700 hover:bg-blue-800 text-white px-6 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition shadow-lg transform hover:-translate-y-1">+ Create Scripture Post</button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-gray-100 mb-10 overflow-x-auto">
        <button onClick={() => setActiveTab('posts')} className={`px-8 py-5 font-black text-[10px] uppercase tracking-[0.3em] whitespace-nowrap border-b-2 transition-all ${activeTab === 'posts' ? 'border-blue-700 text-blue-700' : 'border-transparent text-gray-400 hover:text-gray-600'}`}>Reflections</button>
        <button onClick={() => setActiveTab('gallery')} className={`px-8 py-5 font-black text-[10px] uppercase tracking-[0.3em] whitespace-nowrap border-b-2 transition-all ${activeTab === 'gallery' ? 'border-purple-700 text-purple-700' : 'border-transparent text-gray-400 hover:text-gray-600'}`}>Gallery</button>
        <button onClick={() => setActiveTab('community')} className={`px-8 py-5 font-black text-[10px] uppercase tracking-[0.3em] whitespace-nowrap border-b-2 transition-all ${activeTab === 'community' ? 'border-emerald-700 text-emerald-700' : 'border-transparent text-gray-400 hover:text-gray-600'}`}>Community Access</button>
        <button onClick={() => setActiveTab('messages')} className={`px-8 py-5 font-black text-[10px] uppercase tracking-[0.3em] whitespace-nowrap border-b-2 transition-all ${activeTab === 'messages' ? 'border-amber-700 text-amber-700' : 'border-transparent text-gray-400 hover:text-gray-600'}`}>Messages</button>
      </div>

      {/* Content Areas */}
      {activeTab === 'posts' && (
        <div className="bg-white rounded-[3rem] border border-gray-50 overflow-hidden shadow-sm animate-fade-in">
           <table className="w-full text-left">
              <thead className="bg-gray-50/50 border-b border-gray-100">
                <tr>
                  <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Title</th>
                  <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Sacred Verse</th>
                  <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                 {posts.map(post => (
                   <tr key={post.id} className="hover:bg-blue-50/20 transition group">
                      <td className="px-10 py-8">
                        <div className="flex items-center gap-4">
                           <div className="w-16 h-12 rounded-xl overflow-hidden bg-gray-100 shadow-sm shrink-0">
                             <img src={post.imageUrl} className="w-full h-full object-cover" alt="" />
                           </div>
                           <span className="font-bold text-gray-900 serif text-xl">{post.title}</span>
                        </div>
                      </td>
                      <td className="px-10 py-8 italic font-serif text-gray-500">"{post.verse}"</td>
                      <td className="px-10 py-8 text-right">
                        <button onClick={() => handleDeletePost(post.id)} className="text-[10px] font-black text-red-500 uppercase tracking-widest hover:text-red-700">Delete</button>
                      </td>
                   </tr>
                 ))}
              </tbody>
           </table>
        </div>
      )}

      {activeTab === 'gallery' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 animate-fade-in">
           {gallery.map(img => (
             <div key={img.id} className="relative group rounded-[2rem] overflow-hidden aspect-square bg-gray-50 shadow-md">
                <img src={img.url} className="w-full h-full object-cover" alt={img.caption} />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-6">
                  <p className="text-white text-xs italic mb-4">"{img.caption}"</p>
                  <button onClick={() => handleDeleteGalleryImage(img.id)} className="bg-red-500 text-white py-2 rounded-xl text-[9px] font-black uppercase">Remove</button>
                </div>
             </div>
           ))}
        </div>
      )}

      {activeTab === 'community' && (
        <div className="bg-white rounded-[3rem] border border-gray-50 overflow-hidden shadow-sm animate-fade-in">
           <div className="p-8 border-b border-gray-100 bg-emerald-50/20 flex justify-between items-center">
              <h3 className="text-xs font-black uppercase tracking-widest text-emerald-800">Who Entered Email / Registered Members</h3>
              <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-[9px] font-black uppercase">{users.length} Records Found</span>
           </div>
           <table className="w-full text-left">
              <thead className="bg-gray-50/50 border-b border-gray-100">
                <tr>
                  <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Name & Identity</th>
                  <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Email Address</th>
                  <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 text-right">Role</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                 {users.map(u => (
                   <tr key={u.id} className="hover:bg-emerald-50/20 transition">
                      <td className="px-10 py-8 font-bold text-gray-900 serif text-xl">{u.name}</td>
                      <td className="px-10 py-8 text-gray-500 font-medium">{u.email}</td>
                      <td className="px-10 py-8 text-right">
                         <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${u.role === 'admin' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-400'}`}>{u.role}</span>
                      </td>
                   </tr>
                 ))}
              </tbody>
           </table>
        </div>
      )}

      {activeTab === 'messages' && (
        <div className="space-y-6 animate-fade-in">
           {messages.map(msg => (
             <div key={msg.id} className="bg-white p-10 rounded-[3rem] border border-gray-50 shadow-sm relative group">
                <button onClick={() => handleDeleteMessage(msg.id)} className="absolute top-8 right-8 text-[9px] font-black text-gray-300 uppercase hover:text-red-500">Archive ✕</button>
                <h3 className="text-2xl font-bold text-gray-900 serif mb-2">{msg.subject}</h3>
                <p className="text-gray-600 leading-relaxed italic mb-6">"{msg.message}"</p>
                <div className="flex gap-6 items-center text-[10px] font-black text-gray-400 uppercase tracking-widest">
                   <span className="text-blue-600">{msg.name} ({msg.email})</span>
                   <span>{new Date(msg.createdAt).toLocaleString()}</span>
                </div>
             </div>
           ))}
        </div>
      )}

      {/* Modals */}
      {isCreating && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-md z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-[3rem] w-full max-w-4xl max-h-[90vh] overflow-y-auto p-12 shadow-2xl animate-scale-up">
             <div className="flex justify-between items-center mb-8 pb-4 border-b border-gray-100">
               <h2 className="text-3xl font-bold text-blue-900 serif">Create New Reflection</h2>
               <button onClick={() => setIsCreating(false)} className="text-gray-400 text-2xl">✕</button>
             </div>
             <form onSubmit={handleCreate} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   <div className="space-y-6">
                      <input required placeholder="Post Title" className="w-full px-6 py-4 bg-gray-50 rounded-2xl border-none outline-none focus:ring-2 focus:ring-blue-500 font-bold" value={newPost.title} onChange={e => setNewPost(prev => ({ ...prev, title: e.target.value }))} />
                      <input required placeholder="Verse Reference (e.g. John 3:16)" className="w-full px-6 py-4 bg-gray-50 rounded-2xl border-none outline-none focus:ring-2 focus:ring-blue-500 italic font-serif" value={newPost.verse} onChange={e => setNewPost(prev => ({ ...prev, verse: e.target.value }))} />
                      <div className="flex justify-between items-center">
                        <label className="text-[10px] font-black text-gray-400 uppercase">Reflection Text</label>
                        <button type="button" onClick={handleGenerateReflection} disabled={isGenerating} className="text-[9px] font-black bg-blue-100 text-blue-700 px-4 py-1.5 rounded-full uppercase tracking-widest">{isGenerating ? 'AI is Writing...' : '✨ Auto-Write with AI'}</button>
                      </div>
                      <textarea required rows={8} className="w-full px-6 py-4 bg-gray-50 rounded-3xl border-none outline-none focus:ring-2 focus:ring-blue-500 font-medium leading-relaxed" value={newPost.reflection} onChange={e => setNewPost(prev => ({ ...prev, reflection: e.target.value }))} />
                   </div>
                   <div className="space-y-6">
                      <div className="bg-gray-50 p-6 rounded-[2rem] border border-gray-100">
                         <div className="flex gap-2 mb-6 bg-white p-1 rounded-xl shadow-sm">
                            {(['url', 'upload', 'ai'] as const).map(m => (
                              <button key={m} type="button" onClick={() => setNewPost(p => ({ ...p, imgMode: m }))} className={`flex-1 py-2 text-[9px] font-black uppercase rounded-lg ${newPost.imgMode === m ? 'bg-blue-700 text-white' : 'text-gray-400'}`}>{m}</button>
                            ))}
                         </div>
                         {newPost.imgMode === 'url' && <input placeholder="Image URL..." className="w-full px-5 py-3 bg-white rounded-xl text-sm" value={newPost.imageUrl} onChange={e => setNewPost(p => ({ ...p, imageUrl: e.target.value }))} />}
                         {newPost.imgMode === 'upload' && (
                           <button type="button" onClick={() => postFileRef.current?.click()} className="w-full py-3 bg-white border border-dashed border-gray-300 rounded-xl text-gray-500 text-xs font-bold uppercase tracking-widest hover:bg-gray-100">Select Image File</button>
                         )}
                         {newPost.imgMode === 'ai' && (
                           <div className="space-y-2">
                             <input placeholder="Image Prompt..." className="w-full px-5 py-3 bg-white rounded-xl text-sm" value={newPost.aiPrompt} onChange={e => setNewPost(p => ({ ...p, aiPrompt: e.target.value }))} />
                             <button type="button" onClick={() => handleGenerateImgForPost('post')} disabled={isGeneratingImg} className="w-full py-3 bg-emerald-600 text-white text-[9px] font-black uppercase rounded-xl">{isGeneratingImg ? 'Imagining...' : 'Generate AI Image'}</button>
                           </div>
                         )}
                         {newPost.imageUrl && <div className="mt-4 h-48 rounded-2xl overflow-hidden border-2 border-white shadow-md"><img src={newPost.imageUrl} className="w-full h-full object-cover" alt="" /></div>}
                      </div>
                      <input placeholder="Tags (comma separated)" className="w-full px-6 py-4 bg-gray-50 rounded-2xl border-none outline-none focus:ring-2 focus:ring-blue-500 font-bold" value={newPost.tags} onChange={e => setNewPost(prev => ({ ...prev, tags: e.target.value }))} />
                      <select className="w-full px-6 py-4 bg-gray-50 rounded-2xl border-none font-bold" value={newPost.language} onChange={e => setNewPost(prev => ({ ...prev, language: e.target.value as any }))}>
                        <option value="English">English</option>
                        <option value="Kinyarwanda">Kinyarwanda</option>
                        <option value="French">Français</option>
                      </select>
                   </div>
                </div>
                <button type="submit" className="w-full py-6 bg-blue-700 text-white rounded-[2rem] font-black uppercase tracking-[0.2em] shadow-xl transform transition-transform hover:-translate-y-1">Publish to Ministry</button>
             </form>
          </div>
        </div>
      )}

      {isAddingGallery && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-md z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-[3rem] w-full max-w-lg p-12 shadow-2xl animate-scale-up overflow-y-auto max-h-[90vh]">
             <h2 className="text-3xl font-bold text-purple-900 serif mb-8">Add to Gallery</h2>
             <form onSubmit={handleAddGalleryImage} className="space-y-6">
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Caption</label>
                  <input required placeholder="Moment Caption..." className="w-full px-6 py-4 bg-gray-50 rounded-2xl border-none outline-none focus:ring-2 focus:ring-purple-500 font-medium" value={newGalleryItem.caption} onChange={e => setNewGalleryItem(p => ({ ...p, caption: e.target.value }))} />
                </div>

                <div className="bg-gray-50 p-6 rounded-[2rem] border border-gray-100">
                   <div className="flex gap-2 mb-6 bg-white p-1 rounded-xl shadow-sm">
                      {(['url', 'upload', 'ai'] as const).map(m => (
                        <button key={m} type="button" onClick={() => setNewGalleryItem(p => ({ ...p, imgMode: m }))} className={`flex-1 py-2 text-[9px] font-black uppercase rounded-lg ${newGalleryItem.imgMode === m ? 'bg-purple-700 text-white' : 'text-gray-400'}`}>{m}</button>
                      ))}
                   </div>
                   
                   {newGalleryItem.imgMode === 'url' && (
                     <input required placeholder="Image URL..." className="w-full px-5 py-3 bg-white rounded-xl text-sm outline-none focus:ring-2 focus:ring-purple-300" value={newGalleryItem.url} onChange={e => setNewGalleryItem(p => ({ ...p, url: e.target.value }))} />
                   )}
                   
                   {newGalleryItem.imgMode === 'upload' && (
                     <button type="button" onClick={() => galleryFileRef.current?.click()} className="w-full py-4 bg-white border border-dashed border-gray-300 rounded-xl text-gray-500 text-[10px] font-black uppercase tracking-widest hover:bg-gray-100">Select Local File</button>
                   )}
                   
                   {newGalleryItem.imgMode === 'ai' && (
                     <div className="space-y-2">
                       <input placeholder="What should AI imagine?" className="w-full px-5 py-3 bg-white rounded-xl text-sm outline-none focus:ring-2 focus:ring-purple-300" value={newGalleryItem.aiPrompt} onChange={e => setNewGalleryItem(p => ({ ...p, aiPrompt: e.target.value }))} />
                       <button type="button" onClick={() => handleGenerateImgForPost('gallery')} disabled={isGeneratingImg} className="w-full py-3 bg-purple-600 text-white text-[9px] font-black uppercase rounded-xl shadow-md">{isGeneratingImg ? 'Processing...' : 'Generate with Gemini'}</button>
                     </div>
                   )}

                   {newGalleryItem.url && (
                     <div className="mt-4 aspect-video rounded-xl overflow-hidden border-2 border-white shadow-sm">
                       <img src={newGalleryItem.url} className="w-full h-full object-cover" alt="Preview" />
                     </div>
                   )}
                </div>

                <div className="flex gap-4 pt-4">
                  <button type="button" onClick={() => setIsAddingGallery(false)} className="flex-1 py-4 bg-gray-100 rounded-2xl font-black text-[10px] uppercase text-gray-500 hover:bg-gray-200">Cancel</button>
                  <button type="submit" className="flex-1 py-4 bg-purple-600 text-white rounded-2xl font-black text-[10px] uppercase shadow-lg hover:bg-purple-700">Add to Gallery</button>
                </div>
             </form>
          </div>
        </div>
      )}

      {isAddingUser && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-md z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-[3rem] w-full max-w-lg p-12 shadow-2xl">
             <h2 className="text-3xl font-bold text-emerald-900 serif mb-8">Register Member</h2>
             <form onSubmit={handleAddUser} className="space-y-6">
                <input required placeholder="Full Name" className="w-full px-6 py-4 bg-gray-50 rounded-2xl border-none font-medium" value={newUserEntry.name} onChange={e => setNewUserEntry(p => ({ ...p, name: e.target.value }))} />
                <input required type="email" placeholder="Email" className="w-full px-6 py-4 bg-gray-50 rounded-2xl border-none font-medium" value={newUserEntry.email} onChange={e => setNewUserEntry(p => ({ ...p, email: e.target.value }))} />
                <select className="w-full px-6 py-4 bg-gray-50 rounded-2xl border-none font-bold" value={newUserEntry.role} onChange={e => setNewUserEntry(p => ({ ...p, role: e.target.value as any }))}>
                  <option value="user">Community User</option>
                  <option value="admin">System Admin</option>
                </select>
                <div className="flex gap-4">
                  <button type="button" onClick={() => setIsAddingUser(false)} className="flex-1 py-4 bg-gray-100 rounded-xl font-black text-[10px] uppercase">Cancel</button>
                  <button type="submit" className="flex-1 py-4 bg-emerald-600 text-white rounded-xl font-black text-[10px] uppercase shadow-lg">Add Record</button>
                </div>
             </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
