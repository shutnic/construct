<?php
	$dir = "images/logo";
	$dh  = opendir($dir);
	$str = '';
	while (false !== ($filename = readdir($dh))) {
	    if($filename != '.' && $filename != '..'){
	  	  $str =  $str.$dir.'/'.$filename.',';
		}
	}
	echo $str;
?>	