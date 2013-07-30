<?php
$url = array_key_exists('url', $_REQUEST) ? $_REQUEST['url'] : null;
$method = $_SERVER['REQUEST_METHOD'];

if ($url) {
    if ($method == 'GET') {       
        $opts = array('http' =>
                      array(
                            'proxy'  => 'tcp://albns00d:8080',
                            'request_fulluri' => true
                            )
                      );
        $context = stream_context_create($opts);
        $contents = file_get_contents($url, false, $context);
    } else if ($method == 'POST') {
        $opts = array('http' =>
                      array(
                            'proxy'  => 'tcp://albns00d:8080',
                            'request_fulluri' => true,
                            'method'  => 'POST',
                            'header'  => 'Content-type: application/json',
                            'content' => file_get_contents('php://input')
                            )
                      );
        $context = stream_context_create($opts);
        $contents = file_get_contents($url, false, $context);
    } else {
        header('HTTP/1.0 403 Forbidden');
        die();
    }

    foreach ($http_response_header as $header) {
        header($header);
    }

    echo $contents;
} else {
    header('HTTP/1.0 400 Bad Request');
}
