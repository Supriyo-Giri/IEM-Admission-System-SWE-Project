import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { ToastService } from '../services/toast.service';

export const adminGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const toast = inject(ToastService);

  if (!authService.isAuthenticated()) {
    toast.warning('Please log in with admin credentials.');
    return router.createUrlTree(['/login'], { queryParams: { returnUrl: '/admin/dashboard' } });
  }

  if (authService.isAdmin()) {
    return true;
  }

  toast.error('Access denied. Administrator privileges required.');
  return router.createUrlTree(['/applicant/dashboard']);
};

