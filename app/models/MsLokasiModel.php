<?php

class MsLokasiModel extends Models{
    private $table_ms = "[um_db].dbo.master_gramed_lokasi";
    private $table_cust = "[bambi-bmi].[dbo].customer";

    public function saveData()
     {
   
        $data = file_get_contents('php://input');
         $post = json_decode($data, true);

     
        // Pastikan data yang diperlukan ada
        if (empty($post["id_toko"]) || empty($post["customerid"]) || empty($post["namatoko"])|| empty($post["alamat"])) {
            throw new InvalidArgumentException ("partid gramida dan customerid  harus diisi.");
        }

        // Query untuk menyimpan data barang
        $query = "USP_SimpanDataMastergramedLokasi '{$post['id_toko']}', '{$post['customerid']}', '{$post['namatoko']}', '{$post['alamat']}'";
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


    public function getcutomer()
    {
     
      $query = "SELECT CustomerID,CustName FROM $this->table_cust WHERE custstatus=1 and div_new='MM' ";
       $result = $this->db->baca_sql2($query);
            $datafull =[];
            while(odbc_fetch_row($result)){
                $datafull[] =[
                    "id"=>rtrim(odbc_result($result,'CustomerID')),
                    "name"=>rtrim(odbc_result($result,'CustomerID')).' |'.rtrim(odbc_result($result,'CustName')),
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

    public function getalamat(){
         $data = file_get_contents('php://input');
         $CustomerID = json_decode($data, true);
        $query = "SELECT CustAddress FROM $this->table_cust WHERE CustomerID='{$CustomerID}' ";

        $sql =$this->db->baca_sql($query);
		$alamat=odbc_result($sql,"CustAddress");

        return $alamat;
    }


    public function listdata(){
     
        $query ="SELECT  id_toko,customer_id,nama_toko,alamat FROM $this->table_ms ORDER BY id_toko ASC";
               $result = $this->db->baca_sql2($query);
        $datas = [];
        while (odbc_fetch_row($result)) {
            $datas[] = [
                "id_toko" => rtrim(odbc_result($result, 'id_toko')),
                "customer_id"   => rtrim(odbc_result($result, 'customer_id')),
                "nama_toko" => rtrim(odbc_result($result, 'nama_toko')),
                "alamat" => rtrim(odbc_result($result, 'alamat')),
            ];
        }

       // die(var_dump($datas));
        return $datas;
    }

    public function Deletedata(){
        $data = file_get_contents('php://input');
         $post = json_decode($data, true);

        $id_toko= $post["id_toko"];

        $query = "DELETE  FROM $this->table_ms WHERE id_toko = '" . $id_toko . "' ";

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