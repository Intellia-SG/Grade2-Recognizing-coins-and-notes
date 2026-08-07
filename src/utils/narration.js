// ──────────────────────────────────────────────────
// Narration Scripts — Treasure Market Adventure (Coins & Notes)
// ──────────────────────────────────────────────────

import { say, ask, cheer, emphasize, think, celebrate, instruct, pause } from './audio';

// ─── INTRO SCREEN ────────────────────────────────
export function introNarration() {
  return [
    cheer("Welcome to the Treasure Market Adventure!"),
    say("Today, we are going to learn about recognizing coins and paper notes."),
    ask("Can we identify their values and count them to buy treasures in the market?"),
    cheer("Are you ready to join Wei Ming on this adventure? Let us get started!"),
  ];
}

// ─── WONDER PHASE ────────────────────────────────
export function wonderNarration(questionText, subtext) {
  return [
    ask(questionText),
    say(subtext),
  ];
}

export function wonderDiscoverNarration() {
  return [
    cheer("Let's go discover money!"),
  ];
}

// ─── STORY PHASE ─────────────────────────────────
export function getStoryNarration(slideIndex) {
  switch (slideIndex) {
    case 0:
      return [
        say("Long ago, the Royal Treasury of the Treasure Market Kingdom was filled with sparkling coins and colorful notes, keeping the kingdom prosperous."),
        say("A mysterious storm scattered the kingdom's money across six enchanted lands!"),
      ];
    case 1:
      return [
        say("Professor Moneybag, the wise owl guardian, recruits Wei Ming as the Master Treasury Adventurer to find the lost money."),
        say("We need your help to explore the lands and learn their secrets!"),
      ];
    case 2:
      return [
        say("First, Wei Ming heads into the sparkling Coin Forest, where shiny coins grow on magical trees and glow in streams."),
        emphasize("We will learn to identify and sort coins by their size, color, and name."),
      ];
    case 3:
      return [
        say("Next, Wei Ming travels to the Silver River. Here, coins float downstream, and bridges of different heights represent their values."),
        emphasize("We will learn to compare coin values and order them from least to greatest."),
      ];
    case 4:
      return [
        say("In Note Castle, Wei Ming discovers grand rooms decorated with colorful banknotes."),
        emphasize("We will recognize dollar bills like one-dollar and five-dollar notes and compare their values to coins."),
      ];
    case 5:
      return [
        say("At the Treasure Bank, Wei Ming and Banker Reginald load conveyor belts with coins and notes."),
        emphasize("We will practice skip-counting to count large collections of money quickly and accurately."),
      ];
    case 6:
      return [
        say("At the Market Square, Wei Ming meets friendly shopkeepers."),
        emphasize("We will use our virtual wallet to pay the exact amount for delicious bread, toys, and flowers."),
      ];
    case 7:
      return [
        cheer("Finally, Wei Ming challenges the Treasury Guardian, Crystal the Dragon."),
        say("Solve the ultimate counting and shopping puzzles to unlock the Royal Treasury!"),
        say("Let's restore all lost money and become a Master Treasurer!"),
      ];
    default:
      return [];
  }
}

// ─── SIMULATE PHASE ──────────────────────────────
export function simulateStation1Intro() {
  return [
    instruct("Click on a coin to flip it and examine its details! Match the coin to its correct name and value."),
  ];
}

export function simulateStation2Intro() {
  return [
    instruct("Inspect the dollar bill using your magnifying glass! Tap the highlighted areas to discover security details, portraits, and denominations."),
  ];
}

export function simulateStation3Intro() {
  return [
    instruct("Drag and drop the coins onto the conveyor belt to count them! Watch the total on the screen grow."),
  ];
}

// ─── PLAY PHASE ──────────────────────────────────
export function playWorldIntro(worldName) {
  return [
    celebrate(`Welcome to the ${worldName}!`),
    say("Let's solve some money challenges!"),
  ];
}

export function playReadQuestion(questionText) {
  return [
    say(questionText),
  ];
}

export function playCorrectNarration(streak = 0) {
  if (streak >= 5) {
    return [cheer("Incredible streak!")];
  }
  return [cheer("That's correct!")];
}

export function playWrongNarration() {
  return [say("Try again on the next one!")];
}

export function playWorldComplete(worldName, score, total) {
  return [
    celebrate(`${worldName} Complete!`),
    say(`You answered ${score} out of ${total} correctly!`),
  ];
}

// ─── REFLECT PHASE ───────────────────────────────
export function reflectIntroNarration() {
  return [
    ask("What did you learn about coins and notes?"),
  ];
}

export function reflectCorrectNarration() {
  return [cheer("Excellent! You taught Professor Moneybag well!")];
}

export function reflectWrongNarration() {
  return [say("Almost! Let's think about coin values and bills.")];
}

export function reflectConfidenceNarration() {
  return [
    ask("How confident do you feel about recognizing and counting money?"),
  ];
}

export function reflectCertificateNarration(pct) {
  return [
    celebrate("Quest complete!"),
    say("Let us check your final score on the certificate."),
  ];
}
