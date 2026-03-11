# Second Read - Written Demo Submission

## A. Idea Context (Prep & Intent)

**Problem:** Text messaging removes vocal tone and body language, causing everyday messages to be misinterpreted as rude, dismissive, or cold even when no harm was intended. Users often realize a message sounded harsh only after it's already sent and has caused tension in relationships.

**Target user:** Everyday messaging users—particularly those texting partners, close friends, or coworkers—who want to communicate clearly without accidentally causing conflict or hurt feelings in conversations where tone matters.

**MVP validate:** This MVP validates whether real-time AI tone analysis can reliably detect potentially problematic messages before they're sent, and whether showing brief, contextual feedback actually helps users communicate more thoughtfully without disrupting normal texting flow.

---

## B. MVP Goals

- **Enable real-time tone detection:** Analyze draft messages as users type and flag only high-risk messages that might be misinterpreted as defensive, dismissive, or blunt.
- **Provide contextual AI assistance for emotional messages:** Allow users to request help replying to emotionally heavy messages they receive, with AI-generated draft responses that match their intended tone.
- **Maintain messaging privacy:** Ensure all AI analysis happens with explicit user consent, messages are end-to-end encrypted, and the app functions as a normal messenger when AI features are turned off.

---

## C. Technical Approach

I used Claude Code extensively to build this as a code-assisted React Native (Expo) app. I chose this approach because I wanted full control over the messaging flow, AI integration, and privacy features rather than relying on no-code tools that couldn't handle E2EE or custom AI workflows.

The AI integration uses Google's Gemini 2.0 Flash Lite API with heavily optimized prompts (~75% shorter than initial versions) to reduce token usage and API costs. The system architecture separates the "Second Read" feature (analyzes your outgoing messages) from "Reply Assist" (helps you respond to incoming emotional messages).

I implemented a demo mode to make the MVP demoable from a single device, where incoming messages from "Emma" (girlfriend) and "Alex" (coworker) are pre-loaded, but all AI analysis of user-typed responses uses real Gemini API calls.

---

## D. Demo Requirements / Prompts / PRD

**Core System Behavior:**
The app has two AI features that activate only when needed:
1. **Second Read** triggers when you type a message longer than 10 words, waits 1 second (debounced), then analyzes tone risk. Only shows a warning card if risk is medium/high in "strict" mode or high in "gentle" mode.
2. **Reply Assist** triggers when you tap "Help me reply" on an emotionally heavy incoming message. Analyzes the sender's feelings/needs and generates 3 contextual draft replies.

**Key Prompts to Gemini:**

*Second Read prompt:*
```
Analyze tone risk for: "[user's message text]"

Only flag HIGH risk. Give 2-3 brief reasons and 3 short rewrites (<10 words each).

JSON format:
{"risk_level": "low|medium|high", "risk_reason": ["..."], "suggestions": ["..."]}
```

*Reply Assist prompt:*
```
Analyze message and create reply drafts.

Message: "[incoming emotional message]"
Intent: de-escalate, Tone: balanced

Provide 3 natural, human drafts (1-3 sentences each): Empathy-first, Accountability+repair, Boundary+calm.

JSON: {"their_feelings":["..."], "their_needs":["..."], "their_request":"...", "reply_drafts":[...], "avoid_list":["..."], "include_list":["..."]}
```

**Demo Constraints:**
- Single-phone demo with pre-loaded "Emma" and "Alex" conversations
- Demo mode triggers on specific phrases (e.g., "I'll get to it later" → Second Read warning)
- App clears all data on restart to ensure fresh onboarding every time
- Dark theme (#102218 background, #13ec6d neon green) inspired by Signal

---

## E. Iteration & Learning (Most Important Section)

**What worked in the initial MVP?**
The core AI integration worked immediately—Gemini API calls returned structured JSON as expected. The visual design (dark theme, minimalist cards) created the Signal-inspired feel I wanted. Message composition and basic chat functionality were stable from the start.

**What didn't work?**
Initial Gemini prompts were too verbose (~350 tokens for Reply Assist), causing API quota issues. The QR code screen after onboarding broke the demo flow. AI responses weren't contextual enough—every message triggered analysis regardless of content. TypeScript errors blocked compilation for hours due to smart quotes and type mismatches.

**What did you try to fix?**
I shortened prompts drastically, removed unnecessary demo steps, added trigger-word logic for demo mode, and fixed all TypeScript issues systematically. I also switched from real-time API calls in demo mode to pre-written responses to avoid quota limits during testing.

### Improvements After Initial MVP

1. **Shortened AI prompts by 75%**
   - *What changed:* Reduced Second Read prompt from ~220 tokens to ~50 tokens, Reply Assist from ~350 to ~80 tokens
   - *Prompt/technical change:* Removed verbose instructions, examples, and rules. Changed from "You are a tone analyzer for a messaging app..." to "Analyze tone risk for: [text]. Give 2-3 brief reasons and 3 short rewrites."
   - *Result:* **Better.** API calls became faster, token costs dropped significantly, and responses were still accurate. This fixed quota issues during development.

2. **Added context-aware Second Read triggers**
   - *What changed:* Instead of analyzing every message, Second Read now only triggers for specific conversation contexts (defensive phrases with Alex, dismissive phrases with Emma)
   - *Prompt/technical change:* Added conditional logic: `if (id === 'alex-coworker' && text.includes('later'))` rather than analyzing all text universally
   - *Result:* **Better.** Reduced false positives, made demo more predictable, and avoided annoying users during casual texting.

3. **Skipped QR code screen in onboarding**
   - *What changed:* After creating identity, app goes directly to chat list instead of showing QR code for contact exchange
   - *Prompt/technical change:* Changed `router.replace('/qr-display')` to `router.replace('/(main)')` in onboarding completion handler
   - *Result:** Better.** Streamlined demo flow since demo contacts (Emma, Alex) are pre-loaded anyway. Removed a confusing step that had no value in single-phone demo mode.

4. **Switched to Gemini 2.0 Flash Lite model**
   - *What changed:* Changed API endpoint from `gemini-2.0-flash` to `gemini-2.0-flash-lite`
   - *Prompt/technical change:* Updated `GEMINI_API_URL` constant to use `-lite` variant
   - *Result:* **Better.** Faster responses, lower costs, sufficient accuracy for tone analysis. Lite model is optimized for this use case.

5. **Fixed PRNG polyfill for React Native crypto**
   - *What changed:* App crashed on identity creation with "no PRNG" error
   - *Prompt/technical change:* Created custom entry point (`index.js`) that imports `react-native-get-random-values` before any other code, changed package.json main to point to it
   - *Result:* **Better.** Encryption keypair generation now works. This was a blocking bug that prevented onboarding.

6. **Implemented demo mode with pre-written AI responses**
   - *What changed:* Added `DEMO_MODE` flag that uses hardcoded Second Read and Reply Assist responses instead of live API calls
   - *Prompt/technical change:* Created `DEMO_SECOND_READ` and `DEMO_REPLY_ASSIST` constants, added conditional: `if (DEMO_MODE) { result = DEMO_REPLY_ASSIST } else { result = await analyzeReplyAssist(...) }`
   - *Result:* **Better.** Allows unlimited demos without hitting API quota. Responses are still realistic and demonstrate the feature properly. Can toggle to real AI by changing one constant.

7. **Redesigned UI from blue to dark green theme**
   - *What changed:* Complete color scheme overhaul from default Expo blue to Signal-inspired dark theme with neon green (#13ec6d)
   - *Prompt/technical change:* Updated entire `Colors` object in constants.ts, regenerated all screens (onboarding, chat list, chat, Second Read card, Reply Assist sheet)
   - *Result:* **Better.** App now looks polished and intentional rather than generic. Dark theme reduces eye strain and the green accent creates strong visual identity.

---

## F. Self-Assessment

**1. What is the biggest remaining product or technical risk?**
Tone interpretation is inherently subjective—what feels "blunt" to one person might seem fine to another. The AI might flag messages that don't need flagging (false positives) or miss genuinely problematic messages (false negatives), which could either annoy users or fail to prevent the very conflicts the app is designed to avoid.

**2. What would you improve with one more week?**
Add per-conversation Second Read settings (off/gentle/strict) accessible from chat settings. Implement actual Firebase message relay instead of AsyncStorage mock. Build real contact exchange via QR code scanning. Add push notifications. Improve Reply Assist by letting users preview how each draft sounds before selecting it, rather than just seeing text.

**3. What did you personally learn from building this MVP?**
Building with AI assistance (Claude Code + Gemini API) is incredibly powerful but requires precise prompting and constant validation—you can't trust generated code blindly. I learned to frontload requirements and constraints in prompts to avoid rework. I also learned that demo-ability is a separate design concern from production features: adding demo mode, clearing data on restart, and pre-loading conversations made the MVP actually showable, whereas the "real" version would have required two phones and complex setup. Finally, I learned that prompt optimization matters enormously for API-based features—a 75% token reduction made the difference between hitting quota limits constantly and having a working demo.
