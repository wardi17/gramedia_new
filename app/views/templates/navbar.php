   
<?php
$page     = isset($data['page']) ? $data['page'] : '';
?>
<style>
  .navbar .navbar-brand {
  color: rgba(255, 255, 255, 0.5); /* lebih gelap/transparan */
  transition: 0.3s;
}

.navbar .navbar-brand:hover {
  color: rgba(255, 255, 255, 0.8); /* lebih terang saat hover */
}

.navbar .navbar-brand.active {
  color: #fff; /* full putih kalau active */
  font-weight: bold;
}

</style>
<nav class="navbar navbar-expand-md navbar-dark fixed-top bg-primary">
  <div class="container-fluid">
    <a class="navbar-brand <?= $page == 'home' ? 'active' : '' ?>" href="<?= base_url ?>">Beranda</a>
    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarCollapse" aria-controls="navbarCollapse" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse" id="navbarCollapse">
      <ul class="navbar-nav me-auto mb-2 mb-md-0">
        <li class="nav-item">
          <a class="nav-link <?= $page == 'msbarang' ? 'active' : '' ?>" aria-current="page" href="<?= base_url ?>/msbarang">Import Master Barang</a>
        </li>
        <li class="nav-item">
          <a class="nav-link   <?= $page == 'mslokasi' ? 'active' : '' ?>" aria-current="page" href="<?= base_url ?>/mslokasi">Import Master Lokasi</a>
        </li>
    
      </ul>
    </div>
  </div>
</nav>

      
      
