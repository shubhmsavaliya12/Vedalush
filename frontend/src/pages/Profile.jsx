import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaStar } from 'react-icons/fa';
import { 
  HiOutlineUser, 
  HiOutlineMail, 
  HiOutlineLogout, 
  HiOutlinePencilAlt, 
  HiOutlinePhone, 
  HiOutlineLocationMarker, 
  HiOutlineCheckCircle, 
  HiOutlineX 
} from 'react-icons/hi';
import Navbar from '../components/ui/Navbar';
import Footer from '../components/ui/Footer';

const Profile = () => {
  const { user, setUser, logout, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [reviews, setReviews] = useState([]);
  const [loadingReviews, setLoadingReviews] = useState(true);

  // Edit modal state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    name: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    country: 'India'
  });
  const [updating, setUpdating] = useState(false);
  const [updateMsg, setUpdateMsg] = useState('');
  const [updateError, setUpdateError] = useState('');

  // Edit review modal state
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [editingReview, setEditingReview] = useState(null);
  const [reviewForm, setReviewForm] = useState({ rating: 5, content: '' });
  const [updatingReview, setUpdatingReview] = useState(false);
  const [reviewMsg, setReviewMsg] = useState('');
  const [reviewError, setReviewError] = useState('');

  // Multiple addresses state
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [editingAddressIndex, setEditingAddressIndex] = useState(-1);
  const [addressForm, setAddressForm] = useState({
    label: 'Home',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    country: 'India',
    isDefault: false
  });
  const [savingAddress, setSavingAddress] = useState(false);
  const [addressMsg, setAddressMsg] = useState('');
  const [addressError, setAddressError] = useState('');

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login');
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user) {
      setEditForm({
        name: user.name || '',
        phone: user.phone || '',
        address: user.address || '',
        city: user.city || '',
        state: user.state || '',
        pincode: user.pincode || '',
        country: user.country || 'India'
      });
    }
  }, [user, isEditModalOpen]);

  useEffect(() => {
    const fetchMyReviews = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/reviews/me', { withCredentials: true });
        setReviews(response.data);
      } catch (error) {
        console.error('Error fetching personal reviews:', error);
      } finally {
        setLoadingReviews(false);
      }
    };

    if (user) {
      fetchMyReviews();
    }
  }, [user]);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setUpdating(true);
    setUpdateMsg('');
    setUpdateError('');

    try {
      let newAddrs = user.addresses ? [...user.addresses] : [];
      const defIdx = newAddrs.findIndex(a => a.isDefault);
      const idx = defIdx >= 0 ? defIdx : 0;
      if (newAddrs.length === 0) {
        if (editForm.address || editForm.city || editForm.phone || editForm.state || editForm.pincode) {
          newAddrs.push({
            label: 'Home',
            phone: editForm.phone || '',
            address: editForm.address || '',
            city: editForm.city || '',
            state: editForm.state || '',
            pincode: editForm.pincode || '',
            country: editForm.country || 'India',
            isDefault: true
          });
        }
      } else {
        newAddrs[idx] = {
          ...newAddrs[idx],
          phone: editForm.phone || '',
          address: editForm.address || '',
          city: editForm.city || '',
          state: editForm.state || '',
          pincode: editForm.pincode || '',
          country: editForm.country || 'India'
        };
      }

      const API_URL = import.meta.env.VITE_API_URL || '';
      const response = await axios.put(`${API_URL}/api/auth/profile`, {
        ...editForm,
        addresses: newAddrs
      }, {
        withCredentials: true
      });

      if (response.status === 200) {
        setUser(response.data.user);
        setUpdateMsg('Profile & delivery details saved successfully!');
        setTimeout(() => {
          setIsEditModalOpen(false);
          setUpdateMsg('');
        }, 1500);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      setUpdateError(error.response?.data?.message || 'Failed to update profile. Please try again.');
    } finally {
      setUpdating(false);
    }
  };

  const handleUpdateReview = async (e) => {
    e.preventDefault();
    setUpdatingReview(true);
    setReviewMsg('');
    setReviewError('');

    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const response = await axios.put(`${API_URL}/api/reviews/${editingReview._id}`, reviewForm, {
        withCredentials: true
      });

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

  const handleSaveAddress = async (e) => {
    e.preventDefault();
    setSavingAddress(true);
    setAddressMsg('');
    setAddressError('');

    try {
      const currentAddrs = user.addresses ? [...user.addresses] : [];
      let newAddrs;
      if (editingAddressIndex >= 0) {
        newAddrs = currentAddrs.map((a, i) => i === editingAddressIndex ? { ...addressForm } : a);
      } else {
        newAddrs = [...currentAddrs, { ...addressForm }];
      }

      if (addressForm.isDefault) {
        newAddrs = newAddrs.map((a, i) => ({
          ...a,
          isDefault: (editingAddressIndex >= 0 ? i === editingAddressIndex : i === newAddrs.length - 1)
        }));
      } else if (newAddrs.length === 1) {
        newAddrs[0].isDefault = true;
      }

      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const response = await axios.put(`${API_URL}/api/auth/profile`, { addresses: newAddrs }, {
        withCredentials: true
      });

      if (response.status === 200) {
        setUser(response.data.user);
        setAddressMsg('Address saved successfully!');
        setTimeout(() => {
          setIsAddressModalOpen(false);
          setAddressMsg('');
        }, 1200);
      }
    } catch (error) {
      console.error('Error saving address:', error);
      setAddressError(error.response?.data?.message || 'Failed to save address. Please try again.');
    } finally {
      setSavingAddress(false);
    }
  };

  const handleDeleteAddress = async (indexToDelete) => {
    if (!window.confirm('Are you sure you want to delete this address?')) return;
    try {
      const currentAddrs = [...(user.addresses || [])];
      const wasDefault = currentAddrs[indexToDelete].isDefault;
      currentAddrs.splice(indexToDelete, 1);
      
      if (wasDefault && currentAddrs.length > 0) {
        currentAddrs[0].isDefault = true;
      }

      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const response = await axios.put(`${API_URL}/api/auth/profile`, { addresses: currentAddrs }, {
        withCredentials: true
      });

      if (response.status === 200) {
        setUser(response.data.user);
      }
    } catch (error) {
      console.error('Error deleting address:', error);
    }
  };

  const handleSetDefaultAddress = async (indexToDefault) => {
    try {
      const currentAddrs = (user.addresses || []).map((a, i) => ({
        ...a,
        isDefault: i === indexToDefault
      }));

      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const response = await axios.put(`${API_URL}/api/auth/profile`, { addresses: currentAddrs }, {
        withCredentials: true
      });

      if (response.status === 200) {
        setUser(response.data.user);
      }
    } catch (error) {
      console.error('Error setting default address:', error);
    }
  };

  if (authLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-nature-50">
        <div className="w-12 h-12 border-4 border-nature-200 border-t-nature-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>My Profile | Vedalush</title>
      </Helmet>
      
      <div className="bg-nature-50 min-h-screen flex flex-col">
        <Navbar />

        <main className="flex-grow max-w-5xl mx-auto px-4 sm:px-6 w-full pt-28 pb-20">
          {/* Combined Luxury Header Banner */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-nature-900 rounded p-6 sm:p-8 text-white shadow-xl mb-8 relative overflow-hidden flex flex-col sm:flex-row items-center justify-between gap-6 border border-nature-800/80"
          >
            <div className="absolute top-0 right-0 w-80 h-80 bg-nature-500/10 rounded-full blur-3xl transform translate-x-1/3 -translate-y-1/3 pointer-events-none"></div>
            
            <div className="z-10 flex flex-col sm:flex-row items-center text-center sm:text-left gap-4 sm:gap-6">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white rounded-full flex items-center justify-center shadow-md border-4 border-nature-700/50 text-nature-900 font-serif font-bold text-2xl sm:text-3xl shrink-0">
                {user.name?.charAt(0)?.toUpperCase() || 'U'}
              </div>
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-nature-300 block mb-1">Personal Dashboard</span>
                <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white mb-2">
                  Welcome, {user.name}
                </h1>
                <div className="inline-flex items-center space-x-2 bg-nature-800/80 border border-nature-700/60 text-nature-200 px-3.5 py-1 rounded-full text-xs font-mono">
                  <HiOutlineMail className="text-nature-400 text-sm shrink-0" />
                  <span className="truncate max-w-[220px] sm:max-w-md">{user.email}</span>
                </div>
              </div>
            </div>

            <div className="z-10 flex flex-wrap items-center justify-center gap-3 shrink-0 w-full sm:w-auto">
              <button
                onClick={() => setIsEditModalOpen(true)}
                className="bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white px-4 py-2.5 rounded-xl font-medium text-xs sm:text-sm transition-all flex items-center justify-center space-x-2 shadow-sm flex-1 sm:flex-none"
              >
                <HiOutlinePencilAlt className="text-base" />
              </button>
              <button
                onClick={handleLogout}
                className="bg-red-500/15 hover:bg-red-500/25 backdrop-blur-md border border-red-400/30 text-red-300 hover:text-red-200 px-4 py-2.5 rounded-xl font-medium text-xs sm:text-sm transition-all flex items-center justify-center space-x-2 shadow-sm flex-1 sm:flex-none"
              >
                <HiOutlineLogout className="text-base" />
                <span>Log Out</span>
              </button>
            </div>
          </motion.div>

          {/* Full Width Column: Addresses & Reviews */}
          <div className="w-full space-y-8">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-full space-y-8"
            >
              {/* Saved Delivery Addresses Section */}
              <div className="bg-white rounded border border-nature-200/80 p-6 sm:p-8 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-nature-200 pb-4 mb-6 gap-3">
                  <div>
                    <h3 className="text-2xl font-serif font-bold text-nature-900 flex items-center space-x-2">
                      <HiOutlineLocationMarker className="text-nature-600 text-3xl" />
                      <span>Saved Delivery Addresses</span>
                    </h3>
                  </div>
                  <button 
                    onClick={() => {
                      setEditingAddressIndex(-1);
                      setAddressForm({
                        label: 'Home',
                        phone: user.phone || '',
                        address: '',
                        city: '',
                        state: '',
                        pincode: '',
                        country: 'India',
                        isDefault: (user.addresses || []).length === 0
                      });
                      setIsAddressModalOpen(true);
                    }}
                    className="bg-nature-900 hover:bg-nature-800 text-white font-medium px-4 py-2.5 rounded-xl transition-all shadow-soft flex items-center justify-center space-x-1.5 text-xs sm:text-sm shrink-0"
                  >
                    <span>+ Add New Address</span>
                  </button>
                </div>

                {user.addresses && user.addresses.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                    {user.addresses.map((addr, idx) => (
                      <div 
                        key={idx} 
                        className={`p-5 rounded border transition-all flex flex-col justify-between relative ${addr.isDefault ? 'bg-nature-50/60 border-nature-500 shadow-md ring-1 ring-nature-400/50' : 'bg-white border-nature-200/80 hover:border-nature-300 hover:shadow-sm'}`}
                      >
                        <div>
                          <div className="flex justify-between items-start mb-3 pb-2 border-b border-nature-200/50">
                            <div className="flex items-center space-x-2">
                              <span className="font-bold text-xs text-nature-900 uppercase tracking-wider bg-white px-2.5 py-1 rounded-md border border-nature-200 shadow-2xs">
                                {addr.label || 'Address'}
                              </span>
                              {addr.isDefault && (
                                <span className="text-[11px] bg-nature-900 text-white font-semibold px-2 py-0.5 rounded-full shadow-2xs">
                                  Default
                                </span>
                              )}
                            </div>
                            <div className="flex items-center space-x-1">
                              <button
                                onClick={() => {
                                  setEditingAddressIndex(idx);
                                  setAddressForm({ ...addr });
                                  setIsAddressModalOpen(true);
                                }}
                                className="text-nature-600 hover:text-nature-900 p-1.5 rounded-lg hover:bg-white transition-colors"
                                title="Edit Address"
                              >
                                <HiOutlinePencilAlt size={16} />
                              </button>
                              <button
                                onClick={() => handleDeleteAddress(idx)}
                                className="text-red-400 hover:text-red-700 p-1.5 rounded-lg hover:bg-red-50 transition-colors"
                                title="Delete Address"
                              >
                                <HiOutlineX size={16} />
                              </button>
                            </div>
                          </div>
                          <div className="text-nature-800 text-sm leading-relaxed space-y-1 my-2">
                            {addr.phone && <p className="font-medium text-nature-950 flex items-center space-x-1.5"><HiOutlinePhone className="text-nature-500 shrink-0" /> <span>{addr.phone}</span></p>}
                            {addr.address && <p className="text-nature-700 pt-1">{addr.address}</p>}
                            {(addr.city || addr.state || addr.pincode) && (
                              <p className="text-nature-600 font-medium">{[addr.city, addr.state, addr.pincode].filter(Boolean).join(', ')}</p>
                            )}
                            {addr.country && <p className="text-xs font-bold uppercase tracking-wider text-nature-500 pt-1">{addr.country}</p>}
                          </div>
                        </div>

                        <div className="pt-4 mt-3 border-t border-nature-100 flex justify-end items-center">
                          {!addr.isDefault ? (
                            <button
                              onClick={() => handleSetDefaultAddress(idx)}
                              className="text-xs font-semibold text-nature-700 hover:text-nature-950 bg-nature-100 hover:bg-nature-200 px-3 py-1.5 rounded-lg transition-colors"
                            >
                              Make Default Shipping Address
                            </button>
                          ) : (
                            <span className="text-xs font-medium text-nature-500 italic flex items-center space-x-1">
                              <HiOutlineCheckCircle className="text-emerald-600 text-base" />
                              <span>Primary Delivery Address</span>
                            </span>
                          )}
                        </div>
                      </div>
                    ))}

                    {/* Add Another Address Card */}
                    <button
                      onClick={() => {
                        setEditingAddressIndex(-1);
                        setAddressForm({
                          label: 'Home',
                          phone: user.phone || '',
                          address: '',
                          city: '',
                          state: '',
                          pincode: '',
                          country: 'India',
                          isDefault: false
                        });
                        setIsAddressModalOpen(true);
                      }}
                      className="p-6 rounded border-2 border-dashed border-nature-300 hover:border-nature-500 bg-nature-50/30 hover:bg-nature-50/70 transition-all flex flex-col items-center justify-center text-center group min-h-[180px]"
                    >
                      <div className="w-12 h-12 rounded-full bg-nature-100 group-hover:bg-nature-900 text-nature-600 group-hover:text-white flex items-center justify-center text-2xl transition-all shadow-2xs mb-3">
                        +
                      </div>
                      <span className="font-serif font-bold text-base text-nature-900 group-hover:text-nature-950">Add Another Address</span>
                    </button>
                  </div>
                ) : (
                  <div className="text-center py-10 bg-nature-50/50 rounded-2xl border border-dashed border-nature-200 p-6 flex flex-col items-center">
                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-nature-500 mb-4 shadow-sm text-3xl">
                      <HiOutlineLocationMarker />
                    </div>
                    <h4 className="text-lg font-serif font-bold text-nature-900 mb-2">No Saved Addresses Yet</h4>
                    <button
                      onClick={() => {
                        setEditingAddressIndex(-1);
                        setAddressForm({
                          label: 'Home',
                          phone: user.phone || '',
                          address: '',
                          city: '',
                          state: '',
                          pincode: '',
                          country: 'India',
                          isDefault: true
                        });
                        setIsAddressModalOpen(true);
                      }}
                      className="bg-nature-900 text-white text-xs sm:text-sm font-medium px-6 py-3 rounded-xl hover:bg-nature-800 transition-colors shadow-soft"
                    >
                      + Add Your First Address
                    </button>
                  </div>
                )}
              </div>

              {/* My Reviews Section */}
              <div className="bg-white rounded border border-nature-200/80 p-6 sm:p-8 shadow-sm">
                <div className="flex items-center justify-between border-b border-nature-200 pb-4 mb-6 gap-3">
                  <div>
                    <h3 className="text-2xl font-serif font-bold text-nature-900">
                      My Reviews
                    </h3>
                  </div>
                  <div className="">
                    <button
                      onClick={() => navigate('/reviews')}
                      className="bg-nature-900 hover:bg-nature-800 text-white font-large px-4 py-2 rounded-xl transition-all shadow-soft"
                    >
                      <span>+</span>
                    </button>
                  </div>
                </div>

              {loadingReviews ? (
                <div className="flex justify-center py-16 bg-white rounded border border-nature-200/60 shadow-sm">
                  <div className="w-10 h-10 border-4 border-nature-200 border-t-nature-600 rounded-full animate-spin"></div>
                </div>
              ) : reviews.length === 0 ? (
                <div className="py-10 text-center text-nature-600 flex flex-col items-center">
                  <div className="w-16 h-16 bg-nature-100 rounded-full flex items-center justify-center text-nature-500 mb-4 text-2xl">
                    ★
                  </div>
                  <h4 className="text-lg font-serif font-bold text-nature-900 mb-2">No Reviews Yet</h4>
                  <p className="text-sm max-w-sm mx-auto text-nature-600 mb-6">
                    You haven't shared your experience with any Vedalush products yet. Your feedback helps our organic community thrive!
                  </p>
                  <a
                    href="/reviews"
                    className="bg-nature-900 text-white text-xs font-medium px-6 py-3 rounded-xl hover:bg-nature-800 transition-colors shadow-soft"
                  >
                    Write a Review
                  </a>
                </div>
              ) : (
                <div className="divide-y divide-nature-200/60">
                  {reviews.map((review) => (
                    <div key={review._id} className="py-6 first:pt-2 last:pb-2">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex space-x-1">
                          {[...Array(5)].map((_, i) => (
                            <FaStar 
                              key={i} 
                              className={`text-sm ${i < review.rating ? 'text-amber-400' : 'text-gray-200'}`} 
                            />
                          ))}
                        </div>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => {
                              setEditingReview(review);
                              setReviewForm({ rating: review.rating, content: review.content });
                              setIsReviewModalOpen(true);
                              setReviewMsg('');
                              setReviewError('');
                            }}
                            className="flex items-center space-x-1 text-xs font-medium bg-nature-50 hover:bg-nature-200 text-nature-700 hover:text-nature-950 px-3 py-1.5 rounded-lg border border-nature-200/80 transition-all shadow-2xs"
                            title="Edit Review"
                          >
                            <HiOutlinePencilAlt size={15} />
                            <span>Edit</span>
                          </button>
                          <span className="text-xs text-nature-500 font-mono bg-nature-50 px-2.5 py-1 rounded-md border border-nature-100">
                            {new Date(review.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                          </span>
                        </div>
                      </div>
                      
                      <p className="text-nature-800 leading-relaxed whitespace-pre-wrap text-sm">
                        "{review.content}"
                      </p>

                      {review.adminReply && (
                        <div className="mt-5 ml-4 pl-4 border-l-4 border-nature-400 bg-nature-50/80 p-4 rounded-r-2xl">
                          <div className="flex items-center space-x-2 mb-1.5">
                            <span className="bg-nature-900 text-white text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full">Official Reply</span>
                            <span className="text-xs font-bold text-nature-900">Vedalush Care Team</span>
                          </div>
                          <p className="text-xs text-nature-700 italic leading-relaxed">"{review.adminReply}"</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
              </div>
            </motion.div>
          </div>
        </main>

        <Footer />

        {/* Edit Profile & Delivery Modal */}
        <AnimatePresence>
          {isEditModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm overflow-y-auto">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="bg-white rounded-3xl shadow-2xl max-w-lg w-full p-6 sm:p-8 relative border border-nature-100 max-h-[90vh] overflow-y-auto"
              >
                <div className="flex justify-between items-start mb-6 border-b border-nature-100 pb-4">
                  <div>
                    <h3 className="text-2xl font-serif font-bold text-nature-900">Edit Profile & Delivery</h3>
                    <p className="text-xs text-nature-600 mt-1">Update your contact and shipping details for smoother orders.</p>
                  </div>
                  <button
                    onClick={() => setIsEditModalOpen(false)}
                    className="text-nature-400 hover:text-nature-700 p-2 rounded-full hover:bg-nature-50 transition-colors"
                  >
                    <HiOutlineX size={22} />
                  </button>
                </div>

                {updateMsg && (
                  <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-sm flex items-center space-x-2 font-medium">
                    <HiOutlineCheckCircle className="text-emerald-600 flex-shrink-0 text-lg" />
                    <span>{updateMsg}</span>
                  </div>
                )}

                {updateError && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
                    {updateError}
                  </div>
                )}

                <form onSubmit={handleUpdateProfile} className="space-y-4">
                  {/* EMAIL (Read-only by default) */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-nature-600 mb-1 flex items-center justify-between">
                      <span>Email Address</span>
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        value={user.email}
                        disabled
                        className="w-full bg-gray-100 border border-gray-200 rounded-xl px-4 py-2.5 text-gray-600 text-sm font-mono cursor-not-allowed select-none"
                      />
                      <HiOutlineMail className="absolute right-3.5 top-3 text-gray-400 text-base" />
                    </div>
                  </div>

                  {/* FULL NAME */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-nature-800 mb-1">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={editForm.name}
                      onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                      required
                      placeholder="Your Name"
                      className="w-full bg-nature-50/60 border border-nature-200 rounded-xl px-4 py-2.5 text-nature-900 text-sm focus:outline-none focus:ring-2 focus:ring-nature-500 transition-shadow"
                    />
                  </div>

                  {/* OPTIONAL DELIVERY SECTION */}
                  <div className="border-t border-nature-100 pt-3 mt-2">
                    {/* PHONE & COUNTRY */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                      <div>
                        <label className="block text-xs font-medium text-nature-700 mb-1">Phone Number</label>
                        <input
                          type="tel"
                          value={editForm.phone}
                          onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                          placeholder="+91 9876543210"
                          className="w-full bg-nature-50/60 border border-nature-200 rounded-xl px-3.5 py-2.5 text-nature-900 text-sm focus:outline-none focus:ring-2 focus:ring-nature-500 transition-shadow"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-nature-700 mb-1">Country</label>
                        <select
                          value={editForm.country}
                          onChange={(e) => setEditForm({ ...editForm, country: e.target.value })}
                          className="w-full bg-nature-50/60 border border-nature-200 rounded-xl px-3.5 py-2.5 text-nature-900 text-sm focus:outline-none focus:ring-2 focus:ring-nature-500 transition-shadow cursor-pointer"
                        >
                          <option value="India">India</option>
                          <option value="United States">United States</option>
                          <option value="United Kingdom">United Kingdom</option>
                          <option value="European Union">European Union</option>
                          <option value="Australia">Australia</option>
                          <option value="Canada">Canada</option>
                        </select>
                      </div>
                    </div>

                    {/* STREET ADDRESS */}
                    <div className="mb-3">
                      <label className="block text-xs font-medium text-nature-700 mb-1">Street Address / House No.</label>
                      <input
                        type="text"
                        value={editForm.address}
                        onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
                        placeholder="123 Luxury Lane, Suite 400"
                        className="w-full bg-nature-50/60 border border-nature-200 rounded-xl px-3.5 py-2.5 text-nature-900 text-sm focus:outline-none focus:ring-2 focus:ring-nature-500 transition-shadow"
                      />
                    </div>

                    {/* CITY, STATE, PINCODE */}
                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-nature-700 mb-1">City</label>
                        <input
                          type="text"
                          value={editForm.city}
                          onChange={(e) => setEditForm({ ...editForm, city: e.target.value })}
                          placeholder="Mumbai"
                          className="w-full bg-nature-50/60 border border-nature-200 rounded-xl px-3 py-2.5 text-nature-900 text-sm focus:outline-none focus:ring-2 focus:ring-nature-500 transition-shadow"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-nature-700 mb-1">State</label>
                        <input
                          type="text"
                          value={editForm.state}
                          onChange={(e) => setEditForm({ ...editForm, state: e.target.value })}
                          placeholder="Maharashtra"
                          className="w-full bg-nature-50/60 border border-nature-200 rounded-xl px-3 py-2.5 text-nature-900 text-sm focus:outline-none focus:ring-2 focus:ring-nature-500 transition-shadow"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-nature-700 mb-1">PIN / Zip</label>
                        <input
                          type="text"
                          value={editForm.pincode}
                          onChange={(e) => setEditForm({ ...editForm, pincode: e.target.value })}
                          placeholder="400001"
                          className="w-full bg-nature-50/60 border border-nature-200 rounded-xl px-3 py-2.5 text-nature-900 text-sm focus:outline-none focus:ring-2 focus:ring-nature-500 transition-shadow"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end space-x-3 pt-4 border-t border-nature-100">
                    <button
                      type="button"
                      onClick={() => setIsEditModalOpen(false)}
                      className="px-5 py-2.5 rounded-xl border border-nature-200 text-nature-700 hover:bg-nature-50 font-medium text-sm transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={updating}
                      className="px-6 py-2.5 rounded-xl bg-nature-900 hover:bg-nature-800 disabled:opacity-70 text-white font-medium text-sm shadow-soft transition-colors flex items-center space-x-2"
                    >
                      {updating ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          <span>Saving...</span>
                        </>
                      ) : (
                        <span>Save Changes</span>
                      )}
                    </button>
                  </div>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

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
                      className="px-6 py-2.5 rounded-xl bg-nature-900 hover:bg-nature-800 disabled:opacity-70 text-white font-medium text-sm shadow-soft transition-colors flex items-center space-x-2"
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

        {/* Add / Edit Address Modal */}
        <AnimatePresence>
          {isAddressModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm overflow-y-auto">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="bg-white rounded-3xl shadow-2xl max-w-lg w-full p-6 sm:p-8 relative border border-nature-100 max-h-[90vh] overflow-y-auto"
              >
                <div className="flex justify-between items-start mb-6 border-b border-nature-100 pb-4">
                  <div>
                    <h3 className="text-2xl font-serif font-bold text-nature-900">
                      {editingAddressIndex >= 0 ? 'Edit Saved Address' : 'Add New Delivery Address'}
                    </h3>
                  </div>
                  <button
                    onClick={() => setIsAddressModalOpen(false)}
                    className="text-nature-400 hover:text-nature-700 p-2 rounded-full hover:bg-nature-50 transition-colors"
                  >
                    <HiOutlineX size={22} />
                  </button>
                </div>

                {addressMsg && (
                  <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-sm flex items-center space-x-2 font-medium">
                    <HiOutlineCheckCircle className="text-emerald-600 flex-shrink-0 text-lg" />
                    <span>{addressMsg}</span>
                  </div>
                )}

                {addressError && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
                    {addressError}
                  </div>
                )}

                <form onSubmit={handleSaveAddress} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-nature-800 mb-1">
                        Address Label <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={addressForm.label}
                        onChange={(e) => setAddressForm({ ...addressForm, label: e.target.value })}
                        required
                        placeholder="Home, Work, Office..."
                        className="w-full bg-nature-50/60 border border-nature-200 rounded-xl px-4 py-2.5 text-nature-900 text-sm focus:outline-none focus:ring-2 focus:ring-nature-500 transition-shadow"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-nature-800 mb-1">
                        Phone Number <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        value={addressForm.phone}
                        onChange={(e) => setAddressForm({ ...addressForm, phone: e.target.value })}
                        required
                        placeholder="+91 9876543210"
                        className="w-full bg-nature-50/60 border border-nature-200 rounded-xl px-4 py-2.5 text-nature-900 text-sm focus:outline-none focus:ring-2 focus:ring-nature-500 transition-shadow"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-nature-800 mb-1">
                      Street Address / House No. <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={addressForm.address}
                      onChange={(e) => setAddressForm({ ...addressForm, address: e.target.value })}
                      required
                      placeholder="123 Luxury Lane, Suite 400"
                      className="w-full bg-nature-50/60 border border-nature-200 rounded-xl px-4 py-2.5 text-nature-900 text-sm focus:outline-none focus:ring-2 focus:ring-nature-500 transition-shadow"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-nature-700 mb-1">City *</label>
                      <input
                        type="text"
                        value={addressForm.city}
                        onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                        required
                        placeholder="Mumbai"
                        className="w-full bg-nature-50/60 border border-nature-200 rounded-xl px-3 py-2.5 text-nature-900 text-sm focus:outline-none focus:ring-2 focus:ring-nature-500 transition-shadow"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-nature-700 mb-1">State *</label>
                      <input
                        type="text"
                        value={addressForm.state}
                        onChange={(e) => setAddressForm({ ...addressForm, state: e.target.value })}
                        required
                        placeholder="Maharashtra"
                        className="w-full bg-nature-50/60 border border-nature-200 rounded-xl px-3 py-2.5 text-nature-900 text-sm focus:outline-none focus:ring-2 focus:ring-nature-500 transition-shadow"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-nature-700 mb-1">PIN / Zip *</label>
                      <input
                        type="text"
                        value={addressForm.pincode}
                        onChange={(e) => setAddressForm({ ...addressForm, pincode: e.target.value })}
                        required
                        placeholder="400001"
                        className="w-full bg-nature-50/60 border border-nature-200 rounded-xl px-3 py-2.5 text-nature-900 text-sm focus:outline-none focus:ring-2 focus:ring-nature-500 transition-shadow"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-nature-700 mb-1">Country</label>
                    <select
                      value={addressForm.country}
                      onChange={(e) => setAddressForm({ ...addressForm, country: e.target.value })}
                      className="w-full bg-nature-50/60 border border-nature-200 rounded-xl px-4 py-2.5 text-nature-900 text-sm focus:outline-none focus:ring-2 focus:ring-nature-500 transition-shadow cursor-pointer"
                    >
                      <option value="India">India</option>
                      <option value="United States">United States</option>
                      <option value="United Kingdom">United Kingdom</option>
                      <option value="European Union">European Union</option>
                      <option value="Australia">Australia</option>
                      <option value="Canada">Canada</option>
                    </select>
                  </div>

                  <div className="pt-2">
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={addressForm.isDefault}
                        onChange={(e) => setAddressForm({ ...addressForm, isDefault: e.target.checked })}
                        className="w-4 h-4 text-nature-900 rounded border-gray-300 focus:ring-nature-500"
                      />
                      <span className="text-xs font-medium text-nature-800">Make this my default shipping address</span>
                    </label>
                  </div>

                  <div className="flex justify-end space-x-3 pt-4 border-t border-nature-100">
                    <button
                      type="button"
                      onClick={() => setIsAddressModalOpen(false)}
                      className="px-5 py-2.5 rounded-xl border border-nature-200 text-nature-700 hover:bg-nature-50 font-medium text-sm transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={savingAddress}
                      className="px-6 py-2.5 rounded-xl bg-nature-900 hover:bg-nature-800 disabled:opacity-70 text-white font-medium text-sm shadow-soft transition-colors flex items-center space-x-2"
                    >
                      {savingAddress ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          <span>Saving...</span>
                        </>
                      ) : (
                        <span>{editingAddressIndex >= 0 ? 'Update Address' : 'Save Address'}</span>
                      )}
                    </button>
                  </div>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
};

export default Profile;
