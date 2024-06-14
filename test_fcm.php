<?php

// API access key from Google API's Console
define('API_ACCESS_KEY', 'AAAAAETEfow:APA91bHVzVU_S8h7x7E4cYQSoKdPY3NGVw2yNnCg2iTm8Zc9vzc0TQozx7EipSkYlc5k1uqCC0jMgJqwIaWJ1oXZ3UGxfHjqhayOiPd_ZrRDw6jJ8MQt1EXPimgCQ9adRGChvlXtCufm');

$fields = array(
    'to' => 'cXnE6-HlaaE:APA91bGSiimP5hUTneaXWNlWI5_R5ry802HT56BRjwD07srNnRIn3E-Vb1bKlWjNlpzm-x7wgRLD-ZJbIzFDiPVEcWY5ce0b0f1hjkyMDAWqHk9Dheat1iqFduWmAAHsU70KXIoaPAwW',
    'notification' => array(
        'title' => 'This is a test title',
        'body' => 'This is the body'
    ),
    'data' => array(
        // Example of custom key-value pairs
        'key1' => 'value1',
        'key2' => 'value2'
    ),
);

$headers = array(
    'Authorization: key=' . API_ACCESS_KEY,
    'Content-Type: application/json'
);

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, 'https://fcm.googleapis.com/fcm/send');
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($fields));
$result = curl_exec($ch);
curl_close($ch);

echo $result;
?>