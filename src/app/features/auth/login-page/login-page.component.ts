import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']
})
export class LoginPageComponent {
  private fb = inject(FormBuilder);
  private router = inject(Router);

  // Membuat struktur form kontrol dengan validasi wajib diisi
  loginForm: FormGroup = this.fb.group({
    username: ['', [Validators.required]],
    password: ['', [Validators.required]]
  });

  isSubmitting = false;
  errorMessage = '';

  onSubmit(): void {
    // Jika form belum diisi, nyalakan status "touched" agar error merah keluar
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';

    const { username, password } = this.loginForm.value;

    // Simulasi pengecekan akun dengan delay 1 detik (agar spinner berputar dulu)
    setTimeout(() => {
      if (username === 'admin' && password === '123456') {
        // Simpan tanda ke localStorage bahwa user berhasil masuk
        localStorage.setItem('isLoggedIn', 'true');
        
        // Pindahkan halaman ke dashboard karyawan
        this.router.navigate(['/employees']);
      } else {
        this.errorMessage = 'Username atau password salah!';
        this.isSubmitting = false;
      }
    }, 1000);
  }
}