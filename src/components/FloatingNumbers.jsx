import { useMemo } from 'react';

const COUNT = 30;
const ITEMS = ['25¢', '10¢', '5¢', '1¢', '$1', '$5', '$10', '$20', '$50', '$100', '100', '200', '50', '25', '10', '5'];

export default function FloatingNumbers() {
  const items = useMemo(() =>
    Array.from({ length: COUNT }, (_, i) => ({
      value: ITEMS[i % ITEMS.length],
      left: `${Math.random() * 95}%`,
      delay: `${Math.random() * 20}s`,
      duration: `${25 + Math.random() * 20}s`,
      size: `${1.5 + Math.random() * 2.5}rem`,
      rotation: `${-25 + Math.random() * 50}deg`,
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
          color: rgba(90, 105, 180, 0.12);
          font-family: var(--font-display);
          font-weight: 900;
          animation: floatAround linear infinite;
          user-select: none;
        }
        @keyframes floatAround {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 0;
          }
          15% {
            opacity: 0.15;
          }
          85% {
            opacity: 0.15;
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
            transform: `rotate(${s.rotation})`,
          }}>
            {s.value}
          </span>
        ))}
      </div>
    </>
  );
}
