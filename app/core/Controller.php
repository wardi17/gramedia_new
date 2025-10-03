<?php

class Controller{
	public function view($view, $data = [])
	{
		require_once '../app/views/' . $view . '.php';
	}

	public function model($model)
	{

		require_once '../app/models/' . $model . '.php';
		return new $model;
	}

    public function consol_war($data){
			echo "<pre>";
			print_r($data);
			echo "</pre>";
			die();
	}



        protected function sendJsonResponse($data, $statusCode = 200)
        {
            // PHP 5.6 tidak punya http_response_code(), kita atur manual jika perlu
            if (!function_exists('http_response_code')) {
                header('X-PHP-Response-Code: ' . $statusCode, true, $statusCode);
            } else {
                http_response_code($statusCode);
            }

            header('Content-Type: application/json');

            // Siapkan variabel error jika ada
            $error = null;
            if ($statusCode >= 400) {
                $error = isset($data['error']) ? $data['error'] : 'Unknown error';
                $data = null; // Kosongkan data jika gagal
            }

            echo json_encode(array(
                'success'   => $statusCode < 400,
                'data'      => $data,
                'error'     => $error,
                'code'      => $statusCode,
                'timestamp' => time()
            ));
        }


    protected function sendErrorResponse($message, $statusCode)
    {
        $this->sendJsonResponse([
            'error' => $message
        ], $statusCode);
    }

 protected function validateRequest()
    {
        // Pastikan metode adalah POST
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            throw new InvalidArgumentException('Invalid request method');
        }

        // Pastikan Content-Type adalah application/json
        // $contentType = isset($_SERVER['CONTENT_TYPE']) ? $_SERVER['CONTENT_TYPE'] : '';
        // if (strpos($contentType, 'application/json') === false) {
        //     throw new InvalidArgumentException('Content-Type must be application/json');
        // }
    }

}