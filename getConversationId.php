<?php
require_once( 'MCBAWriteLog.php' );
$id_passed_in = $_POST[ 'conversation_id' ];

date_default_timezone_set( 'America/New_York' );
function mprint( $text ) { file_put_contents(dirname(__FILE__) . "/register.log", date("h:i:sa") . ": ".  $text . "\n", FILE_APPEND | LOCK_EX); }
$logger  = new MCBAWriteLog();

function initialize_database() {
	try {
        global $wpdb;
		$db = new PDO( 'mysql:host=' . $wpdb->dbhost . '; dbname=' . $wpdb->dbname, $wpdb->dbuser, $wpdb->dbpassword );
		$db->setAttribute( PDO::ATTR_ERRMODE, PDO::ERRMODE_WARNING );
		return $db;
	} catch ( PDOException $e ) {
		file_put_contents( 'register.log', $e->getMessage() . '\r\n', FILE_APPEND | LOCK_EX );
		die( json_encode( array( 'error' => $e->getMessage()))); }}

function getConversationRow( $database ) {
    global $logger;
    global $id_passed_in;
    
    $sql = "SELECT * FROM wp_mcba_chat_conversations WHERE mcba_chat_system_id='" . $id_passed_in . "'";
    $logger->writeLog( __METHOD__, "executing sql: $sql from inside getConversationRow of getConversationId.php... " );

    try {
        $statement = $database->prepare ( $sql );
        $statement->execute() ;
        $result = $statement->fetch();
        $logger->writeLog( __METHOD__, "result: " . json_encode( $result ) . " raw: " . $result );
        if ( $result ) {
            return $result;
        } else {
            $logger->writeLog( __METHOD__, "no result!" );

                // create new record for this ip

           $values = "'" . $id_passed_in . "', '" .
           'expert@'      . "', '" .
           '0'            . "', '" .
           '0'            . "', '" .
           $id_passed_in . "')";
           $logger->writeLog( __METHOD__, "values: " . $values );
           $sql =
           "insert into wp_mcba_chat_conversations (user, admin, admin_unread_messages, user_unread_messages, mcba_chat_system_id) values (" . $values;

           $logger->writeLog( __METHOD__, "creating new record for ip: ". $id_passed_in . "..." );
           // try {

            $statement = $database->prepare ( $sql );
            $logger->writeLog( __METHOD__, "executing sql: $sql from inside getConversationRow... " );
            $statement->execute() ;
            $result = $statement->fetch();
            $logger->writeLog( __METHOD__, "result: " . json_encode( $result ) . " raw: " . $result );
            if ( $result ) {
                return $result;
            } else {
                $error_message = "*** ERROR: failed to create row! ***";
                $logger->writeLog( __METHOD__, $error_message );
                return $error_message;
            }
        }
    } catch ( PDOException $e ) {
        $logger->writeLog(__METHOD__, $e->getMessage());
        die  ( json_encode ( array( 'error' => $e->getMessage())));
    } // </ try>
}

$logger->writeLog( "getConversationId.php", "initializing database with $wpdb->dbname..." );
$database = initialize_database();
$response = getConversationRow( $database );
echo json_encode( $response );
?>
