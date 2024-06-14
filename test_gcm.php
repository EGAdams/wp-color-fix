<?php
function get_gcm_key( $mcba_id ) { 

    $url = 'http://mycustombusinessapp.com/MCBA-MasterServer/proxy.php';

    $data = array( 'mcba_id' => $mcba_id, 'mcba_action' => 'get_push_keys' );

    // use key 'http' even if you send the request to https://...
    $options = array(
        'http' => array(
            'header'  => "Content-type: application/x-www-form-urlencoded\r\n",
            'method'  => 'POST',
            'content' => http_build_query( $data )
        )
    );

    $context  = stream_context_create( $options );
    $result = file_get_contents( $url, false, $context );
    
    var_dump( $result );
    exit();
    $jsonBody = json_decode($result[ 'body' ]); 
    $gcmKey = $jsonBody->gcm_key;
    $gcmID =  $jsonBody->gcm_id;
    
    if (strlen($gcmKey) == 0) {
        die ("<br><h1>No gcm key!</h1><br>");
    }
        
    return $gcmKey;
}

get_gcm_key( 1 );

?>
