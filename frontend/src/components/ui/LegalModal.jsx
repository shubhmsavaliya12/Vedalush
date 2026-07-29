import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiX } from 'react-icons/hi';

const LegalModal = ({ isOpen, onClose, type }) => {
  if (!isOpen) return null;

  const content = {
    terms: {
      title: "Terms of Service",
      body: `Last Updated: Today

Welcome to Vedalush! These terms govern your use of our website and services.

1. General
By accessing our website, you agree to be bound by these terms. If you disagree, you may not use our services.

2. Products
Our handcrafted soaps are made using natural, organic ingredients. However, results may vary. Please consult a dermatologist if you have specific skin conditions. We are not liable for allergic reactions.

3. Orders and Payment
All payments must be made in full before shipment. We reserve the right to cancel any order if fraudulent activity is suspected.

4. Returns
Due to the hygiene nature of our products, we only accept returns for unopened items within 14 days of receipt.

5. Intellectual Property
All content, including images, text, and branding, is the property of Vedalush.

6. Changes to Terms
We reserve the right to update these terms at any time. Your continued use of the site constitutes acceptance.`
    },
    privacy: {
      title: "Privacy Policy",
      body: `Last Updated: Today

At Vedalush, we value your privacy. This policy explains how we handle your personal data.

1. Data Collection
We collect information you provide directly, such as your name, email address, and shipping address when you create an account or place an order.

2. Data Usage
Your data is strictly used to fulfill orders, provide customer support, and send occasional marketing emails (if opted in).

3. Data Sharing
We do not sell your personal data. We only share it with trusted third-party service providers (like shipping carriers and payment processors) necessary to fulfill our services.

4. Cookies
We use cookies to maintain your session (such as keeping you logged in) and to improve website performance.

5. Security
We use industry-standard encryption to protect your data. However, no method of transmission is 100% secure.

6. Your Rights
You have the right to request access to or deletion of your personal data by contacting our support team.`
    }
  };

  const data = content[type] || content.terms;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-white border border-[#E6DED2] p-8 rounded-3xl shadow-soft-lg w-full max-w-2xl max-h-[80vh] flex flex-col relative"
        >
          <button 
            onClick={onClose}
            className="absolute top-6 right-6 text-[#9D948B] hover:text-[#5D4E42] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B88A5A] focus-visible:ring-offset-2"
          >
            <HiX size={24} />
          </button>
          
          <h2 className="text-3xl font-serif font-bold text-[#5D4E42] mb-6">{data.title}</h2>
          
          <div className="flex-1 overflow-y-auto pr-4 whitespace-pre-wrap text-[#6F6A65] font-normal leading-relaxed custom-scrollbar">
            {data.body}
          </div>
          
          <div className="mt-8 pt-6 border-t border-[#E6DED2] flex justify-end">
            <button 
              onClick={onClose}
              className="px-6 py-2 bg-[#B88A5A] text-white rounded-full font-semibold hover:bg-[#9F7348] transition-all duration-250 shadow-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B88A5A] focus-visible:ring-offset-2"
            >
              Close
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default LegalModal;

