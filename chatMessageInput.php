<?php
// include_once( 'config.php'          );
require_once( 'MCBA_WriteLog.php'   );
require_once( 'McbaChatMessage.php' );

date_default_timezone_set( 'America/New_York' );
function mprint( $text ) {
    file_put_contents(dirname(__FILE__) . "/register.log", date("h:i:sa") . ": ".  $text . "\n", FILE_APPEND | LOCK_EX);
}

mprint( "inside chat message input." );
if ( !class_exists( 'McbaUtil' )) {
	class McbaUtil {
		static $DEBUG = FALSE;
		public function __construct() {}
		public static function writeLog( $method, $text_to_log ) {
			date_default_timezone_set( 'EST' );
			$format = "%.9s %-37.37s %.700s \r\n";
			$content = sprintf( $format, date( "g:i:s.u" ), ":" . substr( $method, -36, 36 ) . "() ", $text_to_log );
			file_put_contents ( dirname ( __FILE__ ) . "/register.log", $content /*. "\r\n" */, FILE_APPEND | LOCK_EX ); }
		function __destruct() {}}}

McbaUtil::$DEBUG = TRUE;
$logger             = new MCBA_WriteLog();
$logger->writeLog( "{php} " . __METHOD__, "inside chat message input." );
$sender             = $_POST[ 'sender'           ];
$date 	            = $_POST[ 'date'             ];
$sender_token 	    = $_POST[ 'sender_token'     ];
$logger->writeLog( "{php} " . __METHOD__, "_POST[ senderId ]: " . $_POST[ 'senderId' ]);
$logger->writeLog( "{php} " . __METHOD__, "sender: [" . $sender . "]" );
if ( strlen( $sender ) == 0 ) { $sender = $_POST[ 'senderId' ]; } // from android}
$sender_photo_url   = $_POST[ 'sender_photo_url' ];

if ( $_POST[ 'message' ]) {
    $message = $_POST[ 'message' ];
} else if ( $_POST[ 'text' ]) {
    $message = $_POST[ 'text' ];
} else {
    $logger->writeLog( "{php} chatMessageInput line: " . __LINE__, "*** ERROR: no message or text defined! ***" ); }
$conversation_id    = $_POST[ 'conversation_id'  ];

if ( $_POST[ 'recipient' ]) {
    $recipient_token = $_POST[ 'recipient' ];
} else if ( $_POST[ 'recipient_token' ]) {
    $recipient_token = $_POST[ 'recipient_token' ];
} else {
    // if we have a conversation id, and the user from the conversation table is an email, 
    // the recipient token must exist
    if ( strlen( $conversation_id ) != 0 ) {
        $logger->writeLog( "{php} chatMessageInput line: " . __LINE__, "*** WARNING: no recipient token defined. ***" ); }  
}

$test_id            = $_POST[ 'test_id'          ];
$mcba_id            = $_POST[ 'mcba_id'          ];
$email              = $_POST[ 'email'            ];
$fromEmail          = $_POST[ 'from_email'       ];

$logger->writeLog( "{php}  chatMessageInput", "conversation id: " . $conversation_id  . " \n"
                                    . "sender: "                . $sender 	        . " \n" .
									  "date: " 	   	            . $date 			. " \n" .
									  "token: " 	            . $sender_token 	. " \n" .
									  "recipient: "	            . $recipient_token	. " \n" .
									  "message: "               . $message			. " \n" .
                                      "conversation id: "        . $conversation_id  . " \n" .
                                      "mcba_id: "               . $mcba_id          . " \n" .
                                      "email: "                 . $email            . " \n" .
                                      "from_email: "            . $fromEmail               );
                                      
$logger->writeLog( "{php} " . __METHOD__, "calling MCBAChatMessage constructor from within chatMessageInput.php ... " );
$chatMessage = new MCBAChatMessage( $sender_token, 
                                $recipient_token, 
                                $sender, 
                                $date, 
                                $message, 
                                $sender_photo_url, 
                                $conversation_id, 
                                $mcba_id, 
                                $email,
                                $fromEmail );

$logger->writeLog( "{php} " . __METHOD__, "done with chat constructor.  email: " . $chatMessage->getEmail() . "... " );
$logger->writeLog( "{php} " . __METHOD__, "done with chat constructor.  user_email: " . $chatMessage->getUser_email() . "... " );

if ( strlen( $conversation_id) == 0 || strpos( $conversation_id, "@" ) == true ) {
    $logger->writeLog( "{php} " . __METHOD__, "no conversation id or email passed to MCBAChatMessage.  getting it... " );
    $conversation_id = $chatMessage->getConversationIdFromDatabase();
} else {
    $logger->writeLog( "{php} " . __METHOD__, "Already have conversation id: " . $conversation_id . "... " );
}

if( strpos( $conversation_id, "ERROR" ) != false)  { echo "no conversation id!"; exit(); }

$logger->writeLog( "{php} " . __METHOD__, "conversation id: " . $conversation_id );

// if the recipient token is empty at this point, find out what it should be.
$logger->writeLog( "{php} chatMessageInput", "getting the length of the recipient token... " );
if ( strlen( $chatMessage->getRecipientToken()) == 0 ) {
    $logger->writeLog( "{php} chatMessageInput", "length must be zero." );
    $chatMessage->getRecipientTokenFromDatabase();
}else{
    $logger->writeLog( "{php} chatMessageInput", "the length is not zero." );
}
$test_id = 100;
$logger->writeLog( "{php} chatMessageInput", "test id: " + $test_id );
$chatMessage->sendMessage( $conversation_id, $test_id );

?>
