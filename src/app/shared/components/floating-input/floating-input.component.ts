import { Component, Input, forwardRef, Injector, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
  FormsModule,
  NgControl,
} from '@angular/forms';

@Component({
  selector: 'app-floating-input',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './floating-input.component.html',
  styleUrls: ['./floating-input.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FloatingInputComponent),
      multi: true,
    },
  ],
})
export class FloatingInputComponent implements ControlValueAccessor, OnInit {
  // ================= INPUTS =================
  @Input() id = '';
  @Input() label = '';
  @Input() placeholder = '';
  @Input() readonly = false;
  @Input() disabled = false;
  @Input() max = '';

  @Input() type:
    | 'text'
    | 'email'
    | 'password'
    | 'date'
    | 'datetime-local'
    | 'number'
    | 'currency' = 'text';

  // ================= VALUE =================
  value: any = '';
  displayValue = '';

  // Properti untuk menampung referensi form control dari Angular secara internal
  ngControl!: NgControl;

  onChange: any = () => {};
  onTouched: any = () => {};

  // Inject Injector untuk menghindari circular dependency
  constructor(private injector: Injector) {}

  ngOnInit() {
    // Ambil NgControl secara dinamis saat komponen di-init
    this.ngControl = this.injector.get(NgControl);
  }

  // ================= CVA =================
  writeValue(value: any): void {
    this.value = value;

    if (this.type === 'currency') {
      this.displayValue = value
        ? new Intl.NumberFormat('id-ID').format(value)
        : '';
    } else {
      this.displayValue = value ?? '';
    }
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
  focus() {
    if (this.type !== 'currency') return;
    this.displayValue = this.value ? this.value.toString() : '';
  }

  blur() {
    if (this.type === 'currency') {
      const numeric = Number(
        this.displayValue.replace(/\./g, '').replace(/,/g, ''),
      );

      this.value = isNaN(numeric) ? 0 : numeric;

      // 🔥 RULE: 0 & negatif dihapus
      if (this.value <= 0) {
        this.value = 0;
        this.displayValue = '';
        this.onChange(this.value);
        this.onTouched();
        return;
      }

      this.displayValue = new Intl.NumberFormat('id-ID').format(this.value);

      this.onChange(this.value);
    } else {
      this.value = this.displayValue;
      this.onChange(this.displayValue);
    }

    this.onTouched();
  }

  input(event: Event) {
    const value = (event.target as HTMLInputElement).value;

    this.displayValue = value;

    if (this.type !== 'currency') {
      this.value = value;
      this.onChange(value);
    }
  }

  // ================= HELPERS =================
  get inputType() {
    return this.type === 'currency' ? 'text' : this.type;
  }

  // Sekarang lari ke ngControl internal bawaan Angular
  get showError() {
    return this.ngControl?.touched && this.ngControl?.invalid;
  }
}
