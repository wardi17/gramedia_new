<style>
  /* .color-text{
    texe-color
  } */
</style>
<main class="container my-5">
  <div class="bg-light p-5 rounded shadow-sm">
    <h4 class="mb-4 text-primary">Gramedia Import Excel SO</h4>
    
      <form id="form_upload_excel" enctype="multipart/form-data">
        <div class="row align-items-end">
          <!-- Input File -->
          <div class="col-md-6">
            <label for="upload_file" class="form-label fw-bold">Pilih File Excel</label>
            <input class="form-control" type="file" id="upload_file" accept=".xls,.xlsx">
            <small id="file_name" class="text-muted d-block mt-2">Belum ada file dipilih</small>
          </div>
          
          <!-- Tombol Simpan di kanan sejajar -->
          <div class="col-md-4 d-flex align-items-center gap-2">
            <button type="submit" class="btn btn-info px-4">
              <i class="fa-solid fa-file-arrow-up me-2"></i> Simpan Data
            </button>
            <div id="buttoncontail"></div>
          </div>
      </form>


        <div id="rootlist" class="mt-4"></div>
    <!-- Progress Bar -->
    <div class="progress mt-4 d-none" id="upload_progress">
      <div class="progress-bar progress-bar-striped progress-bar-animated bg-info" 
           role="progressbar" style="width: 0%">0%</div>
    </div>
  </div>
</main>

<script type="module" src="<?= base_url; ?>/src/gramediaimport/main.js"></script>
<!-- Script -->



