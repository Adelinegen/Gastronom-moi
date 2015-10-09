<?php

include("connect.inc.php");

$noteT = $_POST['noteT'];
$noteC = $_POST['noteC'];
$noteS = $_POST['noteS'];
$noteQ = $_POST['noteQ'];

if(isset($_POST['comm'])){
    $comm = $_POST['comm'];
}
else{
    $comm = "";
}

$id = $_POST['id'];
$log = $_POST['log'];

$idCli = $db->query("SELECT idCli FROM `client` WHERE loginCli = '" . $log . "';")->fetch()['idCli'];

$query = $db->prepare("INSERT INTO avis VALUES(:idCli, :idRes, :noteTable, :noteService, :noteCadre, :noteRapQual, :comAv, CURDATE());");
$query->bindParam(":idCli", $idCli);
$query->bindParam(":idRes", $id);
$query->bindParam(":noteTable", $noteT);
$query->bindParam(":noteService", $noteS);
$query->bindParam(":noteCadre", $noteC);
$query->bindParam(":noteRapQual", $noteQ);
$query->bindParam(":comAv", $comm);
$query->execute();