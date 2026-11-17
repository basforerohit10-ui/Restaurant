import React from 'react';
import styles from './Badge.module.css';

/**
 * Reusable Badge Component
 * Demonstrates:
 * - Functional component with props destructuring & default values
 * - CSS Modules styling technique (styles[variant])
 * - Conditional CSS classes and dynamic inline dot styling
 */
export default function Badge({
  status = 'available',
  label,
  showDot = true,
  pulse = false,
  className = ''
}) {
  const normalizedStatus = status.toLowerCase();
  const variantClass = styles[normalizedStatus] || styles.available;
  const pulseClass = pulse ? styles.pulse : '';
  const displayLabel = label || status;

  return (
    <span className={`${styles.badge} ${variantClass} ${className}`}>
      {showDot && (
        <span
          className={`${styles.dot} ${pulseClass}`}
          aria-hidden="true"
        />
      )}
      <span>{displayLabel}</span>
    </span>
  );
}

