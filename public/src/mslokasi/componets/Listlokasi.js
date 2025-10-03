// TransaksiList.js
import ButtonTambah from './ButtonTambah.js'; // asumsikan kamu punya ini
import TransaksiForm from './TransaksiForm.js';
import {baseUrl} from '../../config.js';


class Listlokasi {
  constructor() {
    this.root = document.getElementById('root');
    this.appendCustomStyles();
    this.render();
  }

   appendCustomStyles() {
    const style = document.createElement('style');
    style.textContent = `
     #thead{
        background-color:#E7CEA6 !important;
        /* font-size: 8px;
        font-weight: 100 !important; */
        /*color :#000000 !important;*/
      }
      .table-hover tbody tr:hover td, .table-hover tbody tr:hover th {
      background-color: #F3FEB8;
    }

    /* .table-striped{
      background-color:#E9F391FF !important;
    } */
    .dataTables_filter{
     padding-bottom: 20px !important;
  }
    `;
    document.head.appendChild(style);
  }


  async render() {
    this.root.innerHTML = ''; // bersihkan konten

    // Buat container utama
    const container = document.createElement('div');
    container.style.padding = '20px';

    // Baris header: title + tombol tambah di kanan
    const headerBar = document.createElement('div');
    headerBar.style.display = 'flex';
    headerBar.style.justifyContent = 'space-between';
    headerBar.style.alignItems = 'center';
    headerBar.style.marginBottom = '20px';

    const title = document.createElement('h4');
    title.textContent = 'Import Master Lokasi Gramedia';

    const buttonTambah = ButtonTambah({
      text: '+ Tambah',
      onClick: async () => {
        const oldmodal = document.getElementById('transaksiModal');
        if (oldmodal) oldmodal.remove(); // hapus modal lama jika ada
        const form = new TransaksiForm("add", null);
        this.root.appendChild(await form.render());
        var myModal = new bootstrap.Modal(document.getElementById('transaksiModal'), {
          keyboard: false
        });
        myModal.show();
         form.show();
      }
    });

    headerBar.appendChild(title);
  
    headerBar.appendChild(buttonTambah);

    container.appendChild(headerBar);

    // List transaksi (dummy contoh)
    const list = document.createElement('div');
    const datalist = await this.getdatalist();
     list.innerHTML = this.settable(datalist);
      // Aktifkan DataTables
   // list.innerHTML = '<p>Daftar isi transaksi akan muncul di sini...</p>';
    container.appendChild(list);

    this.root.appendChild(container);
    this.bindEvent();
    this.Tampildatatabel();
    //this.TampilCetak();
  }

  settable=(data)=>{

   let  html =`
      <table id="table1" class="table table-striped table-hover">
                            <thead id="thead">
                                <tr>
                                    <th class="text-center" style="width:5%">No</th>
                                    <th class="text-start">ID Toko</th>
                                    <th class="text-start">Customer</th>
                                    <th class="text-start">Nama Toko</th>
                                    <th class="text-start">Alamat</th>
                                    <th class=" text-center">Action</th>
                                   
                                </tr>
                            </thead>
                            <tbody>
                              ${this.generateTableRows(data)}
                            </tbody>
                            </table>
     `;

     return html;
     
  }

  generateTableRows(data) {
      if (!Array.isArray(data)) {
        return `<tr><td colspan="5">Tidak ada data</td></tr>`;
      }

      const createButton = (text, cssClass, dataset = {}) => {
        const attrs = Object.entries(dataset)
          .map(([key, val]) => `data-${key}="${val}"`)
          .join(' ');
        return `<button class="btn btn-sm ${cssClass}" ${attrs}>${text}</button>`;
      };

      return data.map((item, index) => {
      
          const actionBtn =createButton('Edit', 'btn-warning btn-edit', {
              idtoko: item.id_toko,
              customerid: item.customer_id,
              nama_toko: item.nama_toko,
              alamat:item.alamat
              
            });

         
        return `
          <tr>
            <td class="text-center" style="width:5%">${index + 1}</td>
            <td class="text-start">${item.id_toko}</td>
            <td class="text-start">${item.customer_id}</td>
            <td class="text-start">${item.nama_toko}</td>
            <td class="text-start">${item.alamat}</td>
            <td class="text-center">${actionBtn}</td>
          </tr>
        `;
      }).join('');
    }



  // === Setelah render tabel ===
bindEvent() {
  // simpan konteks
  const root = this.root;


    //button Edit
    $(document).off('click', '.btn-edit').on('click', '.btn-edit', async  function() {
    const idtoko = $(this).data('idtoko');
    const customerid = $(this).data('customerid');
    const nama_toko = $(this).data('nama_toko');
    const alamat  = $(this).data('alamat');


    const editdata ={
      idtoko:idtoko,
      customerid:customerid,
      namatoko:nama_toko,
      alamat:alamat
    }
    const oldmodal = document.getElementById('transaksiModal');
     if (oldmodal) oldmodal.remove();  // hapus modal lama jika ada
        const form = new TransaksiForm("edit", editdata);
        root.appendChild(await form.render());
        var myModal = new bootstrap.Modal(document.getElementById('transaksiModal'), {
          keyboard: false
        });
        myModal.show();
         form.show();

  });

  //and Edit

}
  
   async UpdataSatusPrint(codeprint){
      return new Promise((resolve, reject) => {
        $.ajax({
          url: `${baseUrl}/router/seturl`,
          method: "POST",
          dataType: "json",
          data:JSON.stringify(codeprint),
          contentType: "application/x-www-form-urlencoded; charset=UTF-8",
          headers: { 'url': 'voucherberi/updatesatusprint' },
         // beforeSend: () => this.showLoading(), // Ensure this.showLoading is a method
          success: (result) => {
            const datas = result.data;
            if (!result.error) {
              resolve(datas);
            } else {
              reject(new Error(result.error || "Unexpected response format"));
            }
          },
          error: (jqXHR) => {
            const errorMessage = jqXHR.responseJSON?.error || "Failed to fetch data";
            reject(new Error(errorMessage));
          }
        });
      });
  }
    async getdatalist() { 
      
      return new Promise((resolve, reject) => {
        $.ajax({
          url: `${baseUrl}/router/seturl`,
          method: "GET",
          dataType: "json",
          contentType: "application/x-www-form-urlencoded; charset=UTF-8",
          headers: { 'url': 'mslokasi/listdata' },
         // beforeSend: () => this.showLoading(), // Ensure this.showLoading is a method
          success: (result) => {
            const datas = result.data;
            if (!result.error) {
              resolve(datas);
            } else {
              reject(new Error(result.error || "Unexpected response format"));
            }
          },
          error: (jqXHR) => {
            const errorMessage = jqXHR.responseJSON?.error || "Failed to fetch data";
            reject(new Error(errorMessage));
          }
        });
      });
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






}

export default Listlokasi;

// export  async function GoBack() {
//    const container = document.getElementById("table1");
//     if (!container) return;

//     const modelclass = new TransaksiList();
//     const datalist = await modelclass.getdatalist();      // ambil data baru
//     container.innerHTML = modelclass.settable(datalist);  
//  }