import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Find the main scrollable container in the layout
    const scrollContainer = document.querySelector('div[class*="overflow-auto"]');

    if (scrollContainer) {
      // Scroll the main content container
      scrollContainer.scrollTo({
        top: 0,
        left: 0,
        behavior: 'smooth',
      });
    } else {
      // Fallback to window scroll
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'smooth',
      });
    }
  }, [pathname]);

  return null;
};

export default ScrollToTop;
