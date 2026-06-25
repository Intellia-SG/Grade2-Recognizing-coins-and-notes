import React, { useState, useCallback } from 'react';

function MoneyVisual({ visualType, coinType, noteType }) {
  if (!visualType) return null;

  if (visualType === 'coinShow' && coinType) {
    const coinConfig = {
      penny:   { name: 'Penny',   val: '1¢',   color: '#b45309', border: '#78350f', size: 90  },
      nickel:  { name: 'Nickel',  val: '5¢',   color: '#94a3b8', border: '#64748b', size: 100 },
      dime:    { name: 'Dime',    val: '10¢',  color: '#cbd5e1', border: '#94a3b8', size: 80  },
      quarter: { name: 'Quarter', val: '25¢',  color: '#e2e8f0', border: '#cbd5e1', size: 115 },
    };
    const c = coinConfig[coinType] || coinConfig.penny;
    return (
      <div style={{ display: 'flex', justifyContent: 'center', margin: '20px 0' }}>
        <svg viewBox="0 0 120 120" style={{ width: c.size, height: c.size, filter: 'drop-shadow(0 6px 12px rgba(0,0,0,0.4))' }}>
          <circle cx="60" cy="60" r="50" fill={`radial-gradient(circle, ${c.color}cc 0%, ${c.color} 100%)`} fill={c.color} stroke={c.border} strokeWidth="5" />
          <circle cx="60" cy="60" r="44" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="2" strokeDasharray="4 2" />
          <text x="60" y="66" textAnchor="middle" fill="#020617" fontSize="22" fontWeight="900" fontFamily="sans-serif">
            {c.val}
          </text>
          <text x="60" y="86" textAnchor="middle" fill="#020617" fontSize="10" fontWeight="700" opacity="0.6" fontFamily="sans-serif">
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
        <svg viewBox="0 0 200 90" style={{ width: 220, height: 100, filter: 'drop-shadow(0 6px 12px rgba(0,0,0,0.4))' }}>
          {/* Note Base */}
          <rect x="5" y="5" width="190" height="80" rx="8" fill="#166534" stroke="#14532d" strokeWidth="4" />
          <rect x="10" y="10" width="180" height="70" rx="6" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="2" />
          {/* Portrait frame */}
          <circle cx="100" cy="45" r="24" fill="#14532d" stroke="rgba(255,255,255,0.1)" strokeWidth="2" />
          <text x="100" y="53" textAnchor="middle" fontSize="24">💵</text>
          {/* Values */}
          <text x="22" y="28" fill="#a7f3d0" fontSize="16" fontWeight="bold" fontFamily="monospace">{n.val}</text>
          <text x="178" y="28" fill="#a7f3d0" fontSize="16" fontWeight="bold" fontFamily="monospace" textAnchor="end">{n.val}</text>
          <text x="22" y="74" fill="#a7f3d0" fontSize="16" fontWeight="bold" fontFamily="monospace">{n.val}</text>
          <text x="178" y="74" fill="#a7f3d0" fontSize="16" fontWeight="bold" fontFamily="monospace" textAnchor="end">{n.val}</text>
          {/* Label */}
          <text x="100" y="80" textAnchor="middle" fill="rgba(255,255,255,0.4)" fontSize="8" fontWeight="bold" fontFamily="sans-serif">
            {n.label}
          </text>
        </svg>
      </div>
    );
  }

  return null;
}

export default function QuestionRenderer({ question, onAnswer, disabled }) {
  const [selectedOption, setSelectedOption] = useState(null);

  const handleOptionClick = useCallback((option) => {
    if (disabled) return;
    setSelectedOption(option);
    const isCorrect = String(option) === String(question.correctAnswer);
    setTimeout(() => {
      onAnswer(isCorrect);
      setSelectedOption(null);
    }, 600);
  }, [disabled, question.correctAnswer, onAnswer]);

  return (
    <div>
      <div style={{
        display: 'inline-block',
        background: 'var(--green-light)',
        color: '#1e293b',
        padding: '4px 12px',
        borderRadius: '12px',
        fontSize: '0.8rem',
        fontWeight: 850,
        marginBottom: 12,
        letterSpacing: '0.5px',
        fontFamily: 'var(--font-display)'
      }}>
        🪙 COINS & NOTES
      </div>
      <p className="question-text">{question.questionText}</p>

      <MoneyVisual visualType={question.visual} coinType={question.coinType} noteType={question.noteType} />

      {question.options && (
        <div className="options-grid">
          {question.options.map((opt, i) => {
            let cls = 'option-btn';
            if (disabled) cls += ' disabled';
            if (selectedOption === opt) {
              cls += String(opt) === String(question.correctAnswer) ? ' correct' : ' wrong';
            } else if (disabled && String(opt) === String(question.correctAnswer)) {
              cls += ' correct';
            }
            return (
              <button key={i} className={cls} onClick={() => handleOptionClick(opt)} style={{ outline: 'none' }}>
                {opt}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
