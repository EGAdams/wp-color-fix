<?php
error_reporting( E_ALL );
require_once( dirname( __DIR__, 1 ) . "/log-object-factory/LogObjectFactory.php" );
require_once( dirname( __DIR__, 1 ) . "/monitor-led/MonitorLed.php"              );
require_once( dirname( __DIR__, 1 ) . "/local-php-api/Model/ObjectModel.php"     );
require_once( dirname( __DIR__, 1 ) . "/local-php-api/FileLogger.php"            );
/** @class MonitoredObject */
class MonitoredObject {
    private $logObjects, $object_view_id, $objectModel, $logObjectFactory, $monitorLed;
    public function __construct( $config ) {
        if ( !is_object( $config )) {
            FileLogger::writeLog( __METHOD__, "*** ERROR: can not construct, no configuration. ***" ); die(); }
        
        $this->logObjects       = array();
        $this->object_view_id   = get_class( $this ) . "_" . $config->new_id;
        FileLogger::writeLog( __METHOD__, "inside MonitoredObject constructing " . $this->object_view_id . " ..." );
        $this->objectModel      = new ObjectModel( $config->table );
        $this->logObjectFactory = new LogObjectFactory(           );
        $this->monitorLed       = new MonitorLed( $config         );
        $this->objectModel->insertObject( $this->object_view_id, json_encode( $this )); }

    public function logUpdate( $message ) {
        if ( !$this->object_view_id ) { FileLogger::writeLog( __METHOD__, "*** ERROR: object needs an id to log. ***" ); return; }
        if ( strpos( $message, "ERROR"      ) !== false ) { $this->monitorLed->setFail(    $message ); } elseif
           ( strpos( $message, "finished"   ) !== false ) { $this->monitorLed->setPass(    $message ); } else {
                                                 $this->monitorLed->setLedText( $message ); }
        $logObject = $this->logObjectFactory->createLogObject( $message, $this );
        array_push( $this->logObjects, $logObject );
        $this->objectModel->updateObject( $this->object_view_id, json_encode( $this )); }
    
    public function getMonitorLed()   { return $this->monitorLed;     }
    public function getObjectViewId() { return $this->object_view_id; }
}
