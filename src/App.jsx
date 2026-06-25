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
  const [sessionData, setSessionData] = useState({
    score: 0,
    xp: 0,
    maxStreak: 0,
    totalAnswered: 0,
    worldResults: {}
  });

  const activePhase = PHASES[phaseIndex];

  // Stop narration on phase transition
  useEffect(() => {
    stopNarration();
  }, [phaseIndex]);

  const handleToggleAudio = useCallback(() => {
    sounds.click();
    setAudioEnabled(e => !e);
  }, []);

  const handleHome = useCallback(() => {
    sounds.click();
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
      {/* Interactive geometric background element */}
      <FloatingNumbers />

      {/* Top Header / Control HUD */}
      <div className="top-controls">
        {phaseIndex > 0 ? (
          <button className="home-btn" onClick={handleHome} title="Go Home">
            🏠
          </button>
        ) : (
          <div style={{ width: 44 }} />
        )}

        {/* Phase Indicator Navigation (matches original Equal platform HUD) */}
        {phaseIndex > 0 && phaseIndex < 5 && (
          <div className="journey-bar">
            {['Wonder', 'Story', 'Simulate', 'Play'].map((label, idx) => {
              const stepNum = idx + 1; // 1-indexed for wonder/story/simulate/play
              const active = phaseIndex === stepNum;
              const completed = phaseIndex > stepNum;
              return (
                <div key={label} style={{ display: 'flex', alignItems: 'center' }}>
                  <div className={`journey-step-indicator ${active ? 'active' : ''} ${completed ? 'completed' : ''}`}>
                    <span>{completed ? '✓' : stepNum}</span>
                    <span>{label}</span>
                  </div>
                  {idx < 3 && <span className="journey-divider">/</span>}
                </div>
              );
            })}
          </div>
        )}

        <button className="audio-toggle-btn" onClick={handleToggleAudio} title="Toggle Speech Narration">
          {audioEnabled ? '🔊 ON' : '🔇 OFF'}
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
    </div>
  );
}
