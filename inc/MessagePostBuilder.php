<?php
require_once dirname( __FILE__ ) . '/../monitored-object-php/monitored-object/LoggerFactory.php';

class MessagePostBuilder {
	private $logger, $conversation_id, $database;
	public function __construct( $conversation_id_arg ) {
		$this->logger = LoggerFactory::getLogger( "MessagePostBuilderLog" );
        $this->logger->logUpdate( "inside MessagePostBuilder constructor.  called with conversation id arg: " . $conversation_id_arg );
        if ( $conversation_id_arg == null || strlen( $conversation_id_arg ) == 0 ) {
            $this->logger->logUpdate( "***Warning: no conversation id passed to MessagePostBuilder constructor. ***" );
            $this->logger->logUpdate( "setting conversation id from GET global variable." );
		    if ( isset( $_GET[ "conversation_id" ])) { 
                $this->logger->logUpdate( "setting conversation_id from GET: ".$_GET[ "conversation_id" ]);
                $this->conversation_id = $_GET[ "conversation_id" ];
            }
        }    
        $this->logger->logUpdate( "MessagePostBuilder created with conversation id: " . $this->conversation_id );
		$this->database        = $this->initialize_database(); }

    public function setConversationId ( $conversation_id_arg ) {
        $this->logger->logUpdate( "inside setConversationId().  called with conversation id arg: " . $conversation_id_arg );
        $this->conversation_id = $conversation_id_arg; 
    }

	public function build_message_post() {
		$this->logger->logUpdate( "selecting user with conversation id: [" . $this->conversation_id . "]..." );
		$sql = "SELECT user FROM `wp_mcba_chat_conversations` WHERE `conversation_id`='" . $this->conversation_id . "'";
		$statement = $this->database->prepare( $sql );
		$statement->execute();
		$result = $statement->fetchAll();
		$user = $result[ 0 ][ 'user' ];
		$this->logger->logUpdate( "selecting user information with user: " . $user . "..." );
		$sql = "select ID, device, pushid from `wp_mcba_users` where `email`='" . $user . "'";
		$statement = $this->database->prepare( $sql );
		$statement->execute();
		$result = $statement->fetchAll();
		$_POST[ 'id'              ] = $result[ 0 ][ 'ID'     ];
		$_POST[ 'device'          ] = $result[ 0 ][ 'device' ];
		$_POST[ 'recipient_token' ] = $result[ 0 ][ 'pushid' ];
		$_POST[ 'recipient'       ] = $user;
		$_POST[ 'email'           ] = $user;
		$this->logger->logUpdate( "set recipient id to: "     . $_POST[ 'id'     ]);
		$this->logger->logUpdate( "set recipient device to: " . $_POST[ 'device' ]);
		$this->logger->logUpdate( "set recipient_token to: ..."  . substr( $_POST[ 'recipient_token' ], -10 ));
		$this->logger->logUpdate( "selecting admin information..." );
		$sql = "select ID, device, email, pushid from `wp_mcba_users` where `isAdmin`='1'";
		$statement = $this->database->prepare( $sql );
		$statement->execute();
		$result = $statement->fetchAll();
		$_POST[ 'fromEmail'     ] = $result[ 0 ][ 'email'  ];
		$_POST[ 'sender'        ] = $result[ 0 ][ 'email'  ];
		$_POST[ 'sender_id'     ] = $result[ 0 ][ 'ID'     ];
		$_POST[ 'sender_device' ] = $result[ 0 ][ 'device' ];
		$_POST[ 'sender_token'  ] = $result[ 0 ][ 'pushid' ];
        $this->logger->logUpdate( "set fromEmail to: "       . $_POST[ 'fromEmail'     ]);
		$this->logger->logUpdate( "set recipient email to: " . $_POST[ 'email'         ]);
		$this->logger->logUpdate( "set sender_id to:  "      . $_POST[ 'sender_id'     ]);
		$this->logger->logUpdate( "set sender_device to: "   . $_POST[ 'sender_device' ]);
		$this->logger->logUpdate( "set sender_token to: ..." . substr( $_POST[ 'sender_token'  ], -10 ));
        $this->logger->logUpdate( "finished populating _POST variable." ); }

	private function initialize_database() {
		try {
			global $wpdb;
			$db = new PDO( 'mysql:host=' . $wpdb->dbhost . '; dbname=' . $wpdb->dbname, $wpdb->dbuser, $wpdb->dbpassword );
			$db->setAttribute( PDO::ATTR_ERRMODE, PDO::ERRMODE_WARNING );
			return $db;
		} catch (PDOException $pDoException) {
			file_put_contents( "caught exception in McbaChatMessage around line " . __LINE__ . '\r\n', FILE_APPEND | LOCK_EX );
			file_put_contents( 'register.log', $pDoException->getMessage() . '\r\n', FILE_APPEND | LOCK_EX );
			die( json_encode( array('error' => $pDoException->getMessage()))); }}
}
?>
