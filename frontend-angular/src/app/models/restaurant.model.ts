export interface Table {
  id: string;
  number: string;
  section: string;
  capacity: number;
  shape: 'round' | 'square' | 'rectangle';
  status: 'available' | 'occupied' | 'reserved' | 'maintenance';
  currentReservationId?: string | null;
  x?: number;
  y?: number;
}

export interface Reservation {
  id: string;
  guestName: string;
  phone: string;
  email?: string;
  partySize: number;
  tableId?: string | null;
  date: string;
  time: string;
  status: 'confirmed' | 'seated' | 'pending' | 'completed' | 'cancelled';
  occasion?: string;
  specialRequests?: string;
  source?: string;
  createdAt?: string;
}

export interface WaitlistEntry {
  id: string;
  guestName: string;
  phone: string;
  partySize: number;
  sectionPreference: string;
  quotedWaitMinutes: number;
  addedAt: string;
  status: 'waiting' | 'notified' | 'seated' | 'cancelled';
  notes?: string;
}

export interface GuestProfile {
  id: string;
  name: string;
  phone: string;
  email: string;
  vipStatus: boolean;
  totalVisits: number;
  totalSpent: number;
  preferredSection: string;
  dietaryRestrictions: string[];
  notes?: string;
  lastVisit: string;
}

export interface RestaurantMetrics {
  totalTables: number;
  availableTables: number;
  occupiedTables: number;
  reservedTables: number;
  maintenanceTables: number;
  occupancyRate: number;
  totalReservations: number;
  seatedCount: number;
  totalSeatedGuests: number;
  totalExpectedGuests: number;
  activeWaitlistCount: number;
}

export interface ToastNotification {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  message: string;
}
