import React, { useEffect, useState, useRef } from 'react';
import { useTheme } from '../../Global/ThemeContext';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useLocation } from 'react-router-dom';

gsap.registerPlugin(ScrollTrigger);

const Wrapper = ({ children }) => {
  const { theme: colors } = useTheme();
  const [smallNav, setSmallNav] = useState(window.innerWidth < 900);
  const scrollManager = useRef(null);
  const location = useLocation();

  

  useEffect(() => {
    const handleResize = () => {
      setSmallNav(window.innerWidth < 900);
    };
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    // Delay the animation setup to ensure the elements are properly rendered
    const animationTimeout = setTimeout(() => {
      const appearElements = document.querySelectorAll(".appear");

      appearElements.forEach((element) => {
        gsap.from(
          element,
          {
            x: 0,
          
            y: -20,
            duration: 1,
            opacity: 0,
            scrollTrigger: {
              trigger: element,
              start: "top bottom",
              end: "bottom top",
              scroller: scrollManager.current,
              toggleActions: "restart play restart none",
              // scrub: true,
              // markers: true,
            }
          }
        );
      });
    }, 100); // Adjust the delay as needed

    return () => {
      clearTimeout(animationTimeout);
    };
  }, [children, location.pathname]);

  return (
    <div
      ref={scrollManager}
      style={{
        width: '100%',
        minHeight: smallNav ? 'calc(100vh - 90px)' : 'calc(100vh - 60px)',
        overflowY: 'auto',
        backgroundColor: colors.secondary2,
        position: 'relative',
        maxHeight: smallNav ? 'calc(100vh - 90px)' : 'calc(100vh - 60px)',
      }}
    >
      {children}
    </div>
  );
};

export default Wrapper;
