<?php
header("Access-Control-Allow-Origin: *");
require_once('MCBA_WriteLog.php');

date_default_timezone_set('America/New_York');
//function mprint( $text ) { file_put_contents(dirname(__FILE__) . "/register.log", date("h:i:sa") . ": ".  $text . "\n", FILE_APPEND | LOCK_EX); }
$logger  = new MCBA_WriteLog();

function initialize_database()
{
    global $logger;
    try {
        $db = new PDO('mysql:host=' . 'localhost' . '; dbname=' . 'awmstag2_car', 'awmstag2_car', '.&#CL=}2W$EO');
        $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        return $db;
    } catch (PDOException $e) {
        file_put_contents('register.log', $e->getMessage() . '\r\n', FILE_APPEND | LOCK_EX);
        $logger->writeLog("{ php } " . __METHOD__, $e->getMessage() . "... ");
        die(json_encode(array('error' => $e->getMessage())));
    }
}

function runQuery($database, $sql)
{
    global $logger;
    try {
        $statement = $database->prepare($sql);
        $statement->execute();
        $result = $statement->fetchAll();
        if (is_array($result)) {
            return $result;
        } else {
            $logger->writeLog("{php} " . __METHOD__, "*** WARNING: not sure what result is. ***");
        }

        if ($result) {
            return $result;
        } else {

            if ( strlen( $result[ 0 ]) == 0 ) {
                $message = "no results *** We Should never see this text.  Something is very wrong... *** .";
                $logger->writeLog( "{php} " . __METHOD__, "returning zero results from query... " );
                return $message;
            } else {
                $error_message = "*** ERROR: i don't understand result.  is it an array?" . $sql . " ***";
                $logger->writeLog( __METHOD__, $error_message );
                return $error_message;
            }
        }
    } catch ( PDOException $e ) {
        $error_message = $e->getMessage();
        if ( strpos( $error_message, "General Error" ) !== false ) {
            $logger->writeLog( __METHOD__, "*** caught PDOException! *** " );
            $logger->writeLog( __METHOD__, $error_message );
            die( json_encode( array( 'error' => $error_message )));
        }
    } // </ try>
} // </ runQuery>

$database = initialize_database();
if (strlen($_POST['sql']) != 0) {
    $logger->writeLog(__METHOD__, "calling runQuery() with _POST... ");
    $response = runQuery($database, $_POST['sql']);
    $logger->writeLog(__METHOD__, "*** echoing response: $response ***");
    echo json_encode($response);
} else if (strlen($_GET['sql']) != 0) {
    $logger->writeLog(__METHOD__, "calling runQuery() with _GET... ");
    $response = runQuery($database, $_GET['sql']);
    $logger->writeLog(__METHOD__, "*** echoing response: $response ***");
    echo json_encode($response);
} else {
    $response = "no sql";
    $logger->writeLog(__METHOD__, "there is no sql.  not echoing anything. ");
}
