<?php
require_once 'McbaUtil.php';
require_once 'MCBAWriteLog.php';
// require_once(dirname(__FILE__) . "/../../../wp-load.php");

$message 		= $_POST[ 'message'      ];
$class_method	= $_POST[ 'class_method' ];

$logger = new MCBAWriteLog();
$logger->writeLog( $class_method, $message );
?>