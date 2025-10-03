# gramedia_new
Membangun sistem internal untuk mengelola transaksi Sales Order (SO) dengan mekanisme upload data Excel dan input master data (Pratid &amp; Lokasi Gramedia).


Siap bro 🙌, saya bikinin langsung draft isi **README.md** jadi tinggal copy-paste ke file `README.md` di project `gramedia_new`.

---

````markdown
# 📘 Gramedia_New

Aplikasi internal untuk mengelola transaksi **Sales Order Gramedia** dengan fitur **upload Excel** dan **input master data (Pratid & Lokasi Gramedia)**.  
Dibangun menggunakan **PHP OOP Native** dengan koneksi **SQL Server (ODBC)**.

---

## 🚀 Fitur Utama
- Upload file Excel (Sales Order) → import otomatis ke database.  
- Validasi data saat import (format, duplikasi, referensi master).  
- CRUD Master Data:
  - **Pratid** (kode distributor/partner Gramedia).  
  - **Lokasi Gramedia** (toko cabang).  
- Log hasil upload (berhasil, gagal, error).  

---

## ⚙️ Konfigurasi Sistem

### 1. Clone Repository
```bash
git clone https://github.com/wardi17/gramedia_new.git
````

Letakkan di folder:

```
xampp/htdocs/bmi/gramedia_new
```

---

### 2. Setting Koneksi Database

Edit file:

```
/public/config/database.php
```

Isi dengan konfigurasi server masing-masing:

```php
define('DB_HOST', 'localhost');
define('DB_USER', 'sa');
define('DB_PASS', '');
define('DB_NAME', 'um_db');       // Database utama
define('DB_NAME2', 'bambi-bmi');  // Database tambahan
define('SERVER_DB', 'DESKTOP-1CEB0AJ\SQLEXPRESS');
define('SESSION_TIMEOUT', 1800);
```

Konfigurasi **base_url**:

```php
$protocol = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] != 'off') ? "https://" : "http://";
$host = $_SERVER['HTTP_HOST'];
$currentUrl = $protocol . $host;

define('base_url', $currentUrl . '/bmi/gramedia_new/public');
define('base_urllogin', $currentUrl . '/bmi/public/_login_proses/');
```

---

### 3. Setting Database SQL Server

* Pastikan sudah ada database:

  * `um_db`
  * `bambi-bmi`

* Import struktur tabel:

  * **SOTRANSACTION**
  * **SOTRANSACTIONDETAIL**
  * **MSPratid**
  * **MSLocation**

> Script SQL bisa ditaruh di folder `/database/`.

---

### 4. Install PHPExcel

Project ini menggunakan **PHPExcel** untuk membaca file Excel.

📥 Download library [PHPExcel 1.8](https://github.com/PHPOffice/PHPExcel/releases/tag/1.8.2)

Letakkan di:

```
/public/plugin/PHPExcel/
```

Tambahkan di file upload:

```php
require_once __DIR__ . '/../plugin/PHPExcel/Classes/PHPExcel.php';
```

---

### 5. Struktur Folder

```
gramedia_new/
│── public/
│   ├── config/        # Konfigurasi database, constant
│   ├── plugin/        # PHPExcel
│   ├── src/           # Source code (modules, components)
│   ├── index.php
│
│── database/          # Script SQL untuk generate tabel
│── README.md
```

---

### 6. Cara Jalankan

1. Jalankan **XAMPP / IIS**.
2. Akses lewat browser:

   ```
   http://localhost/bmi/gramedia_new/public
   ```
3. Login → masuk ke **menu upload Excel** atau **menu master data**.

---

⚡ Dengan konfigurasi ini, aplikasi siap digunakan untuk **import SO Gramedia dari Excel** dan **pengelolaan master data (Pratid & Lokasi)**.

```

---

Mau saya tambahin juga **contoh `.env` versi sederhana** buat ganti `define()` biar lebih rapi (kayak Laravel style), atau cukup pakai `define()` saja seperti sekarang bro?
```

