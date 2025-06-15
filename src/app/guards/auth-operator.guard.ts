import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { inject } from '@angular/core';

export const authOperatorGuard: CanActivateFn = (route, state) => {
  const authSrv = inject(AuthService);
  const router = inject(Router);

  const isAuthenticated = authSrv.isLoggedIn();

  if (isAuthenticated && authSrv.currentUser$) {
    authSrv.currentUser$.subscribe((user) => {
      console.log(user);
      if (user?.isOperator) {
        return true;
      }
      return false;
    });
    return false;
  } else {
    router.navigate(['/']);
    return false;
  }
};
