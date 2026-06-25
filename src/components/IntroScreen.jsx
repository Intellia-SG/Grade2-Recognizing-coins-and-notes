import { useEffect, useRef } from 'react';
import { narrate, stopNarration } from '../utils/audio';
import { introNarration } from '../utils/narration';

const JOURNEY_PHASES = [
  { icon: '🔍', label: 'Wonder', desc: 'A money mystery!' },
  { icon: '📖', label: 'Story', desc: 'Find the lost coins' },
  { icon: '🧪', label: 'Simulate', desc: 'Inspect & count cash' },
  { icon: '🎮', label: 'Play', desc: 'Six gamified worlds' },
  { icon: '📓', label: 'Reflect', desc: "Review what you've learned" },
];

export default function IntroScreen({ onStart, audioEnabled }) {
  const narrationRef = useRef(null);

  useEffect(() => {
    if (audioEnabled) {
      const timer = setTimeout(() => {
        narrationRef.current = narrate(introNarration(), true);
      }, 200);
      return () => {
        clearTimeout(timer);
        narrationRef.current?.cancel();
        stopNarration();
      };
    }
  }, [audioEnabled]);

  const handleStart = () => {
    narrationRef.current?.cancel();
    stopNarration();
    onStart();
  };

  return (
    <div className="intro-screen">
      {/* Curriculum badge */}
      <div className="intro-badge">
        ✨  · Grade 2 Maths
      </div>

      {/* Title */}
      <h1 className="intro-title">
        <span style={{ color: 'var(--green-light)' }}>Recognizing Coins and Notes</span>
      </h1>
      <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', marginTop: 6, fontFamily: 'var(--font-display)' }}>
        The Treasure Market Adventure · Grade 2 Maths
      </p>

      {/* Mascot */}
      <div className="mascot-container">
        <div className="mascot">🦉</div>
        <div className="speech-bubble">
          Let's find the lost coins and restore the Royal Treasury! 🪙
        </div>
      </div>

      {/* Description */}
      <p className="intro-desc">
        Help <strong style={{ color: 'var(--gold)' }}>Professor Moneybag</strong> and the Treasury Adventurers find the lost money scattered by a mysterious storm across six magical worlds!
      </p>

      {/* Journey map */}
      <div className="intro-journey-map">
        <h3 className="intro-journey-title">Your Learning Journey</h3>
        <div className="intro-journey-steps">
          {JOURNEY_PHASES.map((p, i) => (
            <div key={i} className="intro-journey-step">
              <div className="intro-journey-icon">{p.icon}</div>
              <div className="intro-journey-info">
                <div className="intro-journey-label">{p.label}</div>
                <div className="intro-journey-desc">{p.desc}</div>
              </div>
              {i < JOURNEY_PHASES.length - 1 && <div className="intro-journey-arrow">→</div>}
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <button className="btn btn-primary btn-lg intro-start-btn" onClick={handleStart} id="start-journey-btn">
        🚀 Begin Your Journey!
      </button>

      {/* Feature cards */}
      <div className="feature-cards">
        <div className="feature-card">
          <div className="feature-card-icon">🗺️</div>
          <div className="feature-card-label">6 Magical Worlds</div>
        </div>
        <div className="feature-card">
          <div className="feature-card-icon">🪙</div>
          <div className="feature-card-label">Coins & Notes</div>
        </div>
        <div className="feature-card">
          <div className="feature-card-icon">✨</div>
          <div className="feature-card-label">Badges & XP</div>
        </div>
      </div>
    </div>
  );
}
