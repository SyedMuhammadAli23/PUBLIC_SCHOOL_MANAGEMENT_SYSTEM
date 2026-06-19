import React from 'react';
import { GlassCard } from '../components/ui/GlassCard';
import { DataTable } from '../components/ui/DataTable';
import { Badge } from '../components/ui/Badge';

export const CourseworkPage = ({
  user,
  assignments,
  submissions,
  quizzes,
  quizAttempts,
  activeQuiz,
  quizQuestions,
  quizAnswers,
  setQuizAnswers,
  startQuizAttempt,
  submitQuizAnswers,
  cancelQuizAttempt,
  selectedAssignmentId,
  setSelectedAssignmentId,
  submitAssignmentText,
  setSubmitAssignmentText,
  triggerSubmitHomework,
  triggerAiGrading,
  newAssignment,
  setNewAssignment,
  newQuiz,
  setNewQuiz,
  handlePost
}) => {
  const isStudent = user?.role === 'student';

  if (activeQuiz) {
    return (
      <GlassCard style={{ padding: '40px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '12px' }}>📝 Quiz: {activeQuiz.title}</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '32px' }}>Complete all questions before submitting. Multiple Choice Quiz.</p>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', marginBottom: '32px' }}>
          {quizQuestions.map((q, idx) => (
            <div key={q.id} style={{ padding: '20px', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', border: '1px solid var(--glass-border)' }}>
              <p style={{ fontSize: '16px', fontWeight: '600', marginBottom: '16px' }}>{idx + 1}. {q.question_text}</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {['A', 'B', 'C', 'D'].map(opt => {
                  const optionKey = `option_${opt.toLowerCase()}`;
                  return (
                    <label key={opt} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', cursor: 'pointer' }}>
                      <input
                        type="radio"
                        name={`question_${q.id}`}
                        value={opt}
                        checked={quizAnswers[q.id] === opt}
                        onChange={() => setQuizAnswers({ ...quizAnswers, [q.id]: opt })}
                        style={{ width: 'auto' }}
                      />
                      <strong>{opt}:</strong> {q[optionKey]}
                    </label>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <button className="btn btn-primary" onClick={submitQuizAnswers}>Submit Answers</button>
          <button className="btn btn-secondary" onClick={cancelQuizAttempt}>Cancel</button>
        </div>
      </GlassCard>
    );
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: '30px' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
        {/* Assignments */}
        <GlassCard style={{ padding: '32px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '24px' }}>📖 Class Coursework Assignments</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {assignments.map(a => (
              <div key={a.id} style={{ padding: '20px', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', border: '1px solid var(--glass-border)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <strong style={{ fontSize: '16px' }}>{a.title}</strong>
                  <span style={{ fontSize: '12px', color: 'var(--color-yellow)' }}>Due: {a.due_date}</span>
                </div>
                <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '12px' }}>{a.description}</p>
              </div>
            ))}
          </div>
        </GlassCard>

        {/* Quizzes */}
        <GlassCard style={{ padding: '32px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '24px' }}>🖊️ Active Online Quizzes</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {quizzes.map(q => (
              <div key={q.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', border: '1px solid var(--glass-border)' }}>
                <div>
                  <strong style={{ display: 'block', fontSize: '15px' }}>{q.title}</strong>
                  <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Duration: {q.duration_minutes} minutes</span>
                </div>
                {isStudent ? (
                  <button className="btn btn-primary" style={{ padding: '8px 16px', fontSize: '13px' }} onClick={() => startQuizAttempt(q)}>Start Quiz</button>
                ) : (
                  <span style={{ fontSize: '12px', color: 'var(--text-dark)' }}>Active</span>
                )}
              </div>
            ))}
          </div>
        </GlassCard>

        {/* Submissions */}
        <GlassCard style={{ padding: '32px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '24px' }}>📤 Submissions Log</h2>
          <DataTable headers={isStudent ? ['Assignment ID', 'Content Preview', 'Score', 'Feedback', 'Actions'] : ['Assignment ID', 'Student ID', 'Content Preview', 'Score', 'Feedback', 'Actions']}>
            {submissions.map(s => (
              <tr key={s.id}>
                <td>#{s.assignment_id}</td>
                {!isStudent && <td>Student #{s.student_id}</td>}
                <td style={{ fontSize: '13px', color: 'var(--text-muted)', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {s.submission_content}
                </td>
                <td style={{ fontWeight: '600' }}>{s.score !== null ? `${s.score}%` : 'Pending'}</td>
                <td style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{s.grade_feedback || 'N/A'}</td>
                <td>
                  {s.score === null && (
                    <button className="btn btn-success animate-fade" style={{ padding: '6px 12px', fontSize: '12px' }} onClick={() => triggerAiGrading(s.id)}>
                      🤖 AI Review
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </DataTable>
        </GlassCard>
      </div>

      {/* Side panel */}
      <div>
        {isStudent ? (
          <GlassCard style={{ padding: '32px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '20px' }}>Upload Homework</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ fontSize: '12px', display: 'block', marginBottom: '6px' }}>Select Assignment</label>
                <select value={selectedAssignmentId} onChange={e => setSelectedAssignmentId(e.target.value)}>
                  {assignments.map(a => (
                    <option key={a.id} value={a.id}>{a.title}</option>
                  ))}
                </select>
              </div>
              <div>
                <label style={{ fontSize: '12px', display: 'block', marginBottom: '6px' }}>Essay Content / Code Answer</label>
                <textarea
                  value={submitAssignmentText}
                  onChange={e => setSubmitAssignmentText(e.target.value)}
                  placeholder="Type your essay answers or code solution here..."
                  rows={8}
                  required
                />
              </div>
              <button className="btn btn-primary" style={{ width: '100%' }} onClick={triggerSubmitHomework}>Submit work</button>
            </div>
          </GlassCard>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
            <GlassCard style={{ padding: '32px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '20px' }}>Create Assignment</h3>
              <form onSubmit={(e) => {
                e.preventDefault();
                handlePost('/api/assignments', newAssignment, 'Assignment created!', () => {
                  setNewAssignment({ title: '', description: '', due_date: '', class_id: 1 });
                });
              }} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label style={{ fontSize: '12px', display: 'block', marginBottom: '6px' }}>Class / Module</label>
                  <select value={newAssignment.class_id} onChange={e => setNewAssignment({ ...newAssignment, class_id: parseInt(e.target.value) })}>
                    <option value={1}>CS-101 (Intro to CS)</option>
                    <option value={2}>CS-402 (AI & Neural Nets)</option>
                    <option value={3}>PHYS-301 (Quantum Mechanics)</option>
                    <option value={4}>BIO-201 (Genomics Lab)</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '12px', display: 'block', marginBottom: '6px' }}>Title</label>
                  <input type="text" value={newAssignment.title} onChange={e => setNewAssignment({ ...newAssignment, title: e.target.value })} required />
                </div>
                <div>
                  <label style={{ fontSize: '12px', display: 'block', marginBottom: '6px' }}>Description</label>
                  <textarea value={newAssignment.description} onChange={e => setNewAssignment({ ...newAssignment, description: e.target.value })} rows={3} required />
                </div>
                <div>
                  <label style={{ fontSize: '12px', display: 'block', marginBottom: '6px' }}>Due Date</label>
                  <input type="date" value={newAssignment.due_date} onChange={e => setNewAssignment({ ...newAssignment, due_date: e.target.value })} required />
                </div>
                <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Publish</button>
              </form>
            </GlassCard>

            <GlassCard style={{ padding: '32px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '20px' }}>Create Quiz</h3>
              <form onSubmit={(e) => {
                e.preventDefault();
                handlePost('/api/quizzes', newQuiz, 'Quiz created!', () => {
                  setNewQuiz({ title: '', duration: 15, class_id: 1 });
                });
              }} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label style={{ fontSize: '12px', display: 'block', marginBottom: '6px' }}>Class / Module</label>
                  <select value={newQuiz.class_id} onChange={e => setNewQuiz({ ...newQuiz, class_id: parseInt(e.target.value) })}>
                    <option value={1}>CS-101 (Intro to CS)</option>
                    <option value={2}>CS-402 (AI & Neural Nets)</option>
                    <option value={3}>PHYS-301 (Quantum Mechanics)</option>
                    <option value={4}>BIO-201 (Genomics Lab)</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '12px', display: 'block', marginBottom: '6px' }}>Quiz Title</label>
                  <input type="text" value={newQuiz.title} onChange={e => setNewQuiz({ ...newQuiz, title: e.target.value })} required />
                </div>
                <div>
                  <label style={{ fontSize: '12px', display: 'block', marginBottom: '6px' }}>Duration (minutes)</label>
                  <input type="number" value={newQuiz.duration} onChange={e => setNewQuiz({ ...newQuiz, duration: parseInt(e.target.value) })} required />
                </div>
                <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Create Quiz</button>
              </form>
            </GlassCard>
          </div>
        )}
      </div>
    </div>
  );
};
