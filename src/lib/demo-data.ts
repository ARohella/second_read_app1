import { SecondReadResult, ReplyAssistResult } from '../types';

export const DEMO_CONTACTS = [
  {
    id: 'emma-girlfriend',
    name: 'Emma',
    initials: 'EM',
  },
  {
    id: 'alex-coworker',
    name: 'Alex Rivera',
    initials: 'AR',
  },
];

// Demo incoming messages - these are hardcoded to simulate receiving messages
// User's replies will be typed by them and analyzed by real AI
export const DEMO_MESSAGES = {
  'emma-girlfriend': [
    {
      id: '1',
      sender: 'them' as const,
      text: "Look, I'm just really tired of having to explain this every single time we talk. It feels like you aren't even listening or you just don't care about my time. I need more support than this. I've been trying to be patient, but honestly it's exhausting when I feel like I'm the only one putting in effort to make this work. I don't want to keep feeling unheard and I need you to understand how much this is affecting me.",
      timestamp: Date.now() - 300000,
    },
  ],
  'alex-coworker': [
    {
      id: '1',
      sender: 'them' as const,
      text: "When will the report be ready? We're already behind schedule.",
      timestamp: Date.now() - 1800000,
    },
  ],
};

export const DEMO_SECOND_READ: SecondReadResult = {
  riskLevel: 'high',
  riskReason: [
    'This might come across as defensive or dismissive',
    'Could escalate tension instead of de-escalating',
  ],
  suggestions: [
    "Could you give me a moment?",
    "I'll update you soon",
    "Working on it!",
  ],
};

export const DEMO_REPLY_ASSIST: ReplyAssistResult = {
  theirFeelings: ['Frustrated', 'Unheard', 'Disappointed'],
  theirNeeds: [
    'Recognition of the effort they put into the relationship',
    'Concrete understanding of how things will change',
  ],
  theirRequest: 'More active listening and emotional support',
  replyDrafts: [
    {
      label: 'Empathy-first',
      text: "I hear how frustrated you are and I realize that my lack of communication has made you feel like I don't value your time. I really appreciate everything you do and want to do better.",
    },
    {
      label: 'Accountability + repair',
      text: "You're right to feel upset. I haven't been supporting you the way I should be. I'm going to make it a priority to be more present and responsive starting now.",
    },
    {
      label: 'Boundary + calm tone',
      text: "I understand you're feeling frustrated. I want to have this conversation when we can both be calm and really hear each other. Can we talk tonight?",
    },
  ],
  avoidList: [
    "Saying 'you always...' or 'but you...'",
    "Deflecting or changing the subject",
  ],
  includeList: [
    "Acknowledge their feelings without being defensive",
    "Propose one concrete next step",
  ],
};

export const DEMO_DRAFT_TEXT = "I'll finish it when I can. Stop asking.";
