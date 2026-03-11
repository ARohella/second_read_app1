# Second Read - Demo Guide

## ✅ What's Complete

### UI Redesign (Dark Theme)
- ✅ Neon green primary (#13ec6d) on dark background (#102218)
- ✅ Proper SafeAreaView edges for iPhone notch
- ✅ Home indicator at bottom of all screens
- ✅ Signal-inspired minimalist design

### Demo Mode Active
The app is running in **DEMO_MODE** (see `src/lib/constants.ts` line 92)

### Screens Redesigned
1. ✅ **Onboarding** - Dark theme with shield icon
2. ✅ **Chat List** - Shows Emma (girlfriend) and Alex (coworker)  
3. ✅ **Chat Screen** - Dark bubbles, demo messages, Second Read + Reply Assist
4. ✅ **Second Read Card** - Inline AI analysis
5. ✅ **Reply Assist Sheet** - Bottom sheet with tabs

## 📱 Demo Flow

### 1. Start the App
```bash
npx expo start
```

### 2. Onboarding
- Dark screen with neon green accents
- Create identity (any name)
- Skip QR screen (tap Continue to Chats)

### 3. Chat List
You'll see 2 conversations:
- **Emma** (1 unread) - Girlfriend scenario
- **Alex Rivera** - Coworker scenario  

### 4. Emma Chat (Reply Assist Demo)
**What to show:**
1. Tap Emma
2. See her long emotional message
3. Tap "Help me reply" button below her message
4. **Reply Assist sheet** appears with:
   - Summary tab: "Frustrated, Unheard, Disappointed"
   - Drafts tab: 3 pre-written empathetic replies
   - Checklist tab: Do/Don't guidance
5. Tap "Use this draft" on any reply
6. Draft populates in composer

**Key talking points:**
- "When someone sends an emotionally heavy message, Reply Assist helps you respond thoughtfully"
- "It analyzes their feelings and needs"
- "Gives you 3 draft options with different tones"
- "All E2EE - analysis happens with your explicit consent"

### 5. Alex Chat (Second Read Demo)
**What to show:**
1. Go back to chat list
2. Tap Alex Rivera
3. The composer **auto-fills** with: "I'll finish it when I can. Stop asking."
4. **Second Read card** appears automatically showing:
   - Risk: "Might sound blunt"
   - Why: "Could come across as defensive"
   - Suggestions: Quick rewrites
5. Tap a suggestion chip to apply it
6. OR tap "Send anyway"

**Key talking points:**
- "Second Read analyzes your drafts in real-time"
- "Only triggers on risky messages, not casual stuff like 'ok' or 'lol'"
- "Gives you micro-edits, not full rewrites"
- "Per-chat settings: Off / Gentle / Strict"

## 🎨 Design Highlights

- **Dark theme** inspired by Signal + your reference designs
- **Neon green (#13ec6d)** as primary color
- **Proper iOS spacing** - notch-aware, home indicator
- **Minimalist** - no clutter, clean typography
- **AI transparency** - "E2EE" badges, clear opt-in

## 🔧 Turn Off Demo Mode

To use real data instead of demo:
1. Open `src/lib/constants.ts`
2. Change line 92: `export const DEMO_MODE = false;`
3. Restart the app

## 🚀 What Still Needs Work (for production)

Not needed for demo, but for final app:
- QR display screen (uses old theme)
- Add contact screen (uses old theme)
- Settings screens (uses old theme)
- Real Firebase integration (currently uses AsyncStorage relay)
- Actual Gemini API calls (currently uses pre-written responses)

## 📝 Notes

- The PRNG error should be fixed (react-native-get-random-values polyfill)
- TypeScript compiles cleanly
- All demo screens use the dark theme
- Message bubbles: green for you, dark gray for them

## Demo Script

**Opening:** "Second Read is a privacy-first messenger that helps you avoid tone disasters in your texts."

**Show onboarding:** "It's accountless - no phone number needed. Everything's E2EE."

**Show chat list:** "Here's Emma, my girlfriend, and Alex, my coworker."

**Tap Emma:** "Emma sent me this heavy message. I want to respond well, but I'm not sure what to say."

**Tap Help me reply:** "Reply Assist analyzes what she's actually feeling and needing, then gives me thoughtful draft replies."

**Show drafts:** "I can pick empathy-first, accountability, or boundary-setting. All sound human, not robotic."

**Tap Use draft:** "Boom. Now I can edit it or send as-is."

**Go to Alex:** "Now with my coworker - I'm about to send something defensive."

**Show Second Read:** "Second Read catches it before I hit send. Tells me why it's risky and suggests softer alternatives."

**Apply suggestion:** "I can apply the suggestion or send anyway - I'm always in control."

**Closing:** "That's Second Read. Tone safety meets privacy. All E2EE, no phone number, AI opt-in only."
