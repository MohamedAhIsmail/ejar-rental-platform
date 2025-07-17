import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
export const authGuard: CanActivateFn = (route, state) => {
  let _Router = inject(Router);
  if (
    localStorage.getItem('authToken') != null ||
    sessionStorage.getItem('authToken') != null
  ) {
    return true;
  } else {
    _Router.navigate(['/login']);
    return false;
  }
};
