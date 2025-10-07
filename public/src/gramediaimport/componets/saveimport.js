import { baseUrl } from '../../config.js';
import ProsesImport from './ProsesImport.js';
class SaveImport {
  constructor(containerSelector) {
    this.container = document.querySelector(containerSelector);
    this.handleAddClick();
  }





  handleAddClick() {
  
    // Submit form
      document.getElementById('upload_file').addEventListener('change', function(e) {
      const fileName = e.target.files.length ? e.target.files[0].name : 'Belum ada file dipilih';
      document.getElementById('file_name').textContent = fileName;
    });

      const self = this;
    document.getElementById('form_upload_excel').addEventListener('submit', async function(e) {
      e.preventDefault();
      await self.saveDataFrom(e);
    });


  }

    async saveDataFrom(e) {
    const dataInput = await this.validateInput(e);
    if (!dataInput) return;

    try {
        const data=  await this.sendDataToApi(dataInput);
        let responsdata =data.data;
      this.renderTable(responsdata);
    } catch (error) {
       console.log('Gagal memuat data:', error);
       console.error('Gagal memuat data:', error);
      this.container.innerHTML = '<p>Gagal memuat data.</p>';
    }
  }



async validateInput(event) {
  const file_excel = $("#upload_file")[0].files[0];
  const data = { idimport: this.generateUniqueId() };
   let valid=true;
  if(file_excel == undefined){
    $("#file_name").addClass('color-text').text("color data")
     valid = false;
  }

     if (!valid) {
      event.preventDefault();
      return false;
    }
  //console.log(file_excel); return;
  const formData = new FormData();
  formData.append("data", JSON.stringify(data)); // field pertama untuk data JSON
  formData.append("files", file_excel);          // field kedua untuk file


  return formData;
}



    async sendDataToApi(data) {
      //console.log(baseUrl);return;
      return new Promise((resolve, reject) => {
        $.ajax({
          url: `${baseUrl}/router/seturl`,
          method: "POST",
          dataType: "json",
          data: data,
            processData: false,        // Penting: Jangan proses FormData
            contentType: false,        // Penting: Biar browser set otomatis
          headers: { 'url': 'import/savedata' },
          beforeSend: this.showLoading,
          success: function (result) {
               Swal.close(); // stop loading saat sukses
            if (!result.error) {
              resolve(result);
            } else {
              reject(new Error(result.error || "Unexpected response format"));
            }
          },
          error: (jqXHR, textStatus, errorThrown) => {
              Swal.close(); 

            const errorMessage = jqXHR.responseJSON?.error || "Failed to fetch data";
            reject(new Error(errorMessage));
          }
        });
      });
    }


  //tampil table hasil upload validasi 
  renderTable(data) {
   // console.log(data); return;
  const table = document.createElement('table');
  table.className = 'table table-striped';
  table.id = 'table1';

  const thead = `
    <thead id="thead">
      <tr>
        <th>NO</th>
        <th>Product Number</th>
        <th>ALL</th>
        <th class="text-end">Store</th>
        <th class="text-end">Item Tax</th>
        <th class="text-end">Retail Base Price</th>
        <th class="text-end">QTY</th>
        <th>Total Retail Base Price</th>
        <th>Payable</th>
        <th>PPN</th>
        <th>Status</th>
      </tr>
    </thead>
  `;
  let no =1;
const tbodyRows = data.map(item => {
  const isInvalid = item.status_toko === 'N' || item.status_product === 'N' || item.status_partid === 'N'
  const statusText = isInvalid ? 'Tidak Valid' : 'Valid';
  const rowClass = isInvalid ? 'table-danger' : ''; // Bootstrap table-danger = merah
  const sttoko = item.status_toko === 'N' ? 'text-drak bg-warning ' : '';
  const stproduk = item.status_product === 'N' || item.status_partid === 'N' ? 'text-drak bg-warning ' : '';
  return `
    <tr class="${rowClass}">
      <td>${no++}</td>
      <td class="${stproduk}">${item.product_number}</td>
      <td>${item.product_all}</td>
      <td class="text-end ${sttoko}">${item.store}</td>
      <td class="text-end">${item.item_tax}</td>
      <td class="text-end">${item.price}</td>
      <td class="text-end">${item.qty}</td>
      <td class="text-end">${item.total_price}</td>
      <td class="text-end">${item.payable}</td>
      <td class="text-end">${item.ppn}</td>
      <td class="text-end fw-bold">${statusText}</td>
    </tr>
  `;
}).join('');


  table.innerHTML = thead + `<tbody>${tbodyRows}</tbody>`;
  this.container.innerHTML = '';
  this.container.appendChild(table);
  // Aktifkan DataTables
 this.Tampildatatabel();
 document.getElementById('buttoncontail').innerHTML = '';
  const adaInvalid = data.some(item => item.status_toko === 'N' || item.status_product === 'N' || item.status_partid === 'N'
   );
  const idimport = data.length > 0 ? data[0].IDimport : null;

  //console.log(adaInvalid); return;
   if(!adaInvalid){
    const setbutton = document.querySelector("#buttoncontail");
    setbutton.innerHTML =`<button type="button" class="btn btn-success px-4" id="btnProses">
      <i class="fa-solid fa-play me-2"></i> Proses
    </button>`;

        // Event listener tombol proses
        document.getElementById('btnProses').addEventListener('click', function() {
           const datas ={
            "idimport":idimport
           }
           
        // console.log(datas); return;
           new ProsesImport(datas);
          // Panggil fungsi proses di sini
        });

   }

}


      Tampildatatabel(){
          const id = "#table1";
          $(id).DataTable({
              order: [[0, 'asc']],
                responsive: true,
                "ordering": true,
                "destroy":true,
                pageLength: 5,
                lengthMenu: [[5, 10, 20, -1], [5, 10, 20, 'All']],
                fixedColumns:   {
                     // left: 1,
                      right: 1
                  },
                  
              })
        }
  //and data table hasil upload validasi


  showLoading() {
    Swal.fire({
      title: 'Loading',
      html: 'Please wait...',
      allowEscapeKey: false,
      allowOutsideClick: false,
      didOpen: () => Swal.showLoading()
    });
  }


  showSuccessMessage() {
    Swal.fire({
      position: 'center',
      icon: 'success',
      showConfirmButton: false,
      timer: 1000,
      text: "Data saved successfully."
    }).then(() => {
       const modalElement = document.getElementById('modal-trans-inventaris');
        const modalInstance = bootstrap.Modal.getInstance(modalElement);
        if (modalInstance) {
          modalInstance.hide(); //tutup modal dengan benar
        }
      goBack();
    });
  }

  showErrorMessage() {
    Swal.fire({
      icon: "error",
      title: "Error!",
      text: "Terjadi kesalahan saat Simpan data."
    });
  }



  generateUniqueId() {
      // data dasar: waktu + random
      const hashHex =Date.now()+ Math.random().toString(36).substring(2, 10);
      // ambil sebagian supaya pendek (misalnya 8 karakter)
      return `GMA-${hashHex.substring(0, 8)}`;
  }

   

  // untuk  upload gambar baru 15/08/2025


  //and 
}

export default SaveImport;
