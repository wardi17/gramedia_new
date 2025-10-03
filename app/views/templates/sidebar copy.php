<?php 
// $log_fin  = isset($_SESSION["log_fin"]) ? $_SESSION["log_fin"] : '';
$log_fam  = isset($_SESSION["log_fam"]) ? $_SESSION["log_fam"] : '';
$level_us = isset($_SESSION["level_user"]) ? $_SESSION["level_user"] : '';
$level3   = isset($_SESSION["login_user"]) ? $_SESSION["login_user"] : '';
$page     = isset($data['page']) ? $data['page'] : '';
$pages    = isset($data['pages']) ? $data['pages'] : '';
?>

<div id="app">
    <div id="sidebar" class="active">
        <div class="sidebar-wrapper active">
            <div class="sidebar-header position-relative">
                <div class="d-flex justify-content-between align-items-center">
                    <div class="logo">
                        <h5><a href="<?= base_url ?>/home"><?= $_SESSION['login_user'] ?></a></h5>
                    </div>
                    <div class="theme-toggle d-flex gap-2 align-items-center mt-2">
                        <div class="form-check form-switch fs-6">
                            <input class="me-0" type="hidden" id="toggle-dark">
                        </div>
                    </div>
                    <div class="sidebar-toggler x">
                        <a href="#" class="sidebar-hide d-xl-none d-block">
                            <i class="bi bi-x bi-middle"></i>
                        </a>
                    </div>
                </div>
            </div>

            <div class="sidebar-menu">
                 <ul class="menu">
                 <ul class="menu">
                    <li class="sidebar-title">Master</li>

                    <li class="sidebar-item <?= $pages == 'home' ? 'active' : '' ?>">
                        <a href="<?= base_url ?>/home" class="sidebar-link">
                            <i class="bi bi-box-seam"></i>
                            <span>Packing List</span>
                        </a>
                    </li>

                    <li class="sidebar-item <?= $pages == 'msfor' ? 'active' : '' ?>">
                        <a href="<?= base_url ?>/msforwader" class="sidebar-link">
                            <i class="bi bi-truck"></i>
                            <span>Master Forwader</span>
                        </a>
                    </li>

                    <li class="sidebar-title">Menu Belum Final</li>
                    <li class="sidebar-item <?= $pages == 'inputkrus' ? 'active' : '' ?>">
                        <a href="<?= base_url ?>/transaksikurs" class="sidebar-link">
                            <i class="bi bi-cash-stack"></i>
                            <span>Input Biaya PIB + FWD</span>
                        </a>
                    </li>

                    <li class="sidebar-item <?= $pages == 'post' ? 'active' : '' ?>">
                        <a href="<?= base_url ?>/transaksikurs/postlist" class="sidebar-link">
                            <i class="bi bi-journal-check"></i>
                            <span>Posted</span>
                        </a>
                    </li>

                    <li class="sidebar-item <?= $pages == 'lap' ? 'active' : '' ?>">
                        <a href="<?= base_url ?>/laporankurs/packing" class="sidebar-link">
                            <i class="bi bi-file-earmark-bar-graph"></i>
                            <span>Laporan</span>
                        </a>
                    </li>

                    <?//phpif ($log_fin): // Check if data is final ?>
                    <li class="sidebar-title">Menu Final</li>
                    <li class="sidebar-item <?= $pages == 'inputkrusfinal' ? 'active' : '' ?>">
                        <a href="<?= base_url ?>/transaksifinalkurs" class="sidebar-link">
                            <i class="bi bi-pencil-square"></i>
                            <span>Input Final</span>
                        </a>
                    </li>

                    <li class="sidebar-item <?= $pages == 'listkrusfinal' ? 'active' : '' ?>">
                        <a href="<?= base_url ?>/transaksifinalkurs/listfinal" class="sidebar-link">
                            <i class="bi bi-list-task"></i>
                            <span>List Final</span>
                        </a>
                    </li>

                    <li class="sidebar-item <?= $pages == 'postfinal' ? 'active' : '' ?>">
                        <a href="<?= base_url ?>/transaksifinalkurs/postlist" class="sidebar-link">
                            <i class="bi bi-journal-check"></i>
                            <span>Posted Final</span>
                        </a>
                    </li>

                    <li class="sidebar-item <?= $pages == 'lapfinal' ? 'active' : '' ?>">
                        <a href="<?= base_url ?>/laporankursfinal/packing" class="sidebar-link">
                            <i class="bi bi-file-earmark-bar-graph"></i>
                            <span>Laporan Final</span>
                        </a>
                    </li>
                    <?//php endif; ?>

                    <!-- Contoh menu tambahan jika dibutuhkan di masa depan -->
                    <!-- 
                    <?php if($level3 == "wardi" || $level3 == "herman"): ?>
                        <li class="sidebar-item <?= $pages == 'hasilpib' ? 'active' : '' ?>">
                            <a href="<?= base_url ?>/laporan/hasilpib" class="sidebar-link">
                                <i class="bi bi-graph-up"></i>
                                <span>Laporan Hasil PIB</span>
                            </a>
                        </li>
                    <?php endif; ?>
                    -->
                </ul>

                <ul class="menu">
                    <li class="sidebar-item">
                        <a href="<?= base_url ?>/logout" class="sidebar-link">
                            <i class="bi bi-box-arrow-right"></i>
                            <span>Sign Out</span>
                        </a>
                    </li>
                </ul>

            </div>
        </div>
    </div>
</div>

<script>
document.addEventListener("DOMContentLoaded", function () {
    const sidebarWrapper = document.querySelector(".sidebar-wrapper");
    const activeItem = sidebarWrapper.querySelector(".sidebar-item.active");
    const cardElement = document.querySelector(".card"); // sesuaikan jika class-nya berbeda

    // Scroll otomatis ke posisi menu aktif
    if (activeItem) {
        const sidebarTop = sidebarWrapper.scrollTop;
        const itemTop = activeItem.offsetTop;
        const itemBottom = itemTop + activeItem.offsetHeight;
        const wrapperHeight = sidebarWrapper.clientHeight;

        // Scroll ke bawah jika item aktif di bawah viewport
        if (itemBottom > sidebarTop + wrapperHeight) {
            sidebarWrapper.scrollTo({
                top: itemTop - 60,
                behavior: "smooth"
            });
        }

        // Scroll ke atas jika item aktif di atas viewport
        if (itemTop < sidebarTop) {
            sidebarWrapper.scrollTo({
                top: itemTop - 20,
                behavior: "smooth"
            });
        }
    }

    // Sembunyikan scrollbar jika card atau menu aktif sudah tampil
    if (activeItem || cardElement) {
        sidebarWrapper.classList.add("hide-scrollbar");
    }
});
</script>

