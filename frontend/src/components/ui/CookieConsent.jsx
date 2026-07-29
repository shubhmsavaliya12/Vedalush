import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import LegalModal from './LegalModal';

const CookieConsent = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isLegalModalOpen, setIsLegalModalOpen] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('vedalush_cookie_consent');
    if (!consent) {
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('vedalush_cookie_consent', 'accepted');
    setIsVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem('vedalush_cookie_consent', 'declined');
    setIsVisible(false);
  };

  return (
    <>
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 z-50 max-w-[400px] w-auto bg-[#FDFBF7] border border-[#E6DED2] rounded-2xl shadow-soft-2xl p-6 sm:p-7 text-[#5D4E42]"
          >
            <h3 className="text-xl font-serif font-bold text-[#5D4E42] mb-3 text-center sm:text-left">
              Cookies Are Here to Help!
            </h3>
            
            <p className="text-sm text-[#6F6A65] leading-relaxed mb-6 text-center sm:text-left">
              Our website uses cookies to enhance your browsing experience! These help us understand how you use our site. By clicking &apos;Accept&apos;, you&apos;re allowing us to serve you better. You can manage your preferences anytime! Learn more in our{' '}
              <button
                type="button"
                onClick={() => setIsLegalModalOpen(true)}
                className="underline font-semibold text-[#5D4E42] hover:text-[#8E7A65] transition-colors inline cursor-pointer"
              >
                Privacy Policy
              </button>.
            </p>

            <div className="flex flex-col gap-2.5">
              <button
                type="button"
                onClick={handleAccept}
                className="w-full py-2.5 px-4 bg-[#5D4E42] text-[#FDFBF7] rounded-xl font-medium text-sm hover:bg-[#4A3E34] active:scale-[0.99] transition-all shadow-sm cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B88A5A] focus-visible:ring-offset-2"
              >
                Accept
              </button>

              <button
                type="button"
                onClick={handleDecline}
                className="w-full py-2.5 px-4 bg-transparent border border-[#E6DED2] text-[#5D4E42] rounded-xl font-medium text-sm hover:bg-[#F8F4EC] active:scale-[0.99] transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B88A5A] focus-visible:ring-offset-2"
              >
                Decline
              </button>
            </div>

            {/* <div className="mt-3.5 text-center">
              <button
                type="button"
                onClick={() => setIsLegalModalOpen(true)}
                className="text-xs text-[#8E7A65] underline hover:text-[#5D4E42] transition-colors font-medium cursor-pointer"
              >
                Manage preferences
              </button>
            </div> */}
          </motion.div>
        )}
      </AnimatePresence>

      <LegalModal
        isOpen={isLegalModalOpen}
        onClose={() => setIsLegalModalOpen(false)}
        type="privacy"
      />
    </>
  );
};

export default CookieConsent;
