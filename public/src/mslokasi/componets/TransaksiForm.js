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

    this.getCutomer();

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



  getCutomer(){
      const url = "mslokasi/getcutomer";
      const custid = this.data ? this.data.customerid : "";
      // kosongkan dulu semua option
          $("#customer").empty();
          if (!custid) {
            $("#customer").append('<option value="" disabled selected>Please Select</option>');
        }

    $.ajax({
                url: `${baseUrl}/router/seturl`,
                method:"GET",
                dataType: "json",
                contentType: "application/x-www-form-urlencoded; charset=UTF-8",
                headers: { 'url': url },
                success:function(result){
                  const dataresult = result.data;
                  if(dataresult !== null){
                    $.each(dataresult,function(key,value){
                        let id = value.id;
                        let name = value.name;
                        $("#customer").append($('<option/>').val(id).html(name));  
                      });

                        // aktifkan Tom Select
                        new TomSelect("#customer", {
                          placeholder: "Pilih Customer...",
                          searchField: "text",
                          sortField: { field: "text", direction: "asc" },
                            render: {
                            option: function (data, escape) {
                              return `<div class="py-2">${escape(data.text)}</div>`;
                            },
                            item: function (data, escape) {
                              return `<div>${escape(data.text)}</div>`;
                            }
                          }
                        });
                  // kalau custid ada, set value select
                      if (custid) {
                          $("#customer").val(custid).trigger("change");
                      }

                  }else{
                    Swal.fire({
                      position: "center",
                      icon: "info",
                      title: "customer yang di input tidak ada",
                      showConfirmButton: true,
                      //timer: 1500
                    });
                  }

        
                }
    });

              
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
                     const datas = result.data;
                     if (!result.error) {
                       resolve(datas);
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
