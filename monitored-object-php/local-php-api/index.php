<?php
header( "Access-Control-Allow-Origin: *" );
require_once __DIR__ . "/inc/bootstrap.php";
require_once PROJECT_ROOT_PATH . "/Controller/Api/ObjectController.php";

$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$uri = explode( '/', $uri );
$controller = new ObjectController( "monitored_objects" );

if ( $controller->is_localhost()) {
    if ((isset($uri[ 2 ]) && $uri[ 2 ] != 'object') || !isset($uri[ 3 ])) {
        header("HTTP/1.1 404 Not Found");
        exit(); }
} else {
    if ((isset($uri[ 7 ]) && $uri[ 7 ] != 'object' && $uri[ 8 ] != 'insert' ) &&  ($uri[ 8 ] != 'select' )) {
        echo "error <br>";
        header("HTTP/1.1 404 Not Found");
        exit();
    }
}

// echo "<meta http-equiv=\"refresh\" content=\"1\" />";
// echo "creating new controller... <br>";
// echo "controller created.<br>";
if ( $controller->is_localhost()) {
    $methodName = $uri[ 3 ] . 'Action';  // ie $controller->select_action();
} else {
    $methodName = $uri[ 5 ] . 'Action';  // ie $controller->select_action();
}
//echo "calling $methodName ... <br>";
echo " ";
$controller->{ $methodName }();      // send data output from methodName();
?>
