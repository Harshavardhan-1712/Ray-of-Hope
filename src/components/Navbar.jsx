import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AuthModal from './AuthModal';

export default function Navbar({ darkMode, setDarkMode }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const links = [
    { to: '/', label: 'Home' },
    { to: '/chat', label: 'Chat' },
    { to: '/articles', label: 'Articles' },
    { to: '/videos', label: 'Videos' },
    { to: '/podcasts', label: 'Podcasts' },
    { to: '/experts', label: 'Experts' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
    setMenuOpen(false);
  };

  return (
    <>
      <nav className="navbar">
        <div className="navbar-inner">
          <NavLink to="/" className="navbar-brand" onClick={() => setMenuOpen(false)}>
            <span className="logo-dot" />
            Ray of Hope
          </NavLink>

          <ul className={`nav-links ${menuOpen ? 'open' : ''}`}>
            {links.map(l => (
              <li key={l.to}>
                <NavLink
                  to={l.to}
                  className={({ isActive }) => isActive ? 'active' : ''}
                  onClick={() => setMenuOpen(false)}
                  end={l.to === '/'}
                >
                  {l.label}
                </NavLink>
              </li>
            ))}
            {isAuthenticated && (
              <li>
                <NavLink
                  to="/dashboard"
                  className={({ isActive }) => isActive ? 'active' : ''}
                  onClick={() => setMenuOpen(false)}
                >
                  Dashboard
                </NavLink>
              </li>
            )}
          </ul>

          <div className="nav-right">
            <button className="dark-toggle" onClick={() => setDarkMode(d => !d)} title="Toggle dark mode">
              {darkMode ? '☀️' : '🌙'}
            </button>

            {isAuthenticated ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <button
                  onClick={() => { navigate('/dashboard'); setMenuOpen(false); }}
                  style={{
                    background: 'var(--soft-gray)', border: 'none',
                    width: 36, height: 36, borderRadius: '50%',
                    fontFamily: 'Playfair Display, serif', fontWeight: 700,
                    fontSize: '0.85rem', cursor: 'pointer', color: 'var(--sage-dark)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}
                  title={user?.name}
                >
                  {user?.name?.charAt(0).toUpperCase()}
                </button>
                <button className="clear-btn" onClick={handleLogout} style={{ fontSize: '0.82rem' }}>
                  Sign out
                </button>
              </div>
            ) : (
              <button className="nav-cta" onClick={() => setAuthOpen(true)}>
                Sign In
              </button>
            )}

            <button className="hamburger" onClick={() => setMenuOpen(o => !o)} aria-label="Toggle menu">
              {menuOpen ? '✕' : '☰'}
            </button>
          </div>
        </div>
      </nav>

      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} />
    </>
  );
}
