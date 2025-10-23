import React from 'react';
import { Activity, BarChart3, Clock, FileText, TrendingUp } from 'lucide-react';

interface NavigationProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

export default function Navigation({ currentPage, onNavigate }: NavigationProps) {
  const pages = [
    { id: 'dashboard', label: 'Dashboard', icon: Activity },
    { id: 'timeline', label: 'Timeline', icon: Clock },
    { id: 'types', label: 'Error Types', icon: BarChart3 },
    { id: 'frequency', label: 'Frequency', icon: TrendingUp },
    { id: 'resolutions', label: 'Resolutions', icon: FileText },
  ];

  return (
    <nav style={{
      width: '256px',
      height: '100vh',
      backgroundColor: '#000000',
      borderRight: '1px solid rgba(255,255,255,0.1)',
      position: 'fixed',
      left: 0,
      top: 0,
      zIndex: 50,
      display: 'flex',
      flexDirection: 'column',
      padding: '24px 16px'
    }}>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{
          fontSize: '20px',
          fontWeight: 'bold',
          background: 'linear-gradient(135deg, #7dffff, #b19dff)',
          WebkitBackgroundClip: 'text',
          backgroundClip: 'text',
          color: 'transparent'
        }}>
          CLX Monitor
        </h1>
        <p style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)', marginTop: '4px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
          Error Tracking
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
        {pages.map((page) => {
          const Icon = page.icon;
          const isActive = currentPage === page.id;
          return (
            <button
              key={page.id}
              onClick={() => onNavigate(page.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 16px',
                backgroundColor: isActive ? 'rgba(125,255,255,0.1)' : 'transparent',
                border: isActive ? '1px solid rgba(125,255,255,0.3)' : '1px solid transparent',
                borderRadius: '8px',
                color: isActive ? '#7dffff' : 'rgba(255,255,255,0.6)',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'all 0.2s',
                textAlign: 'left'
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }
              }}
            >
              <Icon size={18} />
              <span>{page.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}