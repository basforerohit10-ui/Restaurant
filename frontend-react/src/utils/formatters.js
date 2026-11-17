// Utility formatters for Restaurant Management System

export function formatTime(timeStr) {
  if (!timeStr) return '';
  const [hours, minutes] = timeStr.split(':');
  const h = parseInt(hours, 10);
  const ampm = h >= 12 ? 'PM' : 'AM';
  const formattedHours = h % 12 || 12;
  return `${formattedHours}:${minutes} ${ampm}`;
}

export function formatDate(dateStr) {
  if (!dateStr) return '';
  const date = new Date(dateStr + 'T00:00:00');
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric'
  });
}

export function getStatusColor(status) {
  switch (status?.toLowerCase()) {
    case 'available':
      return {
        bg: 'rgba(16, 185, 129, 0.12)',
        color: '#10b981',
        border: 'rgba(16, 185, 129, 0.3)',
        dot: '#10b981',
        label: 'Available'
      };
    case 'occupied':
      return {
        bg: 'rgba(239, 68, 68, 0.12)',
        color: '#ef4444',
        border: 'rgba(239, 68, 68, 0.3)',
        dot: '#ef4444',
        label: 'Occupied'
      };
    case 'reserved':
      return {
        bg: 'rgba(245, 158, 11, 0.12)',
        color: '#f59e0b',
        border: 'rgba(245, 158, 11, 0.3)',
        dot: '#f59e0b',
        label: 'Reserved'
      };
    case 'maintenance':
    case 'blocked':
      return {
        bg: 'rgba(107, 114, 128, 0.12)',
        color: '#9ca3af',
        border: 'rgba(107, 114, 128, 0.3)',
        dot: '#6b7280',
        label: 'Maintenance'
      };
    case 'confirmed':
      return {
        bg: 'rgba(59, 130, 246, 0.12)',
        color: '#3b82f6',
        border: 'rgba(59, 130, 246, 0.3)',
        dot: '#3b82f6',
        label: 'Confirmed'
      };
    case 'seated':
      return {
        bg: 'rgba(16, 185, 129, 0.12)',
        color: '#10b981',
        border: 'rgba(16, 185, 129, 0.3)',
        dot: '#10b981',
        label: 'Seated'
      };
    case 'completed':
      return {
        bg: 'rgba(147, 51, 234, 0.12)',
        color: '#a855f7',
        border: 'rgba(147, 51, 234, 0.3)',
        dot: '#a855f7',
        label: 'Completed'
      };
    case 'cancelled':
      return {
        bg: 'rgba(239, 68, 68, 0.12)',
        color: '#ef4444',
        border: 'rgba(239, 68, 68, 0.3)',
        dot: '#ef4444',
        label: 'Cancelled'
      };
    case 'pending':
    default:
      return {
        bg: 'rgba(245, 158, 11, 0.12)',
        color: '#f59e0b',
        border: 'rgba(245, 158, 11, 0.3)',
        dot: '#f59e0b',
        label: 'Pending'
      };
  }
}

