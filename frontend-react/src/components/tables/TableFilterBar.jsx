import React from 'react';
import { LayoutGrid, Map, Filter, Clock } from 'lucide-react';
import { INITIAL_SECTIONS } from '../../data/initialData';

export default function TableFilterBar({
  selectedSection,
  onSelectSection,
  selectedStatus,
  onSelectStatus,
  selectedCapacity,
  onSelectCapacity,
  viewMode,
  onToggleViewMode
}) {
  const statuses = [
    { id: 'all', label: 'All Statuses' },
    { id: 'available', label: 'Available' },
    { id: 'reserved', label: 'Reserved' },
    { id: 'occupied', label: 'Occupied' },
    { id: 'maintenance', label: 'Maintenance' }
  ];

  const capacities = [
    { id: 'all', label: 'Any Size' },
    { id: '2', label: '2 Guests' },
    { id: '4', label: '4 Guests' },
    { id: '6', label: '6 Guests' },
    { id: '8', label: '8+ Guests' }
  ];

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        background: '#1e293b',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: '16px',
        padding: '1rem 1.25rem'
      }}
    >
      {/* Top Row: Section Pills and View Switcher */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px'
        }}
      >
        {/* Section Tabs */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          {INITIAL_SECTIONS.map((sec) => {
            const isActive = selectedSection === sec.id;
            return (
              <button
                key={sec.id}
                type="button"
                onClick={() => onSelectSection(sec.id)}
                style={{
                  padding: '7px 14px',
                  borderRadius: '10px',
                  border: isActive ? '1px solid #e11d48' : '1px solid rgba(255, 255, 255, 0.08)',
                  background: isActive ? 'rgba(225, 29, 72, 0.2)' : 'rgba(15, 23, 42, 0.6)',
                  color: isActive ? '#f8fafc' : '#94a3b8',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                {sec.name}
              </button>
            );
          })}
        </div>

        {/* View Mode Switcher: Grid vs Interactive Floor Plan vs Timeline */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            background: 'rgba(15, 23, 42, 0.8)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '10px',
            padding: '3px'
          }}
        >
          <button
            type="button"
            onClick={() => onToggleViewMode('grid')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 12px',
              borderRadius: '8px',
              border: 'none',
              background: viewMode === 'grid' ? '#e11d48' : 'transparent',
              color: viewMode === 'grid' ? '#ffffff' : '#94a3b8',
              fontSize: '0.82rem',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
          >
            <LayoutGrid size={15} />
            <span>Grid Cards</span>
          </button>

          <button
            type="button"
            onClick={() => onToggleViewMode('floorplan')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 12px',
              borderRadius: '8px',
              border: 'none',
              background: viewMode === 'floorplan' ? '#e11d48' : 'transparent',
              color: viewMode === 'floorplan' ? '#ffffff' : '#94a3b8',
              fontSize: '0.82rem',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
          >
            <Map size={15} />
            <span>2D Floor Plan</span>
          </button>

          <button
            type="button"
            onClick={() => onToggleViewMode('timeline')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 12px',
              borderRadius: '8px',
              border: 'none',
              background: viewMode === 'timeline' ? '#e11d48' : 'transparent',
              color: viewMode === 'timeline' ? '#ffffff' : '#94a3b8',
              fontSize: '0.82rem',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
          >
            <Clock size={15} />
            <span>Hourly Matrix</span>
          </button>
        </div>
      </div>

      {/* Bottom Sub-filters: Status and Capacity */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          flexWrap: 'wrap',
          paddingTop: '8px',
          borderTop: '1px solid rgba(255, 255, 255, 0.06)',
          fontSize: '0.85rem'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Filter size={14} color="#64748b" />
          <span style={{ color: '#94a3b8', fontSize: '0.8rem', fontWeight: 600 }}>Status:</span>
          <select
            value={selectedStatus}
            onChange={(e) => onSelectStatus(e.target.value)}
            style={{
              background: '#0f172a',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '8px',
              color: '#f8fafc',
              padding: '6px 10px',
              fontSize: '0.82rem',
              outline: 'none',
              cursor: 'pointer'
            }}
          >
            {statuses.map(s => (
              <option key={s.id} value={s.id}>{s.label}</option>
            ))}
          </select>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ color: '#94a3b8', fontSize: '0.8rem', fontWeight: 600 }}>Min Capacity:</span>
          <select
            value={selectedCapacity}
            onChange={(e) => onSelectCapacity(e.target.value)}
            style={{
              background: '#0f172a',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '8px',
              color: '#f8fafc',
              padding: '6px 10px',
              fontSize: '0.82rem',
              outline: 'none',
              cursor: 'pointer'
            }}
          >
            {capacities.map(c => (
              <option key={c.id} value={c.id}>{c.label}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
