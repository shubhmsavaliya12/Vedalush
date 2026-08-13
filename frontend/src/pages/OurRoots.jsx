import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { HiX, HiOutlineArrowRight, HiOutlineChevronDown, HiOutlineChevronUp } from 'react-icons/hi';
import Navbar from '../components/ui/Navbar';
import Footer from '../components/ui/Footer';

const OurRoots = () => {
  const [ingredients, setIngredients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedIngredient, setSelectedIngredient] = useState(null);
  const [activeVeda, setActiveVeda] = useState(0);
  const [showAllIngredients, setShowAllIngredients] = useState(false);

  useEffect(() => {
    const fetchIngredients = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/ingredients`);
        setIngredients(response.data);
      } catch (error) {
        console.error('Error fetching ingredients:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchIngredients();
  }, []);

  // Prevent background scrolling when drawer is open
  useEffect(() => {
    if (selectedIngredient) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [selectedIngredient]);

  const vedas = [
    {
      name: 'Rigveda',
      text: 'The oldest of the texts, offering foundational knowledge on natural elements, botanical hymns, and the profound connection between the earth and human vitality.'
    },
    {
      name: 'Samaveda',
      text: 'Known for melodies and chants, it reflects the rhythmic cycles of nature and the harmony required for holistic wellness and natural balance.'
    },
    {
      name: 'Yajurveda',
      text: 'Focuses on the practical application of knowledge, detailing rituals that honor and utilize the earth\'s abundant botanical offerings.'
    },
    {
      name: 'Atharvaveda',
      text: 'Contains detailed, foundational knowledge of medicinal plants, herbs, and early Ayurvedic practices for daily well-being.'
    }
  ];

  const journeySteps = [
    { num: '01', title: 'Source', desc: 'Identifying the finest botanical regions.' },
    { num: '02', title: 'Collect', desc: 'Gathering at peak natural potency.' },
    { num: '03', title: 'Select', desc: 'Hand-sorting for the highest quality.' },
    { num: '04', title: 'Prepare', desc: 'Traditional-inspired processing.' },
    { num: '05', title: 'Formulate', desc: 'Blending into our nourishing base.' }
  ];

  const whyVedalush = [
    { title: 'Tradition', desc: 'Inspired by India\'s rich heritage.' },
    { title: 'Ingredients', desc: 'Thoughtfully selected, natural focus.' },
    { title: 'Transparency', desc: 'Understand exactly what touches your skin.' },
    { title: 'Craft', desc: 'Artisanal care in every single bar.' }
  ];

  return (
    <>
      <Helmet>
        <title>Vedalush | Rooted in Ancient Wisdom</title>
        <meta name="description" content="Discover the traditional inspiration, natural ingredients, and thoughtful sourcing philosophy behind Vedalush handmade soaps." />
      </Helmet>

      <Navbar />

      <main className="min-h-screen bg-[#FDFBF7] pt-36 lg:pt-44 font-sans text-[#5D4E42]">
        
        {/* 1. EDITORIAL HERO */}
        <section className="relative px-6 lg:px-12 max-w-[1400px] mx-auto min-h-[75vh] flex items-center mb-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center w-full">
            {/* Left Content */}
            <div className="lg:col-span-5 order-2 lg:order-1 space-y-8 pr-0 lg:pr-8">
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <span className="text-xs font-semibold tracking-[0.2em] uppercase text-[#B88A5A] mb-4 block">
                  Our Roots
                </span>
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-serif text-[#5D4E42] leading-[1.1] tracking-tight">
                  Rooted in <br/>Ancient Wisdom.
                </h1>
              </motion.div>
              
              <motion.p 
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="text-lg md:text-xl text-[#6F6A65] font-light leading-relaxed max-w-md"
              >
                Where timeless Indian traditions meet thoughtful, modern skincare. Discover the natural philosophy behind our handmade soaps.
              </motion.p>
              
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <a 
                  href="#ingredients" 
                  className="inline-flex items-center gap-3 border-b border-[#5D4E42] pb-1 text-sm font-semibold uppercase tracking-widest hover:text-[#B88A5A] hover:border-[#B88A5A] transition-colors"
                >
                  Explore Ingredients <HiOutlineArrowRight />
                </a>
              </motion.div>
            </div>
            
            {/* Right Image */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="lg:col-span-7 order-1 lg:order-2 h-[30vh] lg:h-[60vh] w-full"
            >
              <img 
                src="/images/matcha_soap_new.webp" 
                alt="Natural botanical ingredients and handmade soap" 
                className="w-full h-full object-cover rounded-xl shadow-soft"
                decoding="async"
                fetchPriority="high"
              />
            </motion.div>
          </div>
        </section>

        {/* 2. VEDALUSH STORY + VEDIC CONNECTION */}
        <section className="relative py-24 lg:py-32 border-y border-[#E6DED2]">
          {/* Subtle Manuscript Texture Background */}
          <div 
            className="absolute inset-0 opacity-40 z-0 pointer-events-none mix-blend-multiply" 
            style={{ backgroundImage: 'url(/images/manuscript-texture.webp)', backgroundSize: 'cover', backgroundPosition: 'center' }}
          />
          
          <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16 lg:gap-24 items-start">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                className="space-y-6"
              >
                <h2 className="text-xs font-semibold tracking-[0.2em] uppercase text-[#B88A5A]">The Idea Behind Vedalush</h2>
                <p className="text-3xl md:text-4xl font-serif leading-tight text-[#5D4E42]">
                  Rooted in India's tradition of knowledge and natural living.
                </p>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                className="space-y-10"
              >
                <p className="text-[#6F6A65] text-lg leading-relaxed font-light">
                  The name Vedalush honors the 'Vedas'—India's ancient texts of knowledge—and 'Lush'—representing the abundant, thriving nature of our botanical ingredients. We are inspired by these timeless texts that recognized the profound connection between human health and the earth's natural offerings.
                </p>
                
                {/* Compact Typographic Veda Nav */}
                <div className="pt-6 border-t border-[#E6DED2]/60">
                  <div className="flex flex-wrap gap-6 mb-6">
                    {vedas.map((veda, idx) => (
                      <button
                        key={veda.name}
                        onClick={() => setActiveVeda(idx)}
                        onMouseEnter={() => setActiveVeda(idx)}
                        className={`text-base font-semibold tracking-widest uppercase transition-all duration-300 ${activeVeda === idx ? 'text-[#B88A5A] border-b border-[#B88A5A]' : 'text-[#9D948B] hover:text-[#5D4E42]'}`}
                      >
                        {veda.name}
                      </button>
                    ))}
                  </div>
                  <AnimatePresence mode="wait">
                    <motion.p
                      key={activeVeda}
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                      transition={{ duration: 0.2 }}
                      className="text-[#6F6A65] text-base leading-relaxed min-h-[60px]"
                    >
                      {vedas[activeVeda].text}
                    </motion.p>
                  </AnimatePresence>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* 3. AYURVEDA / NATURAL PHILOSOPHY & 4. INGREDIENT JOURNEY */}
        <section className="py-24 lg:py-32 bg-[#F8F4EC]">
          <div className="max-w-7xl mx-auto px-6 lg:px-8 space-y-32">
            
            {/* Natural Philosophy Split */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                className="lg:col-span-5 space-y-6"
              >
                <h2 className="text-3xl md:text-4xl font-serif text-[#5D4E42]">From Tradition to Everyday Ritual.</h2>
                <div className="w-12 h-[1px] bg-[#B88A5A]"></div>
                <p className="text-[#6F6A65] leading-relaxed font-light">
                  At Vedalush, we do not claim to recreate ancient medicines. Instead, we are deeply inspired by Ayurvedic heritage. We thoughtfully select natural ingredients that have been traditionally valued, bringing their timeless qualities into our modern, handmade formulations for your daily cleansing ritual.
                </p>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                className="lg:col-span-7 h-[400px] w-full"
              >
                {/* Reusing hero image but cropping differently via object position for a subtle visual */}
                <img 
                  src="/images/matcha_soap_new.webp" 
                  alt="Natural philosophy" 
                  className="w-full h-full object-cover object-[center_70%] rounded-xl shadow-sm grayscale-[20%]"
                  loading="lazy"
                />
              </motion.div>
            </div>

            {/* Journey Timeline */}
            <div className="border-t border-[#E6DED2] pt-24">
              <h3 className="text-center text-xl font-semibold tracking-[0.2em] uppercase text-[#B88A5A] mb-16">The Journey of an Ingredient</h3>
              
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 md:gap-4 relative">
                {/* Horizontal line desktop */}
                <div className="hidden md:block absolute top-[11px] left-0 right-0 h-[1px] bg-[#E6DED2] z-0"></div>
                
                {journeySteps.map((step, i) => (
                  <motion.div 
                    key={step.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ delay: i * 0.1 }}
                    className="relative z-10 flex flex-row md:flex-col items-center md:text-center gap-4 md:gap-3 group bg-[#F8F4EC] md:px-2"
                  >
                    <div className="w-10 h-10 rounded-full bg-[#FFFFFF] border border-[#B88A5A] flex items-center justify-center text-[16px] font-semibold text-[#B88A5A] shrink-0 transition-colors group-hover:bg-[#B88A5A] group-hover:text-white">
                      {step.num}
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold uppercase tracking-widest text-[#5D4E42] mb-1">{step.title}</h4>
                      <p className="text-sm text-[#8E7A65] font-light leading-relaxed">{step.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

          </div>
        </section>

        {/* 5. INGREDIENT EXPLORER */}
        <section id="ingredients" className="py-24 lg:py-32 bg-[#FDFBF7]">
          <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
            <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-16">
              <div className="space-y-4">
                <span className="text-xs font-semibold tracking-[0.2em] uppercase text-[#B88A5A]">Explore</span>
                <h2 className="text-4xl md:text-5xl font-serif text-[#5D4E42]">Ingredients With a Story</h2>
              </div>
              <p className="text-[#6F6A65] max-w-sm font-light text-sm md:text-base leading-relaxed">
                Click on any ingredient below to uncover its origins, traditional uses, and how it is carefully prepared for Vedalush.
              </p>
            </div>

            {loading ? (
              <div className="flex justify-center py-20">
                <div className="w-8 h-8 border-2 border-[#B88A5A] border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                  {(showAllIngredients ? ingredients : ingredients.slice(0, 3)).map((ing, i) => (
                    <motion.button
                      key={ing._id}
                      initial={{ opacity: 0, y: 15 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: "-50px" }}
                      transition={{ delay: (i % 3) * 0.1 }}
                      onClick={() => setSelectedIngredient(ing)}
                      className="group flex flex-col text-left bg-[#FFFFFF] border border-[#E6DED2] rounded-xl overflow-hidden hover:border-[#B88A5A]/50 transition-colors duration-300"
                    >
                      <div className="w-full h-56 md:h-64 overflow-hidden bg-[#F8F4EC]">
                        <img 
                          src={ing.image} 
                          alt={ing.name} 
                          className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out"
                          loading="lazy"
                        />
                      </div>
                      <div className="p-6 flex flex-col flex-grow w-full">
                        <div className="flex justify-between items-center mb-2">
                          <h3 className="text-xl font-serif text-[#5D4E42] group-hover:text-[#B88A5A] transition-colors">{ing.name}</h3>
                          <HiOutlineArrowRight className="text-[#8E7A65] opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                        </div>
                        <p className="text-base text-[#6F6A65] font-light line-clamp-2 leading-relaxed">{ing.desc}</p>
                      </div>
                    </motion.button>
                  ))}
                </div>
                
                {ingredients.length > 3 && (
                  <div className="mt-16 flex justify-center">
                    <button 
                      onClick={() => setShowAllIngredients(!showAllIngredients)}
                      className="flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-[#5D4E42] border border-[#E6DED2] bg-white px-8 py-3 rounded-full hover:bg-[#F8F4EC] hover:border-[#B88A5A] transition-all duration-300 shadow-sm hover:shadow-md"
                    >
                      {showAllIngredients ? (
                        <>Show Less <HiOutlineChevronUp size={18} /></>
                      ) : (
                        <>Explore All Ingredients <HiOutlineChevronDown size={18} /></>
                      )}
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </section>

        {/* INGREDIENT DETAILS DRAWER */}
        <AnimatePresence>
          {selectedIngredient && (
            <>
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSelectedIngredient(null)}
                className="fixed inset-0 bg-[#3D332B]/60 backdrop-blur-sm z-[100]"
              />
              
              {/* Drawer */}
              <motion.div
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="fixed top-0 right-0 h-full w-full max-w-md bg-[#FDFBF7] shadow-2xl z-[101] overflow-y-auto border-l border-[#E6DED2] flex flex-col"
              >
                {/* Header */}
                <div className="sticky top-0 bg-[#FDFBF7]/90 backdrop-blur-md px-6 py-4 flex justify-between items-center border-b border-[#E6DED2] z-10">
                  <span className="text-xs font-semibold tracking-widest uppercase text-[#8E7A65]">Ingredient Detail</span>
                  <button 
                    onClick={() => setSelectedIngredient(null)}
                    className="p-2 text-[#5D4E42] hover:text-[#B88A5A] hover:bg-[#F8F4EC] rounded-full transition-colors"
                  >
                    <HiX size={20} />
                  </button>
                </div>
                
                {/* Body */}
                <div className="flex-1 pb-12">
                  <div className="w-full h-64 bg-[#F8F4EC]">
                    <img 
                      src={selectedIngredient.image} 
                      alt={selectedIngredient.name} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  <div className="px-8 pt-8 space-y-10">
                    <div>
                      <h2 className="text-3xl font-serif text-[#5D4E42] mb-3">{selectedIngredient.name}</h2>
                      <p className="text-[#8E7A65] italic text-sm leading-relaxed">{selectedIngredient.desc}</p>
                    </div>

                    <div className="space-y-8">
                      {selectedIngredient.origin && (
                        <div>
                          <h4 className="text-xs font-semibold uppercase tracking-widest text-[#B88A5A] mb-2 border-b border-[#E6DED2] pb-2">Origin</h4>
                          <p className="text-base text-[#6F6A65] font-light leading-relaxed">{selectedIngredient.origin}</p>
                        </div>
                      )}
                      
                      {selectedIngredient.traditionalUse && (
                        <div>
                          <h4 className="text-xs font-semibold uppercase tracking-widest text-[#B88A5A] mb-2 border-b border-[#E6DED2] pb-2">Traditional Use</h4>
                          <p className="text-base text-[#6F6A65] font-light leading-relaxed">{selectedIngredient.traditionalUse}</p>
                        </div>
                      )}
                      
                      {selectedIngredient.collectionProcess && (
                        <div>
                          <h4 className="text-xs font-semibold uppercase tracking-widest text-[#B88A5A] mb-2 border-b border-[#E6DED2] pb-2">Collection</h4>
                          <p className="text-base text-[#6F6A65] font-light leading-relaxed">{selectedIngredient.collectionProcess}</p>
                        </div>
                      )}
                      
                      {selectedIngredient.preparationProcess && (
                        <div>
                          <h4 className="text-xs font-semibold uppercase tracking-widest text-[#B88A5A] mb-2 border-b border-[#E6DED2] pb-2">Preparation</h4>
                          <p className="text-base text-[#6F6A65] font-light leading-relaxed">{selectedIngredient.preparationProcess}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* 6. CONVENTIONAL VS VEDALUSH & WHY VEDALUSH */}
        <section className="py-24 border-t border-[#E6DED2]">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            
            {/* Comparison */}
            <div className="mb-32">
              <h2 className="text-3xl font-serif text-[#5D4E42] text-center mb-16">A Different Approach to Everyday Cleansing</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-[#E6DED2]">
                <div className="bg-[#FDFBF7] p-8 lg:p-12">
                  <h3 className="text-sm font-semibold uppercase tracking-widest text-[#8E7A65] mb-8">Conventional Formulations</h3>
                  <ul className="space-y-6 text-[#6F6A65] font-light text-base leading-relaxed">
                    <li>May use synthetic cleansing agents and artificial hardeners.</li>
                    <li>Often incorporate artificial fragrances and synthetic colors for consistency.</li>
                    <li>Mass-produced utilizing standard commercial ingredient sourcing.</li>
                    <li>Natural glycerin is sometimes removed during the commercial process.</li>
                  </ul>
                </div>
                <div className="bg-[#F8F4EC] p-8 lg:p-12">
                  <h3 className="text-sm font-semibold uppercase tracking-widest text-[#B88A5A] mb-8">The Vedalush Approach</h3>
                  <ul className="space-y-6 text-[#5D4E42] font-medium text-base leading-relaxed">
                    <li>Formulated exclusively with natural oils, butters, and botanical extracts.</li>
                    <li>Naturally scented and colored by our authentic raw ingredients.</li>
                    <li>Handmade in small batches, deeply inspired by traditional wellness.</li>
                    <li>Retains all natural glycerin to deeply moisturize and protect the skin.</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Why Vedalush */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 text-center lg:text-left">
              {whyVedalush.map((item, i) => (
                <div key={item.title}>
                  <span className="text-[#E6DED2] text-4xl font-serif font-bold block mb-4">0{i + 1}</span>
                  <h4 className="text-base font-semibold uppercase tracking-widest text-[#5D4E42] mb-2">{item.title}</h4>
                  <p className="text-base text-[#8E7A65] font-light leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>

          </div>
        </section>

        {/* 7. FINAL EDITORIAL CTA */}
        <section className="relative py-32 lg:py-40 flex items-center justify-center text-center px-6">
          <div 
            className="absolute inset-0 z-0 bg-[#3D332B]" 
          >
            <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'url(/images/cta-botanical-bg.webp)', backgroundSize: 'cover', backgroundPosition: 'center' }}></div>
          </div>
          
          <div className="relative z-10 max-w-2xl mx-auto space-y-8">
            <h2 className="text-4xl md:text-5xl font-serif leading-tight text-[#FDFBF7]">Ancient inspiration.<br/>Made for today.</h2>
            <p className="text-[#E6DED2] font-light text-xl">Experience the luxury of natural ingredients and traditional wisdom in every bar.</p>
            <div className="pt-4">
              <a 
                href="/#products" 
                className="inline-block bg-[#FDFBF7] text-[#5D4E42] px-8 py-3 rounded-full text-sm font-semibold tracking-widest uppercase hover:bg-[#B88A5A] hover:text-white transition-all duration-300"
              >
                Explore Our Soaps
              </a>
            </div>
          </div>
        </section>

      </main>

      <Footer />
    </>
  );
};

export default OurRoots;
