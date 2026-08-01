import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const CurrencyContext = createContext();

export const SUPPORTED_CURRENCIES = [
  { code: 'INR', symbol: '₹', name: 'Indian Rupee', flag: '🇮🇳', locale: 'en-IN' },
  { code: 'USD', symbol: '$', name: 'US Dollar', flag: '🇺🇸', locale: 'en-US' },
  { code: 'GBP', symbol: '£', name: 'British Pound', flag: '🇬🇧', locale: 'en-GB' },
  { code: 'AUD', symbol: 'A$', name: 'Australian Dollar', flag: '🇦🇺', locale: 'en-AU' },
  { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar', flag: '🇨🇦', locale: 'en-CA' },
  { code: 'AED', symbol: 'د.إ', name: 'UAE Dirham', flag: '🇦🇪', locale: 'ar-AE' },
];

export const CurrencyProvider = ({ children }) => {
  const [currency, setCurrency] = useState(() => {
    return localStorage.getItem('vedalush_currency') || 'INR';
  });

  const [rates, setRates] = useState({
    INR: 1,
    USD: 0.012,
    GBP: 0.0094,
    AUD: 0.018,
    CAD: 0.016,
    AED: 0.044,
  });

  const [loading, setLoading] = useState(true);

  // Fetch live/cached exchange rates from backend
  useEffect(() => {
    const fetchRates = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/currency/rates`, { timeout: 5000 });
        if (response.data && response.data.rates) {
          setRates(response.data.rates);
        }
      } catch (error) {
        console.warn('Could not fetch backend exchange rates, using fallback rates:', error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchRates();
  }, []);

  // Auto-detect country/currency by IP if first visit (no saved preference)
  useEffect(() => {
    const detectCurrencyByIP = async () => {
      if (localStorage.getItem('vedalush_currency')) return; // Already chosen or saved
      try {
        const res = await axios.get('https://ipapi.co/json/', { timeout: 4000 });
        if (res.data && res.data.country_code) {
          const code = res.data.country_code.toUpperCase();
          let detected = 'INR';
          if (code === 'US') detected = 'USD';
          else if (code === 'GB' || code === 'UK') detected = 'GBP';
          else if (code === 'AU') detected = 'AUD';
          else if (code === 'CA') detected = 'CAD';
          else if (code === 'AE') detected = 'AED';
          else if (code === 'IN') detected = 'INR';

          setCurrency(detected);
          localStorage.setItem('vedalush_currency', detected);
        }
      } catch (err) {
        console.warn('IP auto-detection failed, defaulting to INR:', err.message);
      }
    };
    detectCurrencyByIP();
  }, []);

  const changeCurrency = (newCode) => {
    setCurrency(newCode);
    localStorage.setItem('vedalush_currency', newCode);
  };

  // Helper to get active currency metadata
  const getCurrencyMeta = (code = currency) => {
    return SUPPORTED_CURRENCIES.find(c => c.code === code) || SUPPORTED_CURRENCIES[0];
  };

  /**
   * Calculates and formats product price based on selected currency and manual country overrides.
   * @param {number} baseINR - Base price in INR
   * @param {number|null} baseDiscountINR - Discounted price in INR
   * @param {object|null} internationalPrices - Optional manual overrides map { USD: { price, discountPrice } }
   * @returns {object} { priceFormatted, discountFormatted, rawPrice, rawDiscount, symbol }
   */
  const formatPrice = (baseINR, baseDiscountINR = null, internationalPrices = null) => {
    const meta = getCurrencyMeta();
    let finalPrice = baseINR;
    let finalDiscount = baseDiscountINR;

    // Check if manual override exists for this currency
    if (currency !== 'INR' && internationalPrices && internationalPrices[currency] && internationalPrices[currency].price) {
      finalPrice = internationalPrices[currency].price;
      finalDiscount = internationalPrices[currency].discountPrice || null;
    } else if (currency !== 'INR') {
      // Dynamic conversion using exchange rates
      const rate = rates[currency] || 1;
      finalPrice = Math.round(baseINR * rate);
      if (baseDiscountINR) {
        finalDiscount = Math.round(baseDiscountINR * rate);
      }
    }

    const formatter = new Intl.NumberFormat(meta.locale, {
      style: 'currency',
      currency: meta.code,
      maximumFractionDigits: currency === 'INR' ? 0 : 2,
    });

    return {
      priceFormatted: formatter.format(finalPrice),
      discountFormatted: finalDiscount ? formatter.format(finalDiscount) : null,
      rawPrice: finalPrice,
      rawDiscount: finalDiscount,
      symbol: meta.symbol,
      code: meta.code,
    };
  };

  return (
    <CurrencyContext.Provider value={{
      currency,
      changeCurrency,
      rates,
      loading,
      formatPrice,
      getCurrencyMeta,
      supportedCurrencies: SUPPORTED_CURRENCIES,
    }}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => useContext(CurrencyContext);
export default CurrencyContext;
