import { useMemo } from 'react';

const COUNT = 25;
const ITEMS = ['🪙', '💵', '💰', '💳', '$', '¢', '🏦', '🛍️', '🛒', '💎', '⭐'];

export default function FloatingNumbers() {
  const items = useMemo(() =>
    Array.from({ length: COUNT }, (_, i) => ({
      value: ITEMS[i % ITEMS.length],
      left: `${Math.random() * 100}%`,
      delay: `${Math.random() * 20}s`,
      duration: `${20 + Math.random() * 20}s`,
      size: `${1.2 + Math.random() * 2.2}rem`,
    })), []);

  return (
    <>
      <style>{`
        .floating-numbers {
          position: fixed;
          inset: 0;
          pointer-events: none;
          z-index: 0;
          overflow: hidden;
        }
        .floating-shape {
          position: absolute;
          bottom: -100px;
          opacity: 0;
          animation: floatAround linear infinite;
          user-select: none;
        }
        @keyframes floatAround {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 0;
          }
          10% {
            opacity: 0.12;
          }
          90% {
            opacity: 0.12;
          }
          100% {
            transform: translateY(-110vh) rotate(360deg);
            opacity: 0;
          }
        }
      `}</style>
      <div className="floating-numbers">
        {items.map((s, i) => (
          <span key={i} className="floating-shape" style={{
            left: s.left,
            animationDelay: s.delay,
            animationDuration: s.duration,
            fontSize: s.size,
          }}>
            {s.value}
          </span>
        ))}
      </div>
    </>
  );
}
