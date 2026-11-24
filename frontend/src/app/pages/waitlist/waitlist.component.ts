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
          <span class="sub-header">WALK-IN INTAKE • WHITE &amp; CHOCOLATE</span>
          <h2>Diner Waitlist Queue</h2>
          <p>Real-time queue tracking, quoted wait times, party management, and fast table seating.</p>
        </div>
        <button class="btn-add-walkin" (click)="isModalOpen = true">
          + Add Walk-In Party
        </button>
      </div>

      <!-- Queue Grid in White Cards -->
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

      <!-- Add Walkin Modal in White -->
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

    .btn-add-walkin {
      background: linear-gradient(135deg, #522d1a, #26140b);
      color: #ffffff;
      border: none;
      padding: 10px 20px;
      border-radius: 10px;
      font-weight: 700;
      font-size: 0.88rem;
      cursor: pointer;
      box-shadow: 0 4px 14px rgba(38, 20, 11, 0.3);
      transition: all 0.2s ease;
    }
    .btn-add-walkin:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(38, 20, 11, 0.45);
    }

    /* Queue Grid in White Cards */
    .queue-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
      gap: 18px;
    }
    .empty-box {
      grid-column: 1 / -1;
      background: #ffffff;
      border: 1px dashed rgba(74, 40, 22, 0.15);
      border-radius: 18px;
      padding: 3.5rem;
      text-align: center;
      color: #7d5b45;
    }
    .empty-icon { font-size: 2.5rem; margin-bottom: 8px; }

    .wait-card {
      background: #ffffff;
      border: 1px solid rgba(74, 40, 22, 0.12);
      border-radius: 18px;
      padding: 1.35rem;
      display: flex;
      flex-direction: column;
      gap: 12px;
      box-shadow: 0 4px 18px rgba(35, 18, 8, 0.04);
      transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
    }
    .wait-card:hover {
      transform: translateY(-3px);
      border-color: rgba(74, 40, 22, 0.25);
      box-shadow: 0 10px 28px rgba(35, 18, 8, 0.1);
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
      background: linear-gradient(135deg, #522d1a, #26140b);
      color: #fffbf7;
      font-weight: 800;
      font-size: 1.15rem;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 2px 8px rgba(38, 20, 11, 0.3);
    }
    .party-info { flex: 1; }
    .party-info h4 { margin: 0; color: #231208; font-size: 1.1rem; }
    .party-meta { font-size: 0.78rem; color: #7d5b45; }

    .time-tag {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      gap: 2px;
    }
    .wait-est {
      font-size: 0.78rem;
      font-weight: 800;
      color: #b45309;
      background: #fef3c7;
      border: 1px solid #fde68a;
      padding: 2px 8px;
      border-radius: 6px;
    }
    .time-in { font-size: 0.7rem; color: #8c6d58; }

    .contact-strip { font-size: 0.8rem; color: #573926; }
    .notes-quote {
      background: #faf7f2;
      border-left: 3px solid #8c4f2e;
      padding: 6px 10px;
      border-radius: 6px;
      font-size: 0.78rem;
      color: #573926;
      font-style: italic;
    }

    .card-actions { margin-top: 4px; }
    .btn-seat-walkin {
      width: 100%;
      background: linear-gradient(135deg, #16a34a, #15803d);
      color: #ffffff;
      border: none;
      padding: 10px;
      border-radius: 8px;
      font-weight: 700;
      font-size: 0.85rem;
      cursor: pointer;
      box-shadow: 0 4px 12px rgba(22, 163, 74, 0.25);
      transition: all 0.15s ease;
    }
    .btn-seat-walkin:hover {
      box-shadow: 0 6px 18px rgba(22, 163, 74, 0.4);
      transform: translateY(-1px);
    }

    /* Modal Form in White */
    .modal-backdrop {
      position: fixed;
      inset: 0;
      background: rgba(31, 15, 8, 0.65);
      backdrop-filter: blur(8px);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 2000;
      padding: 20px;
    }
    .modal-card {
      background: #ffffff;
      border: 1px solid rgba(74, 40, 22, 0.15);
      border-radius: 20px;
      padding: 1.85rem;
      width: 460px;
      max-width: 100%;
      color: #231208;
      box-shadow: 0 20px 50px rgba(31, 15, 8, 0.3);
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
      color: #8c4f2e;
    }
    .modal-head h3 {
      margin: 2px 0 0;
      font-family: 'Playfair Display', Georgia, serif;
      font-size: 1.45rem;
      color: #231208;
    }
    .btn-close {
      background: #faf7f2;
      border: 1px solid rgba(74, 40, 22, 0.12);
      color: #7d5b45;
      font-size: 1.3rem;
      width: 32px;
      height: 32px;
      border-radius: 50%;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .btn-close:hover { color: #231208; background: #f4ece1; }

    form { display: flex; flex-direction: column; gap: 12px; }
    .form-group { display: flex; flex-direction: column; gap: 4px; }
    form label { font-size: 0.78rem; font-weight: 800; color: #573926; }
    form input, form select {
      width: 100%;
      background: #faf7f2;
      border: 1px solid rgba(74, 40, 22, 0.14);
      border-radius: 8px;
      padding: 10px 12px;
      color: #231208;
      font-size: 0.88rem;
      box-sizing: border-box;
      outline: none;
      font-family: inherit;
    }
    form input:focus, form select:focus {
      border-color: #8c4f2e;
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
      background: #faf7f2;
      border: 1px solid rgba(74, 40, 22, 0.14);
      color: #7d5b45;
      padding: 10px 18px;
      border-radius: 10px;
      font-weight: 700;
      cursor: pointer;
    }
    .btn-modal-confirm {
      background: linear-gradient(135deg, #522d1a, #26140b);
      color: #ffffff;
      border: none;
      padding: 10px 22px;
      border-radius: 10px;
      font-weight: 700;
      cursor: pointer;
      box-shadow: 0 4px 14px rgba(38, 20, 11, 0.35);
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
