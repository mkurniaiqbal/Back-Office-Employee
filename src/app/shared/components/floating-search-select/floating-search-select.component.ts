import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  OnChanges,
  SimpleChanges,
  ViewChild,
  ElementRef,
  HostListener,
  forwardRef,
  Injector,
} from '@angular/core';
import {
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
  NgControl,
} from '@angular/forms';

@Component({
  selector: 'app-floating-search-select',
  standalone: true,
  imports: [],
  templateUrl: './floating-search-select.component.html',
  styleUrls: ['./floating-search-select.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FloatingSearchSelectComponent),
      multi: true,
    },
  ],
})
export class FloatingSearchSelectComponent
  implements OnInit, OnChanges, ControlValueAccessor
{
  @Input() id!: string;
  @Input() label!: string;
  @Input() items: string[] = [];
  @Input() value: any = '';
  @Input() disabled: boolean = false;

  @Output() valueChange = new EventEmitter<any>();

  @ViewChild('searchInput') searchInput!: ElementRef;

  isDropdownOpen = false;
  searchText = '';
  filteredItems: string[] = [];

  // Wadah penampung form control internal Angular
  ngControl!: NgControl;

  // Fungsi internal penampung callback dari Angular Reactive Forms
  onChange: any = () => {};
  onTouched: any = () => {};

  // Inject Injector di sini
  constructor(
    private elRef: ElementRef,
    private injector: Injector,
  ) {}

  @HostListener('document:click', ['$event'])
  clickOutside(event: Event) {
    if (!this.elRef.nativeElement.contains(event.target)) {
      if (this.isDropdownOpen) {
        this.isDropdownOpen = false;
        this.onTouched(); // Tandai form sudah pernah disentuh/diklik saat dropdown ditutup
      }
    }
  }

  ngOnInit() {
    this.filteredItems = [...this.items];

    // Ambil kontrol form-nya secara otomatis saat init
    this.ngControl = this.injector.get(NgControl);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['items']) {
      this.filteredItems = [...this.items];
    }
  }

  // --- IMPLEMENTASI CONTROL VALUE ACCESSOR ---
  writeValue(value: any): void {
    this.value = value || '';
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
  // ------------------------------------------

  toggleDropdown() {
    if (this.disabled) return;

    this.isDropdownOpen = !this.isDropdownOpen;
    if (this.isDropdownOpen) {
      this.searchText = '';
      this.filteredItems = [...this.items];
      setTimeout(() => this.searchInput?.nativeElement.focus(), 50);
    } else {
      this.onTouched();
    }
  }

  onSearch(event: Event) {
    this.searchText = (event.target as HTMLInputElement).value;
    const targetSearch = this.searchText.toLowerCase();

    this.filteredItems = this.items.filter((item) =>
      item.toLowerCase().includes(targetSearch),
    );
  }

  selectItem(item: string) {
    this.value = item;
    this.isDropdownOpen = false;

    // Kirim nilai baru kembali ke Reactive Form utama
    this.onChange(item);
    this.onTouched();
    this.valueChange.emit(item);

    // Mengganti control manual ke ngControl bawaan Angular
    if (this.ngControl?.control) {
      this.ngControl.control.markAsDirty();
    }
  }

  onKeyDown(event: KeyboardEvent) {
    if (this.disabled) return;

    // Jika user menekan tombol Enter atau Spacebar (Spasi)
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault(); // Mencegah scrolling halaman jika menekan spasi
      this.toggleDropdown();
    }
  }

  onBlur() {
    // Hanya tandai touched jika dropdown sedang tidak terbuka
    if (!this.isDropdownOpen) {
      this.onTouched();

      // Mengganti control manual ke ngControl bawaan Angular
      if (this.ngControl?.control) {
        this.ngControl.control.markAsTouched();
      }
    }
  }

  // ================= HELPERS / GETTER ERROR =================
  // Membuat properti getter baru agar HTML bisa mendeteksi error secara otomatis
  get showError(): boolean {
    return !!(
      this.ngControl &&
      this.ngControl.invalid &&
      (this.ngControl.touched || this.ngControl.dirty)
    );
  }
}
