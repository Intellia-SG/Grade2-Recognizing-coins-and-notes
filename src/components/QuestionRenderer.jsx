import React, { useState, useCallback, useEffect } from 'react';
import { speak } from '../utils/audio';

// Helper to render markdown bolding gracefully
export function FormattedText({ text, style }) {
  if (!text) return null;
  const parts = text.split(/(\*\*.*?\*\*)/g);
  return (
    <span style={style}>
      {parts.map((part, i) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return <strong key={i} style={{ color: 'var(--gold)', fontWeight: 800 }}>{part.slice(2, -2)}</strong>;
        }
        return part;
      })}
    </span>
  );
}

function MoneyVisual({ visualType, coinType, noteType }) {
  if (!visualType) return null;

  if (visualType === 'coinShow' && coinType) {
    const coinConfig = {
      penny:   { name: 'Penny',   val: '1¢',   color: '#b45309', border: '#78350f', size: 95 },
      nickel:  { name: 'Nickel',  val: '5¢',   color: '#94a3b8', border: '#64748b', size: 105 },
      dime:    { name: 'Dime',    val: '10¢',  color: '#cbd5e1', border: '#94a3b8', size: 85 },
      quarter: { name: 'Quarter', val: '25¢',  color: '#e2e8f0', border: '#cbd5e1', size: 120 },
    };
    const c = coinConfig[coinType] || coinConfig.penny;
    return (
      <div style={{ display: 'flex', justifyContent: 'center', margin: '20px 0' }}>
        <svg viewBox="0 0 120 120" style={{ width: c.size, height: c.size, filter: 'drop-shadow(0 6px 16px rgba(0,0,0,0.5))', animation: 'floatAnim 3s ease-in-out infinite' }}>
          <circle cx="60" cy="60" r="50" fill={c.color} stroke={c.border} strokeWidth="5" />
          <circle cx="60" cy="60" r="44" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="2" strokeDasharray="4 2" />
          <text x="60" y="66" textAnchor="middle" fill="#020617" fontSize="22" fontWeight="900" fontFamily="Fredoka, sans-serif">
            {c.val}
          </text>
          <text x="60" y="86" textAnchor="middle" fill="#020617" fontSize="10" fontWeight="700" opacity="0.7" fontFamily="Nunito, sans-serif">
            {c.name.toUpperCase()}
          </text>
        </svg>
      </div>
    );
  }

  if (visualType === 'noteShow' && noteType) {
    const noteConfig = {
      '1dollar':  { val: '$1',  portrait: '🧔', label: 'ONE DOLLAR' },
      '5dollar':  { val: '$5',  portrait: '👱', label: 'FIVE DOLLARS' },
      '10dollar': { val: '$10', portrait: '👨', label: 'TEN DOLLARS' },
      '20dollar': { val: '$20', portrait: '👩', label: 'TWENTY DOLLARS' },
    };
    const n = noteConfig[noteType] || noteConfig['1dollar'];
    return (
      <div style={{ display: 'flex', justifyContent: 'center', margin: '20px 0' }}>
        <svg viewBox="0 0 200 90" style={{ width: 230, height: 105, filter: 'drop-shadow(0 6px 16px rgba(0,0,0,0.5))', animation: 'floatAnim 3.5s ease-in-out infinite' }}>
          <rect x="5" y="5" width="190" height="80" rx="8" fill="#166534" stroke="#14532d" strokeWidth="4" />
          <rect x="10" y="10" width="180" height="70" rx="6" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="2" />
          <circle cx="100" cy="45" r="24" fill="#14532d" stroke="rgba(255,255,255,0.2)" strokeWidth="2" />
          <text x="100" y="53" textAnchor="middle" fontSize="24">💵</text>
          <text x="22" y="28" fill="#a7f3d0" fontSize="16" fontWeight="bold" fontFamily="monospace">{n.val}</text>
          <text x="178" y="28" fill="#a7f3d0" fontSize="16" fontWeight="bold" fontFamily="monospace" textAnchor="end">{n.val}</text>
          <text x="22" y="74" fill="#a7f3d0" fontSize="16" fontWeight="bold" fontFamily="monospace">{n.val}</text>
          <text x="178" y="74" fill="#a7f3d0" fontSize="16" fontWeight="bold" fontFamily="monospace" textAnchor="end">{n.val}</text>
          <text x="100" y="80" textAnchor="middle" fill="rgba(255,255,255,0.6)" fontSize="8" fontWeight="bold" fontFamily="sans-serif">
            {n.label}
          </text>
        </svg>
      </div>
    );
  }

  return null;
}

export default function QuestionRenderer({ question, onAnswer, disabled, audioEnabled = true }) {
  const [selectedOption, setSelectedOption] = useState(null);
  const [attempts, setAttempts] = useState(0);
  const [showHintModal, setShowHintModal] = useState(false);
  const [wrongShakeOption, setWrongShakeOption] = useState(null);

  // Reset when question changes
  useEffect(() => {
    setSelectedOption(null);
    setAttempts(0);
    setShowHintModal(false);
    setWrongShakeOption(null);
  }, [question?.id]);

  const handleHintClick = useCallback(() => {
    setShowHintModal(prev => !prev);
    if (!showHintModal && audioEnabled && question?.hint1) {
      speak(`Hint: ${question.hint1}`, audioEnabled);
    }
  }, [showHintModal, audioEnabled, question?.hint1]);

  const handleOptionClick = useCallback((option) => {
    if (disabled || selectedOption) return;
    
    const isCorrect = String(option) === String(question.correctAnswer);
    const newAttempts = attempts + 1;
    setAttempts(newAttempts);

    if (isCorrect) {
      setSelectedOption(option);
      setTimeout(() => {
        onAnswer(true, newAttempts);
      }, 700);
    } else {
      // Wrong answer logic
      if (newAttempts === 1) {
        // First wrong attempt: shake and allow retry!
        setWrongShakeOption(option);
        if (audioEnabled) speak("Not quite! Take another look and try again!", audioEnabled);
        setTimeout(() => {
          setWrongShakeOption(null);
        }, 800);
      } else {
        // Second wrong attempt: highlight wrong choice red and reveal correct answer in green
        setSelectedOption(option);
        setTimeout(() => {
          onAnswer(false, newAttempts);
        }, 1200);
      }
    }
  }, [disabled, selectedOption, attempts, question.correctAnswer, onAnswer, audioEnabled]);

  if (!question) return null;

  return (
    <div style={{ position: 'relative' }}>
      {/* Top Header Row with Category & Hint Button */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 6,
          background: 'var(--green-light)',
          color: '#0f172a',
          padding: '5px 14px',
          borderRadius: '16px',
          fontSize: '0.85rem',
          fontWeight: 900,
          letterSpacing: '0.5px',
          fontFamily: 'var(--font-display)'
        }}>
          🪙 COINS & NOTES
        </div>

        <button
          className="btn-hint"
          onClick={handleHintClick}
          title="Click for a helpful hint!"
          style={{
            background: showHintModal ? 'var(--gold)' : 'rgba(234, 179, 8, 0.15)',
            color: showHintModal ? '#0f172a' : 'var(--gold)',
            border: '2px solid var(--gold)',
            borderRadius: '20px',
            padding: '6px 14px',
            fontSize: '0.85rem',
            fontWeight: 800,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            transition: 'all 0.2s ease',
            boxShadow: showHintModal ? '0 0 12px var(--gold-glow)' : 'none',
          }}
        >
          💡 <span>{showHintModal ? 'Hide Hint' : 'Hint'}</span>
        </button>
      </div>

      {/* Animated Hint Popup Modal */}
      {showHintModal && (
        <div className="hint-modal-popup" style={{
          background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
          border: '2px solid var(--gold)',
          borderRadius: '16px',
          padding: '14px 18px',
          marginBottom: 16,
          boxShadow: '0 8px 24px rgba(234, 179, 8, 0.25)',
          animation: 'bounceIn 0.35s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
          display: 'flex',
          alignItems: 'flex-start',
          gap: 12,
        }}>
          <span style={{ fontSize: '1.6rem' }}>💡</span>
          <div>
            <div style={{ fontWeight: 800, color: 'var(--gold)', fontSize: '0.9rem', marginBottom: 2 }}>
              HELPFUL HINT
            </div>
            <div style={{ fontSize: '0.95rem', color: 'var(--text-primary)' }}>
              <FormattedText text={question.hint1} />
              {question.hint2 && attempts > 0 && (
                <div style={{ marginTop: 6, borderTop: '1px dashed rgba(255,255,255,0.1)', paddingTop: 6 }}>
                  <FormattedText text={question.hint2} />
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Question Text */}
      <h3 className="question-text" style={{ fontSize: '1.25rem', lineHeight: '1.5', margin: '12px 0' }}>
        <FormattedText text={question.questionText} />
      </h3>

      {/* Visual illustration */}
      <MoneyVisual visualType={question.visual} coinType={question.coinType} noteType={question.noteType} />

      {/* Options Grid */}
      {question.options && (
        <div className="options-grid" style={{ marginTop: 16 }}>
          {question.options.map((opt, i) => {
            let cls = 'option-btn';
            const isCorrect = String(opt) === String(question.correctAnswer);
            
            if (disabled) cls += ' disabled';
            if (wrongShakeOption === opt) cls += ' shake-wrong';

            if (selectedOption === opt) {
              cls += isCorrect ? ' correct' : ' wrong';
            } else if (disabled && isCorrect) {
              cls += ' correct';
            }

            return (
              <button
                key={i}
                className={cls}
                onClick={() => handleOptionClick(opt)}
                disabled={disabled}
                style={{
                  minHeight: 52,
                  fontSize: '1rem',
                  outline: 'none',
                }}
              >
                <FormattedText text={opt} />
              </button>
            );
          })}
        </div>
      )}

      {attempts === 1 && !selectedOption && (
        <div style={{
          marginTop: 12,
          textAlign: 'center',
          color: 'var(--gold)',
          fontSize: '0.85rem',
          fontWeight: 700,
          animation: 'fadeIn 0.3s ease'
        }}>
          💡 1 attempt remaining — pick carefully!
        </div>
      )}
    </div>
  );
}
