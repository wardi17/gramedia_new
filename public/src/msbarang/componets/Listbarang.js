// TransaksiList.js
import ButtonTambah from './ButtonTambah.js'; // asumsikan kamu punya ini
import TransaksiForm from './TransaksiForm.js';
import {baseUrl} from '../../config.js';


class Listbarang {
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
    title.textContent = 'Import Master Barang Gramedia';

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
      <table id="table1" class="table table-striped table-hover" id="table_Detailforwader">
                            <thead id="thead">
                                <tr>
                                    <th class="text-center" style="width:5%">No</th>
                                    <th class="text-start">partid_gramedia</th>
                                    <th class="text-start">partid_bambi</th>
                                    <th class="text-start">partname_bambi</th>
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
              partidgramedia: item.partid_gramedia,
              partidbambi: item.partid_bambi,
              partname_bambi: item.partname_bambi
              
            });

         
        return `
          <tr>
            <td class="text-center" style="width:5%">${index + 1}</td>
            <td class="text-start">${item.partid_gramedia}</td>
            <td class="text-start">${item.partid_bambi}</td>
            <td class="text-start">${item.partname_bambi}</td>
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
    const partidgramedia = $(this).data('partidgramedia');
    const partidbambi = $(this).data('partidbambi');
    const partname_bambi = $(this).data('partname_bambi');


    const editdata ={
      partidgramedia:partidgramedia,
      partidbambi:partidbambi,
      partname_bambi:partname_bambi,
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
          headers: { 'url': 'msbarang/listdata' },
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

export default Listbarang;

// export  async function GoBack() {
//    const container = document.getElementById("table1");
//     if (!container) return;

//     const modelclass = new TransaksiList();
//     const datalist = await modelclass.getdatalist();      // ambil data baru
//     container.innerHTML = modelclass.settable(datalist);  
//  }