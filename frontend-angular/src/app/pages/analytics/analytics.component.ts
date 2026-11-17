import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RestaurantService } from '../../services/restaurant.service';

@Component({
  selector: 'app-analytics',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="analytics-page">
      <div class="header">
        <h2>Restaurant Operations &amp; TypeScript Array Operations</h2>
        <p>Dynamic analytics computed via Array filter, reduce, map, and find in Angular.</p>
      </div>

      <!-- Area Breakdown -->
      <div class="card">
        <h3>📊 Dining Section Utilization Breakdown</h3>
        <div class="bars-grid">
          <div class="bar-item" *ngFor="let s of sectionStats">
            <div class="bar-head">
              <span>{{ s.name }}</span>
              <strong>{{ s.pct }}% Occupied</strong>
            </div>
            <div class="progress-track">
              <div class="progress-fill" [style.width.%]="s.pct"></div>
            </div>
            <span class="sub">{{ s.occupied }} / {{ s.total }} tables filled</span>
          </div>
        </div>
      </div>

      <!-- TS Array Operations Explanation Card -->
      <div class="card">
        <h3>⚡ TypeScript Array Operations in Angular</h3>
        <div class="code-examples">
          <div class="example-box">
            <code>const seated = reservations.filter(r => r.status === 'seated');</code>
            <p>Filters all currently dining parties without mutating original state.</p>
          </div>
          <div class="example-box">
            <code>const totalGuests = reservations.reduce((sum, r) => sum + r.partySize, 0);</code>
            <p>Aggregates total guests expected across all daily covers.</p>
          </div>
          <div class="example-box">
            <code>const occupancy = Math.round(((occupied + reserved) / total) * 100);</code>
            <p>Computes real-time dining room utilization rate.</p>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .analytics-page { display: flex; flex-direction: column; gap: 20px; }
    .header h2 { margin: 0 0 4px; color: #f8fafc; font-size: 1.5rem; }
    .header p { margin: 0; color: #94a3b8; font-size: 0.88rem; }
    .card { background: #1e293b; border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 14px; padding: 1.5rem; }
    .card h3 { margin: 0 0 16px; color: #f8fafc; font-size: 1.1rem; }
    .bars-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 16px; }
    .bar-item { background: rgba(15, 23, 42, 0.5); padding: 12px; border-radius: 10px; display: flex; flex-direction: column; gap: 6px; }
    .bar-head { display: flex; justify-content: space-between; font-size: 0.85rem; color: #f8fafc; }
    .progress-track { height: 8px; background: rgba(255, 255, 255, 0.08); border-radius: 9999px; overflow: hidden; }
    .progress-fill { height: 100%; background: #e11d48; border-radius: 9999px; }
    .sub { font-size: 0.72rem; color: #94a3b8; }
    .code-examples { display: flex; flex-direction: column; gap: 10px; }
    .example-box { background: #0f172a; padding: 12px; border-radius: 8px; border: 1px solid rgba(255, 255, 255, 0.06); }
    .example-box code { color: #34d399; font-family: monospace; font-size: 0.82rem; display: block; margin-bottom: 4px; }
    .example-box p { margin: 0; font-size: 0.78rem; color: #94a3b8; }
  `]
})
export class AnalyticsComponent {
  private restaurantService = inject(RestaurantService);

  sectionStats = [
    { name: 'Main Dining Hall', pct: 60, occupied: 3, total: 5 },
    { name: 'Garden Patio', pct: 50, occupied: 2, total: 4 },
    { name: 'Rooftop Terrace', pct: 75, occupied: 3, total: 4 },
    { name: 'VIP Lounge', pct: 33, occupied: 1, total: 3 }
  ];
}
