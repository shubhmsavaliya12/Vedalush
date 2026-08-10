import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const valuesData = [
  {
    title: "100% Pure & Natural",
    content: (
      <div className="space-y-3 text-sm md:text-base text-[#8E7A65] font-light">
        <ul className="list-disc pl-5 space-y-2 marker:text-[#D5C4A1]">
          <li>Made with real plants and healthy oils.</li>
          <li>Colored safely using natural earth clay.</li>
          <li>Scented with real flower and plant oils.</li>
          <li><span className="font-medium text-[#5D4E42]">Zero bad stuff:</span> No harmful chemicals, no fake colors, and no palm oil.</li>
        </ul>
      </div>
    )
  },
  {
    title: "Made by Hand in Small Batches",
    content: (
      <div className="space-y-3 text-sm md:text-base text-[#8E7A65] font-light">
        <ul className="list-disc pl-5 space-y-2 marker:text-[#D5C4A1]">
          <li>Every soap bar is made by real people, not machines.</li>
          <li>We make small amounts at a time so we can check everything carefully.</li>
          <li>This means you get a fresh, perfect, and high-quality soap every time.</li>
        </ul>
      </div>
    )
  },
  {
    title: "Traditional Method",
    content: (
      <div className="space-y-3 text-sm md:text-base text-[#8E7A65] font-light">
        <ul className="list-disc pl-5 space-y-2 marker:text-[#D5C4A1]">
          <li>We use an old, natural way of making soap called "cold-process".</li>
          <li>Because we don't use high heat, the healthy ingredients are kept safe.</li>
          <li>This makes our soap super soft and very moisturizing for your skin.</li>
        </ul>
      </div>
    )
  },
  {
    title: "Vegan & Animal Friendly",
    content: (
      <div className="space-y-3 text-sm md:text-base text-[#8E7A65] font-light">
        <ul className="list-disc pl-5 space-y-2 marker:text-[#D5C4A1]">
          <li>We never ever test our products on animals.</li>
          <li>We do not use any animal ingredients in our soaps.</li>
          <li>100% safe, kind, and friendly to all living creatures.</li>
        </ul>
      </div>
    )
  },
  {
    title: "Good for the Earth",
    content: (
      <div className="space-y-3 text-sm md:text-base text-[#8E7A65] font-light">
        <ul className="list-disc pl-5 space-y-2 marker:text-[#D5C4A1]">
          <li>We care deeply about keeping our planet clean.</li>
          <li>Our packaging uses zero plastic and safely melts away in nature.</li>
          <li>We only buy ingredients that do not hurt the environment.</li>
        </ul>
      </div>
    )
  },
  {
    title: "Small Brand, Big Heart",
    content: (
      <div className="space-y-3 text-sm md:text-base text-[#8E7A65] font-light">
        <ul className="list-disc pl-5 space-y-2 marker:text-[#D5C4A1]">
          <li>We are a small, hardworking, independent team.</li>
          <li>We care a lot more about your skin's health than making big profits.</li>
          <li>Every time you buy from us, you are supporting a real dream.</li>
        </ul>
      </div>
    )
  }
];

const Values = () => {
  const [openIndex, setOpenIndex] = useState(-1);

  const toggleAccordion = (index) => {
    setOpenIndex(openIndex === index ? -1 : index);
  };

  return (
    <section id="values" className="py-24 bg-[#F8F4EC] text-[#5D4E42]">
      <div className="max-w-6xl mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold uppercase tracking-widest text-[#5D4E42] mb-4 font-serif">
            Our Values
          </h2>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-12 lg:gap-20 items-start">
          {/* Left Side: Image */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="w-full lg:w-1/2"
          >
            <div className="aspect-[4/3] w-full overflow-hidden shadow-2xl">
              <img
                src="/images/values_soap.webp"
                alt="Handmade organic soap stacked on wooden board"
                className="w-full h-full object-cover"
              />
            </div>
          </motion.div>

          {/* Right Side: Accordion */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="w-full lg:w-1/2 flex flex-col space-y-1"
          >
            {valuesData.map((item, index) => (
              <div key={index} className="border-b border-[#5D4E42]/20 overflow-hidden">
                <button
                  onClick={() => toggleAccordion(index)}
                  className={`w-full py-4 text-left flex justify-between items-center transition-colors duration-300 cursor-pointer ${openIndex === index ? 'text-[#B88A5A]' : 'text-[#5D4E42] hover:text-[#B88A5A]'}`}
                >
                  <span className="tracking-wide text-sm md:text-base pr-4">
                    {item.title}
                  </span>
                  <motion.svg
                    animate={{ rotate: openIndex === index ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="w-4 h-4 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </motion.svg>
                </button>
                
                <AnimatePresence initial={false}>
                  {openIndex === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                      <div className="pb-6 pr-4">
                        {item.content}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Values;
