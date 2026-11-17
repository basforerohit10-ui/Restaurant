import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RestaurantService } from '../../services/restaurant.service';
import { Table } from '../../models/restaurant.model';

@Component({
  selector: 'app-tables',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="tables-page">
      <div class="header">
        <div>
          <h2>Dining Floor Layout (Angular)</h2>
          <p>Real-time table seating capacity, chair allocations, and service status.</p>
        </div>
      </div>

      <!-- Section Filter Pills -->
      <div class="filters">
        <button
          *ngFor="let sec of sections"
          class="sec-btn"
          [class.active]="selectedSection === sec.id"
          (click)="selectedSection = sec.id"
        >
          {{ sec.name }}
        </button>
      </div>

      <!-- Tables Grid -->
      <div class="tables-grid" *ngIf="(tables$ | async) as allTables">
        <div
          class="table-card"
          *ngFor="let t of filterTables(allTables)"
          [class]="t.status"
        >
          <div class="card-top">
            <span class="table-id">T-{{ t.number }}</span>
            <span class="status-badge" [class]="t.status">{{ t.status | uppercase }}</span>
          </div>

          <div class="visual-table" [class]="t.shape">
            <div class="center-content">
              <strong>#{{ t.number }}</strong>
              <span>👥 {{ t.capacity }}p</span>
            </div>
          </div>

          <div class="card-meta">
            <span>Area: {{ t.section }}</span>
            <span>Shape: {{ t.shape }}</span>
          </div>

          <div class="card-actions">
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
    </div>
  `,
  styles: [`
    .tables-page { display: flex; flex-direction: column; gap: 20px; }
    .header h2 { margin: 0 0 4px; color: #f8fafc; font-size: 1.5rem; }
    .header p { margin: 0; color: #94a3b8; font-size: 0.88rem; }
    .filters {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
      background: #1e293b;
      padding: 12px;
      border-radius: 12px;
      border: 1px solid rgba(255, 255, 255, 0.08);
    }
    .sec-btn {
      background: rgba(15, 23, 42, 0.6);
      border: 1px solid rgba(255, 255, 255, 0.08);
      color: #94a3b8;
      padding: 6px 14px;
      border-radius: 8px;
      font-size: 0.82rem;
      font-weight: 500;
      cursor: pointer;
    }
    .sec-btn.active {
      background: rgba(225, 29, 72, 0.2);
      border-color: #e11d48;
      color: #f8fafc;
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
      padding: 1.25rem;
      display: flex;
      flex-direction: column;
      gap: 12px;
      border-left: 4px solid #10b981;
    }
    .table-card.occupied { border-left-color: #ef4444; }
    .table-card.reserved { border-left-color: #f59e0b; }
    .table-card.maintenance { border-left-color: #6b7280; opacity: 0.8; }
    .card-top {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .table-id { font-size: 1.1rem; font-weight: 800; color: #f8fafc; }
    .status-badge {
      font-size: 0.68rem;
      font-weight: 700;
      padding: 2px 7px;
      border-radius: 9999px;
      background: rgba(16, 185, 129, 0.15);
      color: #10b981;
    }
    .status-badge.occupied { background: rgba(239, 68, 68, 0.15); color: #ef4444; }
    .status-badge.reserved { background: rgba(245, 158, 11, 0.15); color: #f59e0b; }
    .status-badge.maintenance { background: rgba(107, 114, 128, 0.15); color: #9ca3af; }
    .visual-table {
      height: 80px;
      background: rgba(15, 23, 42, 0.6);
      border: 2px solid rgba(255, 255, 255, 0.1);
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 4px 0;
    }
    .visual-table.round { border-radius: 50%; width: 80px; margin: 4px auto; }
    .center-content { text-align: center; display: flex; flex-direction: column; }
    .center-content strong { color: #f8fafc; font-size: 0.95rem; }
    .center-content span { color: #94a3b8; font-size: 0.75rem; }
    .card-meta {
      display: flex;
      justify-content: space-between;
      font-size: 0.75rem;
      color: #94a3b8;
      text-transform: capitalize;
    }
    .card-actions {
      display: flex;
      gap: 8px;
    }
    .btn-action {
      flex: 1;
      padding: 8px;
      border-radius: 8px;
      border: none;
      font-size: 0.8rem;
      font-weight: 600;
      cursor: pointer;
    }
    .btn-seat { background: #10b981; color: white; }
    .btn-free { background: #3b82f6; color: white; }
  `]
})
export class TablesComponent {
  private restaurantService = inject(RestaurantService);
  tables$ = this.restaurantService.tables$;
  selectedSection = 'all';

  sections = [
    { id: 'all', name: 'All Areas' },
    { id: 'main', name: 'Main Dining Hall' },
    { id: 'patio', name: 'Garden Patio' },
    { id: 'rooftop', name: 'Rooftop Terrace' },
    { id: 'vip', name: 'VIP Lounge' }
  ];

  filterTables(tables: Table[]): Table[] {
    if (this.selectedSection === 'all') return tables;
    return tables.filter(t => t.section === this.selectedSection);
  }

  updateStatus(tableId: string, status: Table['status']) {
    this.restaurantService.updateTableStatus(tableId, status);
  }
}
