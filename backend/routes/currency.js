import express from 'express';

const router = express.Router();

// In-memory cache for exchange rates
let cachedRates = null;
let lastFetchTime = 0;
const CACHE_DURATION = 3600 * 1000; // 1 hour in milliseconds

// Reliable fallback rates (relative to 1 INR) in case external API fails or is offline
const FALLBACK_RATES = {
  INR: 1,
  USD: 0.012,
  GBP: 0.0094,
  AUD: 0.018,
  CAD: 0.016,
  AED: 0.044
};

router.get('/rates', async (req, res) => {
  try {
    const now = Date.now();
    // Return cached rates if within duration
    if (cachedRates && (now - lastFetchTime) < CACHE_DURATION) {
      return res.status(200).json({
        success: true,
        rates: cachedRates,
        cached: true
      });
    }

    // Fetch from free public open exchange rates API using native Node.js fetch (no API key or extra packages required)
    const response = await fetch('https://open.er-api.com/v6/latest/INR', { signal: AbortSignal.timeout(5000) });
    const data = await response.json();
    
    if (data && data.rates) {
      cachedRates = {
        INR: 1,
        USD: data.rates.USD || FALLBACK_RATES.USD,
        GBP: data.rates.GBP || FALLBACK_RATES.GBP,
        AUD: data.rates.AUD || FALLBACK_RATES.AUD,
        CAD: data.rates.CAD || FALLBACK_RATES.CAD,
        AED: data.rates.AED || FALLBACK_RATES.AED,
      };
      lastFetchTime = now;
    } else {
      throw new Error('Invalid rate response');
    }

    res.status(200).json({
      success: true,
      rates: cachedRates,
      cached: false
    });
  } catch (error) {
    console.error('Error fetching exchange rates, using fallback:', error.message);
    res.status(200).json({
      success: true,
      rates: cachedRates || FALLBACK_RATES,
      cached: false,
      fallback: true
    });
  }
});

export default router;
