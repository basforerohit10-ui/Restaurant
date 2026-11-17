import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { RestaurantService } from '../../services/restaurant.service';
import { GuestProfile } from '../../models/restaurant.model';

@Component({
  selector: 'app-guests',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="guests-page">
      <!-- Header -->
      <div class="page-header">
        <div>
          <span class="sub-header">CLIENTELE &amp; HOSPITALITY CRM</span>
          <h2>Guest Directory &amp; VIP Profiles</h2>
          <p>Diner visit histories, cumulative spend, dietary restrictions, and hospitality preferences.</p>
        </div>
        <div class="header-metrics">
          <div class="stat-pill">
            <span class="pill-label">Total Profiles</span>
            <strong class="pill-val">{{ (guests$ | async)?.length || 0 }}</strong>
          </div>
          <div class="stat-pill gold-border">
            <span class="pill-label">VIP Patrons</span>
            <strong class="pill-val gold-val">{{ getVipCount(guests$ | async) }}</strong>
          </div>
        </div>
      </div>

      <!-- Search & Filters -->
      <div class="toolbar-card">
        <div class="search-wrap">
          <span class="search-icon">🔍</span>
          <input
            type="text"
            [(ngModel)]="searchQuery"
            placeholder="Search by diner name, phone, email, or dietary tag..."
            class="search-input"
          />
        </div>

        <button
          class="btn-toggle-vip"
          [class.active]="vipOnly"
          (click)="vipOnly = !vipOnly"
        >
          <span>⭐</span>
          <span>VIP Patrons Only</span>
        </button>
      </div>

      <!-- Guests Grid -->
      <div class="guests-grid" *ngIf="(guests$ | async) as guests">
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
              <span class="cell-label">VISITS</span>
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
            <span class="last-date">Last visited: {{ g.lastVisit }}</span>
            <a routerLink="/reservations" class="btn-book-shortcut">Reserve Table →</a>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .guests-page { display: flex; flex-direction: column; gap: 22px; }

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
      color: #fbbf24;
      display: block;
      margin-bottom: 4px;
    }
    .page-header h2 {
      margin: 0 0 4px;
      font-family: 'Playfair Display', Georgia, serif;
      font-size: 1.85rem;
      color: #ffffff;
    }
    .page-header p {
      margin: 0;
      color: #94a3b8;
      font-size: 0.92rem;
    }

    .header-metrics { display: flex; gap: 12px; }
    .stat-pill {
      background: rgba(20, 27, 45, 0.75);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 12px;
      padding: 8px 18px;
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    .stat-pill.gold-border {
      border-color: rgba(245, 158, 11, 0.35);
      background: rgba(245, 158, 11, 0.08);
    }
    .pill-label { font-size: 0.68rem; color: #94a3b8; text-transform: uppercase; font-weight: 700; }
    .pill-val { font-size: 1.25rem; color: #ffffff; font-weight: 800; }
    .gold-val { color: #fbbf24; }

    /* Toolbar */
    .toolbar-card {
      background: rgba(20, 27, 45, 0.75);
      backdrop-filter: blur(12px);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 16px;
      padding: 12px 18px;
      display: flex;
      align-items: center;
      gap: 16px;
      flex-wrap: wrap;
    }
    .search-wrap {
      flex: 1;
      min-width: 280px;
      position: relative;
      display: flex;
      align-items: center;
    }
    .search-icon {
      position: absolute;
      left: 14px;
      font-size: 0.9rem;
      pointer-events: none;
    }
    .search-input {
      width: 100%;
      background: rgba(13, 18, 31, 0.7);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 10px;
      padding: 10px 14px 10px 38px;
      color: #ffffff;
      font-size: 0.88rem;
      outline: none;
    }
    .search-input:focus { border-color: #fbbf24; }

    .btn-toggle-vip {
      display: flex;
      align-items: center;
      gap: 8px;
      background: rgba(13, 18, 31, 0.6);
      border: 1px solid rgba(255, 255, 255, 0.1);
      color: #94a3b8;
      padding: 9px 16px;
      border-radius: 10px;
      font-weight: 700;
      font-size: 0.85rem;
      cursor: pointer;
      transition: all 0.2s ease;
    }
    .btn-toggle-vip.active {
      background: rgba(245, 158, 11, 0.18);
      border-color: #f59e0b;
      color: #fbbf24;
      box-shadow: 0 0 12px rgba(245, 158, 11, 0.3);
    }

    /* Guests Grid */
    .guests-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
      gap: 18px;
    }
    .guest-card {
      background: rgba(20, 27, 45, 0.72);
      backdrop-filter: blur(12px);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 18px;
      padding: 1.35rem;
      display: flex;
      flex-direction: column;
      gap: 14px;
      transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
    }
    .guest-card:hover {
      transform: translateY(-3px);
      border-color: rgba(255, 255, 255, 0.2);
      box-shadow: 0 12px 28px -6px rgba(0, 0, 0, 0.5);
    }
    .guest-card.vip-card {
      border: 1px solid rgba(245, 158, 11, 0.35);
      background: linear-gradient(145deg, rgba(245, 158, 11, 0.06), rgba(20, 27, 45, 0.85));
    }

    .card-head {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .avatar-box {
      width: 44px;
      height: 44px;
      border-radius: 50%;
      background: #334155;
      color: #ffffff;
      font-weight: 800;
      font-size: 1.15rem;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .avatar-box.vip-avatar {
      background: linear-gradient(135deg, #f59e0b, #d97706);
      color: #0f172a;
      box-shadow: 0 0 12px rgba(245, 158, 11, 0.35);
    }

    .diner-info { flex: 1; }
    .name-line { display: flex; align-items: center; gap: 8px; }
    .name-line h4 { margin: 0; color: #ffffff; font-size: 1.1rem; }
    .vip-crown {
      font-size: 0.68rem;
      background: rgba(245, 158, 11, 0.2);
      border: 1px solid rgba(245, 158, 11, 0.4);
      color: #fbbf24;
      padding: 2px 7px;
      border-radius: 9999px;
      font-weight: 800;
    }
    .contact-line { font-size: 0.78rem; color: #94a3b8; }

    .stats-matrix {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      background: rgba(13, 18, 31, 0.6);
      border-radius: 10px;
      padding: 10px;
      text-align: center;
    }
    .stat-cell { display: flex; flex-direction: column; gap: 2px; }
    .cell-label { font-size: 0.65rem; color: #64748b; font-weight: 800; letter-spacing: 0.05em; }
    .cell-num { font-size: 1rem; color: #ffffff; }
    .gold-text { color: #fbbf24; }
    .cell-area { font-size: 0.8rem; color: #38bdf8; }

    .diet-section { display: flex; flex-direction: column; gap: 6px; }
    .section-label { font-size: 0.68rem; color: #64748b; font-weight: 800; letter-spacing: 0.05em; }
    .tags-wrap { display: flex; gap: 6px; flex-wrap: wrap; }
    .diet-pill {
      background: rgba(244, 63, 94, 0.12);
      border: 1px solid rgba(244, 63, 94, 0.25);
      color: #fb7185;
      font-size: 0.72rem;
      padding: 2px 8px;
      border-radius: 6px;
      font-weight: 700;
    }

    .notes-quote {
      background: rgba(13, 18, 31, 0.5);
      border-left: 3px solid #38bdf8;
      padding: 8px 12px;
      border-radius: 6px;
    }
    .note-tag { font-size: 0.65rem; color: #38bdf8; font-weight: 800; letter-spacing: 0.05em; display: block; }
    .notes-quote p { margin: 2px 0 0; font-size: 0.82rem; color: #cbd5e1; font-style: italic; }

    .card-foot {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-top: 10px;
      border-top: 1px solid rgba(255, 255, 255, 0.06);
    }
    .last-date { font-size: 0.72rem; color: #64748b; }
    .btn-book-shortcut {
      color: #fbbf24;
      text-decoration: none;
      font-size: 0.82rem;
      font-weight: 700;
    }
    .btn-book-shortcut:hover { text-decoration: underline; }
  `]
})
export class GuestsComponent {
  private restaurantService = inject(RestaurantService);
  guests$ = this.restaurantService.guests$;

  searchQuery = '';
  vipOnly = false;

  getVipCount(guests: GuestProfile[] | null): number {
    if (!guests) return 0;
    return guests.filter(g => g.vipStatus).length;
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
}
