import { useEffect, useState } from 'react';

const useInView = (options = {}) => {
  const [ref, setRef] = useState(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!ref) return;

    const observer = new IntersectionObserver(([entry]) => {
      setIsVisible(entry.isIntersecting);
    }, {
      threshold: options.threshold || 0.1,
      root: options.root || null,
      rootMargin: options.rootMargin || '0px'
    });

    observer.observe(ref);

    return () => {
      if (ref) {
        observer.unobserve(ref);
      }
    };
  }, [ref, options.threshold, options.root, options.rootMargin]);

  return [setRef, isVisible];
};

export default useInView;