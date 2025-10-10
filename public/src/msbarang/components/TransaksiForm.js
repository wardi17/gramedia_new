import {baseUrl} from '../../config.js';
import goBack from '../main.js';

export default class TransaksiForm {
  constructor(mode = "add", data = null) {
    this.modalId = "transaksiModal";
    this.mode = mode;   // "add" atau "edit"
    this.data = data;   // kalau edit, isi data lama
    
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
                  <label class="form-label">Part ID Gramedia</label>
                  <input ${this.mode === "add" ? "" : "disabled"} type="text" class="form-control" id="part_id_gramedia" name="part_id_gramedia" 
                    value="${this.data ? this.data.partidgramedia : ""}" required>
                </div>
                <div class="mb-3">
                  <label class="form-label">Part ID Bambi</label>
                  <input type="text" class="form-control" id="part_id_bambi" name="part_id_bambi" 
                    value="${this.data ? this.data.partidbambi : ""}" required>
                </div>
                 <div class="mb-3">
                  <label class="form-label">Part Name Bambi</label>
                  <select type="text" class="form-control" id="part_name_bambi" name="part_name_bambi"></select>
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
    if(this.mode !=="add"){
       const part_id_bambi = this.data.partidbambi;
        this.getPartid(part_id_bambi);
    }

    document.getElementById("Simpdandata")?.addEventListener("click", () => {
      // console.log("attachEventHandlers called:", this.sumbit);
     const modalEl = document.getElementById(this.modalId);
      const modal = bootstrap.Modal.getInstance(modalEl) 
                || new bootstrap.Modal(modalEl); // pastikan ada instance
      //modal.hide();

      const form = document.getElementById("formTransaksi");
      if (form.checkValidity()) {
        const part_id_gramedia = document.getElementById("part_id_gramedia").value;
        const part_id_bambi = document.getElementById("part_id_bambi").value;
        const part_name = document.getElementById("part_name_bambi").textContent;
         let partname_split = part_name.split("|");
         let partname_bambi = partname_split[1];
        const datas = {
          part_id_gramedia : part_id_gramedia,
          part_id_bambi: part_id_bambi,
          part_name_bambi: partname_bambi.trim(),
        };

        //console.log("Form data to submit:", datas); return;
        this.Prosesdata(datas);
        modal.hide();
        goBack();
      }
       
    });

    document.getElementById("part_id_bambi")?.addEventListener("change", (event) => {
      const selectedValue = event.target.value;
               this.getPartid(selectedValue);
    });

     document.getElementById("part_name_bambi")?.addEventListener("change", (event) => {
      const selectedValue = event.target.value;
        $("#part_id_bambi").val(selectedValue);
    });

     document.getElementById("Hapusdata")?.addEventListener("click",() =>{
       const modalEl = document.getElementById(this.modalId);
       const modal = bootstrap.Modal.getInstance(modalEl) || new bootstrap.Modal(modalEl);

        const part_id_gramedia = document.getElementById("part_id_gramedia").value;
        const datas ={
          part_id_gramedia:part_id_gramedia
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

  //getpartid bambi
    getPartid(datas){
      $("#part_id_bambi").val("");
      $("#part_name_bambi").empty();
      const url = "msbarang/getpartid";
    $.ajax({
                url: `${baseUrl}/router/seturl`,
                method:"POST",
                dataType: "json",
                data:{filter:datas},
                contentType: "application/x-www-form-urlencoded; charset=UTF-8",
                headers: { 'url': url },
                success:function(result){
                  const dataresult = result.data;
                  if(dataresult !== null){
                    $.each(dataresult,function(key,value){
                   
                      let partname_asli = value.partid;
                        let partname = value.partname;
                        $("#part_name_bambi").append($('<option/>').val(partname_asli).html(partname));  
                      });
          
                      const partid = $("#part_name_bambi").val();
                        $("#part_id_bambi").val(partid);
                  }else{
                    Swal.fire({
                      position: "center",
                      icon: "info",
                      title: "partid yang di input tidak ada",
                      showConfirmButton: true,
                      //timer: 1500
                    });
                  }

        
                }
    });
 }

async Prosesdata(datas) {
  let url = "msbarang/simpandata";
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
      let url = "msbarang/deletedata";
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

