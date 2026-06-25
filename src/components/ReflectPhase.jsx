import { useState, useEffect, useCallback, useRef } from 'react';
import { narrate, stopNarration, sounds } from '../utils/audio';
import { reflectIntroNarration, reflectCorrectNarration, reflectWrongNarration, reflectConfidenceNarration, reflectCertificateNarration } from '../utils/narration';

const REFLECT_QUESTIONS = [
  {
    id: 'r_q1',
    question: "Professor Moneybag is confused! He asks: Is a larger coin always worth more than a smaller coin?",
    options: [
      "Yes, because bigger things are always worth more.",
      "No, because a Dime is smaller than a Nickel but is worth more!",
      "Yes, because silver is heavier than copper."
    ],
    correctAnswer: "No, because a Dime is smaller than a Nickel but is worth more!",
    explanation: "A dime is worth 10 cents, which is more than a nickel's 5 cents, even though the dime is smaller!"
  },
  {
    id: 'r_q2',
    question: "Professor Moneybag asks: If you have one $5 bill, which coin collection has the same value?",
    options: [
      "500 pennies!",
      "5 dimes",
      "2 quarters"
    ],
    correctAnswer: "500 pennies!",
    explanation: "Since 1 dollar equals 100 pennies, a 5-dollar bill is worth exactly 500 pennies!"
  },
  {
    id: 'r_q3',
    question: "Professor Moneybag asks: If you buy a toy balloon for 40¢ and pay with a 50¢ coin, what is your change?",
    options: [
      "1 nickel (5¢)",
      "1 dime (10¢)",
      "1 quarter (25¢)"
    ],
    correctAnswer: "1 dime (10¢)",
    explanation: "50 cents minus 40 cents leaves 10 cents of change, which is exactly 1 dime!"
  }
];

export default function ReflectPhase({ onComplete, audioEnabled, sessionData = {} }) {
  const [step, setStep] = useState('teach'); // teach, confidence, certificate
  const [qIdx, setQIdx] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState(null);
  const [answered, setAnswered] = useState(false);
  const [teachCorrect, setTeachCorrect] = useState(0);
  const [confidence, setConfidence] = useState(null);
  const [confetti, setConfetti] = useState([]);
  const narrationRef = useRef(null);

  const q = REFLECT_QUESTIONS[qIdx];
  const { score = 0, totalAnswered = 0, xp = 0 } = sessionData;
  const pct = totalAnswered > 0 ? (score / totalAnswered) * 100 : 0;

  // Teach Mascot Narration
  useEffect(() => {
    if (step === 'teach' && audioEnabled && q) {
      narrationRef.current = narrate(reflectIntroNarration(), true);
    }
    return () => { narrationRef.current?.cancel(); };
  }, [step, qIdx, audioEnabled, q]);

  // Confidence Narration
  useEffect(() => {
    if (step === 'confidence' && audioEnabled) {
      narrationRef.current = narrate(reflectConfidenceNarration(), true);
    }
    return () => { narrationRef.current?.cancel(); };
  }, [step, audioEnabled]);

  // Certificate Narration & Confetti
  useEffect(() => {
    if (step === 'certificate') {
      // Confetti generation
      const items = Array.from({ length: 50 }, (_, i) => ({
        id: i,
        color: ['#ff5b79', '#ffb800', '#22c55e', '#38bdf8', '#a855f7'][i % 5],
        left: `${Math.random() * 100}%`,
        delay: `${Math.random() * 3}s`,
        duration: `${2 + Math.random() * 3}s`,
        size: `${5 + Math.random() * 10}px`,
        shape: i % 2 === 0 ? '50%' : '0%',
      }));
      setConfetti(items);

      if (audioEnabled) {
        narrationRef.current = narrate(reflectCertificateNarration(pct), true);
      }
    }
    return () => { narrationRef.current?.cancel(); };
  }, [step, pct, audioEnabled]);

  const handleTeachAnswer = useCallback((opt) => {
    if (answered) return;
    setAnswered(true);
    setSelectedOpt(opt);
    const correct = opt === q.correctAnswer;

    if (correct) {
      sounds.correct();
      setTeachCorrect(c => c + 1);
      if (audioEnabled) {
        narrationRef.current = narrate(reflectCorrectNarration(), true);
      }
    } else {
      sounds.wrong();
      if (audioEnabled) {
        narrationRef.current = narrate(reflectWrongNarration(), true);
      }
    }

    setTimeout(() => {
      setSelectedOpt(null);
      setAnswered(false);
      if (qIdx + 1 < REFLECT_QUESTIONS.length) {
        setQIdx(i => i + 1);
      } else {
        setStep('confidence');
      }
    }, 2800);
  }, [answered, qIdx, q, audioEnabled]);

  const handleConfidence = useCallback((level) => {
    sounds.click();
    setConfidence(level);
    setTimeout(() => {
      setStep('certificate');
    }, 600);
  }, []);

  const getStars = () => {
    if (pct >= 90) return 3;
    if (pct >= 70) return 2;
    if (pct >= 50) return 1;
    return 0;
  };

  // Render sub-components
  if (step === 'teach') {
    return (
      <div className="reflect-phase">
        <div className="reflect-header">
          <h3 className="reflect-label">📓 Reflect — Teach the Mascot</h3>
          <p className="reflect-sublabel">Help Professor Moneybag understand what you learned!</p>
        </div>
        <div className="reflect-card">
          <div className="reflect-mascot-row">
            <div className="mascot">🦉</div>
            <div className="speech-bubble" style={{ fontSize: '0.85rem', padding: '10px 16px', color: '#0f172a' }}>
              {q.question}
            </div>
          </div>
          <div className="reflect-options">
            {q.options.map((opt, i) => {
              let cls = 'reflect-option';
              if (selectedOpt === opt) {
                cls += opt === q.correctAnswer ? ' correct' : ' wrong';
              } else if (answered && opt === q.correctAnswer) {
                cls += ' correct';
              }
              return (
                <button
                  key={i}
                  className={cls}
                  onClick={() => handleTeachAnswer(opt)}
                  disabled={answered}
                >
                  <span className="reflect-option-emoji">{i === 0 ? '🅰️' : i === 1 ? '🅱️' : '🆃'}</span>
                  {opt}
                </button>
              );
            })}
          </div>
          <div className="reflect-progress">
            {REFLECT_QUESTIONS.map((_, i) => (
              <div key={i} className={`reflect-dot ${i === qIdx ? 'active' : i < qIdx ? 'done' : ''}`} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (step === 'confidence') {
    return (
      <div className="reflect-phase">
        <div className="reflect-header">
          <h3 className="reflect-label">📓 Reflect — Self Check</h3>
          <p className="reflect-sublabel">How do you feel about recognizing and counting money now?</p>
        </div>
        <div className="reflect-card" style={{ maxWidth: 500 }}>
          <h2 className="reflect-card-title">My Confidence Level</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: 24, fontSize: '0.9rem' }}>
            Professor Moneybag wants to know how money master you feel!
          </p>
          <div className="confidence-grid">
            <button
              className={`confidence-btn ${confidence === 'low' ? 'selected' : ''}`}
              onClick={() => handleConfidence('low')}
              style={{ '--conf-color': 'var(--coral)' }}
            >
              <span className="confidence-emoji">😕</span>
              <span className="confidence-label">Need Practice</span>
            </button>
            <button
              className={`confidence-btn ${confidence === 'mid' ? 'selected' : ''}`}
              onClick={() => handleConfidence('mid')}
              style={{ '--conf-color': 'var(--gold)' }}
            >
              <span className="confidence-emoji">🙂</span>
              <span className="confidence-label">Getting There</span>
            </button>
            <button
              className={`confidence-btn ${confidence === 'high' ? 'selected' : ''}`}
              onClick={() => handleConfidence('high')}
              style={{ '--conf-color': 'var(--green-light)' }}
            >
              <span className="confidence-emoji">😎</span>
              <span className="confidence-label">Money Master!</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Certificate Phase
  const stars = getStars();
  return (
    <div className="reflect-phase" style={{ padding: '24px 16px' }}>
      <div className="confetti-container">
        {confetti.map(c => (
          <div
            key={c.id}
            className="confetti-piece"
            style={{
              left: c.left,
              backgroundColor: c.color,
              animationDelay: c.delay,
              animationDuration: c.duration,
              width: c.size,
              height: c.size,
              borderRadius: c.shape,
            }}
          />
        ))}
      </div>
      <div className="certificate-card">
        <div className="cert-badge">🏆</div>
        <h2 className="cert-title">Master Treasurer</h2>
        <p className="cert-subtitle">Certificate of Completion</p>

        <div className="score-circle">
          <span className="score-number">{Math.round(pct)}%</span>
          <span className="score-label">accuracy</span>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', gap: 10, margin: '12px 0', fontSize: '2rem' }}>
          {[1, 2, 3].map(s => (
            <span key={s} style={{ opacity: s <= stars ? 1 : 0.15, filter: s <= stars ? 'drop-shadow(0 0 6px var(--gold))' : 'none' }}>⭐</span>
          ))}
        </div>

        <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', margin: '12px 0' }}>
          This certifies that you have successfully completed the <strong>Treasure Market Adventure</strong> currency challenges!
        </p>

        <div className="cert-stats">
          <div className="cert-stat">
            <span className="cert-stat-value" style={{ color: 'var(--gold)' }}>{xp}</span>
            <span className="cert-stat-label">Total XP</span>
          </div>
          <div className="cert-stat">
            <span className="cert-stat-value" style={{ color: 'var(--blue-light)' }}>{score}</span>
            <span className="cert-stat-label">Correct</span>
          </div>
          <div className="cert-stat">
            <span className="cert-stat-value" style={{ color: 'var(--purple-light)' }}>{totalAnswered}</span>
            <span className="cert-stat-label">Questions</span>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginTop: 16 }}>
          <button className="btn btn-primary" onClick={onComplete}>
            🔄 Play Again
          </button>
          <button className="btn btn-outline" onClick={() => window.print()} style={{ fontSize: '0.85rem' }}>
            🖨️ Print Cert
          </button>
        </div>
      </div>
    </div>
  );
}
