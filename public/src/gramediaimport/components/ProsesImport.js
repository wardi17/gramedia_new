import { baseUrl } from '../../config.js';


class ProsesImport {
  constructor(datas) {
    this.handelProsesimport(datas);
  }

  async handelProsesimport(datas) {
    try {
      await this.sendDataToApi(datas);
      // sukses → langsung balik ke menu utama
      window.location.replace(baseUrl)
    } catch (error) {
      console.error("Import gagal:", error);
    }
  }

  async sendDataToApi(data) {
    return new Promise((resolve, reject) => {
      $.ajax({
        url: `${baseUrl}/router/seturl`,
        method: "POST",
        data: JSON.stringify(data),
        dataType: "json",
        contentType: "application/json; charset=UTF-8",
        headers: { 'url': 'import/prosesdata' },

        beforeSend: () => {
          Swal.fire({
            title: "Mengproses data...",
            text: "Mohon tunggu sebentar",
            allowOutsideClick: false,
            didOpen: () => {
              Swal.showLoading();
            }
          });
        },

        success: function (result) {
          Swal.close(); 
          const datas = result.data;
          let nilai = datas.nilai;
          let message = datas.error;

          if (nilai === 1) {
            Swal.fire({
              icon: "success",
              title: "Berhasil",
              text: message,
              timer: 2000,
              showConfirmButton: false
            }).then(() => {
              // setelah alert sukses hilang → balik ke menu utama
              const root = "#rootlist";
              new SaveImport(root);
            });

            resolve(datas);
          } else {
            Swal.fire({
              icon: "error",
              title: "Gagal",
              text: message
            });
            reject(datas);
          }
        },

        error: () => {
          Swal.close(); 
          Swal.fire({
            icon: "error",
            title: "Gagal",
            text: "Terjadi kesalahan di koneksi"
          });
          reject(new Error("Koneksi gagal"));
        }
      });
    });
  }
}

export default ProsesImport;
