import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RestaurantService } from '../../services/restaurant.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="toast-container" *ngIf="(toasts$ | async) as toasts">
      <div
        class="toast-pill"
        *ngFor="let t of toasts"
        [class]="t.type"
        (click)="dismiss(t.id)"
      >
        <span class="icon">
          <ng-container [ngSwitch]="t.type">
            <span *ngSwitchCase="'success'">✅</span>
            <span *ngSwitchCase="'warning'">⚠️</span>
            <span *ngSwitchCase="'error'">❌</span>
            <span *ngSwitchDefault>ℹ️</span>
          </ng-container>
        </span>
        <span class="message">{{ t.message }}</span>
        <button class="btn-close" (click)="dismiss(t.id); $event.stopPropagation()">×</button>
      </div>
    </div>
  `,
  styles: [`
    .toast-container {
      position: fixed;
      bottom: 24px;
      right: 24px;
      z-index: 9999;
      display: flex;
      flex-direction: column;
      gap: 10px;
      max-width: 380px;
      pointer-events: none;
    }
    .toast-pill {
      pointer-events: auto;
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 12px 16px;
      border-radius: 12px;
      background: #1e293b;
      color: #f8fafc;
      font-size: 0.88rem;
      font-weight: 500;
      box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.5), 0 8px 10px -6px rgba(0, 0, 0, 0.4);
      border-left: 4px solid #38bdf8;
      animation: slideIn 0.25s cubic-bezier(0.16, 1, 0.3, 1);
      cursor: pointer;
    }
    .toast-pill.success {
      border-left-color: #10b981;
      background: linear-gradient(to right, rgba(16, 185, 129, 0.15), #1e293b);
    }
    .toast-pill.warning {
      border-left-color: #f59e0b;
      background: linear-gradient(to right, rgba(245, 158, 11, 0.15), #1e293b);
    }
    .toast-pill.error {
      border-left-color: #ef4444;
      background: linear-gradient(to right, rgba(239, 68, 68, 0.15), #1e293b);
    }
    .toast-pill.info {
      border-left-color: #38bdf8;
      background: linear-gradient(to right, rgba(56, 189, 248, 0.15), #1e293b);
    }
    .message {
      flex: 1;
      line-height: 1.4;
    }
    .btn-close {
      background: transparent;
      border: none;
      color: #94a3b8;
      font-size: 1.2rem;
      cursor: pointer;
      line-height: 1;
      padding: 0 4px;
    }
    .btn-close:hover {
      color: #f8fafc;
    }
    @keyframes slideIn {
      from {
        opacity: 0;
        transform: translateY(12px) scale(0.96);
      }
      to {
        opacity: 1;
        transform: translateY(0) scale(1);
      }
    }
  `]
})
export class ToastComponent {
  private restaurantService = inject(RestaurantService);
  toasts$ = this.restaurantService.toasts$;

  dismiss(id: string): void {
    this.restaurantService.removeToast(id);
  }
}
