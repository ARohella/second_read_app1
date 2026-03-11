# Second Read - Setup Complete ✅

## What's Been Done

### 1. Hardcoded Gemini API Key
- **File**: [src/services/ai.ts](src/services/ai.ts#L28)
- The Gemini API key is now hardcoded in the app
- No user configuration needed - AI works out of the box

### 2. Clean UI
- **Removed**: "Second Read" header from chat list
- **Dark theme**: Neon green (#13ec6d) on dark background (#102218)
- **Minimalist**: No clutter, proper iPhone spacing

### 3. Fresh Start Every Time
- App clears all data on launch
- Always shows full onboarding flow
- Perfect for demos and testing

### 4. Real AI Integration
- **Second Read**: Analyzes your draft messages in real-time
  - 1-second debounce to avoid excessive API calls
  - Shows risk level + suggestions
  - Only triggers on potentially problematic messages

- **Reply Assist**: Generates AI-powered reply suggestions
  - Analyzes incoming emotional messages
  - Provides 3 different draft approaches
  - Adapts to selected intent and tone

### 5. Demo Contacts Pre-loaded
- **Emma** (girlfriend): Has an emotional message ready
- **Alex Rivera** (coworker): Has a work pressure message ready
- All incoming messages are hardcoded
- Your replies are typed by you and analyzed by real AI

## How to Run

```bash
npx expo start
```

Then press `i` for iOS simulator or scan QR code with Expo Go app.

## Demo Flow

### 1. Onboarding
- Create your identity (any name)
- Skip QR screen → Continue to Chats

### 2. Emma Chat (Reply Assist Demo)
- See Emma's long emotional message
- Tap "Help me reply" button below her message
- AI analyzes her feelings and generates 3 draft replies
- Pick a draft or change intent/tone to regenerate
- Draft populates in composer

### 3. Alex Chat (Second Read Demo)
- See Alex's work pressure message
- Type a reply (try something defensive like "I'll finish it when I can")
- After 1 second, Second Read card appears
- Shows risk assessment + suggestions
- Apply suggestion or send anyway

## Technical Details

### API Key
- Hardcoded in `src/services/ai.ts`
- No user configuration required
- Uses Gemini 2.0 Flash model

### Demo Mode
- `DEMO_MODE = false` in constants (using real AI)
- Demo contacts always show in chat list
- Incoming messages are hardcoded
- User replies trigger real AI analysis

### TypeScript
✅ Clean compilation - no errors

### File Structure
```
app/
  index.tsx              → Always clears data, shows onboarding
  onboarding.tsx         → Dark themed identity creation
  (main)/
    index.tsx            → Chat list with Emma + Alex
  chat/[id].tsx          → Chat screen with live AI
src/
  services/
    ai.ts                → Gemini API integration (hardcoded key)
  lib/
    demo-data.ts         → Pre-loaded incoming messages
    constants.ts         → Dark theme colors, DEMO_MODE flag
```

## Key Features Working

✅ End-to-end encryption (visual indicators)
✅ Dark theme throughout
✅ Second Read real-time tone analysis
✅ Reply Assist AI-powered drafts
✅ iPhone notch handling
✅ Home indicators
✅ Loading states
✅ Error handling
✅ Debounced AI calls

## Notes

- App clears storage on every launch for fresh demos
- Gemini API key is embedded (no user setup needed)
- Demo contacts (Emma, Alex) always visible
- Real AI analyzes all user-typed messages
- Pre-written incoming messages for consistency
