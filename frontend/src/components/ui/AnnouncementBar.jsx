import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation } from 'swiper/modules';
import 'swiper/css';

const announcements = [
  "We deliver to India and internationally \ud83c\udf0d",
  "100% Organic & Handcrafted Soaps \ud83c\udf3f",
];

const AnnouncementBar = () => {
  return (
    <div className="bg-[#a79475] text-white text-xs py-2 w-full z-50 flex items-center justify-center relative overflow-hidden h-9">
      <div className="flex items-center space-x-2 sm:space-x-10 w-full justify-center">
        <button 
          className="announcement-prev text-white/70 hover:text-white transition-colors p-1 focus:outline-none z-10 hidden sm:block cursor-pointer"
          aria-label="Previous announcement"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
        </button>

        <div className="w-full max-w-[320px] sm:max-w-[450px] flex justify-center items-center h-full relative">
          <Swiper
            modules={[Autoplay, Navigation]}
            autoplay={{ delay: 4000, disableOnInteraction: false }}
            navigation={{ prevEl: '.announcement-prev', nextEl: '.announcement-next' }}
            loop={true}
            allowTouchMove={true}
            className="w-full h-full flex items-center"
          >
            {announcements.map((announcement, index) => (
              <SwiperSlide key={index} className="flex justify-center items-center h-full">
                <span className="whitespace-nowrap text-sm font-medium tracking-wide flex items-center justify-center h-full">
                  {announcement}
                </span>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        <button 
          className="announcement-next text-white/70 hover:text-white transition-colors p-1 focus:outline-none z-10 hidden sm:block cursor-pointer"
          aria-label="Next announcement"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
        </button>
      </div>
    </div>
  );
};

export default AnnouncementBar;
