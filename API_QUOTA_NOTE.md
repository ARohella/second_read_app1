# API Quota Issue - Demo Mode Enabled

## Current Status

The Gemini API key has exceeded its free tier quota:
- ❌ Rate limit: 0 requests per minute
- ❌ Daily limit: 0 requests per day
- ⏱️ Retry after: ~48 seconds (will reset eventually)

## Solution Applied

**Demo Mode is now enabled** to showcase the app's features with pre-written AI responses.

### What This Means:

✅ **App Still Works** - All features are fully functional
✅ **Pre-written Responses** - AI responses are hardcoded but realistic
✅ **Same User Experience** - Flow is identical to real AI

### Current Configuration:

- **DEMO_MODE = true** in [src/lib/constants.ts:92](src/lib/constants.ts#L92)
- Second Read triggers on phrases like "finish", "stop", "can"
- Reply Assist always returns the same empathetic draft responses
- No actual API calls are made (avoids quota errors)

## How Demo Mode Works

### Second Read:
1. Type a message in Alex's chat
2. If message contains trigger words ("finish", "stop", "can"), Second Read appears
3. Shows pre-written risk assessment + suggestions
4. Example: "I'll finish it when I can" → Shows high risk warning

### Reply Assist:
1. Tap "Help me reply" on Emma's emotional message
2. Shows pre-written analysis of her feelings
3. Provides 3 empathetic draft replies
4. Intent/tone changes don't regenerate (demo limitation)

## To Use Real AI (When Quota Resets)

1. Wait for quota to reset (~24-48 hours)
2. Set `DEMO_MODE = false` in [src/lib/constants.ts](src/lib/constants.ts#L92)
3. App will call real Gemini API for dynamic responses

## Alternative: Get Your Own API Key

1. Go to https://aistudio.google.com/apikey
2. Create a free API key
3. Replace the key in [src/services/ai.ts:29](src/services/ai.ts#L29)
4. Set `DEMO_MODE = false`

Free tier includes:
- 15 requests per minute
- 1,500 requests per day
- Sufficient for testing and demos

## Files Modified for Demo Mode

- [src/lib/constants.ts](src/lib/constants.ts) - DEMO_MODE flag
- [app/chat/[id].tsx](app/chat/[id].tsx) - Demo response logic
- [src/lib/demo-data.ts](src/lib/demo-data.ts) - Pre-written responses

## Demo Responses Used

### Second Read (DEMO_SECOND_READ):
```json
{
  "riskLevel": "high",
  "riskReason": [
    "This might come across as defensive or dismissive",
    "Could escalate tension instead of de-escalating"
  ],
  "suggestions": [
    "Could you give me a moment?",
    "I'll update you soon",
    "Working on it!"
  ]
}
```

### Reply Assist (DEMO_REPLY_ASSIST):
- Feelings: Frustrated, Unheard, Disappointed
- 3 draft replies: Empathy-first, Accountability + repair, Boundary + calm tone
- Do/Don't checklist for responding

## Current Behavior

✅ Onboarding works perfectly
✅ Chat list shows Emma + Alex
✅ Emma chat: "Help me reply" shows draft responses
✅ Alex chat: Typing defensive messages shows Second Read
✅ All UI polish (dark theme, animations, etc.)

The app is fully functional for demonstrations and testing, just using pre-written AI responses instead of live API calls.
