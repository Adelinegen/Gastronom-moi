<?php

include("connect.inc.php");

header("Content-Type: application/json");

$query = mysqli_query($db, "SELECT libelleVil as label FROM ville WHERE libelleVil LIKE '%".$_GET["term"]."%' OR codePosVil LIKE '%".$_GET["term"]."%'");

$result = array();

if($query) {
	while($row = mysqli_fetch_assoc($query)) {
		$result[] = $row;
	}
}

echo json_encode($result);