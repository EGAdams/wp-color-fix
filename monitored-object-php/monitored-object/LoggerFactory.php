<?php
require_once( "MonitoredObject.php" );
class SaveConfigLogger       extends MonitoredObject { public function __construct( $config ) { parent::__construct( $config );}}
class RunQueryLogger         extends MonitoredObject { public function __construct( $config ) { parent::__construct( $config );}}
class McbaRunQueryLogger     extends MonitoredObject { public function __construct( $config ) { parent::__construct( $config );}}
class McbaFunctionsLogger    extends MonitoredObject { public function __construct( $config ) { parent::__construct( $config );}}
class RegisterLogger         extends MonitoredObject { public function __construct( $config ) { parent::__construct( $config );}}
class McbaPluginLogger       extends MonitoredObject { public function __construct( $config ) { parent::__construct( $config );}}
class DoActionMonitor        extends MonitoredObject { public function __construct( $config ) { parent::__construct( $config );}}
class IncRunQueryMonitor     extends MonitoredObject { public function __construct( $config ) { parent::__construct( $config );}}
class GetStatusMonitor       extends MonitoredObject { public function __construct( $config ) { parent::__construct( $config );}}
class AdminAjaxMonitor       extends MonitoredObject { public function __construct( $config ) { parent::__construct( $config );}}
class McbaStartupMonitor     extends MonitoredObject { public function __construct( $config ) { parent::__construct( $config );}}
class McbaChatMessageStartup extends MonitoredObject { public function __construct( $config ) { parent::__construct( $config );}}
class ChatMessageInput       extends MonitoredObject { public function __construct( $config ) { parent::__construct( $config );}}
class McbaChatMessageLog     extends MonitoredObject { public function __construct( $config ) { parent::__construct( $config );}}
class SendMessageLog         extends MonitoredObject { public function __construct( $config ) { parent::__construct( $config );}}
class MessageManagerLog      extends MonitoredObject { public function __construct( $config ) { parent::__construct( $config );}}
class IncrementLogger        extends MonitoredObject { public function __construct( $config ) { parent::__construct( $config );}}
class ChatListManagerLog     extends MonitoredObject { public function __construct( $config ) { parent::__construct( $config );}}
class McbaFirebaseViewer     extends MonitoredObject { public function __construct( $config ) { parent::__construct( $config );}}
class UpdateFirebaseToken    extends MonitoredObject { public function __construct( $config ) { parent::__construct( $config );}}
class MessagePostBuilderLog  extends MonitoredObject { public function __construct( $config ) { parent::__construct( $config );}}
class DatabaseRegisterLog    extends MonitoredObject { public function __construct( $config ) { parent::__construct( $config );}}
class GetLocationStatus      extends MonitoredObject { public function __construct( $config ) { parent::__construct( $config );}}
class UpdateLocationStatus   extends MonitoredObject { public function __construct( $config ) { parent::__construct( $config );}}
class GetRewardsLogger       extends MonitoredObject { public function __construct( $config ) { parent::__construct( $config );}}
class SetRewardsLogger       extends MonitoredObject { public function __construct( $config ) { parent::__construct( $config );}}
class GetRewardsAjax		 extends MonitoredObject { public function __construct( $config ) { parent::__construct( $config );}}
class CreateRewardCodes		 extends MonitoredObject { public function __construct( $config ) { parent::__construct( $config );}}
class MasterRewardsObject	 extends MonitoredObject { public function __construct( $config ) { parent::__construct( $config );}}
class MCBAFirebaseLogger	 extends MonitoredObject { public function __construct( $config ) { parent::__construct( $config );}}
class GetAdminTokenLogger	 extends MonitoredObject { public function __construct( $config ) { parent::__construct( $config );}}
class CreateConversationLogger	          extends MonitoredObject { public function __construct( $config ) { parent::__construct( $config );}}
class IncrementAdminUnreadLogger          extends MonitoredObject { public function __construct( $config ) { parent::__construct( $config );}}
class GetConversationListForAdminLogger	  extends MonitoredObject { public function __construct( $config ) { parent::__construct( $config );}}
class GetConversationIdFromDatabaseLogger extends MonitoredObject { public function __construct( $config ) { parent::__construct( $config );}}
class GetUserEmailFromDatabaseLogger      extends MonitoredObject { public function __construct( $config ) { parent::__construct( $config );}}
class GetRecipientTokenLogger             extends MonitoredObject { public function __construct( $config ) { parent::__construct( $config );}}

class GenericLogger {
	private $objectName;
    public function __construct( $objectName ) { $this->objectName = $objectName; }
    public function logUpdate(   $message    ) { McbaUtil::writeLog( $this->objectName, $message );}}

/** @class LoggerFactory */
class LoggerFactory {
    public static function getLogger( $objectName ) {
        if ( strpos( $objectName, 'McbaStartupMonitor' ) == -1 ) {
            McbaUtil::writeLog(__METHOD__, "inside LoggerFactory trying to construct " . $objectName . "..."); }
        try {
            $monitor_configuration_object         = new stdClass();
            $monitor_configuration_object->new_id = '2001';
            $monitor_configuration_object->table  = 'monitored_objects';
            $logger = new $objectName( $monitor_configuration_object );
            if ( strpos( $objectName, 'McbaStartupMonitor' ) == -1 ) {
                McbaUtil::writeLog(__METHOD__, $objectName . " constructed." ); }
        } catch( Exception $the_construction_exception ) {
            $logger = new GenericLogger( $objectName );
            McbaUtil::writeLog(__METHOD__, "*** ERROR: something wrong during construction.  assigning generic logger... ***" );
            $logger->logUpdate( $the_construction_exception->getMessage()); }
        return $logger; }
} ?>
