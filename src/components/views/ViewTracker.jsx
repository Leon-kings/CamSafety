import { useEffect } from 'react';
import axios from 'axios';

export const ViewTracker = () => {
  useEffect(() => {
    const trackView = async () => {
      try {
        // Check if already viewed in this session
        if (!sessionStorage.getItem('hasViewedIndex')) {
          await axios.post('https://camera-safety.onrender.com/view/count/index-stats/1');
          sessionStorage.setItem('hasViewedIndex', 'true');
        }
      } catch (error) {
        console.error('Error tracking view:', error);
      }
    };
    
    trackView();
  }, []);

  return null; // This component doesn't render anything
};

