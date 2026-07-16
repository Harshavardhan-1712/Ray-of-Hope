import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { moodsAPI, journalsAPI, appointmentsAPI, articlesAPI } from '../services/api';
import { articles as mockArticles } from '../data/mockData';
import Spinner from '../components/ui/Spinner';

const DAILY_QUOTES = [
  "You don't have to be positive all the time. It's perfectly okay to feel sad, angry, annoyed, frustrated, scared. Having feelings doesn't make you a negative person. It makes you human. — Lori Deschene",
  "The greatest glory in living lies not in never falling, but in rising every time we fall. — Nelson Mandela",
  "Healing is not linear. Be gentle with yourself on this journey. 🌿",
  "You are enough, just as you are. Each emotion you feel, everything in your life, everything you do or do not do — it's all okay. You are loved. — Oprah Winfrey",
  "Self-care is how you take your power back. — Lalah Delia",
];

const MOOD_OPTIONS = [
  { emoji: '😊', label: '😊 Great' },
  { emoji: '🙂', label: '🙂 Good' },
  { emoji: '😐', label: '😐 Okay' },
  { emoji: '😟', label: '😟 Low' },
  { emoji: '😔', label: '😔 Struggling' },
];

export default function DashboardPage() {
  const { user } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const [moods, setMoods] = useState([]);
  const [journals, setJournals] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [featuredArticles, setFeaturedArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  // Journal modal state
  const [showJournal, setShowJournal] = useState(false);
  const [journalForm, setJournalForm] = useState({ title: '', content: '' });
  const [editingJournal, setEditingJournal] = useState(null);
  const [savingJournal, setSavingJournal] = useState(false);

  // Mood logging state
  const [loggingMood, setLoggingMood] = useState(false);
  const [moodNote, setMoodNote] = useState('');
  const [showMoodForm, setShowMoodForm] = useState(false);
  const [selectedMood, setSelectedMood] = useState(null);

  const quote = DAILY_QUOTES[new Date().getDay() % DAILY_QUOTES.length];

  const loadDashboard = useCallback(async () => {
    setLoading(true);
    try {
      const [moodRes, journalRes, apptRes, artRes] = await Promise.allSettled([
        moodsAPI.getHistory({ limit: 7 }),
        journalsAPI.getAll(),
        appointmentsAPI.getAll(),
        articlesAPI.getAll({ limit: 3 }),
      ]);
      if (moodRes.status === 'fulfilled') setMoods(moodRes.value.data.moods || []);
      if (journalRes.status === 'fulfilled') setJournals(journalRes.value.data.journals || []);
      if (apptRes.status === 'fulfilled') setAppointments(apptRes.value.data.appointments || []);
      setFeaturedArticles(
        artRes.status === 'fulfilled'
          ? artRes.value.data.articles || []
          : mockArticles.slice(0, 3)
      );
    } catch (e) {
      // silently show mock data
      setFeaturedArticles(mockArticles.slice(0, 3));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadDashboard(); }, [loadDashboard]);

  // ── Mood logging ─────────────────────────────────────────────────────────────
  const handleLogMood = async () => {
    if (!selectedMood) return;
    setLoggingMood(true);
    try {
      await moodsAPI.log({ mood: selectedMood, note: moodNote, emoji: selectedMood.split(' ')[0] });
      toast.success('Mood logged! 🌿');
      setShowMoodForm(false);
      setSelectedMood(null);
      setMoodNote('');
      loadDashboard();
    } catch {
      toast.error('Could not save mood. Please try again.');
    } finally {
      setLoggingMood(false);
    }
  };

  const handleDeleteMood = async (id) => {
    try {
      await moodsAPI.remove(id);
      setMoods((prev) => prev.filter((m) => m._id !== id));
      toast.success('Entry removed');
    } catch {
      toast.error('Could not delete entry');
    }
  };

  // ── Journal CRUD ──────────────────────────────────────────────────────────────
  const openNewJournal = () => {
    setEditingJournal(null);
    setJournalForm({ title: '', content: '' });
    setShowJournal(true);
  };

  const openEditJournal = (j) => {
    setEditingJournal(j);
    setJournalForm({ title: j.title, content: j.content });
    setShowJournal(true);
  };

  const handleSaveJournal = async (e) => {
    e.preventDefault();
    setSavingJournal(true);
    try {
      if (editingJournal) {
        await journalsAPI.update(editingJournal._id, journalForm);
        toast.success('Journal updated ✏️');
      } else {
        await journalsAPI.create(journalForm);
        toast.success('Journal saved 📔');
      }
      setShowJournal(false);
      loadDashboard();
    } catch {
      toast.error('Could not save journal');
    } finally {
      setSavingJournal(false);
    }
  };

  const handleDeleteJournal = async (id) => {
    if (!window.confirm('Delete this journal entry?')) return;
    try {
      await journalsAPI.remove(id);
      setJournals((prev) => prev.filter((j) => j._id !== id));
      toast.success('Journal deleted');
    } catch {
      toast.error('Could not delete journal');
    }
  };

  const handleCancelAppointment = async (id) => {
    if (!window.confirm('Cancel this appointment?')) return;
    try {
      await appointmentsAPI.cancel(id);
      toast.success('Appointment cancelled');
      loadDashboard();
    } catch {
      toast.error('Could not cancel appointment');
    }
  };

  if (loading) return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}><Spinner size="lg" label="Loading your dashboard..." /></div>;

  const upcomingAppts = appointments.filter(
    (a) => a.status !== 'cancelled' && new Date(a.appointmentDate) >= new Date()
  );

  return (
    <div className="page">
      {/* Header */}
      <div className="page-hero" style={{ textAlign: 'left', padding: '3rem 2rem 2rem' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <span className="section-label">Dashboard</span>
          <h1>Welcome back, {user?.name?.split(' ')[0]} 🌿</h1>
          <p style={{ color: 'var(--text-secondary)', maxWidth: 560, marginTop: '0.5rem' }}>{quote}</p>
        </div>
      </div>

      <section className="section" style={{ paddingTop: '2rem' }}>
        <div className="section-inner">
          {/* Stats row */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '1rem', marginBottom: '2.5rem' }}>
            {[
              { icon: '📊', label: 'Mood logs', value: moods.length },
              { icon: '📔', label: 'Journals', value: journals.length },
              { icon: '📅', label: 'Upcoming', value: upcomingAppts.length },
              { icon: '📖', label: 'Articles', value: '8+' },
            ].map((s) => (
              <div key={s.label} className="hero-card" style={{ textAlign: 'center', padding: '1.25rem' }}>
                <div style={{ fontSize: '1.75rem', marginBottom: '0.4rem' }}>{s.icon}</div>
                <div className="stat-num">{s.value}</div>
                <div className="stat-label">{s.label}</div>
              </div>
            ))}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
            {/* ── Mood Tracker ── */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h2 style={{ fontSize: '1.2rem' }}>📊 Mood Tracker</h2>
                <button className="nav-cta" style={{ fontSize: '0.8rem', padding: '0.4rem 0.9rem' }} onClick={() => setShowMoodForm(true)}>
                  + Log Today
                </button>
              </div>

              {showMoodForm && (
                <div className="hero-card" style={{ marginBottom: '1rem' }}>
                  <p style={{ fontSize: '0.9rem', fontWeight: 600, marginBottom: '0.75rem' }}>How are you feeling right now?</p>
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
                    {MOOD_OPTIONS.map((m) => (
                      <button
                        key={m.label}
                        onClick={() => setSelectedMood(m.label)}
                        style={{
                          padding: '0.4rem 0.8rem', borderRadius: '20px', border: '1.5px solid',
                          borderColor: selectedMood === m.label ? 'var(--sage-dark)' : 'var(--border)',
                          background: selectedMood === m.label ? 'rgba(77,122,90,0.1)' : 'transparent',
                          fontSize: '0.85rem', cursor: 'pointer', transition: 'all 0.2s',
                        }}
                      >
                        {m.label}
                      </button>
                    ))}
                  </div>
                  <textarea
                    className="chat-input"
                    placeholder="Add a note (optional)..."
                    value={moodNote}
                    onChange={(e) => setMoodNote(e.target.value)}
                    rows={2}
                    style={{ width: '100%', marginBottom: '0.75rem' }}
                  />
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button className="btn-primary" style={{ fontSize: '0.85rem', padding: '0.5rem 1.2rem' }} onClick={handleLogMood} disabled={!selectedMood || loggingMood}>
                      {loggingMood ? 'Saving...' : 'Save'}
                    </button>
                    <button className="clear-btn" onClick={() => setShowMoodForm(false)}>Cancel</button>
                  </div>
                </div>
              )}

              {moods.length === 0 ? (
                <div className="empty-state" style={{ padding: '2rem' }}>
                  <div className="empty-icon">😌</div>
                  <p style={{ fontSize: '0.9rem' }}>No mood logs yet. Log your first mood!</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                  {moods.map((m) => (
                    <div key={m._id} className="hero-card" style={{ padding: '0.85rem 1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div>
                        <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{m.mood}</span>
                        {m.note && <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>{m.note}</p>}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          {new Date(m.date).toLocaleDateString()}
                        </span>
                        <button onClick={() => handleDeleteMood(m._id)} style={{ background: 'none', border: 'none', fontSize: '0.85rem', cursor: 'pointer', color: 'var(--text-muted)' }}>✕</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* ── Journals ── */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h2 style={{ fontSize: '1.2rem' }}>📔 My Journals</h2>
                <button className="nav-cta" style={{ fontSize: '0.8rem', padding: '0.4rem 0.9rem' }} onClick={openNewJournal}>
                  + New Entry
                </button>
              </div>

              {journals.length === 0 ? (
                <div className="empty-state" style={{ padding: '2rem' }}>
                  <div className="empty-icon">✍️</div>
                  <p style={{ fontSize: '0.9rem' }}>Start your first journal entry today.</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                  {journals.slice(0, 5).map((j) => (
                    <div key={j._id} className="hero-card" style={{ padding: '0.9rem 1rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <p style={{ fontWeight: 600, fontSize: '0.9rem', marginBottom: '0.2rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{j.title}</p>
                          <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                            {new Date(j.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <div style={{ display: 'flex', gap: '0.4rem', flexShrink: 0, marginLeft: '0.5rem' }}>
                          <button onClick={() => openEditJournal(j)} style={{ background: 'none', border: 'none', fontSize: '0.85rem', cursor: 'pointer', color: 'var(--sage-dark)' }}>✏️</button>
                          <button onClick={() => handleDeleteJournal(j._id)} style={{ background: 'none', border: 'none', fontSize: '0.85rem', cursor: 'pointer', color: 'var(--text-muted)' }}>🗑</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* ── Appointments ── */}
          <div style={{ marginTop: '2.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h2 style={{ fontSize: '1.2rem' }}>📅 Upcoming Appointments</h2>
              <button className="btn-secondary" style={{ fontSize: '0.85rem', padding: '0.5rem 1rem' }} onClick={() => navigate('/experts')}>
                Book New →
              </button>
            </div>
            {upcomingAppts.length === 0 ? (
              <div className="empty-state" style={{ padding: '2rem' }}>
                <div className="empty-icon">📅</div>
                <p style={{ fontSize: '0.9rem' }}>No upcoming appointments. <button onClick={() => navigate('/experts')} style={{ background: 'none', border: 'none', color: 'var(--sage-dark)', cursor: 'pointer', fontWeight: 600 }}>Book one now →</button></p>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
                {upcomingAppts.map((a) => (
                  <div key={a._id} className="hero-card" style={{ padding: '1.1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                      <div className="expert-avatar" style={{ width: 40, height: 40, fontSize: '0.9rem', background: a.expert?.color || 'var(--sage)', flexShrink: 0 }}>
                        {a.expert?.avatar || '?'}
                      </div>
                      <div>
                        <p style={{ fontWeight: 600, fontSize: '0.9rem' }}>{a.expert?.name}</p>
                        <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{a.expert?.role}</p>
                      </div>
                    </div>
                    <p style={{ fontSize: '0.82rem', color: 'var(--sage-dark)', marginBottom: '0.5rem' }}>
                      📅 {new Date(a.appointmentDate).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
                    </p>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: '0.75rem', padding: '0.2rem 0.6rem', borderRadius: '12px', background: a.status === 'pending' ? 'rgba(245,158,11,0.12)' : 'rgba(16,185,129,0.12)', color: a.status === 'pending' ? '#b45309' : '#065f46' }}>
                        {a.status}
                      </span>
                      <button onClick={() => handleCancelAppointment(a._id)} style={{ background: 'none', border: 'none', fontSize: '0.78rem', color: 'var(--text-muted)', cursor: 'pointer' }}>
                        Cancel
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ── Recommended Articles ── */}
          <div style={{ marginTop: '2.5rem' }}>
            <h2 style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>📖 Recommended for You</h2>
            <div className="cards-grid">
              {featuredArticles.map((a) => (
                <div className="article-card" key={a._id || a.id}>
                  <img src={a.image} alt={a.title} className="article-img" />
                  <div className="article-body">
                    <div className="article-meta">
                      <span className="article-cat">{a.category}</span>
                      <span className="article-time">{a.readTime}</span>
                    </div>
                    <h3 className="article-title">{a.title}</h3>
                    <button className="read-more" onClick={() => navigate('/articles')}>Read More →</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Journal Modal ── */}
      {showJournal && (
        <div className="modal-overlay" onClick={() => setShowJournal(false)}>
          <div className="modal-box" style={{ maxWidth: 560, padding: '2rem' }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.4rem' }}>
                {editingJournal ? 'Edit Journal' : 'New Journal Entry'}
              </h2>
              <button className="modal-close" onClick={() => setShowJournal(false)}>✕</button>
            </div>
            <form onSubmit={handleSaveJournal} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Title</label>
                <input
                  className="form-input"
                  placeholder="What's on your mind today?"
                  value={journalForm.title}
                  onChange={(e) => setJournalForm((f) => ({ ...f, title: e.target.value }))}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Your thoughts</label>
                <textarea
                  className="form-input"
                  placeholder="Write freely — this is your private space..."
                  value={journalForm.content}
                  onChange={(e) => setJournalForm((f) => ({ ...f, content: e.target.value }))}
                  required
                  rows={8}
                  style={{ resize: 'vertical' }}
                />
              </div>
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button type="submit" className="btn-primary" style={{ flex: 1, justifyContent: 'center' }} disabled={savingJournal}>
                  {savingJournal ? 'Saving...' : editingJournal ? 'Update Entry' : 'Save Entry'}
                </button>
                <button type="button" className="btn-secondary" onClick={() => setShowJournal(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
