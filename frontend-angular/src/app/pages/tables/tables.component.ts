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
      <div class="header">
        <div>
          <h2>Dining Floor Layout &amp; Table Management (Angular)</h2>
          <p>Real-time visual table statuses, seating allocations, and floor turnaround control.</p>
        </div>
        <div class="legend">
          <span class="legend-item"><span class="dot available"></span> Available</span>
          <span class="legend-item"><span class="dot occupied"></span> Occupied</span>
          <span class="legend-item"><span class="dot reserved"></span> Reserved</span>
          <span class="legend-item"><span class="dot maintenance"></span> Maintenance</span>
        </div>
      </div>

      <!-- Filters Row -->
      <div class="filters-row">
        <!-- Section Filter Pills -->
        <div class="filters-group">
          <span class="filter-label">Section:</span>
          <div class="pill-buttons">
            <button
              *ngFor="let sec of sections"
              class="sec-btn"
              [class.active]="selectedSection === sec.id"
              (click)="selectedSection = sec.id"
            >
              {{ sec.name }}
            </button>
          </div>
        </div>

        <!-- Capacity Filter -->
        <div class="filters-group">
          <span class="filter-label">Capacity:</span>
          <div class="pill-buttons">
            <button
              *ngFor="let cap of capacities"
              class="sec-btn"
              [class.active]="selectedCapacity === cap"
              (click)="selectedCapacity = cap"
            >
              {{ cap === 0 ? 'All Sizes' : cap + '+ Guests' }}
            </button>
          </div>
        </div>
      </div>

      <!-- Tables Grid -->
      <div class="tables-grid" *ngIf="(tables$ | async) as allTables">
        <div
          class="table-card"
          *ngFor="let t of filterTables(allTables)"
          [class]="t.status"
          (click)="openTableModal(t)"
        >
          <div class="card-top">
            <span class="table-id">T-{{ t.number }}</span>
            <span class="status-badge" [class]="t.status">{{ t.status | uppercase }}</span>
          </div>

          <div class="visual-table" [class]="t.shape" [class]="t.status">
            <div class="center-content">
              <strong>#{{ t.number }}</strong>
              <span>👥 {{ t.capacity }} Seats</span>
            </div>
          </div>

          <div class="card-meta">
            <span>📍 {{ getSectionLabel(t.section) }}</span>
            <span>Shape: {{ t.shape | titlecase }}</span>
          </div>

          <div class="card-actions" (click)="$event.stopPropagation()">
            <button
              *ngIf="t.status === 'available'"
              class="btn-action btn-seat"
              (click)="updateStatus(t.id, 'occupied')"
            >
              Seat Walk-In
            </button>
            <button
              *ngIf="t.status === 'occupied'"
              class="btn-action btn-free"
              (click)="updateStatus(t.id, 'available')"
            >
              Clear Table
            </button>
            <button
              *ngIf="t.status === 'reserved'"
              class="btn-action btn-seat"
              (click)="updateStatus(t.id, 'occupied')"
            >
              Seat Reserved
            </button>
            <button
              *ngIf="t.status === 'maintenance'"
              class="btn-action btn-free"
              (click)="updateStatus(t.id, 'available')"
            >
              Restore Table
            </button>
          </div>
        </div>
      </div>

      <!-- Table Detail Modal -->
      <div class="modal-backdrop" *ngIf="selectedTable" (click)="selectedTable = null">
        <div class="modal-box" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <h3>Table T-{{ selectedTable.number }} Details</h3>
            <button class="btn-close" (click)="selectedTable = null">×</button>
          </div>

          <div class="modal-body">
            <div class="detail-row">
              <span class="lbl">Area / Section:</span>
              <strong>{{ getSectionLabel(selectedTable.section) }}</strong>
            </div>
            <div class="detail-row">
              <span class="lbl">Seating Capacity:</span>
              <strong>{{ selectedTable.capacity }} Guests</strong>
            </div>
            <div class="detail-row">
              <span class="lbl">Physical Shape:</span>
              <strong>{{ selectedTable.shape | titlecase }} Table</strong>
            </div>
            <div class="detail-row">
              <span class="lbl">Current Status:</span>
              <span class="status-badge" [class]="selectedTable.status">{{ selectedTable.status | uppercase }}</span>
            </div>

            <div class="res-attached" *ngIf="getReservationForTable(selectedTable) as res">
              <h4>Linked Dining Reservation</h4>
              <p><strong>Guest:</strong> {{ res.guestName }}</p>
              <p><strong>Party Size:</strong> {{ res.partySize }} guests</p>
              <p><strong>Time:</strong> {{ res.time }} ({{ res.status | uppercase }})</p>
              <p *ngIf="res.phone"><strong>Phone:</strong> {{ res.phone }}</p>
            </div>

            <div class="modal-actions-grid">
              <button
                class="act-btn seat"
                *ngIf="selectedTable.status !== 'occupied'"
                (click)="updateStatus(selectedTable.id, 'occupied'); selectedTable = null"
              >
                Seat Walk-In Party
              </button>
              <button
                class="act-btn free"
                *ngIf="selectedTable.status !== 'available'"
                (click)="updateStatus(selectedTable.id, 'available'); selectedTable = null"
              >
                Mark Clean &amp; Available
              </button>
              <button
                class="act-btn maint"
                *ngIf="selectedTable.status !== 'maintenance'"
                (click)="updateStatus(selectedTable.id, 'maintenance'); selectedTable = null"
              >
                Set Out of Order
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .tables-page { display: flex; flex-direction: column; gap: 20px; }
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 12px;
    }
    .header h2 { margin: 0 0 4px; color: #f8fafc; font-size: 1.5rem; }
    .header p { margin: 0; color: #94a3b8; font-size: 0.88rem; }
    .legend {
      display: flex;
      gap: 14px;
      font-size: 0.8rem;
      color: #94a3b8;
    }
    .legend-item { display: flex; align-items: center; gap: 6px; }
    .dot { width: 8px; height: 8px; border-radius: 50%; }
    .dot.available { background: #10b981; }
    .dot.occupied { background: #e11d48; }
    .dot.reserved { background: #f59e0b; }
    .dot.maintenance { background: #64748b; }

    .filters-row {
      display: flex;
      gap: 20px;
      flex-wrap: wrap;
      background: #1e293b;
      padding: 12px 16px;
      border-radius: 12px;
      border: 1px solid rgba(255, 255, 255, 0.08);
    }
    .filters-group { display: flex; align-items: center; gap: 10px; }
    .filter-label { font-size: 0.78rem; font-weight: 700; color: #94a3b8; text-transform: uppercase; }
    .pill-buttons { display: flex; gap: 6px; flex-wrap: wrap; }
    .sec-btn {
      background: #0f172a;
      border: 1px solid rgba(255, 255, 255, 0.1);
      color: #94a3b8;
      padding: 6px 12px;
      border-radius: 6px;
      font-size: 0.8rem;
      cursor: pointer;
      transition: all 0.15s ease;
    }
    .sec-btn:hover { color: #f8fafc; }
    .sec-btn.active {
      background: #e11d48;
      color: white;
      border-color: #e11d48;
      font-weight: 600;
    }

    .tables-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
      gap: 16px;
    }
    .table-card {
      background: #1e293b;
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 14px;
      padding: 1.2rem;
      display: flex;
      flex-direction: column;
      gap: 12px;
      cursor: pointer;
      transition: transform 0.2s ease, border-color 0.2s ease;
    }
    .table-card:hover {
      transform: translateY(-2px);
      border-color: rgba(255, 255, 255, 0.2);
    }
    .table-card.available { border-top: 3px solid #10b981; }
    .table-card.occupied { border-top: 3px solid #e11d48; }
    .table-card.reserved { border-top: 3px solid #f59e0b; }
    .table-card.maintenance { border-top: 3px solid #64748b; }

    .card-top { display: flex; justify-content: space-between; align-items: center; }
    .table-id { font-size: 1.1rem; font-weight: 800; color: #f8fafc; }
    .status-badge {
      font-size: 0.7rem;
      font-weight: 700;
      padding: 2px 8px;
      border-radius: 9999px;
    }
    .status-badge.available { background: rgba(16, 185, 129, 0.15); color: #10b981; }
    .status-badge.occupied { background: rgba(225, 29, 72, 0.15); color: #fb7185; }
    .status-badge.reserved { background: rgba(245, 158, 11, 0.15); color: #f59e0b; }
    .status-badge.maintenance { background: rgba(100, 116, 139, 0.2); color: #94a3b8; }

    .visual-table {
      height: 90px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #0f172a;
      border: 2px dashed rgba(255, 255, 255, 0.12);
      transition: all 0.2s ease;
    }
    .visual-table.round { border-radius: 50%; width: 90px; margin: 0 auto; }
    .visual-table.square { border-radius: 12px; width: 90px; margin: 0 auto; }
    .visual-table.rectangle { border-radius: 12px; width: 100%; }
    .visual-table.available { border-color: rgba(16, 185, 129, 0.4); background: rgba(16, 185, 129, 0.05); }
    .visual-table.occupied { border-color: rgba(225, 29, 72, 0.4); background: rgba(225, 29, 72, 0.08); }
    .visual-table.reserved { border-color: rgba(245, 158, 11, 0.4); background: rgba(245, 158, 11, 0.06); }

    .center-content { text-align: center; display: flex; flex-direction: column; }
    .center-content strong { font-size: 1rem; color: #f8fafc; }
    .center-content span { font-size: 0.72rem; color: #94a3b8; }

    .card-meta { display: flex; justify-content: space-between; font-size: 0.78rem; color: #64748b; }
    .card-actions { display: flex; margin-top: 4px; }
    .btn-action {
      width: 100%;
      padding: 8px;
      border-radius: 6px;
      border: none;
      font-weight: 600;
      font-size: 0.8rem;
      cursor: pointer;
    }
    .btn-seat { background: #e11d48; color: white; }
    .btn-free { background: #10b981; color: white; }

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
      width: 440px;
      max-width: 90vw;
      padding: 1.5rem;
      display: flex;
      flex-direction: column;
      gap: 16px;
    }
    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .modal-header h3 { margin: 0; color: #f8fafc; }
    .btn-close {
      background: transparent;
      border: none;
      color: #94a3b8;
      font-size: 1.4rem;
      cursor: pointer;
    }
    .modal-body { display: flex; flex-direction: column; gap: 12px; }
    .detail-row { display: flex; justify-content: space-between; font-size: 0.88rem; color: #cbd5e1; }
    .detail-row .lbl { color: #94a3b8; }

    .res-attached {
      background: rgba(15, 23, 42, 0.6);
      border-left: 3px solid #f59e0b;
      padding: 10px 12px;
      border-radius: 6px;
    }
    .res-attached h4 { margin: 0 0 6px; color: #f59e0b; font-size: 0.85rem; text-transform: uppercase; }
    .res-attached p { margin: 2px 0; font-size: 0.8rem; color: #cbd5e1; }

    .modal-actions-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 8px;
      margin-top: 8px;
    }
    .act-btn {
      padding: 10px;
      border-radius: 8px;
      border: none;
      font-weight: 600;
      cursor: pointer;
      font-size: 0.85rem;
    }
    .act-btn.seat { background: #e11d48; color: white; }
    .act-btn.free { background: #10b981; color: white; }
    .act-btn.maint { background: #475569; color: #f8fafc; }
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
