import { Component, forwardRef, Input, Injector, OnInit } from '@angular/core';
import {
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
  NgControl,
} from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-floating-select',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './floating-select.component.html',
  styleUrls: ['./floating-select.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FloatingSelectComponent),
      multi: true,
    },
  ],
})
export class FloatingSelectComponent implements ControlValueAccessor, OnInit {
  // ================= INPUT =================
  @Input() id = '';
  @Input() label = '';
  @Input() items: string[] = [];

  // ================= VALUE =================
  value = '';
  disabled = false;

  // Properti untuk menampung referensi form control dari Angular secara internal
  ngControl!: NgControl;

  private onChange: any = () => {};
  private onTouched: any = () => {};

  // Inject Injector untuk mengambil NgControl tanpa circular dependency
  constructor(private injector: Injector) {}

  ngOnInit() {
    this.ngControl = this.injector.get(NgControl);
  }

  // ================= CVA =================
  writeValue(value: any): void {
    this.value = value ?? '';
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  // ================= EVENTS =================
  change(event: Event): void {
    const value = (event.target as HTMLSelectElement).value;

    this.value = value;
    this.onChange(value);
  }

  blur(): void {
    this.onTouched();
  }

  // ================= ERROR =================
  // Sekarang ngecek ke ngControl internal bawaan Angular
  get showError(): boolean {
    return !!(
      this.ngControl &&
      this.ngControl.invalid &&
      (this.ngControl.touched || this.ngControl.dirty)
    );
  }
}
