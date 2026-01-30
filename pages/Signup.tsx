
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User } from '../types';
import { db } from '../services/dbService';

interface SignupProps {
  onLogin: (user: User) => void;
}

const Signup: React.FC<SignupProps> = ({ onLogin }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const MASTER_ADMIN_EMAIL = 'mukunzifabien5@gmail.com';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Check if email already exists in local database
    const existingUsers = db.getUsers();
    if (existingUsers.find(u => u.email.toLowerCase() === formData.email.toLowerCase())) {
      setError("An account with this email already exists. If this is you, please log in.");
      return;
    }
    
    // Create the new user. 
    // If it's your master email, the Login page will automatically upgrade it to admin.
    const newUser: User = {
      id: Date.now().toString(),
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      role: formData.email.toLowerCase() === MASTER_ADMIN_EMAIL.toLowerCase() ? 'admin' : 'user'
    };

    db.saveUser(newUser);
    onLogin(newUser);
    
    // Redirect admin to dashboard, others to home
    if (newUser.role === 'admin') {
      navigate('/admin');
    } else {
      navigate('/');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 animate-fade-in py-12">
      <div className="bg-white p-10 rounded-[3rem] shadow-2xl w-full max-w-md border border-gray-100 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 bg-blue-700"></div>

        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-blue-900 serif">Join BSR</h1>
          <p className="text-gray-500 mt-2 font-light">Create your community or admin account</p>
        </div>

        {error && (
          <div className="bg-amber-50 text-amber-700 p-4 rounded-2xl text-xs font-bold mb-6 border border-amber-100">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2 pl-1">Full Name</label>
            <input 
              required
              type="text" 
              value={formData.name}
              onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition font-medium"
              placeholder="Abayo John"
            />
          </div>
          <div>
            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2 pl-1">Email Address</label>
            <input 
              required
              type="email" 
              value={formData.email}
              onChange={e => setFormData(prev => ({ ...prev, email: e.target.value }))}
              className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition font-medium"
              placeholder="name@example.com"
            />
          </div>
          <div>
            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2 pl-1">Phone Number</label>
            <input 
              required
              type="tel" 
              value={formData.phone}
              onChange={e => setFormData(prev => ({ ...prev, phone: e.target.value }))}
              className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition font-medium"
              placeholder="+250 7XX XXX XXX"
            />
          </div>
          <div>
            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2 pl-1">Password</label>
            <input 
              required
              type="password" 
              value={formData.password}
              onChange={e => setFormData(prev => ({ ...prev, password: e.target.value }))}
              className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition font-medium"
              placeholder="••••••••"
            />
          </div>

          {formData.email.toLowerCase() === MASTER_ADMIN_EMAIL.toLowerCase() ? (
            <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100 mt-4">
               <p className="text-[9px] text-emerald-700 font-black uppercase tracking-[0.2em] text-center">
                 Admin Identity Recognized
               </p>
            </div>
          ) : (
            <div className="p-4 bg-blue-50/50 rounded-2xl border border-blue-100/50 mt-4">
               <p className="text-[9px] text-blue-700 font-black uppercase tracking-[0.2em] text-center">
                 Community Member Access
               </p>
            </div>
          )}

          <button 
            type="submit"
            className="w-full bg-blue-700 hover:bg-blue-800 text-white font-black py-5 rounded-2xl transition shadow-xl shadow-blue-100 uppercase tracking-widest text-sm"
          >
            Create Account
          </button>
        </form>

        <div className="mt-8 pt-8 border-t border-gray-50 text-center">
          <p className="text-gray-400 text-sm">Already have an account? <Link to="/login" className="text-blue-700 font-bold hover:underline">Log in</Link></p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
