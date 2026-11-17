import React, { useMemo } from 'react';
import { BarChart3, Code2, Sparkles, Filter, Layers, CheckCircle2, PieChart } from 'lucide-react';
import { useRestaurant } from '../hooks/useRestaurant';
import { executeArrayOperations } from '../utils/arrayOperationsDemo';
import { INITIAL_SECTIONS } from '../data/initialData';

export default function AnalyticsPage() {
  const { reservations, tables, metrics } = useRestaurant();

  // Execute live array operations on current state
  const operations = useMemo(() => {
    return executeArrayOperations(reservations, tables);
  }, [reservations, tables]);

  // Section-by-section breakdown computed dynamically with filter & reduce
  const sectionBreakdown = useMemo(() => {
    return INITIAL_SECTIONS.filter(s => s.id !== 'all').map(sec => {
      const secTables = tables.filter(t => t.section === sec.id);
      const totalSecTables = secTables.length;
      const occupiedSecTables = secTables.filter(t => t.status === 'occupied' || t.status === 'reserved').length;
      const occupancyPct = totalSecTables > 0 ? Math.round((occupiedSecTables / totalSecTables) * 100) : 0;
      const totalCapacity = secTables.reduce((sum, t) => sum + t.capacity, 0);

      return {
        id: sec.id,
        name: sec.name,
        totalTables: totalSecTables,
        occupiedTables: occupiedSecTables,
        occupancyPct,
        totalCapacity
      };
    });
  }, [tables]);

  // Party size distribution calculated with reduce()
  const partySizeDistribution = useMemo(() => {
    return reservations.reduce((acc, res) => {
      const size = res.partySize;
      const groupKey = size <= 2 ? '1-2 Guests' : size <= 4 ? '3-4 Guests' : size <= 6 ? '5-6 Guests' : '7+ Guests';
      acc[groupKey] = (acc[groupKey] || 0) + 1;
      return acc;
    }, {
      '1-2 Guests': 0,
      '3-4 Guests': 0,
      '5-6 Guests': 0,
      '7+ Guests': 0
    });
  }, [reservations]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Page Header */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#fb7185', fontSize: '0.82rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
          <Sparkles size={16} />
          <span>Data Dynamics &amp; Operations Lab</span>
        </div>
        <h2 style={{ margin: '4px 0 0', fontSize: '1.5rem', fontWeight: 800, color: '#f8fafc' }}>
          Analytics &amp; JavaScript Array Operations Lab
        </h2>
        <p style={{ margin: '4px 0 0', color: '#94a3b8', fontSize: '0.88rem' }}>
          Live demonstration of immutable JavaScript array operations (map, filter, reduce, find, some, sort) driving real-time restaurant statistics.
        </p>
      </div>

      {/* Top Section Utilization Progress Bars */}
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
            <PieChart size={18} color="#10b981" />
            <h3 style={{ margin: 0, color: '#f8fafc', fontSize: '1.1rem', fontWeight: 700 }}>
              Area Occupancy Breakdown (Computed via array.filter &amp; reduce)
            </h3>
          </div>
          <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
            Overall Floor: <strong style={{ color: '#f8fafc' }}>{metrics.occupancyRate}%</strong>
          </span>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '16px'
          }}
        >
          {sectionBreakdown.map(sec => (
            <div
              key={sec.id}
              style={{
                background: 'rgba(15, 23, 42, 0.6)',
                padding: '14px',
                borderRadius: '12px',
                border: '1px solid rgba(255, 255, 255, 0.06)',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: 700, color: '#f8fafc', fontSize: '0.88rem' }}>
                  {sec.name}
                </span>
                <span style={{ fontWeight: 800, color: sec.occupancyPct > 70 ? '#ef4444' : sec.occupancyPct > 40 ? '#f59e0b' : '#10b981', fontSize: '0.85rem' }}>
                  {sec.occupancyPct}%
                </span>
              </div>

              {/* Progress bar with dynamic inline styling */}
              <div
                style={{
                  width: '100%',
                  height: '8px',
                  backgroundColor: 'rgba(255, 255, 255, 0.08)',
                  borderRadius: '9999px',
                  overflow: 'hidden'
                }}
              >
                <div
                  style={{
                    width: `${sec.occupancyPct}%`,
                    height: '100%',
                    backgroundColor: sec.occupancyPct > 70 ? '#ef4444' : sec.occupancyPct > 40 ? '#f59e0b' : '#10b981',
                    borderRadius: '9999px',
                    transition: 'width 0.4s ease'
                  }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#94a3b8' }}>
                <span>{sec.occupiedTables} / {sec.totalTables} tables filled</span>
                <span>Max {sec.totalCapacity} seats</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Party Size Distribution Card */}
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
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <BarChart3 size={18} color="#38bdf8" />
          <h3 style={{ margin: 0, color: '#f8fafc', fontSize: '1.1rem', fontWeight: 700 }}>
            Party Size Grouping (Computed via array.reduce)
          </h3>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
            gap: '12px'
          }}
        >
          {Object.entries(partySizeDistribution).map(([group, count]) => (
            <div
              key={group}
              style={{
                background: 'rgba(15, 23, 42, 0.6)',
                border: '1px solid rgba(255, 255, 255, 0.06)',
                borderRadius: '10px',
                padding: '12px 14px',
                textAlign: 'center'
              }}
            >
              <div style={{ fontSize: '0.78rem', color: '#94a3b8', marginBottom: '4px' }}>{group}</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#38bdf8' }}>{count}</div>
              <div style={{ fontSize: '0.72rem', color: '#64748b' }}>Bookings</div>
            </div>
          ))}
        </div>
      </div>

      {/* Interactive JavaScript Array Operations Showcase */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
          <Code2 size={20} color="#fb7185" />
          <h3 style={{ margin: 0, color: '#f8fafc', fontSize: '1.2rem', fontWeight: 700 }}>
            Live JavaScript Array Operations Engine
          </h3>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {operations.map((op, index) => (
            <div
              key={index}
              style={{
                background: '#1e293b',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '16px',
                padding: '1.5rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '14px'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span
                    style={{
                      background: 'rgba(225, 29, 72, 0.2)',
                      border: '1px solid rgba(225, 29, 72, 0.4)',
                      color: '#fb7185',
                      fontWeight: 800,
                      fontSize: '0.8rem',
                      fontFamily: 'monospace',
                      padding: '4px 10px',
                      borderRadius: '8px'
                    }}
                  >
                    {op.method}
                  </span>
                  <h4 style={{ margin: 0, color: '#f8fafc', fontSize: '1.05rem', fontWeight: 700 }}>
                    {op.name}
                  </h4>
                </div>
                <div style={{ fontSize: '0.78rem', color: '#10b981', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <CheckCircle2 size={14} />
                  <span>{op.summary}</span>
                </div>
              </div>

              <p style={{ margin: 0, color: '#94a3b8', fontSize: '0.85rem' }}>
                {op.description}
              </p>

              {/* Code Snippet and Output comparison */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                  gap: '14px'
                }}
              >
                {/* Code block */}
                <div
                  style={{
                    background: '#0f172a',
                    border: '1px solid rgba(255, 255, 255, 0.06)',
                    borderRadius: '10px',
                    padding: '12px 16px',
                    fontFamily: "'Fira Code', monospace",
                    fontSize: '0.82rem',
                    color: '#e2e8f0',
                    lineHeight: 1.5,
                    overflowX: 'auto'
                  }}
                >
                  <div style={{ color: '#64748b', fontSize: '0.72rem', marginBottom: '4px', textTransform: 'uppercase' }}>
                    // Execution Expression:
                  </div>
                  <code>{op.code}</code>
                </div>

                {/* Live Output */}
                <div
                  style={{
                    background: '#0b1120',
                    border: '1px solid rgba(16, 185, 129, 0.2)',
                    borderRadius: '10px',
                    padding: '12px 16px',
                    fontFamily: "'Fira Code', monospace",
                    fontSize: '0.8rem',
                    color: '#34d399',
                    lineHeight: 1.5,
                    overflowX: 'auto',
                    maxHeight: '160px'
                  }}
                >
                  <div style={{ color: '#10b981', fontSize: '0.72rem', marginBottom: '4px', textTransform: 'uppercase' }}>
                    // Live Computed Result ({Array.isArray(op.result) ? `${op.result.length} items` : 'Object'}):
                  </div>
                  <pre style={{ margin: 0 }}>
                    {JSON.stringify(op.result, null, 2)}
                  </pre>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

