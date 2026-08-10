import React, { useState, useEffect, useRef } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { HiOutlineArrowRight, HiOutlineX } from 'react-icons/hi';
import { FaChevronDown, FaCheckCircle, FaTimes } from 'react-icons/fa';
import { PHONE_CODES, validatePhoneNumber, splitPhoneData } from '../../utils/phoneCodes';
import { useAuth } from '../../context/AuthContext';
import CustomSelect from '../ui/CustomSelect';
import { getOptimizedCloudinaryUrl } from '../../utils/cloudinary';

const DirectOrder = () => {
  const { register, handleSubmit, formState: { errors }, reset, setValue, watch, control } = useForm({
    defaultValues: {
      countryCode: "+91"
    }
  });
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [selectedItems, setSelectedItems] = useState([{ product: '', quantity: 1 }]);
  const [activeDropdownIndex, setActiveDropdownIndex] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    if (user) {
      if (user.name) setValue("name", user.name);
      if (user.email) setValue("email", user.email);
      if (user.phone) {
        const { code, number } = splitPhoneData(user.phone);
        setValue("countryCode", code);
        setValue("phoneNumber", number);
      }
      if (user.country) setValue("country", user.country);
      if (user.address || user.city || user.state || user.pincode) {
        const fullAddr = [user.address, user.city, user.state, user.pincode].filter(Boolean).join(', ');
        setValue("address", fullAddr);
      }
    }
  }, [user, setValue]);

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setActiveDropdownIndex(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/products`);
        setProducts(response.data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };
    fetchProducts();
  }, []);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (data) => {
    const validItems = selectedItems.filter(item => item.product && item.product.trim() !== '');
    if (validItems.length === 0) {
      alert('Please select at least one product for your order.');
      return;
    }

    setIsSubmitting(true);
    try {
      const sanitizedItems = validItems.map(item => ({
        product: item.product,
        quantity: Math.max(1, Number(item.quantity) || 1)
      }));
      const totalQty = sanitizedItems.reduce((acc, item) => acc + item.quantity, 0);
      const productSummary = sanitizedItems.map(item => `${item.product} (x${item.quantity})`).join(', ');

      const payload = {
        ...data,
        phone: `${data.countryCode} ${data.phoneNumber}`,
        items: sanitizedItems,
        product: productSummary,
        quantity: totalQty
      };
      delete payload.countryCode;
      delete payload.phoneNumber;

      await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/orders`, payload, {
        headers: { Authorization: `Bearer ${localStorage.getItem('user_token')}` } // Send auth headers instead of cookies
      });
      setShowSuccessModal(true);
      reset();
      setSelectedItems([{ product: '', quantity: 1 }]);
    } catch (error) {
      console.error('Error submitting order:', error);
      alert('Failed to submit order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="order" className="py-24 bg-white relative">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <div>
              <span className="text-[#8E7A65] font-semibold tracking-widest uppercase text-sm mb-4 block">
                Exclusive Access
              </span>
              <h2 className="text-4xl md:text-5xl font-serif font-bold text-[#5D4E42] leading-tight">
                Request a Direct Order
              </h2>
            </div>
            <p className="text-lg text-[#6F6A65] font-normal leading-relaxed">
              Prefer to order directly from us? Fill out the form, and our team will get back to you with payment details and shipping confirmation within 24 hours.
            </p>
            <div className="hidden lg:block relative h-64 rounded-2xl overflow-hidden shadow-soft border border-[#E6DED2]">
              <img
                src="/images/direct_order_soaps.webp"
                alt="Beautiful Soaps"
                width="800"
                height="600"
                className="w-full h-full object-cover"
                loading="lazy" decoding="async" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="bg-[#FDFBF7] p-8 md:p-12 rounded-3xl shadow-soft border border-[#E6DED2]"
          >
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm text-[#5D4E42] mb-2 font-serif font-bold">Full Name</label>
                  <input
                    {...register("name", { required: true })}
                    className="w-full bg-white border border-[#E6DED2] rounded-xl px-4 py-3 text-[#5D4E42] placeholder-[#9D948B] focus:outline-none focus:border-[#B88A5A] transition-colors duration-250 text-base md:text-sm"
                    placeholder="Jane Doe"
                  />
                  {errors.name && <span className="text-red-500 text-xs mt-1 block">Name is required</span>}
                </div>
                <div>
                  <label className="block text-sm text-[#5D4E42] mb-2 font-serif font-bold">Email</label>
                  <input
                    type="email"
                    {...register("email", { required: true })}
                    className="w-full bg-white border border-[#E6DED2] rounded-xl px-4 py-3 text-[#5D4E42] placeholder-[#9D948B] focus:outline-none focus:border-[#B88A5A] transition-colors duration-250 text-base md:text-sm"
                    placeholder="jane@example.com"
                  />
                  {errors.email && <span className="text-red-500 text-xs mt-1 block">Email is required</span>}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm text-[#5D4E42] mb-2 font-serif font-bold">Phone</label>
                  <div className="flex rounded-xl h-[50px]">
                    <Controller
                      name="countryCode"
                      control={control}
                      render={({ field }) => (
                        <CustomSelect
                          value={field.value}
                          onChange={field.onChange}
                          options={PHONE_CODES.map(c => ({ value: c.code, label: c.code }))}
                          wrapperClassName="h-full"
                          className="w-[75px] h-full bg-white border border-[#E6DED2] border-r-0 rounded-l-xl rounded-r-none px-2 shadow-none z-10 !py-0"
                        />
                      )}
                    />
                    <input
                      {...register("phoneNumber", {
                        required: "Phone number is required",
                        validate: (value, formValues) => validatePhoneNumber(formValues.countryCode, value)
                      })}
                      className="flex-1 min-w-0 h-full bg-white border border-[#E6DED2] rounded-r-xl px-4 text-[#5D4E42] placeholder-[#9D948B] focus:outline-none focus:border-[#B88A5A] focus:ring-1 focus:ring-[#B88A5A] focus:z-10 transition-colors duration-250 text-base md:text-sm"
                      placeholder="9876543210"
                    />
                  </div>
                  {(errors.phoneNumber || errors.countryCode) && (
                    <span className="text-red-500 text-xs mt-1 block">{errors.phoneNumber?.message || 'Invalid phone'}</span>
                  )}
                </div>
                <div>
                  <label className="block text-sm text-[#5D4E42] mb-2 font-serif font-bold">Country</label>
                  <input
                    {...register("country", { required: true })}
                    className="w-full bg-white border border-[#E6DED2] rounded-xl px-4 py-3 text-[#5D4E42] placeholder-[#9D948B] focus:outline-none focus:border-[#B88A5A] transition-colors duration-250 text-base md:text-sm"
                    placeholder="United States"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm text-[#5D4E42] font-serif font-bold">Full Address</label>
                  {user && user.addresses && user.addresses.length > 0 && (
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-[11px] text-[#8E7A65] font-medium">Saved:</span>
                      {user.addresses.map((addr, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => {
                            if (addr.phone) {
                              const { code, number } = splitPhoneData(addr.phone);
                              setValue("countryCode", code);
                              setValue("phoneNumber", number);
                            }
                            if (addr.country) setValue("country", addr.country || "India");
                            const formatted = [addr.address, addr.city, addr.state, addr.pincode].filter(Boolean).join(', ');
                            setValue("address", formatted);
                          }}
                          className="text-[11px] bg-[#F8F4EC] hover:bg-[#5D4E42] hover:text-white text-[#5D4E42] px-2.5 py-0.5 rounded transition-colors duration-250 font-medium border border-[#E6DED2] shadow-2xs"
                        >
                          {addr.label || `Addr #${idx + 1}`}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <input
                  {...register("address", { required: true })}
                  className="w-full bg-white border border-[#E6DED2] rounded-xl px-4 py-3 text-[#5D4E42] placeholder-[#9D948B] focus:outline-none focus:border-[#B88A5A] transition-colors duration-250 text-base md:text-sm"
                  placeholder="123 Botanica St, City, State, Zip"
                />
              </div>

              <div className="space-y-3" ref={dropdownRef}>
                <div className="flex justify-between items-center">
                  <label className="block text-sm text-[#5D4E42] font-serif font-bold">Select Products & Quantities</label>
                  <span className="text-xs text-[#8E7A65] font-medium">{selectedItems.length} {selectedItems.length === 1 ? 'Item' : 'Items'}</span>
                </div>

                {selectedItems.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3 relative transition-all hover:border-[#8E7A65]">
                    {/* Product Dropdown */}
                    <div className="relative flex-1 min-w-0">
                      <div
                        onClick={() => setActiveDropdownIndex(activeDropdownIndex === idx ? null : idx)}
                        className="w-full bg-white border border-[#E6DED2] rounded-xl px-3.5 py-2.5 flex justify-between items-center cursor-pointer hover:bg-[#F8F4EC] transition-colors text-sm"
                      >
                        <span className={`flex-1 min-w-0 mr-2 ${item.product ? "text-[#5D4E42] font-medium truncate" : "text-[#9D948B] truncate"}`}>
                          {item.product || "Select a product..."}
                        </span>
                        <FaChevronDown className={`text-[#9D948B] text-xs transition-transform duration-300 ${activeDropdownIndex === idx ? 'rotate-180' : ''}`} />
                      </div>

                      <AnimatePresence>
                        {activeDropdownIndex === idx && (
                          <motion.div
                            initial={{ opacity: 0, y: -5 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -5 }}
                            transition={{ duration: 0.15 }}
                            className="absolute z-30 left-0 right-0 mt-1 bg-white border border-[#E6DED2] rounded-xl shadow-xl overflow-hidden max-h-52 overflow-y-auto custom-scrollbar"
                          >
                            {products.map((p) => (
                              <div
                                key={p._id}
                                onClick={() => {
                                  const updated = [...selectedItems];
                                  updated[idx].product = p.name;
                                  setSelectedItems(updated);
                                  setActiveDropdownIndex(null);
                                }}
                                className="px-3 py-2 hover:bg-[#F8F4EC] cursor-pointer text-[#5D4E42] transition-colors flex items-center gap-2.5 border-b border-[#E6DED2]/40 last:border-0 text-sm"
                              >
                                {p.images?.[0] && <img src={getOptimizedCloudinaryUrl(p.images[0], 64)} alt={p.name} width="32" height="32" className="w-8 h-8 rounded-lg object-cover shadow-sm flex-shrink-0" loading="lazy" decoding="async" />}
                                <span className="font-medium truncate">{p.name}</span>
                              </div>
                            ))}
                            {products.length === 0 && (
                              <div className="px-3 py-4 text-center text-[#8E7A65] text-xs">Loading products...</div>
                            )}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Quantity Selector */}
                    <div className="w-20 flex-shrink-0">
                      <input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => {
                          const valStr = e.target.value;
                          const val = valStr === '' ? '' : parseInt(valStr);
                          const updated = [...selectedItems];
                          updated[idx].quantity = isNaN(val) ? '' : val;
                          setSelectedItems(updated);
                        }}
                        onBlur={() => {
                          if (!item.quantity || Number(item.quantity) < 1) {
                            const updated = [...selectedItems];
                            updated[idx].quantity = 1;
                            setSelectedItems(updated);
                          }
                        }}
                        placeholder="Qty"
                        className="w-full bg-white border border-[#E6DED2] rounded-xl px-2.5 py-2 text-center font-medium text-[#5D4E42] text-sm focus:outline-none focus:border-[#B88A5A] transition-colors duration-250"
                      />
                    </div>

                    {/* Remove Item Button */}
                    {selectedItems.length > 1 && (
                      <button
                        type="button"
                        onClick={() => {
                          const updated = selectedItems.filter((_, i) => i !== idx);
                          setSelectedItems(updated);
                          if (activeDropdownIndex === idx) setActiveDropdownIndex(null);
                        }}
                        className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                        title="Remove item"
                      >
                        <FaTimes className="text-sm" />
                      </button>
                    )}
                  </div>
                ))}

                <div className="flex justify-between items-center pt-1">
                  <button
                    type="button"
                    onClick={() => setSelectedItems([...selectedItems, { product: '', quantity: 1 }])}
                    className="text-xs font-semibold text-[#5D4E42] hover:text-[#8E7A65] flex items-center gap-1.5 py-2 px-3 bg-[#F8F4EC] hover:bg-[#E6DED2]/50 rounded-xl transition-colors duration-250 border border-[#E6DED2] shadow-2xs"
                  >
                    <span className="text-base leading-none">+</span>
                    <span>Add Another Product</span>
                  </button>

                  <span className="text-xs text-[#6F6A65] font-medium">
                    Total Qty: <strong className="text-[#5D4E42] font-bold text-sm ml-1">{selectedItems.reduce((sum, i) => sum + (Number(i.quantity) > 0 ? Number(i.quantity) : 0), 0)}</strong>
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-sm text-[#5D4E42] mb-2 font-serif font-bold">Additional Message (Optional)</label>
                <textarea
                  {...register("message")}
                  rows="3"
                  className="w-full bg-white border border-[#E6DED2] rounded-xl px-4 py-3 text-[#5D4E42] placeholder-[#9D948B] focus:outline-none focus:border-[#B88A5A] transition-colors duration-250 text-base md:text-sm"
                  placeholder="Any special requests?"
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 bg-[#B88A5A] text-white rounded-xl font-semibold hover:bg-[#9F7348] transition-all duration-250 shadow-soft disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B88A5A] focus-visible:ring-offset-2"
              >
                {isSubmitting ? (
                  <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  "Submit Request"
                )}
              </button>

            </form>
          </motion.div>

        </div>
      </div>

      <AnimatePresence>
        {showSuccessModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white rounded-3xl p-8 md:p-12 shadow-soft-lg border border-[#E6DED2] max-w-md w-full relative overflow-hidden"
            >
              <button
                onClick={() => setShowSuccessModal(false)}
                className="absolute top-6 right-6 text-[#9D948B] hover:text-[#5D4E42] transition-colors"
              >
                <FaTimes size={24} />
              </button>

              <div className="flex flex-col items-center text-center space-y-6 relative z-10">
                <div className="w-20 h-20 bg-[#F8F4EC] rounded-full flex items-center justify-center mb-2 shadow-soft border border-[#E6DED2]">
                  <FaCheckCircle className="text-[#C19A6B] text-5xl" />
                </div>
                <h3 className="text-3xl font-serif font-bold text-[#5D4E42]">Thank You!</h3>
                <p className="text-[#6F6A65] font-normal leading-relaxed">
                  Your direct order request has been securely received. Our team will review the details and contact you shortly.
                </p>
                <button
                  onClick={() => setShowSuccessModal(false)}
                  className="w-full mt-4 py-4 bg-[#B88A5A] text-white rounded-xl font-semibold hover:bg-[#9F7348] transition-all duration-250 shadow-soft"
                >
                  Continue Browsing
                </button>
              </div>

              {/* Decorative elements */}
              <div className="absolute -bottom-16 -right-16 w-48 h-48 bg-[#F8F4EC] rounded-full opacity-50 z-0 pointer-events-none"></div>
              <div className="absolute -top-16 -left-16 w-32 h-32 bg-[#F8F4EC] rounded-full opacity-50 z-0 pointer-events-none"></div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default DirectOrder;

