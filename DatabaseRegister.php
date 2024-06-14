<?php
require_once( 'Util.php'            );
require_once( 'WriteLog.php'        );
require_once( 'GetMcbaRewards.php'      );
require_once( 'McbaChatMessage.php' );
require_once dirname(__FILE__) . "/monitored-object-php/monitored-object/LoggerFactory.php";

function writeLog( $text ) {
    file_put_contents( dirname( __FILE__) . "/register.log", date( "h:i:sa" ) . ": " .  $text . "\n", FILE_APPEND | LOCK_EX );
}
class DatabaseRegister {

	private $post 			= null;
	private $database 		= null;
	private $action 		= "";
	private $pushid 		= "";
	private $email 			= "";
	private $first_name 	= "";
	private $last_name 		= "";
	private $device 		= "";
	private $old_push_id 	= "";
	private $mcba_id 		= "";
	private $create_sql 	= "";
	private $rewards 		= 0;
	private $password 		= ""; // should always be in english (not encrypted)
	private $statement; /*  = not set. */
	private $DEBUG 			= false;
	private $stayAlive 		= false;
	private $logger         = null;
	private $tried_insert	= false;
	private $prefix         = "";
	private $user_id        = "";
	private $update_logger;

	public function __construct( $postArg, $databaseArg ) {
		$this->post 	= $postArg;
		$this->database	= $databaseArg;
		$this->prefix 	= "wp_";
		$this->update_logger = LoggerFactory::getLogger( "DatabaseRegisterLog" );
        $this->update_logger->logUpdate( "DatabaseRegisterLog created." );

		/*
		 * initialize variables from $postArg
		 */
		$this->action 		= (isset ( $postArg[ 'action' ])) 		? $postArg[ 'action' ] : "";
		$this->first_name	= (isset ( $postArg[ 'first_name' ] ))	? $postArg[ 'first_name' ] : "";
		$this->last_name 	= (isset ( $postArg[ 'last_name' ])) 	? $postArg[ 'last_name' ] : "";
		$this->rewards 		= (isset ( $postArg[ 'rewards' ])) 		? $postArg[ 'rewards' ] : "";
		$this->device 		= (isset ( $postArg[ 'device' ])) 		? $postArg[ 'device' ] : "";
		$this->email 		= (isset ( $postArg[ 'email' ])) 		? $postArg[ 'email' ] : "";
		$this->password 	= (isset ( $postArg[ 'password' ])) 	? $postArg[ 'password' ] : "";
		$this->mcba_id 		= (isset ( $postArg[ 'mcba_id' ])) 		? $postArg[ 'mcba_id' ] : "";
		$this->pushid 		= (isset ( $postArg[ 'pushid' ])) 		? $postArg[ 'pushid' ] : "";
		$this->old_push_id 	= (isset ( $postArg[ 'old_push_id' ] ))	? $postArg[ 'old_push_id' ] : "";

		writeLog ( "variables passed: " .
				$this->prefix . 	",\n" .
				$this->action . 	",\n" .
				$this->first_name .	",\n" .
				$this->last_name . 	",\n" .
				$this->rewards . 	",\n" .
				$this->device . 	",\n" .
				$this->email . 		",\n" .
				$this->password . 	",\n" .
				$this->mcba_id .	",\n" .
				$this->pushid . 	",\n" .
				$this->old_push_id );

		/** create the mcba_users table if it doesn't exist */
		$sql = "CREATE TABLE IF NOT EXISTS " . $this->prefix . "mcba_users (ID INT( 11 ) AUTO_INCREMENT PRIMARY KEY, `first_name` VARCHAR(64) NOT NULL, `last_name` VARCHAR(64) NOT NULL, `rewards` INT(6) NOT NULL, `device` text NOT NULL, `email` VARCHAR(64) NOT NULL, `uid` text NOT NULL,	`pushid` text NOT NULL);";
		$this->create_sql = "executing sql: $sql from inside the constructor of the DatabaseRegister class... ";
		if ( $this->database ) {	$this->database->exec( $sql ); }} // </ __construct>

    
    public function verifyPassword( $email, $password_to_verify ) {
        $this->update_logger->logUpdate( "password to verify: " . $password_to_verify );
        $this->update_logger->logUpdate( "getting password with email: " . $email );
        $sql = "SELECT `password` FROM ". $this->prefix. "mcba_users WHERE `email` = '$email';";
        $statement = $this->database->prepare( "SELECT password FROM " . $this->prefix . "mcba_users WHERE email = ?" );
        $statement->execute( array( $email ));
		$result = $statement->fetchAll();
        $this->update_logger->logUpdate( "result_zero_password is: " . $result[ 0 ][ 'password' ] );
        $password_in_database = $result[ 0 ][ 'password' ];
        $this->update_logger->logUpdate( "password_to_verify: " . $password_to_verify );
        $this->update_logger->logUpdate( "finished getting password with email: " . $email );
        $this->update_logger->logUpdate( "sha12_password_to_verify:   " . hash( 'sha512', $password_to_verify ) . "." );
        $this->update_logger->logUpdate( "sha12_database_password: " . $password_in_database . "." );
        
        if ( hash( 'sha512', $password_to_verify ) == $password_in_database ) {
                $this->update_logger->logUpdate( "Passwords match!" );
                echo json_encode( array( "password_verified" => true ));
        } else {
            $this->update_logger->logUpdate( "Passwords do not match!" );
            $error = "password in database does not match what was passed in from the form.";
            $this->writeError( __METHOD__, $error);
            die ( json_encode( array( 'error' => $error, "password_verified" => false )));
        }
    } // </ verifyPassword()>
    
	public function register() {
		$this->update_logger->logUpdate( "register function called... action: ". $this->action );

		/*
		 * update user
		 */
		if ( $this->action == 'update_user' || $this->action == 'user' || $this->action == 'register_mcba' ) {
			$this->update_logger->logUpdate( "updating user from inside .../plugins  .../DatabaseRegister.php... " );
			return $this->updateUser();

		/*
		 * login
		 */
		} elseif ( $this->action == 'login') {
			$this->update_logger->logUpdate( "logging in... " );
			$this->login();

		/*
		 * get rewards
		 */
		} elseif ( $this->action == 'get_rewards') {
			$this->update_logger->logUpdate( "getting rewards... " );
			$this->getRewards( $this->email );

		/*
		 * swap push ids
		 */
		} elseif ( $this->action == 'swapPushIds') {
			$this->update_logger->logUpdate( "updating with new push id... " );
			$this->updatePushIds();
		}

	} // </ register()>

	private function updatePushIds() {

		if(strlen( $this->getPushid()) == 0) {
			$error = "invalid input: pushid: "	. $this->getPushid();
			$this->update_logger->logUpdate( "ERROR: *** " 	. $error . " ***");
			die(json_encode(array('error' => "ERROR: *** " 	. $error . " ***")));
		}

		try {

			$this->update_logger->logUpdate( "swapping " . $this->old_push_id . " with " . $this->pushid);
			$statement = $this->database->prepare('UPDATE ' . $this->prefix . 'mcba_users SET first_name = ?, last_name = ?, rewards = ?, device = ?, email = ?, uid = ?, pushid = ?  WHERE pushid = ?' );
			$statement->execute (array(
					$this->first_name,
					$this->last_name,
					$this->rewards,
					$this->device,
					$this->email,
					$this->user_id,
					$this->pushid,
					$this->old_push_id
			));

			die (json_encode(array("result" => "success updating push id")));

		}catch(PDOException $pdoException) {
			writeLog ( $pdoException->getMessage () . '\r\n' );
			die (json_encode(array('error' => $pdoException->getMessage())));
		}
	}

	private function updateUser() {

		$result = null; // keep in outer scope

		if(strlen( $this->getOld_push_id()) == 0) {
			$this->update_logger->logUpdate( "no old push id!  old push id: "	. $this->getOld_push_id());
			$this->update_logger->logUpdate( "setting result to false.");
			$result = false;
		} else {
			$this->update_logger->logUpdate( "searching database for old push id: " . $this->old_push_id);
			$statement = $this->database->prepare( "SELECT * FROM " . $this->prefix . "mcba_users WHERE pushid = ?" );
			$this->update_logger->logUpdate( "this->old_push_id: " . $this->old_push_id);
			$statement->execute (array( $this->old_push_id));
			$result = $statement->fetchAll();
			$this->update_logger->logUpdate( "got result, the count is: ". count($result));
		}

		if ( count( $result ) == 0 || $result == false ) {
			$this->update_logger->logUpdate( "old push id is not available.  This is probably a new user...  add all of the data." );
			try {
                $this->update_logger->logUpdate( "inserting new user into database because of no results from finding the old push id... " ); 
                $this->update_logger->logUpdate( "device: " . $this->device );
                $this->update_logger->logUpdate( "email: " . $this->email   );
                $this->update_logger->logUpdate( "pushid: " . $this->pushid );
				$statement = $this->database->prepare( 'INSERT INTO ' . $this->prefix . 'mcba_users (first_name, last_name, rewards, device, email, password, pushid) VALUES(?, ?, ?, ?, ?, ?, ?)' );
				$statement->execute ( array(
						$this->first_name,
						$this->last_name,
						$this->rewards,
						$this->device,
						$this->email,
						hash( 'sha512', $this->password ),
						$this->pushid
				));

                $this->update_logger->logUpdate( "calling verify token to make sure the token is fresh..." );
                $this->verify_token();

				if ( !$this->getStayAlive()) {
				    $cid = $this->verify_conversation_id();
					$this->update_logger->logUpdate( "json die with success and update finished." );
					die( json_encode ( array("error"  => "", 
                                            "result" => "success",
                                            "conversation_id" => $cid )));
				} else {
				    $this->verify_conversation_id();
					$this->update_logger->logUpdate( "returning 1 from update()...");
					return 1; }

			} catch ( PDOException $pdoException ) {
                $message = $pdoException->getMessage();
				writeLog ( $message . '\r\n' );

                if ( strpos( $message, 'Duplicate entry' ) !== false ) { 
                    $this->update_logger->logUpdate( "This is a duplicate entry error, checking the email address... ");
                    // if $error contains this email address...
                    if ( strpos( $message, $this->email ) !== false ) {
                        $this->update_logger->logUpdate( "This is a duplicate entry error for email: $this->email.  updating push id...");
                        $this->updateUserInformationUsingEmail();
                        return;
                    }
                } else {
                    $this->update_logger->logUpdate( "ERROR: *** unknown error. ***");
                    die( json_encode( array('error' => "ERROR: *** " 	. $message . " ***" )));
                }

				if ( !$this->getStayAlive()) {
                    // $this->update_logger->logUpdate( "ERROR: " . $message );
					die ( json_encode( array( 'error' => $message )));
				} else {
					return 0; }}
		} else {
			if( strlen( $this->getEmail()) == 0 ) {
				$error = "invalid input: email: "	. $this->getEmail();
				$this->update_logger->logUpdate( "ERROR: *** " 	. $error . " ***" );
				die(json_encode( array( 'error' => "ERROR: *** " 	. $error . " ***" ))); }

			$this->update_logger->logUpdate( "first name: " . $this->getFirst_name());
			$this->update_logger->logUpdate( "last name: " . $this->getLast_name());
			$this->update_logger->logUpdate( "rewards: " . $this->getRewards());
			$this->update_logger->logUpdate( "device: " . $this->device	);
			$this->update_logger->logUpdate( "email: " . $this->getEmail());
			$this->update_logger->logUpdate( "pushid: " . $this->getPushid());
			$this->update_logger->logUpdate( "email: " . $this->getEmail());

            $update_sql = 'UPDATE ' . $this->prefix . 'mcba_users SET first_name = ?, last_name = ?, rewards = ?, device = ?, email = ?, uid = ?, pushid = ?  WHERE email = ?';
            writeLog( "update sql: ". $update_sql);
            if ( strlen( $this->rewards ) == 0 ) { $this->rewards = 0;}
			$statement = $this->database->prepare ( $update_sql );
			$statement->execute (array(
					$this->first_name,
					$this->last_name,
					$this->rewards,
					$this->device,
					$this->email,
					$this->user_id,
					$this->pushid,
					$this->email
			));

			$this->update_logger->logUpdate( "finished with statement execute.");
			
			/*
			 * verify conversation id.  creates one if it doesn't exist
			 */
			$this->verify_conversation_id();

			if (!$this->getStayAlive()) {
				die (json_encode(array("result" => "successful update")));
			} else {
				return 0;
			}
		}
		$statement = null;
		$this->database = null;

	} // </ updateUser();>

	/////////////////////////////////////////////// login /////////////////////////////////////////////////////////////

	/**
	 * case 1: database email exists	push id matches post	Update all using this email. (i don't think we ever get here; user logs in)
	 *
	 * case 2: database email exists    push id !match post		Update all using this email, delete the old record using id from database
	 *
	 * find old id and use that row  ... wouldn't this be where the email is?
	 *
	 * case 3: database email !exist	match doesn't matter    Update all using this push id.
	 *
	 * case 4: database email !exist 	push id !match post i don't think we ever get here; how the hell would this scenario happen?
	 * 											                you can't get a unique record missing a valid push id AND an email.
	 * 															ERROR trap case 4.
	 */
	
	private function verify_conversation_id() {
	    
	    /** make sure that there is at least one row in the conversation table for ask the expert to work. */
        $this->update_logger->logUpdate( "calling MCBAChatMessage constructor DatabaseRegister.php ... " );
        $chatMessage = new McbaChatMessage( "", "", "", "", "", "", "", "","", "" );
        $chatMessage->setUser_email( $this->email );
        $this->update_logger->logUpdate( "Getting conversation id from database from within DatabaseRegister.php... " );
        $conversation_id = $chatMessage->getConversationIdFromDatabase();
        $this->update_logger->logUpdate( "inside DatabaseRegister::verify_conversation_id()... " );
	    $this->update_logger->logUpdate( "got conversation id, it is: " . $conversation_id );
	    
	    /*
	     * cleanup
	     */
	    $statement = null;
	    $this->database = null;
        return $conversation_id;
	}

    private function verify_token() {
        $email = $this->getEmail();
        // check if email is in database
        $statement = $this->database->prepare ( 'SELECT * FROM ' . $this->prefix .'mcba_users WHERE email =?' );
        $statement->execute ( array( $email ));
        
        $result = $statement->fetchAll();
        $this->update_logger->logUpdate( "result count: " . count( $result ));
        // print everything from result
        
        foreach( $result as $row ) {
            $this->update_logger->logUpdate( "checking row for push id..." );
            $push_id = $row[ 'pushid' ];
            if ( strlen( $push_id ) > 0 && $push_id != $this->getPushid()) {
                // $this->update_logger->logUpdate( "push id's don't match.  updating push id..." );
                $this->updateUserInformationUsingEmail();
                return;
            } 
            $this->update_logger->logUpdate( "inside for each checking row... " );  
        }
    }
	
	private function login() {
		$this->update_logger->logUpdate( "fetching information from database using email: " . $this->getEmail());
		$fetch_using_email_result = $this->populateInformationUsingEmail();

		if ( $this->statement->rowCount() <= 0 ) {
			$this->update_logger->logUpdate( "no email in database.  searching for push id..." );
			$fetch_using_push_id_result = $this->populateInformationUsingPushId();
			if( $this->statement->rowCount() <= 0 ) {

				if ( !$this->tried_insert ) {
					$this->update_logger->logUpdate( "I don't have any data, trying to insert user...");
					$this->tried_insert = true;
					$this->updateUser();
				}

				$error = "*** ERROR: no way to get here without id!  check logic. ***";
				$this->writeError( __METHOD__, $error);
				die ( json_encode( array( 'error' => $error)));

			} else {

				$this->update_logger->logUpdate( "found push id." );

				/*
				 * delete this row!
				 */
				$this->deleteId( $this->getPushid());

				$this->update_logger->logUpdate( "use known information to populate a new row.");
				$this->insertNewRow();
			}

		} else {

			$this->update_logger->logUpdate( "There is an email in the database, so update push id if needed...");

			/* die if passwords don't match */
			$this->checkPasswords( $fetch_using_email_result[ "password" ] );

			$this->update_logger->logUpdate( "this->pushid: " . $this->pushid . " database pushid: " . $fetch_using_email_result[ "pushid" ]);
			$this->update_logger->logUpdate( "if the above ids are not equal, delete and repop.  otherwise just leave this login script" );
			if ( $this->getPushid() == $fetch_using_email_result[ "pushid" ]) {
				$this->update_logger->logUpdate( "push ids match.  no update needed." );
				$this->update_logger->logUpdate( "dying with result => successful login message written by the copilot..." );
                die ( json_encode( array( 'result' => 'successful login')));
			} else {	/** delete this row! */
				$this->deleteId( $this->getPushid());
				$this->update_logger->logUpdate( "updating push id for email: " . $this->getEmail() . "..." );
				$this->updateUserInformationUsingEmail(); }
		}
	} // </ login()>
	/////////////////////////////////////////////////// </ login> /////////////////////////////////////////////////////

	private function populateInformationUsingEmail() {

		try {

			$this->update_logger->logUpdate( "populating information using email...");
			$this->statement = $this->database->prepare ('SELECT * FROM ' . $this->prefix . 'mcba_users WHERE email= ?');
			$this->statement->execute(array( $this->email));

		}catch (PDOException $e ) {
			$this->writeError( __METHOD__, $e->getMessage ());
			die (json_encode(array('error' => $e->getMessage ())));
		}

		$this->update_logger->logUpdate( "returning this->statement->fetch()...");
		return $this->statement->fetch();
	}

	private function populateInformationUsingPushId() {
		try {
			$this->update_logger->logUpdate( "populating information using push id...");
			$this->statement = $this->database->prepare ('SELECT * FROM ' . $this->prefix . 'mcba_users WHERE pushid= ?');
			$this->statement->execute(array( $this->pushid));

		}catch (PDOException $e ) {
			$this->writeError( __METHOD__, $e->getMessage ());
			die (json_encode(array('error' => $e->getMessage ())));
		}

		$this->update_logger->logUpdate( "returning this->statement->fetch()...");
		return $this->statement->fetch();
	}

	private function populateInformationUsingOldId() {
		try {
			$this->update_logger->logUpdate( "populating information using email...");
			$this->statement = $this->database->prepare ('SELECT * FROM ' . $this->prefix . 'mcba_users WHERE pushid= ?');
			$this->statement->execute(array( $this->old_push_id));

		}catch (PDOException $e ) {
			$this->writeError( __METHOD__, $e->getMessage ());
			die (json_encode(array('error' => $e->getMessage ())));
		}

		$this->update_logger->logUpdate( "returning this->statement->fetch()...");
		return $this->statement->fetch();
	}

	private function getRewards() {
		try {

			$statement = $this->database->prepare ( 'SELECT rewards FROM ' . $this->prefix . 'mcba_users WHERE email= ?' );
			$statement->execute(array ($this->email));
			$result = $statement->fetch ();
			$rewards = $result ['rewards'];
			die (json_encode(array("result" => "success reading rewards", "rewards" => $rewards)));
		} catch ( PDOException $e ) {

			$this->writeError(__METHOD__, $e->getMessage());
			die (json_encode(array('error' => $e->getMessage())));

		} // </ try>

	} // </ getRewards(); >

	public function writeLog($method, $text_to_log) {
// 		file_put_contents ( dirname ( __FILE__ ) . "/register.log", date("g:i:s ") . ":  " . $method . "()   " . $text_to_log . "\r\n", FILE_APPEND | LOCK_EX );
// 		if ($this->getDEBUG() === TRUE) {
// 			echo date("g:i:s ") . ":  " . $method . "()   " . $text_to_log . " <br>";
// 		}
		Util::writeLog($method, $text_to_log);
	}

	private function updateUserInformationUsingPushId() {

		if(strlen( $this->getPushid()) == 0) {
			$error = "invalid input: pushid: "	. $this->getPushid();
            // if the
            if ( strpos( $error, 'Duplicate entry' ) !== false ) { 
                $this->update_logger->logUpdate( "This is a duplicate entry error, checking the email address... ");
                // if $error contains this email address...
                if ( strpos( $error, $this->email ) !== false ) {
                    $this->update_logger->logUpdate( "This is a duplicate entry error for email: $this->email.  updating push id...");
                    $this->updateUserInformationUsingEmail();
                    return;
                }
            } else {
                $this->update_logger->logUpdate( "ERROR: *** unknown error. ***");
                die( json_encode( array('error' => "ERROR: *** " 	. $error . " ***" )));
            }
		}

		$this->update_logger->logUpdate( "Updating user information using this push id...");
		try {
			$statement = $this->database->prepare ( 'UPDATE ' . $this->prefix .
					'mcba_users SET email= ?, first_name= ?, last_name= ?, password= ?, rewards= ? WHERE pushid = ?' );

			$statement->execute (array(
					$this->email,
					$this->first_name,
					$this->last_name,
					hash('sha512', $this->password),
					$this->rewards,
					$this->getPushid()
			));

			die (json_encode(array(
					'login' => 'success, set via push id',
					'error' => ''
			)));

		} catch ( PDOException $e ) {
			$this->writeError( __METHOD__, $e->getMessage());
			die ( json_encode ( array (
					'error' => $e->getMessage()
			)));
		}
        // UPDATE wp_mcba_users 
        // SET email = '{$this->email}', 
        //     first_name = '{$this->first_name}', 
        //     last_name = '{$this->last_name}', 
        //     password = '" . hash('sha512', $this->password) . "', 
        //     rewards = '{$this->rewards}' 
        // WHERE pushid = '{$this->getPushid()}'
	}

	private function updateUserInformationUsingEmail() {
		if( strlen( $this->getEmail()) == 0) {
			$error = "invalid input: email: "	. $this->getEmail();
			$this->update_logger->logUpdate( "ERROR: *** " 	. $error . " ***");
			die( json_encode( array( 'error' => "ERROR: *** " 	. $error . " ***"))); }

		if( $this->pushid !== null ) {
			$this->update_logger->logUpdate( "updating user information using email: " . $this->email );
			try {
				$statement = $this->database->prepare ( 'UPDATE ' . $this->prefix .
					'mcba_users SET first_name = ?, last_name = ?, pushid = ?, device = ?  WHERE email = ?' );

				if ( $statement->execute( array( $this->first_name, $this->last_name, $this->pushid, $this->device, $this->email ))) {
					$this->update_logger->logUpdate( "UPDATE method ran successfully." );
				} else {
					$this->writeError( __METHOD__, __METHOD__, "statement UPDATE method failed!" );
					die( json_encode( array( 'error' => "UPDATE method failed!" )));
				}
			} catch( PDOException $e ) {
				$this->writeError( __METHOD__, $e->getMessage ());
				die ( json_encode(array('error' => $e->getMessage ())));
			}
		} else {
			$this->writeError( __METHOD__, __METHOD__, "push id passed in from form is null!  exiting..." );
			die( json_encode( array( 'error' => "*** ERROR: \$POST[pushid] is null! ***" )));
		}
	}

	public function writeError($method, $text_to_log) {
		if( $this->DEBUG === true ) {
			$this->update_logger->logUpdate($method, "<font color=red><b> *** ERROR: " . $text_to_log . " ***</b></font><br>");
		} else {
			$this->update_logger->logUpdate($method, $text_to_log);
		}
	}

	private function checkPasswords( $database_password ) {
	    $this->update_logger->logUpdate( "sha12_this_password:   " . hash( 'sha512', $this->password ) . "." );
	    $this->update_logger->logUpdate( "the_database_password: " . $database_password . "." );
	    
		if ( hash( 'sha512', $this->password ) === $database_password ) {
				$this->update_logger->logUpdate( "Passwords match!" );
		} else {

			$error = "password in database does not match what was passed in from the form.";
			$this->writeError( __METHOD__, __METHOD__, $error );
			die ( json_encode( array( 'error' => $error )));
		}
	} // </ checkpasswords()>

	private function updateDeviceId($old_device, $new_device ) {

		/*
		 * get the id from the passed in form and
		 * write it to the database in the same row
		 * that has the correct email
		 *
		 * maybe do the write later?
		 */

		if($old_device !== $new_device ) {

			$this->update_logger->logUpdate( "old device: " . $old_device . " does not equal new device: " . $new_device .
					"<br>Writing new device into database into row with email " . $this->email);
		}

		// TODO:
		// check the device id here to see if it matches.  if it doesn't
		// and the device id in the post is NOT blank, write the one from
		// post into the database

		// if post is different, write it.  if either is blank, complain!


	}

	private function deleteId( $idToDelete ) {
		$this->update_logger->logUpdate( "deleting id: " . $idToDelete );
		try {
			$sql = 'DELETE from ' . $this->prefix . 'mcba_users WHERE pushid = ?';
			writeLog( "calling delete using sql: " . $sql);
			$statement = $this->database->prepare ($sql);
			$statement->execute(array($idToDelete ));
			$this->update_logger->logUpdate( "successfully deleted id: " . $this->getPushid());
			return;

		} catch( PDOException $e ) {
			$this->writeError( __METHOD__, $e->getMessage ());
			die ( json_encode(array('error' => $e->getMessage ()))); }}

	private function insertNewRow() {

        
	    $this->update_logger->logUpdate( "called insertNewRow()...");
	    $this->update_logger->logUpdate( "first name: " . $this->first_name );
	    $this->update_logger->logUpdate( "last name: "  . $this->last_name );
	    $this->update_logger->logUpdate( "rewards: "    . $this->rewards);
	    $this->update_logger->logUpdate( "device: "     . $this->device );
	    $this->update_logger->logUpdate( "email: "      . $this->email);
	    $this->update_logger->logUpdate( "push_id: "    . $this->pushid);
	    
		try {
			$statement = $this->database->prepare( 'INSERT INTO ' . $this->prefix . 'mcba_users (first_name, last_name, rewards, device, email, pushid, password) VALUES(?, ?, ?, ?, ?, ?, ?)' );
			$statement->execute (array(
					$this->first_name,
					$this->last_name,
					$this->rewards,
					$this->device,
					$this->email,
					$this->pushid,
					hash('sha512', $this->password )));

		} catch( PDOException $pdoException ) {
			writeLog ( $pdoException->getMessage () . '\r\n');
				die ( json_encode( array( 'error' => $pdoException->getMessage()))); }

		$this->update_logger->logUpdate( "new row inserted.  json die with successful update.");
		die(json_encode (array("error" 	=> "",
							   "result"	=> "success",
				               "database_points" => 0 ))); // added oct 25, 2018  swift code crashes if this is nil (null) -EG
	} // end insertNewRow()

	/////////////////////////////////// getters / setters  ////////////////////////////////////////////////////////////
	public function getPost() {	       return $this->post;}
	public function setPost(           $post ) { $this->post = $post;}
	public function getDEBUG() {       return $this->DEBUG;}
	public function setDEBUG(          $DEBUG ) { $this->DEBUG = $DEBUG;}
	public function getAction() {      return $this->action;}
	public function setAction(         $action ) { $this->action = $action;	}
	public function getPushid() {      return $this->pushid;}
	public function getOld_push_id() { return $this->old_push_id;}
	public function setPushid(         $pushid ) { $this->pushid = $pushid;}
	public function setOld_push_id(    $old_push_id ) {	$this->old_push_id = $old_push_id;}
	public function getMcba_id() {	   return $this->mcba_id;}
	public function setMcba_id(        $mcba_id) { $this->mcba_id = $mcba_id;}
	public function getEmail() {       return $this->email;}
	public function getStayAlive() {   return $this->stayAlive;}
	public function setStayAlive(      $stayAlive ) { $this->stayAlive = $stayAlive;}
	public function setEmail(          $email ) { $this->email = $email;}
    public function getFirst_name() {  return $this->first_name;}
	public function getLast_name() {   return $this->last_name;}
	public function setFirst_name(     $first_name ) { $this->first_name = $first_name;}
	public function setLast_name(      $last_name ) {	 $this->last_name = $last_name;}
	///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
} // end class DatabaseRegister;


?>