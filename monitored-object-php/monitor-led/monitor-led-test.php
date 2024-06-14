<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Monitor LED Data Test</title>
    
</head>
<body>
    <?php
    include_once "./MonitorLed.php";
    $config =  array( 'url' => "http://mycustombusinessapp.com" );
    $monitorLed = new MonitorLed( $config );
    echo "object created. <br>";
    ?>
</body>
</html>