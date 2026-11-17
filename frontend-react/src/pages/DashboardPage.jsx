import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CalendarDays,
  Users,
  Grid3X3,
  Clock,
  ArrowRight,
  Flame,
  Plus,
  UserPlus,
  MapPin,
  Utensils
} from 'lucide-react';
import StatsCard from '../components/common/StatsCard';
import TableCard from '../components/tables/TableCard';
import Badge from '../components/common/Badge';
import { useRestaurant } from '../hooks/useRestaurant';
import { formatTime, formatDate } from '../utils/formatters';

export default function DashboardPage({ onOpenNewReservation, onSeatWalkIn }) {
  const navigate = useNavigate();
  const { tables, reservations, waitlist, metrics, seatReservation } = useRestaurant();

  // Upcoming reservations sorted chronologically using Array.prototype.sort
  const upcomingReservations = useMemo(() => {
    return [...reservations]
      .filter(r => r.status === 'confirmed' || r.status === 'pending')
      .sort((a, b) => a.time.localeCompare(b.time))
      .slice(0, 5);
  }, [reservations]);

  // Seated or active tables using Array.prototype.filter
  const activeTables = useMemo(() => {
    return tables
      .filter(t => t.status === 'occupied' || t.status === 'reserved')
      .slice(0, 4);
  }, [tables]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Welcome Banner */}
      <div
        style={{
          background: 'linear-gradient(135deg, rgba(225, 29, 72, 0.15) 0%, rgba(30, 41, 59, 0.6) 100%)',
          border: '1px solid rgba(225, 29, 72, 0.3)',
          borderRadius: '20px',
          padding: '1.75rem 2rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px'
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#fb7185', fontSize: '0.82rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            <Flame size={16} />
            <span>Service in Progress • Evening Shift</span>
          </div>
          <h2
            style={{
              margin: '6px 0',
              fontSize: '1.75rem',
              fontWeight: 800,
              color: '#f8fafc',
              fontFamily: "'Playfair Display', Georgia, serif"
            }}
          >
            Welcome to AuraBistro Floor Control
          </h2>
          <p style={{ margin: 0, color: '#94a3b8', fontSize: '0.9rem', maxWidth: '600px' }}>
            Manage real-time seating availability, monitor reservation turnarounds, and orchestrate walk-in guest intake seamlessly.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            type="button"
            onClick={onOpenNewReservation}
            style={{
              background: 'linear-gradient(135deg, #e11d48, #be123c)',
              border: 'none',
              color: 'white',
              borderRadius: '10px',
              padding: '10px 18px',
              fontWeight: 600,
              fontSize: '0.88rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: '0 4px 12px rgba(225, 29, 72, 0.35)'
            }}
          >
            <Plus size={18} />
            <span>New Booking</span>
          </button>

          <button
            type="button"
            onClick={() => navigate('/tables')}
            style={{
              background: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              color: '#f8fafc',
              borderRadius: '10px',
              padding: '10px 18px',
              fontWeight: 600,
              fontSize: '0.88rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <Grid3X3 size={18} />
            <span>Live Floor Plan</span>
          </button>
        </div>
      </div>

      {/* Top Metrics Row */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
          gap: '16px'
        }}
      >
        <StatsCard
          title="Floor Occupancy"
          value={`${metrics.occupancyRate}%`}
          subtitle={`${metrics.occupiedTables + metrics.reservedTables} of ${metrics.totalTables} tables occupied`}
          icon={Flame}
          trend={metrics.occupancyRate > 70 ? 'High Volume' : 'Steady'}
          trendType={metrics.occupancyRate > 70 ? 'negative' : 'positive'}
          color="#f59e0b"
        />

        <StatsCard
          title="Open Tables"
          value={metrics.availableTables}
          subtitle="Ready for seating walk-ins"
          icon={Grid3X3}
          trend={`${metrics.totalTables} total capacity`}
          trendType="neutral"
          color="#10b981"
        />

        <StatsCard
          title="Active Diners"
          value={metrics.totalSeatedGuests}
          subtitle={`Across ${metrics.seatedCount} seated dining tables`}
          icon={Users}
          trend={`${metrics.totalExpectedGuests} expected today`}
          trendType="positive"
          color="#38bdf8"
        />

        <StatsCard
          title="Total Bookings"
          value={metrics.totalReservations}
          subtitle={`${metrics.confirmedCount} confirmed, ${metrics.pendingCount} pending`}
          icon={CalendarDays}
          trend={`${metrics.confirmedCount} confirmed`}
          trendType="positive"
          color="#a855f7"
        />

        <StatsCard
          title="Walk-In Waitlist"
          value={metrics.activeWaitlistCount}
          subtitle="Parties in queue"
          icon={Clock}
          trend={metrics.activeWaitlistCount > 0 ? 'Wait ~20m' : 'Clear'}
          trendType={metrics.activeWaitlistCount > 0 ? 'negative' : 'positive'}
          color="#e11d48"
        />
      </div>

      {/* Two Column Grid: Upcoming Reservations + Live Dining Floor Highlights */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))',
          gap: '24px'
        }}
      >
        {/* Left Column: Upcoming Arrivals Timeline */}
        <div
          style={{
            background: '#1e293b',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '16px',
            padding: '1.5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Clock size={18} color="#fb7185" />
              <h3 style={{ margin: 0, color: '#f8fafc', fontSize: '1.1rem', fontWeight: 700 }}>
                Upcoming Arrivals Schedule
              </h3>
            </div>
            <button
              type="button"
              onClick={() => navigate('/reservations')}
              style={{
                background: 'none',
                border: 'none',
                color: '#fb7185',
                fontSize: '0.82rem',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              <span>View All</span>
              <ArrowRight size={14} />
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {upcomingReservations.length === 0 ? (
              <p style={{ margin: 0, color: '#64748b', fontSize: '0.85rem' }}>
                No pending or confirmed arrivals scheduled for the rest of today.
              </p>
            ) : (
              upcomingReservations.map(res => {
                const table = res.tableId ? tables.find(t => t.id === res.tableId) : null;
                return (
                  <div
                    key={res.id}
                    style={{
                      background: 'rgba(15, 23, 42, 0.6)',
                      border: '1px solid rgba(255, 255, 255, 0.06)',
                      borderRadius: '12px',
                      padding: '12px 14px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '12px'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div
                        style={{
                          background: 'rgba(225, 29, 72, 0.15)',
                          color: '#fb7185',
                          fontWeight: 700,
                          fontSize: '0.85rem',
                          padding: '6px 10px',
                          borderRadius: '8px',
                          minWidth: '56px',
                          textAlign: 'center'
                        }}
                      >
                        {formatTime(res.time)}
                      </div>
                      <div>
                        <div style={{ fontWeight: 700, color: '#f8fafc', fontSize: '0.9rem' }}>
                          {res.guestName}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                          Party of {res.partySize} • {table ? `Table #${table.number}` : 'Unassigned'} • {res.occasion || 'Dining'}
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Badge status={res.status} />
                      {res.status === 'confirmed' && res.tableId && (
                        <button
                          type="button"
                          onClick={() => seatReservation(res.id, res.tableId)}
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
                          Seat Now
                        </button>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column: Active Tables Summary */}
        <div
          style={{
            background: '#1e293b',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '16px',
            padding: '1.5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Utensils size={18} color="#10b981" />
              <h3 style={{ margin: 0, color: '#f8fafc', fontSize: '1.1rem', fontWeight: 700 }}>
                Active Dining Parties
              </h3>
            </div>
            <button
              type="button"
              onClick={() => navigate('/tables')}
              style={{
                background: 'none',
                border: 'none',
                color: '#10b981',
                fontSize: '0.82rem',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              <span>Manage Floor</span>
              <ArrowRight size={14} />
            </button>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))',
              gap: '12px'
            }}
          >
            {activeTables.map(table => (
              <TableCard
                key={table.id}
                table={table}
                onSeatWalkIn={onSeatWalkIn}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

