// src/app/page.tsx

'use client';

import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Navigation from '@/components/Navigation';
import ErrorDashboard from '@/components/pages/ErrorDashboard';
import ErrorTimeline from '@/components/pages/ErrorTimeline';
import ErrorTypes from '@/components/pages/ErrorTypes';
import FrequencyAnalysis from '@/components/pages/FrequencyAnalysis';
import ResolutionProcedures from '@/components/pages/ResolutionProcedures';
import { RefreshCw, LogOut } from 'lucide-react';

export default function Home() {
  const { isAuthenticated, loading, login, logout } = useAuth();
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [syncing, setSyncing] = useState(false);

  const syncEmails = async () => {
    setSyncing(true);
    try {
      await fetch('/api/outlook/sync', { method: 'POST' });
      window.location.reload();
    } catch (error) {
      console.error('Sync failed:', error);
    }
    setSyncing(false);
  };

  const renderPage = () => {
    switch(currentPage) {
      case 'dashboard': return <ErrorDashboard />;
      case 'timeline': return <ErrorTimeline />;
      case 'types': return <ErrorTypes />;
      case 'frequency': return <FrequencyAnalysis />;
      case 'resolutions': return <ResolutionProcedures />;
      default: return <ErrorDashboard />;
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-black">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-cyan-500 border-t-transparent mb-4"></div>
          <p className="text-white/60">Loading...</p>
        </div>
      </div>
    );
  }

  // Not authenticated - show sign-in screen
  if (!isAuthenticated) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-black">
        <div style={{
          maxWidth: '400px',
          padding: '2rem',
          backgroundColor: '#000000',
          border: '1px solid rgba(125,255,255,0.3)',
          borderRadius: '1rem',
          textAlign: 'center',
          boxShadow: '0 0 30px rgba(125,255,255,0.1)'
        }}>
          <div style={{ marginBottom: '2rem' }}>
            <h1 style={{
              fontSize: '28px',
              fontWeight: 'bold',
              background: 'linear-gradient(135deg, #7dffff, #b19dff)',
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
              color: 'transparent',
              marginBottom: '0.5rem'
            }}>
              CLX Error Monitor
            </h1>
            <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.6)' }}>
              Enterprise Error Tracking System
            </p>
          </div>

          <div style={{
            width: '80px',
            height: '80px',
            margin: '0 auto 2rem',
            background: 'linear-gradient(135deg, rgba(125,255,255,0.2), rgba(177,157,255,0.2))',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '2px solid rgba(125,255,255,0.5)'
          }}>
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#7dffff" strokeWidth="2">
              <path d="M12 2L2 7l10 5 10-5-10-5z"/>
              <path d="M2 17l10 5 10-5M2 12l10 5 10-5"/>
            </svg>
          </div>

          <p style={{ 
            fontSize: '14px', 
            color: 'rgba(255,255,255,0.8)', 
            marginBottom: '2rem',
            lineHeight: '1.6'
          }}>
            Sign in with your Microsoft account to access error monitoring and resolution tools.
          </p>

          <button
            onClick={login}
            style={{
              width: '100%',
              padding: '0.875rem 1.5rem',
              background: 'linear-gradient(135deg, #7dffff, #b19dff)',
              border: 'none',
              borderRadius: '0.5rem',
              color: '#000000',
              fontSize: '15px',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              transition: 'transform 0.2s, box-shadow 0.2s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 8px 20px rgba(125,255,255,0.3)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <svg width="20" height="20" viewBox="0 0 21 21" fill="none">
              <rect x="1" y="1" width="9" height="9" fill="#f25022"/>
              <rect x="1" y="11" width="9" height="9" fill="#00a4ef"/>
              <rect x="11" y="1" width="9" height="9" fill="#7fba00"/>
              <rect x="11" y="11" width="9" height="9" fill="#ffb900"/>
            </svg>
            Sign in with Microsoft
          </button>

          <p style={{
            fontSize: '11px',
            color: 'rgba(255,255,255,0.4)',
            marginTop: '1.5rem',
            lineHeight: '1.5'
          }}>
            By signing in, you agree to connect your Outlook account for error email monitoring.
          </p>
        </div>
      </div>
    );
  }

  // Authenticated - show main app
  return (
    <div className="h-screen w-screen overflow-hidden flex bg-black">
      <Navigation currentPage={currentPage} onNavigate={setCurrentPage} />
      
      <div className="flex-1 ml-64 flex flex-col h-screen">
        <header className="flex-shrink-0 border-b border-white/10 bg-black/80 backdrop-blur-xl h-16 px-6 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
              {currentPage.toUpperCase().replace('-', ' ')}
            </h2>
          </div>
          
          <div className="flex items-center gap-4">
            <button
              onClick={syncEmails}
              disabled={syncing}
              className="flex items-center gap-2 px-4 py-2 bg-purple-500/20 border border-purple-500/50 rounded-lg text-purple-400 text-sm font-medium hover:bg-purple-500/30 transition-all disabled:opacity-50"
            >
              <RefreshCw size={16} className={syncing ? 'animate-spin' : ''} />
              Sync Emails
            </button>

            <button
              onClick={logout}
              className="flex items-center gap-2 px-4 py-2 bg-red-500/20 border border-red-500/50 rounded-lg text-red-400 text-sm font-medium hover:bg-red-500/30 transition-all"
            >
              <LogOut size={16} />
              Sign Out
            </button>
          </div>
        </header>
        
        <main className="flex-1 overflow-hidden bg-black">
          {renderPage()}
        </main>
      </div>
    </div>
  );
}