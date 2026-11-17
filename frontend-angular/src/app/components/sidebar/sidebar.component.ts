import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <aside class="sidebar">
      <div class="nav-section-title">Navigation (Angular)</div>
      <nav class="nav-links">
        <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{ exact: true }" class="nav-item">
          <span>📊 Dashboard</span>
        </a>
        <a routerLink="/tables" routerLinkActive="active" class="nav-item">
          <span>🪑 Table Floor Plan</span>
        </a>
        <a routerLink="/reservations" routerLinkActive="active" class="nav-item">
          <span>📅 Reservations</span>
        </a>
        <a routerLink="/waitlist" routerLinkActive="active" class="nav-item">
          <span>⏳ Walk-In Waitlist</span>
        </a>
        <a routerLink="/guests" routerLinkActive="active" class="nav-item">
          <span>👥 Guest CRM &amp; VIPs</span>
        </a>
        <a routerLink="/analytics" routerLinkActive="active" class="nav-item">
          <span>📈 Floor Analytics &amp; TS</span>
        </a>
      </nav>

      <div class="footer-card">
        <div class="tech-badge">⚡ Angular 18+ Architecture</div>
        <p>Built with Standalone Components, RxJS Observables, Dependency Injection, and TypeScript.</p>
      </div>
    </aside>
  `,
  styles: [`
    .sidebar {
      width: 250px;
      background: #0f172a;
      border-right: 1px solid rgba(255, 255, 255, 0.08);
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      padding: 1.25rem 0.85rem;
      flex-shrink: 0;
      min-height: calc(100vh - 70px);
    }
    .nav-section-title {
      font-size: 0.72rem;
      font-weight: 700;
      color: #64748b;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      padding: 0 0.5rem 0.5rem;
    }
    .nav-links {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }
    .nav-item {
      display: flex;
      align-items: center;
      padding: 10px 14px;
      border-radius: 10px;
      color: #94a3b8;
      text-decoration: none;
      font-size: 0.88rem;
      font-weight: 500;
      transition: all 0.15s ease;
    }
    .nav-item:hover {
      background: rgba(255, 255, 255, 0.04);
      color: #f8fafc;
    }
    .nav-item.active {
      background: rgba(225, 29, 72, 0.15);
      border: 1px solid rgba(225, 29, 72, 0.3);
      color: #f8fafc;
      font-weight: 600;
    }
    .footer-card {
      background: rgba(30, 41, 59, 0.5);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 12px;
      padding: 1rem;
    }
    .tech-badge {
      font-size: 0.78rem;
      font-weight: 700;
      color: #fb7185;
      margin-bottom: 4px;
    }
    .footer-card p {
      margin: 0;
      font-size: 0.72rem;
      color: #94a3b8;
      line-height: 1.4;
    }
  `]
})
export class SidebarComponent {}
