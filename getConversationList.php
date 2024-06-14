<?php
defined('ABSPATH') || exit;
/*
 *  getConversationList()
 */
function getConversationList() {
    global $wpdb;
    $db = new mysqli( $wpdb->dbhost, $wpdb->dbuser, $wpdb->dbpassword, $wpdb->dbname );
    
    if ($db->connect_errno) {
        printf( "Connect failed: %s\n", $db->connect_error );
        exit();
    }
    $query = "SELECT * FROM " . $wpdb->prefix . "mcba_chat_conversations";
    
    if ( $result = mysqli_query( $db, $query )) {
        $conversations = array();
        
        while($row = mysqli_fetch_assoc( $result )){
            $conversations[] = $row;
        }
    }
    
    echo json_encode( array(
        "conversations" => $conversations
    )); 
}
getConversationList();
?>