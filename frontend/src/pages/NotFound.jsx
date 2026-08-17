import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Navbar from '../components/ui/Navbar';
import Footer from '../components/ui/Footer';

const NotFound = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Floating bubble animation variants
  const bubbleVariants = {
    animate: (custom) => ({
      y: [0, -20, 0],
      x: [0, custom % 2 === 0 ? 10 : -10, 0],
      transition: {
        duration: 4 + custom,
        repeat: Infinity,
        ease: "easeInOut"
      }
    })
  };

  return (
    <div className="min-h-screen bg-nature-50 flex flex-col font-sans selection:bg-[#D5C4A1] selection:text-[#3D332B]">
      <Navbar />
      
      <main className="flex-grow flex items-center justify-center relative overflow-hidden pt-48 pb-16">
        
        {/* Abstract Background Elements (Bubbles) */}
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-30">
          {[1, 2, 3, 4, 5].map((i) => (
            <motion.div
              key={i}
              custom={i}
              variants={bubbleVariants}
              animate="animate"
              className="absolute rounded-full border border-nature-300"
              style={{
                width: `${40 + i * 20}px`,
                height: `${40 + i * 20}px`,
                top: `${20 + i * 15}%`,
                left: `${10 + (i * 25) % 80}%`,
                backgroundColor: i % 2 === 0 ? 'rgba(213, 196, 161, 0.1)' : 'transparent',
              }}
            />
          ))}
        </div>

        <div className="relative z-10 max-w-2xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col items-center"
          >
            <h1 className="text-8xl md:text-9xl font-serif text-nature-800 font-bold tracking-tighter mb-4 drop-shadow-sm">
              404
            </h1>
            
            <div className="w-16 h-[2px] bg-nature-500 mb-8 rounded-full" />
            
            <h2 className="text-2xl md:text-3xl font-serif text-nature-900 mb-4">
              Oops, this soap bubble seems to have popped.
            </h2>
            
            <p className="text-nature-600 font-light text-base md:text-lg mb-10 max-w-lg mx-auto">
              We couldn't find the page you're looking for. It might have been moved, deleted, or perhaps you just wandered off the botanical path.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
              <Link 
                to="/"
                className="w-full sm:w-auto px-8 py-3.5 bg-nature-900 text-white text-sm font-semibold uppercase tracking-widest rounded-xl hover:bg-nature-800 hover:shadow-lg transition-all duration-300 active:scale-[0.98]"
              >
                Return Home
              </Link>
              <Link 
                to="/#products"
                className="w-full sm:w-auto px-8 py-3.5 bg-white text-nature-900 border border-nature-200 text-sm font-semibold uppercase tracking-widest rounded-xl hover:bg-nature-100 hover:border-nature-300 transition-all duration-300 active:scale-[0.98]"
              >
                Shop Collection
              </Link>
            </div>
          </motion.div>
        </div>

      </main>

      <Footer />
    </div>
  );
};

export default NotFound;
