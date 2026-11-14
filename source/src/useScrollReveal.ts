import { useLayoutEffect } from 'react';

const revealSelector = [
  'h2', '.calculator-options', '.calculator-total',
  '.comparison-frame', '.comparison-note',
  '.process-cards > li',
  '.information-grid > section', '.contact-inner',
].join(',');

export function useScrollReveal() {
  useLayoutEffect(() => {
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (motion.matches || typeof IntersectionObserver === 'undefined') return;

    const targets: HTMLElement[] = [];
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting && entry.intersectionRatio >= .15) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: .15 });

    document.querySelectorAll<HTMLElement>('main > .section:not(.process-section):not(.information-section)').forEach(section => {
      const candidates = [...section.querySelectorAll<HTMLElement>(revealSelector)];
      // Animate panels as a whole; avoid stacking transforms on their children.
      candidates.filter(element => !candidates.some(parent => parent !== element && parent.contains(element)))
        .forEach((element, index) => {
          element.classList.add('reveal-item');
          element.style.setProperty('--i', String(index));
          targets.push(element);
          observer.observe(element);
        });
    });

    const showAll = () => {
      observer.disconnect();
      targets.forEach(element => element.classList.add('is-visible'));
    };
    const preferenceChanged = () => { if (motion.matches) showAll(); };
    const focused = (event: FocusEvent) => {
      const element = (event.target as HTMLElement).closest<HTMLElement>('.reveal-item');
      if (element) {
        element.classList.add('is-visible');
        observer.unobserve(element);
      }
    };
    motion.addEventListener('change', preferenceChanged);
    document.addEventListener('focusin', focused);
    return () => {
      observer.disconnect();
      motion.removeEventListener('change', preferenceChanged);
      document.removeEventListener('focusin', focused);
      targets.forEach(element => {
        element.classList.remove('reveal-item', 'is-visible');
        element.style.removeProperty('--i');
      });
    };
  }, []);
}
