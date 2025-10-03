<?php

class LoginModel {
	
	private $table = 'a_user';
	private $db;
	private $db2;
	public function __construct()
	{
		$this->db = new Database;
	}

	public function checkLogin($data)
	{
		
		$username =  addslashes($data["username"]);
		$pass = addslashes($data["password"]);
		$query = "SELECT * FROM $this->table WHERE email ='".$username."' AND pass ='".$pass."'";
	

		$sql =$this->db->baca_sql($query);
		$pass2=odbc_result($sql,"pass");
		$email=odbc_result($sql,"email");
		$nama=odbc_result($sql,"nama");
		$divisi=odbc_result($sql,"divisi_budget");
		$jabatan=odbc_result($sql,"jabatan_budget");
		$id_user=odbc_result($sql,"id_user");
		$log_menu=odbc_result($sql,"log_menu");
	
		$datas =[];
		if($pass2 == $pass && $email == $username){
			$datas[] =[
				'nama' =>$nama,
				'username' =>$email,
				'id_user' =>$id_user,
				'divisi' =>$divisi,
				'jabatan' =>$jabatan,
				'log_menu'=>$log_menu
			];
		}
	

		if (empty($datas))
		{
			$userdata = null;
		}
		else
		{
			$userdata = $datas[0];
		} 
	
		return $userdata;
	}
	
	
	public function getDataDivisi(){
		$query ="SELECT DISTINCT divisi_budget FROM  $this->table WHERE divisi_budget <>'NULL'";
		$result =$this->db2->baca_sql2($query);
			
			$data =[];
			while(odbc_fetch_row($result)){
				$data[] = array(
					"divisi_budget"=>rtrim(odbc_result($result,'divisi_budget')),

				);
				
				}
				
		return $data;
	}

}