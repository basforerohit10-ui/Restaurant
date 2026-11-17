import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RestaurantService } from '../../services/restaurant.service';
import { Reservation } from '../../models/restaurant.model';

@Component({
  selector: 'app-reservations',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="res-page">
      <div class="header">
        <div>
          <h2>Guest Reservations (Angular)</h2>
          <p>Search, filter, allocate tables, and track dining turnaround times.</p>
        </div>
        <button class="btn-primary" (click)="isModalOpen = true">
          + New Booking
        </button>
      </div>

      <!-- Search & Filters -->
      <div class="filter-bar">
        <input
          type="text"
          [(ngModel)]="searchQuery"
          placeholder="Search by guest name or phone..."
          class="search-input"
        />

        <div class="status-pills">
          <button
            *ngFor="let s of statuses"
            class="pill-btn"
            [class.active]="selectedStatus === s"
            (click)="selectedStatus = s"
          >
            {{ s | uppercase }}
          </button>
        </div>
      </div>

      <!-- Reservations List -->
      <div class="res-grid" *ngIf="(reservations$ | async) as allRes">
        <div
          class="res-card"
          *ngFor="let r of filterReservations(allRes)"
        >
          <div class="card-head">
            <div>
              <span class="res-id">{{ r.id }}</span>
              <h4>{{ r.guestName }}</h4>
            </div>
            <span class="badge" [class]="r.status">{{ r.status | uppercase }}</span>
          </div>

          <div class="meta-row">
            <span>🕒 {{ r.time }}</span>
            <span>👥 {{ r.partySize }} Guests</span>
            <span>📍 {{ r.tableId ? 'Table ' + r.tableId : 'Unassigned' }}</span>
          </div>

          <div class="phone" *ngIf="r.phone">📞 {{ r.phone }}</div>
          <div class="notes" *ngIf="r.specialRequests">"{{ r.specialRequests }}"</div>

          <div class="card-actions">
            <button
              *ngIf="r.status === 'confirmed'"
              class="btn-act btn-seat"
              (click)="seat(r.id, r.tableId || 'T-102')"
            >
              Seat Guest
            </button>
            <button
              *ngIf="r.status === 'seated'"
              class="btn-act btn-done"
              (click)="complete(r.id)"
            >
              Finish Meal
            </button>
            <button
              *ngIf="r.status !== 'cancelled' && r.status !== 'completed'"
              class="btn-act btn-cancel"
              (click)="cancel(r.id)"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>

      <!-- New Reservation Modal -->
      <div class="modal-backdrop" *ngIf="isModalOpen" (click)="isModalOpen = false">
        <div class="modal-box" (click)="$event.stopPropagation()">
          <h3>New Dining Reservation</h3>
          <form (ngSubmit)="submitReservation()">
            <label>Guest Name</label>
            <input type="text" [(ngModel)]="newRes.guestName" name="guestName" required />

            <label>Phone Number</label>
            <input type="text" [(ngModel)]="newRes.phone" name="phone" required />

            <div class="row">
              <div>
                <label>Party Size</label>
                <select [(ngModel)]="newRes.partySize" name="partySize">
                  <option [value]="2">2 Guests</option>
                  <option [value]="4">4 Guests</option>
                  <option [value]="6">6 Guests</option>
                  <option [value]="8">8 Guests</option>
                </select>
              </div>
              <div>
                <label>Time Slot</label>
                <select [(ngModel)]="newRes.time" name="time">
                  <option value="18:00">18:00</option>
                  <option value="19:00">19:00</option>
                  <option value="20:00">20:00</option>
                  <option value="21:00">21:00</option>
                </select>
              </div>
            </div>

            <div class="modal-actions">
              <button type="button" class="btn-cancel-modal" (click)="isModalOpen = false">Cancel</button>
              <button type="submit" class="btn-submit">Confirm Booking</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .res-page { display: flex; flex-direction: column; gap: 20px; }
    .header { display: flex; justify-content: space-between; align-items: center; }
    .header h2 { margin: 0 0 4px; color: #f8fafc; font-size: 1.5rem; }
    .header p { margin: 0; color: #94a3b8; font-size: 0.88rem; }
    .btn-primary {
      background: #e11d48;
      color: white;
      border: none;
      padding: 10px 18px;
      border-radius: 8px;
      font-weight: 600;
      cursor: pointer;
    }
    .filter-bar {
      display: flex;
      justify-content: space-between;
      gap: 16px;
      background: #1e293b;
      padding: 1rem;
      border-radius: 12px;
      border: 1px solid rgba(255, 255, 255, 0.08);
      flex-wrap: wrap;
    }
    .search-input {
      flex: 1;
      min-width: 250px;
      background: #0f172a;
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 8px;
      padding: 8px 12px;
      color: #f8fafc;
    }
    .status-pills { display: flex; gap: 6px; }
    .pill-btn {
      background: rgba(15, 23, 42, 0.6);
      border: 1px solid rgba(255, 255, 255, 0.08);
      color: #94a3b8;
      padding: 6px 12px;
      border-radius: 8px;
      font-size: 0.75rem;
      cursor: pointer;
    }
    .pill-btn.active { background: rgba(225, 29, 72, 0.2); border-color: #e11d48; color: #f8fafc; }
    .res-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 16px;
    }
    .res-card {
      background: #1e293b;
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 14px;
      padding: 1.25rem;
      display: flex;
      flex-direction: column;
      gap: 10px;
    }
    .card-head { display: flex; justify-content: space-between; align-items: flex-start; }
    .res-id { font-size: 0.72rem; color: #fb7185; font-weight: 700; }
    .card-head h4 { margin: 2px 0 0; color: #f8fafc; font-size: 1.1rem; }
    .badge {
      font-size: 0.68rem;
      padding: 2px 8px;
      border-radius: 9999px;
      font-weight: 700;
      background: rgba(59, 130, 246, 0.15);
      color: #3b82f6;
    }
    .badge.seated { background: rgba(16, 185, 129, 0.15); color: #10b981; }
    .badge.completed { background: rgba(168, 85, 247, 0.15); color: #a855f7; }
    .badge.cancelled { background: rgba(239, 68, 68, 0.15); color: #ef4444; }
    .meta-row { display: flex; gap: 12px; font-size: 0.78rem; color: #94a3b8; }
    .phone { font-size: 0.78rem; color: #cbd5e1; }
    .notes { font-size: 0.75rem; color: #fb7185; font-style: italic; background: rgba(15, 23, 42, 0.5); padding: 6px; border-radius: 6px; }
    .card-actions { display: flex; gap: 8px; margin-top: 4px; }
    .btn-act { flex: 1; padding: 6px; border-radius: 6px; border: none; font-size: 0.75rem; font-weight: 600; cursor: pointer; }
    .btn-seat { background: #10b981; color: white; }
    .btn-done { background: #a855f7; color: white; }
    .btn-cancel { background: rgba(239, 68, 68, 0.15); color: #ef4444; }
    .modal-backdrop {
      position: fixed; inset: 0; background: rgba(0,0,0,0.7); display: flex; align-items: center; justify-content: center; z-index: 1000;
    }
    .modal-box {
      background: #1e293b; border-radius: 14px; padding: 1.5rem; width: 400px; display: flex; flex-direction: column; gap: 12px; color: #f8fafc;
    }
    .modal-box h3 { margin: 0 0 6px; }
    .modal-box label { font-size: 0.78rem; color: #94a3b8; display: block; margin-top: 8px; }
    .modal-box input, .modal-box select {
      width: 100%; background: #0f172a; border: 1px solid rgba(255,255,255,0.1); border-radius: 6px; padding: 8px; color: #f8fafc; box-sizing: border-box;
    }
    .modal-box .row { display: flex; gap: 10px; }
    .modal-actions { display: flex; justify-content: flex-end; gap: 10px; margin-top: 14px; }
    .btn-cancel-modal { background: transparent; border: 1px solid rgba(255,255,255,0.1); color: #94a3b8; padding: 8px 14px; border-radius: 6px; cursor: pointer; }
    .btn-submit { background: #e11d48; color: white; border: none; padding: 8px 16px; border-radius: 6px; font-weight: 600; cursor: pointer; }
  `]
})
export class ReservationsComponent {
  private restaurantService = inject(RestaurantService);
  reservations$ = this.restaurantService.reservations$;

  searchQuery = '';
  selectedStatus = 'all';
  statuses = ['all', 'confirmed', 'seated', 'completed', 'cancelled'];
  isModalOpen = false;

  newRes = {
    guestName: '',
    phone: '',
    partySize: 2,
    time: '19:00',
    date: new Date().toISOString().split('T')[0],
    status: 'confirmed' as const,
    occasion: 'Casual Dining'
  };

  filterReservations(reservations: Reservation[]): Reservation[] {
    return reservations.filter(r => {
      const matchesSearch = !this.searchQuery ||
        r.guestName.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        r.phone.includes(this.searchQuery);
      const matchesStatus = this.selectedStatus === 'all' || r.status === this.selectedStatus;
      return matchesSearch && matchesStatus;
    });
  }

  seat(id: string, tableId: string) {
    this.restaurantService.seatReservation(id, tableId);
  }

  complete(id: string) {
    this.restaurantService.completeReservation(id);
  }

  cancel(id: string) {
    this.restaurantService.cancelReservation(id);
  }

  submitReservation() {
    if (!this.newRes.guestName) return;
    this.restaurantService.addReservation(this.newRes);
    this.isModalOpen = false;
    this.newRes.guestName = '';
    this.newRes.phone = '';
  }
}
