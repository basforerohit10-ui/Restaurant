import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="login-page">
      <!-- Ambient Decorative Blurred Glows -->
      <div class="glow-orb orb-1"></div>
      <div class="glow-orb orb-2"></div>

      <div class="login-card">
        <!-- Brand Header in Luxury Chocolate & Gold -->
        <div class="brand-header">
          <div class="logo-box">
            <span class="logo-icon">🍽️</span>
          </div>
          <div class="brand-badge">FOOD COURT • SECURE PORTAL</div>
          <h1 class="brand-title">FOOD <span>COURT</span></h1>
          <p class="brand-sub">Restaurant Table &amp; Dining Floor Operations Suite</p>
        </div>

        <!-- Error Notification Banner -->
        <div class="error-banner" *ngIf="errorMessage">
          <span class="error-icon">⚠️</span>
          <span>{{ errorMessage }}</span>
        </div>

        <!-- Login Form -->
        <form (ngSubmit)="onSubmit()" class="login-form">
          <div class="form-group">
            <label for="username">STAFF USERNAME OR ID</label>
            <div class="input-wrap">
              <span class="input-icon">👤</span>
              <input
                id="username"
                name="username"
                type="text"
                [(ngModel)]="username"
                placeholder="Enter staff username (e.g. admin)"
                autocomplete="username"
                required
                [disabled]="isLoading"
              />
            </div>
          </div>

          <div class="form-group">
            <div class="label-row">
              <label for="password">ACCESS PASSWORD</label>
              <button type="button" class="btn-toggle-pwd" (click)="showPassword = !showPassword" tabindex="-1">
                {{ showPassword ? 'Hide' : 'Show' }}
              </button>
            </div>
            <div class="input-wrap">
              <span class="input-icon">🔒</span>
              <input
                id="password"
                name="password"
                [type]="showPassword ? 'text' : 'password'"
                [(ngModel)]="password"
                placeholder="Enter password (e.g. admin123)"
                autocomplete="current-password"
                required
                [disabled]="isLoading"
              />
            </div>
          </div>

          <div class="form-options">
            <label class="remember-check">
              <input type="checkbox" [(ngModel)]="rememberMe" name="rememberMe" />
              <span>Remember this station</span>
            </label>
            <span class="security-tag">🔒 End-to-End Encrypted</span>
          </div>

          <!-- Submit Button -->
          <button type="submit" class="btn-submit" [disabled]="isLoading || !username || !password">
            <span *ngIf="!isLoading">Sign In to Food Court →</span>
            <span *ngIf="isLoading" class="loading-state">
              <span class="spinner"></span> Authenticating Station...
            </span>
          </button>
        </form>

        <div class="divider">
          <span>OR QUICK 1-CLICK DEMO ACCESS</span>
        </div>

        <!-- 1-Click Role Access Buttons -->
        <div class="quick-access-grid">
          <button type="button" class="quick-btn admin-btn" (click)="quickLogin('admin')" [disabled]="isLoading">
            <div class="quick-avatar">👨‍💼</div>
            <div class="quick-info">
              <strong>Admin (Rohit Basfore)</strong>
              <span>Full Control &amp; All Settings</span>
            </div>
            <span class="arrow-pill">→</span>
          </button>

          <button type="button" class="quick-btn manager-btn" (click)="quickLogin('manager')" [disabled]="isLoading">
            <div class="quick-avatar">🤵</div>
            <div class="quick-info">
              <strong>Floor Manager</strong>
              <span>Table Allocations &amp; Turns</span>
            </div>
            <span class="arrow-pill">→</span>
          </button>

          <button type="button" class="quick-btn hostess-btn" (click)="quickLogin('hostess')" [disabled]="isLoading">
            <div class="quick-avatar">👩‍💼</div>
            <div class="quick-info">
              <strong>Head Hostess (Priya)</strong>
              <span>Waitlist &amp; Seating Stand</span>
            </div>
            <span class="arrow-pill">→</span>
          </button>
        </div>

        <!-- Demo Credentials Footer Note -->
        <div class="login-footer">
          <div class="cred-pill">
            <span class="cred-label">Default Demo Login:</span>
            <code>admin</code> / <code>admin123</code>
          </div>
          <p class="copyright">Food Court Restaurant Management System • Angular 18+ Edition</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .login-page {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 2.5rem 1.5rem;
      background-color: #f5f0e8;
      background-image:
        radial-gradient(at 0% 0%, rgba(217, 119, 6, 0.08) 0px, transparent 50%),
        radial-gradient(at 100% 0%, rgba(38, 20, 11, 0.06) 0px, transparent 50%),
        radial-gradient(at 50% 100%, rgba(245, 240, 232, 1) 0px, transparent 50%);
      position: relative;
      overflow: hidden;
      font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif;
    }

    .glow-orb {
      position: absolute;
      border-radius: 50%;
      filter: blur(80px);
      pointer-events: none;
      z-index: 0;
    }
    .orb-1 {
      width: 450px;
      height: 450px;
      background: rgba(217, 119, 6, 0.12);
      top: -100px;
      left: -100px;
    }
    .orb-2 {
      width: 500px;
      height: 500px;
      background: rgba(82, 45, 26, 0.08);
      bottom: -120px;
      right: -120px;
    }

    .login-card {
      width: 100%;
      max-width: 500px;
      background: #ffffff;
      border: 1px solid rgba(74, 40, 22, 0.14);
      border-radius: 24px;
      padding: 2.75rem 2.5rem;
      box-shadow: 0 16px 40px rgba(38, 20, 11, 0.12), 0 4px 12px rgba(38, 20, 11, 0.06);
      position: relative;
      z-index: 10;
      animation: fadeIn 0.4s cubic-bezier(0.16, 1, 0.3, 1);
    }

    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(16px); }
      to { opacity: 1; transform: translateY(0); }
    }

    /* Brand Header */
    .brand-header {
      text-align: center;
      margin-bottom: 2rem;
    }
    .logo-box {
      width: 64px;
      height: 64px;
      margin: 0 auto 14px;
      background: linear-gradient(135deg, #d97706, #78350f);
      border-radius: 18px;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 8px 20px rgba(217, 119, 6, 0.3);
      border: 1px solid rgba(255, 255, 255, 0.25);
    }
    .logo-icon {
      font-size: 2rem;
    }
    .brand-badge {
      display: inline-block;
      font-size: 0.68rem;
      font-weight: 800;
      letter-spacing: 0.12em;
      color: #b45309;
      background: #fef3c7;
      border: 1px solid rgba(217, 119, 6, 0.25);
      padding: 3px 10px;
      border-radius: 9999px;
      margin-bottom: 8px;
    }
    .brand-title {
      margin: 0;
      font-family: 'Playfair Display', Georgia, serif;
      font-size: 2.1rem;
      color: #231208;
      font-weight: 700;
      letter-spacing: 0.05em;
      line-height: 1.15;
    }
    .brand-title span {
      font-family: 'Plus Jakarta Sans', sans-serif;
      font-weight: 800;
      color: #d97706;
    }
    .brand-sub {
      margin: 6px 0 0;
      color: #7d5b45;
      font-size: 0.88rem;
    }

    /* Error Banner */
    .error-banner {
      background: #fff1f2;
      border: 1px solid rgba(225, 29, 72, 0.3);
      color: #be123c;
      padding: 10px 14px;
      border-radius: 12px;
      font-size: 0.84rem;
      display: flex;
      align-items: center;
      gap: 10px;
      margin-bottom: 1.5rem;
      animation: shake 0.3s ease;
    }
    @keyframes shake {
      0%, 100% { transform: translateX(0); }
      25% { transform: translateX(-4px); }
      75% { transform: translateX(4px); }
    }

    /* Form Styles */
    .login-form {
      display: flex;
      flex-direction: column;
      gap: 1.25rem;
    }
    .form-group {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }
    .label-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .form-group label {
      font-size: 0.72rem;
      font-weight: 800;
      letter-spacing: 0.06em;
      color: #573926;
    }
    .btn-toggle-pwd {
      background: none;
      border: none;
      color: #b45309;
      font-size: 0.75rem;
      font-weight: 700;
      cursor: pointer;
      padding: 0;
    }
    .btn-toggle-pwd:hover {
      text-decoration: underline;
    }

    .input-wrap {
      position: relative;
      display: flex;
      align-items: center;
    }
    .input-icon {
      position: absolute;
      left: 14px;
      font-size: 1.05rem;
      pointer-events: none;
      opacity: 0.7;
    }
    .input-wrap input {
      width: 100%;
      background: #faf7f2;
      border: 1px solid rgba(74, 40, 22, 0.16);
      border-radius: 12px;
      padding: 12px 14px 12px 44px;
      color: #231208;
      font-size: 0.95rem;
      font-family: inherit;
      outline: none;
      transition: all 0.2s ease;
    }
    .input-wrap input:focus {
      background: #ffffff;
      border-color: #8c4f2e;
      box-shadow: 0 0 0 3px rgba(140, 79, 46, 0.12);
    }
    .input-wrap input::placeholder {
      color: #9c806f;
      font-size: 0.88rem;
    }

    .form-options {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 0.8rem;
      color: #7d5b45;
      margin-top: -2px;
    }
    .remember-check {
      display: flex;
      align-items: center;
      gap: 6px;
      cursor: pointer;
    }
    .remember-check input {
      accent-color: #522d1a;
      cursor: pointer;
    }
    .security-tag {
      font-size: 0.72rem;
      color: #8c4f2e;
      font-weight: 600;
    }

    /* Submit Button */
    .btn-submit {
      margin-top: 6px;
      background: linear-gradient(135deg, #26140b, #431f10);
      color: #ffffff;
      border: 1px solid rgba(255, 255, 255, 0.15);
      border-radius: 12px;
      padding: 14px;
      font-size: 0.96rem;
      font-weight: 700;
      cursor: pointer;
      box-shadow: 0 6px 18px rgba(38, 20, 11, 0.3);
      transition: all 0.2s ease;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .btn-submit:hover:not(:disabled) {
      background: linear-gradient(135deg, #381a0e, #5a2a16);
      transform: translateY(-1px);
      box-shadow: 0 8px 22px rgba(38, 20, 11, 0.38);
    }
    .btn-submit:active:not(:disabled) {
      transform: translateY(0);
    }
    .btn-submit:disabled {
      opacity: 0.55;
      cursor: not-allowed;
      box-shadow: none;
    }

    .spinner {
      display: inline-block;
      width: 16px;
      height: 16px;
      border: 2px solid rgba(255, 255, 255, 0.3);
      border-radius: 50%;
      border-top-color: #ffffff;
      animation: spin 0.6s linear infinite;
      margin-right: 8px;
    }
    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    /* Divider */
    .divider {
      margin: 1.75rem 0 1.25rem;
      display: flex;
      align-items: center;
      text-align: center;
      color: #9c806f;
      font-size: 0.68rem;
      font-weight: 800;
      letter-spacing: 0.08em;
    }
    .divider::before, .divider::after {
      content: '';
      flex: 1;
      border-bottom: 1px solid rgba(74, 40, 22, 0.12);
    }
    .divider span {
      padding: 0 12px;
    }

    /* Quick Access Buttons */
    .quick-access-grid {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }
    .quick-btn {
      display: flex;
      align-items: center;
      gap: 12px;
      background: #faf7f2;
      border: 1px solid rgba(74, 40, 22, 0.12);
      border-radius: 12px;
      padding: 10px 14px;
      cursor: pointer;
      transition: all 0.18s ease;
      text-align: left;
    }
    .quick-btn:hover {
      background: #ffffff;
      border-color: #8c4f2e;
      box-shadow: 0 4px 14px rgba(74, 40, 22, 0.08);
      transform: translateX(3px);
    }
    .quick-avatar {
      font-size: 1.4rem;
      width: 38px;
      height: 38px;
      border-radius: 10px;
      background: #f4ece1;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }
    .quick-info {
      flex: 1;
      display: flex;
      flex-direction: column;
    }
    .quick-info strong {
      font-size: 0.86rem;
      color: #231208;
    }
    .quick-info span {
      font-size: 0.72rem;
      color: #7d5b45;
    }
    .arrow-pill {
      font-size: 0.85rem;
      color: #b45309;
      font-weight: 800;
      opacity: 0.7;
    }
    .quick-btn:hover .arrow-pill {
      opacity: 1;
      transform: translateX(2px);
    }

    /* Footer */
    .login-footer {
      margin-top: 1.75rem;
      text-align: center;
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    .cred-pill {
      font-size: 0.76rem;
      color: #6e3d23;
      background: #fef3c7;
      border: 1px solid rgba(217, 119, 6, 0.25);
      border-radius: 8px;
      padding: 6px 10px;
      display: inline-block;
      margin: 0 auto;
    }
    .cred-pill code {
      background: #ffffff;
      border: 1px solid rgba(217, 119, 6, 0.3);
      padding: 1px 5px;
      border-radius: 4px;
      font-weight: 700;
      color: #b45309;
    }
    .copyright {
      margin: 0;
      font-size: 0.7rem;
      color: #9c806f;
    }

    @media (max-width: 480px) {
      .login-card {
        padding: 2rem 1.5rem;
      }
      .brand-title {
        font-size: 1.8rem;
      }
    }
  `]
})
export class LoginComponent {
  private authService = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  username = '';
  password = '';
  rememberMe = true;
  showPassword = false;
  isLoading = false;
  errorMessage = '';

  onSubmit(): void {
    if (!this.username || !this.password) return;

    this.isLoading = true;
    this.errorMessage = '';

    // Small realistic authentication latency
    setTimeout(() => {
      const result = this.authService.login(this.username, this.password);
      this.isLoading = false;

      if (result.success) {
        const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
        this.router.navigateByUrl(returnUrl);
      } else {
        this.errorMessage = result.message;
      }
    }, 450);
  }

  quickLogin(role: 'admin' | 'manager' | 'hostess'): void {
    this.isLoading = true;
    setTimeout(() => {
      this.authService.quickLogin(role);
      const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
      this.router.navigateByUrl(returnUrl);
      this.isLoading = false;
    }, 250);
  }
}
