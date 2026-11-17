import React from 'react';
import { Clock, Users, Utensils } from 'lucide-react';
import { useRestaurant } from '../../hooks/useRestaurant';
import { formatTime } from '../../utils/formatters';

export default function TableTimeline({ tables }) {
  const { reservations, seatReservation } = useRestaurant();

  const timeSlots = ['17:00', '18:00', '19:00', '20:00', '21:00', '22:00'];

  // Helper using Array.prototype.find to locate a reservation booked for this table during an hour window
  const getBookingForSlot = (tableId, slotTime) => {
    const slotHour = parseInt(slotTime.split(':')[0], 10);

    return reservations.find(r => {
      if (r.tableId !== tableId || r.status === 'cancelled') return false;
      const resHour = parseInt(r.time.split(':')[0], 10);
      return resHour === slotHour;
    });
  };

  return (
    <div
      style={{
        background: '#1e293b',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: '16px',
        overflowX: 'auto',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.2)'
      }}
    >
      <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Clock size={18} color="#fb7185" />
          <h3 style={{ margin: 0, color: '#f8fafc', fontSize: '1.1rem', fontWeight: 700 }}>
            Hourly Table Reservation Matrix (Service Timeline)
          </h3>
        </div>
        <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
          {tables.length} Tables plotted across evening service
        </span>
      </div>

      <table
        style={{
          width: '100%',
          borderCollapse: 'collapse',
          fontSize: '0.85rem',
          textAlign: 'left'
        }}
      >
        <thead>
          <tr style={{ background: '#0f172a', borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
            <th style={{ padding: '12px 16px', width: '180px', color: '#94a3b8', fontSize: '0.78rem', textTransform: 'uppercase' }}>
              Table &amp; Area
            </th>
            {timeSlots.map(slot => (
              <th
                key={slot}
                style={{
                  padding: '12px 16px',
                  color: '#fb7185',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  textAlign: 'center',
                  borderLeft: '1px solid rgba(255, 255, 255, 0.06)'
                }}
              >
                {formatTime(slot)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {tables.map(table => (
            <tr
              key={table.id}
              style={{
                borderBottom: '1px solid rgba(255, 255, 255, 0.04)',
                transition: 'background-color 0.15s ease'
              }}
              className="table-row-hover"
            >
              {/* Table Info Column */}
              <td style={{ padding: '12px 16px', verticalAlign: 'middle' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div
                    style={{
                      fontWeight: 800,
                      color: '#f8fafc',
                      fontSize: '0.95rem'
                    }}
                  >
                    T-{table.number}
                  </div>
                  <span
                    style={{
                      fontSize: '0.72rem',
                      padding: '2px 6px',
                      borderRadius: '4px',
                      background: 'rgba(255, 255, 255, 0.06)',
                      color: '#94a3b8',
                      textTransform: 'capitalize'
                    }}
                  >
                    {table.section}
                  </span>
                </div>
                <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '2px' }}>
                  {table.capacity}p • {table.shape}
                </div>
              </td>

              {/* Time Slot Columns */}
              {timeSlots.map(slot => {
                const booking = getBookingForSlot(table.id, slot);

                return (
                  <td
                    key={slot}
                    style={{
                      padding: '8px 10px',
                      borderLeft: '1px solid rgba(255, 255, 255, 0.06)',
                      verticalAlign: 'middle',
                      textAlign: 'center'
                    }}
                  >
                    {booking ? (
                      <div
                        style={{
                          background:
                            booking.status === 'seated'
                              ? 'rgba(16, 185, 129, 0.18)'
                              : 'rgba(245, 158, 11, 0.18)',
                          border: `1px solid ${
                            booking.status === 'seated' ? '#10b981' : '#f59e0b'
                          }`,
                          borderRadius: '8px',
                          padding: '6px 8px',
                          textAlign: 'left'
                        }}
                      >
                        <div
                          style={{
                            fontWeight: 700,
                            color: '#f8fafc',
                            fontSize: '0.78rem',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis'
                          }}
                        >
                          {booking.guestName}
                        </div>
                        <div
                          style={{
                            fontSize: '0.7rem',
                            color: booking.status === 'seated' ? '#10b981' : '#f59e0b',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            marginTop: '2px'
                          }}
                        >
                          <span>{booking.time}</span>
                          <span>•</span>
                          <span>{booking.partySize}p</span>
                        </div>
                      </div>
                    ) : (
                      <span style={{ color: '#475569', fontSize: '0.75rem' }}>
                        —
                      </span>
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

