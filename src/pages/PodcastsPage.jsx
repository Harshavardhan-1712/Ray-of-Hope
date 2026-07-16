import React, { useState, useEffect, useCallback } from 'react';
import { podcastsAPI } from '../services/api';
import { podcasts as mockPodcasts } from '../data/mockData';
import Spinner from '../components/ui/Spinner';

const CATS = ['All', 'Mindfulness', 'Positive Psychology', 'Self-Improvement'];
const ICONS = { Mindfulness: '🧘', 'Positive Psychology': '🌞', 'Self-Improvement': '🚀' };

export default function PodcastsPage() {
  const [activeTab, setActiveTab] = useState('All');
  const [search, setSearch] = useState('');
  const [podcasts, setPodcasts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPodcasts = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};
      if (activeTab !== 'All') params.category = activeTab;
      if (search) params.search = search;
      const { data } = await podcastsAPI.getAll(params);
      setPodcasts(data.podcasts || []);
    } catch {
      const filtered = mockPodcasts.filter(p => {
        const matchCat = activeTab === 'All' || p.category === activeTab;
        const matchSearch = !search || p.title.toLowerCase().includes(search.toLowerCase());
        return matchCat && matchSearch;
      });
      setPodcasts(filtered);
    } finally {
      setLoading(false);
    }
  }, [activeTab, search]);

  useEffect(() => {
    const timer = setTimeout(fetchPodcasts, search ? 350 : 0);
    return () => clearTimeout(timer);
  }, [fetchPodcasts, search]);

  return (
    <div className="page">
      <div className="page-hero">
        <span className="section-label">Podcasts</span>
        <h1>Listen your way to well-being</h1>
        <p>Handpicked podcasts from leading voices in mental health, mindfulness and personal growth.</p>
      </div>

      <section className="section">
        <div className="section-inner">
          <div className="search-bar">
            <span>🔍</span>
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search podcasts..."
            />
            {search && (
              <button style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '1rem' }} onClick={() => setSearch('')}>✕</button>
            )}
          </div>

          <div className="filter-tabs">
            {CATS.map(c => (
              <button key={c} className={`tab-btn ${activeTab === c ? 'active' : ''}`} onClick={() => setActiveTab(c)}>
                {c}
              </button>
            ))}
          </div>

          {loading ? (
            <Spinner size="lg" label="Loading podcasts..." />
          ) : podcasts.length > 0 ? (
            <div className="podcast-grid">
              {podcasts.map(p => (
                <div className="podcast-card" key={p._id || p.id} style={{ '--pod-color': p.color }}>
                  <div className="pod-header">
                    <div className="pod-icon">{ICONS[p.category] || '🎧'}</div>
                    <span className="pod-cat">{p.category}</span>
                  </div>
                  <div className="pod-title">{p.title}</div>
                  <div className="pod-host">by {p.host}</div>
                  <p className="pod-desc">{p.description}</p>
                  <div className="pod-meta">
                    <span className="pod-episodes">🎙 {p.episodes}</span>
                    <a href={p.link || p.audioUrl || '#'} target="_blank" rel="noopener noreferrer">
                      <button className="pod-play">▶ Listen</button>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-icon">🎧</div>
              <p>No podcasts found. Try a different search or category.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
