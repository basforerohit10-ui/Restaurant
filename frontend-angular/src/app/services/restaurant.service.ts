import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import {
  Table,
  Reservation,
  WaitlistEntry,
  GuestProfile,
  RestaurantMetrics,
  ToastNotification
} from '../models/restaurant.model';

@Injectable({
  providedIn: 'root'
})
export class RestaurantService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:5000/api';

  private tablesSubject = new BehaviorSubject<Table[]>([]);
  public tables$ = this.tablesSubject.asObservable();

  private reservationsSubject = new BehaviorSubject<Reservation[]>([]);
  public reservations$ = this.reservationsSubject.asObservable();

  private waitlistSubject = new BehaviorSubject<WaitlistEntry[]>([]);
  public waitlist$ = this.waitlistSubject.asObservable();

  private guestsSubject = new BehaviorSubject<GuestProfile[]>([]);
  public guests$ = this.guestsSubject.asObservable();

  private toastsSubject = new BehaviorSubject<ToastNotification[]>([]);
  public toasts$ = this.toastsSubject.asObservable();

  private backendOnlineSubject = new BehaviorSubject<boolean>(false);
  public backendOnline$ = this.backendOnlineSubject.asObservable();

  constructor() {
    this.initData();
  }

  private initData(): void {
    // Check backend health
    this.http.get<{ status: string }>(`${this.apiUrl}/health`).pipe(
      catchError(() => of(null))
    ).subscribe(health => {
      if (health && health.status === 'online') {
        this.backendOnlineSubject.next(true);
        this.loadFromBackend();
      } else {
        this.backendOnlineSubject.next(false);
        this.loadLocalSeeds();
      }
    });
  }

  private loadFromBackend(): void {
    this.http.get<{ data: Table[] }>(`${this.apiUrl}/tables`).subscribe(res => {
      if (res && res.data) this.tablesSubject.next(res.data);
    });

    this.http.get<{ data: Reservation[] }>(`${this.apiUrl}/reservations`).subscribe(res => {
      if (res && res.data) this.reservationsSubject.next(res.data);
    });

    this.http.get<{ data: WaitlistEntry[] }>(`${this.apiUrl}/waitlist`).subscribe(res => {
      if (res && res.data) this.waitlistSubject.next(res.data);
    });

    this.loadSeedGuests();
  }

  private loadLocalSeeds(): void {
    const seedTables: Table[] = [
      { id: 'T-101', number: '101', section: 'main', capacity: 2, shape: 'round', status: 'occupied', currentReservationId: 'RES-001' },
      { id: 'T-102', number: '102', section: 'main', capacity: 2, shape: 'round', status: 'available', currentReservationId: null },
      { id: 'T-103', number: '103', section: 'main', capacity: 4, shape: 'square', status: 'reserved', currentReservationId: 'RES-002' },
      { id: 'T-104', number: '104', section: 'main', capacity: 4, shape: 'square', status: 'available', currentReservationId: null },
      { id: 'T-105', number: '105', section: 'main', capacity: 6, shape: 'rectangle', status: 'occupied', currentReservationId: 'RES-003' },
      { id: 'T-106', number: '106', section: 'main', capacity: 6, shape: 'rectangle', status: 'available', currentReservationId: null },
      { id: 'T-201', number: '201', section: 'patio', capacity: 2, shape: 'round', status: 'available', currentReservationId: null },
      { id: 'T-202', number: '202', section: 'patio', capacity: 4, shape: 'square', status: 'available', currentReservationId: null },
      { id: 'T-301', number: '301', section: 'rooftop', capacity: 4, shape: 'square', status: 'available', currentReservationId: null },
      { id: 'T-401', number: '401', section: 'vip', capacity: 8, shape: 'rectangle', status: 'available', currentReservationId: null }
    ];

    const seedReservations: Reservation[] = [
      {
        id: 'RES-001',
        guestName: 'Eleanor Vance',
        phone: '+1 (555) 234-8921',
        partySize: 2,
        tableId: 'T-101',
        date: new Date().toISOString().split('T')[0],
        time: '18:30',
        status: 'seated',
        occasion: 'Anniversary'
      },
      {
        id: 'RES-002',
        guestName: 'Marcus Sterling',
        phone: '+1 (555) 876-1209',
        partySize: 4,
        tableId: 'T-103',
        date: new Date().toISOString().split('T')[0],
        time: '19:00',
        status: 'confirmed',
        occasion: 'Business'
      },
      {
        id: 'RES-003',
        guestName: 'Sophia Loren Chen',
        phone: '+1 (555) 432-9801',
        partySize: 6,
        tableId: 'T-105',
        date: new Date().toISOString().split('T')[0],
        time: '18:00',
        status: 'seated',
        occasion: 'Birthday'
      }
    ];

    const seedWaitlist: WaitlistEntry[] = [
      {
        id: 'WAIT-01',
        guestName: 'Dominic & Sarah Toretto',
        phone: '+1 (555) 443-8899',
        partySize: 2,
        sectionPreference: 'patio',
        quotedWaitMinutes: 15,
        addedAt: '18:10',
        status: 'waiting'
      }
    ];

    this.tablesSubject.next(seedTables);
    this.reservationsSubject.next(seedReservations);
    this.waitlistSubject.next(seedWaitlist);
    this.loadSeedGuests();
  }

  private loadSeedGuests(): void {
    const seedGuests: GuestProfile[] = [
      {
        id: 'GUEST-01',
        name: 'Eleanor Vance',
        phone: '+1 (555) 234-8921',
        email: 'eleanor.vance@auramail.com',
        vipStatus: true,
        totalVisits: 14,
        totalSpent: 2850,
        preferredSection: 'main',
        dietaryRestrictions: ['Vegetarian', 'Gluten-Free'],
        notes: 'Loves corner booth by the window. Preferred sparkling water.',
        lastVisit: '2026-11-10'
      },
      {
        id: 'GUEST-02',
        name: 'Marcus Sterling',
        phone: '+1 (555) 876-1209',
        email: 'm.sterling@sterlingcap.com',
        vipStatus: true,
        totalVisits: 22,
        totalSpent: 6420,
        preferredSection: 'vip',
        dietaryRestrictions: ['Nut Allergy'],
        notes: 'Corporate entertaining. Always request sommelier service.',
        lastVisit: '2026-11-04'
      },
      {
        id: 'GUEST-03',
        name: 'Sophia Loren Chen',
        phone: '+1 (555) 432-9801',
        email: 'sophia.chen@arts.org',
        vipStatus: false,
        totalVisits: 6,
        totalSpent: 980,
        preferredSection: 'patio',
        dietaryRestrictions: ['Shellfish'],
        notes: 'Enjoys outdoor sunset dining.',
        lastVisit: '2026-10-28'
      },
      {
        id: 'GUEST-04',
        name: 'David & Rachel Ross',
        phone: '+1 (555) 312-7744',
        email: 'ross.family@gmail.com',
        vipStatus: false,
        totalVisits: 3,
        totalSpent: 420,
        preferredSection: 'main',
        dietaryRestrictions: ['Halal'],
        notes: 'Family dining with children.',
        lastVisit: '2026-10-15'
      }
    ];
    this.guestsSubject.next(seedGuests);
  }

  // Reactive metrics computation using Array reduce and filter
  getMetrics(): RestaurantMetrics {
    const tables = this.tablesSubject.value;
    const reservations = this.reservationsSubject.value;
    const waitlist = this.waitlistSubject.value;

    const totalTables = tables.length;
    const availableTables = tables.filter(t => t.status === 'available').length;
    const occupiedTables = tables.filter(t => t.status === 'occupied').length;
    const reservedTables = tables.filter(t => t.status === 'reserved').length;
    const maintenanceTables = tables.filter(t => t.status === 'maintenance').length;

    const occupancyRate = totalTables > 0 ? Math.round(((occupiedTables + reservedTables) / totalTables) * 100) : 0;
    const seatedReservations = reservations.filter(r => r.status === 'seated');
    const totalSeatedGuests = seatedReservations.reduce((sum, r) => sum + Number(r.partySize || 0), 0);
    const totalExpectedGuests = reservations
      .filter(r => r.status !== 'cancelled')
      .reduce((sum, r) => sum + Number(r.partySize || 0), 0);

    return {
      totalTables,
      availableTables,
      occupiedTables,
      reservedTables,
      maintenanceTables,
      occupancyRate,
      totalReservations: reservations.length,
      seatedCount: seatedReservations.length,
      totalSeatedGuests,
      totalExpectedGuests,
      activeWaitlistCount: waitlist.filter(w => w.status === 'waiting').length
    };
  }

  // Toast System
  showToast(message: string, type: 'success' | 'info' | 'warning' | 'error' = 'info'): void {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
    const current = this.toastsSubject.value;
    this.toastsSubject.next([...current, { id, message, type }]);

    this.playAudioFeedback(type);

    setTimeout(() => {
      this.removeToast(id);
    }, 4000);
  }

  removeToast(id: string): void {
    this.toastsSubject.next(this.toastsSubject.value.filter(t => t.id !== id));
  }

  // Audio Synthesizer Chime
  private playAudioFeedback(type: string): void {
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.connect(gain);
      gain.connect(ctx.destination);

      const now = ctx.currentTime;
      if (type === 'success') {
        osc.frequency.setValueAtTime(587.33, now); // D5
        osc.frequency.exponentialRampToValueAtTime(880, now + 0.15); // A5
      } else {
        osc.frequency.setValueAtTime(440, now); // A4
        osc.frequency.exponentialRampToValueAtTime(659.25, now + 0.12); // E5
      }

      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

      osc.start(now);
      osc.stop(now + 0.25);
    } catch {
      // AudioContext muted/blocked by browser gesture policy, ignore silently
    }
  }

  // Actions
  addReservation(data: Omit<Reservation, 'id'>): void {
    const newId = `RES-${String(Date.now()).slice(-4)}`;
    const newRes: Reservation = { ...data, id: newId };

    const currentReservations = [newRes, ...this.reservationsSubject.value];
    this.reservationsSubject.next(currentReservations);

    if (newRes.tableId) {
      this.updateTableStatus(newRes.tableId, newRes.status === 'seated' ? 'occupied' : 'reserved', newId);
    }

    this.showToast(`Booking ${newId} confirmed for ${newRes.guestName}!`, 'success');

    if (this.backendOnlineSubject.value) {
      this.http.post(`${this.apiUrl}/reservations`, newRes).subscribe();
    }
  }

  seatReservation(id: string, tableId: string): void {
    const reservations = this.reservationsSubject.value.map(r =>
      r.id === id ? { ...r, status: 'seated' as const, tableId } : r
    );
    this.reservationsSubject.next(reservations);
    this.updateTableStatus(tableId, 'occupied', id);

    const target = reservations.find(r => r.id === id);
    this.showToast(`Seated ${target?.guestName || 'Guest'} at Table ${tableId}`, 'success');

    if (this.backendOnlineSubject.value) {
      this.http.put(`${this.apiUrl}/reservations/${id}/seat`, { tableId }).subscribe();
    }
  }

  completeReservation(id: string): void {
    const target = this.reservationsSubject.value.find(r => r.id === id);
    if (!target) return;

    const reservations = this.reservationsSubject.value.map(r =>
      r.id === id ? { ...r, status: 'completed' as const } : r
    );
    this.reservationsSubject.next(reservations);

    if (target.tableId) {
      this.updateTableStatus(target.tableId, 'available', null);
    }

    this.showToast(`Meal completed for ${target.guestName}. Table ${target.tableId} is now free!`, 'info');

    if (this.backendOnlineSubject.value) {
      this.http.put(`${this.apiUrl}/reservations/${id}/complete`, {}).subscribe();
    }
  }

  cancelReservation(id: string): void {
    const target = this.reservationsSubject.value.find(r => r.id === id);
    if (!target) return;

    const reservations = this.reservationsSubject.value.map(r =>
      r.id === id ? { ...r, status: 'cancelled' as const } : r
    );
    this.reservationsSubject.next(reservations);

    if (target.tableId) {
      this.updateTableStatus(target.tableId, 'available', null);
    }

    this.showToast(`Reservation ${id} cancelled.`, 'warning');

    if (this.backendOnlineSubject.value) {
      this.http.put(`${this.apiUrl}/reservations/${id}/cancel`, {}).subscribe();
    }
  }

  updateTableStatus(
    tableId: string,
    status: 'available' | 'occupied' | 'reserved' | 'maintenance',
    reservationId?: string | null
  ): void {
    const tables = this.tablesSubject.value.map(t =>
      t.id === tableId || t.number === tableId
        ? {
            ...t,
            status,
            currentReservationId: status === 'available' ? null : (reservationId !== undefined ? reservationId : t.currentReservationId)
          }
        : t
    );
    this.tablesSubject.next(tables);

    if (this.backendOnlineSubject.value) {
      this.http.patch(`${this.apiUrl}/tables/${tableId}/status`, { status, reservationId }).subscribe();
    }
  }

  addWaitlist(entry: Omit<WaitlistEntry, 'id' | 'status' | 'addedAt'>): void {
    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    const newId = `WAIT-${String(Date.now()).slice(-4)}`;
    const newEntry: WaitlistEntry = {
      ...entry,
      id: newId,
      status: 'waiting',
      addedAt: timeStr
    };

    this.waitlistSubject.next([...this.waitlistSubject.value, newEntry]);
    this.showToast(`Added ${newEntry.guestName} to waitlist (#${this.waitlistSubject.value.length})`, 'info');

    if (this.backendOnlineSubject.value) {
      this.http.post(`${this.apiUrl}/waitlist`, newEntry).subscribe();
    }
  }

  seatWaitlist(id: string): void {
    const target = this.waitlistSubject.value.find(w => w.id === id);
    if (!target) return;

    // Find first available table that accommodates party
    const openTable = this.tablesSubject.value.find(
      t => t.status === 'available' && t.capacity >= target.partySize
    );

    if (openTable) {
      this.updateTableStatus(openTable.id, 'occupied', `WL-${target.id}`);
      this.waitlistSubject.next(this.waitlistSubject.value.filter(w => w.id !== id));
      this.showToast(`Walk-in seated: ${target.guestName} at Table ${openTable.number}`, 'success');

      if (this.backendOnlineSubject.value) {
        this.http.put(`${this.apiUrl}/waitlist/${id}/seat`, { tableId: openTable.id }).subscribe();
      }
    } else {
      this.showToast(`No available table with capacity >= ${target.partySize} at the moment.`, 'warning');
    }
  }

  // CSV Run Sheet Exporter
  exportReservationsCSV(): void {
    const list = this.reservationsSubject.value;
    const headers = ['Reservation ID', 'Guest Name', 'Phone', 'Date', 'Time', 'Party Size', 'Table', 'Status', 'Occasion', 'Special Requests'];
    const rows = list.map(r => [
      r.id,
      `"${r.guestName.replace(/"/g, '""')}"`,
      `"${r.phone || ''}"`,
      r.date,
      r.time,
      r.partySize,
      r.tableId || 'Unassigned',
      r.status,
      `"${r.occasion || 'General'}"`,
      `"${(r.specialRequests || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `foodcourt_reservations_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    this.showToast('Reservation Run Sheet downloaded as CSV!', 'success');
  }

  resetDemo(): void {
    if (this.backendOnlineSubject.value) {
      this.http.post(`${this.apiUrl}/reset`, {}).subscribe(() => {
        this.loadFromBackend();
        this.showToast('System data reset to initial demo seeds', 'info');
      });
    } else {
      this.loadLocalSeeds();
      this.showToast('Local demo seeds reloaded', 'info');
    }
  }

  resetData(): void {
    this.resetDemo();
  }

  addToWaitlist(entry: Omit<WaitlistEntry, 'id' | 'status' | 'addedAt'>): void {
    this.addWaitlist(entry);
  }

  seatWaitlistGuest(id: string, tableId?: string): void {
    this.seatWaitlist(id);
  }
}
