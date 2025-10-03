<?php
class CsrfToken
{
 public static function generate()
{
    if (!isset($_SESSION)) session_start();

    if (function_exists('random_bytes')) {
        $token = bin2hex(random_bytes(32));
    } elseif (function_exists('openssl_random_pseudo_bytes')) {
        $token = bin2hex(openssl_random_pseudo_bytes(32));
    } else {
        // fallback tidak aman, jangan digunakan untuk sistem sensitif
        $token = bin2hex(md5(uniqid(mt_rand(), true)));
    }

    $_SESSION['csrf_token'] = $token;

    return $token;
}


    public static function verify($token)
    {
        if (!isset($_SESSION)) session_start();
        $valid = isset($_SESSION['csrf_token']) && hash_equals($_SESSION['csrf_token'], $token);
        unset($_SESSION['csrf_token']); // optional: satu kali pakai
        return $valid;
    }
}
