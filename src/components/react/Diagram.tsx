import { useEffect, useRef, useState } from 'react';
import type { CSSProperties } from 'react';

const DISCIPLINES = [
  { label: ['Business', 'Strategy'], color: '#48a536' },
  { label: ['Leadership'], color: '#159bd8' },
  { label: ['Executive', 'Talent'], color: '#5b3296' },
  { label: ['HR & Org'], color: '#ff6a28' },
  { label: ['Executive', 'Careers'], color: '#e8af08' },
];

const CX = 200;
const CY = 200;
const R = 138;
const CYCLE_MS = 2600;

const NODES = DISCIPLINES.map((d, i) => {
  const angle = -Math.PI / 2 + i * ((2 * Math.PI) / DISCIPLINES.length);
  return { ...d, x: CX + R * Math.cos(angle), y: CY + R * Math.sin(angle) };
});

/**
 * The Schlager Advisory System™ hub diagram. Edges draw in when scrolled into
 * view, an idle "tour" highlights each discipline in turn, and hovering a
 * discipline dims the others and lights up its connection.
 */
export default function Diagram() {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  const [hovered, setHovered] = useState<number | null>(null);
  const [auto, setAuto] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // idle tour: cycle the highlight until the visitor takes over with hover
  useEffect(() => {
    if (!inView || hovered !== null) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const id = window.setInterval(() => setAuto((i) => (i + 1) % NODES.length), CYCLE_MS);
    return () => window.clearInterval(id);
  }, [inView, hovered]);

  const active = hovered ?? (inView ? auto : null);
  const rootClass = ['diagram', inView && 'in', hovered !== null && 'dim'].filter(Boolean).join(' ');

  return (
    <div ref={ref} className={rootClass} aria-hidden="true">
      <svg viewBox="0 0 400 400">
        <g>
          {NODES.map((node, i) => (
            <line
              key={node.label.join(' ')}
              className={active === i ? 'edge on' : 'edge'}
              x1={CX}
              y1={CY}
              x2={node.x}
              y2={node.y}
              stroke={node.color}
              style={{ '--len': String(Math.hypot(node.x - CX, node.y - CY)) } as CSSProperties}
            />
          ))}
        </g>
        <g>
          <circle className="hub-ring" cx={CX} cy={CY} r={52} />
          <circle className="hubc" cx={CX} cy={CY} r={44} />
          <text className="hubt" x={CX} y={CY - 2}>Better</text>
          <text className="hubt" x={CX} y={CY + 10}>Decisions</text>
          {NODES.map((node, i) => (
            <g
              key={node.label.join(' ')}
              className={active === i ? 'node-g on' : 'node-g'}
              style={{ '--fi': String(i) } as CSSProperties}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
            >
              <circle className="nodec" cx={node.x} cy={node.y} r={36} stroke={node.color} />
              {node.label.map((line, idx) => (
                <text
                  key={line}
                  className="nodet"
                  x={node.x}
                  y={node.y + 3 + (idx - (node.label.length - 1) / 2) * 10.5}
                >
                  {line}
                </text>
              ))}
            </g>
          ))}
        </g>
      </svg>
    </div>
  );
}
