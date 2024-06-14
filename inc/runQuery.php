<?php
require_once('MCBA_WriteLog.php');

date_default_timezone_set('America/New_York');
function mprint($text)
{
    file_put_contents(dirname(__FILE__) . "/register.log", date("h:i:sa") . ": " .  $text . "\n", FILE_APPEND | LOCK_EX);
}
$logger  = new MCBA_WriteLog();

function initialize_database()
{
    global $logger;
    try {
        $db = new PDO('mysql:host=' . 'floridascarwash.com' . '; dbname=' . 'awmstag2_car', 'awmstag2_car', '.&#CL=}2W$EO');
        $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_WARNING);
        return $db;
    } catch (PDOException $e) {
        file_put_contents('register.log', $e->getMessage() . '\r\n', FILE_APPEND | LOCK_EX);
        $logger->writeLog("{php} " . __METHOD__, $e->getMessage() . "... ");
        die(json_encode(array('error' => $e->getMessage())));
    }
}

function runQuery($database, $sql)
{
    global $logger;

    // $logger->writeLog( __METHOD__, "executing sql: " . $sql );
    try {
        $statement = $database->prepare($sql);
        $statement->execute();
        $result = $statement->fetchAll();
        // echo "*****************\n";
        // echo "start program.\n";
        // echo "*****************\n";


        if (is_array($result)) {
            // echo "result is an array type. \n";
            // echo "array length: " . count( $result ) . ". \n";
            // var_dump( $result ); // use this sooner next time!!!!!!!
            return $result;
        } else {
            $logger->writeLog("{php} " . __METHOD__, "*** WARNING: not sure what result is. ***");
            // echo "not sure what result is yet.  here's a clue:\n";
        }

        $logger->writeLog(__METHOD__, "result: " . json_encode($result) . " raw: " . $result);
        if ($result) {
            return $result;
        } else {

            if (strlen($result[0]) == 0) {
                $message = "no results *** Something is wrong.  We should never see this text. *** .";
                $logger->writeLog("{php} " . __METHOD__, "returning zero results from query... ");
                return $message;
            } else {
                $error_message = "*** ERROR: i don't understand result.  is it an array?" . $sql . " ***";
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

// FOR TEST:  TODO: REMOVE ME
//$_POST[ 'sql' ] = "select * from wp_mcba_users where uid='97.76.130.182'"; // PLEASE REMEMBER THIS!
// REMOVE ABOVE AFTER TESTS

// $logger->writeLog( "{php} runQuery.php", "initializing database..." );
$database = initialize_database();
$response = runQuery($database, $_POST['sql']);
echo json_encode($response);
