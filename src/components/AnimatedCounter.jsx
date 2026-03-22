import React, { useState, useEffect, useRef } from 'react';

const AnimatedCounter = ({ end, duration = 2000, step = 10, suffix = '+' }) => {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    let startTime = null;
    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = timestamp - startTime;
      const percentage = Math.min(progress / duration, 1);
      
      // Calculate current value ensuring it steps correctly
      let currentVal = Math.floor((percentage * end) / step) * step;
      if (percentage === 1) currentVal = end;
      
      setCount(currentVal);

      if (percentage < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [end, duration, step, isVisible]);

  return (
    <div ref={elementRef} style={{ fontSize: '3.5rem', fontWeight: '800', color: 'var(--primary-orange)' }}>
      {count.toLocaleString()}{suffix}
    </div>
  );
};

export default AnimatedCounter;
