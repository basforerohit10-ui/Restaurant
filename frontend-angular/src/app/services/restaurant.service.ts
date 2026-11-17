import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Table, Reservation, WaitlistEntry, RestaurantMetrics } from '../models/restaurant.model';

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

  // Actions
  addReservation(data: Omit<Reservation, 'id'>): void {
    const newId = `RES-${String(Date.now()).slice(-4)}`;
    const newRes: Reservation = { ...data, id: newId };

    const currentReservations = [newRes, ...this.reservationsSubject.value];
    this.reservationsSubject.next(currentReservations);

    if (newRes.tableId) {
      this.updateTableStatus(newRes.tableId, newRes.status === 'seated' ? 'occupied' : 'reserved', newId);
    }

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

    if (this.backendOnlineSubject.value) {
      this.http.delete(`${this.apiUrl}/reservations/${id}`).subscribe();
    }
  }

  updateTableStatus(tableId: string, status: Table['status'], resId: string | null = null): void {
    const tables = this.tablesSubject.value.map(t =>
      t.id === tableId ? { ...t, status, currentReservationId: resId } : t
    );
    this.tablesSubject.next(tables);

    if (this.backendOnlineSubject.value) {
      this.http.put(`${this.apiUrl}/tables/${tableId}/status`, { status, currentReservationId: resId }).subscribe();
    }
  }

  addToWaitlist(data: Omit<WaitlistEntry, 'id' | 'addedAt' | 'status'>): void {
    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    const newEntry: WaitlistEntry = {
      ...data,
      id: `WAIT-${String(Date.now()).slice(-3)}`,
      addedAt: timeStr,
      status: 'waiting'
    };

    this.waitlistSubject.next([...this.waitlistSubject.value, newEntry]);

    if (this.backendOnlineSubject.value) {
      this.http.post(`${this.apiUrl}/waitlist`, newEntry).subscribe();
    }
  }

  seatWaitlistGuest(waitlistId: string, tableId: string): void {
    const entry = this.waitlistSubject.value.find(w => w.id === waitlistId);
    if (!entry) return;

    this.waitlistSubject.next(this.waitlistSubject.value.filter(w => w.id !== waitlistId));

    this.addReservation({
      guestName: entry.guestName,
      phone: entry.phone,
      partySize: entry.partySize,
      tableId,
      date: new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'seated',
      occasion: 'Walk-In Dining',
      specialRequests: entry.notes
    });
  }

  resetData(): void {
    this.loadLocalSeeds();
    if (this.backendOnlineSubject.value) {
      this.http.post(`${this.apiUrl}/reset`, {}).subscribe(() => this.loadFromBackend());
    }
  }
}
