import React from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Navbar from '../components/ui/Navbar';
import Footer from '../components/ui/Footer';

const AboutUs = () => {
  // Animation Variants
  const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  };

  return (
    <>
      <Helmet>
        <title>Vedalush | About Us</title>
        <meta name="description" content="Learn about Vedalush's story, our commitment to 100% organic ingredients, and our handcrafted skincare philosophy." />
      </Helmet>

      <Navbar />

      <main className="min-h-screen bg-[#FDFBF7] font-sans text-[#5D4E42]">
        
        {/* 1. HERO SECTION */}
        <section className="relative px-6 lg:px-12 max-w-[1400px] mx-auto min-h-[50vh] lg:min-h-[60vh] flex flex-col items-center justify-center text-center pt-24 pb-16 lg:pt-32">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            className="max-w-4xl space-y-6"
          >
            <h1 className="text-5xl md:text-6xl lg:text-6xl font-serif text-[#2E2721] font-semibold leading-[1.15] uppercase tracking-tight">
              Welcome to Vedalush
            </h1>
          </motion.div>
        </section>

        {/* 2. OUR STORY (TWO COLUMN TEXT) */}
        <section className="relative px-6 lg:px-12 max-w-[1200px] mx-auto py-16 lg:py-24 border-t border-[#E6DED2]/50 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="space-y-12"
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif font-semibold text-[#2E2721] leading-tight max-w-3xl mx-auto">
              Our Story
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 text-left text-base lg:text-lg text-[#5D4E42] leading-relaxed font-light">
              <div className="space-y-6">
                <p>
                  The journey of Vedalush started when we noticed a big problem: most skincare products today are full of harmful chemicals, but they are sold as luxury items. We wanted to change this completely.
                </p>
                <p>
                  We spent years learning about ancient Ayurvedic plants and mastering the traditional, cold-pressed method of making soap by hand.
                </p>
              </div>
              <div className="space-y-6">
                <p>
                  Our aim was not just to sell soap. We wanted to create a product that truly cares for your skin and is also safe for our environment.
                </p>
                <p>
                  Today, every single bar of Vedalush soap shows our strict promise of quality. Made by hand, naturally dried for weeks, and packed with love, our soaps bring you the best benefits of nature.
                </p>
              </div>
            </div>
          </motion.div>
        </section>

        {/* 3. CORE VALUES (SIMPLE TEXT) */}
        <section className="bg-[#FDFBF7] py-20 lg:py-32 flex flex-col items-center text-center px-6 border-t border-[#E6DED2]/30">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={fadeUp}
            className="max-w-3xl space-y-8"
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif font-semibold text-[#2E2721] leading-tight max-w-3xl mx-auto">
              Nothing Artificial, Just Pure Nature
            </h2>
            <div className="space-y-6 text-[#8E7A65] font-light text-base md:text-lg">
              <p>
                100% natural, organic ingredients. Plastic-free packaging. Handmade in India.
              </p>
              <p>
                Every product is made with ingredients we're happy to use on ourselves and our own family.
              </p>
            </div>
          </motion.div>
        </section>

        {/* 3.5 RELATED LINKS */}
        <section className="bg-[#FDFBF7] pb-20 lg:pb-24 px-6 border-b border-[#E6DED2]/30">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-md mx-auto flex flex-col gap-4"
          >
            <Link to="/#ingredients" className="block w-full py-4 px-6 rounded-full bg-[#2E2721] text-white hover:bg-[#3D332B] transition-colors text-xs md:text-sm font-semibold tracking-[0.1em] uppercase text-center shadow-sm hover:shadow-md">
              Learn More About Our Ingredients
            </Link>
            <Link to="/our-roots" className="block w-full py-4 px-6 rounded-full bg-[#2E2721] text-white hover:bg-[#3D332B] transition-colors text-xs md:text-sm font-semibold tracking-[0.1em] uppercase text-center shadow-sm hover:shadow-md">
              Discover Our Roots
            </Link>
            <Link to="/skin-type" className="block w-full py-4 px-6 rounded-full bg-[#2E2721] text-white hover:bg-[#3D332B] transition-colors text-xs md:text-sm font-semibold tracking-[0.1em] uppercase text-center shadow-sm hover:shadow-md">
              Find Your Skin Type
            </Link>
            <Link to="/reviews" className="block w-full py-4 px-6 rounded-full bg-[#2E2721] text-white hover:bg-[#3D332B] transition-colors text-xs md:text-sm font-semibold tracking-[0.1em] uppercase text-center shadow-sm hover:shadow-md">
              Read Customer Reviews
            </Link>
          </motion.div>
        </section>

        {/* 4. THE FOUNDER / ARTISAN SECTION */}
        <section className="relative px-6 lg:px-12 max-w-[1000px] mx-auto py-20 lg:py-30 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="space-y-8"
          >
            {/* Founder Avatar */}
            <div className="w-32 h-32 md:w-40 md:h-40 mx-auto rounded-full bg-[#E6DED2] flex items-center justify-center border-4 border-[#FDFBF7] shadow-lg overflow-hidden">
               <img src="/images/founder.webp" alt="Founder of Vedalush" className="w-full h-full object-cover scale-110" />
            </div>
            
            <h2 className="text-3xl lg:text-4xl font-serif font-semibold text-[#2E2721]">
              "Nature has everything we need to heal and protect our skin naturally."
            </h2>
            
            <div className="text-lg text-[#8E7A65] font-light space-y-4 max-w-2xl mx-auto">
              <p>
                [ Placeholder text: You can add a short story about yourself here. Write about why you love natural skincare and how you started Vedalush. You can edit this later. ]
              </p>
            </div>
            
            <div className="pt-4">
              <p className="text-[#2E2721] font-semibold uppercase text-sm">
                Neha Savaliya
              </p>
              <p className="text-[#B88A5A] text-xs uppercase tracking-widest mt-1">
                Founder & Main Creator
              </p>
            </div>
          </motion.div>
        </section>

        {/* 5. CALL TO ACTION BANNER */}
        <section className="py-20 lg:py-20 text-center px-6 border-t border-[#E6DED2]/50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl mx-auto space-y-8"
          >
            <h2 className="text-3xl md:text-5xl font-serif font-semibold text-[#2E2721]">
              Ready to feel the magic of nature?
            </h2>
            <p className="text-[#2E2721] font-light text-lg pb-4">
              Check out our wide range of handmade, cold-pressed soaps.
            </p>
            <Link 
              to="/#products"
              className="inline-block px-10 py-4 bg-[#B88A5A] text-white rounded-full font-semibold tracking-wide hover:bg-[#9F7348] transition-all duration-250 shadow-soft hover:shadow-lg transform hover:-translate-y-0.5"
            >
              Shop Our Collection
            </Link>
          </motion.div>
        </section>

      </main>

      <Footer />
    </>
  );
};

export default AboutUs;
