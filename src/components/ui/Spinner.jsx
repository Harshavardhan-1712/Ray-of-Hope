import React from 'react';

/**
 * Minimal loading spinner that matches the app theme.
 * size: 'sm' | 'md' | 'lg'
 */
export default function Spinner({ size = 'md', label = 'Loading...' }) {
  const px = { sm: 20, md: 36, lg: 56 }[size];
  return (
    <div className="spinner-wrap" style={{ padding: size === 'lg' ? '4rem' : '1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
      <svg
        width={px}
        height={px}
        viewBox="0 0 50 50"
        style={{ animation: 'spin 0.9s linear infinite' }}
        aria-label={label}
      >
        <circle cx="25" cy="25" r="20" fill="none" stroke="var(--soft-gray)" strokeWidth="4" />
        <circle cx="25" cy="25" r="20" fill="none" stroke="var(--sage)" strokeWidth="4"
          strokeDasharray="80 46" strokeLinecap="round" />
      </svg>
      {size === 'lg' && <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{label}</p>}
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
