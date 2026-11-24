import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { RestaurantService } from '../../services/restaurant.service';
import { VisitorService } from '../../services/visitor.service';
import { GuestProfile, VisitorLogEntry } from '../../models/restaurant.model';

@Component({
  selector: 'app-guests',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="guests-page">
      <!-- Header -->
      <div class="page-header">
        <div>
          <span class="sub-header">VISITOR INTELLIGENCE &amp; CRM • WHITE &amp; CHOCOLATE</span>
          <h2>Live Visitor Logs &amp; Guest Directory</h2>
          <p>Real-time customer visits, website footfall timestamps, diner profiles, and staff station logins.</p>
        </div>
        <div class="header-actions">
          <button class="btn-export-csv" (click)="exportCSV()">
            📥 Export Visitor Logs (CSV)
          </button>
        </div>
      </div>

      <!-- Top KPI Summary Cards -->
      <div class="kpi-banner" *ngIf="(visitors$ | async) as visitors">
        <div class="kpi-mini-card">
          <span class="mini-label">TOTAL VISITS LOGGED</span>
          <strong class="mini-val">{{ visitors.length }}</strong>
          <span class="mini-sub">All-time footfall entries</span>
        </div>

        <div class="kpi-mini-card emerald-accent">
          <span class="mini-label">CUSTOMER VISITORS</span>
          <strong class="mini-val emerald-text">{{ getCustomerCount(visitors) }}</strong>
          <span class="mini-sub">Browsing menu &amp; booking</span>
        </div>

        <div class="kpi-mini-card gold-accent">
          <span class="mini-label">STAFF STATIONS</span>
          <strong class="mini-val gold-text">{{ getStaffCount(visitors) }}</strong>
          <span class="mini-sub">Active manager &amp; staff logins</span>
        </div>

        <div class="kpi-mini-card purple-accent" *ngIf="(guests$ | async) as guests">
          <span class="mini-label">VIP PATRONS</span>
          <strong class="mini-val purple-text">{{ getVipCount(guests) }}</strong>
          <span class="mini-sub">Loyalty club members</span>
        </div>
      </div>

      <!-- Navigation Mode Tabs: Live Visitor Logs vs Permanent Directory -->
      <div class="view-mode-tabs">
        <button
          type="button"
          class="tab-pill"
          [class.active]="activeTab === 'visitors'"
          (click)="activeTab = 'visitors'"
        >
          <span class="tab-icon">📋</span>
          <span>Live Visitor Logs (Footfall Tracker)</span>
          <span class="tab-badge" *ngIf="(visitors$ | async) as v">({{ v.length }})</span>
        </button>

        <button
          type="button"
          class="tab-pill"
          [class.active]="activeTab === 'directory'"
          (click)="activeTab = 'directory'"
        >
          <span class="tab-icon">👤</span>
          <span>Diner Profiles &amp; VIP CRM</span>
          <span class="tab-badge" *ngIf="(guests$ | async) as g">({{ g.length }})</span>
        </button>
      </div>

      <!-- Search & Filters Toolbar -->
      <div class="toolbar-card">
        <div class="search-wrap">
          <span class="search-icon">🔍</span>
          <input
            type="text"
            [(ngModel)]="searchQuery"
            [placeholder]="activeTab === 'visitors' ? 'Search visitors by name, phone, post, or action...' : 'Search by diner name, phone, email, or allergy...'"
            class="search-input"
          />
        </div>

        <!-- Filter for visitors: Customer / Staff filter -->
        <div class="filter-pills" *ngIf="activeTab === 'visitors'">
          <button
            class="filter-pill"
            [class.active]="visitorFilter === 'all'"
            (click)="visitorFilter = 'all'"
          >
            All Visits
          </button>
          <button
            class="filter-pill"
            [class.active]="visitorFilter === 'customer'"
            (click)="visitorFilter = 'customer'"
          >
            👤 Customers Only
          </button>
          <button
            class="filter-pill"
            [class.active]="visitorFilter === 'staff'"
            (click)="visitorFilter = 'staff'"
          >
            💼 Staff Logins Only
          </button>
        </div>

        <!-- Filter for directory: VIP only -->
        <button
          *ngIf="activeTab === 'directory'"
          class="btn-toggle-vip"
          [class.active]="vipOnly"
          (click)="vipOnly = !vipOnly"
        >
          <span>⭐</span>
          <span>VIP Patrons Only</span>
        </button>
      </div>

      <!-- ==================== TAB 1: LIVE VISITOR LOGS (REAL-TIME FOOTFALL) ==================== -->
      <div class="visitor-logs-container" *ngIf="activeTab === 'visitors'">
        <div class="visitor-list" *ngIf="(visitors$ | async) as visitors">
          <div class="empty-state" *ngIf="filterVisitors(visitors).length === 0">
            <span class="empty-icon">👥</span>
            <h3>No visitor logs match your search</h3>
            <p>Try clearing the search query or login from the customer/staff portal to log a new visit.</p>
          </div>

          <div class="visitor-row" *ngFor="let vis of filterVisitors(visitors)">
            <!-- Left: Avatar & Type Badge -->
            <div class="vis-avatar-box" [class.staff-avatar]="vis.userType === 'staff'">
              <span class="avatar-emoji">{{ vis.userType === 'customer' ? '👤' : '💼' }}</span>
              <span class="status-indicator"></span>
            </div>

            <!-- Middle: Name, Phone, Role, and Action taken -->
            <div class="vis-details">
              <div class="vis-title-line">
                <strong class="vis-name">{{ vis.name }}</strong>
                <span class="type-badge" [class.customer]="vis.userType === 'customer'" [class.staff]="vis.userType === 'staff'">
                  {{ vis.userType === 'customer' ? 'GUEST / CUSTOMER' : 'STAFF STATION' }}
                </span>
                <span class="role-badge">{{ vis.roleOrPost }}</span>
              </div>

              <p class="vis-action">
                <span class="action-arrow">↳</span>
                <span>{{ vis.action }}</span>
              </p>

              <div class="vis-meta-line">
                <span class="meta-item">📞 {{ vis.phone }}</span>
                <span class="meta-sep">•</span>
                <span class="meta-item">🖥️ Station: <strong>{{ vis.station }}</strong></span>
              </div>
            </div>

            <!-- Right: Timestamp & Badge -->
            <div class="vis-time-box">
              <span class="vis-timestamp">{{ vis.timestamp }}</span>
              <span class="vis-time-ago">{{ vis.timeAgo }}</span>
              <span class="vis-active-pill">● Active Visit</span>
            </div>
          </div>
        </div>
      </div>

      <!-- ==================== TAB 2: PERMANENT DINER PROFILES & VIP CRM ==================== -->
      <div class="guests-grid" *ngIf="activeTab === 'directory' && (guests$ | async) as guests">
        <div
          class="guest-card"
          *ngFor="let g of filterGuests(guests)"
          [class.vip-card]="g.vipStatus"
        >
          <!-- Head -->
          <div class="card-head">
            <div class="avatar-box" [class.vip-avatar]="g.vipStatus">
              {{ g.name.charAt(0) }}
            </div>
            <div class="diner-info">
              <div class="name-line">
                <h4>{{ g.name }}</h4>
                <span class="vip-crown" *ngIf="g.vipStatus">⭐ VIP</span>
              </div>
              <span class="contact-line">📞 {{ g.phone }} • ✉️ {{ g.email }}</span>
            </div>
          </div>

          <!-- Stats Grid -->
          <div class="stats-matrix">
            <div class="stat-cell">
              <span class="cell-label">TOTAL VISITS</span>
              <strong class="cell-num">{{ g.totalVisits }}</strong>
            </div>
            <div class="stat-cell">
              <span class="cell-label">LIFETIME SPEND</span>
              <strong class="cell-num gold-text">{{ '$' + g.totalSpent }}</strong>
            </div>
            <div class="stat-cell">
              <span class="cell-label">FAVORITE AREA</span>
              <strong class="cell-area">{{ g.preferredSection | uppercase }}</strong>
            </div>
          </div>

          <!-- Dietary Restrictions -->
          <div class="diet-section" *ngIf="g.dietaryRestrictions.length > 0">
            <span class="section-label">DIETARY &amp; ALLERGIES:</span>
            <div class="tags-wrap">
              <span class="diet-pill" *ngFor="let d of g.dietaryRestrictions">{{ d }}</span>
            </div>
          </div>

          <!-- Notes -->
          <div class="notes-quote" *ngIf="g.notes">
            <span class="note-tag">HOSPITALITY NOTE:</span>
            <p>"{{ g.notes }}"</p>
          </div>

          <!-- Card Foot -->
          <div class="card-foot">
            <span class="last-date">Last visit logged: {{ g.lastVisit }}</span>
            <a routerLink="/reservations" class="btn-book-shortcut">Reserve Table →</a>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .guests-page { display: flex; flex-direction: column; gap: 20px; font-family: 'Plus Jakarta Sans', sans-serif; }

    /* Header */
    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      flex-wrap: wrap;
      gap: 16px;
    }
    .sub-header {
      font-size: 0.7rem;
      font-weight: 800;
      letter-spacing: 0.12em;
      color: #8c4f2e;
      display: block;
      margin-bottom: 4px;
    }
    .page-header h2 {
      margin: 0 0 4px;
      font-family: 'Playfair Display', Georgia, serif;
      font-size: 1.85rem;
      color: #231208;
    }
    .page-header p {
      margin: 0;
      color: #7d5b45;
      font-size: 0.92rem;
    }

    .btn-export-csv {
      background: #ffffff;
      border: 1px solid rgba(74, 40, 22, 0.2);
      color: #522d1a;
      padding: 10px 18px;
      border-radius: 10px;
      font-weight: 700;
      font-size: 0.86rem;
      cursor: pointer;
      transition: all 0.2s ease;
      box-shadow: 0 2px 8px rgba(74, 40, 22, 0.05);
    }
    .btn-export-csv:hover {
      background: #522d1a;
      color: #ffffff;
      border-color: #522d1a;
    }

    /* KPI Banner */
    .kpi-banner {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 14px;
    }
    .kpi-mini-card {
      background: #ffffff;
      border: 1px solid rgba(74, 40, 22, 0.12);
      border-radius: 14px;
      padding: 1.1rem 1.3rem;
      display: flex;
      flex-direction: column;
      gap: 3px;
      box-shadow: 0 4px 14px rgba(74, 40, 22, 0.04);
    }
    .mini-label {
      font-size: 0.68rem;
      font-weight: 800;
      letter-spacing: 0.06em;
      color: #7d5b45;
    }
    .mini-val {
      font-size: 1.85rem;
      font-weight: 800;
      color: #231208;
      font-family: 'Playfair Display', serif;
      line-height: 1.1;
      margin: 2px 0;
    }
    .mini-sub { font-size: 0.72rem; color: #9c806f; }
    .emerald-text { color: #15803d; }
    .gold-text { color: #b45309; }
    .purple-text { color: #7e22ce; }

    /* View Mode Tabs */
    .view-mode-tabs {
      display: flex;
      gap: 10px;
      background: #ffffff;
      border: 1px solid rgba(74, 40, 22, 0.12);
      border-radius: 14px;
      padding: 6px;
      box-shadow: 0 2px 8px rgba(74, 40, 22, 0.04);
    }
    .tab-pill {
      display: flex;
      align-items: center;
      gap: 8px;
      background: none;
      border: none;
      padding: 10px 18px;
      border-radius: 10px;
      font-size: 0.88rem;
      font-weight: 700;
      color: #7d5b45;
      cursor: pointer;
      transition: all 0.2s ease;
    }
    .tab-pill.active {
      background: #26140b;
      color: #ffffff;
      box-shadow: 0 4px 12px rgba(38, 20, 11, 0.25);
    }
    .tab-icon { font-size: 1.1rem; }
    .tab-badge {
      font-size: 0.72rem;
      opacity: 0.85;
    }

    /* Toolbar */
    .toolbar-card {
      background: #ffffff;
      border: 1px solid rgba(74, 40, 22, 0.12);
      border-radius: 14px;
      padding: 12px 18px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 16px;
      flex-wrap: wrap;
      box-shadow: 0 4px 14px rgba(74, 40, 22, 0.04);
    }
    .search-wrap {
      position: relative;
      flex: 1;
      min-width: 280px;
    }
    .search-icon {
      position: absolute;
      left: 12px;
      top: 50%;
      transform: translateY(-50%);
      font-size: 0.9rem;
      opacity: 0.7;
      pointer-events: none;
    }
    .search-input {
      width: 100%;
      background: #faf7f2;
      border: 1px solid rgba(74, 40, 22, 0.12);
      border-radius: 10px;
      padding: 9px 12px 9px 36px;
      color: #231208;
      font-size: 0.88rem;
      outline: none;
      transition: border-color 0.2s ease;
    }
    .search-input:focus {
      border-color: #8c4f2e;
      background: #ffffff;
    }

    .filter-pills { display: flex; gap: 6px; }
    .filter-pill {
      background: #faf7f2;
      border: 1px solid rgba(74, 40, 22, 0.1);
      color: #634029;
      padding: 6px 12px;
      border-radius: 8px;
      font-size: 0.78rem;
      font-weight: 700;
      cursor: pointer;
      transition: all 0.15s ease;
    }
    .filter-pill.active {
      background: #522d1a;
      color: #ffffff;
      border-color: #522d1a;
    }

    .btn-toggle-vip {
      background: #faf7f2;
      border: 1px solid rgba(74, 40, 22, 0.15);
      color: #634029;
      padding: 8px 14px;
      border-radius: 10px;
      font-size: 0.8rem;
      font-weight: 700;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 6px;
    }
    .btn-toggle-vip.active {
      background: #fef3c7;
      color: #b45309;
      border-color: #f59e0b;
    }

    /* ==================== 1. VISITOR LOG ROWS ==================== */
    .visitor-logs-container {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    .visitor-list {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .visitor-row {
      background: #ffffff;
      border: 1px solid rgba(74, 40, 22, 0.12);
      border-radius: 14px;
      padding: 1.1rem 1.4rem;
      display: flex;
      align-items: center;
      gap: 18px;
      box-shadow: 0 2px 8px rgba(74, 40, 22, 0.04);
      transition: all 0.2s ease;
    }
    .visitor-row:hover {
      transform: translateX(3px);
      box-shadow: 0 6px 18px rgba(74, 40, 22, 0.08);
      border-color: rgba(140, 79, 46, 0.3);
    }

    .vis-avatar-box {
      width: 48px;
      height: 48px;
      border-radius: 12px;
      background: #f0fdf4;
      border: 1px solid rgba(22, 163, 74, 0.3);
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
      flex-shrink: 0;
    }
    .vis-avatar-box.staff-avatar {
      background: #fdf5ef;
      border-color: rgba(140, 79, 46, 0.3);
    }
    .avatar-emoji { font-size: 1.4rem; }
    .status-indicator {
      position: absolute;
      bottom: -2px;
      right: -2px;
      width: 10px;
      height: 10px;
      background: #22c55e;
      border: 2px solid #ffffff;
      border-radius: 50%;
    }

    .vis-details {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 4px;
      min-width: 0;
    }
    .vis-title-line {
      display: flex;
      align-items: center;
      gap: 10px;
      flex-wrap: wrap;
    }
    .vis-name {
      font-size: 1.05rem;
      color: #231208;
      font-weight: 700;
    }
    .type-badge {
      font-size: 0.62rem;
      font-weight: 800;
      padding: 2px 7px;
      border-radius: 4px;
      letter-spacing: 0.06em;
    }
    .type-badge.customer {
      background: #f0fdf4;
      color: #15803d;
      border: 1px solid rgba(22, 163, 74, 0.3);
    }
    .type-badge.staff {
      background: #fdf5ef;
      color: #8c4f2e;
      border: 1px solid rgba(140, 79, 46, 0.3);
    }
    .role-badge {
      font-size: 0.72rem;
      color: #7d5b45;
      font-weight: 600;
    }

    .vis-action {
      margin: 0;
      font-size: 0.85rem;
      color: #573926;
      display: flex;
      align-items: center;
      gap: 6px;
    }
    .action-arrow { color: #b45309; font-weight: 800; }

    .vis-meta-line {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 0.74rem;
      color: #8c6d58;
    }
    .meta-sep { color: #d6bfb0; }

    .vis-time-box {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      gap: 3px;
      flex-shrink: 0;
      min-width: 140px;
    }
    .vis-timestamp {
      font-size: 0.86rem;
      font-weight: 700;
      color: #231208;
    }
    .vis-time-ago {
      font-size: 0.72rem;
      color: #8c4f2e;
    }
    .vis-active-pill {
      font-size: 0.65rem;
      font-weight: 700;
      color: #15803d;
      background: #f0fdf4;
      border: 1px solid rgba(22, 163, 74, 0.25);
      padding: 1px 6px;
      border-radius: 4px;
    }

    /* Empty State */
    .empty-state {
      text-align: center;
      background: #ffffff;
      border: 1px dashed rgba(74, 40, 22, 0.2);
      border-radius: 14px;
      padding: 3rem 2rem;
      color: #7d5b45;
    }
    .empty-icon { font-size: 2.6rem; margin-bottom: 6px; }

    /* ==================== 2. PERMANENT GUESTS GRID ==================== */
    .guests-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
      gap: 18px;
    }
    .guest-card {
      background: #ffffff;
      border: 1px solid rgba(74, 40, 22, 0.12);
      border-radius: 18px;
      padding: 1.35rem;
      display: flex;
      flex-direction: column;
      gap: 14px;
      box-shadow: 0 4px 16px rgba(74, 40, 22, 0.05);
      transition: all 0.2s ease;
    }
    .guest-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 24px rgba(74, 40, 22, 0.09);
      border-color: rgba(74, 40, 22, 0.25);
    }
    .vip-card { border-color: rgba(245, 158, 11, 0.45); }

    .card-head { display: flex; align-items: center; gap: 14px; }
    .avatar-box {
      width: 48px;
      height: 48px;
      border-radius: 14px;
      background: #f4ece1;
      border: 1px solid rgba(74, 40, 22, 0.15);
      color: #522d1a;
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: 'Playfair Display', Georgia, serif;
      font-size: 1.3rem;
      font-weight: 700;
    }
    .vip-avatar {
      background: linear-gradient(135deg, #d97706, #78350f);
      color: #ffffff;
      border-color: #fbbf24;
      box-shadow: 0 0 12px rgba(245, 158, 11, 0.35);
    }
    .diner-info { flex: 1; }
    .name-line { display: flex; align-items: center; gap: 8px; margin-bottom: 2px; }
    .name-line h4 {
      margin: 0;
      font-size: 1.05rem;
      font-family: 'Playfair Display', Georgia, serif;
      color: #231208;
    }
    .vip-crown {
      font-size: 0.68rem;
      font-weight: 800;
      background: #fef3c7;
      color: #b45309;
      border: 1px solid rgba(245, 158, 11, 0.3);
      padding: 2px 7px;
      border-radius: 9999px;
    }
    .contact-line { font-size: 0.74rem; color: #8c6d58; }

    .stats-matrix {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 8px;
      background: #faf7f2;
      border-radius: 10px;
      padding: 10px 12px;
      border: 1px solid rgba(74, 40, 22, 0.08);
    }
    .stat-cell { display: flex; flex-direction: column; gap: 2px; }
    .cell-label { font-size: 0.62rem; color: #8c6d58; font-weight: 800; letter-spacing: 0.05em; }
    .cell-num { font-size: 1rem; color: #231208; font-weight: 800; }
    .cell-area { font-size: 0.76rem; color: #6e3d23; font-weight: 800; }

    .diet-section { display: flex; flex-direction: column; gap: 6px; }
    .section-label { font-size: 0.68rem; color: #8c6d58; font-weight: 800; letter-spacing: 0.05em; }
    .tags-wrap { display: flex; gap: 6px; flex-wrap: wrap; }
    .diet-pill {
      background: #fdf2f8;
      border: 1px solid #fbcfe8;
      color: #9d174d;
      font-size: 0.72rem;
      padding: 2px 8px;
      border-radius: 6px;
      font-weight: 700;
    }

    .notes-quote {
      background: #faf7f2;
      border-left: 3px solid #8c4f2e;
      padding: 8px 12px;
      border-radius: 6px;
    }
    .note-tag { font-size: 0.65rem; color: #8c4f2e; font-weight: 800; letter-spacing: 0.05em; display: block; }
    .notes-quote p { margin: 2px 0 0; font-size: 0.82rem; color: #573926; font-style: italic; }

    .card-foot {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-top: 10px;
      border-top: 1px solid rgba(74, 40, 22, 0.08);
    }
    .last-date { font-size: 0.72rem; color: #8c6d58; }
    .btn-book-shortcut {
      color: #8c4f2e;
      text-decoration: none;
      font-size: 0.82rem;
      font-weight: 800;
    }
    .btn-book-shortcut:hover { text-decoration: underline; }

    @media (max-width: 768px) {
      .visitor-row {
        flex-direction: column;
        align-items: flex-start;
      }
      .vis-time-box {
        align-items: flex-start;
        border-top: 1px dashed rgba(74, 40, 22, 0.12);
        padding-top: 8px;
        width: 100%;
      }
    }
  `]
})
export class GuestsComponent {
  private restaurantService = inject(RestaurantService);
  private visitorService = inject(VisitorService);

  guests$ = this.restaurantService.guests$;
  visitors$ = this.visitorService.visitors$;

  activeTab: 'visitors' | 'directory' = 'visitors'; // Default to Live Visitor Logs!
  searchQuery = '';
  visitorFilter: 'all' | 'customer' | 'staff' = 'all';
  vipOnly = false;

  getCustomerCount(visitors: VisitorLogEntry[]): number {
    return visitors.filter(v => v.userType === 'customer').length;
  }

  getStaffCount(visitors: VisitorLogEntry[]): number {
    return visitors.filter(v => v.userType === 'staff').length;
  }

  getVipCount(guests: GuestProfile[] | null): number {
    if (!guests) return 0;
    return guests.filter(g => g.vipStatus).length;
  }

  filterVisitors(visitors: VisitorLogEntry[]): VisitorLogEntry[] {
    return visitors.filter(v => {
      const matchType = this.visitorFilter === 'all' || v.userType === this.visitorFilter;
      const q = this.searchQuery.toLowerCase().trim();
      const matchSearch =
        !q ||
        v.name.toLowerCase().includes(q) ||
        (v.phone && v.phone.includes(q)) ||
        v.roleOrPost.toLowerCase().includes(q) ||
        v.action.toLowerCase().includes(q) ||
        v.station.toLowerCase().includes(q);

      return matchType && matchSearch;
    });
  }

  filterGuests(guests: GuestProfile[]): GuestProfile[] {
    return guests.filter(g => {
      const matchSearch =
        !this.searchQuery ||
        g.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        g.phone.includes(this.searchQuery) ||
        g.email.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        g.dietaryRestrictions.some(d => d.toLowerCase().includes(this.searchQuery.toLowerCase()));

      const matchVip = !this.vipOnly || g.vipStatus;
      return matchSearch && matchVip;
    });
  }

  exportCSV(): void {
    this.visitorService.exportVisitorsCSV();
  }
}
