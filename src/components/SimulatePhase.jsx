import React, { useState, useCallback, useEffect, useRef } from 'react';
import { narrate, stopNarration, sounds, playTone } from '../utils/audio';
import { celebrate, cheer } from '../utils/audio';
import { simulateStation1Intro, simulateStation2Intro, simulateStation3Intro } from '../utils/narration';

const STATIONS = [
  { id: 0, title: 'Coin Explorer', subtitle: 'Identify & Match', icon: '🪙' },
  { id: 1, title: 'Note Detective', subtitle: 'Inspect Details', icon: '🔍' },
  { id: 2, title: 'Conveyor Count', subtitle: 'Feed the Piggy Bank', icon: '🏦' },
];

// ═══════════════════════════════════════════════════
// STATION 1: Coin Explorer
// ═══════════════════════════════════════════════════
const S1_ROUNDS = [
  {
    id: 0,
    name: 'Penny',
    value: '1¢',
    color: '#b45309', // copper
    borderColor: '#78350f',
    frontLabel: 'Abraham Lincoln 🧔',
    backLabel: 'Union Shield 🛡️',
    correctAnswer: 'Penny (1¢)',
    details: 'A copper-colored coin, worth 1 cent. It features Abraham Lincoln on the front.',
  },
  {
    id: 1,
    name: 'Dime',
    value: '10¢',
    color: '#94a3b8', // small silver
    borderColor: '#64748b',
    frontLabel: 'Franklin D. Roosevelt 👨',
    backLabel: 'Torch, Olive & Oak 🌿',
    correctAnswer: 'Dime (10¢)',
    sizeMultiplier: 0.85,
    details: 'The smallest silver coin, worth 10 cents. It is thin and features Franklin D. Roosevelt.',
  },
  {
    id: 2,
    name: 'Quarter',
    value: '25¢',
    color: '#cbd5e1', // large silver
    borderColor: '#94a3b8',
    frontLabel: 'George Washington 👱',
    backLabel: 'American Eagle 🦅',
    correctAnswer: 'Quarter (25¢)',
    sizeMultiplier: 1.2,
    details: 'The largest standard silver coin, worth 25 cents. It features George Washington.',
  },
];

function Station1({ audioEnabled, onNext }) {
  const [round, setRound] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [feedback, setFeedback] = useState('');
  const [done, setDone] = useState(false);
  const narRef = useRef(null);

  const r = S1_ROUNDS[round];

  useEffect(() => {
    setIsFlipped(false);
    setSelectedAnswer(null);
    setFeedback('');
    setDone(false);
  }, [round]);

  useEffect(() => {
    if (audioEnabled) {
      narRef.current = narrate(simulateStation1Intro(), true);
    }
    return () => { narRef.current?.cancel(); };
  }, [round, audioEnabled]);

  const handleFlip = () => {
    sounds.click();
    setIsFlipped(!isFlipped);
  };

  const handleAnswer = (ans) => {
    if (done) return;
    setSelectedAnswer(ans);
    const correct = ans === r.correctAnswer;

    if (correct) {
      sounds.correct();
      setFeedback(`Correct! That is a ${r.name}, worth ${r.value}! 🎉`);
      setDone(true);
      if (audioEnabled) {
        narRef.current = narrate([
          celebrate(`Excellent! You matched the coin to its value! ${r.details}`)
        ], true);
      }
    } else {
      sounds.wrong();
      setFeedback("Not quite! Take a close look at the coin color, size, and details.");
    }
  };

  return (
    <div style={{ textAlign: 'center' }}>
      <div className="station-header"><h2>🪙 Coin Explorer</h2></div>
      <p style={{ color: 'var(--text-secondary)', marginBottom: 16 }}>
        Inspect the coin! Click to flip and match it to its correct name and value.
      </p>

      {/* Interactive 3D Coin Flip Area */}
      <div style={{ display: 'flex', justifyContent: 'center', margin: '24px 0' }}>
        <div style={{
          position: 'relative',
          width: 160,
          height: 160,
          perspective: 1000,
          cursor: 'pointer',
        }} onClick={handleFlip}>
          <div style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            transformStyle: 'preserve-3d',
            transition: 'transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
            transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
          }}>
            {/* Front Side */}
            <div style={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              backfaceVisibility: 'hidden',
              borderRadius: '50%',
              background: `radial-gradient(circle, ${r.color}cc 0%, ${r.color} 100%)`,
              border: `6px double ${r.borderColor}`,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 8px 16px rgba(0,0,0,0.4)',
              transform: `scale(${r.sizeMultiplier || 1})`,
            }}>
              <span style={{ fontSize: '2.5rem' }}>🪙</span>
              <span style={{ fontSize: '0.85rem', fontWeight: 'bold', marginTop: 4 }}>FRONT</span>
              <span style={{ fontSize: '0.7rem', opacity: 0.8, textAlign: 'center', padding: '0 8px' }}>{r.frontLabel}</span>
            </div>

            {/* Back Side */}
            <div style={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              backfaceVisibility: 'hidden',
              borderRadius: '50%',
              background: `radial-gradient(circle, ${r.color}cc 0%, ${r.color} 100%)`,
              border: `6px double ${r.borderColor}`,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 8px 16px rgba(0,0,0,0.4)',
              transform: `rotateY(180deg) scale(${r.sizeMultiplier || 1})`,
            }}>
              <span style={{ fontSize: '2rem', filter: 'grayscale(30%)' }}>🌟</span>
              <span style={{ fontSize: '0.85rem', fontWeight: 'bold', marginTop: 4 }}>BACK</span>
              <span style={{ fontSize: '0.7rem', opacity: 0.8, textAlign: 'center', padding: '0 8px' }}>{r.backLabel}</span>
            </div>
          </div>
        </div>
      </div>

      <div style={{ marginBottom: 20 }}>
        <button className="btn btn-secondary btn-sm" onClick={handleFlip}>
          🔄 Flip Coin
        </button>
      </div>

      <div style={{ marginBottom: 24 }}>
        <p style={{ fontWeight: 700, marginBottom: 12 }}>Which coin is this?</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12, maxWidth: 360, margin: '0 auto' }}>
          {['Penny (1¢)', 'Nickel (5¢)', 'Dime (10¢)', 'Quarter (25¢)'].map(ans => (
            <button
              key={ans}
              className={`btn btn-sm ${selectedAnswer === ans ? (ans === r.correctAnswer ? 'btn-green' : 'btn-primary') : 'btn-outline'}`}
              onClick={() => handleAnswer(ans)}
              disabled={done}
            >
              {ans}
            </button>
          ))}
        </div>
      </div>

      {feedback && (
        <p style={{
          color: done ? 'var(--green-light)' : 'var(--coral)',
          fontWeight: 700,
          fontSize: '0.95rem',
          margin: '12px 0',
          animation: 'bounceIn 0.3s',
        }}>
          {feedback}
        </p>
      )}

      {done && (
        <div style={{ marginTop: 16, animation: 'bounceIn 0.5s' }}>
          <button className={`btn ${round < 2 ? 'btn-outline' : 'btn-primary'}`} onClick={() => round < 2 ? setRound(r => r + 1) : onNext()}>
            {round < 2 ? 'Inspect Another Coin →' : 'Next Station →'}
          </button>
        </div>
      )}

      <div style={{ marginTop: 16, fontSize: '0.8rem', color: 'var(--text-muted)' }}>Coin {round + 1} / 3</div>
    </div>
  );
}

// ═══════════════════════════════════════════════════
// STATION 2: Note Detective
// ═══════════════════════════════════════════════════
const S2_NOTES = [
  {
    id: 0,
    name: 'One-Dollar Bill',
    value: '$1',
    portrait: 'George Washington 👱',
    spots: [
      { id: 'portrait', top: '50%', left: '50%', label: 'George Washington Portrait', desc: 'George Washington, the first U.S. President, is on the $1 bill.' },
      { id: 'val_corner', top: '15%', left: '8%', label: 'Denomination Corners', desc: 'The corner show the number "1" representing its value of one dollar.' },
      { id: 'seal', top: '50%', left: '80%', label: 'Treasury Seal', desc: 'The green seal shows this is official money made by the Treasury.' }
    ]
  },
  {
    id: 1,
    name: 'Five-Dollar Bill',
    value: '$5',
    portrait: 'Abraham Lincoln 🧔',
    spots: [
      { id: 'portrait', top: '50%', left: '50%', label: 'Abraham Lincoln Portrait', desc: 'Abraham Lincoln, the 16th U.S. President, is on the $5 bill.' },
      { id: 'val_corner', top: '15%', left: '8%', label: 'Denomination Corners', desc: 'The corners show a giant number "5" representing five dollars.' },
      { id: 'seal', top: '50%', left: '80%', label: 'Treasury Seal', desc: 'A green Treasury seal certifies this note.' }
    ]
  }
];

function Station2({ audioEnabled, onNext }) {
  const [noteIdx, setNoteIdx] = useState(0);
  const [clickedSpots, setClickedSpots] = useState({});
  const [activeInfo, setActiveInfo] = useState('');
  const [feedback, setFeedback] = useState('');
  const [done, setDone] = useState(false);
  const narRef = useRef(null);

  const n = S2_NOTES[noteIdx];

  useEffect(() => {
    setClickedSpots({});
    setActiveInfo('Tap the red detective spots to examine details!');
    setFeedback('');
    setDone(false);
  }, [noteIdx]);

  useEffect(() => {
    if (audioEnabled) {
      narRef.current = narrate(simulateStation2Intro(), true);
    }
    return () => { narRef.current?.cancel(); };
  }, [noteIdx, audioEnabled]);

  const handleSpotClick = (spot) => {
    sounds.click();
    setClickedSpots(prev => {
      const updated = { ...prev, [spot.id]: true };
      const allDone = n.spots.every(s => updated[s.id]);
      if (allDone) {
        sounds.correct();
        setFeedback(`Great job! You found all the secrets on the ${n.name}! 🔍`);
        setDone(true);
        if (audioEnabled) {
          narRef.current = narrate([
            celebrate(`Great job! You found all the secrets on the banknote!`)
          ], true);
        }
      }
      return updated;
    });
    setActiveInfo(`🔍 ${spot.label}: ${spot.desc}`);
  };

  return (
    <div style={{ textAlign: 'center' }}>
      <div className="station-header"><h2>🔍 Note Detective</h2></div>
      <p style={{ color: 'var(--text-secondary)', marginBottom: 16 }}>
        Use your detective eye to inspect security features on banknotes!
      </p>

      {/* Bill Interface */}
      <div style={{ display: 'flex', justifyContent: 'center', margin: '24px 0' }}>
        <div style={{
          position: 'relative',
          width: 320,
          height: 140,
          background: 'radial-gradient(circle, #166534 0%, #14532d 100%)',
          border: '4px solid #15803d',
          borderRadius: 8,
          boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          {/* Decorative Borders */}
          <div style={{
            position: 'absolute',
            inset: 6,
            border: '2px solid rgba(255, 255, 255, 0.1)',
            pointerEvents: 'none'
          }} />

          {/* Bill Denomination text */}
          <div style={{ position: 'absolute', fontSize: '2rem', fontWeight: 900, color: 'rgba(255,255,255,0.06)', userSelect: 'none' }}>
            {n.value}
          </div>

          {/* Oval frame */}
          <div style={{
            width: 70,
            height: 90,
            border: '3px solid rgba(255,255,255,0.2)',
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.05)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '2.5rem'
          }}>
            💵
          </div>

          {/* Hotspots */}
          {n.spots.map(spot => {
            const clicked = clickedSpots[spot.id];
            return (
              <button
                key={spot.id}
                onClick={() => handleSpotClick(spot)}
                style={{
                  position: 'absolute',
                  top: spot.top,
                  left: spot.left,
                  width: 24,
                  height: 24,
                  borderRadius: '50%',
                  background: clicked ? 'var(--green-light)' : 'var(--coral)',
                  border: '2px solid white',
                  boxShadow: clicked ? '0 0 10px var(--green-light-glow)' : '0 0 10px var(--coral-glow)',
                  transform: 'translate(-50%, -50%)',
                  cursor: 'pointer',
                  zIndex: 20,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.65rem',
                  fontWeight: 'bold',
                  color: 'white',
                  animation: clicked ? 'none' : 'pulse 1.5s infinite',
                  outline: 'none',
                }}
              >
                {clicked ? '✓' : '?'}
              </button>
            );
          })}
        </div>
      </div>

      {/* active details card */}
      <div style={{
        background: 'rgba(255, 255, 255, 0.05)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: 16,
        padding: 12,
        maxWidth: 400,
        margin: '16px auto',
        minHeight: 60,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '0.9rem',
        color: 'var(--text-primary)',
      }}>
        {activeInfo}
      </div>

      {feedback && (
        <p style={{
          color: 'var(--green-light)',
          fontWeight: 700,
          fontSize: '0.95rem',
          margin: '12px 0',
          animation: 'bounceIn 0.3s',
        }}>
          {feedback}
        </p>
      )}

      {done && (
        <div style={{ marginTop: 16, animation: 'bounceIn 0.5s' }}>
          <button className={`btn ${noteIdx < 1 ? 'btn-outline' : 'btn-primary'}`} onClick={() => noteIdx < 1 ? setNoteIdx(i => i + 1) : onNext()}>
            {noteIdx < 1 ? 'Inspect Next Note →' : 'Next Station →'}
          </button>
        </div>
      )}

      <div style={{ marginTop: 16, fontSize: '0.8rem', color: 'var(--text-muted)' }}>Note {noteIdx + 1} / 2</div>
    </div>
  );
}

// ═══════════════════════════════════════════════════
// STATION 3: Conveyor Counting
// ═══════════════════════════════════════════════════
function Station3({ audioEnabled, onComplete }) {
  const [total, setTotal] = useState(0);
  const [round, setRound] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [animatingCoin, setAnimatingCoin] = useState(null);
  const [done, setDone] = useState(false);
  const narRef = useRef(null);

  const targets = [50, 75]; // Round targets: 50 cents, 75 cents
  const target = targets[round];

  useEffect(() => {
    setTotal(0);
    setFeedback('');
    setDone(false);
    setAnimatingCoin(null);
  }, [round]);

  useEffect(() => {
    if (audioEnabled) {
      narRef.current = narrate(simulateStation3Intro(), true);
    }
    return () => { narRef.current?.cancel(); };
  }, [round, audioEnabled]);

  const handleAddCoin = (val, symbol) => {
    if (done || animatingCoin) return;
    sounds.click();
    setAnimatingCoin(symbol);

    setTimeout(() => {
      setTotal(t => {
        const nextTotal = t + val;
        if (nextTotal === target) {
          sounds.correct();
          setFeedback(`Perfect! You collected exactly ${target} cents! 🐷`);
          setDone(true);
          if (audioEnabled) {
            narRef.current = narrate([
              celebrate(`Fantastic counting! You fed the piggy bank perfectly!`)
            ], true);
          }
        } else if (nextTotal > target) {
          sounds.wrong();
          setFeedback(`Oops! That exceeds the target of ${target}¢. Let's reset the bank!`);
          setTimeout(() => setTotal(0), 1200);
        } else {
          playTone(440 + val * 5, 100);
        }
        return nextTotal > target ? 0 : nextTotal;
      });
      setAnimatingCoin(null);
    }, 850);
  };

  const handleReset = () => {
    sounds.click();
    setTotal(0);
    setFeedback('');
  };

  return (
    <div style={{ textAlign: 'center' }}>
      <div className="station-header"><h2>🏦 Conveyor Count</h2></div>
      <p style={{ color: 'var(--text-secondary)', marginBottom: 12 }}>
        Feed the Piggy Bank! Click coins to send them down the conveyor belt.
      </p>
      <div style={{ fontSize: '1rem', fontWeight: 'bold', color: 'var(--gold)', marginBottom: 16 }}>
        Target Amount: <span style={{ fontSize: '1.4rem' }}>{target}¢</span>
      </div>

      {/* Conveyor Belt & Piggy Bank Container */}
      <div style={{
        position: 'relative',
        width: '100%',
        height: 120,
        background: 'rgba(0,0,0,0.2)',
        border: '2px solid rgba(255,255,255,0.08)',
        borderRadius: 16,
        margin: '20px 0',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 24px',
      }}>
        {/* Conveyor Belt line */}
        <div style={{
          position: 'absolute',
          left: 40,
          right: 100,
          height: 12,
          background: 'repeating-linear-gradient(90deg, #334155, #334155 10px, #1e293b 10px, #1e293b 20px)',
          borderRadius: 6,
          top: '60%',
          transform: 'translateY(-50%)',
          zIndex: 5,
        }} />

        {/* Digital display screen */}
        <div style={{
          background: '#020617',
          border: '2px solid var(--blue-light)',
          borderRadius: 8,
          padding: '4px 12px',
          fontFamily: 'monospace',
          color: 'var(--blue-light)',
          fontSize: '1.2rem',
          fontWeight: 'bold',
          boxShadow: '0 0 10px rgba(56, 189, 248, 0.3)',
          zIndex: 10,
        }}>
          TOTAL: {total}¢
        </div>

        {/* Rolling/Animating Coin */}
        {animatingCoin && (
          <div
            className="rolling-coin"
            style={{
              position: 'absolute',
              left: 40,
              fontSize: '2.5rem',
              top: '30%',
              zIndex: 15,
              animation: 'rollRight 0.8s linear forwards',
            }}
          >
            {animatingCoin}
          </div>
        )}

        {/* Piggy Bank */}
        <div style={{
          fontSize: '3.5rem',
          zIndex: 10,
          filter: done ? 'drop-shadow(0 0 12px var(--green-light-glow))' : 'none',
          transition: 'all 0.3s ease',
          transform: animatingCoin ? 'scale(1.1)' : 'scale(1)',
        }}>
          🐷
        </div>
      </div>

      {/* Coin Selector Panel */}
      <div style={{ display: 'flex', gap: 16, justifyContent: 'center', margin: '20px 0' }}>
        <button className="btn btn-outline" onClick={() => handleAddCoin(25, '🪙')} disabled={done || animatingCoin} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '10px 16px' }}>
          <span style={{ fontSize: '1.8rem' }}>🪙</span>
          <span style={{ fontSize: '0.8rem', fontWeight: 'bold', marginTop: 4 }}>Quarter (25¢)</span>
        </button>

        <button className="btn btn-outline" onClick={() => handleAddCoin(10, '🪙')} disabled={done || animatingCoin} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '10px 16px' }}>
          <span style={{ fontSize: '1.5rem' }}>🪙</span>
          <span style={{ fontSize: '0.8rem', fontWeight: 'bold', marginTop: 4 }}>Dime (10¢)</span>
        </button>

        <button className="btn btn-outline" onClick={() => handleAddCoin(5, '🪙')} disabled={done || animatingCoin} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '10px 16px' }}>
          <span style={{ fontSize: '1.6rem' }}>🪙</span>
          <span style={{ fontSize: '0.8rem', fontWeight: 'bold', marginTop: 4 }}>Nickel (5¢)</span>
        </button>
      </div>

      <div style={{ marginBottom: 12 }}>
        <button className="btn btn-outline btn-sm" onClick={handleReset} disabled={done || total === 0}>
          🗑️ Clear Bank
        </button>
      </div>

      {feedback && (
        <p style={{
          color: done ? 'var(--green-light)' : 'var(--coral)',
          fontWeight: 700,
          fontSize: '0.95rem',
          margin: '12px 0',
          animation: 'bounceIn 0.3s',
        }}>
          {feedback}
        </p>
      )}

      {done && (
        <div style={{ marginTop: 24, animation: 'bounceIn 0.5s' }}>
          {round < 1 ? (
            <button className="btn btn-outline" onClick={() => setRound(r => r + 1)}>
              Play Next Level →
            </button>
          ) : (
            <button className="btn btn-primary btn-lg" onClick={() => { stopNarration(); onComplete(); }}>
              🎉 Complete Simulation!
            </button>
          )}
        </div>
      )}

      <div style={{ marginTop: 16, fontSize: '0.8rem', color: 'var(--text-muted)' }}>Level {round + 1} / 2</div>

      {/* Animation Styles */}
      <style>{`
        @keyframes rollRight {
          0% { left: 80px; transform: rotate(0deg); opacity: 1; }
          80% { left: 240px; transform: rotate(360deg); opacity: 1; }
          100% { left: 260px; top: 50%; transform: scale(0.6); opacity: 0; }
        }
      `}</style>
    </div>
  );
}

// ═══════════════════════════════════════════════════
// Main SimulatePhase
// ═══════════════════════════════════════════════════
export default function SimulatePhase({ onComplete, audioEnabled }) {
  const [station, setStation] = useState(0);
  const nextStation = useCallback(() => { if (station < 2) setStation(s => s + 1); }, [station]);

  return (
    <div className="simulate-phase">
      <div className="simulate-header">
        <h3 className="simulate-label">🧪 Simulate</h3>
        <p className="simulate-sublabel">Inspect & Interact — discover how money is built!</p>
      </div>
      <div className="progress-dots">
        {STATIONS.map((s, i) => (
          <div key={i} className="simulate-dot-wrapper" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
            <div className={`progress-dot ${i === station ? 'active' : i < station ? 'completed' : ''}`}
                 style={{
                   width: 14,
                   height: 14,
                   borderRadius: '50%',
                   background: i === station ? 'var(--blue-light)' : i < station ? 'var(--green-light)' : 'rgba(255,255,255,0.2)',
                   boxShadow: i === station ? '0 0 10px var(--blue-light-glow)' : 'none',
                   transition: 'all 0.3s ease'
                 }} />
            <span style={{ fontSize: '1.2rem', marginTop: 4 }}>{s.icon}</span>
            <span style={{ fontSize: '0.75rem', color: i === station ? 'var(--text-primary)' : 'var(--text-muted)', fontWeight: i === station ? 700 : 400 }}>{s.title}</span>
          </div>
        ))}
      </div>
      <div className="glass-card" style={{ maxWidth: 750, width: '100%', animation: 'slideUp 0.4s ease', margin: '0 auto' }}>
        {station === 0 && <Station1 audioEnabled={audioEnabled} onNext={nextStation} />}
        {station === 1 && <Station2 audioEnabled={audioEnabled} onNext={nextStation} />}
        {station === 2 && <Station3 audioEnabled={audioEnabled} onComplete={onComplete} />}
      </div>
    </div>
  );
}
