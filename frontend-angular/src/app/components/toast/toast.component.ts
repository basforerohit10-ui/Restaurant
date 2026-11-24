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
      padding: 12px 18px;
      border-radius: 14px;
      background: #26140b;
      color: #fffbf7;
      font-size: 0.88rem;
      font-weight: 600;
      box-shadow: 0 10px 30px rgba(38, 20, 11, 0.35);
      border-left: 5px solid #d97706;
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-left-width: 5px;
      animation: slideIn 0.25s cubic-bezier(0.16, 1, 0.3, 1);
      cursor: pointer;
    }
    .toast-pill.success {
      border-left-color: #16a34a;
    }
    .toast-pill.warning {
      border-left-color: #f59e0b;
    }
    .toast-pill.error {
      border-left-color: #e11d48;
    }
    .toast-pill.info {
      border-left-color: #0ea5e9;
    }
    .message {
      flex: 1;
      line-height: 1.4;
    }
    .btn-close {
      background: transparent;
      border: none;
      color: #d6bfb0;
      font-size: 1.3rem;
      cursor: pointer;
      line-height: 1;
      padding: 0 4px;
    }
    .btn-close:hover {
      color: #ffffff;
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
