<?php
if (!class_exists('McbaUtil')) {
	class McbaUtil {
		public function __construct() {}
		public static function writeLog($method, $text_to_log) {
			date_default_timezone_set('EST');
			$format = "%.9s %-37.37s %.700s \r\n";
			$content = sprintf($format, date("g:i:s.u"), ":" . substr($method, -36, 36) . "() ", $text_to_log);
			file_put_contents(dirname(__FILE__) . "/register.log", $content/*. "\r\n" */, FILE_APPEND | LOCK_EX); }}
		function __destruct(){}}
class Rewards {
	private $DEBUG = false;
	private $scanned_points = "";
	private $email = "";
	private $password = "";
	private $points_on_device = "";
	private $database_points = "";
	private $pushid = "";
	private $old_push_id = "";
	private $current_push_id = "";
	private $first_name = "";
	private $last_name = "";
	private $device = "";
	private $database/*  = "set in create()" */;
	private $rewards_object/*  = "set in create()" */;
	private $logger;

	public static function create($scanned_points_arg, $email_arg, $password_arg, $points_on_device_arg) {
		file_put_contents(dirname(__FILE__) . "/register.log", date("g:i:s") . "; \r\n", FILE_APPEND | LOCK_EX);
		$rewards = new Rewards($email_arg, $password_arg, $points_on_device_arg);

		// checks for empty strings;  this may trigger a die();
		$rewards->check_inputs($scanned_points_arg, $email_arg, $password_arg, $points_on_device_arg);
		try {
            global $wpdb;
			$rewards->database = new PDO('mysql:host=' . $wpdb->dbhost . '; dbname=' . $wpdb->dbname, $wpdb->dbuser, $wpdb->dbpassword );
			$rewards->database->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_WARNING);

		} catch (PDOException $pdoException) {

			$rewards->writeLog(__METHOD__, $pdoException->getMessage());
			$error = "Could not create an instance of the database.";
			die(json_encode(array('error' => $error)));
		}

		$rewards->points_on_device = $points_on_device_arg;
		$rewards->scanned_points = $scanned_points_arg;

		    /*
	         * make sure that the number of
	         * points on the device matches
	         * the amount in the database.
	         * also populates database points
             * */
		$rewards->verify_database_sync($rewards);

		$rewards->writeLog(__METHOD__, "rewards object successfully constructed.");
		return $rewards;
	}

	private function __construct($email, $password, $points_on_device) {
		$this->email = $email;
		$this->password = $password;
		$this->points_on_device = $points_on_device;
	}

	public function store() {
		$total_points = $this->scanned_points; // the addition is already done on the phone

		if (strlen($total_points) == 0 || strlen($this->getEmail()) == 0) {
			$error = "invalid input: total_points: " . $total_points .
			" email:  " . $this->getEmail();
			$this->writeLog(__METHOD__, "ERROR: *** " . $error . " ***");
			die(json_encode(array('error' => $error)));	}

		$this->writeLog(__METHOD__, "total points: " . $total_points);
		$statement = $this->database->prepare('UPDATE wp_mcba_users SET rewards= ? WHERE email = ?');
		$statement->execute(array(
			$total_points,
			$this->getEmail(),
		));

		$this->writeLog(__METHOD__, $total_points . " points set for email " . $this->getEmail());
		$this->database_points = $total_points;

	} // </ store()>

	private function updatePushId($newPushId) {

		McbaUtil::writeLog(__METHOD__, "checking new push id and email before writing to the database...");
		if (strlen($newPushId) == 0 || strlen($this->getEmail()) == 0) {
			$error = "invalid input! new push id: " . $newPushId . ", email: " . $this->getEmail();
			$this->writeError(__METHOD__, $error);
			die(json_encode(array('error' => "ERROR: *** " . $error . " ***")));
		}

		$this->writeLog(__METHOD__, "updating push id!");

		try {

			$this->writeLog(__METHOD__, "using pushid: " . $newPushId);
			$statement = $this->database->prepare('UPDATE wp_mcba_users SET pushid= ? WHERE email = ?');
			$statement->execute(array(
				$newPushId,
				$this->getEmail(),
			));

			$result = $statement->fetchAll();

			if ($result) {

				$this->writeLog(__METHOD__, "push id updated to: " . $newPushId);
			} else {

				$this->writeError(__METHOD__, "database update failed!");
			}

		} catch (PDOException $pdoException) {
			$this->writeLog(__METHOD__, $pdoException->getMessage());
			$this->writeLog(__METHOD__, "*** ERROR: sent mail for error: " . $pdoException->getMessage() . " ***");
			die(json_encode(array(
				'error' => $pdoException->getMessage(),
			)));
		}
	} // </ updatePushId()>

	public function get_points() {
		return $this->database_points;
	} // </ get_points()>

	private function check_existence($email, $password) {
		$statement = $this->database->prepare('SELECT * FROM wp_mcba_users WHERE email= ? && password = ?');
		$statement->execute(array(
			$email,
			hash('sha512', $password),
		));

		/*
	     * check for email and
	     * password existence
         */
		$result = $statement->fetchAll();
		if (!$result) {

			$this->writeLog(__METHOD__, "No record found for " . $email);
			die(json_encode(array(
				'result' => "No record found for email: " . $email . ".",
			)));
		} else {

			$this->writeLog(__METHOD__, "Found record in database for " . $email . ".");
		}
	} // </ check_existence()>

	private function check_inputs($scanned_points, $email, $password, $points_on_device) {

		if (strlen($scanned_points) === 0) {
			$error = "missing points argument";
			$this->writeLog(__METHOD__, $error);
			die(json_encode(array(
				'error' => $error,
			)));
		}

		if (strlen($email) === 0) {
			$error = "missing email argument";
			$this->writeLog(__METHOD__, $error);
			die(json_encode(array(
				'error' => $error,
			)));
		}

		if (strlen($password) === 0) {
			$error = "missing password argument";
			$this->writeLog(__METHOD__, $error);
			die(json_encode(array(
				'error' => $error,
			)));
		}

		if (strlen($points_on_device) === 0) {
			$error = "missing argument for points on the device.  needed for sync.";
			$this->writeLog(__METHOD__, $error);
			die(json_encode(array(
				'error' => $error,
			)));
		}

		$this->writeLog(__METHOD__, "inputs are ok.");
	}

	public function writeLog($method, $text_to_log) {
		McbaUtil::writeLog($method, $text_to_log);
	}

	public function writeError($method, $text_to_log) {
		if ($this->DEBUG === TRUE) {
			$this->writeLog($method, "<font color=red><b> *** ERROR: " . $text_to_log . " ***</b></font><br>");
		} else {
			$this->writeLog($method, $text_to_log);
		}
	}

	private function verify_database_sync() {

		$this->writeLog(__METHOD__, "points in rewards object: " . $this->points_on_device);
		$database_points = $this->get_points_from_database();

		if ($database_points < 0) {
			die(json_encode(array(
				'database_points' => 0,
				'error' => "*** ERROR: can not get database points from server. ***",
			)));
		}

		$this->setDatabase_points($database_points);
		$mcbaId = $this->getMcbaId();

		$this->writeLog(__METHOD__, "points from database: " . $database_points);

		if ((int) $this->points_on_device < (int) $database_points) {

			// this happens if there is an email in the database yet the phone is fresh.
			$this->writeLog(__METHOD__, "points on device is smaller than points in database.  \n" .
				"writing correct amount to the device and updating push id...");

			// store() sets scanned points as the total amount on the device
			$this->setScanned_points($database_points);
			$this->store();

			/*
	         * update the total in swift
             */
			die(json_encode(array(
				'database_points' => $this->getDatabase_points(),
				'error' => "", // otherwise "error" is "nil" causing a FATAL Error!
			)));

		} elseif ((int) $this->points_on_device > (int) $database_points) {

			// fail, die!
			$error = "points from database: " . $database_points . " do not equal points on device: " .
			$this->points_on_device;

			$this->writeLog(__METHOD__, "*** ERROR: " . $error . " ***");

			$message = "Points from the database do not equal the points on the device!  ";
			$message .= "\n\nThis could be a robbery in progress.  ";

			$this->writeLog(__METHOD__, "sending email...");
			die(json_encode(array(
				'rewards_action' => "get",
				'result' => $database_points,
				'email' => $this->email,
				'password' => $this->password,
				'scanned_points' => $this->scanned_points,
				'points_on_device' => $this->points_on_device,
				'database_points' => $database_points,
				'error' => $error,
			)));
		} else {

			$this->database_points = $database_points;
			$this->writeLog(__METHOD__, "points from database equal points on device.");
		}
	}

	private function get_points_from_database() {

		global $wpdb;

		$hashed_password = str_replace(array("\r", "\n"), '', hash('sha512', $this->getPassword()));
		$this->writeLog(__METHOD__, "raw password: " . $this->getPassword());
		$this->writeLog(__METHOD__, "hashed pass : " . $hashed_password);

		$this->writeLog(__METHOD__, "attempting to get rewards points for " . $this->email . " and password: " . hash('sha512', $this->password) . "...");
		$statement = $this->database->prepare('SELECT rewards FROM wp_mcba_users WHERE email= ? && password = ?');

		try {

			$statement->execute(array(
				$this->email,
				hash('sha512', $this->password),
			));

		} catch (PDOException $pdoException) {
			McbaUtil::writeLog(__METHOD__, "failed getting points from database.  message: " . $pdoException->getMessage());
		}

		$result = $statement->fetch(PDO::FETCH_OBJ);

		if (!$result) {

			$this->writeLog(__METHOD__, "No result when trying to get rewards amount from database.");
			return 0;

		} else {

			return $result->rewards;

		} // fi(!$result)

	} // end getPointsFromDatabase();

	private function updateDatabasePushID() {

		global $wpdb;

		if (strlen($this->getPushid()) == 0 || strlen($this->getEmail()) == 0 || strlen($this->getPassword()) == 0) {

			$error = "invalid input: pushid: " . $this->getPushid() .
			" email:  " . $this->getEmail() .
			" password: " . $this->getPassword();
			$this->writeLog(__METHOD__, "ERROR: *** " . $error . " ***");
		}

		$this->writeLog(__METHOD__, "attempting to update push id attached to " . $this->email . "...");
		$statement = $this->database->prepare('UPDATE wp_mcba_users SET pushid = ? WHERE email = ? AND password = ?');
		$statement->execute(array(
			$this->getPushid(),
			$this->email,
			hash('sha12', $this->password),
		));

		$result = $statement->fetch(PDO::FETCH_OBJ);

		if (!$result) {
			McbaUtil::writeLog(__METHOD__, "can not get push id for email: " . $this->getEmail() . "!");
		} else {
			return $result->pushid;
		}

	}

	private function getMcbaId() {

		global $wpdb;

		$this->writeLog(__METHOD__, "attempting to get mcba id for " . $this->email . "...");
		$statement = $this->database->prepare('SELECT mcba_id FROM wp_mcba');
		$statement->execute();

		$result = $statement->fetch(PDO::FETCH_OBJ);

		if (!$result) {

			return 0;

		} else {

			// called from this->verify_database_sync()...
			return $result->mcba_id;

		} // fi
	}

	private function getCurrentPushId() {

		$this->writeLog(__METHOD__, "attempting to get push id for " . $this->email . "...");
		$statement = $this->database->prepare('SELECT pushid FROM wp_mcba_users WHERE email= ? && password = ?');
		$statement->execute(array(
			$this->getEmail(),
			hash('sha512', $this->getPassword()),
		));
		$statement->execute();

		$result = $statement->fetch(PDO::FETCH_OBJ);

		if (!$result) {

			return 0;

		} else {

			return $result->pushid;

		} // fi
	} // end getCurrentPushId()

	/////////////////////////////////////////// getters/setters ///////////////////////////////////////////////////////
	public function getDEBUG() {
		return $this->DEBUG;
	}
	public function setDEBUG($DEBUG) {
		$this->DEBUG = $DEBUG;
	}
	public function getEmail() {
		return $this->email;
	}
	public function setEmail($email) {
		$this->email = $email;
	}
	public function getPassword() {
		return $this->password;
	}
	public function getScanned_points() {
		return $this->scanned_points;
	}
	public function setScanned_points($scanned_points) {
		$this->scanned_points = $scanned_points;
	}
	public function setPassword($password) {
		$this->password = $password;
	}
	public function getPoints_on_device() {
		return $this->points_on_device;
	}
	public function setPoints_on_device($points_on_device) {
		$this->points_on_device = $points_on_device;
	}
	public function getDatabase_points() {
		return $this->database_points;
	}
	public function setDatabase_points($database_points) {
		$this->database_points = $database_points;
	}
	public function getPushid() {
		return $this->pushid;
	}
	public function getOld_push_id() {
		return $this->old_push_id;
	}
	public function getFirst_name() {
		return $this->first_name;
	}
	public function getLast_name() {
		return $this->last_name;
	}
	public function getDevice() {
		return $this->device;
	}
	public function setPushid($pushid) {
		$this->pushid = $pushid;
	}
	public function setOld_push_id($old_push_id) {
		$this->old_push_id = $old_push_id;
	}
	public function setFirst_name($first_name) {
		$this->first_name = $first_name;
	}
	public function setLast_name($last_name) {
		$this->last_name = $last_name;
	}
	public function setDevice($device) {
		$this->device = $device;
	}
	public function getDatabase() {
		return $this->database;
	}
	public function setDatabase($database) {
		$this->database = $database;
	}
	public function getCurrent_push_id() {
		return $this->current_push_id;
	}
	public function setCurrent_push_id($current_push_id) {
		$this->current_push_id = $current_push_id;
	}
	/////////////////////////////////////////// </ getters/setters> ///////////////////////////////////////////////////

	public function __destruct() {}
} // </ class Rewards>
?>