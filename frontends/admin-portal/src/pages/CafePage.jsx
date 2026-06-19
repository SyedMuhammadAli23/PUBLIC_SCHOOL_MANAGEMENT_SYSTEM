import React from 'react';
import { GlassCard } from '../components/ui/GlassCard';
import { DataTable } from '../components/ui/DataTable';
import { Badge } from '../components/ui/Badge';

export const CafePage = ({ cafeMenu, cafeOrders, newCafeItem, setNewCafeItem, updateOrderStatus, handlePost }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '30px' }}>
        <GlassCard style={{ padding: '32px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '24px' }}>Digital Cafeteria Menu</h2>
          <DataTable headers={['Menu Item', 'Description', 'Price', 'Category', 'Status']}>
            {cafeMenu.map(m => (
              <tr key={m.id}>
                <td><strong>{m.name}</strong></td>
                <td style={{ color: 'var(--text-muted)', fontSize: '13px' }}>{m.description}</td>
                <td style={{ fontWeight: '600' }}>${m.price.toFixed(2)}</td>
                <td>{m.category.toUpperCase()}</td>
                <td>
                  <Badge type={m.is_available ? 'success' : 'danger'}>
                    {m.is_available ? 'AVAILABLE' : 'SOLD OUT'}
                  </Badge>
                </td>
              </tr>
            ))}
          </DataTable>
        </GlassCard>

        <GlassCard style={{ padding: '32px', height: 'fit-content' }}>
          <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '20px' }}>Add Menu Item</h3>
          <form onSubmit={(e) => {
            e.preventDefault();
            handlePost('/api/cafe/menu', newCafeItem, 'Menu item added successfully', () => {
              setNewCafeItem({ name: '', description: '', price: '', category: 'meal', is_available: true });
            });
          }} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>Item Name</label>
              <input type="text" value={newCafeItem.name} onChange={e => setNewCafeItem({ ...newCafeItem, name: e.target.value })} placeholder="e.g. Science Shake" required />
            </div>
            <div>
              <label style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>Price ($)</label>
              <input type="number" step="0.01" value={newCafeItem.price} onChange={e => setNewCafeItem({ ...newCafeItem, price: parseFloat(e.target.value) })} placeholder="e.g. 3.50" required />
            </div>
            <div>
              <label style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>Category</label>
              <select value={newCafeItem.category} onChange={e => setNewCafeItem({ ...newCafeItem, category: e.target.value })}>
                <option value="meal">Meal</option>
                <option value="beverage">Beverage</option>
                <option value="snack">Snack</option>
              </select>
            </div>
            <div>
              <label style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>Description</label>
              <textarea value={newCafeItem.description} onChange={e => setNewCafeItem({ ...newCafeItem, description: e.target.value })} placeholder="Ingredients/details..." rows={2} />
            </div>
            <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '10px' }}>Add to Menu</button>
          </form>
        </GlassCard>
      </div>

      <GlassCard style={{ padding: '32px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '24px' }}>Active Cafeteria Food Orders</h2>
        <DataTable headers={['Order ID', 'User ID', 'Items Purchased', 'Total Price', 'Order Date', 'Status', 'Actions']}>
          {cafeOrders.map(o => {
            const parsedItems = JSON.parse(o.items || '[]');
            return (
              <tr key={o.id}>
                <td>#CF-00{o.id}</td>
                <td>User #{o.user_id}</td>
                <td>
                  {parsedItems.map((itm, index) => (
                    <div key={index} style={{ fontSize: '13px' }}>
                      • {itm.name} x{itm.quantity}
                    </div>
                  ))}
                </td>
                <td style={{ fontWeight: '600' }}>${o.total_price.toFixed(2)}</td>
                <td>{o.order_date}</td>
                <td>
                  <Badge type={o.status === 'completed' ? 'success' : o.status === 'ready' ? 'info' : 'warning'}>
                    {o.status.toUpperCase()}
                  </Badge>
                </td>
                <td>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    {o.status === 'pending' && (
                      <button className="btn btn-success" style={{ padding: '4px 8px', fontSize: '12px' }} onClick={() => updateOrderStatus(o.id, 'ready')}>Set Ready</button>
                    )}
                    {o.status === 'ready' && (
                      <button className="btn btn-primary" style={{ padding: '4px 8px', fontSize: '12px' }} onClick={() => updateOrderStatus(o.id, 'completed')}>Pick Up</button>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
        </DataTable>
      </GlassCard>
    </div>
  );
};
