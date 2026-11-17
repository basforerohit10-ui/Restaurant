import React from 'react';
import { Users, Clock, Calendar, Phone, Mail, Edit2, XCircle, CheckCircle, Utensils } from 'lucide-react';
import Badge from '../common/Badge';
import { formatTime, formatDate } from '../../utils/formatters';
import { useRestaurant } from '../../hooks/useRestaurant';

export default function ReservationCard({
  reservation,
  onEdit,
  onAssignTable
}) {
  const { tables, seatReservation, completeReservation, cancelReservation } = useRestaurant();

  // Find table details using Array.prototype.find
  const assignedTable = reservation.tableId
    ? tables.find(t => t.id === reservation.tableId)
    : null;

  return (
    <div
      style={{
        background: '#1e293b',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: '16px',
        padding: '1.25rem',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        gap: '14px',
        transition: 'transform 0.2s ease, border-color 0.2s ease',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.2)'
      }}
    >
      {/* Top Header */}
      <div>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '8px' }}>
          <div>
            <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#fb7185', letterSpacing: '0.04em' }}>
              {reservation.id}
            </span>
            <h3 style={{ margin: '2px 0 0', fontSize: '1.15rem', fontWeight: 700, color: '#f8fafc' }}>
              {reservation.guestName}
            </h3>
          </div>
          <Badge status={reservation.status} pulse={reservation.status === 'seated'} />
        </div>

        {/* Occasion pill */}
        {reservation.occasion && (
          <span
            style={{
              display: 'inline-block',
              fontSize: '0.72rem',
              fontWeight: 600,
              color: '#38bdf8',
              backgroundColor: 'rgba(56, 189, 248, 0.1)',
              padding: '2px 8px',
              borderRadius: '6px',
              marginBottom: '10px'
            }}
          >
            {reservation.occasion}
          </span>
        )}

        {/* Meta details: Date, Time, Party size */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '0.82rem', color: '#cbd5e1' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Clock size={14} color="#94a3b8" />
            <span>{formatTime(reservation.time)}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Calendar size={14} color="#94a3b8" />
            <span>{formatDate(reservation.date)}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Users size={14} color="#94a3b8" />
            <span>{reservation.partySize} Guests</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ color: '#94a3b8' }}>Table:</span>
            <span style={{ fontWeight: 600, color: assignedTable ? '#10b981' : '#f59e0b' }}>
              {assignedTable ? `T-${assignedTable.number} (${assignedTable.section})` : 'Unassigned'}
            </span>
          </div>
        </div>

        {/* Contact info */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginTop: '10px', fontSize: '0.78rem', color: '#94a3b8' }}>
          {reservation.phone && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Phone size={13} />
              <span>{reservation.phone}</span>
            </div>
          )}
          {reservation.email && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Mail size={13} />
              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {reservation.email}
              </span>
            </div>
          )}
        </div>

        {/* Special requests / Notes */}
        {reservation.specialRequests && (
          <div
            style={{
              marginTop: '10px',
              padding: '8px 10px',
              backgroundColor: 'rgba(15, 23, 42, 0.5)',
              borderRadius: '8px',
              fontSize: '0.78rem',
              color: '#cbd5e1',
              borderLeft: '3px solid #fb7185'
            }}
          >
            "{reservation.specialRequests}"
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          paddingTop: '10px',
          borderTop: '1px solid rgba(255, 255, 255, 0.06)'
        }}
      >
        {reservation.status === 'confirmed' && (
          <button
            type="button"
            onClick={() => {
              if (reservation.tableId) {
                seatReservation(reservation.id, reservation.tableId);
              } else if (onAssignTable) {
                onAssignTable(reservation);
              }
            }}
            style={{
              flex: 1,
              background: '#10b981',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              padding: '8px 12px',
              fontSize: '0.82rem',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px'
            }}
          >
            <Utensils size={14} />
            <span>{reservation.tableId ? 'Seat Guest' : 'Assign & Seat'}</span>
          </button>
        )}

        {reservation.status === 'seated' && (
          <button
            type="button"
            onClick={() => completeReservation(reservation.id)}
            style={{
              flex: 1,
              background: '#a855f7',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              padding: '8px 12px',
              fontSize: '0.82rem',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px'
            }}
          >
            <CheckCircle size={14} />
            <span>Complete Meal</span>
          </button>
        )}

        {reservation.status === 'pending' && (
          <button
            type="button"
            onClick={() => onAssignTable && onAssignTable(reservation)}
            style={{
              flex: 1,
              background: '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              padding: '8px 12px',
              fontSize: '0.82rem',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            Confirm &amp; Table
          </button>
        )}

        {/* Edit Button */}
        <button
          type="button"
          onClick={() => onEdit(reservation)}
          style={{
            background: 'rgba(255, 255, 255, 0.08)',
            border: 'none',
            color: '#cbd5e1',
            borderRadius: '8px',
            padding: '8px 10px',
            fontSize: '0.82rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          title="Edit reservation"
        >
          <Edit2 size={14} />
        </button>

        {/* Cancel Button */}
        {reservation.status !== 'cancelled' && reservation.status !== 'completed' && (
          <button
            type="button"
            onClick={() => cancelReservation(reservation.id)}
            style={{
              background: 'rgba(239, 68, 68, 0.12)',
              border: 'none',
              color: '#ef4444',
              borderRadius: '8px',
              padding: '8px 10px',
              fontSize: '0.82rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            title="Cancel reservation"
          >
            <XCircle size={14} />
          </button>
        )}
      </div>
    </div>
  );
}

