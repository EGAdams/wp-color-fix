<?php
require_once 'Rewards.php';
if ( !class_exists( 'McbaUtil' )) {
    class McbaUtil {
		static $DEBUG = FALSE;
		public function __construct() {}
		public static function writeLog($method, $text_to_log) {
			date_default_timezone_set('EST');
			$format = "%.9s %-37.37s %.700s \r\n";
			$content = sprintf($format, date("g:i:s.u"), ":" . substr($method, -36, 36) . "() ", $text_to_log);
			file_put_contents ( dirname ( __FILE__ ) . "register.log", $content /*. "\r\n" */, FILE_APPEND | LOCK_EX );
			if ( MCBAUtil::$DEBUG === TRUE ) { echo $content . " <br>";	}
		}
		function __destruct() {}
	}
}
$scanned_points   = $_POST[ 'scanned_points'  ];
$email            = $_POST[ 'email'           ];
$password         = $_POST[ 'password'        ];
$points_on_device = $_POST[ 'points_on_device'];
$rewards_action	  = $_POST[ 'rewards_action'  ];
$pushid			  = $_POST[ 'pushid'          ];
$old_push_id	  = $_POST[ 'old_push_id'     ];
$first_name		  = $_POST[ 'first_name'      ];
$last_name		  = $_POST[ 'last_name'       ];
$mcba_id		  = $_POST[ 'mcba_id'         ];
McbaUtil::writeLog( "storeRewards.php", "POST: $scanned_points, $email, $password, $points_on_device, $rewards_action, $pushid, $old_push_id, $first_name, $last_name, $mcba_id" );
McbaUtil::writeLog( "storeRewards.php", "_POST: " . print_r( $_POST, true ));
$rewards = Rewards::create( $scanned_points, $email, $password, $points_on_device, $pushid );
McbaUtil::writeLog( "storeRewards.php", "after creation of Rewards object." );
if ($rewards_action === 'store') {
	$rewards->writeLog( __METHOD__, "the action is store.");
    $rewards->store();
    $rewards->writeLog( __METHOD__, "database points: " . $rewards->getDatabase_points());
    die( json_encode( array( 'database_points'	=> $rewards->getDatabase_points(), 'error' => "" )));
} else if ( $rewards_action === 'get' || $rewards_action === 'get_rewards' ) {
	$rewards->writeLog( "storeRewards.php", "the action is get." );
	$points_from_database = $rewards->get_points();
	$rewards->writeLog( "storeRewards.php",	"got $points_from_database points from the database, dying..." );
    die( json_encode( array(
    	'error'				=> "",
    	'email'				=> $rewards->getEmail(),
    	'points_on_device'	=> $rewards->getPoints_on_device(),
    	'password'			=> $rewards->getPassword(),
    	'scanned_points'	=> $rewards->getScanned_points(),
    	'rewards_action'	=> "get",
    	'database_points'	=> "$points_from_database" // must be a string! aug 15, 2018 -EG
    )));
}
?>