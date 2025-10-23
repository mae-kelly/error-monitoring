'use client';

import React, { useState, useEffect } from 'react';
import { AlertCircle, CheckCircle, Clock, XCircle } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, LineChart, Line, CartesianGrid } from 'recharts';

const COLORS = {
  cyan: '#7dffff',
  purple: '#b19dff',
  pink: '#ff9ec7',
};

export default function ErrorDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    const res = await fetch('/api/errors?view=stats');
    const data = await res.json();
    setStats(data);
    setLoading(false);
  };

  if (loading) return <div className="flex items-center justify-center h-full"><div className="text-white">Loading...</div></div>;

  const pieData = [
    { name: 'Open', value: stats.open, fill: COLORS.cyan },
    { name: 'Resolved', value: stats.resolved, fill: COLORS.purple },
    { name: 'Critical', value: stats.critical, fill: COLORS.pink },
  ];

  const timelineData = stats.recentErrors.reduce((acc: any, err: any) => {
    const date = new Date(err.receivedAt).toLocaleDateString();
    const existing = acc.find((d: any) => d.date === date);
    if (existing) {
      existing.count++;
    } else {
      acc.push({ date, count: 1 });
    }
    return acc;
  }, []).slice(-7);

  return (
    <div style={{ padding: '24px', height: '100%', overflow: 'auto', backgroundColor: '#000000' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
        {[
          { label: 'Total Errors', value: stats.total, icon: AlertCircle, color: COLORS.cyan },
          { label: 'Open', value: stats.open, icon: Clock, color: COLORS.purple },
          { label: 'Resolved', value: stats.resolved, icon: CheckCircle, color: COLORS.cyan },
          { label: 'Critical', value: stats.critical, icon: XCircle, color: COLORS.pink },
        ].map((metric, idx) => (
          <div key={idx} style={{
            backgroundColor: '#000000',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '12px',
            padding: '20px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)', marginBottom: '8px' }}>{metric.label}</p>
                <p style={{ fontSize: '32px', fontWeight: 'bold', color: metric.color }}>{metric.value}</p>
              </div>
              <metric.icon size={32} style={{ color: metric.color, opacity: 0.5 }} />
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '24px', marginBottom: '24px' }}>
        <div style={{ backgroundColor: '#000000', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '20px' }}>
          <h3 style={{ fontSize: '14px', fontWeight: '600', color: '#ffffff', marginBottom: '16px' }}>Status Distribution</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} dataKey="value">
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div style={{ backgroundColor: '#000000', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '20px' }}>
          <h3 style={{ fontSize: '14px', fontWeight: '600', color: '#ffffff', marginBottom: '16px' }}>Top Error Types</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={stats.errorTypes.slice(0, 5)}>
              <XAxis dataKey="errorType" stroke="rgba(255,255,255,0.3)" tick={{ fontSize: 10, fill: 'rgba(255,255,255,0.6)' }} />
              <YAxis stroke="rgba(255,255,255,0.3)" tick={{ fontSize: 10, fill: 'rgba(255,255,255,0.6)' }} />
              <Tooltip />
              <Bar dataKey="count" fill={COLORS.cyan} radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div style={{ backgroundColor: '#000000', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '20px' }}>
        <h3 style={{ fontSize: '14px', fontWeight: '600', color: '#ffffff', marginBottom: '16px' }}>Error Timeline (Last 7 Days)</h3>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={timelineData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis dataKey="date" stroke="rgba(255,255,255,0.3)" tick={{ fontSize: 10, fill: 'rgba(255,255,255,0.6)' }} />
            <YAxis stroke="rgba(255,255,255,0.3)" tick={{ fontSize: 10, fill: 'rgba(255,255,255,0.6)' }} />
            <Tooltip />
            <Line type="monotone" dataKey="count" stroke={COLORS.cyan} strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}