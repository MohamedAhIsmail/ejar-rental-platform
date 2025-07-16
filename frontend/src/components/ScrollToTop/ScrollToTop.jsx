import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function ScrollToTop() {
  const { pathname } = useLocation();

  // Disable browser's default scroll restoration (which remembers last scroll position)
  useEffect(() => {
    window.history.scrollRestoration = 'manual';
  }, []);

  useEffect(() => {
    // Delay scroll to top slightly to allow content/layout to finish rendering
    const timeout = setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 200); // 200ms delay improves stability across dynamic/lazy-loaded routes

    return () => clearTimeout(timeout); // Clean up on unmount
  }, [pathname]);

  return null;
}
