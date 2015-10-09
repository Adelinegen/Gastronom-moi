<?php

header('Content-Type: application/json;charset=utf-8');
include("connect.inc.php");
error_reporting(E_ALL ^ E_NOTICE);

if(isset($_POST['log']) && isset($_POST['pass'])){
    $log = $_POST['log'];
    $pass = $_POST['pass'];
    $array = $db->query("SELECT COUNT(idCli) as nb FROM `client` WHERE loginCli = '" . $log . "' AND mdpCli = '" . $pass . "';")->fetchAll();
    echo json_encode($array, JSON_UNESCAPED_UTF-8);
}