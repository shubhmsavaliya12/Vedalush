import React from 'react';
import { motion } from 'framer-motion';
import { PiPlantLight, PiDropLight, PiHandHeartLight, PiRabbitLight } from 'react-icons/pi';

const benefits = [
  {
    title: "100% Natural",
    icon: <PiPlantLight className="w-8 h-8 sm:w-12 sm:h-12 text-[#8E7A65]" />
  },
  {
    title: "Deep Hydration",
    icon: <PiDropLight className="w-8 h-8 sm:w-12 sm:h-12 text-[#8E7A65]" />
  },
  {
    title: "Handcrafted",
    icon: <PiHandHeartLight className="w-8 h-8 sm:w-12 sm:h-12 text-[#8E7A65]" />
  },
  {
    title: "Cruelty Free",
    icon: <PiRabbitLight className="w-8 h-8 sm:w-12 sm:h-12 text-[#8E7A65]" />
  }
];

const Benefits = () => {
  return (
    <section id="benefits" className="py-12 sm:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-8 sm:mb-16 space-y-2 sm:space-y-4">
          <motion.span 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-[#8E7A65] font-semibold tracking-widest uppercase text-xs sm:text-sm"
          >
            Why Choose Us
          </motion.span>
          <motion.h2 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-2xl sm:text-4xl md:text-5xl font-serif font-bold text-[#5D4E42]"
          >
            The Vedalush Promise
          </motion.h2>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8 lg:gap-12">
          {benefits.map((benefit, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15, duration: 0.6 }}
              className="group flex flex-col items-center text-center p-2 sm:p-6"
            >
              <div className="mb-3 sm:mb-6 p-3 sm:p-4 bg-[#F8F4EC] border border-[#E6DED2]/60 shadow-soft rounded-full flex items-center justify-center cursor-pointer group-hover:bg-[#E6DED2] group-hover:shadow-soft-lg transition-all duration-300">
                <motion.div 
                  animate={{ scale: [1, 1.15, 1] }}
                  transition={{ duration: 1, repeat: Infinity, ease: "easeInOut", delay: index * 0.1 }}
                >
                  {benefit.icon}
                </motion.div>
              </div>
              <h3 className="text-sm sm:text-xl md:text-2xl font-serif text-[#5D4E42] font-semibold">{benefit.title}</h3>
            </motion.div>
          ))}
        </div>
        
      </div>
    </section>
  );
};

export default Benefits;

