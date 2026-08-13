import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import axios from 'axios';
import Navbar from '../components/ui/Navbar';
import Footer from '../components/ui/Footer';

const OurRoots = () => {
  const [ingredients, setIngredients] = useState([]);
  const [loading, setLoading] = useState(true);

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

  const vedaCards = [
    {
      title: 'Rigveda',
      desc: 'The oldest Veda, offering foundational knowledge on natural elements, hymns, and the profound connection between nature and humanity.'
    },
    {
      title: 'Samaveda',
      desc: 'The Veda of melodies and chants, reflecting the rhythmic cycles of nature and the harmony of natural healing.'
    },
    {
      title: 'Yajurveda',
      desc: 'Focuses on the practical application of knowledge, including traditional rituals that honor the earth\'s botanical offerings.'
    },
    {
      title: 'Atharvaveda',
      desc: 'Contains detailed knowledge of medicinal plants, herbs, and early Ayurvedic practices for holistic well-being.'
    }
  ];

  const journeySteps = [
    { title: 'SOURCE', desc: 'Identifying the finest botanical regions.' },
    { title: 'COLLECT', desc: 'Carefully gathering at peak potency.' },
    { title: 'SELECT', desc: 'Hand-sorting for the highest quality.' },
    { title: 'PREPARE', desc: 'Processing using traditional-inspired methods.' },
    { title: 'FORMULATE', desc: 'Blending into our nourishing base.' },
    { title: 'VEDALUSH', desc: 'Curing the final handmade soap.' }
  ];

  return (
    <>
      <Helmet>
        <title>Vedalush | Rooted in Ancient Wisdom</title>
        <meta name="description" content="Discover the traditional inspiration, natural ingredients, and thoughtful sourcing philosophy behind Vedalush handmade soaps." />
      </Helmet>

      <Navbar />

      <main className="min-h-screen bg-[#FDFBF7] pt-20">
        
        {/* HERO SECTION */}
        <section className="relative py-24 lg:py-32 overflow-hidden flex items-center justify-center text-center px-6">
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#8E7A65 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
          <div className="max-w-4xl relative z-10 space-y-6">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-6xl font-serif font-bold text-[#5D4E42]"
            >
              Rooted in Ancient Wisdom
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-xl md:text-2xl text-[#8E7A65] font-medium"
            >
              Where timeless Indian traditions meet thoughtful modern skincare.
            </motion.p>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-md md:text-lg text-[#6F6A65] max-w-2xl mx-auto leading-relaxed"
            >
              Vedalush is inspired by the profound knowledge of India's ancient wellness traditions. We believe in the power of botanical ingredients, carefully sourced and thoughtfully prepared to bring harmony to your daily ritual.
            </motion.p>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="pt-6"
            >
            </motion.div>
          </div>
        </section>

        {/* WHY VEDALUSH (4 Vedas) */}
        <section className="py-20 bg-[#F8F4EC] relative border-y border-[#E6DED2]/50">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="text-center mb-16 space-y-4">
              <span className="text-[#8E7A65] font-semibold tracking-widest uppercase text-sm">Our Inspiration</span>
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-[#5D4E42]">Why Vedalush?</h2>
              <p className="text-[#6F6A65] max-w-2xl mx-auto leading-relaxed">
                The name Vedalush honors the 'Vedas'—India's ancient texts of knowledge—and 'Lush'—representing the abundant, thriving nature of our botanical ingredients.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {vedaCards.map((veda, i) => (
                <motion.div 
                  key={veda.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-white p-8 rounded-2xl border border-[#E6DED2] shadow-sm hover:shadow-soft transition-all duration-300"
                >
                  <h3 className="text-xl font-serif font-bold text-[#B88A5A] mb-3">{veda.title}</h3>
                  <p className="text-sm text-[#6F6A65] leading-relaxed">{veda.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ANCIENT KNOWLEDGE TO AYURVEDA */}
        <section className="py-24 max-w-4xl mx-auto px-6 text-center space-y-8">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-[#5D4E42]">From Ancient Knowledge to Ayurvedic Tradition</h2>
          <p className="text-lg text-[#6F6A65] leading-relaxed">
            For millennia, traditional Indian wellness practices have valued the profound connection between human health and the natural world. Ayurveda, the science of life, teaches us that what we apply to our skin should be as pure and nourishing as the natural environment itself. 
          </p>
          <p className="text-lg text-[#6F6A65] leading-relaxed">
            At Vedalush, we do not claim to recreate ancient medicines. Instead, we are deeply inspired by this heritage. We thoughtfully select natural ingredients that have been traditionally used in Ayurvedic preparations, bringing their timeless qualities into our modern, handmade formulations.
          </p>
        </section>

        {/* INGREDIENT JOURNEY */}
        <section className="py-20 bg-white border-y border-[#E6DED2]">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <h2 className="text-3xl font-serif font-bold text-[#5D4E42] text-center mb-16">The Journey of an Ingredient</h2>
            
            <div className="flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-4 relative">
              {/* Optional connecting line for desktop */}
              <div className="hidden lg:block absolute top-12 left-10 right-10 h-0.5 bg-[#E6DED2] z-0"></div>
              
              {journeySteps.map((step, i) => (
                <motion.div 
                  key={step.title}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="flex flex-col items-center text-center relative z-10 w-full lg:w-40"
                >
                  <div className="w-20 h-20 lg:w-24 lg:h-24 rounded-full bg-[#F8F4EC] border-2 border-[#B88A5A] text-[#B88A5A] flex items-center justify-center font-bold text-xl mb-4 shadow-sm">
                    {i + 1}
                  </div>
                  <h4 className="font-bold text-[#5D4E42] tracking-wider mb-2">{step.title}</h4>
                  <p className="text-xs text-[#6F6A65]">{step.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* INGREDIENT SECTION */}
        <section id="ingredients-list" className="py-24 bg-[#FDFBF7]">
          <div className="max-w-6xl mx-auto px-6 lg:px-8 space-y-24">
            <div className="text-center space-y-4 mb-10">
              <span className="text-[#8E7A65] font-semibold tracking-widest uppercase text-sm">Our Botanicals</span>
              <h2 className="text-4xl md:text-5xl font-serif font-bold text-[#5D4E42]">Thoughtfully Selected Ingredients</h2>
            </div>

            {loading ? (
              <div className="flex justify-center">
                <div className="w-12 h-12 border-4 border-[#B88A5A] border-t-[#5D4E42] rounded-full animate-spin"></div>
              </div>
            ) : (
              ingredients.map((ing, i) => {
                const isEven = i % 2 === 0;
                return (
                  <motion.div 
                    key={ing._id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    className={`flex flex-col ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'} gap-10 items-center bg-white rounded-3xl p-6 md:p-10 shadow-sm border border-[#E6DED2]`}
                  >
                    <div className="w-full md:w-1/2 rounded-2xl overflow-hidden bg-[#F8F4EC] h-[300px] md:h-[400px] relative shadow-inner">
                      <img src={ing.image} alt={ing.name} className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700" loading="lazy" />
                    </div>
                    <div className="w-full md:w-1/2 space-y-6">
                      <div>
                        <h3 className="text-3xl font-serif font-bold text-[#5D4E42] mb-3">{ing.name}</h3>
                        <p className="text-lg text-[#8E7A65] italic">{ing.desc}</p>
                      </div>

                      <div className="space-y-4 pt-4 border-t border-[#E6DED2]">
                        {ing.origin && (
                          <div>
                            <h4 className="text-xs font-bold uppercase tracking-widest text-[#B88A5A] mb-1">Origin</h4>
                            <p className="text-sm text-[#6F6A65]">{ing.origin}</p>
                          </div>
                        )}
                        {ing.traditionalUse && (
                          <div>
                            <h4 className="text-xs font-bold uppercase tracking-widest text-[#B88A5A] mb-1">Traditional Use</h4>
                            <p className="text-sm text-[#6F6A65]">{ing.traditionalUse}</p>
                          </div>
                        )}
                        {ing.collectionProcess && (
                          <div>
                            <h4 className="text-xs font-bold uppercase tracking-widest text-[#B88A5A] mb-1">How It Is Collected</h4>
                            <p className="text-sm text-[#6F6A65]">{ing.collectionProcess}</p>
                          </div>
                        )}
                        {ing.preparationProcess && (
                          <div>
                            <h4 className="text-xs font-bold uppercase tracking-widest text-[#B88A5A] mb-1">How It Is Prepared</h4>
                            <p className="text-sm text-[#6F6A65]">{ing.preparationProcess}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })
            )}
          </div>
        </section>

        {/* COMPARISON SECTION */}
        <section className="py-24 bg-[#5D4E42] text-white">
          <div className="max-w-5xl mx-auto px-6 lg:px-8 text-center space-y-12">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-[#F8F4EC]">Conventional Soap vs Vedalush</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
              <div className="bg-[#4D4035] p-8 rounded-2xl border border-[#8E7A65]/30">
                <h3 className="text-xl font-bold text-[#E6DED2] mb-6 border-b border-[#8E7A65]/30 pb-3">Conventional Formulations</h3>
                <ul className="space-y-4 text-sm text-[#C9C1B8]">
                  <li className="flex gap-3">
                    <span className="text-[#8E7A65]">×</span> 
                    May use synthetic cleansing agents and artificial hardeners.
                  </li>
                  <li className="flex gap-3">
                    <span className="text-[#8E7A65]">×</span> 
                    Often use artificial fragrances and synthetic colors.
                  </li>
                  <li className="flex gap-3">
                    <span className="text-[#8E7A65]">×</span> 
                    Mass-produced with standard commercial ingredient sourcing.
                  </li>
                  <li className="flex gap-3">
                    <span className="text-[#8E7A65]">×</span> 
                    Glycerin is sometimes removed during the commercial process.
                  </li>
                </ul>
              </div>

              <div className="bg-[#F8F4EC] text-[#5D4E42] p-8 rounded-2xl border-2 border-[#B88A5A]">
                <h3 className="text-xl font-bold text-[#5D4E42] mb-6 border-b border-[#E6DED2] pb-3">The Vedalush Approach</h3>
                <ul className="space-y-4 text-sm text-[#6F6A65]">
                  <li className="flex gap-3">
                    <span className="text-[#B88A5A] font-bold">✓</span> 
                    Formulated using natural oils, butters, and botanical extracts.
                  </li>
                  <li className="flex gap-3">
                    <span className="text-[#B88A5A] font-bold">✓</span> 
                    Naturally scented and colored by our authentic ingredients.
                  </li>
                  <li className="flex gap-3">
                    <span className="text-[#B88A5A] font-bold">✓</span> 
                    Handmade in small batches, inspired by traditional wellness.
                  </li>
                  <li className="flex gap-3">
                    <span className="text-[#B88A5A] font-bold">✓</span> 
                    Retains natural glycerin to deeply moisturize the skin.
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* WHAT MAKES VEDALUSH DIFFERENT */}
        <section className="py-24 bg-white border-b border-[#E6DED2]">
          <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center space-y-12">
            <h2 className="text-3xl font-serif font-bold text-[#5D4E42]">What Makes Vedalush Different</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { title: 'Ancient-Inspired', desc: 'Rooted in the philosophies of traditional Indian wellness.' },
                { title: 'Thoughtfully Selected', desc: 'Every ingredient serves a clear, natural purpose.' },
                { title: 'Ingredient Transparency', desc: 'You know exactly what touches your skin.' },
                { title: 'Modern Handmade', desc: 'Artisanal care in every single bar of soap.' }
              ].map((item, i) => (
                <div key={item.title} className="space-y-3">
                  <div className="w-12 h-12 mx-auto bg-[#F8F4EC] rounded-full border border-[#B88A5A] flex items-center justify-center text-[#B88A5A]">
                    ✦
                  </div>
                  <h4 className="font-bold text-[#5D4E42]">{item.title}</h4>
                  <p className="text-sm text-[#6F6A65]">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CLOSING */}
        <section className="py-32 bg-[#F8F4EC] text-center px-6">
          <div className="max-w-3xl mx-auto space-y-6">
            <h2 className="text-4xl font-serif font-bold text-[#5D4E42]">Ancient Wisdom. Thoughtfully Reimagined.</h2>
            <p className="text-lg text-[#6F6A65] leading-relaxed">
              Vedalush is more than skincare. It is an appreciation for India's traditional ingredients and wellness philosophy, thoughtfully crafted into a luxurious, everyday bathing experience.
            </p>
          </div>
        </section>

      </main>

      <Footer />
    </>
  );
};

export default OurRoots;
