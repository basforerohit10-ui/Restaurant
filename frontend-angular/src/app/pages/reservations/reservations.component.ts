import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RestaurantService } from '../../services/restaurant.service';
import { Reservation, Table } from '../../models/restaurant.model';

@Component({
  selector: 'app-reservations',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="res-page">
      <div class="header">
        <div>
          <h2>Guest Dining Reservations (Angular)</h2>
          <p>Bookings schedule, table allocations, party intake, and printable host run sheets.</p>
        </div>
        <div class="header-actions">
          <button class="btn-secondary" (click)="exportCSV()">
            📥 Export Run Sheet (CSV)
          </button>
          <button class="btn-primary" (click)="openBookingModal()">
            + New Dining Booking
          </button>
        </div>
      </div>

      <!-- Search & Filters -->
      <div class="filter-bar">
        <input
          type="text"
          [(ngModel)]="searchQuery"
          placeholder="Search by guest name, phone, or reservation ID..."
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
          class="empty-notice"
          *ngIf="filterReservations(allRes).length === 0"
        >
          <h3>No Reservations Found</h3>
          <p>Try clearing your search filter or add a new dining reservation.</p>
        </div>

        <div
          class="res-card"
          *ngFor="let r of filterReservations(allRes)"
          [class]="r.status"
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

          <div class="extra-info">
            <span *ngIf="r.phone">📞 {{ r.phone }}</span>
            <span *ngIf="r.occasion" class="occasion-tag">🎉 {{ r.occasion }}</span>
          </div>

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
          <div class="modal-head">
            <h3>New Dining Reservation</h3>
            <button class="btn-close" (click)="isModalOpen = false">×</button>
          </div>

          <form (ngSubmit)="submitReservation()">
            <label>Guest Full Name *</label>
            <input type="text" [(ngModel)]="newRes.guestName" name="guestName" placeholder="e.g. Liam Henderson" required />

            <div class="form-row">
              <div class="form-col">
                <label>Contact Phone *</label>
                <input type="text" [(ngModel)]="newRes.phone" name="phone" placeholder="+1 (555) 000-0000" required />
              </div>
              <div class="form-col">
                <label>Party Size *</label>
                <input type="number" [(ngModel)]="newRes.partySize" name="partySize" min="1" max="20" required />
              </div>
            </div>

            <div class="form-row">
              <div class="form-col">
                <label>Reservation Date</label>
                <input type="date" [(ngModel)]="newRes.date" name="date" required />
              </div>
              <div class="form-col">
                <label>Seating Time</label>
                <input type="time" [(ngModel)]="newRes.time" name="time" required />
              </div>
            </div>

            <div class="form-row">
              <div class="form-col">
                <label>Assign Table (Optional)</label>
                <select [(ngModel)]="newRes.tableId" name="tableId">
                  <option [ngValue]="null">-- Auto / Unassigned --</option>
                  <option *ngFor="let t of (tables$ | async)" [value]="t.id">
                    T-{{ t.number }} ({{ t.capacity }}p - {{ t.section | uppercase }})
                  </option>
                </select>
              </div>
              <div class="form-col">
                <label>Occasion</label>
                <select [(ngModel)]="newRes.occasion" name="occasion">
                  <option value="Casual Dining">Casual Dining</option>
                  <option value="Birthday">Birthday</option>
                  <option value="Anniversary">Anniversary</option>
                  <option value="Business Dinner">Business Dinner</option>
                  <option value="Celebration">Celebration</option>
                </select>
              </div>
            </div>

            <label>Dietary Requests &amp; Notes</label>
            <textarea [(ngModel)]="newRes.specialRequests" name="specialRequests" rows="2" placeholder="e.g. Window booth preferred, vegetarian menu..."></textarea>

            <div class="modal-foot">
              <button type="button" class="btn-cancel-modal" (click)="isModalOpen = false">Cancel</button>
              <button type="submit" class="btn-confirm-modal">Confirm Reservation</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .res-page { display: flex; flex-direction: column; gap: 20px; }
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 12px;
    }
    .header h2 { margin: 0 0 4px; color: #f8fafc; font-size: 1.5rem; }
    .header p { margin: 0; color: #94a3b8; font-size: 0.88rem; }
    .header-actions { display: flex; gap: 10px; }
    .btn-primary {
      background: #e11d48;
      color: white;
      border: none;
      padding: 10px 18px;
      border-radius: 8px;
      font-weight: 600;
      cursor: pointer;
    }
    .btn-secondary {
      background: #1e293b;
      color: #38bdf8;
      border: 1px solid rgba(56, 189, 248, 0.3);
      padding: 10px 16px;
      border-radius: 8px;
      font-weight: 600;
      cursor: pointer;
    }

    .filter-bar {
      display: flex;
      gap: 12px;
      align-items: center;
      background: #1e293b;
      padding: 12px;
      border-radius: 12px;
      border: 1px solid rgba(255, 255, 255, 0.08);
      flex-wrap: wrap;
    }
    .search-input {
      flex: 1;
      min-width: 260px;
      background: #0f172a;
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 8px;
      padding: 9px 14px;
      color: #f8fafc;
      font-size: 0.88rem;
    }
    .status-pills { display: flex; gap: 6px; flex-wrap: wrap; }
    .pill-btn {
      background: #0f172a;
      border: 1px solid rgba(255, 255, 255, 0.1);
      color: #94a3b8;
      padding: 6px 12px;
      border-radius: 6px;
      font-size: 0.78rem;
      cursor: pointer;
    }
    .pill-btn.active {
      background: #e11d48;
      color: white;
      border-color: #e11d48;
      font-weight: 600;
    }

    .res-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
      gap: 16px;
    }
    .empty-notice {
      grid-column: 1 / -1;
      background: #1e293b;
      padding: 3rem;
      text-align: center;
      border-radius: 14px;
      color: #94a3b8;
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
    .res-card.confirmed { border-left: 4px solid #38bdf8; }
    .res-card.seated { border-left: 4px solid #10b981; }
    .res-card.completed { border-left: 4px solid #64748b; opacity: 0.75; }
    .res-card.cancelled { border-left: 4px solid #ef4444; opacity: 0.6; }

    .card-head { display: flex; justify-content: space-between; align-items: flex-start; }
    .res-id { font-size: 0.7rem; color: #64748b; font-family: monospace; display: block; }
    .card-head h4 { margin: 2px 0 0; color: #f8fafc; font-size: 1.1rem; }
    .badge {
      font-size: 0.7rem;
      padding: 2px 8px;
      border-radius: 9999px;
      font-weight: 700;
    }
    .badge.confirmed { background: rgba(56, 189, 248, 0.15); color: #38bdf8; }
    .badge.seated { background: rgba(16, 185, 129, 0.15); color: #10b981; }
    .badge.completed { background: rgba(100, 116, 139, 0.2); color: #94a3b8; }
    .badge.cancelled { background: rgba(239, 68, 68, 0.15); color: #ef4444; }

    .meta-row { display: flex; gap: 12px; font-size: 0.8rem; color: #cbd5e1; }
    .extra-info { display: flex; justify-content: space-between; font-size: 0.78rem; color: #94a3b8; }
    .occasion-tag { color: #f59e0b; font-weight: 600; }
    .notes {
      font-size: 0.78rem;
      color: #94a3b8;
      font-style: italic;
      background: rgba(15, 23, 42, 0.4);
      padding: 6px 10px;
      border-radius: 6px;
    }

    .card-actions { display: flex; gap: 8px; margin-top: 6px; }
    .btn-act {
      flex: 1;
      padding: 8px;
      border-radius: 6px;
      border: none;
      font-weight: 600;
      font-size: 0.8rem;
      cursor: pointer;
    }
    .btn-seat { background: #10b981; color: white; }
    .btn-done { background: #38bdf8; color: #0f172a; }
    .btn-cancel { background: transparent; border: 1px solid rgba(239, 68, 68, 0.4); color: #ef4444; }

    .modal-backdrop {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.75);
      backdrop-filter: blur(4px);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
    }
    .modal-box {
      background: #1e293b;
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 16px;
      padding: 1.5rem;
      width: 480px;
      max-width: 90vw;
      color: #f8fafc;
    }
    .modal-head { display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px; }
    .modal-head h3 { margin: 0; }
    .btn-close { background: transparent; border: none; color: #94a3b8; font-size: 1.4rem; cursor: pointer; }

    form { display: flex; flex-direction: column; gap: 10px; }
    form label { font-size: 0.78rem; color: #94a3b8; font-weight: 600; }
    form input, form select, form textarea {
      width: 100%;
      background: #0f172a;
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 6px;
      padding: 8px 10px;
      color: #f8fafc;
      font-size: 0.88rem;
      box-sizing: border-box;
    }
    .form-row { display: flex; gap: 12px; }
    .form-col { flex: 1; }

    .modal-foot { display: flex; justify-content: flex-end; gap: 10px; margin-top: 10px; }
    .btn-cancel-modal {
      background: transparent;
      border: 1px solid rgba(255, 255, 255, 0.1);
      color: #94a3b8;
      padding: 8px 16px;
      border-radius: 6px;
      cursor: pointer;
    }
    .btn-confirm-modal {
      background: #e11d48;
      color: white;
      border: none;
      padding: 8px 18px;
      border-radius: 6px;
      font-weight: 600;
      cursor: pointer;
    }
  `]
})
export class ReservationsComponent {
  private restaurantService = inject(RestaurantService);
  reservations$ = this.restaurantService.reservations$;
  tables$ = this.restaurantService.tables$;

  searchQuery = '';
  selectedStatus = 'all';
  statuses = ['all', 'confirmed', 'seated', 'completed', 'cancelled'];

  isModalOpen = false;
  newRes: Omit<Reservation, 'id'> = {
    guestName: '',
    phone: '',
    partySize: 2,
    date: new Date().toISOString().split('T')[0],
    time: '19:00',
    tableId: null,
    status: 'confirmed',
    occasion: 'Casual Dining',
    specialRequests: ''
  };

  filterReservations(reservations: Reservation[]): Reservation[] {
    return reservations.filter(r => {
      const matchSearch =
        !this.searchQuery ||
        r.guestName.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        (r.phone && r.phone.includes(this.searchQuery)) ||
        r.id.toLowerCase().includes(this.searchQuery.toLowerCase());

      const matchStatus = this.selectedStatus === 'all' || r.status === this.selectedStatus;
      return matchSearch && matchStatus;
    });
  }

  openBookingModal(): void {
    this.newRes = {
      guestName: '',
      phone: '',
      partySize: 2,
      date: new Date().toISOString().split('T')[0],
      time: '19:00',
      tableId: null,
      status: 'confirmed',
      occasion: 'Casual Dining',
      specialRequests: ''
    };
    this.isModalOpen = true;
  }

  submitReservation(): void {
    if (!this.newRes.guestName) return;
    this.restaurantService.addReservation(this.newRes);
    this.isModalOpen = false;
  }

  seat(id: string, tableId: string): void {
    this.restaurantService.seatReservation(id, tableId);
  }

  complete(id: string): void {
    this.restaurantService.completeReservation(id);
  }

  cancel(id: string): void {
    this.restaurantService.cancelReservation(id);
  }

  exportCSV(): void {
    this.restaurantService.exportReservationsCSV();
  }
}
