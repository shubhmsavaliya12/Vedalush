import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/ui/Navbar';
import Footer from '../components/ui/Footer';
import { HiOutlineLockClosed, HiOutlineArrowLeft } from 'react-icons/hi';
import { useCart } from '../context/CartContext';

const Checkout = () => {
  const navigate = useNavigate();
  const { openCart } = useCart();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleReturnToCart = (e) => {
    e.preventDefault();
    navigate(-1);
    setTimeout(() => {
      openCart();
    }, 100);
  };

  return (
    <div className="min-h-screen bg-nature-50 flex flex-col font-sans selection:bg-[#D5C4A1] selection:text-[#3D332B]">
      <Navbar />
      
      <main className="flex-grow flex items-center justify-center relative overflow-hidden pt-50 pb-16">
        {/* Soft Background Accent */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] max-w-[600px] max-h-[600px] bg-[#E8DCC4] rounded-full blur-[120px] opacity-40 pointer-events-none" />

        <div className="relative z-10 w-full max-w-3xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="bg-white/80 backdrop-blur-xl border border-nature-200 shadow-soft-2xl rounded-3xl p-8 md:p-16 text-center flex flex-col items-center"
          >
            <div className="w-20 h-20 bg-nature-100 text-nature-800 rounded-full flex items-center justify-center mb-8 shadow-inner border border-nature-200">
              <HiOutlineLockClosed size={36} className="opacity-80" />
            </div>

            <h1 className="text-4xl md:text-5xl font-serif text-nature-900 font-bold tracking-tight mb-4">
              Checkout Coming Soon
            </h1>
            
            <div className="w-12 h-1 bg-nature-400 mb-6 rounded-full" />
            
            <p className="text-nature-600 font-light text-base md:text-lg max-w-lg mb-10 leading-relaxed">
              We are currently crafting a seamless, highly secure checkout experience for you. This feature will be blooming shortly. Stay tuned to bring Vedalush to your doorstep!
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
              <button 
                onClick={handleReturnToCart}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3.5 bg-nature-900 text-white text-sm font-semibold uppercase tracking-widest rounded-xl hover:bg-nature-800 hover:shadow-lg transition-all duration-300 active:scale-[0.98]"
              >
                <HiOutlineArrowLeft size={16} />
                Return to Cart
              </button>
              <Link 
                to="/#products"
                className="w-full sm:w-auto px-8 py-3.5 bg-transparent text-nature-900 border border-nature-300 text-sm font-semibold uppercase tracking-widest rounded-xl hover:bg-nature-50 transition-all duration-300 active:scale-[0.98]"
              >
                Keep Exploring
              </Link>
            </div>
            
            <p className="text-[10px] uppercase tracking-widest text-nature-400 mt-12">
              100% Secure • Encrypted Connections
            </p>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Checkout;
