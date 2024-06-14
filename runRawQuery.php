<?php
// header("Access-Control-Allow-Origin: *"); 
// require_once dirname( __FILE__ ) . "/MCBAWriteLog.php";

// date_default_timezone_set( 'America/New_York' );
// $logger = new MCBAWriteLog();

// function runQuery( $database, $sql ) {
// 	global $logger;
// 	try {
// 		$statement = $database->prepare( $sql );
// 		$statement->execute();
// 		$result = $statement->fetchAll();
// 		if ( is_array( $result )) {
//             $database = null;
// 			return $result;
// 		} else { $logger->writeLog("{php} " . __METHOD__, "*** WARNING: not sure what result is. ***"); }

// 		if ( $result ) {
// 			return $result;
// 		} else {
// 			if ( strlen( $result[0]) == 0 ) {
// 				$message = "no results *** We Should never see this text.  Something is very wrong... *** .";
// 				$logger->writeLog("{php} " . __METHOD__, "returning zero results from query... ");
//                 $database = null;
// 				return $message;
// 			} else {
// 				$error_message = "*** ERROR: i don't understand result.  is it an array?" . $sql . " ***";
//                 $database->close();
//                 $statement->close();
// 				return $error_message; }}
// 	} catch ( PDOException $e ) {
// 		$error_message = $e->getMessage();
// 		if ( !str_contains( $error_message, "General error" )) {
// 			die( json_encode( array( 'error' => $error_message )));	}} // </ try>
// } // </ runRawQuery>
