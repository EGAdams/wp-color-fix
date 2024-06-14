<?php
defined('ABSPATH') || exit;
require_once('MCBAWriteLog.php');

function getMessageId($conversation_idArg, $timeArg, $messageArg) {
    global $wpdb;
    $logger = new MCBAWriteLog();
    
    $db = new mysqli( $wpdb->dbhost, $wpdb->dbuser, $wpdb->dbpassword, $wpdb->dbname );
    if ($db->connect_errno) {
        printf("Connect failed: %s\n", $db->connect_error);
        exit();
    }
    $query = "";
               
        // get message id
    $query = "SELECT message_id FROM wp_mcba_chat_messages WHERE    conversation_id='"   . $conversation_idArg .
                                                         "' AND      time='"              . $timeArg .
                                                         "' AND      message='"           . $messageArg .
                                                         "' LIMIT 1";
    $logger->writeLog(__METHOD__, "$conversation_idArg, $timeArg");
    $logger->writeLog(__METHOD__, $messageArg);
    $logger->writeLog(__METHOD__, "sql: " . $query);

    $result = mysqli_query($db, $query);
    
    while($row = mysqli_fetch_assoc($result)){
        $list[] = $row;
    }
    
    $message_id = $list[0]['message_id'];
    $logger->writeLog(__METHOD__, "got message id, it is: " . $message_id);
    
    echo json_encode(array(
        "type"  => "one_value",
        "result" => "success",
        "message_id" => $message_id
    ));
}

$conversationId = sanitize_text_field( $_POST[ 'conversation_id' ]);
$timeStamp      = sanitize_text_field( $_POST[ 'time'            ]);
$theMessage     = sanitize_text_field( $_POST[ 'message'         ]); 
getMessageId( $conversationId, $timeStamp, $theMessage );
?>