import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService, StaffAccount } from '../../services/auth.service';

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
          <div class="brand-badge">FOOD COURT • RESTAURANT PORTAL</div>
          <h1 class="brand-title">FOOD <span>COURT</span></h1>
          <p class="brand-sub">Fine Dining Floor Operations &amp; Guest Culinary Suite</p>
        </div>

        <!-- Mode Toggle Tabs: Customer vs Staff -->
        <div class="mode-tabs">
          <button
            type="button"
            class="tab-btn"
            [class.active]="activeTab === 'customer'"
            (click)="activeTab = 'customer'"
          >
            <span class="tab-icon">👤</span>
            <div class="tab-text">
              <strong>Guest / Customer</strong>
              <span>Explore Dishes &amp; Menu</span>
            </div>
          </button>

          <button
            type="button"
            class="tab-btn"
            [class.active]="activeTab === 'staff'"
            (click)="activeTab = 'staff'"
          >
            <span class="tab-icon">💼</span>
            <div class="tab-text">
              <strong>Staff &amp; Management</strong>
              <span>Post-Wise Operational Login</span>
            </div>
          </button>
        </div>

        <!-- Error Notification Banner -->
        <div class="error-banner" *ngIf="errorMessage">
          <span class="error-icon">⚠️</span>
          <span>{{ errorMessage }}</span>
        </div>

        <!-- =================== TAB 1: CUSTOMER / GUEST =================== -->
        <div class="tab-content" *ngIf="activeTab === 'customer'">
          <div class="customer-info-box">
            <span class="info-tag">🌟 GUEST ACCESS</span>
            <p>Welcome! Browse our hotel specialties with photos &amp; prices, read diner reviews, and book a dining table.</p>
          </div>

          <form (ngSubmit)="onCustomerSubmit()" class="login-form">
            <div class="form-group">
              <label for="custName">YOUR FULL NAME</label>
              <div class="input-wrap">
                <span class="input-icon">👤</span>
                <input
                  id="custName"
                  name="custName"
                  type="text"
                  [(ngModel)]="customerName"
                  placeholder="Enter your name (e.g. Sneha Kapoor)"
                  required
                  [disabled]="isLoading"
                />
              </div>
            </div>

            <div class="form-group">
              <label for="custPhone">CONTACT PHONE (OPTIONAL)</label>
              <div class="input-wrap">
                <span class="input-icon">📱</span>
                <input
                  id="custPhone"
                  name="custPhone"
                  type="tel"
                  [(ngModel)]="customerPhone"
                  placeholder="+91 98765 43210"
                  [disabled]="isLoading"
                />
              </div>
            </div>

            <button type="submit" class="btn-submit" [disabled]="isLoading || !customerName.trim()">
              <span *ngIf="!isLoading">Explore Food Court Menu &amp; Dishes →</span>
              <span *ngIf="isLoading" class="loading-state">
                <span class="spinner"></span> Opening Food Court...
              </span>
            </button>
          </form>

          <div class="divider">
            <span>OR 1-CLICK INSTANT GUEST EXPLORER</span>
          </div>

          <button type="button" class="quick-guest-btn" (click)="quickCustomerAccess('Sneha Kapoor')">
            <div class="guest-avatar">✨</div>
            <div class="guest-info">
              <strong>Quick Diner Guest (Sneha Kapoor)</strong>
              <span>Instant preview of food dishes, photos &amp; reviews</span>
            </div>
            <span class="arrow-pill">Explore →</span>
          </button>
        </div>

        <!-- =================== TAB 2: STAFF POST-WISE LOGIN =================== -->
        <div class="tab-content" *ngIf="activeTab === 'staff'">
          <!-- Post Selector Grid -->
          <div class="post-selector-section">
            <span class="section-label">SELECT YOUR DESIGNATION / POST:</span>
            <div class="post-pills">
              <button
                type="button"
                *ngFor="let post of staffPosts"
                class="post-pill"
                [class.selected]="selectedPostKey === post.postKey"
                (click)="selectPost(post)"
              >
                <span class="post-avatar">{{ post.avatar }}</span>
                <div class="post-title-wrap">
                  <strong>{{ post.postTitle }}</strong>
                  <span class="post-user">Default: {{ post.name }}</span>
                </div>
              </button>
            </div>
          </div>

          <form (ngSubmit)="onStaffSubmit()" class="login-form">
            <div class="form-group">
              <label for="staffUser">STAFF USERNAME / ID</label>
              <div class="input-wrap">
                <span class="input-icon">👤</span>
                <input
                  id="staffUser"
                  name="staffUser"
                  type="text"
                  [(ngModel)]="staffUsername"
                  placeholder="Enter staff username"
                  autocomplete="username"
                  required
                  [disabled]="isLoading"
                />
              </div>
            </div>

            <div class="form-group">
              <div class="label-row">
                <label for="staffPwd">ACCESS PASSWORD</label>
                <button type="button" class="btn-toggle-pwd" (click)="showPassword = !showPassword" tabindex="-1">
                  {{ showPassword ? 'Hide' : 'Show' }}
                </button>
              </div>
              <div class="input-wrap">
                <span class="input-icon">🔒</span>
                <input
                  id="staffPwd"
                  name="staffPwd"
                  [type]="showPassword ? 'text' : 'password'"
                  [(ngModel)]="staffPassword"
                  placeholder="Enter access password"
                  autocomplete="current-password"
                  required
                  [disabled]="isLoading"
                />
              </div>
            </div>

            <button type="submit" class="btn-submit" [disabled]="isLoading || !staffUsername || !staffPassword">
              <span *ngIf="!isLoading">Sign In as {{ getSelectedPostTitle() }} →</span>
              <span *ngIf="isLoading" class="loading-state">
                <span class="spinner"></span> Verifying Staff Station...
              </span>
            </button>
          </form>

          <div class="divider">
            <span>OR 1-CLICK INSTANT POST LOGIN</span>
          </div>

          <!-- 1-Click Fast Post Logins -->
          <div class="quick-access-grid">
            <button
              type="button"
              *ngFor="let p of staffPosts"
              class="quick-btn"
              (click)="quickStaffAccess(p.postKey)"
              [disabled]="isLoading"
            >
              <div class="quick-avatar">{{ p.avatar }}</div>
              <div class="quick-info">
                <strong>{{ p.postTitle }}</strong>
                <span>{{ p.name }} • {{ p.description }}</span>
              </div>
              <span class="arrow-pill">Sign In →</span>
            </button>
          </div>
        </div>

        <!-- Footer -->
        <div class="login-footer">
          <div class="cred-pill">
            <span class="cred-label">Demo Credentials:</span>
            <code>admin / admin123</code> • <code>manager / password123</code>
          </div>
          <p class="copyright">Food Court Restaurant &amp; Hotel Management System • Angular 18+</p>
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
      font-family: 'Plus Jakarta Sans', sans-serif;
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
      max-width: 540px;
      background: #ffffff;
      border: 1px solid rgba(74, 40, 22, 0.14);
      border-radius: 24px;
      padding: 2.5rem 2.25rem;
      box-shadow: 0 16px 40px rgba(38, 20, 11, 0.12), 0 4px 12px rgba(38, 20, 11, 0.06);
      position: relative;
      z-index: 10;
      animation: fadeIn 0.35s cubic-bezier(0.16, 1, 0.3, 1);
    }

    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(14px); }
      to { opacity: 1; transform: translateY(0); }
    }

    /* Brand Header */
    .brand-header {
      text-align: center;
      margin-bottom: 1.5rem;
    }
    .logo-box {
      width: 60px;
      height: 60px;
      margin: 0 auto 12px;
      background: linear-gradient(135deg, #d97706, #78350f);
      border-radius: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 8px 20px rgba(217, 119, 6, 0.3);
      border: 1px solid rgba(255, 255, 255, 0.25);
    }
    .logo-icon { font-size: 1.85rem; }
    .brand-badge {
      display: inline-block;
      font-size: 0.65rem;
      font-weight: 800;
      letter-spacing: 0.12em;
      color: #b45309;
      background: #fef3c7;
      border: 1px solid rgba(217, 119, 6, 0.25);
      padding: 3px 10px;
      border-radius: 9999px;
      margin-bottom: 6px;
    }
    .brand-title {
      margin: 0;
      font-family: 'Playfair Display', Georgia, serif;
      font-size: 2.05rem;
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
      margin: 4px 0 0;
      color: #7d5b45;
      font-size: 0.85rem;
    }

    /* Dual Mode Tabs */
    .mode-tabs {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 8px;
      background: #faf7f2;
      border: 1px solid rgba(74, 40, 22, 0.12);
      border-radius: 14px;
      padding: 6px;
      margin-bottom: 1.5rem;
    }
    .tab-btn {
      display: flex;
      align-items: center;
      gap: 10px;
      background: none;
      border: none;
      padding: 10px 14px;
      border-radius: 10px;
      cursor: pointer;
      text-align: left;
      transition: all 0.2s ease;
      color: #7d5b45;
    }
    .tab-btn.active {
      background: #ffffff;
      color: #231208;
      box-shadow: 0 4px 12px rgba(74, 40, 22, 0.08);
      border: 1px solid rgba(74, 40, 22, 0.1);
    }
    .tab-icon { font-size: 1.35rem; }
    .tab-text { display: flex; flex-direction: column; }
    .tab-text strong { font-size: 0.85rem; }
    .tab-text span { font-size: 0.68rem; opacity: 0.85; }

    /* Customer Info Box */
    .customer-info-box {
      background: #fdf5ef;
      border: 1px solid rgba(217, 119, 6, 0.2);
      border-radius: 12px;
      padding: 12px 14px;
      margin-bottom: 1.25rem;
    }
    .info-tag {
      font-size: 0.65rem;
      font-weight: 800;
      color: #b45309;
      letter-spacing: 0.06em;
      display: block;
      margin-bottom: 4px;
    }
    .customer-info-box p {
      margin: 0;
      font-size: 0.82rem;
      color: #573926;
      line-height: 1.4;
    }

    /* Post Selector Section */
    .post-selector-section {
      margin-bottom: 1.25rem;
    }
    .section-label {
      font-size: 0.7rem;
      font-weight: 800;
      letter-spacing: 0.06em;
      color: #573926;
      display: block;
      margin-bottom: 8px;
    }
    .post-pills {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 8px;
    }
    .post-pill {
      display: flex;
      align-items: center;
      gap: 8px;
      background: #faf7f2;
      border: 1px solid rgba(74, 40, 22, 0.12);
      border-radius: 10px;
      padding: 8px 10px;
      cursor: pointer;
      text-align: left;
      transition: all 0.15s ease;
    }
    .post-pill:hover {
      background: #f4ece1;
    }
    .post-pill.selected {
      background: #26140b;
      color: #ffffff;
      border-color: #26140b;
      box-shadow: 0 2px 8px rgba(38, 20, 11, 0.25);
    }
    .post-pill.selected .post-user {
      color: #fbbf24;
    }
    .post-avatar { font-size: 1.2rem; }
    .post-title-wrap { display: flex; flex-direction: column; }
    .post-title-wrap strong { font-size: 0.78rem; line-height: 1.2; }
    .post-user { font-size: 0.65rem; color: #7d5b45; }

    /* Error Banner */
    .error-banner {
      background: #fff1f2;
      border: 1px solid rgba(225, 29, 72, 0.3);
      color: #be123c;
      padding: 10px 14px;
      border-radius: 12px;
      font-size: 0.82rem;
      display: flex;
      align-items: center;
      gap: 10px;
      margin-bottom: 1.25rem;
    }

    /* Forms */
    .login-form {
      display: flex;
      flex-direction: column;
      gap: 1.15rem;
    }
    .form-group {
      display: flex;
      flex-direction: column;
      gap: 5px;
    }
    .label-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .form-group label {
      font-size: 0.7rem;
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
    }
    .input-wrap {
      position: relative;
      display: flex;
      align-items: center;
    }
    .input-icon {
      position: absolute;
      left: 12px;
      font-size: 1rem;
      pointer-events: none;
      opacity: 0.7;
    }
    .input-wrap input {
      width: 100%;
      background: #faf7f2;
      border: 1px solid rgba(74, 40, 22, 0.16);
      border-radius: 12px;
      padding: 11px 14px 11px 40px;
      color: #231208;
      font-size: 0.92rem;
      font-family: inherit;
      outline: none;
      transition: all 0.2s ease;
    }
    .input-wrap input:focus {
      background: #ffffff;
      border-color: #8c4f2e;
      box-shadow: 0 0 0 3px rgba(140, 79, 46, 0.12);
    }

    /* Submit Button */
    .btn-submit {
      margin-top: 4px;
      background: linear-gradient(135deg, #26140b, #431f10);
      color: #ffffff;
      border: 1px solid rgba(255, 255, 255, 0.15);
      border-radius: 12px;
      padding: 13px;
      font-size: 0.94rem;
      font-weight: 700;
      cursor: pointer;
      box-shadow: 0 6px 18px rgba(38, 20, 11, 0.25);
      transition: all 0.2s ease;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .btn-submit:hover:not(:disabled) {
      background: linear-gradient(135deg, #381a0e, #5a2a16);
      transform: translateY(-1px);
    }
    .btn-submit:disabled {
      opacity: 0.55;
      cursor: not-allowed;
    }

    .spinner {
      display: inline-block;
      width: 14px;
      height: 14px;
      border: 2px solid rgba(255, 255, 255, 0.3);
      border-radius: 50%;
      border-top-color: #ffffff;
      animation: spin 0.6s linear infinite;
      margin-right: 8px;
    }
    @keyframes spin { to { transform: rotate(360deg); } }

    /* Divider */
    .divider {
      margin: 1.5rem 0 1rem;
      display: flex;
      align-items: center;
      text-align: center;
      color: #9c806f;
      font-size: 0.66rem;
      font-weight: 800;
      letter-spacing: 0.08em;
    }
    .divider::before, .divider::after {
      content: '';
      flex: 1;
      border-bottom: 1px solid rgba(74, 40, 22, 0.12);
    }
    .divider span { padding: 0 10px; }

    /* Quick Guest Button */
    .quick-guest-btn {
      width: 100%;
      display: flex;
      align-items: center;
      gap: 12px;
      background: #faf7f2;
      border: 1px solid rgba(217, 119, 6, 0.3);
      border-radius: 14px;
      padding: 12px 14px;
      cursor: pointer;
      transition: all 0.2s ease;
      text-align: left;
    }
    .quick-guest-btn:hover {
      background: #ffffff;
      box-shadow: 0 4px 16px rgba(217, 119, 6, 0.15);
      transform: translateY(-1px);
    }
    .guest-avatar {
      font-size: 1.5rem;
      width: 42px;
      height: 42px;
      border-radius: 12px;
      background: #fef3c7;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .guest-info { flex: 1; display: flex; flex-direction: column; }
    .guest-info strong { font-size: 0.88rem; color: #231208; }
    .guest-info span { font-size: 0.72rem; color: #7d5b45; }

    /* Quick Access Grid for Staff */
    .quick-access-grid {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    .quick-btn {
      display: flex;
      align-items: center;
      gap: 10px;
      background: #faf7f2;
      border: 1px solid rgba(74, 40, 22, 0.12);
      border-radius: 10px;
      padding: 8px 12px;
      cursor: pointer;
      text-align: left;
      transition: all 0.15s ease;
    }
    .quick-btn:hover {
      background: #ffffff;
      border-color: #8c4f2e;
      transform: translateX(3px);
    }
    .quick-avatar {
      font-size: 1.25rem;
      width: 32px;
      height: 32px;
      border-radius: 8px;
      background: #f4ece1;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .quick-info { flex: 1; display: flex; flex-direction: column; }
    .quick-info strong { font-size: 0.82rem; color: #231208; }
    .quick-info span { font-size: 0.68rem; color: #7d5b45; }
    .arrow-pill { font-size: 0.8rem; color: #b45309; font-weight: 700; }

    /* Footer */
    .login-footer {
      margin-top: 1.5rem;
      text-align: center;
      display: flex;
      flex-direction: column;
      gap: 6px;
    }
    .cred-pill {
      font-size: 0.74rem;
      color: #6e3d23;
      background: #fef3c7;
      border: 1px solid rgba(217, 119, 6, 0.25);
      border-radius: 8px;
      padding: 5px 8px;
      display: inline-block;
      margin: 0 auto;
    }
    .cred-pill code {
      background: #ffffff;
      padding: 1px 4px;
      border-radius: 4px;
      font-weight: 700;
      color: #b45309;
    }
    .copyright { margin: 0; font-size: 0.68rem; color: #9c806f; }

    @media (max-width: 480px) {
      .login-card { padding: 1.75rem 1.25rem; }
      .post-pills { grid-template-columns: 1fr; }
    }
  `]
})
export class LoginComponent {
  private authService = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  activeTab: 'customer' | 'staff' = 'customer';

  // Customer state
  customerName = '';
  customerPhone = '';

  // Staff state
  staffPosts: StaffAccount[] = this.authService.staffPosts;
  selectedPostKey: 'admin' | 'manager' | 'hostess' | 'chef' = 'admin';
  staffUsername = 'admin';
  staffPassword = 'admin123';

  showPassword = false;
  isLoading = false;
  errorMessage = '';

  selectPost(post: StaffAccount): void {
    this.selectedPostKey = post.postKey;
    this.staffUsername = post.username;
    this.staffPassword = post.password;
    this.errorMessage = '';
  }

  getSelectedPostTitle(): string {
    const p = this.staffPosts.find(x => x.postKey === this.selectedPostKey);
    return p ? p.postTitle : 'Staff Station';
  }

  onCustomerSubmit(): void {
    if (!this.customerName.trim()) return;

    this.isLoading = true;
    this.errorMessage = '';

    setTimeout(() => {
      const result = this.authService.customerLogin(this.customerName, this.customerPhone);
      this.isLoading = false;
      if (!result.success) {
        this.errorMessage = result.message;
      }
    }, 300);
  }

  quickCustomerAccess(name: string): void {
    this.isLoading = true;
    setTimeout(() => {
      this.authService.quickCustomerLogin(name);
      this.isLoading = false;
    }, 200);
  }

  onStaffSubmit(): void {
    if (!this.staffUsername || !this.staffPassword) return;

    this.isLoading = true;
    this.errorMessage = '';

    setTimeout(() => {
      const result = this.authService.staffLogin(
        this.staffUsername,
        this.staffPassword,
        this.selectedPostKey
      );
      this.isLoading = false;
      if (!result.success) {
        this.errorMessage = result.message;
      }
    }, 350);
  }

  quickStaffAccess(postKey: 'admin' | 'manager' | 'hostess' | 'chef'): void {
    this.isLoading = true;
    setTimeout(() => {
      this.authService.quickStaffLogin(postKey);
      this.isLoading = false;
    }, 200);
  }
}
