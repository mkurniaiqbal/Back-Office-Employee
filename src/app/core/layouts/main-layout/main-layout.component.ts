import { Component } from '@angular/core';
import { RouterOutlet, Router } from '@angular/router';
import { SidebarComponent } from '../sidebar/sidebar.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [RouterOutlet, SidebarComponent],
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.css',
})
export class MainLayoutComponent {
  constructor(private router: Router) {}
  title = 'Employee Management';

  logout() {
    localStorage.removeItem('isLoggedIn');
    this.router.navigate(['/login']);
  }
  showUnderDevelopmentAlert() {
    Swal.fire({
      title: 'Fitur Belum Tersedia',
      text: 'Mohon maaf, fitur notifikasi ini sedang dalam tahap pengembangan.',
      icon: 'info', // Menggunakan ikon 'info' agar terlihat informatif
      confirmButtonText: 'Mengerti',
      buttonsStyling: false,
      customClass: {
        confirmButton: 'btn btn-utama-biru', // Menggunakan tombol gradien biru kustom Anda
      },
    });
  }
}
