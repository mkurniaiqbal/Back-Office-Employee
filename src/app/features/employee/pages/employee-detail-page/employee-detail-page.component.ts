import { Component, computed, inject, input } from '@angular/core';
import { CurrencyPipe, DatePipe, Location } from '@angular/common'; // Tambahkan Location di sini
import { Router } from '@angular/router';
import { EmployeeService } from '../../services/employee.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-employee-detail',
  standalone: true,
  imports: [CurrencyPipe, DatePipe],
  templateUrl: './employee-detail-page.component.html',
  styleUrls: ['./employee-detail-page.component.css'],
})
export class EmployeeDetailPageComponent {
  private employeeService = inject(EmployeeService);
  private location = inject(Location); // Tambahkan inject Location di sini

  id = input.required<number>();

  constructor(private router: Router) {}

  employee = computed(() => {
    const list = this.employeeService.employees();

    return (
      list.find((e) => e.id === +this.id()) ?? {
        id: 0,
        username: '',
        firstName: 'Unknown',
        lastName: '',
        email: '',
        birthDate: '',
        basicSalary: 0,
        status: '',
        group: '',
        description: '',
      }
    );
  });

  editEmployee(id: number) {
    this.router.navigate([`/employees/edit/${id}`]);
  }

  sendMessage() {
    Swal.fire({
      toast: true,
      position: 'top-end',
      icon: 'success',
      title: 'Pesan Berhasil Dikirim!',
      text: 'Terima kasih, kami akan segera menghubungi Anda.',
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
    });
  }

  // Ubah method kembali menjadi seperti ini
  kembali() {
    this.location.back();
  }
}
