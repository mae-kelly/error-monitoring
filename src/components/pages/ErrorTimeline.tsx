'use client';

import React, { useState, useEffect } from 'react';
import { Clock, AlertCircle } from 'lucide-react';

const COLORS = {
  cyan: '#7dffff',
  purple: '#b19dff',
  pink: '#ff9ec7',
};

export default function ErrorTimeline() {
  const [errors, setErrors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchErrors();
  }, []);

  const fetchErrors = async () => {
    const res = await fetch('/api/errors?view=timeline');
    const data = await res.json();
    setErrors(data);
    setLoading(false);
  };

  const updateStatus = async (id: string, status: string) => {
    await fetch('/api/errors', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status }),
    });
    fetchErrors();
  };

  if (loading) return <div className="flex items-center justify-center h-full"><div className="text-white">Loading...</div></div>;

  return (
    <div style={{ padding: '24px', height: '100%', overflow: 'auto', backgroundColor: '#000000' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
        <Clock size={24} style={{ color: COLORS.cyan }} />
        <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#ffffff' }}>Error Timeline</h2>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {errors.map((error) => (
          <div key={error.id} style={{
            backgroundColor: '#000000',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '12px',
            padding: '20px',
            transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => e.currentTarget.style.borderColor = 'rgba(125,255,255,0.3)'}
          onMouseLeave={(e) => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <AlertCircle size={16} style={{ color: error.status === 'CRITICAL' ? COLORS.pink : COLORS.cyan }} />
                  <span style={{ fontSize: '14px', fontWeight: '600', color: '#ffffff' }}>{error.errorType}</span>
                  <span style={{
                    padding: '4px 8px',
                    borderRadius: '4px',
                    fontSize: '10px',
                    fontWeight: '600',
                    backgroundColor: error.status === 'OPEN' ? 'rgba(125,255,255,0.2)' : error.status === 'RESOLVED' ? 'rgba(177,157,255,0.2)' : 'rgba(255,158,199,0.2)',
                    color: error.status === 'OPEN' ? COLORS.cyan : error.status === 'RESOLVED' ? COLORS.purple : COLORS.pink,
                    textTransform: 'uppercase'
                  }}>
                    {error.status}
                  </span>
                </div>
                <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)', marginBottom: '4px' }}>{error.errorMessage}</p>
                <p style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)' }}>
                  {new Date(error.receivedAt).toLocaleString()}
                </p>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                {error.status === 'OPEN' && (
                  <>
                    <button
                      onClick={() => updateStatus(error.id, 'CRITICAL')}
                      style={{
                        padding: '6px 12px',
                        borderRadius: '6px',
                        fontSize: '11px',
                        fontWeight: '500',
                        backgroundColor: 'rgba(255,158,199,0.2)',
                        border: '1px solid rgba(255,158,199,0.5)',
                        color: COLORS.pink,
                        cursor: 'pointer'
                      }}
                    >
                      Mark Critical
                    </button>
                    <button
                      onClick={() => updateStatus(error.id, 'RESOLVED')}
                      style={{
                        padding: '6px 12px',
                        borderRadius: '6px',
                        fontSize: '11px',
                        fontWeight: '500',
                        backgroundColor: 'rgba(177,157,255,0.2)',
                        border: '1px solid rgba(177,157,255,0.5)',
                        color: COLORS.purple,
                        cursor: 'pointer'
                      }}
                    >
                      Resolve
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}