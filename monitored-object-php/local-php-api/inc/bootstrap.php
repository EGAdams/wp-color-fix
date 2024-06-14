<?php
define("PROJECT_ROOT_PATH", dirname( __DIR__, 1 ));

require_once PROJECT_ROOT_PATH . "/inc/config.php";
 
// include the base controller file
require_once PROJECT_ROOT_PATH . "/Controller/Api/BaseController.php";

// include the controller error file
require_once PROJECT_ROOT_PATH . "/Controller/Api/ControllerError.php";
 
// include the use model file
require_once PROJECT_ROOT_PATH . "/Model/ObjectModel.php";
?>
