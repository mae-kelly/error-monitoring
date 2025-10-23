'use client';

import React, { useState, useEffect } from 'react';
import { Layers, CheckCircle, XCircle } from 'lucide-react';

const COLORS = {
  cyan: '#7dffff',
  purple: '#b19dff',
  pink: '#ff9ec7',
};

export default function ErrorTypes() {
  const [types, setTypes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTypes();
  }, []);

  const fetchTypes = async () => {
    const res = await fetch('/api/errors?view=types');
    const data = await res.json();
    setTypes(data);
    setLoading(false);
  };

  if (loading) return <div className="flex items-center justify-center h-full"><div className="text-white">Loading...</div></div>;

  return (
    <div style={{ padding: '24px', height: '100%', overflow: 'auto', backgroundColor: '#000000' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
        <Layers size={24} style={{ color: COLORS.cyan }} />
        <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#ffffff' }}>Error Types</h2>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' }}>
        {types.map((type) => (
          <div key={type.errorType} style={{
            backgroundColor: '#000000',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '12px',
            padding: '20px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
              <div>
                <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#ffffff', marginBottom: '8px' }}>{type.errorType}</h3>
                <p style={{ fontSize: '24px', fontWeight: 'bold', color: COLORS.cyan }}>{type.count}</p>
                <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)' }}>occurrences</p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                {type.hasResolution ? (
                  <>
                    <CheckCircle size={20} style={{ color: COLORS.cyan }} />
                    <span style={{ fontSize: '12px', color: COLORS.cyan }}>Has SOP</span>
                  </>
                ) : (
                  <>
                    <XCircle size={20} style={{ color: COLORS.pink }} />
                    <span style={{ fontSize: '12px', color: COLORS.pink }}>No SOP</span>
                  </>
                )}
              </div>
            </div>

            <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
              <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)', marginBottom: '8px' }}>Recent Occurrences:</p>
              {type.recentErrors.slice(0, 3).map((err: any) => (
                <div key={err.id} style={{ marginBottom: '8px' }}>
                  <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.8)' }}>
                    {new Date(err.receivedAt).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}