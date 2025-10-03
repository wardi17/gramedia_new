<?php

class Flasher{

    public static function setMessage($pesan, $aksi, $type)
    {

        $_SESSION['msg'] = [
            'pesan' => $pesan,
            'aksi'  => $aksi,
            'type'  => $type
        ];   
    }

    public static function Message(){
    if($_SESSION['msg'] !== null)
    {
        $cek = $_SESSION['msg'];
     
        $cek_aksi = $cek['aksi'];
        if($cek_aksi !=="Tidak ditemukan."){
            if(isset($_SESSION['msg']) )
            {
                echo '<div class="alert alert-'. $_SESSION['msg']['type'] .' alert-dismissible fade show" role="alert">
                        Data <strong>'. $_SESSION['msg']['pesan'] .'</strong> '. $_SESSION['msg']['aksi'] .'
                        <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                        </button>
                    </div>';
                unset($_SESSION['msg']);
            }
         }
    }
     
    }
}