import { useState, useEffect, useCallback, useRef } from 'react';
import { narrate, stopNarration, preloadNarration } from '../utils/audio';
import { getStoryNarration } from '../utils/narration';

const STORY_SLIDES = [
  {
    image: '/images/m1.png',
    slideColor: 'linear-gradient(135deg, #14532d 0%, #064e3b 100%)',
    accentColor: '#4ade80',
    fallbackIcon: '🪙',
    fallbackLabel: 'The Scattered Treasury',
    slideNum: 1,
    title: 'The Scattered Treasury',
    text: 'Long ago, the Royal Treasury of the Treasure Market Kingdom was filled with sparkling coins and colorful notes, keeping the kingdom prosperous.',
    highlight: "A mysterious storm scattered the kingdom's money across six enchanted lands!",
    mascotText: 'Oh no! The shops are closed and the market stands are empty! 🪙',
  },
  {
    image: '/images/m2.png',
    slideColor: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)',
    accentColor: '#818cf8',
    fallbackIcon: '🦉',
    fallbackLabel: 'The Treasury Adventurers',
    slideNum: 2,
    title: 'The Treasury Adventurers',
    text: 'Professor Moneybag, the wise owl guardian, recruits Emma, Liam, Sophia, Mike, Sarah, and John as Treasury Adventurers to find the lost money.',
    highlight: 'Emma, Liam, Sophia, Mike, Sarah, and John are chosen to recover the lost currency.',
    mascotText: 'We need your help to explore the lands and learn their secrets! 🦉',
  },
  {
    image: '/images/m3.png',
    slideColor: 'linear-gradient(135deg, #065f46 0%, #15803d 100%)',
    accentColor: '#22c55e',
    fallbackIcon: '🌲',
    fallbackLabel: 'The Coin Forest',
    slideNum: 3,
    title: 'World 1 — The Coin Forest',
    text: 'First, Emma heads into the sparkling Coin Forest, where shiny coins grow on magical trees and glow in streams. We must identify each coin!',
    highlight: 'We will learn to identify and sort coins by their size, color, and name.',
    mascotText: 'Look closely at the details on each coin! 🌲',
  },
  {
    image: '/images/m4.png',
    slideColor: 'linear-gradient(135deg, #0c4a6e 0%, #0369a1 100%)',
    accentColor: '#38bdf8',
    fallbackIcon: '🌊',
    fallbackLabel: 'The Silver River',
    slideNum: 4,
    title: 'World 2 — The Silver River',
    text: 'Next, Liam travels to the Silver River. Here, coins float downstream, and bridges of different heights represent their values.',
    highlight: "Remember, a larger physical size doesn't always mean greater value!",
    mascotText: 'We will learn to compare coin values and order them from least to greatest. 🌊',
  },
  {
    image: '/images/m5.png',
    slideColor: 'linear-gradient(135deg, #3b0764 0%, #581c87 100%)',
    accentColor: '#c084fc',
    fallbackIcon: '🏰',
    fallbackLabel: 'The Note Castle',
    slideNum: 5,
    title: 'World 3 — The Note Castle',
    text: 'In Note Castle, Sophia discovers grand rooms decorated with colorful banknotes. We must learn about paper bills like one-dollar and five-dollar notes!',
    highlight: 'We will recognize dollar bills and compare their values to coins.',
    mascotText: 'Look at the portraits and bright colors on the notes! 🏰',
  },
  {
    image: '/images/m6.png',
    slideColor: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
    accentColor: '#0ea5e9',
    fallbackIcon: '🏦',
    fallbackLabel: 'The Treasure Bank',
    slideNum: 6,
    title: 'World 4 — The Treasure Bank',
    text: 'At the Treasure Bank, Mike and Banker Reginald load conveyor belts with coins and notes. We will practice skip-counting to count large collections.',
    highlight: 'We will count mixed collections of coins and notes quickly and accurately.',
    mascotText: 'Skip-counting by fives and tens makes counting money super fast! 🏦',
  },
  {
    image: '/images/m7.png',
    slideColor: 'linear-gradient(135deg, #7c2d12 0%, #9a3412 100%)',
    accentColor: '#f97316',
    fallbackIcon: '🛒',
    fallbackLabel: 'The Market Square',
    slideNum: 7,
    title: 'World 5 — The Market Square',
    text: 'At the Market Square, Sarah meets friendly shopkeepers. We will use a virtual wallet to pay the exact amount for delicious bread, toys, and flowers.',
    highlight: 'We will read price tags and choose the right money to make purchases.',
    mascotText: 'Shopping is where our money skills become real-world power! 🛒',
  },
  {
    image: '/images/m8.png',
    slideColor: 'linear-gradient(135deg, #713f12 0%, #854d0e 100%)',
    accentColor: '#eab308',
    fallbackIcon: '👑',
    fallbackLabel: 'The Royal Bazaar',
    slideNum: 8,
    title: 'World 6 — The Royal Bazaar',
    text: 'Finally, John challenges the Treasury Guardian, Crystal the Dragon. Solve the ultimate counting and shopping puzzles to unlock the Royal Treasury!',
    highlight: 'Restore all lost money to the Royal Treasury and become a Master Treasurer!',
    mascotText: "Let's complete our quest and restore prosperity to the kingdom! 👑",
  },
];

export default function StoryPhase({ onComplete, audioEnabled }) {
  const [slide, setSlide] = useState(0);
  const [animating, setAnimating] = useState(false);
  const [textVisible, setTextVisible] = useState(false);
  const [hlVisible, setHlVisible] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);
  const [imgError, setImgError] = useState(false);
  const narrationRef = useRef(null);

  const s = STORY_SLIDES[slide];
  const isLast = slide === STORY_SLIDES.length - 1;
  const progress = ((slide + 1) / STORY_SLIDES.length) * 100;

  // Preload next slide audio
  useEffect(() => {
    if (audioEnabled) {
      preloadNarration(getStoryNarration(slide));
      if (slide + 1 < STORY_SLIDES.length) {
        preloadNarration(getStoryNarration(slide + 1));
      }
    }
  }, [slide, audioEnabled]);

  // Reset state on slide change
  useEffect(() => {
    setTextVisible(false);
    setHlVisible(false);
    setImgLoaded(false);
    setImgError(false);

    const t1 = setTimeout(() => setTextVisible(true), 150);
    const t2 = setTimeout(() => setHlVisible(true), 900);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [slide]);

  // Play narration when text becomes visible
  useEffect(() => {
    if (textVisible && audioEnabled) {
      narrationRef.current?.cancel();
      narrationRef.current = narrate(getStoryNarration(slide), true);
    }
    return () => { narrationRef.current?.cancel(); };
  }, [textVisible, slide, audioEnabled]);

  const goNext = useCallback(() => {
    if (animating) return;
    narrationRef.current?.cancel();
    stopNarration();
    setAnimating(true);
    setTimeout(() => {
      if (isLast) onComplete();
      else setSlide(i => i + 1);
      setAnimating(false);
    }, 350);
  }, [animating, isLast, onComplete]);

  const goPrev = useCallback(() => {
    if (animating || slide === 0) return;
    narrationRef.current?.cancel();
    stopNarration();
    setAnimating(true);
    setTimeout(() => { setSlide(i => i - 1); setAnimating(false); }, 350);
  }, [animating, slide]);

  return (
    <div className="story-phase">

      {/* ── Top progress bar ── */}
      <div className="story-progress-row">
        <span className="story-progress-label">
          📖 Story — {slide + 1} / {STORY_SLIDES.length}
        </span>
        <div className="story-progress-bar">
          <div className="story-progress-fill" style={{ width: `${progress}%` }} />
        </div>
      </div>

      {/* ── Main card ── */}
      <div
        className="story-card"
        style={{
          opacity: animating ? 0 : 1,
          transform: animating ? 'scale(0.97) translateY(6px)' : 'scale(1) translateY(0)',
          transition: 'opacity 0.35s ease, transform 0.35s ease',
        }}
      >

        {/* ════ IMAGE ZONE (top half) ════ */}
        <div
          className="story-image-zone"
          style={{ background: s.slideColor }}
        >
          {/* Slide number badge */}
          <div className="story-slide-badge" style={{ borderColor: s.accentColor, color: s.accentColor }}>
            Slide {s.slideNum} / {STORY_SLIDES.length}
          </div>

          {/* Try loading the real image */}
          {!imgError && (
            <img
              key={s.image}
              src={s.image}
              alt={s.title}
              className="story-image"
              style={{ opacity: imgLoaded ? 1 : 0, transition: 'opacity 0.4s ease' }}
              onLoad={() => setImgLoaded(true)}
              onError={() => setImgError(true)}
            />
          )}

          {/* Placeholder shown while loading OR when image is missing */}
          {(!imgLoaded || imgError) && (
            <div className="story-image-placeholder">
              <div className="story-placeholder-icon">{s.fallbackIcon}</div>
              <div className="story-placeholder-label" style={{ color: s.accentColor }}>
                {imgError ? '🖼️ Image: ' + s.fallbackLabel : '⏳ Loading image…'}
              </div>
              <div className="story-placeholder-hint">
                {imgError ? `Place money_art_${s.slideNum}.png in /public/images/` : ''}
              </div>
              {/* Decorative line */}
              <div className="story-symmetry-line" style={{ background: s.accentColor }} />
            </div>
          )}

          {/* Bottom gradient fade into card body */}
          <div className="story-image-fade" />
        </div>

        {/* ════ TEXT ZONE (bottom half) ════ */}
        <div className="story-text-zone">

          <div>
            <h2
              className="story-title"
              style={{ color: s.accentColor }}
            >
              {s.title}
            </h2>

            <p
              className="story-body-text"
              style={{
                opacity: textVisible ? 1 : 0,
                transform: textVisible ? 'translateY(0)' : 'translateY(12px)',
                transition: 'opacity 0.5s ease, transform 0.5s ease',
              }}
            >
              {s.text}
            </p>
          </div>

          {/* Key-concept highlight */}
          <div
            className="story-highlight-box"
            style={{
              opacity: hlVisible ? 1 : 0,
              transform: hlVisible ? 'translateY(0)' : 'translateY(10px)',
              transition: 'opacity 0.5s ease 0.2s, transform 0.5s ease 0.2s',
              borderColor: s.accentColor + '55',
              background: s.accentColor + '14',
            }}
          >
            <span className="story-highlight-star">✨</span>
            <span className="story-highlight-text">{s.highlight}</span>
          </div>

          {/* Mascot speech */}
          <div className="story-mascot-row">
            <div className="story-mascot-avatar">🦉</div>
            <div className="story-mascot-bubble" style={{ color: '#0f172a' }}>
              {s.mascotText}
            </div>
          </div>
        </div>
      </div>

      {/* ── Navigation ── */}
      <div className="story-nav">
        <button
          className="btn btn-outline btn-sm"
          onClick={goPrev}
          disabled={slide === 0 || animating}
          style={{ opacity: slide === 0 ? 0.3 : 1 }}
        >
          ← Back
        </button>

        {/* Dot indicators */}
        <div className="story-dots">
          {STORY_SLIDES.map((_, i) => (
            <div
              key={i}
              className={`story-dot ${i === slide ? 'active' : i < slide ? 'completed' : ''}`}
              style={i === slide ? { background: s.accentColor, boxShadow: `0 0 8px ${s.accentColor}88` } : {}}
            />
          ))}
        </div>

        <button
          className={`btn btn-sm ${isLast ? 'btn-green' : 'btn-primary'}`}
          onClick={goNext}
          disabled={animating}
        >
          {isLast ? "🚀 Let's Explore!" : 'Next →'}
        </button>
      </div>
    </div>
  );
}
