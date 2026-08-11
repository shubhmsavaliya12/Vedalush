import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';

const Ingredients = () => {
  const [ingredients, setIngredients] = useState([]);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const fetchIngredients = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/ingredients`);
        if (response.data && Array.isArray(response.data)) {
          setIngredients(response.data);
        }
      } catch (error) {
        console.error('Error fetching ingredients:', error);
      }
    };
    fetchIngredients();
  }, []);

  return (
    <section id="ingredients" className="pb-10 bg-nature-100">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">

        <div className="text-center mb-16 space-y-4">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-nature-600 font-medium tracking-widest uppercase text-sm"
          >
            Pure Elements
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-serif font-bold text-nature-900"
          >
            Nature's Best Ingredients
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-nature-700 font-light max-w-2xl mx-auto"
          >
            We carefully select potent, organic botanicals to craft soaps that transform your daily routine into a luxurious ritual.
          </motion.p>
        </div>

        <div className="space-y-5 sm:space-y-5 md:space-y-5">
          {(isExpanded ? ingredients : ingredients.slice(0, 4)).map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1, duration: 0.7 }}
              className={`flex ${index % 2 === 1 ? 'flex-row-reverse' : 'flex-row'} items-center justify-between gap-4 sm:gap-8 md:gap-12`}
            >
              {/* Compact Arch Image for All Screens */}
              <div className="flex-shrink-0 flex justify-center">
                <div className="group relative w-36 h-44 sm:w-48 sm:h-56 md:w-56 md:h-64 lg:w-64 lg:h-72 rounded-t-full rounded-b-3xl overflow-hidden shadow-soft-lg border-2 sm:border-4 border-white bg-nature-200">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out"
                  loading="lazy" decoding="async" />
                </div>
              </div>

              {/* Text Content - High Contrast & Easily Readable */}
              <div className="flex-1 flex flex-col justify-center text-left min-w-0 py-1 sm:py-2">
                <h3 className="text-base sm:text-xl md:text-2xl lg:text-3xl font-serif font-bold text-nature-900 mb-1.5 sm:mb-3 leading-snug break-words">
                  {item.name}
                </h3>
                <p className="text-nature-900 font-normal text-xs sm:text-sm md:text-base leading-relaxed break-words">
                  {item.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {ingredients.length > 4 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-12 flex justify-center"
          >
            <button
              onClick={() => {
                setIsExpanded(!isExpanded);
                if (isExpanded) {
                  setTimeout(() => {
                    const element = document.getElementById('ingredients');
                    if (element) {
                      const y = element.getBoundingClientRect().top + window.scrollY - 160;
                      window.scrollTo({ top: y, behavior: 'smooth' });
                    }
                  }, 50);
                }
              }}
              className="group flex flex-col items-center justify-center text-nature-600 hover:text-nature-900 transition-colors duration-300 focus:outline-none"
            >
              <span className="text-sm tracking-widest uppercase font-semibold mb-5">
                {isExpanded ? 'Show Less' : 'View All Ingredients'}
              </span>
                {isExpanded ? (
                  <FaChevronUp className="w-4 h-4" />
                ) : (
                  <FaChevronDown className="w-4 h-4 animate-bounce" />
                )}
            </button>
          </motion.div>
        )}

      </div>
    </section>
  );
};

export default Ingredients;
