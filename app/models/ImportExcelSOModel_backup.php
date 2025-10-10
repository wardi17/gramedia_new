<?php
class ImportExcelSOModel extends Models
{
    private $table_sotemp = "[um_db].[dbo].gramediaso_temp";
    private $table_ms = "[bambi-bmi].[dbo].Sotransation_GMA";

    public function saveData()
    {
        $rawData = $_POST["data"];
        $post = json_decode($rawData, true);

        $IDimport = $post["idimport"];

        // Pastikan file diupload
        if (!isset($_FILES["files"]) || $_FILES["files"]["error"] !== 0) {
            return "File tidak diupload atau error!";
        }

        $tmp_file = $_FILES["files"]["tmp_name"];

        // Hapus data sementara sebelum insert baru
        $queryDelete = "DELETE FROM $this->table_sotemp";

  
        $this->db->baca_sql($queryDelete);

        // Baca file Excel
        $reader = new PHPExcel_Reader_Excel2007();
        $objPHPExcel = $reader->load($tmp_file);
        $sheet = $objPHPExcel->getActiveSheet();
        $rows = $sheet->toArray(null, true, true, true);

      $this->consol_war($rows);
        $countRow = count($rows);
        $countNumber = 0;
        foreach ($rows as $index => $row) {
           
            $countNumber++;
            // Lewati baris judul dan header
            if ($index == 1 || $index == 2) continue;
            // Lewati baris terakhir (jika kosong)
            if ($countRow == $countNumber) continue;

            // Ambil dan bersihkan data
            $number         = (int)$row["A"];
            $product_number = $row["B"];
            $all            = $row["C"];
            $store          = $row["D"];
            $item_tax       = $row["E"];
            $price          = $this->substring($row["F"]);
            $qty            = (int)$row["G"];
            $total_price    = (float)$this->substring($row["H"]);
            $payable        = (float)$this->substring($row["I"]);
            $ppn            = (float)$this->substring($row["J"]);

            // Query insert ke tabel sementara
            $query = "
                DECLARE @noid INT;

                -- Ambil noid terakhir per store & IDimport, kalau kosong mulai dari 1
                SELECT @noid = ISNULL(MAX(noid), 0) + 1
                FROM $this->table_sotemp
                WHERE IDimport = '{$IDimport}'
                AND store = '{$store}';

                INSERT INTO $this->table_sotemp
                (noid,IDimport, number, product_number, product_all, store, item_tax, price, qty, total_price, payable, ppn)
                VALUES
                (@noid,'{$IDimport}', '{$number}', '{$product_number}', '{$all}', '{$store}', '{$item_tax}',
                 '{$price}', '{$qty}', '{$total_price}', '{$payable}', '{$ppn}')
            ";

            $this->db->baca_sql($query);
        }

        // Panggil stored procedure validasi
        $query2 = "USP_ProsesValidasiUploadGMA '{$IDimport}'";
       //$this->consol_war($query2);
           $result = $this->db->baca_sql($query2);
             if (!$result) {
            throw new Exception("Query execution failed: " . odbc_errormsg($this->db));
        }
            $datas = [];

        while (odbc_fetch_row($result)) {
            $datas[] =[
                "IDimport"          => rtrim(odbc_result($result, 'IDimport')),
                "number"            => rtrim(odbc_result($result, 'number')),
                "product_number"    => (int)rtrim(odbc_result($result, 'product_number')),
                "product_all"       => rtrim(odbc_result($result, 'product_all')),
                "store"             => rtrim(odbc_result($result, 'store')), 
                "item_tax"          => rtrim(odbc_result($result, 'item_tax')),
                "price"             => number_format(rtrim(odbc_result($result, 'price')),0,'.', ','),
                "qty"               => (int) rtrim(odbc_result($result, 'qty')),
                "total_price"       => number_format(rtrim(odbc_result($result, 'total_price')),0,'.', ','),
                "payable"           => number_format(rtrim(odbc_result($result, 'payable')),0,'.', ','),
                "ppn"               =>  number_format(rtrim(odbc_result($result, 'ppn')),0,'.', ','),
                "status_toko"       => rtrim(odbc_result($result, 'status_toko')),
                "status_product"       => rtrim(odbc_result($result, 'status_product')),
                "status_partid"       => rtrim(odbc_result($result, 'status_partid')),
            ];
        }

        //$this->consol_war($datas);
        return $datas;
    }

    private function substring($value)
    {
        $trimmed = $this->test_input($value);
        return str_replace(",", "", $trimmed);
    }



    public function ProsesData(){
        $rawData = file_get_contents("php://input");
            $post = json_decode($rawData, true);
            $username = $_SESSION['login_user'];
            $idimport = $this->test_input($post["idimport"]);
            $query=" EXEC USP_ProsesImportgramediaSO '{$idimport}','{$username}'";

            //$this->consol_war($query);
        $cek = 0;
        $result = $this->db->baca_sql($query);

        if (!$result) {
            $cek++;
        }

        if ($cek === 0) {
            $status = [
                'nilai' => 1,
                'error' => 'Data Berhasil'
            ];
        } else {
            $status = [
                'nilai' => 0,
                'error' => 'Data Gagal'
            ];
        }

        return $status;
    }
}
