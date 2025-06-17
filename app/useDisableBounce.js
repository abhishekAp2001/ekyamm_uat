// hooks/useDisableBounce.ts
import { useEffect } from 'react';

export function useDisableBounce() {
  useEffect(() => {
    const preventRubberBand = (e) => {
      const scrollTop = document.scrollingElement?.scrollTop || 0;
      const scrollHeight = document.scrollingElement?.scrollHeight || 0;
      const clientHeight = window.innerHeight;

      const atTop = scrollTop <= 0 && e.touches[0].clientY > 0;
      const atBottom = scrollTop + clientHeight >= scrollHeight && e.touches[0].clientY < 0;

      if (atTop || atBottom) {
        e.preventDefault();
      }
    };

    document.addEventListener('touchmove', preventRubberBand, { passive: false });

    return () => {
      document.removeEventListener('touchmove', preventRubberBand);
    };
  }, []);
}
 