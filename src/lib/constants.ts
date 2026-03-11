export const Colors = {
  // Primary neon green
  primary: '#13ec6d',
  primaryDark: '#0bda43',
  primaryLight: '#13ec6d20',

  // Backgrounds
  background: '#102218',
  backgroundLight: '#f6f8f7',
  surface: '#1a2e22',
  surfaceLight: '#193324',

  // Text
  text: '#FFFFFF',
  textSecondary: '#92c9a9',
  textTertiary: '#6B8A7A',
  textLight: '#1A1A1A',

  // Borders
  border: '#326748',
  borderLight: '#234833',

  // Message bubbles
  sent: '#13ec6d',
  sentText: '#102218',
  received: '#234833',
  receivedText: '#FFFFFF',

  // Status
  danger: '#EF4444',
  warning: '#F59E0B',
  warningLight: '#FEF3C7',
  success: '#13ec6d',

  // Second Read
  riskHigh: '#EF4444',
  riskHighBg: '#3d1a1a',
  riskMedium: '#F59E0B',
  riskMediumBg: '#3d2d1a',
  riskLow: '#13ec6d',
  riskLowBg: '#1a2e22',

  // Reply Assist
  assistBg: '#193324',
  assistBorder: '#326748',
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
};

export const FontSize = {
  xs: 11,
  sm: 13,
  md: 15,
  lg: 17,
  xl: 20,
  xxl: 24,
  title: 32,
};

export const CASUAL_PATTERNS = [
  /^(ok|okay|k|kk)$/i,
  /^(cool|nice|great|sure|yep|yup|yeah|ya|ye|nah|nope)$/i,
  /^(lol|lmao|haha|hehe|😂|🤣|😊|👍|❤️|💀|😭)$/i,
  /^(thanks|thx|ty|thank you|tysm)$/i,
  /^(gm|gn|good morning|good night|goodnight)$/i,
  /^(hey|hi|hello|yo|sup|what's up|wya|otw|omw)$/i,
  /^.{0,5}$/,
];

export const SENSITIVITY_KEYWORDS = [
  'hurt', 'always', 'never', 'disappointed', "can't believe",
  'frustrated', 'angry', 'upset', 'feel like', 'you don\'t',
  'you never', 'you always', 'tired of', 'done with',
  'need to talk', 'we need', 'i feel', 'makes me feel',
  'not okay', 'not fine', 'bothers me', 'let down',
  'betrayed', 'ignored', 'neglected', 'unheard',
  'sorry but', 'honestly', 'to be honest',
];

export const SENSITIVITY_CHAR_THRESHOLD = 200;

export const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-lite:generateContent';

// Demo mode - set to true to use pre-written AI responses (API quota exceeded)
export const DEMO_MODE = true;
