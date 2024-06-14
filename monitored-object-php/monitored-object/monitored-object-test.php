<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Monitored Object Test</title>
    <?php
    echo "including monitored object code now... <br>";
    error_reporting( E_ALL );
    include_once './MonitoredObject.php';
    echo "monitored object code included. <br>";
    function matchValueOrDie( $current_value, $correct_value ) {
        echo "current value: " . $current_value . "<br>";
        if ( $current_value != $correct_value ) {
            echo "*** ERROR: expected " . $correct_value . ", not " . $current_value .". ***";
            die();
        }
    }
    echo "match or die function defined.  creating object for config... <br>";
    $object = new stdClass();
    $object->new_id = '5';
    $object->table  = 'monitored_objects';
    echo "object created. <br>";
    // $object = json_decode( '{"property": {"foo": "bar"}, "hello": "world"}');
    // $config = json_decode( '{"new_id": "5", "table: "monitored_object"}');
    echo "before calling monitored object constructor... <br>";
    $monitoredObject = new MonitoredObject( $object );
    echo "monitoredObject constructed.  getting running color...<br>";
    matchValueOrDie( $monitoredObject->getMonitorLed()->getColor( "RUNNING"    ), "lightyellow"  );
    matchValueOrDie( $monitoredObject->getMonitorLed()->getColor( "PASS"       ), "lightgreen"   );
    matchValueOrDie( $monitoredObject->getMonitorLed()->getColor( "FAIL"       ), "#fb6666"      );
    echo "*** PASSED default color tests. ***";
    $monitoredObject->logUpdate( "*** ERROR: this is a test. ***" );
    ?>
</head>
<body>
    
</body>
</html>