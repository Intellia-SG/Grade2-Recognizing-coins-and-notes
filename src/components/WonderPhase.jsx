import { useState, useEffect, useCallback, useRef } from 'react';
import { narrate, stopNarration } from '../utils/audio';
import { wonderNarration, wonderDiscoverNarration } from '../utils/narration';

const WONDER_QUESTIONS = [
  {
    question: "Why do different coins have different sizes and colors? Is a bigger coin always worth more?",
    subtext: "Sometimes small coins are worth more than big ones! Let's find out why!",
    emoji: "🪙",
    bgEmojis: ["🪙", "💰", "✨", "🌲"],
  },
  {
    question: "Why does paper money have faces of famous people on them? What do they mean?",
    subtext: "Banknotes are full of secret pictures, colors, and numbers that tell us their value!",
    emoji: "💵",
    bgEmojis: ["💵", "🏰", "✨", "🦉"],
  },
  {
    question: "If you have 4 quarters and a 1-dollar bill, which one is worth more?",
    subtext: "Surprisingly, they are worth the exact same amount! That's equivalent value!",
    emoji: "⚖️",
    bgEmojis: ["⚖️", "🪙", "💵", "✨"],
  },
  {
    question: "How does a shopkeeper know you've given the right amount of money to buy a toy?",
    subtext: "Counting and adding up coins and notes lets us make transactions in daily life!",
    emoji: "🛒",
    bgEmojis: ["🛒", "🧸", "🏷️", "✨"],
  },
];

export default function WonderPhase({ onComplete, audioEnabled }) {
  const [wonder] = useState(() => WONDER_QUESTIONS[Math.floor(Math.random() * WONDER_QUESTIONS.length)]);
  const [stage, setStage] = useState(0);
  const [particles, setParticles] = useState([]);
  const narrationRef = useRef(null);
  // Guard ref — prevents onComplete from firing more than once
  const calledRef = useRef(false);

  useEffect(() => {
    calledRef.current = false;
    const p = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      emoji: wonder.bgEmojis[i % wonder.bgEmojis.length],
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 5,
      duration: 8 + Math.random() * 12,
      size: 1.2 + Math.random() * 1.5,
    }));
    setParticles(p);
  }, [wonder]);

  useEffect(() => {
    const t1 = setTimeout(() => setStage(1), 300);
    const t2 = setTimeout(() => setStage(2), 1200);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  useEffect(() => {
    if (stage === 1 && audioEnabled) {
      narrationRef.current = narrate(
        wonderNarration(wonder.question, wonder.subtext),
        true
      );
    }
    return () => { narrationRef.current?.cancel(); };
  }, [stage, wonder.question, wonder.subtext, audioEnabled]);

  const handleDiscover = useCallback(() => {
    narrationRef.current?.cancel();
    stopNarration();

    // Only call onComplete ONCE — whichever fires first (audio resolve or timeout)
    const done = () => {
      if (!calledRef.current) {
        calledRef.current = true;
        onComplete();
      }
    };

    if (audioEnabled) {
      const n = narrate(wonderDiscoverNarration(), true);
      n.promise.then(done);
      // Safety fallback in case audio is slow or blocked
      setTimeout(done, 2500);
    } else {
      setTimeout(done, 400);
    }
  }, [onComplete, audioEnabled]);

  return (
    <div className="wonder-phase">
      <div className="wonder-particles">
        {particles.map(p => (
          <span key={p.id} className="wonder-particle" style={{
            left: `${p.x}%`, top: `${p.y}%`,
            animationDelay: `${p.delay}s`, animationDuration: `${p.duration}s`,
            fontSize: `${p.size}rem`,
          }}>{p.emoji}</span>
        ))}
      </div>
      <div className="wonder-content">
        <div className={`wonder-qmark ${stage >= 1 ? 'revealed' : ''}`}>
          <span className="wonder-qmark-icon">?</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, opacity: stage >= 1 ? 1 : 0, transition: 'opacity 0.5s ease' }}>
          <div className="mascot">🦉</div>
          <div className="speech-bubble" style={{ color: '#0f172a' }}>Hmm... I wonder... 🤔</div>
        </div>
        <div className={`wonder-question-card ${stage >= 1 ? 'visible' : ''}`}>
          <div className="wonder-emoji">{wonder.emoji}</div>
          <h2 className="wonder-question-text">{wonder.question}</h2>
          <p className="wonder-subtext">{wonder.subtext}</p>
        </div>
        <button
          className={`btn btn-wonder ${stage >= 2 ? 'visible' : ''}`}
          onClick={handleDiscover}
          id="discover-btn"
        >
          <span>✨</span>
          Let's Discover!
          <span>✨</span>
        </button>
      </div>
    </div>
  );
}
