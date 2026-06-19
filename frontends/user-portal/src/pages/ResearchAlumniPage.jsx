import React from 'react';
import { GlassCard } from '../components/ui/GlassCard';
import { DataTable } from '../components/ui/DataTable';
import { Badge } from '../components/ui/Badge';

export const ResearchAlumniPage = ({ user, researchProjects, alumniMentors, newProject, setNewProject, newLabBooking, setNewLabBooking, handlePost }) => {
  const isStudent = user?.role === 'student';
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
      {/* Research Projects */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '30px' }}>
        <GlassCard style={{ padding: '32px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '24px' }}>🔬 Faculty Research Projects</h2>
          <DataTable headers={['Project Title', 'PI ID', 'Status', 'Abstract']}>
            {researchProjects.map(p => (
              <tr key={p.id}>
                <td><strong>{p.title}</strong></td>
                <td>Principal Investigator #{p.principal_investigator_id}</td>
                <td><Badge type={p.status === 'active' ? 'success' : 'warning'}>{p.status.toUpperCase()}</Badge></td>
                <td style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{p.abstract}</td>
              </tr>
            ))}
          </DataTable>
        </GlassCard>

        <GlassCard style={{ padding: '32px' }}>
          {isStudent ? (
            <div>
              <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px' }}>Student Research</h3>
              <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>To request participation in any active research project as a research assistant, please email the PI directly with your CV.</p>
            </div>
          ) : (
            <div>
              <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '20px' }}>Publish Research</h3>
              <form onSubmit={(e) => {
                e.preventDefault();
                handlePost('/api/research/projects', {
                  title: newProject.title,
                  principal_investigator_id: user.id,
                  abstract: newProject.abstract,
                  funding_amount: parseFloat(newProject.funding),
                  status: 'active'
                }, 'Research project proposal published!', () => {
                  setNewProject({ title: '', abstract: '', funding: 0 });
                });
              }} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label style={{ fontSize: '12px', display: 'block', marginBottom: '6px' }}>Project Title</label>
                  <input type="text" value={newProject.title} onChange={e => setNewProject({ ...newProject, title: e.target.value })} required />
                </div>
                <div>
                  <label style={{ fontSize: '12px', display: 'block', marginBottom: '6px' }}>Abstract Summary</label>
                  <textarea value={newProject.abstract} onChange={e => setNewProject({ ...newProject, abstract: e.target.value })} rows={3} required />
                </div>
                <div>
                  <label style={{ fontSize: '12px', display: 'block', marginBottom: '6px' }}>Funding Amount ($)</label>
                  <input type="number" value={newProject.funding} onChange={e => setNewProject({ ...newProject, funding: e.target.value })} required />
                </div>
                <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Publish Project</button>
              </form>
            </div>
          )}
        </GlassCard>
      </div>

      {/* Alumni Directory */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '30px' }}>
        <GlassCard style={{ padding: '32px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '24px' }}>🎓 Alumni Mentors Network</h2>
          <DataTable headers={['Alumni Name', 'Graduation', 'Company / Job Title', 'Skills', 'Mentorship']}>
            {alumniMentors.map(a => (
              <tr key={a.id}>
                <td>
                  <strong>{a.name}</strong>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{a.email}</div>
                </td>
                <td>Class of {a.graduation_year}</td>
                <td>{a.job_title} at <strong>{a.company}</strong></td>
                <td style={{ fontSize: '13px', color: 'var(--color-blue)' }}>{a.skills}</td>
                <td><Badge type={a.is_mentor ? 'success' : 'danger'}>{a.is_mentor ? 'AVAILABLE' : 'NO'}</Badge></td>
              </tr>
            ))}
          </DataTable>
        </GlassCard>

        {!isStudent && (
          <GlassCard style={{ padding: '32px', height: 'fit-content' }}>
            <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '20px' }}>Reserve Science Lab</h3>
            <form onSubmit={(e) => {
              e.preventDefault();
              handlePost('/api/labs/bookings', {
                lab_name: newLabBooking.lab_name,
                researcher_id: user.id,
                booking_date: newLabBooking.booking_date,
                start_time: newLabBooking.start_time,
                end_time: newLabBooking.end_time,
                purpose: newLabBooking.purpose
              }, 'Lab reserved successfully!', () => {
                setNewLabBooking({ lab_name: 'Curie Physics Lab B', booking_date: '', start_time: '09:00', end_time: '11:00', purpose: '' });
              });
            }} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ fontSize: '12px', display: 'block', marginBottom: '6px' }}>Select Lab Facility</label>
                <select value={newLabBooking.lab_name} onChange={e => setNewLabBooking({ ...newLabBooking, lab_name: e.target.value })}>
                  <option value="Curie Physics Lab B">Curie Physics Lab B</option>
                  <option value="Darwin Wet Lab 104">Darwin Wet Lab 104</option>
                  <option value="Newton Computer Lab">Newton Computer Lab</option>
                </select>
              </div>
              <div>
                <label style={{ fontSize: '12px', display: 'block', marginBottom: '6px' }}>Booking Date</label>
                <input type="date" value={newLabBooking.booking_date} onChange={e => setNewLabBooking({ ...newLabBooking, booking_date: e.target.value })} required />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '12px', display: 'block', marginBottom: '6px' }}>Start Time</label>
                  <input type="text" value={newLabBooking.start_time} onChange={e => setNewLabBooking({ ...newLabBooking, start_time: e.target.value })} required />
                </div>
                <div>
                  <label style={{ fontSize: '12px', display: 'block', marginBottom: '6px' }}>End Time</label>
                  <input type="text" value={newLabBooking.end_time} onChange={e => setNewLabBooking({ ...newLabBooking, end_time: e.target.value })} required />
                </div>
              </div>
              <div>
                <label style={{ fontSize: '12px', display: 'block', marginBottom: '6px' }}>Purpose of reservation</label>
                <input type="text" value={newLabBooking.purpose} onChange={e => setNewLabBooking({ ...newLabBooking, purpose: e.target.value })} placeholder="e.g. Laser diffraction setup" required />
              </div>
              <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Reserve Facility</button>
            </form>
          </GlassCard>
        )}
      </div>
    </div>
  );
};
