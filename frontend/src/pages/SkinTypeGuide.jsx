import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { FaChevronDown, FaWhatsapp } from 'react-icons/fa';
import { HiOutlineSparkles, HiOutlineCheck } from 'react-icons/hi';
import Navbar from '../components/ui/Navbar';
import Footer from '../components/ui/Footer';
import { ProductCardSkeleton } from '../components/ui/Skeletons';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useCurrency } from '../context/CurrencyContext';

const faqs = [
  { q: "Can skin type change over time?", a: "Yes, your skin type can change due to age, hormones, climate, and diet." },
  { q: "How often should I check my skin type?", a: "It's good to re-evaluate your skin type every season or if you notice significant changes in its behavior." },
  { q: "Can I have more than one skin type?", a: "Yes, this is known as combination skin, where some areas are oily (like the T-zone) and others are dry." },
  { q: "Which soap is suitable for sensitive skin?", a: "Our specially formulated gentle organic soaps, free from harsh chemicals and artificial fragrances, are ideal for delicate skin barriers." },
  { q: "Is this test medically accurate?", a: "This is a basic home test to help you select cosmetic products. For medical conditions, please consult a dermatologist." }
];

const quizQuestions = [
  { q: "Does your skin feel tight after washing?", options: [{text:"Always", type:"Dry"}, {text:"Sometimes", type:"Combination"}, {text:"Rarely", type:"Oily"}, {text:"Never", type:"Normal"}] },
  { q: "Does your face become shiny after a few hours?", options: [{text:"All over", type:"Oily"}, {text:"Only on forehead/nose", type:"Combination"}, {text:"No, it stays matte", type:"Dry"}, {text:"Just a natural glow", type:"Normal"}] },
  { q: "Do you frequently experience breakouts?", options: [{text:"Yes, often", type:"Oily"}, {text:"Sometimes, in T-zone", type:"Combination"}, {text:"Rarely", type:"Normal"}, {text:"No, but I get red bumps", type:"Sensitive"}] },
  { q: "Do your cheeks feel dry?", options: [{text:"Yes, very", type:"Dry"}, {text:"Yes, especially in winter", type:"Combination"}, {text:"No, they feel fine", type:"Normal"}, {text:"No, they are oily", type:"Oily"}] },
  { q: "Does your skin become irritated easily?", options: [{text:"Yes, frequently", type:"Sensitive"}, {text:"Sometimes with new products", type:"Dry"}, {text:"Rarely", type:"Normal"}, {text:"Never", type:"Oily"}] }
];

const skinTypesData = [
  {
    id: "normal",
    title: "Normal Skin",
    desc: "Well-balanced skin that is neither too dry nor too oily, with a smooth texture.",
    traits: ["No severe sensitivity", "Barely visible pores", "Radiant complexion", "Smooth texture"],
    who: "Those whose skin feels comfortable and balanced throughout the day.",
    image: "/images/skin-types/normal.png"
  },
  {
    id: "dry",
    title: "Dry Skin",
    desc: "Produces less sebum than normal skin, often feels tight and may appear dull.",
    traits: ["Invisible pores", "Dull, rough complexion", "Feels tight after washing", "Prone to fine lines"],
    who: "Those who frequently need moisturizer to alleviate tightness.",
    image: "/images/skin-types/dry.png"
  },
  {
    id: "oily",
    title: "Oily Skin",
    desc: "Overproduction of sebum leading to shine, enlarged pores, and breakouts.",
    traits: ["Enlarged pores", "Shiny complexion", "Prone to blackheads & acne", "Makeup may slide off"],
    who: "Those who notice a distinct shine shortly after cleansing.",
    image: "/images/skin-types/oily.png"
  },
  {
    id: "combination",
    title: "Combination Skin",
    desc: "Features both oily and dry areas, usually an oily T-zone and dry cheeks.",
    traits: ["Oily T-zone (forehead, nose, chin)", "Normal or dry cheeks", "Larger pores in T-zone", "Occasional breakouts"],
    who: "Those whose skin behavior varies significantly by facial zone.",
    image: "/images/skin-types/combination.png"
  },
  {
    id: "sensitive",
    title: "Sensitive Skin",
    desc: "Easily triggered by products or environment, prone to redness and irritation.",
    traits: ["Redness or flushing", "Itching or burning", "Dryness and flaking", "Reacts to new products"],
    who: "Those who must be very careful with ingredients to avoid reactions.",
    image: "/images/skin-types/sensitive.png"
  }
];

const SkinTypeGuide = () => {
  const [activeFaq, setActiveFaq] = useState(null);
  const [quizStarted, setQuizStarted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [scores, setScores] = useState({ Normal: 0, Dry: 0, Oily: 0, Combination: 0, Sensitive: 0 });
  const [quizResult, setQuizResult] = useState(null);
  const [activeMistake, setActiveMistake] = useState(null);

  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const { formatPrice } = useCurrency();

  useEffect(() => {
    const fetchProducts = async () => {
      setLoadingProducts(true);
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/products`);
        setProducts(response.data);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoadingProducts(false);
      }
    };
    fetchProducts();
  }, []);

  const recommendedDynamicProducts = quizResult 
    ? products.filter(p => {
        if (!p.skinType) return false;
        const skinTypeLower = String(p.skinType).toLowerCase();
        const target = String(quizResult).toLowerCase();
        return skinTypeLower.includes(target) || skinTypeLower.includes('all');
      }).slice(0, 5)
    : [];

  const handleAnswer = (type) => {
    const newScores = { ...scores, [type]: scores[type] + 1 };
    setScores(newScores);
    if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      const highest = Object.keys(newScores).reduce((a, b) => newScores[a] > newScores[b] ? a : b);
      setQuizResult(highest);
    }
  };

  const resetQuiz = () => {
    setQuizStarted(false);
    setCurrentQuestion(0);
    setScores({ Normal: 0, Dry: 0, Oily: 0, Combination: 0, Sensitive: 0 });
    setQuizResult(null);
  };

  const scrollToTypes = (e) => {
    e.preventDefault();
    document.getElementById('types-section').scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const scrollToRecommendations = (e) => {
    e.preventDefault();
    const element = document.getElementById('recommended-soaps');
    if (element) {
      const y = element.getBoundingClientRect().top + window.scrollY - 100;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  return (
    <>
      <Helmet>
        <title>Skin Type Guide | Vedalush</title>
        <meta name="description" content="Discover your true skin type in 30 seconds. Learn how to identify your skin's unique needs and find the perfect organic Vedalush soap." />
      </Helmet>
      
      <Navbar />

      <main className="min-h-screen bg-[#FDFBF7] text-[#5D4E42] font-sans selection:bg-[#B88A5A] selection:text-white">
        
        {/* 1 & 2. HERO / QUIZ SECTION COMBINED */}
        <section className="relative min-h-[50vh] md:min-h-[70vh] flex flex-col items-center justify-center overflow-hidden pt-[160px] pb-12 lg:pt-[180px] md:pb-20 px-6 lg:px-8 bg-gradient-to-b from-[#F8F4EC] to-[#FDFBF7]">
          {/* Subtle luxury background elements */}
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none opacity-20">
             <div className="absolute top-10 left-10 w-[500px] h-[500px] border border-[#B88A5A]/30 rounded-full blur-sm"></div>
             <div className="absolute -bottom-20 -right-20 w-[600px] h-[600px] border border-[#B88A5A]/20 rounded-full blur-md"></div>
          </div>
          
          <div className="relative z-10 max-w-3xl mx-auto w-full min-h-[400px] flex flex-col justify-center overflow-visible">
            <AnimatePresence mode="wait">
              {!quizStarted && !quizResult && (
                <motion.div 
                  key="hero"
                  initial={{ opacity: 0, x: -50 }} 
                  animate={{ opacity: 1, x: 0 }} 
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                  className="text-center space-y-6 md:space-y-8"
                >
                  <span className="text-[#B88A5A] tracking-[0.2em] text-xs md:text-sm uppercase font-semibold block">Vedalush Expertise</span>
                  <h1 className="text-4xl sm:text-5xl md:text-7xl font-serif font-bold text-[#5D4E42] leading-tight tracking-tight">
                    Know Your Skin Before <br className="hidden md:block" />
                    <span className="italic font-light text-[#8E7A65]">Choosing Your Soap</span>
                  </h1>
                  <p className="text-base md:text-xl text-[#6F6A65] font-light max-w-2xl mx-auto leading-relaxed px-4 md:px-0">
                    Healthy, radiant skin starts with understanding its unique needs. Discover your exact skin profile to find the perfect botanical formulation.
                  </p>
                  <div className="flex flex-row gap-4 sm:gap-5 justify-center mt-8 md:mt-10">
                    <button onClick={(e) => { e.preventDefault(); setQuizStarted(true); }} className="px-5 md:px-10 py-3 md:py-4 bg-[#5D4E42] text-xs md:text-sm text-white rounded-full text-center hover:bg-[#4A3E34] hover:shadow-xl transition-all duration-300 font-medium tracking-wide">
                      Start Skin Quiz
                    </button>
                    <a href="#types-section" onClick={scrollToTypes} className="px-5 md:px-10 py-3 md:py-4 bg-transparent border border-[#5D4E42]/30 text-xs md:text-sm text-[#5D4E42] rounded-full text-center hover:border-[#5D4E42] hover:bg-[#5D4E42]/5 transition-all duration-300 font-medium tracking-wide">
                      Explore Skin Types
                    </a>
                  </div>
                </motion.div>
              )}

              {quizStarted && !quizResult && (
                <motion.div 
                  key="question" 
                  initial={{ opacity: 0, x: 50 }} 
                  animate={{ opacity: 1, x: 0 }} 
                  exit={{ opacity: 0, x: -50 }} 
                  transition={{ duration: 0.6, ease: "easeOut" }}
                  className="w-full relative z-10"
                >
                  <div className="flex items-center justify-between mb-8">
                    <div className="text-xs text-[#B88A5A] font-semibold tracking-widest uppercase">Question {currentQuestion + 1} of {quizQuestions.length}</div>
                    <div className="flex gap-1">
                      {quizQuestions.map((_, idx) => (
                        <div key={idx} className={`h-1 rounded-full transition-all duration-300 ${idx <= currentQuestion ? 'w-6 bg-[#B88A5A]' : 'w-2 bg-[#E6DED2]'}`}></div>
                      ))}
                    </div>
                  </div>
                  <h3 className="text-2xl md:text-3xl font-serif text-[#5D4E42] mb-10 leading-snug">{quizQuestions[currentQuestion].q}</h3>
                  <div className="space-y-4">
                    {quizQuestions[currentQuestion].options.map((opt, i) => (
                      <button 
                        key={i} 
                        onClick={() => handleAnswer(opt.type)}
                        className="w-full text-left p-5 rounded-2xl border border-[#E6DED2] hover:border-[#B88A5A] hover:bg-[#F8F4EC] transition-all duration-200 text-[#5D4E42] text-lg font-light shadow-sm hover:shadow-md group flex items-center justify-between"
                      >
                        <span>{opt.text}</span>
                        <div className="w-6 h-6 rounded-full border border-[#E6DED2] group-hover:border-[#B88A5A] flex items-center justify-center transition-colors">
                          <div className="w-2 h-2 rounded-full bg-[#B88A5A] opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        </div>
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

              {quizResult && (
                <motion.div 
                  key="result" 
                  initial={{ opacity: 0, scale: 0.95 }} 
                  animate={{ opacity: 1, scale: 1 }} 
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                  className="text-center relative z-10"
                >
                  <h3 className="text-xs text-[#B88A5A] font-semibold tracking-widest uppercase mb-3">Your Analysis Complete</h3>
                  <h2 className="text-4xl md:text-5xl font-serif text-[#5D4E42] mb-6 font-bold">{quizResult} Skin</h2>
                  <p className="text-[#6F6A65] font-light mb-10 text-lg max-w-md mx-auto leading-relaxed">
                    Your answers strongly indicate a {quizResult.toLowerCase()} skin profile. We have curated specific botanical formulations to balance and nourish your skin perfectly.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button onClick={scrollToRecommendations} className="px-8 py-4 bg-[#5D4E42] text-white rounded-full hover:bg-[#4A3E34] transition-all font-medium shadow-md">
                      View Recommended Soaps
                    </button>
                    <button onClick={resetQuiz} className="px-8 py-4 border border-[#E6DED2] text-[#6F6A65] rounded-full hover:bg-[#F8F4EC] transition-all font-medium">
                      Retake Quiz
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </section>

        {/* 3. HOME TEST (Bento Grid) */}
        <section className="py-24 md:py-32 bg-gradient-to-b from-[#FDFBF7] to-[#F8F4EC]">
          <div className="max-w-6xl mx-auto px-6 lg:px-8">
            <div className="text-center mb-16 md:mb-24">
              <span className="text-[#B88A5A] tracking-[0.2em] text-xs uppercase font-semibold mb-3 block">Do It Yourself</span>
              <h2 className="text-4xl md:text-5xl font-serif font-bold text-[#5D4E42] mb-6">The Bare-Faced Test</h2>
              <p className="text-[#6F6A65] font-light text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
                Prefer to test it manually? Follow these four simple steps at home to accurately determine your skin's natural behavior.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
              {[
                { step: "01", title: "Wash & Clear", desc: "Start fresh. Cleanse your face with a gentle, non-stripping cleanser to remove all impurities and surface oils." },
                { step: "02", title: "The 30-Minute Wait", desc: "Patience is key. Wait 30 minutes without applying any serums, toners, or moisturizers to let your skin return to its natural state." },
                { step: "03", title: "Mindful Observation", desc: "Pay close attention. Check your skin for tightness, excessive shine in the T-zone, or rough, dry patches." },
                { step: "04", title: "Discover & Compare", desc: "Find your match. Compare your observations with our five distinct skin profiles below to find your true skin type." }
              ].map((item, i) => (
                <motion.div 
                  key={i} 
                  initial={{ opacity: 0, y: 30 }} 
                  whileInView={{ opacity: 1, y: 0 }} 
                  viewport={{ once: true, margin: "-50px" }} 
                  transition={{ delay: i * 0.15, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                  className="group relative bg-white p-8 md:p-12 rounded-3xl border border-[#E6DED2] shadow-sm hover:shadow-2xl hover:-translate-y-1 hover:border-[#B88A5A]/30 transition-all duration-500 overflow-hidden flex flex-col justify-center min-h-[260px]"
                >
                  {/* Large background watermark number */}
                  <div className="absolute -bottom-8 -right-4 text-[140px] md:text-[180px] font-serif font-bold text-[#F8F4EC] group-hover:text-[#F3EDE2] transition-colors duration-500 leading-none select-none pointer-events-none z-0">
                    {item.step}
                  </div>
                  
                  <div className="relative z-10">
                    <div className="flex items-center gap-4 mb-5">
                      <div className="w-12 h-12 shrink-0 rounded-full bg-[#FDFBF7] border border-[#E6DED2] group-hover:border-[#B88A5A] flex items-center justify-center text-[#B88A5A] font-serif text-2xl font-bold transition-colors duration-500">
                        {item.step}
                      </div>
                      <h3 className="text-2xl md:text-3xl font-serif text-[#5D4E42] font-bold group-hover:text-[#B88A5A] transition-colors duration-500">{item.title}</h3>
                    </div>
                    <p className="text-[#6F6A65] font-light text-base md:text-lg leading-relaxed max-w-[95%]">
                      {item.desc}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* 4. SKIN TYPES (Zigzag Layout) */}
        <section id="types-section" className="py-20 bg-[#FDFBF7]">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="text-center mb-20">
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-[#5D4E42]">The Five Skin Profiles</h2>
              <div className="w-16 h-[1px] bg-[#B88A5A] mx-auto mt-6"></div>
            </div>

            <div className="space-y-12 md:space-y-32">
              {skinTypesData.map((type, index) => {
                const isEven = index % 2 === 0;
                return (
                  <div key={type.id} className={`flex ${isEven ? 'flex-row' : 'flex-row-reverse'} items-center gap-4 sm:gap-8 lg:gap-24`}>
                    
                    {/* Image Box */}
                    <motion.div 
                      initial={{ opacity: 0, x: isEven ? -20 : 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: "-50px" }} transition={{ duration: 0.8 }}
                      className="w-[40%] shrink-0"
                    >
                      <div className="relative aspect-square w-full rounded-2xl md:rounded-2xl bg-[#F8F4EC] border border-[#E6DED2] flex items-center justify-center overflow-hidden group">
                        <motion.img 
                          whileHover={{ scale: 1.05 }} transition={{ duration: 0.7, ease: "easeOut" }}
                          src={type.image} alt={type.title} className="w-full h-full object-cover"
                        />
                      </div>
                    </motion.div>

                    {/* Text Content */}
                    <motion.div 
                      initial={{ opacity: 0, x: isEven ? 20 : -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: "-50px" }} transition={{ duration: 0.8, delay: 0.1 }}
                      className="w-[60%] md:w-1/2 space-y-3 md:space-y-6"
                    >
                      <h3 className="text-xl sm:text-3xl lg:text-4xl font-serif font-bold text-[#5D4E42] relative inline-block">
                        {type.title}
                        <span className="absolute -bottom-1 md:-bottom-2 left-0 w-1/3 h-[2px] bg-[#B88A5A]/50"></span>
                      </h3>
                      <p className="text-xs sm:text-base md:text-xl text-[#6F6A65] font-light leading-snug md:leading-relaxed line-clamp-3 md:line-clamp-none">
                        {type.desc}
                      </p>
                      
                      <div className="py-3 md:py-6 border-y border-[#E6DED2]">
                        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 md:gap-4">
                          {type.traits.map((trait, i) => (
                            <li key={i} className={`flex items-start gap-1.5 md:gap-3 text-[#5D4E42] font-light text-[10px] sm:text-sm md:text-base ${i >= 2 ? 'hidden sm:flex' : 'flex'}`}>
                              <HiOutlineCheck className="w-3 h-3 md:w-5 md:h-5 text-[#B88A5A] shrink-0 mt-0.5" />
                              <span className="leading-tight">{trait}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="bg-[#F8F4EC] p-2.5 md:p-5 rounded-lg md:rounded-xl border border-[#E6DED2]/50">
                        <p className="text-[10px] sm:text-sm text-[#6F6A65] font-light italic leading-tight">
                          <strong className="text-[#5D4E42] font-medium not-italic mr-1 hidden md:inline">Who is this for?</strong> 
                          <span className="md:hidden font-medium not-italic text-[#5D4E42] block mb-0.5">Best For:</span>
                          {type.who}
                        </p>
                      </div>

                    </motion.div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* 5. COMMON MISTAKES */}
        <section className="pt-20 pb-10 bg-[#F8F4EC]">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="text-center mb-16">
              <span className="text-[#B88A5A] tracking-widest text-xs uppercase font-semibold mb-2 block">Skincare Sins</span>
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-[#5D4E42]">Common Cleansing Mistakes</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 lg:gap-5">
              {[
                { title: "Washing Too Often", desc: "Strips natural oils, leading to barrier damage." },
                { title: "Harsh Soaps", desc: "Commercial sulfates disrupt the skin's acidic mantle." },
                { title: "Skipping Moisturizer", desc: "Even oily skin needs hydration after cleansing." },
                { title: "Hot Water", desc: "Causes redness and exacerbates dry skin conditions." },
                { title: "Fragrance Focus", desc: "Choosing based on scent rather than skin suitability." }
              ].map((mistake, i) => (
                <motion.div 
                  key={i} 
                  initial={{ opacity: 0, y: 30 }} 
                  whileInView={{ opacity: 1, y: 0 }} 
                  viewport={{ once: true, margin: "-50px" }} 
                  transition={{ delay: i * 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                  onClick={() => setActiveMistake(activeMistake === i ? null : i)}
                  onMouseEnter={() => setActiveMistake(i)}
                  onMouseLeave={() => setActiveMistake(null)}
                  className={`relative bg-white overflow-hidden rounded-2xl border shadow-sm transition-all duration-500 h-[160px] lg:h-[220px] p-6 cursor-pointer lg:cursor-default ${activeMistake === i ? 'shadow-xl border-[#B88A5A]/40' : 'border-[#E6DED2]'}`}
                >
                  {/* Background Accent */}
                  <div className={`absolute inset-0 bg-gradient-to-t from-[#F8F4EC] to-transparent transition-opacity duration-500 z-0 ${activeMistake === i ? 'opacity-100' : 'opacity-0'}`}></div>
                  
                  {/* Large Number Watermark */}
                  <div className={`absolute -top-4 -right-4 text-[100px] md:text-[120px] font-serif font-bold transition-colors duration-500 leading-none select-none pointer-events-none z-0 ${activeMistake === i ? 'text-[#F3EDE2]' : 'text-[#F8F4EC]'}`}>
                    0{i+1}
                  </div>

                  <div className="relative z-10 h-full flex flex-col justify-end">
                    {/* Icon that fades out / moves up on reveal */}
                    <div className={`absolute top-0 left-0 w-10 h-10 rounded-full bg-[#FDFBF7] border border-[#E6DED2] text-[#B88A5A] flex items-center justify-center transition-all duration-500 ${activeMistake === i ? 'opacity-0 -translate-y-4' : 'opacity-100 translate-y-0'}`}>
                      <span className="text-xl font-serif italic font-bold">!</span>
                    </div>
                    
                    {/* Text Content */}
                    <div className={`transform transition-all duration-500 ${activeMistake === i ? 'translate-y-0' : 'translate-y-8 lg:translate-y-12'}`}>
                      <h3 className={`text-lg lg:text-xl font-serif font-bold mb-2 leading-tight transition-colors duration-500 ${activeMistake === i ? 'text-[#B88A5A]' : 'text-[#5D4E42]'}`}>{mistake.title}</h3>
                      
                      <p className={`text-sm text-[#6F6A65] font-light leading-relaxed transition-all duration-500 transform ${activeMistake === i ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                        {mistake.desc}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* 6. RECOMMENDED SOAPS */}
        {quizResult && (
          <section id="recommended-soaps" className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
              <div className="text-center mb-16">
                <span className="text-[#B88A5A] tracking-widest text-xs uppercase font-semibold mb-2 block">Curated For You</span>
                <h2 className="text-3xl md:text-4xl font-serif font-bold text-[#5D4E42] mb-4">Your Ritual Match</h2>
                <p className="text-[#6F6A65] font-light max-w-2xl mx-auto text-lg">
                  Based on your {quizResult} skin profile, we recommend these specially formulated organic soaps to restore and maintain harmony.
                </p>
              </div>
              
              {loadingProducts ? (
                <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-4 gap-6 justify-center">
                  {[...Array(4)].map((_, i) => (
                    <ProductCardSkeleton key={i} />
                  ))}
                </div>
              ) : recommendedDynamicProducts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-4 xl:grid-cols-5 gap-3 justify-center">
                  {recommendedDynamicProducts.map((product, index) => {
                    const priceData = formatPrice(product.price, product.discountPrice, product.internationalPrices);
                    return (
                    <motion.div 
                      key={product._id || index} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.15, duration: 0.6 }}
                      className="h-full"
                    >
                      <Link 
                        to={`/product/${product._id}`}
                        className="group bg-white rounded-xl overflow-hidden border border-[#E6DED2] hover:border-[#B88A5A]/50 flex flex-row lg:flex-col h-full cursor-pointer block"
                      >
                        <div className="relative w-[35%] sm:w-[30%] lg:w-full h-auto min-h-[120px] lg:aspect-square shrink-0 overflow-hidden flex items-center justify-center bg-[#FDFBF7]">
                            <img 
                              src={product.images && product.images[0] ? product.images[0] : '/placeholder.jpg'} 
                              alt={product.name} 
                              className="w-full h-full object-contain"
                            loading="lazy" decoding="async" />
                        </div>

                        <div className="p-3 sm:p-5 flex flex-col flex-grow justify-between border-l lg:border-l-0 lg:border-t border-[#E6DED2]/50 w-full">
                          <div>
                            <div className="flex items-center justify-between mb-1 sm:mb-2">
                               <span className="text-[10px] uppercase tracking-wider font-semibold text-[#B88A5A]">{product.skinType || quizResult} Skin</span>
                            </div>
                            <h3 className="text-lg font-serif text-[#5D4E42] font-bold leading-tight group-hover:text-[#B88A5A] transition-colors duration-300 mb-2">{product.name}</h3>
                            <p className="text-[#6F6A65] font-light text-xs line-clamp-2">{product.shortDesc}</p>
                          </div>
                          
                          <div className="mt-4 pt-4 border-t border-[#E6DED2]/50 flex justify-center">
                            <div className="flex items-center gap-2">
                              <span className="text-lg font-bold text-[#5D4E42]">{priceData.discountFormatted || priceData.priceFormatted}</span>
                              {priceData.discountFormatted && (
                                <span className="text-xs text-[#9D948B] line-through">{priceData.priceFormatted}</span>
                              )}
                            </div>
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-16 bg-[#FDFBF7] rounded-[2rem] border border-[#E6DED2] shadow-sm max-w-2xl mx-auto">
                  <p className="text-[#5D4E42] font-serif text-2xl mb-2">Formulating perfection takes time.</p>
                  <p className="text-[#6F6A65] font-light">We are currently crafting the ideal organic soap for {quizResult} skin. Check back soon.</p>
                </div>
              )}
            </div>
          </section>
        )}

        {/* 7. FAQ (Editorial Split Layout) */}
        <section className="py-20 md:py-32 bg-[#F8F4EC]">
          <div className="max-w-6xl mx-auto px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row gap-12 lg:gap-20 items-start">
              
              {/* Left Column: Heading & Answer Display */}
              <div className="lg:w-5/12 flex flex-col justify-between sticky top-24">
                <div className="mb-8 lg:mb-12">
                  <span className="text-[#B88A5A] tracking-[0.2em] text-xs uppercase font-semibold mb-3 block">Got Doubts?</span>
                  <h2 className="text-4xl md:text-5xl font-serif font-bold text-[#5D4E42] mb-4">Common Questions</h2>
                  <p className="text-[#6F6A65] font-light text-lg">Everything you need to know about understanding your skin.</p>
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

        {/* 8. FINAL CTA (Luxury Floating Banner) */}
        <section className="py-16 md:py-24 bg-white px-4 lg:px-8">
          <div className="max-w-6xl mx-auto relative rounded-[2rem] bg-[#5D4E42] overflow-hidden shadow-2xl">
            {/* Background decorative elements */}
            <div className="absolute -top-32 -right-32 w-96 h-96 bg-[#8E7A65] rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-pulse"></div>
            <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-[#4A3E34] rounded-full mix-blend-multiply filter blur-3xl opacity-60"></div>
            
            <div className="relative z-10 px-8 py-16 md:py-20 lg:py-24 md:px-12 lg:px-16 flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-8">
              {/* Left Side: Copy */}
              <div className="lg:w-1/2 text-center lg:text-left">
                <span className="text-[#E6DED2] tracking-[0.2em] text-xs uppercase font-semibold mb-4 block">Personalized Guidance</span>
                <h2 className="text-4xl md:text-5xl font-serif font-bold text-white mb-6 leading-tight">Need Help Finding Your Match?</h2>
                <p className="text-[#E6DED2]/80 font-light text-lg mb-0 max-w-lg mx-auto lg:mx-0 leading-relaxed">
                  Our skin experts are happy to help you choose the right Vedalush soap for your unique skin concerns. We're just a message away.
                </p>
              </div>
              
              {/* Right Side: Glassmorphism Action Card */}
              <div className="lg:w-5/12 w-full max-w-md bg-white/10 backdrop-blur-md p-8 md:p-10 rounded-3xl border border-white/20 shadow-xl">
                <h3 className="text-2xl font-serif text-white mb-8 text-center font-semibold">Get in Touch</h3>
                <div className="flex flex-col gap-4">
                  <a href="https://wa.me/919904765058" target="_blank" rel="noreferrer" className="group flex items-center justify-center gap-3 px-8 py-4 bg-[#B88A5A] text-white rounded-full transition-all duration-300 shadow-lg hover:shadow-[#B88A5A]/40 transform hover:-translate-y-1 border border-[#B88A5A] hover:border-white/30">
                    <FaWhatsapp size={22} className="group-hover:scale-110 transition-transform duration-300" /> 
                    <span className="text-sm tracking-wider uppercase font-bold">WhatsApp Us</span>
                  </a>
                  
                  <div className="relative flex items-center py-2">
                    <div className="flex-grow border-t border-white/20"></div>
                    <span className="flex-shrink-0 mx-4 text-white/50 text-xs uppercase tracking-widest">or</span>
                    <div className="flex-grow border-t border-white/20"></div>
                  </div>

                  <Link to="/#contact" className="group flex items-center justify-center gap-3 px-8 py-4 bg-transparent text-white border border-white/40 rounded-full transition-all duration-300 hover:bg-white hover:text-[#5D4E42]">
                    <span className="text-sm tracking-wider uppercase font-bold">Contact</span>
                  </Link>
                </div>
                <p className="text-white/60 text-xs text-center mt-6 font-light tracking-wide">Typically replies within 24 hours</p>
              </div>
            </div>
          </div>
        </section>

      </main>

      <Footer />
    </>
  );
};

export default SkinTypeGuide;
