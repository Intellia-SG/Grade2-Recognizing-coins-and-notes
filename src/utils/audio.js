// ──────────────────────────────────────────────────
// Audio & Voice Narration Engine — Treasure Market Adventure
// Plays pre-generated MP3s only (offline audio) — fallback / default voice removed
// ──────────────────────────────────────────────────

import { audioMap } from './audioMap.js';

let currentQueue = null;
let isSpeaking   = false;
let currentAudio = null;
let playId       = 0;

// Clean text for map matching (remove markdown bolding and emojis)
export function sanitizeText(text) {
  if (!text) return '';
  return text
    .replace(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/gu, '')
    .replace(/[*_`#]/g, '')
    .trim();
}

// ─── Core speak — Offline MP3 Only ──────────────────
export function speak(text, enabled = true) {
  return new Promise((resolve) => {
    if (!enabled || !text?.trim()) {
      resolve();
      return;
    }

    playId++;
    const currentPlayId = playId;
    isSpeaking = true;

    // Stop and clean up any currently playing audio
    if (currentAudio) {
      try {
        currentAudio.pause();
        currentAudio.currentTime = 0;
      } catch (e) { /* ignore */ }
      currentAudio = null;
    }

    // Safety: cancel any residual browser speech synthesis if active
    if (typeof window !== 'undefined' && 'speechSynthesis' in window && window.speechSynthesis.speaking) {
      try {
        window.speechSynthesis.cancel();
      } catch (e) { /* ignore */ }
    }

    const clean = sanitizeText(text);
    const offlinePath = audioMap[text] || audioMap[clean];

    if (offlinePath) {
      const audio = new Audio(offlinePath);
      currentAudio = audio;

      audio.onended = () => {
        if (playId === currentPlayId) {
          isSpeaking = false;
          currentAudio = null;
        }
        resolve();
      };

      audio.onerror = () => {
        if (playId === currentPlayId) {
          isSpeaking = false;
          currentAudio = null;
        }
        resolve();
      };

      audio.play().catch(() => {
        // Intentionally stopped/aborted by slide navigation or autoplay — resolve cleanly without default voice
        if (playId === currentPlayId) {
          isSpeaking = false;
          currentAudio = null;
        }
        resolve();
      });
    } else {
      // No MP3 found — resolve silently without triggering any default/fallback voice
      if (playId === currentPlayId) isSpeaking = false;
      resolve();
    }
  });
}

// ─── Narration Segment Types ─────────────────────
export function seg(text, style = 'statement', pause = 400) {
  return { text, style, pause };
}

export const say       = (text, pause = 0) => seg(text, 'statement',     pause);
export const ask       = (text, pause = 0) => seg(text, 'question',      pause);
export const cheer     = (text, pause = 0) => seg(text, 'encouragement', pause);
export const emphasize = (text, pause = 0) => seg(text, 'emphasis',      pause);
export const think     = (text, pause = 0) => seg(text, 'thinking',      pause);
export const celebrate = (text, pause = 0) => seg(text, 'celebration',   pause);
export const instruct  = (text, pause = 0) => seg(text, 'instruction',   pause);
export const pause     = (ms  = 0)         => seg('',  'statement',      ms);

// ─── Preload MP3s into browser cache ─────────────
export function preloadNarration(segments) {
  if (!segments) return;
  segments.forEach(s => {
    const path = s.text?.trim() && (audioMap[s.text] || audioMap[sanitizeText(s.text)]);
    if (path) {
      const a = new Audio(path);
      a.preload = 'auto';
    }
  });
}

// ─── Narration queue ─────────────────────────────
export function narrate(segments, enabled = true) {
  const queueId = Symbol('narration');
  currentQueue  = queueId;
  let cancelled = false;

  const cancel = () => {
    cancelled = true;
    if (currentQueue === queueId) {
      if (currentAudio) {
        try {
          currentAudio.pause();
          currentAudio.currentTime = 0;
        } catch (e) { /* ignore */ }
        currentAudio = null;
      }
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        try { window.speechSynthesis.cancel(); } catch (e) {}
      }
      isSpeaking   = false;
      currentQueue = null;
    }
  };

  const promise = (async () => {
    if (!enabled || !segments?.length) return;

    for (let i = 0; i < segments.length; i++) {
      const segment = segments[i];
      if (cancelled || currentQueue !== queueId) return;

      if (segment.text?.trim()) {
        await speak(segment.text, enabled);
      }

      if (segment.pause > 0 && !cancelled && currentQueue === queueId) {
        await new Promise(r => setTimeout(r, segment.pause));
      }
    }
  })();

  return { cancel, promise };
}

// ─── Stop Narration ──────────────────────────────
export function stopNarration() {
  playId++;
  currentQueue = null;
  if (currentAudio) {
    try {
      currentAudio.pause();
      currentAudio.currentTime = 0;
    } catch (e) { /* ignore */ }
    currentAudio = null;
  }
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    try {
      window.speechSynthesis.cancel();
    } catch (e) {}
  }
  isSpeaking = false;
}

// ─── Simple tone generation (UI sounds only) ─────
let audioCtx = null;
function getCtx() {
  if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  return audioCtx;
}

export function playTone(frequency, duration = 200) {
  try {
    const ctx  = getCtx();
    const osc  = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.frequency.value = frequency;
    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration / 1000);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + duration / 1000);
  } catch (e) { /* silent */ }
}

export const sounds = {
  correct: () => { playTone(523, 150); setTimeout(() => playTone(659, 150), 150); setTimeout(() => playTone(784, 200), 300); },
  wrong:   () => { playTone(220, 300); },
  badge:   () => { [523, 659, 784, 1047].forEach((f, i) => setTimeout(() => playTone(f, 200), i * 150)); },
  click:   () =>   playTone(440, 80),
  streak:  () => { playTone(880, 100); setTimeout(() => playTone(1100, 150), 100); },
};

// Legacy compatibility
export async function getAudioUrl(text) {
  return audioMap[text] || audioMap[sanitizeText(text)] || null;
}
