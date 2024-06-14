<?php
/**  @class MessageManager */
require_once dirname(__FILE__) . '/../McbaChatMessage.php';
class MessageManager {
	private $conversation_id = null;
	public function __construct() { date_default_timezone_set( 'America/New_York' );}

	public function buildChatMessage() {
		$logger = LoggerFactory::getLogger( "MessageManagerLog" );
		$logger->logUpdate( "{php} inside MessagesManager->buildChatMessage()." );
		$sender = $_POST[ 'sender' ];
		$date = $_POST[ 'date' ];
		$sender_token = $_POST[ 'sender_token' ];
		$logger->logUpdate( "{php} _POST[ sender ]: " . $_POST[ 'sender' ]);
		$logger->logUpdate( "{php} sender: [" . $sender . "]" );
		if ( strlen( $sender) == 0 ) { $sender = $_POST[ 'senderId' ];} // from android }
		$sender_photo_url = $_POST[ 'sender_photo_url' ];
		if ($_POST[ 'message' ]) {
			$message = $_POST[ 'message' ];
		} elseif ($_POST[ 'text' ]) {
			$message = $_POST[ 'text' ];
		} else {
			$logger->logUpdate( "{php} : " . __LINE__, "*** ERROR: no message or text defined! ***" );
		}
		$conversation_id = $_POST[ 'conversation_id' ];
		if (isset( $_POST[ 'recipient' ])) {
			$recipient_token = isset( $_POST[ 'recipient' ] ) ? $_POST[ 'recipient' ] : "";
		} elseif ( isset( $_POST[ 'recipient_token' ])) {
			$recipient_token = $_POST[ 'recipient_token' ];
		} else {
			// if we have a conversation id, and the user from the conversation table is an email,
			// the recipient token must exist
			if ( strlen( $conversation_id ) != 0 ) {
				$logger->logUpdate( "{php} line: " . __LINE__, "*** WARNING: no recipient token defined. ***" );
			}
		}
		$mcba_id = $_POST[ 'mcba_id' ];
		$email = $_POST[ 'email' ];
		$fromEmail = $_POST[ 'from_email' ];
		$logger->logUpdate( "{php} conversation id: " . $conversation_id );
		$logger->logUpdate( "{php} sender: " . $sender );
		$logger->logUpdate( "{php} date: " . $date );
		$logger->logUpdate( "{php} sender token: "    . substr( $sender_token,    -5, 5 ));
		$logger->logUpdate( "{php} recipient token: " . substr( $recipient_token, -5, 5 ));
		$logger->logUpdate( "{php} message: " . $message );
		$logger->logUpdate( "{php} conversation id: " . $conversation_id );
		$logger->logUpdate( "{php} mcba_id: " . $mcba_id );
		$logger->logUpdate( "{php} email: " . $email );
		$logger->logUpdate( "{php} from_email: " . $fromEmail);

		$logger->logUpdate( "{php} calling MCBAChatMessage constructor from within MessageManager.php ... " );
		$chatMessage = new MCBAChatMessage($sender_token, $recipient_token, $sender, $date, $message, $sender_photo_url,
			$conversation_id, $mcba_id, $email, $fromEmail);

		$logger->logUpdate( "{php} checking the list of methods in the MCBAChatMessage object... " );
		$class_methods = get_class_methods( 'MCBAChatMessage' );
		// foreach ( $class_methods as $method_name ) { $logger->logUpdate( $method_name ); }
		if (!in_array( "getEmail", $class_methods)) { // no getEmail() method?  wtf, this isn't the right object.  dying...
			$logger->logUpdate( "{php} *** ERROR: getEmail() method DOES NOT exist.  This IS NOT a valid MCBAChatMessage object. ***" );
			die();} // if this is not an MCBAChatMessage object, we die().

		$logger->logUpdate( "{php} done methods list.  calling getEmail on chatMessage object..." );
		$logger->logUpdate( "{php} done with chat constructor.  email: " . $chatMessage->getEmail() . "... " );
		$logger->logUpdate( "{php} done with chat constructor.  user_email: " . $chatMessage->getUser_email() . "... " );
		if ( strlen( $conversation_id ) == 0 || strpos( $conversation_id, "@" )) {
			$logger->logUpdate( "{php} no conversation id or email passed to MCBAChatMessage.  getting it... " );
			$conversation_id = $chatMessage->getConversationIdFromDatabase();
            $this->logger->logUpdate( "{php} inside MessageManager->buildChatMessage()... " );
			$logger->logUpdate( "{php} got conversation id: " . $conversation_id . ". " );
		} else {
			$logger->logUpdate( "{php} Already have conversation id: " . $conversation_id . "... " );
		}

		$logger->logUpdate( "{php} checking conversation id again for sanity..." );
		if ( strpos( $conversation_id, "ERROR" )) { die( "no conversation id!" ); }

		$logger->logUpdate( "{php} storing conversation id: " . $conversation_id . "..." );
		$this->conversation_id = $conversation_id;

		// if the recipient token is empty at this point, find out what it should be.
		$logger->logUpdate( "{php} getting the length of the recipient token... " );
		if ( strlen( $chatMessage->getRecipientToken()) == 0 ) {
			$logger->logUpdate( "{php} length must be zero.  Getting recipient token from database..." );
			$chatMessage->getRecipientTokenFromDatabase();
            $logger->logUpdate( "{php} The recipient token is now: " . $chatMessage->getRecipientToken() );
		} else { $logger->logUpdate( "{php} the length is not zero." ); }
        $logger->logUpdate( "{php} task finished.  returning chatMessage... " );
		return $chatMessage; }

	public function getConversationId() { return $this->conversation_id; }
}
