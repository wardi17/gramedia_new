
import SaveImport from './components/saveimport.js';


document.addEventListener("DOMContentLoaded", () => {
   
const url = new URL(window.location.href);
const pathSegments = url.pathname.split("/");
const lastSegment = pathSegments.filter(Boolean).pop(); // filter untuk hilangkan elemen kosong
// Kondisi berdasarkan segmen terakhir URL
const root ="#rootlist";
new SaveImport(root);
   //and 
});


