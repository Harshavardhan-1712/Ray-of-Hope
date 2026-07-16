import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { articlesAPI } from '../services/api';
import { articles as mockArticles } from '../data/mockData';
import Spinner from '../components/ui/Spinner';

const CATS = ['All', 'Mental Health', 'Relationships', 'Life Transitions', 'Financial Stress'];

export default function ArticlesPage() {
  const [activeTab, setActiveTab] = useState('All');
  const [search, setSearch] = useState('');
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchArticles = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};
      if (activeTab !== 'All') params.category = activeTab;
      if (search) params.search = search;
      const { data } = await articlesAPI.getAll(params);
      setArticles(data.articles || []);
    } catch {
      // Fallback to mock data when backend is unavailable
      const filtered = mockArticles.filter(a => {
        const matchCat = activeTab === 'All' || a.category === activeTab;
        const matchSearch = !search || a.title.toLowerCase().includes(search.toLowerCase());
        return matchCat && matchSearch;
      });
      setArticles(filtered);
    } finally {
      setLoading(false);
    }
  }, [activeTab, search]);

  useEffect(() => {
    const timer = setTimeout(fetchArticles, search ? 350 : 0); // debounce search
    return () => clearTimeout(timer);
  }, [fetchArticles, search]);

  return (
    <div className="page">
      <div className="page-hero">
        <span className="section-label">Articles</span>
        <h1>Words that heal & inspire</h1>
        <p>Evidence-based articles written with compassion — to guide your journey toward well-being.</p>
      </div>

      <section className="section">
        <div className="section-inner">
          <div className="search-bar">
            <span>🔍</span>
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search articles..."
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
            <Spinner size="lg" label="Loading articles..." />
          ) : articles.length > 0 ? (
            <div className="cards-grid">
              {articles.map(a => (
                <div className="article-card" key={a._id || a.id}>
                  <img src={a.image} alt={a.title} className="article-img" loading="lazy" />
                  <div className="article-body">
                    <div className="article-meta">
                      <span className="article-cat">{a.category}</span>
                      <span className="article-time">{a.readTime}</span>
                    </div>
                    <h3 className="article-title">{a.title}</h3>
                    <p className="article-desc">{a.description}</p>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <button className="read-more">Read More →</button>
                      <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                        {a.date || (a.createdAt && new Date(a.createdAt).toLocaleDateString())}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-icon">📄</div>
              <p>No articles found. Try a different search or category.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
