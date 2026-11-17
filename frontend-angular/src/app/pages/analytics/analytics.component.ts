import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RestaurantService } from '../../services/restaurant.service';
import { Reservation, Table } from '../../models/restaurant.model';

interface ArrayMethodDemo {
  id: string;
  name: string;
  method: string;
  description: string;
  code: string;
}

@Component({
  selector: 'app-analytics',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="analytics-page">
      <!-- Header -->
      <div class="page-header">
        <div>
          <span class="sub-header">OPERATIONAL ANALYTICS &amp; DATA STRUCTURES</span>
          <h2>Floor Analytics &amp; Array Operations Studio</h2>
          <p>Real-time dining room metrics computed via pure TypeScript array methods: filter, map, reduce, find, and sort.</p>
        </div>
      </div>

      <!-- Area Breakdown Card -->
      <div class="glass-card">
        <div class="card-head">
          <span class="card-tag">FLOOR METRICS</span>
          <h3>📊 Dining Room Section Utilization</h3>
        </div>
        <div class="bars-grid">
          <div class="bar-item" *ngFor="let s of sectionStats">
            <div class="bar-head">
              <span class="sec-name">{{ s.name }}</span>
              <strong class="sec-pct">{{ s.pct }}% Allocated</strong>
            </div>
            <div class="progress-track">
              <div class="progress-fill" [style.width.%]="s.pct"></div>
            </div>
            <span class="sub-count">{{ s.occupied }} of {{ s.total }} tables occupied</span>
          </div>
        </div>
      </div>

      <!-- Interactive Array Operations Studio for Teacher Evaluation -->
      <div class="glass-card studio-card">
        <div class="studio-header">
          <div>
            <span class="studio-tag">INTERACTIVE EVALUATION WORKBENCH</span>
            <h3>⚡ Live Array Operations Studio</h3>
            <p>Select any JavaScript/TypeScript array method below to execute it live against active restaurant state.</p>
          </div>
          <span class="badge-ts">TypeScript / ES6+ Pure</span>
        </div>

        <!-- Method Buttons -->
        <div class="method-pills">
          <button
            *ngFor="let m of methods"
            class="method-btn"
            [class.active]="selectedMethod === m.id"
            (click)="selectMethod(m.id)"
          >
            {{ m.name }}
          </button>
        </div>

        <!-- Selected Method Code & Output Box -->
        <div class="code-workspace">
          <div class="code-box">
            <div class="box-head">
              <span>TypeScript Code Expression</span>
              <span class="method-name">{{ currentDemo.method }}</span>
            </div>
            <pre><code>{{ currentDemo.code }}</code></pre>
            <p class="explanation">💡 {{ currentDemo.description }}</p>
          </div>

          <div class="output-box">
            <div class="box-head">
              <span>Live Evaluated Result (Computed from State)</span>
              <span class="status-live">● LIVE OUTPUT</span>
            </div>
            <pre class="json-output"><code>{{ liveResultJson }}</code></pre>
          </div>
        </div>
      </div>

      <!-- Academic Summary Table -->
      <div class="glass-card">
        <div class="card-head">
          <span class="card-tag">THEORETICAL REFERENCE</span>
          <h3>📚 Array Operations Reference for Restaurant Management</h3>
        </div>
        <div class="table-responsive">
          <table class="academic-table">
            <thead>
              <tr>
                <th>Operation</th>
                <th>Target Dataset</th>
                <th>Use Case in Restaurant System</th>
                <th>Immutability</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><code>Array.prototype.filter()</code></td>
                <td><code>tables</code> &amp; <code>reservations</code></td>
                <td>Filtering available tables by capacity or viewing only "seated" diners.</td>
                <td><span class="tag-pure">Pure (Non-mutating)</span></td>
              </tr>
              <tr>
                <td><code>Array.prototype.map()</code></td>
                <td><code>reservations</code></td>
                <td>Transforming database records into printable host run-sheet rows.</td>
                <td><span class="tag-pure">Pure (Non-mutating)</span></td>
              </tr>
              <tr>
                <td><code>Array.prototype.reduce()</code></td>
                <td><code>reservations</code></td>
                <td>Aggregating total expected covers and calculating floor occupancy %.</td>
                <td><span class="tag-pure">Pure (Non-mutating)</span></td>
              </tr>
              <tr>
                <td><code>Array.prototype.find()</code></td>
                <td><code>tables</code></td>
                <td>Locating the optimal open table when a walk-in party arrives.</td>
                <td><span class="tag-pure">Pure (Non-mutating)</span></td>
              </tr>
              <tr>
                <td><code>Array.prototype.sort()</code></td>
                <td><code>waitlist</code></td>
                <td>Sorting waitlist queue by arrival timestamp and priority order.</td>
                <td><span class="tag-pure">Copy sorted</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .analytics-page { display: flex; flex-direction: column; gap: 22px; }

    /* Header */
    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
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

    .glass-card {
      background: rgba(20, 27, 45, 0.72);
      backdrop-filter: blur(12px);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 18px;
      padding: 1.5rem;
      display: flex;
      flex-direction: column;
      gap: 16px;
    }
    .card-head { display: flex; flex-direction: column; gap: 2px; }
    .card-tag { font-size: 0.68rem; font-weight: 800; letter-spacing: 0.1em; color: #fbbf24; }
    .card-head h3 { margin: 0; color: #ffffff; font-size: 1.2rem; }

    .bars-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 16px; }
    .bar-item {
      background: rgba(13, 18, 31, 0.6);
      border: 1px solid rgba(255, 255, 255, 0.06);
      padding: 14px;
      border-radius: 12px;
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    .bar-head { display: flex; justify-content: space-between; font-size: 0.88rem; }
    .sec-name { color: #ffffff; font-weight: 600; }
    .sec-pct { color: #fbbf24; }
    .progress-track { height: 8px; background: rgba(255, 255, 255, 0.08); border-radius: 9999px; overflow: hidden; }
    .progress-fill { height: 100%; background: linear-gradient(90deg, #f59e0b, #fbbf24); border-radius: 9999px; }
    .sub-count { font-size: 0.75rem; color: #94a3b8; }

    /* Studio Workbench */
    .studio-card {
      border-color: rgba(245, 158, 11, 0.25);
      background: linear-gradient(145deg, rgba(20, 27, 45, 0.8), rgba(13, 18, 31, 0.9));
    }
    .studio-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
    }
    .studio-tag { font-size: 0.68rem; font-weight: 800; letter-spacing: 0.1em; color: #fbbf24; }
    .studio-header h3 { margin: 2px 0 4px; color: #ffffff; font-size: 1.3rem; }
    .studio-header p { margin: 0; color: #94a3b8; font-size: 0.85rem; }
    .badge-ts {
      background: rgba(56, 189, 248, 0.15);
      border: 1px solid #38bdf8;
      color: #38bdf8;
      font-size: 0.72rem;
      padding: 4px 10px;
      border-radius: 9999px;
      font-weight: 700;
    }

    .method-pills { display: flex; gap: 8px; flex-wrap: wrap; }
    .method-btn {
      background: rgba(13, 18, 31, 0.7);
      border: 1px solid rgba(255, 255, 255, 0.1);
      color: #94a3b8;
      padding: 8px 14px;
      border-radius: 8px;
      font-size: 0.84rem;
      font-weight: 700;
      cursor: pointer;
      transition: all 0.2s ease;
    }
    .method-btn:hover { color: #ffffff; border-color: rgba(255, 255, 255, 0.25); }
    .method-btn.active {
      background: linear-gradient(135deg, #f59e0b, #d97706);
      border-color: #f59e0b;
      color: #0f172a;
      box-shadow: 0 0 14px rgba(245, 158, 11, 0.35);
    }

    .code-workspace { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
    @media (max-width: 900px) { .code-workspace { grid-template-columns: 1fr; } }

    .code-box, .output-box {
      background: #080c14;
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 12px;
      padding: 14px;
      display: flex;
      flex-direction: column;
      gap: 10px;
    }
    .box-head {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 0.72rem;
      color: #64748b;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      border-bottom: 1px solid rgba(255, 255, 255, 0.06);
      padding-bottom: 6px;
    }
    .method-name { color: #fbbf24; }
    .status-live { color: #34d399; font-size: 0.7rem; font-weight: 800; }
    pre {
      margin: 0;
      background: transparent;
      overflow-x: auto;
      font-family: 'Fira Code', 'Cascadia Code', monospace;
      font-size: 0.84rem;
      color: #34d399;
      line-height: 1.5;
    }
    .json-output { color: #38bdf8; max-height: 220px; overflow-y: auto; }
    .explanation {
      margin: 0;
      font-size: 0.8rem;
      color: #cbd5e1;
      background: rgba(20, 27, 45, 0.6);
      padding: 8px 12px;
      border-radius: 6px;
      line-height: 1.45;
    }

    /* Table */
    .table-responsive { overflow-x: auto; }
    .academic-table { width: 100%; border-collapse: collapse; font-size: 0.85rem; text-align: left; }
    .academic-table th {
      background: rgba(13, 18, 31, 0.7);
      color: #94a3b8;
      padding: 12px 16px;
      font-weight: 700;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }
    .academic-table td {
      padding: 14px 16px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.06);
      color: #ffffff;
    }
    .academic-table code { color: #fbbf24; font-family: monospace; font-size: 0.85rem; }
    .tag-pure {
      background: rgba(16, 185, 129, 0.15);
      color: #34d399;
      border: 1px solid rgba(16, 185, 129, 0.3);
      padding: 3px 10px;
      border-radius: 4px;
      font-size: 0.75rem;
      font-weight: 700;
    }
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

  selectedMethod = 'filter';

  methods: ArrayMethodDemo[] = [
    {
      id: 'filter',
      name: '.filter() - Seated Diners',
      method: 'Array.prototype.filter()',
      description: 'Filters all reservations where status === "seated" to get real-time diners on the floor.',
      code: `const seatedDiners = reservations.filter(\n  res => res.status === 'seated'\n);`
    },
    {
      id: 'map',
      name: '.map() - Run Sheet Summaries',
      method: 'Array.prototype.map()',
      description: 'Transforms full reservation objects into compact guest name, party size, and table pairings.',
      code: `const runSheet = reservations.map(r => ({\n  guest: r.guestName,\n  party: r.partySize,\n  time: r.time,\n  table: r.tableId || 'Pending'\n}));`
    },
    {
      id: 'reduce',
      name: '.reduce() - Expected Daily Covers',
      method: 'Array.prototype.reduce()',
      description: 'Accumulates total expected guests across all confirmed and seated bookings.',
      code: `const totalCovers = reservations\n  .filter(r => r.status !== 'cancelled')\n  .reduce((sum, r) => sum + r.partySize, 0);`
    },
    {
      id: 'find',
      name: '.find() - First Large Table',
      method: 'Array.prototype.find()',
      description: 'Finds the first available table with capacity of 6 or more guests for walk-in seating.',
      code: `const banquetTable = tables.find(\n  t => t.status === 'available' && t.capacity >= 6\n);`
    },
    {
      id: 'sort',
      name: '.sort() - Sorted by Party Size',
      method: 'Array.prototype.sort()',
      description: 'Creates a non-mutating sorted copy of reservations ordered from largest to smallest party.',
      code: `const largestFirst = [...reservations].sort(\n  (a, b) => b.partySize - a.partySize\n);`
    }
  ];

  get currentDemo(): ArrayMethodDemo {
    return this.methods.find(m => m.id === this.selectedMethod) || this.methods[0];
  }

  get liveResultJson(): string {
    let raw: unknown;
    let tables: Table[] = [];
    let reservations: Reservation[] = [];

    this.restaurantService.tables$.subscribe(t => tables = t).unsubscribe();
    this.restaurantService.reservations$.subscribe(r => reservations = r).unsubscribe();

    switch (this.selectedMethod) {
      case 'filter':
        raw = reservations.filter(r => r.status === 'seated');
        break;
      case 'map':
        raw = reservations.map(r => ({
          guest: r.guestName,
          party: r.partySize,
          time: r.time,
          table: r.tableId || 'Pending'
        }));
        break;
      case 'reduce':
        const sum = reservations
          .filter(r => r.status !== 'cancelled')
          .reduce((acc, r) => acc + Number(r.partySize || 0), 0);
        raw = {
          totalReservations: reservations.length,
          totalCoversExpected: sum,
          averagePartySize: reservations.length > 0 ? (sum / reservations.length).toFixed(1) : 0
        };
        break;
      case 'find':
        raw = tables.find(t => t.status === 'available' && t.capacity >= 6) || { message: 'No available table >= 6 capacity' };
        break;
      case 'sort':
        raw = [...reservations].sort((a, b) => b.partySize - a.partySize).slice(0, 5).map(r => ({
          guest: r.guestName,
          partySize: r.partySize,
          time: r.time
        }));
        break;
      default:
        raw = [];
    }

    return JSON.stringify(raw, null, 2);
  }

  selectMethod(id: string): void {
    this.selectedMethod = id;
  }
}
