<?php
defined('ABSPATH') || exit;
add_action( 'admin_init', 'mcba_init' );
add_action( 'admin_menu', 'mcba_add_menu' );
/**
 * Register plugin option
 *
 * @return void
 */
function mcba_init()
{
	register_setting( 'mcba_option_group', 'mcba_option' );
}

function mcba_add_menu()
{
	global $wpdb, $current_user;

	// Add Menu
	$icon_url = MCBA_URL . 'icon.png';
	$mockup_page = add_menu_page( 'My Custom Business App', 'My Custom Business App', 'read', 'mcba_mockup', 'mcba_mockup', MCBA_ICON  );
	
	// Promoblast
	$promoblast_page = add_submenu_page( 'mcba_mockup', 'PromoBlast', 'PromoBlast', 'read', 'mcba_promoblast', 'mcba_promoblast' );

	// Proxiblast
	$proxiblast_page = add_submenu_page( 'mcba_mockup', 'ProxiBlast', 'ProxiBlast', 'read', 'mcba_proxiblast', 'mcba_proxiblast' );

	// Messaging
	$messaging_page = add_submenu_page( 'mcba_mockup', 'Ask The Expert', 'Ask The Expert', 'read', 'mcba_messaging', 'mcba_messaging' );
	
	// User Maintenance
	$usermaintenance_page = add_submenu_page( 'mcba_mockup', 'User Maintenance', 'User Maintenance', 'read', 'mcba_mobile_user_maint', 'mcba_mobile_user_maint' );
	
	// Create Rewards
	$createrewards_page = add_submenu_page( 'mcba_mockup', 'Create Rewards', 'Create Rewards', 'read', 'mcba_createrewards', 'mcba_createrewards' );
	
	// generate app_install.php
	$generate_appinstall_page = add_submenu_page( 'mcba_mockup', 'Generate Installation QR', 'Generate Installation QR', 'read', 'mcba_generate_install', 'mcba_generate_install' );

}


function mcba_admin_print_styles_promoblast()
{
	wp_enqueue_style( 'mcba_css', MCBA_CSS_URL . 'style.css' );
	wp_enqueue_script( 'mcba_js', MCBA_JS_URL . 'script.js', array( 'jquery-ui-autocomplete' ) );
	do_action( 'mcba_print_styles', 'promoblast' );
}


function mcba_admin_print_styles_proxiblast()
{
	wp_enqueue_style( 'mcba_css', MCBA_CSS_URL . 'style.css' );
	wp_enqueue_script( 'mcba_js', MCBA_JS_URL . 'script.js', array( 'jquery-ui-autocomplete' ) );
	do_action( 'mcba_print_styles', 'proxiblast' );
}


function mcba_admin_print_styles_mockup()
{
	wp_enqueue_style( 'mcba_css', MCBA_CSS_URL . 'style.css' );
	wp_enqueue_script( 'mcba_js', MCBA_JS_URL . 'script.js', array( 'jquery-ui-autocomplete' ) );
	do_action( 'mcba_print_styles', 'mockup' );
}

