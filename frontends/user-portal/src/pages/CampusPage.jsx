import React from 'react';
import { GlassCard } from '../components/ui/GlassCard';
import { DataTable } from '../components/ui/DataTable';
import { Badge } from '../components/ui/Badge';

export const CampusPage = ({
  user,
  books,
  borrows,
  cafeMenu,
  cafeOrders,
  parkingSlots,
  vehicleNumber,
  setVehicleNumber,
  triggerBorrowBook,
  triggerReturnBook,
  triggerOrderMeal,
  triggerParkingAllocation,
  triggerParkingRelease
}) => {
  const isStudent = user?.role === 'student';
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
      {/* Library */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '30px' }}>
        <GlassCard style={{ padding: '32px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '24px' }}>📚 Library Catalog</h2>
          <DataTable headers={['Book Title', 'Author', 'Category', 'Availability', 'Actions']}>
            {books.map(b => (
              <tr key={b.id}>
                <td><strong>{b.title}</strong></td>
                <td>{b.author}</td>
                <td>{b.category}</td>
                <td>
                  <Badge type={b.available_copies > 0 ? 'success' : 'danger'}>
                    {b.available_copies} / {b.total_copies} Available
                  </Badge>
                </td>
                <td>
                  {isStudent && b.available_copies > 0 && (
                    <button className="btn btn-primary" style={{ padding: '6px 12px', fontSize: '12px' }} onClick={() => triggerBorrowBook(b.id)}>Checkout</button>
                  )}
                </td>
              </tr>
            ))}
          </DataTable>
        </GlassCard>

        <GlassCard style={{ padding: '32px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '24px' }}>📖 Checked-out Books</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '350px', overflowY: 'auto' }}>
            {borrows.map(b => (
              <div key={b.id} style={{ padding: '14px', background: 'rgba(255,255,255,0.02)', borderRadius: '8px', borderLeft: '4px solid var(--color-blue)', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <strong style={{ fontSize: '14px' }}>{b.book_title}</strong>
                <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Due Date: {b.due_date}</span>
                {b.fine_amount > 0 && <span style={{ fontSize: '12px', color: 'var(--color-red)' }}>Overdue Fine: ${b.fine_amount.toFixed(2)}</span>}
                {isStudent && !b.return_date && (
                  <button className="btn btn-secondary" style={{ padding: '4px 8px', fontSize: '11px', alignSelf: 'flex-start', marginTop: '6px' }} onClick={() => triggerReturnBook(b.id)}>Return Book</button>
                )}
              </div>
            ))}
          </div>
        </GlassCard>
      </div>

      {/* Cafeteria */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '30px' }}>
        <GlassCard style={{ padding: '32px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '24px' }}>🍔 Digital Cafe Menu</h2>
          <DataTable headers={['Food Item', 'Category', 'Description', 'Price', 'Order']}>
            {cafeMenu.map(m => (
              <tr key={m.id}>
                <td><strong>{m.name}</strong></td>
                <td>{m.category.toUpperCase()}</td>
                <td style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{m.description}</td>
                <td style={{ fontWeight: '600' }}>${m.price.toFixed(2)}</td>
                <td>
                  {isStudent && m.is_available && (
                    <button className="btn btn-primary" style={{ padding: '6px 12px', fontSize: '12px' }} onClick={() => triggerOrderMeal(m)}>Pre-order</button>
                  )}
                </td>
              </tr>
            ))}
          </DataTable>
        </GlassCard>

        <GlassCard style={{ padding: '32px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '24px' }}>🛒 Order History Logs</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '350px', overflowY: 'auto' }}>
            {cafeOrders.map(o => {
              const parsedItems = JSON.parse(o.items || '[]');
              return (
                <div key={o.id} style={{ padding: '14px', background: 'rgba(255,255,255,0.02)', borderRadius: '8px', borderLeft: '4px solid var(--color-purple)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Order #{o.id}</span>
                    <Badge type={o.status === 'completed' ? 'success' : 'warning'}>{o.status.toUpperCase()}</Badge>
                  </div>
                  {parsedItems.map((itm, i) => <div key={i} style={{ fontSize: '13px' }}>• {itm.name} x{itm.quantity}</div>)}
                  <div style={{ fontSize: '13px', fontWeight: '600', marginTop: '8px' }}>Total Price: ${o.total_price.toFixed(2)}</div>
                </div>
              );
            })}
          </div>
        </GlassCard>
      </div>

      {/* Parking */}
      <GlassCard style={{ padding: '32px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '12px' }}>🚗 Smart Campus Parking Slots</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '24px', fontSize: '14px' }}>Real-time sensor occupancy feedback</p>
        
        {isStudent && (
          <div style={{ display: 'flex', gap: '16px', marginBottom: '24px', maxWidth: '400px' }}>
            <input type="text" value={vehicleNumber} onChange={e => setVehicleNumber(e.target.value)} placeholder="Enter vehicle registration number..." />
          </div>
        )}

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
          {parkingSlots.map(s => (
            <GlassCard key={s.id} style={{ padding: '20px', flex: '1 1 200px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', borderLeft: `6px solid ${s.is_occupied ? 'var(--color-red)' : 'var(--color-green)'}` }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '18px', fontWeight: '700' }}>{s.slot_code}</span>
              <span style={{ fontSize: '12px', color: s.is_occupied ? 'var(--color-red)' : 'var(--color-green)', marginTop: '8px', fontWeight: '600' }}>
                {s.is_occupied ? 'OCCUPIED' : 'VACANT'}
              </span>
              {s.is_occupied ? (
                <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '8px', textAlign: 'center' }}>
                  Vehicle: <strong style={{ color: 'var(--text-main)' }}>{s.vehicle_number}</strong><br/>
                  {s.allocated_to === user.id && isStudent && (
                    <button className="btn btn-danger" style={{ padding: '4px 8px', fontSize: '11px', marginTop: '10px' }} onClick={() => triggerParkingRelease(s.slot_code)}>Release Slot</button>
                  )}
                </div>
              ) : (
                isStudent && <button className="btn btn-primary" style={{ padding: '4px 8px', fontSize: '11px', marginTop: '10px' }} onClick={() => triggerParkingAllocation(s.slot_code)}>Allocate Spot</button>
              )}
            </GlassCard>
          ))}
        </div>
      </GlassCard>
    </div>
  );
};
