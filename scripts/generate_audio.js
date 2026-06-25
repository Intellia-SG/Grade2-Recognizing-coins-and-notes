import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Load API key from .env.local
const envPath = path.join(__dirname, '../.env.local');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  envContent.split('\n').forEach(line => {
    const [key, ...val] = line.split('=');
    if (key && val.length) process.env[key.trim()] = val.join('=').trim();
  });
}

// ── API Configuration ────────────────────────────────────────────────────────
const API_KEY  = process.env.VITE_ELEVENLABS_API_KEY;
if (!API_KEY) {
  console.error('❌ Missing VITE_ELEVENLABS_API_KEY in .env.local');
  process.exit(1);
}
const VOICE_ID = 'Xb7hH8MSUJpSbSDYk0k2'; // Alice (Professor Moneybag / Emma)
const MODEL_ID = 'eleven_multilingual_v2';

const audioDir = path.join(__dirname, '../public/assets/audio');
if (!fs.existsSync(audioDir)) fs.mkdirSync(audioDir, { recursive: true });

// ── Voice style presets ──────────────────────────────────────────────────────
const STYLE_SETTINGS = {
  celebration:  { stability: 0.12, similarity_boost: 0.45, style: 0.75, use_speaker_boost: true },
  encouragement:{ stability: 0.16, similarity_boost: 0.50, style: 0.65, use_speaker_boost: true },
  question:     { stability: 0.20, similarity_boost: 0.55, style: 0.55, use_speaker_boost: true },
  emphasis:     { stability: 0.16, similarity_boost: 0.50, style: 0.60, use_speaker_boost: true },
  thinking:     { stability: 0.24, similarity_boost: 0.60, style: 0.35, use_speaker_boost: true },
  instruction:  { stability: 0.18, similarity_boost: 0.52, style: 0.55, use_speaker_boost: true },
  statement:    { stability: 0.20, similarity_boost: 0.55, style: 0.50, use_speaker_boost: true },
};

// ── All narration phrases (Coins & Notes) ─────────────────────────────
const PHRASES = [
  // ── Intro ──
  { text: "Welcome to the Treasure Market Adventure!", style: 'encouragement' },
  { text: "Today, we are going to learn about recognizing coins and paper notes.", style: 'statement' },
  { text: "Can we identify their values and count them to buy treasures in the market?", style: 'question' },
  { text: "Are you ready to join Emma, Liam, and the other adventurers? Let us get started!", style: 'encouragement' },

  // ── Wonder ──
  { text: "Why do different coins have different sizes and colors? Is a bigger coin always worth more?", style: 'question' },
  { text: "Sometimes small coins are worth more than big ones! Let's find out why!", style: 'statement' },
  { text: "Why does paper money have faces of famous people on them? What do they mean?", style: 'question' },
  { text: "Banknotes are full of secret pictures, colors, and numbers that tell us their value!", style: 'statement' },
  { text: "If you have 4 quarters and a 1-dollar bill, which one is worth more?", style: 'question' },
  { text: "Surprisingly, they are worth the exact same amount! That's equivalent value!", style: 'statement' },
  { text: "How does a shopkeeper know you've given the right amount of money to buy a toy?", style: 'question' },
  { text: "Counting and adding up coins and notes lets us make transactions in daily life!", style: 'statement' },
  { text: "Let's go discover money!", style: 'encouragement' },

  // ── Story ──
  { text: "Long ago, the Royal Treasury of the Treasure Market Kingdom was filled with sparkling coins and colorful notes, keeping the kingdom prosperous.", style: 'statement' },
  { text: "A mysterious storm scattered the kingdom's money across six enchanted lands!", style: 'statement' },
  { text: "Professor Moneybag, the wise owl guardian, recruits Emma, Liam, Sophia, Mike, Sarah, and John as Treasury Adventurers to find the lost money.", style: 'statement' },
  { text: "We need your help to explore the lands and learn their secrets!", style: 'statement' },
  { text: "First, Emma heads into the sparkling Coin Forest, where shiny coins grow on magical trees and glow in streams.", style: 'statement' },
  { text: "We will learn to identify and sort coins by their size, color, and name.", style: 'emphasis' },
  { text: "Next, Liam travels to the Silver River. Here, coins float downstream, and bridges of different heights represent their values.", style: 'statement' },
  { text: "We will learn to compare coin values and order them from least to greatest.", style: 'emphasis' },
  { text: "In Note Castle, Sophia discovers grand rooms decorated with colorful banknotes.", style: 'statement' },
  { text: "We will recognize dollar bills like one-dollar and five-dollar notes and compare their values to coins.", style: 'emphasis' },
  { text: "At the Treasure Bank, Mike and Banker Reginald load conveyor belts with coins and notes.", style: 'statement' },
  { text: "We will practice skip-counting to count large collections of money quickly and accurately.", style: 'emphasis' },
  { text: "At the Market Square, Sarah meets friendly shopkeepers.", style: 'statement' },
  { text: "We will use our virtual wallet to pay the exact amount for delicious bread, toys, and flowers.", style: 'emphasis' },
  { text: "Finally, John challenges the Treasury Guardian, Crystal the Dragon.", style: 'statement' },
  { text: "Solve the ultimate counting and shopping puzzles to unlock the Royal Treasury!", style: 'emphasis' },
  { text: "Let's restore all lost money and become a Master Treasurer!", style: 'statement' },

  // ── Simulate ──
  { text: "Click on a coin to flip it and examine its details! Match the coin to its correct name and value.", style: 'instruction' },
  { text: "Inspect the dollar bill using your magnifying glass! Tap the highlighted areas to discover security details, portraits, and denominations.", style: 'instruction' },
  { text: "Drag and drop the coins onto the conveyor belt to count them! Watch the total on the screen grow.", style: 'instruction' },
  { text: "Excellent! You matched the coin to its value!", style: 'celebration' },
  { text: "Great job! You found all the secrets on the banknote!", style: 'celebration' },
  { text: "Fantastic counting! You fed the piggy bank perfectly!", style: 'celebration' },

  // ── Play ──
  { text: "Welcome to the Coin Forest!", style: 'celebration' },
  { text: "Welcome to the Silver River!", style: 'celebration' },
  { text: "Welcome to the Note Castle!", style: 'celebration' },
  { text: "Welcome to the Treasure Bank!", style: 'celebration' },
  { text: "Welcome to the Market Square!", style: 'celebration' },
  { text: "Welcome to the Royal Bazaar!", style: 'celebration' },
  { text: "Let's solve some money challenges!", style: 'statement' },
  { text: "That's correct!", style: 'encouragement' },
  { text: "Incredible streak!", style: 'encouragement' },
  { text: "Try again on the next one!", style: 'statement' },
  { text: "Coin Forest Complete!", style: 'celebration' },
  { text: "Silver River Complete!", style: 'celebration' },
  { text: "Note Castle Complete!", style: 'celebration' },
  { text: "Treasure Bank Complete!", style: 'celebration' },
  { text: "Market Square Complete!", style: 'celebration' },
  { text: "Royal Bazaar Complete!", style: 'celebration' },

  // ── Reflect ──
  { text: "What did you learn about coins and notes?", style: 'question' },
  { text: "Excellent! You taught Professor Moneybag well!", style: 'encouragement' },
  { text: "Almost! Let's think about coin values and bills.", style: 'statement' },
  { text: "How confident do you feel about recognizing and counting money?", style: 'question' },
  { text: "Quest complete!", style: 'celebration' },
  { text: "Let us check your final score on the certificate.", style: 'statement' },
];

// ── Generator ────────────────────────────────────────────────────────────────
async function generate() {
  const mapData = {};

  for (let i = 0; i < PHRASES.length; i++) {
    const { text, style } = PHRASES[i];
    const safeName = text.toLowerCase().replace(/[^a-z0-9]/g, '_').substring(0, 50);
    const filename  = `money_audio_${safeName}_${i}.mp3`;
    const filepath  = path.join(audioDir, filename);

    mapData[text] = `/assets/audio/${filename}`;

    if (fs.existsSync(filepath)) {
      console.log(`⏭  Skipping (already exists): ${filename}`);
      continue;
    }

    console.log(`🎙  Generating [${i + 1}/${PHRASES.length}]: ${filename}`);

    const voiceSettings = STYLE_SETTINGS[style] || STYLE_SETTINGS.statement;

    try {
      const res = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'xi-api-key': API_KEY,
        },
        body: JSON.stringify({
          text,
          model_id: MODEL_ID,
          voice_settings: voiceSettings,
        }),
      });

      if (!res.ok) {
        const errText = await res.text();
        console.error(`❌ Failed [${i}]: ${res.status} ${res.statusText}`);
        console.error(errText);
        continue;
      }

      const buffer = await res.arrayBuffer();
      fs.writeFileSync(filepath, Buffer.from(buffer));
      console.log(`✅ Saved: ${filename}`);
    } catch (err) {
      console.error(`❌ Error with ${filename}:`, err.message);
    }

    // Respect rate limits
    await new Promise(r => setTimeout(r, 600));
  }

  // Write audio map
  const mapFile = path.join(__dirname, '../src/utils/audioMap.js');
  fs.writeFileSync(
    mapFile,
    `// Auto-generated by scripts/generate_audio.js — DO NOT EDIT MANUALLY\nexport const audioMap = ${JSON.stringify(mapData, null, 2)};\n`
  );
  console.log('\n🎉 Done! Audio map saved to src/utils/audioMap.js');
}

generate();
