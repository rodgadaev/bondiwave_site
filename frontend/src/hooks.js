import { useState, useEffect, useRef } from "react";

// Assessment Modal Trigger Hook
export const useAssessmentModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  
  const openModal = () => setIsOpen(true);
  
  const closeModal = () => {
    setIsOpen(false);
    localStorage.setItem('hasTakenAssessment', 'true');
  };
  
  return { isOpen, openModal, closeModal };
};

// Animated Counter Hook
export const useCountUp = (end, duration = 1500) => {
  const [value, setValue] = useState(0);
  const hasStartedRef = useRef(false);
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasStartedRef.current) {
          hasStartedRef.current = true;
          const start = performance.now();
          const animate = (now) => {
            const progress = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setValue(eased * end);
            if (progress < 1) requestAnimationFrame(animate);
          };
          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [end, duration]);

  return { value, ref };
};
