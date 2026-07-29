import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { 
  FaTint, FaSun, FaLeaf, FaFeatherAlt, FaMagic, 
  FaCheckCircle, FaPlay, FaChevronDown, FaWhatsapp, 
  FaClock, FaHandsWash, FaEye, FaClipboardList,
  FaArrowRight
} from 'react-icons/fa';
import { HiOutlineShieldCheck, HiOutlineSparkles, HiOutlineHeart } from 'react-icons/hi';
import Navbar from '../components/ui/Navbar';
import Footer from '../components/ui/Footer';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useCurrency } from '../context/CurrencyContext';
import { Swiper, SwiperSlide, useSwiper } from 'swiper/react';
import { Autoplay, EffectFade } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-fade';

const SlideCounter = ({ total }) => {
  const swiper = useSwiper();
  const [current, setCurrent] = useState(1);
  useEffect(() => {
    if (!swiper) return;
    const handleSlideChange = () => setCurrent(swiper.realIndex + 1);
    swiper.on('slideChange', handleSlideChange);
    return () => swiper.off('slideChange', handleSlideChange);
  }, [swiper]);
  return (
    <div className="absolute top-4 left-4 z-20 text-nature-900 text-sm font-bold tracking-widest drop-shadow-sm">
      {current} / {total}
    </div>
  );
};

const benefits = [
  { icon: <HiOutlineShieldCheck className="w-7 h-7 sm:w-8 sm:h-8 text-nature-600" />, title: "Choose the right soap" },
  { icon: <FaTint className="w-7 h-7 sm:w-8 sm:h-8 text-nature-600" />, title: "Reduce dryness" },
  { icon: <HiOutlineHeart className="w-7 h-7 sm:w-8 sm:h-8 text-nature-600" />, title: "Avoid irritation" },
  { icon: <HiOutlineSparkles className="w-7 h-7 sm:w-8 sm:h-8 text-nature-600" />, title: "Improve skin health" }
];


const skinTypes = [
  { icon: <FaLeaf className="text-nature-600" size={32} />, title: "Normal Skin", desc: "Well-balanced skin that is neither too dry nor too oily.", traits: ["No severe sensitivity", "Barely visible pores", "Radiant complexion"] },
  { icon: <FaSun className="text-nature-500" size={32} />, title: "Dry Skin", desc: "Produces less sebum than normal skin, often feels tight.", traits: ["Invisible pores", "Dull, rough complexion", "Red patches"] },
  { icon: <FaTint className="text-nature-500" size={32} />, title: "Oily Skin", desc: "Overproduction of sebum leading to shine and breakouts.", traits: ["Enlarged pores", "Shiny complexion", "Prone to blackheads"] },
  { icon: <FaMagic className="text-nature-700" size={32} />, title: "Combination Skin", desc: "Features both oily and dry areas, usually an oily T-zone.", traits: ["Oily T-zone", "Dry cheeks", "Larger pores in T-zone"] },
  { icon: <FaFeatherAlt className="text-nature-400" size={32} />, title: "Sensitive Skin", desc: "Easily triggered by products or environment, prone to redness.", traits: ["Redness", "Itching or burning", "Dryness and flaking"] }
];

const steps = [
  { icon: <FaHandsWash size={24} />, text: "Wash your face with a gentle cleanser." },
  { icon: <FaCheckCircle size={24} />, text: "Do not apply any skincare products." },
  { icon: <FaClock size={24} />, text: "Wait for approximately 30 minutes." },
  { icon: <FaEye size={24} />, text: "Observe how your skin feels." },
  { icon: <FaClipboardList size={24} />, text: "Compare the results with the guide below." }
];

const faqs = [
  { q: "Can skin type change over time?", a: "Yes, your skin type can change due to age, hormones, climate, and diet." },
  { q: "How often should I check my skin type?", a: "It's good to re-evaluate your skin type every season or if you notice significant changes in its behavior." },
  { q: "Can I have more than one skin type?", a: "Yes, this is known as combination skin, where some areas are oily (like the T-zone) and others are dry." },
  { q: "Which soap is suitable for sensitive skin?", a: "Our Ratanjyot & Sea buckthorn soap or Yashtimadhu & Jojoba oil soap are excellent for sensitive skin, free from harsh chemicals." },
  { q: "Is this test medically accurate?", a: "This is a basic home test to help you select cosmetic products. For medical skin conditions, please consult a dermatologist." }
];

const quizQuestions = [
  { q: "Does your skin feel tight after washing?", options: [{text:"Always", type:"Dry"}, {text:"Sometimes", type:"Combination"}, {text:"Rarely", type:"Oily"}, {text:"Never", type:"Normal"}] },
  { q: "Does your face become shiny after a few hours?", options: [{text:"All over", type:"Oily"}, {text:"Only on forehead/nose", type:"Combination"}, {text:"No, it stays matte", type:"Dry"}, {text:"Just a natural glow", type:"Normal"}] },
  { q: "Do you frequently experience acne?", options: [{text:"Yes, often", type:"Oily"}, {text:"Sometimes, in T-zone", type:"Combination"}, {text:"Rarely", type:"Normal"}, {text:"No, but I get red bumps", type:"Sensitive"}] },
  { q: "Do your cheeks feel dry?", options: [{text:"Yes, very", type:"Dry"}, {text:"Yes, especially in winter", type:"Combination"}, {text:"No, they feel fine", type:"Normal"}, {text:"No, they are oily", type:"Oily"}] },
  { q: "Does your skin become irritated easily?", options: [{text:"Yes, frequently", type:"Sensitive"}, {text:"Sometimes with new products", type:"Dry"}, {text:"Rarely", type:"Normal"}, {text:"Never", type:"Oily"}] }
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
        const response = await axios.get('http://localhost:5000/api/products');
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
        // Check if the skin type matches the result, or if it's meant for 'all' skin types
        return skinTypeLower.includes(target) || skinTypeLower.includes('all');
      })
    : [];

  const scrollToRecommendations = (e) => {
    e.preventDefault();
    const element = document.getElementById('recommended-soaps');
    if (element) {
      const y = element.getBoundingClientRect().top + window.scrollY - 100;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

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

  return (
    <>
      <Helmet>
        <title>Skin Type Guide | Vedalush</title>
        <meta name="description" content="Learn how to identify your skin type and choose the best organic Vedalush soaps for your skin's unique needs." />
      </Helmet>
      
      <Navbar />

      <main className="min-h-screen">
        
        {/* SECTION 1: Hero Section */}
        <section className="relative min-h-[90vh] flex items-center justify-center bg-nature-100 overflow-hidden pt-32 pb-20">
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
            <div className="absolute -top-20 -right-20 w-96 h-96 bg-nature-200 rounded-full blur-3xl opacity-50 mix-blend-multiply"></div>
          </div>
          
          <div className="relative z-10 max-w-4xl mx-auto px-6 lg:px-8 w-full flex flex-col items-center justify-center text-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}
            className="space-y-6 z-10"
          >
            <h1 className="text-4xl md:text-6xl font-serif font-bold text-nature-900 leading-tight">
              Know Your Skin Before <span className="italic font-light text-nature-700">Choosing Your Soap</span>
            </h1>
            <p className="text-lg text-nature-800 font-light max-w-xl mx-auto">
              Healthy skin starts with understanding your skin type. Take a few minutes to learn how to identify your skin correctly.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-4">
              <a href="#video-guide" className="px-8 py-4 bg-nature-900 text-nature-50 rounded-full text-center hover:bg-nature-800 transition-all shadow-soft-lg flex items-center justify-center gap-2 whitespace-nowrap">
                <FaPlay size={12} /> <span>Watch Video</span>
              </a>
              <a href="#types" className="px-8 py-4 bg-transparent border border-nature-900 text-nature-900 rounded-full text-center hover:bg-nature-900 hover:text-nature-50 transition-all flex items-center justify-center whitespace-nowrap">
                <span>Explore Skin Types</span>
              </a>
            </div>
          </motion.div>
          </div>
        </section>

        {/* SECTION 2: Why Knowing Your Skin Type Matters */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-nature-900">Why Knowing Your Skin Type Matters</h2>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8">
              {benefits.map((benefit, i) => (
                <motion.div 
                  key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                  className="bg-nature-50 p-4 sm:p-8 rounded-3xl text-center shadow-soft hover:shadow-soft-lg transition-all duration-300 transform hover:-translate-y-1 border border-nature-100 flex flex-col items-center justify-center"
                >
                  <div className="flex justify-center mb-3 sm:mb-6">{benefit.icon}</div>
                  <h3 className="text-sm sm:text-xl font-serif text-nature-900 font-bold leading-snug">{benefit.title}</h3>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION 3: Educational Video */}
        <section id="video-guide" className="py-20 bg-nature-100">
          <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-nature-900 mb-4">How to Check Your Skin Type</h2>
            <p className="text-nature-700 font-light mb-12">Watch this short video before selecting your soap.</p>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
              className="relative w-full h-64 sm:h-96 md:h-[500px] rounded-3xl overflow-hidden shadow-2xl bg-nature-800 flex items-center justify-center border-4 border-white group cursor-pointer"
            >
              <img src="/images/hero_soap.png" alt="Video Placeholder" className="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-overlay group-hover:opacity-70 transition-opacity" loading="lazy" decoding="async" />
              <div className="z-10 w-20 h-20 bg-white/30 backdrop-blur-md rounded-full flex items-center justify-center text-white group-hover:bg-white/50 transition-colors">
                <FaPlay size={32} className="ml-2" />
              </div>
            </motion.div>
          </div>
        </section>

        {/* SECTION 4: Different Skin Types */}
        <section id="types" className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-nature-900">Different Skin Types</h2>
            </div>
            <div className="flex flex-wrap justify-center gap-8">
              {skinTypes.map((type, i) => (
                <motion.div 
                  key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                  className="bg-nature-50 p-8 rounded-3xl shadow-soft hover:shadow-soft-lg transition-all duration-300 border border-nature-100 flex flex-col items-center text-center group w-full md:w-[calc(50%-1rem)] lg:w-[calc(33.333%-1.5rem)]"
                >
                  <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center shadow-sm mb-6 group-hover:scale-110 transition-transform">
                    {type.icon}
                  </div>
                  <h3 className="text-2xl font-serif text-nature-900 mb-3">{type.title}</h3>
                  <p className="text-nature-700 font-light text-sm mb-6 flex-grow">{type.desc}</p>
                  <ul className="text-left w-full space-y-2 border-t border-nature-200 pt-4">
                    {type.traits.map((trait, j) => (
                      <li key={j} className="text-sm text-nature-800 font-light flex items-center gap-2">
                        <FaCheckCircle className="text-nature-400" size={12} /> <span>{trait}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION 5: How To Test Your Skin At Home */}
        <section className="py-20 bg-nature-50">
          <div className="max-w-3xl mx-auto px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-nature-900">How To Test Your Skin At Home</h2>
            </div>
            
            <style>{`
              .timeline-container { position: relative; max-width: 56rem; margin: 0 auto; }
              .timeline-line { position: absolute; top: 0; bottom: 0; width: 4px; background-color: #EAE1D0; border-radius: 9999px; }
              .timeline-item { position: relative; display: flex; align-items: center; width: 100%; min-height: 4rem; }
              .timeline-icon { position: absolute; z-index: 10; display: flex; align-items: center; justify-content: center; background-color: #6B7A49; color: white; border: 4px solid #FDFCFB; border-radius: 9999px; box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1); }
              .timeline-text-wrapper { display: flex; width: 100%; }
              .timeline-text-card { background-color: white; padding: 1.5rem; border-radius: 1rem; border: 1px solid #F5F2EB; width: 100%; box-shadow: 0 10px 40px -10px rgba(0,0,0,0.05); }

              /* Mobile (Default) */
              .timeline-line { left: 2rem; transform: translateX(-50%); }
              .timeline-icon { width: 3rem; height: 3rem; left: 2rem; transform: translateX(-50%); }
              .timeline-text-wrapper { padding-left: 5rem; justify-content: flex-start; }
              .timeline-text-card { text-align: left; }

              /* Desktop */
              @media (min-width: 768px) {
                .timeline-line { left: 50%; }
                .timeline-icon { width: 4rem; height: 4rem; left: 50%; }
                .timeline-text-wrapper { padding-left: 0; }
                .timeline-text-wrapper.even { justify-content: flex-start; }
                .timeline-text-wrapper.odd { justify-content: flex-end; }
                .timeline-text-card { width: 45%; }
                .timeline-text-wrapper.even .timeline-text-card { text-align: right; }
                .timeline-text-wrapper.odd .timeline-text-card { text-align: left; }
              }
            `}</style>

            <div className="timeline-container">
              <div className="timeline-line"></div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4rem' }}>
                {steps.map((step, i) => (
                  <motion.div 
                    key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                    className="timeline-item"
                  >
                    <div className="timeline-icon">
                      {step.icon}
                    </div>

                    <div className={`timeline-text-wrapper ${i % 2 === 0 ? 'even' : 'odd'}`}>
                       <div className="timeline-text-card">
                          <p className="text-nature-800 font-medium">{step.text}</p>
                       </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 6: Skin Comparison Table */}
        <section className="py-20 bg-white">
          <div className="max-w-6xl mx-auto px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-nature-900">Skin Comparison Table</h2>
            </div>
            <div className="overflow-x-auto bg-nature-50 rounded-2xl shadow-soft border border-nature-100">
              <table className="w-full text-left border-collapse min-w-[800px]">
                <thead>
                  <tr className="bg-nature-200/50">
                    <th className="p-4 font-serif text-nature-900 border-b border-nature-200">Feature</th>
                    <th className="p-4 font-serif text-nature-900 border-b border-nature-200">Normal</th>
                    <th className="p-4 font-serif text-nature-900 border-b border-nature-200">Dry</th>
                    <th className="p-4 font-serif text-nature-900 border-b border-nature-200">Oily</th>
                    <th className="p-4 font-serif text-nature-900 border-b border-nature-200">Combination</th>
                    <th className="p-4 font-serif text-nature-900 border-b border-nature-200">Sensitive</th>
                  </tr>
                </thead>
                <tbody className="text-sm text-nature-800 font-light">
                  <tr className="border-b border-nature-100 hover:bg-white transition-colors">
                    <td className="p-4 font-medium text-nature-900">Appearance</td>
                    <td className="p-4">Clear, radiant</td>
                    <td className="p-4">Dull, rough</td>
                    <td className="p-4">Shiny, thick</td>
                    <td className="p-4">Shiny T-zone, dry cheeks</td>
                    <td className="p-4">Red patches, inflamed</td>
                  </tr>
                  <tr className="border-b border-nature-100 hover:bg-white transition-colors">
                    <td className="p-4 font-medium text-nature-900">Pores</td>
                    <td className="p-4">Barely visible</td>
                    <td className="p-4">Invisible</td>
                    <td className="p-4">Enlarged</td>
                    <td className="p-4">Larger in T-zone</td>
                    <td className="p-4">Normal to large</td>
                  </tr>
                  <tr className="border-b border-nature-100 hover:bg-white transition-colors">
                    <td className="p-4 font-medium text-nature-900">Oiliness</td>
                    <td className="p-4">Balanced</td>
                    <td className="p-4">Very low</td>
                    <td className="p-4">High</td>
                    <td className="p-4">High in T-zone</td>
                    <td className="p-4">Variable</td>
                  </tr>
                  <tr className="border-b border-nature-100 hover:bg-white transition-colors">
                    <td className="p-4 font-medium text-nature-900">Dryness</td>
                    <td className="p-4">None</td>
                    <td className="p-4">High (tight feeling)</td>
                    <td className="p-4">None</td>
                    <td className="p-4">On cheeks</td>
                    <td className="p-4">Prone to flaking</td>
                  </tr>
                  <tr className="border-b border-nature-100 hover:bg-white transition-colors">
                    <td className="p-4 font-medium text-nature-900">Acne</td>
                    <td className="p-4">Rare</td>
                    <td className="p-4">Rare</td>
                    <td className="p-4">Frequent</td>
                    <td className="p-4">Occasional (T-zone)</td>
                    <td className="p-4">Red bumps/reactions</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* BONUS: Interactive Skin Type Checker */}
        <section className="py-20 bg-nature-100">
          <div className="max-w-3xl mx-auto px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-nature-900 mb-4">Interactive Skin Type Checker</h2>
              <p className="text-nature-700 font-light">Answer 5 quick questions to discover your skin type.</p>
            </div>
            
            <div className="bg-white p-8 md:p-12 rounded-3xl shadow-soft-lg border border-nature-200 min-h-[300px] flex flex-col justify-center">
              <AnimatePresence mode="wait">
                {!quizStarted && !quizResult && (
                  <motion.div key="start" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center">
                    <FaMagic size={48} className="mx-auto text-nature-400 mb-6" />
                    <h3 className="text-2xl font-serif text-nature-900 mb-6">Ready to find out?</h3>
                    <button onClick={() => setQuizStarted(true)} className="px-8 py-3 bg-nature-900 text-white rounded-full hover:bg-nature-800 transition-colors shadow-soft">
                      Start Quiz
                    </button>
                  </motion.div>
                )}

                {quizStarted && !quizResult && (
                  <motion.div key="question" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="w-full">
                    <div className="text-sm text-nature-500 mb-4 font-medium tracking-wider">QUESTION {currentQuestion + 1} OF {quizQuestions.length}</div>
                    <h3 className="text-2xl font-serif text-nature-900 mb-8">{quizQuestions[currentQuestion].q}</h3>
                    <div className="space-y-4">
                      {quizQuestions[currentQuestion].options.map((opt, i) => (
                        <button 
                          key={i} 
                          onClick={() => handleAnswer(opt.type)}
                          className="w-full text-left p-4 rounded-xl border border-nature-200 hover:border-nature-600 hover:bg-nature-50 transition-colors text-nature-800 font-light"
                        >
                          {opt.text}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}

                {quizResult && (
                  <motion.div key="result" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-nature-100 text-nature-700 mb-6 shadow-inner">
                      {quizResult === 'Normal' && <FaLeaf size={32} />}
                      {quizResult === 'Dry' && <FaSun size={32} />}
                      {quizResult === 'Oily' && <FaTint size={32} />}
                      {quizResult === 'Combination' && <FaMagic size={32} />}
                      {quizResult === 'Sensitive' && <FaFeatherAlt size={32} />}
                    </div>
                    <h3 className="text-sm text-nature-500 font-medium tracking-widest uppercase mb-2">Your Skin Type Is</h3>
                    <h2 className="text-4xl font-serif text-nature-900 mb-6 font-bold">{quizResult} Skin</h2>
                    <p className="text-nature-700 font-light mb-8 max-w-md mx-auto">
                      Based on your answers, your skin shows characteristics of {quizResult.toLowerCase()} skin. Scroll down to see our recommended soaps for you!
                    </p>
                    <button onClick={resetQuiz} className="px-6 py-2 border border-nature-300 text-nature-700 rounded-full hover:bg-nature-50 transition-colors text-sm mb-6 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B88A5A] focus-visible:ring-offset-2">
                      Retake Quiz
                    </button>
                    <div>
                      <button onClick={scrollToRecommendations} className="inline-flex flex-col items-center gap-2 text-nature-600 hover:text-nature-900 font-medium transition-colors mt-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B88A5A] focus-visible:ring-offset-2">
                        <span>See Recommendations</span>
                        <FaChevronDown className="animate-bounce" />
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </section>

        {/* SECTION 7: Recommended Vedalush Products */}
        {quizResult && (
          <section id="recommended-soaps" className="py-20 bg-[#FDFBF7]">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-serif font-bold text-[#5D4E42] mb-4">Recommended For You</h2>
                <p className="text-[#6F6A65] font-normal max-w-2xl mx-auto">
                  Based on your {quizResult} skin profile, we recommend these specially formulated organic soaps.
                </p>
              </div>
              
              {loadingProducts ? (
                <div className="flex justify-center py-20">
                  <div className="w-12 h-12 border-4 border-[#E6DED2] border-t-[#8E7A65] rounded-full animate-spin"></div>
                </div>
              ) : recommendedDynamicProducts.length > 0 ? (
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6 lg:gap-10 justify-center">
                  {recommendedDynamicProducts.map((product, index) => {
                    const priceData = formatPrice(product.price, product.discountPrice, product.internationalPrices);
                    return (
                    <motion.div 
                      key={product._id || index} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.2, duration: 0.6 }}
                      className="h-full"
                    >
                      <Link 
                        to={`/product/${product._id}`}
                        className="group bg-[#FFFFFF] rounded-2xl overflow-hidden shadow-soft hover:shadow-soft-lg transform hover:-translate-y-1.5 transition-all duration-250 border border-[#E6DED2] flex flex-col h-full cursor-pointer block"
                      >
                        {/* Product Image Slider */}
                        <div className="relative h-44 sm:h-64 md:h-80 overflow-hidden bg-[#F8F4EC]">
                          {product.images && product.images.length > 1 ? (
                            <Swiper
                              modules={[Autoplay, EffectFade]}
                              effect="fade"
                              autoplay={{ delay: 3000, disableOnInteraction: false }}
                              className="w-full h-full"
                              loop={true}
                            >
                              <SlideCounter total={product.images.length} />
                              {product.images.map((img, i) => (
                                <SwiperSlide key={i}>
                                  <img 
                                    src={img} 
                                    alt={`${product.name} - image ${i + 1}`} 
                                    className="w-full h-full object-cover"
                                  loading="lazy" decoding="async" />
                                </SwiperSlide>
                              ))}
                            </Swiper>
                          ) : (
                            <img 
                              src={product.images && product.images[0] ? product.images[0] : '/placeholder.jpg'} 
                              alt={product.name} 
                              className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out"
                            loading="lazy" decoding="async" />
                          )}
                          {product.images?.length === 1 && (
                            <div className="absolute inset-0 bg-[#5D4E42]/10 group-hover:bg-transparent transition-colors duration-300 pointer-events-none"></div>
                          )}
                        </div>

                        {/* Product Details */}
                        <div className="p-3 sm:p-6 lg:p-8 flex flex-col flex-grow justify-between space-y-2 sm:space-y-4">
                          <div>
                            <h3 className="text-sm sm:text-xl lg:text-2xl font-serif text-[#5D4E42] font-bold leading-snug group-hover:text-[#8E7A65] transition-colors duration-250">{product.name}</h3>
                            <p className="text-[#6F6A65] font-normal text-[11px] sm:text-sm leading-snug line-clamp-2 mt-1 sm:mt-2">{product.shortDesc}</p>
                          </div>
                          
                          <div className="flex items-center justify-center gap-1.5 sm:gap-2 pt-2 sm:pt-4 border-t border-[#E6DED2]/60 text-center flex-wrap">
                            {priceData.discountFormatted ? (
                              <>
                                <span className="text-sm sm:text-lg lg:text-xl font-bold text-[#5D4E42]">{priceData.discountFormatted}</span>
                                <span className="text-[10px] sm:text-sm text-[#9D948B] line-through">{priceData.priceFormatted}</span>
                                {priceData.rawDiscount && priceData.rawDiscount < priceData.rawPrice && (
                                  <span className="text-[9px] sm:text-xs font-semibold text-[#8E7A65] bg-[#F8F4EC] border border-[#E6DED2] px-1.5 py-0.5 rounded-md ml-0.5">
                                    {Math.round(((priceData.rawPrice - priceData.rawDiscount) / priceData.rawPrice) * 100)}% OFF
                                  </span>
                                )}
                              </>
                            ) : (
                              <span className="text-sm sm:text-lg lg:text-xl font-bold text-[#5D4E42]">{priceData.priceFormatted}</span>
                            )}
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-10 bg-[#FFFFFF] rounded-3xl border border-[#E6DED2] shadow-soft">
                  <p className="text-[#6F6A65] font-serif text-xl">We are currently formulating the perfect organic soap for {quizResult} skin.</p>
                  <p className="text-[#9D948B] mt-2">Check back soon for new additions to our collection!</p>
                </div>
              )}
            </div>
          </section>
        )}

        {/* SECTION 8: FAQ */}
        <section className="py-20 bg-white">
          <div className="max-w-4xl mx-auto px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-nature-900">Frequently Asked Questions</h2>
            </div>
            <div className="space-y-4">
              {faqs.map((faq, i) => (
                <div key={i} className="border border-nature-200 rounded-2xl overflow-hidden">
                  <button 
                    onClick={() => setActiveFaq(activeFaq === i ? null : i)}
                    className="w-full text-left px-6 py-5 bg-nature-50 hover:bg-nature-100 transition-colors flex justify-between items-center text-nature-900 font-medium"
                  >
                    {faq.q}
                    <motion.div animate={{ rotate: activeFaq === i ? 180 : 0 }} transition={{ duration: 0.3 }}>
                      <FaChevronDown className="text-nature-500" />
                    </motion.div>
                  </button>
                  <AnimatePresence>
                    {activeFaq === i && (
                      <motion.div 
                        initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                        className="bg-white px-6 overflow-hidden"
                      >
                        <p className="py-5 text-nature-700 font-light text-sm">{faq.a}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION 9: Need Help Choosing? */}
        <section className="py-20 bg-nature-900 text-nature-50 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
          <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center relative z-10">
            <h2 className="text-3xl md:text-5xl font-serif font-bold mb-6">Still Not Sure?</h2>
            <p className="text-nature-200 font-light text-lg mb-10 max-w-2xl mx-auto">
              Our team is happy to help you choose the right Vedalush soap for your skin. Reach out to us for a personalized recommendation.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="#contact" className="px-8 py-4 bg-white text-nature-900 rounded-full font-medium hover:bg-nature-100 transition-colors shadow-soft">
                <span>Contact Us</span>
              </a>
              <a href="https://wa.me/" target="_blank" rel="noreferrer" className="px-8 py-4 text-white rounded-full font-medium transition-colors shadow-soft flex items-center justify-center gap-2" style={{ backgroundColor: '#25D366' }} onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#128C7E'} onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#25D366'}>
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
