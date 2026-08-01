import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import axios from 'axios';
import { FaStar } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { Link, useLocation } from 'react-router-dom';
import { ReviewCardSkeleton } from '../components/ui/Skeletons';
import { HiOutlinePencilAlt, HiOutlineX, HiOutlineCheckCircle } from 'react-icons/hi';
import Navbar from '../components/ui/Navbar';
import Footer from '../components/ui/Footer';

const Reviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const productId = searchParams.get('product');
  
  // Form State
  const [rating, setRating] = useState(5);
  const [content, setContent] = useState('');
  const [hoverRating, setHoverRating] = useState(0);
  const [submitError, setSubmitError] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Edit review modal state
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [editingReview, setEditingReview] = useState(null);
  const [reviewForm, setReviewForm] = useState({ rating: 5, content: '' });
  const [updatingReview, setUpdatingReview] = useState(false);
  const [reviewMsg, setReviewMsg] = useState('');
  const [reviewError, setReviewError] = useState('');

  const { user } = useAuth();

  const fetchReviews = async () => {
    try {
      const url = productId 
        ? `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/reviews?product=${productId}`
        : `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/reviews`;
      const response = await axios.get(url, { headers: { Authorization: `Bearer ${localStorage.getItem('user_token')}` } });
      setReviews(response.data);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchReviews();
  }, [productId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError('');
    setSubmitSuccess(false);

    if (content.trim().length < 10) {
      setSubmitError('Review must be at least 10 characters long.');
      return;
    }

    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/reviews`,
        { rating, content },
        { headers: { Authorization: `Bearer ${localStorage.getItem('user_token')}` } }
      );
      
      setSubmitSuccess(true);
      setContent('');
      setRating(5);
      fetchReviews(); // Refresh the list
      
      setTimeout(() => setSubmitSuccess(false), 5000);
    } catch (err) {
      setSubmitError(err.response?.data?.message || 'Failed to submit review');
    }
  };

  const handleUpdateReview = async (e) => {
    e.preventDefault();
    setUpdatingReview(true);
    setReviewMsg('');
    setReviewError('');

    try {
      const API_URL = import.meta.env.VITE_API_URL || `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}`;
      const response = await axios.put(`${API_URL}/api/reviews/${editingReview._id}`, reviewForm, { headers: { Authorization: `Bearer ${localStorage.getItem('user_token')}` } });

      if (response.status === 200) {
        setReviews(reviews.map((r) => r._id === editingReview._id ? response.data : r));
        setReviewMsg('Review updated successfully!');
        setTimeout(() => {
          setIsReviewModalOpen(false);
          setEditingReview(null);
          setReviewMsg('');
        }, 1500);
      }
    } catch (error) {
      console.error('Error updating review:', error);
      setReviewError(error.response?.data?.message || 'Failed to update review. Please try again.');
    } finally {
      setUpdatingReview(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Reviews - Vedalush</title>
        <meta name="description" content="Read what our customers have to say about Vedalush premium organic soap." />
      </Helmet>
      
      <div className="bg-nature-50 min-h-screen flex flex-col">
        <Navbar />

        <main className="flex-grow max-w-4xl mx-auto px-6 w-full pt-32 pb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12 space-y-4"
          >
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-nature-900">
              {productId && reviews.length > 0 && reviews[0].product 
                ? `Reviews for ${reviews[0].product.name}` 
                : 'Customer Reviews'}
            </h1>
            <p className="text-nature-600 max-w-2xl mx-auto">
              {productId 
                ? 'Read what our community has to say about this product.' 
                : 'Real experiences from our community. We pride ourselves on creating the best organic skincare.'}
            </p>
            {productId && (
              <div className="mt-6">
                <Link to="/reviews" className="inline-block px-6 py-2 border border-nature-300 text-nature-700 rounded-full hover:bg-nature-50 transition-colors">
                  Clear Filter
                </Link>
              </div>
            )}
          </motion.div>

          {/* Review Submission Section */}
          <div className="bg-white rounded-2xl shadow-sm border border-nature-200 p-8 mb-16">
            <h2 className="text-2xl font-serif text-nature-900 mb-6">Write a Review</h2>
            
            {!user ? (
              <div className="bg-nature-50 border border-nature-200 rounded-xl p-6 text-center">
                <p className="text-nature-700 mb-4 font-medium">Please login to share your experience.</p>
                <Link to="/login" className="inline-block px-6 py-2 bg-nature-900 text-white rounded-full hover:bg-nature-700 transition-colors shadow-soft">
                  Login Here
                </Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-nature-700 mb-2">Overall Rating</label>
                  <div className="flex space-x-2 cursor-pointer">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <FaStar
                        key={star}
                        size={32}
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        className={`transition-colors ${(hoverRating || rating) >= star ? 'text-[#B88A5A]' : 'text-gray-200'}`}
                      />
                    ))}
                  </div>
                </div>

                <div>
                  <label htmlFor="content" className="block text-sm font-medium text-nature-700 mb-2">
                    Your Review
                  </label>
                  <textarea
                    id="content"
                    rows="4"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="w-full rounded-xl border border-nature-300 shadow-sm focus:border-nature-500 focus:ring focus:ring-nature-500/20 px-4 py-3 text-nature-900 resize-none outline-none transition-all"
                    placeholder="Tell us what you loved..."
                  ></textarea>
                </div>

                <AnimatePresence>
                  {submitError && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="text-red-500 text-sm">
                      {submitError}
                    </motion.div>
                  )}
                  {submitSuccess && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="text-green-600 text-sm font-medium bg-green-50 p-3 rounded-lg border border-green-200">
                      Thank you! Your review has been submitted.
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="px-8 py-3 bg-nature-900 text-white rounded-full font-medium hover:bg-nature-700 transition-colors shadow-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B88A5A] focus-visible:ring-offset-2"
                  >
                    Submit Review
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Review List */}
          <div className="space-y-8">
            <h3 className="text-2xl font-serif text-nature-900 border-b border-nature-200 pb-4">
              All Reviews ({reviews.length})
            </h3>

            {loading ? (
              <div className="space-y-6">
                {[...Array(4)].map((_, i) => (
                  <ReviewCardSkeleton key={i} />
                ))}
              </div>
            ) : reviews.length === 0 ? (
              <p className="text-nature-600 py-6 text-center text-lg">No reviews have been posted yet.</p>
            ) : (
              <div className="space-y-6">
                {reviews.map((review) => (
                  <motion.div 
                    key={review._id} 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white p-6 rounded-2xl shadow-sm border border-nature-100"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h4 className="font-medium text-nature-900">{review.user?.name || 'Anonymous User'}</h4>
                        {review.product && (
                          <div className="text-xs text-[#B88A5A] mt-0.5">
                            Reviewed: {review.product.name}
                          </div>
                        )}
                        <div className="flex space-x-1 mt-1">
                          {[...Array(5)].map((_, i) => (
                            <FaStar 
                              key={i} 
                              className={`text-sm ${i < review.rating ? 'text-[#B88A5A]' : 'text-gray-200'}`} 
                            />
                          ))}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {user && (review.user?._id === user._id || review.user === user._id) && (
                          <button
                            onClick={() => {
                              setEditingReview(review);
                              setReviewForm({ rating: review.rating, content: review.content });
                              setIsReviewModalOpen(true);
                              setReviewMsg('');
                              setReviewError('');
                            }}
                            className="flex items-center space-x-1 text-xs font-medium bg-nature-50 hover:bg-nature-200 text-nature-700 hover:text-nature-950 px-2.5 py-1 rounded-lg border border-nature-200/80 transition-all"
                            title="Edit Review"
                          >
                            <HiOutlinePencilAlt size={14} />
                            <span>Edit</span>
                          </button>
                        )}
                        <span className="text-xs text-nature-500">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    
                    <p className="text-nature-700 leading-relaxed whitespace-pre-wrap">
                      {review.content}
                    </p>

                    {review.adminReply && (
                      <div className="mt-6 ml-4 sm:ml-8 pl-4 border-l-4 border-nature-300 bg-nature-50 p-4 rounded-r-lg relative">
                        <div className="flex items-center space-x-2 mb-2">
                          <span className="bg-nature-900 text-white text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full">Owner</span>
                          <span className="text-xs font-medium text-nature-800">Vedalush</span>
                        </div>
                        <p className="text-sm text-nature-700 italic">"{review.adminReply}"</p>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </main>

        <Footer />
      </div>

      {/* Edit Review Modal */}
      <AnimatePresence>
        {isReviewModalOpen && editingReview && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-6 sm:p-8 relative border border-nature-100"
            >
              <div className="flex justify-between items-start mb-6 border-b border-nature-100 pb-4">
                <div>
                  <h3 className="text-2xl font-serif font-bold text-nature-900">Edit Your Review</h3>
                  <p className="text-xs text-nature-600 mt-1">Update your rating and feedback for this product.</p>
                </div>
                <button
                  onClick={() => {
                    setIsReviewModalOpen(false);
                    setEditingReview(null);
                  }}
                  className="text-nature-400 hover:text-nature-700 p-1 rounded-full hover:bg-nature-50 transition-colors"
                >
                  <HiOutlineX size={20} />
                </button>
              </div>

              {reviewMsg && (
                <div className="mb-4 p-3.5 bg-green-50 border border-green-200 text-green-800 rounded-xl text-xs flex items-center space-x-2">
                  <HiOutlineCheckCircle className="text-lg shrink-0 text-green-600" />
                  <span>{reviewMsg}</span>
                </div>
              )}

              {reviewError && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs">
                  {reviewError}
                </div>
              )}

              <form onSubmit={handleUpdateReview} className="space-y-5">
                <div>
                  <label className="block text-xs font-medium text-nature-700 mb-2">Your Rating</label>
                  <div className="flex space-x-2 cursor-pointer">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <FaStar
                        key={star}
                        size={28}
                        onClick={() => setReviewForm({ ...reviewForm, rating: star })}
                        className={`transition-colors ${star <= reviewForm.rating ? 'text-amber-400' : 'text-gray-200'}`}
                      />
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-nature-700 mb-1">Your Review</label>
                  <textarea
                    rows={4}
                    value={reviewForm.content}
                    onChange={(e) => setReviewForm({ ...reviewForm, content: e.target.value })}
                    placeholder="Share your experience with this soap..."
                    required
                    className="w-full bg-nature-50/60 border border-nature-200 rounded-xl p-3 text-nature-900 text-sm focus:outline-none focus:ring-2 focus:ring-nature-500 transition-shadow"
                  ></textarea>
                </div>

                <div className="flex justify-end space-x-3 pt-4 border-t border-nature-100">
                  <button
                    type="button"
                    onClick={() => {
                      setIsReviewModalOpen(false);
                      setEditingReview(null);
                    }}
                    className="px-5 py-2.5 rounded-xl border border-nature-200 text-nature-700 hover:bg-nature-50 font-medium text-sm transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={updatingReview}
                    className="px-6 py-2.5 rounded-xl bg-nature-900 hover:bg-nature-800 disabled:opacity-70 text-white font-medium text-sm shadow-soft transition-colors flex items-center space-x-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B88A5A] focus-visible:ring-offset-2"
                  >
                    {updatingReview ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Updating...</span>
                      </>
                    ) : (
                      <span>Update Review</span>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Reviews;
