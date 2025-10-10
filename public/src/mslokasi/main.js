

import Listlokasi from './components/Listlokasi.js';

document.addEventListener("DOMContentLoaded",() =>{

const url = new URL(window.location.href);
const pathSegments = url.pathname.split("/");
const lastSegment = pathSegments.filter(Boolean).pop(); // filter untuk hilangkan elemen kosong
// Kondisi berdasarkan segmen terakhir URL
    new Listlokasi();

   //and 



  
});


export default function goBack(listBarangInstance) {
  if (listBarangInstance && typeof listBarangInstance.refresh === "function") {
    listBarangInstance.refresh(); // Jika Listbarang punya method refresh()
  } else {
    new Listlokasi(); // fallback jika belum ada instance reuse
  }
}