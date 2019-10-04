<?php 

if ($_POST['url'] !== "#") {
	$url = $_POST['url'];
	$size = filesize($url) / 1024 / 1024;

	echo round($size, 3);
} else echo 0;
