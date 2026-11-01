import { useEffect } from 'react';
import { useReactCompareSliderContext } from 'react-compare-slider';

/** Move the existing slider through its API, without rendering React every frame. */
export function useComparisonAutoplay() {
  const { rootRef, position, setPosition } = useReactCompareSliderContext();

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let visible = false;
    let hovering = false;
    let focused = false;
    let dragging = false;
    let resumeAt = 0;
    let direction = 1;
    let timer: ReturnType<typeof setTimeout> | undefined;
    let previous = 0;

    const schedule = () => {
      clearTimeout(timer);
      if (!visible || document.hidden || motion.matches || hovering || focused || dragging) return;
      previous = performance.now();
      timer = setTimeout(tick, Math.max(40, resumeAt - previous));
    };
    const tick = () => {
      const now = performance.now();
      // Four percentage points per second: fifteen seconds from 20% to 80%.
      const current = position.current ?? 50;
      if (current >= 80) direction = -1;
      if (current <= 20) direction = 1;
      const next = current + direction * Math.min(now - previous, 100) * .004;
      setPosition(direction > 0 ? Math.min(80, next) : Math.max(20, next));
      schedule();
    };
    const idle = () => { resumeAt = performance.now() + 5000; schedule(); };
    const enter = (event: PointerEvent) => { if (event.pointerType === 'mouse') { hovering = true; schedule(); } };
    const leave = () => { hovering = false; idle(); };
    const down = () => { dragging = true; schedule(); };
    const up = () => { if (dragging) { dragging = false; idle(); } };
    const focus = () => { focused = true; schedule(); };
    const blur = (event: FocusEvent) => { focused = root.contains(event.relatedTarget as Node | null); idle(); };
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; schedule(); }, { threshold: .1 });
    observer.observe(root);
    root.addEventListener('pointerenter', enter);
    root.addEventListener('pointerleave', leave);
    root.addEventListener('pointerdown', down, true);
    root.addEventListener('focusin', focus);
    root.addEventListener('focusout', blur);
    window.addEventListener('pointerup', up);
    window.addEventListener('pointercancel', up);
    document.addEventListener('visibilitychange', schedule);
    motion.addEventListener('change', schedule);
    return () => {
      clearTimeout(timer);
      observer.disconnect();
      root.removeEventListener('pointerenter', enter);
      root.removeEventListener('pointerleave', leave);
      root.removeEventListener('pointerdown', down, true);
      root.removeEventListener('focusin', focus);
      root.removeEventListener('focusout', blur);
      window.removeEventListener('pointerup', up);
      window.removeEventListener('pointercancel', up);
      document.removeEventListener('visibilitychange', schedule);
      motion.removeEventListener('change', schedule);
    };
  }, [rootRef, position, setPosition]);
}
