import { inject } from '@angular/core';
import { CanActivateFn, Router, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from '../auth.service';

export const authGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // 1. Cek apakah user sudah login
  if (!authService.isLoggedIn()) {
    return router.parseUrl('/login');
  }

  // 2. Cek kesesuaian role
  const expectedRoles: string[] = route.data?.['roles'];
  const currentUser = authService.getCurrentUser();

  if (expectedRoles && currentUser && !expectedRoles.includes(currentUser.role)) {
    if (currentUser.role === 'admin') {
      return router.parseUrl('/admin');
    } else if (currentUser.role === 'leader') {
      return router.parseUrl('/leader');
    } else {
      return router.parseUrl('/home');
    }
  }

  return true;
};