'use client';

import React, { useState, useEffect } from 'react';
import { TrendingUp } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid } from 'recharts';

const COLORS = {
  cyan: '#7dffff',
  purple: '#b19dff',
  pink: '#ff9ec7',
};

export default function FrequencyAnalysis() {
  const [frequency, setFrequency] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFrequency();
  }, []);

  const fetchFrequency = async () => {
    const res = await fetch('/api/errors?view=frequency');
    const data = await res.json();
    setFrequency(data);
    setLoading(false);
  };

  if (loading) return <div className="flex items-center justify-center h-full"><div className="text-white">Loading...</div></div>;

  return (
    <div style={{ padding: '24px', height: '100%', overflow: 'auto', backgroundColor: '#000000' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
        <TrendingUp size={24} style={{ color: COLORS.cyan }} />
        <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#ffffff' }}>Frequency Analysis</h2>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '24px' }}>
        <div style={{ backgroundColor: '#000000', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '20px' }}>
          <h3 style={{ fontSize: '14px', fontWeight: '600', color: '#ffffff', marginBottom: '16px' }}>Last 24 Hours</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={frequency.last24h.slice(0, 5)}>
              <XAxis dataKey="errorType" stroke="rgba(255,255,255,0.3)" tick={{ fontSize: 9, fill: 'rgba(255,255,255,0.6)' }} angle={-45} textAnchor="end" height={80} />
              <YAxis stroke="rgba(255,255,255,0.3)" tick={{ fontSize: 10, fill: 'rgba(255,255,255,0.6)' }} />
              <Tooltip />
              <Bar dataKey="count" fill={COLORS.cyan} radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div style={{ backgroundColor: '#000000', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '20px' }}>
          <h3 style={{ fontSize: '14px', fontWeight: '600', color: '#ffffff', marginBottom: '16px' }}>Last 7 Days</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={frequency.last7d.slice(0, 5)}>
              <XAxis dataKey="errorType" stroke="rgba(255,255,255,0.3)" tick={{ fontSize: 9, fill: 'rgba(255,255,255,0.6)' }} angle={-45} textAnchor="end" height={80} />
              <YAxis stroke="rgba(255,255,255,0.3)" tick={{ fontSize: 10, fill: 'rgba(255,255,255,0.6)' }} />
              <Tooltip />
              <Bar dataKey="count" fill={COLORS.purple} radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div style={{ backgroundColor: '#000000', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '20px' }}>
          <h3 style={{ fontSize: '14px', fontWeight: '600', color: '#ffffff', marginBottom: '16px' }}>Last 30 Days</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={frequency.last30d.slice(0, 5)}>
              <XAxis dataKey="errorType" stroke="rgba(255,255,255,0.3)" tick={{ fontSize: 9, fill: 'rgba(255,255,255,0.6)' }} angle={-45} textAnchor="end" height={80} />
              <YAxis stroke="rgba(255,255,255,0.3)" tick={{ fontSize: 10, fill: 'rgba(255,255,255,0.6)' }} />
              <Tooltip />
              <Bar dataKey="count" fill={COLORS.pink} radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div style={{ backgroundColor: '#000000', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '20px' }}>
        <h3 style={{ fontSize: '14px', fontWeight: '600', color: '#ffffff', marginBottom: '16px' }}>Top Errors (30 Days)</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
          {frequency.last30d.slice(0, 9).map((item: any, idx: number) => (
            <div key={idx} style={{
              padding: '16px',
              backgroundColor: 'rgba(125,255,255,0.05)',
              border: '1px solid rgba(125,255,255,0.2)',
              borderRadius: '8px'
            }}>
              <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)', marginBottom: '4px' }}>{item.errorType}</p>
              <p style={{ fontSize: '24px', fontWeight: 'bold', color: COLORS.cyan }}>{item.count}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}