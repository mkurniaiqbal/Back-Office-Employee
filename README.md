# Employee Management System

Aplikasi Employee Management System yang dibangun menggunakan **Angular 19** atau lebih tepat nya **Angular 19.2.0**.

## Catatan Penting

- Semua data yang ditampilkan yaitu dummy (ketika ada perubahan data kemudian refres browser maka data akan kembali seperti awal)
- username dan password untuk login juga hardcode(dummy)
- username : admin
- password : 123456

---

## Demo Live Github Pages
- Jika ingin melihat hasil demo tanpa clone dan instal, klik link dibawah, note(saya menggunakan github page untuk deploy)
- https://mkurniaiqbal.github.io/Back-Office-Employee/employees

---

## Teknologi

- **Angular 19** - Framework utama
- **TypeScript** - Bahasa pemrograman
- **Bootstrap 5.3.8** - Styling Framework
- **Bootstrap Icon 1.13.1** - Icon
- **CSS3** - Styling
- **SweetAlert 2(swal2)** - Untuk Popup Konfirmasi dan juga toast status eksekusi.

---

# Persyaratan

Pastikan software berikut sudah terinstall.

| Software    | Minimal Version         |
| ----------- | ----------------------- |
| Node.js     | 18.20+ (disarankan LTS) |
| npm         | mengikuti versi Node.js |
| Angular CLI | 19.x                    |

Angular 19 memerlukan Node.js versi yang sesuai. Lihat dokumentasi resmi Angular untuk kompatibilitas versi Node.js. :contentReference[oaicite:0]{index=0}

---

# Install Angular CLI

Apabila belum memiliki Angular CLI.

```bash
npm install -g @angular/cli@19.2.15
```

Cek versi:

```bash
ng version
```

---

# Clone Repository

```bash
git clone https://github.com/mkurniaiqbal/Back-Office-Employee.git
```

Masuk ke folder project.

```bash
cd Back-Office-Employee
```

---

# Install Dependency

Install seluruh package yang dibutuhkan.

```bash
npm install
```

atau

```bash
npm i
```

---

# Menjalankan Project

Jalankan development server.

```bash
ng serve
```

atau

```bash
npm start
```

Setelah berhasil, buka browser:

```
http://localhost:4200
```

Development server akan otomatis melakukan reload ketika terdapat perubahan source code. :contentReference[oaicite:1]{index=1}

---

# Menjalankan pada Port Tertentu

Misalnya port 4300.

```bash
ng serve --port 4300
```

Atau menentukan host.

```bash
ng serve --host 0.0.0.0 --port 4300
```

---

# Build Production

```bash
ng build
```

Hasil build akan berada pada folder:

```
dist/
```

---

# Struktur Project

```
src/
│   index.html
│   main.ts
│   styles.css
│
└───app
    │   app.component.css
    │   app.component.html
    │   app.component.spec.ts
    │   app.component.ts
    │   app.config.ts
    │   app.routes.ts
    │
    ├───core
    │   ├───guards
    │   │       auth.guard.ts
    │   │       guest.guard.ts
    │   │
    │   └───layouts
    │       ├───main-layout
    │       │       main-layout.component.css
    │       │       main-layout.component.html
    │       │       main-layout.component.ts
    │       │
    │       └───sidebar
    │               sidebar.component.css
    │               sidebar.component.html
    │               sidebar.component.ts
    │
    ├───features
    │   ├───auth
    │   │   └───login-page
    │   │           login-page.component.css
    │   │           login-page.component.html
    │   │           login-page.component.spec.ts
    │   │           login-page.component.ts
    │   │
    │   └───employee
    │       ├───data
    │       │       employee-dummy.data.ts
    │       │
    │       ├───models
    │       │       employee.model.ts
    │       │
    │       ├───pages
    │       │   ├───employee-detail-page
    │       │   │       employee-detail-page.component.css
    │       │   │       employee-detail-page.component.html
    │       │   │       employee-detail-page.component.ts
    │       │   │
    │       │   ├───employee-form-page
    │       │   │       employee-form-page.component.css
    │       │   │       employee-form-page.component.html
    │       │   │       employee-form-page.component.ts
    │       │   │
    │       │   ├───employee-list-page
    │       │   │       employee-list-page.component.css
    │       │   │       employee-list-page.component.html
    │       │   │       employee-list-page.component.ts
    │       │   │
    │       │   └───employee-page
    │       │           employee-page.component.html
    │       │           employee-page.component.ts
    │       │
    │       └───services
    │               employee.service.ts
    │
    └───shared
        └───components
            ├───floating-input
            │       floating-input.component.css
            │       floating-input.component.html
            │       floating-input.component.spec.ts
            │       floating-input.component.ts
            │
            ├───floating-search-select
            │       floating-search-select.component.css
            │       floating-search-select.component.html
            │       floating-search-select.component.spec.ts
            │       floating-search-select.component.ts
            │
            ├───floating-select
            │       floating-select.component.css
            │       floating-select.component.html
            │       floating-select.component.spec.ts
            │       floating-select.component.ts
            │
            └───smart-table
                    smart-table.component.css
                    smart-table.component.html
                    smart-table.component.spec.ts
                    smart-table.component.ts
```

---

# Scripts

| Command     | Keterangan           |
| ----------- | -------------------- |
| npm install | Install dependency   |
| npm start   | Menjalankan aplikasi |
| ng serve    | Development server   |
| ng build    | Build project        |

---

# Troubleshooting

## 1. node_modules bermasalah

Hapus folder:

```
node_modules
package-lock.json
```

Kemudian install kembali.

```bash
npm install
```

---

## 2. ng tidak dikenali

Install Angular CLI.

```bash
npm install -g @angular/cli@19.2.15
```

Cek:

```bash
ng version
```

---

## 3. Port 4200 sudah digunakan

Gunakan port lain.

```bash
ng serve --port 4300
```

---

## 4. Dependency tidak sesuai

Pastikan menggunakan versi Node.js yang kompatibel dengan Angular 19.

```bash
node -v
npm -v
ng version
```

---

# Kontributor

- Muhammad Kurnia Iqbal

---

# License

Project ini dibuat untuk kebutuhan Tes atau Ujian.
