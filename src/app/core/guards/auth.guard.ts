import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);

  // Cek apakah status login bernilai true di memori browser (localStorage)
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

  if (isLoggedIn) {
    return true; // Izinkan masuk ke dashboard
  } else {
    // Belum login? Tendang paksa ke halaman login
    router.navigate(['/login']); 
    return false;
  }
};