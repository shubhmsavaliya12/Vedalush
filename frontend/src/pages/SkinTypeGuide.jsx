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

  const scrollToQuiz = (e) => {
    e.preventDefault();
    document.getElementById('quiz-section').scrollIntoView({ behavior: 'smooth', block: 'center' });
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
        
        {/* 1. HERO SECTION */}
        <section className="relative min-h-[50vh] md:min-h-[70vh] flex flex-col items-center justify-center overflow-hidden pt-24 pb-12 md:pt-32 md:pb-20 px-6 lg:px-8 text-center bg-gradient-to-b from-[#F8F4EC] to-[#FDFBF7]">
          {/* Subtle luxury background elements */}
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none opacity-20">
             <div className="absolute top-10 left-10 w-[500px] h-[500px] border border-[#B88A5A]/30 rounded-full blur-sm"></div>
             <div className="absolute -bottom-20 -right-20 w-[600px] h-[600px] border border-[#B88A5A]/20 rounded-full blur-md"></div>
          </div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative z-10 max-w-3xl mx-auto space-y-6 md:space-y-8"
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
              <a href="#quiz-section" onClick={scrollToQuiz} className="px-5 md:px-10 py-3 md:py-4 bg-[#5D4E42] text-xs md:text-sm text-white rounded-full text-center hover:bg-[#4A3E34] hover:shadow-xl transition-all duration-300 font-medium tracking-wide">
                Start Skin Quiz
              </a>
              <a href="#types-section" onClick={scrollToTypes} className="px-5 md:px-10 py-3 md:py-4 bg-transparent border border-[#5D4E42]/30 text-xs md:text-sm text-[#5D4E42] rounded-full text-center hover:border-[#5D4E42] hover:bg-[#5D4E42]/5 transition-all duration-300 font-medium tracking-wide">
                Explore Skin Types
              </a>
            </div>
          </motion.div>
        </section>

        {/* 2. QUICK SKIN QUIZ */}
        <section id="quiz-section" className="border-t border-[#B88A5A]/30 py-5">
          <div className="max-w-3xl mx-auto px-6 lg:px-8">
            
            <div className="min-h-[400px] flex flex-col justify-center relative overflow-hidden">              
              <AnimatePresence mode="wait">
                {!quizStarted && !quizResult && (
                  <motion.div key="start" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, y: -20 }} className="text-center relative z-10">
                    <HiOutlineSparkles className="w-12 h-12 mx-auto text-[#B88A5A] mb-6 opacity-80" />
                    <h2 className="text-3xl md:text-4xl font-serif font-bold text-[#5D4E42] mb-4">Find Your Skin Type in 30 Seconds</h2>
                    <p className="text-[#6F6A65] font-light mb-10 text-lg max-w-md mx-auto">
                      Answer a few quick questions about how your skin feels and reacts daily to get your personalized assessment.
                    </p>
                    <button onClick={() => setQuizStarted(true)} className="px-10 py-4 bg-[#B88A5A] text-white rounded-full hover:bg-[#A3784A] transition-colors shadow-lg hover:shadow-xl font-medium tracking-wide">
                      Start Quiz
                    </button>
                  </motion.div>
                )}

                {quizStarted && !quizResult && (
                  <motion.div key="question" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="w-full relative z-10">
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
                  <motion.div key="result" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center relative z-10">
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
          </div>
        </section>

        {/* 3. HOME TEST (Horizontal Cards) */}
        <section className="py-24 bg-[#F8F4EC]">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="text-center mb-16">
              <span className="text-[#B88A5A] tracking-widest text-xs uppercase font-semibold mb-2 block">Do It Yourself</span>
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-[#5D4E42]">The Bare-Faced Test</h2>
              <p className="text-[#6F6A65] font-light mt-4 max-w-xl mx-auto">
                Prefer to test it manually? Follow these four simple steps at home to accurately determine your skin's natural behavior.
              </p>
            </div>
            
            <div className="relative flex flex-col md:flex-row justify-between gap-6 md:gap-4 lg:gap-8">
              {/* Connecting line (Desktop) */}
              <div className="hidden md:block absolute top-[40%] left-[10%] right-[10%] h-[1px] bg-[#E6DED2] z-0"></div>
              
              {/* Connecting line (Mobile) */}
              <div className="md:hidden absolute left-8 top-10 bottom-10 w-[1px] bg-[#E6DED2] z-0"></div>

              {[
                { step: "01", title: "Wash", desc: "Cleanse your face with a gentle, non-stripping cleanser." },
                { step: "02", title: "Wait", desc: "Wait 30 minutes without applying any serums or moisturizers." },
                { step: "03", title: "Observe", desc: "Check for tightness, shine, or dry patches." },
                { step: "04", title: "Compare", desc: "Match your observations with the skin types below." }
              ].map((item, i) => (
                <motion.div 
                  key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-50px" }} transition={{ delay: i * 0.15, duration: 0.6 }}
                  className="relative z-10 flex md:flex-col items-center md:text-center gap-6 md:gap-0 bg-white md:bg-transparent p-6 md:p-0 rounded-2xl md:rounded-none shadow-sm md:shadow-none border border-[#E6DED2] md:border-none flex-1"
                >
                  <div className="w-16 h-16 shrink-0 md:mb-6 rounded-full bg-white border border-[#E6DED2] shadow-sm flex items-center justify-center text-[#B88A5A] font-serif font-bold text-xl relative">
                    {item.step}
                    <div className="absolute inset-1 rounded-full border border-[#B88A5A]/20"></div>
                  </div>
                  <div>
                    <h3 className="text-xl font-serif text-[#5D4E42] font-bold mb-2">{item.title}</h3>
                    <p className="text-[#6F6A65] font-light text-sm md:max-w-[200px] mx-auto leading-relaxed">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* 4. SKIN TYPES (Zigzag Layout) */}
        <section id="types-section" className="py-24 bg-[#FDFBF7]">
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
        <section className="py-24 bg-[#F8F4EC]">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="text-center mb-16">
              <span className="text-[#B88A5A] tracking-widest text-xs uppercase font-semibold mb-2 block">Skincare Sins</span>
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-[#5D4E42]">Common Cleansing Mistakes</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-2">
              {[
                { title: "Washing Too Often", desc: "Strips natural oils, leading to barrier damage." },
                { title: "Harsh Soaps", desc: "Commercial sulfates disrupt the skin's acidic mantle." },
                { title: "Skipping Moisturizer", desc: "Even oily skin needs hydration after cleansing." },
                { title: "Hot Water", desc: "Causes redness and exacerbates dry skin conditions." },
                { title: "Fragrance Focus", desc: "Choosing based on scent rather than skin suitability." }
              ].map((mistake, i) => (
                <motion.div 
                  key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-50px" }} transition={{ delay: i * 0.1 }}
                  className="bg-white p-6 rounded-2xl border border-[#E6DED2] shadow-sm hover:shadow-md transition-shadow flex flex-col items-center text-center"
                >
                  <div className="w-10 h-10 rounded-full bg-[#FDFBF7] border border-[#E6DED2] flex items-center justify-center mb-4 text-[#B88A5A]">
                    <span className="text-xl font-serif italic font-bold">0{i+1}</span>
                  </div>
                  <p className="text-lg font-serif font-bold text-[#5D4E42] mb-2">{mistake.title}</p>
                  <p className="text-sm text-[#6F6A65] font-light leading-relaxed">{mistake.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* 6. RECOMMENDED SOAPS */}
        {quizResult && (
          <section id="recommended-soaps" className="py-24 bg-white">
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

        {/* 7. FAQ */}
        <section className="py-24 bg-[#F8F4EC]">
          <div className="max-w-3xl mx-auto px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-[#5D4E42]">Common Questions</h2>
            </div>
            <div className="space-y-1">
              {faqs.map((faq, i) => (
                <div key={i} className="bg-white rounded-2xl border border-[#E6DED2] shadow-sm overflow-hidden">
                  <button 
                    onClick={() => setActiveFaq(activeFaq === i ? null : i)}
                    className="w-full text-left px-8 py-6 transition-colors flex justify-between items-center text-[#5D4E42] hover:bg-[#FDFBF7]"
                  >
                    <span className="font-serif font-bold text-lg">{faq.q}</span>
                    <motion.div animate={{ rotate: activeFaq === i ? 180 : 0 }} transition={{ duration: 0.3, ease: "easeOut" }}>
                      <FaChevronDown className="text-[#B88A5A]" />
                    </motion.div>
                  </button>
                  <AnimatePresence>
                    {activeFaq === i && (
                      <motion.div 
                        initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                        className="bg-white px-8 overflow-hidden"
                      >
                        <p className="pb-6 pt-2 text-[#6F6A65] font-light text-base leading-relaxed border-t border-[#E6DED2]/30 mt-2">{faq.a}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 8. FINAL CTA */}
        <section className="py-24 bg-white border-t border-[#E6DED2]">
          <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-[#5D4E42] mb-6">Need Help Choosing?</h2>
            <p className="text-[#6F6A65] font-light text-lg mb-10 max-w-lg mx-auto">
              Our skin experts are happy to help you choose the right Vedalush soap for your unique skin concerns. Contact us for a personalized recommendation.
            </p>
            <div className="flex flex-row gap-5 justify-center">
              <Link to="/#contact" className="px-8 py-3 bg-[#F8F4EC] text-xs text-[#5D4E42] border border-[#E6DED2] rounded-full font-medium hover:bg-white hover:border-[#5D4E42] transition-all duration-300">
                Contact Us
              </Link>
              <a href="https://wa.me/919904765058" target="_blank" rel="noreferrer" className="px-8 py-3 bg-[#5D4E42] text-xs text-white rounded-full font-medium hover:bg-[#4A3E34] transition-all duration-300 shadow-md flex items-center justify-center gap-3">
                <FaWhatsapp size={20} /> <span>WhatsApp Us</span>
              </a>
            </div>
          </div>
        </section>

      </main>

      <Footer />
    </>
  );
};

export default SkinTypeGuide;
