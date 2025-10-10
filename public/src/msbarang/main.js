import Listbarang from './components/Listbarang.js';
// Pastikan kode jalan setelah DOM siap
document.addEventListener("DOMContentLoaded", () => {
  const url = new URL(window.location.href);
  const pathSegments = url.pathname.split("/").filter(Boolean);
  const lastSegment = pathSegments.pop();

  // Inisialisasi komponen Listbarang sekali
  const listBarang = new Listbarang();

  // Delegasi event click secara efisien
  document.body.addEventListener("click", (event) => {
    const target = event.target;

    if (target.matches("#BtnBatal, #kembalihider")) {
      event.preventDefault();
      goBack(listBarang);
    }
  });
});

// Fungsi untuk kembali dan refresh data (tanpa membuat instance baru)
export default function goBack(listBarangInstance) {
  if (listBarangInstance && typeof listBarangInstance.refresh === "function") {
    listBarangInstance.refresh(); // Jika Listbarang punya method refresh()
  } else {
    new Listbarang(); // fallback jika belum ada instance reuse
  }
}
