import {
  Component,
  computed,
  input,
  signal,
  TemplateRef,
  output,
  effect,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-smart-table',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './smart-table.component.html',
})
export class SmartTableComponent<T = any> {
  protected readonly Math = Math;

  // --- INPUT UTAMA DARI PARENT ---
  data = input<T[]>([]);
  headers = input<string[]>([]);
  searchFields = input<Array<keyof T>>([]);
  rowTemplate = input<TemplateRef<any>>();

  // Tambahkan input untuk menentukan kolom apa saja yang bisa di-sort (Type-Safe!)
  sortableFields = input<Array<keyof T>>([]);

  // --- INPUT INITIAL STATE DARI URL ---
  initSearch = input<string>('');
  initPage = input<number>(1);
  initSize = input<number>(5);
  initSort = input<string>('');
  initDirection = input<string>('asc');

  // --- OUTPUT UNTUK BERBAGI STATE KE URL PARENT ---
  stateChange = output<{
    search: string;
    page: number;
    size: number;
    sort: string;
    direction: 'asc' | 'desc';
  }>();

  // --- INTERNAL STATE SIGNAL ---
  search = signal('');
  currentPage = signal<number>(1);
  itemsPerPage = signal<number>(5);
  sortKey = signal<keyof T | ''>('');
  sortDirection = signal<'asc' | 'desc'>('asc');

  constructor() {
    // Merefleksikan perubahan input URL ke state internal tabel
    effect(
      () => {
        this.search.set(this.initSearch());
      },
      { allowSignalWrites: true },
    );
    effect(
      () => {
        this.currentPage.set(this.initPage());
      },
      { allowSignalWrites: true },
    );
    effect(
      () => {
        this.itemsPerPage.set(this.initSize());
      },
      { allowSignalWrites: true },
    );

    // Sinkronisasi sortir awal dari URL
    effect(
      () => {
        this.sortKey.set((this.initSort() as keyof T) || '');
      },
      { allowSignalWrites: true },
    );
    effect(
      () => {
        this.sortDirection.set(
          this.initDirection() === 'desc' ? 'desc' : 'asc',
        );
      },
      { allowSignalWrites: true },
    );
  }

  // Mengirim info perubahan state ke Parent component
  private emitStateChange() {
    this.stateChange.emit({
      search: this.search(),
      page: this.currentPage(),
      size: this.itemsPerPage(),
      sort: String(this.sortKey()),
      direction: this.sortDirection(),
    });
  }

  // --- LOGIKA FILTER & SORT DATA ---
  filteredData = computed(() => {
    const keyword = this.search().trim().toLowerCase();
    let rawData = [...this.data()]; // Salin array agar aman saat disortir
    const fields = this.searchFields();

    // 1. Logika Pencarian (Sudah di-tweak agar mendukung firstName + lastName)
    if (keyword && fields.length > 0) {
      rawData = rawData.filter((item: any) =>
        fields.some((field) => {
          const val = item[field];

          // JIKA sedang memeriksa field firstName, gabungkan dengan lastName di memori pencarian
          if (field === 'firstName' && item['lastName']) {
            const fullName = `${val} ${item['lastName']}`.toLowerCase();
            return fullName.includes(keyword);
          }

          return val != null && String(val).toLowerCase().includes(keyword);
        }),
      );
    }

    // 2. Logika Pengurutan (Sorting)
    const key = this.sortKey();
    const direction = this.sortDirection();

    if (key) {
      rawData.sort((a, b) => {
        let valA = a[key];
        let valB = b[key];

        // Normalisasi huruf jika tipenya string agar case-insensitive
        if (typeof valA === 'string') valA = valA.toLowerCase() as any;
        if (typeof valB === 'string') valB = valB.toLowerCase() as any;

        if (valA == null) return direction === 'asc' ? 1 : -1;
        if (valB == null) return direction === 'asc' ? -1 : 1;

        if (valA < valB) return direction === 'asc' ? -1 : 1;
        if (valA > valB) return direction === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return rawData;
  });

  // --- LOGIKA POTONG DATA (PAGINATION) ---
  paginatedData = computed(() => {
    const start = (this.currentPage() - 1) * this.itemsPerPage();
    return this.filteredData().slice(start, start + this.itemsPerPage());
  });

  totalPages = computed(() => {
    return Math.ceil(this.filteredData().length / this.itemsPerPage());
  });

  pageNumbers = computed(() => {
    const total = this.totalPages();
    const current = this.currentPage();
    const maxButtons = 5;

    if (total <= maxButtons) {
      return Array.from({ length: total }, (_, i) => i + 1);
    }

    let startPage = current - 2;
    let endPage = current + 2;

    if (startPage <= 0) {
      startPage = 1;
      endPage = maxButtons;
    }

    if (endPage > total) {
      endPage = total;
      startPage = total - maxButtons + 1;
    }

    return Array.from(
      { length: endPage - startPage + 1 },
      (_, i) => startPage + i,
    );
  });

  // --- EVENT HANDLERS ---
  onSort(field: keyof T): void {
    if (this.sortKey() === field) {
      // Siklus: asc -> desc -> reset sortir
      if (this.sortDirection() === 'asc') {
        this.sortDirection.set('desc');
      } else {
        this.sortKey.set('');
        this.sortDirection.set('asc');
      }
    } else {
      this.sortKey.set(field);
      this.sortDirection.set('asc');
    }
    this.currentPage.set(1); // Reset halaman jika sortir berubah
    this.emitStateChange();
  }

  onSearch(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.search.set(value);
    this.currentPage.set(1);
    this.emitStateChange();
  }

  onItemsPerPageChange(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    this.itemsPerPage.set(Number(selectElement.value));
    this.currentPage.set(1);
    this.emitStateChange();
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages()) {
      this.currentPage.set(page);
      this.emitStateChange();
    }
  }
}
