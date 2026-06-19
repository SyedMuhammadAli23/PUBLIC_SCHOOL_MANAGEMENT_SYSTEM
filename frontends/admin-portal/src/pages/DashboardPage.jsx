import React from 'react';
import { GlassCard } from '../components/ui/GlassCard';

export const DashboardPage = ({ courses, invoices, assets, donations, notifications }) => {
  return (
    <div>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: '700' }}>ASST System Overview</h1>
        <p style={{ color: 'var(--text-muted)' }}>School Performance, Microservice Health & Live Logs</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginBottom: '32px' }}>
        <GlassCard style={{ padding: '24px' }}>
          <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>ACADEMICS</span>
          <h3 style={{ fontSize: '32px', fontWeight: '700', marginTop: '8px' }}>{courses.length} Courses</h3>
          <p style={{ fontSize: '12px', color: 'var(--color-green)', marginTop: '8px' }}>Active Syllabus</p>
        </GlassCard>
        <GlassCard style={{ padding: '24px' }}>
          <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>FINANCIALS</span>
          <h3 style={{ fontSize: '32px', fontWeight: '700', marginTop: '8px' }}>
            ${invoices.filter(i => i.status === 'paid').reduce((sum, item) => sum + item.amount, 0).toLocaleString()}
          </h3>
          <p style={{ fontSize: '12px', color: 'var(--color-blue)', marginTop: '8px' }}>Collected Fees</p>
        </GlassCard>
        <GlassCard style={{ padding: '24px' }}>
          <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>CAMPUS ASSETS</span>
          <h3 style={{ fontSize: '32px', fontWeight: '700', marginTop: '8px' }}>
            {assets.reduce((sum, item) => sum + item.quantity, 0)} Units
          </h3>
          <p style={{ fontSize: '12px', color: 'var(--color-purple)', marginTop: '8px' }}>Smart Labs & IT Equipment</p>
        </GlassCard>
        <GlassCard style={{ padding: '24px' }}>
          <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>ALUMNI DEVELOPMENT</span>
          <h3 style={{ fontSize: '32px', fontWeight: '700', marginTop: '8px' }}>
            ${donations.reduce((sum, item) => sum + item.amount, 0).toLocaleString()}
          </h3>
          <p style={{ fontSize: '12px', color: 'var(--color-green)', marginTop: '8px' }}>Gala & Research Grants</p>
        </GlassCard>
      </div>

      <GlassCard style={{ padding: '32px' }}>
        <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '20px' }}>🔔 System Notification Feeds (WebSocket Live)</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '350px', overflowY: 'auto', paddingRight: '8px' }}>
          {notifications.length === 0 ? (
            <p style={{ color: 'var(--text-dark)' }}>No recent notifications broadcasted.</p>
          ) : (
            notifications.map((n) => (
              <div key={n.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '14px', background: 'rgba(255,255,255,0.02)', borderRadius: '8px', borderLeft: `4px solid ${n.type === 'danger' ? 'var(--color-red)' : n.type === 'warning' ? 'var(--color-yellow)' : 'var(--color-blue)'}` }}>
                <div>
                  <strong style={{ display: 'block', fontSize: '14px' }}>{n.title}</strong>
                  <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{n.message}</span>
                </div>
                <span style={{ fontSize: '11px', color: 'var(--text-dark)' }}>{new Date(n.created_at || n.donation_date || Date.now()).toLocaleTimeString()}</span>
              </div>
            ))
          )}
        </div>
      </GlassCard>
    </div>
  );
};
