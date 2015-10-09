<?php

header('Content-Type: application/json;charset=utf-8');
include("connect.inc.php");
error_reporting(E_ALL ^ E_NOTICE);

if(isset($_POST['id'])){
    $id = $_POST['id'];
    $array = $db->query("SELECT * FROM restaurant NATURAL JOIN ville WHERE idRes = '" . $id . "';")->fetchAll();
    echo json_encode($array, JSON_UNESCAPED_UTF-8);
}