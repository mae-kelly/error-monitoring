'use client';

import React, { useState, useEffect } from 'react';
import Navigation from '@/components/Navigation';
import ErrorDashboard from '@/components/pages/ErrorDashboard';
import ErrorTimeline from '@/components/pages/ErrorTimeline';
import ErrorTypes from '@/components/pages/ErrorTypes';
import FrequencyAnalysis from '@/components/pages/FrequencyAnalysis';
import ResolutionProcedures from '@/components/pages/ResolutionProcedures';
import { RefreshCw } from 'lucide-react';

export default function Home() {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [syncing, setSyncing] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const res = await fetch('/api/errors?view=stats');
      setIsAuthenticated(res.ok);
    } catch {
      setIsAuthenticated(false);
    }
  };

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

  const authenticateOutlook = () => {
    window.location.href = '/api/outlook/auth';
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
            {!isAuthenticated ? (
              <button
                onClick={authenticateOutlook}
                className="px-4 py-2 bg-cyan-500/20 border border-cyan-500/50 rounded-lg text-cyan-400 text-sm font-medium hover:bg-cyan-500/30 transition-all"
              >
                Connect Outlook
              </button>
            ) : (
              <button
                onClick={syncEmails}
                disabled={syncing}
                className="flex items-center gap-2 px-4 py-2 bg-purple-500/20 border border-purple-500/50 rounded-lg text-purple-400 text-sm font-medium hover:bg-purple-500/30 transition-all disabled:opacity-50"
              >
                <RefreshCw size={16} className={syncing ? 'animate-spin' : ''} />
                Sync Emails
              </button>
            )}
          </div>
        </header>
        
        <main className="flex-1 overflow-hidden bg-black">
          {renderPage()}
        </main>
      </div>
    </div>
  );
}