<?php
require_once( 'MCBAWriteLog.php' );
$logger = new MCBAWriteLog();
const EMAIL_HANDLER = "emailHandler.php";

function verifySecretCode( $secret_code ) {
    global $logger;
    $logger->writeLog( EMAIL_HANDLER, "verifying secret code: " . $secret_code . "..." );
    die( "secret code " . $secret_code . " verified." );
}

if( isset( $_GET[ 'security_token' ])) {
    $secret_code = $_GET[ 'security_token' ];
    $logger->writeLog( EMAIL_HANDLER, "secret code: " . $secret_code . " sent to email handler." );
    verifySecretCode( $secret_code );
} else {
    $message = "no information sent.  exiting process... ";
    $logger->writeLog( EMAIL_HANDLER, $message );
    die( $message );
}
?>
