<?php
defined('ABSPATH') || exit;
if ( !class_exists( 'McbaUtil' )) {
    class McbaUtil {
		static $DEBUG = FALSE;
		public function __construct() {}
		public static function writeLog($method, $text_to_log) {
			$format = "%.9s %-37.37s %.700s \r\n";
			$content = sprintf($format, date("g:i:s.u"), ":" . substr($method, -36, 36) . "() ", $text_to_log);
			file_put_contents ( dirname ( __FILE__ ) . "/register.log", $content /*. "\r\n" */, FILE_APPEND | LOCK_EX );
			if ( MCBAUtil::$DEBUG === TRUE ) { echo $content . " <br>";	}
		}
		function __destruct() {}
	}
}

if ( !class_exists( 'MCBA_WriteLog' )) {
	class MCBA_WriteLog {

		private $time 		  =	null;
		private $class_method = null;
		private $message      = null;
		private $database     =	null;

		public function __construct() {
			$this->database 	= $this->initialize_database();
			$this->time 		= date("Y-m-d H:i:s");
		}


		public function writeLog($class_methodArg, $messageArg) {
			$statement = $this->database->prepare('INSERT INTO debug_log (time, class_method, message) VALUES(?, ?, ?)');
			$result = $statement->execute(array($this->time, $class_methodArg, sprintf("[%-300.300s]", $messageArg)));
			return $result;
		}

		private function initialize_database() {
			global $wpdb;
			
			try {
				$database = new PDO( 'mysql:host=' . $wpdb->dbhost . '; dbname=' . $wpdb->dbname, $wpdb->dbuser, $wpdb->dbpassword  );
				$database->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_WARNING);
				return $database;
			}
			catch (PDOException $pDoException) {
				file_put_contents('register.log', $pDoException->getMessage() . '\r\n', FILE_APPEND | LOCK_EX);
				die(json_encode(array(
						'error' => $pDoException->getMessage()
				)));
			}
		}
		function __destruct() {}
	}
}?>