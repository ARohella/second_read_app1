# Second Read - Demo Video Script (5-7 minutes)

## SECTION 1: Context & MVP Goal (30-60 seconds)

### [Screen: Show app icon or title screen]

**"Hi, I'm demoing Second Read—a privacy-first messaging app that helps you avoid tone disasters in text conversations.**

**The problem is simple: when you text someone—whether it's your partner, a friend, or a coworker—you lose vocal tone and body language. A message you think sounds fine might come across as rude, cold, or dismissive. Usually, you realize this only after you've already hit send and caused tension.**

**The user here is anyone who texts people they care about and wants to communicate clearly without accidentally hurting feelings or escalating conflict.**

**This MVP is trying to prove two things:**
1. **Can AI reliably detect potentially problematic messages before you send them?**
2. **Can showing brief, contextual feedback help you communicate more thoughtfully without disrupting normal texting?**

**Let's see it in action."**

---

## SECTION 2: Live Prototype Walkthrough (3-4 minutes)

### Part A: Onboarding (15-20 seconds)

**[Screen: Launch app, show onboarding screen]**

**"When you first open Second Read, you create an accountless identity. No phone number, no email—just a display name. Everything is end-to-end encrypted."**

**[Action: Type a name, tap "Create Identity"]**

**"I'll create my identity... and we go straight to my chats."**

---

### Part B: Chat List (10 seconds)

**[Screen: Show chat list with Emma and Alex]**

**"Here's my inbox. I have two conversations: Emma, my girlfriend, who just sent me an emotional message... and Alex, a coworker who's asking about a deadline."**

**"Let me show you both AI features—starting with Reply Assist for Emma's message."**

---

### Part C: Reply Assist Demo (60-90 seconds)

**[Screen: Tap into Emma's chat]**

**"Here's Emma's message."**

**[Action: Scroll to show the full emotional paragraph]**

**"This is a long, emotionally heavy message. She's frustrated and feels unheard. I want to respond thoughtfully, but I'm not sure what to say."**

**[Action: Tap "Help me reply" button below her message]**

**"So I tap 'Help me reply.' This triggers Reply Assist, which uses AI to analyze what she's actually feeling and needing, then generates three draft replies for me."**

**[Screen: Reply Assist sheet opens, show Summary tab]**

**"First, it shows me what she's feeling: Frustrated, Unheard, Disappointed. And what she needs: recognition of her effort, understanding of how things will change."**

**[Screen: Switch to Drafts tab]**

**"Then it gives me three draft replies with different approaches:**
- **Empathy-first:** focuses on validating her feelings
- **Accountability + repair:** takes responsibility and commits to change
- **Boundary + calm tone:** suggests talking when emotions are lower

**These aren't robotic templates—they sound like something I'd actually say."**

**[Action: Tap "Use this draft" on one of them]**

**"I can select a draft, edit it if I want, or just use it as-is. Now it's in my message composer."**

**[Screen: Show draft populated in text field]**

**"This is Reply Assist: it doesn't send anything for you, but it gives you a thoughtful starting point when emotions are high and you're not sure how to respond."**

---

### Part D: Second Read Demo (90-120 seconds)

**[Screen: Go back to chat list, tap into Alex's chat]**

**"Now let me show Second Read, which works the opposite way—it analyzes your outgoing messages before you send them."**

**[Screen: Show Alex's message asking about the report deadline]**

**"Alex is asking when the report will be ready. I'm stressed, so my instinct is to type something defensive."**

**[Action: Start typing "I'll get to it later"]**

**"As I type... the app is watching. But it's not analyzing every word—Second Read only triggers on messages that might be risky."**

**[Action: Finish typing, wait 1 second]**

**"After one second, Second Read kicks in."**

**[Screen: Second Read card appears above keyboard]**

**"Here's what it shows me:**
- **Risk level:** High—might sound blunt
- **Why:** Could come across as defensive, might escalate tension
- **Suggestions:** Three quick rewrites that soften the tone

**[Action: Point to the suggestion chips]**

**"I can tap one of these suggestions to replace my message... or I can ignore it and send anyway. I'm always in control."**

**[Action: Tap a suggestion chip]**

**"Let's use 'I'll update you soon.' Much better."**

**[Action: Tap send button]**

**"And that's Second Read. It's not judging you—it's just giving you a moment to reconsider before a message goes out and causes a problem."**

---

### Part E: Privacy & Settings Note (15-20 seconds)

**[Screen: Optionally show chat header with E2EE badge]**

**"Quick note on privacy: all AI analysis happens with your explicit consent—either you tap 'Help me reply' or Second Read only triggers when you're actively typing. Messages are end-to-end encrypted. If you turn Second Read off for a conversation, it's just a normal messenger."**

**"The AI only sees text you're about to send or have explicitly asked for help with. Nothing is logged or stored."**

---

## SECTION 3: Iteration Highlight (1-2 minutes)

### [Screen: Can show code editor, constants file, or just narrate over app]

**"Let me show you what changed between my first version and this one."**

---

### Iteration 1: Prompt Optimization

**[Screen: Optional - show before/after prompt snippets or just narrate]**

**"Initially, my prompts to the AI were way too long—over 350 tokens for Reply Assist. This caused two problems: slow responses and I kept hitting API quota limits.**

**I rewrote them to be 75% shorter. Instead of paragraphs of instructions, I just say: 'Analyze message, create reply drafts, provide 3 natural drafts.' Same quality, way faster, no quota issues.**

**Effect: This made the app actually usable. Without this change, the demo wouldn't work."**

---

### Iteration 2: Context-Aware Triggers

**[Screen: Show typing in Alex's chat]**

**"In the first version, Second Read analyzed every single message, which was annoying.**

**Now, it only triggers when I type phrases that actually sound risky—like 'I'll get to it later' with a coworker, or 'fine, whatever' with a partner.**

**This reduced false positives and made the app feel smarter, not naggy."**

---

### Iteration 3: Demo Mode

**[Screen: Optional - show constants.ts with DEMO_MODE flag]**

**"Originally, to demo this I would have needed two phones—one to send messages, one to receive them.**

**I added demo mode: Emma and Alex's incoming messages are pre-loaded, but when I type replies, the AI analysis is real. This let me demo everything from one device.**

**To turn it off and use real AI for everything, I just change one line of code."**

---

### Iteration 4: Skipped QR Screen

**[Screen: Show onboarding flow]**

**"After creating an identity, the app used to show a QR code for adding contacts. But in demo mode, I already have contacts pre-loaded, so that screen was just confusing.**

**I changed it to skip straight to the chat list. Small change, but it made the demo flow way smoother."**

---

## SECTION 4: Reflection Close (30-60 seconds)

**[Screen: Can show app home screen or face camera]**

### What Worked

**"What worked: The AI integration was solid from the start. Gemini gave me structured JSON responses, the dark UI theme looked polished, and the core messaging flow was stable."**

### What Didn't Work

**"What didn't: My prompts were too long, causing API issues. The QR code screen broke demo flow. TypeScript errors blocked me for hours due to formatting issues."**

### What I'd Do Next

**"If I had one more week, I'd add:**
- **Per-conversation settings:** let users turn Second Read on/off or adjust sensitivity per chat
- **Real Firebase relay:** right now messages use local storage; I'd build actual message sync
- **Better Reply Assist preview:** let users see how each draft sounds before selecting it

**The biggest learning here was that building with AI tools—both Claude Code for development and Gemini API for features—is incredibly powerful, but you can't be lazy with prompts. Precision matters. Also, demo-ability is its own design problem: adding demo mode and clearing data on restart made this actually showable, where the production version would need complex setup.**

**That's Second Read. Thanks for watching."**

---

## TIMING BREAKDOWN

| Section | Target Time | Content |
|---------|-------------|---------|
| 1. Context & Goal | 45 sec | Problem, user, MVP validation |
| 2A. Onboarding | 15 sec | Create identity |
| 2B. Chat List | 10 sec | Show Emma and Alex |
| 2C. Reply Assist | 90 sec | Demo emotional reply help |
| 2D. Second Read | 120 sec | Demo tone warning |
| 2E. Privacy Note | 20 sec | E2EE, consent |
| 3. Iteration | 90 sec | 4 improvements |
| 4. Reflection | 50 sec | What worked, didn't, next steps |
| **Total** | **~6 min 40 sec** | Within 5-7 min target |

---

## RECORDING TIPS

### Setup
- **Screen recording:** Use QuickTime (Mac) or built-in iOS screen recording
- **Audio:** Use AirPods or external mic for clear narration
- **Pace:** Speak at normal conversational speed—not too fast
- **Pauses:** Pause 1-2 seconds after each major action so viewers can see

### What to Show
- ✅ Actual app running (required)
- ✅ You typing and interacting (required)
- ✅ AI responses appearing in real-time (required)
- ❌ Slides (optional, not needed)
- ❌ Your face (optional, not required)

### Common Mistakes to Avoid
- ❌ Reading a script word-for-word (sounds robotic)
- ❌ Going too fast (viewers can't follow)
- ❌ Not explaining what you're clicking (leaves viewers confused)
- ❌ Apologizing for things not working (just demo what does work)

### Backup Plan
If Second Read AI doesn't trigger when expected:
1. Try a different trigger phrase from DEMO_TRIGGERS.md
2. Make sure you waited 1 second after typing
3. Verify text is >10 characters
4. If still not working, explain: "In demo mode this triggers on specific phrases—let me try another one"

---

## POST-RECORDING CHECKLIST

Before submitting:
- [ ] Video is 5-7 minutes (not shorter, not longer)
- [ ] Audio is clear (no background noise, music, or echo)
- [ ] Screen is visible (not too small or blurry)
- [ ] You showed the prototype working (not just talked about it)
- [ ] You explained at least one iteration/improvement
- [ ] You uploaded to YouTube, Loom, or Google Drive
- [ ] Link is included in Canvas submission
- [ ] Written submission is also complete
