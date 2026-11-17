import React from 'react';
import { Users, CheckCircle, Wrench, Ban, UserCheck, Utensils } from 'lucide-react';
import Badge from '../common/Badge';
import styles from './TableCard.module.css';
import { useRestaurant } from '../../hooks/useRestaurant';

export default function TableCard({ table, onSelectTable, onSeatWalkIn }) {
  const { reservations, updateTableStatus, completeReservation } = useRestaurant();

  // Find linked reservation if any using Array.prototype.find
  const activeReservation = table.currentReservationId
    ? reservations.find(r => r.id === table.currentReservationId)
    : null;

  const cardStatusClass = {
    available: styles.cardAvailable,
    occupied: styles.cardOccupied,
    reserved: styles.cardReserved,
    maintenance: styles.cardMaintenance
  }[table.status] || styles.cardAvailable;

  const shapeClass = {
    round: styles.tableShapeRound,
    square: styles.tableShapeSquare,
    rectangle: styles.tableShapeRectangle
  }[table.shape] || styles.tableShapeSquare;

  const chairColorClass = {
    available: styles.chairAvailable,
    occupied: styles.chairOccupied,
    reserved: styles.chairReserved,
    maintenance: styles.chairMaintenance
  }[table.status] || styles.chairAvailable;

  // Render chairs dynamically around the table based on capacity
  const renderChairs = () => {
    const chairs = [];
    const count = table.capacity;

    if (count <= 2) {
      // Top and bottom
      chairs.push(<div key="top" className={`${styles.chair} ${chairColorClass}`} style={{ top: '-14px', left: 'calc(50% - 8px)' }} />);
      chairs.push(<div key="bot" className={`${styles.chair} ${chairColorClass}`} style={{ bottom: '-14px', left: 'calc(50% - 8px)' }} />);
    } else if (count <= 4) {
      // 4 sides
      chairs.push(<div key="top" className={`${styles.chair} ${chairColorClass}`} style={{ top: '-14px', left: 'calc(50% - 8px)' }} />);
      chairs.push(<div key="bot" className={`${styles.chair} ${chairColorClass}`} style={{ bottom: '-14px', left: 'calc(50% - 8px)' }} />);
      chairs.push(<div key="lft" className={`${styles.chair} ${chairColorClass}`} style={{ left: '-14px', top: 'calc(50% - 5px)', width: '10px', height: '16px' }} />);
      chairs.push(<div key="rgt" className={`${styles.chair} ${chairColorClass}`} style={{ right: '-14px', top: 'calc(50% - 5px)', width: '10px', height: '16px' }} />);
    } else {
      // 6 or 8+ capacity
      const sideChairs = Math.floor((count - 2) / 2);
      for (let i = 0; i < sideChairs; i++) {
        const offset = 15 + (i * 28);
        chairs.push(<div key={`top-${i}`} className={`${styles.chair} ${chairColorClass}`} style={{ top: '-14px', left: `${offset}px` }} />);
        chairs.push(<div key={`bot-${i}`} className={`${styles.chair} ${chairColorClass}`} style={{ bottom: '-14px', left: `${offset}px` }} />);
      }
      // Left and right head chairs
      chairs.push(<div key="lft" className={`${styles.chair} ${chairColorClass}`} style={{ left: '-14px', top: 'calc(50% - 5px)', width: '10px', height: '16px' }} />);
      chairs.push(<div key="rgt" className={`${styles.chair} ${chairColorClass}`} style={{ right: '-14px', top: 'calc(50% - 5px)', width: '10px', height: '16px' }} />);
    }

    return chairs;
  };

  return (
    <div className={`${styles.card} ${cardStatusClass}`}>
      {/* Top Header */}
      <div className={styles.topRow}>
        <div className={styles.tableHeader}>
          <h4 className={styles.tableNumber}>T-{table.number}</h4>
          <span className={styles.sectionPill}>{table.section}</span>
        </div>
        <Badge status={table.status} pulse={table.status === 'occupied'} />
      </div>

      {/* Visual Table and Dynamic Chairs Representation */}
      <div className={styles.visualWrapper}>
        <div
          className={`${styles.tableGraphic} ${shapeClass}`}
          style={{
            backgroundColor:
              table.status === 'available'
                ? 'rgba(16, 185, 129, 0.12)'
                : table.status === 'occupied'
                ? 'rgba(239, 68, 68, 0.15)'
                : table.status === 'reserved'
                ? 'rgba(245, 158, 11, 0.15)'
                : 'rgba(107, 114, 128, 0.15)',
            border: `2px solid ${
              table.status === 'available'
                ? '#10b981'
                : table.status === 'occupied'
                ? '#ef4444'
                : table.status === 'reserved'
                ? '#f59e0b'
                : '#6b7280'
            }`
          }}
        >
          {renderChairs()}
          <div style={{ textAlign: 'center', color: '#f8fafc', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 700 }}>#{table.number}</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '3px', fontSize: '0.72rem', color: '#94a3b8' }}>
              <Users size={12} />
              <span>{table.capacity}p</span>
            </div>
          </div>
        </div>
      </div>

      {/* Guest info card if table is reserved or occupied */}
      {activeReservation ? (
        <div className={styles.guestInfo}>
          <div className={styles.guestName}>
            <span>{activeReservation.guestName}</span>
            <span style={{ fontSize: '0.72rem', color: '#fb7185' }}>
              {activeReservation.time}
            </span>
          </div>
          <div className={styles.guestMeta}>
            Party of {activeReservation.partySize} • {activeReservation.occasion || 'Dining'}
          </div>
          {activeReservation.specialRequests && (
            <div style={{ fontSize: '0.72rem', color: '#cbd5e1', fontStyle: 'italic', marginTop: '2px' }}>
              "{activeReservation.specialRequests}"
            </div>
          )}
        </div>
      ) : (
        <div style={{ fontSize: '0.8rem', color: '#64748b', textAlign: 'center', padding: '6px 0' }}>
          {table.status === 'available' ? 'Ready for immediate seating' : 'No active party assigned'}
        </div>
      )}

      {/* Contextual Actions */}
      <div className={styles.actionsRow}>
        {table.status === 'available' && (
          <>
            <button
              type="button"
              className={`${styles.actionBtn} ${styles.actionSuccess}`}
              onClick={() => onSeatWalkIn && onSeatWalkIn(table)}
              title="Seat walk-in guest at this table"
            >
              <UserCheck size={14} />
              <span>Seat Walk-In</span>
            </button>
            <button
              type="button"
              className={`${styles.actionBtn} ${styles.actionSecondary}`}
              onClick={() => updateTableStatus(table.id, 'maintenance')}
              title="Mark table under maintenance"
            >
              <Wrench size={14} />
            </button>
          </>
        )}

        {table.status === 'occupied' && (
          <>
            <button
              type="button"
              className={`${styles.actionBtn} ${styles.actionSuccess}`}
              onClick={() => {
                if (activeReservation) {
                  completeReservation(activeReservation.id);
                } else {
                  updateTableStatus(table.id, 'available');
                }
              }}
            >
              <CheckCircle size={14} />
              <span>Clear / Free</span>
            </button>
          </>
        )}

        {table.status === 'reserved' && (
          <>
            <button
              type="button"
              className={`${styles.actionBtn} ${styles.actionPrimary}`}
              onClick={() => {
                if (activeReservation) {
                  updateTableStatus(table.id, 'occupied');
                }
              }}
            >
              <Utensils size={14} />
              <span>Seat Party</span>
            </button>
            <button
              type="button"
              className={`${styles.actionBtn} ${styles.actionSecondary}`}
              onClick={() => updateTableStatus(table.id, 'available')}
              title="Cancel reservation hold"
            >
              <Ban size={14} />
            </button>
          </>
        )}

        {table.status === 'maintenance' && (
          <button
            type="button"
            className={`${styles.actionBtn} ${styles.actionSuccess}`}
            onClick={() => updateTableStatus(table.id, 'available')}
          >
            <CheckCircle size={14} />
            <span>Restore Table</span>
          </button>
        )}
      </div>
    </div>
  );
}

