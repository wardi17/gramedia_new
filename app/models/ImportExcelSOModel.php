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
            return array(
                "status" => "error",
                "message" => "File tidak diupload atau error!"
            );
        }

        $tmp_file = $_FILES["files"]["tmp_name"];

        // Hapus data sementara sebelum insert baru
        $queryDelete = "DELETE FROM " . $this->table_sotemp;
        $this->db->baca_sql($queryDelete);

        // Baca file Excel
        $reader = new PHPExcel_Reader_Excel2007();
        $objPHPExcel = $reader->load($tmp_file);
        $sheet = $objPHPExcel->getActiveSheet();
        $rows = $sheet->toArray(null, true, true, true);

        $countRow = count($rows);
        $countNumber = 0;

        // ✅ Baris header aslinya di baris ke-2
            $expectedHeaders = array(
                'A' => 'NO',
                'B' => 'Product Number',
                'C' => 'ALL',
                'D' => 'Store',
                'E' => 'Item Tax',
                'F' => 'Price List Icd PPn',
                'G' => 'Disc 35%',
                'H' => 'Prie setelah Disc (icd PPn)',
                'I' => 'Retail Base Price',
                'J' => 'QTY',
                'K' => 'Total Retail Base Price',
                'L' => 'Payable',
                'M' => 'PPN %'
            );

            // Lewati baris pertama (judul)
            $headerRow = isset($rows[2]) ? $rows[2] : null; 

            if (!$headerRow) {
                return array(
                    "status" => "error",
                    "message" => "❌ File Excel tidak memiliki baris header yang valid (baris ke-2 kosong atau hilang)."
                );
            }

        // ✅ Cek kesesuaian setiap kolom header
        foreach ($expectedHeaders as $col => $expectedText) {
            $actualText = isset($headerRow[$col]) ? trim($headerRow[$col]) : '';
            if (strcasecmp($actualText, $expectedText) !== 0) {
                return array(
                    "status" => "error",
                    "message" => "❌ Format file Excel tidak sesuai di kolom {$col}. 
                                Ditemukan: '{$actualText}', seharusnya: '{$expectedText}'. 
                                Gunakan template Excel yang benar."
                );
            }
        }


        $expectedColumnCount = count($expectedHeaders);

        foreach ($rows as $index => $row) {
            $countNumber++;

            // Lewati baris header
            if ($index <= 3) continue;
            // Lewati baris terakhir kosong
            if ($countRow == $countNumber) continue;

            // ✅ Validasi jumlah kolom
            $currentColumnCount = count($row);
            if ($currentColumnCount < $expectedColumnCount) {
                return array(
                    "status" => "error",
                    "message" => "❌ Baris ke-{$countNumber} memiliki kolom kurang. 
                                Ditemukan {$currentColumnCount}, seharusnya {$expectedColumnCount}."
                );
            }

            // Ambil isi data
            $number         = trim($row["A"]);
            $product_number = trim($row["B"]);
            $all            = trim($row["C"]);
            $store          = trim($row["D"]);
            $item_tax       = trim($row["E"]);
            $price_list     = (float)$this->substring($row["F"]);
            $disc           = (float)$this->substring($row["G"]);
            $price_disc     = (float)$this->substring($row["H"]);
            $price          = $this->substring($row["I"]);
            $qty            = (int)$row["J"];
            $total_price    = (float)$this->substring($row["K"]);
            $payable        = (float)$this->substring($row["L"]);
            $ppn            = (float)$this->substring($row["M"]);

            // Cek kolom wajib
            $requiredFields = array(
                'A' => $number,
                'B' => $product_number,
                'C' => $all,
                'D' => $store,
                'J' => $qty,
                'K' => $total_price
            );

            $emptyCols = array();
            foreach ($requiredFields as $col => $val) {
                if ($val === '' || $val === null) {
                    $emptyCols[] = $col;
                }
            }

            if (!empty($emptyCols)) {
                $cols = implode(', ', $emptyCols);
                return array(
                    "status" => 'error',
                    "message" => "❌ Data kosong terdeteksi di baris ke-{$countNumber}, kolom: {$cols}. Harap lengkapi data sebelum upload."
                );
            }

            // Insert data
            $query = "
                DECLARE @noid INT;
                SELECT @noid = ISNULL(MAX(noid), 0) + 1
                FROM " . $this->table_sotemp . "
                WHERE IDimport = '{$IDimport}' AND store = '{$store}';

                INSERT INTO " . $this->table_sotemp . "
                (noid, IDimport, number, product_number, product_all, store, item_tax, price, qty, total_price, payable, ppn, price_list, disc, price_disc)
                VALUES
                (@noid, '{$IDimport}', '{$number}', '{$product_number}', '{$all}', '{$store}', '{$item_tax}',
                '{$price}', '{$qty}', '{$total_price}', '{$payable}', '{$ppn}', '{$price_list}', '{$disc}', '{$price_disc}');
            ";

            $this->db->baca_sql($query);
        }

        // Jalankan validasi SP
        $query2 = "USP_ProsesValidasiUploadGMA '{$IDimport}'";
        $result = $this->db->baca_sql($query2);
        if (!$result) {
            throw new Exception("Query execution failed: " . odbc_errormsg($this->db));
        }

        $datas = array();
        while (odbc_fetch_row($result)) {
            $datas[] = array(
                "IDimport"          => rtrim(odbc_result($result, 'IDimport')),
                "number"            => rtrim(odbc_result($result, 'number')),
                "product_number"    => (int)rtrim(odbc_result($result, 'product_number')),
                "product_all"       => rtrim(odbc_result($result, 'product_all')),
                "store"             => rtrim(odbc_result($result, 'store')),
                "item_tax"          => rtrim(odbc_result($result, 'item_tax')),
                "price"             => number_format(rtrim(odbc_result($result, 'price')), 0, '.', ','),
                "qty"               => (int) rtrim(odbc_result($result, 'qty')),
                "total_price"       => number_format(rtrim(odbc_result($result, 'total_price')), 0, '.', ','),
                "payable"           => number_format(rtrim(odbc_result($result, 'payable')), 0, '.', ','),
                "ppn"               => number_format(rtrim(odbc_result($result, 'ppn')), 0, '.', ','),
                "status_toko"       => rtrim(odbc_result($result, 'status_toko')),
                "status_product"    => rtrim(odbc_result($result, 'status_product')),
                "status_partid"     => rtrim(odbc_result($result, 'status_partid')),
                "price_list"        => number_format(rtrim(odbc_result($result, 'price_list')), 0, '.', ','),
                "disc"              => number_format(rtrim(odbc_result($result, 'disc')), 0, '.', ','),
                "price_disc"        => number_format(rtrim(odbc_result($result, 'price_disc')), 0, '.', ','),
            );
        }

        return array(
            "status" => 'berhasil',
            "message" => $datas,
        );
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
