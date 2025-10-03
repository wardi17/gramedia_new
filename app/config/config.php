<?php
$protocol = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] != 'off') ? "https://" : "http://";

$host = $_SERVER['HTTP_HOST'];
$currentUrl = $protocol . $host;
//$currentUrl = "http://192.168.11.186";
define('base_url', $currentUrl . '/bmi/gramedia_new/public');
define('base_urllogin', $currentUrl . '/bmi/public/_login_proses/');
define('DB_HOST', 'localhost');
define('DB_USER', 'sa');
define('DB_PASS', '');
define('DB_NAME', 'um_db');
define('DB_NAME2', 'bambi-bmi');
//define('SERVER_DB', '(LOCAL)');
define('SERVER_DB', 'DESKTOP-1CEB0AJ\SQLEXPRESS');
define('SESSION_TIMEOUT', 1800);
