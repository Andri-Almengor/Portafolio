import { useEffect, useRef, useState } from 'react';

export function ScrollReveal({
  as: Component = 'div',
  children,
  className = '',
  delay = 0,
  distance = '24px',
  threshold = 0.14
}) {
  const elementRef = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return undefined;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion || !('IntersectionObserver' in window)) {
      setVisible(true);
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setVisible(true);
        observer.unobserve(entry.target);
      },
      {
        threshold,
        rootMargin: '0px 0px -8% 0px'
      }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [threshold]);

  return (
    <Component
      ref={elementRef}
      className={`reveal-on-scroll ${visible ? 'is-visible' : ''} ${className}`.trim()}
      style={{
        '--reveal-delay': `${delay}ms`,
        '--reveal-distance': distance
      }}
    >
      {children}
    </Component>
  );
}
