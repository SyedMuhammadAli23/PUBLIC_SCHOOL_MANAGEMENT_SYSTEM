import React from 'react';
import { GlassCard } from '../components/ui/GlassCard';
import { DataTable } from '../components/ui/DataTable';
import { Badge } from '../components/ui/Badge';

export const LibraryPage = ({ books, borrows, newBook, setNewBook, handlePost }) => {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '30px' }}>
      <GlassCard style={{ padding: '32px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '24px' }}>Library Book Catalog</h2>
        <DataTable headers={['Book Title', 'Author', 'ISBN', 'Category', 'Availability']}>
          {books.map(b => (
            <tr key={b.id}>
              <td><strong>{b.title}</strong></td>
              <td>{b.author}</td>
              <td style={{ fontFamily: 'var(--font-mono)', fontSize: '13px' }}>{b.isbn}</td>
              <td>{b.category}</td>
              <td>
                <Badge type={b.available_copies > 0 ? 'success' : 'danger'}>
                  {b.available_copies} / {b.total_copies} Copies
                </Badge>
              </td>
            </tr>
          ))}
        </DataTable>
      </GlassCard>

      <GlassCard style={{ padding: '32px', height: 'fit-content' }}>
        <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '20px' }}>Add Catalog Book</h3>
        <form onSubmit={(e) => {
          e.preventDefault();
          handlePost('/api/library/books', newBook, 'Book cataloged successfully', () => {
            setNewBook({ title: '', author: '', isbn: '', category: 'Computer Science', total_copies: 5 });
          });
        }} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>Book Title</label>
            <input type="text" value={newBook.title} onChange={e => setNewBook({ ...newBook, title: e.target.value })} placeholder="e.g. Physics of Semiconductors" required />
          </div>
          <div>
            <label style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>Author</label>
            <input type="text" value={newBook.author} onChange={e => setNewBook({ ...newBook, author: e.target.value })} placeholder="e.g. Simon Sze" required />
          </div>
          <div>
            <label style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>ISBN</label>
            <input type="text" value={newBook.isbn} onChange={e => setNewBook({ ...newBook, isbn: e.target.value })} placeholder="e.g. 978-0471143239" required />
          </div>
          <div>
            <label style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>Category</label>
            <select value={newBook.category} onChange={e => setNewBook({ ...newBook, category: e.target.value })}>
              <option value="Computer Science">Computer Science</option>
              <option value="Physics">Physics</option>
              <option value="Biotech">Biotech</option>
              <option value="Mathematics">Mathematics</option>
            </select>
          </div>
          <div>
            <label style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>Total Copies</label>
            <input type="number" value={newBook.total_copies} onChange={e => setNewBook({ ...newBook, total_copies: parseInt(e.target.value) })} required />
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '10px' }}>Add Book</button>
        </form>
      </GlassCard>
    </div>
  );
};
