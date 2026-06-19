import React from 'react';
import { GlassCard } from '../components/ui/GlassCard';
import { DataTable } from '../components/ui/DataTable';
import { Badge } from '../components/ui/Badge';

export const FinancePage = ({ invoices, payroll, newInvoice, setNewInvoice, newPayroll, setNewPayroll, handlePost }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: '30px' }}>
        <GlassCard style={{ padding: '32px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '24px' }}>Tuition Invoices Registry</h2>
          <DataTable headers={['Invoice ID', 'Student ID', 'Invoice Title', 'Amount', 'Due Date', 'Status']}>
            {invoices.map(i => (
              <tr key={i.id}>
                <td>#INV-00{i.id}</td>
                <td>Student #{i.user_id}</td>
                <td><strong>{i.title}</strong></td>
                <td style={{ fontWeight: '600' }}>${i.amount.toLocaleString()}</td>
                <td>{i.due_date}</td>
                <td>
                  <Badge type={i.status === 'paid' ? 'success' : 'danger'}>
                    {i.status.toUpperCase()}
                  </Badge>
                </td>
              </tr>
            ))}
          </DataTable>
        </GlassCard>

        <GlassCard style={{ padding: '32px', height: 'fit-content' }}>
          <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '20px' }}>Issue Student Invoice</h3>
          <form onSubmit={(e) => {
            e.preventDefault();
            handlePost('/api/finance/invoices', newInvoice, 'Invoice issued successfully', () => {
              setNewInvoice({ user_id: '', title: '', amount: '', due_date: '' });
            });
          }} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>Student User ID</label>
              <input type="number" value={newInvoice.user_id} onChange={e => setNewInvoice({ ...newInvoice, user_id: parseInt(e.target.value) })} placeholder="e.g. 3" required />
            </div>
            <div>
              <label style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>Invoice Description</label>
              <input type="text" value={newInvoice.title} onChange={e => setNewInvoice({ ...newInvoice, title: e.target.value })} placeholder="e.g. Semester Fee Fall 2026" required />
            </div>
            <div>
              <label style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>Billing Amount ($)</label>
              <input type="number" step="0.01" value={newInvoice.amount} onChange={e => setNewInvoice({ ...newInvoice, amount: parseFloat(e.target.value) })} placeholder="e.g. 12000.00" required />
            </div>
            <div>
              <label style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>Due Date</label>
              <input type="date" value={newInvoice.due_date} onChange={e => setNewInvoice({ ...newInvoice, due_date: e.target.value })} required />
            </div>
            <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '10px' }}>Issue Invoice</button>
          </form>
        </GlassCard>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: '30px' }}>
        <GlassCard style={{ padding: '32px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '24px' }}>Faculty Monthly Payroll</h2>
          <DataTable headers={['Payroll ID', 'Teacher ID', 'Role & Dept', 'Salary', 'Pay Date', 'Status']}>
            {payroll.map(p => (
              <tr key={p.id}>
                <td>#PAY-00{p.id}</td>
                <td>Teacher #{p.employee_id}</td>
                <td>{p.role}</td>
                <td>${p.salary.toLocaleString()}</td>
                <td>{p.pay_date}</td>
                <td>
                  <Badge type={p.status === 'processed' ? 'success' : 'warning'}>
                    {p.status.toUpperCase()}
                  </Badge>
                </td>
              </tr>
            ))}
          </DataTable>
        </GlassCard>

        <GlassCard style={{ padding: '32px', height: 'fit-content' }}>
          <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '20px' }}>Disburse Staff Salary</h3>
          <form onSubmit={(e) => {
            e.preventDefault();
            handlePost('/api/finance/payroll', newPayroll, 'Payroll logged successfully', () => {
              setNewPayroll({ employee_id: '', role: '', salary: '', pay_date: '' });
            });
          }} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>Employee User ID</label>
              <input type="number" value={newPayroll.employee_id} onChange={e => setNewPayroll({ ...newPayroll, employee_id: parseInt(e.target.value) })} placeholder="e.g. 2" required />
            </div>
            <div>
              <label style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>Role / Designation</label>
              <input type="text" value={newPayroll.role} onChange={e => setNewPayroll({ ...newPayroll, role: e.target.value })} placeholder="e.g. Prof. Quantum Mechanics" required />
            </div>
            <div>
              <label style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>Salary Amount ($)</label>
              <input type="number" value={newPayroll.salary} onChange={e => setNewPayroll({ ...newPayroll, salary: parseFloat(e.target.value) })} placeholder="e.g. 6500.00" required />
            </div>
            <div>
              <label style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>Payment Schedule Date</label>
              <input type="date" value={newPayroll.pay_date} onChange={e => setNewPayroll({ ...newPayroll, pay_date: e.target.value })} required />
            </div>
            <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '10px' }}>Log Payroll</button>
          </form>
        </GlassCard>
      </div>
    </div>
  );
};
