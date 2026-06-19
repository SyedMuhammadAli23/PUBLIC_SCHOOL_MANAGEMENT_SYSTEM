import React from 'react';
import { GlassCard } from '../components/ui/GlassCard';
import { DataTable } from '../components/ui/DataTable';
import { Badge } from '../components/ui/Badge';

export const ParkingAlumniPage = ({ alumni, donations, parkingSlots, newAlumni, setNewAlumni, handlePost }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '30px' }}>
        <GlassCard style={{ padding: '32px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '24px' }}>Alumni Directory</h2>
          <DataTable headers={['Alumni Name', 'Grad Year', 'Employment Info', 'Core Skills', 'Mentor']}>
            {alumni.map(a => (
              <tr key={a.id}>
                <td>
                  <strong>{a.name}</strong>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{a.email}</div>
                </td>
                <td>Class of {a.graduation_year}</td>
                <td>
                  {a.job_title} at <strong>{a.company}</strong>
                </td>
                <td style={{ fontSize: '13px', color: 'var(--color-blue)' }}>{a.skills}</td>
                <td>
                  <Badge type={a.is_mentor ? 'success' : 'danger'}>
                    {a.is_mentor ? 'AVAILABLE' : 'NO'}
                  </Badge>
                </td>
              </tr>
            ))}
          </DataTable>
        </GlassCard>

        <GlassCard style={{ padding: '32px', height: 'fit-content' }}>
          <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '20px' }}>Add Alumnus Profile</h3>
          <form onSubmit={(e) => {
            e.preventDefault();
            handlePost('/api/alumni/directory', newAlumni, 'Alumni registered successfully', () => {
              setNewAlumni({ name: '', email: '', graduation_year: '', company: '', job_title: '', skills: '', is_mentor: true });
            });
          }} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>Full Name</label>
              <input type="text" value={newAlumni.name} onChange={e => setNewAlumni({ ...newAlumni, name: e.target.value })} placeholder="e.g. Richard Feynman" required />
            </div>
            <div>
              <label style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>Email</label>
              <input type="email" value={newAlumni.email} onChange={e => setNewAlumni({ ...newAlumni, email: e.target.value })} placeholder="feynman@physics.com" required />
            </div>
            <div>
              <label style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>Graduation Year</label>
              <input type="number" value={newAlumni.graduation_year} onChange={e => setNewAlumni({ ...newAlumni, graduation_year: parseInt(e.target.value) })} required />
            </div>
            <div>
              <label style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>Company</label>
              <input type="text" value={newAlumni.company} onChange={e => setNewAlumni({ ...newAlumni, company: e.target.value })} placeholder="e.g. Caltech" />
            </div>
            <div>
              <label style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>Job Title</label>
              <input type="text" value={newAlumni.job_title} onChange={e => setNewAlumni({ ...newAlumni, job_title: e.target.value })} placeholder="e.g. Quantum Researcher" />
            </div>
            <div>
              <label style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>Skills</label>
              <input type="text" value={newAlumni.skills} onChange={e => setNewAlumni({ ...newAlumni, skills: e.target.value })} placeholder="e.g. Nanotechnology, Electrodynamics" />
            </div>
            <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '10px' }}>Register Alumnus</button>
          </form>
        </GlassCard>
      </div>

      <GlassCard style={{ padding: '32px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '12px' }}>Smart Campus Parking Slots</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '24px', fontSize: '14px' }}>Real-time sensor occupancy feedback</p>
        
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
          {parkingSlots.map(s => (
            <GlassCard key={s.id} style={{ padding: '20px', flex: '1 1 200px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', borderLeft: `6px solid ${s.is_occupied ? 'var(--color-red)' : 'var(--color-green)'}` }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '18px', fontWeight: '700' }}>{s.slot_code}</span>
              <span style={{ fontSize: '12px', color: s.is_occupied ? 'var(--color-red)' : 'var(--color-green)', marginTop: '8px', fontWeight: '600' }}>
                {s.is_occupied ? 'OCCUPIED' : 'VACANT'}
              </span>
              {s.is_occupied && (
                <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '8px', textAlign: 'center' }}>
                  Vehicle: <strong style={{ color: 'var(--text-main)' }}>{s.vehicle_number}</strong><br/>
                  User ID: {s.allocated_to}
                </div>
              )}
            </GlassCard>
          ))}
        </div>
      </GlassCard>
    </div>
  );
};
