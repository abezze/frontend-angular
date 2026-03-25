import { inject } from '@angular/core';
import { AuthServices } from './auth-services';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {

  const authServices = inject(AuthServices);
  const router = inject(Router);

  return authServices.isAuthenticated();
};
