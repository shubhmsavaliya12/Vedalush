import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Swiper, SwiperSlide, useSwiper } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import { FaQuoteLeft, FaStar } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import axios from 'axios';

import 'swiper/css';

const ReviewCounter = ({ total }) => {
  const swiper = useSwiper();
  const [current, setCurrent] = useState(1);
  useEffect(() => {
    if (!swiper) return;
    const handleSlideChange = () => setCurrent(swiper.realIndex + 1);
    swiper.on('slideChange', handleSlideChange);
    return () => swiper.off('slideChange', handleSlideChange);
  }, [swiper]);
  return (
    <div className="text-center text-[#5D4E42] font-serif font-bold tracking-widest text-lg mt-8 z-20 relative">
      {current} / {total}
    </div>
  );
};

const Testimonials = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const trustpilotRef = useRef(null);

  useEffect(() => {
    if (window.Trustpilot && trustpilotRef.current) {
      window.Trustpilot.loadFromElement(trustpilotRef.current, true);
    }
  }, []);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const API_URL = import.meta.env.VITE_API_URL || `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}`;
        const response = await axios.get(`${API_URL}/api/reviews`, { headers: { Authorization: `Bearer ${localStorage.getItem('user_token')}` } });
        setReviews(response.data);
      } catch (error) {
        console.error('Error fetching reviews:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, []);

  return (
    <section id="reviews-section" className="py-24 bg-white relative overflow-hidden">
      {/* Background Accent */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-[#FDFBF7] rounded-l-full opacity-50 z-0 transform translate-x-1/4"></div>

      <div className="max-w-6xl mx-auto px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16 space-y-4">
          <motion.span 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-[#8E7A65] font-semibold tracking-widest uppercase text-sm"
          >
            Customer Stories
          </motion.span>
          <motion.h2 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-serif font-bold text-[#5D4E42]"
          >
            Loved by Skin Enthusiasts
          </motion.h2>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-48">
             <div className="w-8 h-8 border-4 border-[#E6DED2] border-t-[#8E7A65] rounded-full animate-spin"></div>
          </div>
        ) : reviews.length > 0 ? (
          <div className="w-full px-2 sm:px-4">
            <Swiper
              modules={[Autoplay]}
              spaceBetween={20}
              slidesPerView={1}
              breakpoints={{
                640: {
                  slidesPerView: 2,
                  spaceBetween: 24,
                },
                1024: {
                  slidesPerView: 2,
                  spaceBetween: 32,
                },
              }}
              grabCursor={true}
              autoplay={{ delay: 5000, disableOnInteraction: false }}
              className="pb-12"
            >
              {reviews.map((testimonial, index) => (
                <SwiperSlide key={testimonial._id || index} className="!h-auto flex">
                  <div className="w-full h-full bg-[#FFFFFF] rounded-2xl shadow-soft hover:shadow-soft-lg transform hover:-translate-y-1.5 border border-[#E6DED2] p-6 md:p-8 flex flex-col items-center text-center justify-between transition-all duration-250 min-h-[300px] md:min-h-[300px]">
                    <div className="flex flex-col items-center shrink-0">
                      <FaQuoteLeft className="text-3xl text-[#C19A6B]/50 mb-3" />
                      {/* Stars */}
                      <div className="flex space-x-1">
                        {[...Array(5)].map((_, i) => (
                          <FaStar 
                            key={i} 
                            className={`text-base ${i < testimonial.rating ? 'text-[#C19A6B]' : 'text-[#E6DED2]'}`} 
                          />
                        ))}
                      </div>
                    </div>

                    <div className="flex-grow overflow-y-auto custom-scrollbar w-full px-2 my-4 flex items-center justify-center">
                      <p className="text-lg md:text-xl font-serif text-[#6F6A65] leading-relaxed italic">
                        "{testimonial.content}"
                      </p>
                    </div>

                    <div className="shrink-0">
                      <h4 className="text-base md:text-lg font-serif font-bold text-[#5D4E42]">{testimonial.user?.name || 'Anonymous User'}</h4>
                      <p className="text-xs text-[#9D948B] font-normal">Verified Buyer</p>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
              <ReviewCounter total={reviews.length} />
            </Swiper>
          </div>
        ) : (
          <div className="text-center text-[#6F6A65] py-10">No reviews yet. Be the first to leave one!</div>
        )}

        <div className="text-center mt-8 flex flex-col items-center gap-5">
          <Link to="/reviews" className="inline-block px-8 py-3.5 bg-[#B88A5A] text-white font-semibold rounded-full hover:bg-[#9F7348] shadow-soft hover:shadow-soft-lg transform hover:-translate-y-0.5 transition-all duration-250 mb-10">
            View All Reviews
          </Link>

          {/* TrustBox widget - Review Collector */}
          <div 
            ref={trustpilotRef}
            className="trustpilot-widget w-full max-w-[400px]" 
            data-locale="en-US" 
            data-template-id="56278e9abfbbba0bdcd568bc" 
            data-businessunit-id="6a7f6a4c167853a114927484" 
            data-style-height="52px" 
            data-style-width="100%" 
            data-token="261a1bb0-457c-4c55-bd5b-15e8a5d749a6"
          >
            <a href="https://www.trustpilot.com/review/vedalush.com" target="_blank" rel="noopener noreferrer">Trustpilot</a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;

