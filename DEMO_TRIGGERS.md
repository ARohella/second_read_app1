# Demo Mode Trigger Phrases

## How to Demo the App

### Alex (Coworker) Scenario - Second Read Demo

**Try these phrases to trigger Second Read:**
1. "I'll finish it when I can. Stop asking."
2. "I'll get to it later"
3. "I'm too busy right now"
4. "Just stop asking me"
5. "I can do it whenever"

All of these will trigger the **high-risk warning** showing:
- Risk: "Might sound blunt/defensive"
- Suggestions: softer alternatives

### Emma (Girlfriend) Scenario - Second Read Demo

**Try these phrases to trigger Second Read:**
1. "Fine, whatever"
2. "Not now, I'm busy"
3. "You're overreacting"
4. "Just deal with it"
5. "I'm fine, okay?"

These will also trigger the **high-risk warning** for dismissive/defensive tone.

### Emma (Girlfriend) Scenario - Reply Assist Demo

**Action:** Tap "Help me reply" button below Emma's long emotional message

**Shows:**
- Her feelings: Frustrated, Unheard, Disappointed
- 3 draft replies: Empathy-first, Accountability + repair, Boundary + calm
- Do/Don't checklist

---

## How to Turn Off Demo Mode (Use Real AI)

### Option 1: Edit the Constants File (Recommended)

**File:** [src/lib/constants.ts](src/lib/constants.ts#L92)

```typescript
// Change line 92 from:
export const DEMO_MODE = true;

// To:
export const DEMO_MODE = false;
```

Then restart the app:
```bash
# Kill the app
# Restart with:
npx expo start --clear
```

### Option 2: Quick Toggle (If you make this a feature)

You could add a toggle in Settings screen to switch between demo and real AI modes dynamically.

---

## What Happens When Demo Mode is OFF

**Second Read:**
- Analyzes EVERY message you type in real-time
- Uses actual Gemini 2.0 Flash Lite API
- No trigger words needed - analyzes all text
- 1-second debounce to avoid excessive API calls

**Reply Assist:**
- Generates fresh AI responses based on the actual message
- Intent and tone selections affect the response
- Uses real Gemini API call

**Requirements when Demo Mode is OFF:**
- ✅ Valid Gemini API key (already hardcoded)
- ✅ Internet connection
- ⚠️ Subject to API rate limits (15 requests/min free tier)

---

## Current Configuration

- **DEMO_MODE**: `true` (using pre-written responses)
- **Gemini Model**: `gemini-2.0-flash-lite`
- **API Key**: Hardcoded in [src/services/ai.ts:29](src/services/ai.ts#L29)

---

## Demo Script

**1. Onboarding:**
- Enter any name → Create Identity
- Goes straight to Chats (skips QR)

**2. Emma Chat (Reply Assist):**
- See her emotional message
- Tap "Help me reply"
- Review AI analysis and drafts
- Select a draft or type your own

**3. Alex Chat (Second Read):**
- Type: "I'll get to it later"
- Wait 1 second
- Second Read card appears
- Shows risk + suggestions
- Apply or send anyway

**4. Emma Chat (Second Read):**
- Type: "Fine, whatever"
- Wait 1 second
- Second Read warns about dismissive tone
- Shows softer alternatives
