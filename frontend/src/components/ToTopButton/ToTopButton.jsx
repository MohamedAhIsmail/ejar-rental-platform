import React, { useState, useEffect } from 'react';
import './ToTopButton.css';

const ToTopButton = () => {
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => {
    if (window.scrollY > 300) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  useEffect(() => {
    window.addEventListener('scroll', toggleVisibility);
    return () => {
      window.removeEventListener('scroll', toggleVisibility);
    };
  }, []);

  return (
    <button
      onClick={scrollToTop}
      className={`to-top-button ${isVisible ? 'visible' : ''}`}
    >
      <i className="fa-solid fa-angles-up"></i>
    </button>
  );
};

export default ToTopButton;