<?php
defined('ABSPATH') || exit;
use McbaUtil as GlobalMcbaUtil;


require_once dirname( __FILE__, 2 ) . "/monitored-object-php/monitored-object/LoggerFactory.php";
$mcbaFunctionsLogger = LoggerFactory::getLogger( "McbaFunctionsLogger" );
$mcbaFunctionsLogger->logUpdate( "McbaFunctionsLogger initialized. "   );
include_once 'MessageManager.php';
include_once 'SecurityTokenMailer.php';

// require_once __DIR__ . "/../runQuery.php";

if (!class_exists('McbaUtil')) {
	class McbaUtil {
		public function __construct() {
		}
		public static function writeLog($method, $text_to_log) {
			$format = "%.9s %-37.37s %.700s \r\n";
			$content = sprintf($format, date("g:i:s.u"), ":" . substr($method, -36, 36) . "() ", $text_to_log);
			file_put_contents(dirname( __FILE__ ) . "../register.log", $content/*. "\r\n" */, FILE_APPEND | LOCK_EX);
		}
		
		public function __destruct() {}
	}
}

//$mcbaFunctionsLogger->logUpdate( "McbaUtil constructed." );
require_once __DIR__ . "/../MCBAWriteLog.php";
//$mcbaFunctionsLogger->logUpdate( "creating new write log object..." );
$logger = new MCBAWriteLog();
//$mcbaFunctionsLogger->logUpdate( "done creating old database logger.  requiring runRawQuery.php..." );
// require_once __DIR__ . "/../runRawQuery.php";
//$mcbaFunctionsLogger->logUpdate( "done requiring runRawQuery.php." );
require_once __DIR__. "/../DatabaseRegister.php";

require_once "ChatListManager.php";
require_once "GetConversationListForAdmin.php";
require_once "SetAdminReadStatus.php";

define('MCBA_PANIC_BACKUP', "mcba_panic_backup" );

function initialize_database() {

	global $wpdb;
	$mcbaFunctionsLogger->logUpdate( "initializing database with , " . $wpdb->dbhost . ", " . $wpdb->dbname . ", " . $wpdb->dbuser . ", " . $wpdb->dbpassword );
	try {
		$db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_WARNING);
		return $db;
	} catch ( PDOException $e ) {
		file_put_contents('register.log', $e->getMessage() . '\r\n', FILE_APPEND | LOCK_EX);
		die(json_encode(array('error' => $e->getMessage()))); }}



$mcbaFunctionsLogger->logUpdate( "create hooks for Javascript to call ajax functions... " );

add_action( "wp_ajax_mcba_config", "mcba_config" );
add_action( "wp_ajax_mcba_save",   "mcba_save" );

add_action( "wp_ajax_mcba_settemplate", "mcba_setTemplate" );

// wordpress run query
add_action( "wp_ajax_mcba_run_query", "mcba_run_query" );
add_action( "wp_ajax_nopriv_mcba_run_query", "mcba_run_query" );

// get user run query
add_action( "wp_ajax_get_mcba_users", "get_mcba_users" );
add_action( "wp_ajax_nopriv_get_mcba_users", "get_mcba_users" );

// chat message input
add_action( "wp_ajax_chat_message_input", "chat_message_input" );
add_action( "wp_ajax_nopriv_chat_message_input", "chat_message_input" );

// send forgot password email notification
add_action( "wp_ajax_nopriv_send_forgot_password_email", "send_forgot_password_email" );
add_action( "wp_ajax_send_forgot_password_email"       , "send_forgot_password_email" );

// get chat users
add_action( "wp_ajax_nopriv_get_list_for_chat", "get_list_for_chat" );
add_action( "wp_ajax_get_list_for_chat"       , "get_list_for_chat" );

// get conversation list for admin
add_action( "wp_ajax_nopriv_get_conversation_list_for_admin", "get_conversation_list_for_admin" );
add_action( "wp_ajax_get_conversation_list_for_admin"       , "get_conversation_list_for_admin" );

// get firebase token from database
add_action( "wp_ajax_nopriv_update_token", "update_token" );
add_action( "wp_ajax_update_token"       , "update_token" );

// update or add new user to database
add_action( "wp_ajax_register_mcba",        "register_mcba" );
add_action( "wp_ajax_nopriv_register_mcba", "register_mcba" );

// get accept or deny status
add_action( "wp_ajax_get_location_dialog_status",        "get_location_dialog_status" );
add_action( "wp_ajax_nopriv_get_location_dialog_status", "get_location_dialog_status" );

// update accept or deny status
add_action( "wp_ajax_update_location_dialog_status",        "update_location_dialog_status" );
add_action( "wp_ajax_nopriv_update_location_dialog_status", "update_location_dialog_status" );

// get mcba rewards
add_action( "wp_ajax_get_mcba_rewards",        "get_mcba_rewards" );
add_action( "wp_ajax_nopriv_get_mcba_rewards", "get_mcba_rewards" );

// set mcba rewards
add_action( "wp_ajax_set_mcba_rewards",        "set_mcba_rewards" );
add_action( "wp_ajax_nopriv_set_mcba_rewards", "set_mcba_rewards" );

// get admin token
add_action( "wp_ajax_get_admin_token",        "get_admin_token" );
add_action( "wp_ajax_nopriv_get_admin_token", "get_admin_token" );

// set_admin_read_status
add_action( "wp_ajax_set_admin_read_status",        "set_admin_read_status" );
add_action( "wp_ajax_nopriv_set_admin_read_status", "set_admin_read_status" );

// get all users
add_action( "wp_ajax_get_all_mcba_users",        "get_all_mcba_users" );
add_action( "wp_ajax_nopriv_get_all_mcba_users", "get_all_mcba_users" );

// get conversation id
add_action( "wp_ajax_get_conversation_id",        "get_conversation_id" );
add_action( "wp_ajax_nopriv_get_conversation_id", "get_conversation_id" );

// verify password
add_action( "wp_ajax_verify_password",                "verify_password" );
add_action( "wp_ajax_nopriv_verify_password",         "verify_password" );


function set_admin_read_status() { $setter = new SetAdminReadStatus(); $setter->execute(); }
/* Done creating hooks for Javascript to call ajax functions */

function verify_password() {
    MCBAUtil::writeLog( __METHOD__, "*** inside verify password() method.. ***" );
	$database         = initialize_database();
	$databaseRegister = new DatabaseRegister( $_POST, $database );
    $databaseRegister->verifyPassword( $_POST[ 'email' ], $_POST[ 'password' ] );;
}    



function get_admin_token() {
	$mcbaFunctionsLogger->logUpdate( "getting admin token..." );
    /*
     * The contents of this internal buffer may be copied into a string variable using ob_get_contents().
     * To output what is stored in the internal buffer, use ob_end_flush().
     * Alternatively, ob_end_clean() will silently discard the buffer contents.
     */

    /*
     * also grabs admin email as of january 16, 2019 -EG
     * while we're at it, lets get the expert name too.  june 21, 2019 -EG
     */
    ob_start();
    global $wpdb;
    $logger = LoggerFactory::getLogger( "GetAdminTokenLogger" );
    $logger->logUpdate( "in get_admin_token()... "            );
    $db = new mysqli( $wpdb->dbhost, $wpdb->dbuser, $wpdb->dbpassword, $wpdb->dbname );
    if ($db->connect_errno) {
        printf("Connect failed: %s\n", $db->connect_error);
        exit(); }
    $query = "SELECT ID, first_name, last_name, pushid, email FROM wp_mcba_users WHERE isAdmin";
    $logger->logUpdate( "getting admin token... " );
    if ($result = mysqli_query($db, $query)) { $row = $result->fetch_assoc(); }
    $regid = $row[ "ID" ];
    // if the length of regid is zero log the error and return an error message
    if ( $regid == "" ) {
        $error_message = "*** ERROR: regid is empty. ***";
        $logger->logUpdate( $error_message );
        echo json_encode( $error_message );
        return; }
    $logger->logUpdate( "regid = " . $regid);
    $json_encoded = json_encode( array(
        "result"        => "success",
        "ID"            => $regid,
        "expert_name"   => "admin",
        "token"         => $row[ 'pushid'     ],
        "email"         => $row[ 'email'      ],
        "first_name"    => $row[ 'first_name' ],
        "last_name"     => $row[ 'last_name'  ]));
    $logger->logUpdate( "finished acquiring admin token, echoing valid result..." );
    ob_flush();
    echo $json_encoded; }


function get_location_dialog_status() {
	$logger = LoggerFactory::getLogger( "GetLocationStatus" );
	$logger->logUpdate( "initializing database..." );
    $database = initialize_database();
	$logger->logUpdate( "preparing sql command to get location dialog status..." );
	$statement = $database->prepare( "SELECT command_object FROM wp_commands  WHERE command_name='get_location_dialog_status'" );
	$logger->logUpdate( "executing..." );
	$statement->execute();
	$resulting_array = $statement->fetchAll();
	if ( strpos( $resulting_array[ 0 ][ 0 ], "response" )) {
		$logger->logUpdate( "finished execution echoing valid result..." );
		echo $resulting_array[ 0 ][ 0 ];
	} else {
		$error_message = "*** ERROR: no response.  There must be an initial setup problem. ***";
		$logger->logUpdate( $error_message );
		echo $error_message;
	}
}

function update_location_dialog_status() {
	$logger = LoggerFactory::getLogger( "UpdateLocationStatus" );
	$logger->logUpdate( "initializing database..." );
	$status    = $_GET[ 'status' ];
    $database  = initialize_database();
	$logger->logUpdate( "preparing sql command to update location dialog status..." );
	$statement = $database->prepare( 'UPDATE wp_commands SET command_object = ?  WHERE command_name = ?' );
	$logger->logUpdate( "executing..." );
	$statement->execute( array( "{ name: \"response\", value:\"$status\" }",  "update_location_dialog_status" ));
	// $resulting_array = $statement->fetchAll();
	$logger->logUpdate( "finished fetchAll()." );
	// echo $resulting_array[ 0 ][ 0 ];
}

function register_mcba() {  // _GET should be populated with user data at this point
	$mcbaFunctionsLogger->logUpdate( "inside register mcba... " );
	$database         = initialize_database();
	$databaseRegister = new DatabaseRegister( $_GET, $database );
	$databaseRegister->register(); }

function update_token() {
	$mcbaFunctionsLogger->logUpdate( "inside update_token..." );
	MCBAUtil::writeLog( __METHOD__, "constructing UpdateFirebaseToken logger... " );
    $update_logger = LoggerFactory::getLogger( "UpdateFirebaseToken"              );
	$mcbaFunctionsLogger->logUpdate(  "updating firebase token in the database..." );
	$user_email    = $_GET[ 'user_email'    ];
	$current_token = $_GET[ 'current_token' ];
	$update_logger->logUpdate( "user_email: $user_email" );
	$mcbaFunctionsLogger->logUpdate( "user_email: "    . $user_email   );
	$update_logger->logUpdate( "current_token: $current_token" );
	$mcbaFunctionsLogger->logUpdate( "current_token: " . $current_token);
	$query = "update wp_mcba_users set pushid='". $current_token . "' where email='" . $user_email . "'";
	$mcbaFunctionsLogger->logUpdate( "executing: " . $query . " ..." );
	$database = initialize_database();
	$statement = $database->prepare( $query );
	$update_logger->logUpdate( "executing query..." );
	$statement->execute(); 
    $update_logger->logUpdate( "finished executing query.  sending valid result..." );
    // echo JSON encode "success"
    echo json_encode( "success" );
}

function get_list_for_chat() {
	global $logger;
	$mcbaFunctionsLogger->logUpdate( "creating chat list manager..." );
	$chat_list_manager = new ChatListManager();
	$chat_list_manager->getList(); }

function get_conversation_list_for_admin() { $exe = new GetConversationListForAdmin(); $exe->run(); }

function send_forgot_password_email() {
    $logger = LoggerFactory::getLogger( "SendForgotPasswordEmailLog" );
    $logger->logUpdate( "constructing mailer... " );
	$mailer = new SecurityTokenMailer();
    $logger->logUpdate( "email: " . $_POST[ 'email' ] );
    $logger->logUpdate( "security_token: " . $_POST[ 'security_token' ] );
    $logger->logUpdate( "action: " . $_POST[ 'action' ] );
    $logger->logUpdate( "sending verification email... " );
	$mailer->send_verification_email();
    $logger->logUpdate( "finished sending verification email." ); }

function chat_message_input() {
	global $logger;
	$mcbaFunctionsLogger->logUpdate( "inside chat message input." );
	$logger->writeLog("{php} " . __METHOD__, "creating message manager..." );
	$messageManager = new MessageManager();
	$logger->writeLog("{php} " . __METHOD__, "message manager created.  calling build chat message..." );
	$message = $messageManager->buildChatMessage();
	$logger->writeLog("{php} " . __METHOD__, "back from build chat message.  sending message..." );
	$message->sendMessage( $messageManager->getConversationId());
	$logger->writeLog("{php} " . __METHOD__, "finished sending message." );
}

function get_mcba_users() {
	$logger = new MCBAWriteLog();
	$mcbaFunctionsLogger->logUpdate( "getting user..." );
	$email = $_GET[ 'email' ];
	$mcbaFunctionsLogger->logUpdate( "email: " . $email);
	$cleaned_query = "select * from wp_mcba_users where email='" . $email . "'";
	$mcbaFunctionsLogger->logUpdate( "executing: " . $cleaned_query . " ..." );
	$database = initialize_database();
	$statement = $database->prepare($cleaned_query);
	$statement->execute();
	$result = $statement->fetchAll();
	if (is_array($result)) {
		$database = null;
		$json_encoded_response = json_encode($result);
		$mcbaFunctionsLogger->logUpdate( "echoing response: " . $json_encoded_response . " ..." );
		echo $json_encoded_response;
		wp_die();
	} else {
		$mcbaFunctionsLogger->logUpdate( "*** WARNING: not sure what result is. ***" );
	}
}

function get_conversation_id() {
	$logger = new MCBAWriteLog();
	$mcbaFunctionsLogger->logUpdate( "getting user..." );
	$user = $_POST[ 'user' ];
	$mcbaFunctionsLogger->logUpdate( "user: " . $user);
	$query = "select conversation_id from wp_mcba_chat_conversations where user='" . $user . "'";
	$mcbaFunctionsLogger->logUpdate( "executing: " . $query . " ..." );
	$database = initialize_database();
	$statement = $database->prepare( $query );
	$statement->execute();
	$result = $statement->fetchAll();
	if (is_array( $result )) {
		$database = null;
		$json_encoded_response = json_encode($result);
		$mcbaFunctionsLogger->logUpdate( "echoing response: " . $json_encoded_response . " ..." );
		echo $json_encoded_response;
		wp_die();
	} else {
		$mcbaFunctionsLogger->logUpdate( "*** WARNING: not sure what result is. ***" );
	}
}

function get_all_mcba_users() {
	$mcbaFunctionsLogger->logUpdate( "getting all mcba users..." );
	$query = "select * from wp_mcba_users";
	$mcbaFunctionsLogger->logUpdate( "executing: " . $query . " ..." );
	$database = initialize_database();
	$statement = $database->prepare( $query );
	$statement->execute();
	$result = $statement->fetchAll();
	if ( is_array( $result )) {
		$database = null;
		$json_encoded_response = json_encode( $result );
		$mcbaFunctionsLogger->logUpdate( "echoing response: " . $json_encoded_response . " ..." );
		echo $json_encoded_response;
		wp_die();
	} else {
		$mcbaFunctionsLogger->logUpdate( "*** WARNING: not sure what result is. ***" );
	}
}

// MARK: runQuery()
date_default_timezone_set('America/New_York');
function runQuery( $database, $sql ) {
    // ini_set( 'display_errors', 0 );
    // ini_set( 'display_startup_errors', 0);
    // error_reporting( 0 ); // ( E_ALL );
    $text = "creating logger... ";
    file_put_contents( dirname( __FILE__ ) . '/runQuery.log', $text, FILE_APPEND | LOCK_EX );
    $logger = LoggerFactory::getLogger( "RunQueryLogger" );
    $logger->logUpdate( "RunQueryLogger initialized. " );
    if ( strlen( $sql ) == 0 ) {
        $logger->logUpdate( "*** ERROR: the length of sql is zero. ***" );
        die( json_encode( array( 'error' => "The length of the SQL statement is zero." )));
    }
    $logger->logUpdate( "enterying try... " );
	try {
        $logger->logUpdate( "use regular expression to extract words... " );
        preg_match_all('/[a-zA-Z_]\w*/', $sql, $matches);

        $logger->logUpdate( "matches[ 0 ] will now contain all the words found in the SQL" );
        $words = $matches[ 0 ];
        $logger->logUpdate( "preparing statement with SQL: $words... " );
        
		$statement = $database->prepare($sql);
		$statement->execute();
		$result = $statement->fetchAll();
        $logger->logUpdate( "creating text from result for file logger..." );
		$text = "\nresult[ 0 ]: " . $result[ 0 ];
        file_put_contents( dirname( __FILE__ ) . '/runQuery.log', $text . "\n", FILE_APPEND | LOCK_EX );
		if ( is_array( $result )) {
            $text = "\nresult[ 0 ]: " . $result[ 0 ];
            file_put_contents( dirname( __FILE__ ) . '/runQuery.log', $text . "\n", FILE_APPEND | LOCK_EX );
			return $result;
		} else {
			$logger->logUpdate( "*** WARNING: not sure what result is. ***" );
		}
		if ( $result ) {
            $text = "\nresult: " . $result;
            file_put_contents( dirname( __FILE__ ) . '/runQuery.log', $text . "\n", FILE_APPEND | LOCK_EX );
			return  $result;
		} else {
			if ( strlen( $result[ 0 ]) == 0 ) {
				$message = "no results *** SOULD  NNO T SEE THIS CRAAAOO *** .";
				// $logger->logUpdate( "returning zero results from query... ");
				return $message;
			} else {
				$error_message = "*** ERROR: i dont understand result.  is it an array?" . $sql . " ***";
				// $logger->logUpdate( $error_message );
				return $error_message;
			}
		}
	} catch ( PDOException $e ) {
		// $logger->logUpdate( "*** caught PDOException! *** " );
        $text = "\n". $e->getMessage() . "\n";
        file_put_contents( dirname( __FILE__ ) . '/runQuery.log', $text . "\n", FILE_APPEND | LOCK_EX );
		$logger->logUpdate( $e->getMessage());
		return json_encode(array('error' => $e->getMessage()));
		// die(json_encode(array('error' => $e->getMessage())));
	} // </ try>
} // </ runQuery>

function mcba_run_query() { // DataSource.js is connected here. // MARK: mcba_run_query()
    // header('Content-Type: application/json');
    
	$logger = LoggerFactory::getLogger( "McbaRunQueryLogger" );
    $logger->logUpdate( "McbaRunQueryLogger initialized." );
    $database = initialize_database();
    $logger->logUpdate( "database initialized." );
    if (strlen($_POST[ 'sql' ]) != 0) {
        $logger->logUpdate( "getting response with sql key..." );
        if ( isset( $_POST[ 'sql' ])) {
            $cleaned_query = str_replace("\\", "", $_POST[ 'sql' ]);
        } else {
            $logger->logUpdate( "*** ERROR: POST[ sql ] not set. ***" );
            die();
        }
        $logger->logUpdate( "before runQuery... " );
		$response = runQuery( $database, $cleaned_query );
        $logger->logUpdate( "done with runQuery.  setting database to null..." );
		$database = null;
	} else {
		$response = runQuery( $database, $_GET[ 'test' ] );
		$database = null;
	}

    $logger->logUpdate( "json encoding response..." );
	$json_encoded_response = json_encode( $response );
    $logger->logUpdate( "response length: ". strlen( $json_encoded_response ));
    $text = "\nechoing result: " . $json_encoded_response;
    file_put_contents( dirname( __FILE__ ) . '/runQuery.log', $text . "\n", FILE_APPEND | LOCK_EX );
    $logger->logUpdate( "echoing response now." );
	echo $json_encoded_response;
	wp_die();
}

function get_mcba_rewards() {
	try {
		MCBAUtil::writeLog( __METHOD__, "*** inside get_mcba_rewards! ***" );
		$logger = LoggerFactory::getLogger( "GetRewardsAjax" );
		$email = $_GET[ 'email' ];
		$logger->logUpdate( "initializing database..." );
		$database = initialize_database();
		$logger->logUpdate( "database initialized.  preparing statement... with email: [" . $email . "]" );
		$statement = $database->prepare ( 'SELECT rewards FROM wp_mcba_users WHERE email= ?' );
		$logger->logUpdate( "statement prepared.  executing statement..." );
		$statement->execute( array ( $_GET[ 'email' ]));
		$logger->logUpdate( "statement executed.  fetching result..." );
		$result = $statement->fetchAll();
		$rewards = $result [ 0 ][ 'rewards' ];
		$logger->logUpdate( "making sure the reward value is numeric... " );
		if ( is_numeric ( $rewards )) {
			$logger->logUpdate( "the fetch has finished.  rewards: [" . $rewards . "]" );
		} else { $logger->logUpdate( "*** ERROR: invalid reward value. ***" );
			     die ( json_encode( array( "result" => "failure", "rewards" => "not a number." )));}
		
		die ( json_encode( array( "result" => "success reading the rewards", "rewards" => $rewards )));
	} catch ( PDOException $e ) { die ( json_encode( array( 'error' => $e->getMessage())));	}}

function set_mcba_rewards() {
	try {
		MCBAUtil::writeLog( __METHOD__, "*** inside set_mcba_rewards! ***" );
		$logger = LoggerFactory::getLogger( "GetRewardsAjax" ); // TODO: change this to SetRewardsAjax
		$email = $_GET[ 'email' ];
		$logger->logUpdate( "initializing database..." );
		$database = initialize_database();
		$logger->logUpdate( "database initialized.  preparing statement... with email: [" . $email . "]" );
		$statement = $database->prepare ( 'UPDATE wp_mcba_users SET rewards=? WHERE email= ?' );
		$logger->logUpdate( "total_rewards: [" . $_GET[ 'total_rewards' ] ."] executing statement..." );
		$statement->execute( array ( $_GET[ 'total_rewards' ], $_GET[ 'email' ]));
		$logger->logUpdate( "statement executed." );
		$logger->logUpdate( "the fetch is done.  reward amount should be updated." );
	} catch ( PDOException $e ) { die ( json_encode( array( 'error' => $e->getMessage())));	}}

/**
 * Save/Launch/Revert the current mockup
 */
function mcba_save() {
    $logger = LoggerFactory::getLogger( "SaveConfigLogger" );
	$ret = array();

	/* Revert to last saved config */
	$postRevert = sanitize_text_field($_POST[ 'revert' ]);
	if (strlen($postRevert) > 0) {
		$latest_ctime = 0;
		$latest_filename = '';
		$d = dir( MCBA_BACKUP_DIR );
		$foundOne = false;

		/* Find the most recent saved file by date */
		while (($entry = $d->read()) !== false) {
			$foundOne = true;
			$filepath = MCBA_BACKUP_DIR . "/" . $entry;
			if (is_file($filepath) && filectime($filepath) > $latest_ctime) {
				$latest_ctime = filectime($filepath);
				$latest_filename = $entry;
			}
		}

		/* Use the file we found as your main config */
		if ($foundOne) {
			global $wp_filesystem;

			// Initialize the WP filesystem, no more using 'file-put-contents' function
			if (empty($wp_filesystem)) {
				require_once ABSPATH . '/wp-admin/includes/file.php';
				WP_Filesystem();
			}
			$config = $wp_filesystem->get_contents(MCBA_BACKUP_DIR . "/" . $latest_filename);
			if (!empty($config)) {
				file_put_contents(MCBA_TMP_CONFIG, $config);
				file_put_contents(MCBA_DIR . "www/", $config);
				$ret['response' ] = "Success " . $latest_filename;
			} else {
				$ret['revert' ] = false;
				$ret['response' ] = "Failed - Empty";
			}
		} else {
			$ret['revert' ] = false;
			$ret['response' ] = "Failed - No file";
		}
		echo json_encode($ret);
		die();
	} else {
		$logger->logUpdate( "this is not a reversion." );
	}

	/* Stop if no config is defined */
	if (empty(sanitize_text_field($_POST['config' ]))) {
		$ret['response' ] = "No config";
		echo json_encode($ret);
		die();
	}

	$logger->logUpdate( "POST[ config ] is not empty." );

	$config = json_decode(stripslashes(sanitize_text_field($_POST['config' ])), true);
	$configText = "var config_data = " . json_encode($config) . ";";
	// $logger->logUpdate( "configText: " . $configText);

	// Save locally! Feb 8, 2022
	$logger->logUpdate( "MCBA_LOCAL_MOCKUP: " . MCBA_LOCAL_MOCKUP);
	file_put_contents(MCBA_LOCAL_MOCKUP, $configText);

	// Save to template's config
	$logger->logUpdate( "MCBA_TMP_CONFIG: " . MCBA_TMP_CONFIG);
	file_put_contents(MCBA_TMP_CONFIG, $configText);

	/* Save Backup */
	$logger->logUpdate( "save backup to mcba backup directory: " . MCBA_BACKUP_DIR);

	if (!is_dir( MCBA_BACKUP_DIR )) { mkdir( MCBA_BACKUP_DIR ); }

	$logger->logUpdate( "putting file contents in MCBA_BACKUP_DIR..." );
    $logger->logUpdate( "MCBA_BACKUP_DIR: " . MCBA_BACKUP_DIR );
	file_put_contents(MCBA_BACKUP_DIR . time() . ".json", $configText);

	/* Save Panic Backup */
	$logger->logUpdate( "commented out putting file contents in MCBA_PANIC_BACKUP: " . MCBA_PANIC_BACKUP . "..." );
	// if (!is_dir(MCBA_PANIC_BACKUP)) {
	//     mkdir(MCBA_PANIC_BACKUP);
	// }
	// file_put_contents(MCBA_PANIC_BACKUP . time() . ".json", $configText );

	/* Launch */
	if (sanitize_text_field( $_POST[ 'launch' ]) == 1 ) {
		$logger->logUpdate( "We are launching to: " . MCBA_WWW_DIR );
		file_put_contents( MCBA_WWW_DIR . 'launch.log', "We are launching\r\n", FILE_APPEND | LOCK_EX );
		file_put_contents( MCBA_WWW_DIR . 'launch.log', $configText, FILE_APPEND | LOCK_EX );

		// Increment config version
		$ret['launch' ] = true;

		$version = intval(file_get_contents(MCBA_WWW_DIR . "version.txt"));
		file_put_contents(MCBA_WWW_DIR . "version.txt", $version + 1);

		// Set template directory
		$config['template' ] = MCBA_TEMPLATE_NAME;
		$configText = "var config_data = " . json_encode($config) . ";";

		// Save to main config
		$logger->logUpdate( "save to main config: " . MCBA_MAIN_CONFIG . "..." );
		file_put_contents(MCBA_MAIN_CONFIG, $configText);
		// $sitemap = file_get_contents( MCBA_SITEMAP ); used in last part of this if statement

        $logger->logUpdate( "saving to: " . MCBA_LOCAL_MOCKUP . "..." );
        file_put_contents( MCBA_LOCAL_MOCKUP, $configText );
        // define('MCBA_LOCAL_MOCKUP', MCBA_DIR . "www/app_config.json");

        $logger->logUpdate( "save to: " . MCBA_TMP_CONFIG . "..." );
        file_put_contents( MCBA_TMP_CONFIG, $configText );
        // define('MCBA_TMP_CONFIG', MCBA_TEMPLATE . 'app_config.json');

        // save to new MCBA_SMART_PHONE_SOURCE directory
        $logger->logUpdate( "save to: " . MCBA_SMART_PHONE_SOURCE . "..." );
        file_put_contents( MCBA_SMART_PHONE_SOURCE, $configText );

		/* Push update to devices */
		$result = mcba_send_message("launch", "This app has been updated in the background.", "all", "", "", "", "", "" );

		/* Make sure account is active (Paying) before launching */
		if ($result['error_code' ] === -1) {
			$ret['response' ] = "Account is not active, please sign up to use this feature.";
			$ret['error' ] = 1;
			echo json_encode($ret);
			die();
		}
	} else {
		$ret['launch' ] = false;
		$logger->logUpdate( "POST[ launch ] is empty.  no action taken. " );
	}

	$ret['response' ] = "Success";
	echo json_encode($ret);
	die();
} 

function mcba_getTemplates() {
	$templates = array();
	foreach (glob(MCBA_TEMPLATES_DIR . "*", GLOB_ONLYDIR) as $dir) {
		$templates[] = basename($dir);
	}
	return $templates;
}

function mcba_setTemplate() {
	$templateName = sanitize_text_field($_POST['template' ]);
	if (!$templateName) {
		echo json_encode(array("response" => "Template not set"));
		die();
	}
	global $wpdb;
	$wpdb->query("UPDATE " . $wpdb->prefix . "mcba SET `template_dir` = '" . $templateName . "'" );
	echo json_encode(array("response" => "Success"));
	die();
}

function mcba_needlogin() {
	echo "login";
	die();
}

function mcba_get_editor() {
	// $mcba_data = sanitize_text_field( $_POST[ 'data' ]);
	// $content = $mcba_data['content' ];
	// $editor_id = $mcba_data['id' ];
	$editor_id = 1;

	if ($editor_id == "") {
		return;
	}
	echo wp_editor("", $editor_id, array(
		'_content_editor_dfw' => true,
		'tabfocus_elements' => $editor_id,
		'textarea_name' => 'textitem',
		'editor_height' => 300,
		'drag_drop_upload' => false,
		'media_buttons' => false,
		'quicktags' => false,
		'tinymce' => array(
			'resize' => false,
			'wp_autoresize_on' => true,
			'add_unload_trigger' => false,
		),
	));
}

function mcba_get_base_editor($content, $newid) {
	global $editor_id;
	$settings = array(
		'media_buttons' => false,
		'drag_drop_upload' => false,
	);
	echo "<script type='text/javascript'>mcba_editor = '";
	ob_start();

	wp_editor("", $newid, array(
		'_content_editor_dfw' => true,
		'tabfocus_elements' => $editor_id,
		'textarea_name' => 'textitem',
		'editor_height' => 300,
		'drag_drop_upload' => false,
		'media_buttons' => false,
		'quicktags' => false,
		'tinymce' => array(
			'resize' => false,
			'wp_autoresize_on' => true,
			'add_unload_trigger' => false,
		),
	));

	$result = ob_get_clean();
	$newResult = addcslashes(trim(preg_replace('/\s+/', ' ', $result)), "'" );
	echo $newResult . "';</script>";
	return $content;
}

function mcba_set_image_none() { echo ""; wp_die(); }

function mcba_set_image() {
    $attachment_id = sanitize_text_field($_POST['attachment_id' ]);
	$media_file = get_attached_file($attachment_id);
	$new_media_file = MCBA_IMG_DIR . basename($media_file);
	if( copy( $media_file, $new_media_file )) {
        echo basename( $media_file );
    } else {
        echo "Error: could not copy file [". $media_file . "] to [". $new_media_file. "]";
    }    
	wp_die();
}

add_action( "wp_ajax_nopriv_mcba_set_image", "mcba_set_image_none" );
add_action( "wp_ajax_mcba_set_image", "mcba_set_image" ); 
