<?php

class MsBarangModel extends Models{
    private $table_ms = "[um_db].[dbo].master_gramed_partid";
    private $table_part = "[bambi-bmi].[dbo].partmaster";

    public function saveData()
     {
   
        $data = file_get_contents('php://input');
         $post = json_decode($data, true);

      
        // Pastikan data yang diperlukan ada
        if (empty($post["part_id_gramedia"]) || empty($post["part_id_bambi"]) || empty($post["part_name_bambi"])) {
            throw new InvalidArgumentException ("partid gramida dan part_id_bambi  harus diisi.");
        }

        // Query untuk menyimpan data barang
        $query = "USP_SimpanDataMastergramedPartid '{$post['part_id_gramedia']}', '{$post['part_id_bambi']}', '{$post['part_name_bambi']}'";
       // die(var_dump($query));
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


    public function getpartid()
    {
        $filter = isset($_POST['filter']) ? trim($_POST['filter']) : '';
        // Validasi input
        if (empty($filter)) {
            throw new InvalidArgumentException("Filter tidak boleh kosong.");
        }
        // Query untuk mendapatkan part ID berdasarkan filter
         $filterdata =$filter."%";
    //stored procedure di database bambi-bmi
      $query = "SP_Getpartid '".$filterdata."'";
       $result = $this->db->baca_sql2($query);
            $datafull =[];
            while(odbc_fetch_row($result)){
                $datafull[] =[
                    "partid"=>rtrim(odbc_result($result,'partid')),
                    "partname"=>rtrim(odbc_result($result,'partid')).' |'.rtrim(odbc_result($result,'partname')),
                ];

            }
           // $this->consol_war($datafull);
			 array_walk_recursive($datafull, function(&$value) {
				if (is_string($value)) {
					$value = mb_convert_encoding($value, 'UTF-8', 'UTF-8');
				}
			});

        return $datafull;
    }


    public function listdata(){
     
        $query ="SELECT  partid_gramedia,partid_bambi,partname_bambi FROM $this->table_ms ORDER BY partid_gramedia ASC";
               $result = $this->db->baca_sql2($query);
        $datas = [];
        while (odbc_fetch_row($result)) {
            $datas[] = [
                "partid_gramedia" => rtrim(odbc_result($result, 'partid_gramedia')),
                "partid_bambi"   => rtrim(odbc_result($result, 'partid_bambi')),
                "partname_bambi" => rtrim(odbc_result($result, 'partname_bambi')),
            ];
        }

      //  die(var_dump($datas));
        return $datas;
    }

    public function Deletedata(){
        $data = file_get_contents('php://input');
         $post = json_decode($data, true);

        $part_id_gramedia= $post["part_id_gramedia"];

        $query = "DELETE  FROM $this->table_ms WHERE partid_gramedia = '" . $part_id_gramedia . "' ";

        $cek = 0;
        $result = $this->db->baca_sql($query);
        if (!$result) {
            $cek++;
        }
        if ($cek === 0) {
            $status = [
                'nilai' => 1,
                'error' => 'Data Berhasil Di Delete'
            ];
        } else {
            $status = [
                'nilai' => 0,
                'error' => 'Data Gagal Di Delete'
            ];
        }
        return $status;
    }
}