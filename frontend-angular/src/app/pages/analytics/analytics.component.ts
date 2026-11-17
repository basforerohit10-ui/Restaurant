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
      <div class="header">
        <div>
          <h2>Floor Analytics &amp; TypeScript Array Operations Studio</h2>
          <p>Real-time analytics powered by JavaScript/TypeScript array methods: filter, map, reduce, find, and sort.</p>
        </div>
      </div>

      <!-- Area Breakdown -->
      <div class="card">
        <h3>📊 Dining Room Section Utilization</h3>
        <div class="bars-grid">
          <div class="bar-item" *ngFor="let s of sectionStats">
            <div class="bar-head">
              <span>{{ s.name }}</span>
              <strong>{{ s.pct }}% Capacity</strong>
            </div>
            <div class="progress-track">
              <div class="progress-fill" [style.width.%]="s.pct"></div>
            </div>
            <span class="sub">{{ s.occupied }} of {{ s.total }} tables occupied</span>
          </div>
        </div>
      </div>

      <!-- Interactive Array Operations Studio for Teacher Evaluation -->
      <div class="card studio-card">
        <div class="studio-header">
          <div>
            <h3>⚡ Live Array Operations Studio (Interactive)</h3>
            <p>Select any JavaScript array method below to execute it live against current restaurant state.</p>
          </div>
          <span class="badge-ts">TypeScript / ES6+</span>
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
              <span class="status-live">● LIVE</span>
            </div>
            <pre class="json-output"><code>{{ liveResultJson }}</code></pre>
          </div>
        </div>
      </div>

      <!-- Academic Summary Table -->
      <div class="card">
        <h3>📚 Array Operations Reference for Restaurant Management</h3>
        <div class="table-responsive">
          <table class="academic-table">
            <thead>
              <tr>
                <th>Operation</th>
                <th>Target Dataset</th>
                <th>Use Case in Restaurant System</th>
                <th>Mutates Original Array?</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><code>Array.prototype.filter()</code></td>
                <td><code>tables</code> &amp; <code>reservations</code></td>
                <td>Filtering available tables by guest size or viewing only "seated" diners.</td>
                <td><span class="tag-no">No (Pure)</span></td>
              </tr>
              <tr>
                <td><code>Array.prototype.map()</code></td>
                <td><code>reservations</code></td>
                <td>Transforming database records into printable run-sheet rows.</td>
                <td><span class="tag-no">No (Pure)</span></td>
              </tr>
              <tr>
                <td><code>Array.prototype.reduce()</code></td>
                <td><code>reservations</code></td>
                <td>Aggregating total expected covers and calculating floor occupancy %.</td>
                <td><span class="tag-no">No (Pure)</span></td>
              </tr>
              <tr>
                <td><code>Array.prototype.find()</code></td>
                <td><code>tables</code></td>
                <td>Locating the optimal open table when a walk-in party arrives.</td>
                <td><span class="tag-no">No (Pure)</span></td>
              </tr>
              <tr>
                <td><code>Array.prototype.sort()</code></td>
                <td><code>waitlist</code></td>
                <td>Sorting waitlist queue by arrival timestamp and priority order.</td>
                <td><span class="tag-no">Copy sorted</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .analytics-page { display: flex; flex-direction: column; gap: 20px; }
    .header h2 { margin: 0 0 4px; color: #f8fafc; font-size: 1.5rem; }
    .header p { margin: 0; color: #94a3b8; font-size: 0.88rem; }
    .card {
      background: #1e293b;
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 14px;
      padding: 1.5rem;
    }
    .card h3 { margin: 0 0 16px; color: #f8fafc; font-size: 1.15rem; }

    .bars-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 16px; }
    .bar-item { background: rgba(15, 23, 42, 0.5); padding: 14px; border-radius: 10px; display: flex; flex-direction: column; gap: 8px; }
    .bar-head { display: flex; justify-content: space-between; font-size: 0.88rem; color: #f8fafc; }
    .progress-track { height: 8px; background: rgba(255, 255, 255, 0.08); border-radius: 9999px; overflow: hidden; }
    .progress-fill { height: 100%; background: #e11d48; border-radius: 9999px; }
    .sub { font-size: 0.75rem; color: #94a3b8; }

    .studio-card {
      background: linear-gradient(145deg, #1e293b, #0f172a);
      border: 1px solid rgba(56, 189, 248, 0.3);
    }
    .studio-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 16px;
    }
    .studio-header h3 { margin: 0 0 4px; color: #f8fafc; font-size: 1.25rem; }
    .studio-header p { margin: 0; color: #94a3b8; font-size: 0.85rem; }
    .badge-ts {
      background: rgba(56, 189, 248, 0.15);
      border: 1px solid #38bdf8;
      color: #38bdf8;
      font-size: 0.75rem;
      padding: 4px 10px;
      border-radius: 9999px;
      font-weight: 700;
    }

    .method-pills {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
      margin-bottom: 16px;
    }
    .method-btn {
      background: #0f172a;
      border: 1px solid rgba(255, 255, 255, 0.1);
      color: #94a3b8;
      padding: 8px 14px;
      border-radius: 8px;
      font-size: 0.85rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s ease;
    }
    .method-btn:hover { color: #f8fafc; border-color: rgba(255, 255, 255, 0.25); }
    .method-btn.active {
      background: #e11d48;
      border-color: #e11d48;
      color: #ffffff;
      box-shadow: 0 0 12px rgba(225, 29, 72, 0.4);
    }

    .code-workspace {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
    }
    @media (max-width: 900px) {
      .code-workspace { grid-template-columns: 1fr; }
    }

    .code-box, .output-box {
      background: #090e17;
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 10px;
      padding: 14px;
      display: flex;
      flex-direction: column;
      gap: 10px;
    }
    .box-head {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 0.75rem;
      color: #94a3b8;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      border-bottom: 1px solid rgba(255, 255, 255, 0.06);
      padding-bottom: 6px;
    }
    .method-name { color: #38bdf8; }
    .status-live { color: #10b981; font-size: 0.7rem; font-weight: 700; }
    pre {
      margin: 0;
      background: transparent;
      overflow-x: auto;
      font-family: 'Fira Code', 'Cascadia Code', monospace;
      font-size: 0.82rem;
      color: #34d399;
      line-height: 1.45;
    }
    .json-output {
      color: #38bdf8;
      max-height: 220px;
      overflow-y: auto;
    }
    .explanation {
      margin: 0;
      font-size: 0.8rem;
      color: #cbd5e1;
      background: rgba(30, 41, 59, 0.5);
      padding: 8px 10px;
      border-radius: 6px;
      line-height: 1.4;
    }

    .table-responsive { overflow-x: auto; }
    .academic-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 0.85rem;
      text-align: left;
    }
    .academic-table th {
      background: rgba(15, 23, 42, 0.6);
      color: #94a3b8;
      padding: 10px 14px;
      font-weight: 600;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }
    .academic-table td {
      padding: 12px 14px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.06);
      color: #f8fafc;
    }
    .academic-table code { color: #fb7185; font-family: monospace; }
    .tag-no {
      background: rgba(16, 185, 129, 0.15);
      color: #10b981;
      border: 1px solid rgba(16, 185, 129, 0.3);
      padding: 2px 8px;
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
