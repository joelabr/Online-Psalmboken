<?php
require('config.php'); //In this file you define $ADMIN_USERS

$realm = "onlinepsalmboken";

if (!isset($_SERVER['PHP_AUTH_USER'])) {
    header('WWW-Authenticate: Basic realm="My Realm"');
    header('HTTP/1.0 401 Unauthorized');
    die('No access');
} else {
  if(!isset($ADMIN_USERS[$_SERVER['PHP_AUTH_USER']]) ||
      $_SERVER['PHP_AUTH_PW'] != $ADMIN_USERS[$_SERVER['PHP_AUTH_USER']])
  {
    die("Wrong credentials!");
  }
}

?>
