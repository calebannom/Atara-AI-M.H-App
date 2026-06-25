import { AI_CONFIG } from '@/constants/aiConfig';

type Message = {
  role: 'user' | 'assistant' | 'system';
  content: string;
};

// ─── Gemini ───────────────────────────────────────────────────────────────────
async function callGemini(conversationHistory: Message[]): Promise<string> {
  // This is the most reliable model/endpoint combo!
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${AI_CONFIG.apiKey}`;

  const body = {
    contents: conversationHistory
      .filter(m => m.role !== 'system')
      .map(m => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.content }],
      })),
    generationConfig: {
      temperature: 0.9,
      maxOutputTokens: 500,
      topP: 0.95,
    },
  };

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const err = await response.json();
    console.error('Gemini API Error:', err);
    throw new Error(err?.error?.message || 'Gemini request failed');
  }

  const data = await response.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
  
  if (!text) {
    throw new Error('Empty response from Gemini');
  }

  return text;
}

// ─── OpenRouter ───────────────────────────────────────────────────────────────
async function callOpenRouter(conversationHistory: Message[]): Promise<string> {
  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${AI_CONFIG.apiKey}`,
    },
    body: JSON.stringify({
      model: AI_CONFIG.openrouterModel,
      messages: [
        { role: 'system', content: AI_CONFIG.systemPrompt },
        ...conversationHistory.filter(m => m.role !== 'system'),
      ],
      max_tokens: 300,
      temperature: 0.85,
    }),
  });

  if (!response.ok) {
    const err = await response.json();
    throw new Error(err?.error?.message || 'OpenRouter request failed');
  }

  const data = await response.json();
  return (
    data.choices?.[0]?.message?.content ??
    "I'm here for you 💛 Could you tell me a little more?"
  );
}

// ─── Mock fallback ────────────────────────────────────────────────────────────
const getMockResponse = (conversationHistory: Message[]): string => {
  const userMessages = conversationHistory.filter(m => m.role === 'user');
  const lastMsg = userMessages.pop()?.content?.toLowerCase() || '';

  // Randomize responses slightly to avoid feeling "one-way"
  const randomSuffix = [
    "I'm here to listen to whatever is on your mind. 💛",
    "How does that make you feel when you think about it? 🌿",
    "Thank you for being so open with me. What else are you noticing?",
    "I appreciate you sharing that. It's okay to feel this way. 💛",
    "That sounds like a lot to carry. Is there anything else you'd like to vent about?",
  ][Math.floor(Math.random() * 5)];

  if (lastMsg.includes('why') || lastMsg.includes('because'))
    return `That makes a lot of sense! Understanding the 'why' is such a big step. ${randomSuffix}`;
  
  if (lastMsg.includes('yes') || lastMsg.includes('yeah') || lastMsg.includes('okay'))
    return `I hear you. 🌿 Sometimes just acknowledging things is enough. What's next on your mind?`;

  if (lastMsg.includes('anxious') || lastMsg.includes('anxiety'))
    return `I hear the anxiety in your words, and I want you to know it's okay to feel this way. 😔 It can be so overwhelming. Would you like to try a quick breathing exercise or talk more about what's triggering it?`;

  if (lastMsg.includes('sad') || lastMsg.includes('depressed') || lastMsg.includes('lonely'))
    return `I'm so sorry things feel heavy right now. 💛 It takes so much strength to show up when you're feeling this way. I'm right here with you. What do you think you need most in this moment?`;

  if (lastMsg.includes('stress') || lastMsg.includes('overwhelmed') || lastMsg.includes('work'))
    return `It sounds like you're carrying a huge load right now. 🌿 It's no wonder you're feeling stressed. If we could pause everything for just a minute, what's one small thing that might make the next hour feel easier?`;

  if (lastMsg.includes('thank'))
    return "You're so welcome. 💛 I'm grateful to be part of your journey today. Is there anything else we should talk about before we wrap up?";

  if (lastMsg.includes('hello') || lastMsg.includes('hi') || lastMsg.includes('hey'))
    return "Hi there! 🌿 I'm Atara, your mental health companion. I'm here to listen without judgment. How are you feeling in this moment?";

  return `Thanks for sharing that with me. 🌿 It sounds like you're processing quite a bit. ${randomSuffix}`;
};

// ─── Main export ──────────────────────────────────────────────────────────────
export async function callAI(conversationHistory: Message[]): Promise<string> {
  // Use only mock responses for now to avoid API errors!
  await new Promise(resolve => setTimeout(resolve, 800));
  return getMockResponse(conversationHistory);
}