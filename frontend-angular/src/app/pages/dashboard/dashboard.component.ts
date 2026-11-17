import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { RestaurantService } from '../../services/restaurant.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="dashboard-page">
      <div class="banner">
        <h2>AuraBistro Floor Control (Angular)</h2>
        <p>Real-time table seating availability, bookings timeline, and walk-in intake.</p>
      </div>

      <!-- Metrics Row -->
      <div class="metrics-grid">
        <div class="metric-card">
          <span class="label">Floor Occupancy</span>
          <h3>{{ metrics.occupancyRate }}%</h3>
          <span class="sub">{{ metrics.occupiedTables + metrics.reservedTables }} of {{ metrics.totalTables }} tables</span>
        </div>

        <div class="metric-card">
          <span class="label">Open Tables</span>
          <h3 style="color: #10b981;">{{ metrics.availableTables }}</h3>
          <span class="sub">Ready for walk-ins</span>
        </div>

        <div class="metric-card">
          <span class="label">Active Diners</span>
          <h3 style="color: #38bdf8;">{{ metrics.totalSeatedGuests }}</h3>
          <span class="sub">Across {{ metrics.seatedCount }} seated tables</span>
        </div>

        <div class="metric-card">
          <span class="label">Total Reservations</span>
          <h3 style="color: #a855f7;">{{ metrics.totalReservations }}</h3>
          <span class="sub">{{ metrics.totalExpectedGuests }} expected today</span>
        </div>
      </div>

      <!-- Content Split: Schedule & Tables -->
      <div class="content-split">
        <div class="panel">
          <div class="panel-header">
            <h3>📅 Today's Bookings Schedule</h3>
            <a routerLink="/reservations" class="link-more">View All →</a>
          </div>

          <div class="reservations-list" *ngIf="(reservations$ | async) as resList">
            <div class="res-item" *ngFor="let res of resList.slice(0, 5)">
              <div class="time-badge">{{ res.time }}</div>
              <div class="res-info">
                <strong>{{ res.guestName }}</strong>
                <span>Party of {{ res.partySize }} • {{ res.occasion || 'Dining' }}</span>
              </div>
              <div class="status-pill" [class]="res.status">{{ res.status | uppercase }}</div>
            </div>
          </div>
        </div>

        <div class="panel">
          <div class="panel-header">
            <h3>🪑 Floor Status Preview</h3>
            <a routerLink="/tables" class="link-more">Manage Floor →</a>
          </div>

          <div class="tables-preview" *ngIf="(tables$ | async) as tableList">
            <div class="table-chip" *ngFor="let t of tableList.slice(0, 8)" [class]="t.status">
              <strong>T-{{ t.number }}</strong>
              <span>{{ t.capacity }}p • {{ t.status }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-page {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }
    .banner {
      background: linear-gradient(135deg, rgba(225, 29, 72, 0.15), rgba(30, 41, 59, 0.6));
      border: 1px solid rgba(225, 29, 72, 0.3);
      border-radius: 16px;
      padding: 1.5rem 2rem;
    }
    .banner h2 { margin: 0 0 4px; color: #f8fafc; font-size: 1.6rem; }
    .banner p { margin: 0; color: #94a3b8; font-size: 0.88rem; }
    .metrics-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 16px;
    }
    .metric-card {
      background: #1e293b;
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 14px;
      padding: 1.25rem;
      display: flex;
      flex-direction: column;
      gap: 6px;
    }
    .metric-card .label { font-size: 0.75rem; color: #94a3b8; text-transform: uppercase; font-weight: 700; }
    .metric-card h3 { margin: 0; font-size: 1.8rem; font-weight: 800; color: #f8fafc; }
    .metric-card .sub { font-size: 0.75rem; color: #64748b; }
    .content-split {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(360px, 1fr));
      gap: 20px;
    }
    .panel {
      background: #1e293b;
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 14px;
      padding: 1.25rem;
    }
    .panel-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 14px;
    }
    .panel-header h3 { margin: 0; color: #f8fafc; font-size: 1rem; }
    .link-more { color: #fb7185; text-decoration: none; font-size: 0.8rem; font-weight: 600; }
    .res-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 10px;
      background: rgba(15, 23, 42, 0.5);
      border-radius: 8px;
      margin-bottom: 8px;
    }
    .time-badge {
      background: rgba(225, 29, 72, 0.15);
      color: #fb7185;
      font-weight: 700;
      padding: 4px 8px;
      border-radius: 6px;
      font-size: 0.8rem;
    }
    .res-info {
      flex: 1;
      margin: 0 12px;
      display: flex;
      flex-direction: column;
    }
    .res-info strong { color: #f8fafc; font-size: 0.85rem; }
    .res-info span { color: #94a3b8; font-size: 0.75rem; }
    .status-pill {
      font-size: 0.7rem;
      font-weight: 700;
      padding: 3px 8px;
      border-radius: 9999px;
    }
    .status-pill.seated { background: rgba(16, 185, 129, 0.15); color: #10b981; }
    .status-pill.confirmed { background: rgba(59, 130, 246, 0.15); color: #3b82f6; }
    .status-pill.pending { background: rgba(245, 158, 11, 0.15); color: #f59e0b; }
    .tables-preview {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(130px, 1fr));
      gap: 10px;
    }
    .table-chip {
      background: rgba(15, 23, 42, 0.6);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 8px;
      padding: 10px;
      display: flex;
      flex-direction: column;
      gap: 2px;
      text-align: center;
    }
    .table-chip.available { border-color: #10b981; }
    .table-chip.occupied { border-color: #ef4444; }
    .table-chip.reserved { border-color: #f59e0b; }
    .table-chip strong { color: #f8fafc; font-size: 0.95rem; }
    .table-chip span { color: #94a3b8; font-size: 0.72rem; text-transform: capitalize; }
  `]
})
export class DashboardComponent {
  private restaurantService = inject(RestaurantService);
  metrics = this.restaurantService.getMetrics();
  reservations$ = this.restaurantService.reservations$;
  tables$ = this.restaurantService.tables$;
}
