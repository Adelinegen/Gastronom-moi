<?php 

	$host = "localhost";
	$nombd = "bddresto";
	$user = "********";
	$mdp = "********";

	$db = new PDO("mysql:host=$host;dbname=$nombd",$user, $mdp, array(1002 => 'SET NAMES utf8'));
	$db->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
