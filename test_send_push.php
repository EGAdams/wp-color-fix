<?php

$test_id = "1";
$fields = array(
    'registration_ids' => 'fjquXbWXqq8:APA91bFppcs5YStGAUq_cmKzf6t0DUXuTitzE61rVUm2JLsTk-zyQBvk9_sERVyv65kh14qOkq_fV2a7GpTvUGBDLk3eo_Ll7IQ3iLo4BHTvL89csdzMplxqx3Q7CJ0rrH1gpZt9clIM',
    'content_available' => true,
    'notification' => array(
        'type' => 'push',
        'body' => "hello.",
        'sound' => "default"
    ),
    'data' => array(
        'message'      => "hello.",
        'type'         => 'push',
        'sender'       => 'thisTest',
        'sender_id'    => '840',
        'test_id'      => '1',
        'date'         =>  '2021-06-19 20:12:00',
        'conversation_id' => '170',
        'sound' => "default"
    )
);

function sendPushNotification( ) {
    $data = array(
    'timeout'     => 45,
    'redirection' => 5,
    'httpversion' => '1.1',
    'method'      => 'POST',
    'body'        => json_encode( $fields ),
    'sslverify'   => false,
    'Authorization' => 'key=AAAAAETEfow:APA91bHVzVU_S8h7x7E4cYQSoKdPY3NGVw2yNnCg2iTm8Zc9vzc0TQozx7EipSkYlc5k1uqCC0jMgJqwIaWJ1oXZ3UGxfHjqhayOiPd_ZrRDw6jJ8MQt1EXPimgCQ9adRGChvlXtCufm',
    'headers'     => array(
            'Content-Type' => 'application/json',
            'Authorization' => 'key=AAAAAETEfow:APA91bHVzVU_S8h7x7E4cYQSoKdPY3NGVw2yNnCg2iTm8Zc9vzc0TQozx7EipSkYlc5k1uqCC0jMgJqwIaWJ1oXZ3UGxfHjqhayOiPd_ZrRDw6jJ8MQt1EXPimgCQ9adRGChvlXtCufm',
        ),
    'cookies'     => array());
    

    echo "sending data: " . var_dump( $data  );

    $url = 'https://fcm.googleapis.com/fcm/send';

    // use key 'http' even if you send the request to https://...

    $options = array(
        'http' => array(
            'header'  => "Content-type: application/x-www-form-urlencoded\r\n",
            'method'  => 'POST',
            'content' => http_build_query( $data ),
            'Authorization' => 'key=AAAAAETEfow:APA91bHVzVU_S8h7x7E4cYQSoKdPY3NGVw2yNnCg2iTm8Zc9vzc0TQozx7EipSkYlc5k1uqCC0jMgJqwIaWJ1oXZ3UGxfHjqhayOiPd_ZrRDw6jJ8MQt1EXPimgCQ9adRGChvlXtCufm',
        )
    );

    $context  = stream_context_create( $options );
    $result = file_get_contents( $url, false, $context );

    $json = json_decode( $result );
    echo "result: " . var_dump( $json );
    return $json;
}

function sendGCM($message, $id) {


    $url = 'https://fcm.googleapis.com/fcm/send';

    $fields = array (
            'registration_ids' => array (
                    $id
            ),
            'data' => array (
                    "message" => $message
            )
    );
    $fields = json_encode ( $fields );

    $headers = array (
            'Authorization: key=' . 'AAAAAETEfow:APA91bHVzVU_S8h7x7E4cYQSoKdPY3NGVw2yNnCg2iTm8Zc9vzc0TQozx7EipSkYlc5k1uqCC0jMgJqwIaWJ1oXZ3UGxfHjqhayOiPd_ZrRDw6jJ8MQt1EXPimgCQ9adRGChvlXtCufm',
            'Content-Type: application/json'
    );

    $ch = curl_init ();
    curl_setopt ( $ch, CURLOPT_URL, $url );
    curl_setopt ( $ch, CURLOPT_POST, true );
    curl_setopt ( $ch, CURLOPT_HTTPHEADER, $headers );
    curl_setopt ( $ch, CURLOPT_RETURNTRANSFER, true );
    curl_setopt ( $ch, CURLOPT_POSTFIELDS, $fields );

    $result = curl_exec ( $ch );
    echo $result;
    curl_close ( $ch );
}



sendGCM( "hello from console.", 'E9D9AB0B19BF5999BE3CFA36B44D2D33D7C865264BB92A47C5EA27D899C448F2' );
sendPushNotification( );

?>
