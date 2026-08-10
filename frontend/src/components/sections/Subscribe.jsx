import React, { useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';

const Subscribe = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubscribe = async (e) => {
    e.preventDefault();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      setError('Please enter a valid email address.');
      return;
    }
    setLoading(true);
    setMessage('');
    setError('');
    
    try {
      const API_URL = import.meta.env.VITE_API_URL || `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}`;
      const response = await axios.post(`${API_URL}/api/newsletter/subscribe`, { email });
      setMessage(response.data.message);
      setEmail('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to subscribe. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="bg-[#E6DED2] py-24 relative overflow-hidden">
      <div className="max-w-4xl mx-auto px-6 lg:px-8 relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl text-[#5D4E42] mb-4">
            <span style={{ fontFamily: "'Great Vibes', cursive", fontWeight: 400, fontSize: '1.4em' }}>Join the Vedalush Family</span>
          </h2>
          <p className="text-[#8E7A65] font-semibold tracking-widest uppercase text-xs md:text-sm mb-12">
            For Exclusive VIP Offers
          </p>

          <form onSubmit={handleSubscribe} className="max-w-2xl mx-auto flex flex-col md:flex-row items-center gap-6">
            <div className="w-full flex-grow relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email address"
                className="w-full bg-transparent border-0 border-b border-[#8E7A65] pb-2 text-[#5D4E42] placeholder-[#8E7A65] focus:outline-none focus:ring-0 focus:border-[#5D4E42] transition-colors duration-300 text-lg"
                required
              />
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className="w-full md:w-auto px-10 py-3 border border-[#8E7A65] rounded-full text-[#5D4E42] font-semibold tracking-wider hover:bg-[#8E7A65] hover:text-white transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed whitespace-nowrap uppercase text-sm"
            >
              {loading ? 'Subscribing...' : 'Subscribe'}
            </button>
          </form>

          {/* Messages positioned absolutely or below to avoid layout shift */}
          <div className="mt-6 h-6">
            {message && (
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm font-medium text-[#5D4E42]">
                {message}
              </motion.p>
            )}
            {error && (
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm font-medium text-red-500">
                {error}
              </motion.p>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Subscribe;
