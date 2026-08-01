import React from 'react';
import { motion } from 'framer-motion';
import { HiOutlineMail, HiOutlinePhone, HiOutlineLocationMarker } from 'react-icons/hi';
import { FaWhatsapp, FaInstagram, FaFacebookF } from 'react-icons/fa';

const Contact = () => {
  return (
    <section id="contact" className="py-24 bg-[#F8F4EC]">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">

        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">

          {/* Contact Details */}
          <div className="space-y-8">
            <div>
              <span className="text-[#8E7A65] font-semibold tracking-widest uppercase text-sm mb-4 block">
                Get in Touch
              </span>
              <h2 className="text-4xl font-serif font-bold text-[#5D4E42] leading-tight">
                We'd Love to Hear From You
              </h2>
            </div>

            <p className="text-[#6F6A65] font-normal max-w-md">
              Whether you have a question about our ingredients, need help with an order, or just want to share your experience, our team is ready to assist you.
            </p>

            <div className="space-y-6 pt-4">
              <a href="tel:+919904765058" className="flex items-center space-x-4 text-[#5D4E42] hover:text-[#8E7A65] transition-colors duration-250 group cursor-pointer">
                <div className="w-12 h-12 flex-shrink-0 bg-white rounded-full flex items-center justify-center shadow-soft border border-[#E6DED2] group-hover:scale-110 transition-transform duration-250">
                  <HiOutlinePhone className="w-5 h-5 text-[#8E7A65] group-hover:text-[#B88A5A] transition-colors duration-250" />
                </div>
                <div>
                  <p className="font-serif font-bold">Phone</p>
                  <p className="font-normal text-[#6F6A65] group-hover:underline">+91 9904765058</p>
                </div>
              </a>

              <a href="https://wa.me/919904765058" target="_blank" rel="noopener noreferrer" className="flex items-center space-x-4 text-[#5D4E42] hover:text-[#8E7A65] transition-colors duration-250 group cursor-pointer">
                <div className="w-12 h-12 flex-shrink-0 bg-white rounded-full flex items-center justify-center shadow-soft border border-[#E6DED2] group-hover:scale-110 transition-transform duration-250">
                  <FaWhatsapp className="w-5 h-5 text-[#8E7A65] group-hover:text-[#B88A5A] transition-colors duration-250" />
                </div>
                <div>
                  <p className="font-serif font-bold">WhatsApp</p>
                  <p className="font-normal text-[#6F6A65] group-hover:underline">+91 9904765058</p>
                </div>
              </a>

              <a href="mailto:Hello@vedalush.com" className="flex items-center space-x-4 text-[#5D4E42] hover:text-[#8E7A65] transition-colors duration-250 group cursor-pointer">
                <div className="w-12 h-12 flex-shrink-0 bg-white rounded-full flex items-center justify-center shadow-soft border border-[#E6DED2] group-hover:scale-110 transition-transform duration-250">
                  <HiOutlineMail className="w-5 h-5 text-[#8E7A65] group-hover:text-[#B88A5A] transition-colors duration-250" />
                </div>
                <div>
                  <p className="font-serif font-bold">Email</p>
                  <p className="font-normal text-[#6F6A65] group-hover:underline">Hello@vedalush.com</p>
                </div>
              </a>

              <a
                href="https://www.google.com/maps?q=23.0328009,72.4256979+(VILLA-184,+Manipur+Saptak,+Ghuma,+Manipur,+Gujarat+382115)&z=16&output=embed"
                target="_blank"
                rel="noopener noreferrer"
                title="Click to open location in Google Maps"
                className="flex items-center space-x-4 text-[#5D4E42] hover:text-[#8E7A65] transition-colors duration-250 group cursor-pointer">
                <div className="w-12 h-12 flex-shrink-0 bg-white rounded-full flex items-center justify-center shadow-soft border border-[#E6DED2] group-hover:scale-110 transition-transform duration-250">
                  <HiOutlineLocationMarker className="w-5 h-5 text-[#8E7A65] group-hover:text-[#B88A5A] transition-colors duration-250" />
                </div>
                <div>
                  <p className="font-serif font-bold flex items-center gap-1.5">
                    Studio
                  </p>
                  <p className="font-normal text-[#6F6A65] group-hover:underline">VILLA-184, Manipur Saptak, Ghuma, Gujarat 382115</p>
                </div>
              </a>
            </div>

            {/* Social Links */}
            <div className="pt-8 flex space-x-4">
              <a href="#" className="w-10 h-10 bg-[#5D4E42] text-white rounded-full flex items-center justify-center hover:bg-[#8E7A65] transition-colors duration-250 shadow-soft">
                <FaInstagram />
              </a>
              <a href="#" className="w-10 h-10 bg-[#5D4E42] text-white rounded-full flex items-center justify-center hover:bg-[#8E7A65] transition-colors duration-250 shadow-soft">
                <FaFacebookF />
              </a>
            </div>
          </div>

          {/* Live Interactive Google Map */}
          <div className="h-96 md:h-full min-h-[450px] rounded-2xl relative group border border-[#E6DED2] shadow-soft overflow-hidden">
            <iframe
              title="Vedalush Studio Google Map"
              src="https://www.google.com/maps?q=23.0328009,72.4256979+(VILLA-184,+Manipur+Saptak,+Ghuma,+Manipur,+Gujarat+382115)&z=16&output=embed"
              width="100%"
              height="100%"
              style={{ border: 0, minHeight: '450px' }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="w-full h-full object-cover"
            />
            {/* Quick action floating button */}
            <a
              href="https://maps.app.goo.gl/UVMmWmdc2MtJXTGD7"
              target="_blank"
              rel="noopener noreferrer"
              className="absolute top-4 right-4 z-10 bg-white hover:bg-[#FDFBF7] text-[#5D4E42] px-4 py-2.5 rounded-xl shadow-soft border border-[#E6DED2] flex items-center gap-2 text-xs font-semibold transition-all duration-250 hover:scale-105 hover:shadow-soft-lg"
            >
              <HiOutlineLocationMarker className="w-4 h-4 text-[#8E7A65]" />
              <span>Open in Google Maps</span>
            </a>
          </div>

        </div>

      </div>
    </section>
  );
};

export default Contact;

