<?php 

// If they got here without WordPress then kick them out
if (! defined('ABSPATH')) {
    die('unauthorized');
}

function mcba_send_proxiblast($message, $latitude, $longitude, $radius, $expires) {
    return mcba_send_message("proxiblast", $message, "all", $latitude, $longitude, $radius, $expires, false);
}

function mcba_send_promoblast($message, $recipients) {
    return mcba_send_message("promoblast", $message, $recipients, "", "", "", "", false);
}

function mcba_send_chat($message, $recipients) {
    return mcba_send_message("chat", $message, $recipients, "", "", "", "", false);
}

function mcba_send_admin($message, $recipient) {
    return mcba_send_message("toggleAdmin", $message, $recipient, "", "", "", "", true);
}

function mcba_send_message($type, $message, $recipients, $latitude, $longitude, $radius, $expires, $direct) {
    global $wpdb;
    $db = new mysqli($wpdb->dbhost, $wpdb->dbuser, $wpdb->dbpassword, $wpdb->dbname);
    if ($db->connect_errno) {
        printf("Connect failed: %s\n", $db->connect_error);
        file_put_contents(MCBA_DIR . 'messaging.log', "connection error\r\n", FILE_APPEND | LOCK_EX);
        exit();
    }
    
    if (!$direct) {
        if ($result = mysqli_query($db, 'SELECT * FROM ' . $wpdb->prefix . 'mcba_users')) {
            $count = mysqli_num_rows($result);
            $regids = array();
            $recipients = "all";
            if ($recipients == "all") {
                while ($row = mysqli_fetch_assoc($result)) {
                    $regids[] = $row['pushid'];
                }
            } else {
                while ($row = mysqli_fetch_assoc($result)) {
                    // only if $recipients[] matches row_id
                    foreach ($recipients as $key => $id) {
                        if ($key == $row['row_id']) {
                            $regids[] = $row['pushid'];
                            break;
                        }
                    }
                }
            }
            mysqli_free_result($result);
        } else {
            echo $json['failure'] . '<br>Problem: No results in ' . $wpdb->prefix . 'mcba_users' . "<br>";
            file_put_contents(MCBA_DIR . 'messaging.log', "Problem: No results\r\n", FILE_APPEND | LOCK_EX);
            exit();
        }
    } else {
        $regids = array();
        $regids = $recipients;
    }
    
    if ($result = mysqli_query($db, 'SELECT * FROM ' . $wpdb->prefix . 'mcba')) {
        $mcbaid = mysqli_fetch_assoc($result);
        $mcba_id = $mcbaid['mcba_id'];
                
        $fields = array(
            'mcba_id' => $mcba_id,
            'mcba_action' => 'get_push_keys'
        );
        mysqli_free_result($result);
    } else {
        echo $json['failure'] . ' Problem: No results in ' . $wpdb->prefix . 'mcba' . "<br>";
        exit();
    }
    
    mysqli_close($db);
    
    
//////////////////// http call to get keys using mcba_id //////////////////////
    $args = array(
        'method' => 'POST',
        'headers'  => array(
            'Content-type: application/x-www-form-urlencoded'
        ),
        'sslverify' => false,
        'body' => array(
            'mcba_id' => $mcba_id,
            'mcba_action' => 'get_push_keys'
        )
    );
    
    $result = wp_remote_post('http://mycustombusinessapp.com/MCBA-MasterServer/proxy.php', $args);
    
    if ( is_wp_error( $result ) ) {
        $error_message = $result->get_error_message();
        echo "Something went wrong: $error_message";
    }    
    
    if (isset($result['error'])) {
        echo "Error: <br>";
        echo '<br>RESULT: <pre>' . var_dump( $result ) . "</pre>", PHP_EOL;
        return $result;
    }
    $jsonBody = json_decode( $result[ 'body' ]); 
    $gcmKey = $jsonBody->gcm_key;
    $gcmID =  $jsonBody->gcm_id;
    
    if ( strlen ( $gcmKey ) == 0 ) {
        die ("<br><h1>No gcm key!</h1><br>");
    }
    ////////////////////////// done getting keys //////////////////////////////
    
    
    /////////////////////////// make http promo blast call //////////////////// 
    $data = array(
				'message' => $message,
				'type' => $type,
				'radius' => $radius,
				'expires' => $expires,
				'latitude' => $latitude,
				'longitude' => $longitude
		);
    $notification = array('title' => $title, 'body' => $message, 'sound' => 'default', 'badge' => '1',  'content-available' => '1');
    $fields = array('registration_ids' => $regids, 'notification' => $notification, 'priority' => 'high', 'data' => $data,  'content-available' => '1');
    $args = array(
      'timeout'   => 45,
      'redirection' => 5,
      'httpversion' => '1.1',
      'method'    => 'POST',
      'body'      => json_encode($fields),
      'sslverify'     => false,
      'headers'     => array(
            'Content-Type' => 'application/json',
            'Authorization' => 'key=' . $gcmKey,
      ),
      'cookies'     => array()
    );
    
    $response = wp_remote_post( 'https://fcm.googleapis.com/fcm/send', $args );
    

    // ------------------------------
    // Debug GCM response
    // ------------------------------
    
    $json = json_decode( $resonse[ 'body' ]);
//    echo "<br>" . 'Response from Google:' . "<br>" . $json->success . ' Succeeded ' . "<br>" . 
//         $json->failure . ' Failed ' . "<br>" . count($regids) . ' Total Recipients' . "<br>";
    echo "<script>alert('message sent successfully.');</script>";
}
?>
