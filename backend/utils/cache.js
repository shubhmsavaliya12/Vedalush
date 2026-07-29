import NodeCache from 'node-cache';

// stdTTL: Default time-to-live for cache entries in seconds (3600 = 1 hour)
// checkperiod: How often to check for expired entries (600 = 10 minutes)
const myCache = new NodeCache({ stdTTL: 3600, checkperiod: 600 });

export default myCache;
