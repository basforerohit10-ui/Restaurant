import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Grid3X3,
  CalendarDays,
  UsersRound,
  BarChart3,
  Code2,
  Sparkles,
  Info,
  UserCheck
} from 'lucide-react';
import { useRestaurant } from '../../hooks/useRestaurant';

export default function Sidebar({ isOpen, onCloseMobile }) {
  const { metrics } = useRestaurant();

  const navLinks = [
    {
      to: '/',
      label: 'Dashboard',
      icon: LayoutDashboard,
      badge: null
    },
    {
      to: '/tables',
      label: 'Table Layout',
      icon: Grid3X3,
      badge: `${metrics.availableTables} open`
    },
    {
      to: '/reservations',
      label: 'Reservations',
      icon: CalendarDays,
      badge: metrics.totalReservations
    },
    {
      to: '/waitlist',
      label: 'Walk-In Waitlist',
      icon: UsersRound,
      badge: metrics.activeWaitlistCount > 0 ? metrics.activeWaitlistCount : null
    },
    {
      to: '/guests',
      label: 'Guest Directory',
      icon: UserCheck,
      badge: 'VIP CRM'
    },
    {
      to: '/analytics',
      label: 'Analytics & JS Lab',
      icon: BarChart3,
      badge: 'Array Ops'
    },
    {
      to: '/converter',
      label: 'HTML to JSX Studio',
      icon: Code2,
      badge: 'React Guide'
    }
  ];

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          onClick={onCloseMobile}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.6)',
            zIndex: 90,
            display: 'block'
          }}
        />
      )}

      <aside
        className={`app-sidebar ${isOpen ? 'open' : ''}`}
        style={{
          width: '260px',
          backgroundColor: '#0f172a',
          borderRight: '1px solid rgba(255, 255, 255, 0.08)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '1.25rem 0.85rem',
          flexShrink: 0
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <div
            style={{
              padding: '0 0.75rem 0.5rem',
              fontSize: '0.72rem',
              fontWeight: 700,
              color: '#64748b',
              textTransform: 'uppercase',
              letterSpacing: '0.08em'
            }}
          >
            Management Navigation
          </div>

          <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {navLinks.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === '/'}
                  onClick={onCloseMobile}
                  className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
                  style={({ isActive }) => ({
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px 14px',
                    borderRadius: '10px',
                    color: isActive ? '#f8fafc' : '#94a3b8',
                    backgroundColor: isActive ? 'rgba(225, 29, 72, 0.15)' : 'transparent',
                    border: isActive ? '1px solid rgba(225, 29, 72, 0.3)' : '1px solid transparent',
                    textDecoration: 'none',
                    fontSize: '0.9rem',
                    fontWeight: isActive ? 600 : 500,
                    transition: 'all 0.15s ease'
                  })}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <Icon size={18} />
                    <span>{item.label}</span>
                  </div>

                  {item.badge !== null && (
                    <span
                      style={{
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        padding: '2px 7px',
                        borderRadius: '9999px',
                        backgroundColor: 'rgba(255, 255, 255, 0.08)',
                        color: '#cbd5e1'
                      }}
                    >
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Bottom Feature Card */}
        <div
          style={{
            background: 'linear-gradient(180deg, rgba(30, 41, 59, 0.6) 0%, rgba(15, 23, 42, 0.8) 100%)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '12px',
            padding: '1rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#fb7185' }}>
            <Sparkles size={16} />
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#f8fafc' }}>
              Full-Stack Architecture
            </span>
          </div>
          <p style={{ margin: 0, fontSize: '0.75rem', color: '#94a3b8', lineHeight: 1.4 }}>
            Modular React 18 Frontend connected to Express REST API with persistent database storage.
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.72rem', color: '#64748b', marginTop: '2px' }}>
            <Info size={12} />
            <span>Port 3000 • Port 5000</span>
          </div>
        </div>
      </aside>
    </>
  );
}
