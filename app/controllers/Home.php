<?php

class Home extends Controller{

	private $userid;
	public function __construct()
	{	
		
		if($_SESSION['login_user'] == '') {
			Flasher::setMessage('Login','Tidak ditemukan.','danger');
			header('location: '. base_urllogin);
			exit;
		}else{
			$this->userid = $_SESSION['login_user'];
		}
	} 

	public function index()
		{
		
			$data["page"] ="home";
			$data["userid"] =$this->userid;
			$this->view('templates/header');
			$this->view('templates/navbar', $data);
			$this->view('home/index',$data);
			$this->view('templates/footer');
		}


	


 
}