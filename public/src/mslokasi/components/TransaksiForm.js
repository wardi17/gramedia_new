import {baseUrl} from '../../config.js';
import goBack from '../main.js';

export default class TransaksiForm {
  constructor(mode = "add", data = null) {
    this.modalId = "transaksiModal";
    this.mode = mode;   // "add" atau "edit"
    this.data = data;   // kalau edit, isi data lama
     this.appendCustomStyles();
  }
appendCustomStyles() {
    const style = document.createElement('style');
   style.textContent = `
   /* ====== Styling TomSelect agar mirip Bootstrap ====== */
      .ts-control {
        font-family: var(--bs-body-font-family);
        font-size: var(--bs-body-font-size);
        border-radius: var(--bs-border-radius);
        border: 1px solid var(--bs-border-color);
        padding: 0.375rem 0.75rem;
        min-height: calc(1.5em + 0.75rem + 2px);
        line-height: 1.5;
      }

      .ts-control.focus {
        border-color: var(--bs-primary);
        box-shadow: 0 0 0 0.25rem rgba(var(--bs-primary-rgb), .25);
      }

      .ts-dropdown {
        font-family: var(--bs-body-font-family);
        font-size: var(--bs-body-font-size);
        border-radius: var(--bs-border-radius);
      }

   `;
   document.head.appendChild(style);

}
 async render() {
    const modalWrapper = document.createElement("div");
    modalWrapper.innerHTML = `
      <div class="modal fade" id="${this.modalId}" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-hidden="true">
        <div class="modal-dialog modal-lg">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">${this.mode === "add" ? "Tambah" : "Edit"} Master Gramedia</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body">
              <form id="formTransaksi">
                <div class="mb-3">
                  <label class="form-label">ID Toko</label>
                  <input ${this.mode === "add" ? "" : "disabled"} type="text" class="form-control" id="id_toko" name="id_toko" 
                    value="${this.data ? this.data.idtoko : ""}" required>
                </div>
                 <div class="mb-3">
                  <label class="form-label">Customer</label>
                  <select type="text" class="form-control customer" id="customer" name="customer">
              
                  </select>
                </div>
              <div class="mb-3">
                  <label class="form-label">Nama Toko</label>
                  <input disabled type="text" class="form-control" id="namatoko" name="namatoko" 
                    value="${this.data ? this.data.namatoko : ""}" required>
                </div>
                  <div class="mb-3">
                  <label class="form-label">Alamat</label>
                  <textarea disabled  type="text" class="form-control" id="alamat" name="alamat" 
                    value="${this.data ? this.data.alamat : ""}" required>${this.data ? this.data.alamat : ""}</textarea>
                </div>
              </form>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Batal</button>
              <button type="button" id="Simpdandata" class="btn btn-primary">
                ${this.mode === "add" ? "Simpan" : "Update"}
              </button>
                ${this.mode !== "add" ? `<button type="button" id="Hapusdata" class="btn btn-danger">Delete</button>` : ""}
            </div>
          </div>
        </div>
      </div>
    `;
    return modalWrapper.firstElementChild;
  }


  show() {

    this.getCustomer();

    document.getElementById("Simpdandata")?.addEventListener("click", () => {
      // console.log("attachEventHandlers called:", this.sumbit);
     const modalEl = document.getElementById(this.modalId);
      const modal = bootstrap.Modal.getInstance(modalEl) 
                || new bootstrap.Modal(modalEl); // pastikan ada instance
      //modal.hide();

      const form = document.getElementById("formTransaksi");
      if (form.checkValidity()) {
        const id_toko = document.getElementById("id_toko").value;
        const customer = document.getElementById("customer").value;
        const customer_name = document.getElementById("customer").textContent;
        const alamat = document.getElementById("alamat").value;
        const namatoko = document.getElementById("namatoko").value;
         let customer_split = customer_name.split("|");
         let customer_bambi = customer_split[1];
        const datas = {
          id_toko : id_toko,
          customerid: customer,
          custname: customer_bambi.trim(),
          namatoko:namatoko,
          alamat:alamat
        };

        //console.log("Form data to submit:", datas); return;
        this.Prosesdata(datas);
        modal.hide();
        goBack();
      }
       
    });

        const customerElement = document.getElementById("customer");

        if (customerElement) {
          customerElement.addEventListener("change", async (event) => {
           const select = event.target;
            const selectedValue = select.value;
            const selectName = select.options[select.selectedIndex].text;
            let splitName = selectName.split(" |")
            let custname = splitName[1]
         
            try {
              $("#namatoko").val(custname);
              const alamat = await this.getAlamat(selectedValue);
           
              // set nilai input alamat
              $("#alamat").val(alamat);
            } catch (error) {
              console.error("Gagal mengambil alamat:", error);
            }
          });
        }



     document.getElementById("Hapusdata")?.addEventListener("click",() =>{
       const modalEl = document.getElementById(this.modalId);
       const modal = bootstrap.Modal.getInstance(modalEl) || new bootstrap.Modal(modalEl);
        const id_toko = document.getElementById("id_toko").value;
        const datas ={
          id_toko:id_toko
        }
           Swal.fire({
                title: "Apakah Anda Yakin ini",
                text: "Hapus Data Ini!",
                type: "warning",
                showDenyButton: true,
                confirmButtonColor: "#93C54B",
                denyButtonColor: "#382222ff",
                confirmButtonText: "Ya,Hapus",
                denyButtonText: "Tidak",
              }).then((result)=>{
                  if(result.isConfirmed){
                      this.ProsesDelete(datas);
                        modal.hide();
                        goBack();
                  }
              });
     });
  }



 async getCustomer() {
  const url = "mslokasi/getcutomer";
  const custid = this.data?.customerid || "";
  const $customer = $("#customer");

  // 🔹 Kosongkan option lama dulu
  $customer.empty().append('<option value="" disabled selected>Pilih Customer...</option>');

  try {
    // 🔹 Cek cache lokal biar load cepat
    const cacheKey = "customer_data_cache";
    const cached = sessionStorage.getItem(cacheKey);
    let dataresult;

    if (cached) {
      const { data, timestamp } = JSON.parse(cached);
      if (Date.now() - timestamp < 5 * 30 * 100) {
        dataresult = data; // gunakan cache jika masih baru (<5 menit)
      }
    }

    // 🔹 Kalau tidak ada cache, ambil data dari server
    if (!dataresult) {
      const response = await fetch(`${baseUrl}/router/seturl`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "url": url,
        },
        cache: "no-store",
      });

      if (!response.ok) throw new Error("Gagal mengambil data customer");

      const result = await response.json();
      if (result.error) throw new Error(result.error);

      dataresult = result.data;
      // Simpan cache
      sessionStorage.setItem(
        cacheKey,
        JSON.stringify({ data: dataresult, timestamp: Date.now() })
      );
    }

    // 🔹 Isi dropdown customer
    if (Array.isArray(dataresult) && dataresult.length > 0) {
      const options = dataresult
        .map(
          (item) =>
            `<option value="${item.id}" ${
              item.id === custid ? "selected" : ""
            }>${item.name}</option>`
        )
        .join("");

      $customer.append(options);
      // 🔹 Hapus TomSelect lama jika ada
      if ($customer[0].tomselect) {
        $customer[0].tomselect.destroy();
      }

      // 🔹 Aktifkan TomSelect sekali saja
     const tomSelect= new TomSelect("#customer", {
        placeholder: "Pilih Customer...",
        searchField: "text",
        sortField: { field: "text", direction: "asc" },
        render: {
          option: (data, escape) => `<div class="py-2">${escape(data.text)}</div>`,
          item: (data, escape) => `<div>${escape(data.text)}</div>`,
        },
      });
         // 🔹 Kalau ada custid, set langsung ke TomSelect
      if (custid) {
        tomSelect.setValue(custid);
      }
      
    } else {
      Swal.fire({
        position: "center",
        icon: "info",
        title: "Customer tidak ditemukan",
        showConfirmButton: true,
      });
    }
  } catch (err) {
    //console.error("❌ Error getCustomer:", err.message);
    Swal.fire({
      position: "center",
      icon: "error",
      title: "Gagal memuat data customer",
      text: err.message,
      showConfirmButton: true,
    });
  }
}


 async getAlamat(customerid){
      let url = "mslokasi/getalamat";
       return new Promise((resolve, reject) => {
                 $.ajax({
                   url: `${baseUrl}/router/seturl`,
                   method: "POST",
                   dataType: "json",
                   data:JSON.stringify(customerid),
                   contentType: "application/x-www-form-urlencoded; charset=UTF-8",
                   headers: { 'url': url },
                   //beforeSend: () => this.showLoading(), // Ensure this.showLoading is a method
                   success: (result) => {
                     if (result && !result.error) {
                        resolve(result.data);
                      } else {
                        reject(new Error(result.error || "Unexpected response format"));
                      }
                   },
                   error: (jqXHR, textStatus, errorThrown) => {
                     const errorMessage = jqXHR.responseJSON?.error || "Failed to fetch data";
                     reject(new Error(errorMessage));
                   }
                 });
               });
  }

async Prosesdata(datas) {
  let url = "mslokasi/simpandata";
  const mode = this.mode === "add" ? "simpan" : "update"; // cek mode

  return new Promise((resolve, reject) => {
    $.ajax({
      url: `${baseUrl}/router/seturl`,
      method: "POST",
      dataType: "json",
      data: JSON.stringify(datas),
      contentType: "application/x-www-form-urlencoded; charset=UTF-8",
      headers: { 'url': url },

      // tampilkan loading sebelum proses
      beforeSend: () => {
        Swal.fire({
          title: (mode === "add" ? "Menyimpan data..." : "Mengupdate data..." ),
          text: "Mohon tunggu sebentar",
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading();
          }
        });
      },

      success: (result) => {
        if (!result.error) {
          Swal.fire({
            icon: "success",
            title: "Berhasil",
            text: (mode === "add" ? "Data berhasil disimpan" : "Data berhasil diupdate" ),
            timer: 2000,
            showConfirmButton: false
          });
          resolve(result);
        } else {
          Swal.fire({
            icon: "error",
            title: "Gagal",
            text: result.error || "Terjadi kesalahan"
          });
          reject(new Error(result.error || "Unexpected response format"));
        }
      },

      error: (jqXHR) => {
        const errorMessage = jqXHR.responseJSON?.error || 
          (mode === "add" ? "Gagal menyimpan data" : "Gagal mengupdate data");
        Swal.fire({
          icon: "error",
          title: "Error",
          text: errorMessage
        });
        reject(new Error(errorMessage));
      }
    });
  });
}


     //proses delete 
    async ProsesDelete(datas) {
      let url = "mslokasi/deletedata";
      return new Promise((resolve, reject) => {
        $.ajax({
          url: `${baseUrl}/router/seturl`,
          method: "POST",
          dataType: "json",
          data: JSON.stringify(datas),
          contentType: "application/x-www-form-urlencoded; charset=UTF-8",
          headers: { 'url': url },
          
          // tampilkan loading sebelum request
          beforeSend: () => {
            Swal.fire({
              title: 'Menghapus data...',
              text: 'Mohon tunggu sebentar',
              allowOutsideClick: false,
              didOpen: () => {
                Swal.showLoading();
              }
            });
          },

          success: (result) => {
            if (!result.error) {
              Swal.fire({
                icon: 'success',
                title: 'Berhasil',
                text: 'Data berhasil dihapus',
                timer: 2000,
                showConfirmButton: false
              });
              resolve(result);
            } else {
              Swal.fire({
                icon: 'error',
                title: 'Gagal',
                text: result.error || "Terjadi kesalahan"
              });
              reject(new Error(result.error || "Unexpected response format"));
            }
          },

          error: (jqXHR) => {
            const errorMessage = jqXHR.responseJSON?.error || "Gagal menghapus data";
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: errorMessage
            });
            reject(new Error(errorMessage));
          }
        });
      });
    }

}
