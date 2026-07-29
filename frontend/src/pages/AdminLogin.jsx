import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
      const API_URL = import.meta.env.VITE_API_URL || '';
      const response = await fetch(`${API_URL}/api/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ username, password })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        navigate('/admin/dashboard');
      } else {
        setError(data.message || 'Login failed. Invalid credentials.');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Network error. Make sure the backend is running.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F4EC] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-[#FFFFFF] border border-[#E6DED2] p-8 rounded-2xl shadow-soft-lg">
        <h2 className="text-3xl font-serif font-bold text-[#5D4E42] mb-6 text-center">Admin Access</h2>
        
        {error && (
          <div className="mb-6 p-3 bg-red-500/10 border border-red-500/50 rounded-xl text-red-600 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#5D4E42] mb-1">Username</label>
            <input 
              type="text" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-[#FFFFFF] border border-[#E6DED2] rounded-xl px-4 py-3 text-[#5D4E42] focus:outline-none focus:border-[#B88A5A] transition-colors"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#5D4E42] mb-1">Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[#FFFFFF] border border-[#E6DED2] rounded-xl px-4 py-3 text-[#5D4E42] focus:outline-none focus:border-[#B88A5A] transition-colors"
              required
            />
          </div>
          <button 
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#B88A5A] hover:bg-[#9F7348] disabled:opacity-50 text-white font-semibold py-3 rounded-full transition-all duration-250 shadow-soft flex justify-center items-center h-12"
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
