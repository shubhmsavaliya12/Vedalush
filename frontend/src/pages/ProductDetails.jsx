import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { useCurrency } from '../context/CurrencyContext';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import { FaAmazon, FaShoppingCart, FaArrowLeft, FaCheckCircle, FaLeaf, FaBalanceScale, FaChevronLeft, FaChevronRight, FaChevronUp, FaChevronDown, FaStar, FaRegStar } from 'react-icons/fa';
import { HiOutlineX } from 'react-icons/hi';
import { useAuth } from '../context/AuthContext';
import { Swiper, SwiperSlide, useSwiper } from 'swiper/react';
import { Pagination, Autoplay, EffectFade } from 'swiper/modules';
import { ProductDetailsSkeleton } from '../components/ui/Skeletons';
import { getOptimizedCloudinaryUrl } from '../utils/cloudinary';
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
    <div className="absolute top-4 left-4 z-20 text-nature-900 text-sm font-bold tracking-widest drop-shadow-sm">
      {current} / {total}
    </div>
  );
};

import Navbar from '../components/ui/Navbar';
import Footer from '../components/ui/Footer';

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const [productReviews, setProductReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const { user } = useAuth();
  
  // Review Modal State
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewContent, setReviewContent] = useState('');
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [reviewError, setReviewError] = useState('');
  const [reviewSuccess, setReviewSuccess] = useState(false);
  
  const [swiperInstance, setSwiperInstance] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const thumbnailsRef = useRef(null);
  const { formatPrice } = useCurrency();

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchProductAndReviews = async () => {
      setLoading(true);
      setReviewsLoading(true);
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/products/${id}`);
        setProduct(response.data);

        // Fetch reviews
        const reviewsRes = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/reviews?product=${id}`);
        setProductReviews(reviewsRes.data);
      } catch (err) {
        console.error('Error fetching product or reviews:', err);
        setError('Failed to load product details.');
      } finally {
        setLoading(false);
        setReviewsLoading(false);
      }
    };
    fetchProductAndReviews();
  }, [id]);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    setReviewError('');
    setReviewSuccess(false);

    if (!user) {
      setReviewError('You must be logged in to write a review.');
      return;
    }
    if (reviewContent.trim().length < 10) {
      setReviewError('Review must be at least 10 characters long.');
      return;
    }

    setReviewSubmitting(true);
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/reviews`,
        { rating: reviewRating, content: reviewContent, product: product._id },
        { headers: { Authorization: `Bearer ${localStorage.getItem('user_token')}` } }
      );
      
      setReviewSuccess(true);
      setReviewContent('');
      setReviewRating(5);
      
      // Update local product rating to reflect visually
      const newCount = (product.ratingCount || 0) + 1;
      const newRating = ((product.rating || 0) * (product.ratingCount || 0) + reviewRating) / newCount;
      setProduct({ ...product, rating: newRating, ratingCount: newCount });

      // Refresh reviews
      const reviewsRes = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/reviews?product=${product._id}`);
      setProductReviews(reviewsRes.data);

      setTimeout(() => {
        setIsReviewModalOpen(false);
        setReviewSuccess(false);
      }, 2000);
    } catch (err) {
      setReviewError(err.response?.data?.message || 'Failed to submit review');
    } finally {
      setReviewSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-nature-50 flex flex-col">
        <Navbar />
        <div className="flex-grow max-w-7xl mx-auto px-6 lg:px-8 py-12 w-full">
          <ProductDetailsSkeleton />
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-nature-50 flex flex-col">
        <Navbar />
        <div className="flex-grow flex flex-col items-center justify-center text-center px-6">
          <h2 className="text-3xl font-serif text-nature-900 mb-4">Product Not Found</h2>
          <p className="text-nature-600 mb-8">{error || "The soap you are looking for doesn't exist."}</p>
          <Link to="/#products" className="px-6 py-3 bg-nature-900 text-white rounded-full hover:bg-nature-800 transition-colors">
            Return to Store
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const priceData = product ? formatPrice(product.price, product.discountPrice, product.internationalPrices) : null;

  return (
    <div className="min-h-screen bg-nature-50 flex flex-col w-full max-w-full min-w-0 overflow-x-hidden">
      <Helmet>
        <title>{product.name} | Vedalush</title>
        <meta name="description" content={product.shortDesc} />
      </Helmet>

      <Navbar />

      <main className="flex-grow pt-32 pb-24 px-6 lg:px-8 max-w-7xl mx-auto w-full max-w-full min-w-0">
        <Link to="/#products" className="inline-flex items-center text-nature-600 hover:text-nature-900 font-medium mb-10 transition-colors group">
          <FaArrowLeft className="mr-2 group-hover:-translate-x-1 transition-transform" />
          Back to all products
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start max-w-full min-w-0">

          {/* Left Column: Image Slider & Thumbnails */}
          <motion.div
            initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}
            className="flex flex-col md:flex-row gap-4 w-full items-start max-w-full min-w-0 overflow-hidden md:overflow-visible"
          >
            {/* Thumbnails */}
            {product.images && product.images.length > 1 && (
              <div className="flex md:flex-col items-center gap-2 w-full max-w-full min-w-0 md:w-24 lg:w-28 order-2 md:order-1 flex-shrink-0">
                {/* Previous Arrow Button */}
                <button
                  type="button"
                  onClick={() => {
                    if (thumbnailsRef.current) {
                      thumbnailsRef.current.scrollBy({ left: -160, top: -160, behavior: 'smooth' });
                    }
                  }}
                  className="text-nature-800 cursor-pointer active:scale-95"
                  aria-label="Scroll previous"
                >
                  <FaChevronLeft className="md:hidden text-xs sm:text-sm" />
                  <FaChevronUp className="hidden md:block text-xs sm:text-sm" />
                </button>

                {/* Thumbnails list without scrollbar line */}
                <div
                  ref={thumbnailsRef}
                  className="flex md:flex-col gap-2.5 overflow-x-auto md:overflow-y-auto w-full max-w-full min-w-0 md:max-h-[460px] lg:max-h-[560px] py-1 px-0.5 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] scroll-smooth"
                >
                  {product.images.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        setActiveIndex(i);
                        swiperInstance?.slideToLoop(i);
                      }}
                      className={`w-16 h-16 sm:w-20 sm:h-20 md:w-full md:aspect-square flex-shrink-0 rounded-lg overflow-hidden border-2 transition-all duration-300 cursor-pointer ${activeIndex === i ? 'border-nature-700 opacity-100 shadow-md scale-95' : 'border-transparent opacity-60 hover:opacity-100'
                        }`}
                    >
                      <img src={getOptimizedCloudinaryUrl(img, 150)} alt={`Thumbnail ${i + 1}`} width="150" height="150" className="w-full h-full object-cover" loading="lazy" decoding="async" />
                    </button>
                  ))}
                </div>

                {/* Next Arrow Button */}
                <button
                  type="button"
                  onClick={() => {
                    if (thumbnailsRef.current) {
                      thumbnailsRef.current.scrollBy({ left: 160, top: 160, behavior: 'smooth' });
                    }
                  }}
                  className="text-nature-800 cursor-pointer active:scale-95"
                  aria-label="Scroll next"
                >
                  <FaChevronRight className="md:hidden text-xs sm:text-sm" />
                  <FaChevronDown className="hidden md:block text-xs sm:text-sm" />
                </button>
              </div>
            )}

            {/* Main Image */}
            <div className="flex-1 rounded overflow-hidden shadow-soft-lg bg-white border border-nature-100 aspect-square max-w-lg w-full relative order-1 md:order-2 min-w-0 mx-auto">
              {product.images && product.images.length > 1 ? (
                <Swiper
                  onSwiper={setSwiperInstance}
                  onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
                  modules={[Autoplay, EffectFade]}
                  effect="fade"
                  className="w-full h-full"
                  loop={true}
                >
                  <SlideCounter total={product.images.length} />
                  {product.images.map((img, i) => (
                    <SwiperSlide key={i}>
                      <img src={getOptimizedCloudinaryUrl(img, 800)} alt={`${product.name} view ${i + 1}`} width="800" height="800" className="w-full h-full object-cover" loading="lazy" decoding="async" />
                    </SwiperSlide>
                  ))}
                </Swiper>
              ) : (
                <img
                  src={product.images?.[0] ? getOptimizedCloudinaryUrl(product.images[0], 800) : '/placeholder.jpg'}
                  alt={product.name}
                  width="800"
                  height="800"
                  className="w-full h-full object-cover"
                loading="lazy" decoding="async" />
              )}
            </div>
          </motion.div>

          {/* Right Column: Product Details */}
          <motion.div
            initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-col"
          >
            <div className="mb-6">
              <span className="inline-block px-3 py-1 bg-nature-100 text-nature-800 text-xs font-medium tracking-widest uppercase rounded-full mb-4">
                Vedalush Artisan Soap
              </span>
              <h1 className="text-4xl md:text-5xl font-serif text-nature-900 mb-2">{product.name}</h1>
              {product.rating > 0 && (
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex items-center text-[#B88A5A]">
                    {[...Array(5)].map((_, i) => (
                      <FaStar key={i} className={i < Math.round(product.rating) ? 'text-[#B88A5A]' : 'text-nature-200'} size={14} />
                    ))}
                  </div>
                  <span className="text-sm text-[#8E7A65] font-medium">
                    {product.rating.toFixed(1)} ({product.ratingCount})
                  </span>
                </div>
              )}
              <div className="flex items-center gap-4 mb-6">
                {priceData && priceData.discountFormatted ? (
                  <>
                    <p className="text-2xl font-medium text-nature-700">{priceData.discountFormatted}</p>
                    <p className="text-xl text-nature-400 line-through">{priceData.priceFormatted}</p>
                    <span className="bg-nature-900 text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                      {Math.round(((priceData.rawPrice - priceData.rawDiscount) / priceData.rawPrice) * 100)}% OFF
                    </span>
                  </>
                ) : priceData ? (
                  <p className="text-2xl font-medium text-nature-700">{priceData.priceFormatted}</p>
                ) : null}
              </div>
              <p className="text-nature-600 font-light text-lg leading-relaxed mb-8">
                {product.fullDesc || product.shortDesc}
              </p>
            </div>

            {/* Key Information Grid */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="bg-white p-4 rounded-xl border border-nature-100 flex items-start gap-3">
                <FaCheckCircle className="text-nature-500 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="text-sm font-medium text-nature-900 mb-1">Skin Type</h4>
                  <p className="text-xs text-nature-600 font-light">{product.skinType}</p>
                </div>
              </div>
              <div className="bg-white p-4 rounded-xl border border-nature-100 flex items-start gap-3">
                <FaBalanceScale className="text-nature-500 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="text-sm font-medium text-nature-900 mb-1">Weight</h4>
                  <p className="text-xs text-nature-600 font-light">{product.weight}</p>
                </div>
              </div>
            </div>

            {/* Expanded Details */}
            <div className="space-y-6 mb-10 border-t border-nature-200 pt-8">
              <div>
                <h3 className="text-xl font-serif text-nature-900 mb-3 flex items-center gap-2">
                  <FaLeaf className="text-nature-500" size={16} /> Key Benefits
                </h3>
                <p className="text-nature-700 font-light leading-relaxed">{product.benefits}</p>
              </div>
              <div>
                <h3 className="text-xl font-serif text-nature-900 mb-3 flex items-center gap-2">
                  <FaCheckCircle className="text-nature-500" size={16} /> Pure Ingredients
                </h3>
                <p className="text-nature-700 font-light leading-relaxed">{product.ingredients}</p>
              </div>
            </div>

            {/* Call To Action */}
            <div className="mt-auto space-y-4">
              {product.amazonLink && (
                <a href={product.amazonLink} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center w-full bg-[#FF9900] text-white py-4 rounded-xl hover:bg-[#E68A00] transition-colors shadow-soft text-lg font-medium">
                  <FaAmazon className="mr-3 text-2xl" /> Buy Now on Amazon
                </a>
              )}
              {product.flipkartLink && (
                <a href={product.flipkartLink} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center w-full bg-[#2874F0] text-white py-4 rounded-xl hover:bg-[#1A5ED0] transition-colors shadow-soft text-lg font-medium">
                  <FaShoppingCart className="mr-3 text-2xl" /> Buy Now on Flipkart
                </a>
              )}
              {!product.amazonLink && !product.flipkartLink && (
                <button disabled className="flex items-center justify-center w-full bg-nature-200 text-nature-500 py-4 rounded-xl cursor-not-allowed font-medium text-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B88A5A] focus-visible:ring-offset-2">
                  Currently Out of Stock Online
                </button>
              )}
            </div>

            <p className="text-center text-xs text-nature-500 font-light mt-6">
              100% Organic • Cruelty Free • Handmade in India
            </p>

          </motion.div>
        </div>
      </main>

      {/* Reviews Section */}
      <section className="max-w-6xl mx-auto px-6 w-full pb-20">
        <div className="flex justify-between items-center border-b border-nature-200 pb-4 mb-8">
          <h3 className="text-2xl font-serif text-nature-900">
            Customer Reviews ({productReviews.length})
          </h3>
          <button 
            onClick={() => setIsReviewModalOpen(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-[#B88A5A] text-white rounded-full hover:bg-[#A0784E] transition-all shadow-md hover:shadow-lg font-medium text-sm md:text-base active:scale-95 group"
          >
            <span className="text-xl font-light leading-none group-hover:rotate-90 transition-transform duration-300">+</span>
          </button>
        </div>
        {reviewsLoading ? (
          <div className="space-y-4">
             <div className="animate-pulse bg-white border border-nature-100 h-32 rounded-2xl w-full"></div>
             <div className="animate-pulse bg-white border border-nature-100 h-32 rounded-2xl w-full"></div>
          </div>
        ) : productReviews.length === 0 ? (
          <p className="text-nature-600 text-center py-8">Be the first to review this product!</p>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {productReviews.slice(0, 4).map((review) => (
                <div key={review._id} className="bg-white p-6 rounded-2xl shadow-sm border border-nature-100 flex flex-col">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h4 className="font-medium text-nature-900">{review.user?.name || 'Anonymous User'}</h4>
                      <div className="flex space-x-1 mt-1">
                        {[...Array(5)].map((_, i) => (
                          <FaStar 
                            key={i} 
                            className={`text-sm ${i < review.rating ? 'text-[#B88A5A]' : 'text-gray-200'}`} 
                          />
                        ))}
                      </div>
                    </div>
                    <span className="text-xs text-nature-500">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-nature-700 font-light leading-relaxed whitespace-pre-wrap">{review.content}</p>
                  {review.adminReply && (
                    <div className="mt-4 p-4 bg-nature-50 rounded-xl border border-nature-200">
                      <h5 className="text-xs font-bold text-nature-800 uppercase tracking-wider mb-2">Vedalush Reply</h5>
                      <p className="text-sm text-nature-700">{review.adminReply}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
            {productReviews.length > 4 && (
              <div className="text-center">
                <Link 
                  to={`/reviews?product=${product._id}`}
                  className="inline-block px-8 py-3 bg-white border border-[#B88A5A] text-[#B88A5A] font-medium rounded-xl hover:bg-nature-50 transition-colors shadow-sm"
                >
                  See All {productReviews.length} Reviews
                </Link>
              </div>
            )}
          </>
        )}
      </section>

      <Footer />

      {/* Review Modal */}
      <AnimatePresence>
        {isReviewModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl relative flex flex-col max-h-[90vh]"
            >
              <div className="px-6 py-4 border-b border-nature-100 flex justify-between items-center bg-nature-50/50 sticky top-0 z-10">
                <h3 className="font-serif text-xl text-nature-900 font-bold">Write a Review</h3>
                <button
                  onClick={() => setIsReviewModalOpen(false)}
                  className="p-2 text-nature-400 hover:text-nature-900 hover:bg-white rounded-full transition-colors"
                >
                  <HiOutlineX size={20} />
                </button>
              </div>

              <div className="p-6 overflow-y-auto">
                {!user ? (
                  <div className="text-center py-8">
                    <p className="text-nature-600 mb-4">Please log in to write a review.</p>
                    <Link to="/login" className="bg-[#B88A5A] text-white px-6 py-2 rounded-lg font-medium hover:bg-[#8E7A65] transition-colors">
                      Log In
                    </Link>
                  </div>
                ) : (
                  <form onSubmit={handleReviewSubmit} className="space-y-4">
                    {reviewSuccess && (
                      <div className="p-3 bg-green-50 text-green-700 text-sm rounded-lg mb-4 text-center font-medium">
                        Thank you! Your review has been submitted.
                      </div>
                    )}
                    {reviewError && (
                      <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg mb-4 text-center font-medium">
                        {reviewError}
                      </div>
                    )}
                    
                    <div>
                      <label className="block text-sm font-medium text-nature-800 mb-2">Rating</label>
                      <div className="flex gap-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onMouseEnter={() => setHoverRating(star)}
                            onMouseLeave={() => setHoverRating(0)}
                            onClick={() => setReviewRating(star)}
                            className="focus:outline-none transition-transform hover:scale-110 active:scale-95"
                          >
                            {star <= (hoverRating || reviewRating) ? (
                              <FaStar className="text-[#B88A5A] text-3xl" />
                            ) : (
                              <FaRegStar className="text-[#B88A5A] text-3xl opacity-40" />
                            )}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-nature-800 mb-2">Your Review</label>
                      <textarea
                        value={reviewContent}
                        onChange={(e) => setReviewContent(e.target.value)}
                        placeholder="Tell us what you think about this product..."
                        className="w-full bg-nature-50 border border-nature-200 rounded-xl p-4 text-nature-900 focus:outline-none focus:ring-2 focus:ring-[#B88A5A] transition-all min-h-[120px]"
                        required
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={reviewSubmitting || reviewSuccess}
                      className="w-full bg-[#B88A5A] hover:bg-[#8E7A65] text-white font-medium py-3 rounded-xl transition-all disabled:opacity-70 disabled:cursor-not-allowed mt-4 shadow-md hover:shadow-lg"
                    >
                      {reviewSubmitting ? 'Submitting...' : 'Submit Review'}
                    </button>
                  </form>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProductDetails;
