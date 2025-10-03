<?php

class Database
{
	private $host = DB_HOST;
	private $user = DB_USER;
	private $pass = DB_PASS;
	private $dbnm = DB_NAME;
	private $dbnm2 = DB_NAME2;
	private $dbh;
	private $dbh2;
	private $stmt;
	private $server = SERVER_DB;

	public function __construct()
	{

		$dsn = 'Driver={SQL Server};Driver={SQL Server};Server=' . $this->server . ';Database=' . $this->dbnm;
		$dsn2 = 'Driver={SQL Server};Driver={SQL Server};Server=' . $this->server . ';Database=' . $this->dbnm2;



		try {
			$this->dbh = odbc_connect($dsn, $this->user, $this->pass);
			$this->dbh2 = odbc_connect($dsn2, $this->user, $this->pass);
		} catch (PDOException $e) {
			die($e->getMessage());
		}
	}


	public function query($query)
	{

		$this->stmt = odbc_exec($this->dbh, $query);
	}

	public function bind($param, $value, $type = null)
	{
		if (is_null($type)) {
			switch (true) {
				case is_int($value):
					$type = PDO::PARAM_INT;
					break;
				case is_bool($value):
					$type = PDO::PARAM_BOOL;
					break;
				case is_null($value):
					$type = PDO::PARAM_NULL;
					break;
				default:
					$type = PDO::PARAM_STR;
			}
		}

		$this->stmt->bindValue($param, $value, $type);
	}

	public function execute()
	{

		$this->stmt->execute();
	}

	public function resultSet()
	{

		$this->execute();
		return $this->stmt->fetchAll(PDO::FETCH_ASSOC);
	}

	public function single()
	{

		$this->execute();
		return $this->stmt->fetch(PDO::FETCH_ASSOC);
	}

	public function rowCount()
	{
		return $this->stmt->rowCount();
	}


	public function baca_sql($sql)
	{

		$db = $this->dbh;
		$result = odbc_exec($db,$sql);
		return $result;
	}

	public function baca_sql2($sql)
	{

		$db = $this->dbh2;
		$result = odbc_exec($db, $sql);
		return $result;
	}


	// public function baca_sql3($sql){

	// 	$db3 =$this->dbh3;
	// 	$result = odbc_exec($db3,$sql);
	// 	return $result;

	// }

	public function getconnt($cabang)
	{



		$dsn = 'Driver={SQL Server};Driver={SQL Server};Server=(LOCAL);Database=' . $this->dbnm;

		try {
			$this->dbh = odbc_connect($dsn, $this->user, $this->pass);
		} catch (PDOException $e) {
			die($e->getMessage());
		}
	}

	public function getconntbambins()
	{

		$this->dbnm = "bambi-ns";



		$dsn = 'Driver={SQL Server};Driver={SQL Server};Server=(LOCAL);Database=' . $this->dbnm;


		try {
			$this->dbh = odbc_connect($dsn, $this->user, $this->pass);
		} catch (PDOException $e) {
			die($e->getMessage());
		}
	}


	public function commit()
	{
		odbc_commit($this->dbh);
	}
}
