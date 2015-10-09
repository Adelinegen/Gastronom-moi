<?php

header('Content-Type: application/json;charset=utf-8');
include("connect.inc.php");

$NbEtoile = $_POST["etoile"];
$NomVil = $_POST["nom"];

if($NbEtoile == 4) {
	$req = $db->query("SELECT idRes, nomRes, etoileRes, photoRes FROM `restaurant` NATURAL JOIN `ville` WHERE libelleVil = '$NomVil' OR codePosVil = '$NomVil'");
}
else {
	$req = $db->query("SELECT idRes, nomRes, etoileRes, photoRes FROM `restaurant` NATURAL JOIN `ville` WHERE etoileRes = $NbEtoile AND libelleVil = '$NomVil' OR codePosVil = '$NomVil'");
}

echo json_encode($req->fetchAll(PDO::FETCH_ASSOC));