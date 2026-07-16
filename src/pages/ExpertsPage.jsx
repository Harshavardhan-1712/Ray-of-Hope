import React, { useState, useEffect, useCallback } from 'react';
import { expertsAPI, appointmentsAPI } from '../services/api';
import { experts as mockExperts } from '../data/mockData';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import Spinner from '../components/ui/Spinner';

const TYPES = ['All', 'Therapist', 'Life Coach', 'Support Group'];

export default function ExpertsPage() {
  const { isAuthenticated } = useAuth();
  const toast = useToast();

  const [activeTab, setActiveTab] = useState('All');
  const [search, setSearch] = useState('');
  const [experts, setExperts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Booking modal
  const [bookingExpert, setBookingExpert] = useState(null);
  const [bookingForm, setBookingForm] = useState({ appointmentDate: '', reason: '' });
  const [booking, setBooking] = useState(false);

  const fetchExperts = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};
      if (activeTab !== 'All') params.type = activeTab;
      if (search) params.search = search;
      const { data } = await expertsAPI.getAll(params);
      setExperts(data.experts || []);
    } catch {
      const filtered = mockExperts.filter(e => {
        const matchType = activeTab === 'All' || e.type === activeTab;
        const matchSearch = !search || e.name.toLowerCase().includes(search.toLowerCase()) || e.specialty?.toLowerCase().includes(search.toLowerCase());
        return matchType && matchSearch;
      });
      setExperts(filtered);
    } finally {
      setLoading(false);
    }
  }, [activeTab, search]);

  useEffect(() => {
    const timer = setTimeout(fetchExperts, search ? 350 : 0);
    return () => clearTimeout(timer);
  }, [fetchExperts, search]);

  const handleBookClick = (expert) => {
    if (!isAuthenticated) {
      toast.error('Please log in to book an appointment');
      return;
    }
    setBookingExpert(expert);
    setBookingForm({ appointmentDate: '', reason: '' });
  };

  const handleBookSubmit = async (e) => {
    e.preventDefault();
    setBooking(true);
    try {
      const expertId = bookingExpert._id || bookingExpert.id;
      await appointmentsAPI.book({
        expert: expertId,
        appointmentDate: bookingForm.appointmentDate,
        reason: bookingForm.reason,
      });
      toast.success(`Appointment booked with ${bookingExpert.name}! 📅`);
      setBookingExpert(null);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Booking failed. Please try again.');
    } finally {
      setBooking(false);
    }
  };

  return (
    <div className="page">
      <div className="page-hero">
        <span className="section-label">Expert Support</span>
        <h1>Connect with a human who cares</h1>
        <p>Our network of therapists, coaches and support groups are ready to walk alongside you.</p>
      </div>

      <section className="section">
        <div className="section-inner">
          <div className="search-bar">
            <span>🔍</span>
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by name or speciality..."
            />
            {search && (
              <button style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '1rem' }} onClick={() => setSearch('')}>✕</button>
            )}
          </div>

          <div className="filter-tabs">
            {TYPES.map(t => (
              <button key={t} className={`tab-btn ${activeTab === t ? 'active' : ''}`} onClick={() => setActiveTab(t)}>
                {t}
              </button>
            ))}
          </div>

          {loading ? (
            <Spinner size="lg" label="Loading experts..." />
          ) : experts.length > 0 ? (
            <div className="experts-grid">
              {experts.map(e => {
                const dotClass = e.availability === 'Available' ? 'available' : e.availability === 'Busy' ? 'busy' : 'weekly';
                return (
                  <div className="expert-card" key={e._id || e.id}>
                    <div className="expert-avatar" style={{ background: e.color }}>{e.avatar}</div>
                    <h3 className="expert-name">{e.name}</h3>
                    <div className="expert-role">{e.role}</div>
                    <div className="expert-spec">{e.specialty || e.specialization}</div>
                    <div className="expert-tags">
                      <span className="expert-tag">{e.type}</span>
                      <span className="expert-tag">
                        <span className={`availability-dot ${dotClass}`} />
                        {e.availability}
                      </span>
                      <span className="expert-tag">🗂 {e.sessions}</span>
                    </div>
                    <button
                      className="contact-btn"
                      onClick={() => handleBookClick(e)}
                      disabled={e.availability === 'Busy'}
                    >
                      {e.availability === 'Busy' ? 'Currently Unavailable' : `Book with ${e.name.split(' ')[0]}`}
                    </button>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-icon">👨‍⚕️</div>
              <p>No experts found. Try a different filter.</p>
            </div>
          )}
        </div>
      </section>

      {/* Booking Modal */}
      {bookingExpert && (
        <div className="modal-overlay" onClick={() => setBookingExpert(null)}>
          <div className="modal-box" style={{ maxWidth: 480, padding: '2rem' }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <div>
                <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.4rem' }}>Book Appointment</h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '0.2rem' }}>with {bookingExpert.name}</p>
              </div>
              <button className="modal-close" onClick={() => setBookingExpert(null)}>✕</button>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem', background: 'var(--warm-white)', borderRadius: 'var(--radius-sm)', marginBottom: '1.25rem' }}>
              <div className="expert-avatar" style={{ width: 44, height: 44, background: bookingExpert.color, fontSize: '0.9rem', flexShrink: 0 }}>{bookingExpert.avatar}</div>
              <div>
                <p style={{ fontWeight: 600, fontSize: '0.9rem' }}>{bookingExpert.name}</p>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{bookingExpert.specialty || bookingExpert.specialization}</p>
              </div>
            </div>

            <form onSubmit={handleBookSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Preferred Date & Time</label>
                <input
                  className="form-input"
                  type="datetime-local"
                  value={bookingForm.appointmentDate}
                  onChange={e => setBookingForm(f => ({ ...f, appointmentDate: e.target.value }))}
                  required
                  min={new Date().toISOString().slice(0, 16)}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Reason for session <span style={{ color: 'var(--text-muted)' }}>(optional)</span></label>
                <textarea
                  className="form-input"
                  placeholder="e.g. Struggling with anxiety at work..."
                  value={bookingForm.reason}
                  onChange={e => setBookingForm(f => ({ ...f, reason: e.target.value }))}
                  rows={3}
                  style={{ resize: 'none' }}
                />
              </div>
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button type="submit" className="btn-primary" style={{ flex: 1, justifyContent: 'center' }} disabled={booking}>
                  {booking ? 'Booking...' : '📅 Confirm Booking'}
                </button>
                <button type="button" className="btn-secondary" onClick={() => setBookingExpert(null)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
