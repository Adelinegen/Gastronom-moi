<?php

header('Content-Type: application/json;charset=utf-8');
include("connect.inc.php");
error_reporting(E_ALL ^ E_NOTICE);

if(isset($_POST['newlogin']) && isset($_POST['newmail']) && isset($_POST['newmdp'])){
    $newlogin = $_POST['newlogin'];
    $newmail = $_POST['newmail'];
    $newmdp = $_POST['newmdp'];

    $cli = $db->query("SELECT COUNT(loginCli) as nb FROM `client` WHERE loginCli = '" . $newlogin . "';")->fetchAll();
    if($cli == 0){
        $query = $db->query("INSERT INTO `client` (emailCli, loginCli, mdpCli) VALUES('".$newmail."', '".$newlogin."', '".$newmdp."');");
    }   
    
    echo json_encode($cli, JSON_UNESCAPED_UTF-8);
}