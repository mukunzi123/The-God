
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User } from '../types';
import { db } from '../services/dbService';

interface LoginProps {
  onLogin: (user: User) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // THE MASTER ADMIN EMAIL - Only this identity can access administrative tools
  const MASTER_ADMIN_EMAIL = 'mukunzifabien5@gmail.com';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const users = db.getUsers();
    let user = users.find(u => u.email.toLowerCase() === email.trim().toLowerCase());

    if (user) {
      // Identity Check: Force admin role ONLY for the master email
      if (user.email.toLowerCase() === MASTER_ADMIN_EMAIL.toLowerCase()) {
        user = { ...user, role: 'admin' };
      } else {
        user = { ...user, role: 'user' };
      }

      onLogin(user);
      navigate(user.role === 'admin' ? '/admin' : '/');
    } else {
      setError('Invalid email or password. Please check your credentials.');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 animate-fade-in">
      <div className="bg-white p-10 rounded-[3rem] shadow-2xl w-full max-w-md border border-gray-100 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 bg-blue-700"></div>
        
        <div className="text-center mb-10">
          <div className="w-20 h-20 bg-blue-700 rounded-3xl flex items-center justify-center text-white font-bold text-4xl mx-auto mb-6 shadow-xl shadow-blue-100">B</div>
          <h1 className="text-3xl font-bold text-blue-900 serif">BSR Portal</h1>
          <p className="text-gray-500 mt-2 font-light">Sign in to your sacred workspace</p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-2xl text-xs font-bold mb-6 border border-red-100 flex items-center gap-2">
            <span>⚠️</span> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2 pl-1">Email Address</label>
            <input 
              required
              type="email" 
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition font-medium"
              placeholder="name@example.com"
            />
          </div>
          <div>
            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2 pl-1">Password</label>
            <input 
              required
              type="password" 
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition font-medium"
              placeholder="••••••••"
            />
          </div>

          <button 
            type="submit"
            className="w-full bg-blue-700 hover:bg-blue-800 text-white font-black py-5 rounded-2xl transition shadow-xl shadow-blue-100 uppercase tracking-widest text-sm"
          >
            Enter Ministry
          </button>
        </form>

        <div className="mt-10 pt-8 border-t border-gray-50 text-center">
          <p className="text-gray-400 text-sm">New to the society? <Link to="/signup" className="text-blue-700 font-bold hover:underline">Create community account</Link></p>
        </div>
      </div>
    </div>
  );
};

export default Login;
