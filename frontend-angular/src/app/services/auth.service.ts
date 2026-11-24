import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { RestaurantService } from './restaurant.service';

export interface UserSession {
  username: string;
  name: string;
  role: 'admin' | 'manager' | 'hostess' | 'staff';
  roleLabel: string;
  avatar: string;
  loginTime: string;
}

const STORAGE_KEY = 'foodcourt_auth_session';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private router = inject(Router);
  private restaurantService = inject(RestaurantService);

  private currentUserSubject = new BehaviorSubject<UserSession | null>(this.loadStoredUser());
  public currentUser$: Observable<UserSession | null> = this.currentUserSubject.asObservable();
  public isLoggedIn$: Observable<boolean> = this.currentUser$.pipe(map(user => !!user));

  // Pre-configured staff accounts
  private validAccounts = [
    {
      username: 'admin',
      password: 'admin123',
      name: 'Rohit Basfore',
      role: 'admin' as const,
      roleLabel: 'General Manager & Admin',
      avatar: '👨‍💼'
    },
    {
      username: 'manager',
      password: 'password123',
      name: 'Vikram Mehta',
      role: 'manager' as const,
      roleLabel: 'Floor Operations Manager',
      avatar: '🤵'
    },
    {
      username: 'hostess',
      password: 'password123',
      name: 'Priya Sharma',
      role: 'hostess' as const,
      roleLabel: 'Head Hostess Stand',
      avatar: '👩‍💼'
    }
  ];

  private loadStoredUser(): UserSession | null {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (data) {
        return JSON.parse(data);
      }
    } catch {
      // localStorage may fail in some environments
    }
    return null;
  }

  isLoggedIn(): boolean {
    return !!this.currentUserSubject.value;
  }

  getCurrentUser(): UserSession | null {
    return this.currentUserSubject.value;
  }

  login(usernameInput: string, passwordInput: string): { success: boolean; message: string } {
    const username = (usernameInput || '').trim().toLowerCase();
    const password = (passwordInput || '').trim();

    if (!username || !password) {
      return { success: false, message: 'Please enter both username and password.' };
    }

    // Check pre-configured staff list
    const found = this.validAccounts.find(
      acc => acc.username.toLowerCase() === username && acc.password === password
    );

    let session: UserSession;

    if (found) {
      session = {
        username: found.username,
        name: found.name,
        role: found.role,
        roleLabel: found.roleLabel,
        avatar: found.avatar,
        loginTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
    } else if (password === 'admin123' || password === 'password123' || password.length >= 4) {
      // Flexible fallback for custom names
      const displayName = usernameInput.charAt(0).toUpperCase() + usernameInput.slice(1);
      session = {
        username,
        name: displayName,
        role: 'manager',
        roleLabel: 'Restaurant Staff',
        avatar: '👤',
        loginTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
    } else {
      return {
        success: false,
        message: 'Invalid credentials. Use demo account (admin / admin123) or password123.'
      };
    }

    this.saveSession(session);
    this.restaurantService.showToast(`Welcome back, ${session.name}! Access granted.`, 'success');
    return { success: true, message: 'Login successful' };
  }

  quickLogin(role: 'admin' | 'manager' | 'hostess'): void {
    const acc = this.validAccounts.find(a => a.role === role) || this.validAccounts[0];
    const session: UserSession = {
      username: acc.username,
      name: acc.name,
      role: acc.role,
      roleLabel: acc.roleLabel,
      avatar: acc.avatar,
      loginTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    this.saveSession(session);
    this.restaurantService.showToast(`Logged in as ${session.name} (${session.roleLabel})`, 'success');
    this.router.navigate(['/']);
  }

  logout(): void {
    const current = this.currentUserSubject.value;
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
    this.currentUserSubject.next(null);
    if (current) {
      this.restaurantService.showToast(`Goodbye ${current.name}, you have been signed out.`, 'info');
    }
    this.router.navigate(['/login']);
  }

  private saveSession(session: UserSession): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
    } catch {
      // ignore
    }
    this.currentUserSubject.next(session);
  }
}
