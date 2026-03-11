# Demo Quick Reference Card

## 📋 Submission Checklist

- [ ] **Video recorded** (5-7 min, shows working prototype)
- [ ] **Written submission completed** (Canvas template filled out)
- [ ] **Video uploaded** (YouTube/Loom/Drive link ready)
- [ ] **Submitted before deadline**

---

## 🎬 Video Structure (6-7 min)

| Time | Section | What to Say/Show |
|------|---------|------------------|
| 0:00-0:45 | Context | Problem, user, MVP goal |
| 0:45-1:00 | Onboarding | Create identity |
| 1:00-2:30 | Reply Assist | Emma chat → "Help me reply" → show drafts |
| 2:30-4:30 | Second Read | Alex chat → type "I'll get to it later" → show warning |
| 4:30-6:00 | Iteration | Explain 3-4 improvements from first version |
| 6:00-6:50 | Reflection | What worked, what didn't, what's next |

---

## 🗣️ Key Demo Phrases

### For Reply Assist (Emma):
1. Tap into Emma chat
2. Tap "Help me reply" button
3. Show Summary → Drafts → Checklist tabs
4. Select a draft

### For Second Read (Alex):
Try these trigger phrases:
- "I'll get to it later"
- "I'm too busy right now"
- "Just stop asking me"

**For Emma:**
- "Fine, whatever"
- "You're overreacting"
- "Not now, I'm busy"

Wait 1 second after typing → Second Read card appears

---

## 📝 Written Submission Key Points

### A. Context (4-5 sentences)
- Problem: Text loses tone → misinterpretation → conflict
- User: Anyone texting people they care about
- MVP validates: AI can detect tone issues + feedback helps

### B. Goals (3 bullets)
1. Real-time tone detection for outgoing messages
2. AI-powered reply assistance for emotional incoming messages
3. Maintain E2EE privacy with opt-in AI

### C. Technical Approach (5-6 sentences)
- Built with Claude Code (code-assisted, React Native/Expo)
- Uses Gemini 2.0 Flash Lite API
- Prompts optimized to ~75% shorter
- Demo mode: incoming messages pre-loaded, outgoing analyzed by real AI

### D. Prompts/PRD (1-2 paragraphs)
- Include shortened Second Read prompt
- Include Reply Assist prompt
- Mention demo constraints (single phone, pre-loaded contacts)

### E. Iteration (MOST IMPORTANT - 6+ improvements)

**Must include:**
1. Shortened AI prompts by 75% → Better (faster, no quota issues)
2. Context-aware triggers → Better (fewer false positives)
3. Skipped QR screen → Better (streamlined demo)
4. Switched to Flash Lite → Better (faster, cheaper)
5. Fixed PRNG crypto bug → Better (blocking issue, now works)
6. Added demo mode → Better (single-phone demo possible)
7. Redesigned UI to dark theme → Better (polished, intentional)

**For each:** What changed | What you did | Result (better/worse/same)

### F. Self-Assessment (honest, reflective)
1. **Biggest risk:** Tone is subjective → false positives or negatives
2. **One more week:** Per-chat settings, real Firebase, better preview
3. **Learned:** AI tools require precise prompting, demo-ability is separate from production, prompt optimization matters enormously

---

## ⚠️ Common Mistakes to Avoid

❌ **Video only shows slides** → Must show working prototype
❌ **No iteration shown** → Must show ≥3 improvements from v1
❌ **"I would build X"** → Show what DOES work, not what could
❌ **Too short (<5 min)** → Add more iteration detail
❌ **Too long (>7 min)** → Cut unnecessary context
❌ **Reading script word-for-word** → Conversational narration

---

## 🎯 Grading Breakdown (20 points)

| Category | Points | What They Want |
|----------|--------|----------------|
| Prep & Intent | 4 | Clear problem and MVP goal |
| Prototype Exists | 4 | Working, demoable product |
| **Process & Learning** | **6** | **Iteration, improvements, insight** |
| Demo Quality | 4 | Clear walkthrough, good explanation |
| Write-Up | 2 | Complete, thoughtful Canvas responses |

**Focus your effort on Section E (iteration) - it's worth 30% of the grade**

---

## 🚀 Demo Day Checklist

### Before Recording:
- [ ] App is working (test Second Read + Reply Assist)
- [ ] Demo mode is ON (DEMO_MODE = true in constants.ts)
- [ ] Trigger phrases work (test "I'll get to it later")
- [ ] Screen recording software ready
- [ ] Quiet environment, good mic

### During Recording:
- [ ] Speak clearly at normal pace
- [ ] Explain what you're clicking
- [ ] Pause 1-2 sec after each action
- [ ] Show iteration examples
- [ ] Stay within 5-7 min

### After Recording:
- [ ] Watch it once (check audio/video quality)
- [ ] Upload to YouTube/Loom/Drive
- [ ] Copy link
- [ ] Fill out Canvas written submission
- [ ] Paste video link in Canvas
- [ ] Submit before deadline

---

## 📂 Files You Need

1. **DEMO_WRITTEN_SUBMISSION.md** - Copy/paste into Canvas
2. **DEMO_VIDEO_SCRIPT.md** - Use while recording
3. **DEMO_TRIGGERS.md** - Trigger phrases reference
4. **This file** - Quick reference during recording

---

## 🆘 Emergency Fixes

**If Second Read doesn't trigger:**
- Make sure text is >10 characters
- Wait full 1 second after typing
- Try different trigger phrase
- Verify DEMO_MODE = true

**If Reply Assist doesn't show:**
- Make sure you're in Emma chat
- Tap "Help me reply" button (not message text)
- Check that button appears below her message

**If app crashes on onboarding:**
- Clear cache: `rm -rf .expo node_modules/.cache`
- Restart: `npx expo start --clear`

**If no time to fix something:**
- Explain what's supposed to happen
- Show it working in a different scenario
- Move on—don't waste demo time debugging

---

## 💡 Pro Tips

✅ **Front-load your best stuff** - Show Reply Assist + Second Read in first 3 minutes
✅ **Narrate as you go** - "Now I'm tapping... now Second Read appears..."
✅ **Show, don't tell** - Working demo > talking about features
✅ **Be honest in reflection** - "This didn't work, so I tried X" earns points
✅ **Use concrete examples** - "Shortened from 350→80 tokens" > "Made it shorter"

Good luck! 🎉
