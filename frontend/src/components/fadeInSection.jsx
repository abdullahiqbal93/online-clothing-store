import React from 'react';
import useInView from '@/hooks/useInView';

const FadeInSection = ({ children, delay = 0, className = '' }) => {
  const [ref, isVisible] = useInView({
    threshold: 0.05,
    rootMargin: '100px'
  });

  return (
    <div
      ref={ref}
      className={`transition-opacity duration-500 ease-out ${className} ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

export default FadeInSection;