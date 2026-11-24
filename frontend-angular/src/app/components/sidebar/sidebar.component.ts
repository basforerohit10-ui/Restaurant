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
          <div class="badge-head">
            <span class="badge-tag">ANGULAR 18+</span>
            <span class="badge-pulse">● LIVE</span>
          </div>
          <h4 class="card-title">Chocolate &amp; Ivory Edition</h4>
          <p class="card-desc">Standalone Components, RxJS State Management, and TypeScript operations.</p>
        </div>
      </div>
    </aside>
  `,
  styles: [`
    .sidebar {
      width: 270px;
      background: #1f0f08;
      border-right: 1px solid rgba(255, 255, 255, 0.08);
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      padding: 1.75rem 1rem 1.5rem;
      flex-shrink: 0;
      min-height: calc(100vh - 76px);
      box-shadow: 2px 0 16px rgba(31, 15, 8, 0.4);
    }

    .nav-section-title {
      font-size: 0.68rem;
      font-weight: 800;
      color: #a37c63;
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
      color: #d6bfb0;
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
      background: rgba(255, 255, 255, 0.06);
      color: #ffffff;
      transform: translateX(3px);
    }

    .nav-item.active {
      background: linear-gradient(90deg, rgba(217, 119, 6, 0.35), rgba(217, 119, 6, 0.1));
      border: 1px solid rgba(245, 158, 11, 0.4);
      color: #fef3c7;
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
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(245, 158, 11, 0.25);
      border-radius: 14px;
      padding: 1.15rem;
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
      background: rgba(245, 158, 11, 0.18);
      border: 1px solid rgba(245, 158, 11, 0.35);
      padding: 2px 6px;
      border-radius: 4px;
    }

    .badge-pulse {
      font-size: 0.65rem;
      color: #34d399;
      font-weight: 700;
    }

    .card-title {
      margin: 0 0 4px;
      font-size: 0.85rem;
      font-weight: 700;
      color: #fffbf7;
    }

    .card-desc {
      margin: 0;
      font-size: 0.72rem;
      color: #bfa392;
      line-height: 1.45;
    }
  `]
})
export class SidebarComponent {}
