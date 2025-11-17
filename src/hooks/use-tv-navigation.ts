import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
const FOCUSABLE_SELECTOR = 'a, button, [tabindex]:not([tabindex="-1"])';
export const useTvNavigation = (containerRef: React.RefObject<HTMLElement>) => {
  const navigate = useNavigate();
  const lastFocusedElement = useRef<HTMLElement | null>(null);
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const onFocusIn = (e: FocusEvent) => {
      if (e.target instanceof HTMLElement) {
        lastFocusedElement.current = e.target;
      }
    };
    container.addEventListener('focusin', onFocusIn);
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Enter'].includes(e.key)) {
        return;
      }
      const activeElement = document.activeElement as HTMLElement;
      if (!container.contains(activeElement)) {
        // If focus is outside our container, bring it back to the last known element or the first one.
        const target = lastFocusedElement.current ?? container.querySelector<HTMLElement>(FOCUSABLE_SELECTOR);
        target?.focus();
        e.preventDefault();
        return;
      }
      if (e.key === 'Enter') {
        // Let the default action (click or link navigation) happen
        return;
      }
      e.preventDefault();
      const focusableElements = Array.from(
        container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)
      ).filter(el => el.offsetParent !== null); // Only visible elements
      if (focusableElements.length === 0) return;
      const currentIndex = focusableElements.indexOf(activeElement);
      if (currentIndex === -1) {
        focusableElements[0]?.focus();
        return;
      }
      const currentRect = activeElement.getBoundingClientRect();
      let nextElement: HTMLElement | undefined;
      switch (e.key) {
        case 'ArrowRight':
          nextElement = focusableElements.find((el, index) => index > currentIndex && Math.abs(el.getBoundingClientRect().y - currentRect.y) < 20);
          break;
        case 'ArrowLeft':
          nextElement = focusableElements.slice(0, currentIndex).reverse().find(el => Math.abs(el.getBoundingClientRect().y - currentRect.y) < 20);
          break;
        case 'ArrowDown':
        case 'ArrowUp': {
          const isDown = e.key === 'ArrowDown';
          const candidates = focusableElements.filter(el => {
            const elRect = el.getBoundingClientRect();
            return isDown ? elRect.top > currentRect.bottom : elRect.bottom < currentRect.top;
          });
          if (candidates.length > 0) {
            candidates.sort((a, b) => {
              const aRect = a.getBoundingClientRect();
              const bRect = b.getBoundingClientRect();
              const aDist = Math.sqrt(Math.pow(aRect.left - currentRect.left, 2) + Math.pow(aRect.top - currentRect.top, 2));
              const bDist = Math.sqrt(Math.pow(bRect.left - currentRect.left, 2) + Math.pow(bRect.top - currentRect.top, 2));
              return aDist - bDist;
            });
            nextElement = candidates[0];
          }
          break;
        }
      }
      if (nextElement) {
        nextElement.focus();
        nextElement.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    // Set initial focus
    const firstElement = container.querySelector<HTMLElement>(FOCUSABLE_SELECTOR);
    firstElement?.focus();
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      container.removeEventListener('focusin', onFocusIn);
    };
  }, [containerRef, navigate]);
};