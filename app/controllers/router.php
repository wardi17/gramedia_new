<?php

class Router
{

    public $controler = [
        "import"      => "ImportController",
        "msbarang"   => "Msbarang",
        "mslokasi" => "Mslokasi",
       
    ];



    public function seturl()
    {

        $headers = getallheaders();

        $url = $headers['url'];
        $expload = explode("/", $url);
        $require = $expload[0];
        $fungsi = $expload[1];
        $cont = $this->controler[$require];
        $this->control($cont);

        $model = new $cont;
        $object = [$model, $fungsi];

        $call = call_user_func($object);
        return $call;
    }



    private function control($control)
    {

        return require_once $control . '.php';
    }
}
