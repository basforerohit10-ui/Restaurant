import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { RestaurantService } from './restaurant.service';

export interface UserSession {
  username: string;
  name: string;
  userType: 'customer' | 'staff';
  role: 'customer' | 'admin' | 'manager' | 'hostess' | 'chef';
  roleLabel: string;
  postTitle: string;
  avatar: string;
  phone?: string;
  loginTime: string;
}

export interface StaffAccount {
  id: string;
  username: string;
  password: string;
  name: string;
  postKey: 'admin' | 'manager' | 'hostess' | 'chef';
  postTitle: string;
  avatar: string;
  description: string;
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
  public isStaff$: Observable<boolean> = this.currentUser$.pipe(map(user => user?.userType === 'staff'));
  public isCustomer$: Observable<boolean> = this.currentUser$.pipe(map(user => user?.userType === 'customer'));

  // Pre-configured Staff Accounts with specific Posts/Designations
  public readonly staffPosts: StaffAccount[] = [
    {
      id: 'staff-admin',
      username: 'admin',
      password: 'admin123',
      name: 'Rohit Basfore',
      postKey: 'admin',
      postTitle: 'General Manager & Admin',
      avatar: '👨‍💼',
      description: 'Complete master access to tables, CRM, analytics, reservations & menu'
    },
    {
      id: 'staff-manager',
      username: 'manager',
      password: 'password123',
      name: 'Vikram Mehta',
      postKey: 'manager',
      postTitle: 'Floor Operations Manager',
      avatar: '🤵',
      description: 'Dining floor management, table turns, seatings, and shift control'
    },
    {
      id: 'staff-hostess',
      username: 'hostess',
      password: 'password123',
      name: 'Priya Sharma',
      postKey: 'hostess',
      postTitle: 'Head Hostess Stand',
      avatar: '👩‍💼',
      description: 'Host stand intake, walk-in queue, table reservations & check-in'
    },
    {
      id: 'staff-chef',
      username: 'chef',
      password: 'password123',
      name: 'Ranveer Brar',
      postKey: 'chef',
      postTitle: 'Executive Head Chef',
      avatar: '👨‍🍳',
      description: 'Kitchen menu management, dishes review feedback & daily specials'
    }
  ];

  private loadStoredUser(): UserSession | null {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (data) {
        return JSON.parse(data);
      }
    } catch {
      // ignore localStorage errors
    }
    return null;
  }

  isLoggedIn(): boolean {
    return !!this.currentUserSubject.value;
  }

  isStaff(): boolean {
    return this.currentUserSubject.value?.userType === 'staff';
  }

  isCustomer(): boolean {
    return this.currentUserSubject.value?.userType === 'customer';
  }

  getCurrentUser(): UserSession | null {
    return this.currentUserSubject.value;
  }

  // 1. Customer Login (For normal visitors browsing the food court, dishes, and booking tables)
  customerLogin(name: string, phone?: string): { success: boolean; message: string } {
    const trimmedName = (name || '').trim();
    if (!trimmedName) {
      return { success: false, message: 'Please enter your name to explore the Food Court menu.' };
    }

    const session: UserSession = {
      username: trimmedName.toLowerCase().replace(/\s+/g, '.'),
      name: trimmedName,
      userType: 'customer',
      role: 'customer',
      roleLabel: 'Valued Guest & Diner',
      postTitle: 'Guest / Customer',
      avatar: '👤',
      phone: phone || '',
      loginTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    this.saveSession(session);
    this.restaurantService.showToast(`Welcome to Food Court, ${session.name}! Enjoy our menu.`, 'success');
    this.router.navigate(['/menu']);
    return { success: true, message: 'Welcome to Food Court!' };
  }

  quickCustomerLogin(presetName: string = 'Sneha Kapoor'): void {
    this.customerLogin(presetName, '+91 98765 43210');
  }

  // 2. Staff Post-Wise Login
  staffLogin(usernameInput: string, passwordInput: string, selectedPostKey?: string): { success: boolean; message: string } {
    const username = (usernameInput || '').trim().toLowerCase();
    const password = (passwordInput || '').trim();

    if (!username || !password) {
      return { success: false, message: 'Please enter staff username and access password.' };
    }

    const matched = this.staffPosts.find(acc => {
      const usernameMatch = acc.username.toLowerCase() === username;
      const postMatch = !selectedPostKey || acc.postKey === selectedPostKey;
      return usernameMatch && postMatch;
    });

    if (matched && matched.password === password) {
      const session: UserSession = {
        username: matched.username,
        name: matched.name,
        userType: 'staff',
        role: matched.postKey,
        roleLabel: matched.postTitle,
        postTitle: matched.postTitle,
        avatar: matched.avatar,
        loginTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      this.saveSession(session);
      this.restaurantService.showToast(`Welcome back, ${session.name} (${session.postTitle})!`, 'success');
      this.router.navigate(['/']);
      return { success: true, message: 'Staff login successful.' };
    }

    // Fallback password check for admin/manager/chef
    if (password === 'admin123' || password === 'password123') {
      const post = this.staffPosts.find(p => p.postKey === selectedPostKey) || this.staffPosts[0];
      const displayName = usernameInput.charAt(0).toUpperCase() + usernameInput.slice(1);
      const session: UserSession = {
        username,
        name: displayName,
        userType: 'staff',
        role: post.postKey,
        roleLabel: post.postTitle,
        postTitle: post.postTitle,
        avatar: post.avatar,
        loginTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      this.saveSession(session);
      this.restaurantService.showToast(`Staff sign-in granted for ${session.name}`, 'success');
      this.router.navigate(['/']);
      return { success: true, message: 'Staff login successful.' };
    }

    return {
      success: false,
      message: 'Invalid credentials. Check username & password or click 1-Click Staff Post buttons below.'
    };
  }

  quickStaffLogin(postKey: 'admin' | 'manager' | 'hostess' | 'chef'): void {
    const acc = this.staffPosts.find(a => a.postKey === postKey) || this.staffPosts[0];
    const session: UserSession = {
      username: acc.username,
      name: acc.name,
      userType: 'staff',
      role: acc.postKey,
      roleLabel: acc.postTitle,
      postTitle: acc.postTitle,
      avatar: acc.avatar,
      loginTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    this.saveSession(session);
    this.restaurantService.showToast(`Staff Station Online: ${session.name} (${session.postTitle})`, 'success');
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
      this.restaurantService.showToast(`You have been signed out. Thank you for visiting!`, 'info');
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
