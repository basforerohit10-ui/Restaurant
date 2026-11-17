import React from 'react';
import TableCard from './TableCard';
import { Armchair } from 'lucide-react';

export default function TableGrid({
  tables,
  onSelectTable,
  onSeatWalkIn
}) {
  if (tables.length === 0) {
    return (
      <div
        style={{
          background: '#1e293b',
          border: '1px dashed rgba(255, 255, 255, 0.1)',
          borderRadius: '16px',
          padding: '3rem 1.5rem',
          textAlign: 'center',
          color: '#94a3b8',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '12px'
        }}
      >
        <div
          style={{
            width: '56px',
            height: '56px',
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.05)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#64748b'
          }}
        >
          <Armchair size={28} />
        </div>
        <h3 style={{ margin: 0, color: '#f8fafc', fontSize: '1.1rem' }}>No Tables Match Filter</h3>
        <p style={{ margin: 0, fontSize: '0.85rem', maxWidth: '340px' }}>
          Try clearing your status or capacity filter to inspect all dining sections.
        </p>
      </div>
    );
  }

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: '20px'
      }}
    >
      {tables.map(table => (
        <TableCard
          key={table.id}
          table={table}
          onSelectTable={onSelectTable}
          onSeatWalkIn={onSeatWalkIn}
        />
      ))}
    </div>
  );
}

