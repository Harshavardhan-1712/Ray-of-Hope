import React, { useState, useEffect, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import Navbar from './components/Navbar';
import Spinner from './components/ui/Spinner';
import './App.css';

// Lazy-load pages for performance
const Home = lazy(() => import('./pages/Home'));
const ChatPage = lazy(() => import('./pages/ChatPage'));
const ArticlesPage = lazy(() => import('./pages/ArticlesPage'));
const VideosPage = lazy(() => import('./pages/VideosPage'));
const PodcastsPage = lazy(() => import('./pages/PodcastsPage'));
const ExpertsPage = lazy(() => import('./pages/ExpertsPage'));
const DashboardPage = lazy(() => import('./pages/DashboardPage'));

function PageLoader() {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 'calc(100vh - 68px)' }}>
      <Spinner size="lg" label="Loading..." />
    </div>
  );
}

export default function App() {
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('darkMode') === 'true');

  useEffect(() => {
    document.body.setAttribute('data-theme', darkMode ? 'dark' : 'light');
    localStorage.setItem('darkMode', darkMode);
  }, [darkMode]);

  return (
    <Router>
      <AuthProvider>
        <ToastProvider>
          <div className={`app ${darkMode ? 'dark' : 'light'}`}>
            <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />
            <Suspense fallback={<PageLoader />}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/chat" element={<ChatPage />} />
                <Route path="/articles" element={<ArticlesPage />} />
                <Route path="/videos" element={<VideosPage />} />
                <Route path="/podcasts" element={<PodcastsPage />} />
                <Route path="/experts" element={<ExpertsPage />} />
                <Route path="/dashboard" element={<DashboardPage />} />
              </Routes>
            </Suspense>
            <footer className="footer">
              <div className="footer-inner">
                <div className="footer-brand">
                  <span className="footer-logo">✦ Ray of Hope</span>
                  <p>A safe space for emotional healing and growth. You are not alone.</p>
                </div>
                <p className="footer-note">© 2026 Ray of Hope. Built with compassion 💙</p>
              </div>
            </footer>
          </div>
        </ToastProvider>
      </AuthProvider>
    </Router>
  );
}
