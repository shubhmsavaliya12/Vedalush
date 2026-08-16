import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaChevronDown } from 'react-icons/fa';

const faqs = [
  {
    q: "Are your soaps really 100% organic?",
    a: "Yes! We source certified organic ingredients globally. Our products contain absolutely no synthetic fragrances, parabens, sulfates, or artificial colors. We rely entirely on nature."
  },
  {
    q: "How long does a bar of Vedalush soap last?",
    a: "With daily use, our 120g soap bars typically last between 3 to 4 weeks. To extend the life of your soap, we recommend keeping it dry between uses on a well-draining soap dish."
  },
  {
    q: "Is your packaging eco-friendly?",
    a: "Absolutely. Sustainability is at our core. All our packaging is 100% recyclable, biodegradable, and made from post-consumer recycled materials."
  },
  {
    q: "Can I use these soaps on my face?",
    a: "Many of our customers use our gentle formulations (like Rose & Goat Milk) on their faces. However, as facial skin is more delicate, we recommend doing a patch test first or choosing a bar specifically tailored to your facial skin type."
  }
];

const FAQ = () => {
  const [activeFaq, setActiveFaq] = useState(null);

  return (
    <section id="faq" className="py-20 md:py-32 bg-[#F8F4EC]">
      <div className="max-w-6xl mx-auto px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-20 items-start">
          
          {/* Left Column: Heading & Answer Display */}
          <div className="lg:w-5/12 flex flex-col justify-between sticky top-24">
            <div className="mb-8 lg:mb-12">
              <span className="text-[#B88A5A] tracking-[0.2em] text-xs uppercase font-semibold mb-3 block">Learn More</span>
              <h2 className="text-4xl md:text-5xl font-serif font-bold text-[#5D4E42] mb-4">Frequently Asked Questions</h2>
              <p className="text-[#6F6A65] font-light text-lg">Everything you need to know about our organic soaps.</p>
            </div>

            {/* Desktop Answer Display */}
            <div className="hidden lg:block bg-white rounded-3xl p-10 border border-[#E6DED2] shadow-sm relative min-h-[260px] flex-shrink-0">
              <div className="absolute top-4 right-6 text-8xl font-serif text-[#F8F4EC] pointer-events-none z-0 select-none">?</div>
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeFaq ?? 'empty'}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="relative z-10"
                >
                  {activeFaq !== null ? (
                    <>
                      <h4 className="text-xl font-serif font-bold text-[#5D4E42] mb-4 leading-tight">{faqs[activeFaq].q}</h4>
                      <div className="w-12 h-[1px] bg-[#B88A5A] mb-4"></div>
                      <p className="text-[#6F6A65] font-light leading-relaxed">{faqs[activeFaq].a}</p>
                    </>
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center text-center pt-12">
                      <div className="w-12 h-12 rounded-full border border-[#E6DED2] flex items-center justify-center text-[#B88A5A] mb-4">
                        <span className="font-serif italic font-bold">i</span>
                      </div>
                      <p className="text-[#6F6A65]/70 font-light italic">Select a question from the list to view its answer.</p>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* Right Column: Question List */}
          <div className="lg:w-7/12 flex flex-col justify-center w-full">
            <div className="relative">
              {/* Vertical Line indicator */}
              <div className="hidden lg:block absolute left-[15px] top-6 bottom-6 w-[1px] bg-[#E6DED2] z-0"></div>
              
              {faqs.map((faq, i) => (
                <div key={i} className="relative z-10">
                  <button 
                    onClick={() => setActiveFaq(activeFaq === i ? null : i)}
                    className={`w-full text-left py-6 group flex items-start gap-6 lg:border-none transition-all duration-300 ${i !== faqs.length - 1 ? 'border-b border-[#E6DED2]/60' : ''}`}
                  >
                    {/* Custom Bullet Indicator (Desktop only) */}
                    <div className={`hidden lg:flex shrink-0 w-8 h-8 rounded-full border bg-[#F8F4EC] flex items-center justify-center mt-1 transition-all duration-500 ${activeFaq === i ? 'border-[#B88A5A] shadow-md scale-110' : 'border-[#E6DED2] group-hover:border-[#B88A5A]/50'}`}>
                      <div className={`w-2.5 h-2.5 rounded-full transition-all duration-500 ${activeFaq === i ? 'bg-[#B88A5A] scale-100' : 'bg-transparent scale-0'}`}></div>
                    </div>
                    
                    <div className="flex-1 pr-4 lg:pr-0">
                       <h3 className={`text-xl lg:text-2xl font-serif font-bold leading-tight transition-colors duration-300 ${activeFaq === i ? 'text-[#B88A5A]' : 'text-[#5D4E42] group-hover:text-[#B88A5A]'}`}>
                         {faq.q}
                       </h3>
                    </div>

                    {/* Mobile Chevron */}
                    <div className="lg:hidden shrink-0 mt-1">
                      <motion.div animate={{ rotate: activeFaq === i ? 180 : 0 }} transition={{ duration: 0.3 }}>
                        <FaChevronDown className={`transition-colors ${activeFaq === i ? 'text-[#B88A5A]' : 'text-[#E6DED2]'}`} size={18} />
                      </motion.div>
                    </div>
                  </button>

                  {/* Mobile Accordion Answer */}
                  <div className="lg:hidden">
                    <AnimatePresence>
                      {activeFaq === i && (
                        <motion.div 
                          initial={{ height: 0, opacity: 0 }} 
                          animate={{ height: 'auto', opacity: 1 }} 
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden"
                        >
                          <p className="pb-8 text-[#6F6A65] font-light leading-relaxed">{faq.a}</p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQ;

