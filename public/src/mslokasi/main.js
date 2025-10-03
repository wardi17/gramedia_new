

import Listlokasi from './componets/Listlokasi.js';

$(document).ready(function () {
   
const url = new URL(window.location.href);
const pathSegments = url.pathname.split("/");
const lastSegment = pathSegments.filter(Boolean).pop(); // filter untuk hilangkan elemen kosong
// Kondisi berdasarkan segmen terakhir URL
   new Listlokasi();

   //and 

   $(document).on("click","#BtnBatal,#kembalihider",function(event){
      event.preventDefault();
      goBack();
   })
});


export default  function goBack(){
     new Listlokasi();
}