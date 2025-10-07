<?php

class Mslokasi extends Controller
{
    private $userid;
    private $model;

    public function __construct()
    {
        if($_SESSION['login_user'] == '') {
			Flasher::setMessage('Login','Tidak ditemukan.','danger');
			header('location: '. base_urllogin);
			exit;
		}else{
			$this->userid = $_SESSION['login_user'];
             $this->model = $this->model('MsLokasiModel');
		}
       
    }


    	public function index()
		{
			$data["page"] ="mslokasi";
			$data["userid"] =$this->userid;
			$this->view('templates/header');
			$this->view('templates/navbar', $data);
			$this->view('mslokasi/index',$data);
			$this->view('templates/footer');
		}

    public function getcutomer(){
            try {
        // Retrieve data from the model
            $data = $this->model->getcutomer(); // Assuming this method exists in your model
            // Check if data is empty
            if (empty($data)) {
                $this->sendJsonResponse([], 200); // Return an empty array if no data found
                return;
            }

        // Send the data as a JSON response
        $this->sendJsonResponse($data, 200);
        } catch (Throwable $e) {
            error_log('Error in InventarisController::listdata: ' . $e->getMessage());
            $this->sendErrorResponse('Internal server error', 500);
        }
    }


    public function getalamat(){
        try {
        // Retrieve data from the model
            $data = $this->model->getalamat(); // Assuming this method exists in your model
            // Check if data is empty
            if (empty($data)) {
                $this->sendJsonResponse([], 200); // Return an empty array if no data found
                return;
            }

        // Send the data as a JSON response
        $this->sendJsonResponse($data, 200);
        } catch (Throwable $e) {
            error_log('Error in InventarisController::alamat: ' . $e->getMessage());
            $this->sendErrorResponse('Internal server error', 500);
        }
    }



    public function Simpandata(){
            try {
        // Retrieve data from the model
            $data = $this->model->saveData(); // Assuming this method exists in your model
            // Check if data is empty
            if (empty($data)) {
                $this->sendJsonResponse([], 200); // Return an empty array if no data found
                return;
            }

        // Send the data as a JSON response
        $this->sendJsonResponse($data, 200);
        } catch (Throwable $e) {
            error_log('Error in InventarisController::listdata: ' . $e->getMessage());
            $this->sendErrorResponse('Internal server error', 500);
        }
    }



      public function listdata(){
            try {
        // Retrieve data from the model
            $data = $this->model->listdata(); // Assuming this method exists in your model
            // Check if data is empty
            if (empty($data)) {
                $this->sendJsonResponse([], 200); // Return an empty array if no data found
                return;
            }

        // Send the data as a JSON response
        $this->sendJsonResponse($data, 200);
        } catch (Throwable $e) {
            error_log('Error in InventarisController::listdata: ' . $e->getMessage());
            $this->sendErrorResponse('Internal server error', 500);
        }
    }



    public function Deletedata(){
            try {
        // Retrieve data from the model
            $data = $this->model->Deletedata(); // Assuming this method exists in your model
            // Check if data is empty
            if (empty($data)) {
                $this->sendJsonResponse([], 200); // Return an empty array if no data found
                return;
            }

        // Send the data as a JSON response
        $this->sendJsonResponse($data, 200);
        } catch (Throwable $e) {
            error_log('Error in InventarisController::listdata: ' . $e->getMessage());
            $this->sendErrorResponse('Internal server error', 500);
        }
    }
}