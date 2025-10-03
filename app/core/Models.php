<?php
require_once __DIR__ . '/../PHPExcel/PHPExcel.php';
class Models  extends PHPExcel {
	public $db;

	public function __construct()
	{
		$this->db = new Database;
	}

public function sql_escape_odbc($value) {
	 if (is_null($value)) {
        return 'NULL';
    }

    // Kalau angka, biarkan tanpa tanda kutip
    if (is_numeric($value)) {
        return $value;
    }

    // Kalau string, escape tanda kutip tunggal (') jadi dua ('')
    $escaped = str_replace("'", "''", $value);

    // Bungkus dengan tanda kutip
    return "'$escaped'";
	}

	public function consol_war($data){
		      echo "<pre>";
              print_r($data);
              echo "</pre>";
              die();
	}


    protected function test_input($data) {
		$data = trim($data);
		$data = stripslashes($data);
		$data = htmlspecialchars($data);
		return $data;
		}

	

	protected function select($file,$table){
		
		$select = "SELECT ".$file." FROM ".$table;
		return $select;

	}

	protected function orderby($file){
		return " ORDER BY ".$file;
	}
	


}