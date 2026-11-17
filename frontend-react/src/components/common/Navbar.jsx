import React, { useState, useEffect } from 'react';
import { UtensilsCrossed, Clock, Plus, RotateCcw, Flame, Server, Volume2, VolumeX } from 'lucide-react';
import { useRestaurant } from '../../hooks/useRestaurant';
import { soundManager } from '../../utils/audio';

export default function Navbar({ onOpenNewReservation, onToggleSidebar }) {
  const { metrics, resetToDemoData, backendOnline } = useRestaurant();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Real-time clock update with useEffect
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleToggleSound = () => {
    const newState = soundManager.toggle();
    setSoundEnabled(newState);
  };

  const formattedTime = currentTime.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });

  const formattedDate = currentTime.toLocaleDateString([], {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <header
      style={{
        height: '70px',
        backgroundColor: '#0f172a',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 1.5rem',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        backdropFilter: 'blur(10px)'
      }}
    >
      {/* Brand & Left Controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        <button
          className="mobile-menu-btn"
          onClick={onToggleSidebar}
          style={{
            display: 'none',
            background: 'transparent',
            border: 'none',
            color: '#94a3b8',
            cursor: 'pointer',
            padding: '6px'
          }}
          aria-label="Toggle navigation menu"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #e11d48, #be123c)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              boxShadow: '0 4px 12px rgba(225, 29, 72, 0.35)'
            }}
          >
            <UtensilsCrossed size={20} />
          </div>
          <div>
            <h1
              style={{
                margin: 0,
                fontSize: '1.25rem',
                fontWeight: 800,
                color: '#f8fafc',
                letterSpacing: '-0.02em',
                fontFamily: "'Playfair Display', Georgia, serif"
              }}
            >
              Aura<span style={{ color: '#fb7185' }}>Bistro</span>
            </h1>
            <span style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 500, letterSpacing: '0.04em' }}>
              TABLE &amp; RESERVATION SYSTEM
            </span>
          </div>
        </div>

        {/* Backend API Connection Pill */}
        <div
          title={backendOnline ? 'Express REST Backend is running on port 5000' : 'Offline Mode (Local State Active)'}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '4px 10px',
            borderRadius: '9999px',
            backgroundColor: backendOnline ? 'rgba(16, 185, 129, 0.12)' : 'rgba(245, 158, 11, 0.12)',
            border: `1px solid ${backendOnline ? 'rgba(16, 185, 129, 0.3)' : 'rgba(245, 158, 11, 0.3)'}`,
            color: backendOnline ? '#10b981' : '#f59e0b',
            fontSize: '0.75rem',
            fontWeight: 600
          }}
        >
          <span
            style={{
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              backgroundColor: backendOnline ? '#10b981' : '#f59e0b'
            }}
          />
          <Server size={12} />
          <span>{backendOnline ? 'API: Port 5000' : 'Local Mode'}</span>
        </div>
      </div>

      {/* Center Live Clock & Floor Utilization */}
      <div
        className="nav-center-metrics"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '20px',
          background: 'rgba(30, 41, 59, 0.5)',
          padding: '6px 16px',
          borderRadius: '9999px',
          border: '1px solid rgba(255, 255, 255, 0.06)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#cbd5e1', fontSize: '0.85rem' }}>
          <Clock size={16} color="#94a3b8" />
          <span style={{ fontWeight: 600, color: '#f8fafc' }}>{formattedTime}</span>
          <span style={{ color: '#64748b' }}>•</span>
          <span>{formattedDate}</span>
        </div>

        <div style={{ width: '1px', height: '16px', backgroundColor: 'rgba(255, 255, 255, 0.1)' }} />

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem' }}>
          <Flame size={16} color="#f59e0b" />
          <span style={{ color: '#94a3b8' }}>Occupancy:</span>
          <span
            style={{
              fontWeight: 700,
              color: metrics.occupancyRate > 75 ? '#ef4444' : metrics.occupancyRate > 50 ? '#f59e0b' : '#10b981'
            }}
          >
            {metrics.occupancyRate}%
          </span>
          <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
            ({metrics.occupiedTables + metrics.reservedTables}/{metrics.totalTables} tables)
          </span>
        </div>
      </div>

      {/* Right Controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <button
          onClick={handleToggleSound}
          title={soundEnabled ? 'Mute synthesized sound effects' : 'Unmute sound effects'}
          style={{
            background: 'rgba(30, 41, 59, 0.8)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            color: soundEnabled ? '#cbd5e1' : '#64748b',
            borderRadius: '10px',
            padding: '8px 10px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.15s ease'
          }}
        >
          {soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
        </button>

        <button
          onClick={resetToDemoData}
          title="Reset to initial demonstration dataset"
          style={{
            background: 'rgba(30, 41, 59, 0.8)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            color: '#94a3b8',
            borderRadius: '10px',
            padding: '8px 12px',
            fontSize: '0.82rem',
            fontWeight: 600,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            transition: 'all 0.15s ease'
          }}
        >
          <RotateCcw size={14} />
          <span className="reset-label">Reset Data</span>
        </button>

        <button
          onClick={onOpenNewReservation}
          style={{
            background: 'linear-gradient(135deg, #e11d48, #be123c)',
            border: 'none',
            color: '#ffffff',
            borderRadius: '10px',
            padding: '9px 16px',
            fontSize: '0.88rem',
            fontWeight: 600,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: '0 4px 14px rgba(225, 29, 72, 0.35)',
            transition: 'transform 0.15s ease, box-shadow 0.15s ease'
          }}
        >
          <Plus size={18} />
          <span>New Reservation</span>
        </button>
      </div>
    </header>
  );
}
