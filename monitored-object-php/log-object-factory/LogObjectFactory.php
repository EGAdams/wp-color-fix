<?php
/**
 * @description
 * creates log objects giving them a unique id, time stamp,
 * and determined calling method.
 *
 * @class LogObjectFactory
 */
class LogObjectFactory {
    public function __construct() {}

    public function createLogObject( $messageArg, $someObject ) {
        $time_now = time();
        $random_number = rand( 1, 1000000000000000 );
        $callingMethod = $this->getCallingMethod();
        return array(
            'timestamp'=> $time_now,
            'id'=> get_class( $someObject ) . "_" . $random_number . '_' . $time_now,
            'message'=> $messageArg,
            'method'=> $callingMethod
        );
    }
    private function getCallingMethod() {
        $e = new Exception();
        $trace = $e->getTrace();
        // position[ 0 ] would be this function so we ignore it
        // position[ 1 ] would be this function so we ignore it, needs adjusting
        return $trace[ 1 ][ 'function' ]; // TODO: is this right?
    }
}
