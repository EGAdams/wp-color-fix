<?php
defined('ABSPATH') || exit;
require_once 'MCBAWriteLog.php';

function getConversationMap() { 
    global $wpdb;
    $logger = new MCBAWriteLog();
    $db = new mysqli( $wpdb->dbhost, $wpdb->dbuser, $wpdb->dbpassword, $wpdb->dbname );
    if ( $db->connect_errno ) {
        printf( "Connect failed: %s\n", $db->connect_error );
        exit();
    }
    $query = "SELECT email, first_name, last_name FROM " . $wpdb->prefix . "mcba_users";
     
    $display_names = array();
    if ( $result = mysqli_query( $db, $query )) {   
        while( $row = mysqli_fetch_assoc( $result )){
            $display_names[] = $row;
        }
    }
    
    echo json_encode( array(
        "display_names" => $display_names
    ));
}
getConversationMap();
?>