import { useState, useEffect, useCallback, useRef } from 'react';
import { narrate, stopNarration, sounds, speak } from '../utils/audio';
import { reflectIntroNarration, reflectCorrectNarration, reflectWrongNarration, reflectConfidenceNarration, reflectCertificateNarration } from '../utils/narration';
import { FormattedText } from './QuestionRenderer';

const REFLECT_QUESTIONS = [
  {
    id: 'r_q1',
    question: "Professor Moneybag is confused! He asks **Wei Ming**: Is a larger coin always worth more than a smaller coin?",
    options: [
      "Yes, because bigger things are always worth more.",
      "No, because a **Dime** is smaller than a Nickel but is worth more!",
      "Yes, because silver is heavier than copper."
    ],
    correctAnswer: "No, because a **Dime** is smaller than a Nickel but is worth more!",
    explanation: "A dime is worth **10 cents**, which is more than a nickel's **5 cents**, even though the dime is smaller!"
  },
  {
    id: 'r_q2',
    question: "Professor Moneybag asks **Wei Ming**: If you have **one $5 bill**, which coin collection has the exact same value?",
    options: [
      "**500 pennies**!",
      "5 dimes",
      "2 quarters"
    ],
    correctAnswer: "**500 pennies**!",
    explanation: "Since **1 dollar** equals 100 pennies, a **5-dollar bill** is worth exactly **500 pennies**!"
  },
  {
    id: 'r_q3',
    question: "Professor Moneybag asks **Wei Ming**: If you buy a toy balloon for **40¢** and pay with a **50¢ coin**, what is your change?",
    options: [
      "1 nickel (5¢)",
      "**1 dime (10¢)**",
      "1 quarter (25¢)"
    ],
    correctAnswer: "**1 dime (10¢)**",
    explanation: "50 cents minus 40 cents leaves **10 cents** of change, which is exactly **1 dime**!"
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
  const pct = totalAnswered > 0 ? (score / totalAnswered) * 100 : 100;

  // Teach Mascot Narration
  useEffect(() => {
    if (step === 'teach' && audioEnabled && q) {
      speak(q.question.replace(/\*\*/g, ''), audioEnabled);
    }
    return () => { stopNarration(); };
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
      const items = Array.from({ length: 50 }, (_, i) => ({
        id: i,
        color: ['#ff5b79', '#ffb800', '#22c55e', '#38bdf8', '#a855f7'][i % 5],
        left: `${Math.random() * 100}%`,
        delay: `${Math.random() * 3}s`,
        duration: `${2 + Math.random() * 3}s`,
        size: `${8 + Math.random() * 10}px`,
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
        speak(`Excellent! ${q.explanation.replace(/\*\*/g, '')}`, audioEnabled);
      }
    } else {
      sounds.wrong();
      if (audioEnabled) {
        speak(`Almost! ${q.explanation.replace(/\*\*/g, '')}`, audioEnabled);
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
    }, 500);
  }, []);

  const getStars = () => {
    if (pct >= 85) return 3;
    if (pct >= 65) return 2;
    if (pct >= 45) return 1;
    return 3; // default reward stars
  };

  if (step === 'teach') {
    return (
      <div className="reflect-phase">
        <div className="reflect-header">
          <h2 className="reflect-label" style={{ fontSize: '2.4rem', fontWeight: 900, color: 'var(--purple-light)' }}>
            📓 Reflect — Teach Professor Moneybag
          </h2>
          <p className="reflect-sublabel" style={{ fontSize: '1.25rem', fontWeight: 700, color: '#d0d7ff' }}>
            Help Professor Moneybag and <strong style={{ color: 'var(--gold)' }}>Wei Ming</strong> review what you learned!
          </p>
        </div>
        <div className="reflect-card" style={{ background: '#181c47', border: '2.5px solid #2e3575', borderRadius: 32, padding: 36 }}>
          <div className="reflect-mascot-row" style={{ marginBottom: 28 }}>
            <div className="mascot" style={{ width: 80, height: 80, fontSize: '3.2rem', background: '#181c47', border: '2.5px solid #2e3575' }}>🦉</div>
            <div className="speech-bubble" style={{ fontSize: '1.25rem', padding: '18px 24px', color: '#0a0d25', fontWeight: 800, lineHeight: 1.5, background: '#ffffff', borderRadius: 24 }}>
              <FormattedText text={q.question} />
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
                  style={{
                    fontSize: '1.2rem',
                    fontWeight: 800,
                    padding: '18px 24px',
                    borderRadius: 20,
                    background: '#14173d',
                    border: '2.5px solid #2e3575',
                    color: '#ffffff'
                  }}
                >
                  <span className="reflect-option-emoji" style={{ fontSize: '1.1rem', background: 'rgba(255,255,255,0.12)', padding: '6px 12px', borderRadius: 12 }}>
                    {i === 0 ? '🅰️' : i === 1 ? '🅱️' : '🆃'}
                  </span>
                  <FormattedText text={opt} />
                </button>
              );
            })}
          </div>
          <div className="reflect-progress" style={{ marginTop: 28 }}>
            {REFLECT_QUESTIONS.map((_, i) => (
              <div key={i} className={`reflect-dot ${i === qIdx ? 'active' : i < qIdx ? 'done' : ''}`} style={{ width: 14, height: 14 }} />
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
          <h2 className="reflect-label" style={{ fontSize: '2.4rem', fontWeight: 900, color: 'var(--purple-light)' }}>
            📓 Reflect — Self Check
          </h2>
          <p className="reflect-sublabel" style={{ fontSize: '1.25rem', fontWeight: 700, color: '#d0d7ff' }}>
            How confident do you feel about recognizing and counting money now?
          </p>
        </div>
        <div className="reflect-card" style={{ maxWidth: 600, background: '#181c47', border: '2.5px solid #2e3575', borderRadius: 32, padding: 40 }}>
          <h2 className="reflect-card-title" style={{ fontSize: '2.2rem', fontWeight: 900, color: '#ffffff' }}>My Confidence Level</h2>
          <p style={{ color: '#d0d7ff', marginBottom: 28, fontSize: '1.2rem', fontWeight: 700 }}>
            Professor Moneybag & <strong style={{ color: 'var(--gold)' }}>Wei Ming</strong> want to know how much of a money master you feel!
          </p>
          <div className="confidence-grid">
            <button
              className={`confidence-btn ${confidence === 'low' ? 'selected' : ''}`}
              onClick={() => handleConfidence('low')}
              style={{ '--conf-color': 'var(--coral)', padding: '24px 16px', borderRadius: 24 }}
            >
              <span className="confidence-emoji" style={{ fontSize: '3.2rem' }}>😕</span>
              <span className="confidence-label" style={{ fontSize: '1.15rem', fontWeight: 900 }}>Need Practice</span>
            </button>
            <button
              className={`confidence-btn ${confidence === 'mid' ? 'selected' : ''}`}
              onClick={() => handleConfidence('mid')}
              style={{ '--conf-color': 'var(--gold)', padding: '24px 16px', borderRadius: 24 }}
            >
              <span className="confidence-emoji" style={{ fontSize: '3.2rem' }}>🙂</span>
              <span className="confidence-label" style={{ fontSize: '1.15rem', fontWeight: 900 }}>Getting There</span>
            </button>
            <button
              className={`confidence-btn ${confidence === 'high' ? 'selected' : ''}`}
              onClick={() => handleConfidence('high')}
              style={{ '--conf-color': 'var(--green-light)', padding: '24px 16px', borderRadius: 24 }}
            >
              <span className="confidence-emoji" style={{ fontSize: '3.2rem' }}>😎</span>
              <span className="confidence-label" style={{ fontSize: '1.15rem', fontWeight: 900 }}>Money Master!</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Certificate View
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

      <div className="certificate-card" style={{ animation: 'bounceIn 0.6s ease', background: '#181c47', border: '6px double var(--gold)', borderRadius: 36, padding: 48, maxWidth: 620 }}>
        <div className="cert-badge" style={{ fontSize: '4.5rem' }}>🏆</div>
        <h2 className="cert-title" style={{ fontSize: '2.6rem', fontWeight: 900, color: 'var(--gold)' }}>Congratulations!</h2>
        <p className="cert-subtitle" style={{ fontSize: '1.1rem', fontWeight: 800, color: '#d0d7ff', textTransform: 'uppercase', letterSpacing: '1px' }}>
          Master Treasurer Certificate of Achievement
        </p>

        <div className="score-circle" style={{ width: 130, height: 130, border: '4px solid var(--gold)', margin: '20px auto' }}>
          <span className="score-number" style={{ fontSize: '2.2rem', fontWeight: 900, color: '#ffffff' }}>{Math.round(pct)}%</span>
          <span className="score-label" style={{ fontSize: '0.85rem', fontWeight: 800, color: '#d0d7ff' }}>accuracy</span>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', gap: 14, margin: '16px 0', fontSize: '2.6rem' }}>
          {[1, 2, 3].map(s => (
            <span key={s} style={{ opacity: s <= stars ? 1 : 0.2, filter: s <= stars ? 'drop-shadow(0 0 12px var(--gold))' : 'none' }}>⭐</span>
          ))}
        </div>

        <p style={{ fontSize: '1.25rem', color: '#ffffff', margin: '18px 0', lineHeight: 1.6, fontWeight: 700 }}>
          This certifies that <strong style={{ color: 'var(--gold)', fontWeight: 900 }}>Wei Ming</strong> and you have successfully completed all <strong style={{ color: 'var(--gold)' }}>Treasure Market Adventure</strong> coin and note challenges! 🪙
        </p>

        <div className="cert-stats" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, margin: '24px 0' }}>
          <div className="cert-stat" style={{ background: '#14173d', border: '2px solid #2e3575', borderRadius: 20, padding: '16px 12px' }}>
            <span className="cert-stat-value" style={{ color: 'var(--gold)', fontSize: '1.8rem', fontWeight: 900 }}>{xp || 150}</span>
            <span className="cert-stat-label" style={{ fontSize: '0.95rem', fontWeight: 800, color: '#d0d7ff' }}>Total XP</span>
          </div>
          <div className="cert-stat" style={{ background: '#14173d', border: '2px solid #2e3575', borderRadius: 20, padding: '16px 12px' }}>
            <span className="cert-stat-value" style={{ color: 'var(--green-light)', fontSize: '1.8rem', fontWeight: 900 }}>{score || 20}</span>
            <span className="cert-stat-label" style={{ fontSize: '0.95rem', fontWeight: 800, color: '#d0d7ff' }}>Correct</span>
          </div>
          <div className="cert-stat" style={{ background: '#14173d', border: '2px solid #2e3575', borderRadius: 20, padding: '16px 12px' }}>
            <span className="cert-stat-value" style={{ color: 'var(--purple-light)', fontSize: '1.8rem', fontWeight: 900 }}>{totalAnswered || 20}</span>
            <span className="cert-stat-label" style={{ fontSize: '0.95rem', fontWeight: 800, color: '#d0d7ff' }}>Questions</span>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 16, justifyContent: 'center', marginTop: 24, flexWrap: 'wrap' }}>
          <button className="btn btn-primary btn-lg" onClick={onComplete} style={{ fontSize: '1.35rem', padding: '18px 40px', borderRadius: 32 }}>
            🔄 Begin New Journey
          </button>
          <button className="btn btn-outline" onClick={() => window.print()} style={{ fontSize: '1.15rem', padding: '16px 32px', borderRadius: 28, background: '#14173d', borderColor: '#3c4590' }}>
            🖨️ Print Certificate
          </button>
        </div>
      </div>
    </div>
  );
}
