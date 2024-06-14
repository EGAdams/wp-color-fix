<?php
require_once dirname( __FILE__ ) . '/../monitored-object-php/monitored-object/LoggerFactory.php';

/** @class SetAdminReadStatus */
/** Sets user_unread_messages to 0 for a given conversation_id */
class SetAdminReadStatus { /* SET admin_unread_messages=0 WHERE conid= ... */
    private $logger;
    
    public function __construct() { 
        McbaUtil::writeLog( __METHOD__, "constructing the logger for the administrator read status setter." );
        $this->logger = LoggerFactory::getLogger( "SetAdminReadStatusLogger" );
        $this->logger->logUpdate( "constructed the administrator read status setter." ); }

    public function execute() {
        global $wpdb;
		$db = new mysqli( $wpdb->dbhost, $wpdb->dbuser, $wpdb->dbpassword, $wpdb->dbname );
		if ( $db->connect_errno ) { $this->logger->logUpdate( "ERROR: Connect failed: %s\n", $db->connect_error); exit(); }
        $conversation_id = $_GET[ 'conversation_id' ];
        $this->logger->logUpdate( "updating read status for conversation id: " . $conversation_id );
        $sql = "UPDATE wp_mcba_chat_conversations SET admin_unread_messages=0 WHERE conversation_id=" . $conversation_id;
        $this->logger->logUpdate( "updating wp_mcba_chat_conversations table for conversation id: " . $conversation_id );
        // execute the query
        if ( $db->query( $sql ) === TRUE ) {
            $this->logger->logUpdate( "wp_mcba_chat_conversations table updated for conversation id: " . $conversation_id );
            $db->close();
            $this->logger->logUpdate( "finished clearing admin unread status and closed the database connection." );
        } else {
            $this->logger->logUpdate( "ERROR: " . $db->error . " for conversation id: " . $conversation_id );
        }}} 
