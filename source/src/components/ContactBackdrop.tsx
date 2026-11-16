import { useEffect, useRef } from 'react';

/** Two light SVG thread layers; only their transforms animate. */
export default function ContactBackdrop() {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = root.current;
    if (!element) return;
    let visible = false;
    const update = () => {
      element.dataset.active = String(visible && !document.hidden);
    };
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      update();
    });
    observer.observe(element);
    document.addEventListener('visibilitychange', update);
    return () => {
      observer.disconnect();
      document.removeEventListener('visibilitychange', update);
    };
  }, []);

  return <div ref={root} className="contact-backdrop" aria-hidden="true" data-active="false">
    <svg className="contact-threads contact-threads-warp" viewBox="0 0 1440 640" preserveAspectRatio="xMidYMid slice" fill="none">
      {Array.from({ length: 30 }, (_, i) => {
        const offset = i * 32 - 400;
        return <path key={i} d={`M -120 ${offset + 640} C 280 ${offset + 620}, 360 ${offset + 180}, 760 ${offset + 240} S 1220 ${offset + 180}, 1560 ${offset - 40}`} />;
      })}
    </svg>
    <svg className="contact-threads contact-threads-weft" viewBox="0 0 1440 640" preserveAspectRatio="xMidYMid slice" fill="none">
      {Array.from({ length: 26 }, (_, i) => {
        const offset = i * 36 - 360;
        return <path key={i} d={`M -120 ${offset - 100} C 300 ${offset - 40}, 480 ${offset + 420}, 860 ${offset + 380} S 1240 ${offset + 540}, 1560 ${offset + 720}`} />;
      })}
    </svg>
  </div>;
}
