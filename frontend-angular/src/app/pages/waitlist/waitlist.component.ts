import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RestaurantService } from '../../services/restaurant.service';

@Component({
  selector: 'app-waitlist',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="waitlist-page">
      <!-- Header -->
      <div class="page-header">
        <div>
          <span class="sub-header">WALK-IN INTAKE DESK</span>
          <h2>Diner Waitlist Queue</h2>
          <p>Real-time queue tracking, quoted wait times, party management, and fast table seating.</p>
        </div>
        <button class="btn-add-walkin" (click)="isModalOpen = true">
          + Add Walk-In Party
        </button>
      </div>

      <!-- Queue Grid -->
      <div class="queue-grid" *ngIf="(waitlist$ | async) as list">
        <div class="empty-box" *ngIf="list.length === 0">
          <div class="empty-icon">⏳</div>
          <h3>Waitlist Queue is Clear</h3>
          <p>No walk-in parties currently waiting. Add guests when unbooked parties arrive at the host stand.</p>
        </div>

        <div class="wait-card" *ngFor="let item of list; let i = index">
          <div class="card-head">
            <div class="rank-badge">
              <span>#{{ i + 1 }}</span>
            </div>
            <div class="party-info">
              <h4>{{ item.guestName }}</h4>
              <span class="party-meta">👥 Party of {{ item.partySize }} • Prefers {{ item.sectionPreference | titlecase }}</span>
            </div>
            <div class="time-tag">
              <span class="wait-est">~{{ item.quotedWaitMinutes }}m wait</span>
              <span class="time-in">Added {{ item.addedAt }}</span>
            </div>
          </div>

          <div class="contact-strip" *ngIf="item.phone">
            <span>📞 {{ item.phone }}</span>
          </div>

          <div class="notes-quote" *ngIf="item.notes">
            <span>"{{ item.notes }}"</span>
          </div>

          <div class="card-actions">
            <button class="btn-seat-walkin" (click)="seatWalkin(item.id)">
              ⚡ Seat at Open Table
            </button>
          </div>
        </div>
      </div>

      <!-- Add Walkin Modal -->
      <div class="modal-backdrop" *ngIf="isModalOpen" (click)="isModalOpen = false">
        <div class="modal-card" (click)="$event.stopPropagation()">
          <div class="modal-head">
            <div>
              <span class="modal-tag">QUEUE INTAKE</span>
              <h3>Add Party to Waitlist</h3>
            </div>
            <button class="btn-close" (click)="isModalOpen = false">×</button>
          </div>

          <form (ngSubmit)="submitWalkin()">
            <div class="form-group">
              <label>Guest Full Name *</label>
              <input type="text" [(ngModel)]="newEntry.guestName" name="guestName" placeholder="e.g. Gordon Ramsay" required />
            </div>

            <div class="form-group">
              <label>Contact Phone (SMS Notification)</label>
              <input type="text" [(ngModel)]="newEntry.phone" name="phone" placeholder="+1 (555) 000-0000" />
            </div>

            <div class="form-row">
              <div class="form-col">
                <label>Party Size *</label>
                <input type="number" [(ngModel)]="newEntry.partySize" name="partySize" min="1" max="15" required />
              </div>
              <div class="form-col">
                <label>Quoted Wait (Minutes)</label>
                <input type="number" [(ngModel)]="newEntry.quotedWaitMinutes" name="wait" min="5" step="5" />
              </div>
            </div>

            <div class="form-group">
              <label>Section Preference</label>
              <select [(ngModel)]="newEntry.sectionPreference" name="sectionPreference">
                <option value="First Available">First Available Section</option>
                <option value="Main Dining Hall">Main Dining Hall</option>
                <option value="Garden Patio">Garden Patio</option>
                <option value="Rooftop Terrace">Rooftop Terrace</option>
                <option value="VIP Lounge">VIP Lounge</option>
              </select>
            </div>

            <div class="form-group">
              <label>Host Notes</label>
              <input type="text" [(ngModel)]="newEntry.notes" name="notes" placeholder="e.g. Celebrating promotion, high-chair needed..." />
            </div>

            <div class="modal-foot">
              <button type="button" class="btn-modal-cancel" (click)="isModalOpen = false">Cancel</button>
              <button type="submit" class="btn-modal-confirm">Add to Queue</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .waitlist-page { display: flex; flex-direction: column; gap: 22px; }

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

    .btn-add-walkin {
      background: linear-gradient(135deg, #f59e0b, #d97706);
      color: #0f172a;
      border: none;
      padding: 10px 20px;
      border-radius: 10px;
      font-weight: 700;
      font-size: 0.88rem;
      cursor: pointer;
      box-shadow: 0 4px 14px rgba(245, 158, 11, 0.3);
      transition: all 0.2s ease;
    }
    .btn-add-walkin:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(245, 158, 11, 0.45);
    }

    /* Queue Grid */
    .queue-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
      gap: 18px;
    }
    .empty-box {
      grid-column: 1 / -1;
      background: rgba(20, 27, 45, 0.6);
      border: 1px dashed rgba(255, 255, 255, 0.12);
      border-radius: 18px;
      padding: 3.5rem;
      text-align: center;
      color: #94a3b8;
    }
    .empty-icon { font-size: 2.5rem; margin-bottom: 8px; }

    .wait-card {
      background: rgba(20, 27, 45, 0.72);
      backdrop-filter: blur(12px);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 18px;
      padding: 1.35rem;
      display: flex;
      flex-direction: column;
      gap: 12px;
      transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
    }
    .wait-card:hover {
      transform: translateY(-3px);
      border-color: rgba(255, 255, 255, 0.18);
      box-shadow: 0 12px 28px -6px rgba(0, 0, 0, 0.5);
    }

    .card-head {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .rank-badge {
      width: 42px;
      height: 42px;
      border-radius: 12px;
      background: linear-gradient(135deg, #f59e0b, #d97706);
      color: #0f172a;
      font-weight: 800;
      font-size: 1.15rem;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 0 12px rgba(245, 158, 11, 0.3);
    }
    .party-info { flex: 1; }
    .party-info h4 { margin: 0; color: #ffffff; font-size: 1.1rem; }
    .party-meta { font-size: 0.78rem; color: #94a3b8; }

    .time-tag {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      gap: 2px;
    }
    .wait-est {
      font-size: 0.78rem;
      font-weight: 800;
      color: #fbbf24;
      background: rgba(245, 158, 11, 0.15);
      border: 1px solid rgba(245, 158, 11, 0.3);
      padding: 2px 8px;
      border-radius: 6px;
    }
    .time-in { font-size: 0.7rem; color: #64748b; }

    .contact-strip { font-size: 0.8rem; color: #cbd5e1; }
    .notes-quote {
      background: rgba(13, 18, 31, 0.5);
      border-left: 3px solid #fb7185;
      padding: 6px 10px;
      border-radius: 6px;
      font-size: 0.78rem;
      color: #cbd5e1;
      font-style: italic;
    }

    .card-actions { margin-top: 4px; }
    .btn-seat-walkin {
      width: 100%;
      background: linear-gradient(135deg, #10b981, #059669);
      color: #ffffff;
      border: none;
      padding: 10px;
      border-radius: 8px;
      font-weight: 700;
      font-size: 0.85rem;
      cursor: pointer;
      box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
      transition: all 0.15s ease;
    }
    .btn-seat-walkin:hover {
      box-shadow: 0 6px 18px rgba(16, 185, 129, 0.45);
      transform: translateY(-1px);
    }

    /* Modal Form */
    .modal-backdrop {
      position: fixed;
      inset: 0;
      background: rgba(8, 12, 20, 0.82);
      backdrop-filter: blur(8px);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 2000;
      padding: 20px;
    }
    .modal-card {
      background: #141b2d;
      border: 1px solid rgba(255, 255, 255, 0.12);
      border-radius: 20px;
      padding: 1.75rem;
      width: 460px;
      max-width: 100%;
      color: #ffffff;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.6);
    }
    .modal-head {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 16px;
    }
    .modal-tag {
      font-size: 0.68rem;
      font-weight: 800;
      letter-spacing: 0.1em;
      color: #fbbf24;
    }
    .modal-head h3 {
      margin: 2px 0 0;
      font-family: 'Playfair Display', Georgia, serif;
      font-size: 1.4rem;
    }
    .btn-close {
      background: transparent;
      border: none;
      color: #94a3b8;
      font-size: 1.4rem;
      cursor: pointer;
    }

    form { display: flex; flex-direction: column; gap: 12px; }
    .form-group { display: flex; flex-direction: column; gap: 4px; }
    form label { font-size: 0.78rem; font-weight: 700; color: #94a3b8; }
    form input, form select {
      width: 100%;
      background: #0d121f;
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 8px;
      padding: 10px 12px;
      color: #ffffff;
      font-size: 0.88rem;
      box-sizing: border-box;
      outline: none;
      font-family: inherit;
    }
    form input:focus, form select:focus {
      border-color: #fbbf24;
    }
    .form-row { display: flex; gap: 12px; }
    .form-col { flex: 1; display: flex; flex-direction: column; gap: 4px; }

    .modal-foot {
      display: flex;
      justify-content: flex-end;
      gap: 10px;
      margin-top: 10px;
    }
    .btn-modal-cancel {
      background: transparent;
      border: 1px solid rgba(255, 255, 255, 0.12);
      color: #94a3b8;
      padding: 10px 18px;
      border-radius: 10px;
      font-weight: 600;
      cursor: pointer;
    }
    .btn-modal-confirm {
      background: linear-gradient(135deg, #f59e0b, #d97706);
      color: #0f172a;
      border: none;
      padding: 10px 22px;
      border-radius: 10px;
      font-weight: 700;
      cursor: pointer;
      box-shadow: 0 4px 14px rgba(245, 158, 11, 0.35);
    }
  `]
})
export class WaitlistComponent {
  private restaurantService = inject(RestaurantService);
  waitlist$ = this.restaurantService.waitlist$;

  isModalOpen = false;
  newEntry = {
    guestName: '',
    phone: '',
    partySize: 2,
    sectionPreference: 'First Available',
    quotedWaitMinutes: 15,
    notes: ''
  };

  seatWalkin(waitlistId: string) {
    this.restaurantService.seatWaitlistGuest(waitlistId, 'T-102');
  }

  submitWalkin() {
    if (!this.newEntry.guestName) return;
    this.restaurantService.addToWaitlist(this.newEntry);
    this.isModalOpen = false;
    this.newEntry.guestName = '';
    this.newEntry.phone = '';
  }
}
