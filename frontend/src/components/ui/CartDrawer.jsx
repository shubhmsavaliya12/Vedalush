import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiOutlineX, HiOutlineShoppingBag, HiPlus, HiMinus, HiTrash } from 'react-icons/hi';
import { useCart } from '../../context/CartContext';
import { useCurrency } from '../../context/CurrencyContext';
import { Link, useNavigate } from 'react-router-dom';
import { getOptimizedCloudinaryUrl } from '../../utils/cloudinary';

const CartDrawer = () => {
  const { isCartOpen, closeCart, cartItems, updateQuantity, removeItem, cartSubtotal } = useCart();
  const { formatPrice } = useCurrency();
  const navigate = useNavigate();

  // Prevent background scrolling when cart is open
  useEffect(() => {
    if (isCartOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isCartOpen]);

  const handleCheckout = () => {
    closeCart();
    navigate('/checkout');
  };

  // Animation variants
  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.3 } },
    exit: { opacity: 0, transition: { duration: 0.3, delay: 0.1 } }
  };

  const drawerVariants = {
    hidden: { x: '100%' },
    visible: { 
      x: 0, 
      transition: { 
        type: 'spring', 
        stiffness: 300, 
        damping: 30,
        mass: 0.8
      } 
    },
    exit: { 
      x: '100%', 
      transition: { 
        type: 'spring', 
        stiffness: 300, 
        damping: 35 
      } 
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        type: 'spring',
        stiffness: 300,
        damping: 24
      }
    }),
    exit: { opacity: 0, scale: 0.9, transition: { duration: 0.2 } }
  };

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={closeCart}
            className="fixed inset-0 bg-[#3D332B]/40 backdrop-blur-sm z-[100]"
          />

          {/* Drawer */}
          <motion.div
            variants={drawerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed top-0 right-0 h-full w-full sm:w-[420px] bg-[#FDFBF7]/95 backdrop-blur-md shadow-2xl z-[110] flex flex-col border-l border-[#E6DED2]"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-6 border-b border-[#E6DED2]/60">
              <div className="flex items-center gap-3 text-[#5D4E42]">
                <HiOutlineShoppingBag size={24} className="text-[#B88A5A]" />
                <h2 className="font-serif text-2xl font-semibold tracking-wide">Your Cart</h2>
              </div>
              <button
                onClick={closeCart}
                className="p-2 rounded-full text-[#6F6A65] hover:text-[#5D4E42] hover:bg-[#F8F4EC] transition-colors focus:outline-none focus:ring-2 focus:ring-[#B88A5A]"
                aria-label="Close Cart"
              >
                <HiOutlineX size={24} />
              </button>
            </div>

            {/* Cart Items Area */}
            <div className="flex-1 overflow-y-auto px-6 py-4 custom-scrollbar">
              {cartItems.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center opacity-70">
                  <HiOutlineShoppingBag size={64} className="text-[#D5C4A1] mb-4" />
                  <p className="font-serif text-xl text-[#5D4E42] mb-2">Your cart is empty.</p>
                  <p className="text-sm text-[#9D948B] mb-6">Discover the purity of our handcrafted soaps.</p>
                  <button
                    onClick={closeCart}
                    className="px-6 py-2.5 border border-[#B88A5A] text-[#B88A5A] font-semibold text-xs tracking-widest uppercase rounded-full hover:bg-[#B88A5A] hover:text-white transition-colors"
                  >
                    Start Shopping
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  <AnimatePresence>
                    {cartItems.map((item, index) => {
                      const productPrice = item.product.discountPrice || item.product.price;
                      return (
                        <motion.div
                          key={item.product._id}
                          custom={index}
                          variants={itemVariants}
                          initial="hidden"
                          animate="visible"
                          exit="exit"
                          layout
                          className="flex gap-4 group bg-white/50 p-3 rounded-2xl border border-[#E6DED2]/50 shadow-sm hover:shadow-md hover:bg-white transition-all duration-300"
                        >
                          {/* Image */}
                          <div className="w-24 h-24 rounded-xl overflow-hidden bg-[#F8F4EC] flex-shrink-0 border border-[#E6DED2]/30">
                            {item.product.images && item.product.images.length > 0 ? (
                              <img
                                src={getOptimizedCloudinaryUrl(item.product.images[0], 120)}
                                alt={item.product.name}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-[#9D948B]">No Image</div>
                            )}
                          </div>

                          {/* Info */}
                          <div className="flex-1 flex flex-col justify-between py-1">
                            <div>
                              <div className="flex justify-between items-start gap-2">
                                <Link 
                                  to={`/product/${item.product._id}`} 
                                  onClick={closeCart}
                                  className="font-serif text-lg font-medium text-[#5D4E42] hover:text-[#B88A5A] transition-colors line-clamp-1"
                                >
                                  {item.product.name}
                                </Link>
                                <button
                                  onClick={() => removeItem(item.product._id)}
                                  className="text-[#9D948B] hover:text-red-500 transition-colors p-1"
                                  aria-label="Remove item"
                                >
                                  <HiTrash size={18} />
                                </button>
                              </div>
                              <p className="text-sm font-semibold text-[#8E7A65] mt-1">
                                {formatPrice(productPrice).priceFormatted}
                              </p>
                            </div>

                            {/* Quantity Controls */}
                            <div className="flex items-center justify-between mt-3">
                              <div className="flex items-center bg-[#F8F4EC] rounded-full border border-[#E6DED2]">
                                <button
                                  onClick={() => updateQuantity(item.product._id, item.quantity - 1)}
                                  className="w-8 h-8 flex items-center justify-center text-[#6F6A65] hover:text-[#B88A5A] transition-colors"
                                  aria-label="Decrease quantity"
                                >
                                  <HiMinus size={14} />
                                </button>
                                <span className="w-8 text-center text-sm font-semibold text-[#5D4E42]">
                                  {item.quantity}
                               </span>
                                <button
                                  onClick={() => updateQuantity(item.product._id, item.quantity + 1)}
                                  className="w-8 h-8 flex items-center justify-center text-[#6F6A65] hover:text-[#B88A5A] transition-colors"
                                  aria-label="Increase quantity"
                                >
                                  <HiPlus size={14} />
                                </button>
                              </div>
                              <span className="text-sm font-semibold text-[#5D4E42]">
                                {formatPrice(productPrice * item.quantity).priceFormatted}
                              </span>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                </div>
              )}
            </div>

            {/* Footer */}
            {cartItems.length > 0 && (
              <div className="bg-white border-t border-[#E6DED2] p-6 shadow-[0_-10px_40px_-15px_rgba(93,78,66,0.1)]">
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-sm text-[#6F6A65]">
                    <span>Shipping & Taxes</span>
                    <span>Calculated at checkout</span>
                  </div>
                  <div className="flex justify-between items-end">
                    <span className="font-serif text-xl font-semibold text-[#5D4E42]">Subtotal</span>
                    <span className="font-serif text-2xl font-bold text-[#B88A5A]">
                      {/* For now format Subtotal by multiplying simple format, real app might need exact currency conversion per total */}
                      {formatPrice(cartSubtotal).priceFormatted}
                    </span>
                  </div>
                </div>

                <button
                  onClick={handleCheckout}
                  className="w-full relative overflow-hidden group bg-[#5D4E42] text-white py-4 rounded-xl flex items-center justify-center gap-2 transition-all duration-300 hover:shadow-lg active:scale-[0.98]"
                >
                  <span className="absolute inset-0 w-full h-full bg-[#B88A5A] translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
                  <span className="relative z-10 font-semibold tracking-widest text-sm uppercase">Secure Checkout</span>
                  <HiOutlineShoppingBag size={18} className="relative z-10" />
                </button>
                
                <p className="text-center text-[10px] text-[#9D948B] mt-4 uppercase tracking-widest">
                  Secure encrypted checkout
                </p>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartDrawer;
