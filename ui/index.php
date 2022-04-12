<?php

require './page/top.php' ;

$url = '';
if(isset($_GET['url'])) {
    $url = explode('/', $_GET['url']);
}

if($url == '') {
    top('home', null);
    require './page/home.html';
} elseif($url[0] == 'info') {
    top('info', null);
    require './page/info.php';
} elseif($url[0] == 'map') {
    top('map', null);
    require './page/map.html';
} else {
    require './page/error.html';
}

require './page/bottom.html' ;

?>