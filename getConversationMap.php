<?php
// defined('ABSPATH') || exit;
require_once 'MCBAWriteLog.php';

function getConversationMap() {
    global $wpdb;
    $logger = new MCBAWriteLog();
    $logger->writeLog( __METHOD__ ,  ': ' . 'getConversationMap initializing db...' );
    $db = new mysqli( $wpdb->dbhost, $wpdb->dbuser, $wpdb->dbpassword, $wpdb->dbname );
	if ( $db->connect_errno ) { $logger->writeLog( "{php} " . __METHOD__, "Connect failed: %s\n", $db->connect_error ); exit(); }
    $query = "SELECT email, first_name, last_name FROM wp_mcba_users";
    $logger->writeLog( __FUNCTION__, ': ' . 'getConversationMap executing query '. $query );
    $display_names = array();
    if ( $result = mysqli_query( $db, $query )) { while( $row = mysqli_fetch_assoc( $result )) { $display_names[] = $row; }}
    echo json_encode( array( "display_names" => $display_names )); }

getConversationMap();
