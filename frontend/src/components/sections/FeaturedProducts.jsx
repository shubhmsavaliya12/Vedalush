import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FaArrowRight } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useCurrency } from '../../context/CurrencyContext';
import { Swiper, SwiperSlide, useSwiper } from 'swiper/react';
import { Pagination, Autoplay, EffectFade } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
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
    <div className="absolute top-4 left-4 z-20 text-[#5D4E42] text-sm font-bold tracking-widest drop-shadow-sm">
      {current} / {total}
    </div>
  );
};

const FeaturedProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { formatPrice } = useCurrency();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/products');
        setProducts(response.data);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  if (loading) {
    return (
      <section id="products" className="py-24 bg-[#FDFBF7] flex justify-center items-center">
        <div className="w-12 h-12 border-4 border-[#E6DED2] border-t-[#8E7A65] rounded-full animate-spin"></div>
      </section>
    );
  }

  return (
    <section id="products" className="py-15 bg-[#FDFBF7]">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center mb-16 space-y-4">
          <motion.span 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-[#8E7A65] font-semibold tracking-widest uppercase text-sm"
          >
            Our Collection
          </motion.span>
          <motion.h2 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-serif font-bold text-[#5D4E42]"
          >
            Featured Best Sellers
          </motion.h2>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6 lg:gap-10">
          {products.map((product, index) => {
            const priceData = formatPrice(product.price, product.discountPrice, product.internationalPrices);
            return (
            <motion.div 
              key={product._id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2, duration: 0.6 }}
              className="h-full"
            >
              <Link 
                to={`/product/${product._id}`}
                className="group bg-white rounded-2xl overflow-hidden shadow-soft hover:shadow-soft-lg transform hover:-translate-y-1.5 transition-all duration-250 border border-[#E6DED2] flex flex-col h-full cursor-pointer block"
              >
                {/* Product Image Slider */}
                <div className="relative h-44 sm:h-64 md:h-80 overflow-hidden bg-[#FDFBF7]">
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
                  
                  <div className="flex items-center justify-center gap-1.5 sm:gap-2 pt-2 sm:pt-4 border-t border-[#E6DED2]/40 text-center flex-wrap">
                    {priceData.discountFormatted ? (
                      <>
                        <span className="text-sm sm:text-lg lg:text-xl font-bold text-[#5D4E42]">{priceData.discountFormatted}</span>
                        <span className="text-[10px] sm:text-sm text-[#9D948B] line-through">{priceData.priceFormatted}</span>
                        {priceData.rawDiscount && priceData.rawDiscount < priceData.rawPrice && (
                          <span className="text-[9px] sm:text-xs font-semibold text-[#5D4E42] bg-[#E6DED2]/80 border border-[#C19A6B]/30 px-1.5 py-0.5 rounded-md ml-0.5">
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
          
          {products.length === 0 && !loading && (
            <div className="col-span-full text-center py-20 text-[#8E7A65] font-serif text-xl">
              Check back soon for our new collection of luxury soaps.
            </div>
          )}
        </div>
        
      </div>
    </section>
  );
};

export default FeaturedProducts;

