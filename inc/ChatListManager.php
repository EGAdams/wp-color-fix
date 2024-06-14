<?php
require_once dirname(__FILE__) . '/../monitored-object-php/monitored-object/LoggerFactory.php';
require_once dirname( __FILE__ ) . '/MessagePostBuilder.php';
require_once dirname( __FILE__ ) . '../../McbaChatMessage.php';

class ChatListManager {
	private $logger;
	public function __construct() { $this->logger = LoggerFactory::getLogger( "ChatListManagerLog" ); }

	public function getList() {  // get message_list
		$this->logger->logUpdate( "getting list of messages in the chat list manager..." );
		global $wpdb;
		$conversation_id = "";
		$db = new mysqli( $wpdb->dbhost, $wpdb->dbuser, $wpdb->dbpassword, $wpdb->dbname );
		if ( $db->connect_errno) { $this->logger->logUpdate( "Connect failed: %s\n", $db->connect_error); exit(); }

        // Get the Conversation ID...
		if ( isset( $_GET[ "conversation_id" ])) { $this->logger->logUpdate( "conversation_id: ".$_GET[ "conversation_id" ]); }
		$query = "";
        if ( isset( $_GET[ "conversation_id" ])) {
            $this->logger->logUpdate( "conversation id is: " .  $_GET[ "conversation_id" ]);
            $conversationId = $_GET[ "conversation_id" ];
            $conversation_id = $conversationId;
        } else { $this->logger->logUpdate( "conversation id is empty." ); $conversationId = ""; }
        if( strlen( $conversationId ) != 0 ) {
            $this->logger->logUpdate( "getting list for conversation id: " . $conversationId . " ..." );
            $query = "SELECT * FROM wp_mcba_chat_messages WHERE conversation_id = " .
                                                            $_GET[ "conversation_id" ] . " ORDER BY message_id";
            /**  if the id is known, this is admin.  clear it here. */
            $this->logger->logUpdate( "not setting admin unread to zero..." );
        } else {
            $this->logger->logUpdate( "get conversation id from the database since it appears that none was passed in..." );
            $this->logger->logUpdate( "using user email: " . $_GET[ 'user_email' ] . " ..." );
            $query = "SELECT conversation_id FROM wp_mcba_chat_conversations WHERE user='" . $_GET[ 'user_email' ] . "' LIMIT 1";
            McbaUtil::writeLog( "{php} " . __METHOD__, $query);
            $result = mysqli_query( $db, $query);
            $row = mysqli_fetch_assoc( $result);
            $conversation_id = $row[ "conversation_id" ];
            if ( strlen( $conversation_id ) == 0 ) {
                $this->logger->logUpdate( "calling MCBAChatMessage constructor from within the managers getList() method... " );
                McbaUtil::writeLog( __METHOD__,  "calling MCBAChatMessage constructor from within getList.php ... "           );
                $chatMessage = new McbaChatMessage("", "", "", "", "", "", "", "", "", "" );
                $admin_email = $_GET[ "admin_email" ];
                $user_email = $_GET[  "user_email"  ]; 
                $this->logger->logUpdate( "setting chat message user email: $user_email  admin email: $admin_email" );
                $chatMessage->setUser_email(  $_GET[ "user_email"  ]);
                $chatMessage->setAdmin_email( $_GET[ "admin_email" ]);
                $conversation_id = $chatMessage->getConversationIdFromDatabase();
                $this->logger->logUpdate( "inside ChatListManager::getList()" );
                $this->logger->logUpdate( "got conversation id: " . $conversation_id ); }
            
            $this->logger->logUpdate( "inside ChatListManager::getList()" );
            $this->logger->logUpdate( "got conversation id, it is: " . $conversation_id );
            /**  this is a user, set unread to zero. */
            $this->logger->logUpdate( "*** WARNING: setting user unread to zero... *** " );
            $sql="UPDATE `wp_mcba_chat_conversations` SET `user_unread_messages`=0 WHERE `conversation_id`=" . $conversation_id;
            McbaUtil::writeLog( "{php} " . __METHOD__ , "sql: " . $sql);
            $statement = $db->prepare( $sql );
            if ( $statement == false ) {
                McbaUtil::writeLog(  "{php} " . __METHOD__, "\$statement is false!" );
            } else { $statement->execute();	}
            $statement = null;
            /** now we can make the same query as above */
            $query = "SELECT * FROM wp_mcba_chat_messages WHERE conversation_id='" . $conversation_id . "' ORDER BY message_id"; }
		
		if ( $result = mysqli_query( $db, $query)) {
			$list = array();
			while( $row = mysqli_fetch_assoc( $result)){
				$row['message'] = stripslashes( $row['message']);
				$list[] = $row;	}}
		
		if ( empty( $list ) && $_GET[ "is_admin" ] == "false" ) {

            // for the 1st message.
			$welcome_message = "Hello.  Thank you for using our chat system.  How can we help you today?";
			$this->logger->logUpdate( "calling the post builder with conversation id: [" . $conversation_id . "]" );
            if ( $conversation_id = "" ) { 
                $this->logger->$monitor->logUpdate( "*** ERROR: no conversation id to get list.  exiting... *** " );
                die( "no conversation id passed in!" );
            }
			$postBuilder = new MessagePostBuilder( $conversation_id );
            // $postBuilder->setConversationId( $conversation_id ); why this doesn't work!
			$postBuilder->build_message_post();   // populates the global $_POST variable
			$chatMessage = new McbaChatMessage( $_POST[ 'sender_token' ], $_POST[ 'recipient_token' ], $_POST[ 'sender' ], date( "H:i:s" ), $welcome_message, /* sender_photo_url */ "",			$conversation_id, /* mcba_id */ 0, $_POST[ 'email' ], $_POST[ 'fromEmail' ]);
            
            $this->logger->logUpdate( "calling the sendMessage method with conversation id ["
            . $_GET[ "conversation_id" ] . "]..." );  // this $conversation_id variable is getting lost.
            $result_of_send_message = $chatMessage->sendMessage( $_GET[ "conversation_id" ]);

			if ( str_contains( $result_of_send_message, "ERROR" )) {
                $this->logger->logUpdate( $result_of_send_message );
                die( $result_of_send_message ); 
            } else {
                $this->logger->logUpdate( "finished sending the welcome message... " );
            }
            
		} else { $this->logger->logUpdate( "finished getting list.  sizeof( list[] ) = " . 
                                           sizeof( $list ) . ".  No need for welcome message anymore." ); }

		McbaUtil::writeLog( "{php} " . __METHOD__, "query: " . $query );
		McbaUtil::writeLog( "{php} " . __METHOD__, "echoing: " . json_encode( array( "type"  => "message_list", "result" => "success", "list" => $list )));
		echo json_encode( array( "type"  => "message_list", "result" => "success", "list" => $list )); }
}?>
