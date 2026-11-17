import React from 'react';
import ReservationCard from './ReservationCard';
import Badge from '../common/Badge';
import { CalendarX, Utensils, Edit2, XCircle, CheckCircle } from 'lucide-react';
import { formatTime, formatDate } from '../../utils/formatters';
import { useRestaurant } from '../../hooks/useRestaurant';

export default function ReservationList({
  reservations,
  viewMode = 'grid',
  onEdit,
  onAssignTable
}) {
  const { tables, seatReservation, completeReservation, cancelReservation } = useRestaurant();

  if (reservations.length === 0) {
    return (
      <div
        style={{
          background: '#1e293b',
          border: '1px dashed rgba(255, 255, 255, 0.1)',
          borderRadius: '16px',
          padding: '3.5rem 1.5rem',
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
          <CalendarX size={28} />
        </div>
        <h3 style={{ margin: 0, color: '#f8fafc', fontSize: '1.15rem' }}>No Reservations Found</h3>
        <p style={{ margin: 0, fontSize: '0.85rem', maxWidth: '360px' }}>
          No reservations match the specified search query, status filters, or selected date.
        </p>
      </div>
    );
  }

  // Dense Table View
  if (viewMode === 'list') {
    return (
      <div
        style={{
          background: '#1e293b',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '16px',
          overflowX: 'auto'
        }}
      >
        <table
          style={{
            width: '100%',
            borderCollapse: 'collapse',
            textAlign: 'left',
            fontSize: '0.85rem'
          }}
        >
          <thead>
            <tr
              style={{
                borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
                color: '#64748b',
                textTransform: 'uppercase',
                fontSize: '0.72rem',
                letterSpacing: '0.05em'
              }}
            >
              <th style={{ padding: '14px 18px' }}>Ref ID</th>
              <th style={{ padding: '14px 18px' }}>Guest Name</th>
              <th style={{ padding: '14px 18px' }}>Party</th>
              <th style={{ padding: '14px 18px' }}>Date &amp; Time</th>
              <th style={{ padding: '14px 18px' }}>Table</th>
              <th style={{ padding: '14px 18px' }}>Status</th>
              <th style={{ padding: '14px 18px', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {reservations.map(res => {
              const table = res.tableId ? tables.find(t => t.id === res.tableId) : null;
              return (
                <tr
                  key={res.id}
                  style={{
                    borderBottom: '1px solid rgba(255, 255, 255, 0.04)',
                    color: '#e2e8f0',
                    transition: 'background-color 0.15s ease'
                  }}
                  className="table-row-hover"
                >
                  <td style={{ padding: '12px 18px', fontWeight: 600, color: '#fb7185' }}>
                    {res.id}
                  </td>
                  <td style={{ padding: '12px 18px' }}>
                    <div style={{ fontWeight: 600, color: '#f8fafc' }}>{res.guestName}</div>
                    <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{res.phone}</div>
                  </td>
                  <td style={{ padding: '12px 18px' }}>
                    {res.partySize} Guests
                  </td>
                  <td style={{ padding: '12px 18px' }}>
                    <div>{formatTime(res.time)}</div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{formatDate(res.date)}</div>
                  </td>
                  <td style={{ padding: '12px 18px' }}>
                    {table ? (
                      <span style={{ color: '#10b981', fontWeight: 600 }}>Table #{table.number}</span>
                    ) : (
                      <span style={{ color: '#f59e0b', fontSize: '0.8rem' }}>Unassigned</span>
                    )}
                  </td>
                  <td style={{ padding: '12px 18px' }}>
                    <Badge status={res.status} pulse={res.status === 'seated'} />
                  </td>
                  <td style={{ padding: '12px 18px', textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                      {res.status === 'confirmed' && (
                        <button
                          type="button"
                          onClick={() => {
                            if (res.tableId) seatReservation(res.id, res.tableId);
                            else onAssignTable && onAssignTable(res);
                          }}
                          style={{
                            background: '#10b981',
                            color: 'white',
                            border: 'none',
                            borderRadius: '6px',
                            padding: '6px 10px',
                            fontSize: '0.75rem',
                            fontWeight: 600,
                            cursor: 'pointer'
                          }}
                        >
                          Seat
                        </button>
                      )}
                      {res.status === 'seated' && (
                        <button
                          type="button"
                          onClick={() => completeReservation(res.id)}
                          style={{
                            background: '#a855f7',
                            color: 'white',
                            border: 'none',
                            borderRadius: '6px',
                            padding: '6px 10px',
                            fontSize: '0.75rem',
                            fontWeight: 600,
                            cursor: 'pointer'
                          }}
                        >
                          Clear
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => onEdit(res)}
                        style={{
                          background: 'rgba(255, 255, 255, 0.08)',
                          color: '#cbd5e1',
                          border: 'none',
                          borderRadius: '6px',
                          padding: '6px 8px',
                          cursor: 'pointer'
                        }}
                        title="Edit"
                      >
                        <Edit2 size={13} />
                      </button>
                      {res.status !== 'cancelled' && res.status !== 'completed' && (
                        <button
                          type="button"
                          onClick={() => cancelReservation(res.id)}
                          style={{
                            background: 'rgba(239, 68, 68, 0.1)',
                            color: '#ef4444',
                            border: 'none',
                            borderRadius: '6px',
                            padding: '6px 8px',
                            cursor: 'pointer'
                          }}
                          title="Cancel"
                        >
                          <XCircle size={13} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  }

  // Grid Card View
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
        gap: '20px'
      }}
    >
      {reservations.map(res => (
        <ReservationCard
          key={res.id}
          reservation={res}
          onEdit={onEdit}
          onAssignTable={onAssignTable}
        />
      ))}
    </div>
  );
}

