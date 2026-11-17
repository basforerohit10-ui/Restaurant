import React from 'react';
import { Search, X } from 'lucide-react';

/**
 * Reusable SearchBar Component
 * Demonstrates:
 * - Controlled input with onChange synthetic event handler
 * - Clear button conditional rendering
 */
export default function SearchBar({
  value,
  onChange,
  onClear,
  placeholder = 'Search reservations, guests, phone...',
  className = ''
}) {
  return (
    <div
      className={`search-bar-container ${className}`}
      style={{
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        flex: 1,
        minWidth: '240px'
      }}
    >
      <Search
        size={18}
        style={{
          position: 'absolute',
          left: '14px',
          color: '#64748b',
          pointerEvents: 'none'
        }}
      />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        style={{
          width: '100%',
          padding: '10px 38px 10px 42px',
          backgroundColor: '#0f172a',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '10px',
          color: '#f8fafc',
          fontSize: '0.9rem',
          outline: 'none',
          transition: 'all 0.2s ease'
        }}
      />
      {value && (
        <button
          type="button"
          onClick={() => {
            if (onClear) onClear();
            else onChange('');
          }}
          style={{
            position: 'absolute',
            right: '12px',
            background: 'none',
            border: 'none',
            color: '#64748b',
            cursor: 'pointer',
            padding: '2px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '50%'
          }}
          aria-label="Clear search"
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
}

