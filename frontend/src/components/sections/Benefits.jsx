import React from 'react';
import { motion } from 'framer-motion';
import { PiPlantLight, PiDropLight, PiHandHeartLight, PiRabbitLight } from 'react-icons/pi';

const Benefits = () => {
  return (
    <section id="benefits" className="py-20 bg-[#F8F4EC]">
      <div className="max-w-6xl mx-auto px-6 lg:px-8">
        
        <div className="text-center mb-16 space-y-4">
          <motion.span 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-[#B88A5A] tracking-[0.2em] text-xs uppercase font-semibold block"
          >
            Why Choose Us
          </motion.span>
          <motion.h2 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-serif font-bold text-[#5D4E42]"
          >
            The Vedalush Promise
          </motion.h2>
        </div>

        {/* The Radial Quadrant Plaque */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="relative max-w-4xl mx-auto bg-white rounded-[2rem] sm:rounded-[2.5rem] border border-[#E6DED2] shadow-sm overflow-hidden p-6 py-10 sm:p-16"
        >
          {/* Central Logo/Badge */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-14 h-14 sm:w-20 sm:h-20 bg-[#5D4E42] rounded-full z-20 flex items-center justify-center shadow-lg border-[4px] sm:border-[6px] border-white hover:scale-110 transition-transform duration-500">
            <span className="text-[#FDFBF7] font-serif italic font-bold text-xl sm:text-3xl">V</span>
          </div>
          
          {/* Horizontal Line */}
          <div className="absolute top-1/2 left-6 right-6 sm:left-12 sm:right-12 h-[1px] bg-[#E6DED2]/80 -translate-y-1/2 z-10"></div>
          
          {/* Vertical Line */}
          <div className="absolute left-1/2 top-6 bottom-6 sm:top-12 sm:bottom-12 w-[1px] bg-[#E6DED2]/80 -translate-x-1/2 z-10"></div>

          <div className="grid grid-cols-2 gap-x-2 sm:gap-x-0 relative z-0">
            
            {/* Top Left */}
            <div className="flex flex-col sm:flex-row items-center justify-center sm:justify-end gap-3 sm:gap-6 pb-8 sm:pr-12 sm:pb-12 group cursor-default">
              <div className="order-1 sm:order-2 w-14 h-14 sm:w-20 sm:h-20 rounded-full bg-[#FDFBF7] border border-[#E6DED2] flex items-center justify-center shrink-0 group-hover:bg-[#5D4E42] group-hover:border-[#5D4E42] transition-colors duration-500 shadow-sm group-hover:shadow-lg">
                <PiPlantLight className="w-6 h-6 sm:w-10 h-10 text-[#8E7A65] group-hover:text-white transition-colors duration-500" />
              </div>
              <h3 className="order-2 sm:order-1 text-[15px] sm:text-2xl font-serif text-[#5D4E42] font-semibold group-hover:text-[#B88A5A] transition-colors text-center sm:text-right">100% Natural</h3>
            </div>

            {/* Top Right */}
            <div className="flex flex-col sm:flex-row items-center justify-center sm:justify-start gap-3 sm:gap-6 pb-8 sm:pl-12 sm:pb-12 group cursor-default">
              <div className="order-1 w-14 h-14 sm:w-20 sm:h-20 rounded-full bg-[#FDFBF7] border border-[#E6DED2] flex items-center justify-center shrink-0 group-hover:bg-[#5D4E42] group-hover:border-[#5D4E42] transition-colors duration-500 shadow-sm group-hover:shadow-lg">
                <PiDropLight className="w-6 h-6 sm:w-10 h-10 text-[#8E7A65] group-hover:text-white transition-colors duration-500" />
              </div>
              <h3 className="order-2 text-[15px] sm:text-2xl font-serif text-[#5D4E42] font-semibold group-hover:text-[#B88A5A] transition-colors text-center sm:text-left">Deep Hydration</h3>
            </div>

            {/* Bottom Left */}
            <div className="flex flex-col sm:flex-row items-center justify-center sm:justify-end gap-3 sm:gap-6 pt-8 sm:pr-12 sm:pt-12 group cursor-default">
              <div className="order-1 sm:order-2 w-14 h-14 sm:w-20 sm:h-20 rounded-full bg-[#FDFBF7] border border-[#E6DED2] flex items-center justify-center shrink-0 group-hover:bg-[#5D4E42] group-hover:border-[#5D4E42] transition-colors duration-500 shadow-sm group-hover:shadow-lg">
                <PiHandHeartLight className="w-6 h-6 sm:w-10 h-10 text-[#8E7A65] group-hover:text-white transition-colors duration-500" />
              </div>
              <h3 className="order-2 sm:order-1 text-[15px] sm:text-2xl font-serif text-[#5D4E42] font-semibold group-hover:text-[#B88A5A] transition-colors text-center sm:text-right">Handcrafted</h3>
            </div>

            {/* Bottom Right */}
            <div className="flex flex-col sm:flex-row items-center justify-center sm:justify-start gap-3 sm:gap-6 pt-8 sm:pl-12 sm:pt-12 group cursor-default">
              <div className="order-1 w-14 h-14 sm:w-20 sm:h-20 rounded-full bg-[#FDFBF7] border border-[#E6DED2] flex items-center justify-center shrink-0 group-hover:bg-[#5D4E42] group-hover:border-[#5D4E42] transition-colors duration-500 shadow-sm group-hover:shadow-lg">
                <PiRabbitLight className="w-6 h-6 sm:w-10 h-10 text-[#8E7A65] group-hover:text-white transition-colors duration-500" />
              </div>
              <h3 className="order-2 text-[15px] sm:text-2xl font-serif text-[#5D4E42] font-semibold group-hover:text-[#B88A5A] transition-colors text-center sm:text-left">Cruelty Free</h3>
            </div>

          </div>
        </motion.div>
        
      </div>
    </section>
  );
};

export default Benefits;

