import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RestaurantService } from '../../services/restaurant.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <header class="navbar">
      <!-- Brand Logo & Identity -->
      <div class="brand">
        <div class="logo-gem">
          <span class="icon">🍽️</span>
        </div>
        <div class="brand-text">
          <h1 class="brand-title">FOOD <span>COURT</span></h1>
          <div class="brand-meta">
            <span class="edition-pill">ANGULAR 18 EDITION</span>
            <span class="dot-sep">•</span>
            <span class="sub-label">WHITE &amp; CHOCOLATE RESTAURANT</span>
          </div>
        </div>
      </div>

      <!-- Center Operational Status Strip -->
      <div class="status-strip">
        <div class="strip-pill clock-pill">
          <span class="pill-icon">🕒</span>
          <span class="pill-text">{{ currentTime }}</span>
        </div>

        <div class="strip-pill backend-pill" [class.online]="backendOnline$ | async">
          <span class="pulse-dot"></span>
          <span class="pill-text">{{ (backendOnline$ | async) ? 'API Server: Online (Port 5000)' : 'Standalone Local Mode' }}</span>
        </div>

        <div class="strip-pill occupancy-pill">
          <span class="pill-icon">🪑</span>
          <span class="pill-text">Floor Occupancy: <strong class="highlight-val">{{ metrics.occupancyRate }}%</strong></span>
        </div>
      </div>

      <!-- Quick Action Controls & User Identity -->
      <div class="controls">
        <div class="user-pill" *ngIf="(currentUser$ | async) as user">
          <span class="user-avatar">{{ user.avatar }}</span>
          <div class="user-meta">
            <span class="user-name">{{ user.name }}</span>
            <span class="user-role">{{ user.roleLabel }}</span>
          </div>
        </div>

        <button class="btn-logout" (click)="logout()" title="Sign out of Food Court">
          <span class="btn-icon">🚪</span>
          <span>Sign Out</span>
        </button>

        <button class="btn-reset" (click)="resetDemo()" title="Reset to initial seed data">
          <span class="btn-icon">🔄</span>
          <span>Reset</span>
        </button>
      </div>
    </header>
  `,
  styles: [`
    .navbar {
      height: 76px;
      background: #26140b;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 2rem;
      position: sticky;
      top: 0;
      z-index: 1000;
      box-shadow: 0 4px 20px rgba(38, 20, 11, 0.35);
    }

    .brand {
      display: flex;
      align-items: center;
      gap: 14px;
    }

    .logo-gem {
      width: 44px;
      height: 44px;
      border-radius: 14px;
      background: linear-gradient(135deg, #d97706, #92400e);
      box-shadow: 0 0 16px rgba(217, 119, 6, 0.4);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.3rem;
      border: 1px solid rgba(255, 255, 255, 0.2);
    }

    .brand-title {
      margin: 0;
      font-family: 'Playfair Display', Georgia, serif;
      font-size: 1.45rem;
      font-weight: 700;
      letter-spacing: 0.08em;
      color: #fffbf7;
      line-height: 1.1;
    }

    .brand-title span {
      font-family: 'Plus Jakarta Sans', sans-serif;
      font-weight: 800;
      color: #fbbf24;
      margin-left: 2px;
    }

    .brand-meta {
      display: flex;
      align-items: center;
      gap: 6px;
      margin-top: 2px;
    }

    .edition-pill {
      font-size: 0.65rem;
      font-weight: 800;
      color: #fbbf24;
      background: rgba(251, 191, 36, 0.15);
      border: 1px solid rgba(251, 191, 36, 0.35);
      padding: 1px 6px;
      border-radius: 4px;
      letter-spacing: 0.04em;
    }

    .dot-sep {
      color: rgba(255, 255, 255, 0.3);
      font-size: 0.7rem;
    }

    .sub-label {
      font-size: 0.68rem;
      color: #d4beaf;
      font-weight: 600;
      letter-spacing: 0.06em;
    }

    .status-strip {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    @media (max-width: 1024px) {
      .status-strip { display: none; }
    }

    .strip-pill {
      display: flex;
      align-items: center;
      gap: 8px;
      background: rgba(255, 255, 255, 0.08);
      border: 1px solid rgba(255, 255, 255, 0.12);
      padding: 6px 14px;
      border-radius: 9999px;
      font-size: 0.8rem;
      color: #fdfaf6;
      font-weight: 500;
    }

    .pill-icon { font-size: 0.85rem; }

    .pulse-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: #f59e0b;
      box-shadow: 0 0 8px #f59e0b;
    }

    .backend-pill.online .pulse-dot {
      background: #34d399;
      box-shadow: 0 0 10px #34d399;
      animation: pulseGreen 2s infinite;
    }

    .backend-pill.online {
      border-color: rgba(52, 211, 153, 0.35);
      background: rgba(16, 185, 129, 0.15);
      color: #a7f3d0;
    }

    .highlight-val {
      color: #fbbf24;
      font-weight: 700;
    }

    @keyframes pulseGreen {
      0%, 100% { opacity: 1; transform: scale(1); }
      50% { opacity: 0.6; transform: scale(1.15); }
    }

    .controls {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .user-pill {
      display: flex;
      align-items: center;
      gap: 10px;
      background: rgba(255, 255, 255, 0.08);
      border: 1px solid rgba(255, 255, 255, 0.16);
      padding: 5px 12px 5px 6px;
      border-radius: 9999px;
    }

    .user-avatar {
      font-size: 1.15rem;
      width: 32px;
      height: 32px;
      background: #3b2012;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      border: 1px solid rgba(251, 191, 36, 0.3);
    }

    .user-meta {
      display: flex;
      flex-direction: column;
      line-height: 1.2;
    }

    .user-name {
      font-size: 0.8rem;
      font-weight: 700;
      color: #fffbf7;
    }

    .user-role {
      font-size: 0.65rem;
      color: #fbbf24;
      font-weight: 600;
    }

    .btn-logout {
      display: flex;
      align-items: center;
      gap: 6px;
      background: rgba(225, 29, 72, 0.14);
      border: 1px solid rgba(225, 29, 72, 0.35);
      color: #fca5a5;
      padding: 8px 14px;
      border-radius: 10px;
      font-size: 0.82rem;
      font-weight: 700;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .btn-logout:hover {
      background: rgba(225, 29, 72, 0.28);
      border-color: #ef4444;
      color: #ffffff;
      transform: translateY(-1px);
    }

    .btn-reset {
      display: flex;
      align-items: center;
      gap: 8px;
      background: rgba(255, 255, 255, 0.08);
      border: 1px solid rgba(255, 255, 255, 0.18);
      color: #fffbf7;
      padding: 8px 16px;
      border-radius: 10px;
      font-size: 0.84rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
    }

    .btn-reset:hover {
      background: rgba(245, 158, 11, 0.25);
      border-color: #fbbf24;
      color: #fbbf24;
      transform: translateY(-1px);
    }
  `]
})
export class NavbarComponent implements OnInit, OnDestroy {
  private restaurantService = inject(RestaurantService);
  private authService = inject(AuthService);

  currentUser$ = this.authService.currentUser$;
  backendOnline$ = this.restaurantService.backendOnline$;
  metrics = this.restaurantService.getMetrics();
  currentTime = '';
  private timer: ReturnType<typeof setInterval> | null = null;

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
    this.currentTime = new Date().toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    });
  }

  logout() {
    this.authService.logout();
  }

  resetDemo() {
    this.restaurantService.resetData();
  }
}
