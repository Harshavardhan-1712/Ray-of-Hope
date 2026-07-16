import React, { useState, useEffect, useRef, useCallback } from 'react';
import { chatAPI } from '../services/api';
import { aiResponses } from '../data/mockData';

const STORAGE_KEY = 'roh_chat_history';

function formatTime(ts) {
  return new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

const EMOTION_CHIPS = [
  '😔 I feel sad', '😰 Anxious', '💔 Heartbroken',
  '😤 Overwhelmed', '😶 Numb', '🌱 Ready to grow'
];

const TIPS = [
  { title: '💡 Try asking', body: '"How do I deal with anxiety?" or "I\'m feeling overwhelmed lately"' },
  { title: '🧘 Quick exercise', body: 'Breathe in for 4 counts, hold for 4, out for 6. Repeat 3 times.' },
  { title: '📖 Did you know?', body: 'Journaling for 20 minutes a day can significantly reduce stress and improve emotional clarity.' },
  { title: '🌿 Reminder', body: 'This is a judgment-free space. Say whatever is on your mind — Sage is here to listen.' },
];

// Local fallback if backend is unavailable
function localFallback(text) {
  const lower = text.toLowerCase();
  if (/anxious|anxiety|panic|worry|nervous/.test(lower)) {
    return aiResponses.anxiety[Math.floor(Math.random() * aiResponses.anxiety.length)];
  }
  if (/depress|sad|hopeless|empty|numb|lonely/.test(lower)) {
    return aiResponses.depression[Math.floor(Math.random() * aiResponses.depression.length)];
  }
  if (/relationship|breakup|partner|love|family|friend/.test(lower)) {
    return aiResponses.relationship[Math.floor(Math.random() * aiResponses.relationship.length)];
  }
  if (/stress|overwhelm|burnout|tired|exhaust/.test(lower)) {
    return aiResponses.stress[Math.floor(Math.random() * aiResponses.stress.length)];
  }
  return aiResponses.default[Math.floor(Math.random() * aiResponses.default.length)];
}

export default function ChatPage() {
  const [messages, setMessages] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) return JSON.parse(stored);
    } catch {}
    return [{
      id: 1, role: 'ai', timestamp: Date.now(),
      text: aiResponses.greeting[0]
    }];
  });
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typing]);

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(messages)); } catch {}
  }, [messages]);

  const sendMessage = useCallback(async (text) => {
    const userText = (text || input).trim();
    if (!userText) return;
    setInput('');

    const userMsg = { id: Date.now(), role: 'user', timestamp: Date.now(), text: userText };
    setMessages(prev => [...prev, userMsg]);
    setTyping(true);

    // Build history for context (last 10 messages)
    const history = messages.slice(-10).map(m => ({ role: m.role, text: m.text }));

    try {
      // Try backend API first
      const { data } = await chatAPI.send(userText, history);
      const aiMsg = {
        id: Date.now() + 1, role: 'ai', timestamp: Date.now(),
        text: data.reply,
        emotion: data.emotion,
      };
      setMessages(prev => [...prev, aiMsg]);
    } catch {
      // Graceful fallback to local keyword matching
      await new Promise(r => setTimeout(r, 900 + Math.random() * 600));
      const aiMsg = {
        id: Date.now() + 1, role: 'ai', timestamp: Date.now(),
        text: localFallback(userText),
      };
      setMessages(prev => [...prev, aiMsg]);
    } finally {
      setTyping(false);
    }
  }, [input, messages]);

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  const clearChat = () => {
    setMessages([{
      id: 1, role: 'ai', timestamp: Date.now(),
      text: aiResponses.greeting[Math.floor(Math.random() * aiResponses.greeting.length)]
    }]);
    localStorage.removeItem(STORAGE_KEY);
  };

  return (
    <div className="chat-page">
      {/* Sidebar */}
      <aside className="chat-sidebar">
        <div className="sidebar-title">Tips & Reminders</div>
        {TIPS.map((t, i) => (
          <div className="sidebar-tip" key={i}>
            <strong>{t.title}</strong>{t.body}
          </div>
        ))}
        <div style={{ marginTop: '1.5rem' }}>
          <div className="sidebar-title">Quick Phrases</div>
          {EMOTION_CHIPS.map((c, i) => (
            <button
              key={i}
              className="emotion-chip"
              style={{ marginBottom: '0.4rem', display: 'block', width: '100%', textAlign: 'left' }}
              onClick={() => sendMessage(c)}
            >
              {c}
            </button>
          ))}
        </div>
      </aside>

      {/* Main Chat */}
      <div className="chat-main">
        <div className="chat-header">
          <div className="chat-avatar">🌿</div>
          <div className="chat-info">
            <h3>Sage</h3>
            <p>● Always here for you</p>
          </div>
          <div className="chat-actions">
            <button className="clear-btn" onClick={clearChat}>Clear chat</button>
          </div>
        </div>

        <div className="chat-messages">
          {messages.map(msg => (
            <div key={msg.id} className={`msg ${msg.role}`}>
              <div className="msg-avatar">
                {msg.role === 'ai' ? '🌿' : 'You'}
              </div>
              <div>
                <div className="msg-bubble">{msg.text}</div>
                <div className="msg-time">{formatTime(msg.timestamp)}</div>
              </div>
            </div>
          ))}
          {typing && (
            <div className="msg ai">
              <div className="msg-avatar">🌿</div>
              <div className="msg-bubble">
                <div className="typing">
                  <span /><span /><span />
                </div>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        <div className="chat-input-area">
          <div className="emotion-chips">
            {EMOTION_CHIPS.map((c, i) => (
              <button key={i} className="emotion-chip" onClick={() => sendMessage(c)}>
                {c}
              </button>
            ))}
          </div>
          <div className="chat-form">
            <textarea
              className="chat-input"
              rows={1}
              placeholder="Share what's on your mind..."
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKey}
            />
            <button
              className="send-btn"
              onClick={() => sendMessage()}
              disabled={!input.trim() || typing}
            >
              ➤
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
