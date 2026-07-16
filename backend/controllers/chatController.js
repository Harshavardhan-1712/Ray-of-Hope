/**
 * Chat controller – structured for easy AI provider swap.
 *
 * To plug in OpenAI:
 *   npm install openai
 *   Uncomment the OpenAI block below and set OPENAI_API_KEY in .env
 *
 * To plug in Gemini:
 *   npm install @google/generative-ai
 *   Uncomment the Gemini block and set GEMINI_API_KEY in .env
 */

// ── Keyword-based fallback responses (mirrors existing frontend logic) ────────
const responses = {
  anxiety: [
    "I hear you — anxiety can feel overwhelming. Try the 5-4-3-2-1 grounding technique: name 5 things you see, 4 you can touch, 3 you hear, 2 you smell, 1 you taste. It anchors you to the present. 💙\n\nWould you like to explore our anxiety resources?",
    "Anxiety is your nervous system trying to protect you — but sometimes it misfires. Try breathing in for 4 counts, holding for 4, out for 6. This activates your parasympathetic nervous system and signals safety. 🌿",
  ],
  depression: [
    "Thank you for trusting me with this. Depression is heavy to carry, and reaching out takes real courage. 🌿\n\nYou don't have to have everything figured out right now. One step at a time.",
    "I want you to know: depression lies. It tells you things will always be this way — they won't. You're showing up for yourself by being here. That counts. 💙",
  ],
  relationship: [
    "Relationships can be one of life's greatest joys — and deepest sources of pain. Whatever you're navigating, your feelings are completely valid. 💕\n\nWould you like to tell me more about what's happening?",
    "Heartache is real pain. Whether you're healing from a breakup, struggling with communication, or feeling disconnected — you deserve support and understanding.",
  ],
  stress: [
    "Stress, especially when it piles up, can make everything feel impossible. Let's slow down together. 🌊\n\nOne tip: write down everything stressing you, then circle just ONE thing you can act on today.",
    "When we're overwhelmed, our brain's problem-solving capacity actually reduces — so it's not a character flaw. It's biology. Let's work through this one step at a time. 🌿",
  ],
  default: [
    "Thank you for sharing that with me. I want to make sure I fully understand what you're going through. Could you tell me a little more? I'm here and listening. 💙",
    "That sounds really challenging. You've taken a brave first step just by being here. What feels most difficult right now?",
    "I'm here with you. Whatever you're facing, you don't have to face it alone. 🌿",
  ],
};

const detectEmotion = (text) => {
  const lower = text.toLowerCase();
  if (/anxious|anxiety|panic|worry|worried|nervous/.test(lower)) return 'anxiety';
  if (/depress|sad|hopeless|empty|numb|lonely|alone/.test(lower)) return 'depression';
  if (/relationship|breakup|partner|love|family|friend|marriage|divorce/.test(lower)) return 'relationship';
  if (/stress|overwhelm|burnout|tired|exhaust|pressure/.test(lower)) return 'stress';
  return 'default';
};

const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

// ── @route   POST /api/chat ───────────────────────────────────────────────────
// ── @access  Public (auth optional – enrich later if needed)
const chat = async (req, res, next) => {
  try {
    const { message, history = [] } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({ success: false, message: 'Message is required' });
    }

    /* ── OpenAI integration (uncomment when ready) ──────────────────────────
    const OpenAI = require('openai');
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: 'You are Sage, a compassionate mental wellness AI companion on the Ray of Hope platform. Respond with empathy, warmth, and evidence-based suggestions. Always recommend professional help for serious concerns.' },
        ...history.map(h => ({ role: h.role === 'ai' ? 'assistant' : 'user', content: h.text })),
        { role: 'user', content: message },
      ],
    });
    const reply = completion.choices[0].message.content;
    ── end OpenAI block ─────────────────────────────────────────────────── */

    /* ── Gemini integration (uncomment when ready) ──────────────────────────
    const { GoogleGenerativeAI } = require('@google/generative-ai');
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    const chat = model.startChat({ history: history.map(h => ({ role: h.role === 'ai' ? 'model' : 'user', parts: [{ text: h.text }] })) });
    const result = await chat.sendMessage(message);
    const reply = result.response.text();
    ── end Gemini block ─────────────────────────────────────────────────── */

    // ── Keyword fallback (active by default) ─────────────────────────────────
    const emotion = detectEmotion(message);
    const reply = pick(responses[emotion]);

    res.json({ success: true, reply, emotion });
  } catch (err) {
    next(err);
  }
};

module.exports = { chat };
