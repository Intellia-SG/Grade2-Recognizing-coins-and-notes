import { useState, useCallback, useEffect, useRef } from 'react';
import { generateSessionQuestions } from '../utils/questionBank';
import { narrate, stopNarration, sounds, speak } from '../utils/audio';
import { playWorldIntro, playWorldComplete } from '../utils/narration';
import QuestionRenderer, { FormattedText } from './QuestionRenderer';

const WORLDS = [
  { id: 0, name: 'Coin Forest', icon: '🌲', color: '#22c55e', desc: 'Identify coins' },
  { id: 1, name: 'Silver River', icon: '🌊', color: '#14b8a6', desc: 'Compare values' },
  { id: 2, name: 'Note Castle', icon: '🏰', color: '#a855f7', desc: 'Recognize bills' },
  { id: 3, name: 'Treasure Bank', icon: '🏦', color: '#0ea5e9', desc: 'Count collections' },
  { id: 4, name: 'Market Square', icon: '🛒', color: '#f97316', desc: 'Shop & pay' },
  { id: 5, name: 'Royal Bazaar', icon: '👑', color: '#eab308', desc: 'Mastery challenges' },
];

const MOTIVATING_MESSAGES = [
  "Excellent!", "Fantastic Work!", "Superb Job!", "Way to Go!",
  "Brilliant!", "Outstanding!", "Terrific!", "Marvelous!"
];

function calcXP(attempt, streak) {
  const base = attempt === 1 ? 10 : 5;
  return base + (streak >= 5 ? 5 : 0);
}

function calcStars(correct, total) {
  if (!total) return 0;
  const pct = correct / total;
  if (pct >= 0.9) return 3;
  if (pct >= 0.7) return 2;
  if (pct >= 0.5) return 1;
  return 0;
}

export default function PlayPhase({ onComplete, audioEnabled }) {
  const [currentWorld, setCurrentWorld] = useState(-1);
  const [worldResults, setWorldResults] = useState({});
  const [qIndex, setQIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [totalXP, setTotalXP] = useState(0);
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [lives, setLives] = useState(3);
  const [feedback, setFeedback] = useState(null);
  const [answered, setAnswered] = useState(false);
  const [xpPopup, setXpPopup] = useState(null);
  const [worldComplete, setWorldComplete] = useState(false);
  const [worldIntroPopup, setWorldIntroPopup] = useState(null);
  const [achievementPopup, setAchievementPopup] = useState(null);
  const [exitConfirmModal, setExitConfirmModal] = useState(false);
  const narrationRef = useRef(null);
  const [worldQuestions, setWorldQuestions] = useState([]);

  const q = worldQuestions[qIndex];

  // Auto-narrate question text when rendered
  useEffect(() => {
    if (audioEnabled && q && !worldComplete && !feedback && !worldIntroPopup && currentWorld >= 0) {
      const timer = setTimeout(() => {
        // Strip markdown bold for clean TTS output
        const cleanText = q.questionText.replace(/\*\*/g, '');
        speak(cleanText, audioEnabled);
      }, 250);
      return () => {
        clearTimeout(timer);
        stopNarration();
      };
    }
  }, [qIndex, audioEnabled, q, worldComplete, feedback, worldIntroPopup, currentWorld]);

  const startWorld = useCallback((worldId) => {
    const bank = generateSessionQuestions();
    const filtered = bank.filter(q => q.world === worldId);
    setWorldQuestions(filtered);
    setCurrentWorld(worldId);
    setQIndex(0); setScore(0); setLives(3); setStreak(0);
    setWorldComplete(false); setFeedback(null); setAnswered(false);
    
    // Show instruction popup for the world
    const worldInfo = WORLDS[worldId];
    setWorldIntroPopup(worldInfo);
    sounds.click();
    
    if (audioEnabled) {
      narrationRef.current = narrate(playWorldIntro(worldInfo.name), true);
    }
  }, [audioEnabled]);

  const dismissWorldIntro = useCallback(() => {
    setWorldIntroPopup(null);
    stopNarration();
  }, []);

  const finishWorld = useCallback(() => {
    const w = WORLDS[currentWorld];
    const stars = calcStars(score, worldQuestions.length);
    sounds.badge();
    setWorldResults(prev => ({ ...prev, [currentWorld]: { score, total: worldQuestions.length, stars } }));
    setWorldComplete(true);
    
    if (stars === 3) {
      setAchievementPopup("🌟 3-Star Mastery Unlocked!");
      setTimeout(() => setAchievementPopup(null), 3000);
    }

    if (audioEnabled) {
      narrationRef.current = narrate(playWorldComplete(w.name, score, worldQuestions.length), true);
    }
  }, [currentWorld, score, audioEnabled, worldQuestions.length]);

  const backToMap = useCallback(() => {
    stopNarration();
    setCurrentWorld(-1);
    setWorldComplete(false);
    setFeedback(null);
    setExitConfirmModal(false);
  }, []);

  const handleAllComplete = useCallback(() => {
    stopNarration();
    const totalScore = Object.values(worldResults).reduce((a, r) => a + r.score, 0) + score;
    const totalQ = Object.values(worldResults).reduce((a, r) => a + r.total, 0) + (worldQuestions.length || 0);
    onComplete({
      score: totalScore,
      xp: totalXP,
      maxStreak,
      totalAnswered: totalQ,
      worldResults: { ...worldResults, [currentWorld]: { score, total: worldQuestions.length, stars: calcStars(score, worldQuestions.length) } },
    });
  }, [worldResults, score, totalXP, maxStreak, worldQuestions, currentWorld, onComplete]);

  const advance = useCallback(() => {
    setFeedback(null);
    setAnswered(false);
    if (qIndex + 1 < worldQuestions.length && lives > 0) {
      setQIndex(i => i + 1);
    } else {
      finishWorld();
    }
  }, [qIndex, worldQuestions.length, lives, finishWorld]);

  const handleAnswer = useCallback((isCorrect, attemptCount = 1) => {
    setAnswered(true);
    stopNarration();

    if (isCorrect) {
      const ns = streak + 1;
      const earned = calcXP(attemptCount, ns);
      setScore(s => s + 1);
      setStreak(ns);
      setMaxStreak(ms => Math.max(ms, ns));
      setTotalXP(x => x + earned);
      sounds.correct();

      if (ns >= 5 && ns % 5 === 0) {
        sounds.streak();
        setAchievementPopup(`🔥 ${ns} Question Streak Unlocked!`);
        setTimeout(() => setAchievementPopup(null), 2500);
      }

      setXpPopup(`+${earned} XP`);
      setTimeout(() => setXpPopup(null), 1500);

      const motivation = MOTIVATING_MESSAGES[Math.floor(Math.random() * MOTIVATING_MESSAGES.length)];
      setFeedback({
        type: 'correct',
        message: ns >= 5 ? `🔥 ${ns} Streak! ${motivation}` : `${motivation} 🎉`,
        sub: q.explanation
      });

      if (audioEnabled) {
        speak(`${motivation} ${q.explanation}`, audioEnabled);
      }

      setTimeout(advance, 2200);
    } else {
      setStreak(0);
      setLives(l => l - 1);
      sounds.wrong();
      
      setFeedback({
        type: 'wrong',
        message: 'Keep Going!',
        sub: q.explanation
      });

      if (audioEnabled) {
        speak(`The correct answer was: ${q.correctAnswer}. ${q.explanation}`, audioEnabled);
      }

      if (lives - 1 <= 0) {
        setTimeout(finishWorld, 2500);
      } else {
        setTimeout(advance, 2500);
      }
    }
  }, [streak, q, advance, lives, finishWorld, audioEnabled]);

  // World Map View
  if (currentWorld < 0) {
    const allDone = WORLDS.every((_, i) => worldResults[i]);
    const totalAnsweredCount = Object.values(worldResults).reduce((sum, r) => sum + r.total, 0);

    return (
      <div className="play-phase">
        <div className="play-header">
          <h2 className="play-title">🎮 Practice — Choose Your World!</h2>
          <p className="play-subtitle">
            Complete all 6 practice worlds to master recognizing, comparing & counting money! 🪙
          </p>
          {totalXP > 0 && <div className="play-xp-badge">⭐ {totalXP} XP</div>}
        </div>

        <div className="world-map">
          {WORLDS.map((w, i) => {
            const unlocked = i === 0 || worldResults[i - 1];
            const completed = worldResults[i];
            return (
              <div
                key={w.id}
                className={`world-card ${unlocked ? 'unlocked' : 'locked'} ${completed ? 'completed' : ''}`}
                onClick={() => unlocked && startWorld(i)}
                style={{ '--world-color': w.color }}
              >
                {!unlocked && <div className="world-lock">🔒</div>}
                <div className="world-icon">{w.icon}</div>
                <div className="world-name">{w.name}</div>
                <div className="world-desc">{w.desc}</div>
                {completed && (
                  <div className="world-stars">
                    {[1, 2, 3].map(s => (<span key={s} style={{ opacity: s <= completed.stars ? 1 : 0.2 }}>⭐</span>))}
                    <span className="world-score">{completed.score}/{completed.total}</span>
                  </div>
                )}
                {unlocked && !completed && <div className="world-play-btn">▶ PRACTICE WORLD</div>}
              </div>
            );
          })}
        </div>

        {totalAnsweredCount >= 20 || allDone ? (
          <button className="btn btn-green btn-lg" onClick={handleAllComplete} style={{ marginTop: 24, animation: 'bounceIn 0.5s ease' }}>
            🏆 Complete & View Certificate! ({totalAnsweredCount} Questions Completed)
          </button>
        ) : null}
      </div>
    );
  }

  // World Complete View
  if (worldComplete) {
    const w = WORLDS[currentWorld];
    const stars = calcStars(score, worldQuestions.length);
    const isLastWorld = currentWorld === WORLDS.length - 1;

    return (
      <div className="play-phase">
        <div className="world-complete-card">
          <div className="world-complete-icon">{w.icon}</div>
          <h2 className="world-complete-title">Level Complete! 🎉</h2>
          <h3 style={{ color: 'var(--gold)', marginBottom: 12 }}>{w.name}</h3>
          
          <div className="world-complete-score">{score}/{worldQuestions.length} Correct</div>
          <div className="world-complete-stars">
            {[1, 2, 3].map(s => (
              <span key={s} className={`world-star ${s <= stars ? 'earned' : ''}`} style={{ animationDelay: `${s * 0.2}s` }}>⭐</span>
            ))}
          </div>

          <div className="world-complete-xp">⭐ +{totalXP} XP Total</div>

          <div style={{ display: 'flex', gap: 12, marginTop: 24, flexWrap: 'wrap', justifyContent: 'center' }}>
            <button className="btn btn-outline btn-sm" onClick={backToMap}>← World Map</button>
            {isLastWorld ? (
              <button className="btn btn-green" onClick={handleAllComplete}>🏆 Finish Journey!</button>
            ) : (
              <button className="btn btn-primary" onClick={() => {
                setWorldResults(prev => ({ ...prev, [currentWorld]: { score, total: worldQuestions.length, stars } }));
                startWorld(currentWorld + 1);
              }}>Next World →</button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Question View
  if (!q) return null;
  const w = WORLDS[currentWorld];
  const pct = Math.round((qIndex / worldQuestions.length) * 100);

  return (
    <div className="play-phase">
      {/* Top Bar Navigation HUD */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', maxWidth: 720, marginBottom: 12 }}>
        <button
          className="btn btn-outline btn-sm"
          onClick={() => setExitConfirmModal(true)}
          style={{ fontSize: '0.8rem', padding: '4px 10px' }}
        >
          ← Exit World
        </button>

        <div className="play-world-badge" style={{ background: w.color, padding: '6px 14px', borderRadius: '14px', fontWeight: 'bold', fontSize: '0.85rem' }}>
          {w.icon} {w.name}
        </div>

        <div className="hud" style={{ margin: 0, gap: 12 }}>
          <div className="hud-item" style={{ fontSize: '0.85rem' }}>⭐ {totalXP} XP</div>
          <div className="hearts" style={{ fontSize: '1rem' }}>
            {Array.from({ length: 3 }, (_, i) => (<span key={i} style={{ opacity: i < lives ? 1 : 0.25 }}>❤️</span>))}
          </div>
          <div className={`hud-item ${streak >= 5 ? 'streak-fire' : ''}`} style={{ fontSize: '0.85rem' }}>🔥 {streak}x</div>
        </div>
      </div>

      {/* Progress Bar */}
      <div style={{ width: '100%', maxWidth: 720, marginBottom: 16 }}>
        <div className="progress-bar-container">
          <div className="progress-bar-label">
            <span>Question {qIndex + 1} of {worldQuestions.length}</span>
            <span>{pct}%</span>
          </div>
          <div className="progress-bar-track">
            <div className="progress-bar-fill" style={{ width: `${pct}%` }} />
          </div>
        </div>
      </div>

      {/* Question Card */}
      <div className="question-card" style={{ animation: 'slideUp 0.35s ease' }}>
        <QuestionRenderer
          question={q}
          onAnswer={handleAnswer}
          disabled={answered}
          audioEnabled={audioEnabled}
        />
      </div>

      {/* XP Floating Animation */}
      {xpPopup && <div className="xp-popup">{xpPopup}</div>}

      {/* Achievement Banner */}
      {achievementPopup && (
        <div className="achievement-popup">
          {achievementPopup}
        </div>
      )}

      {/* World Instruction Popup Modal */}
      {worldIntroPopup && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: 450, textAlign: 'center' }}>
            <div style={{ fontSize: '3rem', marginBottom: 8 }}>{worldIntroPopup.icon}</div>
            <h2 style={{ color: 'var(--gold)', marginBottom: 8 }}>{worldIntroPopup.name}</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: 20 }}>
              Welcome to <strong>{worldIntroPopup.name}</strong>! Let's help <strong>Wei Ming</strong> solve these money challenges to collect lost treasures!
            </p>
            <button className="btn btn-primary btn-lg" onClick={dismissWorldIntro}>
              🚀 Let's Begin!
            </button>
          </div>
        </div>
      )}

      {/* Exit Confirmation Modal */}
      {exitConfirmModal && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: 400, textAlign: 'center' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: 8 }}>🚪</div>
            <h3 style={{ color: 'var(--coral)', marginBottom: 8 }}>Exit World?</h3>
            <p style={{ color: 'var(--text-secondary)', marginBottom: 20, fontSize: '0.9rem' }}>
              Are you sure you want to return to the World Map? Your progress in this world will be lost.
            </p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
              <button className="btn btn-outline" onClick={() => setExitConfirmModal(false)}>
                Resume
              </button>
              <button className="btn btn-primary" onClick={backToMap} style={{ background: 'var(--coral)' }}>
                Yes, Exit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Feedback Overlay Popup */}
      {feedback && (
        <div className="feedback-overlay">
          <div className={`feedback-content ${feedback.type}`}>
            <div className="feedback-emoji">{feedback.type === 'correct' ? '🎉' : '💡'}</div>
            <div className="feedback-message">{feedback.message}</div>
            <div className="feedback-sub">
              <FormattedText text={feedback.sub} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
