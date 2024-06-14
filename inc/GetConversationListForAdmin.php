<?php
require_once dirname( __FILE__ ) . '/../monitored-object-php/monitored-object/LoggerFactory.php';

/** @class GetConversationListForAdmin */
class GetConversationListForAdmin {
    private $logger;
    
    public function __construct() { 
        $this->logger = LoggerFactory::getLogger( "GetConversationListForAdminLogger" );
        $this->logger->logUpdate( "constructed the conversation list getter." ); }

    public function run() {
        global $wpdb;
		$db = new mysqli( $wpdb->dbhost, $wpdb->dbuser, $wpdb->dbpassword, $wpdb->dbname );
		if ( $db->connect_errno ) { $this->logger->logUpdate( "ERROR: Connect failed: %s\n", $db->connect_error); exit(); }
        $this->logger->logUpdate( "selecting all conversations..." );
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

        $result = mysqli_query( $db, $query );
        $list = array();
        while( $row = mysqli_fetch_assoc( $result )) {
            $list[] = $row;	}
        if ( count( $list ) == 0 ) {
            $this->logger->logUpdate( "no conversations found." );    
        } elseif ( count( $list ) == 1 ) {
            $this->logger->logUpdate( "found " . count( $list ) . " conversation." );
        } else { $this->logger->logUpdate( "found " . count( $list ) . " conversations." ); }
        $this->logger->logUpdate( "task finished.  closing db connection..."   );
        $db->close();
        echo json_encode( array( "type"  => "conversation_list", "result" => "success", "list" => $list ));
    }    
}
