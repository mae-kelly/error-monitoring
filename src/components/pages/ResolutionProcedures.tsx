'use client';

import React, { useState } from 'react';
import { FileText, Plus, Clock } from 'lucide-react';

const COLORS = {
  cyan: '#7dffff',
  purple: '#b19dff',
  pink: '#ff9ec7',
};

export default function ResolutionProcedures() {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    errorType: '',
    title: '',
    steps: '',
    estimatedTime: '',
    priority: 'MEDIUM'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setShowForm(false);
    setFormData({ errorType: '', title: '', steps: '', estimatedTime: '', priority: 'MEDIUM' });
  };

  return (
    <div style={{ padding: '24px', height: '100%', overflow: 'auto', backgroundColor: '#000000' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <FileText size={24} style={{ color: COLORS.cyan }} />
          <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#ffffff' }}>Resolution Procedures</h2>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '12px 20px',
            backgroundColor: 'rgba(125,255,255,0.2)',
            border: '1px solid rgba(125,255,255,0.5)',
            borderRadius: '8px',
            color: COLORS.cyan,
            fontSize: '14px',
            fontWeight: '500',
            cursor: 'pointer'
          }}
        >
          <Plus size={18} />
          Add Procedure
        </button>
      </div>

      {showForm && (
        <div style={{
          backgroundColor: '#000000',
          border: '1px solid rgba(125,255,255,0.3)',
          borderRadius: '12px',
          padding: '24px',
          marginBottom: '24px'
        }}>
          <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#ffffff', marginBottom: '20px' }}>New Resolution Procedure</h3>
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px', marginBottom: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', color: 'rgba(255,255,255,0.6)', marginBottom: '8px' }}>Error Type</label>
                <input
                  type="text"
                  value={formData.errorType}
                  onChange={(e) => setFormData({ ...formData, errorType: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '10px',
                    backgroundColor: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '6px',
                    color: '#ffffff',
                    fontSize: '14px'
                  }}
                  required
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '12px', color: 'rgba(255,255,255,0.6)', marginBottom: '8px' }}>Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '10px',
                    backgroundColor: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '6px',
                    color: '#ffffff',
                    fontSize: '14px'
                  }}
                  required
                />
              </div>
            </div>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '12px', color: 'rgba(255,255,255,0.6)', marginBottom: '8px' }}>Resolution Steps</label>
              <textarea
                value={formData.steps}
                onChange={(e) => setFormData({ ...formData, steps: e.target.value })}
                rows={6}
                style={{
                  width: '100%',
                  padding: '10px',
                  backgroundColor: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '6px',
                  color: '#ffffff',
                  fontSize: '14px',
                  resize: 'vertical'
                }}
                required
              />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px', marginBottom: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', color: 'rgba(255,255,255,0.6)', marginBottom: '8px' }}>Estimated Time (minutes)</label>
                <input
                  type="number"
                  value={formData.estimatedTime}
                  onChange={(e) => setFormData({ ...formData, estimatedTime: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '10px',
                    backgroundColor: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '6px',
                    color: '#ffffff',
                    fontSize: '14px'
                  }}
                  required
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '12px', color: 'rgba(255,255,255,0.6)', marginBottom: '8px' }}>Priority</label>
                <select
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '10px',
                    backgroundColor: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '6px',
                    color: '#ffffff',
                    fontSize: '14px'
                  }}
                >
                  <option value="LOW">Low</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HIGH">High</option>
                  <option value="CRITICAL">Critical</option>
                </select>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                type="submit"
                style={{
                  padding: '10px 20px',
                  backgroundColor: 'rgba(125,255,255,0.2)',
                  border: '1px solid rgba(125,255,255,0.5)',
                  borderRadius: '6px',
                  color: COLORS.cyan,
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: 'pointer'
                }}
              >
                Save Procedure
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                style={{
                  padding: '10px 20px',
                  backgroundColor: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '6px',
                  color: 'rgba(255,255,255,0.6)',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div style={{ backgroundColor: '#000000', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '20px' }}>
        <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.4)', padding: '40px', fontSize: '14px' }}>
          No resolution procedures yet. Click "Add Procedure" to create one.
        </p>
      </div>
    </div>
  );
}