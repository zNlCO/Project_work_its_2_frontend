import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { inject } from '@angular/core';
import { map, take, tap } from 'rxjs';

export const authOperatorGuard: CanActivateFn = (route, state) => {
  const authSrv = inject(AuthService);
  const router = inject(Router);

  return authSrv.currentUser$.pipe(
    take(1), // Prendi solo il primo valore
    tap((user) => {
      if (!user?.isOperator) {
        router.navigate(['/']);
      }
    }),
    map((user) => !!user?.isOperator)
  );
};
