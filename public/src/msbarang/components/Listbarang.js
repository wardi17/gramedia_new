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
  this.root.innerHTML = ''; // Bersihkan konten

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
      if (oldmodal) oldmodal.remove(); // Hapus modal lama jika ada
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

  // List transaksi dengan loading state awal
  const list = document.createElement('div');
  list.id = 'dataList'; // ID untuk targeting mudah
  list.style.minHeight = '200px'; // Hindari collapse UI saat loading

  // Tampilkan loading indicator bertahap (spinner sederhana)
  list.innerHTML = `
    <div class="loading-container" style="
      display: flex; justify-content: center; align-items: center; height: 200px;
      font-size: 16px; color: #666;
    ">
      <div style="display: flex; flex-direction: column; align-items: center;">
        <div class="spinner" style="
          border: 4px solid #f3f3f3; border-top: 4px solid #3498db; 
          border-radius: 50%; width: 40px; height: 40px; animation: spin 1s linear infinite;
          margin-bottom: 10px;
        "></div>
        <p>Memuat data...</p>
      </div>
    </div>
    <style>
      @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
    </style>
  `;

  container.appendChild(list);
  this.root.appendChild(container);

  // Bind events dulu (sebelum data load, agar tombol responsive)
  this.bindEvent();

  // Fetch data secara async dan update bertahap
  try {
    const datalist = await this.getdatalist(); // Await di sini, UI sudah render

    // Update tabel dengan fade-in bertahap
    requestAnimationFrame(() => {
      list.innerHTML = this.settable(datalist); // Render tabel
      list.style.opacity = '0'; // Mulai dengan hidden untuk animasi
      list.style.transition = 'opacity 0.5s ease-in-out'; // Fade-in smooth

      // Trigger fade-in setelah render
      requestAnimationFrame(() => {
        list.style.opacity = '1';
      });

      // Init DataTables setelah render (untuk pagination/search agar bertahap)
      this.Tampildatatabel();
    });
  } catch (error) {
    // Error handling bertahap: Ganti loading dengan error message
    console.error('Error loading data:', error);
    requestAnimationFrame(() => {
      list.innerHTML = `
        <div style="text-align: center; padding: 50px; color: #e74c3c;">
          <p>Gagal memuat data. Silakan coba lagi.</p>
          <button onclick="location.reload()" style="background: #3498db; color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer;">
            Refresh
          </button>
        </div>
      `;
      list.style.opacity = '1';
    });
  }

  //this.TampilCetak(); // Uncomment jika diperlukan
}


  settable=(data)=>{

   let  html =`
      <table id="table1" class="table table-striped table-hover">
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
  try {
    // Cache selector sekali saja (hindari repeated DOM query)
    const cacheKey = "msbarang_data_cache";
    // 1️⃣ Gunakan cache lokal (agar load cepat saat buka ulang)
    const cached = sessionStorage.getItem(cacheKey);
    if (cached) {
      // Data masih valid (misal disimpan 5 menit)
      const { data, timestamp } = JSON.parse(cached);
      const now = Date.now();
      if (now - timestamp < 5 * 10* 100) {
        // Data cache kurang dari 5 menit, langsung return
        return data;
      }
    }
    // 2️⃣ Gunakan Fetch API (lebih cepat & ringan dari $.ajax)
    const response = await fetch(`${baseUrl}/router/seturl`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "url": "msbarang/listdata"
      },
      cache: "no-store" // jangan simpan di browser cache otomatis
    });
    if (!response.ok) throw new Error("Network error " + response.status);
    const result = await response.json();
    if (result.error) throw new Error(result.error);
    // 3️⃣ Simpan hasil ke sessionStorage biar load berikutnya instan
    sessionStorage.setItem(
      cacheKey,
      JSON.stringify({
        data: result.data,
        timestamp: Date.now()
      })
    );
    // 4️⃣ Return data ke pemanggil
    return result.data;
  } catch (err) {
    console.error("❌ Gagal memuat data:", err.message);
    throw err;
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

}



export default Listbarang;

// export  async function GoBack() {
//    const container = document.getElementById("table1");
//     if (!container) return;

//     const modelclass = new TransaksiList();
//     const datalist = await modelclass.getdatalist();      // ambil data baru
//     container.innerHTML = modelclass.settable(datalist);  
//  }