import { useEffect, useRef, useState } from 'react';
import type { CSSProperties } from 'react';

const STEPS = [
  { num: '01', label: 'Strategy', color: 'var(--green)' },
  { num: '02', label: 'Leadership', color: 'var(--blue)' },
  { num: '03', label: 'Talent', color: 'var(--purple)' },
  { num: '04', label: 'Culture', color: 'var(--orange)' },
  { num: '05', label: 'Growth', color: 'var(--gold)' },
];

/** Connected-challenges timeline: gradient line fills and steps light up as you scroll. */
export default function Timeline() {
  const rootRef = useRef<HTMLDivElement>(null);
  const fillRef = useRef<HTMLSpanElement>(null);
  const [inView, setInView] = useState(false);
  const [activeCount, setActiveCount] = useState(0);

  useEffect(() => {
    const root = rootRef.current;
    const fill = fillRef.current;
    if (!root || !fill) return;

    const io = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' }
    );
    io.observe(root);

    const steps = Array.from(root.querySelectorAll<HTMLElement>('.timeline-step'));
    const update = () => {
      const rect = root.getBoundingClientRect();
      const vh = window.innerHeight;
      const start = vh * 0.72;
      const end = vh * 0.3;
      const span = rect.height - (start - end);
      let progress = span > 0 ? (start - rect.top) / span : rect.top < start ? 1 : 0;
      progress = Math.max(0, Math.min(1, progress));
      fill.style.height = `${progress * 100}%`;
      setActiveCount(steps.filter((s) => s.getBoundingClientRect().top < vh * 0.6).length);
    };

    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => {
      io.disconnect();
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, []);

  return (
    <div ref={rootRef} className={inView ? 'timeline in' : 'timeline'}>
      <span className="tl-line">
        <span ref={fillRef} className="tl-line-fill" />
      </span>
      {STEPS.map((step, i) => (
        <div
          key={step.num}
          className={i < activeCount ? 'timeline-step on' : 'timeline-step'}
          style={{ '--step-color': step.color } as CSSProperties}
        >
          <span className="st-num">{step.num}</span>
          <span className="st-dot" />
          <strong>{step.label}</strong>
        </div>
      ))}
    </div>
  );
}
