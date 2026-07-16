import React, { lazy, Suspense } from 'react';
import { useNavigate } from 'react-router-dom';
import { categories, articles, experts } from '../data/mockData';
import Spinner from '../components/ui/Spinner';

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="page">
      {/* Hero */}
      <section className="hero">
        <div className="hero-inner">
          <div className="hero-text">
            <div className="hero-badge">
              <span className="dot" />
              AI-Powered Emotional Support
            </div>
            <h1>Find your <em>inner strength</em> and navigate life's challenges</h1>
            <p className="hero-sub">
              A compassionate space where AI-guided conversations, expert resources, and community support
              help you heal, grow, and thrive — one step at a time.
            </p>
            <div className="hero-actions">
              <button className="btn-primary" onClick={() => navigate('/chat')}>
                💬 Start Chat
              </button>
              <button className="btn-secondary" onClick={() => navigate('/articles')}>
                Explore Resources →
              </button>
            </div>
            <div className="hero-stats">
              <div className="stat">
                <div className="stat-num">12k+</div>
                <div className="stat-label">Lives touched</div>
              </div>
              <div className="stat">
                <div className="stat-num">98%</div>
                <div className="stat-label">Feel supported</div>
              </div>
              <div className="stat">
                <div className="stat-num">24/7</div>
                <div className="stat-label">Always here</div>
              </div>
            </div>
          </div>

          <div className="hero-visual">
            <div className="hero-card">
              <div className="hero-card-title">🌿 Sage — Your AI Companion</div>
              <div className="hero-chat-bubbles">
                <div className="bubble ai">Hi there 💙 How are you feeling today?</div>
                <div className="bubble user">I've been feeling overwhelmed lately...</div>
                <div className="bubble ai">I hear you. Let's work through this together. You're not alone.</div>
              </div>
            </div>
            <div className="hero-card">
              <div className="hero-card-title">How are you feeling right now?</div>
              <div className="hero-card-sub">Tap to explore resources tailored for you</div>
              <div className="mood-bar">
                {['😔', '😟', '😐', '🙂', '😊'].map((m, i) => (
                  <button key={i} className="mood-item" onClick={() => navigate('/chat')}>{m}</button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="section" style={{ background: 'var(--cream)' }}>
        <div className="section-inner">
          <div className="section-header">
            <span className="section-label">Explore Areas</span>
            <h2 className="section-title">What brings you here today?</h2>
            <p className="section-desc">
              Whatever you're facing, there's a path through it. Choose what resonates most.
            </p>
          </div>
          <div className="categories-grid">
            {categories.map(cat => (
              <div
                key={cat.id}
                className="category-card"
                style={{ '--cat-color': cat.color }}
                onClick={() => navigate('/articles')}
              >
                <div className="cat-icon">{cat.icon}</div>
                <div className="cat-title">{cat.title}</div>
                <div className="cat-desc">{cat.description}</div>
                <button className="cat-btn">Explore →</button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Articles */}
      <section className="section" style={{ background: 'var(--warm-white)' }}>
        <div className="section-inner">
          <div className="section-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <span className="section-label">Latest Reads</span>
              <h2 className="section-title">Articles for your journey</h2>
            </div>
            <button className="btn-secondary" style={{ fontSize: '0.88rem', padding: '0.6rem 1.4rem' }} onClick={() => navigate('/articles')}>
              View All Articles →
            </button>
          </div>
          <div className="cards-grid">
            {articles.slice(0, 3).map(a => (
              <div className="article-card" key={a.id}>
                <img src={a.image} alt={a.title} className="article-img" loading="lazy" />
                <div className="article-body">
                  <div className="article-meta">
                    <span className="article-cat">{a.category}</span>
                    <span className="article-time">{a.readTime}</span>
                  </div>
                  <h3 className="article-title">{a.title}</h3>
                  <p className="article-desc">{a.description}</p>
                  <button className="read-more" onClick={() => navigate('/articles')}>Read More →</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="section" style={{ background: 'var(--sage-dark)', color: 'white' }}>
        <div className="section-inner" style={{ textAlign: 'center' }}>
          <h2 style={{ color: 'white', marginBottom: '1rem' }}>
            You don't have to face this alone
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.8)', marginBottom: '2rem', fontSize: '1.05rem', maxWidth: '480px', margin: '0 auto 2rem' }}>
            Connect with Sage, our AI companion, and take the first step toward feeling better —
            in your own time, at your own pace.
          </p>
          <button
            className="btn-primary"
            style={{ background: 'white', color: 'var(--sage-dark)' }}
            onClick={() => navigate('/chat')}
          >
            🌿 Start a Conversation
          </button>
        </div>
      </section>

      {/* Expert Teaser */}
      <section className="section">
        <div className="section-inner">
          <div className="section-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <span className="section-label">Human Support</span>
              <h2 className="section-title">Connect with an expert</h2>
            </div>
            <button className="btn-secondary" style={{ fontSize: '0.88rem', padding: '0.6rem 1.4rem' }} onClick={() => navigate('/experts')}>
              View All Experts →
            </button>
          </div>
          <div className="experts-grid">
            {experts.slice(0, 3).map(e => (
              <div className="expert-card" key={e.id}>
                <div className="expert-avatar" style={{ background: e.color }}>{e.avatar}</div>
                <h3 className="expert-name">{e.name}</h3>
                <div className="expert-role">{e.role}</div>
                <div className="expert-spec">{e.specialty}</div>
                <div className="expert-tags">
                  <span className="expert-tag">{e.type}</span>
                  <span className="expert-tag">
                    <span className={`availability-dot ${e.availability.toLowerCase()}`} />
                    {e.availability}
                  </span>
                </div>
                <button className="contact-btn" onClick={() => navigate('/experts')}>
                  Book with {e.name.split(' ')[0]}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
