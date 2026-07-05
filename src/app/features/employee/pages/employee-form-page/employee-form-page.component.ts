import { Component, inject } from '@angular/core';
import {
  ReactiveFormsModule,
  FormBuilder,
  Validators,
  FormGroup,
  FormControl,
  AbstractControl,
} from '@angular/forms';
import { CommonModule, Location } from '@angular/common';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { EmployeeService } from '../../services/employee.service';
import { FloatingSelectComponent } from '../../../../shared/components/floating-select/floating-select.component';
import { FloatingSearchSelectComponent } from '../../../../shared/components/floating-search-select/floating-search-select.component';
import { FloatingInputComponent } from '../../../../shared/components/floating-input/floating-input.component';
import Swal from 'sweetalert2'; // 1. Pa

type EmployeeForm = {
  username: FormControl<string>;
  firstName: FormControl<string>;
  lastName: FormControl<string>;
  email: FormControl<string>;
  birthDate: FormControl<string>;
  basicSalary: FormControl<number>;
  status: FormControl<string>;
  group: FormControl<string>;
  description: FormControl<string>;
};

@Component({
  selector: 'app-employee-form-page',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FloatingSelectComponent,
    FloatingSearchSelectComponent,
    FloatingInputComponent,
    CommonModule,
    RouterLink,
  ],
  templateUrl: './employee-form-page.component.html',
})
export class EmployeeFormPageComponent {
  private location = inject(Location); // Tambahkan inject Location di sini

  today = new Date().toISOString().split('T')[0];

  status = ['Active', 'Inactive'];

  groups = [
    'HR',
    'Finance',
    'Accounting',
    'IT',
    'Procurement',
    'Engineering',
    'Operations',
    'Marketing',
    'Sales',
    'General Affairs',
  ];

  selectedStatus = '';
  selectedGroup = '';

  isEdit = false;
  employeeId!: number;

  private fb = inject(FormBuilder);
  private employeeService = inject(EmployeeService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  maxDateToday(control: AbstractControl) {
    if (!control.value) return null;

    const inputDate = new Date(control.value).setHours(0, 0, 0, 0);
    const todayDate = new Date().setHours(0, 0, 0, 0);

    return inputDate > todayDate ? { maxDate: true } : null;
  }

  form: FormGroup<EmployeeForm> = this.fb.nonNullable.group({
    username: ['', [Validators.required, Validators.pattern(/^\S+$/)]],
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    birthDate: ['', [Validators.required, this.maxDateToday]],
    basicSalary: [0, [Validators.required, Validators.min(1)]],
    status: ['', Validators.required],
    group: ['', Validators.required],
    description: ['', Validators.required],
  });

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
      this.isEdit = true;
      this.employeeId = Number(id);

      const employee = this.employeeService.getById(this.employeeId);

      if (employee) {
        this.form.patchValue({
          username: employee.username,
          firstName: employee.firstName,
          lastName: employee.lastName,
          email: employee.email,
          birthDate: employee.birthDate,
          basicSalary: employee.basicSalary,
          status: employee.status,
          group: employee.group,
          description: employee.description,
        });

        this.selectedStatus = employee.status;
        this.selectedGroup = employee.group;
      }
    }

    const salary = this.form.controls.basicSalary.value;

    if (salary) {
      this.form.controls.basicSalary.setValue(salary);
    }
  }

  // submit() {
  //   if (this.form.invalid) return;

  //   if (this.isEdit) {
  //     this.employeeService.update({
  //       id: this.employeeId,
  //       ...this.form.getRawValue(),
  //     });
  //   } else {
  //     this.employeeService.add({
  //       id: Date.now(),
  //       ...this.form.getRawValue(),
  //     });
  //   }

  //   this.router.navigate(['/employees']);
  // }

  submit() {
    if (this.form.invalid) return;

    const titleText = this.isEdit
      ? 'Perbarui data karyawan?'
      : 'Tambah karyawan baru?';
    const confirmText = this.isEdit ? 'Ya, Perbarui!' : 'Ya, Tambahkan!';

    // 1. Popup Konfirmasi (Tetap di tengah agar user fokus memilih)
    Swal.fire({
      title: titleText,
      text: 'Pastikan data yang Anda masukkan sudah benar.',
      icon: 'question',
      showCancelButton: true,
      // confirmButtonColor: '#0d6efd',
      // cancelButtonColor: '#6c757d',
      confirmButtonText: confirmText,
      cancelButtonText: 'Batal',
      reverseButtons: true,
      // 1. Matikan styling bawaan SweetAlert2 agar class kita berfungsi penuh
      buttonsStyling: false,
      // 2. Tambahkan class CSS Anda di sini
      customClass: {
        confirmButton: 'btn btn-utama-biru', // Contoh jika pakai Bootstrap (tambahkan margin kanan)
        cancelButton: 'btn btn-secondary',
        actions: 'gap-2',
      },
    }).then((result) => {
      if (result.isConfirmed) {
        // Eksekusi fungsi simpan
        if (this.isEdit) {
          this.employeeService.update({
            id: this.employeeId,
            ...this.form.getRawValue(),
          });
        } else {
          this.employeeService.add({
            id: Date.now(),
            ...this.form.getRawValue(),
          });
        }

        // 2. Alert Sukses di Pojok Kanan Atas (Toast)
        Swal.fire({
          toast: true, // Mengaktifkan mode Toast
          position: 'top-end', // Posisi di atas sebelah kanan
          icon: 'success',
          title: this.isEdit
            ? 'Data berhasil diperbarui'
            : 'Karyawan berhasil ditambahkan',
          showConfirmButton: false, // Tanpa tombol "OK"
          timer: 3000, // Muncul singkat selama 3 detik
          timerProgressBar: true, // Garis loading waktu berjalan
        });

        // 3. Langsung pindah halaman (karena toast tidak memblokir layar)
        this.router.navigate(['/employees']);
      }
    });
  }

  cancel() {
    this.router.navigate(['/employees']);
  }

  onSalaryFocus(input: HTMLInputElement) {
    const value = this.form.controls.basicSalary.value;
    input.value = value ? value.toString() : '';
  }

  onSalaryBlur(input: HTMLInputElement) {
    const value = Number(input.value.replace(/\./g, ''));

    if (isNaN(value)) {
      this.form.controls.basicSalary.setValue(0);
      input.value = '';
      return;
    }

    this.form.controls.basicSalary.setValue(value);
    input.value = new Intl.NumberFormat('id-ID').format(value);
  }

  kembali() {
    this.location.back();
  }
}
