
import React, { useState } from 'react';
import { db } from '../services/dbService';
import { ContactMessage } from '../types';
import { Link } from 'react-router-dom';

const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newMessage: ContactMessage = {
      id: Date.now().toString(),
      ...formData,
      createdAt: new Date().toISOString()
    };

    // Save to local DB so admin can see it in dashboard
    db.saveMessage(newMessage);

    // Trigger email client for the user to send to the admin's email
    const mailtoLink = `mailto:mukunzifabien5@gmail.com?subject=${encodeURIComponent(formData.subject)}&body=${encodeURIComponent(`Message from: ${formData.name} (${formData.email})\n\n${formData.message}`)}`;
    
    setSubmitted(true);
    
    // Attempt to open email client
    window.location.href = mailtoLink;
  };

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto py-24 px-4 text-center animate-fade-in">
        <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Message Saved!</h2>
        <div className="bg-blue-50 p-8 rounded-[2rem] border border-blue-100 mb-8 text-left">
          <h4 className="font-bold text-blue-900 mb-2">What happens next?</h4>
          <ul className="space-y-3 text-blue-800 text-sm">
            <li className="flex gap-2"><span>✅</span> Your comment is stored in the <strong>Admin Dashboard</strong> for our team to review.</li>
            <li className="flex gap-2"><span>📧</span> Your email app should have opened a draft to <strong>mukunzifabien5@gmail.com</strong>. (You must press "Send" in your email app to finalize this).</li>
          </ul>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button 
            onClick={() => setSubmitted(false)}
            className="bg-blue-700 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-800 transition"
          >
            Send Another Message
          </button>
          <Link 
            to="/admin"
            className="bg-white border-2 border-blue-700 text-blue-700 px-8 py-3 rounded-xl font-bold hover:bg-gray-50 transition"
          >
            View Admin Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8 animate-fade-in">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
        <div>
          <span className="text-blue-600 font-black uppercase tracking-[0.3em] text-[10px] mb-4 block">Get in Touch</span>
          <h1 className="text-5xl font-bold text-gray-900 mb-8 serif">Connect with our Ministry</h1>
          <p className="text-gray-600 text-lg leading-relaxed mb-12">
            Have questions about our translations, need pastoral guidance, or want to support our mission? Our digital ministry team is ready to assist you.
          </p>

          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-blue-50 p-5 rounded-3xl border border-blue-100 flex items-center gap-4 shadow-sm">
                <div className="w-12 h-12 bg-blue-700 rounded-xl flex items-center justify-center text-white text-lg font-black shrink-0">
                  KJ
                </div>
                <div>
                  <h4 className="font-bold text-blue-900 uppercase tracking-widest text-[8px] mb-0.5">Representative</h4>
                  <p className="text-sm font-bold text-gray-900 serif">Kubwimana Jado</p>
                </div>
              </div>

              <div className="bg-emerald-50 p-5 rounded-3xl border border-emerald-100 flex items-center gap-4 shadow-sm">
                <div className="w-12 h-12 bg-emerald-700 rounded-xl flex items-center justify-center text-white text-lg font-black shrink-0">
                  MF
                </div>
                <div>
                  <h4 className="font-bold text-emerald-900 uppercase tracking-widest text-[8px] mb-0.5">Digital Lead</h4>
                  <p className="text-sm font-bold text-gray-900 serif">Mukunzi Fabien</p>
                </div>
              </div>
            </div>

            <div className="space-y-6 pt-4">
              <div className="flex items-start gap-6 pl-2">
                <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400 shadow-sm border border-gray-100">
                  <span>📍</span>
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 uppercase tracking-widest text-xs mb-1">Our Office</h4>
                  <p className="text-gray-500">Kigali, Rwanda. BP 435</p>
                </div>
              </div>
              <div className="flex items-start gap-6 pl-2">
                <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400 shadow-sm border border-gray-100">
                  <span>✉️</span>
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 uppercase tracking-widest text-xs mb-1">Email Us</h4>
                  <p className="text-gray-500 font-bold">mukunzifabien5@gmail.com</p>
                </div>
              </div>
              <div className="flex items-start gap-6 pl-2">
                <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400 shadow-sm border border-gray-100">
                  <span>📞</span>
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 uppercase tracking-widest text-xs mb-1">Call Us</h4>
                  <p className="text-gray-500">+250 794 497 850</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-10 rounded-[2.5rem] shadow-2xl border border-gray-100">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-gray-400 mb-2 uppercase tracking-widest">Your Name</label>
                <input 
                  required
                  type="text" 
                  value={formData.name}
                  onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition"
                  placeholder="Fabien"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 mb-2 uppercase tracking-widest">Email Address</label>
                <input 
                  required
                  type="email" 
                  value={formData.email}
                  onChange={e => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition"
                  placeholder="fabien@example.com"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-400 mb-2 uppercase tracking-widest">Subject</label>
              <input 
                required
                type="text" 
                value={formData.subject}
                onChange={e => setFormData(prev => ({ ...prev, subject: e.target.value }))}
                className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition"
                placeholder="How can we help?"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-400 mb-2 uppercase tracking-widest">Your Message / Comment</label>
              <textarea 
                required
                rows={5}
                value={formData.message}
                onChange={e => setFormData(prev => ({ ...prev, message: e.target.value }))}
                className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition resize-none"
                placeholder="Share your thoughts or prayer requests..."
              />
            </div>
            <button 
              type="submit"
              className="w-full bg-blue-700 hover:bg-blue-800 text-white font-bold py-5 rounded-2xl transition shadow-xl shadow-blue-100 text-lg"
            >
              Submit Feedback
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;
