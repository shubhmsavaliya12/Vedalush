import React from 'react';
import { motion } from 'framer-motion';

const Hero = () => {
  return (
    <section id="hero" className="relative w-full bg-[#2E2721] overflow-hidden pt-16 sm:pt-20 lg:pt-24">
      {/* Background Image Container: normal flow on mobile/tablet (h-auto), exact 1-screen height on desktop (lg+) */}
      <div className="relative w-full lg:h-[calc(100vh-6rem)] overflow-hidden flex items-center justify-center">
        <img
          src="/images/IMG_20260727_235144.png"
          alt="Vedalush Background"
          className="w-full h-auto lg:h-full object-contain lg:object-cover object-center block"
        />
        <div className="absolute inset-0 bg-[#2E2721]/65"></div>

        {/* Decorative Soft Warm Atmosphere */}
        <div className="absolute inset-0 overflow-hidden z-0 pointer-events-none">
          <motion.div
            animate={{ y: [0, -20, 0], opacity: [0.08, 0.15, 0.08] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -top-20 -left-20 w-96 h-96 bg-[#8E7A65] rounded-full blur-3xl opacity-10"
          />
          <motion.div
            animate={{ y: [0, 20, 0], opacity: [0.08, 0.15, 0.08] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute top-40 -right-20 w-[30rem] h-[30rem] bg-[#C19A6B] rounded-full blur-3xl opacity-10"
          />
        </div>

        {/* Main Text Content layered over the image */}
        <div className="absolute inset-0 z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center justify-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="space-y-1.5 sm:space-y-3 lg:space-y-8 flex flex-col items-center"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="space-y-1 sm:space-y-2 lg:space-y-4"
            >
              <span className="hidden md:inline-block px-2 sm:px-3.5 lg:px-5 py-0.5 sm:py-1 lg:py-2 bg-[#2E2721] text-[#F8F4EC] font-semibold tracking-widest uppercase text-[8px] sm:text-[10px] md:text-xs lg:text-sm rounded-full border border-[#E6DED2]/30 shadow-soft">
                100% Organic & Handcrafted
              </span>
              <h1 className="text-4xl sm:text-4xl md:text-5xl lg:text-7xl xl:text-8xl font-serif font-bold text-white leading-tight tracking-tight drop-shadow-md">
                Purity in Every <br />
                <span className="italic font-light text-[#C19A6B]">Lather.</span>
              </h1>
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="text-[12px] sm:text-xs md:text-base lg:text-xl text-[#F8F4EC] font-normal max-w-xs sm:max-w-md lg:max-w-xl mx-auto leading-relaxed drop-shadow-sm px-2 sm:px-4"
            >
              Experience the luxury of nature with our cold-pressed, chemical-free soaps. Nourish your skin, organically.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="hidden lg:flex flex-row items-center justify-center space-x-6 pt-4 w-auto"
            >
              <a
                href="#products"
                className="px-10 py-4 bg-[#B88A5A] text-white rounded-full text-center hover:bg-[#9F7348] transition-all duration-250 shadow-soft hover:shadow-soft-lg transform hover:-translate-y-0.5 font-semibold tracking-wide text-base inline-block"
              >
                Shop Collection
              </a>
              <a
                href="#ingredients"
                className="px-10 py-4 bg-[#2E2721] border border-[#E6DED2]/40 text-[#F8F4EC] rounded-full text-center hover:bg-[#8E7A65] hover:text-white transition-all duration-250 shadow-soft hover:shadow-soft-lg font-semibold tracking-wide text-base inline-block"
              >
                Discover Ingredients
              </a>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;

