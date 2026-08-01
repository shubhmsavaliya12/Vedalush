import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaChevronDown } from 'react-icons/fa';

const CustomSelect = ({ value, onChange, options, placeholder = "Select...", className = "" }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedOption = options.find(opt => opt.value === value) || null;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center justify-between w-full text-left bg-white border border-nature-200 rounded-xl px-3.5 py-2.5 text-nature-900 text-sm focus:outline-none focus:ring-1 focus:ring-nature-500 transition-shadow ${className}`}
      >
        <span className="truncate">{selectedOption ? selectedOption.label : placeholder}</span>
        <FaChevronDown className={`shrink-0 ml-2 text-nature-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} size={10} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.15 }}
            className="absolute z-[100] w-full mt-1.5 bg-white border border-nature-100 rounded-xl shadow-lg max-h-60 overflow-y-auto overflow-x-hidden"
          >
            <div className="py-1.5">
              {options.map((option) => (
                <div
                  key={option.value}
                  onClick={() => {
                    onChange(option.value);
                    setIsOpen(false);
                  }}
                  className={`px-4 py-2 text-sm cursor-pointer transition-colors mx-1 rounded-lg ${
                    value === option.value
                      ? 'bg-nature-900 text-white font-medium shadow-sm'
                      : 'text-nature-700 hover:bg-nature-50 hover:text-nature-900'
                  }`}
                >
                  {option.label}
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CustomSelect;
