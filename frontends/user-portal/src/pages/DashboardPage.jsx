import React from 'react';
import { GlassCard } from '../components/ui/GlassCard';

export const DashboardPage = ({ user, wallet, invoices, timetables, notifications }) => {
  const isStudent = user?.role === 'student';
  return (
    <div>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: '700' }}>Welcome, {user?.firstName}!</h1>
        <p style={{ color: 'var(--text-muted)' }}>ASST Science and Technology Student/Teacher Portal Dashboard</p>
      </div>

      {isStudent ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginBottom: '32px' }}>
          <GlassCard style={{ padding: '24px' }}>
            <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>CAFETERIA BALANCE</span>
            <h3 style={{ fontSize: '32px', fontWeight: '700', marginTop: '8px' }}>${wallet.balance.toFixed(2)}</h3>
            <p style={{ fontSize: '12px', color: 'var(--color-green)', marginTop: '8px' }}>Cafe Card Active</p>
          </GlassCard>
          <GlassCard style={{ padding: '24px' }}>
            <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>FINANCIAL DUES</span>
            <h3 style={{ fontSize: '32px', fontWeight: '700', marginTop: '8px' }}>
              {invoices.filter(i => i.status === 'unpaid').length} Outstanding
            </h3>
            <p style={{ fontSize: '12px', color: 'var(--color-red)', marginTop: '8px' }}>Tuition Invoices</p>
          </GlassCard>
          <GlassCard style={{ padding: '24px' }}>
            <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>WEEKLY LECTURES</span>
            <h3 style={{ fontSize: '32px', fontWeight: '700', marginTop: '8px' }}>{timetables.length} Classes</h3>
            <p style={{ fontSize: '12px', color: 'var(--color-blue)', marginTop: '8px' }}>Mon - Fri Timetable</p>
          </GlassCard>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginBottom: '32px' }}>
          <GlassCard style={{ padding: '24px' }}>
            <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>TEACHING TIMETABLE</span>
            <h3 style={{ fontSize: '32px', fontWeight: '700', marginTop: '8px' }}>{timetables.length} Lectures</h3>
            <p style={{ fontSize: '12px', color: 'var(--color-green)', marginTop: '8px' }}>All slots active</p>
          </GlassCard>
          <GlassCard style={{ padding: '24px' }}>
            <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>DEPARTMENT DESIGNATION</span>
            <h3 style={{ fontSize: '20px', fontWeight: '700', marginTop: '16px' }}>{user?.profileDetails?.designation || 'Professor'}</h3>
            <p style={{ fontSize: '12px', color: 'var(--color-purple)', marginTop: '8px' }}>{user?.profileDetails?.department || 'Science & Tech'}</p>
          </GlassCard>
        </div>
      )}

      <GlassCard style={{ padding: '32px' }}>
        <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '20px' }}>📢 Broadcast Announcements</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {notifications.length === 0 ? (
            <p style={{ color: 'var(--text-dark)' }}>No active campus notifications.</p>
          ) : (
            notifications.map((n) => (
              <div key={n.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '14px', background: 'rgba(255,255,255,0.02)', borderRadius: '8px', borderLeft: `4px solid var(--color-blue)` }}>
                <div>
                  <strong style={{ display: 'block', fontSize: '14px' }}>{n.title}</strong>
                  <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{n.message}</span>
                </div>
                <span style={{ fontSize: '11px', color: 'var(--text-dark)' }}>{new Date(n.created_at || Date.now()).toLocaleDateString()}</span>
              </div>
            ))
          )}
        </div>
      </GlassCard>
    </div>
  );
};
