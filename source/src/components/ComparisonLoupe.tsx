import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useReactCompareSliderContext } from 'react-compare-slider';
import './ComparisonLoupe.css';

export default function ComparisonLoupe({ src, label, hint }: { src: string; label: string; hint: string }) {
  const { rootRef, isDragging } = useReactCompareSliderContext();
  const [root, setRoot] = useState<HTMLDivElement | null>(null);
  const [pinned, setPinned] = useState(false);
  const lensRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<HTMLDivElement>(null);
  const point = useRef({ x: .55, y: .72 });
  useLayoutEffect(() => setRoot(rootRef.current), [rootRef]);

  const show = (x: number, y: number) => {
    const lens = lensRef.current;
    const scene = sceneRef.current;
    if (!root || !lens || !scene) return;
    const { width, height } = root.getBoundingClientRect();
    const size = Math.min(width < 600 ? 96 : 120, width, height);
    const zoom = 2.5;
    x = Math.max(0, Math.min(width, x));
    y = Math.max(0, Math.min(height, y));
    point.current = { x: x / width, y: y / height };
    lens.style.width = lens.style.height = `${size}px`;
    lens.style.left = `${Math.max(0, Math.min(width - size, x - size / 2))}px`;
    lens.style.top = `${Math.max(0, Math.min(height - size, y - size / 2))}px`;
    scene.style.width = `${width * zoom}px`;
    scene.style.height = `${height * zoom}px`;
    scene.style.transform = `translate(${size / 2 - x * zoom}px, ${size / 2 - y * zoom}px)`;
    lens.dataset.active = 'true';
  };
  const hide = () => { if (lensRef.current) lensRef.current.dataset.active = 'false'; };
  const showCurrent = () => {
    if (!root) return;
    const bounds = root.getBoundingClientRect();
    show(point.current.x * bounds.width, point.current.y * bounds.height);
  };

  useEffect(() => {
    if (!root) return;
    const attributes = { tabindex: '0', role: 'group', 'aria-label': label, 'aria-description': hint, 'aria-keyshortcuts': 'Enter Space Escape' };
    const previous = Object.keys(attributes).map(name => [name, root.getAttribute(name)] as const);
    Object.entries(attributes).forEach(([name, value]) => root.setAttribute(name, value));
    return () => previous.forEach(([name, value]) => value === null ? root.removeAttribute(name) : root.setAttribute(name, value));
  }, [root, label, hint]);

  useEffect(() => {
    if (!root) return;
    if (isDragging) hide();
    else if (pinned) showCurrent();
    const isControl = (event: PointerEvent) => (event.target as Element).closest('[data-rcs="handle-root"]');
    const move = (event: PointerEvent) => {
      if (isDragging || isControl(event)) { hide(); return; }
      if (event.pointerType === 'touch' && !pinned) return;
      const bounds = root.getBoundingClientRect();
      show(event.clientX - bounds.left, event.clientY - bounds.top);
    };
    const down = (event: PointerEvent) => {
      if (isControl(event)) { hide(); return; }
      if (event.pointerType === 'touch') {
        const bounds = root.getBoundingClientRect();
        if (pinned) hide();
        else show(event.clientX - bounds.left, event.clientY - bounds.top);
        setPinned(!pinned);
      }
    };
    const leave = () => { if (!pinned) hide(); };
    const cancel = () => { hide(); setPinned(false); };
    const keydown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') { cancel(); return; }
      if (event.target !== root) return;
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        if (pinned) hide(); else showCurrent();
        setPinned(!pinned);
        return;
      }
      if (!pinned || !['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(event.key)) return;
      event.preventDefault();
      const { width, height } = root.getBoundingClientRect();
      show(point.current.x * width + (event.key === 'ArrowRight' ? 16 : event.key === 'ArrowLeft' ? -16 : 0),
        point.current.y * height + (event.key === 'ArrowDown' ? 16 : event.key === 'ArrowUp' ? -16 : 0));
    };
    const resize = new ResizeObserver(() => { if (pinned) showCurrent(); else hide(); });
    resize.observe(root);
    root.addEventListener('pointermove', move, { passive: true });
    root.addEventListener('pointerdown', down, true);
    root.addEventListener('pointerleave', leave);
    root.addEventListener('pointercancel', cancel);
    root.addEventListener('keydown', keydown);
    return () => {
      resize.disconnect();
      root.removeEventListener('pointermove', move);
      root.removeEventListener('pointerdown', down, true);
      root.removeEventListener('pointerleave', leave);
      root.removeEventListener('pointercancel', cancel);
      root.removeEventListener('keydown', keydown);
    };
  }, [root, pinned, isDragging]);

  if (!root) return null;
  return createPortal(
    <div className="comparison-lens" ref={lensRef} aria-hidden="true" data-active="false">
      <div className="comparison-lens-scene" ref={sceneRef}>
        <div className="comparison-image"><img src={src} alt="" draggable={false} /></div>
        <div className="comparison-image dirty"><img src={src} alt="" draggable={false} /></div>
      </div>
    </div>, root);
}
