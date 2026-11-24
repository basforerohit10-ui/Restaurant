import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { RestaurantService } from '../../services/restaurant.service';
import { VisitorService } from '../../services/visitor.service';
import { RestaurantMetrics } from '../../models/restaurant.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="dashboard-page">
      <!-- Luxury Chocolate & Ivory Welcome Banner -->
      <div class="hero-banner">
        <div class="banner-content">
          <div class="banner-tag">FOOD COURT MANAGEMENT • WHITE &amp; CHOCOLATE</div>
          <h2>Floor Control &amp; Seating Analytics</h2>
          <p>Real-time dining room occupancy, reservations intake timeline, and walk-in queue management.</p>
        </div>
        <div class="banner-actions">
          <a routerLink="/tables" class="btn-hero-primary">🪑 Floor Plan</a>
          <a routerLink="/reservations" class="btn-hero-secondary">+ New Booking</a>
        </div>
      </div>

      <!-- 4 High-Impact White & Chocolate KPI Cards -->
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

      <!-- Live Visitor Activity Feed on Dashboard -->
      <div class="panel visitor-dash-panel">
        <div class="panel-header">
          <div>
            <h3>👥 Live Customer &amp; Staff Visitor Logs</h3>
            <p class="panel-sub">Real-time footfall of who is currently visiting and exploring Food Court.</p>
          </div>
          <a routerLink="/guests" class="link-more">View Full Visitor Logs →</a>
        </div>

        <div class="dash-visitors-grid" *ngIf="(visitors$ | async) as visList">
          <div class="dash-vis-chip" *ngFor="let v of visList.slice(0, 4)">
            <div class="chip-avatar" [class.staff-chip]="v.userType === 'staff'">
              {{ v.userType === 'customer' ? '👤' : '💼' }}
            </div>
            <div class="chip-info">
              <div class="chip-name-row">
                <strong class="chip-name">{{ v.name }}</strong>
                <span class="chip-type-tag" [class.cust]="v.userType === 'customer'" [class.stf]="v.userType === 'staff'">
                  {{ v.userType === 'customer' ? 'Customer' : 'Staff' }}
                </span>
              </div>
              <span class="chip-role">{{ v.roleOrPost }}</span>
              <p class="chip-action">↳ {{ v.action }}</p>
            </div>
            <div class="chip-time">
              <strong>{{ v.timestamp }}</strong>
              <span class="chip-active">● Active</span>
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

    /* Hero Banner: Warm Chocolate Background */
    .hero-banner {
      background: linear-gradient(135deg, #361b0f, #201008);
      border: 1px solid rgba(245, 158, 11, 0.3);
      border-radius: 20px;
      padding: 2.2rem 2.5rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 20px;
      box-shadow: 0 10px 30px rgba(32, 16, 8, 0.35);
      color: #ffffff;
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
      font-size: 1.95rem;
      font-weight: 700;
      color: #fffbf7;
      letter-spacing: 0.02em;
    }
    .hero-banner p {
      margin: 0;
      color: #d6bfb0;
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
      color: #1a0e08;
      text-decoration: none;
      font-weight: 700;
      font-size: 0.88rem;
      padding: 11px 22px;
      border-radius: 10px;
      box-shadow: 0 4px 14px rgba(245, 158, 11, 0.4);
      transition: all 0.2s ease;
    }
    .btn-hero-primary:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(245, 158, 11, 0.55);
    }
    .btn-hero-secondary {
      background: rgba(255, 255, 255, 0.1);
      border: 1px solid rgba(255, 255, 255, 0.2);
      color: #fffbf7;
      text-decoration: none;
      font-weight: 600;
      font-size: 0.88rem;
      padding: 11px 20px;
      border-radius: 10px;
      transition: all 0.2s ease;
    }
    .btn-hero-secondary:hover {
      background: rgba(255, 255, 255, 0.18);
    }

    /* KPI Cards in Crisp White */
    .metrics-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
      gap: 18px;
    }

    .kpi-card {
      background: #ffffff;
      border: 1px solid rgba(74, 40, 22, 0.12);
      border-radius: 18px;
      padding: 1.5rem;
      display: flex;
      flex-direction: column;
      gap: 10px;
      box-shadow: 0 4px 18px rgba(35, 18, 8, 0.05);
      transition: transform 0.2s ease, box-shadow 0.2s ease;
      position: relative;
    }
    .kpi-card:hover {
      transform: translateY(-3px);
      box-shadow: 0 10px 28px rgba(35, 18, 8, 0.1);
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
      color: #7d5b45;
    }
    .kpi-icon-box {
      width: 38px;
      height: 38px;
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.15rem;
    }
    .gold-icon { background: #fef3c7; border: 1px solid #fde68a; }
    .emerald-icon { background: #dcfce7; border: 1px solid #bbf7d0; }
    .sky-icon { background: #e0f2fe; border: 1px solid #bae6fd; }
    .purple-icon { background: #fae8ff; border: 1px solid #f5d0fe; }

    .kpi-main {
      display: flex;
      align-items: baseline;
      justify-content: space-between;
    }
    .kpi-main h3 {
      margin: 0;
      font-size: 2.2rem;
      font-weight: 800;
      color: #1a0e08;
      line-height: 1;
    }
    .emerald-num { color: #15803d !important; }
    .sky-num { color: #0369a1 !important; }
    .purple-num { color: #7e22ce !important; }

    .trend-pill {
      font-size: 0.72rem;
      font-weight: 700;
      padding: 3px 8px;
      border-radius: 9999px;
    }
    .gold-trend { background: #fef3c7; color: #b45309; }
    .emerald-trend { background: #dcfce7; color: #15803d; }
    .sky-trend { background: #e0f2fe; color: #0369a1; }
    .purple-trend { background: #fae8ff; color: #7e22ce; }

    .progress-bar {
      height: 6px;
      background: #f1e9df;
      border-radius: 9999px;
      overflow: hidden;
      margin-top: 4px;
    }
    .progress-fill { height: 100%; border-radius: 9999px; }
    .gold-fill { background: linear-gradient(90deg, #d97706, #f59e0b); }
    .emerald-fill { background: linear-gradient(90deg, #15803d, #22c55e); }
    .sky-fill { background: linear-gradient(90deg, #0284c7, #38bdf8); }
    .purple-fill { background: linear-gradient(90deg, #7e22ce, #a855f7); }

    .kpi-sub {
      font-size: 0.75rem;
      color: #8c6d58;
      font-weight: 500;
    }

    /* Content Split Panels in Crisp White */
    .content-split {
      display: grid;
      grid-template-columns: 1.2fr 1fr;
      gap: 20px;
    }
    @media (max-width: 1000px) {
      .content-split { grid-template-columns: 1fr; }
    }

    .panel {
      background: #ffffff;
      border: 1px solid rgba(74, 40, 22, 0.12);
      border-radius: 20px;
      padding: 1.6rem;
      display: flex;
      flex-direction: column;
      gap: 16px;
      box-shadow: 0 4px 18px rgba(35, 18, 8, 0.05);
    }

    .panel-header {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
    }
    .panel-header h3 {
      margin: 0 0 2px;
      color: #231208;
      font-size: 1.15rem;
      font-weight: 700;
    }
    .panel-sub {
      margin: 0;
      color: #7d5b45;
      font-size: 0.82rem;
    }
    .link-more {
      color: #8c4f2e;
      text-decoration: none;
      font-size: 0.82rem;
      font-weight: 700;
      transition: color 0.15s ease;
    }
    .link-more:hover {
      text-decoration: underline;
      color: #522d1a;
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
      background: #faf7f2;
      border: 1px solid rgba(74, 40, 22, 0.08);
      border-radius: 12px;
      transition: all 0.15s ease;
    }
    .res-item:hover {
      background: #f4ece1;
    }

    .time-badge {
      display: flex;
      align-items: center;
      gap: 4px;
      background: #fbf0e4;
      border: 1px solid #ebd2be;
      color: #8c4f2e;
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
      color: #231208;
      font-size: 0.92rem;
    }
    .occasion-tag {
      font-size: 0.68rem;
      background: #ffe4e6;
      color: #be123c;
      padding: 1px 6px;
      border-radius: 4px;
      font-weight: 600;
    }
    .guest-meta {
      font-size: 0.78rem;
      color: #7d5b45;
    }

    .status-pill {
      font-size: 0.68rem;
      font-weight: 800;
      padding: 4px 10px;
      border-radius: 9999px;
      letter-spacing: 0.04em;
    }
    .status-pill.seated { background: #dcfce7; color: #15803d; border: 1px solid #bbf7d0; }
    .status-pill.confirmed { background: #e0f2fe; color: #0369a1; border: 1px solid #bae6fd; }
    .status-pill.pending { background: #fef3c7; color: #b45309; border: 1px solid #fde68a; }

    /* Tables Preview Chips */
    .tables-preview {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(130px, 1fr));
      gap: 10px;
    }
    .table-chip {
      background: #faf7f2;
      border: 1px solid rgba(74, 40, 22, 0.1);
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
    .table-chip.available { border-color: #86efac; }
    .table-chip.occupied { border-color: #fca5a5; background: #fff1f2; }
    .table-chip.reserved { border-color: #fde047; background: #fefce8; }

    .chip-top {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .chip-top strong {
      color: #231208;
      font-size: 0.95rem;
    }
    .chip-status-dot {
      width: 7px;
      height: 7px;
      border-radius: 50%;
    }
    .table-chip.available .chip-status-dot { background: #16a34a; }
    .table-chip.occupied .chip-status-dot { background: #e11d48; }
    .table-chip.reserved .chip-status-dot { background: #d97706; }

    .chip-seats {
      font-size: 0.72rem;
      color: #7d5b45;
    }
    .chip-status {
      font-size: 0.7rem;
      font-weight: 700;
    }
    .table-chip.available .chip-status { color: #15803d; }
    .table-chip.occupied .chip-status { color: #be123c; }
    .table-chip.reserved .chip-status { color: #b45309; }

    /* Dashboard Live Visitors Feed */
    .dash-visitors-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 12px;
    }
    .dash-vis-chip {
      background: #faf7f2;
      border: 1px solid rgba(74, 40, 22, 0.1);
      border-radius: 12px;
      padding: 12px 14px;
      display: flex;
      align-items: flex-start;
      gap: 12px;
      transition: all 0.2s ease;
    }
    .dash-vis-chip:hover {
      background: #ffffff;
      border-color: #8c4f2e;
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(74, 40, 22, 0.06);
    }
    .chip-avatar {
      font-size: 1.3rem;
      width: 38px;
      height: 38px;
      border-radius: 10px;
      background: #f0fdf4;
      border: 1px solid rgba(22, 163, 74, 0.25);
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }
    .chip-avatar.staff-chip {
      background: #fdf5ef;
      border-color: rgba(140, 79, 46, 0.25);
    }
    .chip-info {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 2px;
      min-width: 0;
    }
    .chip-name-row {
      display: flex;
      align-items: center;
      gap: 6px;
    }
    .chip-name {
      font-size: 0.9rem;
      color: #231208;
    }
    .chip-type-tag {
      font-size: 0.6rem;
      font-weight: 800;
      padding: 1px 5px;
      border-radius: 3px;
    }
    .chip-type-tag.cust { background: #dcfce7; color: #15803d; }
    .chip-type-tag.stf { background: #fdf5ef; color: #8c4f2e; }
    .chip-role {
      font-size: 0.72rem;
      color: #7d5b45;
    }
    .chip-action {
      margin: 2px 0 0;
      font-size: 0.74rem;
      color: #573926;
      line-height: 1.3;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .chip-time {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      gap: 2px;
      font-size: 0.74rem;
      color: #231208;
      flex-shrink: 0;
    }
    .chip-active {
      font-size: 0.62rem;
      font-weight: 700;
      color: #15803d;
    }
  `]
})
export class DashboardComponent {
  private restaurantService = inject(RestaurantService);
  private visitorService = inject(VisitorService);

  reservations$ = this.restaurantService.reservations$;
  tables$ = this.restaurantService.tables$;
  visitors$ = this.visitorService.visitors$;

  get metrics(): RestaurantMetrics {
    return this.restaurantService.getMetrics();
  }
}
