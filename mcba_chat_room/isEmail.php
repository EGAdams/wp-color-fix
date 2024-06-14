<?php
include_once( 'config.php'          );
require_once( 'MCBAWriteLog.php'   );
require_once( 'McbaChatMessage.php' );
date_default_timezone_set( 'America/New_York' );
function mprint( $text ) {
    file_put_contents(dirname(__FILE__) . "/register.log", date("h:i:sa") . ": ".  $text . "\n", FILE_APPEND | LOCK_EX);
}

if ( !class_exists( 'McbaUtil' )) {
	class McbaUtil {
		static $DEBUG = FALSE;
		public function __construct() {}
		public static function writeLog( $method, $text_to_log ) {
			date_default_timezone_set( 'EST' );
			$format = "%.9s %-37.37s %.700s \r\n";
			$content = sprintf( $format, date( "g:i:s.u" ), ":" . substr( $method, -36, 36 ) . "() ", $text_to_log );
			file_put_contents ( dirname ( __FILE__ ) . "/register.log", $content /*. "\r\n" */, FILE_APPEND | LOCK_EX );
			if ( McbaUtil::$DEBUG === TRUE ) { echo $content . " <br>";	}
		}
		function __destruct() {}
	}
}

McbaUtil::$DEBUG = TRUE;
$logger             = new MCBAWriteLog();
$logger->writeLog( "isEmail.php", "populating variables..." );
$token             = $_POST[ 'recipient_token' ];
$logger->writeLog( "isEmail.php", "token: " . trim( $token ));
$message = new MCBAChatMessage( $sender_token,        	// this constructor is passed blank values.
								$recipient_token,		// all we want to do is use the get the
								$sender,				// user email from the database after we
							    $date,					// manually set the token.  the 'recipient_token'
								$message,				// is the only argument being "passed in".
								$sender_photo_url,
								$conversaton_id,
								$mcba_id,
								$email );
$message->setRecipientToken( $token );
$logger->writeLog( "isEmail.php", "message recipient: " . trim( $message->getRecipientToken()));
$email = $message->getUserEmailFromDatabase();
$response = '{ "email": "' . $message->getUser_email() . '" }';
echo json_encode( $response );
