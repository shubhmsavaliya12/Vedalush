import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const announcements = [
  "We deliver to India and internationally 🌍",
  "100% Organic & Handcrafted Soaps 🌿",
];

const AnnouncementBar = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % announcements.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? announcements.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % announcements.length);
  };

  return (
    <div className="bg-[#a79475] text-white text-xs py-2 w-full z-50 flex items-center justify-center relative overflow-hidden h-9">
      <div className="flex items-center space-x-2 sm:space-x-30">
        <button 
          onClick={handlePrev}
          className="text-white/70 hover:text-white transition-colors p-1 focus:outline-none z-10 hidden sm:block"
          aria-label="Previous announcement"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
        </button>

        <div className="w-[280px] sm:w-[300px] flex justify-center items-center h-full relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.3 }}
              className="absolute whitespace-nowrap text-sm font-medium tracking-wide flex items-center mx-5"
            >
              {announcements[currentIndex]}
            </motion.div>
          </AnimatePresence>
        </div>

        <button 
          onClick={handleNext}
          className="text-white/70 hover:text-white transition-colors p-1 focus:outline-none z-10 hidden sm:block"
          aria-label="Next announcement"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
        </button>
      </div>
    </div>
  );
};

export default AnnouncementBar;
