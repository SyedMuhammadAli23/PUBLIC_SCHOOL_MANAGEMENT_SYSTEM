import React from 'react';
import { GlassCard } from '../components/ui/GlassCard';
import { DataTable } from '../components/ui/DataTable';

export const AcademicsPage = ({ courses, classes, newCourse, setNewCourse, handlePost }) => {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '30px' }}>
      <GlassCard style={{ padding: '32px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '24px' }}>ASST Course Catalog</h2>
        <DataTable headers={['Code', 'Course Name', 'Credits', 'Description']}>
          {courses.map(c => (
            <tr key={c.id}>
              <td style={{ fontFamily: 'var(--font-mono)', fontWeight: '600', color: 'var(--color-blue)' }}>{c.code}</td>
              <td><strong>{c.name}</strong></td>
              <td>{c.credits} Credits</td>
              <td style={{ color: 'var(--text-muted)', fontSize: '13px' }}>{c.description}</td>
            </tr>
          ))}
        </DataTable>
      </GlassCard>

      <GlassCard style={{ padding: '32px', height: 'fit-content' }}>
        <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '20px' }}>Add New Course</h3>
        <form onSubmit={(e) => {
          e.preventDefault();
          handlePost('/api/academics/courses', newCourse, 'Course added successfully', () => {
            setNewCourse({ code: '', name: '', description: '', credits: 3 });
          });
        }} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>Course Code</label>
            <input type="text" value={newCourse.code} onChange={e => setNewCourse({ ...newCourse, code: e.target.value })} placeholder="e.g. CS-405" required />
          </div>
          <div>
            <label style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>Course Name</label>
            <input type="text" value={newCourse.name} onChange={e => setNewCourse({ ...newCourse, name: e.target.value })} placeholder="e.g. Robotics & Controls" required />
          </div>
          <div>
            <label style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>Credits</label>
            <select value={newCourse.credits} onChange={e => setNewCourse({ ...newCourse, credits: parseInt(e.target.value) })}>
              <option value={1}>1</option>
              <option value={2}>2</option>
              <option value={3}>3</option>
              <option value={4}>4</option>
            </select>
          </div>
          <div>
            <label style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>Description</label>
            <textarea value={newCourse.description} onChange={e => setNewCourse({ ...newCourse, description: e.target.value })} placeholder="Brief summary of coursework..." rows={3} />
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '10px' }}>Register Course</button>
        </form>
      </GlassCard>
    </div>
  );
};
