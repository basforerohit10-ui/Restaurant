import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <aside class="sidebar">
      <div class="sidebar-top">
        <div class="nav-section-title">NAVIGATION MENU</div>
        <nav class="nav-links">
          <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{ exact: true }" class="nav-item">
            <span class="nav-icon">📊</span>
            <span class="nav-label">Dashboard</span>
            <span class="active-indicator"></span>
          </a>

          <a routerLink="/tables" routerLinkActive="active" class="nav-item">
            <span class="nav-icon">🪑</span>
            <span class="nav-label">Table Floor Plan</span>
            <span class="active-indicator"></span>
          </a>

          <a routerLink="/reservations" routerLinkActive="active" class="nav-item">
            <span class="nav-icon">📅</span>
            <span class="nav-label">Reservations</span>
            <span class="active-indicator"></span>
          </a>

          <a routerLink="/waitlist" routerLinkActive="active" class="nav-item">
            <span class="nav-icon">⏳</span>
            <span class="nav-label">Walk-In Waitlist</span>
            <span class="active-indicator"></span>
          </a>

          <a routerLink="/guests" routerLinkActive="active" class="nav-item">
            <span class="nav-icon">👥</span>
            <span class="nav-label">Guest CRM &amp; VIPs</span>
            <span class="active-indicator"></span>
          </a>

          <a routerLink="/analytics" routerLinkActive="active" class="nav-item">
            <span class="nav-icon">⚡</span>
            <span class="nav-label">Array Studio &amp; TS</span>
            <span class="active-indicator"></span>
          </a>
        </nav>
      </div>

      <!-- Bottom Tech Badge -->
      <div class="sidebar-bottom">
        <div class="tech-card">
          <div class="card-glow"></div>
          <div class="badge-head">
            <span class="badge-tag">ANGULAR 18+</span>
            <span class="badge-pulse">● LIVE</span>
          </div>
          <h4 class="card-title">Enterprise Architecture</h4>
          <p class="card-desc">Standalone Components, RxJS BehaviorSubjects, HTTP DI, and pure TypeScript operations.</p>
        </div>
      </div>
    </aside>
  `,
  styles: [`
    .sidebar {
      width: 270px;
      background: rgba(13, 18, 31, 0.95);
      border-right: 1px solid rgba(255, 255, 255, 0.07);
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      padding: 1.75rem 1rem 1.5rem;
      flex-shrink: 0;
      min-height: calc(100vh - 76px);
      box-shadow: 2px 0 16px rgba(0, 0, 0, 0.3);
    }

    .nav-section-title {
      font-size: 0.68rem;
      font-weight: 800;
      color: #64748b;
      letter-spacing: 0.12em;
      padding: 0 0.85rem 0.85rem;
    }

    .nav-links {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    .nav-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px 14px;
      border-radius: 12px;
      color: #94a3b8;
      text-decoration: none;
      font-size: 0.9rem;
      font-weight: 600;
      position: relative;
      transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
    }

    .nav-icon {
      font-size: 1.15rem;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 28px;
    }

    .nav-label {
      flex: 1;
    }

    .nav-item:hover {
      background: rgba(255, 255, 255, 0.04);
      color: #ffffff;
      transform: translateX(3px);
    }

    .nav-item.active {
      background: linear-gradient(90deg, rgba(245, 158, 11, 0.18), rgba(245, 158, 11, 0.04));
      border: 1px solid rgba(245, 158, 11, 0.3);
      color: #fbbf24;
      font-weight: 700;
    }

    .active-indicator {
      display: none;
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: #fbbf24;
      box-shadow: 0 0 10px #fbbf24;
    }

    .nav-item.active .active-indicator {
      display: block;
    }

    .sidebar-bottom {
      padding-top: 1rem;
    }

    .tech-card {
      position: relative;
      background: linear-gradient(135deg, rgba(26, 36, 60, 0.6), rgba(15, 23, 42, 0.8));
      border: 1px solid rgba(245, 158, 11, 0.25);
      border-radius: 14px;
      padding: 1.15rem;
      overflow: hidden;
    }

    .card-glow {
      position: absolute;
      top: -20px;
      right: -20px;
      width: 80px;
      height: 80px;
      background: radial-gradient(circle, rgba(245, 158, 11, 0.2), transparent 70%);
      pointer-events: none;
    }

    .badge-head {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 8px;
    }

    .badge-tag {
      font-size: 0.68rem;
      font-weight: 800;
      color: #fbbf24;
      background: rgba(245, 158, 11, 0.15);
      border: 1px solid rgba(245, 158, 11, 0.3);
      padding: 2px 6px;
      border-radius: 4px;
    }

    .badge-pulse {
      font-size: 0.65rem;
      color: #10b981;
      font-weight: 700;
    }

    .card-title {
      margin: 0 0 4px;
      font-size: 0.85rem;
      font-weight: 700;
      color: #f8fafc;
    }

    .card-desc {
      margin: 0;
      font-size: 0.72rem;
      color: #94a3b8;
      line-height: 1.45;
    }
  `]
})
export class SidebarComponent {}
