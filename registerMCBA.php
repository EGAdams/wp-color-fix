<?php
header('Content-Type: application/json');
require_once 'Util.php';
require_once 'DatabaseRegister.php';
function writeLog($method, $text_to_log) { Util::writeLog($method, $text_to_log); }
$pushid = $_POST['pushid'];
$email = $_POST['email'];
$mcba_id = $_POST['mcba_id'];
$action = $_POST['action'];
writeLog(" registerMCBA.php", "before calling checkPost()...");
checkPost($pushid, $email, $action); // may trigger a die()
$database = initialize_database();
writeLog("registerMCBA.php", "creating new database register object...");
$databaseRegister = new DatabaseRegister($_POST, $database);
writeLog("registerMCBA.php", "calling databaseRegister->register()...");
$databaseRegister->register();
function checkPost($pushid, $email, $action) {
	if (!isset($pushid) && !isset($email)) {
		$error = "pushid is not set, returning true from checkPost()...\n";
		writeLog("registerMCBA.php", $error);
		die(json_encode(array('error' => $error)));
	} elseif (!isset($action)) {
		$error = "action is not set, returning true from checkPost()...\n";
		writeLog("registerMCBA.php", $error);
		die(json_encode(array('error' => $error)));
	} elseif (!isset($email)) {
		$error = "email is not set, returning true from checkPost()...\n";
		writeLog("registerMCBA.php", $error);
		die(json_encode(array('error' => $error)));
	} else {
		writeLog("registerMCBA.php", "inputs look ok. returning from checkPost()...");
		return false; }}
        
// function initialize_database() {
// 	try {
// 		global $wpdb;
// 		writeLog("initialize_database()", "initializing database with , " .
// 			$wpdb->dbhost . ", " . $wpdb->dbname . ", " . $wpdb->dbuser . ", " . $wpdb->dbpassword );
// 		$db = new PDO('mysql:host=' . $wpdb->dbhost . '; dbname=' . $wpdb->dbname, $wpdb->dbuser, $wpdb->dbpassword );
// 		$db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_WARNING);
// 		writeLog("initialize_database()", "returning database object...");
// 		return $db;
// 	} catch (PDOException $e) {
//         mprint( "caught exception in registerMCBA.php" );
// 		file_put_contents('register.log', $e->getMessage() . '\r\n', FILE_APPEND | LOCK_EX);
// 		die(json_encode(array('error' => $e->getMessage()))); }}
