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
      <!-- Header -->
      <div class="page-header">
        <div>
          <span class="sub-header">HOSPITALITY &amp; INTAKE</span>
          <h2>Guest Dining Reservations</h2>
          <p>Bookings timeline, table allocations, party intake, and printable host run sheets.</p>
        </div>
        <div class="header-actions">
          <button class="btn-csv" (click)="exportCSV()">
            📥 Export Run Sheet (CSV)
          </button>
          <button class="btn-new-res" (click)="openBookingModal()">
            + New Dining Booking
          </button>
        </div>
      </div>

      <!-- Search & Status Filter Bar -->
      <div class="filter-card">
        <div class="search-wrap">
          <span class="search-icon">🔍</span>
          <input
            type="text"
            [(ngModel)]="searchQuery"
            placeholder="Search by guest name, phone, or reservation ID..."
            class="search-input"
          />
        </div>

        <div class="status-pills">
          <button
            *ngFor="let s of statuses"
            class="status-btn"
            [class.active]="selectedStatus === s"
            (click)="selectedStatus = s"
          >
            {{ s | uppercase }}
          </button>
        </div>
      </div>

      <!-- Reservations Grid -->
      <div class="res-grid" *ngIf="(reservations$ | async) as allRes">
        <div class="empty-box" *ngIf="filterReservations(allRes).length === 0">
          <div class="empty-icon">📅</div>
          <h3>No Reservations Found</h3>
          <p>No dining bookings match your current search criteria or status filter.</p>
        </div>

        <div
          class="res-card"
          *ngFor="let r of filterReservations(allRes)"
          [class]="r.status"
        >
          <!-- Card Head -->
          <div class="card-head">
            <div class="guest-profile">
              <div class="guest-avatar" [class]="r.status">
                {{ r.guestName.charAt(0) }}
              </div>
              <div class="guest-details">
                <span class="res-id">{{ r.id }}</span>
                <h4>{{ r.guestName }}</h4>
              </div>
            </div>
            <span class="status-pill" [class]="r.status">
              {{ r.status | uppercase }}
            </span>
          </div>

          <!-- Metadata Grid -->
          <div class="meta-row">
            <div class="meta-chip">
              <span class="chip-label">TIME</span>
              <strong>🕒 {{ r.time }}</strong>
            </div>
            <div class="meta-chip">
              <span class="chip-label">PARTY</span>
              <strong>👥 {{ r.partySize }} Guests</strong>
            </div>
            <div class="meta-chip">
              <span class="chip-label">TABLE</span>
              <strong [class.highlight]="r.tableId">📍 {{ r.tableId ? 'Table ' + r.tableId : 'Unassigned' }}</strong>
            </div>
          </div>

          <!-- Phone & Occasion -->
          <div class="info-row">
            <span class="phone-text" *ngIf="r.phone">📞 {{ r.phone }}</span>
            <span class="occasion-pill" *ngIf="r.occasion">🎉 {{ r.occasion }}</span>
          </div>

          <!-- Special Requests -->
          <div class="notes-quote" *ngIf="r.specialRequests">
            <span class="quote-icon">“</span>
            <span>{{ r.specialRequests }}</span>
          </div>

          <!-- Action Buttons -->
          <div class="card-actions">
            <button
              *ngIf="r.status === 'confirmed'"
              class="act-btn btn-seat"
              (click)="seat(r.id, r.tableId || 'T-102')"
            >
              Seat Guest
            </button>
            <button
              *ngIf="r.status === 'seated'"
              class="act-btn btn-finish"
              (click)="complete(r.id)"
            >
              Finish Meal
            </button>
            <button
              *ngIf="r.status !== 'cancelled' && r.status !== 'completed'"
              class="act-btn btn-cancel"
              (click)="cancel(r.id)"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>

      <!-- New Reservation Modal -->
      <div class="modal-backdrop" *ngIf="isModalOpen" (click)="isModalOpen = false">
        <div class="modal-card" (click)="$event.stopPropagation()">
          <div class="modal-head">
            <div>
              <span class="modal-tag">HOST INTAKE</span>
              <h3>New Dining Reservation</h3>
            </div>
            <button class="btn-close" (click)="isModalOpen = false">×</button>
          </div>

          <form (ngSubmit)="submitReservation()">
            <div class="form-group">
              <label>Guest Full Name *</label>
              <input type="text" [(ngModel)]="newRes.guestName" name="guestName" placeholder="e.g. Christian Dior" required />
            </div>

            <div class="form-row">
              <div class="form-col">
                <label>Contact Phone *</label>
                <input type="text" [(ngModel)]="newRes.phone" name="phone" placeholder="+1 (555) 000-0000" required />
              </div>
              <div class="form-col">
                <label>Party Size (Guests) *</label>
                <input type="number" [(ngModel)]="newRes.partySize" name="partySize" min="1" max="20" required />
              </div>
            </div>

            <div class="form-row">
              <div class="form-col">
                <label>Dining Date</label>
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
                    T-{{ t.number }} ({{ t.capacity }} Seats - {{ t.section | uppercase }})
                  </option>
                </select>
              </div>
              <div class="form-col">
                <label>Dining Occasion</label>
                <select [(ngModel)]="newRes.occasion" name="occasion">
                  <option value="Casual Dining">Casual Dining</option>
                  <option value="Birthday Celebration">Birthday Celebration</option>
                  <option value="Anniversary">Anniversary</option>
                  <option value="Business Dinner">Business Dinner</option>
                  <option value="Private Tasting">Private Tasting</option>
                </select>
              </div>
            </div>

            <div class="form-group">
              <label>Dietary Restrictions &amp; Notes</label>
              <textarea [(ngModel)]="newRes.specialRequests" name="specialRequests" rows="2" placeholder="e.g. Window booth preferred, vegetarian tasting menu..."></textarea>
            </div>

            <div class="modal-foot">
              <button type="button" class="btn-modal-cancel" (click)="isModalOpen = false">Cancel</button>
              <button type="submit" class="btn-modal-confirm">Confirm Reservation</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .res-page { display: flex; flex-direction: column; gap: 22px; }

    /* Header */
    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      flex-wrap: wrap;
      gap: 16px;
    }
    .sub-header {
      font-size: 0.7rem;
      font-weight: 800;
      letter-spacing: 0.12em;
      color: #fbbf24;
      display: block;
      margin-bottom: 4px;
    }
    .page-header h2 {
      margin: 0 0 4px;
      font-family: 'Playfair Display', Georgia, serif;
      font-size: 1.85rem;
      color: #ffffff;
    }
    .page-header p {
      margin: 0;
      color: #94a3b8;
      font-size: 0.92rem;
    }

    .header-actions { display: flex; gap: 12px; }
    .btn-csv {
      background: rgba(56, 189, 248, 0.12);
      border: 1px solid rgba(56, 189, 248, 0.35);
      color: #38bdf8;
      padding: 10px 18px;
      border-radius: 10px;
      font-weight: 700;
      font-size: 0.85rem;
      cursor: pointer;
      transition: all 0.2s ease;
    }
    .btn-csv:hover {
      background: rgba(56, 189, 248, 0.2);
      transform: translateY(-1px);
    }
    .btn-new-res {
      background: linear-gradient(135deg, #f59e0b, #d97706);
      color: #0f172a;
      border: none;
      padding: 10px 20px;
      border-radius: 10px;
      font-weight: 700;
      font-size: 0.88rem;
      cursor: pointer;
      box-shadow: 0 4px 14px rgba(245, 158, 11, 0.3);
      transition: all 0.2s ease;
    }
    .btn-new-res:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(245, 158, 11, 0.45);
    }

    /* Search & Filter Card */
    .filter-card {
      background: rgba(20, 27, 45, 0.75);
      backdrop-filter: blur(12px);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 16px;
      padding: 12px 18px;
      display: flex;
      align-items: center;
      gap: 16px;
      flex-wrap: wrap;
    }
    .search-wrap {
      flex: 1;
      min-width: 280px;
      position: relative;
      display: flex;
      align-items: center;
    }
    .search-icon {
      position: absolute;
      left: 14px;
      font-size: 0.9rem;
      pointer-events: none;
    }
    .search-input {
      width: 100%;
      background: rgba(13, 18, 31, 0.7);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 10px;
      padding: 10px 14px 10px 38px;
      color: #ffffff;
      font-size: 0.88rem;
      outline: none;
      transition: border-color 0.2s ease;
    }
    .search-input:focus {
      border-color: #fbbf24;
    }

    .status-pills { display: flex; gap: 6px; flex-wrap: wrap; }
    .status-btn {
      background: rgba(13, 18, 31, 0.6);
      border: 1px solid rgba(255, 255, 255, 0.08);
      color: #94a3b8;
      padding: 7px 14px;
      border-radius: 8px;
      font-size: 0.78rem;
      font-weight: 700;
      cursor: pointer;
      transition: all 0.15s ease;
    }
    .status-btn:hover { color: #ffffff; }
    .status-btn.active {
      background: #f59e0b;
      color: #0f172a;
      border-color: #f59e0b;
      box-shadow: 0 0 10px rgba(245, 158, 11, 0.35);
    }

    /* Reservations Grid */
    .res-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
      gap: 18px;
    }
    .empty-box {
      grid-column: 1 / -1;
      background: rgba(20, 27, 45, 0.6);
      border: 1px dashed rgba(255, 255, 255, 0.12);
      border-radius: 18px;
      padding: 3.5rem;
      text-align: center;
      color: #94a3b8;
    }
    .empty-icon { font-size: 2.5rem; margin-bottom: 8px; }

    .res-card {
      background: rgba(20, 27, 45, 0.72);
      backdrop-filter: blur(12px);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 18px;
      padding: 1.35rem;
      display: flex;
      flex-direction: column;
      gap: 12px;
      transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
    }
    .res-card:hover {
      transform: translateY(-3px);
      border-color: rgba(255, 255, 255, 0.2);
      box-shadow: 0 12px 28px -6px rgba(0, 0, 0, 0.5);
    }
    .res-card.confirmed { border-left: 4px solid #38bdf8; }
    .res-card.seated { border-left: 4px solid #10b981; }
    .res-card.completed { border-left: 4px solid #64748b; opacity: 0.75; }
    .res-card.cancelled { border-left: 4px solid #f43f5e; opacity: 0.6; }

    .card-head {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
    }
    .guest-profile {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .guest-avatar {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: #334155;
      color: #ffffff;
      font-weight: 800;
      font-size: 1.1rem;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .guest-avatar.seated { background: linear-gradient(135deg, #10b981, #059669); }
    .guest-avatar.confirmed { background: linear-gradient(135deg, #0284c7, #38bdf8); }
    .guest-avatar.cancelled { background: #475569; }

    .guest-details { display: flex; flex-direction: column; }
    .res-id { font-size: 0.68rem; color: #64748b; font-family: monospace; }
    .guest-details h4 { margin: 1px 0 0; color: #ffffff; font-size: 1.05rem; }

    .status-pill {
      font-size: 0.68rem;
      font-weight: 800;
      padding: 3px 9px;
      border-radius: 9999px;
      letter-spacing: 0.05em;
    }
    .status-pill.confirmed { background: rgba(56, 189, 248, 0.15); color: #38bdf8; border: 1px solid rgba(56, 189, 248, 0.3); }
    .status-pill.seated { background: rgba(16, 185, 129, 0.15); color: #34d399; border: 1px solid rgba(16, 185, 129, 0.3); }
    .status-pill.completed { background: rgba(100, 116, 139, 0.2); color: #94a3b8; border: 1px solid rgba(100, 116, 139, 0.3); }
    .status-pill.cancelled { background: rgba(244, 63, 94, 0.15); color: #fb7185; border: 1px solid rgba(244, 63, 94, 0.3); }

    .meta-row {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      background: rgba(13, 18, 31, 0.5);
      border-radius: 10px;
      padding: 8px 10px;
      gap: 6px;
    }
    .meta-chip { display: flex; flex-direction: column; gap: 2px; }
    .chip-label { font-size: 0.65rem; color: #64748b; font-weight: 700; text-transform: uppercase; }
    .meta-chip strong { font-size: 0.82rem; color: #e2e8f0; }
    .meta-chip strong.highlight { color: #fbbf24; }

    .info-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 0.78rem;
    }
    .phone-text { color: #94a3b8; }
    .occasion-pill {
      background: rgba(245, 158, 11, 0.12);
      border: 1px solid rgba(245, 158, 11, 0.25);
      color: #fbbf24;
      padding: 2px 8px;
      border-radius: 4px;
      font-weight: 600;
      font-size: 0.72rem;
    }

    .notes-quote {
      background: rgba(13, 18, 31, 0.4);
      border-left: 3px solid #fb7185;
      padding: 8px 12px;
      border-radius: 6px;
      font-size: 0.78rem;
      color: #cbd5e1;
      font-style: italic;
    }

    .card-actions {
      display: flex;
      gap: 8px;
      margin-top: 4px;
    }
    .act-btn {
      flex: 1;
      padding: 9px;
      border-radius: 8px;
      border: none;
      font-weight: 700;
      font-size: 0.82rem;
      cursor: pointer;
      transition: all 0.15s ease;
    }
    .btn-seat {
      background: linear-gradient(135deg, #10b981, #059669);
      color: white;
    }
    .btn-finish {
      background: linear-gradient(135deg, #0284c7, #38bdf8);
      color: #0f172a;
    }
    .btn-cancel {
      background: transparent;
      border: 1px solid rgba(244, 63, 94, 0.4);
      color: #fb7185;
    }

    /* Modal Form */
    .modal-backdrop {
      position: fixed;
      inset: 0;
      background: rgba(8, 12, 20, 0.82);
      backdrop-filter: blur(8px);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 2000;
      padding: 20px;
    }
    .modal-card {
      background: #141b2d;
      border: 1px solid rgba(255, 255, 255, 0.12);
      border-radius: 20px;
      padding: 1.75rem;
      width: 500px;
      max-width: 100%;
      color: #ffffff;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.6);
    }
    .modal-head {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 16px;
    }
    .modal-tag {
      font-size: 0.68rem;
      font-weight: 800;
      letter-spacing: 0.1em;
      color: #fbbf24;
    }
    .modal-head h3 {
      margin: 2px 0 0;
      font-family: 'Playfair Display', Georgia, serif;
      font-size: 1.4rem;
    }
    .btn-close {
      background: transparent;
      border: none;
      color: #94a3b8;
      font-size: 1.4rem;
      cursor: pointer;
    }

    form { display: flex; flex-direction: column; gap: 12px; }
    .form-group { display: flex; flex-direction: column; gap: 4px; }
    form label { font-size: 0.78rem; font-weight: 700; color: #94a3b8; }
    form input, form select, form textarea {
      width: 100%;
      background: #0d121f;
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 8px;
      padding: 10px 12px;
      color: #ffffff;
      font-size: 0.88rem;
      box-sizing: border-box;
      outline: none;
      font-family: inherit;
    }
    form input:focus, form select:focus, form textarea:focus {
      border-color: #fbbf24;
    }
    .form-row { display: flex; gap: 12px; }
    .form-col { flex: 1; display: flex; flex-direction: column; gap: 4px; }

    .modal-foot {
      display: flex;
      justify-content: flex-end;
      gap: 10px;
      margin-top: 10px;
    }
    .btn-modal-cancel {
      background: transparent;
      border: 1px solid rgba(255, 255, 255, 0.12);
      color: #94a3b8;
      padding: 10px 18px;
      border-radius: 10px;
      font-weight: 600;
      cursor: pointer;
    }
    .btn-modal-confirm {
      background: linear-gradient(135deg, #f59e0b, #d97706);
      color: #0f172a;
      border: none;
      padding: 10px 22px;
      border-radius: 10px;
      font-weight: 700;
      cursor: pointer;
      box-shadow: 0 4px 14px rgba(245, 158, 11, 0.35);
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
