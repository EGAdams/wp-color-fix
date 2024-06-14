<?php
header("Access-Control-Allow-Origin: *");
require_once('MCBAWriteLog.php');

date_default_timezone_set('America/New_York');
function mprint( $text ) {
    file_put_contents(dirname(__FILE__) . "/register.log", date("h:i:sa") . ": " .  $text . "\n", FILE_APPEND | LOCK_EX); }

$logger  = new MCBAWriteLog();

function initialize_database() {
    global $logger, $wpdb;
    try {
        $db = new PDO( 'mysql:host=' . $wpdb->dbhost . '; dbname=' . $wpdb->dbname, $wpdb->dbuser, $wpdb->dbpassword );
        $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        return $db;
    } catch (PDOException $e) {
        file_put_contents('register.log', $e->getMessage() . '\r\n', FILE_APPEND | LOCK_EX);
        $logger->writeLog("{php} " . __METHOD__, $e->getMessage() . "... ");
        die(json_encode(array('error' => $e->getMessage()))); }}

function runQuery( $database, $sql ) {
    global $logger;

    if ($sql != "select * from wp_mcba_chat_messages, wp_mcba_users where wp_mcba_chat_messages.sender_id = wp_mcba_users.ID or wp_mcba_chat_messages.sender_id = wp_mcba_users.email") {
        // $logger->writeLog( __METHOD__, "executing sql: " . $sql );
    }
    try {
        $statement = $database->prepare($sql);
        $statement->execute();
        $result = $statement->fetchAll();
        if (is_array($result)) {
            return $result;
        } else { $logger->writeLog( "{php} " . __METHOD__, "*** WARNING: not sure what result is. ***" ); }
        $logger->writeLog(__METHOD__, "result: " . json_encode($result) . " raw: " . $result);
        if ($result) {
            return $result;
        } else {
            if (strlen($result[0]) == 0) {
                $message = "*** ERROR: no results.  This SHOULD NEVER HAPPEN *** .";
                $logger->writeLog("{php} " . __METHOD__, "returning zero results from query... ");
                return $message;
            } else {
                $error_message = "*** ERROR: i do not understand result.  is it an array?" . $sql . " ***";
                $logger->writeLog(__METHOD__, $error_message);
                return $error_message;
            }
        }
    } catch (PDOException $e) {
        $logger->writeLog(__METHOD__, "*** caught PDOException! *** ");
        $logger->writeLog(__METHOD__, $e->getMessage());
        die(json_encode(array('error' => $e->getMessage())));
    } // </ try>
} // </ runQuery>

$database = initialize_database();
$command_name = $_GET['command_name'];
$pin_name = $_GET['pin_name'];
$pin_data = $_GET['pin_data'];
if (strlen($_POST['command_id']) != 0) {
    $logger->writeLog(__METHOD__, "POST: command_id: " . $_POST['command_id']);
    $response = runQuery($database, "select command_args from wp_commands where command_name='" . $_POST['command_name'] . "'");
} else {
    if (strlen($pin_name) != 0) {
        $sql = "update wp_commands set pin_data = '" . $pin_data . "' where pin_name = '" . $pin_name . "'";
        $logger->writeLog(__METHOD__, "sql: " . $sql);
        $response = runQuery($database, $sql);
        $response[0]['command_name'] = "";  // dummy return value
        $response[0]['command_args'] = "";  // dummy return value
    } else {
        $logger->writeLog(__METHOD__, "GET: command_id: " . $_GET['command_id'] . " command_name: " . $_GET['command_name']);
        $response = runQuery($database, "select command_args from wp_commands where command_name='" . $_GET['command_name'] . "'");
    }
}
echo $response[0]['command_name'] . " " . $response[0]['command_args'];
