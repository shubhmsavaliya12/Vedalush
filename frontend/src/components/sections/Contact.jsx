import React from 'react';
import { motion } from 'framer-motion';
import { HiOutlineMail, HiOutlinePhone, HiOutlineLocationMarker } from 'react-icons/hi';
import { FaWhatsapp, FaInstagram, FaFacebookF } from 'react-icons/fa';

const Contact = () => {
  return (
    <section id="contact" className="py-24 bg-[#F8F4EC]">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 flex flex-col items-center text-center">

        <div className="mb-16 max-w-2xl">
          <span className="text-[#8E7A65] font-semibold tracking-widest uppercase text-sm mb-4 block">
            Get in Touch
          </span>
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-[#5D4E42] leading-tight mb-6">
            We'd Love to Hear From You
          </h2>
          <p className="text-[#6F6A65] font-normal text-lg">
            Whether you have a question about our ingredients, need help with an order, or just want to share your experience, our team is ready to assist you.
          </p>
        </div>

        <div className="flex flex-col md:flex-row justify-center gap-6 md:gap-8 w-full max-w-5xl">
          {/* Phone */}
          <a href="tel:+919904765058" className="flex md:flex-col items-center md:bg-white md:px-6 md:py-10 md:rounded-2xl md:shadow-sm md:border border-[#E6DED2]/50 group cursor-pointer hover:-translate-y-1 md:hover:shadow-md transition-all duration-300 w-full md:w-1/3 text-left md:text-center">
            <div className="w-12 h-12 md:w-14 md:h-14 bg-white md:bg-[#FDFBF7] rounded-full flex items-center justify-center shadow-soft md:shadow-none border border-[#E6DED2] md:border-[#E6DED2]/50 mr-4 md:mr-0 md:mb-6 flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
              <HiOutlinePhone className="w-5 h-5 md:w-6 md:h-6 text-[#8E7A65] group-hover:text-[#B88A5A] transition-colors" />
            </div>
            <div className="flex-1">
              <p className="font-serif font-bold text-base md:text-xl md:mb-2 text-[#5D4E42]">Phone</p>
              <p className="font-normal text-sm md:text-base text-[#6F6A65] group-hover:underline">+91 9904765058</p>
            </div>
          </a>

          {/* WhatsApp */}
          <a href="https://wa.me/919904765058" target="_blank" rel="noopener noreferrer" className="flex md:flex-col items-center md:bg-white md:px-6 md:py-10 md:rounded-2xl md:shadow-sm md:border border-[#E6DED2]/50 group cursor-pointer hover:-translate-y-1 md:hover:shadow-md transition-all duration-300 w-full md:w-1/3 text-left md:text-center">
            <div className="w-12 h-12 md:w-14 md:h-14 bg-white md:bg-[#FDFBF7] rounded-full flex items-center justify-center shadow-soft md:shadow-none border border-[#E6DED2] md:border-[#E6DED2]/50 mr-4 md:mr-0 md:mb-6 flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
              <FaWhatsapp className="w-5 h-5 md:w-6 md:h-6 text-[#8E7A65] group-hover:text-[#B88A5A] transition-colors" />
            </div>
            <div className="flex-1">
              <p className="font-serif font-bold text-base md:text-xl md:mb-2 text-[#5D4E42]">WhatsApp</p>
              <p className="font-normal text-sm md:text-base text-[#6F6A65] group-hover:underline">+91 9904765058</p>
            </div>
          </a>

          {/* Email */}
          <a href="mailto:Hello@vedalush.com" className="flex md:flex-col items-center md:bg-white md:px-6 md:py-10 md:rounded-2xl md:shadow-sm md:border border-[#E6DED2]/50 group cursor-pointer hover:-translate-y-1 md:hover:shadow-md transition-all duration-300 w-full md:w-1/3 text-left md:text-center">
            <div className="w-12 h-12 md:w-14 md:h-14 bg-white md:bg-[#FDFBF7] rounded-full flex items-center justify-center shadow-soft md:shadow-none border border-[#E6DED2] md:border-[#E6DED2]/50 mr-4 md:mr-0 md:mb-6 flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
              <HiOutlineMail className="w-5 h-5 md:w-6 md:h-6 text-[#8E7A65] group-hover:text-[#B88A5A] transition-colors" />
            </div>
            <div className="flex-1">
              <p className="font-serif font-bold text-base md:text-xl md:mb-2 text-[#5D4E42]">Email</p>
              <p className="font-normal text-sm md:text-base text-[#6F6A65] group-hover:underline">Hello@vedalush.com</p>
            </div>
          </a>
        </div>

        {/* Social Links */}
        <div className="mt-16 flex space-x-4 items-center">
          <a href="https://www.instagram.com/vedalush_?igsi=NmdjbWd2dGluNHcw" target='_blank' rel='noopener noreferrer' className="w-11 h-11 bg-[#5D4E42] text-white rounded-full flex items-center justify-center hover:bg-[#B88A5A] transition-colors duration-250 shadow-soft">
            <FaInstagram className="w-5 h-5" />
          </a>
          <a href="#" className="w-11 h-11 bg-[#5D4E42] text-white rounded-full flex items-center justify-center hover:bg-[#B88A5A] transition-colors duration-250 shadow-soft">
            <FaFacebookF className="w-5 h-5" />
          </a>
        </div>

      </div>
    </section>
  );
};

export default Contact;

