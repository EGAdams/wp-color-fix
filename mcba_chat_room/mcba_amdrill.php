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

// Prevent loading this file directly
defined('ABSPATH') || exit;

define('MCBA_DIR', plugin_dir_path(__FILE__));
define('MCBA_INC_DIR', trailingslashit(MCBA_DIR . 'inc'));
define('MCBA_WWW_DIR', trailingslashit(MCBA_DIR . '/../../uploads/MCBA/www/'));
define('MCBA_MAIN_CONFIG', MCBA_WWW_DIR . 'app_config.json');
define('MCBA_SITEMAP', MCBA_WWW_DIR . 'sitemap.php');
define('MCBA_IMG_DIR', trailingslashit(MCBA_DIR . 'images'));
define('MCBA_URL', plugin_dir_url(__FILE__));
define('MCBA_UPLOAD_URL', MCBA_URL . 'upload.php');
define('MCBA_IMG_URL', trailingslashit(MCBA_URL . 'images'));
define('MCBA_ICON', MCBA_IMG_URL . 'menuicon.png');
define('MCBA_CSS_URL', trailingslashit(MCBA_URL . 'css'));
define('MCBA_JS_URL', trailingslashit(MCBA_URL . 'js'));
define('MCBA_HOME_PAGE', 0);
define('MCBA_SIDEBAR_TEXT', "My Custom Business App");
define('MCBA_MAIN_HEADER', "My Custom Business App");
define('MCBA_WWW_DIR', trailingslashit(MCBA_DIR . '/../../uploads/MCBA/www/'));
define('MCBA_APP_DIR', trailingslashit(MCBA_DIR . '/../../uploads/MCBA/app/'));

require 'plugin-update-checker.php';
$myUpdateChecker = PucFactory::buildUpdateChecker('http://mycustombusinessapp.com/MCBA-Update/MCBA-Wordpress.json', __FILE__);

global $wpdb;
$templateDir = $wpdb->get_var('SELECT `template_dir` FROM ' . $wpdb->prefix . 'mcba');
$clientId    = $wpdb->get_var('SELECT `mcba_id` FROM ' . $wpdb->prefix . 'mcba');

if (!$templateDir) {
    $templateDir = 'BusinessTemplate';
    $rows        = $wpdb->get_results("SELECT * FROM " . $wpdb->prefix . "mcba");
    if (count($rows) > 0) {
        $wpdb->query("UPDATE " . $wpdb->prefix . "mcba
			SET template_dir = " . $templateDir . "
			WHERE 1
			");
    } else {
        $wpdb->query("INSERT INTO " . $wpdb->prefix . "mcba
			(`template_dir`) 
			VALUES ('" . $templateDir . "')
			");
    }
}

$STATUS = null;
if (empty($clientId)) {
    $STATUS = register();
    
    
} else {
    $STATUS = getStatus($clientId);
}

define('ACTIVE', $STATUS['active']);
define('MCBA_ID', $clientId);
define('MCBA_TEMPLATE_NAME', $templateDir);
define('MCBA_WWW_URL', trailingslashit(MCBA_URL . '../../uploads/MCBA/www'));
define('MCBA_TEMPLATES_DIR', trailingslashit(MCBA_WWW_DIR . 'templates'));
define('MCBA_TEMPLATES_URL', trailingslashit(MCBA_WWW_URL . 'templates'));
define('MCBA_TEMPLATE_URL', trailingslashit(MCBA_TEMPLATES_URL . $templateDir));
define('MCBA_TEMPLATE', trailingslashit(MCBA_TEMPLATES_DIR . $templateDir));
define('MCBA_BACKUP_DIR', trailingslashit(MCBA_TEMPLATE . 'backup'));
define('MCBA_CONFIG_URL', MCBA_TEMPLATE_URL . 'app_config.json');
define('MCBA_TMP_CONFIG', MCBA_TEMPLATE . 'app_config.json');
define('MCBA_WWW_INDEX', MCBA_WWW_URL . 'index.php?template=' . $templateDir . "&name=". time());
define('MCBA_APP_URL', trailingslashit(MCBA_URL . '../../uploads/MCBA/app'));

//include_once MCBA_INC_DIR . 'widget.php';
include_once MCBA_INC_DIR . 'mockup.php';
include_once MCBA_INC_DIR . 'mcba_functions.php';
include_once MCBA_INC_DIR . 'parser.php';
include_once MCBA_INC_DIR . 'promoblast-page.php';
include_once MCBA_INC_DIR . 'proxiblast-page.php';
include_once MCBA_INC_DIR . 'usermaint-page.php';
include_once MCBA_INC_DIR . 'createrewards-page.php';
include_once MCBA_INC_DIR . 'app_install-page.php';
include_once MCBA_INC_DIR . 'messaging-page.php';
include_once MCBA_DIR . 'promoblast.php';
include_once MCBA_DIR . 'qr_generator.php';
include_once MCBA_DIR . 'handle_skeleton_dir.php';
include_once MCBA_DIR . 'backup.php';
include_once MCBA_DIR . 'messaging.php';

/* Show the sidebar menu item if in the admin panel */
if (is_admin()) {
    include_once MCBA_INC_DIR . 'options.php';
}

register_activation_hook(__FILE__, 'mcba_activate');
add_action('plugins_loaded', 'mcba_load_text_domain');
add_action('wp_ajax_mcba_get_editor', 'mcba_get_editor');

function register()
{
    global $wpdb;
    /* Register */
    $base = home_url( '/' );
    $mcba = str_replace($base, "", MCBA_URL);
    $fields = array(
        'mcba_url' => MCBA_URL,
        'baseURL'  => $base,
        'MCBA_Dir' => $mcba,
        'Shop_Dir' => "shop/",
        'mcba_register' => 'register_plugin'
    );
    $ch     = curl_init();
    curl_setopt($ch, CURLOPT_URL, 'http://mycustombusinessapp.com/MCBA-MasterServer/register.php');
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HEADER, $header);
    curl_setopt($ch, CURLOPT_POSTFIELDS, $fields);
    $result = curl_exec($ch);
    if (!json_decode($result)) {
        echo "FAIL: " . $result;
        
    } else {
        /* Save the id to the database */
        //		$result = json_decode($result);
        $mcbaId = json_decode($result, true);
        $mcbaId = $mcbaId['mcba_id'];
        $rows   = $wpdb->get_results("SELECT * FROM " . $wpdb->prefix . "mcba");
        if (count($rows) > 0) {
            $wpdb->query("UPDATE " . $wpdb->prefix . "mcba
			SET `mcba_id` = '" . $mcbaId . "'
			WHERE 1");
        } else {
            $wpdb->query("INSERT INTO " . $wpdb->prefix . "mcba
			(`mcba_id`,`template_dir`)
			VALUES ('" . $mcbaId . "', 'BusinessTemplate')");
        }
    }
    curl_close($ch);
    
    
    return getStatus($mcbaId);
}

function getStatus($clientId)
{   
    $fields = array(
        'mcba_id' => $clientId,
        'mcba_action' => 'status'
    );
    $ch     = curl_init();
    curl_setopt($ch, CURLOPT_URL, 'http://mycustombusinessapp.com/MCBA-MasterServer/proxy.php');
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HEADER, $header);
    curl_setopt($ch, CURLOPT_POSTFIELDS, $fields);
    $result = curl_exec($ch);
    $result = json_decode($result, true);
    curl_close($ch);
    
    
    return $result;
}

/**
 * Load plugin text domain
 *
 * @return void
 */
function mcba_load_text_domain()
{
    load_plugin_textdomain('mcba', false, dirname(plugin_basename(__FILE__)) . '/lang/');
}

/**
 * Create table and register an option when activate
 *
 * @return void
 */
function mcba_activate()
{
    global $wpdb;
    
    
    // Create table
    $query = $wpdb->query('CREATE TABLE IF NOT EXISTS ' . $wpdb->prefix . 'mcba (
			`id` int NOT NULL auto_increment,
			`mcba_id` int,
			`template_dir` text,
			PRIMARY KEY (`id`)
		) COLLATE utf8_general_ci;');
    
    
    register();
    handle_skeleton_dir(); 
}

function alert($message)
{
    echo "<script type='text/javascript'>alert('$message');</script>";
}

function mcba_get_version() {
    if ( ! function_exists( 'get_plugins' ) )
        require_once( ABSPATH . 'wp-admin/includes/plugin.php' );
    $plugin_folder = get_plugins( '/' . plugin_basename( dirname( __FILE__ ) ) );
    $plugin_file = basename( ( __FILE__ ) );
    return $plugin_folder[$plugin_file]['Version'];
}

function mcba_notice() {
    ?>
    <div class="notice error mcba-notice is-dismissible" >
        <p><?php _e("Here's your notice", 'mycustombusinessapp.com' ); ?></p>
    </div>
    <?php
}

function activate_mcba() {
 
 
    $role = get_role( 'editor' );
    $role->add_cap( 'manage_options' ); // capability
}
// Register our activation hook
register_activation_hook( __FILE__, 'activate_mcba' );
 
 
function deactivate_mcba() {
 
 
    $role = get_role( 'editor' );
    $role->remove_cap( 'manage_options' ); // capability
}
// Register our de-activation hook
register_deactivation_hook( __FILE__, 'deactivate_mcba' );

function tl_save_error() {
    update_option( 'plugin_error',  ob_get_contents() );
}
function mcba_load_wp_media_files( $page ) {
    // Enqueue WordPress media scripts
	if ($page == "toplevel_page_mcba_mockup") {
		wp_enqueue_media();
		wp_enqueue_style( 'wp-color-picker' );
		wp_enqueue_script( 'wp-color-picker');
		wp_enqueue_script( 'mcba_views', plugins_url('js/mcba_views.js?ver=1.3', __FILE__ ), array( 'wp-color-picker' ), false, true );
		wp_enqueue_script( 'mcba_functions', plugins_url('js/mcba_functions.js?ver=1.3', __FILE__ ), array( 'wp-color-picker' ), false, true );
	}
}
add_action( 'admin_enqueue_scripts', 'mcba_load_wp_media_files' );


//add_action( 'activated_plugin', 'tl_save_error' );

/* Then to display the error message: */
//echo get_option( 'plugin_error' );

/*
function mcba_add_action_links ( $actions, $plugin_file ) {
//	$mylinks = array('<a href="' . admin_url( 'admin.php?page=mcba_mockup' ) . '">Settings</a>',);
//	return array_merge( $mylinks, $links );
	
	
	static $plugin;
	if (!isset($plugin)) $plugin = plugin_basename(__FILE__);
	if ($plugin == $plugin_file) {
		$settings = array('settings' => '<a href="admin.php?page=mcba_mockup">' . __('Settings', 'General') . '</a>');
		$rewards = array('rewards' => '<a href="admin.php?page=mcba_createrewards">' . __('Rewards', 'General') . '</a>');
		$actions = array_merge($rewards, $actions);
		$actions = array_merge($settings, $actions);
	}
	return $actions;
}
add_filter( 'plugin_action_links_' . plugin_basename(__FILE__), 'mcba_add_action_links', 10, 5);
*/