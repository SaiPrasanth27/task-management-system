import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState({ type: '', text: '' });
  
  const { resetPassword } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });
    const result = await resetPassword(email, newPassword);
    
    if (result.success) {
      setMessage({ type: 'success', text: 'Password reset successfully! Redirecting...' });
      setTimeout(() => navigate('/login'), 2000);
    } else {
      setMessage({ type: 'error', text: result.error });
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white dark:bg-darkcard border border-slate-200 dark:border-darkborder p-8 rounded-2xl shadow-xl">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Reset Password</h2>
          <p className="text-slate-500 dark:text-slate-400">Enter your email and your new password</p>
        </div>

        {message.text && (
          <div className={`mb-6 p-4 rounded-xl text-sm border text-center font-medium ${
            message.type === 'error' 
              ? 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border-red-100 dark:border-red-900/30'
              : 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 border-green-100 dark:border-green-900/30'
          }`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Email Address</label>
            <input 
              type="email" 
              required 
              placeholder="you@example.com"
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-darkborder rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
            />
          </div>
          <div>
             <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">New Password</label>
             <input 
                type="password" 
                required 
                minLength="6"
                placeholder="Min. 6 characters"
                value={newPassword} 
                onChange={(e) => setNewPassword(e.target.value)} 
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-darkborder rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
             />
          </div>
          
          <button type="submit" className="w-full bg-primary hover:bg-primary-hover text-white font-semibold py-3 px-4 rounded-xl shadow-sm focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:focus:ring-offset-slate-900 transition-all mt-6">
            Reset Password
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-slate-600 dark:text-slate-400">
          Remembered your password? <Link to="/login" className="font-semibold text-primary hover:text-primary-hover">Log in</Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;
