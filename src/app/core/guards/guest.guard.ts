import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const guestGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

  if (isLoggedIn) {
    // Jika SUDAH login tapi maksa buka halaman login, lempar balik ke dashboard!
    router.navigate(['/employees']);
    return false; // Blokir akses ke halaman login
  }

  return true; // Jika belum login, silakan akses halaman login
};
