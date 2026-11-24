import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

/**
 * Route Guard that blocks unauthorized visits to restaurant floor pages.
 * Redirects unauthenticated visitors to /login.
 */
export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isLoggedIn()) {
    return true;
  }

  return router.createUrlTree(['/login'], {
    queryParams: { returnUrl: state.url !== '/' ? state.url : undefined }
  });
};

/**
 * Guard for /login page: if already logged in, redirect to appropriate home.
 */
export const loginGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isLoggedIn()) {
    if (authService.isCustomer()) {
      return router.createUrlTree(['/menu']);
    }
    return router.createUrlTree(['/']);
  }

  return true;
};

/**
 * Guard for staff-only operational screens (Dashboard, Guest CRM, Array Studio).
 * Redirects customers to /menu.
 */
export const staffOnlyGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isLoggedIn() && authService.isCustomer()) {
    return router.createUrlTree(['/menu']);
  }
  return true;
};
