import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RestaurantService } from '../../services/restaurant.service';
import { Table, Reservation } from '../../models/restaurant.model';

@Component({
  selector: 'app-tables',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="tables-page">
      <!-- Page Header -->
      <div class="page-header">
        <div>
          <span class="sub-header">ARCHITECTURAL FLOOR CONTROL</span>
          <h2>Dining Floor Layout &amp; Table Matrix</h2>
          <p>Real-time visual table statuses, seating capacities, and turn-time floor allocations.</p>
        </div>
        <div class="status-legend">
          <div class="legend-pill available"><span class="dot"></span> Available</div>
          <div class="legend-pill occupied"><span class="dot"></span> Occupied</div>
          <div class="legend-pill reserved"><span class="dot"></span> Reserved</div>
          <div class="legend-pill maintenance"><span class="dot"></span> Maintenance</div>
        </div>
      </div>

      <!-- Controls & Filter Toolbar -->
      <div class="toolbar-card">
        <!-- Section Filter -->
        <div class="filter-group">
          <span class="group-label">DINING SECTION:</span>
          <div class="pills-container">
            <button
              *ngFor="let sec of sections"
              class="pill-button"
              [class.active]="selectedSection === sec.id"
              (click)="selectedSection = sec.id"
            >
              {{ sec.name }}
            </button>
          </div>
        </div>

        <div class="divider-v"></div>

        <!-- Capacity Filter -->
        <div class="filter-group">
          <span class="group-label">CAPACITY:</span>
          <div class="pills-container">
            <button
              *ngFor="let cap of capacities"
              class="pill-button"
              [class.active]="selectedCapacity === cap"
              (click)="selectedCapacity = cap"
            >
              {{ cap === 0 ? 'All Capacities' : cap + '+ Guests' }}
            </button>
          </div>
        </div>
      </div>

      <!-- Tables Grid Matrix -->
      <div class="tables-grid" *ngIf="(tables$ | async) as allTables">
        <div
          class="table-card"
          *ngFor="let t of filterTables(allTables)"
          [class]="t.status"
          (click)="openTableModal(t)"
        >
          <!-- Card Header -->
          <div class="card-head">
            <div class="table-tag">
              <span class="tag-hash">#</span>
              <span class="tag-num">{{ t.number }}</span>
            </div>
            <span class="status-badge" [class]="t.status">
              {{ t.status | uppercase }}
            </span>
          </div>

          <!-- Realistic Table Visualizer with Chairs -->
          <div class="table-stage">
            <div class="furniture-assembly" [class]="t.shape" [class]="t.status">
              <!-- Chairs around table -->
              <div class="chair top" *ngIf="t.capacity >= 2"></div>
              <div class="chair bottom" *ngIf="t.capacity >= 2"></div>
              <div class="chair left" *ngIf="t.capacity >= 4"></div>
              <div class="chair right" *ngIf="t.capacity >= 4"></div>
              <div class="chair top-left" *ngIf="t.capacity >= 6"></div>
              <div class="chair top-right" *ngIf="t.capacity >= 6"></div>

              <!-- Main Table Center Top -->
              <div class="table-plate">
                <span class="plate-num">T-{{ t.number }}</span>
                <span class="plate-seats">👥 {{ t.capacity }} Seats</span>
              </div>
            </div>
          </div>

          <!-- Metadata info -->
          <div class="card-meta">
            <span class="meta-section">📍 {{ getSectionLabel(t.section) }}</span>
            <span class="meta-shape">{{ t.shape | titlecase }} Table</span>
          </div>

          <!-- Attached guest preview if occupied/reserved -->
          <div class="attached-info" *ngIf="getReservationForTable(t) as res">
            <span class="att-name">👤 {{ res.guestName }}</span>
            <span class="att-time">🕒 {{ res.time }} ({{ res.partySize }}p)</span>
          </div>

          <!-- Fast Card Action Buttons -->
          <div class="card-actions" (click)="$event.stopPropagation()">
            <button
              *ngIf="t.status === 'available'"
              class="action-btn btn-seat"
              (click)="updateStatus(t.id, 'occupied')"
            >
              Seat Walk-In Party
            </button>
            <button
              *ngIf="t.status === 'occupied'"
              class="action-btn btn-free"
              (click)="updateStatus(t.id, 'available')"
            >
              Clear &amp; Clean Table
            </button>
            <button
              *ngIf="t.status === 'reserved'"
              class="action-btn btn-seat"
              (click)="updateStatus(t.id, 'occupied')"
            >
              Seat Reserved Party
            </button>
            <button
              *ngIf="t.status === 'maintenance'"
              class="action-btn btn-free"
              (click)="updateStatus(t.id, 'available')"
            >
              Restore to Available
            </button>
          </div>
        </div>
      </div>

      <!-- Table Detail Modal -->
      <div class="modal-backdrop" *ngIf="selectedTable" (click)="selectedTable = null">
        <div class="modal-card" (click)="$event.stopPropagation()">
          <div class="modal-head">
            <div class="modal-title-group">
              <span class="modal-tag">TABLE MANAGEMENT</span>
              <h3>Table T-{{ selectedTable.number }} Overview</h3>
            </div>
            <button class="modal-close" (click)="selectedTable = null">×</button>
          </div>

          <div class="modal-body">
            <div class="stat-pills-row">
              <div class="modal-stat-pill">
                <span class="stat-lbl">Area Section</span>
                <strong>{{ getSectionLabel(selectedTable.section) }}</strong>
              </div>
              <div class="modal-stat-pill">
                <span class="stat-lbl">Capacity</span>
                <strong>{{ selectedTable.capacity }} Diners</strong>
              </div>
              <div class="modal-stat-pill">
                <span class="stat-lbl">Shape</span>
                <strong>{{ selectedTable.shape | titlecase }}</strong>
              </div>
            </div>

            <div class="current-status-banner" [class]="selectedTable.status">
              <span>Current Status:</span>
              <strong>{{ selectedTable.status | uppercase }}</strong>
            </div>

            <!-- Linked Reservation Info -->
            <div class="linked-booking-box" *ngIf="getReservationForTable(selectedTable) as res">
              <div class="booking-head">
                <span>ACTIVE DINING RESERVATION</span>
                <span class="time-pill">{{ res.time }}</span>
              </div>
              <h4>{{ res.guestName }}</h4>
              <p>Party of {{ res.partySize }} guests • {{ res.occasion || 'General Dining' }}</p>
              <p *ngIf="res.phone">Contact: {{ res.phone }}</p>
              <p *ngIf="res.specialRequests" class="special-req">"{{ res.specialRequests }}"</p>
            </div>

            <!-- Modal Action Buttons -->
            <div class="modal-actions-list">
              <button
                class="modal-act-btn seat-btn"
                *ngIf="selectedTable.status !== 'occupied'"
                (click)="updateStatus(selectedTable.id, 'occupied'); selectedTable = null"
              >
                Seat Guests at Table
              </button>
              <button
                class="modal-act-btn free-btn"
                *ngIf="selectedTable.status !== 'available'"
                (click)="updateStatus(selectedTable.id, 'available'); selectedTable = null"
              >
                Mark Clean &amp; Available
              </button>
              <button
                class="modal-act-btn maint-btn"
                *ngIf="selectedTable.status !== 'maintenance'"
                (click)="updateStatus(selectedTable.id, 'maintenance'); selectedTable = null"
              >
                Set Out of Order / Maintenance
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .tables-page {
      display: flex;
      flex-direction: column;
      gap: 22px;
    }

    /* Page Header */
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

    /* Status Legend */
    .status-legend {
      display: flex;
      gap: 10px;
      flex-wrap: wrap;
    }
    .legend-pill {
      display: flex;
      align-items: center;
      gap: 6px;
      background: rgba(20, 27, 45, 0.7);
      border: 1px solid rgba(255, 255, 255, 0.08);
      padding: 6px 12px;
      border-radius: 9999px;
      font-size: 0.75rem;
      font-weight: 600;
      color: #cbd5e1;
    }
    .legend-pill .dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
    }
    .legend-pill.available .dot { background: #10b981; box-shadow: 0 0 6px #10b981; }
    .legend-pill.occupied .dot { background: #f43f5e; box-shadow: 0 0 6px #f43f5e; }
    .legend-pill.reserved .dot { background: #f59e0b; box-shadow: 0 0 6px #f59e0b; }
    .legend-pill.maintenance .dot { background: #64748b; box-shadow: 0 0 6px #64748b; }

    /* Toolbar Card */
    .toolbar-card {
      background: rgba(20, 27, 45, 0.75);
      backdrop-filter: blur(12px);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 16px;
      padding: 14px 20px;
      display: flex;
      align-items: center;
      gap: 24px;
      flex-wrap: wrap;
    }
    .filter-group {
      display: flex;
      align-items: center;
      gap: 12px;
      flex-wrap: wrap;
    }
    .group-label {
      font-size: 0.7rem;
      font-weight: 800;
      letter-spacing: 0.08em;
      color: #64748b;
    }
    .pills-container {
      display: flex;
      gap: 6px;
      flex-wrap: wrap;
    }
    .pill-button {
      background: rgba(13, 18, 31, 0.6);
      border: 1px solid rgba(255, 255, 255, 0.08);
      color: #94a3b8;
      padding: 7px 14px;
      border-radius: 8px;
      font-size: 0.82rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.15s ease;
    }
    .pill-button:hover {
      color: #ffffff;
      border-color: rgba(255, 255, 255, 0.2);
    }
    .pill-button.active {
      background: linear-gradient(135deg, #f59e0b, #d97706);
      color: #0f172a;
      border-color: #f59e0b;
      font-weight: 700;
      box-shadow: 0 0 12px rgba(245, 158, 11, 0.35);
    }
    .divider-v {
      width: 1px;
      height: 28px;
      background: rgba(255, 255, 255, 0.1);
    }
    @media (max-width: 900px) {
      .divider-v { display: none; }
    }

    /* Tables Grid Matrix */
    .tables-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
      gap: 18px;
    }

    .table-card {
      background: rgba(20, 27, 45, 0.72);
      backdrop-filter: blur(12px);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 18px;
      padding: 1.25rem;
      display: flex;
      flex-direction: column;
      gap: 14px;
      cursor: pointer;
      transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
      position: relative;
    }
    .table-card:hover {
      transform: translateY(-4px);
      border-color: rgba(255, 255, 255, 0.22);
      box-shadow: 0 12px 28px -6px rgba(0, 0, 0, 0.55);
    }

    .table-card.available { border-top: 3px solid #10b981; }
    .table-card.occupied { border-top: 3px solid #f43f5e; }
    .table-card.reserved { border-top: 3px solid #f59e0b; }
    .table-card.maintenance { border-top: 3px solid #64748b; }

    .card-head {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .table-tag {
      display: flex;
      align-items: baseline;
      gap: 2px;
    }
    .tag-hash { color: #f59e0b; font-weight: 800; font-size: 0.9rem; }
    .tag-num { color: #ffffff; font-weight: 800; font-size: 1.25rem; }

    .status-badge {
      font-size: 0.68rem;
      font-weight: 800;
      padding: 3px 10px;
      border-radius: 9999px;
      letter-spacing: 0.05em;
    }
    .status-badge.available { background: rgba(16, 185, 129, 0.15); color: #34d399; border: 1px solid rgba(16, 185, 129, 0.3); }
    .status-badge.occupied { background: rgba(244, 63, 94, 0.15); color: #fb7185; border: 1px solid rgba(244, 63, 94, 0.3); }
    .status-badge.reserved { background: rgba(245, 158, 11, 0.15); color: #fbbf24; border: 1px solid rgba(245, 158, 11, 0.3); }
    .status-badge.maintenance { background: rgba(100, 116, 139, 0.2); color: #94a3b8; border: 1px solid rgba(100, 116, 139, 0.3); }

    /* Furniture Assembly & Chairs */
    .table-stage {
      height: 120px;
      background: rgba(13, 18, 31, 0.5);
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
    }

    .furniture-assembly {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .table-plate {
      position: relative;
      z-index: 2;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      background: #1a233a;
      border: 2px solid rgba(255, 255, 255, 0.12);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
      transition: all 0.2s ease;
    }

    .furniture-assembly.round .table-plate {
      width: 76px;
      height: 76px;
      border-radius: 50%;
    }
    .furniture-assembly.square .table-plate {
      width: 76px;
      height: 76px;
      border-radius: 14px;
    }
    .furniture-assembly.rectangle .table-plate {
      width: 140px;
      height: 70px;
      border-radius: 14px;
    }

    .furniture-assembly.available .table-plate {
      border-color: rgba(16, 185, 129, 0.5);
      background: linear-gradient(135deg, rgba(16, 185, 129, 0.15), #162035);
    }
    .furniture-assembly.occupied .table-plate {
      border-color: rgba(244, 63, 94, 0.5);
      background: linear-gradient(135deg, rgba(244, 63, 94, 0.15), #162035);
    }
    .furniture-assembly.reserved .table-plate {
      border-color: rgba(245, 158, 11, 0.5);
      background: linear-gradient(135deg, rgba(245, 158, 11, 0.15), #162035);
    }

    .plate-num {
      font-size: 0.95rem;
      font-weight: 800;
      color: #ffffff;
    }
    .plate-seats {
      font-size: 0.68rem;
      color: #94a3b8;
      font-weight: 600;
    }

    /* Decorative Chairs */
    .chair {
      position: absolute;
      width: 14px;
      height: 8px;
      background: #334155;
      border-radius: 3px;
      z-index: 1;
    }
    .chair.top { top: -11px; }
    .chair.bottom { bottom: -11px; }
    .chair.left { left: -11px; width: 8px; height: 14px; }
    .chair.right { right: -11px; width: 8px; height: 14px; }
    .chair.top-left { top: -11px; left: 25px; }
    .chair.top-right { top: -11px; right: 25px; }

    .furniture-assembly.available .chair { background: #10b981; }
    .furniture-assembly.occupied .chair { background: #f43f5e; }
    .furniture-assembly.reserved .chair { background: #f59e0b; }

    /* Card Meta */
    .card-meta {
      display: flex;
      justify-content: space-between;
      font-size: 0.8rem;
      color: #94a3b8;
    }
    .meta-section { color: #cbd5e1; font-weight: 600; }
    .meta-shape { color: #64748b; }

    /* Attached Diner Preview */
    .attached-info {
      background: rgba(13, 18, 31, 0.6);
      border-left: 3px solid #fbbf24;
      padding: 6px 10px;
      border-radius: 6px;
      display: flex;
      flex-direction: column;
      gap: 2px;
    }
    .att-name { font-size: 0.82rem; font-weight: 700; color: #ffffff; }
    .att-time { font-size: 0.72rem; color: #fbbf24; }

    /* Fast Action Buttons */
    .card-actions {
      display: flex;
      margin-top: 2px;
    }
    .action-btn {
      width: 100%;
      padding: 9px;
      border-radius: 8px;
      border: none;
      font-weight: 700;
      font-size: 0.82rem;
      cursor: pointer;
      transition: all 0.2s ease;
    }
    .btn-seat {
      background: linear-gradient(135deg, #f59e0b, #d97706);
      color: #0f172a;
    }
    .btn-seat:hover {
      box-shadow: 0 0 12px rgba(245, 158, 11, 0.4);
    }
    .btn-free {
      background: linear-gradient(135deg, #10b981, #059669);
      color: white;
    }
    .btn-free:hover {
      box-shadow: 0 0 12px rgba(16, 185, 129, 0.4);
    }

    /* Modal Backdrop & Glass Card */
    .modal-backdrop {
      position: fixed;
      inset: 0;
      background: rgba(8, 12, 20, 0.82);
      backdrop-filter: blur(8px);
      -webkit-backdrop-filter: blur(8px);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 2000;
      padding: 20px;
      animation: fadeIn 0.2s ease;
    }
    .modal-card {
      background: #141b2d;
      border: 1px solid rgba(255, 255, 255, 0.12);
      border-radius: 20px;
      width: 480px;
      max-width: 100%;
      padding: 1.75rem;
      display: flex;
      flex-direction: column;
      gap: 18px;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.6);
      animation: popUp 0.25s cubic-bezier(0.16, 1, 0.3, 1);
    }

    .modal-head {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
    }
    .modal-tag {
      font-size: 0.68rem;
      font-weight: 800;
      letter-spacing: 0.1em;
      color: #fbbf24;
    }
    .modal-title-group h3 {
      margin: 2px 0 0;
      font-family: 'Playfair Display', Georgia, serif;
      font-size: 1.4rem;
      color: #ffffff;
    }
    .modal-close {
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);
      color: #94a3b8;
      width: 32px;
      height: 32px;
      border-radius: 50%;
      font-size: 1.3rem;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      line-height: 1;
    }
    .modal-close:hover { color: #ffffff; background: rgba(255, 255, 255, 0.12); }

    .modal-body { display: flex; flex-direction: column; gap: 14px; }

    .stat-pills-row {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 10px;
    }
    .modal-stat-pill {
      background: rgba(13, 18, 31, 0.6);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 10px;
      padding: 8px 12px;
      text-align: center;
      display: flex;
      flex-direction: column;
      gap: 2px;
    }
    .stat-lbl { font-size: 0.65rem; color: #64748b; text-transform: uppercase; font-weight: 700; }
    .modal-stat-pill strong { font-size: 0.88rem; color: #f8fafc; }

    .current-status-banner {
      padding: 10px 14px;
      border-radius: 10px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 0.85rem;
      font-weight: 700;
    }
    .current-status-banner.available { background: rgba(16, 185, 129, 0.15); color: #34d399; border: 1px solid rgba(16, 185, 129, 0.3); }
    .current-status-banner.occupied { background: rgba(244, 63, 94, 0.15); color: #fb7185; border: 1px solid rgba(244, 63, 94, 0.3); }
    .current-status-banner.reserved { background: rgba(245, 158, 11, 0.15); color: #fbbf24; border: 1px solid rgba(245, 158, 11, 0.3); }
    .current-status-banner.maintenance { background: rgba(100, 116, 139, 0.2); color: #94a3b8; border: 1px solid rgba(100, 116, 139, 0.3); }

    .linked-booking-box {
      background: rgba(13, 18, 31, 0.7);
      border: 1px solid rgba(245, 158, 11, 0.3);
      border-radius: 12px;
      padding: 12px 14px;
      display: flex;
      flex-direction: column;
      gap: 4px;
    }
    .booking-head {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 0.68rem;
      color: #fbbf24;
      font-weight: 800;
      letter-spacing: 0.05em;
    }
    .time-pill {
      background: rgba(245, 158, 11, 0.18);
      padding: 2px 6px;
      border-radius: 4px;
    }
    .linked-booking-box h4 {
      margin: 2px 0 0;
      color: #ffffff;
      font-size: 1.05rem;
    }
    .linked-booking-box p {
      margin: 0;
      font-size: 0.8rem;
      color: #94a3b8;
    }
    .special-req { color: #fb7185 !important; font-style: italic; }

    .modal-actions-list {
      display: flex;
      flex-direction: column;
      gap: 8px;
      margin-top: 6px;
    }
    .modal-act-btn {
      padding: 12px;
      border-radius: 10px;
      border: none;
      font-weight: 700;
      font-size: 0.88rem;
      cursor: pointer;
      transition: all 0.15s ease;
    }
    .seat-btn {
      background: linear-gradient(135deg, #f59e0b, #d97706);
      color: #0f172a;
    }
    .free-btn {
      background: linear-gradient(135deg, #10b981, #059669);
      color: #ffffff;
    }
    .maint-btn {
      background: #334155;
      color: #cbd5e1;
    }

    @keyframes popUp {
      from { opacity: 0; transform: scale(0.95); }
      to { opacity: 1; transform: scale(1); }
    }
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
  `]
})
export class TablesComponent {
  private restaurantService = inject(RestaurantService);
  tables$ = this.restaurantService.tables$;

  selectedSection = 'all';
  selectedCapacity = 0;
  selectedTable: Table | null = null;

  sections = [
    { id: 'all', name: 'All Dining Areas' },
    { id: 'main', name: 'Main Dining Hall' },
    { id: 'patio', name: 'Garden Patio' },
    { id: 'rooftop', name: 'Rooftop Terrace' },
    { id: 'vip', name: 'VIP Lounge' }
  ];

  capacities = [0, 2, 4, 6, 8];

  getSectionLabel(secId: string): string {
    const found = this.sections.find(s => s.id === secId);
    return found ? found.name : secId;
  }

  filterTables(tables: Table[]): Table[] {
    return tables.filter(t => {
      const matchSection = this.selectedSection === 'all' || t.section === this.selectedSection;
      const matchCap = this.selectedCapacity === 0 || t.capacity >= this.selectedCapacity;
      return matchSection && matchCap;
    });
  }

  openTableModal(t: Table): void {
    this.selectedTable = t;
  }

  getReservationForTable(table: Table): Reservation | undefined {
    let list: Reservation[] = [];
    this.restaurantService.reservations$.subscribe(r => list = r).unsubscribe();
    return list.find(r => r.tableId === table.id || r.id === table.currentReservationId);
  }

  updateStatus(id: string, status: 'available' | 'occupied' | 'reserved' | 'maintenance'): void {
    this.restaurantService.updateTableStatus(id, status);
  }
}
