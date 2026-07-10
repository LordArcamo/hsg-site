import { useEffect, useState } from 'react';

const PILLARS = [
  { label: 'Strategy', color: '#48a536' },
  { label: 'Leadership', color: '#159bd8' },
  { label: 'Hiring', color: '#5b3296' },
  { label: 'HR', color: '#ff6a28' },
  { label: 'Careers', color: '#e8af08' },
];

const INTERVAL_MS = 2200;

/** Hero image badge: dots pulse in sync with a rotating pillar word. */
export default function RotatingBadge() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const id = window.setInterval(() => setIndex((i) => (i + 1) % PILLARS.length), INTERVAL_MS);
    return () => window.clearInterval(id);
  }, []);

  const current = PILLARS[index];

  return (
    <div className="hv-badge">
      <span className="dots">
        {PILLARS.map((p, i) => (
          <i
            key={p.label}
            style={{
              background: p.color,
              opacity: i === index ? 1 : 0.32,
              transform: i === index ? 'scale(1.35)' : 'scale(1)',
            }}
          />
        ))}
      </span>
      <span>
        Advising on <b key={current.label} style={{ color: current.color }}>{current.label}</b>
      </span>
    </div>
  );
}
