import { useEffect, useLayoutEffect, useRef } from 'react';
import './AnimatedPrice.css';

const offset = (digit: number) => `translateY(-${digit * 1.2}em)`;

function RollingDigit({ digit, value }: { digit: number; value: number }) {
  const reel = useRef<HTMLSpanElement>(null);
  const previous = useRef(0);
  const previousValue = useRef(value);
  const animation = useRef<Animation | null>(null);

  useLayoutEffect(() => {
    const element = reel.current;
    if (!element) return;
    const interrupted = !!animation.current;
    const from = interrupted ? getComputedStyle(element).transform : offset(10 + previous.current);
    animation.current?.cancel();
    animation.current = null;
    element.style.transform = offset(10 + digit);
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || (!interrupted && digit === previous.current && value === previousValue.current)) {
      previous.current = digit;
      previousValue.current = value;
      return;
    }
    const target = (digit <= previous.current ? 20 : 10) + digit;
    const running = element.animate([{ transform: from }, { transform: offset(target) }], {
      duration: 720,
      easing: 'cubic-bezier(.22,1,.36,1)',
    });
    animation.current = running;
    running.onfinish = () => { previous.current = digit; previousValue.current = value; animation.current = null; };
  }, [digit, value]);

  useEffect(() => () => { animation.current?.cancel(); animation.current = null; }, []);
  return <span className="price-digit"><span className="price-digit-reel" ref={reel}>{Array.from({ length: 30 }, (_, i) => <span key={i}>{i % 10}</span>)}</span></span>;
}

export default function AnimatedPrice({ value }: { value: number }) {
  const formatted = value.toLocaleString('ru-RU');
  return <output className="total-price" aria-live="polite" aria-atomic="true">
    <span className="sr-only">{formatted} ₽</span>
    <span className="price-value" aria-hidden="true">{[...formatted].map((character, i) => /\d/.test(character)
      ? <RollingDigit key={formatted.length - i} digit={Number(character)} value={value} />
      : <span key={`space-${formatted.length - i}`}>{character}</span>)}<span>&nbsp;₽</span></span>
  </output>;
}
