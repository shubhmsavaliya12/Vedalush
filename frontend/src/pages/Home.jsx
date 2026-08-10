import React from 'react';
import { Helmet } from 'react-helmet-async';
import Navbar from '../components/ui/Navbar';
import Hero from '../components/sections/Hero';
import FeaturedProducts from '../components/sections/FeaturedProducts';
import Benefits from '../components/sections/Benefits';
import Values from '../components/sections/Values';
import Ingredients from '../components/sections/Ingredients';
import Testimonials from '../components/sections/Testimonials';
import FAQ from '../components/sections/FAQ';
import DirectOrder from '../components/sections/DirectOrder';
import Contact from '../components/sections/Contact';
import Subscribe from '../components/sections/Subscribe';
import Footer from '../components/ui/Footer';

const Home = () => {
  return (
    <>
      <Helmet>
        <title>Vedalush | Premium Organic Skincare</title>
        <meta name="description" content="Discover luxurious, natural, and handcrafted organic soaps for radiant skin." />
      </Helmet>
      
      <Navbar />
      
      <main className="min-h-screen">
        <Hero />
        <FeaturedProducts />
        <Benefits />
        <Values />
        <Ingredients />
        <Testimonials />
        <FAQ />
        <DirectOrder />
        <Contact />
      </main>

      <Subscribe />
      <Footer />
    </>
  );
};

export default Home;
