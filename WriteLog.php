<?php
file_put_contents('register.log', 'before require_once in WriteLog.php... \n');
require_once 'Util.php';
if (!class_exists('WriteLog')) {
	file_put_contents('register.log', 'class WriteLog is not defined, defining... \n');
	class WriteLog {
		private $time = null;
		private $database = null;

		public function __construct() {
			$this->database = $this->initialize_database();
			Util::writeLog("WriteLog __constructor", "done initializing this database.");
			date_default_timezone_set('America/New_York');
			$this->time = date("Y-m-d H:i:s"); }

		public function writeLog($class_methodArg, $messageArg) {
			$statement = $this->database->prepare('INSERT INTO debug_log (time, class_method, message) VALUES(?, ?, ?)');
			$result = $statement->execute(array($this->time, $class_methodArg, sprintf("[%-300.300s]", $messageArg)));
			Util::writeLog("message: ", $messageArg);
			return $result;	}

		private function initialize_database() {
			try {
				global $wpdb;
				Util::writeLog("WriteLog __constructor", " inside.  creating pdo object...");
				// Util::writeLog("WriteLog __constructor", " dbname: " . $wpdb->dbname . " user: " + $wpdb->user );
				$db = new PDO('mysql:host=' . $wpdb->dbhost . '; dbname=' . $wpdb->dbname, $wpdb->dbuser, $wpdb->dbpassword);
				Util::writeLog("WriteLog __initialize_database()", "database created.");

				$db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_WARNING);
				Util::writeLog("WriteLog __initialize_database()", "done with setAttribute.  returning database object");
				return $db;
			} catch (PDOException $pDoException) {
				file_put_contents('register.log', $pDoException->getMessage() . '\n', FILE_APPEND | LOCK_EX);
				die(json_encode(array('error' => $pDoException->getMessage()))); }
		}
		public function __destruct() {}
	}
}

/*-------------------------------------------------------------------------*/
/*  TODO: find out where the global database connection is for this scope! */
/*-------------------------------------------------------------------------*/
