import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/ui/Navbar';
import Footer from '../components/ui/Footer';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { HiOutlineArrowLeft, HiOutlineCheckCircle, HiOutlineLockClosed, HiPlus, HiCheck } from 'react-icons/hi';
import { FaMoneyBillWave, FaCreditCard } from 'react-icons/fa';

const Checkout = () => {
  const navigate = useNavigate();
  const { cartItems, cartSubtotal, clearCart } = useCart();
  const { user } = useAuth();
  
  const [step, setStep] = useState(1); // 1: Info/Address, 2: Payment, 3: Success
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [orderId, setOrderId] = useState(null);
  const defaultAddrIdx = user?.addresses?.findIndex(a => a.isDefault);
  const [selectedAddressIdx, setSelectedAddressIdx] = useState(defaultAddrIdx >= 0 ? defaultAddrIdx : 0);
  const [useNewAddress, setUseNewAddress] = useState(!(user?.addresses?.length > 0));

  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    country: 'India'
  });

  const [paymentMethod, setPaymentMethod] = useState('razorpay');

  useEffect(() => {
    window.scrollTo(0, 0);
    if (cartItems.length === 0 && step === 1) {
      navigate('/#products');
    }
  }, [cartItems, navigate, step]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleProceedToPayment = (e) => {
    e.preventDefault();
    if (useNewAddress) {
      if (!formData.name || !formData.email || !formData.phone || !formData.address || !formData.city || !formData.pincode) {
        setError('Please fill in all required fields for the new address.');
        return;
      }
    } else {
      if (!user?.addresses?.[selectedAddressIdx]) {
        setError('Please select an address or add a new one.');
        return;
      }
    }
    setError('');
    setStep(2);
  };


  const handleCheckout = async () => {
    if (loading) return;
    try {
      setLoading(true);
      setError('');
      
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const token = localStorage.getItem('user_token');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      const payload = {
        name: useNewAddress ? formData.name : (user?.name || formData.name),
        email: useNewAddress ? formData.email : (user?.email || formData.email),
        phone: useNewAddress ? formData.phone : user.addresses[selectedAddressIdx].phone,
        address: useNewAddress ? {
          address: formData.address,
          city: formData.city,
          state: formData.state,
          pincode: formData.pincode,
          country: formData.country
        } : {
          address: user.addresses[selectedAddressIdx].address,
          city: user.addresses[selectedAddressIdx].city,
          state: user.addresses[selectedAddressIdx].state,
          pincode: user.addresses[selectedAddressIdx].pincode,
          country: user.addresses[selectedAddressIdx].country || 'India'
        },
        paymentMethod,
        items: cartItems.map(item => ({
          productId: item.product._id,
          quantity: item.quantity
        }))
      };

      const res = await axios.post(`${apiUrl}/api/orders/checkout`, payload, { headers });

      if (paymentMethod === 'cod') {
        clearCart();
        setOrderId(res.data.orderNumber);
        setStep(3);
        setLoading(false);
        return;
      }

      // Razorpay Flow
      const isScriptLoaded = await loadRazorpayScript();
      if (!isScriptLoaded) {
        setError('Failed to load Razorpay. Please check your connection.');
        setLoading(false);
        return;
      }

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_mock', 
        amount: res.data.amount * 100,
        currency: 'INR',
        name: 'Vedalush',
        description: 'Organic Skincare Purchase',
        order_id: res.data.razorpayOrderId,
        handler: async function (response) {
          try {
            await axios.post(`${apiUrl}/api/orders/verify-payment`, {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              orderId: res.data.orderId
            }, { headers });
            
            clearCart();
            setOrderId(res.data.razorpayOrderId);
            setStep(3);
          } catch (err) {
            setError('Payment verification failed. If money was deducted, please contact support.');
          }
        },
        prefill: {
          name: formData.name,
          email: formData.email,
          contact: formData.phone
        },
        theme: {
          color: '#B88A5A'
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', function (response) {
        setError(response.error.description || 'Payment failed.');
      });
      rzp.open();

    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Something went wrong during checkout.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-nature-50 font-sans selection:bg-[#D5C4A1] selection:text-[#3D332B] flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-10 pb-20 px-6">
        <div className="max-w-6xl mx-auto">
          {/* Breadcrumb / Steps */}
          <div className="flex items-center justify-center gap-3 mb-10 text-sm">
            <span className={`font-semibold ${step >= 1 ? 'text-nature-900' : 'text-gray-400'}`}>1. Shipping</span>
            <div className={`h-px w-8 sm:w-16 ${step >= 2 ? 'bg-nature-900' : 'bg-gray-200'}`}></div>
            <span className={`font-semibold ${step >= 2 ? 'text-nature-900' : 'text-gray-400'}`}>2. Payment</span>
            <div className={`h-px w-8 sm:w-16 ${step >= 3 ? 'bg-nature-900' : 'bg-gray-200'}`}></div>
            <span className={`font-semibold ${step >= 3 ? 'text-nature-900' : 'text-gray-400'}`}>3. Confirmation</span>
          </div>

          {step === 3 ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-lg p-10 sm:p-14 text-center max-w-2xl mx-auto border border-gray-100 shadow-sm"
            >
              <div className="w-20 h-20 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <HiOutlineCheckCircle size={40} />
              </div>
              <h2 className="text-4xl font-serif text-nature-900 mb-4">Order Confirmed!</h2>
              <p className="text-nature-600 mb-2">Thank you for your purchase, {formData.name}.</p>
              <p className="text-nature-600 mb-8">Your order ID is <strong>{orderId}</strong>. We've sent a confirmation email to {formData.email}.</p>
              
              <Link 
                to="/#products"
                className="inline-block px-8 py-3.5 bg-nature-900 text-white rounded-md font-semibold uppercase tracking-wider hover:bg-nature-800 transition-colors shadow-sm"
              >
                Continue Shopping
              </Link>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
              {/* Left Column: Form */}
              <div className="lg:col-span-7">
                <AnimatePresence mode="wait">
                  {step === 1 && (
                    <motion.form 
                      key="step1"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      onSubmit={handleProceedToPayment}
                      className="bg-white p-6 sm:p-8 rounded-lg border border-gray-200 shadow-sm"
                    >
                      <h2 className="text-xl sm:text-2xl font-serif text-nature-900 mb-6">Contact & Shipping</h2>
                      
                      {user?.addresses && user.addresses.length > 0 && (
                        <div className="mb-8">
                          <h3 className="text-lg font-semibold text-nature-900 mb-3">Saved Addresses</h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {user.addresses.map((addr, idx) => (
                              <div 
                                key={idx} 
                                onClick={() => { setSelectedAddressIdx(idx); setUseNewAddress(false); }}
                                className={`relative p-5 rounded-md border cursor-pointer transition-all ${!useNewAddress && selectedAddressIdx === idx ? 'border-nature-900 bg-nature-50/30 ring-1 ring-nature-900' : 'border-gray-200 hover:border-gray-300 bg-white'}`}
                              >
                                {!useNewAddress && selectedAddressIdx === idx && (
                                  <div className="absolute top-3 right-3 text-nature-900 bg-nature-200 rounded-full p-0.5">
                                    <HiCheck size={14} />
                                  </div>
                                )}
                                <div className="flex items-center gap-2 mb-2">
                                  <span className="font-bold text-nature-900 text-sm uppercase">{addr.label || 'Home'}</span>
                                  {addr.isDefault && <span className="text-[10px] bg-nature-700 text-white px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">Default</span>}
                                </div>
                                <p className="text-xs text-nature-600 mb-1 font-medium">{addr.phone}</p>
                                <p className="text-xs text-nature-500 leading-relaxed">
                                  {addr.address}<br/>
                                  {addr.city}, {addr.state}, {addr.pincode}<br/>
                                  {addr.country || 'India'}
                                </p>
                              </div>
                            ))}
                            <div 
                              onClick={() => setUseNewAddress(true)}
                              className={`flex flex-col items-center justify-center p-5 rounded-md border-2 border-dashed cursor-pointer transition-all ${useNewAddress ? 'border-nature-900 bg-nature-50/30 text-nature-900' : 'border-gray-200 hover:border-gray-300 text-gray-500 bg-gray-50/50'}`}
                            >
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 ${useNewAddress ? 'bg-nature-900 text-white' : 'bg-gray-200 text-gray-600'}`}>
                                <HiPlus />
                              </div>
                              <span className="text-sm font-medium">Add New Address</span>
                            </div>
                          </div>
                        </div>
                      )}

                      {useNewAddress && (
                        <div className="animate-fade-in mt-2">
                          <h3 className="text-base font-semibold text-nature-900 mb-4 pb-2 border-b border-gray-100">New Address Details</h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name *</label>
                              <input required={useNewAddress} type="text" name="name" value={formData.name} onChange={handleInputChange} className="w-full p-3 rounded-md border border-gray-300 focus:border-nature-900 focus:ring-1 focus:ring-nature-900 outline-none transition-colors bg-white shadow-sm" />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1.5">Email *</label>
                              <input required={useNewAddress} type="email" name="email" value={formData.email} onChange={handleInputChange} className="w-full p-3 rounded-md border border-gray-300 focus:border-nature-900 focus:ring-1 focus:ring-nature-900 outline-none transition-colors bg-white shadow-sm" />
                            </div>
                          </div>

                          <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone Number *</label>
                            <input required={useNewAddress} type="tel" name="phone" value={formData.phone} onChange={handleInputChange} className="w-full p-3 rounded-md border border-gray-300 focus:border-nature-900 focus:ring-1 focus:ring-nature-900 outline-none transition-colors bg-white shadow-sm" />
                          </div>

                          <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Address *</label>
                            <input required={useNewAddress} type="text" name="address" value={formData.address} onChange={handleInputChange} className="w-full p-3 rounded-md border border-gray-300 focus:border-nature-900 focus:ring-1 focus:ring-nature-900 outline-none transition-colors bg-white shadow-sm" placeholder="Street address, apartment, suite, etc." />
                          </div>

                          <div className="grid grid-cols-2 gap-4 mb-6">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1.5">City *</label>
                              <input required={useNewAddress} type="text" name="city" value={formData.city} onChange={handleInputChange} className="w-full p-3 rounded-md border border-gray-300 focus:border-nature-900 focus:ring-1 focus:ring-nature-900 outline-none transition-colors bg-white shadow-sm" />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1.5">State *</label>
                              <input required={useNewAddress} type="text" name="state" value={formData.state} onChange={handleInputChange} className="w-full p-3 rounded-md border border-gray-300 focus:border-nature-900 focus:ring-1 focus:ring-nature-900 outline-none transition-colors bg-white shadow-sm" />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1.5">PIN Code *</label>
                              <input required={useNewAddress} type="text" name="pincode" value={formData.pincode} onChange={handleInputChange} className="w-full p-3 rounded-md border border-gray-300 focus:border-nature-900 focus:ring-1 focus:ring-nature-900 outline-none transition-colors bg-white shadow-sm" />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1.5">Country</label>
                              <input disabled type="text" value="India" className="w-full p-3 rounded-md border border-gray-200 bg-gray-50 text-gray-500 outline-none cursor-not-allowed shadow-sm" />
                            </div>
                          </div>
                        </div>
                      )}

                      {error && <div className="mb-4 text-red-500 text-sm">{error}</div>}

                      <div className="flex flex-col-reverse sm:flex-row justify-between items-center mt-8 gap-4 pt-4 border-t border-gray-100">
                        <button onClick={() => navigate('/#products')} type="button" className="text-gray-500 hover:text-nature-900 font-medium transition-colors cursor-pointer w-full sm:w-auto text-center flex items-center justify-center">
                          <HiOutlineArrowLeft className="mr-2" /> Return to cart
                        </button>
                        <button type="submit" disabled={loading} className="w-full sm:w-auto px-8 py-3.5 bg-nature-900 text-white rounded-md font-semibold uppercase tracking-wider hover:bg-nature-800 transition-colors shadow-sm cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed">
                          Continue to Payment
                        </button>
                      </div>
                    </motion.form>
                  )}

                  {step === 2 && (
                    <motion.div 
                      key="step2"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className="bg-white p-6 sm:p-8 rounded-lg border border-gray-200 shadow-sm"
                    >
                      <h2 className="text-xl sm:text-2xl font-serif text-nature-900 mb-6">Payment Method</h2>
                      
                      <div className="space-y-3 mb-8">
                        <label className={`flex items-center p-4 border rounded-md cursor-pointer transition-all ${paymentMethod === 'razorpay' ? 'border-nature-900 bg-nature-50/30 ring-1 ring-nature-900' : 'border-gray-200 hover:border-gray-300'}`}>
                          <input type="radio" name="paymentMethod" value="razorpay" checked={paymentMethod === 'razorpay'} onChange={() => setPaymentMethod('razorpay')} className="mr-4 w-4 h-4 accent-nature-900" />
                          <div className="flex-grow flex items-center justify-between">
                            <span className="font-medium text-nature-900 flex items-center gap-2.5"><FaCreditCard className="text-nature-500"/> Pay Online (UPI/Cards)</span>
                            <span className="text-[10px] font-bold text-green-700 bg-green-50 border border-green-100 px-2 py-0.5 rounded-sm uppercase tracking-wide">Secure</span>
                          </div>
                        </label>
                        
                        <label className={`flex items-center p-4 border rounded-md cursor-pointer transition-all ${paymentMethod === 'cod' ? 'border-nature-900 bg-nature-50/30 ring-1 ring-nature-900' : 'border-gray-200 hover:border-gray-300'}`}>
                          <input type="radio" name="paymentMethod" value="cod" checked={paymentMethod === 'cod'} onChange={() => setPaymentMethod('cod')} className="mr-4 w-4 h-4 accent-nature-900" />
                          <div className="flex-grow flex items-center justify-between">
                            <span className="font-medium text-nature-900 flex items-center gap-2.5"><FaMoneyBillWave className="text-nature-500"/> Cash on Delivery</span>
                          </div>
                        </label>
                      </div>

                      {error && <div className="mb-4 text-red-500 text-sm bg-red-50 p-3 rounded-lg border border-red-100">{error}</div>}

                      <div className="flex flex-col-reverse sm:flex-row justify-between items-center mt-8 gap-4 pt-4 border-t border-gray-100">
                        <button onClick={() => setStep(1)} disabled={loading} type="button" className="text-gray-500 hover:text-nature-900 font-medium transition-colors cursor-pointer w-full sm:w-auto text-center flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed">
                          <HiOutlineArrowLeft className="mr-2" /> Return to shipping
                        </button>
                        <button 
                          onClick={handleCheckout}
                          disabled={loading}
                          className="w-full sm:w-auto px-8 py-3.5 bg-nature-900 text-white rounded-md font-semibold uppercase tracking-wider hover:bg-nature-800 transition-colors shadow-sm flex items-center justify-center cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                          {loading ? 'Processing...' : (paymentMethod === 'cod' ? 'Place Order' : 'Pay Now Securely')}
                          {!loading && paymentMethod === 'razorpay' && <HiOutlineLockClosed className="ml-2" />}
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Right Column: Order Summary */}
              <div className="lg:col-span-5">
                <div className="bg-white p-6 sm:p-8 rounded-lg border border-gray-200 shadow-sm sticky top-32">
                  <h3 className="text-lg font-serif text-nature-900 mb-6">Order Summary</h3>
                  
                  <div className="space-y-4 mb-6 max-h-[40vh] overflow-y-auto pr-2 custom-scrollbar">
                    {cartItems.map(item => (
                      <div key={item.product._id} className="flex gap-4 items-center">
                        <div className="w-16 h-16 rounded-md bg-gray-50 border border-gray-100 overflow-hidden flex-shrink-0">
                          {item.product.images?.[0] ? (
                            <img src={item.product.images[0]} alt={item.product.name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">No Img</div>
                          )}
                        </div>
                        <div className="flex-grow">
                          <h4 className="text-sm font-bold text-nature-900">{item.product.name}</h4>
                          <p className="text-xs text-nature-500">Qty: {item.quantity}</p>
                        </div>
                        <div className="text-sm font-bold text-nature-900">
                          ₹{(item.product.discountPrice || item.product.price) * item.quantity}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-gray-100 pt-4 space-y-3 mb-6">
                    <div className="flex justify-between text-gray-600 text-sm">
                      <span>Subtotal</span>
                      <span className="font-medium text-nature-900">₹{cartSubtotal}</span>
                    </div>
                    <div className="flex justify-between text-gray-600 text-sm">
                      <span>Shipping</span>
                      <span className="text-green-600 font-medium uppercase text-xs tracking-wider">Free</span>
                    </div>
                  </div>

                  <div className="border-t border-gray-200 pt-5 flex justify-between items-center">
                    <span className="text-base font-semibold text-nature-900">Total</span>
                    <span className="text-2xl font-bold text-nature-900">₹{cartSubtotal}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Checkout;
