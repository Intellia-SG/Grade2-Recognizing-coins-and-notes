import { useEffect, useRef } from 'react';
import { narrate, stopNarration } from '../utils/audio';
import { introNarration } from '../utils/narration';

const JOURNEY_CARDS = [
  { icon: '🤔', title: 'Wonder', sub: 'A money mystery!' },
  { icon: '📖', title: 'Story', sub: 'Find the lost coins' },
  { icon: '🧪', title: 'Simulate', sub: 'Inspect & count cash' },
  { icon: '🎮', title: 'Practice', sub: '6 gamified worlds' },
  { icon: '📓', title: 'Reflect', sub: 'Quiz & review' },
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
      {/* Grade Badge */}
      <div className="intro-badge">
        ✨ Grade 2 Math
      </div>

      {/* Main Glowing Title */}
      <h1 className="intro-title">
        Coins and Notes
      </h1>

      {/* Subtitle */}
      <p className="intro-subtitle">
        Recognizing, Comparing & Counting Money!
      </p>

      {/* Intro Description Banner */}
      <div className="intro-banner-box">
        Let's help <strong style={{ color: 'var(--gold)' }}>Wei Ming</strong> master recognizing coins, dollar bills, comparing values, and counting money! 🪙
      </div>

      {/* 5 Phase Cards Grid */}
      <div className="intro-journey-grid">
        {JOURNEY_CARDS.map((card, i) => (
          <div key={i} className="journey-card">
            <div className="journey-card-icon">{card.icon}</div>
            <div className="journey-card-title">{card.title}</div>
            <div className="journey-card-sub">{card.sub}</div>
          </div>
        ))}
      </div>

      {/* CTA Button */}
      <button className="intro-start-btn" onClick={handleStart} id="start-journey-btn">
        🚀 Begin Your Journey!
      </button>

      {/* Bottom Feature Tags */}
      <div className="intro-tags-row">
        <div className="tag-item">🎯 60 Questions</div>
        <div className="tag-item">🪙 Coins & Notes</div>
        <div className="tag-item">🏆 Badges & XP</div>
      </div>
    </div>
  );
}
