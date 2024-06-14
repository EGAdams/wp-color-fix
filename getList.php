<?php
require_once 'McbaChatMessage.php';
if ( !class_exists( 'WriteLog' )) {
	class WriteLog {
		private $time 		  =	null;
		private $class_method = null;
		private $message      = null;
		private $database     =	null;

		public function __construct() {
			$this->database 	= $this->initialize_database();
			date_default_timezone_set('America/New_York');
			$this->time 		= date("Y-m-d H:i:s");
		}

		public function writeLog($class_methodArg, $messageArg) {
			$statement = $this->database->prepare( 'INSERT INTO debug_log (time, class_method, message) VALUES(?, ?, ?)' );
			$result = $statement->execute( array( $this->time, $class_methodArg, sprintf("[%-300.300s]", $messageArg )));
			return $result;
		}

		private function initialize_database() {
			try {
                global $wpdb;
				$db = new PDO( 'mysql:host=' . $wpdb->dbhost . '; dbname=' . $wpdb->dbname, $wpdb->dbuser, $wpdb->dbpassword );
				$db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_WARNING);
				return $db;
			}
			catch (PDOException $pDoException) {
				file_put_contents('register.log', "failed to init db in getList.php" . '\r\n', FILE_APPEND | LOCK_EX);
				file_put_contents('register.log', $pDoException->getMessage() . '\r\n', FILE_APPEND | LOCK_EX);
				die(json_encode(array( 'error' => $pDoException->getMessage())));
			}
		}
		public function __destruct() {}
	}
}

function getList( $list_type ) {
    global $wpdb;
    $logger = new WriteLog();
    $logger->writeLog("{php} " . __METHOD__, "logger constructed.");
    $db = new mysqli( $wpdb->dbhost, $wpdb->dbuser, $wpdb->dbpassword, $wpdb->dbname );
    if ($db->connect_errno) { $logger->writeLog("{php} " . __METHOD__ , "Connect failed: %s\n", $db->connect_error); exit(); }
    $logger->writeLog("{php} " . __METHOD__, "conversation_id: " . $_POST[ "conversation_id" ]);
    $query = "";
    if($list_type == "conversation_list") {
        $logger->writeLog("{php} " . __METHOD__, "list type is conversation list.  selecting all conversations...");
        $query = "
        select
        distinct wp_mcba_chat_conversations.conversation_id,
        wp_mcba_chat_conversations.user,
        wp_mcba_chat_conversations.admin,
        wp_mcba_chat_conversations.admin_unread_messages,
        wp_mcba_chat_conversations.user_unread_messages,
        wp_mcba_chat_conversations.mcba_chat_system_id
        from
        wp_mcba_chat_conversations,
        wp_mcba_chat_messages
        where
        wp_mcba_chat_conversations.conversation_id = wp_mcba_chat_messages.conversation_id
        and (
            select
            count( wp_mcba_chat_conversations.conversation_id )
            from
            wp_mcba_chat_messages
            ) > 0;";
            
        $logger->writeLog( "{php} " . __METHOD__, "query: " . $query );

    }elseif($list_type == "message_list") {
        $logger->writeLog("{php} " . __METHOD__, "list type is message list.");
        $logger->writeLog("{php} " . __METHOD__, "conversation id is: " .  $_POST[ "conversation_id" ]);
        $conversationId = $_POST[ "conversation_id" ];
        if( strlen( $conversationId ) != 0) {
            $query = "SELECT * FROM wp_mcba_chat_messages WHERE conversation_id = " .
                                                         $_POST[ "conversation_id" ] . " ORDER BY message_id";
            
            /*
             *  if the id is known, this is admin.  clear it here.
             */
            $logger->writeLog("{php} ". __METHOD__, "setting admin unread to zero...");
            $sql="UPDATE `wp_mcba_chat_conversations` SET `admin_unread_messages`=0 WHERE `conversation_id`=" .
                         $_POST[ "conversation_id" ];
            $logger->writeLog("{php} " . __METHOD__ , "sql: " . $sql);
            $statement = $db->prepare( $sql );
            $statement->execute();
            $statement = null;
            
        } else {
            
            /*
             * get conversation id
             */
            $query = "SELECT conversation_id FROM wp_mcba_chat_conversations WHERE user='" . $_POST[ 'user_email' ] . "' LIMIT 1";
            $logger->writeLog("{php} " . __METHOD__, $query);
            $result = mysqli_query($db, $query);
            $row = mysqli_fetch_assoc($result);
            $conversation_id = $row[ "conversation_id" ];
            if (strlen($conversation_id) == 0) {
                $logger->writeLog( "{php} " . __METHOD__, "calling MCBAChatMessage constructor from within getList.php ... " );
                $chatMessage = new McbaChatMessage("", "", "", "", "", "", "", "", "", "");
                $chatMessage->setUser_email(  $_POST[ "user_email"  ]);
                $chatMessage->setAdmin_email( $_POST[ "admin_email" ]);
                $conversation_id = $chatMessage->getConversationIdFromDatabase();
            }
            
            $logger->writeLog("{php} " . __METHOD__, "got conversation id, it is: " . $conversation_id);
            
            /*
             *  this is a user, set unread to zero.
             */
            $logger->writeLog("{php} ". __METHOD__, "setting user unread to zero...");
            $sql="UPDATE `wp_mcba_chat_conversations` SET `user_unread_messages`=0 WHERE `conversation_id`=" . $conversation_id;
            $logger->writeLog("{php} " . __METHOD__ , "sql: " . $sql);
            $statement = $db->prepare( $sql );
            
            if ( $statement == false ) {
                $logger->writeLog( "{php} " . __METHOD__, "\$statement is false!" );
            } else {
                $statement->execute();
            }
            $statement = null;
            
            /*
             * now we can make the same query as above
             */
            $query = "SELECT * FROM wp_mcba_chat_messages WHERE conversation_id=" . $conversation_id . " ORDER BY message_id";
        }
    }
    
    
    if ($result = mysqli_query($db, $query)) {
        $list = array();
        while($row = mysqli_fetch_assoc($result)){
            $row['message'] = stripslashes($row['message']);
            $list[] = $row;
        }
    }
    
    $logger->writeLog("{php} " . __METHOD__, "json encoded is...");
    $logger->writeLog("{php} " . __METHOD__, json_encode(array("type"  => $list_type, "result" => "success", "list" => $list)));
    echo json_encode(array(
        "type"  => $list_type,
        "result" => "success",
        "list" => $list
    ));
}
$listType = $_POST[ "list_type" ];
getList( $listType );
?>
