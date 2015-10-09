<?php

header('Content-Type: application/json;charset=utf-8');
include("connect.inc.php");
error_reporting(E_ALL ^ E_NOTICE);

if(isset($_POST['id'])){
    $array = [];
    $id = $_POST['id'];
    $query = $db->query("SELECT avis.idCli, avis.idRes, avis.noteTable, avis.noteCadre, avis.noteService, avis.noteRapQual, avis.comAv, DATE_FORMAT(avis.dateAv, '%d/%m/%y') as dateAv, client.emailCli, client.loginCli, client.mdpCli FROM `avis` NATURAL JOIN `client` WHERE avis.idRes = " . $id . ";");
    while($row = $query->fetch()){
        array_push($array, $row);
    }
    echo json_encode($array, JSON_UNESCAPED_UTF-8);
}