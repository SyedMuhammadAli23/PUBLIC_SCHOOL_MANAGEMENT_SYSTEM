import React from 'react';
import { GlassCard } from '../components/ui/GlassCard';
import { DataTable } from '../components/ui/DataTable';
import { Badge } from '../components/ui/Badge';

export const AssetsPage = ({ assets, newAsset, setNewAsset, updateAssetStatus, handlePost }) => {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '30px' }}>
      <GlassCard style={{ padding: '32px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '24px' }}>School Asset Tracking Registry</h2>
        <DataTable headers={['Item Name', 'Category', 'Qty', 'Location Room', 'Condition', 'Actions']}>
          {assets.map(a => (
            <tr key={a.id}>
              <td><strong>{a.name}</strong></td>
              <td>{a.category}</td>
              <td>{a.quantity}</td>
              <td>{a.location}</td>
              <td>
                <Badge type={a.status === 'active' ? 'success' : a.status === 'repair' ? 'warning' : 'danger'}>
                  {a.status.toUpperCase()}
                </Badge>
              </td>
              <td>
                <div style={{ display: 'flex', gap: '6px' }}>
                  <button className="btn btn-secondary" style={{ padding: '4px 8px', fontSize: '12px' }} onClick={() => updateAssetStatus(a.id, 'active')}>Active</button>
                  <button className="btn btn-danger" style={{ padding: '4px 8px', fontSize: '12px' }} onClick={() => updateAssetStatus(a.id, 'repair')}>Repair</button>
                </div>
              </td>
            </tr>
          ))}
        </DataTable>
      </GlassCard>

      <GlassCard style={{ padding: '32px', height: 'fit-content' }}>
        <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '20px' }}>Add School Asset</h3>
        <form onSubmit={(e) => {
          e.preventDefault();
          handlePost('/api/inventory/assets', newAsset, 'Asset logged successfully', () => {
            setNewAsset({ name: '', category: 'IT Equipment', quantity: 1, location: '', status: 'active' });
          });
        }} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>Asset Name</label>
            <input type="text" value={newAsset.name} onChange={e => setNewAsset({ ...newAsset, name: e.target.value })} placeholder="e.g. Dell PowerEdge Server" required />
          </div>
          <div>
            <label style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>Category</label>
            <select value={newAsset.category} onChange={e => setNewAsset({ ...newAsset, category: e.target.value })}>
              <option value="IT Equipment">IT Equipment</option>
              <option value="Lab Equipment">Lab Equipment</option>
              <option value="Lab Consumables">Lab Consumables</option>
              <option value="Furniture & Classroom">Furniture & Classroom</option>
            </select>
          </div>
          <div>
            <label style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>Quantity</label>
            <input type="number" value={newAsset.quantity} onChange={e => setNewAsset({ ...newAsset, quantity: parseInt(e.target.value) })} required />
          </div>
          <div>
            <label style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>Location Room</label>
            <input type="text" value={newAsset.location} onChange={e => setNewAsset({ ...newAsset, location: e.target.value })} placeholder="e.g. Faraday Lab 102" required />
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '10px' }}>Register Asset</button>
        </form>
      </GlassCard>
    </div>
  );
};
