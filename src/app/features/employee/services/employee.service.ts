import { Injectable, signal } from '@angular/core';
import { Employee } from '../models/employee.model';
import { EMPLOYEE_DUMMY } from '../data/employee-dummy.data';

@Injectable({
  providedIn: 'root',
})
export class EmployeeService {
  private _employees = signal<Employee[]>([...EMPLOYEE_DUMMY]);

  employees = this._employees.asReadonly();

  add(employee: Employee): void {
    this._employees.update((list) => [employee, ...list]);
  }

  update(employee: Employee): void {
    this._employees.update((list) =>
      list.map((item) => (item.id === employee.id ? employee : item)),
    );
  }

  delete(id: number): void {
    this._employees.update((list) => list.filter((item) => item.id !== id));
  }

  getById(id: number): Employee | undefined {
    return this._employees().find((item) => item.id === id);
  }
}
