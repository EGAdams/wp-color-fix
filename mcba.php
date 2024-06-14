<?php

/*
Plugin Name: My Custom Business App
Plugin URI:
Description: Allow admin to create a synced mobile app
Version: 1.7.5.27
Author: All Web n Mobile
Author URI: https://www.allwebnmobile.com
License: Proprietary
 */

if (!class_exists( 'McbaUtil')) {
	class McbaUtil {
		public function __construct() {}
		public static function writeLog($method, $text_to_log) {
			$format = "%.9s %-37.37s %.700s \r\n";
			$content = sprintf( $format, date("g:i:s.u" ), ":" /*. substr($method, -36, 36) */ . "() ", $text_to_log);
			file_put_contents(dirname(__FILE__) . "/register.log", $content/*. "\r\n" */, FILE_APPEND | LOCK_EX);}

		public function __destruct() {}
	}
}
$local_php_api_log = "./wp-content/plugins/MCBA-Wordpress/monitored-object-php/local-php-api/error_log";
$wp_admin_log = "./wp-admin/error_log";
$wp_includes_log = "./wp-includes/error_log";

date_default_timezone_set( 'America/New_York');
function mprint($text) {
	file_put_contents(dirname(__FILE__) . "/register.log", date("h:i:sa" ) . ": " .
		$text . "\n", FILE_APPEND | LOCK_EX);
}

file_put_contents( 'register.log', 'building logger...' . '\r\n', FILE_APPEND | LOCK_EX);
require_once dirname( __FILE__ ) . "/monitored-object-php/monitored-object/LoggerFactory.php";
$mcba_logger = LoggerFactory::getLogger( "McbaPluginLogger" );
$mcba_logger->logUpdate( "logger initialized." );
file_put_contents( 'register.log', 'logger built.' . '\r\n', FILE_APPEND | LOCK_EX);
date_default_timezone_set('America/New_York');

$mcba_logger->logUpdate( "checking for security token... " );
$mcba_logger->logUpdate( "checking for security token... " );
// check for security token...
$security_token = "";
if (isset($_GET['security_token'])) {
	$security_token = $_GET['security_token'];
	mprint("security_token set to: " . $security_token);
}
define( 'MCBA_CHAT_SECURITY_TOKEN_LENGTH', 25);
define( 'MCBA_CHAT_SECURITY_TOKEN_LIFE_SPAN', 600); // 10 minutes
define( 'MCBA_MAP_KEY', '');
defined( 'ABSPATH') || exit;
define( 'MCBA_DIR', plugin_dir_path(__FILE__));
define( 'MCBA_INC_DIR', trailingslashit(MCBA_DIR . 'inc'));
define( 'MCBA_IMG_DIR', trailingslashit(MCBA_DIR . 'www/images'));
define( 'MCBA_URL', plugin_dir_url(__FILE__));
define( 'MCBA_UPLOAD_URL', MCBA_URL . 'upload.php');
define( 'MCBA_IMG_URL', trailingslashit(MCBA_URL . 'www/images'));
define( 'MCBA_ICON', MCBA_IMG_URL . 'menuicon.png');
define( 'MCBA_CSS_URL', trailingslashit(MCBA_URL . 'css'));
define( 'MCBA_JS_URL', trailingslashit(MCBA_URL . 'js'));
define( 'MCBA_HOME_PAGE', 0);
define( 'MCBA_SIDEBAR_TEXT', "My Custom Business App" );
define( 'MCBA_MAIN_HEADER', "My Custom Business App" );

$wp_upload[] = wp_upload_dir();
$uploads_basedir = $wp_upload[0]['basedir'];
define( 'MCBA_UPLOADS_DIR', $uploads_basedir);

define( 'MCBA_WWW_DIR', trailingslashit(MCBA_UPLOADS_DIR . "/MCBA/www/" ));
define( 'MCBA_MAIN_CONFIG', MCBA_WWW_DIR . 'app_config.json');
define( 'MCBA_SITEMAP', MCBA_WWW_DIR . 'sitemap.php');
define( 'MCBA_APP_DIR', trailingslashit(MCBA_UPLOADS_DIR . "/MCBA/www/" ));


// $writer->writeLog( "mcba.php", "MCBA_DIR: " .  MCBA_DIR );
// $writer->writeLog( "mcba.php", "MCBA_INC_DIR: " .  MCBA_INC_DIR );
// $writer->writeLog( "mcba.php", "MCBA_MAIN_CONFIG: " .  MCBA_MAIN_CONFIG );
// $writer->writeLog( "mcba.php", "MCBA_SITEMAP: " .  MCBA_SITEMAP );
// $writer->writeLog( "mcba.php", "MCBA_IMG_DIR: " .  MCBA_IMG_DIR );
// $writer->writeLog( "mcba.php", "MCBA_UPLOAD_URL: " .  MCBA_UPLOAD_URL );
// $writer->writeLog( "mcba.php", "MCBA_IMG_URL: " .  MCBA_IMG_URL );
// $writer->writeLog( "mcba.php", "MCBA_ICON: " .  MCBA_ICON );
// $writer->writeLog( "mcba.php", "MCBA_CSS_URL: " .  MCBA_CSS_URL );
// $writer->writeLog( "mcba.php", "MCBA_JS_URL: " .  MCBA_JS_URL );
// $writer->writeLog( "mcba.php", "MCBA_UPLOADS_DIR: " .  MCBA_UPLOADS_DIR );
// $writer->writeLog( "mcba.php", "MCBA_WWW_DIR: " .  MCBA_WWW_DIR );
// $writer->writeLog( "mcba.php", "MCBA_APP_DIR: " .  MCBA_APP_DIR );

class McbaDataSource {
	private $time, $class_method, $message, $database, $json, $logger;

	public function __construct($jsonArg) {
		$this->json = $jsonArg;
		$this->json = json_decode($jsonArg);
		$this->database = $this->initialize_database();
		$this->time = date("Y-m-d H:i:s" );
		$this->logger = new MCBAWriteLog();
		$this->logger->writeLog("McbaDatasource.php", "data source object constructed." );
		$this->logger->writeLog("McbaDatasource.php", "jsonArg: " . $jsonArg);
	}

	public function recordAck($author, $time, $message) {
		global $logger;
		$query = "UPDATE wp_mcba_chat_messages SET ACK='1' WHERE sender_id='" . $author . "' AND time='" . $time . "' AND message='" . $message . "'";
		$logger->writeLog("{php} " . __METHOD__, "query: " . $query);
		$statement = $this->database->prepare($query);
		$statement->execute();
		$statement = null;
	}

	public function clearTable() {
		$query = "DELETE FROM `" . $this->json->table . "` WHERE 1";
		$statement = $this->database->prepare($query);
		$result = $statement->execute();
		return $result;
	}

	public function clear_wp_mcba_chat_conversations_table() {
		$query = "DELETE FROM wp_mcba_chat_conversations WHERE admin='expert@somebusiness.com'";
		$statement = $this->database->prepare($query);
		$result = $statement->execute();
		return $result;
	}

	public function insert_test() {
		$statement = $this->database->prepare(
			'INSERT INTO test_table ( ' . $this->json->rows . ') VALUES(?, ?, ?)'
		);

		$test_id = $this->json->test_id;
		$test_message = $this->json->test_message;
		$test_status = $this->json->test_status;

		$result = $statement->execute(array(
			$test_id,
			$test_message,
			$test_status,
		));
	}

	public function insert_into_wp_mcba_chat_conversations() {
		$statement = $this->database->prepare(
			'INSERT INTO wp_mcba_chat_conversations ( ' . $this->json->rows . ') VALUES(?, ?, ?, ?)'
		);

		$result = $statement->execute(array(
			"jane@gmail.com",
			"expert@somebusiness.com",
			"2019",
			"2019",
		));
	}

	public function get_wp_mcba_chat_conversations_rows() {
		$query = "SELECT " . $this->json->rows;
		$query .= " FROM wp_mcba_chat_conversations";
		$query .= " WHERE admin='expert@somebusiness.com'";

		$statement = $this->database->prepare($query);
		$result = $statement->execute();
		$queryResult = $statement->fetchAll();
		return $queryResult[0];
	}

	public function getRows() {
		$this->logger->writeLog(__METHOD__, "getting rows json =" . $this->json);
		$query = "";
		if ($this->json->rows == "*" ) {
			$query = "SELECT * from " . $this->json->table;
			if (strlen($this->json->conditions) == 0) {

				// return all rows
				$statement = $this->database->prepare($query);
				$result = $statement->execute();
				return $result;
			}
		} else {
			$query .= "SELECT " . $this->json->rows;
			//             foreach ($rowNames as $row) {
			//                 $query .= $row . ", ";
			//             }
			$query .= " FROM " . $this->json->table;
			if (strlen($this->json->conditions) > 0) {
				$query .= " WHERE " . $this->json->conditions;
				//                 $loopCount = 0;
				//                 foreach ($wheres as $condition) {
				//                     if($loopCount++ > 0) {        // and if there's more...
				//                         $query .= " AND ";
				//                     }
				//                     $query .= $condition;
				//                 }
			}

			$this->logger->writeLog(__METHOD__, "query: " . $query);

			$statement = $this->database->prepare($query);
			$result = $statement->execute();
			$queryResult = $statement->fetchAll();
			//            McbaUtil::writeLog(__METHOD__, "result: " . $result);
			return $queryResult[0];
		}
	}

	private function initialize_database() {
		global $wpdb;
		try {
			$database = new PDO( 'mysql:host=' . $wpdb->dbhost . '; dbname=' . $wpdb->dbname, $wpdb->dbuser, $wpdb->dbpassword);
			$database->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_WARNING);
			return $database;
		} catch (PDOException $pDoException) {
			mprint("caught exception in mcba.php line 279 in McbaDataSource initialize_database()" );
			file_put_contents( 'register.log', $pDoException->getMessage() . '\r\n', FILE_APPEND | LOCK_EX);
			die(json_encode(array( 'error' => $pDoException->getMessage())));}}

	public function __destruct() {}
}

global $wpdb;
$templateDir = $wpdb->get_var( 'SELECT `template_dir` FROM ' . $wpdb->prefix . 'mcba');
$clientId = $wpdb->get_var( 'SELECT `mcba_id` FROM ' . $wpdb->prefix . 'mcba');

if (!$templateDir) {
	$templateDir = 'BusinessTemplate';
	$rows = $wpdb->get_results("SELECT * FROM " . $wpdb->prefix . "mcba" );
	if (count($rows) > 0) {
		$wpdb->query("UPDATE " . $wpdb->prefix . "mcba SET template_dir = " . $templateDir . " WHERE 1" );
	} else {
		$wpdb->query("INSERT INTO " . $wpdb->prefix . "mcba (`template_dir`) VALUES ( '" . $templateDir . "')" );
	}
}

$STATUS = null;
if (empty($clientId)) {
	$STATUS = register(1);
} else {
	$STATUS = getStatus($clientId);
}

// define( 'ACTIVE', $STATUS['active']);
define( 'ACTIVE', 1); // TODO: change this for production!
define( 'MCBA_ID', $clientId);
define( 'MCBA_TEMPLATE_NAME', $templateDir);
define( 'MCBA_WWW_URL', trailingslashit(MCBA_UPLOADS_DIR . "/MCBA/www/" ));
define( 'MCBA_TEMPLATES_DIR', trailingslashit(MCBA_WWW_DIR . 'templates'));
define( 'MCBA_TEMPLATES_URL', trailingslashit(MCBA_WWW_URL . 'templates'));
define( 'MCBA_TEMPLATE_URL', trailingslashit(MCBA_TEMPLATES_URL . $templateDir));
define( 'MCBA_TEMPLATE', trailingslashit(MCBA_TEMPLATES_DIR . $templateDir));
define( 'MCBA_BACKUP_DIR', trailingslashit(MCBA_TEMPLATE . 'backup'));
// define( 'MCBA_CONFIG_URL', MCBA_TEMPLATE_URL . 'app_config.json');

// Public storage for template .. maybe not...
define( 'MCBA_CONFIG_URL', "https://mycustombusinessapp.com/wp-content/plugins/MCBA-Wordpress/www/app_config.json" );
// define( 'MCBA_CONFIG_URL', MCBA_DIR . "www/app_config.json" );

// local storage for template
// added on February 8, 2022.  I don't see why to save this in an upload folder so we are going to save it here
define( 'MCBA_SMART_PHONE_SOURCE', MCBA_DIR . "www/templates/TemplateTwo/app_config.json" );
define( 'MCBA_LOCAL_MOCKUP', MCBA_DIR . "www/app_config.json" );
define( 'MCBA_TMP_CONFIG', MCBA_TEMPLATE . 'app_config.json');
define( 'MCBA_WWW_INDEX', MCBA_WWW_URL . 'index.php?template=' . $templateDir . "&name=" . time());
define( 'MCBA_APP_URL', trailingslashit(MCBA_UPLOADS_DIR . "/MCBA/app" ));

// $writer->writeLog( "mcba.php", "MCBA_ID: " .  MCBA_ID );
// $writer->writeLog( "mcba.php", "MCBA_TEMPLATE_NAME: " .  MCBA_TEMPLATE_NAME );
// $writer->writeLog( "mcba.php", "MCBA_WWW_URL: " .  MCBA_WWW_URL );
// $writer->writeLog( "mcba.php", "MCBA_TEMPLATES_DIR: " .  MCBA_TEMPLATES_DIR );
// $writer->writeLog( "mcba.php", "MCBA_TEMPLATES_URL: " .  MCBA_TEMPLATES_URL );
// $writer->writeLog( "mcba.php", "MCBA_TEMPLATE_URL: " .  MCBA_TEMPLATE_URL );
// $writer->writeLog( "mcba.php", "MCBA_CONFIG_URL: " .  MCBA_CONFIG_URL );
// $writer->writeLog( "mcba.php", "MCBA_BACKUP_DIR: " .  MCBA_BACKUP_DIR );
// $writer->writeLog( "mcba.php", "MCBA_TMP_CONFIG: " .  MCBA_TMP_CONFIG );
// $writer->writeLog( "mcba.php", "MCBA_WWW_INDEX: " .  MCBA_WWW_INDEX );
// $writer->writeLog( "mcba.php", "MCBA_APP_URL: " .  MCBA_APP_URL );

//include_once MCBA_INC_DIR . 'widget.php';
$mcba_logger->logUpdate( "including from the mcba include directory... " );
include_once MCBA_INC_DIR . 'mockup.php';
$mcba_logger->logUpdate( "including mcba_functions.php... " );
include_once MCBA_INC_DIR . 'mcba_functions.php';
include_once MCBA_INC_DIR . 'parser.php';
$mcba_logger->logUpdate( "including promoblast-page.php... " );
include_once MCBA_INC_DIR . 'promoblast-page.php';
include_once MCBA_INC_DIR . 'proxiblast-page.php';
include_once MCBA_INC_DIR . 'usermaint-page.php';
$mcba_logger->logUpdate( "including createrewards-page.php... " );
include_once MCBA_INC_DIR . 'createrewards-page.php';
include_once MCBA_INC_DIR . 'app_install-page.php';
include_once MCBA_INC_DIR . 'messaging-page.php';
include_once MCBA_DIR . 'promoblast.php';
include_once MCBA_DIR . 'qr_generator.php';
include_once MCBA_DIR . 'handle_skeleton_dir.php';
include_once MCBA_DIR . 'backup.php';
include_once MCBA_DIR . 'McbaChatMessage.php';
include_once MCBA_DIR . 'MCBAFirebase.php';
include_once MCBA_DIR . 'MCBAWriteLog.php';
include_once './MCBAFirebase.php';

$writer = new MCBAWriteLog();
/* Show the sidebar menu item if in the admin panel */
if (is_admin()) {
	include_once MCBA_INC_DIR . 'options.php';
}

register_activation_hook(__FILE__, 'mcba_activate');
add_action( 'plugins_loaded', 'mcba_load_text_domain');
add_action( 'wp_ajax_mcba_get_editor', 'mcba_get_editor');

function register( $registration_id ) {
    $register_logger = LoggerFactory::getLogger( "RegisterLogger" );
    $register_logger->logUpdate( "register logger initialized." );
	global $wpdb;
    require_once dirname( __FILE__ ) . '/MCBAFirebase.php';
	$firebase = new MCBAFirebase( $registration_id );	/* Register */
	$authorizationKey = $firebase->authorizationKey;
	$base = home_url( '/');
	$mcba = str_replace($base, "", MCBA_URL);
	$fields = array(
		'mcba_url' => MCBA_URL,
		'baseURL' => $base,
		'MCBA_Dir' => $mcba,
		'Shop_Dir' => "shop/",
		'mcba_register' => 'register_plugin',
	);
	$args = array(
		'timeout' => 45,
		'redirection' => 5,
		'httpversion' => '1.1',
		'method' => 'POST',
		'body' => json_encode( $fields),
		'sslverify' => false,
		'headers' => array(
			'Content-Type' => 'application/json',
			'Authorization' => 'key=' . $authorizationKey,
		),
		'cookies' => array(),
	);
	$result = wp_remote_post( 'http://mycustombusinessapp.com/MCBA-MasterServer/register.php', $args );
	$jsonBody = json_decode($result['body']);
	$mcba_id = "0"; // <--------- what is this? ------------<< TODO: find out!
    if ( !isset( $jsonBody )) {
        $register_logger->logUpdate( "*** ERROR: no response from register.php ***" );
        die();
    }
	if (!$jsonBody->result == "Invalid Request " ) {
		if (!json_decode($result[0])) {
			// echo "FAIL: " . $result;
		} else {
			/* Save the id to the database */
			$rows = $wpdb->get_results("SELECT * FROM " . $wpdb->prefix . "mcba" );
			if (count($rows) > 0) {
				$wpdb->query("UPDATE " . $wpdb->prefix . "mcba
                SET `mcba_id` = '" . $mcba_id . "'
                WHERE 1" );
			} else {
				$wpdb->query("INSERT INTO " . $wpdb->prefix . "mcba
                (`mcba_id`,`template_dir`)
                VALUES ( '" . $mcba_id . "', 'BusinessTemplate')" );
			}
		}
	} else {
        $register_logger->logUpdate( "finished getting mcba id: " . $mcba_id );
		return getStatus($mcba_id);
	}
	$mcba_id = $jsonBody->mcba_id;
    $register_logger->logUpdate( "finished getting mcba id: " . $mcba_id );
	return getStatus($mcba_id);
}

function getStatus($mcba_id) {
    // McbaUtil::writeLog( __METHOD__, "getting status for mcba_id: " . $mcba_id );
	$args = array(
		'method' => 'POST',
		'headers' => array(
			'Content-type: application/x-www-form-urlencoded',
		),
		'sslverify' => false,
		'body' => array(
			'mcba_id' => $mcba_id,
			'mcba_action' => 'status',
		),
	);

	$result = wp_remote_post( 'http://mycustombusinessapp.com/MCBA-MasterServer/proxy.php', $args );

	if (is_wp_error($result)) {
		$error_message = $result->get_error_message();
		McbaUtil::writeLog(__METHOD__, "Something went wrong: $error_message" );
	}

	if (is_array($result) && isset($result['error'])) {
		echo "Error: <br>";
		return $result;
	}

	// $jsonBody = json_decode($result['body']);
	// $result = ""; //$jsonBody->status;
	return $result;
}

/**
 * Load plugin text domain
 *
 * @return void
 */
function mcba_load_text_domain() {
	load_plugin_textdomain( 'mcba', false, dirname(plugin_basename(__FILE__)) . '/lang/');
}

function insert_default_configuration_values() {
    global $wpdb;
    $table_name = $wpdb->prefix . 'mcba_chat_configuration'; // The full table name with prefix

    $values = array(
        array('id' => 1, 'configuration_name' => 'chat_main_color', 'configuration_value' => '#e67d05'),
        array('id' => 2, 'configuration_name' => 'chat_system_enabled', 'configuration_value' => '1'),
        array('id' => 3, 'configuration_name' => 'phone_number', 'configuration_value' => '7274855221'),
		array('id' => 4, 'configuration_name' => 'phone_icon_color', 'configuration_value' => '#0000ff'),
    );

    foreach ($values as $value) {
        $wpdb->replace(
            $table_name,
            array(
                'id' => $value['id'],
                'configuration_name' => $value['configuration_name'],
                'configuration_value' => $value['configuration_value']
            ),
            array(
                '%d', // Placeholder format for 'id', as it's an integer
                '%s', // Placeholder format for 'configuration_name', as it's a string
                '%s'  // Placeholder format for 'configuration_value', as it's a string
            )
        );
    }
}

/**
 * Create table and register an option when activate
 *
 * @return void
 */
function mcba_activate() {
	global $wpdb;

	// Create tables

	// chat configurations
	$query = $wpdb->query( 'CREATE TABLE IF NOT EXISTS ' . $wpdb->prefix . 'mcba_chat_configuration (
      `id` int(11) NOT NULL AUTO_INCREMENT,
	  `configuration_name` varchar(1000) NOT NULL,
	  `configuration_value` varchar(1000) NOT NULL,
	    PRIMARY KEY (`id`)
	) COLLATE utf8_general_ci;');

    insert_default_configuration_values(); // now populate...

	// wp_mcba
	$query = $wpdb->query( 'CREATE TABLE IF NOT EXISTS ' . $wpdb->prefix . 'mcba (
      `id` int NOT NULL AUTO_INCREMENT,
	  `mcba_id` int,
	  `template_dir` text,
	    PRIMARY KEY (`id`)
	) COLLATE utf8_general_ci;');

	// wp_mcba_chat_conversations
	$query = $wpdb->query( 'CREATE TABLE IF NOT EXISTS ' . $wpdb->prefix . 'mcba_chat_conversations (
      `conversation_id` int(11) NOT NULL AUTO_INCREMENT,
      `user` varchar(50) COLLATE utf8_unicode_ci NOT NULL,
      `admin` varchar(50) COLLATE utf8_unicode_ci NOT NULL,
      `admin_unread_messages` int(11) NOT NULL,
      `user_unread_messages` int(11) NOT NULL,
      `mcba_chat_system_id` varchar(50) COLLATE utf8_unicode_ci NOT NULL,
        UNIQUE (`conversation_id`, `user`)
    ) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;');

	// wp_mcba_chat_messages
	$query = $wpdb->query( 'CREATE TABLE IF NOT EXISTS ' . $wpdb->prefix . 'mcba_chat_messages (
      `message_id` int(11) NOT NULL AUTO_INCREMENT,
      `conversation_id` int(11) NOT NULL,
      `time` varchar(20) COLLATE utf8_unicode_ci NOT NULL,
      `author` varchar(50) COLLATE utf8_unicode_ci NOT NULL,
      `message` text COLLATE utf8_unicode_ci NOT NULL,
      `sender_id` varchar(50) COLLATE utf8_unicode_ci NOT NULL,
      `firebase_result` tinyint(1) NOT NULL COMMENT "result of 0 is a failure",
      `ACK` tinyint(1) NOT NULL,
      `object_data` varchar(1000) COLLATE utf8_unicode_ci NOT NULL,
      `readstatus` int(11) NOT NULL,
        UNIQUE(`message_id`)
    ) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;');

	// wp_mcba_users
	$query = $wpdb->query( 'CREATE TABLE IF NOT EXISTS ' . $wpdb->prefix . 'mcba_users (
      `ID` int(11) NOT NULL AUTO_INCREMENT,
      `first_name` varchar(64) COLLATE utf8_unicode_ci NOT NULL,
      `last_name` varchar(64) COLLATE utf8_unicode_ci NOT NULL,
      `rewards` int(6) NOT NULL,
      `device` text COLLATE utf8_unicode_ci NOT NULL,
      `email` varchar(64) COLLATE utf8_unicode_ci NOT NULL,
      `password` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
      `pushid` text COLLATE utf8_unicode_ci NOT NULL,
      `uid` text COLLATE utf8_unicode_ci NOT NULL,
      `isAdmin` tinyint(1) NOT NULL,
      `security_object` varchar(5000) COLLATE utf8_unicode_ci NOT NULL,
        PRIMARY KEY (`ID`)
    ) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;');

	// wp_chat_timezones
	$query = $wpdb->query( 'CREATE TABLE IF NOT EXISTS ' . $wpdb->prefix . 'chat_timezones (
      `selected` tinyint(1) NOT NULL,
      `timezone` varchar(50) NOT NULL
    ) ENGINE=InnoDB DEFAULT CHARSET=latin1;');

	// debug_log
	$query = $wpdb->query( 'CREATE TABLE IF NOT EXISTS debug_log (
      `id` int(11) NOT NULL AUTO_INCREMENT,
      `time` varchar(50) NOT NULL,
      `class_method` varchar(50) CHARACTER SET utf8 NOT NULL,
      `message` text CHARACTER SET utf8 NOT NULL,
      PRIMARY KEY (`id`)
    ) ENGINE=InnoDB DEFAULT CHARSET=latin1;');

	register(1);
	handle_skeleton_dir();
}

function mcba_get_version() {
	if (!function_exists( 'get_plugins')) {
		require_once ABSPATH . 'wp-admin/includes/plugin.php';
	}
	$plugin_folder = get_plugins( '/' . plugin_basename(dirname(__FILE__)));
	$plugin_file = basename((__FILE__));
	return $plugin_folder[$plugin_file]['Version'];
}

function mcba_notice() {
	?>
    <div class="notice error mcba-notice is-dismissible">
        <p><?php _e("Here's your notice", 'mycustombusinessapp.com');?></p>
    </div>
<?php
}

function activate_mcba() {
	$role = get_role( 'editor');
	$role->add_cap( 'manage_options'); // capability
}

// Register our activation hook
register_activation_hook(__FILE__, 'activate_mcba');

function deactivate_mcba() {
	$role = get_role( 'editor');
	$role->remove_cap( 'manage_options'); // capability
}
// Register our de-activation hook
register_deactivation_hook(__FILE__, 'deactivate_mcba');

function mcba_load_wp_media_files($page) {
	// Enqueue WordPress media scripts
	if ($page == "toplevel_page_mcba_mockup" ) {
		wp_enqueue_media();
		wp_enqueue_script("js/jquery_patch.js" );
		wp_enqueue_script( 'jquery');
		wp_enqueue_style("css/fontselect.css" );
		wp_enqueue_style( 'MCBA-Wordpress', plugin_dir_url(__FILE__) . 'css/floating_phone.css', array(), '1.0', 'all');
		// wp_enqueue_style( 'wp-color-picker');
		// wp_enqueue_script( 'wp-color-picker'); // feb 11
    wp_enqueue_script( 'mcba_views', plugins_url( 'js/mcba_views.js?ver=1.3', __FILE__), array( 'jquery-ui-draggable', 'jquery-ui-droppable' /* , 'wp-color-picker' */), false, true );
    wp_enqueue_script( 'mcba_functions', plugins_url( 'js/mcba_functions.js?ver=1.3', __FILE__), array( 'jquery-ui-draggable', 'jquery-ui-droppable' /*, 'wp-color-picker' */), false, true );
	}
}
add_action( 'admin_enqueue_scripts', 'mcba_load_wp_media_files');

function enqueue_wp_color_picker() {    // set up the trigger...
    // Enqueue the wp-color-picker script and styles
    wp_enqueue_style('wp-color-picker');
    wp_enqueue_script('wp-color-picker');
    
    // Enqueue your custom script and set wp-color-picker as a dependency
    wp_enqueue_script('custom-color-picker-init', plugins_url('/js/custom-color-picker-init.js', __FILE__), array('wp-color-picker'), false, true);
}
add_action('admin_enqueue_scripts', 'enqueue_wp_color_picker');

function enqueue_jquery_ui() {
    // Enqueue jQuery UI script and style
    wp_enqueue_script('jquery-ui-accordion');
    wp_enqueue_script('jquery-ui-resizable');
    wp_enqueue_style('jquery-ui-theme', 'https://code.jquery.com/ui/1.12.1/themes/base/jquery-ui.css');
}
add_action('wp_enqueue_scripts', 'enqueue_jquery_ui');

function test_geo_plugin_add_phone_to_footer() {
	global $wpdb, $security_token;
	$phone_icon_color = $wpdb->get_var( 'SELECT `configuration_value` FROM '  . $wpdb->prefix . 'mcba_chat_configuration WHERE `configuration_name` =\'phone_icon_color\'');
	wp_enqueue_style( 'MCBA-Wordpress', plugin_dir_url(__FILE__) . 'css/floating_phone.css', array(), '1.0', 'all');
	echo '<div class="unread_message_counter" style="display:none;"></div>';
	echo '<div class="staticcallbutton" id="staticcallbutton">
            <div class="phoneimage" id="phonecolorpublic">
                <a id="floatingphone">
                <img class="" src="http://mycustombusinessapp.com/wp-content/plugins/MCBA-Wordpress/css/contact_us_transparent.png"></a>
            </div>
        </div>';

	echo '<script>
        jQuery( document ).ready( function( a ) {
            console.log( "creating chatbot... " );
            const chatbot = new ChatBot( "chat-box", "Welcome to our chat. Is there anything that I can help you with?" );
            chatbot.draw();
            console.log( "setting database_sync_started event... " );
            jQuery( "#staticcallbutton" ).on( "database_sync_started", function( the_event, args ) {
                console.log( "*** database_sync_started event caught.  displaying and adding click event to phone... ***" );
                if ( jQuery( ".chat_sign_up_confirm_password" ).length == 0 ) {
                    jQuery( "#staticcallbutton" ).css( "display", "block" );';
					echo "jQuery( \"#staticcallbutton\" ).css( \"color\", \" $phone_icon_color\" );";
                echo '}
                jQuery( ".staticcallbutton" ).off().click( function( theEvent ) {
                    theEvent.stopPropagation();
                    init();
                });
            });
        });
        jQuery( "#staticcallbutton" ).off();
        </script>';

	echo '<!-- //////////////////// start chat area ///////////////////////////////////-->
    <div class="container-fluid chat-area" style="display: none;" id="chat-box"></div>
    <!-- //////////////////// end chat area ///////////////////////////////////-->';

	echo '<!-- ///////////////////////////// login sign up area ////////////////////////////////// -->
          <div class="container-fluid login_sign_in" id="login_sign_in"></div>
          <!-- //////////////////////// end login sign up area /////////////////////////////////// -->';
}

add_action( 'wp_footer', 'test_geo_plugin_add_phone_to_footer', 100);

function mcba_load_scripts() {
	global $security_token;
	$admin_url = admin_url( 'admin-ajax.php');
	echo '<script>const security_token = "' . $security_token . '"</script>';
	echo '<script>const MCBA_CHAT_SECURITY_TOKEN_LENGTH    =  ' . MCBA_CHAT_SECURITY_TOKEN_LENGTH . '  ;</script>';
	echo '<script>const MCBA_CHAT_SECURITY_TOKEN_LIFE_SPAN =  ' . MCBA_CHAT_SECURITY_TOKEN_LIFE_SPAN . '  ;</script>';
	echo '<script>const MCBA_URL                           = "' . MCBA_URL . '" ;</script>';
	echo "<script>const ADMIN_URL                          =      \"$admin_url\"                          ;</script>";

	// if ( str_contains( $_SERVER['REMOTE_ADDR'], "127.0.0.1" )) {
	//     $logger->writeLog( "{php} " . __METHOD__, "home machine detected.  loading jquery... " );
	//     wp_enqueue_script( 'MCBA-Wordpress-jquery_v360-js', plugin_dir_url(__FILE__) . 'mcba_chat_room/js/jquery_v360.js', array(), false, true );
	// }
	wp_register_script( 'firebase-app', 'https://www.gstatic.com/firebasejs/7.4.0/firebase.js', null, null, true );
	wp_enqueue_script( 'firebase-app');
	wp_enqueue_script( 'dist-firebaseui', plugin_dir_url(__FILE__) . 'mcba_chat_room/dist/firebaseui.js', array(), false, true );

	// mcba_widgets
	wp_enqueue_script( 'MCBA-Wordpress-Space', plugin_dir_url(__FILE__) . 'mcba_widgets/Space.js', array(), false, true );
	// end mcba_widgets

	wp_enqueue_script( 'MCBA-Wordpress-tool', plugin_dir_url(__FILE__) . 'mcba_chat_room/js/tools.js', array(), false, true );
	wp_enqueue_script( 'MCBA-Wordpress-app', plugin_dir_url(__FILE__) . 'mcba_chat_room/js/app.js', array(), false, true );
	wp_enqueue_style( 'mcba_chat_style', plugin_dir_url(__FILE__) . 'mcba_chat_room/css/style.css', array(), '1.0', 'all');
	wp_enqueue_style( 'firebaseappstyle-css', plugin_dir_url(__FILE__) . 'mcba_chat_room/css/firebaseappstyle.css', array(), '1.0', 'all');
	wp_enqueue_style( 'chatbot-css', plugin_dir_url(__FILE__) . 'mcba_chat_room/chat_bot/css/chat_bot.css', array(), '1.0', 'all');
	wp_enqueue_style( 'sign-up-css', plugin_dir_url(__FILE__) . 'mcba_chat_room/sign_up/css/sign_up.css', array(), '1.0', 'all');
	wp_enqueue_style( 'login-css', plugin_dir_url(__FILE__) . 'mcba_chat_room/login/css/login.css', array(), '1.0', 'all');
	wp_enqueue_style( 'MCBA-Wordpress-3', plugin_dir_url(__FILE__) . 'css/floating_phone.css', array(), '1.0', 'all');
	//
	wp_enqueue_script( 'MCBA-Wordpress-LoggerFactory-js', plugin_dir_url(__FILE__) . 'logger/LoggerFactory.js', array(), false, true );
	wp_enqueue_script( 'MCBA-Wordpress-LogObjectFactory-js', plugin_dir_url(__FILE__) . 'logger/LogObjectFactory.js', array(), false, true );
	wp_enqueue_script( 'MCBA-Wordpress-SourceData-js', plugin_dir_url(__FILE__) . 'logger/SourceData.js', array(), false, true );
	wp_enqueue_script( 'MCBA-Wordpress-FetchRunner-js', plugin_dir_url(__FILE__) . 'logger/FetchRunner.js', array(), false, true );
	wp_enqueue_script( 'MCBA-Wordpress-Model-js', plugin_dir_url(__FILE__) . 'logger/Model.js', array(), false, true );
	wp_enqueue_script( 'MCBA-Wordpress-MonitorLedClassObject-js', plugin_dir_url(__FILE__) . 'logger/MonitorLedClassObject.js', array(), false, true );
	wp_enqueue_script( 'MCBA-Wordpress-MonitorLed-js', plugin_dir_url(__FILE__) . 'logger/MonitorLed.js', array(), false, true );
	wp_enqueue_script( 'MCBA-Wordpress-MonitoredObject-js', plugin_dir_url(__FILE__) . 'logger/MonitoredObject.js', array(), false, true );
	//
    wp_enqueue_script( 'MCBA-Wordpress-WordPressAjaxCall', plugin_dir_url(__FILE__) . 'mcba_chat_room/js/WordPressAjaxCall.js', array(), false, true );
	wp_enqueue_script( 'MCBA-Wordpress-VerifyChatId-js', plugin_dir_url(__FILE__) . 'mcba_chat_room/js/VerifyChatId.js', array(), false, true );
	wp_enqueue_script( 'MCBA-Wordpress-ActiveChatId-js', plugin_dir_url(__FILE__) . 'mcba_chat_room/js/ActiveChatId.js', array(), false, true );
	wp_enqueue_script( 'MCBA-Wordpress-MessageProcessor-js', plugin_dir_url(__FILE__) . 'mcba_chat_room/js/MessageProcessor.js', array(), false, true );
	wp_enqueue_script( 'MCBA-Wordpress-LogObjectFactory-js', plugin_dir_url(__FILE__) . 'mcba_chat_room/js/LogObjectFactory.js', array(), false, true );
	wp_enqueue_script( 'MCBA-Wordpress-EasyBox-js', plugin_dir_url(__FILE__) . 'mcba_chat_room/js/EasyBox.js', array(), false, true );
	wp_enqueue_script( 'MCBA-Wordpress-ChatBot-js', plugin_dir_url(__FILE__) . 'mcba_chat_room/chat_bot/js/ChatBot.js', array(), false, true );
	wp_enqueue_script( 'MCBA-Wordpress-Message-js', plugin_dir_url(__FILE__) . 'mcba_chat_room/js/Message.js', array(), false, true );
	wp_enqueue_script( 'MCBA-Wordpress-Guest-js', plugin_dir_url(__FILE__) . 'mcba_chat_room/js/Guest.js', array(), false, true );
	wp_enqueue_script( 'MCBA-Wordpress-Encryption-js', plugin_dir_url(__FILE__) . 'mcba_chat_room/js/Encryption.js', array(), false, true );
	wp_enqueue_script( 'MCBA-Wordpress-DataSource-js', plugin_dir_url(__FILE__) . 'mcba_chat_room/js/DataSource.js', array(), false, true );
	wp_enqueue_script( 'MCBA-Wordpress-OnOffSwitch-js', plugin_dir_url(__FILE__) . 'mcba_chat_room/on_off_switch/js/OnOffSwitch.js', array(), false, true );
	wp_enqueue_script( 'MCBA-Wordpress-ChatColorManager-js', plugin_dir_url(__FILE__) . 'mcba_chat_room/js/ChatColorManager.js', array(), false, true );
	wp_enqueue_script( 'MCBA-Wordpress-ChatConfiguration-js', plugin_dir_url(__FILE__) . 'mcba_chat_room/chat_configuration/js/ChatConfiguration.js', array(), false, true );
	wp_enqueue_script( 'MCBA-Wordpress-PhoneIconColorManager-js', plugin_dir_url(__FILE__) . 'mcba_chat_room/js/PhoneIconColorManager.js', array(), false, true );
	wp_enqueue_script( 'MCBA-Wordpress-AnonymousIdentityConstructor-js', plugin_dir_url(__FILE__) . 'mcba_chat_room/js/AnonymousIdentityConstructor.js', array(), false, true );
	wp_enqueue_script( 'MCBA-Wordpress-MonitorLedClassObject-js', plugin_dir_url(__FILE__) . 'mcba_chat_room/js/MonitorLedClassObject.js', array(), false, true );
	wp_enqueue_script( 'MCBA-Wordpress-MonitorLedData-js', plugin_dir_url(__FILE__) . 'mcba_chat_room/js/MonitorLedData.js', array(), false, true );
	wp_enqueue_script( 'MCBA-Wordpress-ChatOnOffManager-js', plugin_dir_url(__FILE__) . 'mcba_chat_room/on_off_switch/js/ChatOnOffManager.js', array(), false, true );
	wp_enqueue_script( 'MCBA-Wordpress-Identity-js', plugin_dir_url(__FILE__) . 'mcba_chat_room/js/Identity.js', array(), false, true );
	wp_enqueue_script( 'MCBA-Wordpress-KnownIdentityConstructor-js', plugin_dir_url(__FILE__) . 'mcba_chat_room/js/KnownIdentityConstructor.js', array(), false, true );
	wp_enqueue_script( 'MCBA-Wordpress-AnonymousIdentity-js', plugin_dir_url(__FILE__) . 'mcba_chat_room/js/AnonymousIdentity.js', array(), false, true );
	wp_enqueue_script( 'MCBA-Wordpress-AdminIdentityConstructor-js', plugin_dir_url(__FILE__) . 'mcba_chat_room/js/AdminIdentityConstructor.js', array(), false, true );
	wp_enqueue_script( 'MCBA-Wordpress-Registration-js', plugin_dir_url(__FILE__) . 'mcba_chat_room/registration/js/Registration.js', array(), false, true );
	wp_enqueue_script( 'MCBA-Wordpress-TableManager-js', plugin_dir_url(__FILE__) . 'mcba_chat_room/js/TableManager.js', array(), false, true );
	wp_enqueue_script( 'MCBA-Wordpress-MessageCounter-js', plugin_dir_url(__FILE__) . 'mcba_chat_room/js/MessageCounter.js', array(), false, true );
	wp_enqueue_script( 'MCBA-Wordpress-MessageManager-js', plugin_dir_url(__FILE__) . 'mcba_chat_room/js/MessageManager.js', array(), false, true );
	wp_enqueue_script( 'MCBA-Wordpress-VerifySentMessage-js', plugin_dir_url(__FILE__) . 'mcba_chat_room/js/VerifySentMessage.js', array(), false, true );
	wp_enqueue_script( 'MCBA-Wordpress-MessageSender-js', plugin_dir_url(__FILE__) . 'mcba_chat_room/js/MessageSender.js', array(), false, true );
	wp_enqueue_script( 'MCBA-Wordpress-ConversationListManager-js', plugin_dir_url(__FILE__) . 'mcba_chat_room/js/ConversationListManager.js', array(), false, true );
	wp_enqueue_script( 'MCBA-Wordpress-Encryption-js', plugin_dir_url(__FILE__) . 'mcba_chat_room/js/Encryption.js', array(), false, true );
	wp_enqueue_script( 'MCBA-Wordpress-ChatRouter-js', plugin_dir_url(__FILE__) . 'mcba_chat_room/js/ChatRouter.js', array(), false, true );
	wp_enqueue_script( 'MCBA-Wordpress-ChatBox-js', plugin_dir_url(__FILE__) . 'mcba_chat_room/js/ChatBox.js', array(), false, true );
	wp_enqueue_script( 'MCBA-Wordpress-Tests-js', plugin_dir_url(__FILE__) . 'mcba_chat_room/js/Tests.js', array(), false, true );
	wp_enqueue_script( 'MCBA-Wordpress-ChatBoxBuilder-js', plugin_dir_url(__FILE__) . 'mcba_chat_room/change_password/js/ChatBoxBuilder.js', array(), false, true );
	wp_enqueue_script( 'MCBA-Wordpress-ChangePasswordForm-js', plugin_dir_url(__FILE__) . 'mcba_chat_room/change_password/js/ChangePasswordForm.js', array(), false, true );
	wp_enqueue_script( 'MCBA-Wordpress-PasswordChanger-js', plugin_dir_url(__FILE__) . 'mcba_chat_room/change_password/js/PasswordChanger.js', array(), false, true );
	wp_enqueue_script( 'MCBA-Wordpress-SecurityTokenProcessor-js', plugin_dir_url(__FILE__) . 'mcba_chat_room/change_password/js/SecurityTokenProcessor.js', array(), false, true );
	wp_enqueue_script( 'MCBA-Wordpress-SecurityObject-js', plugin_dir_url(__FILE__) . 'mcba_chat_room/js/SecurityObject.js', array(), false, true );
	wp_enqueue_script( 'MCBA-Wordpress-SecurityObjectLifeSpan-js', plugin_dir_url(__FILE__) . 'mcba_chat_room/js/SecurityObjectLifeSpan.js', array(), false, true );
	wp_enqueue_script( 'MCBA-Wordpress-SecurityObjectManager-js', plugin_dir_url(__FILE__) . 'mcba_chat_room/js/SecurityObjectManager.js', array(), false, true );
	wp_enqueue_script( 'MCBA-Wordpress-PasswordManager-js', plugin_dir_url(__FILE__) . 'mcba_chat_room/js/PasswordManager.js', array(), false, true );
	wp_enqueue_script( 'MCBA-Wordpress-Login-js', plugin_dir_url(__FILE__) . 'mcba_chat_room/login/js/Login.js', array(), false, true );
	wp_enqueue_script( 'MCBA-Wordpress-SignUp-js', plugin_dir_url(__FILE__) . 'mcba_chat_room/sign_up/js/SignUp.js', array(), false, true );
	wp_enqueue_script( 'MCBA-Wordpress-Validation-js', plugin_dir_url(__FILE__) . 'mcba_chat_room/validation/js/Validation.js', array(), false, true );
	wp_enqueue_script( 'MCBA-Wordpress-SecureHashAlgorithm-js', plugin_dir_url(__FILE__) . 'mcba_chat_room/registration/js/SecureHashAlgorithm.js', array(), false, true );
	wp_enqueue_script( 'MCBA-Wordpress-DatabaseSync-js', plugin_dir_url(__FILE__) . 'mcba_chat_room/js/DatabaseSync.js', array(), false, true );
	wp_enqueue_script( 'MCBA-Wordpress-DataArg-js', plugin_dir_url(__FILE__) . 'mcba_chat_room/js/DataArg.js', array(), false, true );
	wp_enqueue_script( 'routerJs', plugin_dir_url(__FILE__) . 'mcba_chat_room/js/router.js', array(), false, true );
	wp_enqueue_script( 'MCBA-Wordpress-mcba_chat_main', plugin_dir_url(__FILE__) . 'mcba_chat_room/js/mcba_chat_main.js', array(), false, true );
}

add_action( 'wp_enqueue_scripts', 'mcba_load_scripts');
$mcba_logger->logUpdate( "end mcba.php" );
