import React from 'react';
import { GlassCard } from '../components/ui/GlassCard';
import { DataTable } from '../components/ui/DataTable';
import { Badge } from '../components/ui/Badge';

export const WalletFeesPage = ({ wallet, invoices, topupAmount, setTopupAmount, triggerPayInvoice, triggerTopupWallet }) => {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '30px' }}>
      <GlassCard style={{ padding: '32px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '24px' }}>💳 Tuition Fee Invoices</h2>
        <DataTable headers={['Billing ID', 'Title / Description', 'Amount', 'Due Date', 'Status', 'Action']}>
          {invoices.map(i => (
            <tr key={i.id}>
              <td>#INV-00{i.id}</td>
              <td><strong>{i.title}</strong></td>
              <td style={{ fontWeight: '600' }}>${i.amount.toLocaleString()}</td>
              <td>{i.due_date}</td>
              <td>
                <Badge type={i.status === 'paid' ? 'success' : 'danger'}>
                  {i.status.toUpperCase()}
                </Badge>
              </td>
              <td>
                {i.status === 'unpaid' && (
                  <button className="btn btn-success" style={{ padding: '6px 12px', fontSize: '12px' }} onClick={() => triggerPayInvoice(i.id)}>Pay Fee</button>
                )}
              </td>
            </tr>
          ))}
        </DataTable>
      </GlassCard>

      <GlassCard style={{ padding: '32px', height: 'fit-content' }}>
        <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '20px' }}>Cafe Wallet Top-up</h3>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px', padding: '10px 0' }}>
          <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>CURRENT BALANCE</span>
          <span style={{ fontSize: '36px', fontWeight: '800' }}>${wallet.balance.toFixed(2)}</span>
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '20px' }}>
          <div>
            <label style={{ fontSize: '12px', display: 'block', marginBottom: '6px' }}>Top-up Amount ($)</label>
            <input
              type="number"
              value={topupAmount}
              onChange={e => setTopupAmount(e.target.value)}
              placeholder="e.g. 50.00"
            />
          </div>
          <button className="btn btn-primary" style={{ width: '100%' }} onClick={triggerTopupWallet}>Top up Card</button>
        </div>
      </GlassCard>
    </div>
  );
};
