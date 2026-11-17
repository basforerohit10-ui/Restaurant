import React from 'react';
import SearchBar from '../common/SearchBar';
import { Calendar, LayoutList, LayoutGrid } from 'lucide-react';

export default function ReservationFilters({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusChange,
  dateFilter,
  onDateChange,
  viewMode,
  onToggleViewMode
}) {
  const statuses = [
    { id: 'all', label: 'All' },
    { id: 'confirmed', label: 'Confirmed' },
    { id: 'seated', label: 'Seated' },
    { id: 'pending', label: 'Pending' },
    { id: 'completed', label: 'Completed' },
    { id: 'cancelled', label: 'Cancelled' }
  ];

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '14px',
        background: '#1e293b',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: '16px',
        padding: '1.25rem'
      }}
    >
      {/* Top Search & Controls Row */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px'
        }}
      >
        <SearchBar
          value={searchQuery}
          onChange={onSearchChange}
          placeholder="Search by guest name, phone, or reservation ID..."
        />

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {/* Date Picker Input */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: '#0f172a',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '10px',
              padding: '6px 12px'
            }}
          >
            <Calendar size={16} color="#94a3b8" />
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => onDateChange(e.target.value)}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#f8fafc',
                fontSize: '0.85rem',
                outline: 'none',
                cursor: 'pointer'
              }}
            />
            {dateFilter && (
              <button
                type="button"
                onClick={() => onDateChange('')}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#64748b',
                  cursor: 'pointer',
                  fontSize: '0.75rem',
                  padding: '2px 4px'
                }}
              >
                Clear
              </button>
            )}
          </div>

          {/* View toggle (Grid Cards vs Dense Table List) */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              backgroundColor: '#0f172a',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '10px',
              padding: '3px'
            }}
          >
            <button
              type="button"
              onClick={() => onToggleViewMode('grid')}
              style={{
                padding: '6px 10px',
                borderRadius: '8px',
                border: 'none',
                background: viewMode === 'grid' ? '#e11d48' : 'transparent',
                color: viewMode === 'grid' ? '#ffffff' : '#94a3b8',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center'
              }}
              title="Card view"
            >
              <LayoutGrid size={16} />
            </button>
            <button
              type="button"
              onClick={() => onToggleViewMode('list')}
              style={{
                padding: '6px 10px',
                borderRadius: '8px',
                border: 'none',
                background: viewMode === 'list' ? '#e11d48' : 'transparent',
                color: viewMode === 'list' ? '#ffffff' : '#94a3b8',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center'
              }}
              title="List table view"
            >
              <LayoutList size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Status Pills */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          flexWrap: 'wrap',
          paddingTop: '8px',
          borderTop: '1px solid rgba(255, 255, 255, 0.06)'
        }}
      >
        <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#64748b', marginRight: '4px' }}>
          Status:
        </span>
        {statuses.map(s => {
          const isActive = statusFilter === s.id;
          return (
            <button
              key={s.id}
              type="button"
              onClick={() => onStatusChange(s.id)}
              style={{
                padding: '5px 12px',
                borderRadius: '8px',
                border: isActive ? '1px solid #e11d48' : '1px solid rgba(255, 255, 255, 0.08)',
                background: isActive ? 'rgba(225, 29, 72, 0.2)' : 'rgba(15, 23, 42, 0.6)',
                color: isActive ? '#f8fafc' : '#94a3b8',
                fontSize: '0.82rem',
                fontWeight: isActive ? 600 : 500,
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              {s.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

