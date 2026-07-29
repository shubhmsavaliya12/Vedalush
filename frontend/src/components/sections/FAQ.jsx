import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiPlus, HiMinus } from 'react-icons/hi';

const faqs = [
  {
    question: "Are your soaps really 100% organic?",
    answer: "Yes! We source certified organic ingredients globally. Our products contain absolutely no synthetic fragrances, parabens, sulfates, or artificial colors. We rely entirely on nature."
  },
  {
    question: "How long does a bar of Vedalush soap last?",
    answer: "With daily use, our 120g soap bars typically last between 3 to 4 weeks. To extend the life of your soap, we recommend keeping it dry between uses on a well-draining soap dish."
  },
  {
    question: "Is your packaging eco-friendly?",
    answer: "Absolutely. Sustainability is at our core. All our packaging is 100% recyclable, biodegradable, and made from post-consumer recycled materials."
  },
  {
    question: "Can I use these soaps on my face?",
    answer: "Many of our customers use our gentle formulations (like Rose & Goat Milk) on their faces. However, as facial skin is more delicate, we recommend doing a patch test first or choosing a bar specifically tailored to your facial skin type."
  }
];

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(0);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? -1 : index);
  };

  return (
    <section id="faq" className="py-24 bg-[#FDFBF7]">
      <div className="max-w-4xl mx-auto px-6 lg:px-8">
        
        <div className="text-center mb-16 space-y-4">
          <motion.span 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-[#8E7A65] font-semibold tracking-widest uppercase text-sm"
          >
            Learn More
          </motion.span>
          <motion.h2 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-serif font-bold text-[#5D4E42]"
          >
            Frequently Asked Questions
          </motion.h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-[#FFFFFF] rounded-2xl shadow-soft hover:shadow-soft-lg transition-all duration-250 border border-[#E6DED2] overflow-hidden"
            >
              <button 
                onClick={() => toggleFAQ(index)}
                className="w-full flex justify-between items-center p-6 text-left focus:outline-none"
              >
                <h3 className="text-lg font-serif font-bold text-[#5D4E42]">{faq.question}</h3>
                <span className="text-[#8E7A65] ml-4">
                  {openIndex === index ? <HiMinus size={20} /> : <HiPlus size={20} />}
                </span>
              </button>
              
              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                  >
                    <div className="p-6 pt-0 text-[#6F6A65] font-normal leading-relaxed border-t border-[#E6DED2]/40">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
        
      </div>
    </section>
  );
};

export default FAQ;

