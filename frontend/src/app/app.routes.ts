import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { TablesComponent } from './pages/tables/tables.component';
import { ReservationsComponent } from './pages/reservations/reservations.component';
import { WaitlistComponent } from './pages/waitlist/waitlist.component';
import { GuestsComponent } from './pages/guests/guests.component';
import { MenuComponent } from './pages/menu/menu.component';
import { authGuard, loginGuard, staffOnlyGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [loginGuard]
  },
  {
    path: '',
    component: DashboardComponent,
    canActivate: [authGuard, staffOnlyGuard]
  },
  {
    path: 'menu',
    component: MenuComponent,
    canActivate: [authGuard]
  },
  {
    path: 'tables',
    component: TablesComponent,
    canActivate: [authGuard]
  },
  {
    path: 'reservations',
    component: ReservationsComponent,
    canActivate: [authGuard]
  },
  {
    path: 'waitlist',
    component: WaitlistComponent,
    canActivate: [authGuard]
  },
  {
    path: 'guests',
    component: GuestsComponent,
    canActivate: [authGuard, staffOnlyGuard]
  },
  {
    path: '**',
    redirectTo: ''
  }
];
