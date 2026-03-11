# Second Read

A lightweight AI-assisted communication tool that analyzes message tone in real time and helps users craft emotionally aware replies.

[![Demo Video](https://img.youtube.com/vi/eRtL4cs831M/maxresdefault.jpg)](https://youtu.be/eRtL4cs831M)

**[Watch the Demo Video](https://youtu.be/eRtL4cs831M)**

## Problem

Text messaging removes vocal tone and body language, which often causes messages to be misinterpreted as rude, dismissive, or cold — even when no harm is intended. These misunderstandings create unnecessary tension in close relationships and work conversations.

## What It Does

Second Read provides two conditional AI features that activate only in emotionally risky moments:

- **Second Read (Tone Analysis)** — When a user types a high-risk message, the system pauses for one second and analyzes tone. A warning card appears only if risk exceeds a threshold (configurable between gentle and strict modes). The AI returns a risk level, brief reasons, and short rewrite suggestions.
- **Reply Assist** — When the user taps "Help me reply" on an emotionally heavy incoming message, the AI analyzes the sender's feelings and generates three reply drafts with different approaches: empathy-first, accountability and repair, and boundary-setting.
- **Privacy-First** — AI features are optional and messaging works normally when AI is off. Analysis triggers only in specific conversation contexts to minimize false positives.

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | React Native (Expo 54) |
| Routing | Expo Router |
| Language | TypeScript |
| AI | Gemini API |
| Storage | AsyncStorage / Expo SQLite |
| Encryption | TweetNaCl |
| UI | React Native Reanimated, QR Code SVG |

## Project Structure

```
second_read_app/
├── app/                    # Expo Router pages
│   ├── (main)/             # Main tab navigator
│   ├── chat/               # Chat screens
│   ├── conversation-settings/
│   ├── onboarding.tsx
│   └── settings.tsx
├── src/
│   ├── components/         # Reusable UI components
│   ├── lib/                # Utilities and helpers
│   ├── services/           # AI and messaging services
│   ├── store/              # State management
│   └── types/              # TypeScript type definitions
├── components/             # Themed components
└── assets/
```

## Getting Started

### Prerequisites

- Node.js 18+
- Expo CLI
- iOS Simulator or Android Emulator (or Expo Go on a physical device)
- Gemini API key

### Installation

```bash
git clone <repo-url>
cd second_read_app
npm install
```

### Run

```bash
npx expo start
```

Then press `i` for iOS simulator or `a` for Android emulator.

### Demo Mode

The demo uses preloaded conversations to showcase features. All data resets on app restart for repeatable walkthroughs.

## Key Design Decisions

- **Conditional activation** — AI analysis only triggers in specific conversation contexts and when messages cross a risk threshold, avoiding annoying false positives
- **Two sensitivity modes** — Gentle mode (flags only high risk) and Strict mode (flags medium + high risk)
- **Optimized prompts** — Reduced by ~75% from initial versions for faster responses and lower API cost
- **Three reply approaches** — Empathy-first, accountability/repair, and boundary-setting give users genuine choice rather than a single "correct" response

## Iteration Highlights

| Issue | Fix | Result |
|-------|-----|--------|
| UI looked too basic and unengaging | Used Google Stitch for visual design, then rebuilt in React Native | Polished, modern interface |
| AI prompts were verbose and slow | Removed ~75% of instructions, keeping only required outputs | Faster responses, lower API cost, no quota issues |
| Analysis triggered on every message | Added conditional logic based on conversation ID and keywords | Fewer false positives, more realistic experience |
