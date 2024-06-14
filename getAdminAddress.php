<?php
require_once( 'MCBAWriteLog.php' );
date_default_timezone_set( 'America/New_York' );
function mprint( $text ) { file_put_contents(dirname(__FILE__) . "/register.log", date("h:i:sa") . ": ".  $text . "\n", FILE_APPEND | LOCK_EX); }
$logger  = new MCBAWriteLog();

function initialize_database() {
	try {
        global $wpdb;
		$db = new PDO('mysql:host=' . $wpdb->dbhost . '; dbname=' . $wpdb->dbname, $wpdb->dbuser, $wpdb->dbpassword);
		$db->setAttribute( PDO::ATTR_ERRMODE, PDO::ERRMODE_WARNING );
		return $db;
	} catch ( PDOException $e ) {
		file_put_contents( 'register.log', $e->getMessage() . '\r\n', FILE_APPEND | LOCK_EX );
		die( json_encode( array( 'error' => $e->getMessage()))); }}

function getAdminRow( $database ) {
    global $logger;
    try {
        $statement = $database->prepare ( "SELECT * FROM wp_mcba_users WHERE isAdmin='1' " );
        $statement->execute() ;
        $result = $statement->fetch ();
        $statement = $database->prepare ( "SELECT mcba_id  FROM wp_mcba WHERE id='1' " );
        $statement->execute() ;
        $mcba_id_result = $statement->fetch();
        $result[ 'mcba_id' ] = $mcba_id_result[ 'mcba_id' ];
        $logger->writeLog( "{php} " . __METHOD__, "mcba_id: " . $mcba_id_result[ 'mcba_id' ] );
        return $result;
    } catch ( PDOException $e ) {
        $logger->writeLog(__METHOD__, $e->getMessage());
        die  ( json_encode ( array( 'error' => $e->getMessage()))); } /* </ try> */ }

$logger->writeLog( "getAdminAddress.php", "initializing database $wpdb->dbname..." );
$database = initialize_database();
$response = getAdminRow( $database );
echo json_encode( $response );
?>
