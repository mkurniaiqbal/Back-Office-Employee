import { Component, computed, signal, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { EmployeeService } from '../../services/employee.service';
import { SmartTableComponent } from '../../../../shared/components/smart-table/smart-table.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-employee-list-page',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, SmartTableComponent],
  templateUrl: './employee-list-page.component.html',
  styleUrls: ['./employee-list-page.component.css'],
})
export class EmployeeListPageComponent implements OnInit {
  public employeeService = inject(EmployeeService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  // State parameter dari URL ditambah penampung sortir
  searchParam = signal('');
  pageParam = signal(1);
  sizeParam = signal(5);
  sortParam = signal('');
  directionParam = signal('asc');

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      if (params['search']) this.searchParam.set(params['search']);
      if (params['page']) this.pageParam.set(Number(params['page']));
      if (params['size']) this.sizeParam.set(Number(params['size']));
      if (params['sort']) this.sortParam.set(params['sort']);
      if (params['direction']) this.directionParam.set(params['direction']);
    });
  }

  // Menangkap state sorting baru dan menyimpannya ke URL
  updateQueryParams(event: {
    search: string;
    page: number;
    size: number;
    sort: string;
    direction: 'asc' | 'desc';
  }) {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        search: event.search || null,
        page: event.page === 1 ? null : event.page,
        size: event.size === 5 ? null : event.size,
        sort: event.sort || null, // Bersihkan dari URL jika sorting di-reset kosong
        direction: event.sort ? event.direction : null, // Arah ikut hilang jika sort kosong
      },
      queryParamsHandling: 'merge',
    });
  }

  addEmployee() {
    this.router.navigate(['/employees/add']);
  }

  previewData(id: number) {
    this.router.navigate([`/employees/${id}`]);
  }

  editEmployee(id: number) {
    this.router.navigate([`/employees/edit/${id}`]);
  }

  deleteRow(id: number) {
    Swal.fire({
      title: 'Apakah Anda yakin?',
      text: 'Data karyawan yang dihapus tidak dapat dikembalikan!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Ya, Hapus!',
      cancelButtonText: 'Batal',
      reverseButtons: true,
      buttonsStyling: false,
      customClass: {
        confirmButton: 'btn btn-danger-gradien',
        cancelButton: 'btn btn-secondary',
        actions: 'gap-2',
      },
    }).then((result) => {
      if (result.isConfirmed) {
        this.employeeService.delete(id);
        Swal.fire({
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
          icon: 'success',
          title: 'Data karyawan telah dihapus',
        });
      }
    });
  }
}
