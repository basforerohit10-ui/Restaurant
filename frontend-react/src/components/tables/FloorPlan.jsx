import React, { useState } from 'react';
import { Users, Info, CheckCircle, Ban, Utensils, Wrench } from 'lucide-react';
import Badge from '../common/Badge';
import { useRestaurant } from '../../hooks/useRestaurant';

export default function FloorPlan({ tables, onSeatWalkIn }) {
  const { reservations, updateTableStatus, completeReservation } = useRestaurant();
  const [selectedTableId, setSelectedTableId] = useState(null);

  const selectedTable = tables.find(t => t.id === selectedTableId) || null;
  const activeReservation = selectedTable?.currentReservationId
    ? reservations.find(r => r.id === selectedTable.currentReservationId)
    : null;

  const getStatusColor = (status) => {
    switch (status) {
      case 'available': return '#10b981';
      case 'occupied': return '#ef4444';
      case 'reserved': return '#f59e0b';
      case 'maintenance': return '#6b7280';
      default: return '#3b82f6';
    }
  };

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: selectedTable ? '1fr 320px' : '1fr',
        gap: '20px',
        transition: 'all 0.3s ease'
      }}
    >
      {/* 2D Canvas Floor Plan Container */}
      <div
        style={{
          background: 'linear-gradient(135deg, #0b1120 0%, #0f172a 100%)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '16px',
          minHeight: '520px',
          position: 'relative',
          padding: '1.5rem',
          overflow: 'hidden',
          boxShadow: 'inset 0 0 40px rgba(0, 0, 0, 0.6)'
        }}
      >
        {/* Subtle Floor Tile Grid Lines */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `radial-gradient(rgba(255, 255, 255, 0.08) 1px, transparent 1px)`,
            backgroundSize: '28px 28px',
            opacity: 0.7,
            pointerEvents: 'none'
          }}
        />

        {/* Room Architectural Landmarks */}
        <div
          style={{
            position: 'absolute',
            top: '16px',
            left: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '0.78rem',
            color: '#64748b',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            fontWeight: 700
          }}
        >
          <span>Main Entrance &amp; Host Stand ➔</span>
        </div>

        <div
          style={{
            position: 'absolute',
            bottom: '16px',
            right: '20px',
            fontSize: '0.78rem',
            color: '#64748b',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            fontWeight: 700
          }}
        >
          <span>Kitchen Pass &amp; Service Bar ⮂</span>
        </div>

        {/* Dynamic Render of All Tables using Array map */}
        {tables.map(table => {
          const isSelected = selectedTableId === table.id;
          const statusColor = getStatusColor(table.status);

          const isRound = table.shape === 'round';
          const isRect = table.shape === 'rectangle';
          const width = isRect ? 94 : isRound ? 72 : 72;
          const height = isRect ? 58 : isRound ? 72 : 72;

          return (
            <div
              key={table.id}
              onClick={() => setSelectedTableId(isSelected ? null : table.id)}
              style={{
                position: 'absolute',
                left: `${table.x}%`,
                top: `${table.y}%`,
                transform: 'translate(-50%, -50%)',
                width: `${width}px`,
                height: `${height}px`,
                borderRadius: isRound ? '50%' : '12px',
                backgroundColor: `${statusColor}22`,
                border: `2px solid ${statusColor}`,
                boxShadow: isSelected
                  ? `0 0 0 4px rgba(255, 255, 255, 0.4), 0 8px 20px rgba(0,0,0,0.6)`
                  : `0 4px 10px rgba(0,0,0,0.4)`,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                zIndex: isSelected ? 20 : 5
              }}
              title={`Table #${table.number} - ${table.status.toUpperCase()} (${table.capacity} guests)`}
            >
              <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#f8fafc' }}>
                #{table.number}
              </span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '2px', fontSize: '0.7rem', color: '#cbd5e1' }}>
                <Users size={11} />
                <span>{table.capacity}p</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Table Inspector Sidebar */}
      {selectedTable && (
        <div
          style={{
            background: '#1e293b',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '16px',
            padding: '1.25rem',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            gap: '16px',
            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.4)'
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
              <h3 style={{ margin: 0, color: '#f8fafc', fontSize: '1.2rem', fontWeight: 800 }}>
                Table #{selectedTable.number}
              </h3>
              <Badge status={selectedTable.status} pulse={selectedTable.status === 'occupied'} />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94a3b8' }}>
                <span>Area Section:</span>
                <span style={{ color: '#f8fafc', fontWeight: 600, textTransform: 'capitalize' }}>
                  {selectedTable.section}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94a3b8' }}>
                <span>Seating Capacity:</span>
                <span style={{ color: '#f8fafc', fontWeight: 600 }}>
                  {selectedTable.capacity} Guests
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94a3b8' }}>
                <span>Table Shape:</span>
                <span style={{ color: '#f8fafc', fontWeight: 600, textTransform: 'capitalize' }}>
                  {selectedTable.shape}
                </span>
              </div>
            </div>

            <hr style={{ border: 'none', borderTop: '1px solid rgba(255, 255, 255, 0.08)', margin: '14px 0' }} />

            {/* Active Guest Info if reserved or occupied */}
            {activeReservation ? (
              <div
                style={{
                  background: 'rgba(15, 23, 42, 0.6)',
                  borderRadius: '10px',
                  padding: '12px',
                  border: '1px solid rgba(255, 255, 255, 0.08)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#fb7185', fontSize: '0.78rem', fontWeight: 700, marginBottom: '6px' }}>
                  <Info size={14} />
                  <span>ACTIVE BOOKING</span>
                </div>
                <h4 style={{ margin: '0 0 4px', color: '#f8fafc', fontSize: '0.95rem' }}>
                  {activeReservation.guestName}
                </h4>
                <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                  {activeReservation.time} • Party of {activeReservation.partySize} • {activeReservation.occasion || 'Standard'}
                </div>
                {activeReservation.specialRequests && (
                  <p style={{ margin: '6px 0 0', fontSize: '0.78rem', color: '#cbd5e1', fontStyle: 'italic' }}>
                    "{activeReservation.specialRequests}"
                  </p>
                )}
              </div>
            ) : (
              <div style={{ color: '#64748b', fontSize: '0.85rem', textAlign: 'center', padding: '10px 0' }}>
                No active reservation currently assigned to this table.
              </div>
            )}
          </div>

          {/* Table Actions */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {selectedTable.status === 'available' && (
              <>
                <button
                  type="button"
                  onClick={() => onSeatWalkIn && onSeatWalkIn(selectedTable)}
                  style={{
                    background: '#10b981',
                    border: 'none',
                    color: 'white',
                    borderRadius: '8px',
                    padding: '10px',
                    fontWeight: 600,
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px'
                  }}
                >
                  <Utensils size={16} />
                  <span>Seat Walk-In Guest</span>
                </button>
                <button
                  type="button"
                  onClick={() => updateTableStatus(selectedTable.id, 'maintenance')}
                  style={{
                    background: 'rgba(255, 255, 255, 0.08)',
                    border: 'none',
                    color: '#94a3b8',
                    borderRadius: '8px',
                    padding: '8px',
                    fontWeight: 500,
                    fontSize: '0.8rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px'
                  }}
                >
                  <Wrench size={14} />
                  <span>Mark Maintenance</span>
                </button>
              </>
            )}

            {selectedTable.status === 'occupied' && (
              <button
                type="button"
                onClick={() => {
                  if (activeReservation) {
                    completeReservation(activeReservation.id);
                  } else {
                    updateTableStatus(selectedTable.id, 'available');
                  }
                }}
                style={{
                  background: '#10b981',
                  border: 'none',
                  color: 'white',
                  borderRadius: '8px',
                  padding: '10px',
                  fontWeight: 600,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px'
                }}
              >
                <CheckCircle size={16} />
                <span>Clear Table / Guest Departed</span>
              </button>
            )}

            {selectedTable.status === 'reserved' && (
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  type="button"
                  onClick={() => updateTableStatus(selectedTable.id, 'occupied')}
                  style={{
                    flex: 1,
                    background: '#3b82f6',
                    border: 'none',
                    color: 'white',
                    borderRadius: '8px',
                    padding: '10px',
                    fontWeight: 600,
                    fontSize: '0.85rem',
                    cursor: 'pointer'
                  }}
                >
                  Seat Now
                </button>
                <button
                  type="button"
                  onClick={() => updateTableStatus(selectedTable.id, 'available')}
                  style={{
                    background: 'rgba(255, 255, 255, 0.08)',
                    border: 'none',
                    color: '#ef4444',
                    borderRadius: '8px',
                    padding: '10px 14px',
                    fontWeight: 600,
                    fontSize: '0.85rem',
                    cursor: 'pointer'
                  }}
                  title="Cancel reservation hold"
                >
                  <Ban size={16} />
                </button>
              </div>
            )}

            {selectedTable.status === 'maintenance' && (
              <button
                type="button"
                onClick={() => updateTableStatus(selectedTable.id, 'available')}
                style={{
                  background: '#10b981',
                  border: 'none',
                  color: 'white',
                  borderRadius: '8px',
                  padding: '10px',
                  fontWeight: 600,
                  fontSize: '0.85rem',
                  cursor: 'pointer'
                }}
              >
                Restore Table to Service
              </button>
            )}

            <button
              type="button"
              onClick={() => setSelectedTableId(null)}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#64748b',
                padding: '6px',
                fontSize: '0.78rem',
                cursor: 'pointer'
              }}
            >
              Close Inspector
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

