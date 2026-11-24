import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { VisitorLogEntry } from '../models/restaurant.model';
import { RestaurantService } from './restaurant.service';

const VISITOR_STORAGE_KEY = 'foodcourt_visitors_log_v1';

@Injectable({
  providedIn: 'root'
})
export class VisitorService {
  private restaurantService = inject(RestaurantService);

  private readonly initialVisitors: VisitorLogEntry[] = [
    {
      id: 'vis-1',
      name: 'Sneha Kapoor',
      phone: '+91 98765 43210',
      userType: 'customer',
      roleOrPost: 'Valued Diner',
      timestamp: 'Today, 06:45 PM',
      timeAgo: '15 mins ago',
      action: 'Explored Starters & Main Course Dishes Menu',
      status: 'active',
      station: 'Customer Self-Service Portal'
    },
    {
      id: 'vis-2',
      name: 'Rohit Basfore',
      phone: '+91 98000 11223',
      userType: 'staff',
      roleOrPost: 'General Manager & Admin',
      timestamp: 'Today, 06:30 PM',
      timeAgo: '30 mins ago',
      action: 'Master Admin station opened - Operations audit',
      status: 'active',
      station: 'Central Manager Console'
    },
    {
      id: 'vis-3',
      name: 'Arjun Singhania',
      phone: '+91 98111 22334',
      userType: 'customer',
      roleOrPost: 'VIP Patron',
      timestamp: 'Today, 06:15 PM',
      timeAgo: '45 mins ago',
      action: 'Viewed Signature Butter Chicken & Booked Table 101',
      status: 'completed',
      station: 'Online Dining Portal'
    },
    {
      id: 'vis-4',
      name: 'Priya Sharma',
      phone: '+91 98444 55667',
      userType: 'staff',
      roleOrPost: 'Head Hostess Stand',
      timestamp: 'Today, 06:00 PM',
      timeAgo: '1 hour ago',
      action: 'Front Desk Host Stand online - Waitlist intake',
      status: 'active',
      station: 'Hostess Reception Stand'
    },
    {
      id: 'vis-5',
      name: 'Neha Roy',
      phone: '+91 98222 33445',
      userType: 'customer',
      roleOrPost: 'Frequent Diner',
      timestamp: 'Today, 05:40 PM',
      timeAgo: '1.5 hours ago',
      action: 'Read guest reviews and submitted a 5-star rating',
      status: 'completed',
      station: 'Mobile Web Explorer'
    },
    {
      id: 'vis-6',
      name: 'Vikram Mehta',
      phone: '+91 98555 66778',
      userType: 'staff',
      roleOrPost: 'Floor Operations Manager',
      timestamp: 'Today, 05:15 PM',
      timeAgo: '2 hours ago',
      action: 'Inspected 2D Floor Plan and allocated turn times',
      status: 'completed',
      station: 'Floor Tablet Station'
    },
    {
      id: 'vis-7',
      name: 'Kunal Kapoor',
      phone: '+91 98333 44556',
      userType: 'customer',
      roleOrPost: 'First-time Guest',
      timestamp: 'Today, 04:50 PM',
      timeAgo: '2.5 hours ago',
      action: 'Checked Desserts & Craft Mocktail Beverage list',
      status: 'completed',
      station: 'Customer Kiosk'
    }
  ];

  private visitorsSubject = new BehaviorSubject<VisitorLogEntry[]>(this.loadVisitors());
  public visitors$: Observable<VisitorLogEntry[]> = this.visitorsSubject.asObservable();

  private loadVisitors(): VisitorLogEntry[] {
    try {
      const data = localStorage.getItem(VISITOR_STORAGE_KEY);
      if (data) {
        return JSON.parse(data);
      }
    } catch {
      // fallback
    }
    return this.initialVisitors;
  }

  private saveVisitors(list: VisitorLogEntry[]): void {
    try {
      localStorage.setItem(VISITOR_STORAGE_KEY, JSON.stringify(list));
    } catch {
      // fallback
    }
    this.visitorsSubject.next(list);
  }

  getVisitors(): VisitorLogEntry[] {
    return this.visitorsSubject.value;
  }

  logVisit(entry: {
    name: string;
    phone?: string;
    userType: 'customer' | 'staff';
    roleOrPost: string;
    action: string;
    station?: string;
  }): void {
    const currentList = this.visitorsSubject.value;
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const newLog: VisitorLogEntry = {
      id: `vis-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      name: entry.name,
      phone: entry.phone || 'N/A',
      userType: entry.userType,
      roleOrPost: entry.roleOrPost,
      timestamp: `Today, ${timeStr}`,
      timeAgo: 'Just now',
      action: entry.action,
      status: 'active',
      station: entry.station || (entry.userType === 'customer' ? 'Customer Portal' : 'Staff Station')
    };

    const updated = [newLog, ...currentList.slice(0, 49)]; // Keep up to 50 logs
    this.saveVisitors(updated);
  }

  exportVisitorsCSV(): void {
    const list = this.visitorsSubject.value;
    const headers = ['Log ID', 'Visitor Name', 'Phone', 'Visitor Type', 'Designation / Role', 'Timestamp', 'Station', 'Action Activity'];
    const rows = list.map(v => [
      v.id,
      `"${v.name.replace(/"/g, '""')}"`,
      `"${v.phone || ''}"`,
      v.userType,
      `"${v.roleOrPost}"`,
      `"${v.timestamp}"`,
      `"${v.station}"`,
      `"${v.action.replace(/"/g, '""')}"`
    ]);

    const csvContent = [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `foodcourt_visitor_logs_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    this.restaurantService.showToast('Visitor Footfall Logs exported as CSV!', 'success');
  }

  resetVisitors(): void {
    this.saveVisitors(this.initialVisitors);
    this.restaurantService.showToast('Visitor logs reset to default sample data.', 'info');
  }
}
