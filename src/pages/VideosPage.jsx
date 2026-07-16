import React, { useState, useEffect, useCallback } from 'react';
import { videosAPI } from '../services/api';
import { videos as mockVideos } from '../data/mockData';
import Spinner from '../components/ui/Spinner';

const CATS = ['All', 'Therapy Techniques', 'Expert Interviews', 'Motivational Stories'];

export default function VideosPage() {
  const [activeTab, setActiveTab] = useState('All');
  const [search, setSearch] = useState('');
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedVideo, setSelectedVideo] = useState(null);

  const fetchVideos = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};
      if (activeTab !== 'All') params.category = activeTab;
      if (search) params.search = search;
      const { data } = await videosAPI.getAll(params);
      setVideos(data.videos || []);
    } catch {
      const filtered = mockVideos.filter(v => {
        const matchCat = activeTab === 'All' || v.category === activeTab;
        const matchSearch = !search || v.title.toLowerCase().includes(search.toLowerCase());
        return matchCat && matchSearch;
      });
      setVideos(filtered);
    } finally {
      setLoading(false);
    }
  }, [activeTab, search]);

  useEffect(() => {
    const timer = setTimeout(fetchVideos, search ? 350 : 0);
    return () => clearTimeout(timer);
  }, [fetchVideos, search]);

  // Close modal on Escape key
  useEffect(() => {
    const handleKey = (e) => { if (e.key === 'Escape') setSelectedVideo(null); };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  return (
    <div className="page">
      <div className="page-hero">
        <span className="section-label">Video Library</span>
        <h1>Watch, learn & be inspired</h1>
        <p>Curated videos from therapists, psychologists and real people sharing their healing journeys.</p>
      </div>

      <section className="section">
        <div className="section-inner">
          <div className="search-bar">
            <span>🔍</span>
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search videos..."
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
            <Spinner size="lg" label="Loading videos..." />
          ) : videos.length > 0 ? (
            <div className="cards-grid">
              {videos.map(v => (
                <div className="video-card" key={v._id || v.id} onClick={() => setSelectedVideo(v)}>
                  <div className="video-thumb">
                    <img
                      src={v.thumbnail || `https://img.youtube.com/vi/${v.videoId}/hqdefault.jpg`}
                      alt={v.title}
                      loading="lazy"
                    />
                    <div className="play-overlay">
                      <div className="play-btn">▶</div>
                    </div>
                    <span className="duration-badge">{v.duration}</span>
                  </div>
                  <div className="video-body">
                    <div className="video-cat">{v.category}</div>
                    <div className="video-title">{v.title}</div>
                    <div className="video-desc">{v.description}</div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-icon">🎥</div>
              <p>No videos found. Try a different search or category.</p>
            </div>
          )}
        </div>
      </section>

      {/* Video Modal */}
      {selectedVideo && (
        <div className="modal-overlay" onClick={() => setSelectedVideo(null)}>
          <div className="modal-box" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">{selectedVideo.title}</h3>
              <button className="modal-close" onClick={() => setSelectedVideo(null)}>✕</button>
            </div>
            <div className="modal-video">
              <iframe
                src={`https://www.youtube.com/embed/${selectedVideo.videoId}?autoplay=1&rel=0`}
                title={selectedVideo.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
