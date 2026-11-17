import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { RestaurantService } from '../../services/restaurant.service';
import { RestaurantMetrics } from '../../models/restaurant.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="dashboard-page">
      <!-- Luxury Welcome Banner -->
      <div class="hero-banner">
        <div class="banner-content">
          <div class="banner-tag">FINE DINING OPERATIONAL SUITE</div>
          <h2>Floor Control &amp; Seating Analytics</h2>
          <p>Real-time dining room occupancy, reservations intake timeline, and walk-in queue management.</p>
        </div>
        <div class="banner-actions">
          <a routerLink="/tables" class="btn-hero-primary">🪑 Floor Plan</a>
          <a routerLink="/reservations" class="btn-hero-secondary">+ New Booking</a>
        </div>
      </div>

      <!-- 4 High-Impact KPI Glass Cards -->
      <div class="metrics-grid">
        <!-- Metric 1: Occupancy -->
        <div class="kpi-card gold-kpi">
          <div class="kpi-top">
            <span class="kpi-label">FLOOR OCCUPANCY</span>
            <div class="kpi-icon-box gold-icon">📈</div>
          </div>
          <div class="kpi-main">
            <h3>{{ metrics.occupancyRate }}%</h3>
            <span class="trend-pill gold-trend">Capacity</span>
          </div>
          <div class="progress-bar">
            <div class="progress-fill gold-fill" [style.width.%]="metrics.occupancyRate"></div>
          </div>
          <span class="kpi-sub">{{ metrics.occupiedTables + metrics.reservedTables }} of {{ metrics.totalTables }} tables allocated</span>
        </div>

        <!-- Metric 2: Available Tables -->
        <div class="kpi-card emerald-kpi">
          <div class="kpi-top">
            <span class="kpi-label">AVAILABLE TABLES</span>
            <div class="kpi-icon-box emerald-icon">🪑</div>
          </div>
          <div class="kpi-main">
            <h3 class="emerald-num">{{ metrics.availableTables }}</h3>
            <span class="trend-pill emerald-trend">Open Now</span>
          </div>
          <div class="progress-bar">
            <div class="progress-fill emerald-fill" [style.width.%]="(metrics.availableTables / (metrics.totalTables || 1)) * 100"></div>
          </div>
          <span class="kpi-sub">Ready for walk-in diner intake</span>
        </div>

        <!-- Metric 3: Active Diners -->
        <div class="kpi-card sky-kpi">
          <div class="kpi-top">
            <span class="kpi-label">ACTIVE DINERS</span>
            <div class="kpi-icon-box sky-icon">👥</div>
          </div>
          <div class="kpi-main">
            <h3 class="sky-num">{{ metrics.totalSeatedGuests }}</h3>
            <span class="trend-pill sky-trend">Seated</span>
          </div>
          <div class="progress-bar">
            <div class="progress-fill sky-fill" [style.width.%]="70"></div>
          </div>
          <span class="kpi-sub">Across {{ metrics.seatedCount }} currently dining tables</span>
        </div>

        <!-- Metric 4: Expected Covers -->
        <div class="kpi-card purple-kpi">
          <div class="kpi-top">
            <span class="kpi-label">TOTAL DAILY COVERS</span>
            <div class="kpi-icon-box purple-icon">🍷</div>
          </div>
          <div class="kpi-main">
            <h3 class="purple-num">{{ metrics.totalExpectedGuests }}</h3>
            <span class="trend-pill purple-trend">{{ metrics.totalReservations }} Bookings</span>
          </div>
          <div class="progress-bar">
            <div class="progress-fill purple-fill" [style.width.%]="85"></div>
          </div>
          <span class="kpi-sub">Confirmed &amp; seated dinner reservations</span>
        </div>
      </div>

      <!-- Operational Split: Schedule & Floor Preview -->
      <div class="content-split">
        <!-- Left: Reservations Feed -->
        <div class="panel">
          <div class="panel-header">
            <div>
              <h3>📅 Today's Bookings Schedule</h3>
              <p class="panel-sub">Upcoming arrivals and active dinner table seatings.</p>
            </div>
            <a routerLink="/reservations" class="link-more">View All Bookings →</a>
          </div>

          <div class="reservations-list" *ngIf="(reservations$ | async) as resList">
            <div class="res-item" *ngFor="let res of resList.slice(0, 5)">
              <div class="time-badge">
                <span class="clock-icon">🕒</span>
                <span>{{ res.time }}</span>
              </div>
              <div class="res-info">
                <div class="guest-name-row">
                  <strong>{{ res.guestName }}</strong>
                  <span class="occasion-tag" *ngIf="res.occasion">{{ res.occasion }}</span>
                </div>
                <span class="guest-meta">Party of {{ res.partySize }} • {{ res.tableId ? 'Table ' + res.tableId : 'Table Unassigned' }}</span>
              </div>
              <div class="status-pill" [class]="res.status">
                {{ res.status | uppercase }}
              </div>
            </div>
          </div>
        </div>

        <!-- Right: Floor Snapshot Preview -->
        <div class="panel">
          <div class="panel-header">
            <div>
              <h3>🪑 Floor Status Snapshot</h3>
              <p class="panel-sub">Real-time table layout preview and capacity allocations.</p>
            </div>
            <a routerLink="/tables" class="link-more">Open Floor Plan →</a>
          </div>

          <div class="tables-preview" *ngIf="(tables$ | async) as tableList">
            <div class="table-chip" *ngFor="let t of tableList.slice(0, 10)" [class]="t.status">
              <div class="chip-top">
                <strong>T-{{ t.number }}</strong>
                <span class="chip-status-dot"></span>
              </div>
              <span class="chip-seats">{{ t.capacity }} Seats</span>
              <span class="chip-status">{{ t.status | titlecase }}</span>
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
      gap: 24px;
    }

    /* Hero Banner */
    .hero-banner {
      background: linear-gradient(135deg, rgba(30, 41, 59, 0.7), rgba(15, 23, 42, 0.95)),
                  radial-gradient(at 100% 0%, rgba(245, 158, 11, 0.15), transparent 50%);
      border: 1px solid rgba(245, 158, 11, 0.25);
      border-radius: 20px;
      padding: 2rem 2.5rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 20px;
      box-shadow: 0 10px 30px -10px rgba(0, 0, 0, 0.5);
    }
    @media (max-width: 900px) {
      .hero-banner { flex-direction: column; align-items: flex-start; }
    }

    .banner-tag {
      font-size: 0.72rem;
      font-weight: 800;
      letter-spacing: 0.12em;
      color: #fbbf24;
      margin-bottom: 6px;
    }
    .hero-banner h2 {
      margin: 0 0 6px;
      font-family: 'Playfair Display', Georgia, serif;
      font-size: 1.85rem;
      font-weight: 700;
      color: #ffffff;
      letter-spacing: 0.02em;
    }
    .hero-banner p {
      margin: 0;
      color: #94a3b8;
      font-size: 0.95rem;
      max-width: 600px;
    }

    .banner-actions {
      display: flex;
      gap: 12px;
      flex-shrink: 0;
    }
    .btn-hero-primary {
      background: linear-gradient(135deg, #f59e0b, #d97706);
      color: #0f172a;
      text-decoration: none;
      font-weight: 700;
      font-size: 0.88rem;
      padding: 10px 20px;
      border-radius: 10px;
      box-shadow: 0 4px 14px rgba(245, 158, 11, 0.3);
      transition: all 0.2s ease;
    }
    .btn-hero-primary:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(245, 158, 11, 0.45);
    }
    .btn-hero-secondary {
      background: rgba(255, 255, 255, 0.06);
      border: 1px solid rgba(255, 255, 255, 0.15);
      color: #f8fafc;
      text-decoration: none;
      font-weight: 600;
      font-size: 0.88rem;
      padding: 10px 18px;
      border-radius: 10px;
      transition: all 0.2s ease;
    }
    .btn-hero-secondary:hover {
      background: rgba(255, 255, 255, 0.12);
      border-color: rgba(255, 255, 255, 0.25);
    }

    /* KPI Cards */
    .metrics-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
      gap: 18px;
    }

    .kpi-card {
      background: rgba(20, 27, 45, 0.72);
      backdrop-filter: blur(12px);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 18px;
      padding: 1.5rem;
      display: flex;
      flex-direction: column;
      gap: 10px;
      transition: transform 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease;
      position: relative;
      overflow: hidden;
    }
    .kpi-card:hover {
      transform: translateY(-3px);
      border-color: rgba(255, 255, 255, 0.18);
      box-shadow: 0 12px 28px -8px rgba(0, 0, 0, 0.5);
    }

    .kpi-top {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .kpi-label {
      font-size: 0.72rem;
      font-weight: 800;
      letter-spacing: 0.08em;
      color: #94a3b8;
    }
    .kpi-icon-box {
      width: 36px;
      height: 36px;
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.1rem;
    }
    .gold-icon { background: rgba(245, 158, 11, 0.15); border: 1px solid rgba(245, 158, 11, 0.3); }
    .emerald-icon { background: rgba(16, 185, 129, 0.15); border: 1px solid rgba(16, 185, 129, 0.3); }
    .sky-icon { background: rgba(56, 189, 248, 0.15); border: 1px solid rgba(56, 189, 248, 0.3); }
    .purple-icon { background: rgba(168, 85, 247, 0.15); border: 1px solid rgba(168, 85, 247, 0.3); }

    .kpi-main {
      display: flex;
      align-items: baseline;
      justify-content: space-between;
    }
    .kpi-main h3 {
      margin: 0;
      font-size: 2.1rem;
      font-weight: 800;
      color: #ffffff;
      line-height: 1;
    }
    .emerald-num { color: #34d399 !important; }
    .sky-num { color: #38bdf8 !important; }
    .purple-num { color: #c084fc !important; }

    .trend-pill {
      font-size: 0.72rem;
      font-weight: 700;
      padding: 3px 8px;
      border-radius: 9999px;
    }
    .gold-trend { background: rgba(245, 158, 11, 0.15); color: #fbbf24; }
    .emerald-trend { background: rgba(16, 185, 129, 0.15); color: #34d399; }
    .sky-trend { background: rgba(56, 189, 248, 0.15); color: #38bdf8; }
    .purple-trend { background: rgba(168, 85, 247, 0.15); color: #c084fc; }

    .progress-bar {
      height: 6px;
      background: rgba(255, 255, 255, 0.08);
      border-radius: 9999px;
      overflow: hidden;
      margin-top: 4px;
    }
    .progress-fill { height: 100%; border-radius: 9999px; }
    .gold-fill { background: linear-gradient(90deg, #f59e0b, #fbbf24); }
    .emerald-fill { background: linear-gradient(90deg, #10b981, #34d399); }
    .sky-fill { background: linear-gradient(90deg, #0284c7, #38bdf8); }
    .purple-fill { background: linear-gradient(90deg, #9333ea, #c084fc); }

    .kpi-sub {
      font-size: 0.75rem;
      color: #64748b;
      font-weight: 500;
    }

    /* Content Split */
    .content-split {
      display: grid;
      grid-template-columns: 1.2fr 1fr;
      gap: 20px;
    }
    @media (max-width: 1000px) {
      .content-split { grid-template-columns: 1fr; }
    }

    .panel {
      background: rgba(20, 27, 45, 0.72);
      backdrop-filter: blur(12px);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 20px;
      padding: 1.6rem;
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .panel-header {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
    }
    .panel-header h3 {
      margin: 0 0 2px;
      color: #ffffff;
      font-size: 1.15rem;
      font-weight: 700;
    }
    .panel-sub {
      margin: 0;
      color: #94a3b8;
      font-size: 0.8rem;
    }
    .link-more {
      color: #fbbf24;
      text-decoration: none;
      font-size: 0.82rem;
      font-weight: 700;
      transition: color 0.15s ease;
    }
    .link-more:hover {
      text-decoration: underline;
      color: #fde047;
    }

    /* Reservations List Feed */
    .reservations-list {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }
    .res-item {
      display: flex;
      align-items: center;
      gap: 14px;
      padding: 12px 14px;
      background: rgba(13, 18, 31, 0.6);
      border: 1px solid rgba(255, 255, 255, 0.06);
      border-radius: 12px;
      transition: all 0.15s ease;
    }
    .res-item:hover {
      background: rgba(26, 36, 60, 0.6);
      border-color: rgba(255, 255, 255, 0.12);
    }

    .time-badge {
      display: flex;
      align-items: center;
      gap: 4px;
      background: rgba(245, 158, 11, 0.12);
      border: 1px solid rgba(245, 158, 11, 0.25);
      color: #fbbf24;
      font-weight: 700;
      font-size: 0.82rem;
      padding: 6px 10px;
      border-radius: 8px;
      font-family: monospace;
    }
    .clock-icon { font-size: 0.75rem; }

    .res-info {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 2px;
    }
    .guest-name-row {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .guest-name-row strong {
      color: #ffffff;
      font-size: 0.92rem;
    }
    .occasion-tag {
      font-size: 0.68rem;
      background: rgba(244, 63, 94, 0.15);
      color: #fb7185;
      padding: 1px 6px;
      border-radius: 4px;
      font-weight: 600;
    }
    .guest-meta {
      font-size: 0.78rem;
      color: #94a3b8;
    }

    .status-pill {
      font-size: 0.68rem;
      font-weight: 800;
      padding: 4px 10px;
      border-radius: 9999px;
      letter-spacing: 0.04em;
    }
    .status-pill.seated { background: rgba(16, 185, 129, 0.15); color: #34d399; border: 1px solid rgba(16, 185, 129, 0.3); }
    .status-pill.confirmed { background: rgba(56, 189, 248, 0.15); color: #38bdf8; border: 1px solid rgba(56, 189, 248, 0.3); }
    .status-pill.pending { background: rgba(245, 158, 11, 0.15); color: #fbbf24; border: 1px solid rgba(245, 158, 11, 0.3); }

    /* Tables Preview Chips */
    .tables-preview {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(130px, 1fr));
      gap: 10px;
    }
    .table-chip {
      background: rgba(13, 18, 31, 0.6);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 12px;
      padding: 10px 12px;
      display: flex;
      flex-direction: column;
      gap: 4px;
      transition: all 0.2s ease;
    }
    .table-chip:hover {
      transform: scale(1.03);
    }
    .table-chip.available { border-color: rgba(16, 185, 129, 0.3); }
    .table-chip.occupied { border-color: rgba(244, 63, 94, 0.35); background: rgba(244, 63, 94, 0.05); }
    .table-chip.reserved { border-color: rgba(245, 158, 11, 0.35); background: rgba(245, 158, 11, 0.05); }

    .chip-top {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .chip-top strong {
      color: #ffffff;
      font-size: 0.95rem;
    }
    .chip-status-dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
    }
    .table-chip.available .chip-status-dot { background: #10b981; box-shadow: 0 0 6px #10b981; }
    .table-chip.occupied .chip-status-dot { background: #f43f5e; box-shadow: 0 0 6px #f43f5e; }
    .table-chip.reserved .chip-status-dot { background: #f59e0b; box-shadow: 0 0 6px #f59e0b; }

    .chip-seats {
      font-size: 0.72rem;
      color: #94a3b8;
    }
    .chip-status {
      font-size: 0.7rem;
      font-weight: 700;
    }
    .table-chip.available .chip-status { color: #34d399; }
    .table-chip.occupied .chip-status { color: #fb7185; }
    .table-chip.reserved .chip-status { color: #fbbf24; }
  `]
})
export class DashboardComponent {
  private restaurantService = inject(RestaurantService);
  reservations$ = this.restaurantService.reservations$;
  tables$ = this.restaurantService.tables$;

  get metrics(): RestaurantMetrics {
    return this.restaurantService.getMetrics();
  }
}
