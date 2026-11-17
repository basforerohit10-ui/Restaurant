import React from 'react';

/**
 * Reusable Metric/Stats Card Component
 * Demonstrates:
 * - Functional component with icon rendering as component prop
 * - Dynamic inline CSS styling combined with utility classes
 */
export default function StatsCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  trendType = 'positive', // 'positive' | 'negative' | 'neutral'
  color = '#e11d48'
}) {
  return (
    <div
      className="stats-card"
      style={{
        background: '#1e293b',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: '16px',
        padding: '1.25rem 1.5rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: '0 4px 20px -2px rgba(0, 0, 0, 0.25)',
        transition: 'transform 0.2s ease, border-color 0.2s ease'
      }}
    >
      {/* Top subtle colored accent line */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '3px',
          background: `linear-gradient(90deg, ${color}, transparent)`
        }}
      />

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ color: '#94a3b8', fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          {title}
        </span>
        {Icon && (
          <div
            style={{
              padding: '10px',
              borderRadius: '12px',
              backgroundColor: `${color}18`,
              color: color,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Icon size={20} />
          </div>
        )}
      </div>

      <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px' }}>
        <h3 style={{ margin: 0, fontSize: '1.85rem', fontWeight: 800, color: '#f8fafc', letterSpacing: '-0.02em' }}>
          {value}
        </h3>
        {trend && (
          <span
            style={{
              fontSize: '0.78rem',
              fontWeight: 600,
              padding: '2px 8px',
              borderRadius: '9999px',
              backgroundColor:
                trendType === 'positive'
                  ? 'rgba(16, 185, 129, 0.15)'
                  : trendType === 'negative'
                  ? 'rgba(239, 68, 68, 0.15)'
                  : 'rgba(148, 163, 184, 0.15)',
              color:
                trendType === 'positive'
                  ? '#10b981'
                  : trendType === 'negative'
                  ? '#ef4444'
                  : '#94a3b8'
            }}
          >
            {trend}
          </span>
        )}
      </div>

      {subtitle && (
        <p style={{ margin: 0, fontSize: '0.82rem', color: '#64748b' }}>
          {subtitle}
        </p>
      )}
    </div>
  );
}

