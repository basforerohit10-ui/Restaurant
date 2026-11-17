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
      <div class="header">
        <div>
          <h2>Guest Directory &amp; VIP CRM (Angular)</h2>
          <p>Diner visit histories, average spend, dietary restrictions, and hospitality preferences.</p>
        </div>
        <div class="header-stats">
          <div class="stat-pill">
            <span class="label">Total Profiles</span>
            <strong>{{ (guests$ | async)?.length || 0 }}</strong>
          </div>
          <div class="stat-pill">
            <span class="label">VIP Members</span>
            <strong style="color: #fbbf24;">{{ getVipCount(guests$ | async) }}</strong>
          </div>
        </div>
      </div>

      <!-- Search & Filters -->
      <div class="filter-bar">
        <input
          type="text"
          [(ngModel)]="searchQuery"
          placeholder="Search by guest name, phone, email, or dietary tag..."
          class="search-input"
        />

        <div class="filter-toggles">
          <button
            class="toggle-btn"
            [class.active]="vipOnly"
            (click)="vipOnly = !vipOnly"
          >
            ⭐ VIP Guests Only
          </button>
        </div>
      </div>

      <!-- Guests Grid -->
      <div class="guests-grid" *ngIf="(guests$ | async) as guests">
        <div
          class="guest-card"
          *ngFor="let g of filterGuests(guests)"
          [class.vip]="g.vipStatus"
        >
          <div class="card-head">
            <div class="avatar" [class.vip-avatar]="g.vipStatus">
              {{ g.name.charAt(0) }}
            </div>
            <div class="guest-info">
              <div class="name-row">
                <h4>{{ g.name }}</h4>
                <span class="vip-badge" *ngIf="g.vipStatus">⭐ VIP</span>
              </div>
              <span class="contact-info">📞 {{ g.phone }} • ✉️ {{ g.email }}</span>
            </div>
          </div>

          <div class="stats-row">
            <div class="stat-col">
              <span class="col-label">Visits</span>
              <strong class="col-val">{{ g.totalVisits }}</strong>
            </div>
            <div class="stat-col">
              <span class="col-label">Total Spend</span>
              <strong class="col-val">{{ '$' + g.totalSpent }}</strong>
            </div>
            <div class="stat-col">
              <span class="col-label">Preferred Area</span>
              <strong class="col-val area">{{ g.preferredSection | uppercase }}</strong>
            </div>
          </div>

          <!-- Dietary Restrictions -->
          <div class="diet-section" *ngIf="g.dietaryRestrictions.length > 0">
            <span class="diet-label">Dietary &amp; Allergies:</span>
            <div class="diet-tags">
              <span class="tag" *ngFor="let d of g.dietaryRestrictions">{{ d }}</span>
            </div>
          </div>

          <!-- Hospitality Notes -->
          <div class="notes-box" *ngIf="g.notes">
            <span>📝 Hospitality Note:</span>
            <p>"{{ g.notes }}"</p>
          </div>

          <div class="card-foot">
            <span class="last-visit">Last visited: {{ g.lastVisit }}</span>
            <a routerLink="/reservations" class="btn-book">Book Table →</a>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .guests-page {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 12px;
    }
    .header h2 { margin: 0 0 4px; color: #f8fafc; font-size: 1.5rem; }
    .header p { margin: 0; color: #94a3b8; font-size: 0.88rem; }
    .header-stats {
      display: flex;
      gap: 12px;
    }
    .stat-pill {
      background: #1e293b;
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 10px;
      padding: 8px 16px;
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    .stat-pill .label { font-size: 0.7rem; color: #94a3b8; text-transform: uppercase; }
    .stat-pill strong { font-size: 1.2rem; color: #f8fafc; }

    .filter-bar {
      display: flex;
      gap: 12px;
      align-items: center;
      background: #1e293b;
      padding: 12px;
      border-radius: 12px;
      border: 1px solid rgba(255, 255, 255, 0.08);
      flex-wrap: wrap;
    }
    .search-input {
      flex: 1;
      min-width: 280px;
      background: #0f172a;
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 8px;
      padding: 10px 14px;
      color: #f8fafc;
      font-size: 0.9rem;
    }
    .toggle-btn {
      background: #0f172a;
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 8px;
      padding: 10px 16px;
      color: #94a3b8;
      cursor: pointer;
      font-weight: 600;
      font-size: 0.85rem;
      transition: all 0.2s ease;
    }
    .toggle-btn.active {
      background: rgba(245, 158, 11, 0.15);
      border-color: #f59e0b;
      color: #fbbf24;
    }

    .guests-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
      gap: 16px;
    }
    .guest-card {
      background: #1e293b;
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 14px;
      padding: 1.25rem;
      display: flex;
      flex-direction: column;
      gap: 14px;
      transition: transform 0.2s ease, border-color 0.2s ease;
    }
    .guest-card:hover {
      transform: translateY(-2px);
      border-color: rgba(255, 255, 255, 0.18);
    }
    .guest-card.vip {
      border: 1px solid rgba(245, 158, 11, 0.35);
      background: linear-gradient(145deg, rgba(245, 158, 11, 0.05), #1e293b);
    }

    .card-head {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .avatar {
      width: 44px;
      height: 44px;
      border-radius: 50%;
      background: #334155;
      color: #f8fafc;
      font-weight: 800;
      font-size: 1.1rem;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .avatar.vip-avatar {
      background: linear-gradient(135deg, #f59e0b, #d97706);
      color: #0f172a;
    }
    .guest-info { flex: 1; }
    .name-row { display: flex; align-items: center; gap: 8px; }
    .name-row h4 { margin: 0; color: #f8fafc; font-size: 1.1rem; }
    .vip-badge {
      font-size: 0.7rem;
      background: rgba(245, 158, 11, 0.2);
      border: 1px solid rgba(245, 158, 11, 0.4);
      color: #fbbf24;
      padding: 2px 6px;
      border-radius: 9999px;
      font-weight: 700;
    }
    .contact-info { font-size: 0.78rem; color: #94a3b8; }

    .stats-row {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      background: rgba(15, 23, 42, 0.6);
      padding: 10px;
      border-radius: 10px;
      text-align: center;
    }
    .stat-col { display: flex; flex-direction: column; gap: 2px; }
    .col-label { font-size: 0.68rem; color: #64748b; text-transform: uppercase; }
    .col-val { font-size: 0.95rem; color: #f8fafc; }
    .col-val.area { color: #38bdf8; font-size: 0.8rem; }

    .diet-section { display: flex; flex-direction: column; gap: 6px; }
    .diet-label { font-size: 0.72rem; color: #94a3b8; font-weight: 600; }
    .diet-tags { display: flex; gap: 6px; flex-wrap: wrap; }
    .tag {
      background: rgba(225, 29, 72, 0.15);
      border: 1px solid rgba(225, 29, 72, 0.3);
      color: #fb7185;
      font-size: 0.72rem;
      padding: 2px 8px;
      border-radius: 6px;
      font-weight: 600;
    }

    .notes-box {
      background: rgba(15, 23, 42, 0.4);
      border-left: 3px solid #38bdf8;
      padding: 8px 12px;
      border-radius: 4px;
    }
    .notes-box span { font-size: 0.7rem; color: #38bdf8; font-weight: 700; text-transform: uppercase; display: block; }
    .notes-box p { margin: 2px 0 0; font-size: 0.8rem; color: #cbd5e1; font-style: italic; }

    .card-foot {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-top: 8px;
      border-top: 1px solid rgba(255, 255, 255, 0.06);
    }
    .last-visit { font-size: 0.72rem; color: #64748b; }
    .btn-book {
      color: #fb7185;
      text-decoration: none;
      font-size: 0.82rem;
      font-weight: 600;
    }
    .btn-book:hover { text-decoration: underline; }
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
