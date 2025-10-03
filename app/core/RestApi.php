<?php

class RestApi{


	public function __construct(){
			die("construk appi");
	}
	public function model($model)
	{
		require_once '../app/models/' . $model . '.php';
		return new $model;
	}
}