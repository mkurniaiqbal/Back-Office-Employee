import { Routes } from '@angular/router';
import { MainLayoutComponent } from './core/layouts/main-layout/main-layout.component';
import { LoginPageComponent } from './features/auth/login-page/login-page.component'; // <-- Jalur Impor Baru Anda
import { EmployeePageComponent } from './features/employee/pages/employee-page/employee-page.component';
import { EmployeeListPageComponent } from './features/employee/pages/employee-list-page/employee-list-page.component';
import { EmployeeFormPageComponent } from './features/employee/pages/employee-form-page/employee-form-page.component';
import { EmployeeDetailPageComponent } from './features/employee/pages/employee-detail-page/employee-detail-page.component';
import { authGuard } from './core/guards/auth.guard';
import { guestGuard } from './core/guards/guest.guard';

export const routes: Routes = [
  // 1. Halaman Login (Berdiri sendiri, di luar MainLayout)
  { 
    path: 'login', 
    component: LoginPageComponent,
    canActivate: [guestGuard], // <-- Pasang di sini!
    data: { title: 'Sign In' } 
  },

  // 2. Halaman-halaman yang membutuhkan Sidebar/Navbar utama
  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [authGuard], // <-- 2. PASANG DI SINI UNTUK MENGUNCI SEMUA ROUTE ANAKNYA
    children: [
      { path: '', redirectTo: 'employees', pathMatch: 'full' },
      
      {
        path: 'employees',
        component: EmployeePageComponent,
        children: [
          { path: '', component: EmployeeListPageComponent, data: { title: 'Employee List' } },
          { path: 'add', component: EmployeeFormPageComponent, data: { title: 'Add New Employee' } },
          { path: ':id', component: EmployeeDetailPageComponent, data: { title: 'Employee Details' } },
          { path: 'edit/:id', component: EmployeeFormPageComponent, data: { title: 'Edit Employee' } }
        ]
      }
    ]
  }
];