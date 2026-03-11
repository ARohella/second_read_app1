import { SecondReadResult, ReplyAssistResult, ReplyIntent, TonePreference } from '../types';
import { GEMINI_API_URL, CASUAL_PATTERNS, SENSITIVITY_KEYWORDS, SENSITIVITY_CHAR_THRESHOLD } from '../lib/constants';

export function isCasualMessage(text: string): boolean {
  const trimmed = text.trim();
  return CASUAL_PATTERNS.some(pattern => pattern.test(trimmed));
}

export function isSensitiveMessage(text: string): boolean {
  const lower = text.toLowerCase();
  if (text.length > SENSITIVITY_CHAR_THRESHOLD) return true;
  const matchCount = SENSITIVITY_KEYWORDS.filter(kw => lower.includes(kw)).length;
  return matchCount >= 2;
}

function redactPii(text: string): string {
  // Redact emails
  let redacted = text.replace(/[\w.-]+@[\w.-]+\.\w+/g, '[EMAIL]');
  // Redact phone numbers
  redacted = redacted.replace(/(\+?\d[\d\s\-()]{7,}\d)/g, '[PHONE]');
  // Redact URLs
  redacted = redacted.replace(/https?:\/\/[^\s]+/g, '[URL]');
  return redacted;
}

async function callGemini(prompt: string): Promise<string> {
  const apiKey = process.env.EXPO_PUBLIC_GEMINI_API_KEY || 'YOUR_GEMINI_API_KEY';

  const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 1024,
        responseMimeType: 'application/json',
      },
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Gemini API error: ${response.status} - ${err}`);
  }

  const data = await response.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text || '';
}

export async function analyzeSecondRead(
  draftMessage: string,
  mode: 'gentle' | 'strict',
  shouldRedact: boolean
): Promise<SecondReadResult | null> {
  if (isCasualMessage(draftMessage)) return null;

  const textToAnalyze = shouldRedact ? redactPii(draftMessage) : draftMessage;

  const prompt = `Analyze tone risk for: "${textToAnalyze}"

${mode === 'gentle' ? 'Only flag HIGH risk' : 'Flag MEDIUM/HIGH risk'}. Give 2-3 brief reasons and 3 short rewrites (<10 words each).

JSON format:
{"risk_level": "low|medium|high", "risk_reason": ["..."], "suggestions": ["..."]}`;

  try {
    const responseText = await callGemini(prompt);
    const parsed = JSON.parse(responseText);

    const result: SecondReadResult = {
      riskLevel: parsed.risk_level || 'low',
      riskReason: parsed.risk_reason || [],
      suggestions: parsed.suggestions || [],
    };

    if (mode === 'gentle' && result.riskLevel !== 'high') return null;
    if (result.riskLevel === 'low') return null;

    return result;
  } catch (e) {
    console.error('Second Read analysis failed:', e);
    return null;
  }
}

export async function analyzeReplyAssist(
  incomingMessage: string,
  intent: ReplyIntent,
  tone: TonePreference,
  shouldRedact: boolean
): Promise<ReplyAssistResult> {
  const textToAnalyze = shouldRedact ? redactPii(incomingMessage) : incomingMessage;

  const intentMap: Record<ReplyIntent, string> = {
    apologize: 'apologize',
    clarify: 'clarify',
    repair: 'repair relationship',
    set_boundary: 'set boundary',
    de_escalate: 'de-escalate',
  };

  const toneMap: Record<TonePreference, string> = {
    warmer: 'warm',
    balanced: 'balanced',
    direct: 'direct',
  };

  const prompt = `Analyze message and create reply drafts.

Message: "${textToAnalyze}"
Intent: ${intentMap[intent]}, Tone: ${toneMap[tone]}

Provide 3 natural, human drafts (1-3 sentences each): Empathy-first, Accountability+repair, Boundary+calm.

JSON:
{"their_feelings":["..."],"their_needs":["..."],"their_request":"...","reply_drafts":[{"label":"Empathy-first","text":"..."},{"label":"Accountability + repair","text":"..."},{"label":"Boundary + calm tone","text":"..."}],"avoid_list":["..."],"include_list":["..."]}`;

  const responseText = await callGemini(prompt);
  const parsed = JSON.parse(responseText);

  return {
    theirFeelings: parsed.their_feelings || [],
    theirNeeds: parsed.their_needs || [],
    theirRequest: parsed.their_request || '',
    replyDrafts: (parsed.reply_drafts || []).map((d: any) => ({
      label: d.label,
      text: d.text,
    })),
    avoidList: parsed.avoid_list || [],
    includeList: parsed.include_list || [],
  };
}
