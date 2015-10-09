<?php 

include("connect.inc.php");

$data = $db->query("SELECT libelleVil, codePosVil FROM `ville` WHERE libelleVil LIKE '".$_POST['q']."%' OR codePosVil LIKE '".$_POST['q']."%'");

while($row = $data->fetch(PDO::FETCH_ASSOC)) {
	$sortie[]=$row;
}

header('Content-Type: application/json');
echo(json_encode($sortie));


$data->closeCursor();