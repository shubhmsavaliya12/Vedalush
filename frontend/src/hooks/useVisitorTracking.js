import { useEffect } from 'react';
import axios from 'axios';

const useVisitorTracking = () => {
  useEffect(() => {
    const trackVisit = async () => {
      try {
        const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM
        const storageKey = `vedalush_visited_${currentMonth}`;
        
        // If they already visited this month, don't ping the server
        if (localStorage.getItem(storageKey)) {
          return;
        }
        
        // Send a ping to record a unique visit for the month
        // In development, the proxy is not configured, so we use full URL or relative if proxied
        // Based on other fetch calls, the base URL is http://localhost:5000 in dev
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
        await axios.post(`${apiUrl}/api/analytics/visit`);
        
        // Mark as visited in localStorage
        localStorage.setItem(storageKey, 'true');
      } catch (error) {
        console.error('Failed to track visitor', error);
      }
    };
    
    // Slight delay to not block initial render performance
    const timer = setTimeout(trackVisit, 2000);
    return () => clearTimeout(timer);
  }, []);
};

export default useVisitorTracking;
