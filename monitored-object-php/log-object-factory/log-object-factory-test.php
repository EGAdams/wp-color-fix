<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>LogObjectFactoryTest</title>
</head>
<body>
    <?php
        error_reporting( E_ALL );
        include_once './LogObjectFactory.php';
        echo "<h1>LogObjectFactoryTest started at time" . date( "h:i:sa" ) . "</h1>";
        echo "constructing log object factory... <br>";
        $factory = new LogObjectFactory();
        echo "no crash this time. <br>";
        if( !$factory ) {
            echo "!factory<br>";
        } else {
            echo "factory exists.<br>";
        }
        if ( method_exists( $factory, "createLogObject" )) {
            echo "passed existence test<br>";
        } else {
            echo "***ERROR: object does not exist. ***<br>";
        }
        echo "<h1>The time is " . date("h:i:sa") . "</h1>";
        $result = $factory->createLogObject( "i have been created.", $factory );

        echo "<br>timestamp: [" . $result[ "timestamp" ] . "]<br>";
        echo "id: [" . $result[ "id" ] . "]<br>";
        echo "message: [" . $result[ "message" ] . "]<br>";
        echo "method: [" . $result[ "method" ] . "]<br><br>";
        echo "end log object factory test.<br><br>";
    ?>
</body>
</html>