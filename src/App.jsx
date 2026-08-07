import { useState, useCallback, useEffect } from 'react';
import FloatingNumbers from './components/FloatingNumbers';
import IntroScreen from './components/IntroScreen';
import WonderPhase from './components/WonderPhase';
import StoryPhase from './components/StoryPhase';
import SimulatePhase from './components/SimulatePhase';
import PlayPhase from './components/PlayPhase';
import ReflectPhase from './components/ReflectPhase';
import { sounds, stopNarration } from './utils/audio';

const PHASES = ['intro', 'wonder', 'story', 'simulate', 'play', 'reflect'];

export default function App() {
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [homeConfirmModal, setHomeConfirmModal] = useState(false);
  const [sessionData, setSessionData] = useState({
    score: 0,
    xp: 0,
    maxStreak: 0,
    totalAnswered: 0,
    worldResults: {}
  });

  const activePhase = PHASES[phaseIndex];

  // Stop narration when switching phases
  useEffect(() => {
    stopNarration();
  }, [phaseIndex]);

  const handleToggleAudio = useCallback(() => {
    sounds.click();
    setAudioEnabled(e => {
      const next = !e;
      if (!next) stopNarration();
      return next;
    });
  }, []);

  const handleHomeClick = useCallback(() => {
    sounds.click();
    if (phaseIndex > 0 && phaseIndex < PHASES.length - 1) {
      setHomeConfirmModal(true);
    } else {
      setPhaseIndex(0);
    }
  }, [phaseIndex]);

  const confirmHome = useCallback(() => {
    stopNarration();
    setHomeConfirmModal(false);
    setPhaseIndex(0);
    setSessionData({
      score: 0,
      xp: 0,
      maxStreak: 0,
      totalAnswered: 0,
      worldResults: {}
    });
  }, []);

  const nextPhase = useCallback(() => {
    sounds.click();
    setPhaseIndex(idx => Math.min(idx + 1, PHASES.length - 1));
  }, []);

  const handlePlayComplete = useCallback((data) => {
    setSessionData(data);
    nextPhase();
  }, [nextPhase]);

  const handleReflectComplete = useCallback(() => {
    sounds.click();
    setPhaseIndex(0); // Restart journey
    setSessionData({
      score: 0,
      xp: 0,
      maxStreak: 0,
      totalAnswered: 0,
      worldResults: {}
    });
  }, []);

  return (
    <div className="app-container">
      {/* Interactive background particle element */}
      <FloatingNumbers />

      {/* Top Header Controls */}
      <div className="top-controls">
        {phaseIndex > 0 ? (
          <button className="home-btn" onClick={handleHomeClick} title="Return Home">
            🏠
          </button>
        ) : (
          <div style={{ width: 50 }} />
        )}

        {/* Phase Indicator Navigation Bar */}
        {phaseIndex > 0 && phaseIndex <= 5 && (
          <div className="journey-bar">
            {['Wonder', 'Story', 'Simulate', 'Practice', 'Reflect'].map((label, idx) => {
              const stepNum = idx + 1;
              const active = phaseIndex === stepNum;
              const completed = phaseIndex > stepNum;
              return (
                <div key={label} style={{ display: 'flex', alignItems: 'center' }}>
                  <div className={`journey-step-indicator ${active ? 'active' : ''} ${completed ? 'completed' : ''}`}>
                    <span>{completed ? '✓' : stepNum}</span>
                    <span>{label}</span>
                  </div>
                  {idx < 4 && <span className="journey-divider">/</span>}
                </div>
              );
            })}
          </div>
        )}

        {/* Circular Gold Audio Toggle Button (Positioned near inner container) */}
        <button
          className={`audio-toggle-btn ${audioEnabled ? 'sound-on' : 'sound-off'}`}
          onClick={handleToggleAudio}
          title={audioEnabled ? "Mute Narration" : "Unmute Narration"}
          aria-label="Toggle Audio Narration"
        >
          <span className="audio-icon">{audioEnabled ? '🔊' : '🔇'}</span>
        </button>
      </div>

      {/* Learning Phase Container */}
      <div className="content-area">
        {activePhase === 'intro' && (
          <IntroScreen
            onStart={nextPhase}
            audioEnabled={audioEnabled}
          />
        )}
        {activePhase === 'wonder' && (
          <WonderPhase
            onComplete={nextPhase}
            audioEnabled={audioEnabled}
          />
        )}
        {activePhase === 'story' && (
          <StoryPhase
            onComplete={nextPhase}
            audioEnabled={audioEnabled}
          />
        )}
        {activePhase === 'simulate' && (
          <SimulatePhase
            onComplete={nextPhase}
            audioEnabled={audioEnabled}
          />
        )}
        {activePhase === 'play' && (
          <PlayPhase
            onComplete={handlePlayComplete}
            audioEnabled={audioEnabled}
          />
        )}
        {activePhase === 'reflect' && (
          <ReflectPhase
            onComplete={handleReflectComplete}
            audioEnabled={audioEnabled}
            sessionData={sessionData}
          />
        )}
      </div>

      {/* Exit Confirmation Modal */}
      {homeConfirmModal && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: 400, textAlign: 'center' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: 8 }}>🏠</div>
            <h3 style={{ color: 'var(--coral)', marginBottom: 8 }}>Return to Main Menu?</h3>
            <p style={{ color: 'var(--text-secondary)', marginBottom: 20, fontSize: '0.9rem' }}>
              Are you sure you want to return home? Your current journey progress will be reset.
            </p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
              <button className="btn btn-outline" onClick={() => setHomeConfirmModal(false)}>
                Cancel
              </button>
              <button className="btn btn-primary" onClick={confirmHome} style={{ background: 'var(--coral)' }}>
                Yes, Go Home
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
