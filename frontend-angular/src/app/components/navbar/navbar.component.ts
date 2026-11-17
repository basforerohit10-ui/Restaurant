import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RestaurantService } from '../../services/restaurant.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <header class="navbar">
      <div class="brand">
        <div class="logo-box">🍽️</div>
        <div>
          <h1 class="brand-title">Aura<span>Bistro</span></h1>
          <span class="brand-sub">ANGULAR EDITION • FLOOR CONTROL</span>
        </div>
        <div class="badge-backend" [class.online]="backendOnline$ | async">
          <span class="dot"></span>
          <span>{{ (backendOnline$ | async) ? 'API: Port 5000' : 'Local Mode' }}</span>
        </div>
      </div>

      <div class="center-metrics">
        <div class="clock-display">
          <span>🕒 {{ currentTime }}</span>
        </div>
        <div class="divider"></div>
        <div class="occupancy-display">
          <span>Occupancy: <strong>{{ metrics.occupancyRate }}%</strong></span>
        </div>
      </div>

      <div class="controls">
        <button class="btn-reset" (click)="resetDemo()">
          🔄 Reset Data
        </button>
      </div>
    </header>
  `,
  styles: [`
    .navbar {
      height: 70px;
      background-color: #0f172a;
      border-bottom: 1px solid rgba(255, 255, 255, 0.08);
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 1.5rem;
      position: sticky;
      top: 0;
      z-index: 100;
    }
    .brand {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .logo-box {
      width: 38px;
      height: 38px;
      border-radius: 10px;
      background: linear-gradient(135deg, #e11d48, #be123c);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.2rem;
    }
    .brand-title {
      margin: 0;
      font-size: 1.25rem;
      font-weight: 800;
      color: #f8fafc;
    }
    .brand-title span { color: #fb7185; }
    .brand-sub {
      font-size: 0.68rem;
      color: #94a3b8;
      font-weight: 600;
      letter-spacing: 0.05em;
      display: block;
    }
    .badge-backend {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 3px 8px;
      border-radius: 9999px;
      font-size: 0.72rem;
      font-weight: 600;
      background: rgba(245, 158, 11, 0.12);
      border: 1px solid rgba(245, 158, 11, 0.3);
      color: #f59e0b;
    }
    .badge-backend.online {
      background: rgba(16, 185, 129, 0.12);
      border-color: rgba(16, 185, 129, 0.3);
      color: #10b981;
    }
    .badge-backend .dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: currentColor;
    }
    .center-metrics {
      display: flex;
      align-items: center;
      gap: 16px;
      background: rgba(30, 41, 59, 0.6);
      padding: 6px 16px;
      border-radius: 9999px;
      font-size: 0.85rem;
      color: #cbd5e1;
      border: 1px solid rgba(255, 255, 255, 0.06);
    }
    .divider {
      width: 1px;
      height: 14px;
      background: rgba(255, 255, 255, 0.1);
    }
    .btn-reset {
      background: rgba(30, 41, 59, 0.8);
      border: 1px solid rgba(255, 255, 255, 0.1);
      color: #94a3b8;
      border-radius: 8px;
      padding: 8px 12px;
      font-size: 0.82rem;
      cursor: pointer;
      font-weight: 600;
    }
    .btn-reset:hover { color: #f8fafc; }
  `]
})
export class NavbarComponent implements OnInit, OnDestroy {
  private restaurantService = inject(RestaurantService);
  backendOnline$ = this.restaurantService.backendOnline$;
  metrics = this.restaurantService.getMetrics();
  currentTime = '';
  private timer: any;

  ngOnInit() {
    this.updateClock();
    this.timer = setInterval(() => {
      this.updateClock();
      this.metrics = this.restaurantService.getMetrics();
    }, 1000);
  }

  ngOnDestroy() {
    if (this.timer) clearInterval(this.timer);
  }

  updateClock() {
    this.currentTime = new Date().toLocaleTimeString();
  }

  resetDemo() {
    this.restaurantService.resetData();
  }
}
