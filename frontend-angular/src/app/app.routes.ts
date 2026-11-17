import { Routes } from '@angular/router';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { TablesComponent } from './pages/tables/tables.component';
import { ReservationsComponent } from './pages/reservations/reservations.component';
import { WaitlistComponent } from './pages/waitlist/waitlist.component';
import { AnalyticsComponent } from './pages/analytics/analytics.component';

export const routes: Routes = [
  { path: '', component: DashboardComponent },
  { path: 'tables', component: TablesComponent },
  { path: 'reservations', component: ReservationsComponent },
  { path: 'waitlist', component: WaitlistComponent },
  { path: 'analytics', component: AnalyticsComponent },
  { path: '**', redirectTo: '' }
];
