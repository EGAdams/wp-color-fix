<?php
defined('ABSPATH') || exit;
function alert($message){
	echo "<script type='text/javascript'>alert('$message');</script>";
}

define( 'MCBA_DIR', dirname(__FILE__) . "/");
define( 'MCBA_INC_DIR',  MCBA_DIR . 'inc/'  );
define( 'MCBA_WWW_DIR',  MCBA_UPLOADS_DIR . "/MCBA/www/" );
define( 'MCBA_UPLOAD_DIR', MCBA_DIR . 'upload/'  );
define( 'MCBA_IMG_DIR',  MCBA_DIR . 'images/'  );
define( 'MCBA_BACKUP_DIR',  MCBA_DIR . 'backup/'  );
define( 'MCBA_APP_CONFIG', MCBA_WWW_DIR . 'app_config.json');
define( 'MCBA_TMP_CONFIG', MCBA_WWW_DIR . 'app_config_tmp.json');
define( 'MCBA_CURRENT_PAGE', MCBA_WWW_DIR . 'currentpage.txt');

define( 'MCBA_WWW_URL',  MCBA_URL . 'www/' );
define( 'MCBA_CONFIG_URL', MCBA_WWW_URL . 'app_config_tmp.json'  );
define( 'MCBA_WWW_INDEX',  MCBA_WWW_URL . 'index.php?page=0&configurl='.MCBA_CONFIG_URL  );
define( 'MCBA_IMG_URL', MCBA_URL . 'images/' );
define( 'MCBA_ICON', MCBA_IMG_URL . 'menuicon.png' );
define( 'MCBA_CSS_URL', MCBA_URL . 'css/' );
define( 'MCBA_JS_URL', MCBA_URL . 'js/' );
define( 'MCBA_HOME_PAGE', 0);

include_once MCBA_INC_DIR . 'mockup-local.php';
include_once MCBA_INC_DIR . 'parser.php';

function run(){
	echo '<html><head></head><body>';
	echo mcba_mockup();
	echo '</body></html>';
}


run();