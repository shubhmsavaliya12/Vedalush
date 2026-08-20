import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiMenu, HiX, HiOutlineUser, HiOutlineShoppingBag } from 'react-icons/hi';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCurrency } from '../../context/CurrencyContext';
import { useCart } from '../../context/CartContext';
import AnnouncementBar from './AnnouncementBar';

const leftLinks = [
  { name: 'Products', href: '/#products' },
  {
    name: 'About', isDropdown: true, items: [
      { name: 'Our Roots', href: '/our-roots' },
      { name: 'About Us', href: '/about-us' }
    ]
  },
  { name: 'Reviews', href: '/reviews' },
  { name: 'Skin Type', href: '/skin-type' },
];

const mobileNavLinks = [
  { name: 'Products', href: '/#products', subtitle: 'Handcrafted natural soaps' },
  {
    name: 'About', isDropdown: true, subtitle: 'Discover our story', items: [
      { name: 'Our Roots', href: '/our-roots', subtitle: 'Rooted in ancient wisdom' },
      { name: 'About Us', href: '/about-us', subtitle: 'Who we are' }
    ]
  },
  { name: 'Ingredients', href: '/#ingredients', subtitle: '100% organic botanicals' },
  { name: 'Skin Type Guide', href: '/skin-type', subtitle: 'Tailored for radiant skin' },
  { name: 'Customer Reviews', href: '/reviews', subtitle: 'Loved by skin enthusiasts' },
  { name: 'Contact Us', href: '/#contact', subtitle: 'We are here to help' },
];

const CurrencyDropdown = ({ currency, changeCurrency, supportedCurrencies, compact = false, openUpwards = false }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const current = supportedCurrencies.find(c => c.code === currency) || supportedCurrencies[0] || { code: 'INR', flag: '🇮🇳' };

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center justify-between text-[#5D4E42] hover:text-[#B88A5A] focus:outline-none transition-colors duration-200 cursor-pointer ${compact ? 'py-1 text-[11px] font-semibold gap-1' : 'py-1 text-xs font-semibold gap-1.5'
          }`}
        aria-expanded={isOpen}
      >
        <span className="flex items-center gap-1">
          <span>{current.flag}</span>
          <span>{current.code}</span>
        </span>
        <svg className={`w-2.5 h-2.5 text-[#6F6A65] transform transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: openUpwards ? 5 : -5, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: openUpwards ? 5 : -5, scale: 0.95 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className={`absolute right-0 ${openUpwards ? 'bottom-full mb-2' : 'top-full mt-2'} w-28 bg-[#FFFFFF] border border-[#E6DED2] rounded-xl shadow-soft-lg py-1.5 z-[100] overflow-hidden`}
          >
            {supportedCurrencies.map((c) => (
              <button
                key={c.code}
                type="button"
                onClick={() => {
                  changeCurrency(c.code);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-3 py-1.5 text-xs font-semibold flex items-center justify-between transition-colors cursor-pointer ${currency === c.code
                    ? 'bg-[#8E7A65] text-white'
                    : 'text-[#5D4E42] hover:bg-[#F8F4EC] hover:text-[#B88A5A]'
                  }`}
              >
                <span className="flex items-center gap-2">
                  <span>{c.flag}</span>
                  <span>{c.code}</span>
                </span>
                {currency === c.code && (
                  <span className="text-[10px] font-bold">✓</span>
                )}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [visible, setVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openMobileDropdown, setOpenMobileDropdown] = useState(null);
  const [navbarHeight, setNavbarHeight] = useState(0);
  const navbarRef = useRef(null);
  
  useEffect(() => {
    if (!navbarRef.current) return;
    const observer = new ResizeObserver((entries) => {
      for (let entry of entries) {
        setNavbarHeight(entry.borderBoxSize?.[0]?.blockSize ?? entry.contentRect.height);
      }
    });
    observer.observe(navbarRef.current);
    return () => observer.disconnect();
  }, []);
  
  const { user } = useAuth();
  const { currency, changeCurrency, supportedCurrencies } = useCurrency();
  const { cartCount, toggleCart } = useCart();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setScrolled(currentScrollY > 30);

      if (currentScrollY > lastScrollY && currentScrollY > 120 && !mobileMenuOpen) {
        setVisible(false);
      } else if (currentScrollY < lastScrollY) {
        setVisible(true);
      }
      setLastScrollY(currentScrollY);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY, mobileMenuOpen]);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  // Robust cross-page hash scrolling
  useEffect(() => {
    if (location.pathname === '/' && location.hash) {
      const targetId = location.hash.replace('#', '');
      const scrollToElement = () => {
        const element = document.getElementById(targetId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
          return true;
        }
        return false;
      };

      if (!scrollToElement()) {
        let attempts = 0;
        const interval = setInterval(() => {
          attempts++;
          if (scrollToElement() || attempts > 15) {
            clearInterval(interval);
          }
        }, 100);
        return () => clearInterval(interval);
      }
    }
  }, [location.pathname, location.hash]);

  const toggleMobileDropdown = (name) => {
    if (openMobileDropdown === name) setOpenMobileDropdown(null);
    else setOpenMobileDropdown(name);
  };

  const handleSectionClick = (e, targetHref, closeMenu = false) => {
    if (closeMenu) setMobileMenuOpen(false);
    if (targetHref.startsWith('/#') || targetHref.startsWith('#')) {
      e.preventDefault();
      const targetId = targetHref.replace('/#', '').replace('#', '');
      if (location.pathname === '/') {
        const element = document.getElementById(targetId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
          window.history.pushState(null, '', `/#${targetId}`);
        }
      } else {
        navigate(`/#${targetId}`);
      }
    }
  };

  return (
    <>
      <div style={{ height: `${navbarHeight}px` }} className="w-full shrink-0" aria-hidden="true" />
      <div 
        ref={navbarRef}
        className={`fixed top-0 left-0 w-full z-50 flex flex-col transition-transform duration-300 ease-in-out ${visible ? 'translate-y-0' : '-translate-y-full'
          }`}
      >
        <AnnouncementBar />
        <header
          className={`w-full transition-all duration-250 ease-in-out ${scrolled
              ? 'bg-[#FDFBF7] py-3 lg:py-3.5 border-b border-[#E6DED2] shadow-soft'
              : 'bg-[#F8F4EC] py-4 lg:py-5 border-b border-[#E6DED2]/60'
            }`}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between">

              {/* Desktop Left Nav (3-4 Items, balanced) */}
              <nav className="hidden lg:flex items-center space-x-6 xl:space-x-8 flex-1 justify-start">
                {leftLinks.map((link) => (
                  link.isDropdown ? (
                    <div key={link.name} className="relative group py-1">
                      <span className="cursor-pointer text-sm xl:text-[13px] font-semibold uppercase tracking-[0.22em] text-[#5D4E42] hover:text-[#B88A5A] transition-all duration-250 flex items-center gap-1">
                        {link.name}
                        <svg className="w-3 h-3 text-[#5D4E42] group-hover:text-[#B88A5A] transition-transform duration-200 group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
                        </svg>
                      </span>
                      <div className="absolute top-[120%] left-0 w-48 bg-white border border-[#E6DED2] rounded-lg shadow-soft-lg py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible group-hover:top-full transition-all duration-300 z-[100] before:content-[''] before:absolute before:-top-4 before:left-0 before:w-full before:h-4">
                        {link.items.map(subItem => (
                          <Link
                            key={subItem.name}
                            to={subItem.href}
                            className="block px-4 py-2.5 text-[13px] font-semibold uppercase tracking-wider text-[#5D4E42] hover:bg-[#F8F4EC] hover:text-[#B88A5A] transition-colors"
                          >
                            {subItem.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  ) : link.href.startsWith('#') || link.href.startsWith('/#') ? (
                    <a
                      key={link.name}
                      href={link.href}
                      onClick={(e) => handleSectionClick(e, link.href)}
                      className="text-xs xl:text-[13px] font-semibold uppercase tracking-[0.22em] text-[#5D4E42] hover:text-[#B88A5A] transition-all duration-250 relative py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1.5px] after:bg-[#B88A5A] hover:after:w-full after:transition-all after:duration-250"
                    >
                      {link.name}
                    </a>
                  ) : (
                    <Link
                      key={link.name}
                      to={link.href}
                      className="text-xs xl:text-[13px] font-semibold uppercase tracking-[0.22em] text-[#5D4E42] hover:text-[#B88A5A] transition-all duration-250 relative py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1.5px] after:bg-[#B88A5A] hover:after:w-full after:transition-all after:duration-250"
                    >
                      {link.name}
                    </Link>
                  )
                ))}
              </nav>

              {/* Mobile Left: Menu Toggle */}
              <div className="flex lg:hidden items-center justify-start flex-1">
                <button
                  className="z-50 text-[#5D4E42] p-1.5 focus:outline-none hover:text-[#B88A5A] transition-colors duration-250 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B88A5A] focus-visible:ring-offset-2"
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  aria-label="Toggle Navigation Menu"
                >
                  {mobileMenuOpen ? <HiX size={28} /> : <HiMenu size={28} />}
                </button>
              </div>

              {/* Centered Brand Logo */}
              <div className="flex flex-col items-center justify-center shrink-0 px-2 sm:px-6 text-center">
                <Link to="/" className="flex flex-col items-center group z-50">
                  <img
                    src="/vedalus.png"
                    alt="Vedalush Logo"
                    width="200"
                    height="64"
                    className="h-16 md:h-18 w-auto object-contain transition-transform duration-500 group-hover:scale-105"
                    fetchPriority="high" decoding="async" />
                </Link>
              </div>

              {/* Desktop Right Nav & Actions */}
              <nav className="hidden lg:flex items-center space-x-5 xl:space-x-7 flex-1 justify-end">
                {/* Currency Selector */}
                <CurrencyDropdown
                  currency={currency}
                  changeCurrency={changeCurrency}
                  supportedCurrencies={supportedCurrencies}
                />

                {/* Profile / Login */}
                {user ? (
                  <Link
                    to="/profile"
                    className="flex items-center space-x-1.5 text-[#5D4E42] hover:text-[#B88A5A] transition-colors duration-250 py-1"
                    title={user.name}
                  >
                    <div className="w-8 h-8 rounded-full bg-[#E6DED2] border border-[#8E7A65]/30 flex items-center justify-center text-[#5D4E42] font-serif font-bold text-md shadow-inner">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                  </Link>
                ) : (
                  <Link
                    to="/login"
                    className="flex items-center space-x-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-[#5D4E42] hover:text-[#B88A5A] transition-colors duration-250 py-1 px-3 border border-[#E6DED2] rounded-full hover:border-[#8E7A65]"
                  >
                    <HiOutlineUser size={15} />
                    <span>Login</span>
                  </Link>
                )}

                {/* Cart Toggle Desktop */}
                <button
                  onClick={toggleCart}
                  className="relative flex items-center text-[#5D4E42] hover:text-[#B88A5A] transition-colors duration-250 py-1 cursor-pointer"
                  aria-label="Open Cart"
                >
                  <HiOutlineShoppingBag size={25} />
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-2 bg-[#B88A5A] text-white text-[12px] font-semibold h-5 w-5 rounded-full flex items-center justify-center">
                      {cartCount}
                    </span>
                  )}
                </button>
              </nav>

              {/* Mobile Right: Compact User Icon */}
              <div className="flex lg:hidden items-center space-x-2.5 flex-1 justify-end">

                {user ? (
                  <Link to="/profile" className="text-[#5D4E42] hover:text-[#B88A5A] transition-colors duration-250 p-1" title={user.name}>
                    <HiOutlineUser size={20} />
                  </Link>
                ) : (
                  <Link to="/login" className="text-[#5D4E42] hover:text-[#B88A5A] transition-colors duration-250 p-1" title="Login">
                    <HiOutlineUser size={20} />
                  </Link>
                )}

                {/* Cart Toggle Mobile */}
                <button
                  onClick={toggleCart}
                  className="relative text-[#5D4E42] hover:text-[#B88A5A] transition-colors duration-250 p-1 mr-1 cursor-pointer"
                  aria-label="Open Cart"
                >
                  <HiOutlineShoppingBag size={22} />
                  {cartCount > 0 && (
                    <span className="absolute top-0 right-0 bg-[#B88A5A] text-white text-[12px] font-semibold h-4 w-4 rounded-full flex items-center justify-center translate-x-1/4 -translate-y-1/4">
                      {cartCount}
                    </span>
                  )}
                </button>
              </div>

            </div>
          </div>
        </header>
      </div>

      {/* Side Drawer Luxury Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-40 lg:hidden flex">
            {/* Darkened Backdrop Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-[#3D332B]/40 backdrop-blur-xs"
            />

            {/* Slide-over Side Drawer Panel */}
            <motion.div
              initial={{ x: '-100%', opacity: 0.8 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: '-100%', opacity: 0.8 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              style={{ paddingTop: navbarHeight }}
              className="relative w-[82%] max-w-[340px] h-full bg-[#FDFBF7] shadow-soft-2xl flex flex-col justify-between pb-8 px-6 overflow-y-auto z-50 border-r border-[#E6DED2]"
            >

              {/* Nav Links List */}
              <nav className="flex flex-col w-full flex-1 pt-2 pb-6">
                {mobileNavLinks.map((link, idx) => (
                  <motion.div
                    key={link.name}
                    initial={{ opacity: 0, x: -15 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.05 * idx, duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                    className="border-b border-[#E6DED2]/70 last:border-none"
                  >
                    {link.isDropdown ? (
                      <>
                        <button
                          onClick={() => toggleMobileDropdown(link.name)}
                          className="w-full group flex items-center justify-between py-3.5 sm:py-4 px-2 text-[#5D4E42] hover:text-[#B88A5A] transition-all duration-250 cursor-pointer"
                        >
                          <div className="flex items-center space-x-3.5">
                            <span className="text-xs font-mono font-semibold text-[#C19A6B] tracking-wider w-4">
                              0{idx + 1}
                            </span>
                            <div className="flex flex-col text-left">
                              <span className="text-base sm:text-lg font-serif font-bold uppercase tracking-wider group-hover:translate-x-1 transition-transform duration-250">
                                {link.name}
                              </span>
                              <span className="text-[11px] font-sans font-normal text-[#9D948B] tracking-normal mt-0.5">
                                {link.subtitle}
                              </span>
                            </div>
                          </div>
                          <svg className={`w-4 h-4 text-[#8E7A65] transform transition-transform duration-300 ${openMobileDropdown === link.name ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
                          </svg>
                        </button>
                        <AnimatePresence>
                          {openMobileDropdown === link.name && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              className="overflow-hidden bg-[#F8F4EC]/50 rounded-lg mx-2 mb-2"
                            >
                              {link.items.map((subItem) => (
                                <Link
                                  key={subItem.name}
                                  to={subItem.href}
                                  onClick={() => setMobileMenuOpen(false)}
                                  className="block py-3 px-6 text-sm font-semibold uppercase tracking-wider text-[#5D4E42] hover:text-[#B88A5A] transition-colors border-b border-[#E6DED2]/50 last:border-none"
                                >
                                  {subItem.name}
                                  <span className="block text-[11px] font-sans font-normal text-[#9D948B] tracking-normal mt-0.5 normal-case">
                                    {subItem.subtitle}
                                  </span>
                                </Link>
                              ))}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </>
                    ) : link.href.startsWith('#') || link.href.startsWith('/#') ? (
                      <a
                        href={link.href}
                        onClick={(e) => handleSectionClick(e, link.href, true)}
                        className="group flex items-center justify-between py-3.5 sm:py-4 px-2 text-[#5D4E42] hover:text-[#B88A5A] transition-all duration-250"
                      >
                        <div className="flex items-center space-x-3.5">
                          <span className="text-xs font-mono font-semibold text-[#C19A6B] tracking-wider w-4">
                            0{idx + 1}
                          </span>
                          <div className="flex flex-col text-left">
                            <span className="text-base sm:text-lg font-serif font-bold uppercase tracking-wider group-hover:translate-x-1 transition-transform duration-250">
                              {link.name}
                            </span>
                            <span className="text-[11px] font-sans font-normal text-[#9D948B] tracking-normal mt-0.5">
                              {link.subtitle}
                            </span>
                          </div>
                        </div>
                        <span className="text-sm font-light text-[#8E7A65] opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-250">
                          →
                        </span>
                      </a>
                    ) : (
                      <Link
                        to={link.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className="group flex items-center justify-between py-3.5 sm:py-4 px-2 text-[#5D4E42] hover:text-[#B88A5A] transition-all duration-250"
                      >
                        <div className="flex items-center space-x-3.5">
                          <span className="text-xs font-mono font-semibold text-[#C19A6B] tracking-wider w-4">
                            0{idx + 1}
                          </span>
                          <div className="flex flex-col text-left">
                            <span className="text-base sm:text-lg font-serif font-bold uppercase tracking-wider group-hover:translate-x-1 transition-transform duration-250">
                              {link.name}
                            </span>
                            <span className="text-[11px] font-sans font-normal text-[#9D948B] tracking-normal mt-0.5">
                              {link.subtitle}
                            </span>
                          </div>
                        </div>
                        <span className="text-sm font-light text-[#8E7A65] opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-250">
                          →
                        </span>
                      </Link>
                    )}
                  </motion.div>
                ))}
              </nav>

              {/* Bottom Actions Section */}
              <div className="border-[#E6DED2] flex flex-col space-y-4">
                <div className="flex items-center justify-between px-1">
                  <span className="text-xs font-semibold text-[#9D948B] uppercase tracking-wider">Currency</span>
                  <CurrencyDropdown
                    currency={currency}
                    changeCurrency={changeCurrency}
                    supportedCurrencies={supportedCurrencies}
                    openUpwards={true}
                  />
                </div>

                <div className="flex items-stretch -mx-6 border-y border-[#E6DED2]">
                  <a
                    href="/#order"
                    onClick={(e) => handleSectionClick(e, '/#order', true)}
                    className="flex-1 flex items-center justify-center text-center py-3 bg-[#B88A5A] text-white text-[11px] font-semibold uppercase tracking-[0.18em] hover:bg-[#9F7348] transition-all duration-250 truncate px-2 border-r border-[#E6DED2]"
                  >
                    Order Directly
                  </a>

                  {user ? (
                    <Link
                      to="/profile"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex-1 flex items-center justify-center gap-1.5 px-2 py-3 bg-[#FFFFFF] text-[#5D4E42] font-semibold text-[11px] uppercase tracking-wider hover:bg-[#F8F4EC] transition-all duration-250 shrink-0"
                    >
                      <HiOutlineUser size={15} className="text-[#8E7A65]" />
                      <span className="max-w-[70px] truncate">{user.name}</span>
                    </Link>
                  ) : (
                    <Link
                      to="/login"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex-1 flex items-center justify-center gap-1.5 px-2 py-3 bg-[#FFFFFF] text-[#5D4E42] font-semibold text-[11px] uppercase tracking-wider hover:bg-[#F8F4EC] transition-all duration-250 shrink-0"
                    >
                      <HiOutlineUser size={15} className="text-[#8E7A65]" />
                      <span>Login</span>
                    </Link>
                  )}
                </div>

                <div className="flex items-center justify-between text-[10px] text-[#9D948B] pt-1 px-1">
                  <span>&copy; {new Date().getFullYear()} Vedalush</span>
                  <span className="italic font-serif text-[#8E7A65]">Organic & Handcrafted</span>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
