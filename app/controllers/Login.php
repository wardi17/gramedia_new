<?php

class Login extends Controller {
	public function index()
	{
		$data['title'] = 'Halaman Login';
	
		$this->view('login/login', $data);
	}

	public function prosesLogin() {
		if($_POST["username"] == "" && $_POST["password"] == ""){
			header('location: '. base_url . '/login');
			exit;	
		}else{
		if($this->model('LoginModel')->checkLogin($_POST) > 0 ) {
			$row = $this->model('LoginModel')->checkLogin($_POST) ;
				$_SESSION['id_user'] = $row['id_user'];
				$_SESSION['login_user'] =  $row['username'];
				$_SESSION['nama'] = $row['nama'];
				$_SESSION['session_login'] = 'sudah_login'; 
				$_SESSION['divisi'] =  $row['divisi'];
				$_SESSION['jabatan'] = $row['jabatan'];
				$_SESSION['log_menu'] = $row['log_menu'];

				if($row['username'] =="herman" OR $row['username'] =="wardi"){
					$_SESSION['level_user'] =77;
				}
				
				//if($row['username'])
				header('location: '. base_url . '/home');
		} else {
			Flasher::setMessage('Username / Password','salah.','danger');
			header('location: '. base_url . '/login');
			exit;	
		}
		}
	}
}