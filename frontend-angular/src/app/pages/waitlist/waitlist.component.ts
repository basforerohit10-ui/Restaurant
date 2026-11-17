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
      <div class="header">
        <div>
          <h2>Walk-In Diner Waitlist (Angular)</h2>
          <p>Real-time queue tracking, quoted wait times, and fast walk-in seating.</p>
        </div>
        <button class="btn-primary" (click)="isModalOpen = true">+ Add Walk-In Party</button>
      </div>

      <div class="queue-grid" *ngIf="(waitlist$ | async) as list">
        <div class="empty-box" *ngIf="list.length === 0">
          <h3>No Parties Currently on Waitlist</h3>
          <p>Add walk-in guests when unbooked parties arrive at the host stand.</p>
        </div>

        <div class="wait-card" *ngFor="let item of list; let i = index">
          <div class="card-head">
            <span class="pos-badge">#{{ i + 1 }}</span>
            <div class="party-info">
              <h4>{{ item.guestName }}</h4>
              <span>Party of {{ item.partySize }} • Quoted ~{{ item.quotedWaitMinutes }}m</span>
            </div>
            <span class="time">Added {{ item.addedAt }}</span>
          </div>

          <div class="notes" *ngIf="item.notes">"{{ item.notes }}"</div>

          <div class="actions">
            <button class="btn-seat" (click)="seatWalkin(item.id)">Seat at Open Table</button>
          </div>
        </div>
      </div>

      <!-- Add Walkin Modal -->
      <div class="modal-backdrop" *ngIf="isModalOpen" (click)="isModalOpen = false">
        <div class="modal-box" (click)="$event.stopPropagation()">
          <h3>Add Guest to Waitlist</h3>
          <form (ngSubmit)="submitWalkin()">
            <label>Guest Name</label>
            <input type="text" [(ngModel)]="newEntry.guestName" name="guestName" required />

            <label>Contact Phone</label>
            <input type="text" [(ngModel)]="newEntry.phone" name="phone" />

            <div class="row">
              <div>
                <label>Party Size</label>
                <input type="number" [(ngModel)]="newEntry.partySize" name="partySize" min="1" max="10" />
              </div>
              <div>
                <label>Wait Time (min)</label>
                <input type="number" [(ngModel)]="newEntry.quotedWaitMinutes" name="wait" />
              </div>
            </div>

            <div class="modal-actions">
              <button type="button" class="btn-cancel" (click)="isModalOpen = false">Cancel</button>
              <button type="submit" class="btn-confirm">Add to Queue</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .waitlist-page { display: flex; flex-direction: column; gap: 20px; }
    .header { display: flex; justify-content: space-between; align-items: center; }
    .header h2 { margin: 0 0 4px; color: #f8fafc; font-size: 1.5rem; }
    .header p { margin: 0; color: #94a3b8; font-size: 0.88rem; }
    .btn-primary { background: #e11d48; color: white; border: none; padding: 10px 18px; border-radius: 8px; font-weight: 600; cursor: pointer; }
    .queue-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 16px; }
    .empty-box { background: #1e293b; border-radius: 14px; padding: 3rem; text-align: center; color: #94a3b8; grid-column: 1 / -1; }
    .wait-card { background: #1e293b; border: 1px solid rgba(255,255,255,0.08); border-radius: 14px; padding: 1.25rem; display: flex; flex-direction: column; gap: 10px; }
    .card-head { display: flex; align-items: center; gap: 12px; }
    .pos-badge { background: #e11d48; color: white; font-weight: 800; width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 0.85rem; }
    .party-info { flex: 1; }
    .party-info h4 { margin: 0; color: #f8fafc; font-size: 1.05rem; }
    .party-info span { font-size: 0.75rem; color: #94a3b8; }
    .time { font-size: 0.72rem; color: #f59e0b; background: rgba(245,158,11,0.1); padding: 3px 6px; border-radius: 4px; }
    .notes { font-size: 0.75rem; color: #fb7185; font-style: italic; background: rgba(15,23,42,0.5); padding: 6px; border-radius: 6px; }
    .actions { display: flex; margin-top: 4px; }
    .btn-seat { width: 100%; background: #10b981; color: white; border: none; padding: 8px; border-radius: 6px; font-weight: 600; cursor: pointer; }
    .modal-backdrop { position: fixed; inset: 0; background: rgba(0,0,0,0.7); display: flex; align-items: center; justify-content: center; z-index: 1000; }
    .modal-box { background: #1e293b; border-radius: 14px; padding: 1.5rem; width: 380px; display: flex; flex-direction: column; gap: 12px; color: #f8fafc; }
    .modal-box label { font-size: 0.78rem; color: #94a3b8; display: block; margin-top: 8px; }
    .modal-box input { width: 100%; background: #0f172a; border: 1px solid rgba(255,255,255,0.1); border-radius: 6px; padding: 8px; color: #f8fafc; box-sizing: border-box; }
    .modal-box .row { display: flex; gap: 10px; }
    .modal-actions { display: flex; justify-content: flex-end; gap: 10px; margin-top: 14px; }
    .btn-cancel { background: transparent; border: 1px solid rgba(255,255,255,0.1); color: #94a3b8; padding: 8px 14px; border-radius: 6px; cursor: pointer; }
    .btn-confirm { background: #e11d48; color: white; border: none; padding: 8px 16px; border-radius: 6px; font-weight: 600; cursor: pointer; }
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
