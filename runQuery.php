<?php
// header("Access-Control-Allow-Origin: *");
require_once 'MCBA_WriteLog.php';
require_once dirname( __FILE__ ) . "/monitored-object-php/monitored-object/LoggerFactory.php";

date_default_timezone_set('America/New_York');

function initialize_database() {
	global $wpdb, $logger;
	try {
        // $logger->logUpdate( "initializing database... " );
        $db = new PDO( 'mysql:host=' . $wpdb->dbhost . '; dbname=' . $wpdb->dbname, $wpdb->dbuser, $wpdb->dbpassword );
		$db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
		return $db;

	} catch (PDOException $e) {
		file_put_contents('register.log', $e->getMessage() . '\r\n', FILE_APPEND | LOCK_EX);
		// $logger->writeLog( "{php} " . __METHOD__, $e->getMessage() . "... " );
		die(json_encode(array('error' => $e->getMessage())));
	}
}

function runQuery( $database, $sql ) {
    // ini_set('display_errors', 1);
    // ini_set('display_startup_errors', 1);
    // error_reporting(E_ALL);
    $text = "creating logger... ";
    file_put_contents( dirname( __FILE__ ) . '/runQuery.log', $text, FILE_APPEND | LOCK_EX );
    $logger = LoggerFactory::getLogger( "RunQueryLogger" );
    $logger->logUpdate( "RunQueryLogger initialized. " );
    if ( strlen( $sql ) == 0 ) {
        $logger->logUpdate( "*** ERROR: the length of sql is zero. ***" );
        die( json_encode( array( 'error' => "The length of the SQL statement is zero." )));
    }
    $logger->logUpdate( "enterying try... " );
	try {
        $logger->logUpdate( "use regular expression to extract words... " );
        preg_match_all('/[a-zA-Z_]\w*/', $sql, $matches);

        $logger->logUpdate( "matches[ 0 ] will now contain all the words found in the SQL" );
        $words = $matches[ 0 ];
        $logger->logUpdate( "preparing statement with SQL: $words... " );
        
		$statement = $database->prepare($sql);
		$statement->execute();
		$result = $statement->fetchAll();
        $logger->logUpdate( "creating text from result for file logger..." );
		$text = "\nresult[ 0 ]: " . $result[ 0 ];
        file_put_contents( dirname( __FILE__ ) . '/runQuery.log', $text . "\n", FILE_APPEND | LOCK_EX );
		if ( is_array( $result )) {
            $text = "\nresult[ 0 ]: " . $result[ 0 ];
            file_put_contents( dirname( __FILE__ ) . '/runQuery.log', $text . "\n", FILE_APPEND | LOCK_EX );
			return $result[ 0 ];
		} else {
			$logger->logUpdate( "*** WARNING: not sure what result is. ***" );
		}
		if ( $result ) {
            $text = "\nresult: " . $result;
            file_put_contents( dirname( __FILE__ ) . '/runQuery.log', $text . "\n", FILE_APPEND | LOCK_EX );
			return  $result;
		} else {
			if ( strlen( $result[ 0 ]) == 0 ) {
				$message = "no results *** SOULD  NNO T SEE THIS CRAAAOO *** .";
				// $logger->logUpdate( "returning zero results from query... ");
				return $message;
			} else {
				$error_message = "*** ERROR: i dont understand result.  is it an array?" . $sql . " ***";
				// $logger->logUpdate( $error_message );
				return $error_message;
			}
		}
	} catch ( PDOException $e ) {
		// $logger->logUpdate( "*** caught PDOException! *** " );
        $text = "\n". $e->getMessage() . "\n";
        file_put_contents( dirname( __FILE__ ) . '/runQuery.log', $text . "\n", FILE_APPEND | LOCK_EX );
		$logger->logUpdate( $e->getMessage());
		return json_encode(array('error' => $e->getMessage()));
		// die(json_encode(array('error' => $e->getMessage())));
	} // </ try>
} // </ runQuery>


$logger = LoggerFactory::getLogger( "RunQueryLogger" );
$logger->logUpdate( "initializing database in runQuery... " );
$database = initialize_database();
if ( isset( $_POST[ 'sql' ])) {
	$response = runQuery($database, $_POST['sql']);
    $text = "\nresponse: " . $response;
    file_put_contents( dirname( __FILE__ ) . '/runQuery.log', $text . "\n", FILE_APPEND | LOCK_EX );
	// echo json_encode( $response );
} else if ( isset( $_GET[ 'sql' ])) {
    $response = runQuery($database, $_GET['sql']);
    // echo json_encode($response);
}    

