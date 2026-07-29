import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaInstagram, FaFacebookF, FaTwitter } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [openShop, setOpenShop] = useState(false);
  const [openAbout, setOpenAbout] = useState(false);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setError('Please enter a valid email.');
      return;
    }
    setLoading(true);
    setMessage('');
    setError('');
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
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
    <footer className="bg-[#3D332B] text-[#E6DED2] pt-20 pb-10 border-t border-[#8E7A65]/30">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-12 mb-16">

          {/* Brand Col */}
          <div className="space-y-6">
            <Link to="/" className="inline-block transition-transform duration-300 hover:scale-105">
              <img src="/vedalus.png" alt="Vedalush Logo" className="h-14 sm:h-16 md:h-20 w-auto object-contain brightness-0 invert" loading="lazy" decoding="async" />
            </Link>
            <p className="text-[#E6DED2] font-normal text-sm leading-relaxed max-w-xs">
              Luxurious, organic, handcrafted soaps tailored for radiant skin. Experience the purity of nature in every lather.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-[#9D948B] hover:text-white transition-colors duration-250">
                <FaInstagram size={20} />
              </a>
              <a href="#" className="text-[#9D948B] hover:text-white transition-colors duration-250">
                <FaFacebookF size={20} />
              </a>
              <a href="#" className="text-[#9D948B] hover:text-white transition-colors duration-250">
                <FaTwitter size={20} />
              </a>
            </div>
          </div>

          {/* Links Col 1: Shop */}
          <div className="border-b border-[#8E7A65]/20 md:border-none pb-4 md:pb-0">
            <button
              type="button"
              onClick={() => setOpenShop(!openShop)}
              className="w-full flex justify-between items-center text-white font-serif font-bold md:mb-6 uppercase tracking-wider text-base cursor-pointer md:cursor-default focus:outline-none"
            >
              <span>Shop</span>
              <motion.span 
                animate={{ rotate: openShop ? 180 : 0 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                className="md:hidden text-2xl font-light font-mono leading-none text-[#C19A6B] inline-block"
              >
                {openShop ? '−' : '+'}
              </motion.span>
            </button>
            <motion.div
              initial={false}
              animate={{ 
                height: openShop ? 'auto' : 0,
                opacity: openShop ? 1 : 0,
                marginTop: openShop ? 16 : 0
              }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="overflow-hidden md:!h-auto md:!opacity-100 md:!mt-0 md:!overflow-visible"
            >
              <ul className="space-y-3.5">
                <li><a href="#products" className="text-[#E6DED2] hover:text-white text-sm font-normal transition-colors duration-250">Best Sellers</a></li>
                <li><a href="#products" className="text-[#E6DED2] hover:text-white text-sm font-normal transition-colors duration-250">All Soaps</a></li>
                <li><a href="#ingredients" className="text-[#E6DED2] hover:text-white text-sm font-normal transition-colors duration-250">Ingredients</a></li>
                <li><a href="#order" className="text-[#E6DED2] hover:text-white text-sm font-normal transition-colors duration-250">Direct Order</a></li>
              </ul>
            </motion.div>
          </div>

          {/* Links Col 2: About */}
          <div className="border-b border-[#8E7A65]/20 md:border-none pb-4 md:pb-0">
            <button
              type="button"
              onClick={() => setOpenAbout(!openAbout)}
              className="w-full flex justify-between items-center text-white font-serif font-bold md:mb-6 uppercase tracking-wider text-base cursor-pointer md:cursor-default focus:outline-none"
            >
              <span>About</span>
              <motion.span 
                animate={{ rotate: openAbout ? 180 : 0 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                className="md:hidden text-2xl font-light font-mono leading-none text-[#C19A6B] inline-block"
              >
                {openAbout ? '−' : '+'}
              </motion.span>
            </button>
            <motion.div
              initial={false}
              animate={{ 
                height: openAbout ? 'auto' : 0,
                opacity: openAbout ? 1 : 0,
                marginTop: openAbout ? 16 : 0
              }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="overflow-hidden md:!h-auto md:!opacity-100 md:!mt-0 md:!overflow-visible"
            >
              <ul className="space-y-3.5">
                <li><a href="/#benefits" className="text-[#E6DED2] hover:text-white text-sm font-normal transition-colors duration-250">Our Story</a></li>
                <li><a href="/reviews" className="text-[#E6DED2] hover:text-white text-sm font-normal transition-colors duration-250">Customer Reviews</a></li>
                <li><a href="/skin-type" className="text-[#E6DED2] hover:text-white text-sm font-normal transition-colors duration-250">Skin Type Guide</a></li>
                <li><a href="/#faq" className="text-[#E6DED2] hover:text-white text-sm font-normal transition-colors duration-250">FAQ</a></li>
                <li><a href="#contact" className="text-[#E6DED2] hover:text-white text-sm font-normal transition-colors duration-250">Contact Us</a></li>
              </ul>
            </motion.div>
          </div>

          {/* Newsletter Col */}
          <div>
            <h4 className="text-white font-serif font-bold mb-6 uppercase tracking-wider text-base">Newsletter</h4>
            <p className="text-[#E6DED2] font-normal text-sm mb-4">
              Subscribe to receive updates, access to exclusive deals, and more.
            </p>
            <form onSubmit={handleSubscribe} className="flex flex-col space-y-2.5">
              <div className="flex space-x-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="w-full bg-[#2E2721] border border-[#8E7A65] rounded-xl px-4 py-2.5 text-sm text-white placeholder-[#9D948B] focus:outline-none focus:border-[#B88A5A] transition-colors duration-250"
                  required
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-[#B88A5A] text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-[#9F7348] shadow-soft transition-all duration-250 disabled:opacity-60 whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B88A5A] focus-visible:ring-offset-2"
                >
                  {loading ? '...' : 'Subscribe'}
                </button>
              </div>
              {message && <p className="text-xs text-[#C19A6B] font-medium">{message}</p>}
              {error && <p className="text-xs text-red-400 font-medium">{error}</p>}
            </form>
          </div>

        </div>

        <div className="border-t border-[#8E7A65]/40 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-[#9D948B] font-normal">
          <p>&copy; {new Date().getFullYear()} Vedalush. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-white transition-colors duration-250">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors duration-250">Terms of Service</a>
            <a href="/admin/login" className="hover:text-white transition-colors duration-250">Admin Login</a>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;

