
 
<main class="max-w-6x mx-auto my-10 px-4">
  <!-- CAR UPLOAD -->
  <div class="bg-lime-50 shadow-xl rounded-2xl p-6 border border-gray-100">
    <h3 class="text-2xl font-bord text-blue-700 mb-4 flex items-center gap-2">
      <i class="fa-solid fa-file-excel text-green-600"></i>
      Gramedia Import Excel SO
    </h3>
    
      <form id="form_upload_excel" enctype="multipart/form-data">
        <div class="grid md:grid-cols-2 gap-6 item-end">
          <!-- Input File -->
          <div>
            <label for="upload_file" class="block text-sm font-semibold text-gray-700 mb-2">Pilih File Excel</label>
            <input
            class="form-control w-full rounded-lg border border-gray-300 p-2 focus:ring-2 focus:ring-blue-400 focus:outline-none" 
            type="file" id="upload_file" accept=".xlsx">
            <small id="file_name" class="text-gray-500 mt-1 block">Belum ada file dipilih</small>
          </div>
          
          <!-- Tombol Upload di kanan sejajar -->
         <div class="flex items-center gap-2">
        <button 
          type="submit"
          class="flex items-center justify-center gap-1 bg-cyan-400 hover:bg-cyan-500 text-black px-2 h-[40px] rounded text-sm font-medium shadow-sm transition-all"
        >
          <i class="fa-solid fa-cloud-arrow-up text-xs"></i>
          Upload Data
        </button>
      
      <div id="buttoncontail"></div>
    </div>

      </form>

   <!-- Progress bar -->
    <div id="progressbar" class="hidden mt-4">
      <div class="w-full bg-gray-200 rounded-full h-3">
        <div id="progress-inner" class="bg-blue-600 h-3 rounded-full transition-all duration-500" style="width: 0%;"></div>
      </div>
      <small class="text-gray-500 mt-1 block text-sm" id="progress-text">Uploading...</small>
    </div>
  </div>
        <!-- CARD HASIL UPLOAD -->
    <div id="rootlist" class="mt-6 bg-white shadow-md rounded-2xl p-4 border border-gray-100">
      <!-- Isi tabel / hasil render dari main.js -->
    </div>
    <!-- Progress Bar -->
  
  </div>
</main>

<script type="module" src="<?= base_url; ?>/src/gramediaimport/main.js"></script>
<!-- Script -->



