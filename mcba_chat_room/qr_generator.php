<?php
if( !defined('ABSPATH') ) { die('unauthorized'); }

function mcba_generate_qr( $message ) {
    global $wpdb;
    $db = new mysqli( $wpdb->dbhost, $wpdb->dbuser, $wpdb->dbpassword, $wpdb->dbname );
    if ($db->connect_errno) {
	echo $json['failure'] . ' Connect failed: ' . $db->connect_error;
        exit();
    }

    if ($result = mysqli_query($db, 'SELECT * FROM ' . $wpdb->prefix . 'mcba')) {
        $mcbaid  = mysqli_fetch_assoc($result);
        $mcba_id = $mcbaid['mcba_id'];
    	mysqli_free_result($result);
    } else {
        echo $json['failure'] . ' Problem: No results in ' . $wpdb->prefix . 'mcba' . "<br>";
        exit();
    }
    mysqli_close($db);

    $args = array(
        'method' => 'POST',
        'headers'  => array( 'Content-type: application/x-www-form-urlencoded' ),
        'sslverify' => false,
        'body' => array( 'mcba_id' => $mcba_id, 'mcba_action' => 'get_push_keys' )
    );
    $result = wp_remote_post( 'http://mycustombusinessapp.com/MCBA-MasterServer/proxy.php', $args );
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
    $result[ 'gcm_key' ] = $jsonBody->gcm_key;
    $result[ 'gcm_id'  ] = $jsonBody->gcm_id;
    return $result;
}
?>